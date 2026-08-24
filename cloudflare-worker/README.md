# WHOOP token proxy

A minimal Cloudflare Worker that holds your WHOOP `client_secret` and performs the OAuth2 token
exchange/refresh on behalf of the (static, secret-less) frontend. See `src/index.js` for what it
actually does — it's about 100 lines, worth reading before you deploy it.

## 1. Register a WHOOP developer app

This step only you can do (it needs your own WHOOP account):

1. Go to https://developer.whoop.com and sign in / create a developer account.
2. Create a new app.
3. Add a **Redirect URI**. It must be `https://` (or `whoop://`) — plain `http://` is rejected.
   Use your deployed app's URL, e.g. `https://azaan2300-netizen.github.io/Calorie-Tracker/`.
4. Copy the **Client ID** and **Client Secret** it gives you. Keep the secret private — don't
   paste it into chat, a commit, or anywhere public.

## 2. Deploy this Worker

Requires a free Cloudflare account and Node.js installed locally.

```bash
cd cloudflare-worker
npm install -g wrangler   # if you don't have it already
wrangler login             # opens a browser to authorize

# Put your client ID in wrangler.toml (replace the placeholder), then:
wrangler secret put WHOOP_CLIENT_SECRET   # paste your client secret when prompted -- never in a file

wrangler deploy
```

Wrangler prints the Worker's URL when it finishes, e.g.
`https://calorie-tracker-whoop-proxy.<your-subdomain>.workers.dev`. That's your
`VITE_WHOOP_TOKEN_PROXY_URL`.

If you ever deploy the frontend somewhere other than GitHub Pages, update `ALLOWED_ORIGIN` in
`wrangler.toml` to match and redeploy.

## 3. Wire it into the frontend

Set two GitHub Actions repository **variables** (Settings → Secrets and variables → Actions →
Variables — not Secrets, since neither value here is sensitive on its own):

- `VITE_WHOOP_CLIENT_ID` — the client ID from step 1
- `VITE_WHOOP_TOKEN_PROXY_URL` — the Worker URL from step 2

The deploy workflow (`.github/workflows/deploy-pages.yml`) picks these up automatically on the
next push. Until they're set, the app's WHOOP section shows a "not configured" message instead
of a broken connect button.
