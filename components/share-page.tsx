"use client";

import { useState } from "react";
import { PRODUCT_CONTEXT_COOKIE, resolveProductContext, type ProductContextId } from "@/lib/product/federation";
import { currentShareLocation, shareLink } from "@/lib/product/share-link";

type SharePageProps = {
  /** Subject line and heading for the shared item; defaults to the document title. */
  title?: string;
  /** Local path to share instead of the current page, for example a podcast anchor. */
  href?: string;
  /** What the control calls the thing being shared. */
  noun?: string;
  compact?: boolean;
};

/** The program view in effect for this visitor: an explicit view in the address wins, then the saved preference. */
function currentContext(): ProductContextId {
  try {
    const fromAddress = new URLSearchParams(window.location.search).get("view");
    if (fromAddress) {
      const normalized = fromAddress.trim().toLowerCase().replace(/-/g, "_");
      if (normalized === "one_dsd" || normalized === "dsd") return "one_dsd";
      if (normalized === "one_dhs" || normalized === "dhs") return "one_dhs";
    }
    const cookie = document.cookie.split(";").map(part => part.trim()).find(part => part.startsWith(`${PRODUCT_CONTEXT_COOKIE}=`));
    return resolveProductContext(cookie?.slice(PRODUCT_CONTEXT_COOKIE.length + 1));
  } catch {
    return resolveProductContext(undefined);
  }
}

/**
 * Copies a link that opens exactly this page or resource, in the same program
 * view, with nothing personal attached. Available to everyone.
 */
export function SharePage({ title, href, noun = "page", compact = false }: SharePageProps) {
  const [message, setMessage] = useState("");

  const link = () => {
    const current = currentShareLocation();
    const target = href ? new URL(href, current.origin) : null;
    const location = target ? { origin: current.origin, pathname: target.pathname, search: target.search, hash: target.hash } : current;
    return shareLink(location, currentContext());
  };
  const subject = () => title ?? document.title;

  const copy = async () => {
    const value = link();
    try {
      await navigator.clipboard.writeText(value);
      setMessage(`Link copied. It opens this ${noun} only.`);
    } catch {
      setMessage(value);
    }
  };
  const email = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(subject())}&body=${encodeURIComponent(`I thought you might find this useful:\n\n${subject()}\n${link()}`)}`;
  };

  const buttonClass = compact ? "btn btn--light !min-h-0 !px-3 !py-1 !text-xs" : "btn";
  return (
    <div className={compact ? "inline-flex flex-wrap items-center gap-2" : "mt-4 flex flex-wrap items-center gap-3"} data-share-page="true">
      <button type="button" className={buttonClass} onClick={() => void copy()}>{compact ? "Share" : `Share this ${noun}`}</button>
      {compact ? null : <button type="button" className="btn btn--light" onClick={email}>Share by email</button>}
      {message ? <span role="status" className="text-sm break-all">{message}</span> : null}
    </div>
  );
}
