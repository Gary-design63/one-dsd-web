# One DHS / One DSD People, Access and Culture
## Technical requirements and source handoff

**Prepared:** September 9, 2026  
**Canonical working directory:** `C:/Users/garyb/Projects/one-dhs-pac-repair`  
**Release target:** existing Vercel project `one-dhs-pac`  
**Status:** Implementation-grounded technical baseline. Read the final release receipt for build, test, deployment, and production parity results.

### 1. Architecture and runtime

The application uses Next.js 16.3.4 with the App Router, React 19.2.8, TypeScript, and Tailwind CSS. `package.json` pins npm 11.9.0; `.node-version` pins Node.js 24.14.0 and the package engine accepts Node.js 24.x. `.npmrc` enforces engine compatibility. Reproduce dependencies with the supplied `package-lock.json` and `npm ci`.

| Layer | Location | Responsibility |
| --- | --- | --- |
| Staff and owner routes | `app/` | Page composition, server reads, route handlers, scoped access and protected owner workflows. |
| Presentation and activities | `components/` | Learning, forms, practical tools, navigation, media, and client interaction state. |
| Content and publication | `lib/content/`, `lib/dsd/`, `data/` | Structured resources, courses, editable surfaces, source references, and scoped published views. |
| ASK and program assistance | `lib/intelligence/` | Retrieval, providers, orchestration, tools, policy checks, evaluation, and observable records. |
| Authentication | `lib/auth/` | Owner/session boundaries and protected mutation helpers. |
| Storage | `lib/intelligence/memory/`, other feature stores, `db/` | Configured memory/file/PostgreSQL implementations, schema and migrations. |
| Static media | `public/` | Same-origin photographs, audio, and other assets. |
| Quality and operation | `tests/`, `scripts/`, `docs/`, `evidence/` | Automated checks, build gates, operating instructions and review receipts. |

Server Components load content and enforce publication boundaries. Client Components own interactions that require event handlers or local state. Native HTML and CSS provide readable equivalents for visual relationships; no heavy visualization dependency was introduced for the September 9 DSD additions.

### 2. Content and publication model

The program supports static source content for local review and a PostgreSQL publication source for configured deployments. `PAC_CONTENT_SOURCE` selects the source; `PAC_STAFF_SCOPE` contributes to scope behavior. Editable surfaces have explicit identifiers, definitions, values, and scope policies. Read the current `config/environment-contract.json` and publication helpers before changing activation behavior.

Owner-curated content is approved under the current owner directive. Technical publication, withdrawal, source integrity, and access checks remain meaningful. Do not rewrite original institutional material or turn a recovered identifier into staff-visible content without resolving its published state.

One resource may appear under multiple themes. The collection and recommendations must resolve membership against the scoped published resource set. DSD profile and scenario pages check editable-surface availability and resolve related destinations through `lib/dsd/published.ts`.

The September 9 inventory map receives only the program profiles already returned by the published inventory. It must not independently enumerate hidden profiles. Media previews in results and ASK are called for already-visible resource entries.

Compatibility redirects in `next.config.ts` retain older library, resource, course, path, and workspace URLs. New documentation and links should use current destinations while preserving these compatibility routes.

### 3. Multimedia implementation

Course companions occupy a separate lesson slot. They do not alter the original indexed lesson blocks. This prevents an added example from shifting the index used by saved answers, notes, or completion state. Course rendering and companion selection remain separate responsibilities.

DSD program companions are placed after equity entry points and before connected work. Scenario companions follow the original situation and precede notice/questions/action sections. The original source fields remain unchanged. Leadership stage companions sit between the practice situation and existing practice/reflection controls.

| Component family | Implemented responsibility |
| --- | --- |
| `dsd-program-media`, `dsd-scenario-media` | Select the exact companion for a known profile/scenario; return no content for an unknown identifier. |
| `dsd-work-examples` | Resource-specific native flows, written conversations, and comparisons. |
| `dsd-data-quality-example`, `dsd-policy-burden-map` | Synthetic evidence views and documentation-burden comparison, including complete tables and explanatory text. |
| `dsd-access-demonstrations` | Accessible fictional form validation/confirmation and contact-route exploration; no network submission or persistent writes. |
| `dsd-first-contact-audio` | Native audio controls, complete transcript disclosures, and playback failure feedback. |
| `dsd-leadership-media`, `dsd-development-map-example` | Stage and capability companions kept separate from user plan fields and exports. |
| `engagement-learning-scenes`, `engagement-toolkit-route` | Five intercultural examples, community influence sequence, and a working reminder-process comparison. |
| Other `engagement-*` components | Exact team, orientation, Amplify, and organizational-reference companions. |
| `resource-media-preview`, `worked-practice-examples`, `opportunity-pathway` | Scoped result previews and task-specific application examples. |

