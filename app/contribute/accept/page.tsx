import type { Metadata } from "next";
import Link from "next/link";
import { Field, PageIntro } from "@/components/ui";
import { contributorWorkspaceClosedPage } from "@/components/contributor-workspace";
import { protectedFeatureActivation } from "@/lib/auth/protected-feature-activation";

export const metadata: Metadata = {
  title: "Accept contributor invitation",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AcceptContributorInvitationPage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>;
}) {
  const activation = protectedFeatureActivation("protected_identity");
  if (!activation.active) return contributorWorkspaceClosedPage({ detail: "Invitation acceptance is not open yet." });
  const { denied } = await searchParams;
  return (
    <>
      <PageIntro
        kicker="Welcome to the work"
        title="Set up your contributor sign-in"
        lede="Use your invitation to create an individual sign-in for the work you will help shape."
      />
      <div className="wrap py-8">
        {denied === "1" ? (
          <p className="notice notice--stop max-w-xl" role="alert">
            We couldn’t finish setting up this sign-in. Try again, or ask the program owner for help without sending your passphrase.
          </p>
        ) : null}
        <form method="post" action="/api/contribute/accept" className="panel max-w-xl">
          <h2 className="text-xl font-bold">Make this sign-in yours</h2>
          <p className="mt-2">Enter the one-time code you received directly. Do not send your new passphrase to the program owner or anyone else.</p>
          <Field id="invitationCode" label="One-time invitation code" help="The code is used once and is not stored in readable form.">
            <input id="invitationCode" name="invitationCode" type="text" autoComplete="one-time-code" required maxLength={64} />
          </Field>
          <Field id="passphrase" label="New passphrase" help="Use 15 to 128 characters. A longer phrase you can remember is welcome.">
            <input id="passphrase" name="passphrase" type="password" autoComplete="new-password" required minLength={15} maxLength={256} />
          </Field>
          <Field id="confirmPassphrase" label="Enter the new passphrase again">
            <input id="confirmPassphrase" name="confirmPassphrase" type="password" autoComplete="new-password" required minLength={15} maxLength={256} />
          </Field>
          <button className="btn btn--primary" type="submit">Create my sign-in</button>
        </form>
        <p className="mt-5 text-sm"><Link href="/contribute">Back to the contributor workspace</Link></p>
      </div>
    </>
  );
}
