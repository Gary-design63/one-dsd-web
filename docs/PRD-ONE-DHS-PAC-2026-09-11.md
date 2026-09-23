# One DHS People, Access and Culture — Product Requirements Document

| Field | Value |
| --- | --- |
| Version | 3.0 |
| Date | September 11, 2026 |
| Status | Current product baseline. Reconciles the September 4 Master PRD (v2.2) and Product PRD (v2.1) with the owner's September 7–11 direction and the application as it exists today |
| Program owner | Gary Banks, Equity and Inclusion Operations Consultant |
| Operating concept | DIGITAL MING (internal; see [owner directive](OWNER-DIRECTIVE-2026-09-07.md)) |
| Staff-facing brand | One DHS People, Access and Culture (unchanged) |
| Companion document | [One DSD People, Access and Culture PRD](PRD-ONE-DSD-PAC-2026-09-11.md), the pilot and proving-ground program |
| Audience | Program owner, Equity Directors and colleagues shaping the program, build and verification leads. Not staff-facing copy |

A requirement in this document is a statement of intent. It is not evidence that the acceptance check passed. Where this document says a capability is delivered, the receipt is named. Where a capability is on a branch, in progress, or deferred, it says so.

---

## 1. Bottom line

**What this is.** A self-directed resource, learning, and equity-practice program for roughly 4,000 Minnesota DHS staff. It extends the reach of the owner's Equity and Inclusion Operations practice so that staff can bring a real question, find relevant context, work through a useful example, prepare a practical next step, and return to what happened. The owner keeps the face-to-face relationships and the work that requires him personally.

**What it is not.** A case, complaint, personnel, or records system. A surveillance or ranking tool. A personal chatbot persona. A substitute for official policy, legal advice, civil-rights processes, or a person-specific decision. A performative content hub.

**Operating concept.** DIGITAL MING is the exact internal term for the digital partner that carries the owner's professional knowledge, judgment, and approach into the program at scale. The Chief of Staff coordinates and delegates work to agents and follows it through completion. The concept authorizes real work with observable receipts. It does not let the application speak as the owner personally or exercise official agency authority.

**Success.** Staff can do ordinary equity work without waiting for the consultant. Consultation intake gives the owner a heads-up before a meeting. Every agent action leaves an inspectable record. The application is deployed, verified live, and documented with evidence.

---

## 2. What changed since the September 4 package

The September 4 Master PRD, Product PRD v2.1, Ask MVP contract, and TRD remain preserved as sources. The owner directive of September 7 supersedes them where they conflict. This table records the effective changes so nobody reads the historical documents as current.

| Area | September 4 position | Current position |
| --- | --- | --- |
| Operating concept | "Mindset twin" as an internal reasoning layer | DIGITAL MING, exact term. A professional digital partner, with the Chief of Staff coordinating and completing authorized work |
| Autonomy | A0–A2 ceiling for the MVP; A5 as proposals only | Maximum autonomy inside the program. Target of 90–95% agent-driven work, measured against a declared task set and reporting period with receipts. Owner keeps stop, inspect, and reduce controls |
| Owner-curated content | Approved for intake; fresh editorial, AI, or human review before publication | Already approved. Record the existing approval; do not manufacture a new review round. Broken assets are still repaired with evidence |
| ASK persistence | Transient only; no server-side records | Durable, access-controlled records of question, response, sources, outcome, and receipt. Not shared conversational memory, not a scoring system. No new retention duration is invented |
| ASK breadth | Closed topic list; retrieval from the reviewed library only | Any question. Reasoning plus program resources plus external research when the question calls for it. Never claim research that was not performed |
| Research provider | Older research-key defaults | Perplexity API setup authorized. Sonar is excluded and must not return through a preset, fallback, or substitution |
| Owner access | Consultant sign-in | No authentication of any kind for the owner. Every page and every inline editing control opens directly. Never reintroduce a sign-in |
| Launch | Early 2027 as a ship slice | Early 2027 is a tentative horizon, not a committed date |
| Participation | Implicit | Voluntary across DHS, ADSA, and DSD. Completion does not count toward DHS-required training credits without an express exception from management, a director, or DHS leadership |
| Staff-record retention | 90 days suggested | Undecided. Real staff intake stays inactive until retention is settled with colleagues. Undecided is not permission for indefinite retention |
| Sharing | Not specified | Every page and resource is shareable by a link that opens that page or resource only (Section 6.7) |
| Visual design | One page at a time | Owner authorized a modern visual redesign across the program (September 8). Source content, workflows, published scope, open learning access, and the approved hero photograph are preserved |

