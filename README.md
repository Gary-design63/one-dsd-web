# One DSD People, Culture and Equity Program — Web App

Single-file static web app that talks to the Supabase backend.

## What's here

- `public/index.html` — the web app (magic-link auth, approval queue, goals, partnership log)
- `Dockerfile` — nginx:alpine serving the static file
- `nginx.conf` — server config with CSP that allows Supabase + esm.sh
- `.github/workflows/deploy-azure.yml` — GitHub Actions → Azure Container Apps

## Supabase backend

Project: `pmwqakhmcudwokupzsfj`. Publishable key baked into the HTML (safe).
Redirect URL for magic-link auth must be added to Supabase Dashboard → Auth → URL Configuration.

## Azure deploy prerequisites

Before the GitHub Actions workflow will succeed, configure in GitHub repo settings:

- **Secrets** → `AZURE_CREDENTIALS`: JSON from `az ad sp create-for-rbac --sdk-auth`
- **Secrets** → `ACR_NAME`: your Azure Container Registry name

See Claude/the team lead for the exact service-principal-creation command.
