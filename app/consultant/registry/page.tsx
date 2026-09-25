import type { Metadata } from "next";
import { PageIntro } from "@/components/ui";
import { ownerPageGuard } from "@/lib/auth/owner-page";
import { AGENTS } from "@/lib/intelligence/registry/agents";
import { flagList } from "@/lib/intelligence/registry/flags";
import { registryModelList } from "@/lib/intelligence/registry/models";
import { TOOL_CATALOG } from "@/lib/intelligence/tools/catalog";
import { ENVIRONMENT_MAX_AUTONOMY } from "@/lib/intelligence/types";

export const metadata: Metadata = { title: "Program settings" };
export const dynamic = "force-dynamic";

const WORK_LEVEL: Record<string, string> = {
  A0: "Review and summarize only",
  A1: "Offer suggestions for a person to decide",
  A2: "Prepare editable drafts for approval",
  A3: "Organize or route work with a way to reverse changes",
  A4: "Complete an approved program review with checks and a way to reverse it",
  A5: "Prepare program improvements for your approval",
};

const REVIEW_RULE: Record<string, string> = {
  none_observe: "No approval needed for reading or organizing",
  user_chooses: "The staff member chooses whether to use it",
  preview_required: "A preview appears before the next step",
  human_approve: "A person must approve any change",
  owner_only: "Only you may approve or run it",
};

const CONNECTION_NAME: Record<string, string> = {
  mdl_fixture_v1: "Standard program drafting",
  mdl_fixture_embed_v1: "Standard library matching",
  mdl_claude_staff_primary: "Connected drafting pilot",
  mdl_claude_triage: "High-volume organizing candidate",
  mdl_claude_reasoning: "Complex review candidate",
  mdl_openai_structured: "Structured forms backup",
};

const CONNECTION_PURPOSE: Record<string, string> = {
  chat_reason: "Answers and editable drafts",
  embed: "Finding related program resources",
  classify: "Organizing and describing resources",
  summarize: "Clear summaries",
  eval_judge: "Comparing readiness-check results",
};