---

## 3. Audiences and roles

| Role | What the program helps them do | Authority |
| --- | --- | --- |
| DHS staff exploring a question | Find understandable learning and practical resources without meeting internal system language | Use staff services |
| Staff improving a piece of work | Examine a meeting, notice, service handoff, recruitment decision, or other concrete practice; prepare a reasoned next step | Create their own work products; formal decisions stay with responsible officials |
| Supervisors and leaders | Prepare teams, decisions, climate responses, and implementation | Within their job authority |
| Equity Directors and equity professionals (about 39 colleagues, per the owner's account) | Shape operating decisions, steward local pages and pilots, contribute in assigned scope | Assigned scope only; a title never grants editing or publishing rights by itself |
| Program owner | Curate content, inspect records and receipts, direct and stop agent activity, deploy | Final program authority, within managed execution controls and any DHS agreements that apply |
| Chief of Staff (agent) | Coordinate, delegate, complete routine authorized work, report exceptions | Program coordination; no authority to contact people outside task scope, send official communications, or make HR, case, legal, or Tribal determinations |
| Cooperating agents | Do real tasks in every program area with receipts | Scoped tools, owner disable control, durable execution record |

---

## 4. Product principles

1. **Open, voluntary learning.** No prerequisite gates. Any published resource opens directly. Learning stages, guides, and practice paths are distinct from courses.
2. **Respect professional experience.** Warm, human, professional, helpful. Calling-in, not shaming. No motives inferred from identity.
3. **Preserve approved sources.** Original DHS and institutional text, attribution, revision history, and publication records stay intact. Program-authored companions sit beside originals.
4. **Context is not assumption.** Community knowledge prepares better questions. It never establishes an individual's language, identity, disability, orientation, or beliefs.
5. **Truthful status.** Authored, integrated, verified, published, and deployed are separate states. A setting, a draft, or a successful request is not a completed outcome.
6. **Observable work.** Every ASK response and agent task has a durable record the owner can inspect. Failures and degraded operations are recorded as such.
7. **Builder talk stays out of staff copy.** Corrections, limitations, and implementation decisions are resolved in the program, not published as explanations.
8. **Minimal, purposeful interface.** Every control serves a real purpose. Decision-relevant information (is this recorded, what does sharing do) appears at the action, in natural language.

---

## 5. Scope and delivery state

State as of September 11, 2026. "Live" means deployed to the production Vercel project and checked with the live-site workflow or the recorded DEPLOY.md receipts. "Branch" means implemented and tested on `claude/youthful-mendel-fbk166` and not yet merged to the deploy branch.

### 5.1 Live

| Area | Routes | Notes |
| --- | --- | --- |
| Entry and orientation | `/`, `/start`, `/guided-start`, `/about`, `/orientation`, `/paths` | Approved hero photograph preserved |
| Learning hub | `/learn`, `/learn/[stage]`, `/learn/intercultural`, `/learn/equity-toolkit`, `/learn/community-connections`, `/courses`, `/courses/[courseId]/[lessonId]` | 86 recovered courses (780 lessons) plus the 24-course program-authored Disability Inclusion series (Foundations, Applied, Practitioner, Strategic Leadership, Capstone). Live-check receipts recorded in PR #7 |
| Library and resources | `/library`, `/library/[id]`, `/resources`, `/resources/[id]` | Compatibility routes kept; many-to-many theme membership |
| Podcasts | Players on `/learn` and `/audio-library` | Two recordings with transcripts, passage search, chapter navigation |
| ASK | `/ask`, `/api/ask` | Broad questions; scoped published destinations; durable records at `/consultant/ask-records` |
| Minnesota communities | `/minnesota-communities`, `/minnesota-communities/[id]` | Progressive disclosure; no artificial sameness |
| Equity policy and framework | `/equity-policy`, `/equity-policy/analysis`, `/equity-policy/analysis/[id]`, `/equity-policy/register`, `/equity-framework`, `/operationalizing-equity` | Companion to the official toolkit; official sources remain authoritative |
| Practice | `/practice`, `/practice/[id]`, `/practice/measurement` | Guided practice with artifacts and self-checks |
| Support and consultation | `/support`, `/support/directory`, `/support/request`, `/support/right-person`, `/support/share-result`, `/support/track`, `/api/intake` | Intake is structured; real staff intake stays inactive until retention is decided |
| Personal continuity | `/my-work`, `/my-work/explore`, `/my-view` | Local saved work, progress, exports, delete-all |
| Organizational context | `/understanding-dhs`, `/employee-resource-groups`, `/areas`, `/domains` | Source-linked; historical references distinguished from current directories |
| Contribution | `/contribute`, `/contribute/access`, `/contribute/resources` | Named-contributor access; scoped drafts and release |
| Owner workspace | `/consultant/*` including program, library, resources, review, studio, registry, orchestrator, evals, research, audit, workforce, queue, ask-records, one-dsd-team | Opens without sign-in. Inline "Edit this page" on every page |
| Sharing | Share control on resources, courses, podcasts, and the footer | Merged in PR #8 and verified live September 11 (runs 34612905911 and 34614341498). Share-by-email test delivered through the app's Resend route |
| Deployment verification | GitHub Actions "Live site checks" and "Share-link test" workflows | Receipts acceptable for DEPLOY.md step 6 when the deploying machine cannot reach the live host |

### 5.2 On the working branch, not yet deployed

| Item | State |
| --- | --- |
| Share control in the site header on every page | Implemented, tested |
| Dedicated podcast pages `/podcasts/[id]` with metadata, player, chapters, transcript | Implemented, tested locally (200 for known ids, 404 for unknown) |
| Staff-guide paragraph describing sharing | Authored in the "How to use this program" guide |
| CI verification repairs | Evidence directories created before writes, PostgreSQL socket directory for non-root runners, migration test expectation for the September 10 About lede, donor-library manifest byte count, regenerated document vectors for the expanded corpus |

### 5.3 Open and deferred

| Item | Why |
| --- | --- |
| `verify:ci` build-command expectation versus the September 9 urgent-publish build script | Owner decision needed: restore `build:vercel`, gate the urgent script, or accept both |
| Node 24 requirement for local verification | The development container ships Node 22; verification runs on GitHub runners |
| Real staff intake, consultation storage, and retention | Retention undecided; participatory resolution required |
| Ecosystem metric registry, comparative dashboards, composite scores | Hard gates (charter, privacy, Tribal, dual-rating); composite scores refused always |
| Direct DHS system integrations | Separate security, privacy, legal, records, and architecture decision |
| Enterprise representation as an official DHS system | Written ownership and operating agreement first |
| Second-brain workspace | Local server and API tests exist; combined workspace blocked by execution controls |
| Podcast `href` fields pointing at the new podcast pages for ASK destinations and media previews | Noted for a follow-up pass |

---

## 6. Functional requirements

Each requirement has an identifier, a rule, and the evidence that satisfies it. Identifiers continue the STAFF-xx series from v2.1 where the intent is unchanged and add DHS-xx rows for new direction.

### 6.1 Begin and navigate

| ID | Requirement | Evidence |
| --- | --- | --- |
| STAFF-01 | Home orients a new user to a useful next action without internal system language | Moderated review; copy lint finds no builder vocabulary |
| STAFF-02 | Guided Start recommends a route by need, role, work moment, and desired outcome; recommendations explain why they fit and remain optional | Route tests; recommendations resolve only against the scoped published collection |
| DHS-01 | `/learn` is the single primary entry for learning and resources; `/library` and `/resources` URLs keep working | Route tests for compatibility paths |
| DHS-02 | Program view (One DHS or One DSD) is carried by the `pac_context` cookie and the `view` address parameter; One DSD sees One DHS content plus its own | Federation tests |

### 6.2 Learn and apply

| ID | Requirement | Evidence |
| --- | --- | --- |
| STAFF-04 | Every published course appears as an introductory tile with the original title, a brief program-authored description, and a relevant photograph, and opens the complete resource | Tile inventory equals published course inventory |
| DHS-03 | Each newly authored lesson has three to five observable objectives with explanation, examples, practice, and feedback. This is an authoring rule, not a claim that all 780 recovered lessons already comply | Authoring checks on program-authored courses; gap analysis retained |
| DHS-04 | No arbitrary level labels; no course completion required before any resource | Route tests; no gating logic |
| DHS-05 | The shared training-credit notice appears wherever completion is shown, unchanged | `lib/program/learning-credit.ts` reproduced verbatim |
| DHS-06 | The intercultural journey never labels a person's IDI orientation or infers movement from activity | Copy and logic review |
| DHS-07 | Podcasts are played by staff; authoring belongs to the owner, the Chief of Staff, and agents. No staff authoring controls | Interface review |

### 6.3 ASK

| ID | Requirement | Evidence |
| --- | --- | --- |
| STAFF-09 | ASK answers any question using reasoning, program resources, and external research when configured; sources and limits visible; human escalation offered when judgment is required | Full-response tests; 25 named DSD destinations regression |
| DHS-08 | Every response has a durable record: question, response, source references, outcome, receipt identifier. A hash alone is not a record | `/consultant/ask-records`; persistence tests |
| DHS-09 | Persistence failure is recorded and visible; a displayed answer is not proof it was saved | Failure-path tests |
| DHS-10 | Withdrawn, unavailable, or out-of-scope resources are never presented as available | Scoped destination tests |
| DHS-11 | Research uses the authorized Perplexity configuration with supported models and citation validation. Sonar is rejected explicitly | Configuration tests; model allowlist |
| DHS-12 | ASK never claims research or a source it did not use | Response validation |

### 6.4 Support and consultation

| ID | Requirement | Evidence |
| --- | --- | --- |
| STAFF-10 | Intake captures program stage, goals, equity questions, and desired outcome before any calendar handoff; the owner receives a structured heads-up | Intake tests; queue view |
| STAFF-11 | Self-directed paths cue an independent next action before an optional consult | Path review |
| DHS-13 | The interface states what is saved or shared at the action where it matters, in plain language | Copy review |
| DHS-14 | Durable submission features depend on actual configured delivery and storage; unconfigured routes degrade visibly, not silently | Route tests (for example, the request-support route saves and reports when email is unconfigured) |

### 6.5 Editing, publication, and content stewardship

| ID | Requirement | Evidence |
| --- | --- | --- |
| DHS-15 | Owner opens every page and every inline editing control with no sign-in | `lib/auth/request.ts` returns owner access; live check of `data-pac-editor` on the home page |
| DHS-16 | Owner-curated content publishes without a new review round; the existing approval is recorded with owner, scope, date, and item | Publication path tests; no review-record demand for approved surfaces |
| DHS-17 | Original source bytes, revision history, and withdrawal records are preserved on every edit | Editable-surface migration tests |
| DHS-18 | Broken assets, links, and inaccessible interactions are repaired with evidence; approval does not make a broken asset functional | Smoke-test receipts |
| DHS-19 | Staff-facing writing follows the staff voice standard; owner and builder discussion never becomes staff copy | Internal-term lint; copy review |

### 6.6 Agents, Chief of Staff, and receipts

| ID | Requirement | Evidence |
| --- | --- | --- |
| DHS-20 | Every agent area has at least one completed task with a receipt; registry entries, mocks, or plans alone do not count | Agent task receipts in `evidence/` |
| DHS-21 | The 90–95% agent-driven target is reported against a declared eligible task set and period, with independent completions, assisted completions, human interventions, failures, and exclusions listed separately | Periodic report |
| DHS-22 | The owner can stop, inspect, or reduce activity at any time | Orchestrator controls |
| DHS-23 | Registry ceilings, review-rule metadata, disabled adapters, and cycle behavior that ends at proposals are reconciled with the current direction, with receipts | Registry audit |
| DHS-24 | Agents do not contact people, send outside communications, make HR, case, or complaint determinations, speak for a Tribal Nation, or exercise official DHS powers | Tool scope tests |

### 6.7 Sharing

| ID | Requirement | Evidence |
| --- | --- | --- |
| DHS-25 | A share link opens that specific page or resource only. It keeps the path, an in-page anchor, the One DSD view when that is the sender's view, and only the filters that define a list page. It drops work-area origin, typed questions, and every other parameter | `tests/share-link.test.ts`; live runs 34612905911 and 34614341498 |
| DHS-26 | The share control is available on every page (header on the branch; footer, resources, courses, and podcasts live) and offers copy and email | Component tests; browser check |
| DHS-27 | Each podcast has its own shareable page with metadata for link previews | `tests/podcast-pages.test.tsx` (branch) |
| DHS-28 | The staff guide explains sharing in one plain paragraph; no other page carries system instructions about it | Corpus entry `lm-how-this-program-works` (branch) |

### 6.8 Multimedia

| ID | Requirement | Evidence |
| --- | --- | --- |
| DHS-29 | Media is chosen for the exact resource and a clear learning purpose; a decorative image on a category is not a resource-level implementation | Resource-level receipts naming placement and delivered medium |
| DHS-30 | Representational imagery is photorealistic; disability may be visible or nonvisible and never defaults to wheelchair imagery; no invented documentary photographs or implied endorsements | Media review |
| DHS-31 | Synthetic audio is identified as such and never imitates a real staff member, accent, or disability; transcripts are complete; no autoplay | Media review; transcript tests |
| DHS-32 | Blender is excluded from this initiative | Tooling review |

---

## 7. Non-functional requirements

| Area | Requirement |
| --- | --- |
| Accessibility | WCAG 2.2 AA across staff, contributor, owner, and generated artifacts. No icon-only or symbol-only controls, status, or navigation. Keyboard and assistive-technology paths for every interaction, including transcript seeking and chapter navigation. Usable at phone width with no horizontal scroll |
| Privacy | No case, eligibility, medical, disability, personnel, complaint, investigation, or comparable PII required or retained in staff learning. No employee ranking, belief profiling, or compliance scoring. ASK records live behind the owner boundary and are not exposed to other staff |
| Retention | Applicable redaction, deletion, and retention behavior preserved. No new duration is set by this document |
| Security | Server secrets never reach the client (the environment contract lists forbidden `NEXT_PUBLIC_` names). Managed execution controls of the hosting and coding environments remain in force; the owner's authority does not disable them |
| Model independence | Models, hosting, storage, search, and media services remain replaceable through configuration, not staff-route rewrites |
| Performance and reliability | Primary journeys return 200 on the live site; the hosted test suite runs in the production build; a build that skipped tests from cache is not a passing suite |
| Content integrity | After any published-content edit, the public document vectors are rebuilt or ASK degrades to keyword-only retrieval |

---

## 8. Operating model

The [program operating charter](PROGRAM-OPERATING-CHARTER.md) and [operationalizing-equity foundation](OPERATIONALIZING-EQUITY.md) define how the program produces value:

1. Identify a real question, barrier, or work need.
2. Find relevant evidence, organizational context, and resources.
3. Produce or improve a useful answer, work product, learning experience, or support action.
4. Apply it in the work through the responsible person or an authorized agent.
5. Review what happened and retain, revise, connect, support, or stop.
6. Carry useful knowledge and decisions into the next comparable task.

Delivery, application, and benefit are distinct kinds of evidence. A passing test, a click, a course completion, or a saved self-check does not establish improved practice. Fewer consultations alone does not establish independence.

Planning patterns (monthly team meeting, open hours, quarterly review, annual refresh) are patterns, not confirmed schedules. Preparing an agenda is not a meeting.

---

## 9. Success measures and release gates

The v2.1 launch KPIs (KPI-01 through KPI-12) remain in force with these updates:

| KPI | Update |
| --- | --- |
| KPI-07 (mindset workflows must-pass) | Reframed as: every agent area shows at least one completed task with a receipt, and the ASK record path passes its persistence and failure tests |
| KPI-10 (browser-flow gate) | Extended: the live-site workflow and share-link workflow pass on the deployed head, and the DEPLOY.md step 7 evidence is written |
| New KPI-13 (observable work) | Any agent completion claimed without a matching receipt blocks the autonomy report |
| New KPI-14 (sharing) | Any share link that carries personal context, or that opens a different resource than the one shared, blocks release |
| New KPI-15 (owner access) | Any sign-in gate on any page or editing control blocks release |

Release gates (product, ownership, content, accessibility, security and privacy, operations) are unchanged from v2.1 Section 15.2, with one clarification: the content gate for owner-curated material is satisfied by the recorded existing approval, not by a new review.

---

## 10. Deployment and verification

`DEPLOY.md` is the binding pathway. A deployment is complete only when its step 6 live checks pass and step 7 evidence is written. Facts that matter:

- Production is the Vercel project `one-dhs-pac`, Git-connected to branch `pac/one-dhs-pac-app`.
- The build runs the full hosted test suite. A "Ready" deploy that finished in under a minute skipped tests from cache.
- Two on-demand GitHub Actions workflows provide runner-based receipts: "Live site checks (DEPLOY.md step 6)" and "Share-link test (three resources, emailed to the owner)". The second reads the share rule from the deploy branch so it runs correctly from `main`.
- The owner's request-support route sends email through the owner's Resend account. Resend's response is logged at runtime and is the delivery receipt.

---

## 11. Decision log

| ID | Decision | Owner | Status |
| --- | --- | --- | --- |
| D-02 | Agencywide operating model, IP, and stewardship for the protected practice layer | Owner with DHS sponsors and legal as assigned | Open, hard gate for enterprise representation |
| D-05 | Ecosystem charter, prohibited uses, privacy, Tribal gates for any comparative analytics | Owner with data, privacy, and Tribal partners | Open, hard gate |
| D-12 | Tribal and enterprise representation and branding permissions for any official DHS claim | Owner with DHS and Tribal authorities | Open, hard gate |
| D-13 | Staff-record retention period for consultation and intake | Owner with colleagues | Open; intake inactive until decided |
| D-14 | `verify:ci` build-command expectation versus the urgent-publish build script | Owner | Open |
| D-15 | Merge the working branch (header share control, podcast pages, CI repairs) to the deploy branch and deploy | Owner | Ready when authorized |
| D-16 | Confirm feature prominence on Learning against the full inventory before further reorganization | Owner | Open |

Closed by the September 7 directive: repeat approval of owner-curated content, the A0–A2 ceiling, the transient-ASK rule, the Sonar option, and the consultant sign-in.

---

## 12. Risks

| # | Risk | Mitigation |
| --- | --- | --- |
| 1 | Application is mistaken for the whole program, or for the owner personally speaking | Keep the face-to-face role explicit; label automated responses accurately; DIGITAL MING stays internal |
| 2 | Autonomy target drives activity over judgment | Measure with receipts; count completions only; owner stop control |
| 3 | Records become surveillance | Owner-boundary access; no scoring; no cross-staff exposure; retention decided with colleagues |
| 4 | Builder discussion leaks into staff copy | Staff voice standard; internal-term lint; guide holds instructions |
| 5 | Content sprawl and stale guidance | Progressive disclosure, lifecycle, evidence-based prioritization |
| 6 | A "deployed" claim without verification | DEPLOY.md steps 6 and 7 are mandatory; runner workflows provide receipts |
| 7 | Ownership and Tribal gates treated as resolved | Decision log keeps them open and blocking for enterprise claims |

---

## 13. Definition of done for the tentative early-2027 launch

1. Section 5.1 items remain live and green on the current deployed head; Section 5.2 items are merged, deployed, and verified.
2. STAFF-01 through STAFF-11 and DHS-01 through DHS-32 pass, or carry an owner-approved exception with a remediation date. Exceptions cannot waive privacy, ownership, or prohibited-PII gates.
3. Every agent area shows a completed task with a receipt, and the first autonomy report is produced against a declared task set.
4. Retention (D-13) is decided before real staff intake opens.
5. DEPLOY.md step 7 evidence exists for the launch head.
6. D-02, D-05, and D-12 are either closed or explicitly kept out of any enterprise claim.

---

## Appendix A. Sources of authority

Primary: [OWNER-DIRECTIVE-2026-09-07.md](OWNER-DIRECTIVE-2026-09-07.md), [PROGRAM-OPERATING-CHARTER.md](PROGRAM-OPERATING-CHARTER.md), [OPERATIONALIZING-EQUITY.md](OPERATIONALIZING-EQUITY.md), [LEARNING-COORDINATION-2026-09-08.md](LEARNING-COORDINATION-2026-09-08.md), [STAFF-VOICE-STANDARD.md](STAFF-VOICE-STANDARD.md), [DESIGN-RENEWAL-2026-09-08.md](DESIGN-RENEWAL-2026-09-08.md), [MULTIMEDIA-AUTHORING-STANDARD-2026-09-09.md](MULTIMEDIA-AUTHORING-STANDARD-2026-09-09.md), `DEPLOY.md`, and the root `PRD.md` delivery record of September 9.

Historical, preserved unchanged: the September 4 package in `data/source-snapshots/local/prd-package-named-zip.json` (Master PRD v2.2, Product PRD v2.1, Ask MVP contract, Community Intelligence contract, TRD, tools catalog, intake and queue, graduation paths, staff copy pass, canonical source freeze).

## Appendix B. Relationship to the One DSD document

One DSD People, Access and Culture is the pilot and proving ground, selected by the owner and DHS leadership according to the owner's account. It inherits everything in this document. Its own PRD covers what is specific to the division: the One DSD entry map, program profiles and scenarios, leadership development, the One DSD Team, Amplify Equity, the Learning Lab, and the pilot evaluation standard. Where the two documents differ, the One DSD document governs One DSD scope and this document governs shared scope.
