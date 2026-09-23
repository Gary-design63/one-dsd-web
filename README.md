# One DHS / One DSD People Access and Culture

**Current owner direction — OWNER-2026-09-07-DIGITAL-MING:** [DIGITAL MING and the September 7 operating directive](docs/OWNER-DIRECTIVE-2026-09-07.md) governs the program's autonomy, owner-approved content, broad ASK function, and observable work records. Read it before the historical build baseline below. The 90–95% agent-driven target and deployment status must be demonstrated by actual evidence.

This is the isolated canonical build of the internal-purpose equity operating system: a shared One DHS spine with a deeply developed One DSD reference implementation. The controlling product direction, release gates, and definition of complete are in `BUILD_EXECUTION.md`.

The branch `pac/full-build-2026-09-05` is intentionally separate from other AI implementation streams. Work from another branch is donor and quality-control input only; it is never merged or deployed automatically.

## Run

The project tools pin Node.js 24.14.0, while the package engine accepts compatible Node.js 24.x releases. npm 11.9.0 is pinned and enforced exactly.

```bash
npm ci
npm run dev
```

Open the printed URL. The protected Practice Workspace is at `/consultant`; in development the owner key defaults to `local-dev-owner` (set `PAC_OWNER_KEY` for any shared environment).

## Verify

```bash
npm run verify
```

Runs the environment contract, source-ledger checks, Next.js route type generation, TypeScript, lint, all portable tests, and a production build. Vercel adds the stricter production environment gate before running this same verification chain, so an incomplete or unverified production configuration cannot produce a deployable artifact.

The eight forensic checks that require the ignored owner-machine catalog, source resolver, source bytes, or frozen import stages are run separately after safe fixture preparation:

```powershell
npm run corpus:fixtures:bootstrap -- --from "C:\path\to\trusted\one-dhs-pac"
npm run test:corpus:local
```

See `docs/operations/environment.md` for feature activation and secret boundaries, `docs/operations/owner-session-lifecycle.md` for session expiry, rotation, and revocation, and `docs/operations/security-housekeeping.md` for expired revocation and rate-limit retention.

## Layout

- `app/`: routes (staff surfaces, Practice Workspace, API route handlers)
- `components/`: UI and client components; every control is understandable from its text label
- `lib/content/`: corpus, community briefs, graduation paths, question banks
- `lib/intelligence/`: registry, providers, safety, retrieval, tools, agents, orchestrator, memory, eval
- `lib/brand/lint.ts`: banned-term and no-icons lint used at build time and on generated prose
- `docs/`: architecture (A0 to A2), decisions and assumptions, scorecard, handoff
- `tests/`: vitest suites

## Boundaries

This is not a case, complaint, investigation, accommodation, personnel, medical-record, or employee-scoring system. It does include a governed content lifecycle, but contribution, review, approval, publication, correction, and withdrawal remain separate and auditable. No recovered material becomes staff content without item-level authority, rights, sensitivity, audience, accessibility, and publication review.
