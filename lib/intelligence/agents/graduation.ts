/**
 * Learning Path / Graduation Coach (A1 to A2) and Program Embed Advisor helpers.
 * learn.path_recommend, graduation.next_practice, self-check evaluation.
 */
import type { AskIntent } from "@/lib/content/types";
import { getPath, GRADUATION_PATHS, ROUTING_SIGNALS, type GraduationPath, type RubricKey } from "@/lib/content/paths";
import { EQUITY_IMPACT_QUESTIONS, INVOLVEMENT_ROLES, JOURNEY_BURDEN_PROMPTS, questionBank, type LaunchType, type Stage } from "@/lib/content/question-banks";
import { piiDetect } from "../safety";

/** learn.path_recommend: optional recommendations with a reason (STAFF-02). */
export function pathRecommend(signalIds: string[]): Array<{ path?: GraduationPath; route?: { href: string; label: string }; why: string; escalate?: boolean }> {
  const out: Array<{ path?: GraduationPath; route?: { href: string; label: string }; why: string; escalate?: boolean }> = [];
  for (const id of signalIds) {
    const s = ROUTING_SIGNALS.find((x) => x.id === id);
    if (!s) continue;
    if (s.route.kind === "path") out.push({ path: getPath(s.route.id), why: s.note });
    else if (s.route.kind === "route") out.push({ route: { href: s.route.href, label: s.route.label }, why: s.note });
    else out.push({ route: { href: s.route.href, label: s.route.label }, why: s.note, escalate: true });
  }
  return out;
}

/** graduation.next_practice: independent next actions before optional consult (KPI-11). */
export function nextPractice(intent: AskIntent, pathId?: string): Array<{ label: string; href: string }> {
  const path = pathId ? getPath(pathId) : undefined;
  const out: Array<{ label: string; href: string }> = [];
  if (path) out.push({ label: `Continue your ${path.artifactTitle.toLowerCase()} (${path.staffLabel})`, href: `/practice/${path.id}` });
  switch (intent) {
    case "launch_embed":
      out.push({ label: "Equity and access checklist for new work", href: "/library/ja-launch-embed-checklist" });
      break;
    case "access_barriers":
      out.push({ label: "Language access checklist", href: "/library/ja-language-access-checklist" });
      out.push({ label: "Plain language and accessible documents", href: "/library/ja-plain-language" });
      break;
    case "workplace_culture":
      out.push({ label: "Team climate action plan template", href: "/library/ja-climate-action-plan" });
      break;
    case "intercultural":
      out.push({ label: "Access checks before a meeting or outreach", href: "/library/ja-access-checks" });
      break;
    case "facilitation":
      out.push({ label: "Session plan template", href: "/library/ja-facilitation-session-plan" });
      break;
    case "policy_orientation":
    case "uncertainty_authority":
      out.push({ label: "Form, notice, or letter change packet", href: "/library/ja-form-notice-change" });
      break;
    default:
      out.push({ label: "Explore Resources", href: "/library" });
  }
  return out;
}

export type ArtifactValues = Record<string, string | string[]>;

export type SelfCheckResult = {
  passed: boolean;
  results: Array<{ key: RubricKey; label: string; ok: boolean; message?: string }>;
  privacy?: { ok: boolean; message?: string };
  requiredFields: Array<{ id: string; label: string; ok: boolean }>;
};

function nonEmpty(v: string | string[] | undefined): boolean {
  if (Array.isArray(v)) return v.some((x) => x.trim().length > 0);
  return Boolean(v && v.trim().length > 0);
}

