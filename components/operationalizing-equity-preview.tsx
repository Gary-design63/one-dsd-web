import Link from "next/link";
import Image from "next/image";
import { EQUITY_TOOLKIT_HERO_IMAGE } from "@/lib/content/page-images";
import styles from "./operationalizing-equity-preview.module.css";

export function OperationalizingEquityPreview() {
  return <section className={styles.feature} aria-labelledby="operationalizing-equity-title">
    <div className={styles.definition}>
      <p className={styles.eyebrow}>The idea behind the work</p>
      <h2 id="operationalizing-equity-title">Operationalizing equity</h2>
      <p>Making equity a continuing part of how we plan, carry out and review our work—with the people affected by our decisions.</p>
      <Link href="/operationalizing-equity">Explore equity in practice<span aria-hidden="true"> ↗</span></Link>
    </div>
    <div className={styles.toolkit}>
      <Link href="/learn/equity-toolkit" className={styles.toolkitImage} aria-label="Explore the DHS Equity Analysis Toolkit">
        <Image src={EQUITY_TOOLKIT_HERO_IMAGE} alt="Five colleagues reviewing photographs and notes together around a table." fill sizes="(max-width: 760px) 90vw, 40vw" style={{ objectFit: "cover" }} unoptimized />
      </Link>
      <div className={styles.toolkitBody}>
      <h2><Link href="/learn/equity-toolkit">DHS Equity Analysis Toolkit</Link></h2>
      <p>Put equity into practice with guided steps, a podcast, examples, and downloadable tools for your work.</p>
      <Link href="/learn/equity-toolkit" className="btn btn--primary">Open the toolkit<span aria-hidden="true"> ↗</span></Link>
      </div>
    </div>
  </section>;
}
