Build a production-ready SaaS web app called "ReadmeAI" — an AI-powered README generator for developers.

---

## Tech Stack
- React + Vite + TypeScript (frontend)
- Tailwind CSS (styling)
- Clerk (authentication)
- Stripe (payments)
- Google Gemini API — gemini-2.0-flash (AI generation)
- MongoDB Atlas + Mongoose (database)
- Express.js backend (separate /server folder, runs on port 3001)
- Vercel (frontend deployment), Railway or Render (backend deployment)

---

## MongoDB Schema

### User Model (users collection)
{
  clerkId: String (required, unique),  // Clerk user ID
  email: String (required),
  plan: String (enum: ['free', 'pro'], default: 'free'),
  generationCount: Number (default: 0),
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  createdAt: Date (default: Date.now)
}

### Generation Model (generations collection)
{
  userId: String (required),  // Clerk user ID
  projectName: String,
  description: String,
  techStack: String,
  templateType: String,
  createdAt: Date (default: Date.now)
}

---

## Backend (Express.js — /server)

### File structure:
/server
  index.ts               — Express app entry point, connects to MongoDB
  /routes
    generate.ts          — POST /api/generate
    checkout.ts          — POST /api/create-checkout-session
    webhook.ts           — POST /api/stripe/webhook
    user.ts              — POST /api/user/sync, GET /api/user/:clerkId
  /models
    User.ts              — Mongoose User model
    Generation.ts        — Mongoose Generation model
  /middleware
    requireAuth.ts       — Validates Clerk session token from Authorization header
  /lib
    gemini.ts            — Gemini API call logic
    stripe.ts            — Stripe client initialization

### API Routes (detailed):

