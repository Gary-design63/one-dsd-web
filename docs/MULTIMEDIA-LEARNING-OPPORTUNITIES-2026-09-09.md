# Multimedia opportunities: learning, resources, practice, and Minnesota Communities

Internal analysis for Gary and the Chief of Staff, September 9, 2026. No content changes or publication are performed by this memo.

A small family of reusable scenes and worked examples can strengthen the program's existing learning. Blender is most useful where spatial arrangement matters: sightlines, furniture, screens, access routes, or who can participate in a conversation. Diagrams, annotated documents, sourced stills, transcripts, and selected audio are usually clearer for processes, evidence, and historical context. Every recommendation below leads to a useful learner action or work product.

Request: review the whole learning/resource/practice/community surface families. Purpose: improve understanding, decision practice, and transfer into everyday work. Completion evidence: route/renderer and content-contract review, complete structural census, local media-file checks, concrete placements and accessibility equivalents. Quality: preserve original depth, open access, individual variation, source/publication boundaries, and warm, human, professional, helpful language.

## Scope and evidence limits

All requested route families and their media/activity renderers were reviewed. Structural inspection covers every one of the 86 recovered course packs and 780 lessons, 59 static resource definitions, 11 practice paths, and 41 recovered community readings containing 1,209 chapters. The additional Deaf, DeafBlind, and hard of hearing brief makes 42 community directory candidates before publication filtering. Topic-specific lessons, journey examples, toolkit scenarios, and community reflection prompts ground the recommendations.

This is a local code/source inventory. It does not certify every factual claim in 780 lessons or 1,209 chapters, audiovisual quality, transcript fidelity, external links, database publication, or deployed playback. Published, scoped readers still control staff visibility. Other reviewers cover home, About, ASK, support, consultant operations, orientation, and One DSD engagement/leadership; their course/resource counterparts are included in this census. Current code takes precedence over stale historical inventory statements.

| Route family reviewed | Current implementation and media support | Multimedia implication |
| --- | --- | --- |
| `/learn`, filters, themes, six stage anchors | Combines scoped base resources with published courses. All course tiles can show the existing covers; three short resource modules have editable tile-image mappings. Six themes use many-to-many memberships. Published podcast surfaces can appear. The structural theme includes an external PBS video link. | Preserve complete course access and existing suitable covers. An external video link is not an embedded player. Put substantive media in the relevant learning context rather than add decorative motion to the catalog. |
| `/learn/[stage]` | Current stage IDs and historical aliases redirect to `/learn#<current-stage-id>`. | Preserve bookmarks. Do not turn stages into assessments, assigned learner labels, or prerequisites. |
| `/learn/intercultural`, five focus anchors and notebook selection | Objectives, purpose, everyday examples, practice, reflection, evidence, publication-checked resources. Notebook supports draft, optional device saving, later reflection, copy/download, and removal. No media renderer here. | Place a short example beside the existing everyday example and connect it to the notebook; retain the explanation and open access. |
| `/learn/equity-toolkit` | Five companion stages, role contexts, three qualitative choices each, working draft, browser print/save, source links, existing podcast. Draft state is transient. No generic diagram or video field. | Visualize the existing reminder decision. Preserve the distinction between the five-stage companion and the official toolkit sequence. |
| `/learn/community-connections` | Planning questions, fictional employment-learning example, activity/influence/result/report-back panels, and employment/housing/community/evidence resources. No media field/player. | A four-panel process illustration can clarify how participation affects decisions without inventing program results. |
| `/library`, `/resources` | Shared directory now includes published courses, facets, keyword search, and actual course destinations. | The old claim that Library omits recovered courses is no longer accurate. Format labels should identify real assets. |
| `/library/[id]`, `/resources/[id]` | Shared detail renderer: paragraphs; ordered checklist/question-bank items; authority and sources; next steps; related resources; owner editing. Body is an array of strings, not a media-block model. | Inline media needs a contract/renderer extension or a deliberate companion link. A URL in text does not create a player. |
| `/courses/[courseId]` | Cover, optional introduction audio and transcript disclosure, objectives/evidence, all lessons, job aid, sources. | Improve access to existing audio before producing repetitive new introductions. |
| `/courses/[courseId]/[lessonId]` | Thirteen block types, plus text scenarios/feedback, transfer choices, notes, browser saving, completion markers, and text artifact downloads. | Still-image blocks and interactive text patterns are already available. Lesson video/audio, timed captions, interactive 3D, and branching video are absent. |
| `/practice`, `/practice/[id]`, `/paths`, `/paths/[id]` | Eleven paths. Practice detail aliases the path page. Steps/resources, artifact fields, self-check, device notes, copy/download, optional ASK draft import, contextual support. | Put a worked example immediately before the relevant field group. Media must not become a condition for using the form. |
| `/practice/measurement` | Ten-field evaluation plan linked to a source resource; copy/download/manual-copy fallback; no automatic saving or chart. | A chart/table example can clarify evidence before the learner creates their evaluation plan. |
| `/minnesota-communities`, `/minnesota-communities/[id]` | Active editorial design (`communityDesignEnabled()` is true): searchable directory; full chapters in three themes; practice context; observance tables where supplied; sources; learning/reflection view retaining the chapters; reasoning-reveal controls. Rich chapters support text/lists/links, not media. | Preserve historical depth and distinctions among communities, population context, and sovereign Nations. Add source-linked figures or companions, not synthetic community behavior. |

## Media census from all course definitions

