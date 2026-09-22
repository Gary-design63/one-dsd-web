import { NextResponse, type NextRequest } from "next/server";
import { ownerFromRequest } from "@/lib/auth/request";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { readBoundedJson } from "@/lib/http/request";
import { contentScopeForContext } from "@/lib/product/request-context";
import { PRODUCT_CONTEXT_COOKIE, resolveProductContext } from "@/lib/product/federation";
import type { StaffProgramScope } from "@/lib/content/staff-publications";
import { lintStaffCopy } from "@/lib/brand/lint";
import { ResourceDraftRequestSchema, type ResourceDraftRequest } from "@/lib/content/resource-editor-contract";
import {
  ResourceDraftConflictError,
  ResourceDraftNotFoundError,
  ResourceDraftValidationError,
  saveResourceDraft,
} from "@/lib/content/resource-drafts";

type SaveResourceDraft = (
  id: string,
  input: ResourceDraftRequest,
  options: { scope: StaffProgramScope },
) => ReturnType<typeof saveResourceDraft>;

function textForStaffVoiceReview(input: ResourceDraftRequest): string {
  const { fields } = input;
  return [
    fields.title,
    fields.summary,
    fields.whyItMatters ?? "",
    ...fields.body,
    ...fields.nextActions.map((action) => action.label),
    ...fields.tags,
    fields.owner,
    fields.sourceName ?? "",
  ].join("\n");
}

export async function handleResourceDraftPatch(
  request: NextRequest,
  id: string,
  save: SaveResourceDraft = saveResourceDraft,
) {
  if (!(await ownerFromRequest(request))) {
    return NextResponse.json(
      { error: "Sign in to the Consultant Workspace to save changes." },
      { status: 401, headers: { "cache-control": "no-store" } },
    );
  }
  if (!isSameOriginMutation(request)) {
    return NextResponse.json(
      { error: "Open this resource from the program before saving changes." },
      { status: 403, headers: { "cache-control": "no-store" } },
    );
  }

  const body = await readBoundedJson(request, 65_536);
  if (!body.ok) {
    return NextResponse.json(
      { error: body.message },
      { status: body.status, headers: { "cache-control": "no-store" } },
    );
  }
  const parsed = ResourceDraftRequestSchema.safeParse(body.value);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Check the required fields and try again." },
      { status: 400, headers: { "cache-control": "no-store" } },
    );
  }

  if (lintStaffCopy(textForStaffVoiceReview(parsed.data)).length > 0) {
    return NextResponse.json(
      { error: "Revise wording that does not fit the program's staff voice, then save again." },
      { status: 422, headers: { "cache-control": "no-store" } },
    );
  }

  try {
    const scope = contentScopeForContext(resolveProductContext(request.cookies.get(PRODUCT_CONTEXT_COOKIE)?.value));
    const draft = await save(id, parsed.data, { scope });
    return NextResponse.json(
      {
        ok: true,
        draft,
        message: "Draft saved for review. Staff still see the current approved version.",
      },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof ResourceDraftConflictError) {
      return NextResponse.json(
        { error: "A newer draft was saved while you were working. Reload this page before saving again." },
        { status: 409, headers: { "cache-control": "no-store" } },
      );
    }
    if (error instanceof ResourceDraftNotFoundError) {
      return NextResponse.json(
        { error: "This resource is not available for editing." },
        { status: 404, headers: { "cache-control": "no-store" } },
      );
    }
    if (error instanceof ResourceDraftValidationError) {
      return NextResponse.json(
        { error: "Make a change and check the required fields before saving." },
        { status: 422, headers: { "cache-control": "no-store" } },
      );
    }
    console.error("Resource draft save failed.", error instanceof Error ? error.name : "Unknown error");
    return NextResponse.json(
      { error: "The draft could not be saved right now. Your approved resource has not changed." },
      { status: 503, headers: { "cache-control": "no-store" } },
    );
  }
}

