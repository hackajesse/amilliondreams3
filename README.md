# A Million Dreams

Consulting site for [amilliondreams.llc](https://amilliondreams.llc).

**Stack:** Astro + Cloudflare Pages + Pages Function (contact form)

## Dev

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # production build → dist/
npx wrangler pages dev ./dist  # test Pages Functions locally
```

## Deploy

Push to `main` — Cloudflare Pages CI builds automatically (once the GitHub integration is connected).

Or manually:

```bash
npm run build
npx wrangler pages deploy ./dist
```

## Contact form setup (one-time, Cloudflare dashboard)

1. Enable **Email Routing** for `amilliondreams.llc`; verify your destination inbox.
2. Create a **Turnstile** widget; add site key as `PUBLIC_TURNSTILE_SITE_KEY` env var in Pages settings.
3. Add Pages **secrets**: `TURNSTILE_SECRET_KEY`, `CONTACT_TO` (your inbox), optionally `CONTACT_FROM`.
4. Attach custom domain `amilliondreams.llc` in Pages → Custom domains.

## Env vars reference

| Variable | Where | Description |
|----------|-------|-------------|
| `PUBLIC_TURNSTILE_SITE_KEY` | Pages env (plain) | Turnstile widget site key |
| `TURNSTILE_SECRET_KEY` | Pages secret | Turnstile secret key |
| `CONTACT_TO` | Pages secret | Your real inbox |
| `CONTACT_FROM` | Pages env (optional) | Send-from address (default: `noreply@amilliondreams.llc`) |
