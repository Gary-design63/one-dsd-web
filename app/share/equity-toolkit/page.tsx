import Image from "next/image";
import styles from "../../learn/learning-family.module.css";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { PublishedPodcast } from "@/components/published-podcast";
import { PODCASTS } from "@/lib/content/podcasts";
import { stringValue } from "@/lib/content/staff-surface-registry";
import { EQUITY_TOOLKIT_HERO_IMAGE } from "@/lib/content/page-images";
import Link from "next/link";

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
              <p><Link href="/share/equity-toolkit/practice">Continue to practice and resources →</Link></p>
              <p className={styles.shareNote}>You&rsquo;re viewing a shared link to this toolkit only. It doesn&rsquo;t include the rest of the program.</p>
            </div>
            <div className={styles.heroCover}>
              <Image src={EQUITY_TOOLKIT_HERO_IMAGE} alt="Five colleagues of different backgrounds gather around a table, reviewing printed photos and notes together." fill sizes="(max-width: 760px) 90vw, 46vw" priority unoptimized />
            </div>
          </header>
          <PublishedPodcast headingLevel={2} podcast={PODCASTS[0]} surface={podcastSurface} />
          <nav aria-label="Continue the toolkit" className="border-t border-line pt-8 print:hidden"><Link className={styles.primaryAction} href="/share/equity-toolkit/practice">Continue to practice with the toolkit →</Link></nav>
        </div>
      </EditableSurfaceRegion>
    </>
  );
}
