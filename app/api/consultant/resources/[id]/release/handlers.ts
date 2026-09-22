import { NextResponse, type NextRequest } from "next/server";
import { ownerFromRequest } from "@/lib/auth/request";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import {
  ResourceReleaseActionSchema,
  staffReleaseValidationIssues,
  type ResourceReleaseAction,
  type ResourceReleaseState,
} from "@/lib/content/resource-release-contract";
import {
  loadResourceReleaseState,
  resourceReleaseStore,
  ResourceReleaseConflictError,
  ResourceReleaseGateError,
  ResourceReleaseNotFoundError,
  ResourceReleaseValidationError,
} from "@/lib/content/resource-release";
import { contentScopeForContext } from "@/lib/product/request-context";
import { PRODUCT_CONTEXT_COOKIE, resolveProductContext } from "@/lib/product/federation";
import { readBoundedJson } from "@/lib/http/request";

type ResourceReleaseService = {
  read(id: string): Promise<ResourceReleaseState | undefined>;
  act(id: string, action: ResourceReleaseAction): Promise<ResourceReleaseState>;
};

function defaultService(request: NextRequest): ResourceReleaseService {
  const scope = contentScopeForContext(resolveProductContext(request.cookies.get(PRODUCT_CONTEXT_COOKIE)?.value));
  const store = resourceReleaseStore();
  return {
    read: (id) => loadResourceReleaseState(id, { scope, store }),
    act(id, action) {
      if (action.action === "review") {
        return store.recordReview(
          id,
          scope,
          action.revisionId,
          action.dimension,
          action.decision,
          action.expectedPriorReviewId,
          action.note,
        );
      }
      if (action.action === "publish") {
        return store.publish(
          id,
          scope,
          action.revisionId,
          action.expectedScopeDecisionId,
          action.reason,
          action.sensitivityClass,
          action.unauthenticatedExposurePermitted,
          action.exposureReason,
        );
      }
      if (action.action === "withdraw") {
        return store.withdraw(
          id,
          scope,
          action.revisionId,
          action.expectedScopeDecisionId,
          action.reason,
        );
      }
      return store.republish(
        id,
        scope,
        action.revisionId,
        action.expectedScopeDecisionId,
        action.reason,
        action.sensitivityClass,
        action.unauthenticatedExposurePermitted,
        action.exposureReason,
      );
    },
  };
}

function protectedResponse(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    { status, headers: { "cache-control": "no-store" } },
  );
}

async function ownerCheck(request: NextRequest) {
  if (!(await ownerFromRequest(request))) {
    return protectedResponse("Sign in to the Consultant Workspace to review resources.", 401);
  }
  return null;
}

export async function handleResourceReleaseGet(
  request: NextRequest,
  id: string,
  service?: ResourceReleaseService,
) {
  const denied = await ownerCheck(request);
  if (denied) return denied;
  const releaseService = service ?? defaultService(request);
  try {
    const release = await releaseService.read(id);
    if (!release) return protectedResponse("This resource is not available for review.", 404);
    return NextResponse.json({ release }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    console.error("Resource review read failed.", error instanceof Error ? error.name : "Unknown error");
    return protectedResponse("The resource review could not be opened right now.", 503);
  }
}

export async function handleResourceReleasePost(
  request: NextRequest,
  id: string,
  service?: ResourceReleaseService,
) {
  const denied = await ownerCheck(request);
  if (denied) return denied;

  if (!isSameOriginMutation(request)) {
    return protectedResponse("Open this resource from the program before making changes.", 403);
  }
  const body = await readBoundedJson(request, 16_384);
  if (!body.ok) return protectedResponse(body.message, body.status);
  const parsed = ResourceReleaseActionSchema.safeParse(body.value);
  if (!parsed.success) return protectedResponse("Check the review information and try again.", 400);
  const releaseService = service ?? defaultService(request);

  try {
    if (parsed.data.action === "publish" || parsed.data.action === "republish") {
      const current = await releaseService.read(id);
      if (!current) throw new ResourceReleaseNotFoundError();
      const candidate =
        parsed.data.action === "publish"
          ? current.draft?.revisionId === parsed.data.revisionId
            ? current.draft.payload
            : undefined
          : current.history.find((version) => version.revisionId === parsed.data.revisionId)?.payload;
      if (!candidate) throw new ResourceReleaseConflictError();
      if (staffReleaseValidationIssues(candidate).length > 0) {
        return protectedResponse(
          "Revise the resource wording or formatting before publishing it.",
          422,
        );
      }
    }

    const release = await releaseService.act(id, parsed.data);
    const message =
      parsed.data.action === "review"
        ? "Review decision saved."
        : parsed.data.action === "publish"
          ? "The reviewed resource is now available to staff."
          : parsed.data.action === "withdraw"
            ? "The resource is no longer available to staff in this program view."
            : "The selected approved version is now available to staff.";
    return NextResponse.json(
      { ok: true, release, message },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof ResourceReleaseConflictError) {
      return protectedResponse("This resource changed. Reload the page before continuing.", 409);
    }
    if (error instanceof ResourceReleaseNotFoundError) {
      return protectedResponse("This resource is not available for review.", 404);
    }
    if (error instanceof ResourceReleaseGateError) {
      return protectedResponse("Complete every required review before publishing this resource.", 422);
    }
    if (error instanceof ResourceReleaseValidationError) {
      return protectedResponse("Check the review information and try again.", 422);
    }
    console.error("Resource release action failed.", error instanceof Error ? error.name : "Unknown error");
    return protectedResponse("That change could not be completed right now.", 503);
  }
}

