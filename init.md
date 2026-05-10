# ReadmeAI — Project Reference

AI-powered README generator. Describe your project, get a polished README in seconds.

---

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 18 + Vite + TypeScript + Tailwind CSS |
| Backend    | Express.js + TypeScript (ESM) |
| Database   | MongoDB Atlas + Mongoose |
| Auth       | Clerk |
| AI         | Anthropic Claude (`claude-haiku-4-5`) via `@anthropic-ai/sdk` |
| Payments   | Stripe (subscriptions + webhooks) |
| Animations | GSAP 3 + CSS keyframes + IntersectionObserver |

---

## Directory Structure

```
ReadMeApp/
├── index.html                  # Entry HTML — Google Fonts loaded here
├── tailwind.config.js          # Design tokens (colors, fonts, radii)
├── vite.config.ts
├── .env                        # Frontend env vars
│
├── src/
│   ├── main.tsx                # React root, Clerk provider
│   ├── App.tsx                 # Router + ProtectedRoute
│   ├── index.css               # Tailwind + grain noise + keyframes + reveal system
│   │
│   ├── pages/
│   │   ├── LandingPage.tsx     # Assembles all landing sections
│   │   └── GeneratePage.tsx    # /generate — two-column editor layout
│   │
│   ├── components/
│   │   ├── Navbar.tsx          # Floating pill nav, scroll-transition
│   │   ├── Hero.tsx            # 100dvh hero, CSS stagger entrance
│   │   ├── Features.tsx        # 3 interactive demo cards
│   │   ├── Philosophy.tsx      # Manifesto section with Unsplash bg
│   │   ├── HowItWorks.tsx      # 3-step alternating timeline
│   │   ├── Pricing.tsx         # Free + Pro cards
│   │   ├── Footer.tsx          # Status dot + nav links
│   │   ├── GenerateForm.tsx    # Input form (all fields)
│   │   ├── GenerationCounter.tsx  # Free tier progress bar
│   │   ├── MarkdownPreview.tsx # Preview/Markdown tab + copy/download
│   │   └── UpgradeModal.tsx    # Shown when free limit hit
│   │
│   ├── hooks/
│   │   ├── useUser.ts          # Fetches plan + generationCount, syncs with API
│   │   ├── useGenerate.ts      # Calls /api/generate, handles limit_reached
│   │   └── useReveal.ts        # IntersectionObserver scroll-reveal hook
│   │
│   └── lib/
│       ├── api.ts              # Typed fetch wrappers (syncUser, getUser, generate, checkout)
│       └── gsap.ts             # Registers GSAP ScrollTrigger plugin (import this, not gsap directly)
│
└── server/
    ├── index.ts                # Express app — webhook route mounted BEFORE express.json()
    ├── .env                    # Backend env vars
    ├── tsconfig.json
    ├── package.json
    │
    ├── lib/
    │   ├── claude.ts           # generateReadme() — calls claude-haiku-4-5 with prompt caching
    │   ├── stripe.ts           # Stripe client (API version: 2025-02-24.acacia)
    │   └── gemini.ts           # UNUSED — kept as reference, do not import
    │
    ├── middleware/
    │   └── requireAuth.ts      # Verifies Clerk JWT using standalone verifyToken()
    │
    ├── models/
    │   ├── User.ts             # clerkId, email, plan ('free'|'pro'), generationCount, stripeSubscriptionId
    │   └── Generation.ts       # userId, projectName, description, techStack, templateType, createdAt
    │
    └── routes/
        ├── user.ts             # POST /api/user/sync, GET /api/user/:clerkId
        ├── generate.ts         # POST /api/generate — auth-gated, free limit enforced server-side
        ├── checkout.ts         # POST /api/stripe/checkout — creates Stripe checkout session
        └── webhook.ts          # POST /api/stripe/webhook — upgrades/downgrades plan in DB
```

---

## Environment Variables

### Frontend — `.env`
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_BASE_URL=http://localhost:3001
```

### Backend — `server/.env`
```
CLERK_SECRET_KEY=sk_test_...
ANTHROPIC_API_KEY=sk-ant-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
MONGODB_URI=mongodb+srv://...
FRONTEND_URL=http://localhost:5173
PORT=3001
```

---

## Running Locally

Requires two terminals:

```bash
# Terminal 1 — Backend
cd server
npm run dev        # tsx watch index.ts — hot reload on port 3001

