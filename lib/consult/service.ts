import "server-only";

import { addBusinessDays, isOverdue } from "./business-days";
import { sendWaitingNotices } from "./email";
import { getConsultStore, type ConsultStore, type NewEvent } from "./store";
import { hashToken, leaderToken, requesterToken, validTokenShape } from "./tokens";
import {
  ACK_BUSINESS_DAYS,
  CONSULT_NAME,
  IDENTIFIER_MESSAGE,
  OPEN_STATUSES,
  REDIRECT_MESSAGE,
  STATUS_LABEL,
  SUPPORT_LABEL,
  SUPPORT_LOOKING_FOR,
  TIMING_SENTENCE,
  containsPrivateIdentifier,
  needsRedirectNotice,
  type ConsultEvent,
  type ConsultPerson,
  type ConsultRequest,
  type ConsultStatus,
  type CreateRequestInput,
  type LeaderRequestView,
  type LeaderRole,
  type UpdateRequestInput,
} from "./types";

/** A work title in quotation marks, with the closing punctuation placed the way American English places it. */
function quoted(title: string, end: "." | "" = ""): string {
  const text = title.trim();
  const closing = end && !/[.?!]$/.test(text) ? end : "";
  return `“${text}${closing}”`;
}

export function publicOrigin(): string {
  return (process.env.CONSULT_PUBLIC_URL?.trim() || "https://people-access-culture.up.railway.app").replace(/\/+$/, "");
}
export function consultantName(): string {
  return process.env.CONSULT_CONSULTANT_NAME?.trim() || "Gary Banks";
}
function consultantEmail(): string | null {
  return process.env.CONSULT_NOTIFY_EMAIL?.trim().toLowerCase() || null;
}

export function requesterLink(requestId: string): string {
  return `${publicOrigin()}/consult/requests/${requesterToken(requestId)}`;
}

/** The private dashboard link for a person who follows requests. Creates or reuses their access. */
export async function leaderLinkFor(store: ConsultStore, email: string, displayName: string | null, role: LeaderRole, opts: { reissue?: boolean } = {}): Promise<{ person: ConsultPerson; link: string }> {
  const normalized = email.trim().toLowerCase();
  let person = await store.getPerson(normalized);
  const needsNew = !person || person.revokedAt || opts.reissue;
  if (needsNew) {
    // A new link always differs from the one it replaces, even within the same millisecond.
    const previous = person ? Date.parse(person.tokenIssuedAt) : 0;
    const issuedAt = new Date(Math.max(Date.now(), previous + 1)).toISOString();
    person = await store.upsertPerson({ email: normalized, displayName, role, tokenHash: hashToken(leaderToken(normalized, issuedAt)), issuedAt, reissue: Boolean(opts.reissue) });
  } else {
    person = await store.upsertPerson({ email: normalized, displayName, role, tokenHash: hashToken(leaderToken(normalized, person!.tokenIssuedAt)), issuedAt: person!.tokenIssuedAt, reissue: false });
  }
  return { person: person!, link: `${publicOrigin()}/consult/team/${leaderToken(person!.email, person!.tokenIssuedAt)}` };
}

export type SubmitResult =
  | { ok: true; request: ConsultRequest; link: string; delivery: { configured: boolean; requesterNotified: boolean } }
  | { ok: false; reason: "private_identifier" | "redirect_notice"; message: string };

