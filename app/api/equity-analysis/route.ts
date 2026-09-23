import type { NextRequest } from "next/server";
import { staffWriteClosedResponse } from "@/lib/product/staff-lock";

/** F-02: staff analysis writes fail closed. Same-origin is not authorization. */
export async function POST(request: NextRequest) {
  void request;
  return staffWriteClosedResponse();
}
