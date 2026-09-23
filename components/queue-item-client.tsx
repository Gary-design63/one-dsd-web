"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field } from "@/components/ui";
import { STATUS_LABEL, TRANSITIONS, type EligibilityStatus, type Status } from "@/lib/intelligence/consult/schema";
import {
  OWNER_NOTE_TEMPLATES,
  OWNER_STATUS_REASON_TEMPLATES,
} from "@/lib/trust/owner-queue-text";

function decisionMaker(value: string) {
  if (value === "owner") return "you";
  if (value === "system") return "a program review";
  if (value === "staff") return "the requester";
  return value.replace(/_/g, " ");
}

export function QueueItemClient(props: { requestId: string; status: Status; eligibilityStatus: EligibilityStatus; statusReason: string; scheduledFor: string; ownerNotes: string; pinnedOrder: number | null; history: Array<{ at: string; status: Status; by: string; note?: string }> }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(props.status);
  const [reason, setReason] = useState(props.statusReason);
  const [scheduledFor, setScheduledFor] = useState(props.scheduledFor);
  const [notes, setNotes] = useState(props.ownerNotes);
  const [pin, setPin] = useState(props.pinnedOrder === null ? "" : String(props.pinnedOrder));
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const allowed = [props.status, ...TRANSITIONS[props.status]];

  async function decideEligibility(decision: "confirmed_dsd" | "not_dsd") {
    if (decision === "not_dsd" && !reason.trim()) {
      setMsg("Add a clear redirect before marking this request outside DSD.");
      return;
    }
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch(`/api/consultant/queue/${encodeURIComponent(props.requestId)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ eligibility_decision: decision, status_reason: reason }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) setMsg(data.error ?? "That eligibility decision could not be saved.");
      else {
        setMsg(decision === "confirmed_dsd" ? "DSD eligibility confirmed. The request is now in the active queue." : "The request was redirected outside the DSD consultation queue.");
        router.refresh();
      }
    } catch {
      setMsg("Could not save the eligibility decision. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (props.eligibilityStatus === "pending") {
    return (
      <section className="card" aria-labelledby="eligibility-decision-heading">
        <p className="kicker">Admission boundary</p>
        <h2 id="eligibility-decision-heading" className="text-lg font-bold">Confirm DSD eligibility</h2>
        <p className="text-sm">The requester attested that this concerns DSD work. Review the submitted work context before admitting it to the active queue.</p>
        <Field id="eligibility-redirect" label="Redirect if this is outside DSD" help="Required only when redirecting. Choose the option that gives the requester the most useful next route.">
          <select id="eligibility-redirect" value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="">Choose a redirect</option>
            {OWNER_STATUS_REASON_TEMPLATES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </Field>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn--primary" onClick={() => decideEligibility("confirmed_dsd")} disabled={busy}>Confirm DSD request</button>
          <button type="button" className="btn btn--light" onClick={() => decideEligibility("not_dsd")} disabled={busy}>Redirect outside DSD</button>
        </div>
        {msg ? <p className="mt-3 text-sm" role="status">{msg}</p> : null}
        <h3 className="mt-4 text-lg font-bold">Decision history</h3>
        <ul className="list-disc pl-5 text-sm">
          {props.history.map((h) => (
            <li key={h.at + h.status}>{STATUS_LABEL[h.status]} by {decisionMaker(h.by)} on {new Date(h.at).toLocaleString()}{h.note ? `: ${h.note}` : ""}</li>
          ))}
        </ul>
      </section>
    );
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch(`/api/consultant/queue/${encodeURIComponent(props.requestId)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status, status_reason: reason || null, scheduled_for: scheduledFor, owner_notes: notes || null, pinned_order: pin === "" ? null : Number(pin) }),
      });
      await res.json();
      if (!res.ok) setMsg("That change could not be saved. Review the required information and try again.");
      else {
        setMsg("Saved.");
        router.refresh();
      }
    } catch {
      setMsg("Could not save. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="card">
      <p className="kicker">Your decision</p>
      <Field id="status" label="Status">
        <select id="status" value={status} onChange={(e) => setStatus(e.target.value as Status)}>
          {allowed.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </Field>
      {status === "declined" ? (
        <Field id="reason" label="Reason and redirect (required when declining)">
          <select id="reason" value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="">Choose a reason and next route</option>
            {OWNER_STATUS_REASON_TEMPLATES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Field>
      ) : null}
      {status === "scheduled" || status === "in_progress" ? (
        <Field id="scheduled_for" label="Agreed time" help="Record the time here. The calendar invitation is managed outside this program.">
          <input id="scheduled_for" type="text" value={scheduledFor} onChange={(e) => setScheduledFor(e.target.value)} />
        </Field>
      ) : null}
      <Field id="pin" label="Pin to position (optional)" help="Overrides the suggested order. Leave blank to use the suggestion.">
        <input id="pin" type="text" inputMode="numeric" value={pin} onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))} />
      </Field>
      <Field id="notes" label="Private workflow note" help="Choose a general planning note. Names, case details, and personnel information do not belong here.">
        <select id="notes" value={notes} onChange={(e) => setNotes(e.target.value)}>
          <option value="">No workflow note</option>
          {OWNER_NOTE_TEMPLATES.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </Field>
      <button type="submit" className="btn btn--primary" disabled={busy}>
        Save changes
      </button>
      {msg ? (
        <p className="mt-2 text-sm" role="status">
          {msg}
        </p>
      ) : null}
      <h3 className="mt-4 text-lg font-bold">Decision history</h3>
      <ul className="list-disc pl-5 text-sm">
        {props.history.map((h) => (
          <li key={h.at + h.status}>
            {STATUS_LABEL[h.status]} by {decisionMaker(h.by)} on {new Date(h.at).toLocaleString()}
            {h.note ? `: ${h.note}` : ""}
          </li>
        ))}
      </ul>
    </form>
  );
}
