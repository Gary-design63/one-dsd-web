# Owner direction: OpenAI model routing

Status: Approved design and implementation requirement; not a production-completion claim.

The owner explicitly authorized the existing OpenAI API account to receive submitted ASK questions, relevant conversation context, and selected approved program resources or task context for ASK and Chief of Staff summaries. This supersedes the previous Anthropic primary-provider selection. API response storage remains disabled; application response and action receipts remain durable through the existing database boundary.

## Match the model to the task

Use direct current-resource navigation where no generated response is necessary. Calibrate Luna for straightforward work, Terra for everyday contextual guidance, Sol for deeper analysis, and Astra for the most demanding reasoning. Selection considers complexity, consequences, ambiguity and evidence, rather than question length alone. Stronger-model escalation must be bounded, observable and justified by an inadequate or failed result. A simple lookup must not be mistaken for a request for measurement advice.

## Exclusive owner authority

Only Gary Banks, the program owner acting through the owner/consultant access boundary, may select models or change routing, reasoning or override settings. Staff, equity directors, leaders, named contributors and other organizational users have no model-selection or model-override authority. A consultant label or a contributor role does not establish ownership. Automatic routing executes the owner-approved policy; it does not transfer model-control authority to an agent or another person.

Enforce this on the server as well as in the interface. Public ASK input, links, browser state and submitted content must not set provider IDs, model IDs, reasoning settings, or model overrides. There must be no staff-facing model picker. Check unauthorized direct requests and contributor permissions, not only whether a control is hidden.

## Completion evidence

Record selected models, attempts, failures/escalations, response time, reported usage and actual outcome. Do not claim that configuration or account model availability proves successful reasoning. Verify representative real requests, program routing, appropriate source references, durable responses, and owner-only controls before calling the production switch complete.
