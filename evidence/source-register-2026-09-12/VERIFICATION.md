# Source verification and the Research and sources section, September 12, 2026

Follows `SUMMARY.md` (the first inventory). Owner decision: verify the outside sources with receipts, shared sources first, and build both an annotated register and per-resource evidence panels drawn from it.

## Verification run (GitHub runner)

Workflow "Source verification (source register receipts)", runs 34697342150 (13:46 UTC) and 34698919231 (14:18 UTC, job 103567115212), ref `claude/youthful-mendel-fbk166`. The runner fetched every outside address in the register (all 155, which covers the 55 shared sources and the long tail in one pass) and recorded a receipt per address: HTTP status, final address after redirects, content type, page title, bytes and time checked. Receipts are stored in `data/source-register/verification-receipts.json`.

| Result | Count |
| --- | --- |
| Reached (HTTP 200) | 149 |
| Of which forwarded to a newer address | 11 |
| Forbidden to the runner (403) | 3 |
| Not found (404) | 2 |
| Timed out | 1 |

Not reached (second run, 14:19 UTC, checking each address exactly as the resource wrote it):

- `https://mn.gov/dhs/general-public/about-dhs/olmstead/` (404): the Minnesota Olmstead Plan page has moved. Ten resources cite it; the citation needs a current address.
- `https://one-dhs-equity-resource.vercel.app/equal-opportunity-access` (404): a cited program address that no longer exists.
- `https://www.hbs.edu/faculty/Pages/item.aspx?num=49132`, `https://www.hhs.gov/civil-rights/` and `https://www.hhs.gov/civil-rights/for-individuals/disability/index.html` (403): the sites refuse automated requests; a person should open them.
- `https://www.npr.org/2017/05/03/526655831/...` (timeout): did not answer within 25 seconds.

The first run (13:46 UTC) checked normalized addresses without trailing slashes; the register now keeps each address as written and the second run replaced those receipts. Forwarded addresses fell from 43 to 11 as a result.

Reaching an address confirms it exists. It does not confirm the content was reviewed against the resource that cites it; the staff page says so.

## What was built

- `lib/content/source-register.ts`: reads the register and receipts, assigns each source an authority group (government and official; accessibility standards; disability and civil-rights organizations; research, data and universities; other organizations, books and media; program documents and citations without an address) and a verification state (reached, reached and moved, not reached, checked on a date, not yet checked, program document, legal citation, named without an address, program page).
- `/learn/sources`, "Research and sources": every source except pointers to other program pages, grouped by authority, each with its check state, the program's own notes about it (the distinct notes its citing resources wrote), and every resource that uses it. A closing section lists sources named without an address and resources with no outside source on record. Page wording is an editable surface, `sources.page`, and passes the staff-copy lint.
- Course pages: each entry under "Sources and further reading" now shows its check state and a link to the register entry that lists where else the source is used. Library items with sources on record show a "Sources behind this resource" panel with the same states. Learning links to the section from its opening.
- Live checks and tests: `tests/source-register.test.ts` checks that every authored course source is correlated, every outside source has a receipt, anchors are unique, the page wording passes lint, and the page renders every entry. The registry migration test records the new surface.

## Limits

- The verification is a reachability check on one day. It is not a review of each source's content or currency.
- The Understanding DHS reference keeps its own check dates and review intervals; the register shows those as "Checked on".
- Two recovered-course pointers (`/professional-support` and `/communities`) still point at routes that no longer exist; they are program pages, not evidence, and stay off the staff register until the recovered courses are repaired through the course release path.
