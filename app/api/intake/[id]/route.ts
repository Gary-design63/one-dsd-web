import { NextResponse, type NextRequest } from "next/server";
import { staffWriteClosedResponse } from "@/lib/product/staff-lock";

const NO_STORE = { "cache-control": "no-store" };

/** Tracking credentials never belong in a URL. */
export async function GET() {
  return NextResponse.json(
    { error: "Staff consultation tracking is closed. This program does not accept staff request forms." },
    { status: 405, headers: { ...NO_STORE, allow: "POST" } },
  );
}

export async function POST(request?: NextRequest) {
  void request;
  return staffWriteClosedResponse();
}
