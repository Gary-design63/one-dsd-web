import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { ownerFromRequest } from "@/lib/auth/request";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { readBoundedJson } from "@/lib/http/request";
import { contentScopeForContext } from "@/lib/product/request-context";
import { PRODUCT_CONTEXT_COOKIE, resolveProductContext } from "@/lib/product/federation";
import { normalizePageRoute, pageTextEditingAvailable, readPageTextOverrides, readPageTextHistory, restorePageTextRoute, savePageTextOverrides } from "@/lib/content/page-text";
import { readPageImageOverrides, savePageImageOverrides } from "@/lib/content/media";

const NO_STORE = { headers: { "cache-control": "no-store" } };

let warnedNotConfigured = false;

const SaveSchema = z.object({
  route: z.string(),
  entries: z.array(z.object({
    key: z.string().min(1).max(200),
    original: z.string().max(20_000),
    text: z.string().max(20_000),
  })).max(2000),
  images: z.array(z.object({
    key: z.string().min(1).max(2000),
    mediaId: z.string().uuid(),
    alt: z.string().max(2000).default(""),
  })).max(500).optional(),
});

function scopeFor(request: NextRequest) {
  return contentScopeForContext(resolveProductContext(request.cookies.get(PRODUCT_CONTEXT_COOKIE)?.value));
}

/**
 * Saved wording and image replacements for one page in the current view.
 * When the store cannot be read the response is still 200 but carries degraded:true and no
 * entries, so the page shows its original wording and the editor can say so. The cause is logged.
 */
export async function GET(request: NextRequest) {
  const route = normalizePageRoute(request.nextUrl.searchParams.get("route"));
  if (!route) return NextResponse.json({ error: "Unknown page." }, { status: 400, ...NO_STORE });
  if (request.nextUrl.searchParams.get("history") === "true") {
    if (!(await ownerFromRequest(request))) {
      return NextResponse.json({ error: "Sign in to the Consultant Workspace to see earlier wording." }, { status: 401, ...NO_STORE });
    }
    if (!pageTextEditingAvailable()) return NextResponse.json({ ok: true, history: [] }, NO_STORE);
    try {
      const history = await readPageTextHistory(scopeFor(request), route);
      return NextResponse.json({ ok: true, history }, NO_STORE);
    } catch (error) {
      console.error("Page text history read failed.", error instanceof Error ? error.message : error);
      return NextResponse.json({ error: "Earlier wording could not be loaded." }, { status: 500, ...NO_STORE });
    }
  }
  if (!pageTextEditingAvailable()) {
    if (!warnedNotConfigured) {
      warnedNotConfigured = true;
      console.error("Page text store unavailable: PAC_RUNTIME_DATABASE_URL is not set; saved page changes cannot be read.");
    }
    return NextResponse.json({ ok: true, entries: [], images: [], degraded: true, reason: "not-configured" }, NO_STORE);
  }
  try {
    const scope = scopeFor(request);
    const [entries, images] = await Promise.all([readPageTextOverrides(scope, route), readPageImageOverrides(scope, route)]);
    // Blank replacements are never applied (a stored blank would erase the element for every reader).
    return NextResponse.json({ ok: true, entries: entries.filter((entry) => entry.text.trim().length > 0), images }, NO_STORE);
  } catch (error) {
    console.error("Page text store read failed; returning degraded response.", error instanceof Error ? `${error.name}: ${error.message}` : error);
    return NextResponse.json({ ok: true, entries: [], images: [], degraded: true, reason: "store-unavailable" }, NO_STORE);
  }
}

export async function POST(request: NextRequest) {
  if (!(await ownerFromRequest(request))) {
    return NextResponse.json({ error: "Sign in to the Consultant Workspace to save page changes." }, { status: 401, ...NO_STORE });
  }
  if (!isSameOriginMutation(request)) {
    return NextResponse.json({ error: "Open the page before saving changes." }, { status: 403, ...NO_STORE });
  }
  if (!pageTextEditingAvailable()) {
    return NextResponse.json({ error: "Page editing is not connected to a database." }, { status: 503, ...NO_STORE });
  }
  const body = await readBoundedJson(request, 4_000_000);
  if (!body.ok) return NextResponse.json({ error: body.message }, { status: body.status, ...NO_STORE });
  const parsed = SaveSchema.safeParse(body.value);
  const route = parsed.success ? normalizePageRoute(parsed.data.route) : null;
  if (!parsed.success || !route) {
    return NextResponse.json({ error: "Check the change and try again." }, { status: 400, ...NO_STORE });
  }
  if (parsed.data.entries.some((entry) => entry.text.trim().length === 0)) {
    return NextResponse.json({ error: "Replacement wording cannot be empty. Put the original wording back instead of leaving it blank." }, { status: 400, ...NO_STORE });
  }
  try {
    const scope = scopeFor(request);
    const saved = await savePageTextOverrides(scope, route, parsed.data.entries);
    const savedImages = parsed.data.images ? await savePageImageOverrides(scope, route, parsed.data.images) : undefined;
    return NextResponse.json({ ok: true, saved, savedImages }, NO_STORE);
  } catch (error) {
    console.error("Page change save failed.", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "The change could not be saved." }, { status: 500, ...NO_STORE });
  }
}

const RestoreSchema = z.object({ route: z.string() });

/** Brings back the most recent archived wording for this route. A save never destroys what it
 * replaces — this is the visible, owner-facing way to reach for that history when a save was a
 * mistake, matching the restore path the structured surface editor already offers. */
export async function PUT(request: NextRequest) {
  if (!(await ownerFromRequest(request))) {
    return NextResponse.json({ error: "Sign in to the Consultant Workspace to restore earlier wording." }, { status: 401, ...NO_STORE });
  }
  if (!isSameOriginMutation(request)) {
    return NextResponse.json({ error: "Open the page before restoring earlier wording." }, { status: 403, ...NO_STORE });
  }
  if (!pageTextEditingAvailable()) {
    return NextResponse.json({ error: "Page editing is not connected to a database." }, { status: 503, ...NO_STORE });
  }
  const body = await readBoundedJson(request, 10_000);
  if (!body.ok) return NextResponse.json({ error: body.message }, { status: body.status, ...NO_STORE });
  const parsed = RestoreSchema.safeParse(body.value);
  const route = parsed.success ? normalizePageRoute(parsed.data.route) : null;
  if (!parsed.success || !route) {
    return NextResponse.json({ error: "Check the page and try again." }, { status: 400, ...NO_STORE });
  }
  try {
    const restored = await restorePageTextRoute(scopeFor(request), route);
    return NextResponse.json({ ok: true, restored }, NO_STORE);
  } catch (error) {
    console.error("Page text restore failed.", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Earlier wording could not be restored." }, { status: 500, ...NO_STORE });
  }
}
