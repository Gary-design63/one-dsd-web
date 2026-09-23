# One DSD People, Access and Culture — Product Requirements Document

| Field | Value |
| --- | --- |
| Version | 3.0 |
| Date | September 11, 2026 |
| Status | Current product baseline for the division pilot. Reconciles the September 4 One DSD operating model and the September 6 Workforce and One DSD Team addendum with the owner's September 7–11 direction and the application as it exists today |
| Program owner | Gary Banks, Equity and Inclusion Operations Consultant |
| Operating concept | DIGITAL MING (internal; see [owner directive](OWNER-DIRECTIVE-2026-09-07.md)) |
| Staff-facing brand | One DSD People, Access and Culture (unchanged) |
| Parent document | [One DHS People, Access and Culture PRD](PRD-ONE-DHS-PAC-2026-09-11.md). Everything there applies here. This document adds what is specific to the division |
| Audience | Program owner, DSD leadership and colleagues shaping the pilot, One DSD Team members as appropriate, build and verification leads. Not staff-facing copy |

A requirement here is a statement of intent, not proof that its check passed. Delivered items name their receipt. Branch, in-progress, and deferred items are labeled.

---

## 1. Bottom line

**What this is.** The division-specific pilot and reference implementation of One DHS People, Access and Culture, serving roughly 180 Disability Services Division staff. The owner describes One DSD as the proving ground selected by him and DHS leadership and developed in tandem with the agencywide program. This document records that account; it does not claim independently verified agency endorsement.

**Why a separate document.** One DSD carries content and routines the agencywide program does not: the division entry map, restored program profiles and practice scenarios, leadership development across the employee life cycle, the voluntary One DSD Team, Amplify Equity, and the Learning Lab. It is also where operating patterns are tried first, so its evidence informs how the shared program is contextualized and scaled.

**What it is not.** A parallel program with its own brand, a mandatory participation scheme, a roster of named volunteers, a staff engagement channel that replaces management, or an implementation owner for every question that Amplify raises.

**Success.** DSD staff can bring a real question about assessment access, documentation burden, a person's stated goals, or the meaning of complete records and find a usable next step. The One DSD Team does bounded practical work and reports back what happened. The pilot produces actionable evidence about what is inaccessible, outdated, missing, confusing, or hard to apply, without ranking anyone.

---

## 2. Relationship to One DHS

| Aspect | Rule |
| --- | --- |
| Content inheritance | The One DSD view shows all One DHS published content plus One DSD content. Federation resolves `one_dsd` to the scopes `["one_dhs", "one_dsd"]` |
| Publication | Two-scope publishing stays as it is until a tested replacement exists. A One DSD steward edits One DSD scope; shared changes follow the shared program's rules |
| View persistence | The `pac_context` cookie and the `view=one_dsd` address parameter carry the view. A share link made from the One DSD view carries `view=one_dsd` so the recipient sees the same content |
| Naming | "One DSD People, Access and Culture" in staff-facing copy. DIGITAL MING remains internal |
| Evidence | Pilot findings feed the shared program's quarterly review pattern once that review is confirmed with colleagues. They do not decide whether the agencywide program exists |

---

## 3. Audiences and roles

| Role | What the program helps them do | Authority |
| --- | --- | --- |
| DSD staff | Connect divisional program knowledge, accessible services, and practical scenarios with their own work | Use staff services |
| DSD supervisors and managers | Prepare teams, decisions, and implementation; use leadership development tools | Within job authority; retain decision authority over accepted work |
| One DSD Team members (about 20, per the owner; no roster is recorded) | Contribute experience, examine processes, review resources, test practical changes, and return what was learned | Voluntary contribution; no one is assigned work from a job title alone |
| Amplify Equity participants and co-leads | Raise working-condition questions, share ideas, mentor, carry agreed questions to a decision owner, and return the response | Staff-directed; co-leads carry only agreed questions with minimal identifying detail |
| DSD leadership | Sponsor the pilot, decide dispositions, set conditions for expansion | Official decisions stay with responsible officials |
| Equity and Inclusion Operations Consultant | Substantive program direction for the Team; face-to-face consults | Practice authority; not an approval body over owner-curated content |
| Chief of Staff and agents | Prepare agendas, connect resources, record outcomes, complete authorized tasks | No authority to schedule people, send invitations, or contact anyone outside task scope |

---

## 4. Product principles specific to One DSD

