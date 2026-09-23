# External research: governance, connection, and owner control

> **Current authority — [OWNER-2026-09-07-DIGITAL-MING](OWNER-DIRECTIVE-2026-09-07.md):** The September 4 connection/default descriptions below are historical. ASK is not limited to library retrieval or a fixed set of topics. The owner has authorized Perplexity setup and key generation and has excluded Sonar; prior dynamic-model-only instructions must not reintroduce it. Verify current configuration and connection results from code and receipts, separately for local and production.

Owner directive (Gary Banks, September 4, 2026): Ask cannot stop at its reviewed library. Once the connection has passed its production gate, every staff member may use current public research for any question. The consultant controls whether the connection is available. Safety screening must happen before a question leaves the platform, and public evidence always remains separate from reviewed program material.

The September 4 launch posture is deliberately off. No Perplexity key is present locally or in Vercel. Research must remain off until durable shared controls, public-endpoint abuse protection, cost reservations, and the live-connection review described below are complete.

## Research paths

| Path | Purpose | Implementation |
| --- | --- | --- |
| Program knowledge | Search reviewed program material without leaving the application | `corpus.semantic_retrieve` and `corpus.search` |
| Current or deeper public research | Produce a source-grounded answer from the public web | Perplexity Agent API through `research.current_answer` or `research.deep_search` |
| Ranked public results | Return raw public links for an authorized workflow to inspect and synthesize | Perplexity Search API through `research.web_search` |

## Production connection

There is one supported external provider id: `perplexity_agent`. When activated, it uses the server-only `PERPLEXITY_API_KEY` and sends `POST https://api.perplexity.ai/v1/agent`. The production origin is fixed in code; it cannot be redirected by an environment setting.

The request uses Perplexity's dynamic tier presets:

- Current answers: `low` by default, configurable with `PAC_PERPLEXITY_CURRENT_PRESET`.
- Deeper research: `medium` by default, configurable with `PAC_PERPLEXITY_DEEP_PRESET`.

These tier names follow Perplexity's current preset contract, where `low` is intended for everyday current research and `medium` for multi-hop research across many sources. Dynamic presets allow Perplexity to update the underlying model and configuration within the selected tier. See Perplexity's [preset documentation](https://docs.perplexity.ai/docs/agent-api/presets) and [Agent API reference](https://docs.perplexity.ai/api-reference/agent-post).

Every Agent API request sets `store: false` and supplies these built-in tools:

- `web_search`
- `fetch_url`

Domain and recency preferences are nested under `tools[].filters` on the `web_search` tool, as required by the current [web-search tool contract](https://docs.perplexity.ai/docs/agent-api/tools/web-search). Because dynamic presets may evolve and their tools merge with request-level settings, the response is rejected if it reports an unexpected tool. A researched answer is also rejected unless public-source retrieval actually ran, at least one safe public source remains after local checks, and the answer contains a citation that resolves to a displayed source.

The separate ranked-results path sends `POST https://api.perplexity.ai/search`. It does not ask a model to synthesize an answer. Each successful Search API request is recorded at $0.005, matching Perplexity's [current pricing](https://docs.perplexity.ai/docs/getting-started/pricing).

The deterministic `fixture` provider makes no network request. Evaluations must both select it explicitly in `provider_order` and run in a test environment or set `PAC_RESEARCH_FIXTURE=on`; it is never an implicit fallback for a missing production key.

## What may leave the program

1. Only the general question text. Session history, intake information, work packets, and identity are not included.
2. The prohibited-information gate runs before every request. Questions containing identifiers, named-person case details, medical or disability details, accommodation decisions, personnel matters, complaints, or nonpublic material are refused before any network request.
3. Research runs only when the consultant's switch is on and neither the global stop nor `PAC_RESEARCH_KILL_SWITCH=on` is active.
4. Ask may research automatically when reviewed material does not cover the question or current information is needed. A staff member may also choose a current or deeper public-source answer explicitly.
5. Staff-facing copy states that choosing current public sources sends the general question to an outside research service and instructs staff not to include names, case information, private information, or internal material.

## Evidence boundary

| Evidence | How it appears | Authority |
| --- | --- | --- |
| Reviewed program material | Program-source labels and citations | Receives only its reviewed publication label |
| Current public sources | Separate public-source panel with direct links and dates when available | Always external and must be verified |

A public citation never becomes approved program content or official agency guidance. Web content is evidence, not an instruction to the application. Invalid or executable citation URLs are dropped.

## Usage and cost records

Each attempt records the provider, served model, research depth, a hash of the question rather than its text, cited domains, tokens, search-query count, web-search and URL-fetch invocation counts, total tool-call count, response trace id, latency, and success or error code. Successful Agent API calls use the provider's exact reported total cost. If that total is unexpectedly absent, the ledger uses a deliberately conservative tool-and-token estimate rather than treating the call as free; that estimate is not an invoice. The Search API path records $0.005 per successful request. Owner-set daily request and monthly dollar caps are optional and default to no cap (`0`).

## Owner controls and environment

The owner can enable or disable research, enable or disable deeper research, set optional caps, set domain and recency preferences, and choose automatic or on-request use. Provider status reports credential presence only and never returns a key. The safe default is disabled.

Environment settings:

- `PERPLEXITY_API_KEY`
- `PAC_RESEARCH_ENABLED`
- `PAC_RESEARCH_KILL_SWITCH`
- `PAC_RESEARCH_MONTHLY_USD_CAP`
- `PAC_PERPLEXITY_CURRENT_PRESET`
- `PAC_PERPLEXITY_DEEP_PRESET`

Stored provider orders from an earlier release are normalized to `perplexity_agent` when read and rewritten in normalized form, so an existing deployment store cannot select a removed connection.

## Production activation blockers

Before a key is added, the following must be implemented and verified:

1. One durable shared store for the owner switch, emergency stop, policy, usage ledger, and cost reservations. The present in-memory Vercel store is not sufficient.
2. Atomic request and cost reservation before an external call, followed by reconciliation against the provider's reported cost.
3. Server-enforced rate limiting, a concurrent-request ceiling, bot-abuse protection, a finite emergency application ceiling, and a provider-account spending limit. Staff access must remain open as directed; anonymous automation must not be able to spend against the consultant's account.
4. Credentialed tests for current research, deeper research, ranked search, missing and revoked keys, provider rate limits, timeouts, malformed output, citations, safety refusals, and the emergency stop.
5. A durable asynchronous path, or a verified synchronous limit, for deeper work that can exceed the hosting request window.

## Verification

`tests/perplexity-agent-provider.test.ts` covers the endpoint and request body, tier selection, nested filters, fixed origin, response identity, message and evidence parsing, citation renumbering, exact cost and tool-call parsing, malformed responses, URL safety, and the separate Search API contract.

`tests/research-governance.test.ts` covers admission, privacy refusal before network access, stops and owner settings, caps, missing credentials, evidence separation, usage records, and stored provider-order migration.