# Terminal 2 — Frontend
npm run dev        # Vite dev server on port 5173
```

Open: `http://localhost:5173`

---

## Critical Implementation Notes

### Clerk auth
- Frontend uses `useAuth()` → `getToken()` to get a JWT, sent as `Authorization: Bearer <token>`
- Backend uses **standalone** `verifyToken` from `@clerk/backend` — NOT `clerkClient.verifyToken` (doesn't exist)
- `requireAuth` middleware attaches `req.clerkId` from the token's `sub` claim

### Stripe webhook
- The webhook route **must** be mounted with `express.raw()` **before** `express.json()` in `server/index.ts`
- Order matters — reversing this breaks signature verification

### AI model
- Using `claude-haiku-4-5` (cheap, fast — ~$0.005/generation)
- System prompt has `cache_control: { type: 'ephemeral' }` for prompt caching
- Switching to `claude-opus-4-7` costs ~$0.05/generation (10× more expensive)

### Free tier
- Limit of 3 generations enforced **server-side** in `routes/generate.ts`
- Client also checks and shows UpgradeModal, but server is authoritative

---

## Deployment

### Step 1 — Push to GitHub
Create a repo and push the entire `ReadMeApp/` folder.

### Step 2 — Deploy Backend to Railway
1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Set **Root Directory**: `server`
3. Set **Build Command**: `npm run build` (compiles TS → `dist/`)
4. Set **Start Command**: `npm run start` (`node dist/index.js`)
5. Add all `server/.env` variables in Railway's environment settings
6. Set `FRONTEND_URL` to your Vercel URL once known
7. Note the Railway deployment URL (e.g. `https://readmeai-server.up.railway.app`)

### Step 3 — Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com) → New Project → Import GitHub repo
2. **Framework Preset**: Vite (auto-detected)
3. **Root Directory**: leave as `/` (project root)
4. Add environment variables:
   - `VITE_CLERK_PUBLISHABLE_KEY` — same as local
   - `VITE_API_BASE_URL` — your Railway URL from Step 2
5. Deploy. Note your Vercel URL (e.g. `https://readmeai.vercel.app`)

### Step 4 — Update cross-references
- In Railway: update `FRONTEND_URL` → your Vercel URL
- In Vercel: confirm `VITE_API_BASE_URL` → your Railway URL

### Step 5 — Register Stripe webhook
1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → Developers → Webhooks
2. Add endpoint: `https://your-railway-url.up.railway.app/api/stripe/webhook`
3. Select events: `checkout.session.completed`, `customer.subscription.deleted`
4. Copy the **Signing Secret** (`whsec_...`)
5. Update `STRIPE_WEBHOOK_SECRET` in Railway with this value
6. Redeploy the backend

### Step 6 — Configure Clerk for production
1. Go to [Clerk Dashboard](https://clerk.com) → your app
2. Under **Domains**, add your Vercel URL as an allowed origin
3. Under **Redirect URLs**, add: `https://your-vercel-url.vercel.app` and `https://your-vercel-url.vercel.app/generate`
4. Copy the **production** publishable key (`pk_live_...`)
5. Update `VITE_CLERK_PUBLISHABLE_KEY` in Vercel with the live key
6. Update `CLERK_SECRET_KEY` in Railway with the live secret key (`sk_live_...`)
7. Redeploy both

---

## What Still Needs Doing

### Must-do before launch
- [ ] **Stripe webhook secret** — currently `whsec_...` (placeholder). Complete Steps 4–5 above
- [ ] **Production Clerk keys** — currently using test keys (`pk_test_`, `sk_test_`). Switch to live keys when going to production
- [ ] **Custom domain** (optional) — add in Vercel settings, then update Clerk allowed origins

### Nice-to-have
- [ ] **Success/cancel pages** for Stripe checkout — currently redirects back to `/generate` with no confirmation UI
- [ ] **Account page** — let Pro users manage/cancel their subscription via Stripe Customer Portal
- [ ] **Delete unused file** — `server/lib/gemini.ts` is dead code, safe to remove
- [ ] **Rate limiting** — add `express-rate-limit` to `/api/generate` to prevent abuse
- [ ] **Error tracking** — integrate Sentry on both frontend and backend
- [ ] **Analytics** — add Vercel Analytics or Plausible

---

## Ports

| Service  | Local URL |
|----------|-----------|
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:3001 |
