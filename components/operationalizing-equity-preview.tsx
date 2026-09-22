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
    <div className={styles.example}>
      <p className={styles.eyebrow}>An everyday example</p>
      <p className={styles.question}>Whose perspective could make this decision better?</p>
      <p>When planning a meeting, consider how people can contribute before, during and afterward—and how they will hear what happened to their ideas.</p>
    </div>
  </section>;
}
