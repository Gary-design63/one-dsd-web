# Data lifecycle, backup, restore, incident, and recovery runbook

This runbook is the operator companion to `config/data-lifecycle-register.json`. The register is the machine-readable inventory of every PostgreSQL table, runtime work-object subtype, collaboration nested record, browser record and cookie, local file-store record, and external blob class known to this build. The September 7 DIGITAL MING owner directive and September 8 operating charter govern where they supersede historical BUILD_EXECUTION.md defaults. Owner-curated content is already approved; recovery evidence is a technical operating requirement.

The register does not turn an unresolved policy into approval. A class marked `blocked_pending_authorization` or `preview_sample_only` stays unavailable for real production records until its blocking conditions are closed in evidence. In particular, real consultation intake and real One DSD Team participation remain separate RG-6 activation decisions.

## Operating ownership

Before a production release, name these people or roles in secret-free release evidence:

- the program owner who approves policy and final disposition;
- the deployment/database recovery operator;
- the object-storage recovery operator;
- the incident lead and backup contact route;
- the specialist or scope authority required for affected canonical content; and
- the person who verifies the restore independently from the person who performed it.

The selected managed services must supply encryption in transit and at rest, access logging, environment isolation, backup retention, and a supported restore path. Record the actual service settings in release evidence. Do not infer an RPO, RTO, backup region, or notification duty from this document; those values must be approved for the target environment and proved in a dated drill.

## Backup manifest

Each recoverable backup set has one secret-free manifest tied to the exact release commit. Record:

1. environment and data-boundary label;
2. exact application commit and migration ledger level;
3. database backup identifier, start/end time, success state, region, encryption control, retention/expiry, and recovery roles;
4. object-storage inventory or version identifier, including bucket, object key, byte count, and SHA-256 for source carriers and content assets;
5. counts for every PostgreSQL table in the lifecycle register and counts by runtime work-object subtype;
6. the consultation policy identifier and oldest/newest request expiry, without request text;
7. the operational-record cutoff and the latest successful security-housekeeping time;
8. the approved RPO and RTO and the observed values from the drill; and
9. independent verification, exceptions, and owner disposition.

Never put keys, connection strings, cookies, tracking credentials, source text, consultation text, owner notes, or protected payloads in the manifest. Record only a secret version or rotation date when needed.

Database and object-storage backups are a coordinated set, not interchangeable substitutes. Source evidence requires an independently recoverable carrier or provider version whose hash and byte count are verified. Rebuildable search and graph projections do not require a separate archival copy when the canonical inputs and build metadata are recoverable.

## Restore and post-restore procedure

Restore into an isolated target first. Do not connect a restore drill to the production domain, production cookies, scheduled jobs, live providers, or real notification destinations.

1. Block incoming traffic and all mutations. Engage the AI/research/write kill switches and disable scheduled work. Keep consultation intake, tracking, collaboration mutations, uploads, and contributor mutations off.
2. Record the target environment, backup identifier, exact commit, database time, object-storage version, and operator. Confirm the backup belongs to the intended environment.
3. Restore the private database and object storage using recovery-only credentials. Do not reuse preview data or secrets in production.
4. Compare `pac.schema_migrations` with repository migrations. Apply only missing migrations. Stop on a checksum, ordering, or partial-migration discrepancy.
5. Rotate `PAC_OWNER_KEY` before any protected access after a restore or rollback. A restored database can be missing a later sign-out revocation, so every cookie issued before the restore must become invalid. Record only the new key version and rotation time, never the key.
6. Rotate database, object-storage, tracking-pepper, request-limit, scheduled-task, provider, or notification credentials when the incident scope or backup handling could have exposed them. A routine isolated drill does not by itself require rotating every unrelated production secret.
7. Run consultation retention redaction before owner or requester access. An older backup must not resurrect S3 text after the request's original immutable expiry.
8. Run expired-security-record housekeeping before traffic. Purge owner-session revocations past their guarded expiry, rate-limit buckets past `reset_at`, and well-formed audit/research-usage records past the 90-day cutoff. Malformed records stay fail closed and require remediation.
9. Verify the 30-day terminal tombstone step removes linked consultation idempotency receipts before tombstones and leaves malformed or still-linked records fail closed. Keep real collaboration off while its participant removal/correction lifecycle remains `preview_sample_only`.
10. Verify every idempotency receipt resolves to its original work kind and object. An orphan or mismatch blocks the corresponding mutation surface; never repoint a receipt.
11. Verify table counts and subtype counts against the backup manifest. Reconcile active consultations, tombstones, access grants, current publication decisions, and a small set of synthetic identifiers without copying protected text into evidence.
12. Verify source-carrier and asset blobs by SHA-256 and byte count. Keep active or untrusted file types quarantined; restore never grants publication permission.
13. Rebuild search chunks, embeddings, graph nodes/edges, and snapshots from verified canonical revisions. Confirm that corrected, expired, withdrawn, or audience-restricted material is absent.
14. Run access-denial, participation, privacy, retention, no-surveillance, consultation, publication/withdrawal, source-integrity, and environment tests from the exact commit.
15. Require independent review of the results, observed RPO/RTO, exceptions, credential rotations, and release decision. Reenable one protected capability at a time only when its own evidence passes.