1. **Cover the division broadly.** The Team's remit is doing and growing across DSD work, not a referral channel for Amplify.
2. **Reciprocity on both pages.** The Team page and the Amplify page each explain how a question reaches a decision owner and how a response returns.
3. **Real work, real records.** Each accepted item keeps its question, scope, task, resources, evidence limits, contribution owner, decision owner, next check-in, and outcome. No case records, personal complaints, or participant profiles.
4. **Context is not diagnosis.** Program profiles and scenarios prepare better questions about services. They never establish what any individual person needs.
5. **No invented schedule.** A monthly rhythm beginning January 2027 is the owner's planned pattern once ready, alternating practical work with optional Learning Labs and open hours. No exact dates or starting format are assigned until confirmed.
6. **External spaces stay external.** The Amplify Equity Microsoft Teams community and the personal One DSD Team community are separate from the application. A link is not an integration.

---

## 5. Scope and delivery state

State as of September 11, 2026. Definitions of live, branch, and deferred follow the parent document.

### 5.1 Live

| Area | Routes | Notes |
| --- | --- | --- |
| Division entry | `/one-dsd` | Entry map shows only profiles already visible in the scoped inventory; each program connects to a concrete work question |
| Program profiles | `/one-dsd/programs/[id]` | All 12 restored profiles retain their original source fields |
| Practice scenarios | `/one-dsd/scenarios/[id]` | All 13 restored scenarios keep situation, what to notice, questions before acting, practical moves, and who to involve |
| Leadership development | `/one-dsd/leadership` | Spans the employee life cycle; examples kept separate from the learner's own reflection and exported plan; no promise of advancement |
| One DSD Team | `/one-dsd/team`, `/one-dsd/team/workspace`, `/one-dsd/team/learning-lab`, `/api/one-dsd/team` | Editable team page; Learning Lab reuses the local idea-draft tool and sends no messages |
| Amplify Equity | `/one-dsd/amplify`, `/co-leads`, `/gatherings`, `/ideas`, `/materials`, `/mentoring`, `/well-being` | Staff-directed; explains reach-and-return |
| Learning for your work | Connected from My Work and the Team page | Ten program-authored work categories, four task starting points, many-to-many resource associations; deterministic matching, not adaptive personalization |
| Orientation and ERGs | `/orientation`, `/employee-resource-groups` | Orientation connects DHS context, operationalizing equity, DSD, learning, practice, Amplify, Team, ERGs, ASK, and support. ERG guide separates current public references, historical names, and the MMB statewide directory |
| ASK for DSD | `/ask` | Exact named-resource queries keep the correct DSD destination through the complete response; regression covers all 25 restored named DSD destinations |
| Owner workspace for the Team | `/consultant/one-dsd-team`, `/consultant/workforce`, `/consultant/workforce/[areaId]` | Narrative organizational inventory with source links; not a staff roster |
| Sharing in the One DSD view | Share control on resources, courses, podcasts, and the footer | Live check September 11: the podcast share link from the One DSD view resolved to `/learn?view=one_dsd#podcast-equity-toolkit` with no personal context (run 34614341498) |

### 5.2 On the working branch, not yet deployed

Same as the parent document: header share control on every page, dedicated podcast pages, the staff-guide sharing paragraph, and CI verification repairs. Podcast pages honor the One DSD view (`/podcasts/[id]?view=one_dsd`).

### 5.3 Open and deferred

| Item | Why |
| --- | --- |
| Complete DSD organizational map (areas, positions, responsibilities, tasks, competencies, permissions) | Public directory plus selected classification references cannot establish a complete inventory; local confirmation required |
| Administration and division-level permissions and an editable organizational map | Not implemented; existing two-scope publishing remains |
| The owner's ADSA permission exception | Specific permission-design question; no administration-wide exception is inferred |
| Optional context passed to ASK with explicit consent | Requires consent design and practitioner-reviewed relevance examples |
| Verified current DHS ERG roster and joining arrangements | Unverified; page shows sources beside claims |
| One awaiting item in the DSD multimedia map | Needs an actual chosen ERG contribution before a recording exists |
| External Amplify Teams community verification | Verify separately when in scope |

---

## 6. Functional requirements

Identifiers use the DSD-xx series. Shared requirements (STAFF-xx, DHS-xx) apply unchanged.

### 6.1 Division entry, profiles, and scenarios

