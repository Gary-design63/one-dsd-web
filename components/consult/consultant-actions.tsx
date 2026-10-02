"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import consult from "@/components/consult/consult.module.css";
import { capitalize, countWord } from "@/components/consult/consult-ui";
import { Field } from "@/components/ui";
import { LEADER_ROLE_LABEL, STATUSES, STATUS_LABEL, type ConsultStatus, type LeaderRole } from "@/lib/consult/types";

export function UpdateRequestPanel({ status, id, ownerName, referredTo, outcome, closed, defaultOwner, requesterName }: { id: string; status: ConsultStatus; ownerName: string; referredTo: string; outcome: string; closed: boolean; defaultOwner: string; requesterName: string }) {
  const router = useRouter();
  const [next, setNext] = useState<ConsultStatus>(status);
  const [owner, setOwner] = useState(ownerName || defaultOwner);
  const [referral, setReferral] = useState(referredTo);
  const [result, setResult] = useState(outcome);
  const [note, setNote] = useState("");
  const [visible, setVisible] = useState(true);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    setMessage("");
    const body: Record<string, unknown> = {};
    if (next !== status) body.status = next;
    if (owner.trim() && owner.trim() !== ownerName) body.ownerName = owner.trim();
    if (next === "referred" && referral.trim()) body.referredTo = referral.trim();
    if (next === "resolved" && result.trim()) body.outcome = result.trim();
    if (note.trim()) { body.note = note.trim(); body.noteVisibleToRequester = visible; }
    try {
      const response = await fetch(`/api/consultant/consult/${encodeURIComponent(id)}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setNote("");
        setMessage(`Saved. ${requesterName} will be told about any change in where it stands.`);
        router.refresh();
      } else {
        setMessage(data.error ?? "That could not be saved just now. Please try again in a moment.");
      }
    } catch {
      setMessage("That could not be saved just now. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (closed) return <p className={consult.sideNote}>This request is closed. Its history stays here as a record.</p>;
  return (
    <form className={consult.updatePanel} onSubmit={(event) => { event.preventDefault(); void save(); }}>
      <p className="kicker">Your part</p>
      <h2 className="text-2xl font-extrabold">Update this request</h2>
      <Field id="owner" label="Who is taking this on?"><input id="owner" type="text" value={owner} onChange={(event) => setOwner(event.target.value)} maxLength={120} /></Field>
      <Field id="status" label="Where does it stand?" help={`When this changes, ${requesterName} is sent a short update.`}>
        <select id="status" value={next} onChange={(event) => setNext(event.target.value as ConsultStatus)}>
          {STATUSES.filter((value) => value !== "withdrawn").map((value) => <option key={value} value={value}>{STATUS_LABEL[value]}</option>)}
        </select>
      </Field>
      {next === "referred" ? <Field id="referral" label="Which office is it going to?"><input id="referral" type="text" value={referral} onChange={(event) => setReferral(event.target.value)} maxLength={200} placeholder="For example, Employee Culture" /></Field> : null}
      {next === "resolved" ? <Field id="outcome" label="How did it turn out?" help="A line or two is enough."><textarea id="outcome" value={result} onChange={(event) => setResult(event.target.value)} maxLength={1000} rows={3} /></Field> : null}
      <Field id="note" label="Add a note (optional)"><textarea id="note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={1000} rows={3} /></Field>
      {note.trim() ? <div className="checks"><label><input type="checkbox" checked={visible} onChange={(event) => setVisible(event.target.checked)} /><span>Share this note with {requesterName}</span></label></div> : null}
      <p className="mt-6 mb-0"><button type="submit" className="btn btn--primary" disabled={busy}>{busy ? "Saving…" : "Save changes"}</button></p>
      {message ? <p role="status" className={consult.updateMessage}>{message}</p> : null}
    </form>
  );
}

export function SendLinkAgain({ id, requesterName }: { id: string; requesterName: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function send() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/consultant/consult/${encodeURIComponent(id)}/link`, { method: "POST" });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setMessage(data.emailed
          ? `A new copy of the link is on its way to ${requesterName}.`
          : `Email is not switched on yet, so please share this private link with ${requesterName} yourself: ${data.link}`);
      } else {
        setMessage(data.error ?? "The link could not be sent just now. Please try again in a moment.");
      }
    } catch {
      setMessage("The link could not be sent just now. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={consult.sideNote}>
      <h3>If the link was lost</h3>
      <p>{requesterName} can be sent their private link again.</p>
      <button type="button" className="btn btn--light" disabled={busy} onClick={() => void send()}>{busy ? "Sending…" : "Send their link again"}</button>
      {message ? <p role="status" className="break-all">{message}</p> : null}
    </div>
  );
}

