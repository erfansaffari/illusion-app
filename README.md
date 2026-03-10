# Illusion of Choice — Workshop Experiment

## Deploy to Vercel (5 steps)

1. **Push to GitHub**
   ```bash
   git init && git add . && git commit -m "init"
   gh repo create illusion-of-choice --public --push --source .
   ```
   Or create a new repo on github.com and push manually.

2. **Import on Vercel**
   - Go to vercel.com/new → Import from GitHub → select `illusion-of-choice`
   - Framework: Next.js (auto-detected)
   - Click Deploy

3. **Add Vercel KV (for shared real-time data)**
   - In your Vercel project → Storage tab → Create KV Store
   - Connect it to the project — Vercel auto-injects the env vars
   - Redeploy (Settings → Deployments → Redeploy)

4. **Share these links during the workshop**
   - **Participants:** `https://your-app.vercel.app/form`
   - **Dashboard (you project):** `https://your-app.vercel.app/dashboard`

5. **Before the workshop** — open `/dashboard` and hit Reset to clear any test data.

## How it works

| Route | Who uses it |
|-------|-------------|
| `/form` | Every student — shows Form A then Form B back to back |
| `/dashboard` | Presenter only — live yes/no rates, felt-free scores, auto-refreshes every 4s |
| `/api/submit` | Called by the form on each submission |
| `/api/results` | Called by dashboard to fetch aggregated stats |
| `/api/reset` | Reset button on dashboard |

## Without Vercel KV

The app works without KV (uses in-memory fallback) but responses won't persist across serverless function restarts. Fine for local dev, not reliable in production. Add KV for the real workshop.