There are 86 course covers, 185 lesson-image references representing 122 distinct URLs, and 44 nonempty introduction-audio references. Every referenced local cover, lesson image, and introduction audio file exists after stripping query-version suffixes for the filesystem lookup. All 44 audio-bearing overviews also have a nonempty `introTranscript` field. Presence does not establish matching narration, playback quality, or adequate text alternatives.

Both supplied podcast files exist: `public/audio/dhs-equity-policy-and-toolkit.mp3` (33,993,549 bytes) and `public/audio/anti-racism-public-service.mp3` (38,026,515 bytes). Their definitions label durations of 47:13 and 26:24. The podcast player supplies native controls, deferred loading, errors, and user-triggered retry. It has no transcript prop/disclosure, chapters, or caption-track model. Its download text is inside audio fallback, not a separate always-visible download control in a browser that supports audio.

All lesson blocks were counted: text 1,650; leaderMove 1,463; flashcards 577; quote 558; list 200; image 185; knowledgeCheck 175; artifact 164; statement 111; accordion 90; tabs 75; sorting 69; timeline 17. Every lesson contains a scenario and transfer prompt. Pack categories: foundation 10, practice 30, community-context 42, formal-support 2, shared-method 2.

The 164 artifact blocks contain 41 each of invitation, tagged-document, captioned-video, and plain-language-flyer. These are editable text exercises with text downloads. In particular, `captioned-video` is not a playable or rendered video. The course HTML sanitizer does not allow a video/iframe hidden inside text markup. Existing tabs, sorting, and scenarios are useful interaction patterns, not a spatial or time-based media engine.

## Prioritized opportunities

Priority 1 is the first useful production group; priority 2 follows the shared pattern; priority 3 depends on a specific need. These are proposed placements and work products, not available media or commitments to implement them.

### L1. Observe before interpreting — priority 1

**Placement:** `/learn/intercultural#foundations` and `#communication`; `/courses/critical-incidents-in-the-work/ci-write`; `/courses/intercultural-conflict-styles/cs-notice`.

**Purpose and example:** In a fictional meeting, Sam pauses and Jordan starts moving on. Ask learners to separate the pause they observed from assumptions about it, then choose a respectful question or written-response option. Do not infer personality, culture, motivation, or IDI orientation from the pause. **Format:** three still frames first, optional short dialogue video later. **Blender:** useful for a reusable office and camera positions; ordinary illustrated frames can teach the same point initially. Facial interpretation is not the assessment.

**Equivalent access:** full speaker-labeled transcript and meaningful scene actions; all questions/feedback in HTML; no timed response; equivalent text/still route. **Reusable output:** observation–interpretation–question card and a practice-notebook entry. **Readiness:** notebook and scenario feedback already exist; journey media slots and any video player are new. Preserve source text and identify the added example as a program-authored companion.

### L2. Interpreter-supported conversation — priority 1

**Placement:** `/courses/working-with-an-interpreter/wi-who` and `/wi-time`; `/courses/disability-and-language/dl-one`; `lm-interpreter`, `ja-language-cultural-access-planning`.

**Purpose and example:** A fictional visitor states a language preference and asks for a short written summary. Demonstrate role confirmation, speaking to the visitor, manageable turns, pauses, and checking the next step. An English storyboard can label where interpretation occurs without pretending to demonstrate an unproduced language. **Format:** labeled room still, short captioned video or staged audio with transcript. **Blender:** useful for room arrangement and turn-taking; it does not provide qualified interpretation, accurate signing, or translation.

**Equivalent access:** role/turn-order transcript, accurate captions and described actions, printable preparation sequence. **Reusable output:** conversation preparation card with support confirmation, booking responsibility, time allowance, and feedback check. **Readiness:** relevant courses and intro audio exist; native lesson audio/video support is new. Any actual language/signing demonstration needs competent production and review. Do not fabricate signing or clone the owner's voice.

### L3. A room that supports participation — priority 1

**Placement:** `/practice/gp-8`; `/courses/facilitators-guide-equity-inclusion-curriculum/fg-access`; `ja-accessible-meetings`.

**Purpose and example:** Compare a fictional room with obstructed caption sightlines, a narrow route, and a remote attendee outside the facilitated discussion with a revised arrangement. Explain which barrier each change addresses and what still needs to be asked of participants. This is a learning illustration, not a real-building compliance inspection. **Format:** labeled still perspectives plus plan view; optional interactive 3D later. **Blender:** strongest use because the spatial arrangement is the subject. Several camera views may remove the need for a browser 3D viewer.

**Equivalent access:** labeled plan, ordered text description, keyboard controls and discrete views if 3D is added, identical text exercise. **Reusable output:** accessible meeting plan and editable Blender room with labeled objects and reusable camera views. **Readiness:** the path and lesson exist; course image blocks can deliver stills. Browser 3D additionally needs an export format, viewer, keyboard/screen-reader design, performance tests, and fallback. Local Blender authoring does not establish these staff capabilities.

### L4. See a reminder process end to end — priority 1

**Placement:** `/learn/equity-toolkit#toolkit-practice`; `/courses/dhs-equity-analysis-toolkit/ea-eight-step-loop`; `/practice/gp-7`; `ja-process-burden`, `ja-operational-equity-canvas`.

**Purpose and example:** Reuse the current fictional reminder story: mail, a text-only proposal, shared-phone access, stated language preference, alternate formats, and responsibility to record preferences. Separate successful delivery from actual usability and show where choices remain open. **Format:** 2D process diagram with existing qualitative choices. **Blender:** a simpler diagram is preferable; the dependencies need clear labels.

**Equivalent access:** same nodes/connections as an ordered list/table; full option/consequence text; printable description. **Reusable output:** process map, benefits/burdens comparison, toolkit draft or GP-7 analysis record. **Readiness:** five companion stages and feedback exist; a diagram field/display needs adding. Preserve the official source and sequence; selecting an answer cannot authorize a decision or establish community agreement.

