# Stage Zero evidence and decisions

> **Current authority — [OWNER-2026-09-07-DIGITAL-MING](OWNER-DIRECTIVE-2026-09-07.md):** This is a preserved September 4 baseline. Its intake-only content approval, initial API-key posture, and MVP limits are superseded where the later owner directive applies.

## Source freeze

- Canonical working copy: `C:\Users\garyb\Downloads\One DSD Equity Program (11)\one-dhs-pac`
- GitHub source: private repository `alphaequity123-afk/one-dhs-equity-resource`, branch `pac/one-dhs-pac-app`
- Vercel project: `one-dhs-pac`, project ID `prj_nHxwFMaDXRMFCvvAfkQZ9YhIlxJp`
- Production alias: `https://one-dhs-pac.vercel.app`
- Runtime: Next.js 16.3.4, React 19.2.8, TypeScript, npm lockfile
- Reproducibility proof: a separate shallow clone installed from `package-lock.json` and passed type checking, lint, 22 tests, and a production build on September 4, 2026. That disposable clone was then removed.
- Current files and all commits reachable from the branch were scanned for common credential patterns. No match was found.
- A credential embedded in the local Git configuration of an obsolete April prototype was removed from that local remote URL. Revocation or rotation in GitHub remains an owner account action if the token is still active.

The two September 4 planning ZIP files contain the same 43 payload entries. They are duplicate authority packages; one copy is sufficient.

## Product and system boundary

This is an independently managed, consultant-owned working platform. The names One DHS, ADSA, DSD, One DSD People, Access and Culture Program, and One DSD Team describe program scope and context. They do not claim agency ownership, sponsorship, approval, publication authority, or records status.

No route in this release authenticates to, reads from, writes to, synchronizes with, or depends on any DHS, ADSA, or DSD account, tenant, directory, API, Teams environment, mailbox, file store, calendar, database, or other technology.

By current owner direction, the DHS logo remains in the application header and must not be altered. The program's ownership statement makes clear that the platform is consultant-owned and does not connect to DHS, ADSA, or DSD systems.

## One DSD Team native workspace

- Native route: `/consultant/one-dsd-team`
- Context: One DSD People, Access and Culture Program
- Committee: One DSD Team, the standing volunteer DSD equity committee
- Scope: Disability Services Division within the Aging and Disability Services Administration
- Working areas: General, Monthly meetings, Open Hours, Learning together, Staff engagement, and Work in progress
- Current access: program owner only, using the existing protected owner session
- Current information: synthetic sample entries only
- Current storage: local file storage in development and in-memory storage on Vercel

The deployed workspace is a functional interaction preview, not yet a safe shared record system. Real participants and real committee records require durable shared storage, member authentication, scoped authorization, retention decisions, and concurrency controls.

## Microsoft decision

The examined account is a Gary-controlled personal Microsoft account using Microsoft Teams Free. The visible target is a Community named One DSD Team with a channel named One DSD People, Access and Culture Program. Gary is the owner.

Selected immediate adapter: `attended_personal_teams_bridge`.

- Selected but not connected in this release.
- Synthetic pilot information only.
- Gary must be present.
- Exact account and destination verification before every operation.
- Review before every send.
- Duplicate prevention, failure stop, and visible shutdown required.
- Native One DSD records remain authoritative.

Rejected for the personal account: delegated Microsoft Graph access to Teams messages and channels, personal-account Power Automate cloud flows, and private custom Teams application upload. Those are not supported production foundations for this account class.

Durable future option: `independent_m365_tab_bot_graph` in a Microsoft 365 tenant owned and administered by Gary, never by DHS, ADSA, or DSD. That option would support a private application tab, a bot for approved sends, narrowly scoped Graph reads and change notifications, and tenant controls.

## Ask and public research decision

Ask is not limited to the program corpus. Its answer path is:

1. Search reviewed program sources using keyword and meaning-adjacent retrieval.
2. State gaps and conflicts rather than inventing an answer.
3. When the question needs current information or the program corpus is insufficient, use current public-source research.
4. Allow an explicit deeper research pass for complex professional questions.
5. Keep public sources visibly separate from reviewed program sources and from official authority.

The selected provider is Perplexity's Agent API. Current answers use its dynamic `low` preset and deeper passes use `medium`, with the underlying served model recorded from each response. Ranked raw results remain available through the separate Perplexity Search API for authorized program reasoning workflows. Both paths are server-side, credential-gated, privacy-screened, cost-observable, and covered by a kill switch. Agent requests set `store: false` and expose only web search and URL retrieval. No API key is committed.

The consumer Perplexity website is not an integration surface. The supported Perplexity APIs are the integration surface. The production connection remains off and no key may be added until durable shared controls, atomic cost accounting, public-endpoint abuse protection, and the complete live-connection review are in place.

## Corpus reconciliation decision

The source of truth is no longer a choice between the computer and the GitHub donors. The intake pipeline accepts both, verifies them by content hash, and records each receipt. Local originals are valuable recovery and ingestion sources; pinned GitHub commits preserve donor application behavior and manifests. Neither is allowed to become a second writable product home.

