import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ownerFromRequest } from "@/lib/auth/request";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { readBoundedJson } from "@/lib/http/request";
import { deleteAskResponseRecords, listAskResponseRecords, validateAskRecordCursor } from "@/lib/intelligence/observability/ask-records";

const NO_STORE = { headers: { "cache-control": "no-store" } };
const Query = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional(),
  before: z.string().max(300).refine(validateAskRecordCursor).optional(),
});
export async function GET(request: NextRequest) {
  if (!(await ownerFromRequest(request))) return NextResponse.json({ error: "Sign in to the Consultant Workspace to continue." }, { status: 401, ...NO_STORE });
  const parsed = Query.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return NextResponse.json({ error: "The record page request is invalid." }, { status: 400, ...NO_STORE });
  try {
    return NextResponse.json(await listAskResponseRecords(parsed.data), NO_STORE);
  } catch {
    return NextResponse.json({ error: "ASK response records are unavailable. No empty result has been substituted." }, { status: 503, ...NO_STORE });
  }
}
export async function DELETE(request: NextRequest) {
  if (!(await ownerFromRequest(request))) return NextResponse.json({ error: "Sign in to the Consultant Workspace to continue." }, { status: 401, ...NO_STORE });
  if (!isSameOriginMutation(request)) return NextResponse.json({ error: "Open the owner workspace before deleting records." }, { status: 403, ...NO_STORE });
  const body = await readBoundedJson(request, 8192);
  if (!body.ok) return NextResponse.json({ error: body.message }, { status: body.status, ...NO_STORE });
  const parsed = z.object({ ids: z.array(z.string().uuid()).min(1).max(100) }).strict().safeParse(body.value);
  if (!parsed.success) return NextResponse.json({ error: "Select valid ASK response records to delete." }, { status: 400, ...NO_STORE });
  try {
    return NextResponse.json({ deleted: await deleteAskResponseRecords(parsed.data.ids) }, NO_STORE);
  } catch {
    return NextResponse.json({ error: "The selected ASK response records could not be deleted." }, { status: 503, ...NO_STORE });
  }
}
