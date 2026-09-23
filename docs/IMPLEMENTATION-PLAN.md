# One DHS PAC: Implementation Plan (as built and forward)

> **Current authority — [OWNER-2026-09-07-DIGITAL-MING](OWNER-DIRECTIVE-2026-09-07.md):** The earlier MVP scope and approval sequence below are historical. They do not replace the later requirement for complete agent work, broad ASK, inspectable records, and use of already approved owner content.

Date: September 5, 2026
Owner: Gary Banks (Northpoint Consulting Group)
Status: The staging PostgreSQL foundation, corpus projections, permanent seed release, resource release cycle, and Home and Footer editing are active and verified. No production deployment has been made from this activation.

Current execution authority is `BUILD_EXECUTION.md`. This document preserves the September 5 pre-reconciliation implementation record; where status or defaults differ, the release-gated full-build branch and its evidence control.

## 1. Where the build stands

| Area | State | Evidence |
| --- | --- | --- |
| Staff surface (Home, Ask, Minnesota Communities, Resources and Learn, Learning paths GP-1 to GP-5, Support intake and tracking, My View) | Built | `app/`, `components/`, automated release checks |
| Consultant surface (Practice Workspace: queue, orchestrator, policy, external research controls, One DSD Team) | Built, owner-key gated | `app/consultant/*` |
| Adaptive Program Intelligence control plane (model registry, agents, tool catalog, runtime, safety gates, retrieval, memory, eval harness) | Built | `lib/intelligence/*` |
| Autonomy layer (A0 fail-closed deployment default, owner-selectable capability through A5, stop-all, scale-back, cycles, proposals, undo, gated cron) | Built foundation; activation gate-bound | `docs/AUTONOMY.md`, `tests/autonomy-policy.test.ts` |
| Governed external research path (admission, ledger, citations, owner enable/disable) | Built, no key present | `docs/RESEARCH.md`, `docs/PUBLIC-RESEARCH-CONTRACT.md` |
| Deployment | Current activation not deployed to production; Vercel Preview variables are configured and Production variables are absent | GitHub branch `pac/one-dhs-pac-app`; Vercel project `one-dhs-pac` |
| Staging database | Active portable PostgreSQL in Supabase project `qhiawdhehhfuccxvhldo` | Migrations `0001` through `0008` verified by `npm run db:migrate` |
| Restricted runtime | Live through a least-privilege application role | Fixed readers and mutations work; direct protected-table reads fail with code `42501` |
| Staff read path | Exactly 25 seed resources in the general reader; separate fixed readers for Home and Footer | 27 publication decisions: 25 seeds, Home, and Footer |
| Inline owner editing | Resources plus Home and Footer | Remaining staff-facing surfaces do not yet have inline editors |
| Source-object storage | Fully accounted but not uploaded | 60 staged representations; 46,613,473 bytes; exact upload authorization still required |
| DHS logo in the header | Restored by owner direction on September 4, 2026 | `components/site-header.tsx`, `tests/independent-boundary.test.ts` |
| Source accounting | Loaded into staging without replacing the historical receipt | Before Home and Footer page blocks: 44 carriers and 630 source items; current: 46 carriers, 632 source items, and 557 source receipts |
| Historical and canonical corpus | Loaded as reviewable, non-publication layers | Shadow run `bac47fd8-6fc5-4e52-bc49-030fb847b8ff`: 1,207 rows; canonical run `3993ae55-e95b-4766-b9e8-35f995abbd0e`: 1,803 rows |
| Release state | Permanent seeds released; Home and Footer page blocks released only to their fixed readers | Seed run `c7b5f76e-571d-4393-90d1-87b8c6065751`: 223 rows; general staff reader remains exactly 25 resources |

## 2. Verification gates that every change must pass

1. `npx tsc --noEmit` clean.
2. `npx vitest run` all green (must-pass cases, safety and brand, staff route copy, autonomy policy, research governance, independent boundary, voice standards).
3. `npx next build` succeeds.
4. Owner pages return 200 in production with the owner cookie.
5. Staff copy lint: no model brands, internal terms, persona language, ranking language, or icon-only meaning.
6. Source reconciliation: every registered source has a stable receipt and state; known missing originals remain visible as open records.
7. Publication safety: owner approval to ingest never bypasses language, accessibility, currentness, scope, placement, rights, or representation review.
8. Protected logo: SHA-256 remains `E9D767446EC871A7FBE829C2A978CF0CB47886AAD31A4FFCFF59A78AE89ADD74`.

## 3. Open decisions the owner holds

