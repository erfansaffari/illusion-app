# Illusion of Choice — Workshop Experiment


## How it works

| Route | Who uses it |
|-------|-------------|
| `/form` | Every student — shows Form A then Form B back to back |
| `/dashboard` | Presenter only — live yes/no rates, felt-free scores, auto-refreshes every 4s |
| `/api/submit` | Called by the form on each submission |
| `/api/results` | Called by dashboard to fetch aggregated stats |
| `/api/reset` | Reset button on dashboard |

## Without Upstash Redis

The app works without KV (uses in-memory fallback) but responses won't persist across serverless function restarts. Fine for local dev, not reliable in production. Add KV for the real workshop.
