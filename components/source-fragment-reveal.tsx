"use client";

import { useEffect } from "react";

/** Keep links to individual references useful when their group starts collapsed. */
export function SourceFragmentReveal() {
  useEffect(() => {
    const reveal = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      const group = target?.closest("details");
      if (group && !group.open) group.open = true;
      if (target && group) window.requestAnimationFrame(() => target.scrollIntoView());
    };
    reveal();
    window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, []);
  return null;
}
