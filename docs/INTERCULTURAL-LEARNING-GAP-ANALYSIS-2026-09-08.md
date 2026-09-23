# Intercultural learning: coordination gap analysis

September 8, 2026. Internal design and verification record for One DHS/One DSD People, Access and Culture. This report is not staff-facing copy.

## Scope and method

The owner wants a foundations-first developmental experience that connects concepts, reflection, practice, useful action, and learning from what happens. All resources remain open to all learners. An IDI orientation supplied voluntarily can inform a person's learning goal; the program must not infer an orientation from clicks, assign staff labels, or claim that finishing a lesson establishes developmental movement. Program participation and completion do not count toward DHS-required training credits unless management, a director, or DHS leadership expressly grants an exception. This qualifier does not change an independently applicable policy obligation.

This audit read the current owner directive, working agreement, staff voice standard, operationalizing-equity foundation, and operating charter. It inspected the learning, course, resource, stage, practice, publication, and ASK indexing implementations; performed a structural census of every recovered course and lesson; compared every course candidate identifier with the registered manifest; and examined the substantive descriptions, teaching structure, and transfer fields of the courses proposed below. It did not read every word of all 780 lessons, run a browser test, inspect live database publications, or establish actual learning outcomes. Counts describe repository content, not completed participant learning or production publication. No internal DHS curriculum was sought; the owner ended that investigation.

The paired `evidence/learning-coordination-2026-09-08/inventory.json` records the census and proposed connections. Original course packs and source snapshots were not edited by this audit. The root implementation is proceeding concurrently; findings below describe the starting design, not a claim that later fixes have failed.

## What already exists

- 86 course candidate identifiers all have matching recovered packs and manifest entries: 45 classified as authored and 41 as generated curriculum in the manifest.
- Those packs contain 780 lessons. Every lesson has learning, scenario, and transfer fields. Across the complete collection there are 164 artifact blocks, 175 knowledge-check blocks, and 69 sorting blocks. These are structural counts, not a quality or accessibility certification.
- All 86 packs are registered as course surfaces. In static preview, valid approved defaults are readable through the scoped publication function. Database mode separately resolves actual published revisions; source recovery and owner approval do not prove live publication.
- The base staff corpus has 59 approved agencywide resources: 14 practice notes, 5 checklists, 11 job aids, 12 tools, 1 question bank, 10 learning modules, and 6 external references. A brief learning module in that corpus is not equivalent to one of the complete recovered courses.
- Six learning stages already describe orientation, foundations, intercultural practice, application, systems, and leadership. Eleven practice paths produce concrete plans or records, including community engagement, meetings, equity analysis, facilitation, hiring, and succession.
- ASK already indexes scoped published course overviews and individual lessons through `indexedProgramResources`. Its existence should be preserved; this work needs to add explicit learning-goal connections and verify answer behavior, rather than claim course discovery is wholly absent.
- The source archive also contains 49 community candidates and 34 domain resource candidates. Those archive counts are separate from the published collections. This audit does not imply all community candidates are staff-visible.

## Gaps and implications

1. **A stage description does not yet provide a usable sequence.** In the starting Learn page, the complete course collection precedes stage cards. Non-orientation stage cards open broad resource searches. They do not specify a coherent set of lessons, why those lessons belong together, an application opportunity, and what a learner might try next. The resource-search page reads its staff snapshot and brief documents; it does not append the recovered course collection in the way Learn does. Thus a stage search is not a dependable course progression. Retain the complete course inventory while adding a prominent, optional learning pathway and direct, publication-checked links.

2. **The next-step language often repeats without supplying the next action.** All lessons have transfer fields, but 254 share the same applied-next-step sentence. Across 780 lessons there are only five distinct evidence strings. Radio-button commitments and a generic notes box are useful beginnings; they do not establish application, feedback, or improved outcomes. None of the eleven selected courses below contains an artifact block, so their direct connection to existing practical tools is particularly valuable. Add a goal-specific practice plan and an optional return reflection: what was tried, what was observed, whose perspective informed it, and what will change next.

3. **Three displayed objectives are not proof of three well-developed objectives.** The rendering helper synthesizes three bullets from a single original objective, a scenario, and an artifact or next step. This meets the numerical display pattern, but generic verbs or repeated references to a 'live work object' do not establish that each skill is taught, practiced, and assessed. A later curriculum improvement pass should examine every lesson for three to five distinct observable objectives, matching examples, meaningful feedback, and a proportionate application task. Preserve original source material and use traceable program-authored companions where needed. This audit does not claim that curriculum-wide revision is complete.

4. **IDI support exists, but purposeful entry is missing.** The tool card and practice note already distinguish qualified IDI administration from the program's optional learning. Courses include Minimization and Acceptance in their original titles, and some introductions assume prior learning. A welcoming goal selector should let someone explore differences, communication, decisions, or reflection without disclosing an assessment, claiming a stage, or completing prerequisites. Explain an original course title through a useful description; do not assign the title to the person.

5. **Connections need to carry a purpose in both directions.** The Toolkit companion, community engagement page, Minnesota Communities, Amplify, One DSD Team Learning Lab, orientation, and the new leadership experience contain relevant application and reflection support. Existing links and themes do not consistently explain when to move between them or bring a learner back to review the result. The proposed pathway should share a common content mapping with ASK, and destination pages should offer a short contextual way back where relevant.

