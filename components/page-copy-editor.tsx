"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Field, Notice } from "@/components/ui";
import {
  FOOTER_COPY_KEYS,
  HOME_COPY_KEYS,
  type FooterCopy,
  type HomePageCopy,
  type PageBlockCopy,
  type PageBlockEditingState,
  type PageBlockSurface,
  type PageCopyAction,
} from "@/lib/content/page-copy-contract";

type FieldKey = (typeof HOME_COPY_KEYS)[number] | (typeof FOOTER_COPY_KEYS)[number];
type FieldDescription = { key: FieldKey; label: string; rows?: number; help?: string };
type FieldGroup = { heading: string; fields: readonly FieldDescription[] };

export const HOME_COPY_FIELD_GROUPS: readonly FieldGroup[] = [
  {
    heading: "Opening section",
    fields: [
      { key: "heroKicker", label: "Program name above the heading" },
      { key: "headlineLine1", label: "Heading, first line" },
      { key: "headlineLine2", label: "Heading, second line" },
      { key: "headlineLine3", label: "Heading, third line" },
      { key: "heroLede", label: "Opening description", rows: 3 },
      { key: "heroNote", label: "Additional opening text (optional)", rows: 4 },
      { key: "heroImageAlt", label: "Image description", rows: 3 },
      { key: "primaryActionLabel", label: "First button wording" },
      { key: "primaryActionHref", label: "First button destination", help: "Use a program path or a secure web address." },
      { key: "secondaryActionLabel", label: "Second button wording" },
      { key: "secondaryActionHref", label: "Second button destination", help: "Use a program path or a secure web address." },
    ],
  },
  {
    heading: "About the program",
    fields: [
      { key: "aboutLabel", label: "Section label" },
      { key: "aboutText", label: "Program introduction", rows: 5 },
    ],
  },
  {
    heading: "Guided Start",
    fields: [
      { key: "guidedKicker", label: "Section name" },
      { key: "guidedTitle", label: "Section heading" },
      { key: "guidedIntro", label: "Section introduction", rows: 5 },
      { key: "guidedFallbackLabel", label: "Choice shown when no situation fits" },
      { key: "guidedFallbackNote", label: "Explanation for that choice", rows: 3 },
    ],
  },
  {
    heading: "Ways to use the program",
    fields: [
      { key: "helpKicker", label: "Section name" },
      { key: "helpTitle", label: "Section heading" },
      { key: "askLabel", label: "Ask link wording" },
      { key: "askHref", label: "Ask link destination" },
      { key: "askDescription", label: "Ask description", rows: 4 },
      { key: "communitiesLabel", label: "Minnesota Communities link wording" },
      { key: "communitiesHref", label: "Minnesota Communities destination" },
      { key: "communitiesDescription", label: "Minnesota Communities description", rows: 4 },
      { key: "resourcesLabel", label: "Resources link wording" },
      { key: "resourcesHref", label: "Resources link destination" },
      { key: "resourcesDescription", label: "Resources description", rows: 4 },
      { key: "supportLabel", label: "Support link wording" },
      { key: "supportHref", label: "Support link destination" },
      { key: "supportAvailableDescription", label: "Support description when requests are open", rows: 4 },
      { key: "supportPreviewDescription", label: "Support description when requests are not open", rows: 4 },
    ],
  },
  {
    heading: "Explore by goal",
    fields: [
      { key: "goalsKicker", label: "Section name" },
      { key: "goalsTitle", label: "Section heading" },
      { key: "foundationLabel", label: "Foundation link wording" },
      { key: "foundationHref", label: "Foundation link destination" },
      { key: "learnLabel", label: "Learn link wording" },
      { key: "learnHref", label: "Learn link destination" },
      { key: "applyLabel", label: "Apply link wording" },
      { key: "applyHref", label: "Apply link destination" },
      { key: "leadLabel", label: "Lead link wording" },
      { key: "leadHref", label: "Lead link destination" },
    ],
  },
  {
    heading: "Core commitments",
    fields: [
      { key: "commitmentsKicker", label: "Section name" },
      { key: "commitmentsTitle", label: "Section heading" },
      { key: "commitmentsLinkLabel", label: "Practice note link wording" },
      { key: "commitmentsLinkHref", label: "Practice note destination" },
    ],
  },
  {
    heading: "Privacy reminder",
    fields: [
      { key: "privacyLabel", label: "Reminder heading" },
      { key: "privacyText", label: "Reminder wording", rows: 5 },
    ],
  },
] as const;

