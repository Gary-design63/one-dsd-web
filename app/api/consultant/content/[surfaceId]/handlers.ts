import { NextResponse, type NextRequest } from "next/server";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { ownerFromRequest } from "@/lib/auth/request";
import { getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";
import {
  parseEditableSurfaceMutation,
  type EditableSurfaceMutation,
} from "@/lib/content/editable-surface-contract";
import {
  applyEditableSurfaceMutation,
  EditableSurfaceConflictError,
  EditableSurfaceNotFoundError,
  EditableSurfaceReviewRequiredError,
  EditableSurfaceValidationError,
  loadEditableSurfaceEditingState,
  type EditableSurfaceEditingState,
} from "@/lib/content/editable-surfaces";
import type { StaffProgramScope } from "@/lib/content/staff-publications";
import { readBoundedJson } from "@/lib/http/request";
import { PRODUCT_CONTEXT_COOKIE, resolveProductContext } from "@/lib/product/federation";
import { contentScopeForContext } from "@/lib/product/request-context";

type ReadState = (
  surfaceId: string,
  options: { scope: StaffProgramScope },
) => Promise<EditableSurfaceEditingState | undefined>;

type ApplyAction = (
  surfaceId: string,
  action: EditableSurfaceMutation,
) => Promise<EditableSurfaceEditingState>;

const HEADERS = { "cache-control": "no-store" } as const;

const SUCCESS_MESSAGES: Record<EditableSurfaceMutation["action"], string> = {
  save_changes: "Your changes are saved and available on the page.",
  save_draft: "Draft saved for review. Staff still see the current approved wording.",
  record_review: "Review recorded. Publishing remains a separate decision.",
  publish: "The reviewed wording is now available to staff.",
  withdraw: "The wording has been withdrawn from staff view.",
  resume_inheritance: "This area now follows the current One DHS wording.",
  restore: "The earlier approved wording is now available to staff.",
};

function requestedScope(request: NextRequest): StaffProgramScope {
  return contentScopeForContext(resolveProductContext(request.cookies.get(PRODUCT_CONTEXT_COOKIE)?.value));
}

function unavailable() {
  return NextResponse.json({ error: "This page area is not available for editing." }, { status: 404, headers: HEADERS });
}

export async function handleEditableSurfaceGet(
  request: NextRequest,
  surfaceId: string,
  readState: ReadState = loadEditableSurfaceEditingState,
) {
  if (!(await ownerFromRequest(request))) {
    return NextResponse.json(
      { error: "Sign in to the Consultant Workspace to edit this wording." },
      { status: 401, headers: HEADERS },
    );
  }
  const definition = getEditableSurfaceDefinition(surfaceId);
  const scope = requestedScope(request);
  if (!definition) return unavailable();

  try {
    const state = await readState(surfaceId, { scope });
    if (!state) return unavailable();
    return NextResponse.json({ ok: true, state }, { headers: HEADERS });
  } catch (error) {
    if (error instanceof EditableSurfaceNotFoundError) return unavailable();
    console.error("Editable wording could not be opened.", error instanceof Error ? error.name : "Unknown error");
    return NextResponse.json(
      { error: "This wording could not be opened right now." },
      { status: 503, headers: HEADERS },
    );
  }
}

export async function handleEditableSurfacePost(
  request: NextRequest,
  surfaceId: string,
  apply: ApplyAction = applyEditableSurfaceMutation,
) {
  if (!(await ownerFromRequest(request))) {
    return NextResponse.json(
      { error: "Sign in to the Consultant Workspace to make changes." },
      { status: 401, headers: HEADERS },
    );
  }
  if (!isSameOriginMutation(request)) {
    return NextResponse.json(
      { error: "Open this page from the program before making changes." },
      { status: 403, headers: HEADERS },
    );
  }
  const definition = getEditableSurfaceDefinition(surfaceId);
  if (!definition) return unavailable();

  const body = await readBoundedJson(request, 262_144);
  if (!body.ok) return NextResponse.json({ error: body.message }, { status: body.status, headers: HEADERS });

  let action: EditableSurfaceMutation;
  try {
    action = parseEditableSurfaceMutation(definition, body.value);
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error("Page wording rejected:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Revise the marked wording or link, then try again." },
      { status: 422, headers: HEADERS },
    );
  }
  const scope = requestedScope(request);
  if (action.scope !== scope) {
    return NextResponse.json(
      { error: "This page is open in a different program view. Reload the page before making changes." },
      { status: 409, headers: HEADERS },
    );
  }

  try {
    const state = await apply(surfaceId, action);
    return NextResponse.json(
      { ok: true, state, message: SUCCESS_MESSAGES[action.action] },
      { headers: HEADERS },
    );
  } catch (error) {
    if (error instanceof EditableSurfaceConflictError) {
      return NextResponse.json(
        { error: "This wording changed while you were working. Reload the page before trying again." },
        { status: 409, headers: HEADERS },
      );
    }
    if (error instanceof EditableSurfaceNotFoundError) return unavailable();
    if (error instanceof EditableSurfaceValidationError) {
      if (process.env.NODE_ENV === "development") console.error("Page wording rejected on save:", error.message);
      return NextResponse.json(
        { error: "Revise the marked wording or link, then try again." },
        { status: 422, headers: HEADERS },
      );
    }
    if (error instanceof EditableSurfaceReviewRequiredError) {
      return NextResponse.json(
        { error: "Complete every required review before publishing this draft." },
        { status: 409, headers: HEADERS },
      );
    }
    console.error("Editable wording change failed.", error instanceof Error ? error.name : "Unknown error");
    return NextResponse.json(
      { error: "The change could not be confirmed. Reload the page to check the saved wording before trying again." },
      { status: 503, headers: HEADERS },
    );
  }
}
