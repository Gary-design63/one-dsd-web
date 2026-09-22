"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { ContextSwitcher } from "@/components/program-context";
import { SharePage } from "@/components/share-page";
import { EditableSurfaceEditor } from "@/components/editable-surface-editor";
import type { PreparedEditableSurface } from "@/components/editable-surface";
import type { EditableSurfaceLink, EditableSurfaceValues } from "@/lib/content/editable-surface-contract";

function textValue(values: EditableSurfaceValues, key: string): string {
  return typeof values[key] === "string" ? values[key] as string : "";
}
function linksValue(values: EditableSurfaceValues, key: string): EditableSurfaceLink[] {
  const value = values[key];
  return Array.isArray(value) && (value.length === 0 || (typeof value[0] === "object" && value[0] !== null && "href" in value[0]))
    ? value as EditableSurfaceLink[] : [];
}

export function SiteHeader({ headerSurface, contextSurface }: {
  headerSurface: PreparedEditableSurface;
  contextSurface: PreparedEditableSurface;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const primaryNavigation = linksValue(headerSurface.values, "primaryNavigation");
  const personalNavigation = linksValue(headerSurface.values, "personalNavigation");
  const isCurrent = (href: string) => href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/") ||
    (href === "/learn" && ["/library", "/resources", "/courses"].some(base => pathname === base || pathname.startsWith(base + "/")));

  return <header className="program-header" onKeyDown={event => {
    if (event.key === "Escape" && menuOpen) { setMenuOpen(false); menuButton.current?.focus(); }
  }}>
    {headerSurface.canEdit || contextSurface.canEdit ? <div className="wrap pt-3">
      {headerSurface.canEdit ? <EditableSurfaceEditor definition={headerSurface.definition} scope={headerSurface.scope} currentValues={headerSurface.values} inherited={headerSurface.published?.isInherited ?? false} /> : null}
      {contextSurface.canEdit ? <EditableSurfaceEditor definition={contextSurface.definition} scope={contextSurface.scope} currentValues={contextSurface.values} inherited={contextSurface.published?.isInherited ?? false} /> : null}
    </div> : null}
    <div className="program-brand-row wrap">
      <Link href="/" className="program-brand-link">
        <Image src="/images/dhs-logo.png" alt="Minnesota Department of Human Services" width={319} height={68} priority />
        {headerSurface.available ? <span className="program-wordmark">{textValue(headerSurface.values, "programName")}</span> : null}
      </Link>
      <div className="program-header-actions">
        <SharePage compact />
        {contextSurface.available ? <ContextSwitcher /> : null}
        {headerSurface.available ? <button ref={menuButton} type="button" className="program-menu-toggle" aria-expanded={menuOpen} aria-controls="program-primary-navigation" onClick={() => setMenuOpen(open => !open)}>{menuOpen ? "Close menu" : "Menu"}</button> : null}
      </div>
    </div>
    {headerSurface.available ? <nav id="program-primary-navigation" aria-label="Primary" className={menuOpen ? "program-navigation is-open" : "program-navigation"}>
      <ul className="wrap" onClick={event => { if ((event.target as HTMLElement).closest("a")) setMenuOpen(false); }}>
        {primaryNavigation.map(route => <li key={route.href}>
          <Link href={route.href} aria-current={isCurrent(route.href) ? "page" : undefined} className={isCurrent(route.href) ? "primary-nav-link primary-nav-link--current" : "primary-nav-link"}>{route.label}</Link>
        </li>)}
        {personalNavigation.map(route => <li className="program-personal-link" key={route.href}>
          <Link href={route.href} aria-current={isCurrent(route.href) ? "page" : undefined} className={isCurrent(route.href) ? "primary-nav-link primary-nav-link--current" : "primary-nav-link"}>{route.label}</Link>
        </li>)}
      </ul>
    </nav> : null}
  </header>;
}
