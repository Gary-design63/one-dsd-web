# Consultation readiness and delivery verification

September 8, 2026. Internal operating evidence, not staff copy.

The owner wants the program's operating policies co-designed with colleagues, with an early-2027 launch tentatively contemplated. No retention duration is selected here. The proposed 90-day duration was not accepted. Public consultation intake remains off; its committed activation register is unchanged.

## What has been established

- Sixty-three existing consultation tests passed, including a fresh isolated PostgreSQL cluster exercising persistence, corrections, compare-and-swap, redaction and terminal lifecycle protections.
- Eight new tests passed. Five check precise readiness diagnostics, separation of configuration from activation, and secret-free output. Three exercise the actual intake component's access-key display, tab-only storage, explicit device-storage choice and failure presentation using synthetic HTTP responses.
- A read-only hosted database check confirmed that the runtime role is restricted and the work-object, idempotency and audit tables exist. The other settings in that receipt came from an older checkout's environment file; they do not represent a complete current Vercel environment export.
- A separate hosted synthetic recovery exercise copied the runtime table structure into isolated schemas, backed up and restored one synthetic expired consultation, matched hashes and removed the restored synthetic terminal row. It did not read or change existing program data. This does not verify provider-managed backup schedules, point-in-time recovery, or a full live program restore.

The first two hosted drill attempts failed because the drill encoded the JSON parameter incorrectly. The corrected third attempt passed. Six isolated schemas remain listed in the drill inventory. Remote writes stopped when the owner clarified the operating-policy direction; no cleanup or further hosted work followed that instruction.

## Exact dependencies before opening real submissions

1. The collaboratively chosen consultation policy and retention duration.
2. The selected hosted backup/recovery practice, its real evidence and accountable operating roles.
3. An incident and continuity contact arrangement appropriate to the program.
4. A matching activation evidence bundle and the target environment's actual settings, including distinct strong tracking and request-limiting secrets.
5. A final synthetic end-to-end submission, credential delivery, tracking, correction and deletion check against the actual selected release and data boundary before staff submission opens.

These are outstanding operating and technical facts. Existing owner-curated content is already approved and does not receive another editorial approval round.

## Reusable checks

`scripts/operations/consultation-readiness.mjs` reports missing dependencies without exposing credentials. Its optional `--runtime` probe uses read-only metadata and never selects staff records. A configuration pass alone does not prove a successful request or recovery exercise.

`scripts/operations/verify-hosted-synthetic-recovery.mjs` is an explicitly authorized drill tool, not scheduled work. It requires `--confirm-isolated-hosted-drill`, uses unique isolated schema names, never selects existing program rows, and retains schemas for review. Do not run it during the current remote-write pause.

Receipts are in `evidence/program-activation-2026-09-08/`: consultation-verification.json, consultation-production-preflight.json, hosted-synthetic-recovery.json, hosted-drill-inventory.json and the synthetic backup.
