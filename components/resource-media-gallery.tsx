import { listResourceMedia, mediaAvailable, videoEmbedUrl, type ResourceMediaItem } from "@/lib/content/media";
import { ResourceMediaManager } from "@/components/resource-media-manager";
import { SyncedAudio } from "@/components/synced-audio";

/**
 * Images, infographics, video, and documents attached to a resource. Shown to
 * everyone. The consultant also sees controls to add and delete items.
 */
export async function ResourceMediaGallery({ contentItemId, owner }: { contentItemId: string; owner: boolean }) {
  let items: ResourceMediaItem[] = [];
  // "Not connected" (no database configured) and "failed" (the read threw) are
  // both surfaced on the page so attached audio and files never vanish silently.
  let unavailable: "not-connected" | "failed" | null = mediaAvailable() ? null : "not-connected";
  if (!unavailable) {
    try {
      items = await listResourceMedia(contentItemId);
    } catch (error) {
      unavailable = "failed";
      console.error("Resource media could not be read.", error instanceof Error ? error.message : error);
    }
  }
  if (items.length === 0 && !owner && !unavailable) return null;
  const audio = items.filter((item) => item.kind === "audio");
  const visual = items.filter((item) => item.kind !== "audio");
  const showVisualHeading = visual.length > 0 || owner;
  const headingId = `resource-media-${contentItemId}`;
  const noticeId = `resource-media-notice-${contentItemId}`;

  return (
    <section className="mt-6" aria-labelledby={showVisualHeading ? headingId : unavailable ? noticeId : `resource-listen-${contentItemId}`} data-resource-media="true">
      {unavailable ? (
        <p id={noticeId} className="notice notice--warn" role="status" data-resource-media-unavailable={unavailable}>
          {unavailable === "failed"
            ? "Attached files could not be loaded right now. Audio, images, and documents for this resource will return when the connection recovers."
            : "Attached files are not connected in this environment. Audio, images, and documents for this resource are not shown."}
        </p>
      ) : null}
      {audio.length > 0 ? (
        <div className="card" data-resource-listen="true">
          <h2 id={`resource-listen-${contentItemId}`} className="m-0 text-xl font-extrabold">Listen to this resource</h2>
          {audio.map((item) => (
            <figure key={item.id} className="m-0 mt-3">
              {item.script && item.script.length > 0
                ? <SyncedAudio src={item.mediaId ? `/api/media/${item.mediaId}` : item.externalUrl ?? ""} title={item.title || "Read aloud"} script={item.script} />
                : <audio controls preload="metadata" src={item.mediaId ? `/api/media/${item.mediaId}` : item.externalUrl ?? undefined} style={{ width: "100%" }} aria-label={item.title || "Read aloud"} />}
              {item.title ? <figcaption className="mt-1 text-sm">{item.title}</figcaption> : null}
              {owner ? <ResourceMediaManager contentItemId={contentItemId} deleteId={item.id} deleteTitle={item.title || item.fileName || "audio"} /> : null}
            </figure>
          ))}
        </div>
      ) : null}
      {showVisualHeading ? <h2 id={headingId} className="mt-6 text-xl font-extrabold">Images, video, and documents</h2> : null}
      <div className="mt-4 grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        {visual.map((item) => (
          <figure key={item.id} className="m-0" style={{ position: "relative" }}>
            <MediaBody item={item} />
            {item.title ? <figcaption className="mt-2 text-sm">{item.title}</figcaption> : null}
            {owner ? <ResourceMediaManager contentItemId={contentItemId} deleteId={item.id} deleteTitle={item.title || item.fileName || item.kind} /> : null}
          </figure>
        ))}
      </div>
      {owner ? <ResourceMediaManager contentItemId={contentItemId} /> : null}
    </section>
  );
}

function MediaBody({ item }: { item: ResourceMediaItem }) {
  const fileUrl = item.mediaId ? `/api/media/${item.mediaId}` : null;
  if (item.kind === "image" && fileUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={fileUrl} alt={item.alt || item.title} style={{ width: "100%", height: "auto", borderRadius: 12 }} />;
  }
  if (item.kind === "video") {
    const embed = item.externalUrl ? videoEmbedUrl(item.externalUrl) : null;
    if (embed) {
      return (
        <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: 12, overflow: "hidden", background: "#000" }}>
          <iframe src={embed} title={item.title || "Video"} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
        </div>
      );
    }
    if (fileUrl) return <video controls preload="metadata" src={fileUrl} style={{ width: "100%", borderRadius: 12, background: "#000" }} aria-label={item.title || "Video"} />;
    if (item.externalUrl) return <a href={item.externalUrl} target="_blank" rel="noreferrer">Watch: {item.title || item.externalUrl}</a>;
  }
  if (item.kind === "document") {
    const href = fileUrl ?? item.externalUrl ?? "#";
    return <a className="btn" href={href} target="_blank" rel="noreferrer">Open {item.title || item.fileName || "document"}</a>;
  }
  if (fileUrl) return <a href={fileUrl} target="_blank" rel="noreferrer">Open {item.title || item.fileName || "file"}</a>;
  return null;
}
