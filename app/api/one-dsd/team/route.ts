import { NextResponse, type NextRequest } from "next/server";
import { ownerFromRequest } from "@/lib/auth/request";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { readBoundedJson } from "@/lib/http/request";
import { staffWriteClosedResponse } from "@/lib/product/staff-lock";
import {
  applyOneDsdTeamMutation,
  CollaborationMutationError,
  readOneDsdTeamWorkspace,
} from "@/lib/collaboration/store";
import { OneDsdTeamMutationSchema } from "@/lib/collaboration/schema";
import { toOneDsdTeamWorkspaceView } from "@/lib/collaboration/view";

const NO_STORE = { headers: { "cache-control": "no-store" } };

export async function GET(request: NextRequest) {
  if (!(await ownerFromRequest(request))) {
    return NextResponse.json({ error: "Sign in to the Consultant Workspace to continue." }, { status: 401, ...NO_STORE });
  }
  return NextResponse.json(
    { ok: true, workspace: toOneDsdTeamWorkspaceView(await readOneDsdTeamWorkspace()) },
    NO_STORE,
  );
}

/** F-02: staff/team-key writes fail closed. Owner session required. */
export async function POST(request: NextRequest) {
  if (!(await ownerFromRequest(request))) return staffWriteClosedResponse();
  if (!isSameOriginMutation(request)) {
    return NextResponse.json({ error: "Open One DSD Team before making changes." }, { status: 403, ...NO_STORE });
  }
  const body = await readBoundedJson(request, 65_536);
  if (!body.ok) return NextResponse.json({ error: body.message }, { status: body.status, ...NO_STORE });
  const parsed = OneDsdTeamMutationSchema.safeParse(body.value);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Check the change and try again." },
      { status: 400, ...NO_STORE },
    );
  }
  try {
    const workspace = await applyOneDsdTeamMutation(parsed.data);
    return NextResponse.json(
      { ok: true, workspace: toOneDsdTeamWorkspaceView(workspace) },
      NO_STORE,
    );
  } catch (error) {
    if (error instanceof CollaborationMutationError) {
      const status = error.code === "not_found" ? 404 : error.code === "unsafe_content" ? 422 : 409;
      return NextResponse.json({ error: error.message }, { status, ...NO_STORE });
    }
    return NextResponse.json({ error: "The change could not be saved." }, { status: 500, ...NO_STORE });
  }
}
