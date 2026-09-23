"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Notice } from "@/components/ui";
import type { CycleReport, Proposal } from "@/lib/intelligence/agents/cycle";
import type { AutonomyPolicy } from "@/lib/intelligence/policy";
import { AUTONOMY_ORDER, type Autonomy } from "@/lib/intelligence/types";

type AgentRow = { agent_id: string; staff_label: string; ceiling: Autonomy; enabled: boolean; purpose: string };
type FlagRow = { key: string; description: string; value: boolean; source: string };

const LADDER: Record<Autonomy, string> = {
  A0: "Review only — read, organize, and summarize",
  A1: "Suggestions — recommend next steps for your decision",
  A2: "Editable drafts — prepare work for your approval",
  A3: "Limited action — organize and route work, with a way to reverse it",
  A4: "Approved program review — complete agreed steps with checks and a way to reverse them",
  A5: "Improvement proposals — prepare program changes for your approval",
};

const PROPOSAL_KIND: Record<string, string> = {
  enable_model: "Drafting connection",
  review_brief: "Community brief",
  retire_content: "Content review",
  raise_autonomy: "Work level",
  lower_autonomy: "Work level",
  content_gap: "Missing program content",
  capacity: "Consultation capacity",
  other: "Program improvement",
};

const STEP_NAME: Record<string, string> = {
  "kill switch check": "Confirm whether program reviews are paused",
  "read queue": "Review consultation requests",
  "detect stale content": "Find content that may be out of date",
  "check brief quality": "Review community briefs",
  "scan corpus accessibility": "Review program content for accessibility",
  "refresh heads-up packets": "Update heads-up packets",
  "triage queue (reversible)": "Move new requests to Under review",
  "flag stale content (reversible)": "Mark content that needs review",
  "write proposals": "Prepare recommendations for your decision",
  "bounded workflow": "Complete the full program review",
};

const FEATURE_COPY: Record<string, { label: string; description: string }> = {
  "agent.content_sentinel": { label: "Review dates and missing owners", description: "Points out content that may be out of date or does not name a responsible owner." },
  "agent.eval_steward_write": { label: "Save readiness results and improvement proposals", description: "Keeps readiness results and proposals for your review." },
  "model.generative_pilot": { label: "Connected drafting support", description: "Uses the approved drafting connection when its private key is present. Otherwise, standard program wording remains in use." },
  "autonomy.a3_calendar_schedule": { label: "Calendar scheduling", description: "Reserved for a future calendar connection. It is not ready for use." },
  "autonomy.a3_stale_flag": { label: "Mark content for review", description: "Adds a reversible review note to content that may be out of date." },
  "tool.browser_fetch_public": { label: "Read public web pages", description: "Planned option for reading approved public pages. It is not ready for use." },
  "tool.office_drafts": { label: "Microsoft document drafting", description: "Planned option for preparing Microsoft document drafts. It is not ready for use." },
  "tool.publish_chain": { label: "Publishing approval steps", description: "Planned publishing steps that always need your approval. It is not ready for use." },
  "surface.ecosystem_intelligence": { label: "Ecosystem intelligence views", description: "Reserved for future pilot views. They are not ready for use." },
};

const SUPPORT_DESCRIPTION: Record<string, string> = {
  program_orchestrator: "Coordinates program reviews and brings proposed changes to you.",
  ask_concierge: "Helps staff find reliable guidance and routes questions the program cannot answer.",
  ci_guide: "Helps staff use Minnesota community briefs without stereotyping or profiling.",
  librarian: "Suggests how resources should be described, organized, and reviewed.",
  a11y_reviewer: "Reviews drafts for clarity and accessibility concerns.",
  consult_intake: "Helps staff prepare consultation requests and gives you a clear summary.",
  graduation_coach: "Helps staff choose next steps and build independent practice.",
  embed_advisor: "Offers equity questions for planning programs, policies, and services.",
  content_sentinel: "Points out content that may be out of date or missing an owner.",
  eval_steward: "Runs readiness checks and brings possible improvements to you.",
};

const SOURCE_LABEL: Record<string, string> = {
  default: "Program starting setting",
  env: "Private hosting setting",
  owner: "Changed by you",
};

