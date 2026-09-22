# DSD Service System course series, September 19, 2026

Request: audit the fifteen-track "DSD-aligned learning academy" outline against the program's published courses, then author every course the audit found missing, in the same format, depth and thumbnail style as the existing program-authored courses, with photorealistic cover images.

Audit: 166 published courses were probed track by track against the outline (`$S/audit/corpus.json`, `probe.py`, in the session scratchpad). Thirty-five sub-topic gaps clustered into thirteen missing courses. False positives were removed before counting: "self-directed" matched self-directed *learning* (37 courses) rather than self-directed *services* (3); "aging" matched "engaging" and "managing"; "career pathways" matched staff HR courses rather than people served. The owner accepted the assessment and asked for all thirteen, service-system courses first, in a new `dsd-practice/` family.

Done: 13 program-authored course packs in `lib/content/courses/authored/dsd-practice/`, index numbers 1181 to 1193, registered through `lib/content/courses/authored/index.ts` and `disability-inclusion/plan.json` and published alongside the recovered and earlier authored collections through the same course surfaces and routes.

| # | Course | Index | Series band | Lessons | Minutes |
| --- | --- | --- | --- | --- | --- |
| 1 | Foundations of Disability Services in Minnesota | 1181 | Foundations | 5 | 54 |
| 2 | Service Coordination and Navigation | 1182 | Foundations | 4 | 48 |
| 3 | Self-Direction and Independent Living | 1183 | Foundations | 5 | 54 |
| 4 | Personal Outcomes and Quality of Life | 1184 | Foundations | 4 | 46 |
| 5 | Customized and Competitive Integrated Employment | 1185 | Foundations | 5 | 52 |
| 6 | Benefits, Assets and Economic Stability | 1186 | Foundations | 4 | 46 |
| 7 | Executive Function, Strengths and Support Design | 1187 | Practice | 4 | 46 |
| 8 | Brain Injury: Practice Essentials | 1188 | Practice | 5 | 54 |
| 9 | Aging, Health and Access | 1189 | Practice | 5 | 54 |
| 10 | Early Adversity, Resilience and Service Response | 1190 | Practice | 4 | 46 |
| 11 | Community Mapping and Belonging | 1191 | Practice | 4 | 46 |
| 12 | Communication Methods and Access | 1192 | Practice | 5 | 54 |
| 13 | Coaching and Supervising Direct Support | 1193 | Practice | 5 | 54 |

Shape: every course has 4 or 5 lessons of 10 to 12 minutes, 46 to 54 minutes in total; every lesson has an observable objective, three takeaways, a scenario with one recommended response, a transfer prompt with three options, a headed teaching text, a leader move, a knowledge check with feedback, and two or three of list, tabs, accordion, sorting, flashcards, statement, quote or a practical artifact. Each course has a job aid and six cited sources with https addresses. The final lesson of each course is a review or conversation the reader runs on their own work and ends with one change, one owner and one date. Content carries no years, no retired terminology, and none of the vocabulary `lib/brand/lint.ts` bans; "human judgment", "temperature" and "vectors" were avoided deliberately because the lint catches them.

Covers: thirteen paths reserved under `public/images/covers/dsd-*.jpg`, each seeded with a byte copy of a topically close approved photograph so the surfaces render now and a final photograph is a file replacement at the same path. The brief for each final photograph, its scene, disability representation and alt text is `docs/MULTIMEDIA-DSD-SERVICE-SYSTEM-COVERS-2026-09-19.md`. No final photograph has been authored.

Theme membership: the thirteen were added to `lib/content/courses/theme-memberships.json` (27 memberships across access, partnership, culture, structural, facilitation and intercultural), so they appear under the Learning page's theme filters in the static approved values as the earlier series do.

Source register: `data/source-register/source-register.json` rebuilt with the series' citations (37 outside sources new to the program; nothing removed, no existing citation reduced). Verification receipts for those 37 are recorded below.