export function LeadersPanel({ people }: { people: Array<{ email: string; displayName: string | null; role: string; revoked: boolean }> }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("deputy_director");
  const [message, setMessage] = useState("");

  async function call(action: "add" | "resend" | "revoke", target: string, extra: Record<string, string> = {}) {
    setMessage("");
    try {
      const response = await fetch("/api/consultant/consult/people", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action, email: target, ...extra }) });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setMessage(action === "revoke" ? "Access has been turned off." : data.emailed ? "A private link has been emailed." : `Email is not switched on yet, so please share this private link yourself: ${data.link}`);
        if (action === "add") { setEmail(""); setName(""); }
        router.refresh();
      } else {
        setMessage(data.error ?? "That could not be saved just now. Please try again in a moment.");
      }
    } catch {
      setMessage("That could not be saved just now. Please check your connection and try again.");
    }
  }

  return (
    <div>
      <p className={consult.sectionIntro}>The Deputy Director and Division Director can follow every request. Supervisors and managers are added automatically when someone names them, and they see the requests from their own team.</p>
      <form className={consult.peopleForm} onSubmit={(event) => { event.preventDefault(); void call("add", email, { role, ...(name ? { displayName: name } : {}) }); }}>
        <Field id="leader-email" label="Work email"><input id="leader-email" type="text" inputMode="email" autoCapitalize="none" spellCheck={false} required value={email} onChange={(event) => setEmail(event.target.value)} /></Field>
        <Field id="leader-name" label="Name (optional)"><input id="leader-name" type="text" value={name} onChange={(event) => setName(event.target.value)} /></Field>
        <Field id="leader-role" label="Role">
          <select id="leader-role" value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="deputy_director">Deputy Director</option>
            <option value="division_director">Division Director</option>
            <option value="manager">Manager</option>
            <option value="supervisor">Supervisor</option>
          </select>
        </Field>
        <div className="field"><button id="leader-go" className="btn btn--primary" type="submit">Add and send a private link</button></div>
      </form>
      {message ? <p role="status" className={`${consult.updateMessage} break-all`}>{message}</p> : null}
      <ul className={consult.peopleList} aria-label="People who can follow requests">
        {people.length === 0 ? <li>No one has been added yet.</li> : people.map((person) => (
          <li key={person.email}>
            <span className={consult.who}>
              {person.displayName ? `${person.displayName}, ` : ""}{person.email}
              <span className={consult.role}>{LEADER_ROLE_LABEL[person.role as LeaderRole] ?? person.role}{person.revoked ? ", access turned off" : ""}</span>
            </span>
            <span className={consult.peopleActions}>
              <button type="button" className={`btn btn--light ${consult.small}`} onClick={() => void call("resend", person.email)}>Send a new link</button>
              {person.revoked ? null : <button type="button" className={`btn btn--light ${consult.small}`} onClick={() => void call("revoke", person.email)}>Turn off access</button>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DeliverButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function deliver() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/consultant/consult/deliver", { method: "POST" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(data.error ?? "The messages could not be sent just now. Please try again in a moment.");
      } else if (!data.configured) {
        setMessage("Email is not switched on yet. Once the email settings are added in the hosting dashboard, these messages will go out.");
      } else if (data.failed > 0) {
        setMessage(`${capitalize(countWord(data.sent))} sent. ${capitalize(countWord(data.failed))} could not be sent and will be tried again.`);
      } else if (data.sent === 0) {
        setMessage("Nothing was waiting to be sent.");
      } else {
        setMessage(`${capitalize(countWord(data.sent))} ${data.sent === 1 ? "message" : "messages"} sent.`);
      }
      router.refresh();
    } catch {
      setMessage("The messages could not be sent just now. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button type="button" className="btn btn--light" disabled={busy} onClick={() => void deliver()}>{busy ? "Sending…" : "Send waiting messages now"}</button>
      {message ? <p role="status" className={consult.updateMessage}>{message}</p> : null}
    </div>
  );
}
