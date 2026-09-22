"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Kind = "audio" | "image" | "video" | "document";

/**
 * Consultant controls for a resource's media. With `deleteId` it renders a
 * Delete button for one item; otherwise it renders the add form.
 */
export function ResourceMediaManager({ contentItemId, deleteId, deleteTitle }: { contentItemId: string; deleteId?: string; deleteTitle?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [kind, setKind] = useState<Kind>("image");
  const [videoSource, setVideoSource] = useState<"link" | "file">("link");
  const endpoint = `/api/consultant/resources/${encodeURIComponent(contentItemId)}/media`;

  const remove = async () => {
    if (!deleteId) return;
    if (!window.confirm(`Delete "${deleteTitle ?? "this item"}" from this resource?`)) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(endpoint, { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: deleteId }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "The item could not be deleted.");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The item could not be deleted.");
    } finally {
      setBusy(false);
    }
  };

  if (deleteId) {
    return (
      <div className="mt-2">
        <button type="button" onClick={() => void remove()} disabled={busy} style={{ border: "1px solid #b42318", color: "#fff", background: "#b42318", borderRadius: 8, fontWeight: 700, cursor: "pointer", padding: "4px 10px", fontSize: 13 }}>
          {busy ? "Deleting…" : "Delete"}
        </button>
        {error ? <p role="alert" className="mt-1 text-sm">{error}</p> : null}
      </div>
    );
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    form.set("kind", kind);
    const file = form.get("file");
    const link = String(form.get("url") ?? "").trim();
    if (kind === "video" && videoSource === "link") {
      form.delete("file");
      if (!link) { setError("Paste the link to the video."); return; }
    } else {
      form.delete("url");
      if (!(file instanceof File) || file.size === 0) { setError("Choose a file."); return; }
      if (file.size > 4 * 1024 * 1024) { setError("Files can be up to 4 MB. For a larger video, paste a link to it instead."); return; }
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch(endpoint, { method: "POST", body: form });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "The item could not be added.");
      (event.target as HTMLFormElement).reset();
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The item could not be added.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card mt-6" onSubmit={(event) => void submit(event)} data-resource-media-add="true" aria-labelledby={`media-add-heading-${contentItemId}`}>
      <h3 className="m-0 text-lg font-extrabold" id={`media-add-heading-${contentItemId}`}>Add audio, an image, a video, or a document</h3>
      <div className="field mt-3">
        <label htmlFor={`media-kind-${contentItemId}`}>What are you adding?</label>
        <select id={`media-kind-${contentItemId}`} name="kind" value={kind} onChange={(event) => setKind(event.target.value as Kind)}>
          <option value="audio">Audio: read-aloud in your voice</option>
          <option value="image">Image or infographic</option>
          <option value="video">Video</option>
          <option value="document">Document (PDF, Word, PowerPoint, Excel)</option>
        </select>
      </div>
      {kind === "video" ? (
        <div className="field">
          <span>Where is the video?</span>
          <label><input type="radio" name="videoSource" checked={videoSource === "link"} onChange={() => setVideoSource("link")} /> A link (YouTube, Vimeo, SharePoint, or another site)</label>
          <label><input type="radio" name="videoSource" checked={videoSource === "file"} onChange={() => setVideoSource("file")} /> A file on this computer (up to 4 MB)</label>
        </div>
      ) : null}
      {kind === "video" && videoSource === "link" ? (
        <div className="field">
          <label htmlFor={`media-url-${contentItemId}`}>Video link</label>
          <input id={`media-url-${contentItemId}`} name="url" type="url" placeholder="https://" />
        </div>
      ) : (
        <div className="field">
          <label htmlFor={`media-file-${contentItemId}`}>File (up to 4 MB)</label>
          <input id={`media-file-${contentItemId}`} name="file" type="file" accept={kind === "audio" ? "audio/*,.m4a,.mp3,.wav" : kind === "image" ? "image/*" : kind === "video" ? "video/*" : ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,application/pdf"} />
        </div>
      )}
      <div className="field">
        <label htmlFor={`media-title-${contentItemId}`}>Caption or title (optional)</label>
        <input id={`media-title-${contentItemId}`} name="title" type="text" maxLength={300} />
      </div>
      {kind === "image" ? (
        <div className="field">
          <label htmlFor={`media-alt-${contentItemId}`}>Describe the image for people using screen readers</label>
          <input id={`media-alt-${contentItemId}`} name="alt" type="text" maxLength={2000} />
        </div>
      ) : null}
      <button type="submit" className="btn btn--primary" disabled={busy}>{busy ? "Adding…" : "Add to this resource"}</button>
      {error ? <p role="alert" className="mt-2 text-sm">{error}</p> : null}
    </form>
  );
}
