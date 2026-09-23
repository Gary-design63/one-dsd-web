import type { ReactNode } from "react";
import { WorkspacePresentation } from "@/components/workspace-presentation";

export default function Layout({ children }: { children: ReactNode }) {
  return <WorkspacePresentation>{children}</WorkspacePresentation>;
}