6. **Participation, completion, and benefit must remain distinct.** A completion checkbox is a learner-controlled marker. A saved plan is an output. Using it is application evidence. An observed change is a possible outcome whose source and limits need to remain clear. Neither a checkbox nor an agent response proves an improved intercultural orientation, service outcome, or training-credit exception. Use the owner's exact credit rule consistently in appropriate notices and ASK behavior; avoid repeating internal design discussion throughout staff pages.

## Five connected learner goals

These are suggested ways into the learning, not levels, audience restrictions, or assessment categories. Course identifiers below are original route slugs; catalog content IDs use the `course-` prefix. All links must resolve against the caller's current scoped publications before display.

| Goal | Existing learning | Connected practice | Useful application evidence |
| --- | --- | --- | --- |
| Foundations: build a useful starting point | `cultural-humility-vs-checklist`; `intercultural-competence-without-a-score` | `pn-intercultural-method`; `pn-idi-and-tool-registry`; `tool-idi` | Separate an observation from an assumption, write a respectful question to check it, and explain when community context or a formal tool is useful. |
| Perspectives: notice meaningful differences | `what-minimization-does-in-dhs-work`; `acceptance-in-dhs-work` | `ja-stakeholder-map`; Minnesota Communities; `/paths/gp-3` | Identify whose experience is missing from a proposed process, prepare questions without profiling, and document how participation can influence the decision. |
| Communication: make an interaction work better | `intercultural-conflict-styles`; `working-with-an-interpreter`; `disability-and-language` | `lm-interpreter`; `ja-language-access-checklist`; `ja-access-checks`; `/paths/gp-8` | Revise a meeting or service-conversation plan to reflect a person's stated communication preferences and access needs; invite feedback about whether the change helped. |
| Decisions: apply learning to work | `from-noticing-to-shifting`; `dhs-equity-analysis-toolkit` | `ja-equity-impact-questions`; `ja-process-burden`; `/learn/equity-toolkit`; `/paths/gp-7` | Compare the original approach with a feasible alternative using benefits, burdens, affected perspectives, responsibility, and a way to review effects. |
| Reflection: learn from what happened | `critical-incidents-in-the-work`; `outcomes-not-intentions` | `pn-self-check`; `ja-facilitation-session-plan`; `/paths/gp-5`; Amplify; One DSD Team Learning Lab | Record a specific attempt, the response or evidence available, its limits, and a next adjustment. Share a nonidentifying lesson with colleagues only when the participant chooses. |

The overall logic model is: a learner's question and relevant context → selected learning and reflection → realistic practice and feedback → a usable plan or changed approach → voluntary application → reflection on effects and a next step. Inputs include the approved learning collection, official tools, community knowledge, professional support, and staff experience. This is a proposed contribution pathway, not a causal claim that taking the course produces organizational equity.

## Connections beyond the learning page

- **Orientation:** a welcoming entrance to the five goals; no assessment required and the full inventory remains available.
- **ASK:** answer the actual question first, then suggest a small relevant selection with reasons and an optional practical next step. Retrieve current scoped material; do not assume a course is available because an archive lists it. Verify implicit-bias, cultural-difference, IDI-goal, and required-credit questions.
- **Equity Analysis Toolkit:** support drafting and reviewing a work decision while keeping the original official source and its obligations distinct from voluntary program learning.
- **Minnesota Communities:** use context to prepare better questions, not to predict the behavior of an individual. Return to communication, participation, or decision practice.
- **Amplify and One DSD Team:** use a conversation, optional Learning Lab, or shared reflection when helpful. No required volunteering or invented meeting commitment follows from a lesson.
- **DSD leadership:** connect learning to the employee life cycle and development map; use an interview rubric, accessible meeting, mentoring agreement, or fair opportunity decision as a practical application.

## Completion evidence for this coordination pass

Check that the five goals show a useful purpose, existing published learning, relevant tools, and an open next step; retain all published course tiles and working aliases; verify course, lesson, resource, practice, and return links; test an application note and later reflection; and test ASK recommendations without stage inference or training-credit promises. Record local versus live status accurately. Publication and answer-quality tests should include withdrawn or unavailable resources. The remaining curriculum-wide objective and transfer-depth review must remain explicit rather than disappear behind successful route tests.

## Source locations

- `lib/content/courses/recovered.json`, `manifest.json`, `definitions.ts`: course census and registration.
- `data/source-snapshots/donor-library/course-candidates.jsonl`: candidate comparison.
- `lib/content/courses/published.ts`: course presentation and synthesized objectives.
- `components/course-lesson.tsx`: scenarios, transfer selection, notes, completion, and artifact export.
- `lib/content/corpus.ts`, `corpus-domains.ts`, `staff-corpus.ts`: approved base collection and IDI/tool guidance.
- `lib/product/learning.ts`, `app/learn/page.tsx`, `lib/domains/learning.ts`: current stages and aliases.
- `app/resources/page.tsx`, `lib/intelligence/retrieval/search.ts`: resource-search source boundary.
- `lib/content/editable-surfaces.ts`: static versus database publication behavior.
- `lib/content/paths.ts`, `paths-domain.ts`: eleven practical paths and artifacts.
- `lib/intelligence/retrieval/program-resources.ts`: scoped course and lesson indexing for ASK.