### L5. A notice someone can act on — priority 1

**Placement:** `/courses/plain-language-in-human-services/pl-how` and `/pl-one`; `/practice/gp-2`, `/gp-9`; `ja-plain-language`, `ja-form-notice-change`.

**Purpose and example:** Annotate a fictional appointment notice and a revision that makes purpose, action, timing, response methods, and usable-format access clear while preserving substantive conditions. Have learners explain each change and identify unresolved source questions. **Format:** annotated stills or optional screen recording beside semantic HTML. **Blender:** no useful advantage; document structure and wording are the subject.

**Equivalent access:** complete original/revised text and change list in HTML; no dependence on tiny image text, color, or motion. **Reusable output:** notice-review record, before/after example sheet, transferable checklist. **Readiness:** courses can display stills, but ordinary resource bodies cannot. A companion link or media-aware resource extension is needed. An HTML comparison may be more useful than video for magnification, copying, and review.

### L6. Participation changes a choice — priority 1

**Placement:** `/learn/community-connections` at its fictional example; `/practice/gp-3`; `ja-engagement-influence-ladder`, `ja-report-back`.

**Purpose and example:** Reuse the employment-learning scenario. Four panels show the proposed weekday online meeting, stated timing/communication/internet barriers, revised response options, and what changed or remains open. Attendance is not an employment outcome, and an advisory group does not speak for every household. **Format:** four-panel sequence/process diagram. **Blender:** optional recurring-room still; text and diagram convey influence more clearly.

**Equivalent access:** four titled text panels in meaningful order and a printable sequence. **Reusable output:** participation/influence/report-back map and GP-3 engagement plan. **Readiness:** these panels and objectives already exist as text; this is a companion, not a rebuilt activity. Preserve government-to-government Tribal consultation as a distinct relationship and authority, never an ordinary community listening-session simulation.

### L7. What the numbers establish — priority 2

**Placement:** `/practice/measurement`; `/courses/outcomes-not-intentions/out-blend` and `/out-write`; `/learn/intercultural#reflection`.

**Purpose and example:** Use a labeled fictional dataset: 100 reminders sent, 80 delivered, 50 responses, and separately collected usability accounts with explicit limits. Show why these answer different questions; optionally change a declared denominator and inspect its effect. **Format:** accessible chart/table, with an optional interactive control. **Blender:** no; standard chart tools are more appropriate.

**Equivalent access:** full data table, units and denominators, keyboard controls with text values, narrative findings/limits, static downloadable figure. **Reusable output:** evaluation plan naming the question, source, missing perspectives, limitations, responsibility, and next decision. **Readiness:** worksheet exists but has no chart or simulation. Keep synthetic figures labeled as fictional; do not report them as program performance, infer causality, or use private staff records/individual learning scores.

### L8. History and place with source context — priority 2

**Placement:** community brief History and place sections and matching community-context course lessons; existing course timeline blocks.

**Purpose and example:** A fictional team planning a service-location discussion uses a sourced historical timeline to identify a question about travel and access today. The work scenario may be fictional; dates, geographic labels, and historical events must be accurate source material. **Format:** sourced map, timeline, or archival photograph with explanatory caption. **Blender:** usually no. A historical reconstruction needs a specific teaching purpose, documentation, and explicit illustration labeling.

**Equivalent access:** event table, descriptions of locations/relationships, captions, and the underlying full reading. **Reusable output:** annotated source figure and context/evidence/question sheet. **Readiness:** course image/timeline blocks exist; community chapters need a figure/companion extension. Preserve American civic context, European American histories, Native American population context, and the eleven sovereign Tribal Nations as distinct topics. Use actual attribution/rights and factual fit; do not manufacture community authorship, use synthetic images as historical evidence, or replace the full source.

### L9. From a brief to a better question — priority 2

**Placement:** Minnesota Communities Learning and reflection view; `/courses/cultural-humility-vs-checklist/hu-sheet`; `pn-intercultural-method`, `pn-cultural-humility-briefs-as-questions`.

**Purpose and example:** A fictional person asks to include a trusted friend in planning. The staff member asks what involvement they want and what decision is being discussed, instead of prescribing a family role from community context. **Format:** neutral service storyboard and reasoning reveal. **Blender:** optional scene reuse, with individual circumstances explicitly stated. Do not encode a community's supposed behavior through accent, dress, posture, family structure, or emotion.

**Equivalent access:** complete speaker-labeled text, reflection/feedback in HTML, no dependence on visual emotion. **Reusable output:** respectful-question set and assumption-to-check note. **Readiness:** reasoning-reveal controls exist; media presentation is new for the community renderer. Reuse a few neutral fictional scenes rather than generate a culturally coded character animation for each community.

### L10. Make existing recordings easier to use — priority 2

**Placement:** the two podcast placements and 44 audio-bearing course overviews.

**Purpose and example:** A fictional facilitator selects a measured segment from the toolkit recording before a reminder-choice activity. A transcript section lets people read the same content. Segment boundaries/descriptions must come from the actual recording. **Format:** accurate transcript, labeled audio chapters, and useful practice links. **Blender:** no; audio editing, transcription, and semantic presentation address the need.

**Equivalent access:** full transcript, speakers and meaningful non-speech audio, readable headings, transcript-first access, no autoplay. **Reusable output:** source-linked audio companion with segment map, purpose, and practice destination. **Readiness:** files exist; podcast transcript/chapter fields and UI are absent. Existing course transcript fields need fidelity checks. A nonempty field is not proof of an accurate full recording transcript.