function ownerText(value: string) {
  return value
    .replace(/server-side model credential/gi, "private drafting key")
    .replace(/generated drafts/gi, "connected drafting support")
    .replace(/generative flag/gi, "drafting setting")
    .replace(/generative summary/gi, "connected drafting summary")
    .replace(/fixture composer/gi, "standard program wording")
    .replace(/deterministic composer/gi, "standard program wording")
    .replace(/registry record/gi, "connection record")
    .replace(/mdl_[a-z0-9_-]+/gi, "the approved drafting connection")
    .replace(/brief quality criteria \(CI-E4\)/gi, "community brief review standards")
    .replace(/release gate/gi, "required review")
    .replace(/policy ceiling/gi, "selected work level")
    .replace(/effective ceiling/gi, "selected work level")
    .replace(/\bceiling\b/gi, "work level")
    .replace(/\borchestrator\b/gi, "program review")
    .replace(/\bagent action\b/gi, "program work")
    .replace(/\bkill switch\b/gi, "emergency stop")
    .replace(/\btriage\b/gi, "organize")
    .replace(/\bcorpus\b/gi, "program library")
    .replace(/\bstale\b/gi, "possibly out-of-date")
    .replace(/\bflags written\b/gi, "items marked for review")
    .replace(/\bn\/a\b/gi, "not available");
}

function cycleSummary(report: CycleReport) {
  const parts = [
    `${report.refreshed_packets.length} heads-up packet${report.refreshed_packets.length === 1 ? " was" : "s were"} updated`,
    `${report.triaged.length} new request${report.triaged.length === 1 ? " was" : "s were"} moved to Under review`,
    `${report.stale_flags.length} content item${report.stale_flags.length === 1 ? "" : "s"} may need a currency review`,
    `${report.a11y.length} content item${report.a11y.length === 1 ? " has" : "s have"} accessibility findings`,
    `${report.proposals.length} recommendation${report.proposals.length === 1 ? " is" : "s are"} waiting for your decision`,
  ];
  return `${parts.join("; ")}.`;
}

function settingChanges(proposal: Proposal) {
  if (!proposal.apply) return [];
  const changes: string[] = [];
  if (proposal.apply.max_autonomy) changes.push(`Highest work level: ${LADDER[proposal.apply.max_autonomy]}`);
  for (const [key, value] of Object.entries(proposal.apply.flags ?? {})) changes.push(`${FEATURE_COPY[key]?.label ?? key}: ${value ? "on" : "off"}`);
  for (const [key, value] of Object.entries(proposal.apply.agents ?? {})) {
    if (value.enabled !== undefined) changes.push(`${key.replace(/_/g, " ")}: ${value.enabled ? "available" : "off"}`);
    if (value.ceiling) changes.push(`${key.replace(/_/g, " ")} work level: ${LADDER[value.ceiling]}`);
  }
  return changes;
}

