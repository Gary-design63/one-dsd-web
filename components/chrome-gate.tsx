"use client";

import { usePathname } from "next/navigation";

/**
 * A shared link (e.g. /share/equity-toolkit) opens a single toolkit on its own,
 * with none of the surrounding program chrome or navigation into other areas.
 *
 * Pass `hideOnPrefixes` to hide children on matching routes (the usual case, for
 * the header, footer, and owner editor). Pass `onlyOnPrefixes` instead to show
 * children only on matching routes, such as a compact notice meant for shared
 * pages alone.
 */
export function ChromeGate({
  hideOnPrefixes,
  onlyOnPrefixes,
  children,
}: {
  hideOnPrefixes?: string[];
  onlyOnPrefixes?: string[];
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  if (hideOnPrefixes?.some((prefix) => pathname.startsWith(prefix))) return null;
  if (onlyOnPrefixes && !onlyOnPrefixes.some((prefix) => pathname.startsWith(prefix))) return null;
  return <>{children}</>;
}
