# ReadmeAI

AI-powered README generator for developers. Describe your project, get a polished README in seconds.

## Tech Stack

- **Frontend**: React + Vite + TypeScript, Tailwind CSS, Clerk auth
- **Backend**: Express.js + TypeScript, MongoDB Atlas + Mongoose
- **AI**: Google Gemini 2.0 Flash
- **Payments**: Stripe

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd ReadMeApp
npm install
cd server && npm install && cd ..
```

### 2. Environment variables

```bash
cp .env.example .env
cp server/.env.example server/.env
```

Fill in the values:

| Variable | Where to get it |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | [Clerk Dashboard](https://dashboard.clerk.com) → API Keys |
| `CLERK_SECRET_KEY` | Same as above |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com) |
| `STRIPE_SECRET_KEY` | [Stripe Dashboard](https://dashboard.stripe.com) → API keys |
| `STRIPE_PRO_PRICE_ID` | Stripe → Products → create a $7/mo recurring price |
| `STRIPE_WEBHOOK_SECRET` | See step 4 |
| `MONGODB_URI` | [MongoDB Atlas](https://cloud.mongodb.com) → Connect |

### 3. Start dev servers

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
npm run dev
```

### 4. Stripe webhooks (local testing)

```bash
stripe listen --forward-to localhost:3001/api/stripe/webhook
```

Copy the webhook signing secret printed and set it as `STRIPE_WEBHOOK_SECRET` in `server/.env`.

## Project Structure

```
ReadMeApp/
├── src/                  # React frontend
│   ├── components/       # UI components
│   ├── hooks/            # useUser, useGenerate
│   ├── lib/              # api.ts fetch wrapper
│   └── pages/            # LandingPage, GeneratePage
└── server/               # Express backend
    ├── models/           # Mongoose schemas
    ├── routes/           # API route handlers
    ├── middleware/        # requireAuth (Clerk JWT)
    └── lib/              # gemini.ts, stripe.ts
```

## Deployment

- **Frontend**: Vercel — set `VITE_CLERK_PUBLISHABLE_KEY` and `VITE_API_BASE_URL` env vars
- **Backend**: Railway or Render — set all `server/.env` vars plus `FRONTEND_URL` pointing to your Vercel domain