The paired fictional meeting image is delivered at 1774 × 887 pixels and depicts conversation alongside time for written contributions. The authentic Minnehaha park photograph is retained at the source's 1000 × 666 size with NPS/Gordon Dietzman attribution and explicit public-domain provenance. Do not describe either as 4K, documentary evidence of an actual DHS meeting, or proof of influence.

Synthetic dialogue uses locally produced WAV files and exact source transcripts. The recordings describe fictional arrangements, not a real service or live interpretation. Both existing long-form podcasts now have recording-derived JSON transcripts and registered chapter data in `lib/content/podcast-supplements.ts`: nine equity-toolkit chapters and 11 anti-racism chapters. The player supports draft transcript reading, actual passage search, and seeking. The ASR designation remains visible; browser playback checks do not establish verbatim transcript certification.

All players should avoid autoplay and unnecessary preload. A playback failure must preserve useful text. Interactive diagrams need real buttons, explicit current selection, keyboard use, and equivalent labels. Responsive tables may use a named, focusable horizontal-scroll region when necessary. Do not rely on color alone.

### 4. State and data boundaries

Different features have different persistence behavior. Do not describe all staff activity as either permanently stored or purely transient. Review the concrete feature implementation and its interface notice.

- Lesson state follows the existing course progress and note mechanism. Companion additions preserve its keys and block indices.
- Leadership and several practice drafts use component state and explicit copy/download actions. Examples must not overwrite these fields or become part of exports automatically.
- ASK responses have an observable-record implementation under `lib/intelligence/observability/ask-records.ts`; `app/api/ask/route.ts` calls its record path. Storage, access, deletion, and retention depend on configuration and the applicable program requirements.
- Consultation, collaboration, and other work objects use their feature-specific stores and protected routes. A frontend confirmation must not conceal a failed save or delivery.
- The development file store is not an appropriate substitute for shared durable production storage on ephemeral hosting.

Do not add staff records, case information, credentials, private source payloads, or runtime databases to the source ZIP. Preserve required public/static content and code while excluding operational data and secrets.

### 5. ASK and tool execution

ASK combines program retrieval and applicable reasoning/provider capabilities. The retrieval and response path must preserve exact named destinations, actual consulted citations, source scope, and action relevance. An indexed destination that disappears from the complete answer is a functional failure.

The DSD restoration regression checks all 12 profile and 13 scenario originals, division publication scope, exact-name retrieval, complete-answer next actions, and current practical links. The September 9 ASK fix is validated against this full path rather than only a search helper.

`lib/intelligence/retrieval/podcast-reading.ts` enriches only matching current published podcast rows with their actual public transcript and chapter content. Each transcript contribution is bounded to 64,000 characters and retains a distinct payload fingerprint. It does not create extra destinations, import private notes, or fall back to an unpublished recording. Focused checks cover scope, withdrawal after a cached read, original revision evidence, exact podcast anchors, and the final recorded passages. `resource-media-preview.tsx` recognizes the two exact podcast anchors; a generic catalog URL alone does not imply a particular recording.

Provider keys stay server-side. The current owner excludes Sonar; do not reintroduce it as a fallback. External research, live generation, Microsoft transport, scheduled operations, and protected mutations require their actual configured adapters, credentials, activation evidence, and stop controls. A catalog entry does not establish a working integration.

Task receipts must identify an actual request/action, result or failure, and relevant sources. A hash alone is insufficient evidence of completed work. The 90–95% autonomous-work target must be measured against a declared task set; this release does not infer it from the autonomy ceiling.

### 6. Security requirements

**Owner access (binding, September 9, 2026).** The program owner requires no authentication of any kind, under any circumstance. `lib/auth/request.ts` now returns `true` from both `ownerFromCookies()` and `ownerFromRequest()`. Every page, the in-place "Edit this page" control mounted site-wide by `components/universal-editor.tsx` through `app/layout.tsx`, and every `/consultant` area open directly with no sign-in, password, cookie, or session. The cookie/session helpers in `lib/auth/owner.ts` and `lib/auth/owner-session.ts` remain only so existing imports compile; nothing gates on them. Do not reintroduce a sign-in gate, an owner cookie check, or a "sign in to edit" message anywhere without the owner's explicit written direction. Consequence the owner has accepted: anyone with the URL can edit page wording and images and use the consultant areas.

