# Build decisions, assumptions, and open questions

## Current controlling decision, September 7, 2026

[OWNER-2026-09-07-DIGITAL-MING](OWNER-DIRECTIVE-2026-09-07.md) supersedes the conflicting defaults below. The exact operating concept is DIGITAL MING. The owner-curated collection is already approved; the Chief of Staff coordinates completion without reapproval. ASK must support broad questions and durable, inspectable response/work records. The owner seeks maximum program autonomy and a measured 90–95% agent-driven result. Perplexity setup is authorized; Sonar is excluded.

The entries below preserve September 4–5 history. Their old ASK nonretention rule, intake-only approval, conservative operating defaults, and dynamic-only research model restriction are not current owner requirements. Existing private-information and official-authority boundaries remain scoped to their actual purpose.

Deltas and defaults recorded against the September 4, 2026 export pack. Locked decisions (Master PRD §1, Handoff §A) were not reopened.

## Deltas from prior guidance

| Item | Prior source | This build | Why |
| --- | --- | --- | --- |
| Stack | CLAUDE.md (April 2026): React 18 + Vite + Express + PostgreSQL | Next.js 16 App Router, TypeScript, Tailwind v4 (Handoff B13) | The September pack supersedes the April file and locks Next.js + GitHub + Vercel. The control plane in `lib/` is framework-agnostic TypeScript and can be hosted by any Node server. |
| Names | CLAUDE.md: "One DSD Resource Hub" | Program and staff-facing identity: "One DHS People, Access and Culture Program"; DSD implementation: "One DSD People, Access and Culture Program"; committee: "One DSD Team" | The reconciled September authority and owner clarification supersede the April shorthand. Strings live in `lib/constants.ts`. |
| Repository | Handoff B1/B2: create `one-dhs-pac`, connect Vercel | Not created. Built locally, git initialized, nothing pushed. | Gary's instruction during the build: resolve against the existing source-linked `one-dhs-equity-resource` repo and its unreleased `codex/one-dhs-pac-release-20260903` branch rather than creating another repository by default. |
| Green in text and buttons | Harvest brief: `#78be21` primary CTA | `#78be21` kept as accent only; `#2e6b12` (harvested `--green-strong`) for text and CTAs | `#78be21` on white is about 2.2:1 and fails 4.5:1; `#2e6b12` passes. |

## Defaults taken on open questions (owner may overturn)

| Ref | Question | Default in this build |
| --- | --- | --- |
| Ask §10.1 / TRD T-01 | Official corpus for Ask v1 | None labeled Official. Program method is Practice note / Guidance; standards are External (verify). Ask states "no Official source" rather than inventing one. |
| Ask §10.2 / CIQ §10.1 / T-02 | Queue ownership | Single practice-owner queue. |
| Ask §10.3 / CIQ §10.2 / T-03 | Retention (historical; ASK prohibition superseded September 7) | Ask transcripts are not stored server-side. Content-free operational events and privacy-minimized research-usage records are removed after 90 days. A consultation request can be created only under a current approved policy that writes an immutable per-request expiry; expiry atomically redacts the S3 payload to a strict minimal tombstone, and bounded housekeeping removes the tombstone and its linked idempotency receipt 30 days after redaction. Real intake remains off until the active-request policy and its activation evidence are approved. |
| Ask §10.4 / CIQ §10.4 | Launch-type templates | Ten launch types drafted in `lib/content/question-banks.ts` pending sign-off. |
| Ask §10.5 | CI handoff depth | Ask deep-links to the brief and summarizes the anti-profiling limit inline. |
| CI §10.1 | Priority brief freeze list | Thirteen substantive briefs remain Under review and are hidden from staff browse, direct access, retrieval, and Ask. The Tribal entry is a separately gated referral page. Explicit owner preview can open held drafts for review. |
| CI §10.2 | Level 2 required fields | Level 0 plus the four-part work panel plus names are required; Level 2 depth is variable. |
| CI §10.3 | Partner-informed contribution | Not built; sources note the gap. |
| CI §10.4 | Tribal posture | Escalate-only gate; no Nation-specific content displayed. The live app's sovereignty brief is treated as a migration input pending authority. |
| CI §10.5 | Work-handoff tone | Firm, non-shaming; see any brief's "What not to assume". |
| CIQ §10.3 | Requester identity | Reference ID and access key only; no directory name shown to the owner. |
| CIQ §10.5 | Decline taxonomy | Five fixed reasons offered in the owner form; free text allowed. |
| GP §8.1 | Path names | GP-1 to GP-5 titles as written; staff labels are short "I'm ..." phrases. |
| GP §8.2 | Self-check strictness | Owners and review date are required to pass (not warn-only). |
| GP §8.3 | GP-4 scope | Supervisors may use the climate path for general norms; complaint content hard-redirects. |
| GP §8.4 | KPI-11 proxy | Instrumentation is local-only in this build; the aggregate ratio is not collected yet (no telemetry endpoint exists). |
| Brand §8.1 | Chrome name | Full program name in Home, header, navigation context, and metadata; no separate invented product brand. |
| Brand §8.2 | Practice owner name | Role shown in consult copy; name only in constants for the owner surfaces. |
| Brand §8.3 | Minnesota Communities vs Community Intelligence | "Minnesota Communities" is the only staff-visible title. |
| Handoff §D.3 | Auth for first preview | Staff routes public; Practice Workspace behind an owner key. |
| Handoff §D.4 | Primary harvest source on conflict | One DHS equity-resource (color, hero, type); DSD hub for safety-boundary copy and role signals. |
| Handoff §D.5 | Model preference | Fixture composer in production; Claude Sonnet 4.6 registered as the pilot binding per the CLAUDE.md routing matrix, off by default. |
| TRD T-04 | Provider region and retention | No protected payload leaves the application; vendor records are scoped to the public corpus only. |
| PRD D-08 | Hosting and data boundaries | Resolved at the architecture level: portable PostgreSQL with a Supabase-compatible migration, content-addressed object storage, and no DHS, ADSA, or DSD system connection. Hosted project selection, costs, and credentials remain separate activation decisions. |

