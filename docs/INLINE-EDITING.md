# Resource inline editing

> **Current authority — [OWNER-2026-09-07-DIGITAL-MING](OWNER-DIRECTIVE-2026-09-07.md):** The draft/pending-review mechanics below describe the earlier implementation. For owner-curated content, do not require another editorial approval; preserve source and revision history, scoped access, concurrency checks, and truthful publication records.

The first inline-editing slice is limited to currently published staff resources and the authenticated Practice Workspace owner.

## Staff and owner experience

- A staff member sees only the current approved resource. No editing control or draft content is sent to a staff session.
- The signed-in owner sees an "Edit this resource" section on the same resource page.
- The editor uses labeled text fields, text areas, select lists, checkboxes, and text buttons. It does not use a Markdown editor, raw data fields, icons, or hidden publication controls.
- Saving confirms that the new draft needs review and that staff still see the approved version.

## Save behavior

Every successful save:

1. locks the content item while the save is decided;
2. confirms that the page was opened from the newest revision;
3. appends a new content revision based on that revision;
4. carries forward the existing source and asset links without returning source records to the application;
5. adds a pending record for every required review;
6. records a change event without storing the resource text in the event; and
7. returns the new draft to the owner's editor.

A save never changes or creates a publication decision. The current staff publication therefore remains unchanged until a separate review and publication action is completed.

## Access boundary

The browser calls an owner-only route under `/api/consultant/resources/[id]/draft`. The route checks the signed Practice Workspace cookie before parsing or saving content and returns `401` without calling the database when that check fails. Cross-site mutation requests are rejected.

The running application uses only `PAC_RUNTIME_DATABASE_URL`. It never uses the database-owner connection. The restricted database login receives execute permission on two narrowly scoped functions:

- `pac.read_resource_editing_state(text, text)` reads only a resource already visible through the staff-publication boundary and returns only fields that may be edited.
- `pac.create_resource_draft(text, text, uuid, jsonb, text)` validates the complete editable field set and performs the append-only draft save.

Both callable functions are `SECURITY DEFINER`, use a fixed `search_path`, and run with row security disabled only inside their bounded definitions. The restricted login receives no direct privileges on content, source, review, publication, or change-event tables. Raw source records and technical lineage are not returned to the page or route.

## Concurrency and recovery

The form carries the revision identifier that was current when the owner opened it. The save function locks the content item and compares that identifier with the newest revision. If another draft was saved first, the second save stops with a conflict and asks the owner to reload. It does not overwrite or merge either person's work.

Because revisions, review records, source links, and change events are append-only, the previous approved and draft states remain recoverable. A no-change save is rejected rather than creating an empty history entry.

## Verification

`tests/resource-inline-editing.test.ts` covers owner authentication, a successful owner save, stale-save handling, staff-voice and no-icon protection, use of the two database functions, append-only behavior, pending review creation, unchanged staff publication, and owner-only rendering. Migration `0005_pac_owner_resource_drafts.sql` is also exercised by the local PostgreSQL integration test when local PostgreSQL binaries are available.