Semantic vector projection: rebuilt from 2849 to 2993 vectors, with the model manifest's sha256 and document count updated (`scripts/search/prepare-public-index.ts`, 23.5 seconds of local inference over 1494 one-dhs and 1529 dsd documents). This is not optional housekeeping. Documents the projection does not cover are embedded at request time, and the thirteen courses pushed that past the six-second index budget in `lib/intelligence/retrieval/local-semantic.ts`, so semantic retrieval reported itself unavailable and ASK fell back to lexical search. `tests/ask-language-access-fallback.test.ts` caught it: passing at base, failing with the courses, passing again once the projection covers them. `tests/podcast-ask.test.ts` recovered at the same time.

Generator: `scripts/content/generate-authored-course-index.mjs` previously looked only in `disability-inclusion/` and would have dropped both the intercultural-practice and dsd-practice families on a regeneration. It now resolves each planned course across the family directories; regenerating reproduces the committed `index.ts` byte for byte (93 of 93 present).

Checks:

- `tests/authored-courses.test.ts`: 5 passed with 93 authored courses (contract, plan match, shape, minutes under 60, unique interaction ids, existing covers, secure sources, no years or retired terminology, staff-copy lint).
- Draft check run per file during authoring (same assertions plus lint over the intro transcript and governance text, which the main test does not read): 13 of 13 passed; the file was not committed.
- `npx tsc --noEmit`: clean. `npx eslint` on the family and the index: clean.
- `tests/learning-presentation.test.ts`: pinned Learning page tile count raised from 169 to 182; 8 passed. `tests/learning-hub.test.ts`, `tests/learning-catalog.test.ts`, `tests/learning-journey.test.ts`, `tests/library-search-continuity.test.ts`, `tests/editable-surface-migration.test.ts`, `tests/course-controls-and-sources.test.tsx`, `tests/course-interactions.test.tsx`, `tests/recovered-courses.test.ts`: pass.
- `tests/source-register.test.ts`: 5 passed once every outside address carried a receipt.
- Production build (`npx next build`): clean. Local render pass against the built app: `/learn` returns 200 and lists 188 tiles, 13 of them this series; all 13 course pages, sampled lesson pages and a share route return 200; the reserved cover renders on the course page; the access theme filter lists 12 of the 13.
- Three courses' lesson counts and minutes were read back from the files rather than assumed, and match the table above.

## Source verification receipts

`scripts/content/verify-sources.mjs` must run on a GitHub runner: this authoring environment's outbound proxy refuses the CONNECT tunnel to outside hosts with 403, which the runner would record as "not reached" and the staff sources page would then report as the sites failing. That would be untrue, so the proxy results were discarded. The receipts are obtained by dispatching `.github/workflows/source-verification.yml` on this branch and reading the `RECEIPT` lines from the job log; only the 37 sources without a receipt are merged, so the existing 239 receipts and their dates are untouched.

Three passes were needed, because the first two found addresses that were wrong rather than sites that were down.

| Outcome | Count | Notes |
| --- | --- | --- |
| Reached | 29 of the original 37 | Recorded with the date and, where the address forwarded, the final address. |
| Answered 403 to the checker | 5 | `inclusion.com`, `nadsp.org`, `resources.depaul.edu/abcd-institute`, `ahrq.gov`, `ssa.gov/work`. These sites are reachable in a browser; the receipt records what the checker saw rather than claiming a check that did not happen. |
| Address was wrong | 3 | Corrected rather than recorded as dead, see below. |

The three corrections:

- `acl.gov/DirectCareWorkforce` answered 404, and so did the program path guessed in its place. The citation now points at `acl.gov`, which the runner reached, with the note carrying the specificity.
- `medicaid.gov/medicaid/home-community-based-services/index.html` answered 404, and so did `/medicaid/hcbs`. The runner had reached `medicaid.gov/medicaid/program-integrity`, which showed the working path form is `/medicaid/<slug>` and that the `index.html` suffix was the problem: `/medicaid/home-community-based-services` answered 200 on the third pass.
- `dcwmn.org` did not answer at all. Replaced with PHI, whose direct care workforce research is what the citation was for; it answered 200.

All 275 outside addresses in the register now carry a receipt, and the existing 239 receipts and their dates are untouched.

This also explains the red preview deployments. The Vercel build gate (`scripts/vercel-build.mjs`) runs the hosted test config, which includes `tests/source-register.test.ts`, so an outside address without a receipt fails the build. The deployments on `217482c`, `a9730fe` and `879752c` each failed for that reason and for no other.

