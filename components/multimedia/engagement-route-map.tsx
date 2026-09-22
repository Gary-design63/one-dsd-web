import Link from "next/link";
import styles from "./engagement-diagrams.module.css";

type OrientationDoor = { title: string; href: string; label: string };
const groups = [
  { question: "How does the work fit together?", routes: ["/understanding-dhs", "/operationalizing-equity", "/one-dsd"] },
  { question: "What would I like to learn?", routes: ["/learn", "/minnesota-communities"] },
  { question: "What could I try in practice?", routes: ["/practice"] },
  { question: "Where can I connect with colleagues?", routes: ["/one-dsd/amplify", "/employee-resource-groups"] },
  { question: "How could I contribute or grow?", routes: ["/one-dsd/team", "/one-dsd/leadership"] },
  { question: "Where can I take a question?", routes: ["/ask", "/support"] },
];

/** Uses the orientation directory's original link labels and destinations. */
export function EngagementRouteMap({ doors }: { doors: readonly OrientationDoor[] }) {
  return (
    <details className={styles.routeMap}>
      <summary>Find your way by your question</summary>
      <div className={styles.routeContent}>
        <p className={styles.routePrompt}>What would help today?</p>
        <p className={styles.routeIntro}>Choose any starting point. Every path connects to the same program; there is no required order.</p>
        <nav aria-label="Program pages by question">
          <ul className={styles.branches}>
            {groups.map(group => (
              <li key={group.question}>
                <h3>{group.question}</h3>
                <ul>{group.routes.map(href => {
                  const door = doors.find(item => item.href === href);
                  return door ? <li key={href}><Link href={door.href}>{door.label}<span aria-hidden="true"> ↗</span></Link></li> : null;
                })}</ul>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </details>
  );
}