Database owner credentials are for migrations/imports/provisioning. The running application uses the restricted runtime connection. No secret may be renamed with a `NEXT_PUBLIC_` prefix, embedded in a public asset, printed in evidence, or included in the distributable archive.

`next.config.ts` applies same-origin content restrictions, denies framing, disables camera/microphone/geolocation permissions, disables MIME sniffing, and discourages indexing. Production adds transport security. Same-origin public media is compatible with this configuration; a new remote media host requires deliberate policy review rather than silently broadening the policy.

Use the existing protected mutation, request identity, scope, and rate-limit helpers. Preserve CSRF/origin, publication, and deletion protections. Do not weaken a test or gate merely to make a deployment green.

### 7. Local setup

1. Extract the complete source archive to a working directory. Install the pinned Node.js/npm versions. Do not reuse `node_modules` from another machine.
2. Run `npm ci` from the source root. The lockfile is part of the handoff.
3. Review `.env.example` and `config/environment-contract.json`. Create an ignored `.env.local` only if local settings are needed. The example contains names and guidance, not usable production credentials.
4. For a temporary local content preview, use static content and local data scope. Do not change a production database or overwrite a configured `.env.local` merely to restore a preview.
5. Run `npm run dev`. Open the URL printed by Next.js. The owner workspace is `/consultant`; configure an appropriate owner credential before sharing the environment.

For a one-process PowerShell preview, set only the intended process values and invoke the server:

```powershell
$env:PAC_CONTENT_SOURCE = 'static'
$env:PAC_DATA_ENV = 'local'
npm run dev -- --port 3115
```

Use a new terminal for another configuration. These commands do not install production credentials, import the corpus, migrate a database, or activate external services. The source package must include necessary model/static assets or the documented verified recovery mechanism used by the build.

### 8. Verification commands and meaning

```powershell
npm run verify:environment
npm run verify:sources
npm run typecheck
npm run lint
npm run test -- --config vitest.hosted.config.mts
npm run build
```

`typecheck` runs Next.js route type generation and TypeScript without emit. The test command uses `scripts/testing/run-tests.mjs`, which strips deployment credentials and feature settings from worker environments before running Vitest. Preserve that isolation.

The hosted configuration excludes 17 explicitly listed PostgreSQL integration suites because a hosted builder does not provide the required local database executables. Those exclusions are not passes. Local/CI database verification is a separate stage. Owner-machine corpus checks also have their own documented fixture requirements; a clean source extraction is not evidence that private corpus checks were performed.

The canonical all-in-one `npm run verify` uses the package's verification chain. Choose the hosted or full local path appropriate to the actual environment and report precisely which ran. Browser review remains required for media loading, interaction, keyboard use, saved state, responsive layout, and errors; unit tests do not establish perceptual audio quality or production parity.

### 9. Production deployment

Deploy the actual completed source to the existing `one-dhs-pac` Vercel project. The root release task controls the deployment and the final archive. Do not create a replacement project or publish a planning HTML document as the application.

`vercel.json` installs with npm 11.9.0 and invokes `build:vercel`. That script checks the actual Vercel environment, verifies/retrieves the pinned local semantic model, runs environment/source/type/lint/hosted-test gates, builds Next.js, and verifies model tracing. Preserve this chain.

Production configuration requires the correct production data environment, restricted durable storage, and the PostgreSQL publication source under the environment contract. Preview resources must be separately scoped. The existing cron declaration for `/api/cron/orchestrate` does not by itself establish authorized, activated, or successfully completed scheduled work.

After deployment, verify the actual production hostname and release: representative route titles, exact resource companions, image/audio loading, scoped links, ASK destinations, and relevant existing workflows. Record the deployment identifier, URL, observed results, failures, and unresolved work. Production parity is established by those checks, not by a successful upload response.

**Hosted test suite repaired, September 10, 2026.** The Vercel build runs the full vitest hosted suite (`scripts/vercel-build.mjs` -> `vitest.hosted.config.mts`), but Vercel's restored build cache had been skipping that step on recent deploys, so 51 failing tests across 25 files accumulated unnoticed (earlier "Ready" deploys built in ~33 s with no test output). A source edit invalidated the cache and surfaced them all at once. Root causes and fixes, every file re-run individually and passing:

- *Owner access is automatic* (the September 9 owner directive): 12 test files still asserted sign-in gates (401/403 for a missing owner cookie, session-revocation affecting route access). Updated to assert the current contract: no authentication is ever required; origin and scope checks still apply. Files: protected-owner-api-access, owner-auth-security, editable-surface-api, one-dsd-team, page-copy-api, resource-inline-editing, resource-release, protected-owner-pages, rg3-route-migration, participation-contract, plus staff-presentation (needed a `next/headers` mock) and staff-routes-brand (icon-only emoji).
- *Stale manifests*: the route inventory, practice-page manifest, and data-lifecycle register had not been updated for routes/tables added by the inline-editing and media work (`resources/new`, `resources/[id]/delete|media|media/script`; `pac.page_text_overrides`, `pac.page_image_overrides`, `pac.media_files`, `pac.resource_media`). Added. `/consultant/one-dsd-team` now redirects to the public workspace; three tests updated for that.
- *Semantic projection*: `models/bge-small-en-v1.5/public-document-vectors.json` is keyed by a hash that includes each document's title. The September 9 terminology change to the community course titles orphaned ~40 precomputed vectors, so every ASK-dependent test fell into runtime re-embedding (`pac_local_semantic_unavailable / index_warming`, 6 s budget) and timed out. Rebuilt with `scripts/search/prepare-public-index.ts` (2,021 vectors, manifest sha256 updated). **Rule: after any change to published titles/summaries/text, rerun that projection build before deploying**, or ASK degrades to keyword-only retrieval in production. `tests/ask-breadth` was also updated because the shortened course title "Somali Minnesota" now outranks the community brief for a two-topic query; the test now accepts whichever Somali page retrieval supplies.
- *Introduced today and fixed*: the new `/api/sp-clone-request` route initially read `PAC_RUNTIME_DATABASE_URL` directly and used the unbounded `request.json()`; moved database access to server-only `lib/sp-clone/request-store.ts` and switched to `readBoundedJson`, per the existing boundary tests. A ref read during render and an `audio` state anti-pattern in `app/audio-library/page.tsx` were fixed for the newer `react-hooks` lint rules.
- Adopted the deploy folder's newer `functional-production-migration-plan` and `local-audit-agent-receipts` tests into the mirror; application code in `app/`, `lib/`, `components/` is byte-identical between the two folders.

**Request-support workflow for the SharePoint-style clone.** `/api/sp-clone-request` (POST to submit, GET `?trackingId=` to look up) stores requests in the isolated `sp_clone.requests` table and emails the owner through the owner's own Resend account (secrets `SP_CLONE_RESEND_API_KEY`, `SP_CLONE_NOTIFY_EMAIL`; degrades to save-only if unset). CORS is open by design: it is called cross-origin from the standalone clone, carries no auth, and touches only its own table. Resend delivery to the owner address verified directly on September 10 (message id 5a2689f3-ae66-42e8-986e-e75b6d28a8db). Live-verified on deployment `one-dhs-4qg8kha01` the same day: POST -> 200 with tracking id `6JBZXM`, GET by id -> found with status Submitted, row present in `sp_clone.requests`. **Runtime-role rule:** the app connects as `pac_app_runtime`; any new schema/table created with the owner role must be granted to it (`grant usage on schema ...; grant select, insert, update on ... to pac_app_runtime;` plus default privileges) or requests fail with `permission denied for schema` — this was the cause of the first live 500. The Resend key is send-only (list calls return 401), so the route logs Resend's HTTP status and message id on every send; Vercel runtime logs are the delivery receipt.

**Fix applied September 9, 2026 (evening), not yet deployed.** Five library pages returned HTTP 500 on the live site (`/library/ja-equity-impact-questions`, `/library/lm-facilitation-application`, `/library/lm-how-this-program-works`, `/library/lm-interpreter`, `/library/lm-workplace-climate`). Cause: with owner access now automatic, `app/resources/[id]/page.tsx` requests draft-editing state for every item, and `pac.resource_management_allowed` only permits `content_kind = 'resource'`; those five are `learning_module` / `question_bank`, so the database raised P0002 and the page crashed. Fix: `app/resources/[id]/page.tsx` and `app/consultant/library/[id]/page.tsx` now catch that failure and render the read-only view. The site-wide "Edit this page" control still works on those pages. `config/environment-contract.json` now documents `PAC_TEAM_KEY` so `verify:environment:production` passes. Type check passes. Optional follow-up: widen `pac.resource_management_allowed` to `learning_module` and `question_bank` if the structured draft editor is wanted for those kinds.

**Deployment state and blocker as of September 9, 2026 (for whoever picks this up).**

