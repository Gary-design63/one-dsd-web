# Deployment evidence, September 12, 2026 (DEPLOY.md step 7)

Written from the remote development session, which cannot reach the owner's desktop evidence file or run the Vercel CLI. All step 6 output below is raw GitHub runner log text, copied without summary.

## What was deployed

| Item | Value |
| --- | --- |
| Deploy branch | `pac/one-dhs-pac-app` |
| Release merge | PR #12, merge commit `15aa3ead` (header share control, podcast pages, practice infrastructure stages one and two, index rebuild to 2285 documents, CI repairs, PRDs v3.0, build plan) |
| Follow-up merge | PR #13, merge commit `a45f7d39` (serve gp-12 and gp-13 from approved code values until a database publication exists) |
| Build | Vercel Git integration, `scripts/urgent-publish-build.mjs` (Next build) |
| Step 5 receipt | Produced by the "Deployment receipt (DEPLOY.md step 5)" workflow from Vercel's deployment records on GitHub; see the section below. |

## Step 5, Vercel deployments recorded on GitHub (workflow deployment-receipt.yml, runs 34689175592, 34689177524, 34689096801, 2026-09-12T10:41Z to 10:43Z)

Vercel's Git integration writes a GitHub Deployment for every commit it builds. Environment "Production – one-dhs-pac", creator vercel[bot], state success:

```
commit 15aa3ead (PR #12)  deployment_id=6408482752  state=success  created_at=2026-09-12T10:11:02Z  environment_url=https://one-dhs-2793a5ca8-equity123.vercel.app
commit a45f7d39 (PR #13)  deployment_id=6408605246  state=success  created_at=2026-09-12T10:26:24Z  environment_url=https://one-dhs-9kxlbok27-equity123.vercel.app
commit 1c449f94 (PR #14)  deployment_id=6408715684  state=success  created_at=2026-09-12T10:40:22Z  environment_url=https://one-dhs-2zjymxovq-equity123.vercel.app
production alias https://one-dhs-pac.vercel.app  HTTP/2 200  x-vercel-id: iad1::iad1::5crql-1789209675087-b76409131d2a
production alias serves the new head (pause worksheet present): 1
VERCEL_TOKEN secret not set; the GitHub deployment record above is the step 5 receipt.
```

The unique deployment URLs answer 302 to an anonymous request because deployment protection is on; the production alias is the served head. The repository is also connected to a second Vercel project (one-dhs-equity-resource); its deployments are not the production site and are excluded above.

## Step 6, first run after PR #12 (run 34688062385, checked_at_utc=2026-09-12T10:17:45Z)

```
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
/practice/gp-12 200
/practice/gp-13 200
/equity-policy/analysis?kind=pause 200
practice index lists both paths: 0
register offers the pause form: 1
```

Finding: the routes answered but the live practice index did not list the new paths, because production reads path surfaces from the database and the new surfaces had no publication row. Fixed by PR #13.

## Step 6, after PR #13 (run 34688742240, 2026-09-12T10:33Z; and run 34688840931, 2026-09-12T10:35Z)

```
/practice/gp-12 200
/practice/gp-13 200
/equity-policy/analysis?kind=pause 200
practice index lists both paths: 1
register offers the pause form: 1
pause worksheet renders: 1
material check worksheet renders: 1
/podcasts/equity-toolkit 200
/podcasts/anti-racism-public-service 200
/podcasts/not-a-podcast 404
share controls on home (header and footer): 1
podcast page has its own player: 1
learn page links to podcast pages: 2
```

The standard checks and the equity policy checks repeated with the same results as the first run (all 200; unknown record 404; empty analysis post 400).

## Share links on the deployed site (run 34688063729, 2026-09-12T10:18:10Z)

