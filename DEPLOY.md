> Current website target verified September 23, 2026: see [Railway website target](docs/WEBSITE-DEPLOYMENT-TARGET-2026-09-23.md). The Vercel target and local paths below are historical. Production publication remains on hold; use the verified website service only after separate release approval.

# DEPLOY.md — how a change gets onto the live One DHS / One DSD app, with proof

This is the only accepted deployment pathway. Every step has a check whose output is the receipt.
A deployment is not "done" until step 6 passes. Written September 9, 2026.

## Facts you need

| Item | Value |
|---|---|
| Live URL | https://one-dhs-pac.vercel.app |
| Vercel team / project | `equity123` / `one-dhs-pac` (project id `prj_nHxwFMaDXRMFCvvAfkQZ9YhIlxJp`) |
| Deploy folder (the tree that is live) | `C:\Users\garyb\Projects\one-dhs-urgent-publish-20260909` |
| Mirror of the same source | `C:\Users\garyb\Downloads\One DSD Equity Program (11)\complete-source\one-dhs-pac` |
| GitHub | `alphaequity123-afk/one-dhs-equity-resource`, branch `pac/one-dhs-pac-app` (Git-connected to Vercel) |
| Database | Supabase project `qhiawdhehhfuccxvhldo` (one-dsd-vercel-staging, used as production); runtime connection is in Vercel env `PAC_RUNTIME_DATABASE_URL` |
| Auth | None. `lib/auth/request.ts` returns `true` for every owner check. Never reintroduce a sign-in. |

## Step 1 — make the change in the deploy folder

Edit files in the deploy folder. If the same file exists in the mirror folder, copy it there too so the
two never drift (`cp` the file; do not hand-edit twice).

## Step 2 — type-check (receipt: exit code 0)

The deploy folder has no `node_modules`; use the mirror folder's compiler against the mirror copy:

```bash
cd "/c/Users/garyb/Downloads/One DSD Equity Program (11)/complete-source/one-dhs-pac" && node node_modules/typescript/bin/tsc --noEmit -p . ; echo "tsc exit: $?"
```

`tsc exit: 0` is the receipt. Anything else: fix before going further.

## Step 3 — database first, if the change needs a migration

New SQL goes in `db/migrations/00NN_*.sql` in both folders, then is applied to Supabase before the
code deploys (the migration runner is blocked by a checksum mismatch on 0001, so apply by hand through
the Supabase SQL editor or MCP `execute_sql`). Receipt: a `select` that proves the table/column/function
exists, pasted into the evidence file.

## Step 4 — deploy (receipt: a Production URL line)

```bash
cd /c/Users/garyb/Projects/one-dhs-urgent-publish-20260909 && vercel --prod --yes --scope equity123
```

The upload is small (~66 MB) because `.vercelignore` excludes local audio tooling and raw recordings.
If the CLI prints `Upload aborted` or `fetch failed`, run the same command again; do not add files to
the tree to "fix" it. Alternative that avoids uploading from this machine: commit and push to
`pac/one-dhs-pac-app`; Vercel builds from GitHub automatically.

Known build gates in `scripts/vercel-build.mjs` and what they mean when they fail:
- `.env.example contains undocumented setting X` → add `X` to `config/environment-contract.json`.
- `Semantic function trace is incomplete: ... libonnxruntime.so.1` → the ASK route's file trace missed the ONNX native
  library. Fixed September 10, 2026 by force-including `node_modules/onnxruntime-node/bin/napi-v6/linux/x64/**/*` in
  `next.config.ts` (`outputFileTracingIncludes`). If it ever recurs, redeploy with `--force` to bypass a stale build cache.
- The build runs the full vitest hosted suite (~15 min). If a previous "Ready" deploy finished in under a minute with no
  test output, the restored build cache skipped the tests — do not treat that as a passing suite.
- After any published-content edit (titles, summaries, text), rebuild `models/bge-small-en-v1.5/public-document-vectors.json`
  (see TRD.md, "Hosted test suite repaired") or ASK degrades to keyword-only retrieval and ASK tests time out.

## Step 5 — confirm the deployment is Ready (receipt: the `Ready` row)

```bash
vercel ls one-dhs-pac --scope equity123 | head -8
```

The top row must say `● Ready` and `Production`. An `● Error` row means the live site did NOT change;
read the log with `vercel inspect <deployment-url> --logs --scope equity123`.

When the machine doing the deploy has no Vercel CLI (for example a remote coding session), run Actions →
"Deployment receipt (DEPLOY.md step 5)" → Run workflow with the deployed branch or commit. It prints the
deployment Vercel recorded on GitHub for that commit (environment, state, time, unique deployment URL), confirms
the unique deployment and the production alias both serve the new head, and, if a `VERCEL_TOKEN` repository
secret exists, the same listing `vercel ls` would show. Its raw job log is an acceptable step 5 receipt.

## Step 6 — prove the live site changed (receipts: HTTP codes and content, no cookies)

Run these from the command line, which has no browser session and no cookies:

```bash
curl -s -o /dev/null -w "home %{http_code}\n" https://one-dhs-pac.vercel.app/
curl -sL https://one-dhs-pac.vercel.app/ | grep -c "data-pac-editor"          # 0 = staff see no editing controls
curl -sL -H "Cookie: pac_editing=on" https://one-dhs-pac.vercel.app/ | grep -c "data-pac-editor"   # 1 = editing available once turned on, still no sign-in
curl -s -o /dev/null -w "consultant api %{http_code}\n" https://one-dhs-pac.vercel.app/api/consultant/program   # 200 = no auth gate
for p in ja-equity-impact-questions lm-facilitation-application lm-how-this-program-works lm-interpreter lm-workplace-climate; do curl -s -o /dev/null -w "$p %{http_code}\n" "https://one-dhs-pac.vercel.app/library/$p"; done   # all 200
```

The same commands, plus the equity policy pages and the Disability Inclusion course series, run from a
GitHub runner on demand: Actions → "Live site checks (DEPLOY.md step 6)" → Run workflow (the workflow file is
`.github/workflows/live-checks.yml` on `main`). Its raw job log is an acceptable step 6 receipt when the
machine doing the deploy cannot reach the live host.

Then check the specific thing you changed the same way (a URL that must return 200, a string that
must appear, an API response that must contain the new field).

## Step 7 — write the evidence

Append to `C:\Users\garyb\Desktop\one-dhs-pac-live-edit-evidence.txt` (or a new dated file next to it):
UTC timestamp, deployment URL from step 5, and the raw command output from step 6. No summaries in
place of output. The evidence file is what gets shown to anyone who asks whether the deploy happened.

## What "done" means

All seven steps completed with their receipts. A green upload without step 6 is not done. A claim
without step 7 is not done.
