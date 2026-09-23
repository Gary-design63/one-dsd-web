# Autonomy policy and the orchestrator cycle

## Current operating direction

[OWNER-2026-09-07-DIGITAL-MING](OWNER-DIRECTIVE-2026-09-07.md) is the current authority. The Chief of Staff is the owner's DEIA / Equity and Inclusion Operations Consultant partner, responsible for coordinating and delegating authorized program tasks through completion. Content the owner supplied and curated is already approved. A proposal or another approval request is not a completed task.

Maximum program autonomy and **90–95% agent-driven work** are targets to implement and prove through actual actions and receipts in every area. Retain the owner's stop and scale-back controls. Do not claim this percentage is achieved from a registry setting or an A5 label.

## Historical September 4–5 implementation baseline

The defaults, ceilings, proposal behavior, and publication restrictions below describe the earlier implementation. Where they impose repeat approval on owner-curated content or restrict authorized program work to proposals, they require reconciliation under the current directive. They are not a new request for permission.

Owner directive (Gary Banks, September 4, 2026): the agent framework must do real work at full autonomy; the owner holds a hard stop and a scale-back control. This supersedes the A0 to A2 MVP ceiling in the September contracts, which was a build default, not an owner decision. The safety boundaries (no case or PII, no ranking or profiling, no autonomous publish or send, no persona, no Nation-specific guidance without authority) are unchanged and still fail closed.

Execution clarification (September 5, 2026): A5 remains an available owner-controlled capability, not an automatic deployment state. A clean clone and every new environment start at A0 with generative, sentinel-write, evaluation-write, and A3 stale-flag capabilities off. The owner raises those controls deliberately after the applicable release evidence exists.

## The controls (Practice Workspace, Orchestrator page)

| Control | Effect | Where it is enforced |
| --- | --- | --- |
| Stop all agents | Every tool call by every agent is denied immediately. Browse, search, and brief pages keep working. Ask and intake return a plain "paused by the practice owner" message. Scheduled cycles return without acting. | `lib/intelligence/tools/runtime.ts` on every call; `paused()` on staff API routes |
| Ceiling A0 to A5 | The maximum autonomy any agent may use, applied on top of each agent's own definition. Change it at any time; no deploy. | `effectiveCeiling()` in `lib/intelligence/policy.ts` |
| Per-agent enable and ceiling | Disable one agent or lower it alone. | same |
| Flag overrides | Runtime overrides for feature flags (for example generated drafting on or off). | `setFlagOverrides()` |
| Undo cycle | Reverts a cycle's triage moves and stale flags. | `undoCycle()` in `lib/intelligence/agents/cycle.ts` |
| Proposals | Accept or reject. Accepted policy proposals apply through the same policy path; rejected ones are logged so they are not silently re-applied. | `decideProposal()` |

Environment defaults: `PAC_AUTONOMY_MAX` (default A0) and `PAC_KILL_SWITCH`. Once the owner changes the policy from the workspace, the stored policy wins, up to the configured and registered ceilings.

## What a cycle does

Runs on demand from the Orchestrator page. `vercel.json` also declares a 12:00 UTC schedule, but the production build and endpoint fail closed until the release-gated production data boundary and a strong, distinct `CRON_SECRET` are configured.

| Step | Autonomy | Action | Reversible |
| --- | --- | --- | --- |
| Read queue | A0 | Lists consult requests | n/a |
| Detect stale content | A0 | Past review dates, missing owners, accessibility pending | n/a |
| Check brief quality | A0 | CI-E4 criteria on every community brief | n/a |
| Scan corpus accessibility | A2 | Plain-language and structure scan of every corpus item | n/a |
| Refresh heads-up packets | A2 | Regenerates packets for open requests with current retrieval and question banks | packets are drafts |
| Triage queue | A3 | Received to Under review with a pin order suggestion; history note names the cycle | Undo cycle |
| Flag stale content | A3 | Writes a "flagged for review" state per item | Undo cycle |
| Bounded workflow | A4 | The cycle itself, with a report, steps, and exceptions | Undo cycle |
| Write proposals | A5 | Enable a model, review a brief, retire content, fill a community gap, capacity, raise the ceiling | Owner accepts or rejects |

Below the ceiling, gated steps are recorded as skipped, not hidden. At A2 the cycle observes and drafts only.

## Generated drafting

`model.generative_pilot` is off by default. After a provider, data-handling contract, model record, evaluation, and owner release decision are approved, the owner may enable it with a server-side credential. Ask and cycle summaries then use schema-constrained, source-grounded drafting; if the approved binding is unavailable, the deterministic composer remains the fallback.

## What still has no adapter

`calendar.schedule_reversible` stays disabled: there is no calendar integration, and DHS system integration is a separate decision (PRD §7.3). Everything else on the ladder has a working adapter.