A successful restore means usable, policy-correct data and controls—not merely that the database accepted connections.

## September 8 ASK and named-identity restore containment

The current ASK response store is durable and owner-accessible under the DIGITAL MING direction. Browser-private notes, local progress and current-tab ASK history are separate records. A staff-record retention duration has not been newly selected here; the existing operational-event cutoff and consultation tombstone mechanics do not become an ASK-retention policy.

Before step 7 above and before any access to an isolated restored target, apply migration 0046 and run the migration-owner-only pac.prepare_isolated_program_restore(environment, recoveryId) operation. This is a recovery operation for the isolated copy, not a command to run against the active program. It pauses the restored named features, revokes restored named sessions, closes and removes invitation secrets, removes named credential verifiers, excludes every restored ASK body and records bounded counts. Repeating the same recovery ID is idempotent.

The database records ASK deletions in pac.ask_response_deletions and preparation counts in pac.program_recovery_preparations. File development storage keeps .deletions UUID receipts; prepareFileAskRecordRestore performs the corresponding all-body exclusion for a recovered file directory. Existing receipts block reappend and prevent accidentally copied deleted records from appearing. These internal receipts do not establish a separately surviving authoritative deletion journal. The implemented restore path excludes all recovered ASK bodies when such a journal is unavailable; selective restoration is not claimed.

Any preparation receipt for an environment prevents a new active named-feature event. Recreating credentials therefore cannot reactivate grants from an obsolete backup. No grant-reconciliation and unlock workflow is implemented or verified. Keep the restored identity boundary quarantined; do not remove the receipt or bypass the guard. This deliberate containment means the named program has not completed operational recovery.

Rotating PAC_OWNER_KEY remains a separate required operator action: SQL cannot rotate the legacy owner signing secret. Local synthetic tests of rotation, deletion suppression and quarantine do not prove hosted backup schedules, point-in-time recovery, a complete live restore, or deployment rollback. Record the actual external journal, current-grant reconciliation, secret rotation, recovered source checks and operating approvals before making a full recovery-readiness claim.

## Routine correction and version rules

| Record class | Correction method | Deletion or withdrawal method |
| --- | --- | --- |
| Source evidence and carriers | Append a new carrier, receipt, review, hold, location, or supersession relationship. Preserve the prior evidence. | No deletion during the build. Later action requires an itemized owner disposition with hashes, lineage, rights, sensitivity, records status, backup, and recovery evidence. |
| Canonical content, reviews, and publication | Create a new attributed revision or decision with scope, reason, reviewer, approval, and supersession. | Withdraw staff exposure first, propagate the change to every projection and AI context, then follow the approved disposition. |
| Search and graph projections | Rebuild from the corrected canonical version. Never hand-edit as authority. | Invalidate or delete promptly when the canonical source is corrected, expires, is withdrawn, or loses audience approval. |
| Access grants | Revoke the old grant and issue a corrected grant; do not silently broaden it. | Revoke or expire immediately when authority ends; retain the authority trail until final disposition. |
| Active consultation request | Apply only allowlisted requester or owner changes through version-checked compare-and-swap; never extend the immutable expiry. | Atomically redact to the exact minimal tombstone at expiry. Keep the tombstone for 30 days after redaction, then remove linked idempotency receipts before the strict tombstone through bounded housekeeping. |
| Operational audit and research usage | Append a corrective event; do not edit the original. | Remove well-formed records after 90 days through bounded housekeeping. |
| Owner-session revocation and rate limits | Do not edit. Rotate/reissue the related credential or let the window expire. | Remove only after the guarded session expiry or bucket `reset_at`. |
| Runtime policies, cycles, proposals, stale flags, and evals | Use an authorized policy write, disposition, new record, undo, or supersession with audit evidence. | No ordinary physical deletion; final disposal follows the program closure manifest. |
| Collaboration aggregate | The current preview replaces the validated aggregate and increments its revision. | Synthetic preview data may be reset. Real participant correction/removal is not active until attributable history and the approved lifecycle exist. |
| Browser-private notes and progress | The person edits or replaces their own browser value. | Item deletion, the registered clear-all control, or site-data clearing. These private notes have no server copy unless the person explicitly submits selected material through another feature. |
| Browser ASK history | The person clears their current-tab history. | Browser clearing or tab close removes that local history only. Submitted ASK interactions have a separate owner-accessible durable response record. |
| Durable ASK response records | Append a distinct actual response; do not silently rewrite a recorded answer. | Owner deletion or configured expiry removes the body and records a content-free deletion receipt. Browser clearing does not delete these records. |
| ASK deletion and restore-preparation receipts | Immutable record identifiers, times, reasons or preparation counts; no answer bodies or credential secrets. | No ordinary application deletion; preserve the trail and account for older recoverable copies at final disposition. |
| Browser-held consultation credential | It is not editable or recoverable from the server hash. | Remove the browser copy at the person's request; this does not withdraw or delete the server request. Local persistence occurs only after explicit opt-in. |

