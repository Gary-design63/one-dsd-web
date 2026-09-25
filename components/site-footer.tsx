import Link from "next/link";
import { PageCopyEditor } from "@/components/page-copy-editor";
import { editingModeFromCookies } from "@/lib/auth/request";
import { loadPageBlockEditingState, loadPublishedPageCopy } from "@/lib/content/page-copy";
import { consultationIntakeEnabled } from "@/lib/intelligence/consult/availability";
import { PROGRAM } from "@/lib/constants";
import { requestedProductContext } from "@/lib/product/request-context";
import { displayProgramName } from "@/lib/brand/legacy-program-name";

/** The footer identity line follows the selected program view (One DHS or One DSD), matching the header wordmark. */
function brandForContext(text: string, oneDsd: boolean): string {
  const currentName = displayProgramName(text);
  return oneDsd ? currentName.split(PROGRAM.staffBrand).join(PROGRAM.oneDsdProgramName) : currentName;
}

export async function SiteFooter() {
  const intakeEnabled = consultationIntakeEnabled();
  const [loadedCopy, owner, context] = await Promise.all([loadPublishedPageCopy("footer"), editingModeFromCookies(), requestedProductContext()]);
  const oneDsd = context === "one_dsd";
  const copy = loadedCopy
    ? { ...loadedCopy, identityKicker: brandForContext(loadedCopy.identityKicker, oneDsd), identityText: brandForContext(loadedCopy.identityText, oneDsd) }
    : loadedCopy;
  const editing = owner ? await loadPageBlockEditingState("footer") : undefined;
  if (!copy && !editing) return null;
  const firstSentenceEnd = copy ? copy.identityText.indexOf(". ") : -1;
  const identityIntro = copy && firstSentenceEnd >= 0 ? copy.identityText.slice(0, firstSentenceEnd + 1) : copy?.identityText;
  const identityDetail = copy && firstSentenceEnd >= 0 ? copy.identityText.slice(firstSentenceEnd + 2) : "";

  return <footer className="site-footer">
    {copy ? <>
      <div className="wrap footer-top">
        <div><p className="kicker">{copy.identityKicker}</p><p className="m-0 text-sm">{identityIntro}</p>
          {identityDetail ? <details className="mt-2"><summary>About this resource</summary><p>{identityDetail}</p></details> : null}
        </div>
        <div><p className="kicker">{copy.helpHeading}</p>
          <ul>
            <li><Link href={copy.askHref}>{copy.askLabel}</Link></li>
            <li><Link href={copy.resourcesHref}>{copy.resourcesLabel}</Link></li>
            <li><Link href={copy.communitiesHref}>{copy.communitiesLabel}</Link></li>
            <li><Link href={copy.requestHref}>{intakeEnabled ? copy.requestAvailableLabel : copy.requestPreviewLabel}</Link></li>
            {intakeEnabled ? <li><Link href={copy.trackHref}>{copy.trackLabel}</Link></li> : null}
            <li><Link href={copy.escalationHref}>{copy.escalationLabel}</Link></li>
          </ul>
        </div>
        <div><p className="kicker">{copy.privacyHeading}</p><p className="m-0 text-sm">{copy.privacyText}</p></div>
      </div>
      <nav className="wrap footer-bottom" aria-label="About the program"><Link href="/about">About the program</Link><Link href="/orientation">Orientation</Link><Link href="/operationalizing-equity">Operationalizing equity</Link><Link href="/equity-policy">DHS equity policy</Link>
        <Link href="/equity-framework">Equity Strategic Framework</Link><Link href="/understanding-dhs">Understanding DHS</Link></nav>
    </> : null}
    {editing ? <div className="wrap py-8"><PageCopyEditor surface="footer" initial={editing} /></div> : null}
  </footer>;
}
