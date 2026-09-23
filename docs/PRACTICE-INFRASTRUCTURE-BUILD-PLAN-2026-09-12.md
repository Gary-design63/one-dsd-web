# Practice infrastructure build plan: mapping, routing, and workflows

| Field | Value |
| --- | --- |
| Date | September 12, 2026 |
| Status | Build plan for owner authorization. Nothing in this plan is implemented until its acceptance evidence exists |
| Program | One DHS and One DSD People, Access and Culture |
| Authority | [Owner directive](OWNER-DIRECTIVE-2026-09-07.md), [operating charter](PROGRAM-OPERATING-CHARTER.md), [One DHS PRD v3.0](PRD-ONE-DHS-PAC-2026-09-11.md), [One DSD PRD v3.0](PRD-ONE-DSD-PAC-2026-09-11.md) |
| Sources being mapped | The equity infrastructure working paper (eight-system model, tiered review, curriculum scaffold) and the DEIA integration framework (Equity Lens Rubric, inclusive hiring protocol, community engagement planner, accessibility system, team guide, leadership dashboard, transparency portal, metrics framework) |
| Audience | Owner and build leads. Not staff-facing copy |

## 1. What this plan does

The program is strong as a learning and resource layer with ASK on top. The two source papers supply practice infrastructure: tools people use at the moment of a decision without the consultant in the room. This plan maps each usable tool to the program function and surface that should carry it, defines how a person or a question is routed to the right tool, and specifies the workflows those tools run, including the records and receipts each one leaves.

Three rules from the source analyses hold throughout. Tools are voluntary self-service, never mandated gates. No staff personnel data, demographic disaggregation, or individual scoring enters the application. No dates; every stage is gated by a condition and its evidence.

Stages are ordered, not scheduled. Dates, sprints, and percent-complete are deliberately absent.

## 2. Mapping: source tool to program home

Function identifiers are the runtime ones in `lib/program/model.ts`. "Home" names the module or route that carries the tool. State: **exists** (use as is), **extend** (add to an existing mechanism), **new** (new content in an existing mechanism; no new mechanism is proposed).

| Source tool | Program function | Home | State |
| --- | --- | --- | --- |
| Equity Pause (5 to 7 questions, routine decisions) | guided_practice, equity_analysis | New graduation path in `lib/content/paths.ts`, published through the practice-path surface; saves to the analysis register | new |
| Equity Lens Rubric (three checks, 13 points) | guided_practice, content_stewardship | New graduation path with the three checks as artifact fields and rubric rules; owner-side use in `/consultant/review` | new |
| Standard Equity Review (adapted toolkit) | equity_analysis | `/learn/equity-toolkit` companion and `/equity-policy/analysis` | exists |
| Equity Impact Review (major decisions) | equity_analysis, consultation | Documented path: analysis record plus `/support/request` heads-up to the decision owner | extend |
| Tiered review selection (which tier applies) | ask, guided_practice | Routing rule in `ROUTING_SIGNALS` and domain task metadata in `lib/domains/index.ts` | extend |
| DEIA Activity Inventory | program_coordination, equity_analysis | `/equity-policy/register` (analyses) plus Team work items; one owner view in `/consultant/program` | extend |
| Eight-system operating model | program_coordination | Crosswalk table on `/consultant/program` against the thirteen functions | new |
| Six-level curriculum scaffold and role pathways | learning, workforce_context | Internal ordering metadata for `WORK_AREAS` starting points and course suggestions in `/my-work/explore`; no displayed levels | extend |
| Meeting accessibility protocol | learning, resources | Job aid on course `di-inclusive-meetings-events-learning` | new |
| PDF, email, and document accessibility procedures | learning, resources | Job aid on `di-accessible-content-and-digital-learning` | new |
| Accommodation interactive process description | learning | Job aid on `di-accommodations-and-interactive-process` (explanatory; HR owns the process) | new |
| Interview accessibility and structured interviewing | learning | Job aid on `di-inclusive-supervision-and-team-culture`; hiring guidance resource in `/library` labeled as subject to HR policy | new |
| Position analysis and bias audit of requirements | guided_practice | Extend existing workforce path (domain `workforce`, task `design-role`) with the three-question test | extend |
| Hidden-curriculum examples (Check Two) | learning | Lesson examples in `di-inclusive-communication` and `di-language-and-respectful-interaction` | new |
| Tone guidance (Check Three) | content_stewardship | Reference in [STAFF-VOICE-STANDARD.md](STAFF-VOICE-STANDARD.md); lint vocabulary in `lib/brand/lint.ts` where it adds a checkable rule | extend |
| Co-creation session kit (purpose, participants, logistics, facilitation guide) | staff_engagement, community_context | Practice path used from `/one-dsd/team/workspace` and `/learn/community-connections` | new |
| Integration categories A to E and conflict protocol | staff_engagement | Fields on the Team work item and the commitment register | new |
| Commitment register ("You said, we did, we could not, next steps") | staff_engagement, consultation | Team workspace records plus `/support/track` and `/support/share-result` | extend |
| Structured problem-solving protocol | staff_engagement | Team work-item template | new |
| Community partner map and exploration conversation | community_context | Template resource in `/library`; no roster stored | new |
| Data inventory brief and data-to-action protocol | evaluation | Template resource; practice path for interpreting findings. No data system | new |
| Leadership decision brief (progress, metrics, decisions, resources) | program_coordination, evaluation | Owner program page section built from register, receipts, and open decisions | new |
| Four leadership behaviors | learning | `/one-dsd/leadership` content | new |
| Practitioner support risk tiers 1 to 7 | program_coordination | Agent tool permissions in `lib/intelligence/registry/agents.ts` and the tools catalog; user guide, never staff copy | extend |
| Assessment model (participation, learning, behavior, result) | evaluation | `/consultant/evals` reporting frame; already the charter's delivered, applied, observed triad | exists |
| Metrics philosophy (leading and lagging; four review questions) | evaluation | Quarterly review pattern in `model.ts` | exists |

