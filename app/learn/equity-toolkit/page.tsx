import styles from "../learning-family.module.css";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { EquityToolkitExperience } from "@/components/equity-toolkit-experience";
import { ResourceDownloads } from "@/components/resource-downloads";
import { requestedContentScope } from "@/lib/product/request-context";
import Image from "next/image";
import Link from "next/link";
import { PublishedPodcast } from "@/components/published-podcast";
import { PODCASTS } from "@/lib/content/podcasts";
import { stringValue, linkListValue } from "@/lib/content/staff-surface-registry";
import { EQUITY_TOOLKIT_HERO_IMAGE } from "@/lib/content/page-images";

export const metadata = { title: "Equity analysis for your work" };

export default async function Page() {
  const scope = await requestedContentScope();
  const [surface, connections, podcastSurface] = await Promise.all([
    prepareEditableSurface("equity-toolkit.home", { scope }),
    prepareEditableSurface("community-connections.home", { scope, includeOwner: false }),
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
          <p>{text("companionNote")}</p>
          <p><Link href="/operationalizing-equity">Explore operationalizing equity in everyday work</Link></p>
          <p><Link className={styles.primaryAction} href="/toolkit-studio">Start with Toolkit Studio</Link></p>
          <nav className="flex flex-wrap gap-6">
            <a href="#toolkit-practice">{text("practiceLabel")}</a>
            <a href="#toolkit-draft">{text("workLabel")}</a>
            <a href="#toolkit-resources">{text("resourcesTitle")}</a>
          </nav>
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
      <EquityToolkitExperience values={surface.values} />
      {connections.available ? <aside className="space-y-3 border-t border-line pt-6"><h2 className="text-2xl font-semibold"><Link href="/learn/community-connections">{stringValue(connections.values, "title")}</Link></h2><p>{stringValue(connections.values, "intro")}</p></aside> : null}
      <section id="toolkit-resources" className="space-y-4 border-t border-line pt-8 print:hidden">
        <h2 className="text-2xl font-semibold">{text("resourcesTitle")}</h2>
        <p>{text("resourcesIntro")}</p>
        <p className="max-w-3xl">{text("resourceIntro")}</p>
        <ul className="list-disc space-y-3 pl-6">{linkListValue(surface.values, "supportingResources").map(link => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul>
      </section>
    </div>
  </EditableSurfaceRegion>;
}
