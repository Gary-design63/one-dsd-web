import { runProgramIdentityHousekeepingIfConfigured } from "@/lib/auth/program-identity-housekeeping";
import { runProgramWork } from "@/lib/program/work";
import { trainingCreditContext } from "@/lib/program/learning-credit";
import { getLearningJourneyContext } from "../learning-guidance";
import { indexedProgramResources } from "../retrieval/program-resources";
/**
 * Orchestrator cycle: the bounded multi-step workflow (A4) the Program Orchestrator runs
 * on its own, on a schedule or on demand, under the owner's autonomy policy.
 *
 * What a cycle does (each step gated by the effective ceiling):
 *  A0  read policy; read queue; detect stale content; check brief quality; scan corpus accessibility
 *  A2  refresh heads-up packets for open requests (retrieval and question banks may have changed)
 *  A3  triage: move Received requests to Under review with a pin order suggestion
 *      (the automation-owned pin, but never append-only status history, can be cleared per cycle)
 *  A3  write reversible 'flagged for review' state for stale or unowned content
 *  A4  the cycle itself, with a report and exception list
 *  A5  proposals to the owner (enable a model, review a brief, retire content, raise or lower autonomy,
 *      fill a community gap). Proposals never self-apply; the owner accepts or rejects.
 *
 * Kill switch: operational retention still runs; no agent work follows it.
 */
import { z } from "zod";
import { scrubStaffCopy } from "@/lib/brand/lint";
import { BRIEFS } from "@/lib/content/briefs";
import { loadStaffContentSnapshot } from "@/lib/content/staff-publications";
import { scan } from "./a11y";
import { briefQualityCheck } from "./ci";
import { staleDetect, type StaleFlag } from "./librarian";
import {
  consultationRequestIsExpired,
  sweepExpiredConsultations,
} from "./intake";
import {
  buildHeadsUpPacket,
  isConsultRequest,
  prioritySignals,
  rankSuggest,
  type ConsultationRecord,
  type ConsultRequest,
} from "../consult/schema";
import { getStore } from "../memory/store";
import { organizationalBrief, organizationalMaintenance } from "../memory/organization";
import { purgeExpiredAskResponseRecords } from "../observability/ask-records";
import { agentAllowed, effectiveCeiling, getPolicy, setPolicy, type AutonomyPolicy } from "../policy";
import { resolveBinding, generativeStatus } from "../providers";
import { getAgent } from "../registry/agents";
import { getModel, STAFF_GENERATION_MODEL_ID } from "../registry/models";
import { newTraceId, runTool, ToolDenied } from "../tools/runtime";
import { autonomyRank, type Autonomy, type ToolContext } from "../types";

export type Proposal = {
  id: string;
  cycle_id: string;
  kind: "enable_model" | "review_brief" | "retire_content" | "raise_autonomy" | "lower_autonomy" | "content_gap" | "capacity" | "other";
  title: string;
  rationale: string;
  /** Policy patch applied if the owner accepts (only for policy-shaped proposals). */
  apply?: Partial<Pick<AutonomyPolicy, "max_autonomy" | "flags" | "agents">>;
  status: "proposed" | "accepted" | "rejected";
  created_at: string;
  decided_at?: string;
  decision_note?: string;
};

export type CycleReport = {
  id: string;
  at: string;
  by: "owner" | "cron";
  policy: { max_autonomy: Autonomy; killed: boolean };
  effective_ceiling: Autonomy;
  generative: boolean;
  steps: Array<{ name: string; autonomy: Autonomy; outcome: "done" | "skipped" | "denied"; detail: string }>;
  triaged: Array<{ request_id: string; from: string; to: string }>;
  expired_consultations: string[];
  refreshed_packets: string[];
  stale_flags: StaleFlag[];
  quality_problems: Array<{ id: string; problems: string[] }>;
  a11y: Array<{ id: string; blockers: number; should_fix: number }>;
  proposals: Proposal[];
  summary: string;
  exceptions: string[];
  undone?: { at: string; by: string };
};

