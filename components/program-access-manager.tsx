"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import {
  ACCESS_ROLE_LABELS,
  ACCESS_ROLE_SCOPES,
  ACCESS_SCOPE_LABELS,
  type ProgramAccessAction,
} from "@/lib/auth/program-access-contract";
import type { ProgramAccessOverview } from "@/lib/auth/program-identity";

type ActionResponse = {
  ok?: boolean;
  error?: string;
  message?: string;
  oneTimeCode?: string;
  invitationId?: string;
  expiresAt?: string;
  transferred?: boolean;
  currentSessionEnded?: boolean;
};

type OneTimeReceipt = {
  code: string;
  invitationId: string;
  expiresAt: string;
};

function dateText(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Chicago",
  }).format(new Date(value));
}

function activeAtPresent(expiresAt: string | null): boolean {
  return expiresAt === null || Date.parse(expiresAt) > Date.now();
}

export function ProgramAccessManager({
  initialOverview,
  currentAccountId,
}: {
  initialOverview: ProgramAccessOverview;
  currentAccountId: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<OneTimeReceipt | null>(null);
  const [grantRole, setGrantRole] = useState<keyof typeof ACCESS_ROLE_SCOPES>("content_contributor");
  const [grantScope, setGrantScope] = useState("one-dhs");

  const activeAccounts = useMemo(
    () => initialOverview.accounts.filter((account) => account.state === "active"),
    [initialOverview.accounts],
  );
  const grantsByAccount = useMemo(() => {
    const grouped = new Map<string, ProgramAccessOverview["grants"]>();
    for (const grant of initialOverview.grants) {
      const grants = grouped.get(grant.accountId) ?? [];
      grants.push(grant);
      grouped.set(grant.accountId, grants);
    }
    return grouped;
  }, [initialOverview.grants]);
  const activeGrantScopes = ACCESS_ROLE_SCOPES[grantRole];

  async function runAction(action: ProgramAccessAction, key: string): Promise<boolean> {
    setBusy(key);
    setMessage("");
    setError("");
    setReceipt(null);
    try {
      const response = await fetch("/api/contribute/access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(action),
      });
      const result = (await response.json().catch(() => ({}))) as ActionResponse;
      if (!response.ok || !result.ok) {
        setError(result.error ?? "That access change could not be completed.");
        if (response.status === 401) router.refresh();
        return false;
      }
      if (result.oneTimeCode && result.invitationId && result.expiresAt) {
        setReceipt({
          code: result.oneTimeCode,
          invitationId: result.invitationId,
          expiresAt: result.expiresAt,
        });
      }
      setMessage(result.message ?? "Access updated.");
      if (result.transferred) {
        router.replace("/contribute?ownership=transferred");
        return true;
      }
      if (result.currentSessionEnded) {
        router.replace("/contribute?identity=corrected");
        return true;
      }
      router.refresh();
      return true;
    } catch {
      setError("That access change could not be completed right now.");
      return false;
    } finally {
      setBusy("");
    }
  }

  async function copyCode() {
    if (!receipt) return;
    try {
      await navigator.clipboard.writeText(receipt.code);
      setMessage("One-time code copied. Deliver it through the private channel you use with this colleague.");
    } catch {
      setError("The code could not be copied automatically. Select and copy it directly.");
    }
  }

  async function inviteAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const ok = await runAction({
      action: "invite_account",
      signInId: String(values.get("signInId") ?? ""),
      displayName: String(values.get("displayName") ?? ""),
      expiresInHours: Number(values.get("expiresInHours")) as 24 | 72 | 168,
    }, "invite-account");
    if (ok) form.reset();
  }

  async function issueGrant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const duration = String(values.get("expiresInDays") ?? "none");
    const ok = await runAction({
      action: "issue_grant",
      accountId: String(values.get("accountId") ?? ""),
      role: grantRole,
      scopeId: grantScope as "one-dhs" | "dsd" | "one-dsd-team",
      expiresInDays: duration === "none" ? null : Number(duration) as 30 | 90 | 365,
      reason: String(values.get("reason") ?? ""),
    }, "issue-grant");
    if (ok) form.reset();
  }

  async function transferOwner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const successorAccountId = String(values.get("successorAccountId") ?? "");
    const successor = activeAccounts.find((account) => account.accountId === successorAccountId);
    if (!successor) {
      setError("Choose an active successor from the accounts shown on this page.");
      return;
    }
    await runAction({
      action: "transfer_owner",
      successorAccountId,
      expectedIdentityVersion: successor.identityVersion,
      confirmSignInId: String(values.get("confirmSignInId") ?? ""),
      reason: String(values.get("reason") ?? ""),
    }, "transfer-owner");
  }

  const accountPage = Math.floor(initialOverview.pagination.accountOffset / initialOverview.pagination.accountLimit) + 1;
  const invitationPage = Math.floor(initialOverview.pagination.invitationOffset / initialOverview.pagination.invitationLimit) + 1;
  const accountStart = initialOverview.pagination.accountTotal === 0
    ? 0
    : initialOverview.pagination.accountOffset + 1;
  const accountEnd = Math.min(
    initialOverview.pagination.accountOffset + initialOverview.accounts.length,
    initialOverview.pagination.accountTotal,
  );
  const invitationStart = initialOverview.pagination.invitationTotal === 0
    ? 0
    : initialOverview.pagination.invitationOffset + 1;
  const invitationEnd = Math.min(
    initialOverview.pagination.invitationOffset + initialOverview.openInvitations.length,
    initialOverview.pagination.invitationTotal,
  );
  const accessPageHref = (nextAccountPage: number, nextInvitationPage: number) =>
    `/contribute/access?accounts=${nextAccountPage}&invitations=${nextInvitationPage}`;

  return (
    <div className="wrap py-8">
      <p><Link href="/contribute">Back to the contributor workspace</Link></p>

      <div aria-live="polite" aria-atomic="true">
        {message ? <p className="notice" role="status">{message}</p> : null}
      </div>
      {error ? <p className="notice notice--stop" role="alert">{error}</p> : null}

      {receipt ? (
        <section className="panel mt-6" aria-labelledby="one-time-code-heading">
          <p className="kicker">Show once</p>
          <h2 id="one-time-code-heading" className="text-xl font-bold">Copy this one-time code now</h2>
          <p>Deliver it through the private channel you use with this colleague. It cannot be shown again after you leave or start another access change.</p>
          <p className="panel overflow-x-auto font-mono text-base" aria-label="One-time invitation code">
            <code>{receipt.code}</code>
          </p>
          <p className="text-sm">Expires {dateText(receipt.expiresAt)}. Invitation reference: {receipt.invitationId}.</p>
          <button className="btn btn--light" type="button" onClick={() => void copyCode()}>Copy code</button>
        </section>
      ) : null}

      <section className="panel mt-6" aria-labelledby="invite-colleague-heading">
        <p className="kicker">Invite a colleague</p>
        <h2 id="invite-colleague-heading" className="text-xl font-bold">Create named access</h2>
        <p>Invite a colleague to set up an individual sign-in. Once they accept, assign the work they will help with.</p>
        <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={(event) => void inviteAccount(event)}>
          <label className="field">
            <span>Person&apos;s name</span>
            <input name="displayName" required minLength={2} maxLength={120} autoComplete="name" />
          </label>
          <label className="field">
            <span>Sign-in ID</span>
            <input name="signInId" required minLength={3} maxLength={64} pattern="[a-z0-9][a-z0-9._-]{2,63}" autoCapitalize="none" spellCheck={false} />
            <small>Use lowercase letters, numbers, periods, underscores, or hyphens.</small>
          </label>
          <label className="field">
            <span>Invitation expires</span>
            <select name="expiresInHours" defaultValue="72">
              <option value="24">In 24 hours</option>
              <option value="72">In 3 days</option>
              <option value="168">In 7 days</option>
            </select>
          </label>
          <div className="flex items-end">
            <button className="btn btn--primary" type="submit" disabled={Boolean(busy)}>
              {busy === "invite-account" ? "Creating invitation" : "Create invitation"}
            </button>
          </div>
        </form>
      </section>

      <section className="panel mt-6" aria-labelledby="open-invitations-heading">
        <p className="kicker">Open invitations</p>
        <h2 id="open-invitations-heading" className="text-xl font-bold">Codes that have not been used</h2>
        <p className="text-sm">
          Showing {invitationStart}-{invitationEnd} of {initialOverview.pagination.invitationTotal} open invitations.
        </p>
        {initialOverview.openInvitations.length === 0 ? (
          <p className="mb-0">No invitation is waiting.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {initialOverview.openInvitations.map((invitation) => (
              <form
                className="panel"
                key={invitation.invitationId}
                onSubmit={(event) => {
                  event.preventDefault();
                  const values = new FormData(event.currentTarget);
                  void runAction({
                    action: "revoke_invitation",
                    invitationId: invitation.invitationId,
                    reason: String(values.get("reason") ?? ""),
                  }, `close-invitation-${invitation.invitationId}`);
                }}
              >
                <h3 className="text-lg font-bold">{invitation.displayName}</h3>
                <p className="text-sm">{invitation.signInId} · Expires {dateText(invitation.expiresAt)}</p>
                <label className="field">
                  <span>Why this invitation should be closed</span>
                  <input name="reason" required minLength={3} maxLength={500} />
                </label>
                <button className="btn btn--light" type="submit" disabled={Boolean(busy)}>
                  {busy === `close-invitation-${invitation.invitationId}` ? "Closing invitation" : "Close invitation"}
                </button>
              </form>
            ))}
          </div>
        )}
        {initialOverview.pagination.invitationOffset > 0 || invitationEnd < initialOverview.pagination.invitationTotal ? (
          <nav className="mt-4 flex flex-wrap gap-3" aria-label="Open invitation pages">
            {initialOverview.pagination.invitationOffset > 0 ? (
              <Link className="btn btn--light" href={accessPageHref(accountPage, invitationPage - 1)}>Previous invitations</Link>
            ) : null}
            {invitationEnd < initialOverview.pagination.invitationTotal ? (
              <Link className="btn btn--light" href={accessPageHref(accountPage, invitationPage + 1)}>Next invitations</Link>
            ) : null}
          </nav>
        ) : null}
      </section>

      <section className="panel mt-6" aria-labelledby="add-permission-heading">
        <p className="kicker">Permissions</p>
        <h2 id="add-permission-heading" className="text-xl font-bold">Add permission</h2>
        <p>Choose one named responsibility and the exact program area where it applies.</p>
        <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={(event) => void issueGrant(event)}>
          <label className="field">
            <span>Person</span>
            <select name="accountId" required defaultValue="">
              <option value="" disabled>Choose a person</option>
              {activeAccounts.map((account) => <option key={account.accountId} value={account.accountId}>{account.displayName} ({account.signInId})</option>)}
            </select>
          </label>
          <label className="field">
            <span>Responsibility</span>
            <select
              value={grantRole}
              onChange={(event) => {
                const next = event.target.value as keyof typeof ACCESS_ROLE_SCOPES;
                setGrantRole(next);
                setGrantScope(ACCESS_ROLE_SCOPES[next][0]);
              }}
            >
              {Object.entries(ACCESS_ROLE_LABELS).map(([role, label]) => <option key={role} value={role}>{label}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Program area</span>
            <select value={grantScope} onChange={(event) => setGrantScope(event.target.value)}>
              {activeGrantScopes.map((scope) => <option key={scope} value={scope}>{ACCESS_SCOPE_LABELS[scope]}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Permission duration</span>
            <select name="expiresInDays" defaultValue="90">
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="365">1 year</option>
              <option value="none">No end date</option>
            </select>
          </label>
          <label className="field md:col-span-2">
            <span>Reason for this permission</span>
            <textarea name="reason" required minLength={3} maxLength={500} rows={2} />
          </label>
          <button className="btn btn--primary md:col-span-2 md:justify-self-start" type="submit" disabled={Boolean(busy)}>
            {busy === "issue-grant" ? "Adding permission" : "Add permission"}
          </button>
        </form>
      </section>

      <section className="panel mt-6" aria-labelledby="people-permissions-heading">
        <p className="kicker">People and permissions</p>
        <h2 id="people-permissions-heading" className="text-xl font-bold">Current named accounts</h2>
        <p className="text-sm">
          Showing {accountStart}-{accountEnd} of {initialOverview.pagination.accountTotal} named accounts. Permissions shown below are complete for each account on this page.
        </p>
        <div className="mt-4 space-y-5">
          {initialOverview.accounts.map((account) => {
            const grants = grantsByAccount.get(account.accountId) ?? [];
            const currentOwner = account.accountId === currentAccountId;
            return (
              <article className="panel" key={account.accountId}>
                <h3 className="text-lg font-bold">{account.displayName}{currentOwner ? " · Current program owner" : ""}</h3>
                <p className="text-sm">{account.signInId} · Account {account.state}</p>
                {grants.length ? (
                  <div className="space-y-3">
                    {grants.map((grant) => {
                      const ended = grant.revokedAt !== null || !activeAtPresent(grant.expiresAt);
                      const label = grant.role === "owner" ? "Program owner" : ACCESS_ROLE_LABELS[grant.role as keyof typeof ACCESS_ROLE_LABELS] ?? grant.role;
                      return (
                        <form
                          className="rounded-lg border border-[var(--line)] p-3"
                          key={grant.grantId}
                          onSubmit={(event) => {
                            event.preventDefault();
                            const values = new FormData(event.currentTarget);
                            void runAction({
                              action: "revoke_grant",
                              grantId: grant.grantId,
                              reason: String(values.get("reason") ?? ""),
                            }, `remove-grant-${grant.grantId}`);
                          }}
                        >
                          <p className="m-0"><strong>{label}</strong> · {grant.scopeId === "one-dhs-pac" ? "Across the program" : ACCESS_SCOPE_LABELS[grant.scopeId as keyof typeof ACCESS_SCOPE_LABELS] ?? grant.scopeId}{grant.expiresAt ? ` · through ${dateText(grant.expiresAt)}` : ""}{ended ? " · ended" : ""}</p>
                          {!currentOwner && grant.role !== "owner" && grant.revokedAt === null ? (
                            <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                              <label className="field m-0">
                                <span>Why this permission should be removed</span>
                                <input name="reason" required minLength={3} maxLength={500} />
                              </label>
                              <button className="btn btn--light" type="submit" disabled={Boolean(busy)}>
                                {busy === `remove-grant-${grant.grantId}` ? "Removing" : "Remove permission"}
                              </button>
                            </div>
                          ) : null}
                        </form>
                      );
                    })}
                  </div>
                ) : <p>No permission has been assigned.</p>}

                <details className="mt-4 rounded-lg border border-[var(--line)] p-3">
                  <summary className="cursor-pointer font-bold">Correct sign-in details</summary>
                  <p className="mt-3 text-sm">
                    The account, permissions, and attributed work stay together. Saving ends this person&apos;s current sessions and any unused reset or recovery codes.
                    {currentOwner ? " You will be signed out." : ""}
                  </p>
                  <form
                    className="mt-3 grid gap-3 md:grid-cols-2"
                    key={`${account.accountId}-${account.identityVersion}`}
                    onSubmit={(event) => {
                      event.preventDefault();
                      const values = new FormData(event.currentTarget);
                      void runAction({
                        action: "correct_account_identity",
                        accountId: account.accountId,
                        expectedIdentityVersion: account.identityVersion,
                        confirmCurrentSignInId: String(values.get("confirmCurrentSignInId") ?? ""),
                        signInId: String(values.get("signInId") ?? ""),
                        displayName: String(values.get("displayName") ?? ""),
                        reason: String(values.get("reason") ?? ""),
                      }, `correct-identity-${account.accountId}`);
                    }}
                  >
                    <label className="field">
                      <span>Corrected name</span>
                      <input name="displayName" required minLength={2} maxLength={120} defaultValue={account.displayName} autoComplete="off" />
                    </label>
                    <label className="field">
                      <span>Corrected sign-in ID</span>
                      <input name="signInId" required minLength={3} maxLength={64} pattern="[a-z0-9][a-z0-9._-]{2,63}" defaultValue={account.signInId} autoCapitalize="none" spellCheck={false} autoComplete="off" />
                    </label>
                    <label className="field md:col-span-2">
                      <span>Enter the current sign-in ID to confirm</span>
                      <input name="confirmCurrentSignInId" required minLength={3} maxLength={64} pattern="[a-z0-9][a-z0-9._-]{2,63}" autoCapitalize="none" spellCheck={false} autoComplete="off" />
                    </label>
                    <label className="field md:col-span-2">
                      <span>Reason for the correction</span>
                      <textarea name="reason" required minLength={3} maxLength={500} rows={2} aria-describedby={`identity-reason-${account.accountId}`} />
                      <small id={`identity-reason-${account.accountId}`}>Do not include personnel, medical, accommodation, grievance, case, private-learning, or ideology details.</small>
                    </label>
                    <button className="btn btn--light md:col-span-2 md:justify-self-start" type="submit" disabled={Boolean(busy)}>
                      {busy === `correct-identity-${account.accountId}` ? "Saving correction" : "Save corrected details"}
                    </button>
                  </form>
                </details>

                {!currentOwner && (account.state === "active" || account.state === "suspended") ? (
                  <form
                    className="mt-4"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const values = new FormData(event.currentTarget);
                      void runAction({
                        action: "change_account_state",
                        accountId: account.accountId,
                        state: account.state === "active" ? "suspended" : "active",
                        reason: String(values.get("reason") ?? ""),
                      }, `state-${account.accountId}`);
                    }}
                  >
                    <label className="field">
                      <span>Reason for {account.state === "active" ? "pausing" : "restoring"} access</span>
                      <input name="reason" required minLength={3} maxLength={483} />
                    </label>
                    <button className="btn btn--light" type="submit" disabled={Boolean(busy)}>
                      {account.state === "active" ? "Pause access" : "Restore access"}
                    </button>
                  </form>
                ) : null}

                {!currentOwner && account.state !== "revoked" ? (
                  <details className="mt-4 rounded-lg border border-[var(--red)] p-3">
                    <summary className="cursor-pointer font-bold">End access permanently</summary>
                    <p className="mt-3 text-sm">This ends sign-in access and closes current sessions permanently. It cannot be undone.</p>
                    <form
                      className="mt-3 grid gap-3"
                      onSubmit={(event) => {
                        event.preventDefault();
                        const values = new FormData(event.currentTarget);
                        void runAction({
                          action: "change_account_state",
                          accountId: account.accountId,
                          state: "revoked",
                          reason: String(values.get("reason") ?? ""),
                          confirmSignInId: String(values.get("confirmSignInId") ?? ""),
                        }, `revoke-account-${account.accountId}`);
                      }}
                    >
                      <label className="field">
                        <span>Enter {account.signInId} to confirm</span>
                        <input name="confirmSignInId" required minLength={3} maxLength={64} autoCapitalize="none" spellCheck={false} autoComplete="off" />
                      </label>
                      <label className="field">
                        <span>Reason for ending access permanently</span>
                        <textarea name="reason" required minLength={3} maxLength={483} rows={2} />
                      </label>
                      <button className="btn btn--light justify-self-start" type="submit" disabled={Boolean(busy)}>
                        {busy === `revoke-account-${account.accountId}` ? "Ending access" : "End access permanently"}
                      </button>
                    </form>
                  </details>
                ) : null}

                {account.state === "active" ? (
                  <form
                    className="mt-4 border-t border-[var(--line)] pt-4"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const values = new FormData(event.currentTarget);
                      void runAction({
                        action: "invite_credential_reset",
                        accountId: account.accountId,
                        expiresInHours: Number(values.get("expiresInHours")) as 1 | 8 | 24,
                      }, `reset-${account.accountId}`);
                    }}
                  >
                    <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                      <label className="field m-0">
                        <span>Reset invitation expires</span>
                        <select name="expiresInHours" defaultValue="8">
                          <option value="1">In 1 hour</option>
                          <option value="8">In 8 hours</option>
                          <option value="24">In 24 hours</option>
                        </select>
                      </label>
                      <button className="btn btn--light" type="submit" disabled={Boolean(busy)}>
                        {busy === `reset-${account.accountId}` ? "Creating reset" : "Help reset sign-in"}
                      </button>
                    </div>
                  </form>
                ) : null}
              </article>
            );
          })}
        </div>
        {initialOverview.pagination.accountOffset > 0 || accountEnd < initialOverview.pagination.accountTotal ? (
          <nav className="mt-5 flex flex-wrap gap-3" aria-label="Named account pages">
            {initialOverview.pagination.accountOffset > 0 ? (
              <Link className="btn btn--light" href={accessPageHref(accountPage - 1, invitationPage)}>Previous accounts</Link>
            ) : null}
            {accountEnd < initialOverview.pagination.accountTotal ? (
              <Link className="btn btn--light" href={accessPageHref(accountPage + 1, invitationPage)}>Next accounts</Link>
            ) : null}
          </nav>
        ) : null}
      </section>

      <section className="panel mt-6 border-2 border-[var(--red)]" aria-labelledby="program-ownership-heading">
        <p className="kicker">Planned succession</p>
        <h2 id="program-ownership-heading" className="text-xl font-bold">Program ownership</h2>
        <p>Transfer the single program-owner responsibility only as a planned succession or approved recovery step. Both people will be signed out immediately.</p>
        <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={(event) => void transferOwner(event)}>
          <label className="field">
            <span>Successor</span>
            <select name="successorAccountId" required defaultValue="">
              <option value="" disabled>Choose an active successor</option>
              {activeAccounts.filter((account) => account.accountId !== currentAccountId).map((account) => (
                <option key={account.accountId} value={account.accountId}>{account.displayName} ({account.signInId})</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Enter the successor&apos;s exact sign-in ID</span>
            <input name="confirmSignInId" required minLength={3} maxLength={64} autoCapitalize="none" spellCheck={false} />
          </label>
          <label className="field md:col-span-2">
            <span>Reason for transferring ownership</span>
            <textarea name="reason" required minLength={3} maxLength={471} rows={2} />
          </label>
          <button className="btn btn--primary md:col-span-2 md:justify-self-start" type="submit" disabled={Boolean(busy)}>
            {busy === "transfer-owner" ? "Transferring ownership" : "Transfer program ownership"}
          </button>
        </form>
      </section>
    </div>
  );
}