/** Anti-performative self-check. Blocks 'fake done'. */
export function selfCheck(path: GraduationPath, values: ArtifactValues): SelfCheckResult {
  const results: SelfCheckResult["results"] = [];
  const text = Object.values(values)
    .map((v) => (Array.isArray(v) ? v.join(" ") : v))
    .join("\n");
  const pii = piiDetect(text);
  const privacy = pii.ok ? { ok: true } : { ok: false, message: pii.message };

  for (const rule of path.rubric) {
    let ok = false;
    switch (rule.key) {
      case "owners": {
        const v = values.owners;
        ok = Array.isArray(v) ? v.filter((x) => x.trim()).length >= 1 && v.filter((x) => x.trim()).every((x) => /\S+\s*[:,-]\s*\S+|\bby\b|\bowner\b/i.test(x) || x.split(/\s+/).length >= 2) : nonEmpty(v);
        break;
      }
      case "review_date": {
        const v = String(values.review_date ?? "");
        ok = /^\d{4}-\d{2}-\d{2}$/.test(v) && new Date(v + "T00:00:00Z").getTime() > Date.now() - 86400000;
        break;
      }
      case "access":
        ok = nonEmpty(values.access_checks) && String(values.access_checks).length >= 20;
        break;
      case "involved":
        ok = nonEmpty(values.involved) && String(values.involved).length >= 10;
        break;
      case "not_assumed":
        ok = nonEmpty(values.not_assumed) && String(values.not_assumed).length >= 10;
        break;
      case "application_task":
        ok = nonEmpty(values.application_task) && String(values.application_task).length >= 15 && !/^\s*(slides?|deck|presentation)\s*\.?\s*$/i.test(String(values.application_task));
        break;
      case "sources_labeled": {
        const v = values.sources;
        const list = Array.isArray(v) ? v.filter((x) => x.trim()) : [];
        ok = list.length >= 1 && list.every((x) => /\b(official|guidance|outside source|external|verify|practice note|learning|not found)\b/i.test(x));
        break;
      }
      case "specific_work":
        ok = nonEmpty(values.work_name) && String(values.work_name).trim().length >= 3;
        break;
      case "ci_reviewed": {
        const v = values.ci_reviewed;
        ok = Array.isArray(v) ? v.some((x) => x.trim().length > 0) : nonEmpty(v);
        break;
      }
      case "no_named_parties": {
        ok = pii.ok || pii.code !== "hr_complaint_redirect";
        if (ok && !pii.ok && pii.code === "pii_detected") ok = false;
        break;
      }
    }
    results.push({ key: rule.key, label: rule.label, ok, message: ok ? undefined : rule.failMessage });
  }
  const requiredFields = path.artifactFields.filter(field => field.required).map(field => ({
    id: field.id, label: field.label,
    ok: nonEmpty(values[field.id]) && (field.type !== "list" || Array.isArray(values[field.id])),
  }));
  // GP7 explicitly requires comparing at least two alternatives, not one token entry.
  if (path.id === "gp-7") {
    const alternatives = requiredFields.find(field => field.id === "alternatives");
    if (alternatives) alternatives.ok = Array.isArray(values.alternatives) && values.alternatives.filter(value => value.trim()).length >= 2;
  }
  const passed = results.every((r) => r.ok) && privacy.ok && requiredFields.every(field => field.ok);
  return { passed, results, privacy, requiredFields };
}

/* ---- Program Embed Advisor (A2 drafts) ---- */

export function embedQuestionBank(launchType: LaunchType, stage: Stage) {
  return questionBank({ launchType, stage });
}

export function journeyBurdenPrompts() {
  return JOURNEY_BURDEN_PROMPTS;
}

export function equityImpactQuestions(frame?: "policy" | "budget" | "technology" | "procurement") {
  return frame ? EQUITY_IMPACT_QUESTIONS.filter((q) => q.frame === frame) : EQUITY_IMPACT_QUESTIONS;
}

/** embed.stakeholder_map_draft: from approved roles only; Tribal row is a gate, not a stakeholder. */
export function stakeholderMapDraft(launchType: LaunchType, touchesTribal: boolean) {
  const base = ["equity_director", "accessibility_coordinator", "language_access", "policy_owner", "community_partner", "lived_experience", "practice_owner"];
  if (launchType === "procurement_contract" || launchType === "budget_decision") base.splice(3, 0, "procurement");
  if (launchType === "form_notice" || launchType === "policy_rule") base.splice(3, 0, "communications");
  if (launchType === "program_service" || launchType === "digital_application") base.splice(4, 0, "county_provider");
  const rows = base.map((id) => INVOLVEMENT_ROLES.find((r) => r.id === id)!).map((r) => ({ role: r.label, when: r.when, purpose: "", authority: "", compensation: "", relationshipOwner: "", reportBack: "" }));
  const gate = touchesTribal ? INVOLVEMENT_ROLES.find((r) => r.id === "indian_policy") : undefined;
  return { rows, tribalGate: gate ? { role: gate.label, when: gate.when } : undefined, note: "For each person or group, add the purpose, level of authority (inform, advise, or decide), compensation, relationship lead, and date for reporting back. This is a planning aid; it does not make decisions." };
}

export function allPaths() {
  return GRADUATION_PATHS;
}