export async function submitRequest(input: CreateRequestInput): Promise<SubmitResult> {
  const free = [input.workTitle, input.situation, input.goals];
  if (containsPrivateIdentifier(...free)) {
    return { ok: false, reason: "private_identifier", message: IDENTIFIER_MESSAGE };
  }
  if (needsRedirectNotice(...free) && !input.keepAfterRedirectNotice) {
    return { ok: false, reason: "redirect_notice", message: REDIRECT_MESSAGE };
  }

  const store = getConsultStore();
  const now = new Date();
  const request = await store.createRequest(
    {
      requesterName: input.requesterName,
      requesterEmail: input.requesterEmail,
      requesterUnit: input.requesterUnit || null,
      supervisorName: input.supervisorName,
      supervisorEmail: input.supervisorEmail,
      managerEmail: input.managerEmail || null,
      workTitle: input.workTitle,
      supportType: input.supportType,
      timing: input.timing,
      situation: input.situation,
      goals: input.goals,
      acknowledgmentDueAt: addBusinessDays(now, ACK_BUSINESS_DAYS).toISOString(),
    },
    [{ actor: "requester", kind: "submitted", fromStatus: null, toStatus: "received", note: null, visibleToRequester: true }],
  );

  const link = requesterLink(request.id);
  const due = new Date(request.acknowledgmentDueAt).toLocaleDateString("en-US", { timeZone: "America/Chicago", weekday: "long", month: "long", day: "numeric" });
  const unit = request.requesterUnit ? ` (${request.requesterUnit})` : "";
  const requesterNotice = await store.addNotice({
    requestId: request.id,
    toEmail: request.requesterEmail,
    subject: `Your ${CONSULT_NAME} request has been received`,
    body: [
      `Hello ${request.requesterName},`,
      `The consultant has received your request for help with ${quoted(request.workTitle, ".")}`,
      `You will hear back by ${due}, with the name of the person who is taking it on. This private link shows where your request stands, and lets you withdraw it if you no longer need help:`,
      link,
      "Please keep the link to yourself, since anyone who has it can see your request.",
      `Your supervisor can see that you asked for help, the kind of help, and where it stands. They cannot see what you wrote about the work. Using ${CONSULT_NAME} is voluntary, and asking for help is never used to evaluate you.`,
    ].join("\n\n"),
  });

  const followers: Array<{ email: string; name: string | null; role: LeaderRole }> = [{ email: request.supervisorEmail, name: request.supervisorName, role: "supervisor" }];
  if (request.managerEmail) followers.push({ email: request.managerEmail, name: null, role: "manager" });
  for (const follower of followers) {
    const { link: leaderLink } = await leaderLinkFor(store, follower.email, follower.name, follower.role);
    await store.addNotice({
      requestId: request.id,
      toEmail: follower.email.toLowerCase(),
      subject: `${request.requesterName} has asked the consultant for help`,
      body: [
        follower.name ? `Hello ${follower.name},` : "Hello,",
        `${request.requesterName}${unit} has asked the consultant for help with ${quoted(request.workTitle, ".")} They are looking for ${SUPPORT_LOOKING_FOR[request.supportType]}.`,
        `You are receiving this because ${request.requesterName} named you as their ${follower.role}. This private link shows where their request stands, along with any others from your team:`,
        leaderLink,
        `You can see who asked, the name of the work, the kind of help, who is taking it on, and where it stands. What ${request.requesterName} wrote about the work stays with them and the consultant. Asking for help is never used to evaluate anyone.`,
        "Please keep the link to yourself.",
      ].join("\n\n"),
    });
  }
  const notify = consultantEmail();
  if (notify) {
    await store.addNotice({
      requestId: request.id,
      toEmail: notify,
      subject: `New request from ${request.requesterName}`,
      body: [
        `${request.requesterName}${unit} has asked for help with ${quoted(request.workTitle, ".")} They are looking for ${SUPPORT_LOOKING_FOR[request.supportType]}. ${TIMING_SENTENCE[request.timing]}`,
        `Please acknowledge the request by ${due}.`,
        `${publicOrigin()}/consultant/consult/${request.id}`,
      ].join("\n\n"),
    });
  }
  const delivery = await sendWaitingNotices(store).catch(() => ({ configured: false, sentNoticeIds: [] as number[] }));
  return { ok: true, request, link, delivery: { configured: delivery.configured, requesterNotified: delivery.sentNoticeIds.includes(requesterNotice.id) } };
}

/* ------------------------------ consultant actions ------------------------------ */

export type UpdateResult = { ok: true; request: ConsultRequest } | { ok: false; reason: "not_found" | "closed" | "owner_required" | "outcome_required" | "referral_required" | "nothing_to_change"; message: string };

const ALLOWED: Record<ConsultStatus, ConsultStatus[]> = {
  received: ["acknowledged", "in_progress", "waiting_on_requester", "referred", "resolved"],
  acknowledged: ["in_progress", "waiting_on_requester", "referred", "resolved"],
  in_progress: ["waiting_on_requester", "referred", "resolved", "acknowledged"],
  waiting_on_requester: ["in_progress", "referred", "resolved"],
  referred: ["in_progress", "resolved"],
  resolved: [],
  withdrawn: [],
};

