"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SharePage } from "@/components/share-page";

/**
 * Share and delete controls for a resource. Share is for everyone and links to
 * this resource only. Delete is for the consultant: the resource is deleted
 * outright from every page and both program views.
 */
export function ResourceShare({ title, href, noun = "resource" }: { title: string; href?: string; noun?: string }) {
  return <div data-resource-share="true"><SharePage title={title} href={href} noun={noun} /></div>;
}

export function ResourceRemove({ contentItemId, title, compact = false }: { contentItemId: string; title: string; compact?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const remove = async () => {
    if (!window.confirm(`Delete "${title}"? It will be removed from every page in both the One DHS and One DSD views.`)) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/consultant/resources/${encodeURIComponent(contentItemId)}/delete`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "The resource could not be deleted.");
      if (compact) {
        router.refresh();
      } else {
        router.push("/learn");
        router.refresh();
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The resource could not be deleted.");
      setBusy(false);
    }
  };

  const buttonStyle = { border: "1px solid #b42318", color: "#fff", background: "#b42318", borderRadius: 8, fontWeight: 700, cursor: "pointer", lineHeight: 1.2 } as const;

  if (compact) {
    return (
      <span data-resource-remove="true" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <button
          type="button"
          onClick={() => void remove()}
          disabled={busy}
          aria-label={`Delete ${title}`}
          title="Delete this resource"
          style={{ ...buttonStyle, padding: "4px 10px", fontSize: 13 }}
        >{busy ? "Deleting…" : "Delete"}</button>
        {error ? <span role="alert" className="text-sm">{error}</span> : null}
      </span>
    );
  }

  return (
    <div className="mt-3" data-resource-remove="true">
      <button type="button" onClick={() => void remove()} disabled={busy} style={{ ...buttonStyle, padding: "10px 16px", fontSize: 15 }}>
        {busy ? "Deleting…" : "Delete this resource"}
      </button>
      {error ? <p role="alert" className="mt-2 text-sm">{error}</p> : null}
    </div>
  );
}
