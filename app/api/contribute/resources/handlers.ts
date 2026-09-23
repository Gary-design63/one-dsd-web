import { NextRequest, NextResponse } from "next/server";
import { programIdentityFromRequest, programMutationPrincipalFromRequest } from "@/lib/auth/program-request";
import { protectedMutationContextFromSessionToken, ProtectedMutationFeatureUnavailableError, type ProtectedContentMutationOperation } from "@/lib/auth/protected-mutation";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { ContributorResourceError, contributorResourceStore } from "@/lib/content/contributor-resources";
import { ResourceDraftRequestSchema } from "@/lib/content/resource-editor-contract";
import { ResourceReleaseActionSchema } from "@/lib/content/resource-release-contract";
import { contentScopeForContext } from "@/lib/product/request-context";
import { PRODUCT_CONTEXT_COOKIE, resolveProductContext } from "@/lib/product/federation";
import { readBoundedJson } from "@/lib/http/request";

const headers = { "cache-control": "no-store" };
const reply = (error: string, status: number) => NextResponse.json({ error }, { status, headers });
function scopeFor(request: NextRequest) {
  return contentScopeForContext(resolveProductContext(request.cookies.get(PRODUCT_CONTEXT_COOKIE)?.value));
}
function failure(error: unknown) {
  if (error instanceof ContributorResourceError) return reply(error.message, error.status);
  if (error instanceof ProtectedMutationFeatureUnavailableError) return reply("Resource contributions are not available right now.", 503);
  return reply("This change could not be confirmed. Keep your wording and try again.", 503);
}
async function readContext(request: NextRequest) {
  const scope = scopeFor(request);
  for (const role of ["publishing_approver", "program_steward", "content_contributor"] as const) {
    const principal = await programMutationPrincipalFromRequest(request, scope, role);
    if (principal) return { scope, context: protectedMutationContextFromSessionToken(principal.sessionToken, role === "publishing_approver" ? "resource_withdraw" : "resource_draft_save") };
  }
  throw new ContributorResourceError(403, "Resource work is not available with your current access.");
}
export async function handleContributorResourceGet(request: NextRequest, id?: string, editing = false) {
  if (!(await programIdentityFromRequest(request))) return reply("Sign in with your program account to open resource work.", 401);
  let store: ReturnType<typeof contributorResourceStore> | undefined;
  try {
    const { context, scope } = await readContext(request);
    store = contributorResourceStore();
    if (!id) return NextResponse.json({ resources: await store.queue(context, scope) }, { headers });
    const value = editing ? await store.editing(context, scope, id) : await store.read(context, scope, id);
    if (!value) return reply("This resource is not available in this program view.", 404);
    return NextResponse.json(editing ? { draft: value } : { release: value }, { headers });
  } catch (error) { return failure(error); }
  finally { await store?.close(); }
}
export async function handleContributorResourceDraft(request: NextRequest, id: string) {
  if (!(await programIdentityFromRequest(request))) return reply("Sign in with your program account to save a draft.", 401);
  if (!isSameOriginMutation(request)) return reply("Open this resource from the program before making changes.", 403);
  const body = await readBoundedJson(request, 750_000);
  if (!body.ok) return reply(body.message, body.status);
  const parsed = ResourceDraftRequestSchema.safeParse(body.value);
  if (!parsed.success) return reply("Check the resource fields and try again.", 400);
  const scope = scopeFor(request);
  const principal = await programMutationPrincipalFromRequest(request, scope, "content_contributor");
  if (!principal) return reply("Drafting is not available with your current access.", 403);
  let store: ReturnType<typeof contributorResourceStore> | undefined;
  try {
    const context = protectedMutationContextFromSessionToken(principal.sessionToken, "resource_draft_save");
    store = contributorResourceStore();
    return NextResponse.json({ ok: true, draft: await store.save(context, scope, id, parsed.data), message: "Draft saved for review. The staff version has not changed." }, { headers });
  } catch (error) { return failure(error); }
  finally { await store?.close(); }
}
export async function handleContributorResourceAction(request: NextRequest, id: string) {
  if (!(await programIdentityFromRequest(request))) return reply("Sign in with your program account to review resources.", 401);
  if (!isSameOriginMutation(request)) return reply("Open this resource from the program before making changes.", 403);
  const body = await readBoundedJson(request, 16_384);
  if (!body.ok) return reply(body.message, body.status);
  const parsed = ResourceReleaseActionSchema.safeParse(body.value);
  if (!parsed.success) return reply("Check the review information and try again.", 400);
  const scope = scopeFor(request);
  const principal = await programMutationPrincipalFromRequest(request, scope, parsed.data.action === "review" ? "program_steward" : "publishing_approver");
  if (!principal) return reply("That step is not available with your current access.", 403);
  let store: ReturnType<typeof contributorResourceStore> | undefined;
  try {
    const operation: ProtectedContentMutationOperation = parsed.data.action === "review" ? "resource_review_record" : `resource_${parsed.data.action}`;
    const context = protectedMutationContextFromSessionToken(principal.sessionToken, operation);
    store = contributorResourceStore();
    const release = await store.act(context, scope, id, parsed.data);
    const message = parsed.data.action === "review" ? "Review decision saved." : parsed.data.action === "withdraw" ? "The resource has been withdrawn from this program view." : "The reviewed resource is now available to staff.";
    return NextResponse.json({ ok: true, release, message }, { headers });
  } catch (error) { return failure(error); }
  finally { await store?.close(); }
}
