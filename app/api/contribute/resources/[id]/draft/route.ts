import { type NextRequest } from "next/server";
import { handleContributorResourceDraft, handleContributorResourceGet } from "../../handlers";
type Context = { params: Promise<{ id: string }> };
export async function GET(request: NextRequest, context: Context) { return handleContributorResourceGet(request, (await context.params).id, true); }
export async function PATCH(request: NextRequest, context: Context) { return handleContributorResourceDraft(request, (await context.params).id); }
