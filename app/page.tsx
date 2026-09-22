import { OperationalizingEquityPreview } from "@/components/operationalizing-equity-preview";
import Image from "next/image";
import Link from "next/link";
import { PageCopyEditor } from "@/components/page-copy-editor";
import { editingModeFromCookies } from "@/lib/auth/request";
import { loadPageBlockEditingState, loadPublishedPageCopy } from "@/lib/content/page-copy";
import { requestedProductContext } from "@/lib/product/request-context";
import styles from "./home.module.css";

export const dynamic = "force-dynamic";

const LANDING_HERO_IMAGE = "/images/one-dhs-dsd-pac-landing-hero.png";
const LANDING_HERO_ALT = "A diverse group of colleagues smiling together around a conference table in an office.";

export default async function HomePage() {
  const [publishedCopy, owner, context] = await Promise.all([loadPublishedPageCopy("home"), editingModeFromCookies(), requestedProductContext()]);
  const editing = owner ? await loadPageBlockEditingState("home") : undefined;
  // In the One DSD view the opening of the page speaks as One DSD; everything else is shared.
  const copy = publishedCopy && context === "one_dsd"
    ? {
      ...publishedCopy,
      headlineLine1: "One DSD People,",
      headlineLine2: "Access and Culture",
      headlineLine3: "Program",
    }
    : publishedCopy;

  return (
    <>
      {copy ? <div className={styles.home}>
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.opening}>
            <p className={styles.eyebrow}>People at the heart of public service</p>
            <h1 id="hero-title">{copy.headlineLine1} {copy.headlineLine2} {copy.headlineLine3}</h1>
            <div className={styles.rule} aria-hidden="true" />
            <p className={styles.lede}>{copy.heroLede}</p>
            {copy.heroNote ? <p className={styles.note}>{copy.heroNote}</p> : null}
            <div className={styles.actions}>
              <Link href={copy.secondaryActionHref} className="btn btn--primary">{copy.secondaryActionLabel}</Link>
              <Link href={copy.primaryActionHref} className={styles.textLink}>{copy.primaryActionLabel}<span aria-hidden="true"> ↗</span></Link>
            </div>
          </div>
          <div className={styles.photograph}>
            <Image src={LANDING_HERO_IMAGE} alt={LANDING_HERO_ALT} fill sizes="(max-width: 760px) 100vw, 62vw" style={{ objectFit: "cover", objectPosition: "center" }} priority unoptimized />
          </div>
        </section>

        <div className="wrap">
          <OperationalizingEquityPreview />
          <section className={styles.explore} aria-labelledby="explore-title">
            <div className={styles.sectionHeading}>
              <div><p className={styles.eyebrow}>Your next step</p><h2 id="explore-title">What brings you here?</h2></div>
              <Link href={copy.foundationHref} className={styles.textLink}>Explore all areas of work<span aria-hidden="true"> ↗</span></Link>
            </div>
            <div className={styles.gateways}>
              <article className={styles.learning}>
                <p className={styles.number} aria-hidden="true">01 / Discover</p>
                <h3><Link href={copy.learnHref}>Learn and explore<span aria-hidden="true"> ↗</span></Link></h3>
                <p>A fresh perspective, a useful resource, or a moment to reflect. Follow your curiosity.</p>
                <Link href={copy.communitiesHref} className={styles.smallLink}>{copy.communitiesLabel}</Link>
              </article>
              <article className={styles.practice}>
                <p className={styles.number} aria-hidden="true">02 / Apply</p>
                <h3><Link href={copy.applyHref}>Put equity into practice<span aria-hidden="true"> ↗</span></Link></h3>
                <p>Bring a decision or challenge. Find questions and tools to help you move it forward.</p>
                <Link href={copy.resourcesHref} className={styles.smallLink}>Browse the resource library</Link>
              </article>
              <article className={styles.connection}>
                <p className={styles.number} aria-hidden="true">03 / Connect</p>
                <h3><Link href={copy.leadHref}>Connect with colleagues<span aria-hidden="true"> ↗</span></Link></h3>
                <p>Share perspectives, learn together, and see how ideas take shape through One DSD.</p>
                <Link href={copy.supportHref} className={styles.smallLink}>Find support</Link>
              </article>
            </div>
          </section>
          <aside className={styles.welcome} aria-label="Getting to know the program">
            <p><strong>A place to begin. Room to grow.</strong> Explore what is useful to you, at your own pace.</p>
            <Link href="/orientation">Get to know the program<span aria-hidden="true"> ↗</span></Link>
          </aside>
        </div>
      </div> : null}
      {editing ? <div className="wrap py-8"><PageCopyEditor surface="home" initial={editing} /></div> : null}
    </>
  );
}