| ID | Requirement | Evidence |
| --- | --- | --- |
| DSD-01 | The entry map lists only program profiles present in the scoped published inventory; an archive entry alone does not surface a profile | Scoped publication tests |
| DSD-02 | Each profile connects the program function to at least one concrete equity question (access to assessment, stated goals, documentation burden, complete records) | Content review |
| DSD-03 | Scenarios retain their original fields and never populate personal fields or create a hidden submission | Original-field comparison tests |
| DSD-04 | Profiles and scenarios distinguish verified policy obligations from optional learning | Copy review |

### 6.2 Leadership development

| ID | Requirement | Evidence |
| --- | --- | --- |
| DSD-05 | Leadership learning covers the employee life cycle with development and continuity tools | Route and content review |
| DSD-06 | Examples remain separate from the learner's own reflection and exported plan | Component tests |
| DSD-07 | Copy does not promise advancement or replace selection, HR, accommodation, or labor-relations authority | Copy review |
| DSD-08 | Internal Office of Employee Culture Emerging Leaders materials are not requested or reproduced; the public-source analysis stays available | Documented boundary |

### 6.3 One DSD Team

| ID | Requirement | Evidence |
| --- | --- | --- |
| DSD-09 | The Team page describes the work cycle: identify a real question, understand the process and affected people, examine evidence and resources, agree a proposed improvement and decision owner, try when authorized, review, retain or revise or stop, continue | Page content |
| DSD-10 | Each accepted work item records question, scope, task, resources, evidence limits, contribution owner, decision owner, next check-in, and outcome; no case records, complaints, or participant profiles | Workspace schema and tests |
| DSD-11 | No dates are published until confirmed; no volunteer work is assigned from a job title alone | Copy review; no scheduling logic |
| DSD-12 | The Learning Lab produces a draft using the existing idea-draft tool; it does not send messages or create meetings | Route tests |
| DSD-13 | General meetings, open hours, and between-meeting contributions are described as planning patterns until an operational record shows they occurred | Copy review |

### 6.4 Amplify Equity

| ID | Requirement | Evidence |
| --- | --- | --- |
| DSD-14 | Amplify remains staff-directed; co-leads carry only agreed questions with minimal identifying detail; the response returns to the participant | Page content |
| DSD-15 | The Team may consider an Amplify question but is not automatically its implementation owner | Page content |
| DSD-16 | No bulk copying of engagement conversations, transcripts, or personal stories into the application | Data-path review |
| DSD-17 | The external Microsoft Teams community is described as separate; its state is verified independently when in scope | Copy review |

### 6.5 Learning for your work and organizational context

| ID | Requirement | Evidence |
| --- | --- | --- |
| DSD-18 | Task matches precede role matches; duplicates removed; only scoped published resources returned | Matching tests |
| DSD-19 | Query choices are optional and grant no access; no identity or organizational membership is inferred | Logic review |
| DSD-20 | Classification descriptions are references, not a person's actual authority; missing role data is not a deficit | Copy and logic review |
| DSD-21 | Externally discovered organizational changes become reviewable proposals, never automatic facts | Consultant workspace behavior |
| DSD-22 | Stable identifiers outlast display names; a reorganization preserves dated relationships; a vacancy is a position state, not removal of responsibilities | Organizational model (open work item) |

### 6.6 ASK and sharing in the One DSD view

| ID | Requirement | Evidence |
| --- | --- | --- |
| DSD-23 | All 25 restored named DSD destinations resolve correctly through the complete ASK response | Regression suite |
| DSD-24 | Recommended links match available scoped destinations; withdrawn links never return through fallback suggestions | Destination tests |
| DSD-25 | Share links made from the One DSD view carry `view=one_dsd` and nothing personal | `tests/share-link.test.ts`; live run 34614341498 |

---

## 7. Pilot evaluation standard

The pilot decides how the shared program is contextualized, supported, improved, and scaled. It does not decide whether the agencywide program exists.

| Question | Evidence that answers it |
| --- | --- |
| Can DSD staff find trusted support faster? | Moderated task success on Home, One DSD entry, and ASK |
| Do they understand how to use it and apply it to real work? | Voluntary participant accounts with source, change described, time period, and limits |
| Can they tell when human authority is required? | Escalation paths visible; intake used appropriately |
| What is inaccessible, outdated, missing, confusing, or hard to apply? | Recorded dispositions with owners and review dates |
| Did the Team's bounded work produce a change? | Work-item outcomes; delivery, application, and benefit evidence kept distinct |

