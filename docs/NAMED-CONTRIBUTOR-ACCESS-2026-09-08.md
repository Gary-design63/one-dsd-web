# Named contributor access — local implementation, September 8, 2026

Internal implementation and operator reference. This document is not staff-facing copy.

## Authority and boundary

The owner answered: **“Yes, implement and test named contributor access locally.”** The specific request covers named accounts, sign-in, scoped permissions and separate restricted database roles while preserving existing owner access. No real colleague account, invitation delivery, hosted activation or production deployment is included.

The existing owner workspace, owner cookie and owner-approved content workflow remain separate. A named owner administers the new contributor account system. An existing owner key does not become a named session; existing grants are not relabeled as named identity evidence.

## Implemented capability

- Invitation acceptance and passphrase sign-in create opaque eight-hour sessions. Credentials use the pinned scrypt contract; invitation and session tokens are stored only as domain-separated hashes. Sign-out revokes the server session and clears the browser cookie, with an honest message if only browser sign-out succeeded.
- Named owner administration supports invitations, credential-reset invitations, exact scoped grants, one-time revocation, suspension/reactivation/permanent revocation, versioned identity correction and atomic named-owner succession.
- Corrections require the stable account ID, expected identity version and current sign-in ID. Historical identifiers remain reserved, correction evidence is append-only, and stale sessions are revoked. Recovery rotates an existing named owner's credential; it does not allocate new owner authority.
- Contribution roles are exact: contributor, steward and publishing approver remain distinct. Grants can flow downward through the scope hierarchy; a DSD grant cannot confer One DHS authority. Named owner authority does not substitute for a contribution role.
- Resource draft, review, publish, withdraw and republish use the named mutation wrapper. Current session, credential, grant, role, scope, expected content state and feature evidence are rechecked inside the database transaction.
- Identity activation is checked against the latest database event during session reads, session creation, invitation acceptance and action authorization. Contribution activation and paused writes are also checked; narrowly authorized withdrawal remains reachable during a contribution pause.
- Expired invitation digests and session material are purged in bounded batches even while agent work or feature activation is stopped. Cleanup reports counts or a sanitized failure, without copying account identifiers or credentials into the agent report.

The separate roles are **pac_contributor_runtime** and **pac_authentication_broker**. The broker only verifies its boundary, retrieves the current verifier and creates a session after application verification. The contributor role cannot read identity tables, obtain verifiers, mint sessions directly, allocate its own authorization, invoke setup functions or call existing owner content functions. Both connections attest the same database installation.

## Entry points and setup reference

The entry page is /contribute; invitation acceptance is /contribute/accept; named owner administration is /contribute/access. Resource work appears only when current identity and scoped configuration permit it. Public learning access remains open.

Forward migrations0042–0044 contain the selective identity adaptation;0045 contains the named resource workflow. Existing migrations were preserved. Unrelated donor upload/compliance features, older publication rules and owner-content replacements were not imported.

New configuration: config/contributor-access.json. The existing consultation activation configuration and resolver are unchanged. New lib/auth/protected-feature-activation.ts did not exist in this target before this pass and is additive.

Read-only operator inspection:

    node scripts/auth/inspect-contributor-setup.mjs

It prints nonsecret contract hashes, role and migration names, and migration-owner-only setup signatures. It does not read credentials, connect to a database, create accounts or activate features.

Documented server-only settings:

- PAC_CONTRIBUTOR_DATABASE_URL and PAC_CONTRIBUTOR_DATABASE_SSL
- PAC_PROGRAM_AUTH_DATABASE_URL and PAC_PROGRAM_AUTH_DATABASE_SSL
- PAC_PROTECTED_IDENTITY_ENABLED, PAC_PROTECTED_IDENTITY_ACTIVATION_EVIDENCE_ID, PAC_PROTECTED_IDENTITY_ACTIVATION_BUNDLE_SHA256
- PAC_PROTECTED_CONTRIBUTION_ENABLED, PAC_PROTECTED_CONTRIBUTION_ACTIVATION_EVIDENCE_ID, PAC_PROTECTED_CONTRIBUTION_ACTIVATION_BUNDLE_SHA256
- PAC_CONTRIBUTOR_WRITES_PAUSED

These are independent of current owner database and consultation settings. Activation flags default off. No actual environment file was edited. Outside local loopback, named connections require certificate-verified TLS. Matching application configuration alone is insufficient: the current environment-specific database activation event must match.

The migration-owner-only setup functions are record_protected_feature_activation, bootstrap_program_owner_invitation and create_program_owner_recovery_invitation. Their full signatures are printed by the inspector. Application roles cannot call them. Future explicitly authorized setup must provision separate database credentials, configure the appropriate environment boundary, record activation evidence, and securely provide the initial one-time invitation to the intended named owner. This local implementation does not perform that setup against an existing database.

No automatic reapproval requirement is added to owner-curated content. Contributor permissions and attributed publication decisions concern changes made by another named person, without replacing the owner's standing content direction.

## Evidence and limitations

Focused synthetic tests cover credentials, forms, cookies, role/scope checks, exact administration payloads, publication pause and current context. Independent PostgreSQL suites apply the complete target migration chain to disposable loopback databases and exercise real SQL recovery, corrections, concurrent grants, owner succession, credential reset, expiry, resource lifecycle and feature deactivation.

Receipts in evidence/functional-completion-2026-09-08/:
- named-auth-receipt.json
- named-identity-unit-tests.json
- named-access-final-unit-tests.json
- named-identity-postgres-tests.json
- named-access-contract-postgres-tests.json
- contributor-resource-postgres.json
- contributor-resource-task-receipts.json
- contributor-resource-preservation.json

Fresh database preservation checks compare existing owner resource function definitions and permissions, source metadata, canonical revisions and owner approval snapshots across the new migrations. A restored old backup is a distinct scenario; reopening a connection does not prove that post-backup revocations or deletions survived. Separate recovery work is tracked in R24.

No hosted authentication, named accounts on the live app, invitation delivery or deployment is claimed.
