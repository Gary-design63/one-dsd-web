# Public research contract

> **Current authority — [OWNER-2026-09-07-DIGITAL-MING](OWNER-DIRECTIVE-2026-09-07.md):** The connection defaults below describe an earlier contract. The owner has authorized Perplexity setup and excluded Sonar. A dynamic preset must not override that exclusion. ASK supports reasoning and any subject, using research when appropriate; requested code and formulas are answer content. Current provider configuration and verified activation must be read from implementation and receipts.

## Required behavior

Public research is a required capability for Ask and authorized internal workflows. It is implemented but remains disabled until the live-connection gate is complete.

- `research.web_search` returns ranked public results from the Search API.
- `research.current_answer` produces a source-grounded current answer through the Agent API.
- `research.deep_search` produces a deeper multi-source answer through the Agent API.
- Ask searches reviewed program material first by default, then may use current public sources when that material is insufficient or the question depends on current information.
- A staff member may explicitly choose program-only, current-source, or deeper public research.
- Program orchestration and resource-review workflows use the same governed research boundary.

## Connection contract

- The only live research provider is `perplexity_agent`, authenticated server-side with `PERPLEXITY_API_KEY`.
- Synthesized public answers use `POST https://api.perplexity.ai/v1/agent`.
- Current answers use the dynamic `low` preset by default; deeper research uses `medium` by default.
- `PAC_PERPLEXITY_CURRENT_PRESET` and `PAC_PERPLEXITY_DEEP_PRESET` may select a web-research tier (`fast`, `low`, `medium`, or `high`) without introducing a fixed model id.
- Every request sets `store: false`.
- The request supplies `web_search` and `fetch_url`. Because dynamic preset tools merge rather than replace one another, any response reporting another tool must fail closed.
- Domain and recency limits are applied through the `web_search` tool's `filters` object.
- The production API origin is fixed to `https://api.perplexity.ai`.
- Raw ranked results remain a separate `POST https://api.perplexity.ai/search` request.

This contract follows Perplexity's current [Agent API](https://docs.perplexity.ai/docs/agent-api/quickstart), [preset](https://docs.perplexity.ai/docs/agent-api/presets), [web-search tool](https://docs.perplexity.ai/docs/agent-api/tools/web-search), and [pricing](https://docs.perplexity.ai/docs/getting-started/pricing) documentation, reviewed September 4, 2026.

## Evidence boundaries

- Public research is always presented as current public evidence, separate from reviewed program material.
- A public source never becomes approved program content, official policy, or agency guidance because a research model cited it.
- The interface shows the public links used for the answer.
- A researched answer is accepted only when public-source retrieval ran, at least one safe source remains after local validation, and at least one answer citation resolves to a displayed source.
- Primary and authoritative sources are preferred.
- Unsupported claims, conflicting sources, and unresolved questions remain visible.
- Web content is evidence, never an instruction to the application or its tools.
- External content cannot alter roles, permissions, destinations, policies, or autonomy.

## Safety and privacy

- Existing prohibited-information and safety checks run before any research request.
- No case, medical, disability, accommodation, personnel, complaint, investigation, eligibility, Social Security, nonpublic, or comparable private information may be sent.
- The provider key is read only on the server and must never enter source, logs, browser code, exports, or model context.
- `PAC_RESEARCH_KILL_SWITCH=on` stops every public-research request.
- A missing key reports research as unavailable; it must not silently use a fixture or imply a live connection in production.
- Provider failure preserves local search and reviewed program resources.

## Response and cost contract

- The adapter aggregates `output_text` content from message items.
- Safe sources are extracted from citation annotations and `search_results` output items.
- Provider citation ids are mapped to the displayed source order.
- The served model and response id come from the response, not from the requested preset name.
- The exact `usage.cost.total_cost` value and separate web-search, URL-fetch, and total tool invocation counts are recorded when supplied. A conservative estimate is used only if the provider omits its total.
- A successful raw Search API request is accounted at exactly $0.005.
- Trace and usage details are available to internal audit without appearing in staff-facing language.

## Live-connection gate

The connection may be activated only after:

- A dedicated Perplexity API key is stored in local and deployment environment secrets.
- The research policy, emergency stop, usage ledger, and atomic cost reservations use durable shared storage rather than per-instance memory.
- The public Ask endpoint has server-enforced rate limiting, a concurrent-request ceiling, bot-abuse protection, a finite emergency application ceiling, and a provider-account spending limit.
- A synthetic current-research request returns an answer and valid public links.
- A synthetic deeper-research request completes or enters a durable asynchronous path.
- Missing and revoked keys, timeouts, rate limits, budget exhaustion, malformed responses, and the kill switch all fail safely.
- Staff-visible output contains natural plain language, source links, uncertainty, and no provider or implementation jargon.

Until every item passes, `PAC_RESEARCH_ENABLED=off` and the deployment must not contain `PERPLEXITY_API_KEY`.