Evaluation examines program support and practice, never employee beliefs or individual performance. An empty evidence set means no evidence in that record, not that nothing happened elsewhere.

---

## 8. Privacy and boundaries specific to One DSD

- No case, eligibility, service-authorization, medical, disability, or personnel information is required or retained in any DSD route.
- Team work items and Amplify questions carry minimal identifying detail; participant profiles are not stored.
- Optional contributor recordings require an actual chosen contribution and attribution; no one is asked to represent a whole community.
- Consultation and any staff-result collection stay inactive until retention is decided with colleagues (parent decision D-13).
- No official DHS access, live database migration, or organizational-system change is implied by any DSD increment unless its own receipt says so.

---

## 9. Decision log

| ID | Decision | Owner | Status |
| --- | --- | --- | --- |
| DSD-D1 | Confirm the monthly rhythm's start and format once ready (planned January 2027) | Owner with DSD colleagues | Open; no dates published |
| DSD-D2 | Administration and division-level permission model and the ADSA exception | Owner | Open |
| DSD-D3 | Complete and locally confirm the DSD organizational inventory | Owner with local knowledge | Open |
| DSD-D4 | Consent design for optional context passed to ASK | Owner | Open |
| DSD-D5 | Verify the current DHS ERG roster and joining arrangements | Owner | Open |
| DSD-D6 | Verify the external Amplify Teams community when in scope | Owner | Open |

Closed by owner direction: the request for internal Emerging Leaders materials; the generic prohibition on any planned cadence (superseded by the specific January 2027 planning pattern).

---

## 10. Risks

| # | Risk | Mitigation |
| --- | --- | --- |
| 1 | The Team becomes an Amplify referral desk | Broad divisional remit stated on the page; reciprocity explained on both pages |
| 2 | A planning pattern is read as a schedule or an assignment | No dates until confirmed; operational records required for any claim that a meeting occurred |
| 3 | Work items drift toward case detail or personal complaints | Work-item fields exclude them; data-path review |
| 4 | Classification references are treated as real authority | Copy states they are references; organizational model keeps proposed and confirmed states distinct |
| 5 | The pilot is read as a leaderboard for DSD | No composite scores; evaluation examines program support, not people |
| 6 | Owner's account of leadership selection is presented as verified endorsement | This document records the account as the owner's; enterprise claims wait on the parent hard gates |

---

## 11. Definition of done for the pilot's tentative early-2027 start

1. Section 5.1 items remain live and green; Section 5.2 items are merged, deployed, and verified.
2. DSD-01 through DSD-25 pass, or carry an owner-approved exception with a remediation date.
3. The Team page and Amplify page both explain reach-and-return in staff voice, with no development discussion.
4. The Team workspace records at least one real accepted work item through its full cycle with a decision owner and outcome.
5. DSD-D1 is confirmed with colleagues before any date appears on a staff page.
6. Retention (parent D-13) is decided before consultation or staff-result collection opens.
7. DEPLOY.md step 7 evidence exists for the launch head.

---

## Appendix A. Sources of authority

Primary: the parent PRD and everything it lists; [ONE-DSD-CONNECTED-PROGRAM-2026-09-08.md](ONE-DSD-CONNECTED-PROGRAM-2026-09-08.md); the September 6 Workforce and One DSD Team implementation addendum; [LEADERSHIP-DEVELOPMENT-2026-09-08.md](LEADERSHIP-DEVELOPMENT-2026-09-08.md), [LEADERSHIP-LIFECYCLE-2026-09-08.md](LEADERSHIP-LIFECYCLE-2026-09-08.md), [EMERGING-LEADERS-DSD-ANALYSIS-2026-09-08.md](EMERGING-LEADERS-DSD-ANALYSIS-2026-09-08.md), [MULTIMEDIA-DSD-OPPORTUNITIES-2026-09-09.md](MULTIMEDIA-DSD-OPPORTUNITIES-2026-09-09.md), and [AMPLIFY-EQUITY-PROGRAM-DESIGN-2026-09-08.md](AMPLIFY-EQUITY-PROGRAM-DESIGN-2026-09-08.md).

Historical, preserved unchanged: the September 4 One DSD Program Operating Model and the Superior Operating Program PRD referenced by the operating charter.
