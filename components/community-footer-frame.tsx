"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Only the local community design changes; the rest of the app keeps its footer. */
export function CommunityFooterFrame({ children, editing }: { children: ReactNode; editing?: ReactNode }) {
  const pathname = usePathname();
  if (!pathname.startsWith("/minnesota-communities")) return children;
  return <footer className="community-editorial-footer">
    <p>One DHS People, Access and Culture</p>
    <nav aria-label="More support"><Link href="/learn">Learning and resources</Link><Link href="/support">Support</Link><Link href="/about">About the program</Link></nav>
    {editing ? <details><summary>Page editing</summary>{editing}</details> : null}
  </footer>;
}
