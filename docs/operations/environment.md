# Environment and feature activation

The application installs and verifies from a clean clone without secrets or owner-machine source files. The machine-readable contract is `config/environment-contract.json`; `.env.example` lists every application setting without real values.

## Safe clean-clone defaults

- `PAC_STORE=memory`
- `PAC_DATA_ENV=local` when an environment file is used
- `PAC_CONTENT_SOURCE=static`
- `PAC_STAFF_SCOPE=one-dhs`
- consultation, live generation, research, scheduled operations, and Microsoft transport remain off or disconnected

These defaults exercise the product without claiming durable storage or activating protected features.

## Secret boundary

Database URLs, owner credentials, object-storage credentials, model-provider keys, research-provider keys, and cron credentials are server-only. They must never use a `NEXT_PUBLIC_` name, enter Git, appear in evidence bundles, be mapped through `next.config`, or be copied into browser code.

The database owner URL is used only for migrations, imports, and restricted-role provisioning. The running application uses only `PAC_RUNTIME_DATABASE_URL` and must fail closed when a protected database-backed feature is enabled without it.

## Owner-machine corpus gate

The ordinary test suite keeps every portable unit, security, loader, seed-release, and behavior test active. Exactly eight large-corpus integration checks need the ignored 578-record catalog, private resolver, source bytes, or frozen import stages; those individual checks are skipped in a clean clone and required by `npm run test:corpus:local`.

To prepare an isolated worktree from a trusted local One DHS repository:

```powershell
npm run corpus:fixtures:bootstrap -- --from "C:\path\to\trusted\one-dhs-pac"
npm run test:corpus:local
```

The bootstrap is copy-only. It refuses to overwrite a different resolver or frozen stage, writes only to ignored fixture locations, and never edits the source repository.

## Production activation

An environment variable can make a capability technically available; it does not approve that capability for release. Consultation, protected uploads, live model use, live research, scheduled operations, durable staff data, and publication mutations remain behind their applicable RG-2 through RG-7 evidence and kill switches.

Vercel sets `VERCEL_ENV` for each build. The configured build command refuses an unknown Vercel environment instead of selecting a weaker gate.

`NEXT_DEPLOYMENT_ID` is optional framework-provided deployment metadata. Next.js may append it as the `dpl` query parameter on local image URLs so the correct deployment serves the asset. It is not a secret, does not enable a program feature, and does not need a manual `.env` entry. The environment contract records it so presentation tests can verify those URLs. Ordinary isolated tests remove platform contract settings; a focused test can supply a synthetic identifier to reproduce hosted image rendering.

- Preview requires `PAC_DATA_ENV=preview`; local paths and test fixtures are rejected. Durable resources used there must be separately scoped preview resources.
- Production requires `PAC_DATA_ENV=production`, durable restricted storage, and the reviewed PostgreSQL publication source. It rejects owner-machine paths and fixtures. The owner and scheduled-route secrets must each be at least 32 bytes, must not be placeholders, and must be different from one another.

The deployment marker is a fail-closed guard against accidentally inheriting another environment's resources. It complements—not replaces—separate credentials, databases, storage buckets, and provider projects.
