"use client";

import Link from "next/link";
import { workOriginForPath, withWorkOrigin, type WorkOrigin } from "@/lib/product/work-origin";
import { readPracticeValues, practiceNotesText } from "@/lib/client/practice-export";
import { useMemo, useState } from "react";
import { Field, Notice } from "@/components/ui";
import type { GraduationPath, PathStepKey } from "@/lib/content/paths";
import { selfCheck, type ArtifactValues, type SelfCheckResult } from "@/lib/intelligence/agents/graduation";
import { useHydrated, useStored, writeStored } from "@/lib/client/storage";
import { BROWSER_STORAGE_KEYS } from "@/lib/client/storage-keys";
import { useProgramContext } from "@/components/program-context";
import { contextualizeSupportAction } from "@/lib/product";
import type { EditableSurfaceValues } from "@/lib/content/editable-surface-contract";
import { mergePracticeArtifact, PracticeArtifactSchema, type PracticeArtifact } from "@/lib/content/practice-artifact";

type Progress = Partial<Record<PathStepKey, boolean>> & { complete?: boolean; updatedAt?: string };

const EMPTY_VALUES: ArtifactValues = {};
const EMPTY_PROGRESS: Progress = {};

function copyText(copy: EditableSurfaceValues, key: string): string {
  const value = copy[key];
  return typeof value === "string" ? value : "";
}