export const FOOTER_COPY_FIELD_GROUPS: readonly FieldGroup[] = [
  {
    heading: "Program statement",
    fields: [
      { key: "identityKicker", label: "Program name" },
      { key: "identityText", label: "Ownership and boundaries", rows: 7 },
    ],
  },
  {
    heading: "Help links",
    fields: [
      { key: "helpHeading", label: "Section heading" },
      { key: "askLabel", label: "Ask link wording" },
      { key: "askHref", label: "Ask link destination" },
      { key: "resourcesLabel", label: "Resources link wording" },
      { key: "resourcesHref", label: "Resources link destination" },
      { key: "communitiesLabel", label: "Minnesota Communities link wording" },
      { key: "communitiesHref", label: "Minnesota Communities destination" },
      { key: "requestAvailableLabel", label: "Consultation link when requests are open" },
      { key: "requestPreviewLabel", label: "Consultation link when requests are not open" },
      { key: "requestHref", label: "Consultation link destination" },
      { key: "trackLabel", label: "Request follow-up link wording" },
      { key: "trackHref", label: "Request follow-up destination" },
      { key: "escalationLabel", label: "Other help link wording", rows: 3 },
      { key: "escalationHref", label: "Other help link destination" },
    ],
  },
  {
    heading: "Privacy and access",
    fields: [
      { key: "privacyHeading", label: "Section heading" },
      { key: "privacyText", label: "Privacy and access wording", rows: 7 },
    ],
  },
] as const;

type ResponseBody = {
  state?: PageBlockEditingState;
  message?: string;
  error?: string;
};

const SURFACE_LABEL: Record<PageBlockSurface, string> = {
  home: "Home page",
  footer: "page footer",
};

