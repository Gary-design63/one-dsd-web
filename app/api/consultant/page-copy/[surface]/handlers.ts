import { NextResponse, type NextRequest } from "next/server";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { ownerFromRequest } from "@/lib/auth/request";
import { readBoundedJson } from "@/lib/http/request";
import {
  PAGE_BLOCK_SURFACES,
  PageCopyActionSchema,
  pageCopySchema,
  type PageBlockSurface,
  type PageCopyAction,
} from "@/lib/content/page-copy-contract";
import {
  applyPageCopyAction,
  PageCopyConflictError,
  PageCopyNotFoundError,
  PageCopyReviewRequiredError,
  PageCopyValidationError,
} from "@/lib/content/page-copy";

type ApplyAction = (
  surface: PageBlockSurface,
  action: PageCopyAction,
) => ReturnType<typeof applyPageCopyAction>;

const SUCCESS_MESSAGES: Record<PageCopyAction["action"], string> = {
  save_changes: "Your changes are saved and now available on this page.",
  save_draft: "Draft saved for review. Staff still see the current approved wording.",
  record_review: "Review recorded. Publishing remains a separate decision.",
  publish: "The reviewed wording is now available to staff.",
  withdraw: "The wording has been withdrawn from staff view.",
  rollback: "The earlier approved wording is now available to staff.",
};

function knownSurface(value: string): value is PageBlockSurface {
  return (PAGE_BLOCK_SURFACES as readonly string[]).includes(value);
}

export async function handlePageCopyPost(
  request: NextRequest,
  surfaceValue: string,
  apply: ApplyAction = applyPageCopyAction,
) {
  const headers = { "cache-control": "no-store" };
  if (!(await ownerFromRequest(request))) {
    return NextResponse.json({ error: "Sign in to the Consultant Workspace to make changes." }, { status: 401, headers });
  }
  if (!isSameOriginMutation(request)) {
    return NextResponse.json({ error: "Open this page from the program before making changes." }, { status: 403, headers });
  }
  if (!knownSurface(surfaceValue)) {
    return NextResponse.json({ error: "This page area is not available for editing." }, { status: 404, headers });
  }

  const body = await readBoundedJson(request, 32_768);
  if (!body.ok) return NextResponse.json({ error: body.message }, { status: body.status, headers });
  const parsed = PageCopyActionSchema.safeParse(body.value);
  if (!parsed.success) {
    return NextResponse.json({ error: "Check the required fields and try again." }, { status: 400, headers });
  }

  let action: PageCopyAction = parsed.data;
  if (action.action === "save_draft" || action.action === "save_changes") {
    const copy = pageCopySchema(surfaceValue).safeParse(action.copy);
    if (!copy.success) {
      return NextResponse.json(
        { error: "Revise the marked wording or link, then save again." },
        { status: 422, headers },
      );
    }
    action = { ...action, copy: copy.data };
  }

  try {
    const state = await apply(surfaceValue, action);
    return NextResponse.json(
      { ok: true, state, message: SUCCESS_MESSAGES[action.action] },
      { headers },
    );
  } catch (error) {
    if (error instanceof PageCopyConflictError) {
      return NextResponse.json(
        { error: "This wording changed while you were working. Reload the page before trying again." },
        { status: 409, headers },
      );
    }
    if (error instanceof PageCopyNotFoundError) {
      return NextResponse.json({ error: "This page area is not available for editing." }, { status: 404, headers });
    }
    if (error instanceof PageCopyValidationError) {
      return NextResponse.json(
        { error: "Revise the wording or link and try again." },
        { status: 422, headers },
      );
    }
    if (error instanceof PageCopyReviewRequiredError) {
      return NextResponse.json(
        { error: "Complete every required review before publishing this draft." },
        { status: 409, headers },
      );
    }
    console.error("Page wording change failed.", error instanceof Error ? error.name : "Unknown error");
    return NextResponse.json(
      { error: "The change could not be confirmed. Reload the page to check the saved wording." },
      { status: 503, headers },
    );
  }
}