### L11. A worked example beside a practical tool — priority 3

**Placement:** resource companions and path steps, especially `/practice/gp-1`, `/gp-5`, `/gp-10`; `ja-launch-embed-checklist`, `ja-facilitation-session-plan`, `ja-procurement-contract-equity`.

**Purpose and example:** A fictional procurement draft shows the service need, access questions, evidence gaps, and who must decide an unresolved issue. A facilitator counterpart connects purpose, activity, practical use, and access. Neither is an official completed agency form. **Format:** annotated example, process diagram, or optional short screen demonstration. **Blender:** usually no; reuse L1/L3 only where a room or meeting context helps.

**Equivalent access:** complete editable text, explanation of each annotation, clear reading order, printable equivalent. **Reusable output:** adaptable example records for planning, facilitation, procurement, and review. **Readiness:** forms/self-check/export already exist. Resource and path contracts have no generic inline-media field; deliberately link a companion or extend the model. A filled template does not establish real-world application or improvement.

## Recommended first group and completion evidence

Start with L3's meeting room, L1's brief conversation, L4's reminder-process diagram, L5's notice comparison, and an accurate transcript/segment map for one existing recording from L10. This establishes spatial explanation, conversational practice, process reasoning, document usability, and audio access. Reuse these outputs for L2, L6, L9, and L11 instead of constructing a new scene for every lesson.

Keep each media object's learning purpose, source/brief, editable original, delivery file, transcript/description, captions where needed, attribution, scope, version, and actual creation/verification receipt together. Verify the complete staff flow: find the item, access media or equivalent text, inspect the choices, create a work product, and return/export as supported. Local Blender authoring does not establish a published learning asset, video, or browser 3D experience.

Preserve open access and the shared credit rule: no viewing time, choice, completion marker, or generated artifact identifies IDI orientation or establishes DHS-required training credit. Staff should receive useful learning, not authoring controls, compulsory playback, employee scoring, or a record of private implementation discussion. Original owner-curated content stays approved; actual technical quality and accurate output evidence still need verification.

## Source receipt

- Learning collection/journey: `app/learn/page.tsx`, `[stage]/page.tsx`, `intercultural/page.tsx`; `lib/content/learning-hub.ts`, `learning-catalog.ts`, `learning-journey.ts`, `learning-practice.ts`; `components/learning-tile.tsx`, `learning-practice-notebook.tsx`; `lib/product/learning.ts`, `lib/domains/learning.ts`.
- Toolkit/engagement: `app/learn/equity-toolkit/page.tsx`, `community-connections/page.tsx`; `components/equity-toolkit-experience.tsx`; `lib/content/equity-toolkit.ts`, `community-connections.ts`.
- Resource families: both `app/library` and `app/resources` page patterns; `lib/content/types.ts`, `corpus.ts`, `corpus-domains.ts`, `staff-corpus.ts`, `staff-publications.ts`, and publication-aware course lookup.
- Courses: both `app/courses` page patterns; `components/course-lesson.tsx`; `lib/content/courses/contract.ts`, `source-types.ts`, `definitions.ts`, `published.ts`, `manifest.json`, `recovered.json`.
- Audio: `components/podcast-player.tsx`, `published-podcast.tsx`, `lib/content/podcasts.ts`, all referenced local introduction files, and both supplied podcast files.
- Practice: all `app/practice` and `app/paths` page patterns; `components/path-client.tsx`, `measurement-worksheet.tsx`; `lib/content/paths.ts`, `paths-domain.ts`, `measurement-practice.ts`.
- Communities: both `app/minnesota-communities` page patterns; `components/community-design-index.tsx`, `community-design-page.tsx`, `community-experience-controls.tsx`; `lib/content/briefs.ts`, `community-design.ts`, `community-design-data.json`, `community-presentation.ts`, `community-reading-surface.ts`.
- Operating direction: `AGENTS.md`; `docs/OWNER-DIRECTIVE-2026-09-07.md`, `WORKING-AGREEMENT.md`, `LEARNING-COORDINATION-2026-09-08.md`, `PROGRAM-OPERATING-CHARTER.md`, `DESIGN-RENEWAL-2026-09-08.md`; course-integration/gap-analysis history. Current code was used to resolve outdated historical claims.

The appendices below are generated from local definitions. They are a complete static route/data inventory, not a live database query. Every concrete lesson URL is `/courses/<courseId>/<lesson.id>` using the course below and its lesson IDs in `recovered.json`; per-course counts account for all 780 definitions without repeating 780 URLs.

## Appendix A: all registered course overviews

