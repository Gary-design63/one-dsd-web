# Disability Inclusion course series, September 11, 2026

Request: author the owner's disability and disability-inclusion curriculum as eLearning courses on Learning and resources, one course per module, none longer than an hour, in the same format, thumbnail style and depth as the existing courses, researched and written rather than transcribed from the outline.

Done: 24 program-authored course packs in `lib/content/courses/authored/disability-inclusion/` (23 modules across Foundations, Applied inclusion, Practitioner and Strategic leadership, plus the Capstone), registered through `lib/content/courses/authored/index.ts` and published alongside the recovered collection through the same course surfaces, routes and theme memberships. Covers reuse the program's approved photographs. The recovered collection's bytes, counts and hashes are untouched.

Shape: every course has 4 or 5 lessons of 8 to 14 minutes, 40 to 56 minutes in total; every lesson has an observable objective, three takeaways, a scenario with one recommended response, a transfer prompt, a headed teaching text, a leader move, flashcards, a knowledge check with feedback, and two or three of list, tabs, accordion, sorting or a practical artifact. Each course has a job aid and four to six cited sources.

Checks: `tests/authored-courses.test.ts` (contract, plan match, shape, minutes under 60, unique interaction ids, existing covers, secure sources, no years or retired terminology in lesson wording, staff-copy lint); typecheck and lint clean; learning presentation, hub, recovered-course and surface tests pass with the tile count raised from 89 to 113. Local browser pass: 24 tiles on /learn with cover images, every course page and its lesson links return 200, no page errors.

Limits: the authoring environment has no outside network access, so sources were cited from established knowledge and could not be fetched at authoring; the `verify` workflow's pre-existing failures (missing `evidence/next-pass-2026-09-08` files, PostgreSQL runner failures) are unchanged. In production the course surfaces are served from the database when `PAC_DATABASE_EDITABLE_SURFACES` selects them; otherwise the static approved values render.

## Production content receipts

Production reads every editable surface from the database (`PAC_CONTENT_SOURCE=postgres`). Two things make the series visible there:

1. Code: program-authored course surfaces now serve their approved code values whenever the database holds no publication for them; a database publication, once the owner saves one, takes precedence (`loadPublishedEditableSurface` and `loadPublishedEditableSurfaces`, covered by `tests/authored-courses.test.ts`).
2. Database (Supabase project qhiawdhehhfuccxvhldo, through MCP execute_sql):
   - 24 rows inserted into `pac.surface_definitions` for `course.di-*` with the course-pack field contract and the standard review dimensions; receipt `course_definitions = 24`.
   - `learn.hub` (scope one-dhs, inherited by dsd) republished from revision 1d84a363-32e9-4a56-acdd-7a752bd80ccc, decision 537, to revision 1fc4f6cd-c48a-4d64-8f2d-9de6bec3bde4 with the series added to its themes: accessIds 21 to 45, cultureIds 22 to 28, partnershipIds 15 to 18, facilitationIds 49 to 51. No existing ids were removed.

## Deployment and live checks

Pull request #4 merged into `pac/one-dhs-pac-app` as 5cc721627db12980ca9bff268907c0c2f47d18a9. Vercel commit status on that commit: `Vercel – one-dhs-pac success` at 2026-09-11T04:14:52Z (deployment DdbmyqgZRYBybY9fR2sqRxKd3THL). The build completed within about two minutes of the merge, so per DEPLOY.md the restored build cache likely skipped the hosted test suite; the deployment itself is live.

DEPLOY.md step 6 run from a GitHub runner (workflow "Live site checks", run 34561516751, job 103145038690), raw output:

```
checked_at_utc=2026-09-11T04:15:26Z
home 200
data-pac-editor count: 1
consultant api 200
ja-equity-impact-questions 200
lm-facilitation-application 200
lm-how-this-program-works 200
lm-interpreter 200
lm-workplace-climate 200
/equity-policy 200
/equity-policy/analysis 200
/equity-policy/register 200
/equity-framework 200
/operationalizing-equity 200
policy dashboard heading: 2
framework bibliography: 2
footer link to framework: 1
unknown record 404
analysis post without body 400
```

The course-series checks (tiles on /learn and every course page) are recorded below once the extended workflow has run.

Course-series live checks (workflow run 34561630524, job 103145382937, 2026-09-11T04:17Z), raw output:

```
learn tiles for the series: 24
learn has first course title: 2
/courses/di-disability-diversity-belonging 200
/courses/di-models-and-perspectives 200
/courses/di-language-and-respectful-interaction 200
/courses/di-accessibility-basics 200
/courses/di-allyship-and-everyday-action 200
/courses/di-access-needs-and-individualized-support 200
/courses/di-inclusive-communication 200
/courses/di-accommodations-and-interactive-process 200
/courses/di-trauma-informed-culturally-responsive-practice 200
/courses/di-de-escalation-without-coercion 200
/courses/di-inclusive-meetings-events-learning 200
/courses/di-rights-policy-and-organizational-duties 200
/courses/di-accessibility-auditing-and-barrier-analysis 200
/courses/di-accessible-content-and-digital-learning 200
/courses/di-co-design-and-lived-experience 200
/courses/di-disability-data-privacy-and-measurement 200
/courses/di-inclusive-supervision-and-team-culture 200
/courses/di-change-management-and-implementation 200
/courses/di-facilitation-and-peer-learning 200
/courses/di-leadership-case-for-inclusion 200
/courses/di-governance-accountability-resourcing 200
/courses/di-inclusive-policy-procurement-technology 200
/courses/di-measuring-culture-and-sustained-progress 200
/courses/di-capstone-remove-a-real-barrier 200
first lesson 200
capstone lesson 5 200
```

All seven DEPLOY.md steps are complete for this release with their receipts.