Held, with the condition that releases each: compensation rates and stipend administration (budget and procurement authority), public transparency portal (DHS web and translation authority), salary rules and quoted DHS posting language (HR review), climate and pay-equity data systems (HR and Data authority; never in the application), executive sponsor and committee appointments (actual DSD decisions), Tribal consultation pathway (documented authority).

## 3. Routing: how a person or question reaches the right tool

Routing already exists in four places. The plan adds routing targets and one selection rule; it does not add a new router.

### 3.1 ASK

ASK suggests a practice path when a question matches a domain task (`askStarter`, `pathId`, `contentIds` in `lib/domains/index.ts`) or a routing signal (`ROUTING_SIGNALS` in `lib/content/paths.ts`). The work-area routing test already verifies question-only routing for the nine published task starters.

Additions:

| Signal in the question | Destination | Why |
| --- | --- | --- |
| Routine, reversible, limited reach (an invitation, an announcement, a posting, an internal notice) | Equity Pause path | Tier one |
| A new or revised program, policy, notice, procedure, contract, hiring practice, or technology change | Toolkit companion (Standard Review) | Tier two |
| Major policy, budget, procurement, service, technology, or structural change | Standard Review plus consultation heads-up (Impact Review) | Tier three; the decision owner, not the program, approves |
| A document, communication, or training material to check | Equity Lens Rubric path | Self-check |
| A meeting, event, or session to run | Meeting accessibility job aid; co-creation kit when community members are involved | Job aid first |
| A hiring step (description, screening, interview, references, offer) | Workforce path plus hiring guidance resource | Practice plus reference |
| A community question, feedback, or commitment | Co-creation kit and commitment register | Reach and return |
| An exact named resource | That resource | Unchanged rule: never divert an exact request into a generic path |

The tier rule is a suggestion with its reason shown. The person chooses. ASK's answer records which tool it suggested and why, as part of the existing durable ASK record.

### 3.2 Start, Guided Start, and Learning for your work

`WORK_AREAS` (nine areas) and `workAreaStartingPoint` supply task starters. Each new path is attached to the area and task it serves, so a person choosing "I am planning a meeting" or "I am rewriting a notice" lands on the right tool without ASK. The curriculum scaffold supplies internal ordering for the suggestions that follow a task (foundation before role-specific before complex), never a displayed level.

### 3.3 Support

`SUPPORT_DESTINATIONS` and right-person routing already send people to the office that owns a decision. The commitment register connects here: a person who shared a result or a request can see its status on `/support/track` without a login when tracking is enabled.

### 3.4 Courses to tools

