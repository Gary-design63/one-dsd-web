# One DSD People, Culture and Equity Program — Web App

Single-file static web app that talks to the Supabase backend.

## Files

- `public/index.html` — the web app (magic-link auth, approval queue, goals, partnership log)
- `Dockerfile` — nginx:alpine serving the static file
- `nginx.conf` — server config with CSP that allows Supabase + esm.sh
- `.github/workflows/deploy-azure.yml` — (add this manually, see below)

## Supabase backend

Project: `pmwqakhmcudwokupzsfj`. Publishable key baked into the HTML (safe).
Redirect URL for magic-link auth must be added to Supabase Dashboard → Auth → URL Configuration.
