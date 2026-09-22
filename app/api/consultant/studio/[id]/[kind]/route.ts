import type { NextRequest } from "next/server";
import { handleStudioAssetGet } from "../../handlers";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest, context: { params: Promise<{ id: string; kind: string }> }) {
  const { id, kind } = await context.params;
  return handleStudioAssetGet(request, id, kind);
}
