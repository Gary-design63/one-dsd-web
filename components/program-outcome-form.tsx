"use client";

import { useRef, useState } from "react";
import { useProgramContext } from "@/components/program-context";

export function ProgramOutcomeForm() {
  const { context } = useProgramContext();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [receipt, setReceipt] = useState("");
  const requestId = useRef<string | null>(null);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    requestId.current ??= crypto.randomUUID();
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/program/outcomes", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({
          submissionId: requestId.current, sourceRoute: "/support/share-result",
          programScope: context === "one_dsd" ? "dsd" : "one-dhs",
          problem: fields.get("problem"), action: fields.get("action"),
          adoptedChange: fields.get("adoptedChange"), observedResult: fields.get("observedResult"),
          evidenceUrl: fields.get("evidenceUrl") || undefined,
          followUp: fields.get("followUp"), reviewDate: fields.get("reviewDate") || undefined,
          decision: fields.get("decision"), consent: fields.get("consent") === "on",
        }),
      });
      const result = await response.json();
      if (!response.ok) { setMessage(result.error || "Your result could not be shared. Your writing is still here."); return; }
      setReceipt(result.receipt); form.reset(); requestId.current = null;
    } catch { setMessage("Your result could not be confirmed. Your writing is still here; you can try again."); }
    finally { setBusy(false); }
  }
  if (receipt) return <section role="status" className="space-y-4"><h2 className="text-2xl font-semibold">Thank you for sharing what happened.</h2><p>Your result is saved for the program owner and authorized program support. It is recorded as your account of the work.</p><p>Reference: <strong>{receipt}</strong></p><button className="btn btn--light" onClick={() => setReceipt("")}>Share another result</button></section>;
  return <form onSubmit={submit} className="space-y-6">
    <p>Share a practical change, what you noticed, and what could happen next. Please leave out names, case details, and confidential information.</p>
    <fieldset disabled={busy} className="space-y-5">
      <label className="field">What were you trying to improve?<textarea name="problem" required maxLength={1500} rows={3} /></label>
      <label className="field">What did you try?<textarea name="action" required maxLength={1500} rows={3} /></label>
      <label className="field">What changed in practice?<textarea name="adoptedChange" required maxLength={1500} rows={3} /></label>
      <label className="field">What have you noticed so far?<textarea name="observedResult" required maxLength={2000} rows={3} /></label>
      <label className="field">Public supporting link (optional)<input name="evidenceUrl" type="url" maxLength={1000} placeholder="https://" /><span className="text-sm">Use a public page without personal information or private access links.</span></label>
      <label className="field">What should happen next?<textarea name="followUp" required maxLength={1500} rows={3} /></label>
      <label className="field">When would you revisit it? (optional)<input name="reviewDate" type="date" /></label>
      <label className="field">Your recommendation<select name="decision" defaultValue="not_yet_known"><option value="not_yet_known">More time or evidence is needed</option><option value="retain">Keep the change</option><option value="revise">Adjust the approach</option><option value="stop">Stop this approach</option></select></label>
      <label className="flex items-start gap-3"><input type="checkbox" name="consent" required className="mt-1" /><span>I choose to share this account with the program owner and authorized program support for follow-up and program improvement. It does not include personal or confidential information.</span></label>
      <button className="btn" type="submit">{busy ? "Sharing…" : "Share result"}</button>
    </fieldset>
    {message ? <p role="alert">{message}</p> : null}
  </form>;
}