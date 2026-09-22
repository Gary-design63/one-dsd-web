import type { ReactNode } from "react";
import styles from "./workspace-presentation.module.css";

export function WorkspacePresentation({ children }: { children: ReactNode }) {
  return <div className={styles.space}>{children}</div>;
}
