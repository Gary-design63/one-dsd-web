import type { Metadata } from "next";
import "./globals.css";
import "./program-design.css";
import { PROGRAM } from "@/lib/constants";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProgramContextProvider } from "@/components/program-context";
import { requestedProductContext } from "@/lib/product/request-context";
import { prepareEditableSurface, type PreparedEditableSurface } from "@/components/editable-surface";
import { fallbackEditableSurface } from "@/lib/content/editable-surfaces";
import { UniversalEditor } from "@/components/universal-editor";
import { editingModeFromCookies } from "@/lib/auth/request";
import { ChromeGate } from "@/components/chrome-gate";
import { loadPublishedPageCopy } from "@/lib/content/page-copy";
import { staticPageCopy } from "@/lib/content/page-copy-contract";

/**
 * A shared page (/share/…) hides the full footer, but two facts from it must still
 * reach the reader: the privacy warning and the program's DHS-system boundary. Falls
 * back to the registry wording if the published footer copy cannot be read.
 */
function firstSentence(text: string): string {
  const end = text.indexOf(". ");
  return end >= 0 ? text.slice(0, end + 1) : text;
}

function secondSentence(text: string): string {
  const end = text.indexOf(". ");
  return end >= 0 ? text.slice(end + 2).trim() : "";
}

async function ShareProgramNotice() {
  let privacyText = staticPageCopy("footer").privacyText;
  try {
    const copy = await loadPublishedPageCopy("footer");
    if (copy) privacyText = copy.privacyText;
  } catch (error) {
    console.error("share notice footer copy unavailable", error instanceof Error ? `${error.name}: ${error.message}` : error);
  }
  const ownershipNote = secondSentence(PROGRAM.ownership) || PROGRAM.ownership;
  return (
    <p className="share-program-notice wrap text-sm text-muted py-6">
      {firstSentence(privacyText)} {ownershipNote}
    </p>
  );
}

/** Root layout must always render readable text: when the database is unreachable, use registry defaults. */
async function surfaceOrFallback(surface: string): Promise<PreparedEditableSurface> {
  try {
    return await prepareEditableSurface(surface);
  } catch (error) {
    const name = error instanceof Error ? error.name : "Error";
    const message = error instanceof Error ? error.message : String(error);
    console.error("root layout surface unavailable", { surface, error: `${name}: ${message}` });
    return fallbackEditableSurface(surface);
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const context = await requestedProductContext();
  const brand = context === "one_dsd" ? PROGRAM.oneDsdProgramName : PROGRAM.staffBrand;
  return {
    title: { default: brand, template: `%s | ${brand}` },
    description: `${brand}: ${PROGRAM.heroLede}`,
    robots: { index: false, follow: false, nocache: true },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialContext = await requestedProductContext();
  const [loadedHeaderSurface, contextSurface, owner] = await Promise.all([
    surfaceOrFallback("site.header"),
    surfaceOrFallback("site.context"),
    editingModeFromCookies(),
  ]);
  // The header wordmark follows the selected program view (One DHS or One DSD).
  const headerSurface = initialContext === "one_dsd"
    ? { ...loadedHeaderSurface, values: { ...loadedHeaderSurface.values, programName: PROGRAM.oneDsdProgramName } }
    : loadedHeaderSurface;
  return (
    <html lang="en" className="h-full">
      <body className="program-design flex min-h-full flex-col">
        <ProgramContextProvider
          initialContext={initialContext}
          copy={contextSurface.values}
          copyAvailable={contextSurface.available}
        >
          <ChromeGate hideOnPrefixes={["/share/"]}>
            <a href="#main" className="skip-link">
              Skip to main content
            </a>
            <SiteHeader headerSurface={headerSurface} contextSurface={contextSurface} />
          </ChromeGate>
          <main id="main" tabIndex={-1} className="flex-1">
            {children}
          </main>
          <ChromeGate hideOnPrefixes={["/share/"]}>
            <SiteFooter />
            <UniversalEditor owner={owner} />
          </ChromeGate>
          <ChromeGate onlyOnPrefixes={["/share/"]}>
            <ShareProgramNotice />
          </ChromeGate>
        </ProgramContextProvider>
      </body>
    </html>
  );
}