| Course route | Original course title | Lessons | Intro audio reference |
| --- | --- | ---: | --- |
| `/courses/anti-racism-resource` | Anti-Racism as Ordinary Work | 7 | None |
| `/courses/somali-minnesota-brief` | Somali Minnesota — a Brief, not a Capsule | 12 | Present; local file exists |
| `/courses/cultural-humility-vs-checklist` | Cultural Humility vs. a Checklist | 4 | Present; local file exists |
| `/courses/critical-incidents-in-the-work` | Critical Incidents in the Work | 4 | Present; local file exists |
| `/courses/intercultural-conflict-styles` | Intercultural Conflict Styles at a DHS Desk | 4 | Present; local file exists |
| `/courses/intercultural-competence-without-a-score` | Intercultural Competence without a Score | 4 | Present; local file exists |
| `/courses/disability-and-language` | Disability and Language Together | 4 | Present; local file exists |
| `/courses/cultural-broker-as-a-role` | Cultural Broker as a Role | 4 | Present; local file exists |
| `/courses/language-access-plan` | A Language Access Plan You Can Walk | 6 | Present; local file exists |
| `/courses/plain-language-in-human-services` | Plain Language in Human Services | 4 | Present; local file exists |
| `/courses/working-with-an-interpreter` | Working with an Interpreter | 4 | Present; local file exists |
| `/courses/language-access-as-a-design` | Language Access as a Design | 4 | Present; local file exists |
| `/courses/equal-opportunity-in-employment` | Equal Opportunity in Employment — the Door and the Lens | 4 | Present; local file exists |
| `/courses/conflict-at-work` | Conflict at Work — Resolution vs. a Formal Door | 4 | Present; local file exists |
| `/courses/stay-and-exit-interviews` | Stay Interviews and Exit Interviews | 4 | Present; local file exists |
| `/courses/employee-viewpoint-and-wellbeing-surveys` | Employee Viewpoint and Well-Being Surveys | 4 | Present; local file exists |
| `/courses/mobility-acting-promotion` | Mobility, Acting, and Promotion | 4 | Present; local file exists |
| `/courses/career-mentorship-and-sponsorship` | Career Mentorship and Sponsorship | 4 | Present; local file exists |
| `/courses/performance-and-development` | Performance and Development | 5 | Present; local file exists |
| `/courses/onboarding-and-first-90-days` | Onboarding and the First 90 Days | 5 | Present; local file exists |
| `/courses/screening-and-selection` | Screening and Selection | 5 | Present; local file exists |
| `/courses/sourcing-and-outreach` | Sourcing and Outreach | 5 | Present; local file exists |
| `/courses/job-design-and-the-posting` | Job Design and the Posting | 6 | Present; local file exists |
| `/courses/employee-life-cycle-as-a-system` | The Employee Life Cycle as a System | 8 | Present; local file exists |
| `/courses/facilitators-guide-equity-inclusion-curriculum` | Facilitator’s Guide: Leading the Equity and Inclusion Curriculum | 6 | Present; local file exists |
| `/courses/equity-centered-leadership` | Equity-Centered Leadership | 6 | Present; local file exists |
| `/courses/equity-champion-contribution-workflow` | Equity Champion Contribution Workflow | 6 | Present; local file exists |
| `/courses/equity-inclusion-leadership-and-systems` | Equity and Inclusion: Leadership and Systems | 7 | Present; local file exists |
| `/courses/acceptance-in-dhs-work` | Acceptance in DHS Work | 8 | Present; local file exists |
| `/courses/culture-without-theater` | Culture Without Theater | 5 | Present; local file exists |
| `/courses/teams-in-minimization` | Teams in Minimization | 5 | Present; local file exists |
| `/courses/from-noticing-to-shifting` | From Noticing to Shifting | 6 | Present; local file exists |
| `/courses/outcomes-not-intentions` | Outcomes, Not Intentions | 7 | Present; local file exists |
| `/courses/how-it-shows-up-in-minnesota-human-services` | How It Shows Up in Minnesota Human Services | 8 | Present; local file exists |
| `/courses/the-record` | The Record | 10 | Present; local file exists |
| `/courses/what-minimization-does-in-dhs-work` | What Minimization Does in DHS Work | 7 | Present; local file exists |
| `/courses/dhs-equity-analysis-toolkit` | DHS Equity Analysis Toolkit | 6 | Present; local file exists |
| `/courses/family-and-natural-support-systems` | Family and Natural Support Systems | 6 | Present; local file exists |
| `/courses/lgbtq-inclusion-in-disability-services` | LGBTQ+ Inclusion in Disability Services | 6 | Present; local file exists |
| `/courses/brain-injury-and-complex-disability` | Brain Injury and Complex Disability | 6 | Present; local file exists |
| `/courses/neurodiversity-and-cognitive-difference` | Neurodiversity and Cognitive Difference | 6 | Present; local file exists |
| `/courses/health-wellness-and-safety` | Health, Wellness, and Safety | 6 | Present; local file exists |
| `/courses/employment-first-and-economic-inclusion` | Employment First and Economic Inclusion | 6 | Present; local file exists |
| `/courses/change-management-bringing-people-along` | Change Management: Bringing People Along | 6 | Present; local file exists |
| `/courses/accessibility-as-leadership-responsibility` | Accessibility as Leadership Responsibility | 6 | Present; local file exists |
| `/courses/cultural-intelligence-american` | Cultural intelligence: American culture | 13 | None |
| `/courses/cultural-intelligence-minnesota` | Cultural intelligence: Minnesota culture | 13 | None |
| `/courses/cultural-intelligence-african-american` | Cultural intelligence: African American Minnesota | 13 | None |
| `/courses/cultural-intelligence-somali` | Cultural intelligence: Somali Minnesota | 13 | None |
| `/courses/cultural-intelligence-hmong` | Cultural intelligence: Hmong Minnesota | 13 | None |
| `/courses/cultural-intelligence-amharic` | Cultural intelligence: Amharic-speaking Minnesota | 13 | None |
| `/courses/cultural-intelligence-arabic` | Cultural intelligence: Arabic-speaking Minnesota | 13 | None |
| `/courses/cultural-intelligence-bosnian` | Cultural intelligence: Bosnian Minnesota | 13 | None |
| `/courses/cultural-intelligence-burmese` | Cultural intelligence: Burmese Minnesota | 13 | None |
| `/courses/cultural-intelligence-cambodian` | Cultural intelligence: Cambodian / Khmer Minnesota | 13 | None |
| `/courses/cultural-intelligence-chinese` | Cultural intelligence: Chinese Minnesota | 13 | None |
| `/courses/cultural-intelligence-colombian` | Cultural intelligence: Colombian Minnesota | 13 | None |
| `/courses/cultural-intelligence-cuban` | Cultural intelligence: Cuban Minnesota | 13 | None |
| `/courses/cultural-intelligence-ecuadorian` | Cultural intelligence: Ecuadorian Minnesota | 13 | None |
| `/courses/cultural-intelligence-ethiopian` | Cultural intelligence: Ethiopian Minnesota | 13 | None |
| `/courses/cultural-intelligence-filipino` | Cultural intelligence: Filipino Minnesota | 13 | None |
| `/courses/cultural-intelligence-french` | Cultural intelligence: French-speaking Minnesota | 13 | None |
| `/courses/cultural-intelligence-guatemalan` | Cultural intelligence: Guatemalan Minnesota | 13 | None |
| `/courses/cultural-intelligence-indian` | Cultural intelligence: Indian (Asian Indian) Minnesota | 13 | None |
| `/courses/cultural-intelligence-japanese` | Cultural intelligence: Japanese Minnesota | 13 | None |
| `/courses/cultural-intelligence-karen` | Cultural intelligence: Karen Minnesota | 13 | None |
| `/courses/cultural-intelligence-kenyan` | Cultural intelligence: Kenyan Minnesota | 13 | None |
| `/courses/cultural-intelligence-korean` | Cultural intelligence: Korean Minnesota | 13 | None |
| `/courses/cultural-intelligence-lao` | Cultural intelligence: Lao Minnesota | 13 | None |
| `/courses/cultural-intelligence-latino` | Cultural intelligence: Latino / Hispanic Minnesota (disaggregate) | 13 | None |
| `/courses/cultural-intelligence-lebanese` | Cultural intelligence: Lebanese Minnesota | 13 | None |
| `/courses/cultural-intelligence-liberian` | Cultural intelligence: Liberian Minnesota | 13 | None |
| `/courses/cultural-intelligence-mexican` | Cultural intelligence: Mexican Minnesota | 13 | None |
| `/courses/cultural-intelligence-nigerian` | Cultural intelligence: Nigerian Minnesota | 13 | None |
| `/courses/cultural-intelligence-oromo` | Cultural intelligence: Oromo Minnesota | 13 | None |
| `/courses/cultural-intelligence-puerto-rican` | Cultural intelligence: Puerto Rican Minnesota | 13 | None |
| `/courses/cultural-intelligence-russian` | Cultural intelligence: Russian-speaking Minnesota | 13 | None |
| `/courses/cultural-intelligence-salvadoran` | Cultural intelligence: Salvadoran Minnesota | 13 | None |
| `/courses/cultural-intelligence-thai` | Cultural intelligence: Thai Minnesota | 13 | None |
| `/courses/cultural-intelligence-ukrainian` | Cultural intelligence: Ukrainian Minnesota | 13 | None |
| `/courses/cultural-intelligence-vietnamese` | Cultural intelligence: Vietnamese Minnesota | 13 | None |
| `/courses/cultural-intelligence-tribal` | Cultural intelligence: Eleven Tribal Nations of Minnesota | 13 | None |
| `/courses/cultural-intelligence-alaska-native` | Cultural intelligence: Alaska Native people in Minnesota | 13 | None |
| `/courses/cultural-intelligence-rural` | Cultural intelligence: Rural Minnesota (place, not a race) | 13 | None |
| `/courses/cultural-intelligence-european-american` | Cultural intelligence: European America in Minnesota — historic cultures, not a ‘white’ mash | 13 | None |
| `/courses/cultural-intelligence-native-american` | Cultural intelligence: Native American (Compass profile — not the 11 nations) | 6 | None |

