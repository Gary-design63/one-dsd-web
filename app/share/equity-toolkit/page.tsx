import Image from "next/image";
import styles from "../../learn/learning-family.module.css";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { EquityToolkitExperience } from "@/components/equity-toolkit-experience";
import { PublishedPodcast } from "@/components/published-podcast";
import { PODCASTS } from "@/lib/content/podcasts";
import { stringValue, linkListValue } from "@/lib/content/staff-surface-registry";
import { EQUITY_TOOLKIT_HERO_IMAGE } from "@/lib/content/page-images";

export const dynamic = "force-dynamic";

export const metadata = { title: "Equity analysis for your work" };

/**
 * Opened by a shared link only. It shows the Equity Analysis Toolkit on its own,
 * with no navigation into the rest of the program — see /learn/equity-toolkit for
 * the same toolkit inside the full staff experience. Wording is hidden the same
 * way /learn/equity-toolkit hides it when the surface is withdrawn or otherwise
 * unavailable, rather than showing placeholder or missing wording.
 */
export default async function SharedEquityToolkitPage() {
  const [surface, podcastSurface] = await Promise.all([
    prepareEditableSurface("equity-toolkit.home", { scope: "one-dhs", includeOwner: false }),
    prepareEditableSurface(PODCASTS[0].surfaceId, { scope: "one-dhs", includeOwner: false }),
  ]);
  const text = (key: string) => stringValue(surface.values, key);
  return (
    <>
      <header className={`${styles.shareBanner} print:hidden`}>
        <div className={`${styles.shareBannerInner} wrap`}>
          <span className={styles.shareBannerLogo}>
            <Image src="/images/dsd-logo.png" alt="Minnesota Department of Human Services, Disability Services Division" width={514} height={126} priority />
          </span>
        </div>
      </header>
      <EditableSurfaceRegion surface={surface}>
        <div className={`${styles.page} ${styles.content} ${styles.readingPage} space-y-10`}>
          <header className={`${styles.heroPhoto} print:hidden`}>
            <div className="max-w-3xl space-y-5">
              <h1 className="text-4xl font-semibold">{text("title")}</h1>
              <p className="text-xl">{text("intro")}</p>
              <p>{text("companionNote")}</p>
              <nav className="flex flex-wrap gap-6">
                <a href="#toolkit-practice">{text("practiceLabel")}</a>
                <a href="#toolkit-draft">{text("workLabel")}</a>
                <a href="#toolkit-resources">{text("resourcesTitle")}</a>
              </nav>
              <p className={styles.shareNote}>You&rsquo;re viewing a shared link to this toolkit only. It doesn&rsquo;t include the rest of the program.</p>
            </div>
            <div className={styles.heroCover}>
              <Image src={EQUITY_TOOLKIT_HERO_IMAGE} alt="Five colleagues of different backgrounds gather around a table, reviewing printed photos and notes together." fill sizes="(max-width: 760px) 90vw, 46vw" priority unoptimized />
            </div>
          </header>
          <PublishedPodcast headingLevel={2} podcast={PODCASTS[0]} surface={podcastSurface} />
          <EquityToolkitExperience values={surface.values} />
          <section id="toolkit-resources" className="space-y-4 border-t border-line pt-8 print:hidden">
            <h2 className="text-2xl font-semibold">{text("resourcesTitle")}</h2>
            <p>{text("resourcesIntro")}</p>
            <p className="max-w-3xl">{text("resourceIntro")}</p>
            <ul className="list-disc space-y-3 pl-6">{linkListValue(surface.values, "supportingResources").map(link => (
              <li key={link.href}>{link.href.startsWith("http") ? <a href={link.href} rel="noreferrer">{link.label}</a> : link.label}</li>
            ))}</ul>
            <p className={styles.shareNote}>Links to other parts of the program aren&rsquo;t included in this shared view.</p>
          </section>
        </div>
      </EditableSurfaceRegion>
    </>
  );
}
