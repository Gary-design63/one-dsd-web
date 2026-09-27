import { NextResponse, type NextRequest } from "next/server";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { ownerFromRequest } from "@/lib/auth/request";
import { readBoundedFormUrlEncoded } from "@/lib/http/request";
import { applyConnectorForm, readConnectorSettings, writeConnectorSettings } from "@/lib/offline/connectors";
import { isLoopbackHost, offlineConnectorsFile } from "@/lib/offline/mode";

const NO_STORE = { "cache-control": "no-store" };
const PAGE = "/consultant/connectors";

function back(request: NextRequest, params: Record<string, string>) {
  // Only reached for this computer's own host; keep the address the browser used.
  const url = new URL(PAGE, `http://${request.headers.get("host")}`);
  for (const [name, value] of Object.entries(params)) url.searchParams.set(name, value);
  return NextResponse.redirect(url, { status: 303, headers: NO_STORE });
}

/** Offline edition only: save the owner's API connections for the launcher. */
export async function POST(request: NextRequest) {
  const file = offlineConnectorsFile();
  if (!file || !isLoopbackHost(request.headers.get("host"))) {
    return new NextResponse(null, { status: 404, headers: NO_STORE });
  }
  if (!isSameOriginMutation(request)) {
    return NextResponse.json({ error: "Open API connections from the Consultant Workspace." }, { status: 403, headers: NO_STORE });
  }
  if (!(await ownerFromRequest(request))) {
    return NextResponse.json({ error: "Open the Consultant Workspace before changing API connections." }, { status: 401, headers: NO_STORE });
  }
  const form = await readBoundedFormUrlEncoded(request, 8_192);
  if (!form.ok) return back(request, { error: "request" });

  let current;
  try {
    current = await readConnectorSettings(file);
  } catch {
    return back(request, { error: "unreadable" });
  }
  const result = applyConnectorForm(current, form.value);
  if (!result.ok) return back(request, { error: result.code });
  try {
    await writeConnectorSettings(file, result.settings);
  } catch {
    return back(request, { error: "unsaved" });
  }
  return back(request, { saved: "1" });
}