export function PageCopyEditor<TCopy extends PageBlockCopy>({
  surface,
  initial,
}: {
  surface: PageBlockSurface;
  initial: PageBlockEditingState<TCopy>;
}) {
  const router = useRouter();
  const [state, setState] = useState<PageBlockEditingState<TCopy>>(initial);
  const [copy, setCopy] = useState<TCopy>(initial.copy);
  const [changeNote, setChangeNote] = useState("");
  const [decisionReason, setDecisionReason] = useState("");
  const [rollbackRevisionId, setRollbackRevisionId] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const groups = surface === "home" ? HOME_COPY_FIELD_GROUPS : FOOTER_COPY_FIELD_GROUPS;
  const rollbackChoices = useMemo(
    () => state.history.filter((entry) => !entry.isCurrent),
    [state.history],
  );

  // Unsaved edits live only in this component: warn before the page is left.
  const dirty = JSON.stringify(copy) !== JSON.stringify(state.copy) || changeNote !== "";
  useEffect(() => {
    if (!dirty) return;
    const guard = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [dirty]);

  function updateField(key: FieldKey, value: string) {
    setCopy((current) => ({ ...current, [key]: value }));
  }

  async function send(action: PageCopyAction, refreshStaffView = false) {
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/consultant/page-copy/${surface}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(action),
      });
      const result = (await response.json().catch(() => ({}))) as ResponseBody;
      if (!response.ok || !result.state) {
        setError(result.error ?? "The change could not be confirmed. Reload the page to check the saved wording.");
        return;
      }
      const next = result.state as PageBlockEditingState<TCopy>;
      setState(next);
      setCopy(next.copy);
      setMessage(result.message ?? "The change was saved.");
      if (refreshStaffView) router.refresh();
    } catch {
      setError("The change could not be confirmed. Reload the page to check the saved wording.");
    } finally {
      setBusy(false);
    }
  }

  function saveChanges(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send({
      action: "save_changes",
      expectedRevisionId: state.expectedRevisionId,
      expectedPublicationDecisionId: state.publicationDecisionId,
      copy,
      changeNote: changeNote.trim() || null,
    }, true);
  }

  return (
    <section className="card mt-6 text-left" aria-labelledby={`${surface}-wording-editor-heading`}>
          <p className="kicker">Consultant Workspace</p>
      <h2 className="text-xl font-extrabold" id={`${surface}-wording-editor-heading`}>
        Edit the {SURFACE_LABEL[surface]}
      </h2>
      <p className="mt-2 mb-0">
        Save to update what staff see. Earlier wording stays available below.
      </p>

      {!state.isPublished ? (
        <div className="mt-4">
          <Notice tone="warn">Staff are not seeing this section right now. You can bring back earlier wording below.</Notice>
        </div>
      ) : state.hasUnpublishedChanges ? (
        <div className="mt-4">
          <Notice tone="warn">You have a draft in progress. Save to show this wording to staff.</Notice>
        </div>
      ) : null}

      <form className="mt-6" onSubmit={saveChanges}>
        {groups.map((group) => (
          <fieldset className="panel mb-5" key={group.heading}>
            <legend className="font-bold text-navy-deep">{group.heading}</legend>
            <div className="mt-3 grid gap-x-6 md:grid-cols-2">
              {group.fields.map((field) => {
                const value = (copy as unknown as Record<string, string>)[field.key] ?? "";
                const id = `${surface}-${field.key}`;
                return (
                  <Field id={id} label={field.label} help={field.help} key={field.key}>
                    {field.rows ? (
                      <textarea
                        id={id}
                        value={value}
                        rows={field.rows}
                        maxLength={4_000}
                        required={field.key !== "heroNote"}
                        disabled={busy}
                        onChange={(event) => updateField(field.key, event.target.value)}
                      />
                    ) : (
                      <input
                        id={id}
                        type="text"
                        value={value}
                        maxLength={2_000}
                        required={field.key !== "heroNote"}
                        disabled={busy}
                        onChange={(event) => updateField(field.key, event.target.value)}
                      />
                    )}
                  </Field>
                );
              })}
            </div>
          </fieldset>
        ))}
        <Field
          id={`${surface}-change-note`}
          label="Note about these changes"
          help="Optional. A few words that help you recognize this version later."
        >
          <textarea
            id={`${surface}-change-note`}
            value={changeNote}
            rows={3}
            maxLength={1_000}
            onChange={(event) => setChangeNote(event.target.value)}
          />
        </Field>
        <div className="flex flex-wrap gap-3">
          <button className="btn btn--primary" type="submit" disabled={busy}>
            {busy ? "Saving" : "Save changes"}
          </button>
          <button
            className="btn btn--light"
            type="button"
            disabled={busy}
            onClick={() => {
              setCopy(state.copy);
              setChangeNote("");
              setError("");
              setMessage("");
            }}
          >
            Reset unsaved changes
          </button>
        </div>
      </form>

      <section className="panel mt-6" aria-labelledby={`${surface}-release-heading`}>
        <h3 className="text-lg font-bold" id={`${surface}-release-heading`}>What staff see</h3>
        <p className="mt-1 text-sm text-muted">Take the current wording down, or bring back an earlier version. Add a short note for the record first; staff never see it.</p>
        <Field id={`${surface}-decision-reason`} label="Why you are making this change">
          <textarea
            id={`${surface}-decision-reason`}
            value={decisionReason}
            rows={3}
            maxLength={500}
            required
            onChange={(event) => setDecisionReason(event.target.value)}
          />
        </Field>
        <div className="flex flex-wrap gap-3">
          {state.publishedRevisionId ? (
            <button
              className="btn btn--light"
              type="button"
              disabled={busy || !decisionReason.trim()}
              onClick={() => void send({
                action: "withdraw",
                expectedPublishedRevisionId: state.publishedRevisionId!,
                expectedPublicationDecisionId: state.publicationDecisionId!,
                reason: decisionReason.trim(),
              }, true)}
            >
              Take this wording down
            </button>
          ) : null}
        </div>


        {rollbackChoices.length ? (
          <div className="mt-6 border-t border-line pt-5">
            <Field id={`${surface}-earlier-version`} label="Earlier wording">
              <select
                id={`${surface}-earlier-version`}
                value={rollbackRevisionId}
                onChange={(event) => setRollbackRevisionId(event.target.value)}
              >
                <option value="">Choose an earlier version</option>
                {rollbackChoices.map((entry) => (
                  <option key={entry.revisionId} value={entry.revisionId}>
                    {entry.label} — {entry.publishedAt.slice(0, 10)}
                  </option>
                ))}
              </select>
            </Field>
            <button
              className="btn btn--light"
              type="button"
              disabled={busy || !rollbackRevisionId || !decisionReason.trim()}
              onClick={() => void send({
                action: "rollback",
                expectedPublishedRevisionId: state.publishedRevisionId,
                targetRevisionId: rollbackRevisionId,
                expectedPublicationDecisionId: state.publicationDecisionId,
                reason: decisionReason.trim(),
              }, true)}
            >
              Bring back this wording
            </button>
          </div>
        ) : null}
      </section>

      {error ? <p className="error mt-4" role="alert">{error}</p> : null}
      {message ? <p className="notice mt-4" role="status">{message}</p> : null}
    </section>
  );
}

export type HomePageCopyEditorState = PageBlockEditingState<HomePageCopy>;
export type FooterCopyEditorState = PageBlockEditingState<FooterCopy>;
