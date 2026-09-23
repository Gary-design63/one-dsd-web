# Owner session lifecycle

The protected workspace uses a signed, environment-bound session with a unique random identifier and a fixed eight-hour maximum lifetime. The lifetime is not extended silently while the workspace is in use.

## Rotation

A successful reauthentication issues a new session identifier and revokes the valid session presented with the sign-in request before returning the replacement cookie. If the revocation cannot be stored, reauthentication fails closed and no replacement cookie is issued. An expired or malformed presented value does not become valid through rotation.

Replacing `PAC_OWNER_KEY` invalidates every session signed with the earlier key. Credential replacement is an incident or planned maintenance action, not an ordinary staff-facing workflow.

## Restore and rollback rule

Rotate `PAC_OWNER_KEY` before allowing protected access after a database restore or application/data rollback that could omit a later sign-out revocation. This is mandatory even when the restored cookie signatures would otherwise still verify: the older database cannot prove that a still-valid cookie was not revoked after the backup was taken. Rotation invalidates every pre-restore cookie and requires fresh authentication.

Record the restore identifier, environment, rotation time, and new secret version in recovery evidence. Never record the key itself. Run expired-security-record housekeeping after the restore, verify authorization fails closed when revocation storage is unavailable, and then exercise sign-in, rotation, sign-out, and reuse-denial with synthetic sessions before reopening the protected workspace.

## Revocation and expiry

Sign-out writes a server-side revocation before the browser cookie is cleared. Authorization denies access when the revocation store is unavailable. Expired revocations remain only through the bounded clock-skew window and are removed by the authenticated security-housekeeping cycle. The browser cookie is HTTP-only, same-site, secure in production, scoped to the application, and expires no later than the signed session.

## Verification

The owner-authentication tests cover signature and payload tampering, environment binding, fixed expiry, successful reauthentication rotation, prior-session revocation, sign-out revocation, storage-outage fail-closed behavior, and secure cookie attributes.

The full backup, incident, recovery, and end-of-program procedure is in `docs/operations/data-lifecycle-and-recovery.md`; the machine-readable owner-cookie and revocation profiles are in `config/data-lifecycle-register.json`.
