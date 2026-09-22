# DSD consultation lifecycle runbook

This runbook applies only to consultation requests for Disability Services Division work. A submitted request is a voluntary, consultant-managed S3 work object. It is not an official DHS record, does not connect to a DHS system, and must not contain case, medical, personnel, complaint, or other identifying information.

The complete persisted-class map and restore sequence are in `config/data-lifecycle-register.json` and `docs/operations/data-lifecycle-and-recovery.md`. This consultation runbook is the subtype-specific procedure; it does not replace the wider backup, incident, or program-disposition controls.

## Activation evidence

Keep real submission off until the consultant has reviewed and retained all of the following evidence for the target environment:

- an approved consultation policy identifier and retention period;
- a restricted PostgreSQL runtime role and a private, environment-specific database;
- separate high-entropy consultation-tracking, request-limiting, owner-session, and scheduled-task secrets;
- passing consultation boundary, retention, correction, authorization, and prohibited-data tests from the deployed commit;
- a dated backup-and-restore drill in an isolated environment;
- a named incident lead, contact route, and completed containment exercise;
- a confirmed requester correction process and a delivery process for the one-time tracking credential.

Only after that evidence exists may the corresponding `PAC_CONSULTATION_*_READY` settings and intake switch be enabled. A readiness setting records that evidence was reviewed; it is not the evidence itself. Preview and production must use different data and secrets. Turning off new intake does not turn off tracking or requester lifecycle rights for requests that already exist; those capabilities have their own readiness checks.

Because existing-request tracking can remain available while new intake is off, environment verification does not use the intake switch as the only trigger for tracking-secret review. Selecting `PAC_CONSULTATION_ACTIVATION_EVIDENCE_ID` requires a strong tracking secret, and production rejects every configured tracking secret that is too short, uses a placeholder prefix, or lacks sufficient character variation even when `PAC_CONSULTATION_INTAKE_ENABLED=off`.

## Retention and redaction

`PAC_CONSULTATION_POLICY_VERSION` identifies the approved policy. `PAC_CONSULTATION_RETENTION_DAYS` supplies its approved duration. Each request receives an immutable policy identifier and expiry timestamp when it is created.

The authenticated scheduled orchestration route runs the retention sweep. Queue reads and status checks also enforce expiry so an overdue item cannot become visible while waiting for the next schedule. The AI kill switch does not suspend retention redaction. A missing or invalid expiry is treated as already expired and is replaced immediately with a tombstone whose retention guard time is the redaction time.

Every correction, withdrawal, owner update, and redaction is an atomic version-checked write. Retention cannot be extended during an update. If an ordinary update and expiry race, the losing operation reloads the winning version; retention retries from that version and callers never receive a stale copy of the S3 payload.

When the period ends, the application replaces the entire S3 request with a minimal tombstone containing only:

- reference ID and `expired` status;
- the one-way tracking-key hash and hash version, used only to authenticate the requester's final expired-status view;
- retention policy and expiry timestamps;
- redaction timestamp, update timestamp, and version.

Submitted text, links, packet content, eligibility detail, owner notes, scheduling detail, correction history, and status history are removed. Repeating the sweep does not rewrite the tombstone. Logs and cycle responses contain counts and reference IDs only, never request text, owner notes, or tracking credentials.

The tombstone is redaction, not permanent program memory. It remains for 30 days after `redacted_at` so a late requester lookup or submission retry receives a consistent terminal result. Bounded housekeeping then removes every idempotency receipt linked to that consultation before deleting the strict tombstone. If any linked receipt remains, the tombstone remains fail closed for a later run. Malformed records never become deletion authority. A restore must reapply both request redaction and 30-day terminal cleanup before access.

## Requester corrections

A requester must present the tracking credential. Corrections are allowed only during eligibility review or while status is `received` or `under_review`. The submitted version must match the current version so a stale browser does not silently overwrite newer work.

The allowlist covers general work information: requester role, work name, stage, goals, equity questions already considered, requested support and its general note, timing and deadline, generally named populations, consultation access needs, meeting preference, public links, document notes, and the situation description. It excludes eligibility decisions, DSD attestation, participation acknowledgments, Ask context, path provenance, status, schedule, owner notes, credentials, retention fields, and every internal control field.

