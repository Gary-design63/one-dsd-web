"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Field, Notice } from "@/components/ui";
import {
  EDITABLE_AUTHORITIES,
  EDITABLE_CONTENT_TYPES,
  EDITABLE_INTENTS,
  EDITABLE_LAYERS,
  INTENT_LABELS,
  type EditableResourceFields,
  type EditableResourceState,
} from "@/lib/content/resource-editor-contract";
import { AUTHORITY, CONTENT_TYPE_LABEL, LAYER_LABEL } from "@/lib/content/types";

type PathOption = { id: string; label: string };

type DraftResponse = {
  ok?: boolean;
  draft?: EditableResourceState;
  message?: string;
  error?: string;
};

function bodyText(parts: string[]) {
  return parts.join("\n\n");
}

function bodyParts(value: string) {
  return value
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function topicText(topics: string[]) {
  return topics.join(", ");
}

function topics(value: string) {
  return Array.from(
    new Set(
      value
        .split(/[\n,]/)
        .map((topic) => topic.trim())
        .filter(Boolean),
    ),
  );
}

export function ResourceInlineEditor({
  initial,
  pathOptions,
  endpoint,
  reviewHref,
  workspaceLabel = "Consultant Workspace",
}: {
  initial: EditableResourceState;
  pathOptions: PathOption[];
  endpoint?: string;
  reviewHref?: string;
  workspaceLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(initial);
  const [fields, setFields] = useState(initial.fields);
  const [body, setBody] = useState(bodyText(initial.fields.body));
  const [tagText, setTagText] = useState(topicText(initial.fields.tags));
  const [changeNote, setChangeNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [confirmClose, setConfirmClose] = useState(false);
  const keepEditingRef = useRef<HTMLButtonElement>(null);

  // Unsaved edits live only in this component. Warn before the page is left,
  // and ask before the fields are closed, so a draft is never lost silently.
  const dirty = open && (
    JSON.stringify(fields) !== JSON.stringify(saved.fields)
    || body !== bodyText(saved.fields.body)
    || tagText !== topicText(saved.fields.tags)
    || changeNote !== ""
  );
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

  function requestClose() {
    if (dirty) {
      setConfirmClose(true);
      return;
    }
    setOpen(false);
  }

  function discardAndClose() {
    restoreSavedDraft();
    setConfirmClose(false);
    setOpen(false);
  }

  function update<K extends keyof EditableResourceFields>(
    key: K,
    value: EditableResourceFields[K],
  ) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  function restoreSavedDraft() {
    setFields(saved.fields);
    setBody(bodyText(saved.fields.body));
    setTagText(topicText(saved.fields.tags));
    setChangeNote("");
    setError("");
    setMessage("");
  }

  async function saveDraft(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const nextFields = { ...fields, body: bodyParts(body), tags: topics(tagText) };

    try {
      const response = await fetch(
        endpoint ?? `/api/consultant/resources/${encodeURIComponent(initial.contentItemId)}/draft`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            expectedRevisionId: saved.expectedRevisionId,
            fields: nextFields,
            changeNote: changeNote.trim() || null,
          }),
        },
      );
      const result = (await response.json().catch(() => ({}))) as DraftResponse;
      if (!response.ok || !result.draft) {
        setError(result.error ?? "The draft could not be saved. Your approved resource has not changed.");
        return;
      }
      setSaved(result.draft);
      setFields(result.draft.fields);
      setBody(bodyText(result.draft.fields.body));
      setTagText(topicText(result.draft.fields.tags));
      setChangeNote("");
      setMessage(result.message ?? "Draft saved for review. Staff still see the current approved version.");
    } catch {
      setError("The draft could not be saved. Your approved resource has not changed.");
    } finally {
      setBusy(false);
    }
  }

  const availablePaths = Array.from(
    new Map(
      [
        ...pathOptions,
        ...fields.pathIds
          .filter((id) => !pathOptions.some((option) => option.id === id))
          .map((id) => ({ id, label: id })),
      ].map((option) => [option.id, option]),
    ).values(),
  );

  return (
    <section className="card mt-8" aria-labelledby="edit-resource-heading">
        <p className="kicker">{workspaceLabel}</p>
      <h2 className="text-xl font-extrabold" id="edit-resource-heading">
        Edit this resource
      </h2>
      <p className="mt-2 mb-0">
        Make changes here without replacing what staff already use. Saving creates a draft that must be reviewed before it can be published.
      </p>
      {saved.hasUnpublishedChanges ? (
        <div className="mt-4">
          <Notice tone="warn">You are editing the most recent draft. Staff still see the current approved version.</Notice>
        </div>
      ) : null}
      {saved.hasUnpublishedChanges ? (
        <p className="mt-4 mb-0">
          <Link href={reviewHref ?? `/consultant/resources/${encodeURIComponent(initial.contentItemId)}`}>Review this draft and decide whether to publish it</Link>
        </p>
      ) : null}
      {!open ? (
        <button className="btn btn--primary mt-4" type="button" onClick={() => setOpen(true)}>
          Open editing fields
        </button>
      ) : (
        <form className="mt-6" onSubmit={saveDraft}>
          <div className="grid gap-x-6 md:grid-cols-2">
            <Field id="resource-title" label="Title">
              <input
                id="resource-title"
                type="text"
                value={fields.title}
                maxLength={300}
                required
                onChange={(event) => update("title", event.target.value)}
              />
            </Field>
            <Field id="resource-owner" label="Person or office responsible">
              <input
                id="resource-owner"
                type="text"
                value={fields.owner}
                maxLength={200}
                required
                onChange={(event) => update("owner", event.target.value)}
              />
            </Field>
            <Field id="resource-type" label="Resource type">
              <select
                id="resource-type"
                value={fields.type}
                onChange={(event) => update("type", event.target.value as EditableResourceFields["type"])}
              >
                {EDITABLE_CONTENT_TYPES.map((value) => (
                  <option key={value} value={value}>
                    {CONTENT_TYPE_LABEL[value]}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="resource-authority" label="How staff should understand it">
              <select
                id="resource-authority"
                value={fields.authority}
                onChange={(event) => update("authority", event.target.value as EditableResourceFields["authority"])}
              >
                {EDITABLE_AUTHORITIES.map((value) => (
                  <option key={value} value={value}>
                    {AUTHORITY[value].label}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="resource-layer" label="Level of detail">
              <select
                id="resource-layer"
                value={fields.layer}
                onChange={(event) => update("layer", event.target.value as EditableResourceFields["layer"])}
              >
                {EDITABLE_LAYERS.map((value) => (
                  <option key={value} value={value}>
                    {LAYER_LABEL[value]}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="resource-scope" label="Where this applies">
              <select
                id="resource-scope"
                value={fields.scope}
                disabled
              >
                <option value={fields.scope}>{fields.scope === "dsd" ? "Disability Services Division" : "One DHS agencywide"}</option>
              </select>
            </Field>
            <Field id="resource-review-date" label="Review date">
              <input
                id="resource-review-date"
                type="date"
                value={fields.reviewDate}
                required
                onChange={(event) => update("reviewDate", event.target.value)}
              />
            </Field>
          </div>

          <Field id="resource-summary" label="Short overview">
            <textarea
              id="resource-summary"
              value={fields.summary}
              maxLength={2_000}
              required
              rows={3}
              onChange={(event) => update("summary", event.target.value)}
            />
          </Field>
          <Field id="resource-why" label="Why this matters">
            <textarea
              id="resource-why"
              value={fields.whyItMatters ?? ""}
              maxLength={3_000}
              rows={3}
              onChange={(event) => update("whyItMatters", event.target.value || null)}
            />
          </Field>
          <Field
            id="resource-body"
            label="Resource content"
            help="Leave a blank line between each paragraph or list item."
          >
            <textarea
              id="resource-body"
              value={body}
              maxLength={100_000}
              required
              rows={12}
              onChange={(event) => setBody(event.target.value)}
            />
          </Field>

          <fieldset className="panel mb-4">
            <legend className="font-bold text-navy-deep">What this resource helps staff do</legend>
            <div className="checks mt-3 sm:grid-cols-2">
              {EDITABLE_INTENTS.map((intent) => (
                <label key={intent}>
                  <input
                    type="checkbox"
                    checked={fields.intents.includes(intent)}
                    onChange={(event) =>
                      update(
                        "intents",
                        event.target.checked
                          ? Array.from(new Set([...fields.intents, intent]))
                          : fields.intents.filter((value) => value !== intent),
                      )
                    }
                  />
                  <span>{INTENT_LABELS[intent]}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <Field id="resource-tags" label="Topics" help="Separate topics with commas or place each one on its own line.">
            <textarea
              id="resource-tags"
              value={tagText}
              maxLength={5_000}
              rows={3}
              onChange={(event) => setTagText(event.target.value)}
            />
          </Field>

          <fieldset className="panel mb-4">
            <legend className="font-bold text-navy-deep">Learning paths</legend>
            <div className="checks mt-3">
              {availablePaths.map((path) => (
                <label key={path.id}>
                  <input
                    type="checkbox"
                    checked={fields.pathIds.includes(path.id)}
                    onChange={(event) =>
                      update(
                        "pathIds",
                        event.target.checked
                          ? Array.from(new Set([...fields.pathIds, path.id]))
                          : fields.pathIds.filter((value) => value !== path.id),
                      )
                    }
                  />
                  <span>{path.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="panel mb-4">
            <legend className="font-bold text-navy-deep">Next steps shown with this resource</legend>
            <div className="mt-3 space-y-4">
              {fields.nextActions.map((action, index) => (
                <div className="grid gap-x-4 border-b border-line pb-4 md:grid-cols-[1fr_1fr_auto]" key={index}>
                  <Field id={`next-step-label-${index}`} label="Link wording">
                    <input
                      id={`next-step-label-${index}`}
                      type="text"
                      value={action.label}
                      maxLength={200}
                      required
                      onChange={(event) =>
                        update(
                          "nextActions",
                          fields.nextActions.map((current, currentIndex) =>
                            currentIndex === index ? { ...current, label: event.target.value } : current,
                          ),
                        )
                      }
                    />
                  </Field>
                  <Field id={`next-step-address-${index}`} label="Program path or secure web address">
                    <input
                      id={`next-step-address-${index}`}
                      type="text"
                      value={action.href}
                      maxLength={2_000}
                      required
                      onChange={(event) =>
                        update(
                          "nextActions",
                          fields.nextActions.map((current, currentIndex) =>
                            currentIndex === index ? { ...current, href: event.target.value } : current,
                          ),
                        )
                      }
                    />
                  </Field>
                  <button
                    className="btn btn--light self-end mb-4"
                    type="button"
                    onClick={() => update("nextActions", fields.nextActions.filter((_, currentIndex) => currentIndex !== index))}
                  >
                    Remove this step
                  </button>
                </div>
              ))}
            </div>
            <button
              className="btn btn--light mt-3"
              type="button"
              onClick={() => update("nextActions", [...fields.nextActions, { label: "", href: "" }])}
            >
              Add another step
            </button>
          </fieldset>

          <div className="grid gap-x-6 md:grid-cols-2">
            <Field id="resource-source-name" label="Public source name, if used">
              <input
                id="resource-source-name"
                type="text"
                value={fields.sourceName ?? ""}
                maxLength={300}
                onChange={(event) => update("sourceName", event.target.value || null)}
              />
            </Field>
            <Field id="resource-source-address" label="Public source address, if used" help="Use a secure web address beginning with https://.">
              <input
                id="resource-source-address"
                type="url"
                value={fields.href ?? ""}
                maxLength={2_000}
                onChange={(event) => update("href", event.target.value || null)}
              />
            </Field>
          </div>
          <Field id="resource-change-note" label="Note about this change" help="Optional. Use this to help reviewers understand what you changed.">
            <textarea
              id="resource-change-note"
              value={changeNote}
              maxLength={500}
              rows={2}
              onChange={(event) => setChangeNote(event.target.value)}
            />
          </Field>

          {error ? (
            <p className="error" role="alert">
              {error}
            </p>
          ) : null}
          {message ? (
            <p className="notice" role="status">
              {message}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button className="btn btn--primary" type="submit" disabled={busy}>
              {busy ? "Saving draft" : "Save draft for review"}
            </button>
            <button className="btn btn--light" type="button" disabled={busy} onClick={restoreSavedDraft}>
              Restore saved draft
            </button>
            <button className="text-button" type="button" disabled={busy} onClick={requestClose}>
              Close editing fields
            </button>
          </div>
          {confirmClose ? (
            <div className="notice notice--warn mt-4" role="alertdialog" aria-modal="false" aria-labelledby="resource-close-confirm-title" aria-describedby="resource-close-confirm-text">
              <p className="m-0 font-bold" id="resource-close-confirm-title">You have unsaved changes</p>
              <p className="mt-1 mb-0" id="resource-close-confirm-text">Closing the editing fields will discard them. The saved draft is not affected.</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button className="btn btn--light" type="button" ref={keepEditingRef} onClick={() => setConfirmClose(false)}>Keep editing</button>
                <button className="btn btn--primary" type="button" onClick={discardAndClose}>Discard changes and close</button>
              </div>
            </div>
          ) : null}
        </form>
      )}
    </section>
  );
}