export async function applyConsultantUpdate(id: string, input: UpdateRequestInput): Promise<UpdateResult> {
  const store = getConsultStore();
  const current = await store.getRequest(id);
  if (!current) return { ok: false, reason: "not_found", message: "That request could not be found." };
  if (current.status === "resolved" || current.status === "withdrawn") return { ok: false, reason: "closed", message: "This request is already closed, so it can no longer be changed." };

  const events: NewEvent[] = [];
  const patch: Parameters<ConsultStore["updateRequest"]>[1] = {};
  const nextOwner = input.ownerName ?? current.ownerName;
  const target = input.status && input.status !== current.status ? input.status : undefined;

  if (input.ownerName && input.ownerName !== current.ownerName) {
    patch.ownerName = input.ownerName;
    events.push({ actor: "consultant", kind: "owner_assigned", fromStatus: null, toStatus: null, note: `${input.ownerName} is taking this on`, visibleToRequester: true });
  }
  if (target) {
    if (!ALLOWED[current.status].includes(target)) return { ok: false, reason: "closed", message: `This request is ${STATUS_LABEL[current.status].toLowerCase()}, so it cannot be moved to ${STATUS_LABEL[target].toLowerCase()}.` };
    if (target !== "withdrawn" && !nextOwner) return { ok: false, reason: "owner_required", message: "Please say who is taking this on before changing where it stands." };
    if (target === "referred") {
      const referral = input.referredTo ?? current.referredTo;
      if (!referral) return { ok: false, reason: "referral_required", message: "Please say which office this is being passed to." };
      patch.referredTo = referral;
      events.push({ actor: "consultant", kind: "referred", fromStatus: current.status, toStatus: "referred", note: `Passed to ${referral}`, visibleToRequester: true });
    }
    if (target === "resolved") {
      const outcome = input.outcome ?? current.outcome;
      if (!outcome) return { ok: false, reason: "outcome_required", message: "Please write the outcome in a line or two before resolving." };
      patch.outcome = outcome;
      patch.closedAt = new Date().toISOString();
      events.push({ actor: "consultant", kind: "outcome_recorded", fromStatus: current.status, toStatus: "resolved", note: outcome, visibleToRequester: true });
    }
    if (target === "acknowledged" && !current.acknowledgedAt) patch.acknowledgedAt = new Date().toISOString();
    if (target !== "acknowledged" && !current.acknowledgedAt) patch.acknowledgedAt = new Date().toISOString();
    patch.status = target;
    if (target !== "referred" && target !== "resolved") events.push({ actor: "consultant", kind: target === "acknowledged" ? "acknowledged" : "status_changed", fromStatus: current.status, toStatus: target, note: null, visibleToRequester: true });
  } else if (input.outcome && !patch.outcome) {
    patch.outcome = input.outcome;
  }
  if (input.note) events.push({ actor: "consultant", kind: "note", fromStatus: null, toStatus: null, note: input.note, visibleToRequester: input.noteVisibleToRequester });
  if (events.length === 0 && Object.keys(patch).length === 0) return { ok: false, reason: "nothing_to_change", message: "There is nothing to change yet." };

  const updated = await store.updateRequest(id, patch, events);
  if (!updated) return { ok: false, reason: "not_found", message: "That request could not be found." };

  if (target || input.ownerName) {
    const link = requesterLink(updated.id);
    const who = updated.ownerName ?? "The consultant";
    const canReply = Boolean(consultantEmail());
    const work = quoted(updated.workTitle);
    const workEnd = quoted(updated.workTitle, ".");
    let subject: string;
    let lead: string;
    switch (target ? updated.status : "owner") {
      case "acknowledged":
        subject = "The consultant is taking on your request";
        lead = `${who} has acknowledged your request for help with ${work} and is taking it on.`;
        break;
      case "in_progress":
        subject = "Work has started on your request";
        lead = `${who} has started work on your request for help with ${workEnd}`;
        break;
      case "waiting_on_requester":
        subject = "The consultant needs a little more from you";
        lead = `${who} needs a little more information from you before going further on ${workEnd} A note is waiting on your request page${canReply ? ", and you are welcome to reply to this email" : ""}.`;
        break;
      case "referred":
        subject = "Your request has been passed to another office";
        lead = `${who} has passed your request for help with ${work} to ${updated.referredTo ?? "another office"}, which is better placed to help.`;
        break;
      case "resolved":
        subject = "Your request is resolved";
        lead = `${who} has resolved your request for help with ${workEnd}${updated.outcome ? ` The outcome: ${updated.outcome}` : ""}`;
        break;
      default:
        subject = "A new person is taking on your request";
        lead = `${who} is now taking on your request for help with ${workEnd}`;
    }
    await store.addNotice({
      requestId: updated.id,
      toEmail: updated.requesterEmail,
      subject,
      body: [`Hello ${updated.requesterName},`, lead, "You can see where your request stands here:", link].join("\n\n"),
    });
    await sendWaitingNotices(store).catch(() => undefined);
  }
  return { ok: true, request: updated };
}

