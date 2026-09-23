import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { ownerFromRequest } from "@/lib/auth/request";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { readBoundedJson } from "@/lib/http/request";
import { mediaAvailable, setResourceMediaScript } from "@/lib/content/media";

const NO_STORE = { headers: { "cache-control": "no-store" } };

const Schema = z.object({
  id: z.string().uuid(),
  script: z.array(z.object({
    start: z.number().min(0),
    end: z.number().min(0),
    text: z.string().min(1).max(2000),
    p: z.number().int().min(0).optional(),
  })).max(5000).nullable(),
});

/** Consultant action: attach a timed script to a recording on a resource. */
export async function POST(request: NextRequest) {
  if (!(await ownerFromRequest(request))) {
    return NextResponse.json({ error: "Sign in to the Consultant Workspace to change a script." }, { status: 401, ...NO_STORE });
  }
  if (!isSameOriginMutation(request)) {
    return NextResponse.json({ error: "Open the page before making changes." }, { status: 403, ...NO_STORE });
  }
  if (!mediaAvailable()) {
    return NextResponse.json({ error: "Media is not connected to a database." }, { status: 503, ...NO_STORE });
  }
  const body = await readBoundedJson(request, 2_000_000);
  if (!body.ok) return NextResponse.json({ error: body.message }, { status: body.status, ...NO_STORE });
  const parsed = Schema.safeParse(body.value);
  if (!parsed.success) return NextResponse.json({ error: "Check the script and try again." }, { status: 400, ...NO_STORE });
  try {
    const ok = await setResourceMediaScript(parsed.data.id, parsed.data.script);
    if (!ok) return NextResponse.json({ error: "This recording was not found." }, { status: 404, ...NO_STORE });
    return NextResponse.json({ ok: true }, NO_STORE);
  } catch (error) {
    console.error("Script save failed.", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "The script could not be saved." }, { status: 500, ...NO_STORE });
  }
}
