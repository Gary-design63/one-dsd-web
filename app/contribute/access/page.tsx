import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProgramAccessManager } from "@/components/program-access-manager";
import { contributorWorkspaceClosedPage } from "@/components/contributor-workspace";
import { Notice, PageIntro } from "@/components/ui";
import { programIdentityStore } from "@/lib/auth/program-identity";
import { protectedFeatureActivation } from "@/lib/auth/protected-feature-activation";
import { programMutationPrincipalFromCookies, type ProgramMutationPrincipal } from "@/lib/auth/program-request";

export const metadata: Metadata = {
  title: "People and access",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

function pageNumber(value: string | undefined): number {
  if (!value || !/^\d{1,6}$/.test(value)) return 1;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 1 && parsed <= 20_001 ? parsed : 1;
}

function AccessProblem({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageIntro
        kicker="Program owner workspace"
        title="People and access"
        lede="Invite colleagues and manage their responsibilities. Private learning and practice notes stay separate."
      />
      <div className="wrap py-8">
        <Notice tone="stop">{children}</Notice>
        <p className="mt-5"><Link href="/contribute">Back to the contributor workspace</Link></p>
      </div>
    </>
  );
}

export default async function ProgramAccessPage({
  searchParams = Promise.resolve({}),
}: {
  searchParams?: Promise<{ accounts?: string; invitations?: string }>;
}) {
  const activation = protectedFeatureActivation("protected_identity");
  if (!activation.active) return contributorWorkspaceClosedPage({ detail: "People and access is not active." });

  let principal: ProgramMutationPrincipal | null;
  try {
    principal = await programMutationPrincipalFromCookies("one-dhs-pac", "owner");
  } catch {
    // The identity lookup already logged the cause; the store could not answer.
    return <AccessProblem>People and access is temporarily unavailable. Please try again in a few minutes.</AccessProblem>;
  }
  if (!principal) redirect("/contribute");

  const query = await searchParams;
  const accountPage = pageNumber(query.accounts);
  const invitationPage = pageNumber(query.invitations);

  const overview = await programIdentityStore()
    .accessOverview(principal.sessionToken, {
      accountOffset: (accountPage - 1) * PAGE_SIZE,
      accountLimit: PAGE_SIZE,
      invitationOffset: (invitationPage - 1) * PAGE_SIZE,
      invitationLimit: PAGE_SIZE,
    })
    .catch(() => null);
  if (!overview) {
    return <AccessProblem>People and access could not be opened right now. Try again in a moment.</AccessProblem>;
  }

  const lastAccountPage = Math.max(1, Math.ceil(overview.pagination.accountTotal / PAGE_SIZE));
  const lastInvitationPage = Math.max(1, Math.ceil(overview.pagination.invitationTotal / PAGE_SIZE));
  if (accountPage > lastAccountPage || invitationPage > lastInvitationPage) {
    redirect(`/contribute/access?accounts=${Math.min(accountPage, lastAccountPage)}&invitations=${Math.min(invitationPage, lastInvitationPage)}`);
  }

  return (
    <>
      <PageIntro
        kicker="Program owner workspace"
        title="People and access"
        lede="Invite colleagues and manage their responsibilities. Private learning and practice notes stay separate."
      />
      <ProgramAccessManager
        initialOverview={overview}
        currentAccountId={principal.identity.accountId}
      />
    </>
  );
}