**POST /api/user/sync**
- Called on every sign-in from the frontend (via Clerk's onSignIn hook)
- Body: { clerkId, email }
- Logic: upsert — if user doesn't exist, create with default free plan. If exists, return existing user.
- Response: { user }

**GET /api/user/:clerkId**
- Fetch user's plan and generationCount
- Protected by requireAuth middleware
- Response: { plan, generationCount }

**POST /api/generate**
- Protected by requireAuth middleware
- Body: { clerkId, projectName, description, techStack, templateType, githubUrl? }
- Logic:
  1. Fetch user from MongoDB by clerkId
  2. If user.plan === 'free' and user.generationCount >= 3, return 403 { error: 'limit_reached' }
  3. Build Gemini prompt (see Prompt Engineering section below)
  4. Call Gemini API with gemini-2.0-flash model
  5. On success:
     - Increment user.generationCount by 1 in MongoDB
     - Save new Generation document to MongoDB
     - Return { readme: generatedMarkdown }
  6. On Gemini error: return 500 { error: 'generation_failed' }

**POST /api/create-checkout-session**
- Protected by requireAuth middleware
- Body: { clerkId, email }
- Logic:
  1. Find or create Stripe customer by email
  2. Save stripeCustomerId to user in MongoDB
  3. Create Stripe Checkout Session (mode: 'subscription', price: your Pro price ID)
  4. Return { url: session.url }

**POST /api/stripe/webhook**
- NOT protected by requireAuth (Stripe calls this directly)
- Must use express.raw() middleware for this route only (critical for Stripe signature verification)
- Handle these Stripe events:
  - checkout.session.completed → update user plan to 'pro', save stripeSubscriptionId
  - customer.subscription.deleted → downgrade user plan back to 'free'
- Verify webhook signature using STRIPE_WEBHOOK_SECRET

### requireAuth middleware:
- Extract Bearer token from Authorization header
- Verify using Clerk's backend SDK: clerkClient.verifyToken(token)
- If invalid: return 401 { error: 'Unauthorized' }
- If valid: attach clerkId to req and call next()

---

## Prompt Engineering (Gemini)

### System prompt:
"You are an expert technical writer and open source developer. Your job is to generate professional, comprehensive, and visually appealing GitHub README.md files in valid Markdown. 

Your READMEs must always include:
1. A badge row at the top (license, version, build status — infer reasonable values)
2. A concise but compelling project description (2-3 sentences)
3. A '## Features' section with 4-6 bullet points highlighting key capabilities
4. A '## Tech Stack' section listing technologies used
5. A '## Prerequisites' section listing requirements (Node version, etc.)
6. A '## Installation' section with numbered steps and code blocks using bash syntax highlighting
7. A '## Usage' section with at least one realistic code example using appropriate syntax highlighting
8. A '## Contributing' section with a brief contribution guide
9. A '## License' section (default to MIT unless specified)

Rules:
- Use proper Markdown syntax throughout
- All code blocks must have a language specifier (bash, javascript, python, etc.)
- Keep tone professional but approachable
- Tailor complexity and depth to the project type (CLI tools get more usage examples, npm packages get API references, etc.)
- Never include placeholder text like '[Your Name]' — make reasonable inferences
- Output only the raw Markdown, no explanation, no preamble, no backtick code fence wrapping the entire output"

### User prompt (construct dynamically):
"Generate a README.md for the following project:

Project Name: {projectName}
Description: {description}
Tech Stack: {techStack}
Template Type: {templateType}
GitHub URL: {githubUrl or 'not provided'}

Additional instructions based on template type:
- If 'CLI Tool': include a detailed flags/commands reference table in the Usage section
- If 'npm Package': include an API reference section with function signatures
- If 'Monorepo': include a packages/apps directory tree and per-package setup instructions
- If 'Standard': follow the default structure above

Generate the complete README.md now."

---

## Frontend (React + Vite — /src)

### File structure:
/src
  /components
    Navbar.tsx
    Hero.tsx
    HowItWorks.tsx
    Pricing.tsx
    GenerateForm.tsx
    MarkdownPreview.tsx
    UpgradeModal.tsx
    GenerationCounter.tsx
  /pages
    LandingPage.tsx
    GeneratePage.tsx
  /hooks
    useUser.ts        — fetches user plan + generationCount from backend
    useGenerate.ts    — handles generation API call + state
  /lib
    api.ts            — all fetch calls to backend (baseURL from env var)
  App.tsx
  main.tsx

### Landing Page (/)
- Navbar: logo left, "Sign In" and "Get Started" buttons right (Clerk)
- Hero: large headline "Ship with a README that doesn't embarrass you", subheadline "Describe your project, get a polished README in seconds. No templates, no manual formatting.", two CTAs: "Generate for free" (primary) and "See an example" (secondary, scrolls to demo)
- Demo section: show a static before/after — left side a bare project description, right side a beautiful generated README in a code-styled card
- How It Works: 3 steps with icons — "1. Describe your project", "2. AI generates your README", "3. Copy and ship"
- Pricing: two cards side by side
  - Free: $0, 3 generations, standard templates, Copy & download
  - Pro: $7/mo, unlimited generations, all templates (CLI, npm, Monorepo), priority generation speed, "Most Popular" badge
- Footer: minimal — logo, copyright, GitHub link

### Generate Page (/generate) — protected, redirect to / if not signed in
Layout: two-column (50/50 split on desktop, stacked on mobile)

Left panel — Input form:
- "Project Name" — text input, placeholder "e.g. my-awesome-cli"
- "Project Description" — textarea (4 rows), placeholder "Describe what your project does, who it's for, and what makes it unique..."
- "Tech Stack" — text input, placeholder "e.g. Node.js, Express, PostgreSQL, React"
- "GitHub URL" — text input, optional, placeholder "https://github.com/username/repo"
- "Template Type" — styled dropdown with 4 options: Standard, CLI Tool, npm Package, Monorepo
- GenerationCounter component: shows "X of 3 free generations used" as a progress bar for free users. Hidden for pro users.
- "Generate README" button — full width, primary style, shows spinner during loading
- If free user is at limit: button is disabled, shows "Upgrade to Pro to continue" link instead

Right panel — Output:
- Tabs: "Preview" (rendered markdown) | "Markdown" (raw text in monospace)
- Use the 'react-markdown' package with 'remark-gfm' for rendering
- Syntax highlighting for code blocks using 'react-syntax-highlighter' with a dark theme
- Top-right action buttons: "Copy Markdown" (copies raw), "Download README.md" (triggers file download)
- Empty state (before first generation): centered illustration + text "Your README will appear here"
- Loading state: skeleton loader or animated placeholder lines

UpgradeModal:
- Triggered when free user hits 3-generation limit
- Shows plan comparison, "Upgrade to Pro — $7/mo" button
- Button calls /api/create-checkout-session and redirects to Stripe Checkout URL

### useUser hook:
- On mount: call POST /api/user/sync with Clerk user's id and email
- Then call GET /api/user/:clerkId to get plan + generationCount
- Expose: { plan, generationCount, isLoading, refetch }

### useGenerate hook:
- Manages: inputState, readmeOutput, isLoading, error
- On generate: POST to /api/generate with form data + Clerk session token in Authorization header
- On success: update readmeOutput, call refetch() from useUser to update counter
- On 403 limit_reached: trigger UpgradeModal
- Expose: { generate, readmeOutput, isLoading, error }

### Getting Clerk session token for API calls (important):
Use Clerk's useAuth() hook:
  const { getToken } = useAuth();
  const token = await getToken();
Then pass as: Authorization: `Bearer ${token}`

---

## Design System
- Background: #0a0a0a
- Surface/cards: #111111
- Borders: #1e1e1e
- Primary accent: #4F8EF7 (blue)
- Success: #00D084 (green)
- Text primary: #ffffff
- Text secondary: #888888
- Font: Inter (import from Google Fonts)
- Border radius: 8px for inputs/cards, 6px for buttons
- Inspiration: Linear, Vercel — clean, minimal, fast-feeling
- All interactive elements have subtle hover transitions (150ms ease)
- Mobile responsive — stack layout on screens below 768px

---

## Environment Variables

Frontend (.env):
VITE_CLERK_PUBLISHABLE_KEY=
VITE_API_BASE_URL=http://localhost:3001

Backend (.env):
CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=
GEMINI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
VITE_STRIPE_PUBLISHABLE_KEY=
MONGODB_URI=          // MongoDB Atlas connection string
PORT=3001

---

## Setup Instructions to include in project README
1. Clone the repo
2. Run `npm install` in both root and /server
3. Create .env files in both root and /server using the variables above
4. Start backend: `cd server && npm run dev`
5. Start frontend: `npm run dev`
6. For Stripe webhooks locally: `stripe listen --forward-to localhost:3001/api/stripe/webhook`

---

## Implementation Order
1. Scaffold full project structure and install all dependencies
2. Set up MongoDB connection and Mongoose models
3. Build Express server with all routes (stub the Gemini call first, return mock markdown)
4. Build frontend UI — landing page first, then /generate page
5. Wire up Clerk auth end-to-end (frontend guards + backend middleware)
6. Replace mock Gemini stub with real API call
7. Wire up Stripe checkout + webhook
8. Test full flow: sign up → generate (free) → hit limit → upgrade → generate (pro)

Ask me before making assumptions on anything ambiguous. Use TypeScript throughout. Add comments on non-obvious logic.