```
Result: all three links open their own resource only
course: Accessibility Basics
  Share link:   https://one-dhs-pac.vercel.app/courses/di-accessibility-basics
  HTTP 200; opens=yes, noPersonalContext=yes, showsThisResource=yes, anchorPresent=yes, otherResourcesAbsent=yes, shareControlPresent=yes
library resource: How to use this program
  Share link:   https://one-dhs-pac.vercel.app/library/lm-how-this-program-works
  HTTP 200; opens=yes, noPersonalContext=yes, showsThisResource=yes, anchorPresent=yes, otherResourcesAbsent=yes, shareControlPresent=yes
podcast: DHS equity policy and toolkit
  Share link:   https://one-dhs-pac.vercel.app/learn?view=one_dsd#podcast-equity-toolkit
  HTTP 200; opens=yes, noPersonalContext=yes, showsThisResource=yes, anchorPresent=yes, otherResourcesAbsent=yes, shareControlPresent=yes
```

## Run links

- https://github.com/alphaequity123-afk/one-dhs-equity-resource/actions/runs/34688062385
- https://github.com/alphaequity123-afk/one-dhs-equity-resource/actions/runs/34688742240
- https://github.com/alphaequity123-afk/one-dhs-equity-resource/actions/runs/34688840931
- https://github.com/alphaequity123-afk/one-dhs-equity-resource/actions/runs/34688063729

## Not verified from this session

- The Vercel build log itself. The GitHub deployment record above is the step 5 receipt; `vercel ls one-dhs-pac --scope equity123` from a signed-in machine, or a `VERCEL_TOKEN` repository secret, would add the project listing.
- The hosted test suite does not run in the current urgent-publish build; local receipts for this release are under `evidence/practice-infrastructure-stage-one/` and `evidence/practice-infrastructure-stage-two/`.

# Release 3: plain-language wording, editing controls off by default, neurodiversity conflict-resolution course (2026-09-12)

Pull request #18 merged into `pac/one-dhs-pac-app` as 309c3dad5289faf687b6477432f0d2187d1362a9 at about 13:05 UTC.

## Step 5 receipt (workflow "Deployment receipt", run 34695891271, job 103559192320)

```
checked_at_utc=2026-09-12T13:14:59Z
deployed_ref=pac/one-dhs-pac-app
deployed_sha=309c3dad5289faf687b6477432f0d2187d1362a9
github_deployments_for_sha=2
deployment_id=6409985063 environment=Preview – one-dhs-equity-resource creator=vercel[bot] created_at=2026-09-12T13:10:42Z
deployment_id=6409956429 environment=Production – one-dhs-pac creator=vercel[bot] created_at=2026-09-12T13:07:29Z
  status deployment_id=6409956429 state=success created_at=2026-09-12T13:07:29Z environment_url=https://one-dhs-bcsliytas-equity123.vercel.app
ready_deployment_url=https://one-dhs-bcsliytas-equity123.vercel.app
HTTP/2 302   (unique deployment URL; deployment protection is on)
--- production alias
HTTP/2 200
x-vercel-id: cle1::iad1::djxhb-1789218900660-975b0f1df710
production alias serves the new head (pause worksheet present): 1
```

## Step 6, first run (workflow "Live site checks", run 34695890056, job 103559189937, 13:14:56Z)

Standard, equity policy, practice infrastructure and share/podcast checks: identical to release 2 (all 200; editing controls for staff 0, with editing turned on 1; unknown record 404; empty analysis post 400). New checks:

```
/courses/di-conflict-resolution-and-neurodiversity 200
/courses/di-conflict-resolution-and-neurodiversity/conflict-resolution-and-neurodiversity-1 200
/learn 200
/start 200
/ask 200
/support 200
learn lists the new course tile: 1
learn access theme includes the course: 1
course page shows five lessons: 5
ruled-out phrases on / (expect 0): 1
ruled-out phrases on /start (expect 0): 1
ruled-out phrases on /ask (expect 0): 1
ruled-out phrases on /support (expect 0): 1
ruled-out phrases on /practice (expect 0): 1
ruled-out phrases on /areas (expect 0): 1
ruled-out phrases on /learn (expect 0): 1
ruled-out phrases on /about (expect 0): 1
```

Finding: production reads staff wording from database publications, which still carried the older wording. The deployed code was correct; the publications had not been updated.

## Production publications updated (Supabase project qhiawdhehhfuccxvhldo, 13:17 to 13:25 UTC)