## Appendix B: all static resource detail routes

Each ID also uses the `/resources/<id>` alias when published. Recovered courses use the distinct course routes above.

| Library route | Resource title | Content type |
| --- | --- | --- |
| `/library/pn-partnership-spine` | Six commitments for working in partnership | practice_note |
| `/library/pn-embed-early` | Building equity into an idea while it takes shape | practice_note |
| `/library/ja-launch-embed-checklist` | Equity and access checklist for new work | checklist |
| `/library/ja-language-access-checklist` | Language access checklist | job_aid |
| `/library/ja-plain-language` | Plain language and accessible documents checklist | checklist |
| `/library/ja-access-checks` | Access checks before a meeting, outreach, or session | job_aid |
| `/library/ja-process-burden` | Questions about the steps, time, and effort a process requires | tool |
| `/library/ja-equity-impact-questions` | Equity impact questions for policy, budget, technology, and procurement | question_bank |
| `/library/ja-stakeholder-map` | Planning with partners: who to involve | tool |
| `/library/pn-equity-in-practice` | Equity in Practice: six perspectives and seven questions | practice_note |
| `/library/lm-workplace-climate` | Team climate basics: participation, honest conversation, and fair opportunities | learning_module |
| `/library/ja-climate-action-plan` | Team climate action plan template | tool |
| `/library/pn-when-to-escalate` | When to seek additional guidance, and where to begin | practice_note |
| `/library/pn-intercultural-method` | Using community context without profiling | practice_note |
| `/library/ja-facilitation-session-plan` | Session plan: purpose, activity, practical use, and access | tool |
| `/library/lm-facilitation-application` | Facilitation that participants can use in their work | learning_module |
| `/library/ja-form-notice-change` | Checklist for changing a form, notice, or letter | checklist |
| `/library/lm-interpreter` | Working with a spoken-language interpreter | learning_module |
| `/library/pn-self-check` | A final review for your working plan | practice_note |
| `/library/lm-how-this-program-works` | How to use this program | learning_module |
| `/library/ext-clas` | National CLAS Standards (culturally and linguistically appropriate services) | external_reference |
| `/library/ext-mn-accessibility` | Minnesota digital accessibility standard (MNIT) | external_reference |
| `/library/ext-ada` | ADA Title II (state and local government services) | external_reference |
| `/library/ext-title-vi-lep` | Title VI and language access for people with limited English proficiency | external_reference |
| `/library/ext-dhs-equity-toolkit` | DHS Equity Analysis Toolkit | external_reference |
| `/library/ja-inclusive-hiring-lifecycle` | Inclusive hiring lifecycle: eight stages from role design to outcomes | job_aid |
| `/library/ja-job-relatedness-check` | Is this requirement job related? A short check before you keep it | checklist |
| `/library/pn-pay-classification-advancement` | Pay, classification, and advancement: what a supervisor can change and what needs a partner | practice_note |
| `/library/pn-mentoring-sponsorship` | Mentoring, sponsorship, and reverse mentoring: three different things | practice_note |
| `/library/pn-stay-interviews-and-retention` | Stay conversations: learning why people stay before they leave | practice_note |
| `/library/ja-operational-equity-canvas` | Operational equity review canvas: eight steps for any decision | job_aid |
| `/library/ja-equity-scan-or-full-analysis` | Equity scan or full equity analysis: what goes in and who decides which applies | job_aid |
| `/library/ja-procurement-contract-equity` | Equity in contracts, grants, and procurement: where the questions belong | job_aid |
| `/library/lm-disability-rights-and-service-delivery` | Disability rights and service delivery: the frameworks DSD works within | learning_module |
| `/library/ja-engagement-influence-ladder` | Engagement that shares influence: inform, consult, involve, collaborate, co-design | job_aid |
| `/library/ja-report-back` | Reporting back: what we heard, what changed, what could not, and why | job_aid |
| `/library/pn-cultural-humility-briefs-as-questions` | Using community material as questions, not descriptions | practice_note |
| `/library/ja-accessible-meetings` | Accessible and culturally responsive meetings: before, during, and after | job_aid |
| `/library/ja-language-cultural-access-planning` | Language and cultural access planning aid for a program or contact point | job_aid |
| `/library/lm-plain-language-carries-complexity` | Plain language carries complexity: it does not remove it | learning_module |
| `/library/lm-psychological-safety-and-repair` | Psychological safety and repair: practices, not personality | learning_module |
| `/library/lm-power-and-positional-authority` | Positional power: seeing it, naming it, and using it well | learning_module |
| `/library/lm-intersectionality-foundations` | Intersectionality: why one category at a time misses people | learning_module |
| `/library/lm-structural-racism-and-institutions` | Structural racism and institutional power: how neutral rules produce unequal results | learning_module |
| `/library/pn-idi-and-tool-registry` | The IDI and other tools: inputs to practice, not the practice itself | practice_note |
| `/library/pn-role-aware-entry` | Start from the work you are doing: role-aware entry points | practice_note |
| `/library/pn-measurement-without-surveillance` | Measuring whether equity work is working, without scoring people | practice_note |
| `/library/tool-idi` | Tool card: Intercultural Development Inventory (IDI) | tool |
| `/library/tool-gare-racial-equity-toolkit` | Tool card: GARE Racial Equity Toolkit | tool |
| `/library/tool-mn-equity-toolkit` | Tool card: Minnesota Equity Analysis Toolkit | tool |
| `/library/tool-clas-standards` | Tool card: National CLAS Standards | tool |
| `/library/tool-lifecourse` | Tool card: Charting the LifeCourse | tool |
| `/library/tool-implicit-association` | Tool card: implicit-association resources | tool |
| `/library/tool-eeoc-uniform-guidelines` | Tool card: Uniform Guidelines on Employee Selection Procedures (EEOC) | tool |
| `/library/tool-mn-accessibility-standard` | Tool card: State of Minnesota accessibility standard | tool |
| `/library/ext-emerging-leaders-institute` | State of Minnesota Emerging Leaders Institute | external_reference |
| `/library/pn-accessible-leadership-pathways` | Accessible leadership pathways and sponsorship for staff with disabilities | practice_note |
| `/library/ja-leadership-criteria-job-relatedness` | Leadership criteria: are they job related, or do they screen out disabled staff? | checklist |
| `/library/ja-accommodation-across-transitions` | Accommodations across transitions: closing the accommodation cliff | job_aid |

