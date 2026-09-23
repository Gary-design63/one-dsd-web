import { type NextRequest } from "next/server";
import { handleContributorResourceAction, handleContributorResourceGet } from "../../handlers";
type Context = { params: Promise<{ id: string }> };
export async function GET(request: NextRequest, context: Context) { return handleContributorResourceGet(request, (await context.params).id); }
export async function POST(request: NextRequest, context: Context) { return handleContributorResourceAction(request, (await context.params).id); }
