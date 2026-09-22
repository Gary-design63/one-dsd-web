import { NextResponse, type NextRequest } from "next/server";
import { isMediaId, mediaAvailable, readMediaFile } from "@/lib/content/media";

/** Serves an uploaded file. Addresses are unique, so the file can be cached for a long time. */
export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!isMediaId(id) || !mediaAvailable()) {
    return NextResponse.json({ error: "File not found." }, { status: 404, headers: { "cache-control": "no-store" } });
  }
  try {
    const file = await readMediaFile(id);
    if (!file) return NextResponse.json({ error: "File not found." }, { status: 404, headers: { "cache-control": "no-store" } });
    const inline = /^(image\/|video\/|audio\/|application\/pdf|text\/plain)/.test(file.mimeType);
    const safeName = file.fileName.replace(/[^\w.\- ]+/g, "_");
    return new Response(new Uint8Array(file.content), {
      status: 200,
      headers: {
        "content-type": file.mimeType,
        "content-length": String(file.content.byteLength),
        "content-disposition": `${inline ? "inline" : "attachment"}; filename="${safeName}"`,
        "cache-control": "public, max-age=31536000, immutable",
        "x-content-type-options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Media read failed.", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "The file could not be opened." }, { status: 500, headers: { "cache-control": "no-store" } });
  }
}