## Appendix C: all guided paths and work products

Each `/practice/<id>` route reuses `/paths/<id>`. The evaluation plan is separately available at `/practice/measurement` when published.

| Practice route | Path | Work product |
| --- | --- | --- |
| `/practice/gp-1` | New program or service concept | Equity and access planning checklist |
| `/practice/gp-2` | Policy, form, or notice change | Change impact notes and access checklist |
| `/practice/gp-3` | Community engagement or co-design effort | Engagement plan |
| `/practice/gp-4` | Workplace culture and team climate | Team climate action plan |
| `/practice/gp-5` | Planning a learning or facilitation session | Session plan |
| `/practice/gp-6` | Inclusive hiring and selection | Inclusive hiring plan |
| `/practice/gp-7` | Equity analysis for a decision | Equity analysis record |
| `/practice/gp-8` | Accessible and culturally responsive meeting | Accessible meeting plan |
| `/practice/gp-9` | Reviewing a draft for equity, access, and plain language | Draft review record |
| `/practice/gp-10` | Procurement or contract equity review | Procurement equity record |
| `/practice/gp-11` | Leadership pathway or sponsorship plan for staff with disabilities | Leadership pathway or sponsorship plan |

## Appendix D: all community directory candidates

42-entry union: 41 recovered readings plus the additional Deaf, DeafBlind, and hard of hearing brief. Publication filtering may narrow the list. This is distinct from the 42 course packs categorized as community-context.

