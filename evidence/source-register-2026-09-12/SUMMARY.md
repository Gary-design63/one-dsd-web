# Source register: first inventory, September 12, 2026

Request: before designing a literature research and review section, extract every source the program cites into one structured register and correlate each source with the resources that rely on it, so the shape of the evidence is visible.

Built by `scripts/content/build-source-register.ts` (run through `scripts/content/source-register.config.mts`). Output: `data/source-register/source-register.json`. The build reads program content in code and data only. It fetched nothing and verified nothing; every entry carries the verification state it actually has.

## What was inventoried

| Resource family | Resources | With at least one outside source | With no source recorded |
| --- | --- | --- | --- |
| Program-authored courses (Disability Inclusion series) | 25 | 25 | 0 |
| Recovered courses | 86 | 33 | 0 (the other 53 cite only program pages) |
| Community briefs | 14 | 9 | 0 |
| Library items (core corpus) | 25 | 4 | 19 |
| Library items (domain corpus: tool cards, notes) | 34 | 9 | 0 |
| Understanding DHS reference entries | 30 | 30 | 0 |
| Equity Framework bibliography | 1 | 1 | 0 |
| Practice paths | 13 | 0 | 13 (paths link to program resources, not to outside sources) |
| Editable link lists (learning hub reading, toolkit) | 2 | 2 | 0 |

## Shape of the evidence

- 238 distinct sources, 573 citations, 230 resources, 55 outside hosts.
- 155 outside sources. 107 of them sit on government hosts (mn.gov, revisor.mn.gov, dhs.state.mn.us, ada.gov, section508.gov, eeoc.gov, cdc.gov, dol.gov, access-board.gov, hhs.gov). The rest are standards bodies (w3.org), disability and civil-rights organizations (ADA National Network, Job Accommodation Network, Minnesota Council on Disability, Disability Hub MN), data sources (Minnesota Compass), and a small number of books, articles and media.
- 55 outside sources are shared by more than one resource; 12 are shared across resource families. The most-cited outside sources: ADA National Network (16 resources), Minnesota Council on Disability (16), the DHS Equity Policy of August 4, 2023 (14), CDC Disability Inclusion (13), Job Accommodation Network (13), the Minnesota Olmstead Plan (10).
- 100 outside sources are cited by exactly one resource. That is the long tail a review section would need to annotate one by one.
- 69 citations point to other program pages rather than outside sources. Two recovered-course pointers, "/professional-support" and "/communities", each appear in 41 courses and no longer match current routes; they are correlation targets to repair, not evidence.
- 5 placeholder citations name a source without an address: the community self-description note, the Minnesota Department of Health autism studies (Somali and Hmong), the Minnesota African American Family Preservation and Child Welfare Disproportionality Act reference, and the rebuilt Anti-Racism Resource Guide continuum. 2 legal citations (the ADA and Section 508) are cited by name only.
- Verification: the 34 Understanding DHS reference sources carry a checked-on date (September 8, 2026, with review intervals). Every other outside source is "cited, unverified". No source was fetched during this build.

## Where the evidence is thin

- 53 recovered courses cite only program pages. Most are the cultural-intelligence and community series, which were rebuilt as original staff learning; their evidence lives in the community briefs, not in the course packs.
- 19 core library items (checklists, question banks, the toolkit companion, orientation modules) record no source at all. Several are program method pieces where a source is not expected; a few, such as the toolkit companion, should point at the DHS Equity Policy and the Minnesota Equity Analysis Toolkit that they summarize.
- 5 of 14 community briefs have no outside address, only a placeholder or a program note. Those briefs already say that their community-informed descriptions await source and representation review.

## Next steps this inventory makes possible

1. Decide the shape of the staff-facing section: an annotated register, a per-resource evidence panel, or both.
2. Verify the 155 outside addresses with receipts, in priority order: the 55 shared sources first, then the long tail. Record the result on each entry.
3. Repair the two stale program-route pointers in the recovered courses through the existing course release path.
4. Fill the five placeholder citations where a public source exists.
5. Add evidence to the library items that summarize official documents.
