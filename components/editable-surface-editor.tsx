"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CourseContentEditor } from "./course-content-editor";
import { useRouter } from "next/navigation";
import { Field, Notice } from "@/components/ui";
import {
  type EditableRichBlock,
  type EditableSurfaceDefinition,
  type EditableSurfaceFieldDefinition,
  type EditableSurfaceLink,
  type EditableSurfaceValues,
} from "@/lib/content/editable-surface-contract";
import type { EditableSurfaceEditingState } from "@/lib/content/editable-surfaces";
import type { StaffProgramScope } from "@/lib/content/staff-publications";

type ApiResponse = {
  state?: EditableSurfaceEditingState;
  message?: string;
  error?: string;
};

function textValue(values: EditableSurfaceValues, key: string): string {
  const value = values[key];
  return typeof value === "string" ? value : "";
}

function textListValue(values: EditableSurfaceValues, key: string): string[] {
  const value = values[key];
  return Array.isArray(value) && (value.length === 0 || typeof value[0] === "string")
    ? [...value] as string[]
    : [];
}

function linkListValue(values: EditableSurfaceValues, key: string): EditableSurfaceLink[] {
  const value = values[key];
  return Array.isArray(value) && (value.length === 0 || (typeof value[0] === "object" && value[0] !== null && "href" in value[0]))
    ? (value as EditableSurfaceLink[]).map((link) => ({ ...link }))
    : [];
}

function richBlockValue(values: EditableSurfaceValues, key: string): EditableRichBlock[] {
  const value = values[key];
  return Array.isArray(value) && (value.length === 0 || (typeof value[0] === "object" && value[0] !== null && "type" in value[0]))
    ? (value as EditableRichBlock[]).map((block) => ({ ...block }))
    : [];
}

