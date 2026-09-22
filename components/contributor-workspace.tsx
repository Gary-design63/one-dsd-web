import Link from "next/link";
import type { EditableSurfaceValues } from "@/lib/content/editable-surface-contract";
import { getEditableSurfaceDefinition, stringValue, linkListValue } from "@/lib/content/staff-surface-registry";
import { ACCESS_SCOPE_LABELS } from "@/lib/auth/program-access-contract";
import { Field, Notice, PageIntro } from "@/components/ui";
import { EditableSurfaceRegion, prepareEditableSurface, type PreparedEditableSurface } from "@/components/editable-surface";
import { protectedFeatureActivation } from "@/lib/auth/protected-feature-activation";
import {
  programContributionAccessFromCookies,
  programIdentityHasRole,
  programIdentityFromCookies,
} from "@/lib/auth/program-request";
import { requestedContentScope } from "@/lib/product/request-context";


const ROLE_LABELS: Record<string, string> = {
  content_contributor: "Contributor",
  program_steward: "Program steward",
  publishing_approver: "Publishing approver",
  equity_director: "Equity director",
  one_dsd_team_member: "One DSD Team member",
  owner: "Program owner",
};

const CLOSED_SURFACE = "contribute.page";

/**
 * The one closed-state block for the whole /contribute tree while contributor
 * identity is not active: no sign-in form, no invitation form, and links only
 * to places that are open today.
 */
export function ContributorWorkspaceClosed({ copy, detail }: { copy: EditableSurfaceValues; detail?: string }) {
  return (
    <div className="wrap max-w-3xl space-y-6 py-8">
      {detail ? <p className="kicker">{detail}</p> : null}
      <Notice>
        <strong>{stringValue(copy, "noticeLead")} </strong>
        {stringValue(copy, "noticeBody")}
      </Notice>
      <section aria-labelledby="contribute-closed-heading">
        <h2 id="contribute-closed-heading" className="text-xl font-bold">What contributors will be able to do</h2>
        <p className="mt-2">When the program owner opens it, invited colleagues will prepare drafts, review them, and add or withdraw resources in the One DHS and One DSD views. Until then, nothing is collected here: no drafts, reviews, invitations, or sign-in details.</p>
      </section>
      <p className="mt-5">
        {stringValue(copy, "staffBody")} {linkListValue(copy, "staffLinks").map((link) => <Link key={link.href} href={link.href} className="mr-3">{link.label}</Link>)}
      </p>
    </div>
  );
}

/**
 * Full closed-state page for every /contribute route. Reads the same published
 * wording as /contribute; if that wording cannot be read outside a request
 * (for example in a direct render), the approved defaults are used instead.
 */
export async function contributorWorkspaceClosedPage(options: { detail?: string } = {}) {
  let surface: PreparedEditableSurface | null = null;
  try {
    surface = await prepareEditableSurface(CLOSED_SURFACE, { includeOwner: false });
  } catch (error) {
    console.warn("Contributor closed-state wording fell back to approved defaults.", error instanceof Error ? error.name : "Unknown error");
  }
  const copy = surface?.values ?? getEditableSurfaceDefinition(CLOSED_SURFACE)?.approvedValues ?? {};
  const body = (
    <>
      <PageIntro
        kicker={stringValue(copy, "introKicker")}
        title={stringValue(copy, "introTitle")}
        lede={stringValue(copy, "introLede")}
      />
      <ContributorWorkspaceClosed copy={copy} detail={options.detail} />
    </>
  );
  return surface ? <EditableSurfaceRegion surface={surface}>{body}</EditableSurfaceRegion> : body;
}