## Incident response

1. Contain: disable the affected intake, mutation, upload, collaboration, notification, research, provider, or scheduled capability. Engage the relevant kill switch. Retention and privacy housekeeping must continue through an authorized path.
2. Restrict: limit deployment, database, object-storage, and provider access to the response team. Revoke affected grants and sessions.
3. Preserve: retain provider, deployment, database, and content-free application evidence. Use opaque identifiers, timestamps, subtype counts, and hashes. Never paste consultation/source payloads, plaintext tracking credentials, cookies, or secrets into tickets or chat.
4. Classify: use the lifecycle register to identify every affected table, runtime subtype, nested collaboration record, browser record, backup, and blob. Determine sensitivity, viewers, official-record status, and activation state.
5. Rotate: replace every credential within the incident boundary. Rotate `PAC_OWNER_KEY` when protected sessions or revocation history may be affected. Destroy superseded secrets after the approved overlap, if any.
6. Correct: withdraw compromised staff projections, preserve canonical/source evidence, and append a corrective decision. Do not erase evidence to make the incident appear clean.
7. Recover: follow the isolated restore procedure, migrations, post-restore redaction/housekeeping, blob verification, projection rebuild, and test gates.
8. Decide: the named incident lead records cause, scope, containment, affected lifecycle classes, notification decision, recovery result, residual risk, and approval. This independent program does not claim DHS incident authority.
9. Reenable: bring back one environment and protected capability at a time. Any unresolved integrity, policy, identity, terminal-deletion, or recovery condition keeps that capability off.

## End-of-program disposition

Program shutdown is a controlled lifecycle event, not a directory deletion.

1. Stop new intake, uploads, contributions, collaboration mutations, notifications, live providers, and schedules. Preserve requester lifecycle rights for existing consultations until the approved closure process handles them.
2. Freeze a complete inventory from `config/data-lifecycle-register.json`, including database rows, local development stores, browser-key instructions, external blobs, backups, replicas, exports, provider copies, and secrets.
3. Obtain itemized owner decisions and any applicable rights, contractual, privacy, records, or institutional review. Source evidence remains preserved unless the source-specific disposition explicitly authorizes transfer or deletion.
4. Export only the records approved for transfer or archival, with hashes, lineage, scope, version, and access controls. An export does not become an official DHS record merely because the program closes.
5. Redact remaining S3 consultation payloads, complete the 30-day tombstone period, delete linked idempotency receipts before terminal records, and verify that no plaintext tracking credential exists on the server.
6. Withdraw staff publications and derived projections, then delete rebuildable search/graph data. Handle canonical records and asset blobs according to their itemized disposition.
7. Revoke all grants, destroy signing/tracking/request-limit/provider/scheduled-task secrets, expire owner cookies, and purge revocations and rate-limit buckets.
8. Delete or transfer live database and object-storage records only as authorized. Allow encrypted backups and provider versions to expire under the recorded schedule; verify completion rather than assuming immediate disappearance.
9. Publish browser shutdown instructions so people can clear registered local and session keys. The application cannot remotely delete data already held in a person's browser or device backup.
10. Record a final, secret-free disposition manifest with counts, hashes, exceptions, deletion/transfer proof, backup-expiry dates, independent verification, and owner approval.

## Release evidence checklist

A lifecycle/recovery gate is complete only when evidence names the exact commit and environment and includes:

- a passing lifecycle-register coverage test;
- a passing retention constant, SQL, and staff-disclosure parity test;
- the current backup manifest and independent restore drill;
- post-restore owner-key rotation and session invalidation proof;
- post-restore consultation and security-housekeeping results;
- database counts, runtime subtype counts, and blob hash/byte verification;
- derived projection rebuild and withdrawal/correction checks;
- incident owner, contact route, and dated containment/recovery exercise;
- approved RPO/RTO and observed drill results; and
- explicit closure of each protected class's blocking conditions.

Do not mark a feature ready merely because an environment setting says `on`. The setting attests that the underlying evidence was reviewed; it is not the evidence.