const CONNECTION_STATUS: Record<string, string> = {
  production: "Available now",
  approved: "Approved; the connection still determines availability",
  pilot: "Pilot only; not generally available",
  sandbox: "Safe test only; not active with staff work",
  eval: "Being checked; not active",
  candidate: "Under consideration; not active",
  hold: "On hold; not active",
  rejected: "Not approved",
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

const ACTION_AREA: Record<string, { label: string; description: string }> = {
  knowledge: { label: "Program knowledge", description: "Finds program resources, authority labels, community briefs, and sources." },
  research: { label: "Current public research", description: "Finds current public sources when external research is connected and turned on." },
  drafting: { label: "Draft preparation", description: "Prepares answers, checklists, summaries, and meeting materials for review." },
  library: { label: "Resource library", description: "Organizes resources and points out items that may need review." },
  a11y: { label: "Plain language and accessibility", description: "Reviews wording, structure, and common accessibility concerns." },
  consult: { label: "Consultation support", description: "Helps prepare requests, organize the queue, and direct people to the right help." },
  learning: { label: "Learning and practice", description: "Recommends learning paths and helps staff keep their own progress." },
  embed: { label: "Equity in planning", description: "Provides questions for policies, programs, services, and process design." },
  memory: { label: "Program decisions", description: "Keeps approved decisions, content versions, and readiness results." },
  orchestration: { label: "Program reviews", description: "Reviews current work within the boundaries you set and prepares improvements for your decision." },
  evalops: { label: "Readiness and improvement", description: "Checks the program and manages options that are still being considered." },
  safety: { label: "Privacy and safety", description: "Stops private information, profiling, impersonation, and publishing without approval." },
};

const FEATURE_COPY: Record<string, { label: string; description: string }> = {
  "agent.content_sentinel": { label: "Content currency and missing owners", description: "Points out content that may be out of date or does not name a responsible owner." },
  "agent.eval_steward_write": { label: "Save readiness results and improvement proposals", description: "Keeps readiness results and proposals for your review." },
  "model.generative_pilot": { label: "Connected drafting support", description: "Uses the approved drafting connection when its private key is present. Otherwise, standard program wording remains in use." },
  "autonomy.a3_calendar_schedule": { label: "Calendar scheduling", description: "Reserved for a future calendar connection. It is not ready for use." },
  "autonomy.a3_stale_flag": { label: "Mark content for review", description: "Adds a reversible review note to content that may be out of date." },
  "tool.browser_fetch_public": { label: "Read public web pages", description: "Planned option for reading approved public pages. It is not ready for use." },
  "tool.office_drafts": { label: "Microsoft document drafting", description: "Planned option for preparing Microsoft document drafts. It is not ready for use." },
  "tool.publish_chain": { label: "Publishing approval steps", description: "Planned publishing steps that always need your approval. It is not ready for use." },
  "surface.ecosystem_intelligence": { label: "Ecosystem intelligence views", description: "Reserved for future pilot views. They are not ready for use." },
};

const SOURCE_LABEL: Record<string, string> = {
  default: "Program starting setting",
  env: "Private hosting setting",
  owner: "Changed by you",
};

const PERMISSION_LABEL: Record<string, string> = {
  always: "May run within its safeguards",
  with_preview: "Preview required",
  human_approve: "A person must approve",
  owner_only: "Only you may run it",
};

const STAGE_LABEL: Record<string, string> = {
  mvp: "Available in the current build",
  near_term: "Planned next",
  later: "Planned for a later stage",
};

function technicalLabel(value: string) {
  return value.replace(/[._-]+/g, " ");
}

export default async function RegistryPage() {
  if (!(await ownerPageGuard())) return null;
  const models = registryModelList();
  const flags = flagList();
  const actionGroups = Array.from(new Set(TOOL_CATALOG.map((item) => item.family))).map((family) => {
    const items = TOOL_CATALOG.filter((item) => item.family === family);
    return { family, items, available: items.filter((item) => item.enabled).length };
  });

  return (
    <>
      <PageIntro kicker="Consultant oversight" title="Program settings" lede="See what the program can use now, what is still being tested, and where your approval is needed. This page shows the current settings; looking at it changes nothing." />
      <div className="wrap space-y-10 py-8">
        <section className="grid gap-4 md:grid-cols-3" aria-label="Current program setting summary">
          <div className="panel">
            <p className="kicker">Program support</p>
            <p className="m-0 text-lg font-bold">{AGENTS.filter((item) => item.enabled).length} of {AGENTS.length} areas are available</p>
          </div>
          <div className="panel">
            <p className="kicker">Program actions</p>
            <p className="m-0 text-lg font-bold">{TOOL_CATALOG.filter((item) => item.enabled).length} of {TOOL_CATALOG.length} actions are available</p>
          </div>
          <div className="panel">
            <p className="kicker">Highest permitted work level</p>
            <p className="m-0 text-lg font-bold">{WORK_LEVEL[ENVIRONMENT_MAX_AUTONOMY]}</p>
          </div>
        </section>

        <section aria-labelledby="connections">
          <h2 id="connections" className="text-2xl font-extrabold">Drafting and library connections ({models.length})</h2>
          <p className="text-sm text-muted">The main view explains what each connection does and whether it can be used. Exact names stay available for when you need to set up or look into a connection.</p>
          <div className="overflow-x-auto">
            <table className="data mt-2">
              <thead>
                <tr>
                  <th scope="col">Connection</th>
                  <th scope="col">What it supports</th>
                  <th scope="col">Status</th>
                  <th scope="col">Safeguard</th>
                  <th scope="col">Technical details</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => (
                  <tr key={model.model_id}>
                    <td>{CONNECTION_NAME[model.model_id] ?? model.display_name_internal}</td>
                    <td>{CONNECTION_PURPOSE[model.purpose] ?? technicalLabel(model.purpose)}</td>
                    <td>{CONNECTION_STATUS[model.approval_state] ?? technicalLabel(model.approval_state)}</td>
                  <td className="text-xs">{model.scope.data_classes.includes("practice_workspace") ? "Approved for private workspace information." : "Private Consultant Workspace information is excluded."}</td>
                    <td className="text-xs">
                      <details>
                        <summary>Show details</summary>
                        <p className="mb-0">Identifier: {model.model_id}<br />Service: {model.provider_id}<br />Internal name: {model.display_name_internal}<br />Cost: {model.cost_class}<br />Risk: {model.risk_class}<br />Approved areas: {model.allowed_agent_ids.join(", ") || "None"}</p>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="support-areas">
          <h2 id="support-areas" className="text-2xl font-extrabold">Program support areas ({AGENTS.length})</h2>
          <p className="text-sm text-muted">Each area has its own availability, work limit, and approval rule. The strictest applicable limit always governs.</p>
          <div className="overflow-x-auto">
            <table className="data mt-2">
              <thead>
                <tr>
                  <th scope="col">Area</th>
                  <th scope="col">What it does</th>
                  <th scope="col">Availability</th>
                  <th scope="col">Work limit</th>
                  <th scope="col">Review rule</th>
                  <th scope="col">Technical details</th>
                </tr>
              </thead>
              <tbody>
                {AGENTS.map((agent) => (
                  <tr key={agent.agent_id}>
                    <td>{agent.staff_label}</td>
                    <td className="text-xs">{SUPPORT_DESCRIPTION[agent.agent_id] ?? agent.purpose}</td>
                    <td>{agent.enabled ? "Available" : "Not available"}</td>
                    <td className="text-xs">{WORK_LEVEL[agent.autonomy_ceiling]}</td>
                    <td className="text-xs">{REVIEW_RULE[agent.review_rule] ?? technicalLabel(agent.review_rule)}</td>
                    <td className="text-xs">
                      <details>
                        <summary>Show details</summary>
                        <p className="mb-0">Identifier: {agent.agent_id}<br />Version: {agent.version}<br />Connection: {agent.model_setting.primary_model_id}<br />Readiness group: {agent.eval_suite_id}<br />Permitted actions: {agent.tools_allowlist.length}</p>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="actions">
          <h2 id="actions" className="text-2xl font-extrabold">Available program actions</h2>
          <p className="text-sm text-muted">This summary groups related actions by what they are for. Open the full record only when you need the exact names or safeguards.</p>
          <table className="data mt-2">
            <thead>
              <tr>
                <th scope="col">Area</th>
                <th scope="col">What it covers</th>
                <th scope="col">Available now</th>
                <th scope="col">Total planned</th>
              </tr>
            </thead>
            <tbody>
              {actionGroups.map((group) => (
                <tr key={group.family}>
                  <td>{ACTION_AREA[group.family]?.label ?? technicalLabel(group.family)}</td>
                  <td className="text-xs">{ACTION_AREA[group.family]?.description ?? "Related program work."}</td>
                  <td>{group.available}</td>
                  <td>{group.items.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <details className="card mt-4">
            <summary>Full action record ({TOOL_CATALOG.length})</summary>
            <div className="overflow-x-auto">
              <table className="data mt-3">
                <thead>
                  <tr>
                    <th scope="col">Identifier</th>
                    <th scope="col">Purpose</th>
                    <th scope="col">Availability</th>
                    <th scope="col">Approval rule</th>
                    <th scope="col">Work level</th>
                    <th scope="col">Build stage</th>
                    <th scope="col">Safeguard</th>
                  </tr>
                </thead>
                <tbody>
                  {TOOL_CATALOG.map((item) => (
                    <tr key={item.tool_name}>
                      <td className="text-xs">{item.tool_name}</td>
                      <td className="text-xs">{item.description}</td>
                      <td>{item.enabled ? "Available" : "Not available"}</td>
                      <td className="text-xs">{PERMISSION_LABEL[item.permission_mode] ?? technicalLabel(item.permission_mode)}</td>
                      <td className="text-xs">{WORK_LEVEL[item.min_autonomy]}</td>
                      <td className="text-xs">{STAGE_LABEL[item.mvp] ?? technicalLabel(item.mvp)}</td>
                      <td className="text-xs">{item.safety_notes || "No additional note"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </section>

        <section aria-labelledby="features">
          <h2 id="features" className="text-2xl font-extrabold">Optional features and pilots ({flags.length})</h2>
          <p className="text-sm text-muted">Change the options offered here from Program reviews. Selecting an unfinished option does not make it ready; planned connections must still be built and checked before use.</p>
          <div className="overflow-x-auto">
            <table className="data mt-2">
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  <th scope="col">Current setting</th>
                  <th scope="col">What it means</th>
                  <th scope="col">Set by</th>
                  <th scope="col">Technical details</th>
                </tr>
              </thead>
              <tbody>
                {flags.map((flag) => {
                  const copy = FEATURE_COPY[flag.key] ?? { label: technicalLabel(flag.key), description: flag.description };
                  return (
                    <tr key={flag.key}>
                      <td>{copy.label}</td>
                      <td>{flag.value ? "Selected" : "Off"}</td>
                      <td className="text-xs">{copy.description}</td>
                      <td className="text-xs">{SOURCE_LABEL[flag.source] ?? technicalLabel(flag.source)}</td>
                      <td className="text-xs">
                        <details>
                          <summary>Show details</summary>
                          <p className="mb-0">Identifier: {flag.key}</p>
                        </details>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