export function OrchestratorClient({ policy, cycles, proposals, agents, flags, generative, scheduleReady }: { policy: AutonomyPolicy; cycles: CycleReport[]; proposals: Proposal[]; agents: AgentRow[]; flags: FlagRow[]; generative: { pilotFlag: boolean; credential: boolean; active: boolean }; scheduleReady: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState("");
  const [report, setReport] = useState<CycleReport | null>(cycles[0] ?? null);

  async function post(body: Record<string, unknown>, label: string) {
    setBusy(label);
    setMsg("");
    try {
      const res = await fetch("/api/consultant/orchestrator", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) setMsg("That change could not be completed. Review the current setting and try again.");
      else {
        if (data.report) setReport(data.report as CycleReport);
        setMsg(`${label}.`);
        router.refresh();
      }
    } catch {
      setMsg("That change could not be completed. Please try again.");
    } finally {
      setBusy("");
    }
  }

  const open = proposals.filter((p) => p.status === "proposed");
  const decided = proposals.filter((p) => p.status !== "proposed").slice(0, 10);

  return (
    <div className="space-y-8">
      <section className={`card ${policy.killed ? "notice--stop" : ""}`} aria-labelledby="ctl">
        <p className="kicker">Your program boundaries</p>
        <h2 id="ctl" className="text-2xl font-extrabold">
          {policy.killed ? "Program reviews are paused" : `Program reviews may work at ${LADDER[policy.max_autonomy]}`}
        </h2>
        <p className="text-sm text-muted">
          {policy.updated_at === new Date(0).toISOString()
            ? "These are the starting boundaries for this workspace."
            : `These boundaries were last changed by ${policy.by === "owner" ? "you" : "the program"} on ${new Date(policy.updated_at).toLocaleString()}.`} {policy.note ? `Note: ${ownerText(policy.note)}` : ""}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {policy.killed ? (
            <button type="button" className="btn btn--secondary" disabled={Boolean(busy)} onClick={() => post({ action: "kill", killed: false }, "Program reviews resumed")}>
              Resume program reviews
            </button>
          ) : (
            <button type="button" className="btn btn--primary" style={{ background: "var(--red-strong)", borderColor: "var(--red-strong)" }} disabled={Boolean(busy)} onClick={() => confirm("Pause program reviews now? Staff can still browse and search, and you can resume reviews at any time.") && post({ action: "kill", killed: true }, "Program reviews paused")}>
              Pause program reviews
            </button>
          )}
          <label className="flex items-center gap-2 font-bold">
            Highest work level allowed
            <select value={policy.max_autonomy} disabled={Boolean(busy)} onChange={(e) => post({ action: "ceiling", max_autonomy: e.target.value }, `Work level changed to ${LADDER[e.target.value as Autonomy] ?? e.target.value}`)} className="min-h-11 rounded border border-gray-400 p-2 font-normal">
              {AUTONOMY_ORDER.map((a) => (
                <option key={a} value={a}>
                  {LADDER[a]}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="btn btn--light" disabled={Boolean(busy) || policy.killed} onClick={() => post({ action: "run" }, "Program review")}>
            {busy === "Program review" ? "Reviewing current work" : "Review current work now"}
          </button>
        </div>
        {msg ? (
          <p className="mt-2 text-sm" role="status">
            {msg}
          </p>
        ) : null}
        <p className="mt-3 text-sm">
          {generative.active ? "Connected drafting support is available." : "The program's standard wording will be used for drafts."} {scheduleReady ? "The access key for scheduled reviews is in place. Check the review history to see whether scheduled reviews have run." : "The daily review is not connected yet; you can still review current work here at any time."}
        </p>
        <details className="mt-2 text-sm">
          <summary>Setup details for scheduled reviews</summary>
          <p className="mb-0">The program asks its host to run a review every day at 12:00 UTC. The host has to switch that schedule on, and each scheduled run has to present the access key. Access key for scheduled reviews: {scheduleReady ? "in place" : "missing"}. This setting alone does not confirm that a scheduled review has run.</p>
        </details>
      </section>

      <section aria-labelledby="props">
        <h2 id="props" className="text-2xl font-extrabold">
          Changes waiting for your decision ({open.length})
        </h2>
        {open.length ? (
          <ul className="mt-3 list-none space-y-3 p-0">
            {open.map((p) => (
              <li key={p.id} className="card">
                <p className="kicker">{PROPOSAL_KIND[p.kind] ?? "Program improvement"}</p>
                <p className="m-0 font-bold">{ownerText(p.title)}</p>
                <p className="m-0 text-sm">{ownerText(p.rationale)}</p>
                {settingChanges(p).length ? (
                  <div className="mt-2 text-sm text-muted">
                    <p className="m-0 font-bold">What will change if you accept</p>
                    <ul className="m-0 list-disc pl-5">
                      {settingChanges(p).map((change) => <li key={change}>{change}</li>)}
                    </ul>
                  </div>
                ) : null}
                <details className="mt-2 text-xs">
                  <summary>Reference numbers</summary>
                  <p className="mb-0">Recommendation: {p.id}<br />Program review: {p.cycle_id}</p>
                </details>
                <div className="mt-2 flex gap-2">
                  <button type="button" className="btn btn--secondary" disabled={Boolean(busy)} onClick={() => post({ action: "decide", proposal_id: p.id, decision: "accepted" }, "Recommendation accepted")}>
                    Accept
                  </button>
                  <button type="button" className="btn btn--light" disabled={Boolean(busy)} onClick={() => post({ action: "decide", proposal_id: p.id, decision: "rejected", note: prompt("Add a note about your decision (optional)") ?? undefined }, "Recommendation declined")}>
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">There are no changes waiting for your decision. Start a program review whenever you want current work looked over.</p>
        )}
        {decided.length ? (
          <details className="mt-3">
            <summary>Earlier decisions ({decided.length})</summary>
            <ul className="list-disc pl-6 text-sm">
              {decided.map((p) => (
                <li key={p.id}>
                  {p.status === "accepted" ? "Accepted" : "Rejected"}: {ownerText(p.title)}
                  {p.decision_note ? ` (${p.decision_note})` : ""}
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </section>

      <section aria-labelledby="last">
        <h2 id="last" className="text-2xl font-extrabold">
          Latest program review
        </h2>
        {report ? (
          <div className="card mt-3">
            <p className="kicker">
              {new Date(report.at).toLocaleString()} · started by {report.by === "owner" ? "you" : "the daily schedule"} · {LADDER[report.effective_ceiling]}
              {report.undone ? " · reversible suggestions cleared" : ""}
            </p>
            <p className="font-bold">{cycleSummary(report)}</p>
            {report.exceptions.length ? (
              <Notice tone="warn">
                <details>
                  <summary>{report.exceptions.length} item{report.exceptions.length === 1 ? "" : "s"} need your attention</summary>
                  <ul className="mb-0 list-disc pl-5">
                    {report.exceptions.map((item) => <li key={item}>{ownerText(item)}</li>)}
                  </ul>
                </details>
              </Notice>
            ) : null}
            {report.triaged.length ? (
              <p className="mt-2 text-sm">
                Consultation requests updated: {report.triaged.map((t) => `${t.request_id} (${t.from.replace(/_/g, " ")} to ${t.to.replace(/_/g, " ")})`).join("; ")}
              </p>
            ) : null}
            {report.stale_flags.length ? (
              <p className="mt-1 text-sm">
                Content review notes: {report.stale_flags.map((f) => `${f.title}: ${ownerText(f.problem.replace(/_/g, " "))}`).join("; ")}
              </p>
            ) : null}
            {report.a11y.length ? (
              <p className="mt-1 text-sm">
                Accessibility findings in program content: {report.a11y.map((a) => `${a.id} (${a.blockers} blocker, ${a.should_fix} should fix)`).join("; ")}
              </p>
            ) : null}
            <details className="mt-3">
              <summary>Review how this program review ran</summary>
              <p className="mt-2 text-xs text-muted">Reference number: {report.id}. {report.generative ? "Connected drafting support prepared the original summary." : "Standard program wording prepared the original summary."}</p>
              <div className="overflow-x-auto">
                <table className="data mt-2">
                  <thead>
                    <tr>
                      <th scope="col">Part of the review</th>
                      <th scope="col">Work level</th>
                      <th scope="col">Result</th>
                      <th scope="col">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.steps.map((step, index) => (
                      <tr key={index}>
                        <td>{STEP_NAME[step.name] ?? ownerText(step.name)}</td>
                        <td>{LADDER[step.autonomy]}</td>
                        <td>{step.outcome === "done" ? "Completed" : step.outcome === "skipped" ? "Not needed at this work level" : "Not permitted"}</td>
                        <td className="text-xs">{ownerText(step.detail)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
            {!report.undone && (report.triaged.length || report.stale_flags.length) ? (
              <button type="button" className="btn btn--light mt-3" disabled={Boolean(busy)} onClick={() => confirm("Clear the priority pins and content review notes this review added? Consultation status history will stay intact.") && post({ action: "undo", cycle_id: report.id }, "Reversible suggestions cleared")}>
                Clear reversible suggestions
              </button>
            ) : null}
          </div>
        ) : (
          <p className="text-muted">No program review has been run in this workspace yet.</p>
        )}
        {cycles.length > 1 ? (
          <details className="mt-3">
            <summary>Earlier program reviews ({cycles.length - 1})</summary>
            <ul className="list-disc pl-6 text-sm">
              {cycles.slice(1).map((c) => (
                <li key={c.id}>
                  {new Date(c.at).toLocaleString()} by {c.by === "owner" ? "you" : "the daily schedule"}: {cycleSummary(c)}
                  {c.undone ? " (reversible suggestions cleared)" : ""}
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </section>

      <section aria-labelledby="support-areas">
        <h2 id="support-areas" className="text-2xl font-extrabold">
          Program support areas
        </h2>
        <p className="text-sm text-muted">Choose which areas may help and how independently each may work. The strictest limit always applies: the area’s built-in limit, the limit you choose here, or the overall workspace limit.</p>
        <table className="data mt-3">
          <thead>
            <tr>
              <th scope="col">Area</th>
              <th scope="col">Built-in limit</th>
              <th scope="col">Availability</th>
              <th scope="col">Your limit</th>
              <th scope="col">Reference</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((a) => {
              const o = policy.agents[a.agent_id as keyof AutonomyPolicy["agents"]] ?? {};
              const enabled = o.enabled ?? a.enabled;
              return (
                <tr key={a.agent_id}>
                  <td>
                    {a.staff_label}
                    <span className="block text-xs text-muted">{SUPPORT_DESCRIPTION[a.agent_id] ?? ownerText(a.purpose)}</span>
                  </td>
                  <td className="text-xs">{LADDER[a.ceiling]}</td>
                  <td>
                    <button type="button" className="btn btn--light" style={{ minHeight: 36 }} disabled={Boolean(busy)} onClick={() => post({ action: "agent", agent_id: a.agent_id, enabled: !enabled }, `${a.staff_label} turned ${enabled ? "off" : "on"}`)}>
                      {enabled ? "Available — select to turn off" : "Off — select to make available"}
                    </button>
                  </td>
                  <td>
                    <select aria-label={`Work limit for ${a.staff_label}`} value={o.ceiling ?? ""} disabled={Boolean(busy)} onChange={(e) => post({ action: "agent", agent_id: a.agent_id, ceiling: e.target.value || null }, `${a.staff_label} work limit changed`)} className="min-h-9 rounded border border-gray-400 p-1">
                      <option value="">Use the standard limit</option>
                      {AUTONOMY_ORDER.map((l) => (
                        <option key={l} value={l}>
                          {LADDER[l]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="text-xs">
                    <details>
                      <summary>Show details</summary>
                      <p className="mb-0">Identifier: {a.agent_id}</p>
                    </details>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section aria-labelledby="flags">
        <h2 id="flags" className="text-2xl font-extrabold">
          Optional features and pilots
        </h2>
        <p className="text-sm text-muted">A selected option may still need a connection or unfinished work before it can be used. Items described as planned remain unavailable until they are built and checked.</p>
        <table className="data mt-3">
          <thead>
            <tr>
              <th scope="col">Feature</th>
              <th scope="col">Setting</th>
              <th scope="col">Set by</th>
              <th scope="col">Change here</th>
              <th scope="col">Reference</th>
            </tr>
          </thead>
          <tbody>
            {flags.map((f) => {
              const copy = FEATURE_COPY[f.key] ?? { label: f.key.replace(/[._-]+/g, " "), description: f.description };
              const draftingStatus = f.key === "model.generative_pilot" && f.value ? (generative.active ? "Available" : "Selected, but not connected") : null;
              return (
                <tr key={f.key}>
                  <td>
                    {copy.label}
                    <span className="block text-xs text-muted">{copy.description}</span>
                  </td>
                  <td>{draftingStatus ?? (f.value ? "Selected" : "Off")}</td>
                  <td>{SOURCE_LABEL[f.source] ?? f.source}</td>
                  <td className="flex flex-wrap gap-1">
                    <button type="button" className="btn btn--light" style={{ minHeight: 32 }} disabled={Boolean(busy)} onClick={() => post({ action: "flag", key: f.key, value: true }, `${copy.label} selected`)}>
                      Turn on
                    </button>
                    <button type="button" className="btn btn--light" style={{ minHeight: 32 }} disabled={Boolean(busy)} onClick={() => post({ action: "flag", key: f.key, value: false }, `${copy.label} turned off`)}>
                      Turn off
                    </button>
                    <button type="button" className="btn btn--light" style={{ minHeight: 32 }} disabled={Boolean(busy)} onClick={() => post({ action: "flag", key: f.key, value: null }, `${copy.label} returned to its starting setting`)}>
                      Use starting setting
                    </button>
                  </td>
                  <td className="text-xs">
                    <details>
                      <summary>Show details</summary>
                      <p className="mb-0">Identifier: {f.key}</p>
                    </details>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