/** Send the requester their private link again, for when the first message has been lost. */
export async function resendRequesterLink(id: string): Promise<{ ok: true; emailed: boolean; link: string } | { ok: false; message: string }> {
  const store = getConsultStore();
  const request = await store.getRequest(id);
  if (!request) return { ok: false, message: "That request could not be found." };
  const link = requesterLink(request.id);
  const notice = await store.addNotice({
    requestId: request.id,
    toEmail: request.requesterEmail,
    subject: `Your private ${CONSULT_NAME} link`,
    body: [
      `Hello ${request.requesterName},`,
      `Here is the private link to your request for help with ${quoted(request.workTitle, ".")} It shows where things stand.`,
      link,
      "Please keep the link to yourself, since anyone who has it can see your request.",
    ].join("\n\n"),
  });
  const delivery = await sendWaitingNotices(store).catch(() => ({ sentNoticeIds: [] as number[] }));
  return { ok: true, emailed: delivery.sentNoticeIds.includes(notice.id), link };
}

/* ----------------------------------- requester ---------------------------------- */

export type RequesterView = { request: ConsultRequest; events: ConsultEvent[]; overdue: boolean };

export async function requesterView(token: string): Promise<RequesterView | null> {
  if (!validTokenShape(token)) return null;
  const store = getConsultStore();
  const request = await store.getRequestByTokenHash(hashToken(token));
  if (!request) return null;
  const events = (await store.listEvents(request.id)).filter((event) => event.visibleToRequester);
  return { request, events, overdue: isOverdue(request) };
}

export async function withdrawRequest(token: string): Promise<{ ok: boolean; message: string }> {
  const view = await requesterView(token);
  if (!view) return { ok: false, message: "We could not find that request. Please check the link and try again." };
  if (!OPEN_STATUSES.includes(view.request.status)) return { ok: false, message: "This request is already closed, so there is nothing to withdraw." };
  const store = getConsultStore();
  await store.updateRequest(view.request.id, { status: "withdrawn", closedAt: new Date().toISOString() }, [{ actor: "requester", kind: "withdrawn", fromStatus: view.request.status, toStatus: "withdrawn", note: null, visibleToRequester: true }]);
  return { ok: true, message: "Your request has been withdrawn. If you need help again later, you are welcome to send a new one." };
}

/* ------------------------------------ leaders ----------------------------------- */

export function toLeaderView(request: ConsultRequest, now = new Date()): LeaderRequestView {
  return {
    id: request.id,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
    requesterName: request.requesterName,
    requesterUnit: request.requesterUnit,
    supervisorName: request.supervisorName,
    workTitle: request.workTitle,
    supportType: request.supportType,
    timing: request.timing,
    status: request.status,
    ownerName: request.ownerName,
    acknowledgmentDueAt: request.acknowledgmentDueAt,
    acknowledgedAt: request.acknowledgedAt,
    referredTo: request.referredTo,
    outcome: request.outcome,
    closedAt: request.closedAt,
    overdue: isOverdue(request, now),
  };
}