- 22 editable surfaces republished through `pac.save_owner_approved_surface`, replacing only the fields that contained ruled-out phrasing with the approved code wording (decisions 604 to 625): about.page, areas.page, ask.page, equity-toolkit.home, equity.practice, graduation-path.gp-1/2/4/6/7/8/9/10/11, learn.page, paths.index, practice.page, practice.path-shell, site.context (one-dhs and dsd), start.page, support.right-person. Change note on every revision: "Replace system-sounding wording with the plain-language wording the owner directed on September 12, 2026."
- Home and footer page copy republished through `pac.save_owner_approved_page_block`: page-home revision 2b44db71-4287-4ac2-bae0-09b4b96f616f (decision 191; aboutText, applyLabel, guidedIntro) and site-footer revision 3eb773d4-f1c8-4cec-9c2e-0360f21ff5b6 (decision 192; privacyText, identityText).
- Database scan after the updates: no current publication (content or surface) contains any of the ruled-out phrases. Two published items still contain the ordinary noun phrase "work product": the Amplify well-being page ("Rest and enjoyment do not need a work product to justify them") and the recovered course "Accessibility as a leadership responsibility", whose source text is preserved as received.

## Step 6, final run (workflow "Live site checks", run 34696396759, job 103560513600, 13:25:41Z)

All earlier checks unchanged (all 200; editing controls for staff 0, with editing on 1). Release checks:

```
learn lists the new course tile: 1
learn access theme includes the course: 1
course page shows five lessons: 5
ruled-out phrases on / (expect 0): 0
ruled-out phrases on /start (expect 0): 0
ruled-out phrases on /ask (expect 0): 0
ruled-out phrases on /support (expect 0): 0
ruled-out phrases on /practice (expect 0): 0
ruled-out phrases on /areas (expect 0): 0
ruled-out phrases on /learn (expect 0): 0
ruled-out phrases on /about (expect 0): 0
where the phrase appears on the home page:
(no output)
```

## Run links

- https://github.com/alphaequity123-afk/one-dhs-equity-resource/actions/runs/34695891271
- https://github.com/alphaequity123-afk/one-dhs-equity-resource/actions/runs/34695890056
- https://github.com/alphaequity123-afk/one-dhs-equity-resource/actions/runs/34696226758
- https://github.com/alphaequity123-afk/one-dhs-equity-resource/actions/runs/34696307508
- https://github.com/alphaequity123-afk/one-dhs-equity-resource/actions/runs/34696396759

## Not verified from this session

- The Vercel build log itself (no VERCEL_TOKEN secret); the GitHub deployment record is the step 5 receipt.
- Pages beyond the eight checked for ruled-out phrasing were not fetched individually; the database scan covers every current publication.

# Release 4: One DSD view repair (hotfixes #21 and #22, 2026-09-12)

Reported by the owner at about 13:40 UTC: Learning in the One DSD view showed "Something did not load". Reproduced from the runner (run 34697529331, 13:50 UTC): `/learn`, `/practice`, `/areas` and `/about` returned 500 in the One DSD view; the One DHS view was unaffected. Cause: the published-content reader failed the whole list when any one item missed the staff content contract or the release editor's presentation rules. The 52 One DSD resources published on 2026-09-09 22:50 UTC carry an extra bookkeeping key (`canonicalOriginal`), an empty review date, a program address in the source field and long body parts, so every page that lists content in the One DSD view had failed since that publication. The One DSD view had not been part of the live checks.

- #21 merged as 57d4f56317e04ecd247cece2c054fed962dafb41 (production deployment 6410532642, success 14:11:27Z): presentation rules applied per item; field-level gaps repaired lightly and served. Run 34698920863 at 14:19 UTC still showed 500 on the four pages: the strict content contract rejected the extra key before the presentation rules were reached.
- #22 merged as e82a6c8cd1ecfa1bc8626be7324ff05fa1fc0d6a (production deployment 6410659069, success 14:25:02Z; receipt run 34699602780): unknown keys dropped instead of failing the item; an item that still does not match the contract is withheld alone with a content-free note.

## Step 6 (workflow "Live site checks", run 34699601413, job 103568899859, 14:32:53Z)

