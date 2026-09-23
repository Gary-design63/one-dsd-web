import type { Metadata } from "next";
import { PageIntro } from "@/components/ui";
import { ownerPageGuard } from "@/lib/auth/owner-page";
import { AGENTS } from "@/lib/intelligence/registry/agents";
import { getStore } from "@/lib/intelligence/memory/store";

export const metadata: Metadata = { title: "Activity record" };
export const dynamic = "force-dynamic";

const WORK_LEVEL: Record<string, string> = {
  A0: "Review only",
  A1: "Suggestions",
  A2: "Editable drafts",
  A3: "Limited action that can be reversed",
  A4: "Approved program review",
  A5: "Improvement proposals",
};

const PERMISSION: Record<string, string> = {
  always: "May run within its safeguards",
  with_preview: "Preview required",
  human_approve: "A person must approve",
  owner_only: "Only you may run it",
};

const SAFETY_STOP: Record<string, string> = {
  pii_detected: "Private information detected",
  hr_complaint_redirect: "Workplace concern redirected",
  surveillance_refused: "Employee monitoring refused",
  persona_refused: "Impersonation refused",
  publish_refused: "Publishing without approval refused",
  tribal_gate: "Tribal guidance requires review",
  legal_invention_refused: "Unsupported legal guidance refused",
};

function readable(value: string | undefined) {
  if (!value) return "";
  const words = value
    .replace(/[._-]+/g, " ")
    .replace(/\bpii\b/gi, "private information")
    .replace(/\ba11y\b/gi, "accessibility")
    .replace(/\beval\b/gi, "readiness check")
    .replace(/\bcorpus\b/gi, "program library")
    .replace(/\bstale\b/gi, "out-of-date")
    .trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export default async function AuditPage() {
  if (!(await ownerPageGuard())) return null;
  const events = await getStore().listAudit(200);
  const refusals = events.filter((e) => e.safety_refusal_code);
  const byCode = refusals.reduce<Record<string, number>>((acc, e) => ((acc[e.safety_refusal_code!] = (acc[e.safety_refusal_code!] ?? 0) + 1), acc), {});
  return (
    <>
      <PageIntro kicker="For your review" title="Activity record" lede="See what the program did, the boundaries it followed, and how each action ended. This record keeps enough detail to look into a problem, but it does not keep the request itself. Safety stops can reveal misuse or a rule that needs adjusting; they are never used to measure people." />
      <div className="wrap py-8">
        <div className="panel mb-6 text-sm">
          <p className="kicker">Safety stops among the last {events.length} activities</p>
          <p className="m-0">{Object.keys(byCode).length ? Object.entries(byCode).map(([k, v]) => `${SAFETY_STOP[k] ?? readable(k)}: ${v}`).join(" · ") : "None"}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="data">
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Reference</th>
                <th scope="col">Program area</th>
                <th scope="col">Action</th>
                <th scope="col">Work level</th>
                <th scope="col">Approval rule</th>
                <th scope="col">Permitted</th>
                <th scope="col">Safety stop</th>
                <th scope="col">Result</th>
                <th scope="col">Duration</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.trace_id + e.span_id}>
                  <td className="text-xs">{new Date(e.at).toLocaleTimeString()}</td>
                  <td className="text-xs">{e.trace_id.slice(0, 8)}</td>
                  <td className="text-xs">{e.agent_id === "system" ? "Program" : AGENTS.find((a) => a.agent_id === e.agent_id)?.staff_label ?? readable(e.agent_id)}</td>
                  <td className="text-xs">{readable(e.tool_name)}</td>
                  <td>{WORK_LEVEL[e.autonomy_level_used] ?? e.autonomy_level_used}</td>
                  <td className="text-xs">{PERMISSION[e.permission_mode] ?? readable(e.permission_mode)}</td>
                  <td className="text-xs">{e.allowlist_hit ? "Yes" : `No${e.allowlist_miss_reason ? `: ${readable(e.allowlist_miss_reason)}` : ""}`}</td>
                  <td className="text-xs">{e.safety_refusal_code ? SAFETY_STOP[e.safety_refusal_code] ?? readable(e.safety_refusal_code) : "None"}</td>
                  <td className="text-xs">{e.ok ? "Completed" : `Needs attention${e.error_code ? `: ${readable(e.error_code)}` : ""}`}</td>
                  <td className="text-xs">{e.latency_ms === undefined ? "" : `${e.latency_ms} ms`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!events.length ? <p className="text-muted">No activity has been recorded here yet.</p> : null}
      </div>
    </>
  );
}
