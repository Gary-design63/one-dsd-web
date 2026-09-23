import { NextResponse, type NextRequest } from "next/server";
import { ownerFromRequest } from "@/lib/auth/request";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { MEDIA_MAX_BYTES, mediaAvailable, saveMediaFile } from "@/lib/content/media";

const NO_STORE = { headers: { "cache-control": "no-store" } };

const ALLOWED = /^(image\/(png|jpeg|gif|webp|svg\+xml|avif)|video\/(mp4|webm|quicktime)|audio\/(mpeg|mp4|wav|webm)|application\/pdf|application\/vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|presentationml\.presentation|spreadsheetml\.sheet)|application\/msword|application\/vnd\.ms-powerpoint|application\/vnd\.ms-excel|text\/plain)$/;

/** Consultant upload. Accepts one file and returns the address it can be shown from. */
export async function POST(request: NextRequest) {
  if (!(await ownerFromRequest(request))) {
    return NextResponse.json({ error: "Sign in to the Consultant Workspace to upload files." }, { status: 401, ...NO_STORE });
  }
  if (!isSameOriginMutation(request)) {
    return NextResponse.json({ error: "Open the page before uploading." }, { status: 403, ...NO_STORE });
  }
  if (!mediaAvailable()) {
    return NextResponse.json({ error: "Uploads are not connected to a database." }, { status: 503, ...NO_STORE });
  }
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Choose a file to upload." }, { status: 400, ...NO_STORE });
  }
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose a file to upload." }, { status: 400, ...NO_STORE });
  }
  if (file.size > MEDIA_MAX_BYTES) {
    return NextResponse.json({ error: "Files can be up to 4 MB. For a larger video, paste a link to it instead." }, { status: 413, ...NO_STORE });
  }
  const mimeType = (file.type || "application/octet-stream").toLowerCase();
  if (!ALLOWED.test(mimeType)) {
    return NextResponse.json({ error: "Use an image, video, audio, PDF, Word, PowerPoint, Excel, or text file." }, { status: 415, ...NO_STORE });
  }
  const alt = typeof form.get("alt") === "string" ? String(form.get("alt")).slice(0, 2000) : "";
  try {
    const content = Buffer.from(await file.arrayBuffer());
    const id = await saveMediaFile(file.name.slice(0, 300) || "file", mimeType, content, alt);
    return NextResponse.json({ ok: true, id, url: `/api/media/${id}`, mimeType, fileName: file.name }, NO_STORE);
  } catch (error) {
    console.error("Media upload failed.", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "The file could not be saved." }, { status: 500, ...NO_STORE });
  }
}
