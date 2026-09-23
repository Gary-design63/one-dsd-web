import "server-only";
import Link from "next/link";
import { PageIntro, Notice } from "@/components/ui";
import { programContributionAccessFromCookies, programMutationPrincipalFromCookies } from "@/lib/auth/program-request";
import { protectedFeatureActivation } from "@/lib/auth/protected-feature-activation";
import { protectedMutationContextFromSessionToken } from "@/lib/auth/protected-mutation";
import { contributorResourceStore } from "@/lib/content/contributor-resources";
import { requestedContentScope } from "@/lib/product/request-context";
export async function contributorPageContext() {
  const scope = await requestedContentScope();
  const access = await programContributionAccessFromCookies(scope);
  if (!access.canReadWorkingContent) return null;
  const role = access.canWithdraw ? "publishing_approver" : access.canDraft ? "content_contributor" : "program_steward";
  const principal = await programMutationPrincipalFromCookies(scope, role);
  if (!principal) return null;
  return { scope, access, context: protectedMutationContextFromSessionToken(principal.sessionToken, access.canWithdraw ? "resource_withdraw" : "resource_draft_save") };
}
export function ResourceWorkUnavailable({ failed = false }: { failed?: boolean }) {
  return <><PageIntro kicker="Contribute" title="Resource work" lede="Help keep the program's resources useful, current and clear."/>
    <div className="wrap py-8"><Notice>{failed ? "Resource work could not be opened right now. Please try again." : "Resource work opens here when your individual program access is available."}</Notice>
      <p className="mt-5"><Link href="/contribute">Return to your program workspace</Link></p></div></>;
}

/** Wording every resource page shows on the shared closed-state page while contributor identity is not active. */
export const RESOURCE_WORK_CLOSED_DETAIL = "Resource work is not open yet.";

export async function loadContributorResourcePage<T>(
  load: (page: NonNullable<Awaited<ReturnType<typeof contributorPageContext>>>, store: ReturnType<typeof contributorResourceStore>) => Promise<T>,
) {
  // While contributor identity is not active there is no session to read and
  // no working content to show: the whole tree renders one closed-state page.
  if (!protectedFeatureActivation("protected_identity").active) return { state: "closed" } as const;
  let store: ReturnType<typeof contributorResourceStore> | undefined;
  try {
    const page = await contributorPageContext();
    if (!page) return { state: "unavailable" } as const;
    store = contributorResourceStore();
    return { state: "ready", page, value: await load(page, store) } as const;
  } catch { return { state: "failed" } as const; }
  finally { await store?.close().catch(() => undefined); }
}
