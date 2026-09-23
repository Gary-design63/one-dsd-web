import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { ownerFromRequest } from "@/lib/auth/request";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { readBoundedJson } from "@/lib/http/request";
import { createResourceOutright, mediaAvailable } from "@/lib/content/media";
import { staffReleaseValidationIssues } from "@/lib/content/resource-release-contract";
import { EDITABLE_AUTHORITIES, EDITABLE_CONTENT_TYPES, EDITABLE_INTENTS, EDITABLE_LAYERS } from "@/lib/content/resource-editor-contract";

const NO_STORE = { headers: { "cache-control": "no-store" } };

const NewResourceSchema = z.object({
  title: z.string().trim().min(1).max(300),
  summary: z.string().trim().min(1).max(2000),
  body: z.string().trim().min(1).max(100_000),
  whyItMatters: z.string().trim().max(3000).optional().default(""),
  type: z.enum(EDITABLE_CONTENT_TYPES),
  authority: z.enum(EDITABLE_AUTHORITIES).default("guidance"),
  layer: z.enum(EDITABLE_LAYERS).default("L2"),
  intent: z.enum(EDITABLE_INTENTS).default("practice_method"),
  view: z.enum(["agencywide", "dsd"]),
  href: z.string().trim().max(2000).optional().default(""),
  sourceName: z.string().trim().max(300).optional().default(""),
  tags: z.string().trim().max(2000).optional().default(""),
  owner: z.string().trim().max(200).optional().default(""),
  reviewDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

function slug(title: string): string {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "resource";
  return `${base}-${randomBytes(2).toString("hex")}`;
}

/** Create and publish a new resource written by the consultant. */
export async function POST(request: NextRequest) {
  if (!(await ownerFromRequest(request))) {
    return NextResponse.json({ error: "Sign in to the Consultant Workspace to add a resource." }, { status: 401, ...NO_STORE });
  }
  if (!isSameOriginMutation(request)) {
    return NextResponse.json({ error: "Open the page before adding a resource." }, { status: 403, ...NO_STORE });
  }
  if (!mediaAvailable()) {
    return NextResponse.json({ error: "Adding resources is not connected to a database." }, { status: 503, ...NO_STORE });
  }
  const body = await readBoundedJson(request, 400_000);
  if (!body.ok) return NextResponse.json({ error: body.message }, { status: body.status, ...NO_STORE });
  const parsed = NewResourceSchema.safeParse(body.value);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ error: `Check the ${first?.path.join(".") || "form"}: ${first?.message ?? "invalid value"}.` }, { status: 400, ...NO_STORE });
  }
  const input = parsed.data;
  const paragraphs = input.body.split(/\n\s*\n/).map((part) => part.replace(/\s+/g, " ").trim()).filter(Boolean);
  const tags = input.tags.split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 50);
  const link = input.href && /^(https:\/\/|\/)/.test(input.href) ? input.href : "";

  const payload: Record<string, unknown> = {
    id: slug(input.title),
    title: input.title,
    type: input.type,
    authority: input.authority,
    layer: input.layer,
    summary: input.summary,
    body: paragraphs,
    nextActions: link ? [{ label: input.sourceName ? `Open ${input.sourceName}` : "Open the source", href: link }] : [],
    tags,
    intents: [input.intent],
    pathIds: [],
    owner: input.owner || "Equity and Inclusion Operations Consultant",
    reviewDate: input.reviewDate,
    status: "approved",
    scope: input.view,
    accessibility: "reviewed",
    version: "1",
  };
  if (input.whyItMatters) payload.whyItMatters = input.whyItMatters;
  if (link) payload.href = link;
  if (input.sourceName) payload.sourceName = input.sourceName;

  const issues = staffReleaseValidationIssues(payload as never);
  if (issues.length > 0) {
    return NextResponse.json({ error: `${issues[0]} Use plain text without formatting symbols.` }, { status: 422, ...NO_STORE });
  }

  try {
    const created = await createResourceOutright(input.view === "dsd" ? "dsd" : "one-dhs", payload);
    return NextResponse.json({ ok: true, id: created.contentItemId, href: `/resources/${encodeURIComponent(created.contentItemId)}` }, NO_STORE);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error("Resource create failed.", detail);
    return NextResponse.json({ error: `The resource could not be added. ${detail}` }, { status: 500, ...NO_STORE });
  }
}
