import { NextResponse, type NextRequest } from "next/server";
import { ownerFromRequest } from "@/lib/auth/request";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { readBoundedJson } from "@/lib/http/request";
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
    return NextResponse.json({ error: "Your access has expired. Return to One DSD Team and enter the program owner key again." }, { status: 401, ...NO_STORE });
  }
  try {
    return NextResponse.json(
      { ok: true, workspace: toOneDsdTeamWorkspaceView(await readOneDsdTeamWorkspace()) },
      NO_STORE,
    );
  } catch (error) {
    console.error("one dsd team workspace read failed", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ error: "One DSD Team could not be opened right now. Try again in a few minutes." }, { status: 503, ...NO_STORE });
  }
}

export async function POST(request: NextRequest) {
  if (!(await ownerFromRequest(request))) {
    return NextResponse.json({ error: "Your access has expired. Return to One DSD Team and enter the program owner key again." }, { status: 401, ...NO_STORE });
  }
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
