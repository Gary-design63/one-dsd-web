import styles from "../learning-family.module.css";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { ResourceDownloads } from "@/components/resource-downloads";
import { requestedContentScope } from "@/lib/product/request-context";
import Image from "next/image";
import Link from "next/link";
import { PublishedPodcast } from "@/components/published-podcast";
import { PODCASTS } from "@/lib/content/podcasts";
import { stringValue } from "@/lib/content/staff-surface-registry";
import { EQUITY_TOOLKIT_HERO_IMAGE } from "@/lib/content/page-images";

export const metadata = { title: "Equity analysis for your work" };

export default async function Page() {
  const scope = await requestedContentScope();
  const [surface, podcastSurface] = await Promise.all([
    prepareEditableSurface("equity-toolkit.home", { scope }),
    prepareEditableSurface(PODCASTS[0].surfaceId, { scope }),
  ]);
  const text = (key: string) => stringValue(surface.values, key);
  return <EditableSurfaceRegion surface={surface}>
    <div className={`${styles.page} ${styles.content} ${styles.readingPage} space-y-10`}>
      <header className={`${styles.heroPhoto} print:hidden`}>
        <div className="max-w-3xl space-y-5">
          <Link href="/learn">{text("backLabel")}</Link>
          <h1 className="text-4xl font-semibold">{text("title")}</h1>
          <p className="text-xl">{text("intro")}</p>
          <details><summary className="cursor-pointer font-semibold">Explore this page</summary><nav className="mt-3 flex flex-wrap gap-4" aria-label="Toolkit sections">
            {scope === "dsd" ? <Link href="/learn/equity-toolkit/goals">Six goals and work plan</Link> : null}
            <Link href="/learn/equity-toolkit/practice">Continue to practice and resources</Link>
          </nav></details>
          <details><summary className="cursor-pointer font-semibold">About this companion</summary><p className="mt-3">{text("companionNote")}</p><p><Link href="/operationalizing-equity">Explore operationalizing equity in everyday work</Link></p></details>
          <details><summary>Download or share this toolkit</summary><div className={styles.shareRow}>
            <Link href="/share/equity-toolkit" className="btn btn--primary">Get a link to share this toolkit</Link>
          </div>
          <p className={styles.shareNote}>The shared link opens the Equity Analysis Toolkit on its own, so you can send it to someone without the rest of the program.</p>
          {surface.available ? <ResourceDownloads kind="equity-toolkit" id="companion" noun="toolkit" scope={scope} /> : null}</details>
        </div>
        <div className={styles.heroCover}>
          <Image src={EQUITY_TOOLKIT_HERO_IMAGE} alt="Five colleagues of different backgrounds gather around a table, reviewing printed photos and notes together." fill sizes="(max-width: 760px) 90vw, 46vw" priority unoptimized />
        </div>
      </header>
      <PublishedPodcast headingLevel={2} podcast={PODCASTS[0]} surface={podcastSurface} />
      <nav aria-label="Continue the toolkit" className="border-t border-line pt-8 print:hidden"><Link className={styles.primaryAction} href={scope === "dsd" ? "/learn/equity-toolkit/goals" : "/learn/equity-toolkit/practice"}>{scope === "dsd" ? "Continue to the six goals and work plan →" : "Continue to practice with the toolkit →"}</Link></nav>
    </div>
  </EditableSurfaceRegion>;
}