export async function ContributorWorkspace({
  searchParams,
  copy,
}: {
  copy: EditableSurfaceValues;
  searchParams: Promise<{ denied?: string; ownership?: string; identity?: string; signout?: string }>;
}) {
  const identityActivation = protectedFeatureActivation("protected_identity");
  if (!identityActivation.active) return <ContributorWorkspaceClosed copy={copy} />;

  const { denied, ownership, identity: identityNotice, signout } = await searchParams;
  let identity = null;
  let identityUnavailable = false;
  try {
    identity = await programIdentityFromCookies();
  } catch {
    // The lookup already logged the cause; the identity store could not answer.
    identityUnavailable = true;
  }
  const scope = identity ? await requestedContentScope() : "one-dhs";
  const contributionActivation = protectedFeatureActivation("protected_contribution");
  const contribution = identity
    ? await programContributionAccessFromCookies(scope)
    : null;
  const hasContributionAction = Boolean(
    contribution?.canDraft
    || contribution?.canReview
    || contribution?.canPublish
    || contribution?.canWithdraw,
  );
  const canManageAccess = Boolean(
    identity && programIdentityHasRole(identity, "one-dhs-pac", "owner"),
  );

  return (
    <>
      <div className="wrap space-y-6 py-8">
        {signout === "local_only" ? <Notice tone="warn">You are signed out on this computer. Your sign-in could not be fully ended and will end on its own later. Let the program owner know if you need help ending access sooner.</Notice> : null}
        {identityUnavailable ? (
          <Notice tone="warn">
            <strong>Contributor sign-in is temporarily unavailable. </strong>
            The service that checks sign-ins could not be reached. Please try again in a few minutes.
          </Notice>
        ) : identity ? (
          <>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="kicker">Signed in individually</p>
                <h2 className="text-2xl font-bold">Welcome, {identity.displayName}</h2>
                <p className="mt-2 max-w-3xl">
                  Your individual sign-in applies to the responsibilities below. Your private learning and practice notes remain yours.
                </p>
              </div>
              <form method="post" action="/api/contribute/logout">
                <button className="btn btn--light" type="submit">Sign out</button>
              </form>
            </div>

            <section className="panel mt-6" aria-labelledby="workspace-access-heading">
              <h2 id="workspace-access-heading" className="text-xl font-bold">Your responsibilities</h2>
              {identity.grants.length > 0 ? (
                <ul className="mt-3 list-disc pl-6">
                  {identity.grants.map((grant) => (
                    <li key={grant.grantId}>
                      {ROLE_LABELS[grant.role] ?? grant.role} · {grant.scopeId === "one-dhs-pac" ? "Across the program" : ACCESS_SCOPE_LABELS[grant.scopeId as keyof typeof ACCESS_SCOPE_LABELS] ?? grant.scopeId}
                      {grant.expiresAt ? ` · through ${new Date(grant.expiresAt).toLocaleDateString("en-US")}` : ""}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3">Your sign-in is ready. The program owner can help assign the work you will contribute to.</p>
              )}
            </section>

            {canManageAccess ? (
              <section className="panel mt-6" aria-labelledby="people-access-link-heading">
                <p className="kicker">Program owner</p>
                <h2 id="people-access-link-heading" className="text-xl font-bold">People and access</h2>
                <p>Invite colleagues, assign exact responsibilities, help with sign-in resets, or manage planned succession.</p>
                <Link className="btn btn--light" href="/contribute/access">Manage people and access</Link>
              </section>
            ) : null}

            {hasContributionAction ? (
              <section className="panel" aria-labelledby="contribution-actions-heading">
                <p className="kicker">{scope === "dsd" ? "One DSD" : "One DHS"}</p>
                <h2 id="contribution-actions-heading" className="text-2xl font-bold">Make the next resource useful</h2>
                <p>Open your resource workspace to prepare a draft or take up the reviews and staff-availability decisions assigned to you.</p>
                <Link className="btn btn--primary" href="/contribute/resources">Open resource workspace</Link>
                {!contribution?.ordinaryActive && contribution?.canWithdraw ? <Notice tone="warn">New changes are paused. You can still withdraw a resource when needed.</Notice> : null}
              </section>
            ) : !contributionActivation.active ? (
              <Notice tone="warn">
                <strong>Resource contribution is not open yet. </strong>
                Your sign-in is ready for when this workspace opens.
              </Notice>
            ) : canManageAccess ? (
              <Notice>
                <strong>Access administration is available. </strong>
                Your owner responsibility is separate from content contribution. Use People and access to manage named accounts and permissions.
              </Notice>
            ) : (
              <Notice tone="warn">
                <strong>No action is assigned in this view. </strong>
                Change the One DHS or One DSD view if your role applies elsewhere, or ask the program owner to verify your role and scope.
              </Notice>
            )}
          </>
        ) : (
          <>
            {ownership === "transferred" ? (
              <p className="notice max-w-xl" role="status">
                Program ownership was transferred. Both people were signed out; the successor can now sign in again.
              </p>
            ) : null}
            {identityNotice === "corrected" ? (
              <p className="notice max-w-xl" role="status">
                Your sign-in details were corrected and earlier sessions ended. Sign in again with the corrected sign-in ID and your existing passphrase.
              </p>
            ) : null}
            {denied === "1" ? (
              <p className="notice notice--stop max-w-xl" role="alert">
                The sign-in ID or passphrase did not match. Check both and try again.
              </p>
            ) : null}
            <form method="post" action="/api/contribute/login" className="panel max-w-xl">
              <h2 className="text-xl font-bold">Welcome back</h2>
              <p className="mt-2">Use the individual sign-in you set up from your invitation.</p>
              <Field id="signInId" label="Sign-in ID">
                <input id="signInId" name="signInId" type="text" autoComplete="username" required maxLength={64} />
              </Field>
              <Field id="passphrase" label="Passphrase">
                <input id="passphrase" name="passphrase" type="password" autoComplete="current-password" required maxLength={256} />
              </Field>
              <button className="btn btn--primary" type="submit">Open my workspace</button>
            </form>
            <p className="mt-5 text-sm">
              Have a one-time invitation? <Link href="/contribute/accept">Set up your individual access</Link>.
            </p>
          </>
        )}
      </div>
    </>
  );
}
