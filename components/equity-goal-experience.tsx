"use client";

import * as React from "react";
import goalData from "../lib/program/equity-goals.json";

export type EquityGoalResourceLink = { id: string; title: string; href: string };
export type EquityGoalExperienceProps = {
  /** Only resources released for this view. An omitted list exposes no resource links. */
  resourceLinks?: EquityGoalResourceLink[];
  /** Use '#' for portable hash routing; already-hashed and external URLs stay unchanged. */
  linkPrefix?: string;
  scope?: "dsd" | "one-dhs";
};

type FieldKey = "decision" | "barrier" | "perspectives" | "action" | "owner" | "support" | "review" | "evidence";
type Draft = Partial<Record<FieldKey, string>>;
const fields: { key: FieldKey; label: string; help: string }[] = [
  { key: "decision", label: "Work decision, process or practice", help: "Name a real piece of work and what you want to improve." },
  { key: "barrier", label: "Barrier, disparity and open questions", help: "Describe the concern, what supports it and what is still unknown. Distinguish reported experience from verified findings." },
  { key: "perspectives", label: "Affected perspectives and influence", help: "Who needs to shape the work? How can they influence the options, and what participation supports are needed?" },
  { key: "action", label: "Toolkit analysis, alternatives and next action", help: "Use the current official toolkit and source requirements. Record alternatives to examine and a feasible next step; do not treat this plan as a completed analysis." },
  { key: "owner", label: "Accountable role and decision authority", help: "Name the responsible role and who can authorize a change. Do not assume an approval has been given." },
  { key: "support", label: "Time, resources and support", help: "Identify workload adjustments, data, accessibility, consultation or partner support needed to proceed." },
  { key: "review", label: "Review point", help: "Set a realistic date or milestone to revisit the work and say who should participate." },
  { key: "evidence", label: "Evidence of progress and reasons to revise", help: "What would show whether the change helps? Include feedback, evidence limits and what would trigger a different approach." },
];
const navy = "#173d59";
const goalAccents = ["#28617b", "#7655a0", "#98601e", "#327253", "#a0485b", "#4667a5"];
const panel: React.CSSProperties = { border: "1px solid #cbd5e1", borderRadius: 12, padding: "clamp(16px, 3vw, 28px)", background: "#fff", minWidth: 0, boxShadow: "0 3px 12px rgba(24, 47, 65, 0.05)" };
const button: React.CSSProperties = { minHeight: 44, padding: "10px 16px", border: `1px solid ${navy}`, borderRadius: 6, background: "#e9f2f7", color: navy, font: "inherit", fontWeight: 700, cursor: "pointer" };
const heading: React.CSSProperties = { fontSize: "1.45rem", lineHeight: 1.3, fontWeight: 700, margin: "0 0 12px" };
const paragraph: React.CSSProperties = { margin: "10px 0", maxWidth: "85ch" };