All earlier checks unchanged (all 200; editing controls for staff 0, with editing on 1; ruled-out phrases 0 on every checked page). One DSD view:

```
/ (One DSD view) 200; error page shown: 0
/learn (One DSD view) 200; error page shown: 0
/start (One DSD view) 200; error page shown: 0
/ask (One DSD view) 200; error page shown: 0
/practice (One DSD view) 200; error page shown: 0
/areas (One DSD view) 200; error page shown: 0
/support (One DSD view) 200; error page shown: 0
/one-dsd (One DSD view) 200; error page shown: 0
/paths (One DSD view) 308; error page shown: 0
/practice/gp-1 (One DSD view) 200; error page shown: 0
/practice/gp-12 (One DSD view) 200; error page shown: 0
/about (One DSD view) 200; error page shown: 0
/minnesota-communities (One DSD view) 200; error page shown: 0
/library/ja-plain-language (One DSD view) 200; error page shown: 0
/equity-policy (One DSD view) 200; error page shown: 0
/learn/equity-toolkit (One DSD view) 200; error page shown: 0
/my-work (One DSD view) 200; error page shown: 0
/orientation (One DSD view) 200; error page shown: 0
/understanding-dhs (One DSD view) 200; error page shown: 0
/learn?theme=access (One DSD view) 200; error page shown: 0
/learn?q=meeting (One DSD view) 200; error page shown: 0
/learn (One DHS view) 200; error page shown: 0
```

## Content follow-up for the owner

Of the 52 One DSD resources published on September 9, a database scan against the presentation rules shows 26 are now served with a light repair (review date from the publication date; the program address not shown as an outside source) and 26 are withheld from staff because their text contains list-style formatting or words the internal-term rule flags in ordinary use ("temperature", "metadata", "browser tab", "endpoint", "embedding"). The withheld items include the Accessible Communications and Accessible Meetings checklists, the Microsoft Word, Excel, PowerPoint and PDF accessibility checklists, the Equity Analysis Toolkit walk-throughs, and several DSD practice walk-throughs. They need either a content repair through the resource release path or a decision to relax the list-formatting and internal-term rules for imported resources. Neither was done in this release.

## Run links

- https://github.com/alphaequity123-afk/one-dhs-equity-resource/actions/runs/34697529331
- https://github.com/alphaequity123-afk/one-dhs-equity-resource/actions/runs/34698920863
- https://github.com/alphaequity123-afk/one-dhs-equity-resource/actions/runs/34699602780
- https://github.com/alphaequity123-afk/one-dhs-equity-resource/actions/runs/34699601413

# Release 5: Research and sources section (PR #23, 2026-09-12)

PR #23 merged into `pac/one-dhs-pac-app` as ac4a864901e1b840e43b0eb1037e12158e07e128 at about 14:35 UTC.

## Step 5 (workflow "Deployment receipt", run 34700217759, 14:45:41Z)

```
deployed_sha=ac4a864901e1b840e43b0eb1037e12158e07e128
deployment_id=6410782749 environment=Production – one-dhs-pac created_at=2026-09-12T14:38:02Z state=failure
deployment_id=6410803052 environment=Preview – one-dhs-equity-resource created_at=2026-09-12T14:40:12Z state=success
ready_deployment_url=none
production alias: HTTP/2 200 (still serving the previous head, e82a6c8)
```

The production build of the merge commit failed. The same content built successfully one minute earlier as the branch deployment of 37b49df on the same Vercel project (commit status "Vercel – one-dhs-pac: Deployment has completed", 14:37:21Z), and the production build script (`scripts/urgent-publish-build.mjs`, then `next build`) completes locally with exit 0. The Vercel build log is not reachable from this session (no VERCEL_TOKEN), so the reason is not recorded here. A new commit to the deploy branch (this evidence) triggers a fresh production build; its result follows below.

## Step 6 on the previous head (run 34700216300, 14:45:39Z)

All earlier checks and the One DSD view: all 200. Research and sources step: `/learn/sources 404` and zero source states, as expected while the previous head is served. Not a pass for this release.