| Id | Decision | Effect on build |
| --- | --- | --- |
| D-02 | Ownership and IP statement | Footer ownership copy already reflects consultant ownership; legal wording is the owner's. |
| D-05 | Ecosystem charter and Tribal gates | Tribal brief stays gated until resolved. |
| D-12 | Tribal and enterprise representation | No Nation-specific guidance is displayed. |
| Research provider | Perplexity API connection and pricing | Handled by the owner outside this build. The adapter stays replaceable and no key is stored. |

D-08 is implemented for staging: portable PostgreSQL is active in Supabase project `qhiawdhehhfuccxvhldo`, reached through a restricted runtime role, with no dependency on DHS, ADSA, or DSD systems. The private object package is accounted but remains local pending exact upload authorization. Production activation remains separate.

## 4. Ordered work that remains

### Phase A: Activated staging foundation and remaining hold

Completed on September 5, 2026:

1. Applied and verified migrations `0001` through `0008`. Migration `0006` is preserved honestly as an accidental 60-byte no-op; resource release is implemented in `0008`.
2. Loaded 1,207 shadow rows, 1,803 canonical rows, and 223 permanent seed-release rows through replay-safe import runs.
3. Preserved 574 legacy events and established current totals of 46 carriers, 632 source items, 557 receipts, 100 content items, 124 revisions, 98 memberships, and 27 publication decisions. The pre-page-block corpus load totals remain 44 carriers and 630 source items.
4. Activated the restricted PostgreSQL runtime and confirmed protected direct-table access is denied with code `42501`.

Remaining before this phase closes:

1. Upload the 60 staged source-object representations only after specific authorization for the exact 46,613,473-byte package and private staging destination.
2. Repeat the import and migration checks after any source-ledger change and preserve hard-conflict behavior.
3. Verify the restricted store and stop control through the final Vercel Preview cold-start review.

### Phase B: Live intelligence

1. Approve the provider and model evaluation, then add the selected server-side credential and explicitly turn on `PAC_GENERATIVE_PILOT`. Generated drafting is off by default.
2. Run the eval harness against the live model and record the scorecard in `docs/SCORECARD.md`.
3. Turn on the daily orchestrator cron with `CRON_SECRET` set and review the first three cycle reports.

### Phase C: External research activation (owner-managed)

1. Owner finalizes the Perplexity connection and pricing outside this build.
2. Add the key to Vercel and `.env.local`. The route becomes live on the next request; no code change is needed for the default provider order.
3. Run the live-connection review in `docs/RESEARCH.md`: citation resolution, refusal of identifying questions, ledger recording, usage caps if the owner sets any.

### Phase D: Content and language access

1. Keep the 13 substantive Minnesota community briefs out of staff search, browse, direct access, and Ask until their community, source, language, and representation reviews pass. The safe Tribal referral remains separately gated.
2. Wire the tiered translation route (Google Cloud Translation, LibreTranslate fallback, model-based sensitive translation) behind the Translation agent with human review for vital documents.
3. Derive language choices from current, verified program needs and policy; do not preserve an unsupported fixed language list.

### Phase E: Accessibility and launch readiness

1. Automated WCAG 2.2 AA pass (axe) on every staff route in CI.
2. Manual keyboard and screen-reader pass on Ask, intake, and paths.
3. Leadership View aggregate pages (de-identified) once intake volume exists.

## 5. Risks carried forward

- The current activation has not been deployed to production. Preview variables are configured; Production variables are not.
- The 60 source-object representations remain local. They must not be uploaded without the specific authorization described above.
- Inline editing covers resources and Home and Footer only. Treat any claim of program-wide edit-anywhere coverage as incomplete.
- The Perplexity connection has no credential, so current and deep outside research remain unavailable.
- The historical and donor corpora contain strong material as well as obsolete wording, internal instructions, inaccessible structures, third-party rights questions, and synthetic phrasing. Import preserves them; publication remains gated.
- The interactive race and racism HTML source is quarantined and must never execute unchanged. Its content, accessibility, encoding, external submission behavior, and consent language require correction.
- The supplied audio needs a transcript before staff release. The intergenerational deck needs a raw-file or visual extraction because its Drive text layer was empty.
- Codex and the other AI work in separate worktrees and branches. Treat the other branch as donor and quality-control input; never merge or deploy it automatically.
- Vercel deploys only from commits authored by the team owner account. See `docs/HANDOFF.md`.
- The live One DHS site project still attempts preview builds of this branch; those failures are harmless and can be silenced by ignoring the branch in that project.
