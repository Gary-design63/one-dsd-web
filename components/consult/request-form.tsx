"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import consult from "@/components/consult/consult.module.css";
import workspace from "@/components/workspace-presentation.module.css";
import { Field, Notice } from "@/components/ui";
import { SUPPORT_LABEL, SUPPORT_TYPES, TIMING_CHOICE, TIMINGS } from "@/lib/consult/types";

type Done = { link: string; dueAt: string; emailConfigured: boolean };

function pathOf(link: string): string {
  try {
    return new URL(link).pathname;
  } catch {
    return link;
  }
}

/** The first sentence leads in bold; the rest of the message reads as ordinary text. */
function leadAndRest(message: string): { lead: string; rest: string } {
  const match = message.match(/^(.+?[.!?])\s+([\s\S]*)$/);
  return match ? { lead: match[1], rest: match[2] } : { lead: message, rest: "" };
}

export function RequestForm() {
  const [error, setError] = useState("");
  const [field, setField] = useState<string | null>(null);
  const [redirect, setRedirect] = useState("");
  const [keep, setKeep] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<Done | null>(null);
  const notice = useRef<HTMLDivElement>(null);
  const errorParts = leadAndRest(error);

  function show(target: string | null) {
    setTimeout(() => {
      if (target) document.getElementById(target)?.focus();
      else notice.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 0);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    setField(null);
    const get = (name: string) => String(data.get(name) ?? "");
    const payload = {
      requesterName: get("requesterName"),
      requesterEmail: get("requesterEmail"),
      requesterUnit: get("requesterUnit"),
      supervisorName: get("supervisorName"),
      supervisorEmail: get("supervisorEmail"),
      managerEmail: get("managerEmail"),
      workTitle: get("workTitle"),
      supportType: get("supportType"),
      timing: get("timing"),
      situation: get("situation"),
      goals: get("goals"),
      confirmsGeneralWork: data.get("confirmsGeneralWork") === "on",
      keepAfterRedirectNotice: keep,
      website: get("website"),
    };
    try {
      const response = await fetch("/api/consult/requests", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const body = await response.json().catch(() => ({}));
      if (response.status === 201) {
        setDone(body as Done);
        setRedirect("");
      } else if (response.status === 422 && body.reason === "redirect_notice") {
        setRedirect(String(body.error ?? ""));
        show(null);
      } else {
        const target = typeof body.field === "string" ? body.field : null;
        setError(body.error ?? "Your request could not be sent. Please try again in a moment. What you typed is still here.");
        setField(target);
        setRedirect("");
        show(target);
      }
    } catch {
      setError("Your request could not be sent. Please check your connection and try again. What you typed is still here.");
      show(null);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    const due = new Date(done.dueAt).toLocaleDateString("en-US", { timeZone: "America/Chicago", weekday: "long", month: "long", day: "numeric" });
    return (
      <section className={consult.confirmation} role="status" aria-labelledby="consult-done">
        <p className="kicker">Request received</p>
        <h2 id="consult-done" className="text-2xl font-extrabold">The consultant has your request</h2>
        <p>You will hear back by {due}, with the name of the person who is taking it on.</p>
        <p>This private link is your way back to see where your request stands, or to withdraw it if you no longer need help.</p>
        <p className={consult.actions}><a className="btn btn--primary" href={pathOf(done.link)}>Open my request</a></p>
        <p className="text-sm text-muted">{done.emailConfigured ? "A copy of the link is on its way to your work email. " : "Please save this link now, so that you can come back to your request. "}Please keep it to yourself.</p>
        <p className="text-sm text-muted">Your supervisor can see that you asked for help and where it stands.</p>
      </section>
    );
  }

  return (
    <form onSubmit={submit} className={workspace.formPanel} noValidate>
      <div style={{ position: "absolute", left: "-10000px" }} aria-hidden="true">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <p className="kicker">Your request</p>
      <h2 className="text-2xl font-extrabold">Tell the consultant about your work</h2>
      <p className="text-muted">A few general details are enough to begin. Please leave out client, medical, personnel, and complaint details, and anything that identifies a person.</p>

      <div ref={notice} aria-live="polite">
        {error && !field ? (
          <div className="mt-4">
            <Notice tone="stop">
              <p className="m-0"><strong>{errorParts.lead}</strong>{errorParts.rest ? ` ${errorParts.rest}` : ""}</p>
            </Notice>
          </div>
        ) : null}
        {redirect ? (
          <div className="mt-4">
            <Notice tone="warn">
              <p className="m-0"><strong>Before you send this. </strong>{redirect}</p>
              <div className="checks mt-3">
                <label>
                  <input type="checkbox" checked={keep} onChange={(event) => setKeep(event.target.checked)} />
                  <span>My question is about applying equity to the work itself. Please send it as written.</span>
                </label>
              </div>
              <p className="mt-3 mb-0"><Link href="/support/right-person">Find the right person for this work</Link></p>
            </Notice>
          </div>
        ) : null}
      </div>

      <div className={consult.group}>
        <h3>About you</h3>
        <Field id="requesterName" label="Your name" error={field === "requesterName" ? error : undefined}><input id="requesterName" name="requesterName" type="text" autoComplete="name" required maxLength={120} /></Field>
        <Field id="requesterEmail" label="Your work email" help="Updates about your request will be sent here." error={field === "requesterEmail" ? error : undefined}><input id="requesterEmail" name="requesterEmail" type="text" inputMode="email" autoCapitalize="none" spellCheck={false} autoComplete="email" required maxLength={254} /></Field>
        <Field id="requesterUnit" label="Your unit or team (optional)"><input id="requesterUnit" name="requesterUnit" type="text" maxLength={160} /></Field>
      </div>

      <div className={consult.group}>
        <h3>Your supervisor</h3>
        <p className={consult.groupNote}>Your supervisor, and your manager if you name one, will be able to see that you asked for help, the kind of help, and where your request stands. They will not see what you write about the work. The Deputy Director and Division Director can see requests across the division in the same way.</p>
        <Field id="supervisorName" label="Your supervisor's name" error={field === "supervisorName" ? error : undefined}><input id="supervisorName" name="supervisorName" type="text" required maxLength={120} /></Field>
        <Field id="supervisorEmail" label="Your supervisor's work email" error={field === "supervisorEmail" ? error : undefined}><input id="supervisorEmail" name="supervisorEmail" type="text" inputMode="email" autoCapitalize="none" spellCheck={false} required maxLength={254} /></Field>
        <Field id="managerEmail" label="Your manager's work email (optional)" help="Add your manager if you would like them to see the same." error={field === "managerEmail" ? error : undefined}><input id="managerEmail" name="managerEmail" type="text" inputMode="email" autoCapitalize="none" spellCheck={false} maxLength={254} /></Field>
      </div>

      <div className={consult.group}>
        <h3>The work</h3>
        <Field id="workTitle" label="What is the work called?" help="A short name is enough. Your supervisor will see it." error={field === "workTitle" ? error : undefined}><input id="workTitle" name="workTitle" type="text" required maxLength={200} /></Field>
        <Field id="supportType" label="What kind of help would be most useful?">
          <select id="supportType" name="supportType" defaultValue="equity_embed_review">
            {SUPPORT_TYPES.map((type) => <option key={type} value={type}>{SUPPORT_LABEL[type]}</option>)}
          </select>
        </Field>
        <fieldset className="field">
          <legend className="font-bold text-navy-deep">When do you need to act?</legend>
          <div className="checks">
            {TIMINGS.map((value) => (
              <label key={value}>
                <input type="radio" name="timing" value={value} defaultChecked={value === "exploratory"} />
                <span>{TIMING_CHOICE[value]}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <Field id="situation" label="What is the work about?" help="Describe it in general terms." error={field === "situation" ? error : undefined}><textarea id="situation" name="situation" rows={6} required maxLength={4000} /></Field>
        <Field id="goals" label="What would you like to leave the consultation with?" error={field === "goals" ? error : undefined}><textarea id="goals" name="goals" rows={3} required maxLength={2000} /></Field>
      </div>

      <div className="checks mt-6">
        <label>
          <input id="confirmsGeneralWork" type="checkbox" name="confirmsGeneralWork" required />
          <span>I am asking about applying equity to my work, not about a complaint, grievance, investigation, accommodation request, or discipline matter.</span>
        </label>
      </div>
      {field === "confirmsGeneralWork" && error ? <p className="error m-0 mt-2" role="alert">{error}</p> : null}

      <p className="mt-6 mb-0"><button className="btn btn--primary" type="submit" disabled={busy}>{busy ? "Sending…" : "Send my request"}</button></p>
      <p className={consult.formNote}>Using One DSD Consult is voluntary, and asking for help is never used to evaluate you.</p>
    </form>
  );
}
