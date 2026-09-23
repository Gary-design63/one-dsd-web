"use client";

import { useState } from "react";
import { Field, Notice } from "@/components/ui";
import { PROGRAM } from "@/lib/constants";
import {
  STAGES,
  STAGE_LABEL_CR,
  STATUS_LABEL,
  TIMING,
  TIMING_LABEL,
  type RequesterCorrection,
  type Status,
} from "@/lib/intelligence/consult/schema";
import { useStored } from "@/lib/client/storage";
import { BROWSER_STORAGE_KEYS } from "@/lib/client/storage-keys";

type View = {
  request_id: string;
  status: Status | "expired";
  status_reason?: string;
  scheduled_for?: string;
  updated_at: string;
  version: number;
  work_name?: string;
  can_withdraw: boolean;
  can_correct: boolean;
  can_rotate_key: boolean;
  editable?: RequesterCorrection;
  history: Array<{ at: string; status: Status | "expired" }>;
};
type Saved = { id: string; key: string; work_name: string; at: string };

const NONE: Saved[] = [];

function requesterStatusLabel(status: Status | "expired"): string {
  return status === "expired" ? "Expired" : STATUS_LABEL[status];
}

export function TrackClient({
  initialId,
  correctionEnabled,
}: {
  initialId?: string;
  correctionEnabled: boolean;
}) {
  const [recent, setRecent] = useStored<Saved[]>("session", BROWSER_STORAGE_KEYS.recentConsultationReferences, NONE);
  const [saved, setSaved] = useStored<Saved[]>("local", BROWSER_STORAGE_KEYS.savedConsultationReferences, NONE);
  const [idInput, setIdInput] = useState<string | null>(null);
  const [keyInput, setKeyInput] = useState<string | null>(null);
  const [view, setView] = useState<View | null>(null);
  const [changes, setChanges] = useState<RequesterCorrection>({});
  const [error, setError] = useState("");
  const [credentialNotice, setCredentialNotice] = useState("");
  const [replacementKey, setReplacementKey] = useState("");
  const [busy, setBusy] = useState(false);

  const id = idInput ?? initialId ?? "";
  const available = [...recent, ...saved.filter((item) => !recent.some((entry) => entry.id === item.id))];
  const key = keyInput ?? available.find((s) => s.id === id)?.key ?? "";

  async function lookup(rid = id, rkey = key) {
    setBusy(true);
    setError("");
    setCredentialNotice("");
    setReplacementKey("");
    setView(null);
    try {
      const res = await fetch(`/api/intake/${encodeURIComponent(rid.trim())}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ action: "lookup", access_key: rkey.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "We couldn't find a request with that reference ID and access key. Please check both and try again.");
        return;
      }
      setView(data as View);
      setChanges({});
    } catch {
      setError("We couldn't check the request just now. Please try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  async function withdraw() {
    if (!view) return;
    if (!confirm(`Do you want to withdraw this request? The ${PROGRAM.practiceOwnerRole} will be able to see that it was withdrawn.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/intake/${encodeURIComponent(view.request_id)}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "withdraw", access_key: key }) });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "We couldn't withdraw the request just now. Please try again.");
      else await lookup(view.request_id, key);
    } catch {
      setError("We couldn't confirm whether the request was withdrawn. Check its latest status before trying again.");
    } finally {
      setBusy(false);
    }
  }

  async function rotateKey() {
    if (!view || !view.can_rotate_key) return;
    if (!confirm("Replace this request's access key? The current key will stop working immediately.")) return;
    setBusy(true);
    setError("");
    setCredentialNotice("");
    setReplacementKey("");
    try {
      const res = await fetch(`/api/intake/${encodeURIComponent(view.request_id)}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          action: "rotate_key",
          access_key: key,
          expected_version: view.version,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.kind !== "rotated") {
        setError(data.error ?? "We couldn't replace the access key just now. Check the latest status and try again.");
        return;
      }
      const replacement = String(data.access_key);
      const update = (items: Saved[]) => items.map((item) =>
        item.id === view.request_id ? { ...item, key: replacement } : item
      );
      setRecent(recent.some((item) => item.id === view.request_id)
        ? update(recent)
        : [{ id: view.request_id, key: replacement, work_name: view.work_name ?? "Consultation request", at: view.updated_at }, ...recent].slice(0, 20));
      if (saved.some((item) => item.id === view.request_id)) setSaved(update(saved));
      setKeyInput(replacement);
      setReplacementKey(replacement);
      setView(data.request as View);
      setChanges({});
      setCredentialNotice("Your access key was replaced. Copy the new key now; the prior key no longer works.");
    } catch {
      setError("We couldn't replace the access key just now. Please try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  function correctionValue<K extends keyof RequesterCorrection>(field: K): RequesterCorrection[K] {
    return changes[field] ?? view?.editable?.[field];
  }

  function change<K extends keyof RequesterCorrection>(field: K, value: RequesterCorrection[K]) {
    setChanges((current) => ({ ...current, [field]: value }));
  }

  async function correct() {
    if (!view || !view.can_correct || Object.keys(changes).length === 0) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/intake/${encodeURIComponent(view.request_id)}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          action: "correct",
          access_key: key,
          expected_version: view.version,
          corrections: changes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const message = data.kind === "invalid"
          ? data.issues?.[0]?.message
          : data.kind === "refusal"
            ? data.safety?.message
            : data.error;
        setError(message ?? "We couldn't save those changes. Check the information and try again.");
        return;
      }
      setView(data as View);
      setChanges({});
    } catch {
      setError("We couldn't save those changes just now. Please try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div>
        <form
          className="card"
          onSubmit={(e) => {
            e.preventDefault();
            lookup();
          }}
        >
          <Field id="rid" label="Reference ID" help="Your reference ID looks like CR-20260904-0001.">
            <input id="rid" type="text" value={id} onChange={(e) => setIdInput(e.target.value)} />
          </Field>
          <Field id="rkey" label="Access key" help="Enter the private access key from your confirmation. It is never placed in the page address.">
            <input id="rkey" type="password" autoComplete="off" value={key} onChange={(e) => setKeyInput(e.target.value)} />
          </Field>
          <button type="submit" className="btn btn--primary" disabled={busy}>
            Check status
          </button>
          {error ? (
            <p className="error mt-3" role="alert">
              {error}
            </p>
          ) : null}
        </form>

        {view ? (
          <section className="card mt-6" aria-live="polite">
            <p className="kicker">{view.request_id}</p>
            <h2 className="text-xl font-extrabold">{view.work_name ?? "Expired consultation request"}</h2>
            <p>
              Status: <strong>{requesterStatusLabel(view.status)}</strong>. Last updated {new Date(view.updated_at).toLocaleString()}.
            </p>
            {view.scheduled_for ? <p>Scheduled for: {view.scheduled_for}. The {PROGRAM.practiceOwnerRole} entered this date.</p> : null}
            {view.status === "declined" && view.status_reason ? <Notice tone="warn">The {PROGRAM.practiceOwnerRole} could not take this request and suggested another option: {view.status_reason}</Notice> : null}
            {view.status === "expired" ? (
              <Notice tone="info">The time this request could be kept has ended. The details you submitted have been removed; only a note that it expired remains.</Notice>
            ) : null}
            <h3 className="mt-3 text-lg font-bold">Updates</h3>
            <ul className="list-disc pl-6 text-sm">
              {view.history.map((h) => (
                <li key={h.at}>
                  {requesterStatusLabel(h.status)} on {new Date(h.at).toLocaleString()}
                </li>
              ))}
            </ul>
            {view.can_withdraw ? (
              <button type="button" className="btn btn--light mt-3" onClick={withdraw} disabled={busy}>
                Withdraw this request
              </button>
            ) : null}
            {view.can_rotate_key ? (
              <button type="button" className="btn btn--light mt-3 ml-2" onClick={rotateKey} disabled={busy}>
                Replace access key
              </button>
            ) : null}
            {credentialNotice ? (
              <Notice tone="info">
                {credentialNotice}
                <span className="mt-2 block">New access key: <strong>{replacementKey}</strong></span>
              </Notice>
            ) : null}
          </section>
        ) : null}

        {view?.can_correct && !correctionEnabled ? (
          <Notice tone="warn">
            Corrections are temporarily unavailable. You can still check this request and withdraw it while withdrawal is available.
          </Notice>
        ) : null}

        {view?.can_correct && view.editable && correctionEnabled ? (
          <form
            className="card mt-6"
            onSubmit={(event) => {
              event.preventDefault();
              void correct();
            }}
          >
            <h2 className="text-xl font-extrabold">Correct this request</h2>
            <p className="text-sm text-muted">You can correct general information while eligibility is being reviewed or the request is still under review. The same privacy checks apply before anything is saved.</p>
            <Field id="correction-work-name" label="Work name">
              <input
                id="correction-work-name"
                type="text"
                maxLength={120}
                value={String(correctionValue("work_name") ?? "")}
                onChange={(event) => change("work_name", event.target.value)}
              />
            </Field>
            <Field id="correction-stage" label="Where the work is now">
              <select
                id="correction-stage"
                value={String(correctionValue("stage") ?? "")}
                onChange={(event) => change("stage", event.target.value as NonNullable<RequesterCorrection["stage"]>)}
              >
                {STAGES.map((stage) => <option key={stage} value={stage}>{STAGE_LABEL_CR[stage]}</option>)}
              </select>
            </Field>
            <Field id="correction-goals" label="What you hope to accomplish">
              <textarea
                id="correction-goals"
                maxLength={2000}
                value={String(correctionValue("goals") ?? "")}
                onChange={(event) => change("goals", event.target.value)}
              />
            </Field>
            <Field id="correction-equity-questions" label="Equity questions already considered">
              <textarea
                id="correction-equity-questions"
                maxLength={2000}
                value={String(correctionValue("equity_questions_considered") ?? "")}
                onChange={(event) => change("equity_questions_considered", event.target.value)}
              />
            </Field>
            <Field id="correction-timing" label="Timing">
              <select
                id="correction-timing"
                value={String(correctionValue("timing_urgency") ?? "")}
                onChange={(event) => change("timing_urgency", event.target.value as NonNullable<RequesterCorrection["timing_urgency"]>)}
              >
                {TIMING.map((timing) => <option key={timing} value={timing}>{TIMING_LABEL[timing]}</option>)}
              </select>
            </Field>
            {correctionValue("timing_urgency") === "hard_deadline" ? (
              <Field id="correction-deadline" label="Deadline">
                <input
                  id="correction-deadline"
                  type="date"
                  value={String(correctionValue("deadline_date") ?? "")}
                  onChange={(event) => change("deadline_date", event.target.value)}
                />
              </Field>
            ) : null}
            <Field id="correction-situation" label="Situation and support needed" help="Keep names, case information, medical information, personnel matters, and complaint details out of this field.">
              <textarea
                id="correction-situation"
                maxLength={4000}
                value={String(correctionValue("situation") ?? "")}
                onChange={(event) => change("situation", event.target.value)}
              />
            </Field>
            <button type="submit" className="btn btn--primary" disabled={busy || Object.keys(changes).length === 0}>
              Save corrections
            </button>
          </form>
        ) : null}
      </div>
      <aside className="panel">
        <p className="text-sm">Checking a request does not add your learning or Ask activity to it. Deleting a saved reference from this computer does not withdraw or delete the request.</p>
        <p className="kicker">Your saved requests</p>
        {available.length ? (
          <ul className="list-none space-y-2 p-0 text-sm">
            {available.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className="text-left underline"
                  onClick={() => {
                    setIdInput(s.id);
                    setKeyInput(s.key);
                    lookup(s.id, s.key);
                  }}
                >
                  {s.id}: {s.work_name}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">No saved requests in this tab or on this computer.</p>
        )}
      </aside>
    </div>
  );
}