The server validates the complete corrected request again, repeats prohibited-information and Tribal-routing checks, recalculates priority signals, and rebuilds the heads-up packet before writing a new version. The write uses a requester-specific tool authority rather than owner authority. Its audit event records the requester-correction operation, reference ID, disposition, and result without recording tracking credentials or sensitive before-and-after values; the work object records only the corrected field names. A rejection does not change the stored request. Requester responses never include owner notes, tracking hashes, or internal packets.

Withdrawal uses the same trust boundary: the requester presents the tracking credential, the existing status rules decide whether withdrawal is still available, and a requester-specific operation records only the reference ID, disposition, and result in the audit trail. It never borrows owner authority or records the credential or request text in that event.

Credential-authenticated tracking, correction, access-key replacement, and withdrawal are operational requester rights for an existing request. The AI kill switch, consultation-agent switch, and autonomy ceiling do not revoke them. This exception is deliberately narrow: the server verifies the current tracking credential before invoking one of those four exact operations, and it does not grant queue access or any general agent capability.

## Owner updates

Owner updates are also version checked. The server rejects unknown fields, `expired` as a manually selected status, impossible eligibility/status combinations, and a scheduled status without an agreed time. Scheduled times must be complete RFC 3339 date-times with an explicit timezone offset. Status reasons and private owner notes pass prohibited-information and external-research safety checks before storage; a rejection is audited without the submitted text. Expiry remains a retention outcome, never an owner workflow choice.

## Backup and recovery

- Use encrypted provider backups with access limited to the runtime and recovery operators. Record the backup schedule, retention, region, encryption control, and most recent successful completion outside the application database.
- Test restoration into an isolated environment with different secrets. Do not point a restore test at the live application.
- Rotate `PAC_OWNER_KEY` before protected access after any restore or rollback that could have lost a later session revocation. This invalidates every pre-restore owner cookie; record only the new key version and rotation time.
- Run the retention sweep immediately after restoration and before enabling owner or requester access. Restoring an older backup must never resurrect S3 text whose retention period has ended.
- Run expired-security-record housekeeping after the consultation sweep. It removes eligible 30-day consultation tombstones only after their linked idempotency receipts are removed. An orphaned or mismatched receipt keeps the corresponding mutation surface off.
- Reconcile tombstone counts, current requests, migration level, and a small set of synthetic reference IDs. Do not copy real request text into drill notes.
- If recovery cannot prove environment separation, access control, and post-restore redaction, keep consultation intake and tracking off.

## Incident response

1. Disable consultation intake and the scheduled route credential if it may be compromised. Use the owner kill switch for agent activity, but remember that retention redaction remains required.
2. Restrict database and deployment access; rotate the affected environment's tracking pepper, runtime credential, owner credential, request-limiting secret, and scheduled-task secret as applicable.
3. Preserve provider, deployment, database, and redacted application logs. Never paste request text or secrets into a ticket or chat.
4. Determine which S3 records, backups, and tombstones were affected. Use reference IDs and timestamps for reconciliation.
5. Follow the consultant-approved notification and response process. Do not claim DHS incident authority or contact an individual requester unless the approved process requires it.
6. Restore only from a verified backup, run migrations, execute retention redaction before access, and rerun the security and consultation suites.
7. Re-enable one environment at a time only after the incident lead records the cause, containment, credential rotation, recovery result, and approval.

## Routine verification

For every release that changes consultation storage, tracking, correction, authentication, or scheduled work:

1. Run the consultation boundary tests and full type, lint, test, and production-build gates.
2. Confirm an unauthorized scheduled request cannot start a sweep.
3. Confirm an expired synthetic request becomes the exact tombstone shape and a second sweep makes no change.
4. Confirm the correct tracking credential returns only expired status after redaction and an incorrect credential returns nothing.
5. Confirm an allowed correction rebuilds the packet, and unknown, unsafe, stale-version, wrong-key, and late corrections do not write.
6. Confirm tracking, correction, and withdrawal remain available for an existing request when new intake is off and when agent activity is killed, while direct or owner attempts to invoke requester operations are refused.
7. Confirm invalid expiry, conflicting updates, unsafe owner notes or reasons, invalid schedule values, and impossible eligibility/status combinations fail closed.
8. Record the deployed commit, environment, policy version, retention duration, test result, backup evidence, recovery drill date, and incident-readiness owner in the release evidence.
