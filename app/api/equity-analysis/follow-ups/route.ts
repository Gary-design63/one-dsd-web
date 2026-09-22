import type { NextRequest } from "next/server";
import { staffWriteClosedResponse } from "@/lib/product/staff-lock";

/** F-02: staff register writes fail closed. */
export async function POST(request?: NextRequest) {
  void request;
  return staffWriteClosedResponse();
}