## Owner directive on autonomy (September 4, 2026, evening)

Gary Banks directed that the agent framework must do real work at full autonomy with the orchestrator as his co-partner, with a hard stop and a scale-back control in his hands. The A0 to A2 ceiling in the contracts was a build default, not his decision. Result: policy-driven ceiling defaulting to A5, A5 proposals, reversible A3 triage and stale flags, a scheduled daily cycle, generated drafting on by default (credential-gated), and a stop-all control. Details in `docs/AUTONOMY.md`. Safety boundaries are unchanged.

September 5 execution clarification: the full A0-to-A5 ladder and owner control are preserved, while unconfigured deployments now fail closed at A0. Generative and write-capable flags default off. A5, scheduled operations, and live providers become active only through explicit configuration after their release evidence is complete. This changes the deployment default, not the owner's intended capability ceiling.

## Stage Zero boundary and research decisions (September 4, 2026)

- The platform is independently managed by the consultant. Organization names describe program context and do not claim DHS, ADSA, or DSD ownership, sponsorship, approval, or system connection. By current owner direction, the DHS logo remains in place and must not be altered; the ownership statement supplies the system boundary.
- One DSD Team is an owner-gated native workspace under `/consultant/one-dsd-team`, within the protected consultant route boundary.
- The Microsoft personal-account route is an attended bridge, selected but disconnected. Native collaboration remains authoritative.
- Ask is hybrid. It searches reviewed program material and can escalate to Perplexity-backed current public research or an explicit deep-research pass. External sources stay separate and require verification.
- The absolute no-icons interpretation is superseded. Icon-only meaning and decorative clutter remain barred; accessible icons with visible text are not prohibited as a class.

## Owner directive on external research (September 4, 2026, evening)

Ask cannot stop at the reviewed library. A governed path uses Perplexity's Agent API for source-grounded current answers and deeper research, while the separate Perplexity Search API returns ranked raw results. Every staff member may use public research for any question after production activation; the routine restriction remains the consultant's enable/disable control. The safe launch position is off. No key may be added until durable shared controls, atomic cost reservations, public-endpoint abuse protection, and the live-connection review are complete. The prohibited-information gate still runs before anything leaves the program. Public evidence and reviewed program material stay visibly distinct. Details are in `docs/RESEARCH.md` and `docs/PUBLIC-RESEARCH-CONTRACT.md`.

Historical replacement decision (superseded by the September 7 directive where incompatible): the Agent API is the sole researched-answer route, and the Search API is the sole ranked-source route. There is no secondary provider route or fixed research model in the production design.

## Owner directive on source accounting and release review (September 4, 2026)

Every supplied asset is approved to enter the governed corpus intake pipeline. No source may be omitted because editing, accessibility work, rights confirmation, placement, or factual review remains. The 25 current seed items remain a permanent collection because their tone and practical role are valuable.

**Historical restriction, superseded for the owner-curated collection on September 7:** Approval to ingest is not permission to expose a source to staff. Staff release remains a separate revision-level decision. The complete source record now includes 47 ledger entries, 22 local/package/thread snapshots, 12 Drive presentations, three explicitly missing originals, the 578-record normalized catalog, 557 disposition receipts, 21 canonical families, 52 active child resources, 73 canonical audio items, and the two pinned GitHub donor releases.

The owner's phrase “IBI orientation” is retained as an alias in the source record. The supplied evidence is IDI/IDC material: Denial, Polarization, Minimization, Acceptance, Adaptation, and an Integration tutorial that extends beyond the scored IDI continuum. The program must not silently relabel those materials.

The interactive race and racism HTML is approved for intake but quarantined from execution and staff release until its encoding, accessibility, external submission behavior, consent, and language issues are corrected. The audio is approved for intake and requires a transcript before release. The intergenerational presentation is accounted for but requires raw-file or visual extraction because its Drive text layer is empty.

## Hard gates left explicitly unresolved

D-02 (ownership and IP), D-05 (ecosystem charter and Tribal gates), D-12 (Tribal and enterprise representation). The application makes no enterprise claim and displays no Nation-specific guidance.
