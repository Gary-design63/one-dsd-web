# Handoff: One DHS PAC build (September 4, 2026)

> **Current authority — [OWNER-2026-09-07-DIGITAL-MING](OWNER-DIRECTIVE-2026-09-07.md):** Historical completion claims, paths, source counts, pending approvals, and live-connection status below are dated evidence, not current operating status.

> Historical activation record. The current canonical execution line is `pac/full-build-2026-09-05`, governed by `BUILD_EXECUTION.md`. The production branch below remains untouched until the exact RG-7 commit is deliberately promoted; do not merge the concurrent AI branch automatically.

## Historical baseline

The September 4 baseline was a running Next.js application implementing the Early-2027 MUST slice from the export pack, with the Adaptive Program Intelligence control plane underneath it. Its historical verification covered type check, lint, 17 test cases wrapping 44 evaluation cases, a production build, and the primary browser journeys. Those counts and conclusions describe that snapshot only; current release evidence comes from `BUILD_EXECUTION.md` and the exact canonical commit.

## Deployments (September 4, 2026, evening)

| Target | Where | State |
| --- | --- | --- |
| Local production | `npm run start` on http://localhost:3000 (dev server: `npm run dev`) | Running from the current build; `.env.local` holds the owner key and cron secret |
| GitHub | `alphaequity123-afk/one-dhs-equity-resource`, branch `pac/one-dhs-pac-app` | Pushed. `main` (the live site) is untouched at 3aed646. No secrets in the branch. |
| Vercel production | https://one-dhs-pac.vercel.app (project `one-dhs-pac`, team equity123) | Existing deployment remains on the prior production branch while this isolated full-build branch is verified. The former community-draft preview switch is not part of the new staff projection; unfinished briefs stay held. |

Do not infer the current production key or feature state from this historical file. Owner credentials remain server-only and gitignored. The current environment must pass `config/environment-contract.json` and the release gate before protected access is represented as ready.

Commit author rule (Vercel team access): Vercel blocks Git deployments whose GitHub commit author is not linked to a team seat. The first docs push (author Gary-design63 / garybanks400@gmail.com) was blocked with `TEAM_ACCESS_REQUIRED`; a commit authored as alphaequity123-afk / alphaequity123@gmail.com built and was promoted. This checkout's repo-local git config is now set to that author. To push as Gary-design63 instead, link that GitHub account to the gary-design63 seat in the Vercel team settings (Settings, Members), or approve blocked deployments in the dashboard.

Side effect to be aware of: the live site's Vercel project (`one-dhs-equity-resource`) also watches the repository and attempts a preview build of the new branch with its own Vite settings. That preview fails harmlessly and never touches its production. To silence it, add an ignored build step for `pac/one-dhs-pac-app` in that project's settings. A separate project `one-dhs-pac-release` already existed in the team (created earlier, not by this build).

## Roadmap status (Handoff Roadmap §B)

| Step | Status |
| --- | --- |
| B1 Source freeze, GitHub repo | Done: branch `pac/one-dhs-pac-app` of `alphaequity123-afk/one-dhs-equity-resource`, pushed. |
| B2 Vercel connect | Done: project `one-dhs-pac` connected to the repository with production branch `pac/one-dhs-pac-app`. |
| B3 Harvest scope lock | Done for this build: tokens, hero, nav order, safety-boundary copy, Right Door signals, brief substance for six communities (see `docs/DECISIONS.md`). |
| B4 to B8 Open freezes (Ask, CI, intake, graduation, brand) | Defaults taken and documented in `docs/DECISIONS.md`; owner sign-off pending. |
| B9 Canonical source freeze sign-off | Pending Gary's written sign-off; the facts to record are above. |
| B10 to B12 Architecture A0 to A2 | `docs/ARCHITECTURE.md`. |
| B13 Stack lock | Next.js 16 App Router, TypeScript, Tailwind v4, ESLint, Vitest. |
| B14 Design tokens | `app/globals.css` (from one-dhs-equity-resource, contrast-corrected). |
| B15 to B17 Scaffold, tokens, hero | Done. |
| B18 to B20 Push, preview URL, first-code gate | Done: pushed; production URL https://one-dhs-pac.vercel.app; first code declared. |

Section C (after first code) is implemented: Ask, CI, Library, Intake, Graduation, agent stubs at A0 to A2 (not stubs: working adapters), accessibility pass, and a self-scored rescore (`docs/SCORECARD.md`).

## How to run the canonical line

```bash
cd "C:\Users\garyb\OneDrive\Desktop\One DSD Equity Program (11)\one-dhs-pac"
npm ci
npm run dev
```

The canonical branch is `pac/full-build-2026-09-05`. The development-only key fallback is `local-dev-owner`; set a strong, distinct `PAC_OWNER_KEY` for every shared environment. Local file or memory storage is not production durability.

## Current deployment rule

The repository and framework decision is no longer open. Continue only on the canonical repository and branch named in `BUILD_EXECUTION.md`. The concurrent AI branch is a donor/quality-control stream and is never merged or deployed automatically.

Production promotion can originate only from the exact commit that passes RG-7. Before promotion, verify the production environment contract, PostgreSQL migrations, managed database and object-storage boundaries, backup/restore and rollback drills, lifecycle housekeeping, kill switches, and production smoke tests. Live AI, research, consultation, uploads, contribution, and real collaboration remain individually fail closed until their RG-6 evidence passes.

The PostgreSQL backend and private `pac` schema are implemented; provider/project binding, credentials, migration rehearsal, and recovery evidence remain deployment work. Memory storage is test/temporary only, and the `.data` file store is local-development only. The lifecycle inventory and restore procedure are `config/data-lifecycle-register.json` and `docs/operations/data-lifecycle-and-recovery.md`.

## Current owner or release decisions that would move the score

1. Freeze the Official corpus for Ask v1 (T-01).
2. Freeze the priority brief list and complete representation review (CI §10.1).
3. Approve the ten launch types and the five path names.
4. Approve the current active-request consultation policy before intake activation. Each approved request receives an immutable expiry; its redacted tombstone and linked idempotency receipt are removed 30 days after redaction.
5. Approve and verify the selected managed database/object-storage settings, RPO/RTO, backup retention, restore drill, incident ownership, and recovery evidence.
6. Complete moderated tests for KPI-01, KPI-02, and KPI-11.