Each Disability Inclusion course that gains a job aid links forward to the tool it prepares for (the meetings course to the meeting checklist and co-creation kit, the accessible content course to the rubric's Check One). Each tool links back to its course. `contentIds` on domain tasks carry both.

### 3.5 Sharing

Every tool and job aid is a page or an anchored section, so the share rule applies unchanged: a share link opens that tool only, in the sender's program view, with nothing personal attached.

## 4. Workflows

Each workflow names its actors, steps, the record it leaves, the receipt that proves it ran, and how failure shows. "Record" means content a person chose to save. "Receipt" means the operational proof required by the owner directive.

### W1. Equity Pause

- **Actor:** any staff member. Optional manager view if the person shares the result.
- **Steps:** describe the decision in one line; answer five to seven questions (who is affected and how differently, what is open to change, who decides, what access or language need applies, what evidence exists, what one alternative would reduce the barrier, what the person will do next); read the generated summary; keep it on the device, download, or save to the register with consent.
- **Record:** an analysis record of a new kind `pause` in the existing equity-analysis records store, with the same consent, disposition, and follow-up fields. No named parties; the existing `no_named_parties` rubric rule applies.
- **Receipt:** the save response and the register entry. A save failure returns the existing "your draft is still on this device" message; the failure is logged content-free.
- **Escalation:** the summary offers the Standard Review when answers indicate reach or irreversibility above tier one. Offer, not redirect.

### W2. Equity Lens Rubric self-check

- **Actor:** an author of a document, communication, or learning material; owner-side reviewers in `/consultant/review`.
- **Steps:** paste or describe the material; work through Check One (reading level, acronyms, alt text, contrast, headings), Check Two (explicit expectations, cultural assumptions, language plan, representation), Check Three (invitational tone, person-first or identity-first as the community prefers, acknowledged learning, asset framing); receive the 13-point score with the specific failed criteria and suggested rewrites; revise and re-score.
- **Record:** a rubric assessment record (scores by check, failed criteria, material title) saved only if the person chooses; otherwise device-local like practice artifacts.
- **Receipt:** register entry when saved. Reading-level and contrast checks that cannot run in the browser are reported as "check this with the named tool," never scored as passed.
- **Boundary:** the rubric is a self-assessment and the program's editorial standard. It is not an approval gate over division materials. WCAG 2.2 AA replaces 2.1 throughout.

### W3. Standard and Impact Review (existing, with the tier connected)

- **Actor:** the person doing the work; the decision owner; the consultant when invited.
- **Steps:** unchanged toolkit companion and `/equity-policy/analysis` walkthrough. For tier three, the walkthrough ends with the option to send a heads-up through `/support/request` when intake is enabled, carrying the analysis summary.
- **Record:** the existing `equity_analysis` record and follow-ups.
- **Receipt:** existing. Intake remains inactive until retention is decided (parent decision D-13); until then the tier-three handoff shows the honest unavailable notice.

### W4. Co-creation cycle and commitment register

- **Actor:** One DSD Team members, Amplify co-leads, staff planning engagement.
- **Steps:** define the purpose and the decision authority in one sentence; set participant criteria; check the accessibility and logistics list; run the session with the facilitation guide; capture themes, proposals, and every commitment in the session's own words; within the period the group sets, classify each recommendation A to E with a reason; publish the "You said, we did, we could not, next steps" note back to participants; update status until closed.
- **Record:** Team work item plus commitment entries with status (completed, in progress, delayed, under review), original wording preserved, decision owner named only when confirmed.
- **Receipt:** work-item history in the Team workspace; the returned note is the report-back evidence.
- **Boundary:** no participant profiles, no case detail, no personal stories copied from Amplify. Compensation shows as a proposed term until budget authority exists.

### W5. Team work-item cycle with the problem-solving protocol

- **Actor:** One DSD Team, voluntary.
- **Steps:** identify a real question; understand the process and affected people; examine evidence and resources; state the problem, what was tried, options, implications, and the decision; agree the proposed improvement and the authorized decision owner; try when authorized; review; retain, revise, or stop; carry forward.
- **Record:** the work item fields already specified in the One DSD PRD (question, scope, task, resources, evidence limits, contribution owner, decision owner, next check-in, outcome).
- **Receipt:** work-item history.
- **Boundary:** no volunteer assignment from a title; no dates until confirmed.

### W6. Agent pre-review with receipts

- **Actor:** Chief of Staff (`program_orchestrator`), `a11y_reviewer`, `librarian`; the owner as escalation.
- **Steps, by risk tier:** tier one, find the applicable tool, source, or template with citations; tier two, draft a checklist or summarize one source, labeled draft; tier three, compare resources and name the applicable tool with uncertainty stated; tier four, organize evidence for a Pause or rubric check; tier five, draft rubric feedback for a submitted draft for the owner's review. Tier six and seven remain owner-only or excluded.
- **Record:** the drafted feedback or comparison attached to the item it concerns.
- **Receipt:** an agent task receipt in the evidence store naming the input, the tool used, the output, and the outcome, including failures. Registry ceilings and tool permissions in `lib/intelligence/registry/agents.ts` are reconciled to these tiers with a receipt of the change.
- **Boundary:** no autonomous publication; no contact with people outside the task; no decisions on eligibility, personnel, or allocation.

### W7. Leadership decision brief and condition-based roadmap

- **Actor:** owner; division management as reader.
- **Steps:** the consultant program page assembles four sections from live data: progress by function (from receipts and the register), what is worth attention (aggregate tool use, commitments closed, open failures), decisions required with the owner's recommendation, and resources or dependencies. The roadmap lists stages from this plan with each stage's condition and evidence state.
- **Record:** a dated brief the owner can share.
- **Receipt:** the brief cites the records it was built from. No figure appears without a source; illustrative numbers from the source papers are excluded.

### W8. Course to job aid attachment

- **Actor:** owner and agents (authoring); staff (use).
- **Steps:** author each job aid from the accessibility, meeting, interview, and accommodation procedures in staff voice; attach to the named course as a related resource with exact placement; link forward to the tool it prepares for.
- **Record:** the resource and its placement.
- **Receipt:** resource-level receipt naming placement and provenance, per the multimedia standard.

### W9. Learning pathway logic

- **Actor:** Learning for your work; ASK.
- **Steps:** apply the six-level order (foundation, interpersonal practice, role application, complex decision, systems, stewardship) as internal ordering for suggestions after a task or role choice; keep every resource open regardless of order; reproduce the training-credit notice unchanged where completion appears.
- **Record:** none beyond existing local progress.
- **Receipt:** routing tests extended with the new destinations.

## 5. Records and boundaries

- New record kinds (`pause`, rubric assessment, commitment) reuse the existing records store, consent literal, disposition, and follow-up shapes. Device-local first; saving is a choice made at the action with a plain notice of what is saved.
- No new retention duration. The existing redaction, deletion, and retention behavior applies. Consultation intake stays inactive until D-13 is decided.
- Aggregate only: counts of tool uses, decisions changed, commitments closed. No per-person views, no rankings, no demographic fields.
- Staff-facing copy for every tool follows the staff voice standard; tier names, agent names, and this plan's vocabulary stay in the user guide and owner pages.

## 6. Build sequence, conditions, and acceptance evidence

| Stage | Build | Condition to start | Acceptance evidence |
| --- | --- | --- | --- |
| 1 | W1 Equity Pause path; W2 rubric path; register kinds; ASK tier routing signals | None | Path tests; register save and failure tests; routing test extended and passing; browser check at phone width; live check after deploy |
| 2 | W8 job aids on the four named courses; forward links to tools | None | Resource receipts with placement; course tests; internal-term lint clean |
| 3 | W9 ordering in Learning for your work; W3 tier-three handoff notice | None | Routing tests; the handoff shows the honest unavailable state while intake is inactive |
| 4 | W4 co-creation kit; W5 work-item template; commitment register in Team workspace and Support tracking | None | Workspace tests; a complete sample cycle recorded end to end in a local receipt |
| 5 | W6 agent pre-review tiers one to five; registry reconciliation | Receipt path verified end to end at stages 1 to 4 | At least one completed pre-review task with a receipt per agent involved; registry change receipt |
| 6 | W7 decision brief and condition roadmap on the owner program page | Stages 1 to 5 producing real records | Brief renders only from records; zero unsourced figures |
| 7 | Hiring guidance resource; engagement standard with compensation terms | HR review of salary and posting language; budget and procurement authority for compensation | Written review or authority recorded before publication |

Each stage deploys through `DEPLOY.md` and is complete only when step 6 live checks pass and step 7 evidence is written. The live-check workflow gains one line per new route.

## 7. How the multiplier is measured

Reported against a declared period, aggregate only, with limits stated:

- Tool uses (Pause, rubric, co-creation kit) and the share of those that ended in a saved decision or a changed draft.
- Decisions recorded in the register with a disposition and a decision owner.
- Commitments closed with a report-back note returned.
- Repeat consultations on comparable work, as a trend, never as a target that discourages asking.
- Agent pre-review tasks completed with receipts, and human interventions, failures, and exclusions listed beside them.

Delivered, applied, and observed change stay separate columns, as the charter requires.

## 8. Explicitly not in this plan

The ten-step sequential program with gate sign-offs; mandated use or protected hours; a Team of eight to ten with performance-plan accountability; climate, pay-equity, exit-interview, or discipline-pattern data in the application; a public transparency portal; any figure from the source papers; a rename of either program.
