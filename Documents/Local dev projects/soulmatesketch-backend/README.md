# Soulmate Sketch - Backend Demo

An investor-ready demo backend that powers the Soulmate Sketch landing page experience with AI-generated images and compatibility profiles.

## Quick Start

1. Copy `.env.example` to `.env` and fill keys:

```
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_test_...
PORT=8080
BASE_URL=http://localhost:8080
```

2. Start server (local):

```
npm run start
```

3. Open the demo:

- Visit `http://localhost:8080` and run through the 3-step flow

## Deploy to Render (Free)

There is a `render.yaml` blueprint. Steps:

1) Push this repo to GitHub

2) In Render, create a new Web Service from your repo (or use the Blueprint deploy).

- Build Command: `npm install`
- Start Command: `npm start`
- Environment: Node
- Instance: Free

3) Set env vars in Render:

- `OPENAI_API_KEY` (required for real AI generation)
- `STRIPE_SECRET_KEY` (optional; if omitted, demo uses fallback)
- `BASE_URL` (optional; Render domain is fine)

4) Deploy and open the service URL. The demo is served at `/` and API at `/api/*`.

## API Endpoints

- POST `/api/orders` { email, tier, addons }
- POST `/api/orders/:id/intake` multipart/form-data: photo, quiz (JSON string)
- POST `/api/orders/:id/generate` -> { image, pdf }
- GET `/api/orders/:id`

## Notes

- Payments are simulated in the demo; Stripe wiring is provided in `src/payments.js` and can be enabled in production.
- Data is stored in SQLite at `db/soulmatesketch.sqlite`.
- Uploads and generated assets are in `/uploads`.

## Investor Pitch Highlights

- AI-driven experience with clear upsell path (aura, twin flame, past-life)
- Viral-ready share assets (story-sized variant generated)
- Ethical, privacy-first approach (local storage for demo, S3 in prod)
- Extensible architecture: admin dashboard, A/B prompts, analytics hooks
