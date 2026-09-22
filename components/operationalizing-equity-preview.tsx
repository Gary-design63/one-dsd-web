import Link from "next/link";
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
      <h2><Link href="/learn/equity-toolkit">Equity Analysis Toolkit</Link></h2>
      <p>Put equity into practice with guided steps, a podcast, examples, and downloadable tools for your work.</p>
      <Link href="/learn/equity-toolkit" className="btn btn--primary">Open the toolkit<span aria-hidden="true"> ↗</span></Link>
    </div>
  </section>;
}
