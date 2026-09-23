import { PARTNERSHIP_SPINE } from "@/lib/constants";
import { loadPublishedPageCopy } from "@/lib/content/page-copy";

export async function ProgramCommitments() {
  const copy = await loadPublishedPageCopy("home");
  if (!copy) return null;
  return <section aria-labelledby="program-commitments-title" className="border-t border-line pt-6">
    <p className="kicker">{copy.commitmentsKicker}</p>
    <h2 id="program-commitments-title" className="text-2xl font-semibold">{copy.commitmentsTitle}</h2>
    <ol className="mt-5 grid gap-x-10 gap-y-4 pl-5 md:grid-cols-2">{PARTNERSHIP_SPINE.map(commitment => <li key={commitment}>{commitment}</li>)}</ol>
    <details className="mt-6 border-t border-line pt-3"><summary>{copy.aboutLabel}</summary><p>{copy.aboutText}</p></details>
    <details className="border-t border-line pt-3"><summary>{copy.privacyLabel}</summary><p>{copy.privacyText}</p></details>
  </section>;
}
