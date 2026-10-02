import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { ownerFromRequest } from "@/lib/auth/request";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { readBoundedJson } from "@/lib/http/request";
import { sendWaitingNotices } from "@/lib/consult/email";
import { getConsultStore } from "@/lib/consult/store";
import { leaderLinkFor } from "@/lib/consult/service";
import { CONSULT_NAME, LEADER_ROLES } from "@/lib/consult/types";

export const dynamic = "force-dynamic";
const NO_STORE = { "cache-control": "no-store" };

const Schema = z.object({
  action: z.enum(["add", "resend", "revoke"]),
  email: z.string().trim().toLowerCase().max(254).regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/),
  displayName: z.string().trim().max(120).optional(),
  role: z.enum(LEADER_ROLES).optional(),
}).strict();

export async function POST(request: NextRequest) {
  if (!(await ownerFromRequest(request))) return NextResponse.json({ error: "Sign in to the Consultant Workspace to continue." }, { status: 401, headers: NO_STORE });
  if (!isSameOriginMutation(request)) return NextResponse.json({ error: "Please open this page from the program, then try again." }, { status: 403, headers: NO_STORE });
  const body = await readBoundedJson(request, 4_096);
  if (!body.ok) return NextResponse.json({ error: body.message }, { status: body.status, headers: NO_STORE });
  const parsed = Schema.safeParse(body.value);
  if (!parsed.success) return NextResponse.json({ error: "Please enter a work email address and choose a role." }, { status: 400, headers: NO_STORE });
  const { action, email, displayName, role } = parsed.data;
  const store = getConsultStore();
  if (action === "revoke") {
    const ok = await store.revokePerson(email);
    return NextResponse.json({ ok }, { status: ok ? 200 : 404, headers: NO_STORE });
  }
  const existing = await store.getPerson(email);
  const useRole = role ?? existing?.role;
  if (!useRole) return NextResponse.json({ error: "Please choose a role for this person." }, { status: 400, headers: NO_STORE });
  const { link, person } = await leaderLinkFor(store, email, displayName ?? null, useRole, { reissue: action === "resend" });
  const sees = person.role === "deputy_director" || person.role === "division_director"
    ? "the requests for help across the Division and where each one stands"
    : "the requests for help from your team and where each one stands";
  const notice = await store.addNotice({
    requestId: null,
    toEmail: person.email,
    subject: `Your private ${CONSULT_NAME} link`,
    body: [
      person.displayName ? `Hello ${person.displayName},` : "Hello,",
      `Here is your private ${CONSULT_NAME} link. It shows ${sees}.`,
      link,
      "Please keep it to yourself. If it is ever shared by mistake, ask the consultant for a new one, and the old link will stop working.",
    ].join("\n\n"),
  });
  const delivery = await sendWaitingNotices(store).catch(() => ({ sentNoticeIds: [] as number[] }));
  return NextResponse.json({ ok: true, emailed: delivery.sentNoticeIds.includes(notice.id), link }, { headers: NO_STORE });
}