| Brief route | Reading/default title | Recovered chapters |
| --- | --- | ---: |
| `/minnesota-communities/american` | American culture | 30 |
| `/minnesota-communities/minnesota` | Minnesota culture | 30 |
| `/minnesota-communities/somali` | Somali Minnesota | 30 |
| `/minnesota-communities/hmong` | Hmong Minnesota | 30 |
| `/minnesota-communities/karen` | Karen Minnesota | 30 |
| `/minnesota-communities/african-american` | African American Minnesota | 30 |
| `/minnesota-communities/latino` | Latino Minnesota | 30 |
| `/minnesota-communities/tribal-nations` | 11 Tribal Nations | 30 |
| `/minnesota-communities/alaska-native` | Alaska Native people in Minnesota | 30 |
| `/minnesota-communities/european-american` | European American Minnesota | 30 |
| `/minnesota-communities/rural` | Rural and Greater Minnesota | 30 |
| `/minnesota-communities/russian-speaking` | Russian-speaking Minnesota | 30 |
| `/minnesota-communities/arabic-speaking` | Arabic-speaking Minnesota | 30 |
| `/minnesota-communities/oromo` | Oromo Minnesota | 30 |
| `/minnesota-communities/bosnian` | Bosnian Minnesota | 30 |
| `/minnesota-communities/amharic` | Amharic-speaking Minnesota | 30 |
| `/minnesota-communities/french` | French-speaking Minnesota | 30 |
| `/minnesota-communities/burmese` | Burmese Minnesota | 30 |
| `/minnesota-communities/khmer` | Cambodian Minnesota | 30 |
| `/minnesota-communities/chinese` | Chinese Minnesota | 30 |
| `/minnesota-communities/colombian` | Colombian Minnesota | 30 |
| `/minnesota-communities/cuban` | Cuban Minnesota | 30 |
| `/minnesota-communities/ecuadorian` | Ecuadorian Minnesota | 30 |
| `/minnesota-communities/ethiopian` | Ethiopian Minnesota | 30 |
| `/minnesota-communities/filipino` | Filipino Minnesota | 30 |
| `/minnesota-communities/guatemalan` | Guatemalan Minnesota | 30 |
| `/minnesota-communities/indian` | Indian (Asian Indian) Minnesota | 30 |
| `/minnesota-communities/japanese` | Japanese Minnesota | 30 |
| `/minnesota-communities/kenyan` | Kenyan Minnesota | 30 |
| `/minnesota-communities/korean` | Korean Minnesota | 30 |
| `/minnesota-communities/lao` | Lao Minnesota | 30 |
| `/minnesota-communities/lebanese` | Lebanese Minnesota | 30 |
| `/minnesota-communities/liberian` | Liberian Minnesota | 30 |
| `/minnesota-communities/mexican` | Mexican Minnesota | 30 |
| `/minnesota-communities/nigerian` | Nigerian Minnesota | 30 |
| `/minnesota-communities/puerto-rican` | Puerto Rican Minnesota | 30 |
| `/minnesota-communities/salvadoran` | Salvadoran Minnesota | 30 |
| `/minnesota-communities/thai` | Thai Minnesota | 30 |
| `/minnesota-communities/ukrainian` | Ukrainian Minnesota | 30 |
| `/minnesota-communities/vietnamese` | Vietnamese Minnesota | 30 |
| `/minnesota-communities/native-american` | Native American Minnesotans | 9 |
| `/minnesota-communities/deaf-deafblind-hard-of-hearing` | Deaf, DeafBlind, and hard of hearing Minnesotans | Existing brief; no recovered chapter pack |

## Appendix E: source snapshot fingerprints

Local census fingerprints; these do not establish deployment or factual accuracy.

| Source | Bytes | SHA-256 |
| --- | ---: | --- |
| `lib/content/courses/recovered.json` | 5741820 | `6248a9a39e8cc7b7df268b22c0e3aa5d44d50bca3a3360a1d22173205a0e4041` |
| `lib/content/courses/contract.ts` | 4353 | `a45e48fcd7ec917c65f63328f3e98119087a62bc93ee55cb1d4f2c0d1bee07a9` |
| `components/course-lesson.tsx` | 10256 | `9a1d6d80d3249181bf29859c1ec1de9a893940b611cdb95c0e243bc82870b6c9` |
| `lib/content/community-design-data.json` | 1153771 | `c712eeea91202d0c760db609b6d2884ce08f1abe9d548939ccac2fdb47eed073` |
| `lib/content/corpus.ts` | 50681 | `bb502c318782fb814eb4a632fb70f65a836d8cc57057b83dac162042bd060fd5` |
| `lib/content/corpus-domains.ts` | 85424 | `66a873f3d19348c583ee6c8d5ac98e6ec1ddcd90922a14c3564f4dd137882c54` |
| `lib/content/paths.ts` | 35620 | `0df84e69d7c2291cb054c843caae88b06b5506586c6d35af9ea0dd488303ce5e` |
| `lib/content/paths-domain.ts` | 37005 | `c6361d26cfb07124688d9573d88bbdc0c05efb91ebd3291abd8567cab904fc5d` |
| `lib/content/podcasts.ts` | 2944 | `227d6540141989c41a1c5623dc99da3ac16b77275a64a10404c0a2af81b1a42d` |

No implementation, source-content revision, external message, paid-service request, or website publication was performed for this review.
