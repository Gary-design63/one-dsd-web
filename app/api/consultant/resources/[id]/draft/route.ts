import type { NextRequest } from "next/server";
import { handleResourceDraftPatch } from "./handlers";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return handleResourceDraftPatch(request, id);
}