export async function leaderView(token: string): Promise<{ person: ConsultPerson; requests: LeaderRequestView[]; summary: Summary } | null> {
  if (!validTokenShape(token)) return null;
  const store = getConsultStore();
  const person = await store.getPersonByTokenHash(hashToken(token));
  if (!person) return null;
  const rows = await store.listRequests({ role: person.role, email: person.email });
  return { person, requests: rows.map((row) => toLeaderView(row)), summary: summarize(rows) };
}

/* ------------------------------------ summary ----------------------------------- */

export type Summary = {
  total: number;
  open: number;
  overdue: number;
  byStatus: Record<ConsultStatus, number>;
  bySupport: Record<string, number>;
  acknowledgedWithinTwoDays: { acknowledged: number; onTime: number };
  withRecordedOutcome: number;
  months: Array<{ month: string; received: number; resolved: number }>;
};

export function summarize(requests: ConsultRequest[], now = new Date()): Summary {
  const byStatus = Object.fromEntries((Object.keys(STATUS_LABEL) as ConsultStatus[]).map((key) => [key, 0])) as Record<ConsultStatus, number>;
  const bySupport: Record<string, number> = {};
  const months = new Map<string, { received: number; resolved: number }>();
  let overdue = 0;
  let open = 0;
  let acknowledged = 0;
  let onTime = 0;
  let outcomes = 0;
  const monthKey = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { timeZone: "America/Chicago", year: "numeric", month: "2-digit" });
  for (const request of requests) {
    byStatus[request.status] += 1;
    bySupport[SUPPORT_LABEL[request.supportType]] = (bySupport[SUPPORT_LABEL[request.supportType]] ?? 0) + 1;
    if (OPEN_STATUSES.includes(request.status)) open += 1;
    if (isOverdue(request, now)) overdue += 1;
    if (request.acknowledgedAt) {
      acknowledged += 1;
      if (Date.parse(request.acknowledgedAt) <= Date.parse(request.acknowledgmentDueAt)) onTime += 1;
    }
    if (request.status === "resolved" && request.outcome) outcomes += 1;
    const received = months.get(monthKey(request.createdAt)) ?? { received: 0, resolved: 0 };
    received.received += 1;
    months.set(monthKey(request.createdAt), received);
    if (request.closedAt && request.status === "resolved") {
      const closed = months.get(monthKey(request.closedAt)) ?? { received: 0, resolved: 0 };
      closed.resolved += 1;
      months.set(monthKey(request.closedAt), closed);
    }
  }
  return {
    total: requests.length,
    open,
    overdue,
    byStatus,
    bySupport,
    acknowledgedWithinTwoDays: { acknowledged, onTime },
    withRecordedOutcome: outcomes,
    months: [...months.entries()].sort((a, b) => b[0].localeCompare(a[0])).map(([month, value]) => ({ month, ...value })),
  };
}

/* ---------------------------------- overdue sweep ------------------------------- */

/** Flag requests past their acknowledgment time once, and tell the consultant and the Deputy Director(s). Run daily. */
export async function sweepOverdue(): Promise<{ flagged: number }> {
  const store = getConsultStore();
  const all = await store.listRequests();
  const people = await store.listPeople();
  const deputies = people.filter((person) => person.role === "deputy_director" && !person.revokedAt);
  let flagged = 0;
  for (const request of all) {
    if (!isOverdue(request)) continue;
    if (await store.hasOverdueFlag(request.id)) continue;
    await store.updateRequest(request.id, {}, [{ actor: "system", kind: "overdue_flagged", fromStatus: null, toStatus: null, note: "Past the two-business-day acknowledgment time.", visibleToRequester: false }]);
    const recipients = new Set<string>(deputies.map((person) => person.email));
    const notify = consultantEmail();
    if (notify) recipients.add(notify);
    for (const email of recipients) {
      const where = email === notify ? `${publicOrigin()}/consultant/consult/${request.id}` : `You can follow it with your private ${CONSULT_NAME} link.`;
      await store.addNotice({
        requestId: request.id,
        toEmail: email,
        subject: `${request.requesterName} is still waiting to hear back`,
        body: [`${request.requesterName} asked for help with ${quoted(request.workTitle)} and has not heard back yet. The two business days promised for a reply have passed.`, where].join("\n\n"),
      });
    }
    flagged += 1;
  }
  await sendWaitingNotices(store).catch(() => undefined);
  return { flagged };
}
