import type { NextRequest } from "next/server";
import { staffWriteClosedResponse } from "@/lib/product/staff-lock";

export const maxDuration = 30;

/** Staff Ask is browse-and-download only. Typed questions are not accepted. */
export async function POST(request: NextRequest) {
  void request;
  return staffWriteClosedResponse();
}
