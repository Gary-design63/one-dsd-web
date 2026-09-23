import type { NextRequest } from "next/server";
import { handleResourceReleaseGet, handleResourceReleasePost } from "./handlers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return handleResourceReleaseGet(request, id);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return handleResourceReleasePost(request, id);
}
