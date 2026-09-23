import type { NextRequest } from "next/server";
import { handleEditableSurfaceGet, handleEditableSurfacePost } from "./handlers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ surfaceId: string }> },
) {
  const { surfaceId } = await params;
  return handleEditableSurfaceGet(request, surfaceId);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ surfaceId: string }> },
) {
  const { surfaceId } = await params;
  return handleEditableSurfacePost(request, surfaceId);
}
