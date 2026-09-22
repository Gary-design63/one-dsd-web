# Equity Policy page, guided toolkit walkthrough, and register — verification

Date: 2026-09-11. Branch: `claude/youthful-mendel-fbk166` (based on `pac/one-dhs-pac-app`).

## Request / Purpose / Done / Good (docs/WORKING-AGREEMENT.md)

- **Request.** Owner asked for the Equity Policy dashboard and the guided Equity Analysis Toolkit walkthrough to live inside the One DHS / One DSD People, Access and Culture program (this application), with staff submissions recorded and counted, a register with follow-ups and download, culture survey entry, and an open, reversible change history. Owner decided the record is open to all DHS staff by design ("this is a transparent process") and agreed that no change to an existing record may be silent.
- **Purpose.** Learn → use → see: staff learn each toolkit step, write it for live work, and the program shows how the policy is being used, in aggregate only.
- **Done.** Routes `/equity-policy`, `/equity-policy/analysis`, `/equity-policy/analysis/[id]`, `/equity-policy/register`; three API routes; three append-only decision families registered in the TypeScript contract, the SQL contract (migration 0056), and the data-lifecycle register; unit and fresh-PostgreSQL tests; links from the toolkit companion, Operationalizing equity, and the footer.
- **Good.** Roles and dates only; no per-person measures; every write validated in three layers; every change to existing state is an appended event with a visible history and a one-click revert; staff copy passes the voice and brand lint.

## Data handling

- Record families (all `decision`, append-only, `versioned_program_record` profile, S2, `voluntary_shared`):
  `equity_analysis:*` (submission), `equity_followup:*` (follow-up done / not done events, with `reverts`), `equity_survey:*` (survey wave set / remove events, with `reverts`).
- Person-profile keys remain prohibited at both boundaries; the walkthrough asks for roles, groups, and dates and runs the same identifying-detail check as shared results.
- Browser: one private draft key `pac_equity_analysis_draft_v1` (registered), cleared when the analysis is added.
- Request limits: `staff-equity-analysis` (10 per 10 minutes), `staff-equity-register` (60 per 10 minutes), registered in TypeScript and SQL.
- No new settings. Writes in deployed environments require `PAC_STORE=postgres` (same guard as shared results).

## Migration

`db/migrations/0056_pac_equity_analysis_records.sql`. Production already records `0055_pac_owner_approved_canonical_resources.sql`, which is not in this repository; 0056 was numbered after it. Per DEPLOY.md step 3 the migration is applied to Supabase by hand before the code deploys; receipt below.

## Receipts

Filled in as each check runs; see the section at the end of this file.

## Addendum, September 11, 2026: Equity Strategic Framework page

Request: use the owner's Equity Strategic Plan concept map and resource suite as the operational spine of the One DHS and One DSD program, map every program part and workflow to it, remove all timelines and dates, use "equity" in place of earlier terminology, and move inline references to Chicago-style notes at the bottom of the page.

Done: `/equity-framework` (static page) rendered from `lib/program/equity-framework.ts`. Six pillars, improvement cycle mapped to the charter's six-step value sequence with One DHS and One DSD pages per stage, all thirteen program functions mapped to pillars, three stages with readiness conditions instead of years, tool suite with an honest "in this program" status per tool, twelve Chicago notes and a bibliography. Linked from the footer, `/operationalizing-equity` and `/equity-policy`.

Checks: typecheck clean; eslint clean on touched files; staff-routes-brand, staff-content-voice, staff-presentation and no-surveillance suites pass (75 tests); page returns 200 in the local dev server; no horizontal scroll at 400 px or 1280 px; one h1; no page errors. A scan of the source for years, cadences and the earlier terminology found none outside the bibliography dates that the citation style requires.

Limits: the One DSD ecosystem proposal quoted in the concept map was not available for independent review and is cited as reported. Tool statuses describe the program today and promise nothing.

## Deployment receipts, September 11, 2026

### Step 3, database first (Supabase project qhiawdhehhfuccxvhldo, applied through MCP execute_sql at 2026-09-11T01:55:00Z)

Pre-apply state: `assert_runtime_work_object_contract`, `assert_runtime_idempotency_receipt_contract` and `assert_runtime_rate_limit_request` present with the expected signatures; `runtime_rate_limits_scope_check` (from 0009) and `runtime_rate_limits_registered_identity` (nine scopes) both present; last recorded migration 0055.

Receipt select after apply (raw result):

```
functions    assert_equity_analysis_record, assert_equity_calendar_date, assert_equity_followup_event, assert_equity_survey_event, assert_runtime_idempotency_receipt_contract_pre_equity_v1, assert_runtime_rate_limit_request_pre_equity_v1, assert_runtime_work_object_contract_pre_equity_v1, prevent_equity_record_rewrite
trigger      immutable_equity_record
constraints  runtime_rate_limits_registered_identity: CHECK (((scope = ANY (ARRAY['staff-ask','owner-login','consultation-intake','consultation-tracking','staff-program-outcome','program-login-network','program-login-account','program-invitation-network','program-invitation-code','staff-equity-analysis','staff-equity-register'])) AND (subject_hash ~ '^[a-f0-9]{64}$')))
migration    0056_pac_equity_analysis_records.sql 87B4149BC458FFBBC732612AD3AA0D53F82D35902693B40D096B61A56515EC1F 2026-09-11 01:55:00.634847+00 consultant-mcp-apply
```

`runtime_rate_limits_scope_check` no longer appears. Function calls `pac.assert_runtime_rate_limit_request('staff-equity-analysis', <64 hex>, 10, 600)` and `('staff-ask', <64 hex>, 30, 600)` both returned without error, so the new scope and delegation to the prior contract both work.

### Steps 4 and 5, deployment (September 11, 2026)

Pull request #3 merged into `pac/one-dhs-pac-app` as d8ecb10b80416c29b9485ccfcafe24ba20ec7aff at about 02:10 UTC. Vercel builds that branch as production.

Commit status on the merge commit, read from the GitHub commit status API at 02:14 UTC (raw):

```
combined: success
  Vercel – one-dhs-pac success https://vercel.com/equity123/one-dhs-pac/8iee6WPZ7UGFgc2Db6vfyue5kwds 2026-09-11T02:14:26Z
```

Caution from DEPLOY.md step 4: this build reported success about four minutes after the merge, which suggests a restored build cache skipped the hosted test suite. The deployment is live; the hosted suite has not been proven to have run on it. The `verify` GitHub Actions workflow is red on this commit and was red on the three prior base-branch commits with the same failure set (see the pull request comment).

### Step 6, live checks: not yet run

The live site and its preview hosts (`*.vercel.app`) are blocked by the network policy of the environment that performed this deployment, so the curl receipts could not be produced from it. `.github/workflows/live-checks.yml` runs the exact DEPLOY.md step 6 commands, plus checks for the new pages, from a GitHub runner on demand. Its raw output is the step 6 receipt and belongs here once it has run.