const CycleSummarySchema = z.object({
  summary: z.string(),
  proposals: z.array(z.object({ title: z.string(), rationale: z.string() })).max(3),
});

function ctxFor(agentId: "program_orchestrator" | "consult_intake" | "librarian" | "content_sentinel" | "ci_guide" | "a11y_reviewer", trace_id: string): ToolContext {
  return { trace_id, agent: getAgent(agentId), dry_run: false, role: "owner" };
}

async function step<T>(report: CycleReport, name: string, autonomy: Autonomy, fn: () => Promise<T>): Promise<T | undefined> {
  try {
    const v = await fn();
    report.steps.push({ name, autonomy, outcome: "done", detail: typeof v === "string" ? v : "" });
    return v;
  } catch (e) {
    if (e instanceof ToolDenied) {
      report.steps.push({ name, autonomy, outcome: "denied", detail: e.reason });
    } else {
      report.steps.push({ name, autonomy, outcome: "denied", detail: e instanceof Error ? e.message : String(e) });
      report.exceptions.push(`${name}: ${e instanceof Error ? e.message : String(e)}`);
    }
    return undefined;
  }
}

export async function runCycle(by: CycleReport["by"]): Promise<CycleReport> {
  const policy = await getPolicy();
  const trace_id = newTraceId();
  const cycle_id = `cycle-${trace_id}`;
  const orch = ctxFor("program_orchestrator", trace_id);
  const ceiling = effectiveCeiling(orch.agent, policy);
  const report: CycleReport = {
    id: cycle_id,
    at: new Date().toISOString(),
    by,
    policy: { max_autonomy: policy.max_autonomy, killed: policy.killed },
    effective_ceiling: ceiling,
    generative: false,
    steps: [],
    triaged: [],
    expired_consultations: [],
    refreshed_packets: [],
    stale_flags: [],
    quality_problems: [],
    a11y: [],
    proposals: [],
    summary: "",
    exceptions: [],
  };

  if (policy.killed) {
    report.steps.push({ name: "kill switch check", autonomy: "A0", outcome: "skipped", detail: "Kill switch engaged; no agent action ran." });
  }

  // Retention is an operational privacy control, not an agent-authored decision.
  // It still runs when the AI kill switch is engaged so expired S3 text is not retained.
  await step(report, "apply consultation retention", "A0", async () => {
    const sweep = await sweepExpiredConsultations();
    report.expired_consultations.push(...sweep.redacted);
    return `${sweep.redacted.length} expired consultation record${sweep.redacted.length === 1 ? "" : "s"} redacted`;
  });

  // Expired abuse-control buckets and owner-session revocations are operational
  // security records, not program memory. Their cleanup also runs under the kill
  // switch and can only remove a revocation after its signed session has expired.
  await step(report, "purge expired security records", "A0", async () => {
    const removed = await getStore().purgeExpiredSecurityRecords();
    return `${removed.ownerSessionRevocations} expired owner-session revocation${removed.ownerSessionRevocations === 1 ? "" : "s"}, ${removed.rateLimitBuckets} expired rate-limit bucket${removed.rateLimitBuckets === 1 ? "" : "s"}, ${removed.auditEvents} expired audit event${removed.auditEvents === 1 ? "" : "s"}, ${removed.researchUsageRecords} expired research-usage record${removed.researchUsageRecords === 1 ? "" : "s"}, ${removed.consultationTombstones} terminal consultation tombstone${removed.consultationTombstones === 1 ? "" : "s"}, and ${removed.idempotencyReceipts} related replay receipt${removed.idempotencyReceipts === 1 ? "" : "s"} removed`;
  });

  await step(report, "purge expired named-session records", "A0", async () => {
    try {
      const result = await runProgramIdentityHousekeepingIfConfigured();
      return result.configured
        ? String(result.expiredInvitationsClosed) + " expired invitations closed; " + String(result.expiredSessionsDeleted) + " expired sessions removed"
        : "Named contributor storage is not configured.";
    } catch { throw new Error("Named contributor security cleanup failed."); }
  });
  await step(report, "purge expired ASK response records", "A0", async () => {
    try {
      const deleted = await purgeExpiredAskResponseRecords();
      return String(deleted) + " expired ASK response records removed";
    } catch {
      throw new Error("ASK response record cleanup failed.");
    }
  });

  if (policy.killed) {
    report.summary = `The kill switch is engaged. No agent action was taken. The required retention check redacted ${report.expired_consultations.length} expired consultation record${report.expired_consultations.length === 1 ? "" : "s"}.`;
    await getStore().put("decision", `cycle:${report.id}`, report);
    return report;
  }

  const admission = agentAllowed(orch.agent, policy);
  if (!admission.ok) {
    report.steps.push({ name: "orchestrator availability", autonomy: "A0", outcome: "denied", detail: admission.reason ?? "agent unavailable" });
    report.summary = "The orchestrator is disabled. Only operational retention and security cleanup ran.";
    await getStore().put("decision", `cycle:${report.id}`, report);
    return report;
  }

  const body = async () => {
    const store = getStore();
    const skip = (name: string, autonomy: Autonomy) => report.steps.push({ name, autonomy, outcome: "skipped", detail: `ceiling ${ceiling} is below ${autonomy}; observation and drafts only` });

    if (autonomyRank(ceiling) >= autonomyRank("A4")) {
      await step(report, "complete assigned program work", "A4", async () => {
        const work = await runProgramWork({ limit: 2 });
        for (const failure of work.failed) report.exceptions.push(`Program work ${failure.id}: ${failure.reason}`);
        return JSON.stringify(work);
      });
    }

    // A0: queue and content observations
    const queue = (await step(
      report,
      "read queue",
      "A0",
      () => runTool(orch, "queue.status_get", async () =>
        (await store.list<ConsultationRecord>("consult_request"))
          .filter(isConsultRequest)
          .filter((request) => !consultationRequestIsExpired(request))
          // Pending eligibility records are retained only for the limited
          // eligibility decision. They must not enter packet refresh,
          // ranking, triage, or proposal generation.
          .filter((request) => request.eligibility_status === "confirmed_dsd")),
    )) ?? [];
    const open = queue.filter((r) => !["completed", "declined", "withdrawn"].includes(r.status));
    const organization = { maintenance: organizationalMaintenance(), work: open.map(request => ({
      request_id: request.request_id,
      brief: organizationalBrief([request.work_name, request.goals, request.situation].join(" ")),
    })) };
    await step(report, "prepare DHS organizational context", "A0", () => runTool(orch, "corpus.search", () => JSON.stringify(organization), { contentIds: Array.from(new Set(organization.work.flatMap(item => item.brief.entries.map(entry => entry.id)))) }));
    if (organization.maintenance.refreshDue.length) report.exceptions.push("DHS organizational reference: " + organization.maintenance.refreshDue.length + " source checks are due; dated reference knowledge remains available.");

    const stale = (await step(report, "detect stale content", "A0", () => staleDetect(ctxFor("librarian", trace_id)))) ?? [];
    report.stale_flags = stale;

    await step(report, "check brief quality", "A0", () => runTool(ctxFor("ci_guide", trace_id), "community.brief_list", async () => {
      const bad = BRIEFS.map((b) => ({ id: b.id, q: briefQualityCheck(b) })).filter((x) => !x.q.ok);
      report.quality_problems = bad.map((b) => ({ id: b.id, problems: b.q.problems }));
      return `${BRIEFS.length - bad.length} of ${BRIEFS.length} briefs pass`;
    }));

    await step(report, "scan corpus accessibility", "A2", () => runTool(ctxFor("a11y_reviewer", trace_id), "a11y.scan_draft", async () => {
      const { items } = await loadStaffContentSnapshot({ scope: "dsd" });
      const rows = items.map((c) => {
        const d = scan({ text: [c.title, c.summary, ...c.body].join("\n\n"), artifactType: "document" });
        return { id: c.id, blockers: d.findings.filter((f) => f.severity === "blocker").length, should_fix: d.findings.filter((f) => f.severity === "should_fix").length };
      });
      report.a11y = rows.filter((r) => r.blockers || r.should_fix);
      return `${rows.length} items scanned; ${report.a11y.length} with findings`;
    }));

    // A2: refresh packets
    if (autonomyRank(ceiling) < autonomyRank("A2")) skip("refresh heads-up packets", "A2");
    else {
      await step(report, "refresh heads-up packets", "A2", async () => {
        const intake = ctxFor("consult_intake", trace_id);
        for (const r of open) {
          const at = new Date().toISOString();
          const packet = await runTool(intake, "intake.summary_pack", () => buildHeadsUpPacket(r, { request_id: r.request_id, created_at: r.created_at, status: r.status, signals: r.priority_signals }), { contentIds: [r.request_id] });
          const refreshed: ConsultRequest = {
            ...r,
            packet,
            updated_at: at,
            version: r.version + 1,
          };
          const applied = await store.compareAndSwapConsultation(
            r.request_id,
            {
              version: r.version,
              recordType: "consultation_request",
              retentionExpiresAt: r.retention_expires_at,
              guardAt: at,
              mutation: "system_packet_refresh",
            },
            refreshed,
          );
          if (applied.applied) report.refreshed_packets.push(r.request_id);
        }
        return `${report.refreshed_packets.length} packets refreshed`;
      });
    }

    // A3: triage
    if (autonomyRank(ceiling) < autonomyRank("A3")) {
      skip("triage queue (reversible)", "A3");
      skip("flag stale content (reversible)", "A3");
    } else {
      await step(report, "triage queue (reversible)", "A3", async () => {
        const intake = ctxFor("consult_intake", trace_id);
        // Only assign a priority pin when the owner has not already set one.
        // This gives undo a precise automation-owned field to clear without
        // overwriting later owner work.
        const received = open.filter((r) => r.status === "received" && r.pinned_order === undefined);
        const ordered = rankSuggest(open.map((r) => ({ ...r, priority_signals: prioritySignals(r) })));
        await runTool(intake, "queue.auto_triage", async () => {
          for (const r of received) {
            const at = new Date().toISOString();
            const stored = await store.get<ConsultationRecord>("consult_request", r.request_id);
            if (
              !isConsultRequest(stored)
              || consultationRequestIsExpired(stored)
              || stored.status !== "received"
            ) continue;
            const current = stored;
            const next: ConsultRequest = {
              ...current,
              status: "under_review",
              updated_at: at,
              version: current.version + 1,
              pinned_order: current.pinned_order ?? ordered.findIndex((o) => o.request_id === r.request_id) + 1,
              packet: { ...current.packet, snapshot: { ...current.packet.snapshot, Status: "Under review" } },
      history: [...current.history, { at, status: "under_review", by: "system", note: `Auto-triage by orchestrator cycle ${report.id}. Its priority pin can be cleared in the Consultant Workspace; status history remains intact.` }],
            };
            const applied = await store.compareAndSwapConsultation(
              r.request_id,
              {
                version: current.version,
                recordType: "consultation_request",
                retentionExpiresAt: current.retention_expires_at,
                guardAt: at,
                mutation: "system_triage",
              },
              next,
            );
            if (applied.applied) {
              report.triaged.push({ request_id: r.request_id, from: "received", to: "under_review" });
            }
          }
        }, { contentIds: received.map((r) => r.request_id) });
        return `${report.triaged.length} moved to Under review`;
      });

      await step(report, "flag stale content (reversible)", "A3", async () => {
        const lib = ctxFor("librarian", trace_id);
        await runTool(lib, "resource.stale_flag_state", async () => {
          for (const f of stale) {
            await store.put("decision", `stale_flag:${f.id}:${f.problem}`, { ...f, cycle_id: report.id, flagged_at: new Date().toISOString(), disposition: "pending" });
          }
        }, { contentIds: [...new Set(stale.map((s) => s.id))] });
        return `${stale.length} flags written`;
      });
    }

    // A5: proposals
    if (autonomyRank(ceiling) < autonomyRank("A5")) skip("write proposals", "A5");
    else {
      await step(report, "write proposals", "A5", async () => {
        const proposals = deriveProposals(report, open, policy);
        await runTool(orch, "proposal.write", async () => {
          for (const p of proposals) await store.put("decision", `proposal:${p.id}`, p);
        }, { contentIds: proposals.map((p) => p.id) });
        report.proposals = proposals;
        return `${proposals.length} proposals`;
      });
    }

    // Summary: generative when bound and callable, deterministic otherwise.
    const binding = resolveBinding(orch.agent);
    if (binding.generative) {
      try {
        const learningJourney = await runTool(orch, "corpus.search", async () =>
          getLearningJourneyContext((await indexedProgramResources("dsd")).destinations));
        const out = await runTool(orch, "answer.structured_draft", () =>
          binding.adapter.complete(
            {
              model_id: binding.model.model_id,
              system: "You write a short, plain-language operations summary for the practice owner of a Minnesota DHS staff resource program. No vendor or model names. No ranking of people. Up to 5 sentences. Then propose at most 3 additional owner decisions strictly grounded in the facts given; each with a one-sentence rationale. Organizational context identifies relevant functions and possible coordination needs, not completed outside contacts or delegated actions. Distinguish documented facts from suggested applications. Do not claim current facts from refresh-due entries. Pending accessibility metadata is a review follow-up, not evidence that content is unpublished or unavailable. Accessibility findings concern the program's own descriptions, not an inspection of external websites. Do not invent publication restrictions, service impacts, deadlines, or missing owners. Published learning guidance can inform support suggestions; it does not establish completed learning, changed practice, or an IDI orientation. Do not infer or diagnose individual developmental orientations or impose course prerequisites. Apply the supplied program training-credit rule accurately without inventing an exception. Return JSON.",
              user: JSON.stringify({ learningJourney, learningParticipation: trainingCreditContext(), organization: { maintenance: organization.maintenance, workBriefCount: organization.work.length, topics: Array.from(new Map(organization.work.flatMap(work => work.brief.entries.map(entry => [entry.id, entry] as const))).values()) }, triaged: report.triaged.length, refreshed: report.refreshed_packets.length, stale: report.stale_flags.map((s) => `${s.title}: ${s.problem}`), quality_problems: report.quality_problems, a11y: report.a11y, proposals: report.proposals.map((p) => p.title), open_requests: open.length }),
              schema: CycleSummarySchema,
              trace_id,
            },
            binding.model,
          ),
          { modelId: binding.model.model_id },
        );
        const parsed = CycleSummarySchema.safeParse(out.parsed);
        if (!parsed.success) throw new Error("generated_summary_rejected");
        if (parsed.success) {
          report.summary = scrubStaffCopy(parsed.data.summary);
          report.generative = true;
          // A summary is an A2 draft. Its embedded proposals still require A5,
          // including a fresh policy check after the provider returns.
          if (parsed.data.proposals.length) {
            await step(report, "write generated proposals", "A5", () => runTool(orch, "proposal.write", async () => {
              for (const p of parsed.data.proposals) {
                const prop: Proposal = { id: `${report.id}-g${report.proposals.length + 1}`, cycle_id: report.id, kind: "other", title: scrubStaffCopy(p.title), rationale: scrubStaffCopy(p.rationale), status: "proposed", created_at: new Date().toISOString() };
                await store.put("decision", `proposal:${prop.id}`, prop);
                report.proposals.push(prop);
              }
            }));
          }
        }
      } catch (e) {
        report.exceptions.push(`generative summary unavailable: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
    if (!report.summary) report.summary = deterministicSummary(report, open.length);
    await store.put("decision", `cycle:${report.id}`, report);
  };

  if (autonomyRank(ceiling) >= autonomyRank("A4")) {
    await runTool(orch, "orchestrator.run_cycle", body, { contentIds: [] });
  } else {
    report.steps.push({ name: "bounded workflow", autonomy: "A4", outcome: "skipped", detail: `ceiling ${ceiling} is below A4; running observation and drafts only` });
    await body();
  }

  return report;
}

function deterministicSummary(r: CycleReport, openCount: number): string {
  const parts = [
    `Cycle ran at effective ceiling ${r.effective_ceiling}.`,
    `${openCount} open request${openCount === 1 ? "" : "s"}; ${r.triaged.length} moved to Under review; ${r.refreshed_packets.length} packet${r.refreshed_packets.length === 1 ? "" : "s"} refreshed.`,
    `${r.stale_flags.length} content currency flag${r.stale_flags.length === 1 ? "" : "s"}; ${r.quality_problems.length} brief quality problem${r.quality_problems.length === 1 ? "" : "s"}; ${r.a11y.length} corpus item${r.a11y.length === 1 ? "" : "s"} with accessibility findings.`,
    `${r.proposals.length} proposal${r.proposals.length === 1 ? "" : "s"} waiting for your decision.`,
  ];
  if (r.exceptions.length) parts.push(`${r.exceptions.length} exception${r.exceptions.length === 1 ? "" : "s"} need review.`);
  return parts.join(" ");
}

function deriveProposals(r: CycleReport, open: ConsultRequest[], policy: AutonomyPolicy): Proposal[] {
  const out: Proposal[] = [];
  const now = new Date().toISOString();
  const mk = (kind: Proposal["kind"], title: string, rationale: string, apply?: Proposal["apply"]): Proposal => ({ id: `${r.id}-p${out.length + 1}`, cycle_id: r.id, kind, title, rationale, apply, status: "proposed", created_at: now });

  const gen = generativeStatus();
  const staffModel = getModel(STAFF_GENERATION_MODEL_ID);
  if (!gen.credential) {
    out.push(mk("enable_model", "Add a server-side model credential to switch Ask and cycle summaries from the fixture composer to generated drafts", `The generative flag is ${gen.pilotFlag ? "on" : "off"} but no credential is present, so drafting runs on the deterministic composer. Registry record ${staffModel?.model_id ?? "n/a"} is ${staffModel?.approval_state ?? "n/a"}.`));
  }
  for (const q of r.quality_problems) out.push(mk("review_brief", `Review the ${q.id} brief: ${q.problems.join("; ")}`, "Brief quality criteria (CI-E4) are not met; a human owner must revise before it is used as orientation."));
  const past = r.stale_flags.filter((s) => s.problem === "past_review_date");
  if (past.length) out.push(mk("retire_content", `Disposition ${past.length} item${past.length === 1 ? "" : "s"} past review date`, `Flagged for review: ${past.map((p) => p.title).join("; ")}. Missing context never auto-removes; you decide hold, revise, or retire.`));
  const pendingA11y = r.stale_flags.filter((s) => s.problem === "accessibility_pending").length;
  if (pendingA11y) out.push(mk("other", `Complete accessibility review for ${pendingA11y} external reference item${pendingA11y === 1 ? "" : "s"}`, "These records carry an accessibility status of pending. Confirm the review evidence; this status alone does not establish whether a resource is published or available."));
  const gaps = open.filter((o) => o.packet.risks_unknowns.some((x) => /no brief matched/i.test(x)));
  if (gaps.length) out.push(mk("content_gap", `Community brief gap named in ${gaps.length} open request${gaps.length === 1 ? "" : "s"}`, `Requests ${gaps.map((g) => g.request_id).join(", ")} name a Minnesota community with no approved brief. Commission a brief through the partner-informed path rather than filling it with assumptions.`));
  const aging = open.filter((o) => Date.now() - new Date(o.created_at).getTime() > 3 * 86400000 && o.status !== "scheduled" && o.status !== "in_progress");
  if (aging.length >= 3) out.push(mk("capacity", `${aging.length} requests older than three days without a scheduled consult`, "The DSD pilot guidance target is acknowledgment within three business days. Consider capacity or a decline-with-redirect pass."));
  if (autonomyRank(policy.max_autonomy) < autonomyRank("A4")) out.push(mk("raise_autonomy", `Raise the policy ceiling from ${policy.max_autonomy} to A4 so cycles can triage and flag on their own`, "At the current ceiling the cycle observes and drafts but cannot act. Accepting applies the policy change; you can lower it again at any time.", { max_autonomy: "A4" }));
  return out;
}

/**
 * Clear reversible automation-owned metadata and stale flags from a cycle.
 * Consultation lifecycle history is append-only, so an Under review status is
 * never moved backward to Received and no history entry is erased.
 */
export async function undoCycle(cycleId: string, by: string): Promise<{ ok: boolean; reverted: number; reason?: string }> {
  const store = getStore();
  const report = await store.get<CycleReport>("decision", `cycle:${cycleId}`);
  if (!report) return { ok: false, reverted: 0, reason: "cycle not found" };
  let reverted = 0;
  for (const t of report.triaged) {
    const stored = await store.get<ConsultationRecord>("consult_request", t.request_id);
    if (!isConsultRequest(stored) || consultationRequestIsExpired(stored) || stored.status !== "under_review") continue;
    const r = stored;
    const triageEvent = r.history.at(-1);
    const expectedNote = `Auto-triage by orchestrator cycle ${cycleId}. Its priority pin can be cleared in the Consultant Workspace; status history remains intact.`;
    // A later correction or owner edit changes updated_at. Refuse to clear the
    // pin in that case because it may no longer be automation-owned.
    if (
      r.pinned_order === undefined
      || triageEvent?.at !== r.updated_at
      || triageEvent.by !== "system"
      || triageEvent.status !== "under_review"
      || triageEvent.note !== expectedNote
    ) continue;
    const at = new Date().toISOString();
    const next: ConsultRequest = {
      ...r,
      pinned_order: undefined,
      updated_at: at,
      version: r.version + 1,
    };
    const applied = await store.compareAndSwapConsultation(
      t.request_id,
      {
        version: r.version,
        recordType: "consultation_request",
        retentionExpiresAt: r.retention_expires_at,
        guardAt: at,
        mutation: "owner_update",
      },
      next,
    );
    if (applied.applied) reverted++;
  }
  for (const f of report.stale_flags) {
    const key = `stale_flag:${f.id}:${f.problem}`;
    const rec = await store.get<{ cycle_id: string }>("decision", key);
    if (rec?.cycle_id === cycleId) {
      await store.put("decision", key, { ...rec, disposition: "undone", undone_at: new Date().toISOString() });
      reverted++;
    }
  }
  await store.put("decision", `cycle:${cycleId}`, { ...report, undone: { at: new Date().toISOString(), by } });
  return { ok: true, reverted };
}

/** Cycle reports are the decision records that carry a steps array and a timestamp; proposals share the id prefix and are excluded. */
export async function listCycles(limit = 10): Promise<CycleReport[]> {
  const all = await getStore().list<Partial<CycleReport> & { id?: unknown }>("decision");
  return all
    .filter((d): d is CycleReport => typeof d.id === "string" && d.id.startsWith("cycle-") && Array.isArray(d.steps) && typeof d.at === "string")
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, limit);
}

export async function listProposals(): Promise<Proposal[]> {
  const all = await getStore().list<Partial<Proposal> & { id?: unknown }>("decision");
  return all
    .filter((d): d is Proposal => typeof d.id === "string" && typeof d.cycle_id === "string" && typeof d.status === "string" && typeof d.created_at === "string")
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

/** Owner decides. Accepted policy-shaped proposals apply through setPolicy (the only way autonomy changes). */
export async function decideProposal(id: string, decision: "accepted" | "rejected", note: string | undefined, ctx: ToolContext): Promise<Proposal | null> {
  const store = getStore();
  const p = await store.get<Proposal>("decision", `proposal:${id}`);
  if (!p) return null;
  return runTool(ctx, "proposal.decide", async () => {
    const next: Proposal = { ...p, status: decision, decided_at: new Date().toISOString(), decision_note: note };
    await store.put("decision", `proposal:${id}`, next);
    if (decision === "accepted" && p.apply) await setPolicy(p.apply, "owner");
    if (decision === "rejected") await store.put("decision", `rejected_rec:${id}`, { id, at: next.decided_at, title: p.title, note });
    return next;
  }, { contentIds: [id], humanDisposition: decision === "accepted" ? "approve" : "reject" });
}
