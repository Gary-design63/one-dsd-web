import { DsdWorkExample, DSD_SCENARIO_EXAMPLES } from "./dsd-work-examples";
import { DsdContinuityExample } from "./dsd-development-map-example";
import { EngagementWorkedExample } from "./engagement-worked-examples";
import styles from "./dsd-media.module.css";

export function DsdLeadershipMedia({ stageId }: { stageId: string }) {
  const scenarioId = ({ everyday: "dsd-team-silence", advance: "dsd-advancement-conversation" } as Record<string, string>)[stageId];
  if (scenarioId) return <details className={styles.miniMap}><summary>Examine a related fictional conversation</summary><DsdWorkExample example={DSD_SCENARIO_EXAMPLES[scenarioId]} id={"leadership-example-" + stageId} /></details>;
  if (stageId === "develop" || stageId === "retain") return <details className={styles.miniMap}><summary>Compare two kinds of support</summary><EngagementWorkedExample kind={stageId === "develop" ? "mentoring" : "well-being"} /></details>;
  if (stageId === "succession") return <DsdContinuityExample />;
  if (stageId === "interview") return <details className={styles.miniMap}><summary>Separate an observation from a rating</summary>
    <div className={styles.tableWrap} tabIndex={0} role="region" aria-label="Fictional panel discussion"><table className={styles.table}><caption>Fictional panel discussion</caption><thead><tr><th scope="col">What was said</th><th scope="col">What the panel can examine</th></tr></thead><tbody>
      <tr><th scope="row">“The applicant looked down.”</th><td>An observed behavior. It does not establish confidence, ability or a cultural explanation.</td></tr>
      <tr><th scope="row">“The answer identified two service options and a clear follow-up.”</th><td>Compare the substance of the answer with the same job-related criterion used for other applicants.</td></tr>
      <tr><th scope="row">“Which part of the agreed criterion supports that rating?”</th><td>Pause the rating until the panel can explain its evidence. Ask consistent, permitted follow-up questions.</td></tr>
    </tbody></table></div></details>;
  if (stageId === "recruit") return <details className={styles.miniMap}><summary>Trace how someone reaches the opportunity</summary><ol className={styles.flow}>
    <li className={styles.step}><h4>Discover</h4><p>In a fictional recruitment, the announcement circulates through one familiar network. Identify other relevant channels with recruitment partners.</p></li>
    <li className={styles.step}><h4>Understand</h4><p>Explain the actual duties and permitted evidence of capability. Check whether a person outside the usual network can understand the invitation.</p></li>
    <li className={styles.step}><h4>Apply</h4><p>Check the application route, access assistance and contact for questions. More views alone do not show that people could apply.</p></li>
  </ol><p>At which point would you ask potential applicants about a barrier? Limited response does not establish limited interest.</p></details>;
  return null;
}
