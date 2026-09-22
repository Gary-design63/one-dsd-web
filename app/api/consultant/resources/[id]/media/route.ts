import { NextResponse, type NextRequest } from "next/server";
import { ownerFromRequest } from "@/lib/auth/request";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { readBoundedJson } from "@/lib/http/request";
import { addResourceMedia, deleteResourceMedia, MEDIA_MAX_BYTES, mediaAvailable, saveMediaFile } from "@/lib/content/media";

const NO_STORE = { headers: { "cache-control": "no-store" } };
const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,199}$/;

async function guard(request: NextRequest) {
  if (!(await ownerFromRequest(request))) {
    return NextResponse.json({ error: "Sign in to the Consultant Workspace to change resource media." }, { status: 401, ...NO_STORE });
  }
  if (!isSameOriginMutation(request)) {
    return NextResponse.json({ error: "Open the page before making changes." }, { status: 403, ...NO_STORE });
  }
  if (!mediaAvailable()) {
    return NextResponse.json({ error: "Media is not connected to a database." }, { status: 503, ...NO_STORE });
  }
  return null;
}

/** Add an image, video (file or link), or document to a resource. */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const denied = await guard(request);
  if (denied) return denied;
  const { id } = await context.params;
  if (!ID.test(id)) return NextResponse.json({ error: "Unknown resource." }, { status: 400, ...NO_STORE });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Choose a file or paste a link." }, { status: 400, ...NO_STORE });
  }
  const kindValue = String(form.get("kind") ?? "image");
  const kind = kindValue === "video" || kindValue === "document" || kindValue === "audio" ? kindValue : "image";
  const title = String(form.get("title") ?? "").trim().slice(0, 300);
  const alt = String(form.get("alt") ?? "").trim().slice(0, 2000);
  const link = String(form.get("url") ?? "").trim();
  const file = form.get("file");

  try {
    let mediaId: string | null = null;
    let externalUrl: string | null = null;
    if (file instanceof File && file.size > 0) {
      if (file.size > MEDIA_MAX_BYTES) {
        return NextResponse.json({ error: "Files can be up to 4 MB. For a larger video, paste a link to it instead." }, { status: 413, ...NO_STORE });
      }
      const mimeType = (file.type || "application/octet-stream").toLowerCase();
      if (kind === "image" && !mimeType.startsWith("image/")) {
        return NextResponse.json({ error: "Choose an image file." }, { status: 415, ...NO_STORE });
      }
      if (kind === "audio" && !mimeType.startsWith("audio/") && mimeType !== "video/mp4") {
        return NextResponse.json({ error: "Choose an audio file (MP3, M4A, or WAV)." }, { status: 415, ...NO_STORE });
      }
      mediaId = await saveMediaFile(file.name.slice(0, 300) || "file", mimeType, Buffer.from(await file.arrayBuffer()), alt);
    } else if (link) {
      if (!/^https:\/\/[^\s]{3,2000}$/.test(link)) {
        return NextResponse.json({ error: "Use a secure web address that starts with https://." }, { status: 400, ...NO_STORE });
      }
      externalUrl = link;
    } else {
      return NextResponse.json({ error: "Choose a file or paste a link." }, { status: 400, ...NO_STORE });
    }
    const resourceMediaId = await addResourceMedia({ contentItemId: id, kind, mediaId, externalUrl, title, alt });
    return NextResponse.json({ ok: true, id: resourceMediaId }, NO_STORE);
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String((error as { code: unknown }).code) : "";
    if (code === "P0002") return NextResponse.json({ error: "This resource is not in the database." }, { status: 404, ...NO_STORE });
    console.error("Resource media add failed.", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "The item could not be added." }, { status: 500, ...NO_STORE });
  }
}

/** Delete one media item from a resource. */
export async function DELETE(request: NextRequest) {
  const denied = await guard(request);
  if (denied) return denied;
  const body = await readBoundedJson(request, 10_000);
  if (!body.ok) return NextResponse.json({ error: body.message }, { status: body.status, ...NO_STORE });
  const value = body.value as { id?: unknown };
  const id = typeof value?.id === "string" ? value.id : "";
  try {
    const removed = await deleteResourceMedia(id);
    if (!removed) return NextResponse.json({ error: "This item was not found." }, { status: 404, ...NO_STORE });
    return NextResponse.json({ ok: true }, NO_STORE);
  } catch (error) {
    console.error("Resource media delete failed.", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "The item could not be deleted." }, { status: 500, ...NO_STORE });
  }
}