## Not done, and why

- Final cover photographs: briefed, not authored. The owner chose to reserve paths and write briefs rather than block the series on image production.
- Production theme membership: in production the Learning page reads `learn.hub` from the database, which was last republished with the intercultural series. The thirteen ids need adding to that publication's theme lists (as recorded for the disability inclusion series in `evidence/disability-inclusion-courses-2026-09-11/VERIFICATION.md`) for the theme filters to include them there; in the "All themes" view they appear regardless. Not done in this pass: it is a live database change and was not part of the request.
- `verify` CI remains red on `tests/page-copy-full-chain.integration.test.ts`, a mismatch between `lib/content/page-copy-contract.ts` and that test's expected `identityText` and `privacyText`. It is documented on the pull request as failing at base, this series does not touch that file or any file containing that copy, and it is excluded from the Vercel gate. On the CI run of `879752c` it was one of only two assertion failures, the other being the receipt assertion fixed here.

Two local-only failures are worth recording so they are not mistaken for regressions: sixteen PostgreSQL integration suites fail with `initdb failed` because this container has no PostgreSQL, and `tests/environment-contract.test.ts` fails with `Node 24.x is required; found 22.22.2` because this container runs Node 22. CI uses Node 24 and neither appears there.

## Production theme publication (Supabase project qhiawdhehhfuccxvhldo, learn.hub, scope one-dhs)

The Learning page reads its theme membership from the database, so the repository change alone does not make a course
findable by theme in production. Two append-only publications were made through `pac.save_owner_approved_surface`,
each with its own change note so either can be traced or reversed on its own. Nothing was removed in either.

Baseline before the work: revision 6 (`d486d767-7bdc-44a3-9ff8-049a89a9b31b`), publication decision 603.

1. **Revision 7** (`ab7ae488-2663-4211-935c-6d8f24e3889e`, decision 629) — the thirteen DSD Service System courses,
   27 memberships: access 12, partnership 6, culture 4, structural 2, facilitation 2, intercultural 1.
2. **Revision 8** (`3be9ecce-3112-4806-bb6f-53c375d2831b`) — 124 memberships restored for courses that were already
   published and live but absent from every theme list: the 38 intercultural practice courses (76 memberships), the ten
   culture-cluster courses, the four continuum courses, the three program integrity courses, and a number of disability
   inclusion memberships the publication had never carried.

| Theme | Revision 6 | Now | DSD | Intercultural practice | Lost | Duplicates |
| --- | --- | --- | --- | --- | --- | --- |
| accessIds | 46 | 73 | 12 | 15 | 0 | 0 |
| cultureIds | 29 | 56 | 4 | 9 | 0 | 0 |
| facilitationIds | 51 | 68 | 2 | 8 | 0 | 0 |
| interculturalIds | 60 | 93 | 1 | 18 | 0 | 0 |
| partnershipIds | 18 | 40 | 6 | 6 | 0 | 0 |
| structuralIds | 23 | 48 | 2 | 20 | 0 | 0 |

Method and why it was append-only rather than a wholesale replace with the approved code values: two themes turned out to
hold an id that the approved values do not contain (`cultureIds` and `facilitationIds`, one each). A replace would have
deleted them silently. Each publication therefore computed `approved EXCEPT current` in SQL and appended the difference,
so no existing id could be touched. Both were dry-run first and the row counts matched the dry run exactly.

Verification, run against revision 6 as the baseline: for every theme, the count of ids present at revision 6 and absent
now is 0, and the count of duplicated ids is 0. Live surface state reports revision 8 as current.

Ordering note: the thirteen DSD ids were published before the courses themselves are merged to the deployed branch. This
is inert rather than premature — `selectHubItems` only filters items that exist, and `tests/learning-hub.test.ts`
("cannot manufacture a record from a theme's membership") asserts that an id with no matching item produces nothing. The
memberships simply begin working the moment the courses ship. The intercultural practice, culture cluster, continuum and
program integrity courses, by contrast, are already live on `pac/one-dhs-pac-app`, so those memberships take effect now.
