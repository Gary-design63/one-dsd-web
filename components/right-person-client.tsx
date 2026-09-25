"use client";

import Link from "next/link";
import { SupportSourceLinks } from "@/components/support-source-links";
import styles from "@/components/workspace-presentation.module.css";
import { useMemo, useRef, useState } from "react";
import { useProgramContext } from "@/components/program-context";
import {
  DSD_ELIGIBILITY_OPTIONS,
  START_ROLES,
  START_URGENCIES,
  WORK_AREAS,
  routeSupport,
  validateStartIntake,
  type DsdEligibilityId,
  type StartRoleId,
  type StartUrgencyId,
  type SupportRouteDecision,
  type ProductContextId,
  type WorkAreaId,
} from "@/lib/product";
import type { EditableSurfaceValues } from "@/lib/content/editable-surface-contract";

function availableArea(value?: string): WorkAreaId | "" {
  return WORK_AREAS.some((area) => area.id === value) ? value as WorkAreaId : "";
}

export function RightPersonClient({ initialArea, copy }: { initialArea?: string; copy: EditableSurfaceValues }) {
  const { context } = useProgramContext();
  const [role, setRole] = useState<StartRoleId | "">("");
  const [task, setTask] = useState<WorkAreaId | "">(() => availableArea(initialArea));
  const [urgency, setUrgency] = useState<StartUrgencyId | "">("");
  const [dsdEligibility, setDsdEligibility] = useState<DsdEligibilityId>("not_checked");
  const [decision, setDecision] = useState<SupportRouteDecision | null>(null);
  const [decisionContext, setDecisionContext] = useState<ProductContextId | null>(null);
  const [decisionEligibility, setDecisionEligibility] = useState<DsdEligibilityId | null>(null);
  const [issues, setIssues] = useState<Record<string, string>>({});
  const roleRef = useRef<HTMLSelectElement>(null);
  const taskRef = useRef<HTMLSelectElement>(null);
  const urgencyRef = useRef<HTMLSelectElement>(null);
  const currentDsdEligibility = context === "one_dsd" ? dsdEligibility : "not_checked";
  const activeDecision = decisionContext === context
    && decisionEligibility === currentDsdEligibility
    && decision?.basis.role === role
    && decision.basis.task === task
    && decision.basis.urgency === urgency
    ? decision
    : null;
  const dsdSupport = activeDecision?.kind === "dsd_consultation";

  const selectedArea = useMemo(() => WORK_AREAS.find((area) => area.id === task), [task]);

  function findRoute(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateStartIntake({ contextPreference: context, role, task, urgency });
    if (!validation.ok) {
      setDecision(null);
      setDecisionContext(null);
      setDecisionEligibility(null);
      setIssues(Object.fromEntries(validation.issues.map((issue) => [issue.field, issue.field === "role" ? textValue(copy, "roleError") : issue.field === "task" ? textValue(copy, "taskError") : textValue(copy, "timingError")])));
      const first = validation.issues[0]?.field;
      setTimeout(() => {
        if (first === "role") roleRef.current?.focus();
        else if (first === "task") taskRef.current?.focus();
        else if (first === "urgency") urgencyRef.current?.focus();
      }, 0);
      return;
    }
    setIssues({});
    setDecision(routeSupport({ ...validation.value, dsdEligibility: currentDsdEligibility }));
    setDecisionContext(context);
    setDecisionEligibility(currentDsdEligibility);
  }

  return (
    <div className={styles.workGrid}>
      <form className={styles.formPanel} onSubmit={findRoute}>
        <p className="kicker">{textValue(copy, "formKicker")}</p>
        <h2 className="text-2xl font-extrabold">{textValue(copy, "formTitle")}</h2>
        <p className="text-muted">{textValue(copy, "formIntro")}</p>

        <div className="field">
          <label htmlFor="support-role">{textValue(copy, "roleLabel")}</label>
          <select ref={roleRef} id="support-role" value={role} onChange={(event) => setRole(event.target.value as StartRoleId | "")} aria-invalid={Boolean(issues.role)} aria-describedby={issues.role ? "support-role-error" : undefined}>
            <option value="">{textValue(copy, "rolePlaceholder")}</option>
            {START_ROLES.map((option) => <option key={option.id} value={option.id}>{textValue(copy, keyFor("role", option.id, "Label"))}</option>)}
          </select>
          {issues.role ? <p id="support-role-error" className="error m-0" role="alert">{issues.role}</p> : null}
        </div>

        <div className="field">
          <label htmlFor="support-task">{textValue(copy, "taskLabel")}</label>
          <select ref={taskRef} id="support-task" value={task} onChange={(event) => setTask(event.target.value as WorkAreaId | "")} aria-invalid={Boolean(issues.task)} aria-describedby={issues.task ? "support-task-error" : undefined}>
            <option value="">{textValue(copy, "taskPlaceholder")}</option>
            {WORK_AREAS.map((option) => <option key={option.id} value={option.id}>{textValue(copy, keyFor("area", option.id, "Label"))}</option>)}
          </select>
          {issues.task ? <p id="support-task-error" className="error m-0" role="alert">{issues.task}</p> : null}
        </div>

        <div className="field">
          <label htmlFor="support-urgency">{textValue(copy, "timingLabel")}</label>
          <select ref={urgencyRef} id="support-urgency" value={urgency} onChange={(event) => setUrgency(event.target.value as StartUrgencyId | "")} aria-invalid={Boolean(issues.urgency)} aria-describedby={issues.urgency ? "support-urgency-error" : undefined}>
            <option value="">{textValue(copy, "timingPlaceholder")}</option>
            {START_URGENCIES.map((option) => <option key={option.id} value={option.id}>{textValue(copy, keyFor("urgency", option.id, "Label"))}</option>)}
          </select>
          {issues.urgency ? <p id="support-urgency-error" className="error m-0" role="alert">{issues.urgency}</p> : null}
        </div>

        {context === "one_dsd" ? (
          <fieldset className="field">
            <legend className="font-bold text-navy-deep">{textValue(copy, "dsdQuestion")}</legend>
            <div className="checks">
              {DSD_ELIGIBILITY_OPTIONS.map((option) => (
                <label key={option.id}>
                  <input
                    type="radio"
                    name="dsd-eligibility"
                    value={option.id}
                    checked={dsdEligibility === option.id}
                    onChange={() => setDsdEligibility(option.id)}
                  />
                  <span>
                    <strong>{textValue(copy, keyFor("eligibility", option.id, "Label"))}</strong>
                    <span className="block text-sm text-muted">{option.id === "not_checked" || option.id === "self_attested_dsd" ? option.description : textValue(copy, keyFor("eligibility", option.id, "Description"))}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : (
          <p className="notice text-sm">
            {textValue(copy, "oneDhsRouteNote")}
          </p>
        )}

        <button type="submit" className="btn btn--primary">{textValue(copy, "submitLabel")}</button>
      </form>

      <section className={styles.recommendation} aria-live="polite" aria-labelledby="support-result-title">
        <p className="kicker">{textValue(copy, "resultKicker")}</p>
        <h2 id="support-result-title" className="text-2xl font-extrabold">
          {activeDecision ? (dsdSupport ? "Find support for DSD work" : textValue(copy, "oneDhsDecisionLabel")) : textValue(copy, "emptyResultTitle")}
        </h2>
        {!activeDecision ? (
          <p className="text-muted">{textValue(copy, "emptyResultBody")}</p>
        ) : (
          <>
            <p>{dsdSupport ? "Staff consultation request forms are closed. Start with the people and offices below for help with this work." : textValue(copy, "oneDhsDecisionBody")}</p>
            <div className="notice mt-4">
              <strong>{textValue(copy, "beginLead")} </strong>
              {textValue(copy, keyFor("urgency", activeDecision.urgency.id, "Guidance"))}
              <div className="mt-3 flex flex-wrap gap-3">
                <Link href={`/areas#${activeDecision.workArea.id}`} className="btn btn--primary">{textValue(copy, "areaLinkLabel")}</Link>
                <Link href={`/library?q=${encodeURIComponent(activeDecision.workArea.label)}`} className="btn btn--light">{textValue(copy, "libraryLinkLabel")}</Link>
              </div>
            </div>

            <h3 className="mt-6 text-xl font-extrabold">{textValue(copy, "destinationsTitle")}</h3>
            <ol className="mt-3 space-y-3 pl-6">
              {activeDecision.destinations.map((destination) => (
                <li key={destination.id}>
                  <strong>{textValue(copy, keyFor("destination", destination.id, "Label"))}</strong>
                  <span className="block text-sm text-muted">{textValue(copy, keyFor("destination", destination.id, "Description"))}</span>
                  <SupportSourceLinks destination={destination.id} />
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-muted">
              {textValue(copy, "directoryNote")} <Link href="/support/directory">DHS offices and guidance</Link>
            </p>

          </>
        )}
        {selectedArea && !activeDecision ? <p className="mt-4 text-sm">{textValue(copy, "selectedAreaLabel")}: {textValue(copy, keyFor("area", selectedArea.id, "Label"))}</p> : null}
      </section>
    </div>
  );
}

function pascal(value: string): string {
  return value.split(/[^A-Za-z0-9]+/).filter(Boolean).map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`).join("");
}

function keyFor(prefix: string, id: string, suffix: string): string {
  return `${prefix}${pascal(id)}${suffix}`;
}

function textValue(values: EditableSurfaceValues, key: string): string {
  return typeof values[key] === "string" ? values[key] as string : "";
}
