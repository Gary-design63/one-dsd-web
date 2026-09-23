# Expired security-record housekeeping

Owner-session revocation markers, distributed rate-limit buckets, content-free tool audit events, privacy-minimized outside-research usage records, and consultation tombstones are short-lived operational records. They are not program knowledge, question or answer transcripts, staff activity profiles, or employee-performance records.

The authenticated orchestration schedule removes them after they no longer serve a security purpose. This operation runs even when the AI kill switch is engaged because it is a privacy and security control, not an agent-authored action.

## Removal boundaries

- An owner-session revocation can be removed only after the signed session's own expiry time plus a ten-minute clock-skew safety buffer. Its object identifier must match its session hash, both timestamps must be canonical UTC instants, and the revocation time cannot be later than the expiry time.
- A rate-limit bucket can be removed only after its fixed window has ended. The stored subject remains an application-generated HMAC; raw network identifiers are never retained.
- Tool audit events contain technical facts about a governed tool call, not the question, answer, form text, or generated content. They are retained for 90 days, then become eligible for removal. The event timestamp must be a canonical UTC instant and must match the database timestamp before cleanup can delete it.
- Outside-research usage records contain a query hash, source domains, and operational measures such as provider/model, cost, token or call counts, success, latency, and technical trace identifiers. They never contain the question, answer, or retrieved text. They are retained for 90 days. Cleanup deletes only a valid `research_usage:*` decision whose identifier matches its value and whose timestamp is canonical.
- A strict consultation tombstone remains for 30 days after redaction, then becomes eligible for terminal removal. Cleanup removes every linked consultation idempotency receipt first and deletes the tombstone only when none remains. Malformed or non-tombstone consultation records never authorize deletion.
- Each cleanup run is bounded to 10,000 records of each type to limit locks and runtime. Repeated runs are safe and continue from the remaining oldest eligible records. The daily schedule is sufficient for the internal workforce scale, and an owner-triggered orchestration cycle can run the same safe cleanup.
- The application database role has no direct delete access to the backing tables. It can invoke only the purpose-limited housekeeping operation.

Malformed or unreadable revocation, audit, or research-usage records are never treated as expired. They remain in place and the housekeeping step reports a failure where the backend cannot safely continue. Session validation remains fail-closed, and a cleanup failure does not bypass authentication or grant a rate-limit request.

## Backup and restore

Database backups can contain records that were removed after the backup was taken. Therefore every restore runs this housekeeping operation before traffic or protected access. The cutoff uses each record's original timestamp or `reset_at`; restoration never restarts a retention window. Rotate `PAC_OWNER_KEY` before protected access when the restore could have lost a later owner-session revocation, and require fresh owner authentication.

Record only backup identifiers, cutoff time, counts removed, malformed-record failures, and the owner-key version/rotation time in recovery evidence. Do not export event payloads, HMAC subjects, session hashes, cookies, or secrets. The coordinated database/object-storage procedure, correction rules, incident response, and end-of-program disposition are in `docs/operations/data-lifecycle-and-recovery.md` and `config/data-lifecycle-register.json`.

## Operational check

Review the latest orchestration report for the `purge expired security records` step. A successful step reports the number of expired revocations, buckets, audit events, research-usage records, consultation tombstones, and linked replay receipts removed. This operational privacy step continues even when the AI kill switch is engaged. Repeated failures require checking the restricted runtime database connection, malformed retained records, and the applied migration ledger before the next release.
