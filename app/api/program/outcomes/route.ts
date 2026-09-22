import type { NextRequest } from "next/server";
import { staffWriteClosedResponse } from "@/lib/product/staff-lock";

/** Staff "Share a result" writes are closed. */
export async function POST(request?: NextRequest) {
  void request;
  return staffWriteClosedResponse();
}
