import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { ownerFromRequest } from "@/lib/auth/request";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { readBoundedJson } from "@/lib/http/request";
import { accessibilityReview, classify } from "@/lib/intelligence/orchestrator";
import { piiDetect } from "@/lib/intelligence/safety";

const Body = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("a11y"), text: z.string().max(20000), html: z.string().max(60000).optional() }),
  z.object({
    kind: z.literal("classify"),
    title: z.string().max(300),
    text: z.string().max(20000),
    declaredAuthority: z.enum(["official", "guidance", "practice_note", "learning", "community_brief", "partner_informed", "local", "under_review", "external_verify"]).optional(),
    owner: z.string().max(200).optional(),
    sourceUrl: z.string().max(500).optional(),
    reviewDate: z.string().max(10).optional(),
  }),
]);

export async function POST(request: NextRequest) {
  if (!(await ownerFromRequest(request))) return NextResponse.json({ error: "Sign in to the Consultant Workspace to continue." }, { status: 401 });
  if (!isSameOriginMutation(request)) {
    return NextResponse.json({ error: "Open this page from the program before starting a review." }, { status: 403, headers: { "cache-control": "no-store" } });
  }
  const body = await readBoundedJson(request, 98_304);
  if (!body.ok) return NextResponse.json({ error: body.message }, { status: body.status, headers: { "cache-control": "no-store" } });
  const parsed = Body.safeParse(body.value);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input." }, { status: 400, headers: { "cache-control": "no-store" } });
  const b = parsed.data;
  const gate = piiDetect(b.kind === "a11y" ? b.text : b.text);
  if (!gate.ok) return NextResponse.json({ error: gate.message }, { status: 422 });
  try {
    if (b.kind === "a11y") {
      const draft = await accessibilityReview({ text: b.text, html: b.html, artifactType: "document" }, "owner");
      return NextResponse.json(draft, { headers: { "cache-control": "no-store" } });
    }
    const draft = await classify({ title: b.title, text: b.text, declaredAuthority: b.declaredAuthority, owner: b.owner, sourceUrl: b.sourceUrl, reviewDate: b.reviewDate });
    return NextResponse.json(draft, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    console.error("consultant content review failed", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ error: "This review could not be completed right now. Try again in a few minutes." }, { status: 503, headers: { "cache-control": "no-store" } });
  }
}
