# Course: Conflict Resolution That Works for Neurodivergent Staff, September 12, 2026

Request: turn the owner's internal briefing note "Conflict Resolution That Works for Neurodivergent Staff" (two parts: adjusting conflict resolution for neurodivergent staff; neurodiversity-affirming mediation) into an eLearning course in the program's existing course format.

Done: one program-authored course pack, `lib/content/courses/authored/disability-inclusion/di-conflict-resolution-and-neurodiversity.ts`, registered as Level 2 module 7 (index 1125) of the Disability Inclusion series in `plan.json`, the generated `authored/index.ts`, and the access and culture themes in `theme-memberships.json`. Route: `/courses/di-conflict-resolution-and-neurodiversity`.

Source handling: the note's wording is carried into the lessons with light adaptation for the course format. Part 1 became lessons 1 to 3 (one style is not the standard; where standard methods go wrong; changing the process). Part 2 became lessons 4 and 5 (neurodiversity-affirming mediation; limits, confidentiality and briefing a partner). The note's closing briefing paragraph is the lesson 5 artifact. "DEIA" is spelled out as diversity, equity, inclusion and accessibility, matching the note's own definition and the course-wording rule.

Shape: five lessons of 8 to 12 minutes, 50 minutes in total, stated as 45–52 minutes. Every lesson has an observable objective, three takeaways, a scenario with one recommended response, a transfer prompt, at least five blocks and a knowledge check. Practical artifacts: a before-the-meeting note (lesson 3), an agreement in specific language (lesson 4), a one-paragraph partner briefing (lesson 5). A sorting exercise in lesson 2 separates processing differences from harm that still needs a direct response.

Cover: reused the approved photograph `/images/covers/intercultural-conflict-styles.jpg` (two colleagues in a serious conversation across a table with papers). Reuse decision: the subject is a workplace conflict conversation, the image is photorealistic and already approved, and no new imagery was needed. Alt text written for this course. No video or audio companions were authored.

Checks run locally (September 12, 2026): `tests/authored-courses.test.ts`, `tests/library-search-continuity.test.ts`, `tests/learning-hub.test.ts`, `tests/learning-catalog.test.ts`, `tests/learning-presentation.test.ts` (tile count 113 to 114), `tests/staff-content-voice.test.ts`, `tests/safety-and-brand.test.ts`, `tests/editable-surface-migration.test.ts`, `tests/multimedia-learning-coverage.test.tsx`, `tests/work-learning.test.ts`, `tests/ask-learning-guidance.test.ts`: all passing. Typecheck clean. Public document vectors rebuilt (2285 to 2297 documents) so ASK finds the course without embedding it at request time. Dev server: course page and lesson 1 return 200 and render the cover, objectives and lesson list; the Learning page lists the tile with `data-learning-id="course-di-conflict-resolution-and-neurodiversity"`.

Limits: sources are cited from established public sites and could not be fetched from this environment. Production reads editable surfaces from the database; the course is served from its approved code values until a publication exists, as with the rest of the authored series. Whether the published `learn.hub` theme lists in production need the new id added is recorded in the deployment evidence for this release.

## Production content receipts (September 12, 2026)

Supabase project qhiawdhehhfuccxvhldo, through the database tools:

- `learn.hub` (scope one-dhs, inherited by dsd) republished through `pac.save_owner_approved_surface` from revision 1fc4f6cd-c48a-4d64-8f2d-9de6bec3bde4 (decision 602) to revision d486d767-7bdc-44a3-9ff8-049a89a9b31b, decision 603, with `course-di-conflict-resolution-and-neurodiversity` placed after the de-escalation course: accessIds 45 to 46, cultureIds 28 to 29. No existing ids were removed. Change note: "Add the course Conflict Resolution That Works for Neurodivergent Staff to the access and culture themes."
- One row inserted into `pac.surface_definitions` for `course.di-conflict-resolution-and-neurodiversity` with the same field contract, protected fields and review dimensions as the other authored courses; registered at 2026-09-12 12:57:26 UTC. The course itself is served from its approved code values until the owner publishes a database revision.

Full local test run after the change: 1780 passed, 127 skipped; the only failures are the PostgreSQL integration suites (no local database server in this environment) and the pre-existing Vercel build-command expectation in `tests/environment-contract.test.ts`.