export function PathClient({ path, intakeEnabled, copy, contract = "", origin: inputOrigin = {} }: { path: GraduationPath; intakeEnabled: boolean; copy: EditableSurfaceValues; contract?: string; origin?: WorkOrigin }) {
  const origin = workOriginForPath(inputOrigin, path.id);
  const { context } = useProgramContext();
  const hydrated = useHydrated();
  const [stored, setStored] = useStored<unknown>("local", BROWSER_STORAGE_KEYS.pathArtifact(path.id), EMPTY_VALUES);
  const [storedProgress, setProgress] = useStored<unknown>("local", BROWSER_STORAGE_KEYS.pathProgress(path.id), EMPTY_PROGRESS);
  const [pending, setPending] = useStored<unknown>("session", BROWSER_STORAGE_KEYS.askPracticeHandoff, null);
  const [savedSource, setSavedSource] = useStored<unknown>("local", BROWSER_STORAGE_KEYS.pathArtifactSource(path.id), null);
  const [draftSource, setDraftSource] = useState<PracticeArtifact | null>(null);
  const [transferNotice, setTransferNotice] = useState("");
  const [draft, setDraft] = useState<ArtifactValues | null>(null);
  const [check, setCheck] = useState<SelfCheckResult | null>(null);
  const [savedAt, setSavedAt] = useState<string>("");
  const restored = useMemo(() => readPracticeValues(stored, path), [stored, path]);
  const progress: Progress = storedProgress && typeof storedProgress === "object" && !Array.isArray(storedProgress)
    ? Object.fromEntries(Object.entries(storedProgress).filter(([key,value]) => (key === "updatedAt" && typeof value === "string") || ((key === "complete" || path.steps.some(step=>step.key===key)) && typeof value === "boolean"))) : {};
  const values = draft ?? restored.values;
  const [exportNotice, setExportNotice] = useState("");
  const [manualCopy, setManualCopy] = useState(false);
  const pendingResult = PracticeArtifactSchema.safeParse(pending);
  const pendingHere = pendingResult.success && pendingResult.data.pathId === path.id;
  const sourceResult = PracticeArtifactSchema.safeParse(draftSource ?? savedSource);
  const visibleSource = sourceResult.success && sourceResult.data.context === context && sourceResult.data.pathId === path.id ? sourceResult.data : undefined;

  async function copyNotes() {
    try { await navigator.clipboard.writeText(practiceNotesText(path, values, visibleSource)); setExportNotice("Notes copied."); setManualCopy(false); }
    catch { setExportNotice("Select and copy your notes below."); setManualCopy(true); }
  }
  function downloadNotes() {
    let url: string | undefined;
    try {
      url=URL.createObjectURL(new Blob([practiceNotesText(path,values,visibleSource)],{type:"text/plain;charset=utf-8"}));
      const link=document.createElement("a"); link.href=url; link.download=path.id+"-working-notes.txt";
      document.body.appendChild(link); link.click(); link.remove(); setExportNotice("Your notes download is ready.");
    } catch { setExportNotice("Select and copy your notes below."); setManualCopy(true); }
    finally { if(url) {const pendingUrl=url; setTimeout(()=>URL.revokeObjectURL(pendingUrl),1000);} }
  }
  function importDraft() {
    const result = mergePracticeArtifact({ incoming: pending, path, context, contract, current: values, previous: draftSource ?? savedSource });
    if (!result.ok) { setTransferNotice(result.message); return; }
    setDraft(result.values);
    setDraftSource(result.source);
    setCheck(null);
    setSavedAt("");
    const preserved = result.preserved.map(id => path.artifactFields.find(field => field.id === id)?.label ?? id);
    setTransferNotice(preserved.length ? "Draft added. Your own notes were kept in: " + preserved.join(", ") + ". Review the draft and save when you are ready." : "Draft added. Review it and save when you are ready.");
    setPending(null);
  }
  function saveSource() {
    if (draftSource && !setSavedSource(draftSource)) {
      setTransferNotice("Your notes were saved, but the draft reference could not be saved. Keep this page open if you want to try saving again.");
      return false;
    }
    setDraftSource(null);
    return true;
  }
  const consultationAction = contextualizeSupportAction(
    { label: "Request a DSD consultation", href: `/support/request?path=${path.id}` },
    context,
    intakeEnabled,
  );

  const steps = useMemo(() => path.steps.filter((s) => s.key !== "artifact" && s.key !== "selfcheck"), [path.steps]);

  function setField(id: string, v: string | string[]) {
    setDraft({ ...values, [id]: v });
    setCheck(null);
  }

  function persist() {
    if (!setStored(values)) { setSavedAt(""); return; }
    saveSource();
    setDraft(null);
    const at = new Date().toISOString();
    setSavedAt(at);
    setProgress({ ...progress, complete: Boolean(progress.complete) && selfCheck(path, values).passed, updatedAt: at });
  }

  function runCheck() {
    const r = selfCheck(path, values);
    setCheck(r);
    if (!setStored(values)) { setSavedAt(""); return; }
    saveSource();
    setDraft(null);
    setProgress({ ...progress, complete: r.passed, updatedAt: new Date().toISOString() });
  }

  function toggleStep(key: PathStepKey) {
    setProgress({ ...progress, [key]: !progress[key], updatedAt: new Date().toISOString() });
  }

  function clearAll() {
    if (!setStored(null)) return;
    if (!setProgress(null)) return;
    if (!setSavedSource(null)) { setTransferNotice("Your notes were deleted, but the draft reference could not be removed. Please try again."); return; }
    if (pendingHere) setPending(null);
    setDraftSource(null);
    setTransferNotice("");
    setDraft(null);
    setCheck(null);
    setSavedAt("");
  }

  function prefillConsult() {
    const considered = path.artifactFields
      .filter((f) => values[f.id] && f.id !== "work_name")
      .map((f) => `${f.label}: ${Array.isArray(values[f.id]) ? (values[f.id] as string[]).join("; ") : values[f.id]}`)
      .join("\n")
      .slice(0, 1800);
    writeStored("session", BROWSER_STORAGE_KEYS.consultationPrefill, {
      path_id: path.id,
      work_name: values.work_name ?? "",
      equity_questions_considered: considered,
      desired_support_type: [path.consultSupportType],
      stage: path.id === "gp-1" ? "conceptual" : undefined,
    });
  }

  return (
    <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runCheck();
        }}
        className="card"
      >
        <fieldset disabled={!hydrated} className="min-w-0">
          <legend className="sr-only">{path.artifactTitle}</legend>
        {!hydrated ? <p className="text-sm text-muted">{copyText(copy, "openingNotes")}</p> : null}
        {hydrated && restored.needsAttention ? <p role="status" className="notice mb-4">Some saved information could not be read in this practice. Readable notes are shown; the original saved copy stays unchanged until you save or delete it.</p> : null}
        {hydrated && pendingHere ? (
          <div className="notice mb-4">
            <h3 className="text-lg font-bold">{copyText(copy, "handoffTitle") || "Bring your ASK draft into this practice"}</h3>
            <p>{copyText(copy, "handoffBody") || "You can review and edit it here. Notes you have already changed stay yours."}</p>
            <button type="button" className="btn btn--light" onClick={importDraft}>{copyText(copy, "handoffUseLabel") || "Use this draft"}</button>
          </div>
        ) : null}
        {transferNotice ? <p role="status" className="notice mb-4">{transferNotice}</p> : null}
        {visibleSource ? <details className="mb-4">
          <summary>{copyText(copy, "draftSourceSummary") || "About this draft"}</summary>
          <p>{copyText(copy, "draftPreparedPrefix") || "Prepared with ASK on"} {new Date(visibleSource.createdAt).toLocaleDateString()}. {copyText(copy, "draftOwnershipBody") || "Your changes here are part of your own working notes."}</p>
          {visibleSource.sources.length ? <ul>{visibleSource.sources.map(source => <li key={source.id}><a href={withWorkOrigin(source.href, origin)}>{source.title}</a></li>)}</ul> : null}
        </details> : null}
        {path.artifactFields.map((f) => {
          const id = `f-${path.id}-${f.id}`;
          const v = values[f.id];
          return (
            <Field key={f.id} id={id} label={f.label + (f.required ? ` (${copyText(copy, "requiredFieldSuffix")})` : "")} help={f.help || undefined}>
              {f.type === "text" ? (
                <input id={id} type="text" value={typeof v === "string" ? v : ""} onChange={(e) => setField(f.id, e.target.value)} />
              ) : f.type === "date" ? (
                <input id={id} type="date" value={typeof v === "string" ? v : ""} onChange={(e) => setField(f.id, e.target.value)} />
              ) : f.type === "list" ? (
                <textarea id={id} value={Array.isArray(v) ? v.join("\n") : ""} onChange={(e) => setField(f.id, e.target.value.split("\n"))} placeholder={copyText(copy, "listPlaceholder")} />
              ) : (
                <textarea id={id} value={typeof v === "string" ? v : ""} onChange={(e) => setField(f.id, e.target.value)} />
              )}
            </Field>
          );
        })}
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn--light" onClick={persist}>
            {copyText(copy, "saveNotesLabel")}
          </button>
          <button type="submit" className="btn btn--primary">
            {copyText(copy, "reviewWorkLabel")}
          </button>
          <button type="button" className="btn btn--light" onClick={clearAll}>
            {copyText(copy, "deleteNotesLabel")}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          <button type="button" className="btn btn--light" onClick={()=>void copyNotes()}>Copy notes</button>
          <button type="button" className="btn btn--light" onClick={downloadNotes}>Download notes</button>
        </div>
        {exportNotice ? <p role="status" className="mt-2 text-sm">{exportNotice}</p> : null}
        {manualCopy ? <label className="mt-3 block">Your notes<textarea readOnly className="min-h-60 w-full" value={practiceNotesText(path,values,visibleSource)} onFocus={event=>event.currentTarget.select()} /></label> : null}
        {savedAt ? <p className="mt-2 text-sm text-muted">{copyText(copy, "savedPrefix")} {new Date(savedAt).toLocaleTimeString()}.</p> : draft ? <p className="mt-2 text-sm text-muted">{copyText(copy, "unsavedLabel")}</p> : null}

        {check ? (
          <section className="mt-6" aria-live="polite" aria-labelledby="check-title">
            <h3 id="check-title" className="text-lg font-bold">
              {check.passed ? copyText(copy, "reviewCompleteTitle") : copyText(copy, "detailsNeededTitle")}
            </h3>
            {check.privacy && !check.privacy.ok ? <Notice tone="stop">{check.privacy.message}</Notice> : null}
            {check.requiredFields.some(field => !field.ok) ? (
              <ul className="mt-2 list-disc pl-5">
                {check.requiredFields.filter(field => !field.ok).map(field => (
                  <li key={field.id}><a href={"#f-" + path.id + "-" + field.id}>{copyText(copy, "notYetPrefix")}: {field.label}</a></li>
                ))}
              </ul>
            ) : null}
            <ul className="mt-2 list-none space-y-1 p-0">
              {check.results.map((r) => (
                <li key={r.key} className={r.ok ? "" : "font-bold"}>
                  {r.ok ? `${copyText(copy, "donePrefix")}: ` : `${copyText(copy, "notYetPrefix")}: `}
                  {r.label}
                  {!r.ok && r.message ? <span className="block text-sm font-normal">{r.message}</span> : null}
                </li>
              ))}
            </ul>
            {check.passed ? (
              <div className="notice mt-3">
                <strong>{copyText(copy, "readyLead")} </strong>
              {consultationAction.href.startsWith("/support/request")
                  ? copyText(copy, intakeEnabled ? "readyOpenBody" : "readyPreviewBody")
                  : copyText(copy, "supportOneDhsBody")}
              </div>
            ) : (
              <p className="mt-3 text-sm">{copyText(copy, "missingDetailsBody")}</p>
            )}
          </section>
        ) : null}
        </fieldset>
      </form>

      <aside className="space-y-4">
        <div className="panel">
          <p className="kicker">{copyText(copy, "progressKicker")}</p>
          <div className="checks">
            {steps.map((s) => (
              <label key={s.key}>
                <input type="checkbox" disabled={!hydrated} checked={Boolean(progress[s.key])} onChange={() => toggleStep(s.key)} />
                <span>{s.title}</span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-sm text-muted">{copyText(copy, "reviewStatusPrefix")} {(!draft && progress.complete) ? copyText(copy, "completeStatus") : copyText(copy, "incompleteStatus")}. {copyText(copy, "browserStorageBody")}</p>
        </div>
        <div className="panel">
          <p className="kicker">{consultationAction.href.startsWith("/support/request") ? copyText(copy, "dsdConsultKicker") : copyText(copy, "humanSupportKicker")}</p>
          <p className="text-sm">
            {!consultationAction.href.startsWith("/support/request")
              ? copyText(copy, "supportOneDhsBody")
              : intakeEnabled
                ? copyText(copy, "supportDsdOpenBody")
                : copyText(copy, "supportDsdPreviewBody")}
          </p>
          <Link href={withWorkOrigin(consultationAction.href, origin)} className="btn btn--light" onClick={consultationAction.href.startsWith("/support/request") ? prefillConsult : undefined}>
            {consultationAction.label}
          </Link>
        </div>
      </aside>
    </div>
  );
}