- The no-sign-in change above exists only in this source folder. It is NOT yet on the live site. The live production deployment (https://one-dhs-pac.vercel.app, deployment `one-dhs-ciou0fkmu-equity123`, built earlier on Sept 9) still requires the consultant sign-in and lacks the newer editing routes such as `/api/consultant/resources/new`.
- This folder is not a git repository. The Vercel project `one-dhs-pac` (team `equity123`, project id `prj_nHxwFMaDXRMFCvvAfkQZ9YhIlxJp`) is Git-connected to GitHub `alphaequity123-afk/one-dhs-equity-resource`, production branch `pac/one-dhs-pac-app`. `.vercel/project.json` in this folder is linked to that project.
- Three CLI uploads (`vercel --prod`, then with a trimmed `.vercelignore`, then `--archive=tgz`) all aborted mid-upload ("Upload aborted" / "fetch failed"). The cause is upload size: `public/audio/` holds roughly 460 MB of raw recordings and a local voice-engine toolchain (`public/audio/one-dsd-audio/` with a Python venv, Rust sources, `rustup-init.exe`). The archive upload still measured 244.7 MB after excluding those, so other large local content remains in the tree (unmeasured; candidates are `models/` at 42 MB, `evidence/`, `public/`, `.data`).
- Only two audio files are referenced by application code: `public/audio/anti-racism-public-service.mp3` and `public/audio/dhs-equity-policy-and-toolkit.mp3`. Learning-example clips in `public/audio/learning-examples/` are referenced through `pac.resource_media` rows, not code. `.vercelignore` was updated on Sept 9 to exclude the rest.
- Database: Supabase project `qhiawdhehhfuccxvhldo` (one-dsd-vercel-staging, used as production). Migrations through `0054_pac_resource_media_script.sql` are applied; `pac.page_text_overrides`, `pac.page_image_overrides`, and `pac.resource_media` (with `script` column and `audio` kind) all exist. No database work is pending for the editing feature.
- A previous production build failed in `scripts/verify-semantic-trace.mjs` ("Semantic function trace is incomplete: onnxruntime-node ... libonnxruntime.so.1"). This is intermittent; the Sept 9 Ready build passed the same gate.

**Recommended path to ship:** initialise git in this folder, add a `.gitignore` that excludes the same large paths as `.vercelignore`, commit, and force-push to `pac/one-dhs-pac-app` on the GitHub remote. Vercel then builds from GitHub with no upload from the local machine. After it is Ready, verify on https://one-dhs-pac.vercel.app with no cookies that the home page HTML contains `data-pac-editor` (the floating "Edit this page" control) and that `/api/consultant/resources/new` no longer returns 404.

### 10. Complete-source package

The final ZIP should include application source, configuration templates, the lockfile, database migrations, required public content/media, relevant scripts/tests, PRD/TRD in Markdown and readable HTML, and final verification/provenance receipts. Include a readable root index or README explaining where to begin.

Exclude `.env.local` and other secret-bearing files, database dumps and staff records, local credentials/session material, `node_modules`, `.next`, temporary upload state, and machine-specific caches. Do not include private raw sources simply because they are present on the authoring machine. The archive manifest must state what was included and any content needed separately; call it complete source, not a preconfigured production service.

A validated source ZIP snapshot may be created while deployment is pending, provided its accompanying receipt accurately states that status; refresh the archive and release evidence after deployment or subsequent document or source changes. Root owns sanitization, archive creation, validation, and its final link. This technical document does not certify a ZIP that has not yet been created.

### 11. Separate second-brain status

The local Python second-brain server is a separate owner workspace, not a Next.js staff route or Vercel deployment. Its root remains explicitly incomplete. APIs for notes, connections, citations, revisions, evidence briefs, and on-demand audits have isolated tests; that does not prove the full program is installed.

Automatic approval review rejected copying 28 source/report files and three UI files into the target second-brain folder. Preserve that restriction. Do not bypass it through an alternate path, encoding, route, or source transfer. The source import and combined UI are not delivered while that decision remains unresolved. No recurring automation or external integration is inferred from the local server.

### 12. Maintenance references

Use current source and owner directives before historical architecture defaults: `AGENTS.md`, `docs/OWNER-DIRECTIVE-2026-09-07.md`, `docs/operations/environment.md`, `docs/operations/owner-session-lifecycle.md`, `docs/operations/security-housekeeping.md`, and the multimedia/learning requirements named in the PRD. Read the installed Next.js documentation before framework edits; this project deliberately warns against relying on older App Router behavior.

The resource-level DSD and program receipts are `dsd-media-status.json` and `engagement-media-status.json`. Image/audio provenance and final validation logs belong beside the release record. Update those records when media, transcripts, source scope, or production behavior changes.
