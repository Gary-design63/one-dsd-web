import { NextResponse, type NextRequest } from "next/server";
import { ownerFromRequest } from "@/lib/auth/request";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { deleteResourceOutright, resourceDeletionAvailable } from "@/lib/content/resource-delete";

const NO_STORE = { headers: { "cache-control": "no-store" } };

/** Consultant action: delete a resource outright from the whole program. */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await ownerFromRequest(request))) {
    return NextResponse.json({ error: "Sign in to the Consultant Workspace to delete a resource." }, { status: 401, ...NO_STORE });
  }
  if (!isSameOriginMutation(request)) {
    return NextResponse.json({ error: "Open the page before deleting." }, { status: 403, ...NO_STORE });
  }
  if (!resourceDeletionAvailable()) {
    return NextResponse.json({ error: "Deletion is not connected to a database." }, { status: 503, ...NO_STORE });
  }
  const { id } = await context.params;
  if (!/^[A-Za-z0-9][A-Za-z0-9._:-]{0,199}$/.test(id)) {
    return NextResponse.json({ error: "Unknown resource." }, { status: 400, ...NO_STORE });
  }
  try {
    const result = await deleteResourceOutright(id, "Deleted by the consultant.");
    return NextResponse.json({ ok: true, ...result }, NO_STORE);
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String((error as { code: unknown }).code) : "";
    if (code === "P0002") return NextResponse.json({ error: "This resource is not in the database, so it cannot be deleted here." }, { status: 404, ...NO_STORE });
    console.error("Resource delete failed.", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "The resource could not be deleted." }, { status: 500, ...NO_STORE });
  }
}