Reconciled scope on September 4, 2026:

- 47 top-level source-ledger entries, all approved by the owner to enter intake.
- 25 current seed resources preserved as a permanent append-only collection.
- 22 local files, duplicate packages, and thread attachments captured in privacy-scrubbed text or metadata snapshots.
- 12 supplied Drive presentations captured by stable file ID and current metadata; eleven have usable text snapshots.
- Three named originals remain explicitly accounted for as unavailable rather than being silently dropped.
- 578 complete historical catalog records and 557 disposition receipts, including 21 canonical families, 52 active child resources, 462 merged records, and 43 internal records.
- 73 canonical audio records plus the separately supplied course narration.
- Pinned staging and live GitHub donor releases for the canonical library, courses, community materials, and prior application behavior.

The 524-record GitHub catalog is not the complete history. The verified 578-record local catalog is the lossless source layer. The canonical family and active-child views are governed working views over that history, not replacements for it.

Owner approval to ingest and approval to release to staff are deliberately separate. Imported revisions remain in shadow review unless their required language, factual currentness, accessibility, scope, placement, rights, and representation checks pass. The interactive race and racism HTML remains inert and quarantined; the narration remains held for a transcript; restricted third-party training material remains held for rights confirmation.

The durable target is portable PostgreSQL with a Supabase-compatible schema and content-addressed object storage. No hosted database, paid capacity, secret, or production publication is created merely by this architectural decision.

## September 5 staging activation addendum

The sections above preserve the Stage Zero state as recorded on September 4. This addendum supersedes only their current-state descriptions; it does not rewrite the earlier evidence or the historical shadow-import receipt.

Supabase project `qhiawdhehhfuccxvhldo` is now the selected and active staging database. The portable PostgreSQL store and restricted runtime role are live. A read-only migration check made no database changes and confirmed these applied files and hashes:

| Migration | SHA-256 |
| --- | --- |
| `0001_pac_content_foundation.sql` | `7C1C2BE6DE36A2611A9BDB9E3BD54B193FF8A2D94D0F0004E762AFBE7C692AE8` |
| `0002_pac_runtime_store.sql` | `D77309AE6A10118C3A8BDAEDE95EB65D10B446535445287ED046A35885456BE5` |
| `0003_pac_private_source_objects.sql` | `439BB36C39310B4CFF3133C42639B87C93C47EC1360F1FA862B086D798AB1CA9` |
| `0004_pac_scoped_staff_publications.sql` | `0FEA988865E7D13AB3522C813EAEFE35F389A24FD2D491A5FA4B3379AE94CE6B` |
| `0005_pac_owner_resource_drafts.sql` | `AE4F61D7C53EAD33CEDC8981918AF99BD085017A7E6A53F8EF2D8E98E0BF49F3` |
| `0006_pac_owner_resource_release.sql` | `CB8561EEAFB7DA175E2C11639FE9CC52481FCF4A7250C744114F20D12FF68FFD` |
| `0007_pac_home_footer_content.sql` | `8B1FCE29CF8D0D69DA59088EF920CB1426E23F4427FD20FAD6273D08D5FE08C9` |
| `0008_pac_owner_resource_release.sql` | `E11AE49A4DCEA56756CAF5BC2E81176990A6CD7C8BD4BC5ED50A92680653AFFF` |

Migration `0006` is an accidental 60-byte, transaction-wrapped no-op. It changed no data or permissions. It remains recorded because an applied migration ledger must not be rewritten. Resource review and release are implemented by `0008`.

Completed staging loads:

- Shadow run `bac47fd8-6fc5-4e52-bc49-030fb847b8ff`: 1,207 rows.
- Canonical run `3993ae55-e95b-4766-b9e8-35f995abbd0e`: 1,803 rows.
- Permanent seed-release run `c7b5f76e-571d-4393-90d1-87b8c6065751`: 223 rows.

Current accounting:

- Before Home and Footer page blocks: 44 source carriers and 630 source items. After those blocks: 46 source carriers, 632 source items, and 557 source receipts.
- Before page blocks: 98 content items and 122 content revisions.
- After the Home and Footer blocks: 100 content items and 124 revisions.
- 98 collection memberships, 27 publication decisions, and 574 preserved legacy events.
- The general staff reader returns exactly 25 permanent seed resources.
- Home and Footer use separate fixed readers. Their decisions do not make page copy available to Resources or Ask.
- Direct reads of protected tables by the restricted runtime role are denied with PostgreSQL code `42501`.

The private source-object stage accounts for 60 representations totaling 46,613,473 bytes. Nothing has been uploaded. Upload requires separate, specific authorization for the exact local package and private bucket in project `qhiawdhehhfuccxvhldo`.

Vercel Preview variables are configured for the restricted staging runtime. Production variables are not configured, and the current activation has not been deployed to production. No Perplexity key is present.

Inline owner editing currently covers resources and the Home and Footer copy blocks. It does not yet cover every program surface. The remaining surfaces require typed editing contracts, review checks, and scoped publication behavior before the edit-anywhere requirement is complete.
