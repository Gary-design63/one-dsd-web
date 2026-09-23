import type { NextRequest } from "next/server";
import { staffWriteClosedResponse } from "@/lib/product/staff-lock";

/** Staff consultation intake is closed. Consultant surfaces keep their own routes. */
export async function POST(request: NextRequest) {
  void request;
  return staffWriteClosedResponse();
}
