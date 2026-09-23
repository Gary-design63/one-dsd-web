# Home and footer editing

> **Current authority — [OWNER-2026-09-07-DIGITAL-MING](OWNER-DIRECTIVE-2026-09-07.md):** The manual review and separate owner-publication mechanics described below are the pre-directive implementation. For owner-curated content, fresh editorial approval is no longer a requirement; record the existing approval and preserve real validation and revision history.

The Home page and page footer are the first non-resource proof of program-wide inline editing. Each is a governed page block built on the same immutable revision, review, source-accounting, publication-decision, and change-history foundation used for program content.

## What is editable

The signed-in owner can edit every staff-facing wording field and destination unique to the Home page and footer from those same surfaces. The Home image description is included. Guided Start routing signals and the six partnership commitments remain governed program structure and are not copied into these page blocks.

The editor uses labeled text fields and text areas. It never asks the owner to work with Markdown, serialized data, or database records.

## Staff rendering

`PAC_CONTENT_SOURCE=static` uses the checked-in approved wording explicitly. `PAC_CONTENT_SOURCE=postgres` reads only the effective approved publication for the configured staff scope through `pac.read_page_block_publication`. PostgreSQL mode does not silently substitute static wording when a publication is withdrawn or missing.

The Home and footer blocks are intentionally excluded from the resource catalog. They are stored as restricted internal content items so the general resource reader cannot mistake page wording for a resource. The fixed page reader admits only `page-home` and `site-footer` and exposes only their current approved payloads.

## Change and release sequence

1. Saving appends a draft revision based on the version the owner opened.
2. The draft receives pending reviews for staff language, factual currentness, accessibility, scope, and placement.
3. Each review is an appended record. A newer review supersedes the prior result without rewriting it. The submitted review must identify the exact prior review it replaces, so an older browser view cannot overwrite a newer result.
4. Publishing is a separate owner decision. It is unavailable until every required review is ready or does not apply.
5. Publishing creates a new immutable approved revision, carries its accounted source links forward, and appends a publication decision. Publishing, withdrawal, and restoration must identify the latest publication decision, so a stale page cannot change what staff see.
6. Withdrawal appends a decision without deleting the approved version.
7. Restoration can select only a previously published, reviewed, approved version.

Saving a draft never publishes it.

## Validation and access boundary

Both the application contract and PostgreSQL functions reject Markdown presentation syntax, pasted serialized objects or arrays, icons, vendor or technical product language, blank fields, unrecognized fields, and unsafe destinations. Links must be a program path or a secure web address without embedded credentials.

The runtime role receives execute permission only on the seven fixed page-block functions. It receives no direct read or write privileges on sources, content revisions, reviews, publication decisions, or change history. A child scope can read an inherited agencywide page publication but cannot draft, review, publish, withdraw, or restore that parent publication. Owner authentication and a fail-closed same-origin check remain in front of every mutation route. Missing, malformed, and cross-site origins are denied before the request body is read.

## Initial records

Migration `0007_pac_home_footer_content.sql` captures the existing approved Home and footer wording without alteration. Each block has its own accounted built-in source item, source link, five passing reviews, and initial One DHS publication. The seed is replay-safe and does not republish after a later withdrawal.
