import type { NextRequest } from "next/server";
import { handlePageCopyPost } from "./handlers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ surface: string }> },
) {
  const { surface } = await params;
  return handlePageCopyPost(request, surface);
}