/** Goal-first companion and local preparation tool, not an official assessment or submission. */
export function EquityGoalExperience({ resourceLinks = [], linkPrefix = "", scope = "dsd" }: EquityGoalExperienceProps) {
  const [filter, setFilter] = React.useState("");
  const [selected, setSelected] = React.useState<number[]>([]);
  const [drafts, setDrafts] = React.useState<Record<number, Draft>>({});
  const [message, setMessage] = React.useState("");
  const [confirmClear, setConfirmClear] = React.useState(false);
  const clearButton = React.useRef<HTMLButtonElement>(null);
  const planner = React.useRef<HTMLElement>(null);
  const goals = goalData.goals;
  const available = new Map(resourceLinks.map(resource => [resource.id, resource]));
  const routedHref = (href: string) => href.startsWith("/") && !href.startsWith("//") ? `${linkPrefix}${href}` : href;
  const safeHref = (href: string) => /^(\/(?!\/)|#|https?:\/\/)/i.test(href);
  const filteredGoals = filter === "all" ? goals : goals.filter(goal => String(goal.number) === filter);
  const shownResources = Array.from(new Map(filteredGoals.flatMap(goal => goal.resources)
    .filter(resource => available.has(resource.id))
    .map(resource => [resource.id, available.get(resource.id)!] as const)).values()).filter(resource => safeHref(resource.href));
  const resourceList = <ul style={{ paddingLeft: 24, display: "grid", gap: 10 }}>{shownResources.map(resource => <li key={resource.id}><a href={routedHref(resource.href)} style={{ color: navy, textDecoration: "underline", textUnderlineOffset: 3 }}>{resource.title}</a></li>)}</ul>;
  const program = scope === "one-dhs" ? "One DHS People, Access and Culture" : "One DSD People, Access and Culture";

  function toggleGoal(number: number) {
    setMessage("");
    setConfirmClear(false);
    setSelected(current => current.includes(number) ? current.filter(value => value !== number) : current.length < 3 ? [...current, number] : current);
  }
  function exportPlan() {
    if (selected.length !== 3) { setMessage("Select exactly three focus goals before exporting your plan."); return; }
    const content = [
      `# ${program}: three-goal working plan`,
      "Local working draft — not submitted, approved or a completed equity analysis.",
      "Goal headings: ADSA Equity and Inclusion Implementation Plan. Selecting three priorities does not waive other applicable responsibilities. Staff apply the current DHS Equity Policy and Equity Analysis Toolkit; consultation supports that responsibility.",
      ...goals.filter(goal => selected.includes(goal.number)).flatMap(goal => [
        `## Goal ${goal.number}: ${goal.title}`,
        ...fields.flatMap(field => [`### ${field.label}`, drafts[goal.number]?.[field.key]?.trim() || "Not yet recorded."]),
      ]),
    ].join("\n\n") + "\n";
    const url = URL.createObjectURL(new Blob([content], { type: "text/markdown;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "equity-three-goal-working-plan.md";
    anchor.textContent = "Download equity working plan";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("Export requested. Check your downloads for the Markdown file. This page has not submitted or stored your plan.");
  }
  function clearDraft() {
    setDrafts({}); setSelected([]); setConfirmClear(false);
    setMessage("All plan fields and goal selections have been cleared.");
    window.requestAnimationFrame(() => clearButton.current?.focus());
  }

  return <div id="equity-goals" data-equity-goal-experience style={{ color: "#182f41", lineHeight: 1.65, display: "grid", gap: 28, scrollMarginTop: 24 }}>
    <header style={{ ...panel, background: "#fff", color: "#182f41", overflow: "hidden" }}>
      <div aria-hidden="true" style={{ display: "flex", height: 6, margin: "0 0 24px", borderRadius: 4 }}>{goalAccents.map(accent => <span key={accent} style={{ flex: 1, background: accent }} />)}</div>
      <p style={{ margin: "0 0 8px", color: navy, fontWeight: 700, letterSpacing: "0.04em" }}>{program}</p>
      <h2 style={{ ...heading, color: navy, fontSize: "clamp(1.7rem, 3vw, 2.3rem)" }}>Putting equity into practice</h2>
      <p style={paragraph}>The six goals can help you see where to focus and what to try next in your work.</p>
      <p style={paragraph}>Using the DHS Equity Policy and its Equity Analysis Toolkit is part of every staff member’s responsibility. Equity professionals can help you work through it.</p>
      <details style={{ margin: "18px 0" }}><summary style={{ cursor: "pointer", color: navy, fontWeight: 700 }}>About these goals and the toolkit</summary>
        <p style={paragraph}>These six goals come from the Aging and Disability Services Administration (ADSA) Equity and Inclusion Implementation Plan. All six guide every unit in the Disability Services Division. They are not department-wide DHS goals.</p>
        <p style={paragraph}>This companion learning does not replace required agency training. Staff apply the current policy and toolkit to their work; the equity consultant and appropriate partners provide guidance, facilitation and analysis support. That support does not transfer staff responsibility or grant approval authority.</p>
        <p style={paragraph}>The goals describe what to improve. The official toolkit guides how to examine a decision. The plan below helps record action and follow-through. Use the current official decision guidance to determine the appropriate review; a short timeline alone does not establish that a scan is sufficient.</p>
        <p style={paragraph}>In DSD, the <strong>One DSD Team</strong> is the division equity team. DHS and ADSA committees retain their own names and responsibilities.</p>
      </details>
      <button type="button" onClick={() => { planner.current?.focus({ preventScroll: true }); planner.current?.scrollIntoView({ behavior: "auto", block: "start" }); }} style={{ ...button, color: "#fff", background: navy }}>Open the three-goal work plan</button>
    </header>

    <section aria-label="The six ADSA goals" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 20 }}>
      {goals.map(goal => <article id={goal.id} key={goal.number} style={{ ...panel, borderTop: `6px solid ${goalAccents[goal.number - 1]}`, scrollMarginTop: 24 }}>
        <p style={{ margin: "0 0 6px", color: goalAccents[goal.number - 1], fontWeight: 700 }}>Goal {goal.number}</p>
        <h3 style={heading}>{goal.title}</h3>
        <p style={paragraph}>{goal.summary}</p>
        <details style={{ marginTop: 14, padding: "4px 12px", borderRadius: 6, background: "#f1f5f8" }}>
          <summary style={{ cursor: "pointer", padding: "8px 0", fontWeight: 700 }}>Explore this goal</summary>
          <p style={paragraph}><strong>In practice:</strong> {goal.example}</p>
          <ul style={{ paddingLeft: 24 }}>{goal.questions.map(question => <li key={question} style={{ margin: "8px 0" }}>{question}</li>)}</ul>
          <p style={paragraph}><strong>Anti-racism in practice:</strong> {goal.antiRacism}</p>
          <p style={paragraph}><strong>A useful working output:</strong> {goal.output}</p>
        </details>
      </article>)}
    </section>

    <section style={{ ...panel, background: "#f4f8fa", borderLeft: "5px solid #28617b" }} aria-label="Resources connected to the goals">
      <h2 style={heading}>Find resources for a goal</h2>
      <p style={paragraph}>Choose a goal to find related learning and tools.</p>
      <label style={{ display: "grid", gap: 8, maxWidth: 560, fontWeight: 700 }}>Choose a goal
        <select value={filter} onChange={event => setFilter(event.target.value)} style={{ padding: 12, minHeight: 44, width: "100%", border: "1px solid #64748b", borderRadius: 4, background: "#fff", color: navy, font: "inherit" }}>
          <option value="">Choose a goal to begin</option>
          {goals.map(goal => <option key={goal.number} value={String(goal.number)}>Goal {goal.number}: {goal.title}</option>)}
          <option value="all">Browse all connected resources</option>
        </select>
      </label>
      {filter ? <><p aria-live="polite" style={paragraph}>{shownResources.length} resource{shownResources.length === 1 ? "" : "s"} connected to {filter === "all" ? "the six goals" : `Goal ${filter}`}.</p>
        {shownResources.length ? filter === "all" ? <details><summary style={{ cursor: "pointer", fontWeight: 700 }}>Show all connected resources</summary>{resourceList}</details> : resourceList : <p style={paragraph}>No connected resources are available here yet. You can still use the goal prompts and prepare a plan.</p>}
      </> : null}
    </section>

    <section style={{ ...panel, background: "#faf7f2", borderLeft: "5px solid #98601e" }} aria-label="Anti-racism and organizational practice">
      <h2 style={heading}>Read, reflect and examine the organization</h2>
      <p style={paragraph}>Anti-racism asks how racial inequities are produced and sustained through decisions, authority, resources and everyday practices. These readings connect the Anti-Racism Resource Guide to the six goals. They are companion learning, not an assessment or a score of staff.</p>
      <details style={{ margin: "16px 0" }}><summary style={{ cursor: "pointer", fontWeight: 700, padding: "8px 0" }}>Institutional structures: look beyond an individual interaction</summary>
        <p style={paragraph}>An interaction may reveal a barrier, but the cause can also lie in a requirement, a deadline, access to information or the way decisions are authorized. A uniform rule can have different effects when people have unequal access to time, money, language support or established networks. Examine both the immediate experience and the routine that shapes it.</p>
        <p style={paragraph}>For example, training staff to explain a complex application may improve an interaction while leaving its burden intact. Reviewing which steps are necessary, who can change them and how alternatives affect people addresses the institutional process. Useful action can combine learning, an authorized change and feedback from people who use the process.</p>
        <p style={paragraph}><strong>Try it:</strong> Choose one requirement in your selected goal. Describe its intended purpose, who carries its burden, the evidence you need and the role with authority to change it.</p>
      </details>
      <details style={{ margin: "16px 0" }}><summary style={{ cursor: "pointer", fontWeight: 700, padding: "8px 0" }}>Tokenism: connect representation to influence and support</summary>
        <p style={paragraph}>Representation matters, but an invitation does not establish meaningful participation. People may be visible in a meeting, a campaign or an entry-level workforce while having little influence over priorities, resources or advancement. Tokenism can also place a disproportionate burden on someone expected to explain or represent an entire community.</p>
        <p style={paragraph}>Ask what participants can change, whether different perspectives can disagree safely, what support makes participation possible and how decisions will be reported back. In hiring and retention, consider opportunity and everyday treatment after recruitment. In communication, connect inclusive messages to usable information and responsive practice.</p>
        <p style={paragraph}><strong>Try it:</strong> Before inviting input, state one decision that remains open and how contributors can affect it. Afterward, show what changed, what did not and why.</p>
      </details>
      <details style={{ margin: "16px 0" }}><summary style={{ cursor: "pointer", fontWeight: 700, padding: "8px 0" }}>Organizational culture: sustain change through everyday practice</summary>
        <p style={paragraph}>Stated values become credible through recurring choices: who gets time to learn, whose evidence is considered, who can pause a decision, and what happens when someone names a barrier. A training or policy statement is a starting point. Sustained change also needs resources, accountable roles, changed routines and opportunities to learn from effects.</p>
        <p style={paragraph}>The guide presents an organizational action continuum for examining patterns of exclusion, symbolic inclusion, structural change and sustained anti-racist practice. Different practices can show different patterns. Use it to ask better questions about a specific practice and its evidence; do not assign staff a label or infer their intercultural orientation.</p>
        <p style={paragraph}>The Intercultural Development Inventory (IDI) and the organizational continuum serve different purposes. This companion neither administers those instruments nor substitutes its reflection for qualified interpretation.</p>
        <p style={paragraph}><strong>Try it:</strong> Compare a stated commitment with a recurring decision. Identify what support, authority and review would make the commitment more consistent in practice.</p>
      </details>
      <p style={{ ...paragraph, fontSize: "0.9rem" }}><strong>Source attribution:</strong> Adapted for this work context from the <em>Anti-Racism Resource Guide</em>, sections on institutional and structural action, organizational culture, tokenism and the organizational action continuum. The guide cites Ed Schein (2004) on culture and attributes the continuum to Crossroads Ministry, adapted from Bailey Jackson and Rita Hardiman, developed further by Andrea Avazian and Ronice Branding, and adapted by Melia LaCour, PSESD. This is a program synthesis of the source guide, not a new DHS policy or a validated organizational finding.</p>
    </section>

    <section ref={planner} tabIndex={-1} id="equity-work-plan" style={{ ...panel, background: "#f5f8fb", borderLeft: "5px solid #4667a5", scrollMarginTop: 24 }} aria-label="Manager and supervisor three-goal planner">
      <h2 style={heading}>Manager and supervisor three-goal planner</h2>
      <p style={paragraph}>Select exactly three focus goals and prepare a practical next step for each. Three priorities help organize agreed work; they do not waive responsibilities under the other goals or applicable policies. Use this working draft to prepare for review; it is not an approved agency work plan.</p>
      <p style={{ ...paragraph, padding: 14, background: "#edf3f8", borderLeft: `4px solid ${navy}` }}><strong>Your draft is not saved.</strong> Notes stay only in this open page and disappear when you leave, reload or close it. Export a Markdown copy to keep your work. Nothing is submitted to DHS or saved by the program. Use role descriptions and appropriate aggregate evidence; do not enter private personnel or case details.</p>
      <fieldset style={{ margin: "20px 0", padding: 16, border: "1px solid #94a3b8", borderRadius: 4 }}>
        <legend style={{ fontWeight: 700, padding: "0 8px" }}>Choose three focus goals</legend>
        <p style={{ margin: "0 0 12px" }}>When three are selected, unselect one to choose a different goal. Notes for an unselected goal remain in this page until you clear the draft or leave; reselect it to continue.</p>
        <div style={{ display: "grid", gap: 8 }}>{goals.map(goal => <label key={goal.number} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 12px", minHeight: 44, borderRadius: 6, border: `1px solid ${selected.includes(goal.number) ? goalAccents[goal.number - 1] : "#cbd5e1"}`, background: selected.includes(goal.number) ? "#e9f2f7" : "#fff", opacity: selected.length === 3 && !selected.includes(goal.number) ? 0.7 : 1 }}>
          <input type="checkbox" checked={selected.includes(goal.number)} disabled={selected.length === 3 && !selected.includes(goal.number)} onChange={() => toggleGoal(goal.number)} style={{ width: 20, height: 20, marginTop: 3, flexShrink: 0, accentColor: navy }} />
          <span>Goal {goal.number}: {goal.title}</span>
        </label>)}</div>
      </fieldset>
      <p role="status" style={{ fontWeight: 700 }}>{selected.length} of 3 focus goals selected. {selected.length === 3 ? "You can export your working plan." : `Choose ${3 - selected.length} more to enable export.`}</p>
      <div style={{ display: "grid", gap: 24 }}>{goals.filter(goal => selected.includes(goal.number)).map(goal => <fieldset key={goal.number} style={{ padding: 20, border: "1px solid #94a3b8", borderRadius: 4, minWidth: 0 }}>
        <legend style={{ fontWeight: 700, padding: "0 8px" }}>Goal {goal.number}: {goal.title}</legend>
        <p style={paragraph}>{goal.focus}</p>
        <div style={{ display: "grid", gap: 18 }}>{fields.map(field => <label key={field.key} style={{ display: "grid", gap: 6 }}>
          <strong>{field.label}</strong>
          <span style={{ fontSize: "0.92rem" }}>{field.help}</span>
          <textarea rows={3} value={drafts[goal.number]?.[field.key] || ""} onChange={event => { const value = event.target.value; setDrafts(current => ({ ...current, [goal.number]: { ...current[goal.number], [field.key]: value } })); setMessage(""); }} style={{ width: "100%", boxSizing: "border-box", minHeight: 90, resize: "vertical", border: "1px solid #64748b", borderRadius: 4, padding: 12, font: "inherit", color: "#182f41", background: "#fff" }} />
        </label>)}</div>
      </fieldset>)}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
        <button type="button" onClick={exportPlan} disabled={selected.length !== 3} style={{ ...button, background: selected.length === 3 ? navy : "#d6dfe7", color: selected.length === 3 ? "#fff" : "#344a5c", cursor: selected.length === 3 ? "pointer" : "not-allowed" }}>Export three-goal plan (.md)</button>
        <button ref={clearButton} type="button" onClick={() => setConfirmClear(true)} style={button}>Clear all plan notes and selections</button>
      </div>
      {confirmClear && <div style={{ marginTop: 16, padding: 16, border: "1px solid #94a3b8" }}>
        <p style={paragraph}>Clear every goal’s notes, including notes for unselected goals, and reset your selections? This cannot be undone in this page.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}><button type="button" onClick={clearDraft} style={button}>Yes, clear this draft</button><button type="button" onClick={() => { setConfirmClear(false); clearButton.current?.focus(); }} style={button}>Keep my draft</button></div>
      </div>}
      <p role="status" style={paragraph}>{message}</p>
    </section>
    <p style={{ ...paragraph, fontSize: "0.9rem" }}><strong>Goal source:</strong> {goalData.goalAuthority} {goalData.mappingAuthority} Official source titles retain their original wording. The six goals are distinct from the toolkit’s official process and this program’s companion learning stages.</p>
  </div>;
}