function previewText(value: EditableSurfaceValues[string]): React.ReactNode {
  if (typeof value === "string") return value || <span className="text-muted">No wording entered</span>;
  if (!Array.isArray(value)) return <p>{value.course.title} — {value.course.lessons.length} lessons</p>;
  if (!value.length) return <span className="text-muted">No items entered</span>;
  if (typeof value[0] === "string") {
    return <ul className="mt-1 list-disc pl-6">{(value as string[]).map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul>;
  }
  if ("href" in value[0]) {
    return <ul className="mt-1 list-disc pl-6">{(value as EditableSurfaceLink[]).map((link, index) => <li key={`${link.href}-${index}`}>{link.label} — {link.href}</li>)}</ul>;
  }
  return (
    <div className="mt-1 space-y-2">
      {(value as EditableRichBlock[]).map((block, index) => {
        if (block.type === "heading") return <p className="font-bold" key={index}>{block.text}</p>;
        if (block.type === "paragraph") return <p key={index}>{block.text}</p>;
        if (block.type === "link-list") return <ul className="list-disc pl-6" key={index}>{block.items.map((link) => <li key={link.href}>{link.label} — {link.href}</li>)}</ul>;
        const List = block.type === "numbered-list" ? "ol" : "ul";
        return <List className={block.type === "numbered-list" ? "list-decimal pl-6" : "list-disc pl-6"} key={index}>{block.items.map((item, itemIndex) => <li key={`${item}-${itemIndex}`}>{item}</li>)}</List>;
      })}
    </div>
  );
}

export function EditableSurfaceEditor({
  definition,
  scope,
  currentValues,
  inherited,
}: {
  definition: EditableSurfaceDefinition;
  scope: StaffProgramScope;
  currentValues: EditableSurfaceValues;
  inherited: boolean;
}) {
  const router = useRouter();
  const surfaceLabel = definition.label ?? "this page area";
  const id = useId().replace(/:/g, "");
  const panelId = `edit-${id}`;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<EditableSurfaceEditingState | null>(null);
  const [values, setValues] = useState<EditableSurfaceValues>({ ...currentValues });
  const [changeNote, setChangeNote] = useState("");
  const [decisionReason, setDecisionReason] = useState("");
  const [restoreRevisionId, setRestoreRevisionId] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [confirmClose, setConfirmClose] = useState(false);
  const keepEditingRef = useRef<HTMLButtonElement>(null);

  // Unsaved edits live only in this component. Warn before the page is left,
  // and ask before the panel is closed, so wording is never lost silently.
  const baseline = state ? (state.draft?.document.values ?? state.effective?.values ?? definition.approvedValues) : null;
  const dirty = open && baseline !== null && (JSON.stringify(values) !== JSON.stringify(baseline) || changeNote !== "");
  useEffect(() => {
    if (!dirty) return;
    const guard = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [dirty]);
  useEffect(() => {
    if (confirmClose) keepEditingRef.current?.focus();
  }, [confirmClose]);

  function discardAndClose() {
    if (baseline) setValues({ ...baseline });
    setChangeNote("");
    setConfirmClose(false);
    setOpen(false);
  }

  async function openEditor() {
    const nextOpen = !open;
    if (!nextOpen && dirty) {
      setConfirmClose(true);
      return;
    }
    setOpen(nextOpen);
    if (!nextOpen || state || loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/consultant/content/${encodeURIComponent(definition.surfaceId)}`, {
        headers: { accept: "application/json" },
        cache: "no-store",
      });
      const result = await response.json().catch(() => ({})) as ApiResponse;
      if (!response.ok || !result.state) {
        setError(result.error ?? "This wording could not be opened right now.");
        return;
      }
      setState(result.state);
      setValues({ ...(result.state.draft?.document.values ?? result.state.effective?.values ?? currentValues) });
    } catch {
      setError("This wording could not be opened right now.");
    } finally {
      setLoading(false);
    }
  }

  async function send(action: Record<string, unknown>, refresh = false) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/consultant/content/${encodeURIComponent(definition.surfaceId)}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(action),
      });
      const result = await response.json().catch(() => ({})) as ApiResponse;
      if (!response.ok || !result.state) {
        setError(result.error ?? "The change could not be confirmed. Reload the page to check the saved wording before trying again.");
        return;
      }
      setState(result.state);
      setValues({ ...(result.state.draft?.document.values ?? result.state.effective?.values ?? definition.approvedValues) });
      setMessage(result.message ?? "Your change was saved.");
      if (refresh) router.refresh();
    } catch {
      setError("The change could not be confirmed. Reload the page to check the saved wording before trying again.");
    } finally {
      setBusy(false);
    }
  }

  function updateValue(key: string, value: EditableSurfaceValues[string]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function saveChanges(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!state) return;
    void send({
      action: "save_changes",
      expectedPublicationDecisionId: state.latestDecision?.publicationDecisionId ?? null,
      scope,
      expectedRevisionId: state.expectedRevisionId,
      document: { schemaVersion: 1, surfaceId: definition.surfaceId, scope, values },
      changeNote: changeNote.trim() || null,
    }, true);
  }

  const ownPublished = state?.effective?.sourceScope === scope ? state.effective : null;
  const canResumeInheritance = scope === "dsd"
    && definition.scopePolicy === "inheritable"
    && (state?.latestDecision?.decision === "publish" || state?.latestDecision?.decision === "withdraw");

  return (
    <div className="mb-3 border-b border-line pb-3 text-left">
      <button className="btn btn--light" type="button" aria-expanded={open} aria-controls={open ? panelId : undefined} onClick={() => void openEditor()}>
        {open ? "Close editing" : `Edit ${surfaceLabel.toLowerCase()}`}
      </button>

      {open ? (
        <section className="card mt-3" id={panelId} aria-label={`Edit ${surfaceLabel}`}>
          <p className="kicker">Consultant Workspace</p>
          <h2 className="text-xl font-extrabold">Edit {surfaceLabel.toLowerCase()}</h2>
          <p className="mt-2 text-sm text-muted">
            Save to update what staff see. Earlier wording stays available below.
          </p>
          {inherited ? <Notice>Right now this DSD view shows the One DHS wording. Saving here creates DSD wording of its own without changing One DHS.</Notice> : null}
          {loading ? <p aria-live="polite">Opening the saved wording.</p> : null}
          {error ? <p className="error" role="alert">{error}</p> : null}
          {message ? <p className="notice" role="status">{message}</p> : null}
          {confirmClose ? (
            <div className="notice notice--warn mt-3" role="alertdialog" aria-modal="false" aria-labelledby={`${panelId}-close-confirm-title`} aria-describedby={`${panelId}-close-confirm-text`}>
              <p className="m-0 font-bold" id={`${panelId}-close-confirm-title`}>You have unsaved changes</p>
              <p className="mt-1 mb-0" id={`${panelId}-close-confirm-text`}>Closing this editor will discard them. The saved wording is not affected.</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button className="btn btn--light" type="button" ref={keepEditingRef} onClick={() => setConfirmClose(false)}>Keep editing</button>
                <button className="btn btn--primary" type="button" onClick={discardAndClose}>Discard changes and close</button>
              </div>
            </div>
          ) : null}

          {state ? (
            <>
              <form className="mt-5" onSubmit={saveChanges}>
                <div className="grid gap-x-6 md:grid-cols-2">
                  {definition.fields.map((field) => (
                    <EditableField
                      key={field.key}
                      field={field}
                      id={`${panelId}-${field.key}`}
                      values={values}
                      updateValue={updateValue}
                    />
                  ))}
                </div>
                <Field id={`${panelId}-change-note`} label="Note about these changes" help="Optional. A few words that help you recognize this version later.">
                  <textarea id={`${panelId}-change-note`} rows={3} maxLength={1_000} value={changeNote} onChange={(event) => setChangeNote(event.target.value)} />
                </Field>
                <div className="flex flex-wrap gap-3">
                  <button className="btn btn--primary" type="submit" disabled={busy}>{busy ? "Saving" : "Save changes"}</button>
                  <button className="btn btn--light" type="button" onClick={() => setShowPreview((current) => !current)}>{showPreview ? "Close preview" : "Preview changes"}</button>
                  <button className="btn btn--light" type="button" onClick={() => setValues({ ...(state.draft?.document.values ?? state.effective?.values ?? definition.approvedValues) })}>Reset unsaved changes</button>
                </div>
              </form>

              {showPreview ? (
                <section className="panel mt-5" aria-labelledby={`${panelId}-preview-title`}>
                  <h3 className="text-lg font-bold" id={`${panelId}-preview-title`}>Preview changes</h3>
                  <dl className="mt-3 grid gap-4 md:grid-cols-2">
                    {definition.fields.map((field) => <div key={field.key}><dt className="font-bold">{field.label}</dt><dd className="m-0">{previewText(values[field.key])}</dd></div>)}
                  </dl>
                </section>
              ) : null}

              <section className="panel mt-5" aria-labelledby={`${panelId}-publish-title`}>
                <h3 className="text-lg font-bold" id={`${panelId}-publish-title`}>What staff see</h3>
                <Field id={`${panelId}-decision-reason`} label="Why you are making this change" help="A short note for the record. Staff never see it."><textarea id={`${panelId}-decision-reason`} rows={3} maxLength={1_000} value={decisionReason} onChange={(event) => setDecisionReason(event.target.value)} /></Field>
                <div className="flex flex-wrap gap-3">
                  {ownPublished ? <button className="btn btn--light" type="button" disabled={busy || !decisionReason.trim()} onClick={() => void send({ action: "withdraw", scope, expectedPublishedRevisionId: ownPublished.revisionId, expectedPublicationDecisionId: state.latestDecision?.publicationDecisionId ?? null, reason: decisionReason.trim() }, true)}>Take this wording down</button> : null}
                  {canResumeInheritance ? <button className="btn btn--light" type="button" disabled={busy || !decisionReason.trim()} onClick={() => void send({ action: "resume_inheritance", scope: "dsd", expectedPublicationDecisionId: state.latestDecision?.publicationDecisionId ?? null, reason: decisionReason.trim() }, true)}>Use One DHS wording again</button> : null}
                </div>
              </section>

              {state.history.some((entry) => entry.canRestore) ? (
                <section className="panel mt-5" aria-labelledby={`${panelId}-history-title`}>
                  <h3 className="text-lg font-bold" id={`${panelId}-history-title`}>Bring back earlier wording</h3>
                  <Field id={`${panelId}-restore-version`} label="Earlier version"><select id={`${panelId}-restore-version`} value={restoreRevisionId} onChange={(event) => setRestoreRevisionId(event.target.value)}><option value="">Choose a version</option>{state.history.filter((entry) => entry.canRestore).map((entry) => <option key={entry.revisionId} value={entry.revisionId}>Version {entry.revisionNumber} — {new Date(entry.createdAt).toLocaleDateString()}</option>)}</select></Field>
                  <button className="btn btn--light" type="button" disabled={busy || !restoreRevisionId || !decisionReason.trim()} onClick={() => void send({ action: "restore", scope, targetRevisionId: restoreRevisionId, expectedPublicationDecisionId: state.latestDecision?.publicationDecisionId ?? null, reason: decisionReason.trim() }, true)}>Bring back this version</button>
                </section>
              ) : null}
            </>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

function EditableField({
  field,
  id,
  values,
  updateValue,
}: {
  field: EditableSurfaceFieldDefinition;
  id: string;
  values: EditableSurfaceValues;
  updateValue: (key: string, value: EditableSurfaceValues[string]) => void;
}) {
  if (field.kind === "course-pack") {
    const pack = values[field.key];
    return pack && typeof pack === "object" && !Array.isArray(pack) ? <CourseContentEditor value={pack} onChange={next=>updateValue(field.key,next)}/> : null;
  }
  if (field.kind === "string-list") {
    const items = textListValue(values, field.key);
    return (
      <fieldset className="field">
        <legend className="font-bold text-navy-deep">{field.label}</legend>
        <div className="mt-2 space-y-2">
          {items.map((item, index) => (
            <div className="flex gap-2" key={index}>
              <input aria-label={`${field.label}, item ${index + 1}`} value={item} maxLength={field.maxLength} onChange={(event) => updateValue(field.key, items.map((current, itemIndex) => itemIndex === index ? event.target.value : current))} />
              <button className="btn btn--light" type="button" onClick={() => updateValue(field.key, items.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
            </div>
          ))}
        </div>
        <button className="btn btn--light mt-2" type="button" onClick={() => updateValue(field.key, [...items, ""])}>Add item</button>
      </fieldset>
    );
  }

  if (field.kind === "link-list") {
    const links = linkListValue(values, field.key);
    return (
      <fieldset className="field md:col-span-2">
        <legend className="font-bold text-navy-deep">{field.label}</legend>
        <div className="mt-2 space-y-3">
          {links.map((link, index) => (
            <div className="panel grid gap-2 md:grid-cols-[1fr_1fr_auto]" key={index}>
              <label><span className="block text-sm font-bold">Link wording</span><input value={link.label} maxLength={field.maxLength} onChange={(event) => updateValue(field.key, links.map((current, linkIndex) => linkIndex === index ? { ...current, label: event.target.value } : current))} /></label>
              <label><span className="block text-sm font-bold">Destination</span><input value={link.href} maxLength={2_000} onChange={(event) => updateValue(field.key, links.map((current, linkIndex) => linkIndex === index ? { ...current, href: event.target.value } : current))} /></label>
              <button className="btn btn--light self-end" type="button" onClick={() => updateValue(field.key, links.filter((_, linkIndex) => linkIndex !== index))}>Remove</button>
            </div>
          ))}
        </div>
        <button className="btn btn--light mt-2" type="button" onClick={() => updateValue(field.key, [...links, { label: "", href: "/" }])}>Add link</button>
      </fieldset>
    );
  }

  if (field.kind === "rich-blocks") {
    const blocks = richBlockValue(values, field.key);
    return (
      <fieldset className="field md:col-span-2">
        <legend className="font-bold text-navy-deep">{field.label}</legend>
        <div className="mt-2 space-y-3">
          {blocks.map((block, index) => <RichBlockField key={index} block={block} label={field.label} update={(next) => updateValue(field.key, blocks.map((current, blockIndex) => blockIndex === index ? next : current))} remove={() => updateValue(field.key, blocks.filter((_, blockIndex) => blockIndex !== index))} />)}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <button className="btn btn--light" type="button" onClick={() => updateValue(field.key, [...blocks, { type: "paragraph", text: "" }])}>Add paragraph</button>
          <button className="btn btn--light" type="button" onClick={() => updateValue(field.key, [...blocks, { type: "heading", level: 2, text: "" }])}>Add heading</button>
          <button className="btn btn--light" type="button" onClick={() => updateValue(field.key, [...blocks, { type: "bullet-list", items: [""] }])}>Add list</button>
        </div>
      </fieldset>
    );
  }

  const value = textValue(values, field.key);
  return (
    <Field id={id} label={field.label} help={field.helpText}>
      {field.kind === "long" ? (
        <textarea id={id} rows={4} value={value} maxLength={field.maxLength} onChange={(event) => updateValue(field.key, event.target.value)} />
      ) : (
        <input id={id} type={field.kind === "url" ? "text" : "text"} value={value} maxLength={field.maxLength} onChange={(event) => updateValue(field.key, event.target.value)} />
      )}
    </Field>
  );
}

function RichBlockField({ block, label, update, remove }: { block: EditableRichBlock; label: string; update: (block: EditableRichBlock) => void; remove: () => void }) {
  return (
    <div className="panel">
      {block.type === "heading" ? (
        <div className="grid gap-2 md:grid-cols-[10rem_1fr]">
          <label><span className="block text-sm font-bold">Heading level</span><select value={block.level} onChange={(event) => update({ ...block, level: Number(event.target.value) as 2 | 3 })}><option value={2}>Main section</option><option value={3}>Subsection</option></select></label>
          <label><span className="block text-sm font-bold">Heading</span><input value={block.text} onChange={(event) => update({ ...block, text: event.target.value })} /></label>
        </div>
      ) : block.type === "paragraph" ? (
        <label><span className="block text-sm font-bold">Paragraph</span><textarea rows={4} value={block.text} onChange={(event) => update({ ...block, text: event.target.value })} /></label>
      ) : block.type === "link-list" ? (
        <p className="text-sm text-muted">Save this section first; then each link in this group can be edited on its own.</p>
      ) : (
        <label><span className="block text-sm font-bold">{block.type === "numbered-list" ? "Numbered list" : "List"}</span><textarea rows={4} aria-label={label} value={block.items.join("\n")} onChange={(event) => update({ ...block, items: event.target.value.split("\n") })} /></label>
      )}
      <button className="btn btn--light mt-2" type="button" onClick={remove}>Remove this section</button>
    </div>
  );
}
