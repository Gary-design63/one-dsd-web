"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ActionList, Field, Notice } from "@/components/ui";
import { PROGRAM } from "@/lib/constants";
import { getPath } from "@/lib/content/paths";
import {
  ACCESS_LABEL,
  ACCESS_NEEDS,
  MEETING_MODES,
  POPULATIONS,
  POPULATION_LABEL,
  ROLES,
  ROLE_LABEL,
  STAGES,
  STAGE_LABEL_CR,
  SUPPORT_LABEL,
  SUPPORT_TYPES,
  TIMING,
  TIMING_LABEL,
  type HeadsUpPacket,
} from "@/lib/intelligence/consult/schema";
import type { IntakeResult } from "@/lib/intelligence/agents/intake";
import { PacketView } from "@/components/packet-view";
import { newId, useStored, writeStored } from "@/lib/client/storage";
import { BROWSER_STORAGE_KEYS } from "@/lib/client/storage-keys";
import { participationContract } from "@/lib/participation/contracts";

type FormState = {
  requester_role: string;
  work_name: string;
  stage: string;
  goals: string;
  equity_questions_considered: string;
  desired_support_type: string[];
  support_other_note: string;
  timing_urgency: string;
  deadline_date: string;
  affected_populations: string[];
  populations_note: string;
  access_language_needs: string[];
  access_note: string;
  preferred_meeting_mode: string;
  links: string;
  attachment_notes: string;
  situation: string;
  dsd_eligibility_attestation: boolean;
  share_confirmation: boolean;
};

const EMPTY: FormState = {
  requester_role: "",
  work_name: "",
  stage: "conceptual",
  goals: "",
  equity_questions_considered: "",
  desired_support_type: ["scoping_goals"],
  support_other_note: "",
  timing_urgency: "exploratory",
  deadline_date: "",
  affected_populations: [],
  populations_note: "",
  access_language_needs: [],
  access_note: "",
  preferred_meeting_mode: "",
  links: "",
  attachment_notes: "",
  situation: "",
  dsd_eligibility_attestation: false,
  share_confirmation: false,
};

const NONE_SAVED: Array<{ id: string; key: string; work_name: string; at: string }> = [];
const MEETING_LABEL: Record<string, string> = { in_person: "In person", virtual: "Virtual", either: "Either", not_sure: "Not sure yet" };
const PREVIEW_ONLY_MESSAGE = "Consultation requests are not open yet. You can review the summary that would be shared, but no request is created and nothing you type is kept.";
const SUBMISSION_CONTRACT = participationContract("consultation_submission");

type IntakeRefusalField =
  | "work_name"
  | "goals"
  | "equity_questions_considered"
  | "situation"
  | "attachment_notes"
  | "populations_note"
  | "access_note"
  | "support_other_note"
  | "affected_populations"
  | "ask_context";

const INTAKE_FIELD_LABEL: Record<IntakeRefusalField, string> = {
  work_name: "program or work name",
  goals: "goals",
  equity_questions_considered: "equity questions already considered",
  situation: "what you would like help with",
  attachment_notes: "documents you plan to bring",
  populations_note: "communities or populations note",
  access_note: "access and language needs note",
  support_other_note: "other support",
  affected_populations: "communities or populations",
  ask_context: "information carried over from Ask",
};

function intakeFieldLabel(field: string): string {
  return Object.prototype.hasOwnProperty.call(INTAKE_FIELD_LABEL, field)
    ? INTAKE_FIELD_LABEL[field as IntakeRefusalField]
    : "information you entered";
}

type Prefill = Record<string, unknown>;
const NO_PREFILL: Prefill | null = null;

function buildInitial(pf: Prefill | null, path: ReturnType<typeof getPath>, gap?: string): { form: FormState; ask: { session_id: string; intents_tried: string[]; excerpt: string } | null } {
  const next: FormState = { ...EMPTY };
  let ask: { session_id: string; intents_tried: string[]; excerpt: string } | null = null;
  if (path) {
    next.desired_support_type = [path.consultSupportType];
    if (path.id === "gp-1") next.stage = "conceptual";
  }
  if (gap === "community") {
    next.desired_support_type = ["stakeholder_partner_map"];
    next.affected_populations = ["specific_minnesota_community"];
  }
  if (pf) {
    if (typeof pf.work_name === "string") next.work_name = pf.work_name;
    if (typeof pf.stage === "string") next.stage = pf.stage;
    if (typeof pf.goals === "string" && pf.goals) next.goals = pf.goals;
    if (typeof pf.equity_questions_considered === "string") next.equity_questions_considered = pf.equity_questions_considered;
    if (Array.isArray(pf.desired_support_type)) next.desired_support_type = pf.desired_support_type as string[];
    const ac = pf.ask_context as { session_id: string; intents_tried: string[]; excerpt: string } | undefined;
    if (ac) ask = ac;
  }
  return { form: next, ask };
}

export function IntakeClient({
  pathId,
  askSession,
  gap,
  intakeEnabled,
  programContext,
}: {
  pathId?: string;
  askSession?: string;
  gap?: string;
  intakeEnabled: boolean;
  programContext: "one_dsd";
}) {
  const path = pathId ? getPath(pathId) : undefined;
  const [storedPrefill] = useStored<Prefill | null>("session", BROWSER_STORAGE_KEYS.consultationPrefill, NO_PREFILL);
  // Prefill applies only when arriving from Ask, a path, or a community gap; a stale prefill never leaks into a fresh request.
  const prefill = pathId || askSession || gap ? storedPrefill : null;
  const initial = buildInitial(prefill, path, gap);
  const [edited, setEdited] = useState<FormState | null>(null);
  const form = edited ?? initial.form;
  const askContext = initial.ask;
  const [issues, setIssues] = useState<Record<string, string>>({});
  const [refusal, setRefusal] = useState<{ message: string; field: string; alternatives?: Array<{ label: string; href: string }>; redirect?: { label: string; href: string } } | null>(null);
  const [preview, setPreview] = useState<HeadsUpPacket | null>(null);
  const [created, setCreated] = useState<{ request_id: string; access_key: string; duplicate: boolean; savedOnDevice: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [netError, setNetError] = useState("");
  const [rememberOnDevice, setRememberOnDevice] = useState(false);
  const idemKey = useRef<string>("");
  const [recentRequests, setRecentRequests] = useStored<Array<{ id: string; key: string; work_name: string; at: string }>>("session", BROWSER_STORAGE_KEYS.recentConsultationReferences, NONE_SAVED);
  const [savedRequests, setSavedRequests] = useStored<Array<{ id: string; key: string; work_name: string; at: string }>>("local", BROWSER_STORAGE_KEYS.savedConsultationReferences, NONE_SAVED);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setEdited({ ...form, [k]: v });
  }
  function toggle(k: "desired_support_type" | "affected_populations" | "access_language_needs", v: string) {
    setEdited({ ...form, [k]: form[k].includes(v) ? form[k].filter((x) => x !== v) : [...form[k], v] });
  }

  function payload() {
    return {
      requester_role: form.requester_role || undefined,
      program_context: programContext,
      dsd_eligibility_attestation: form.dsd_eligibility_attestation,
      work_name: form.work_name,
      stage: form.stage,
      goals: form.goals,
      equity_questions_considered: form.equity_questions_considered,
      desired_support_type: form.desired_support_type,
      support_other_note: form.support_other_note,
      timing_urgency: form.timing_urgency,
      deadline_date: form.deadline_date,
      affected_populations: form.affected_populations,
      populations_note: form.populations_note,
      access_language_needs: form.access_language_needs,
      access_note: form.access_note,
      preferred_meeting_mode: form.preferred_meeting_mode || undefined,
      links: form.links.split(/\s+/).map((s) => s.trim()).filter(Boolean),
      attachment_notes: form.attachment_notes,
      situation: form.situation,
      ask_context: askContext ?? undefined,
      path_id: path?.id,
      participation_notice_id: SUBMISSION_CONTRACT.id,
      participation_notice_version: `${SUBMISSION_CONTRACT.version}.0.0`,
      share_confirmation: form.share_confirmation,
    };
  }

  async function call(mode: "preview" | "submit") {
    if (mode === "submit" && !intakeEnabled) {
      setNetError(PREVIEW_ONLY_MESSAGE);
      return;
    }
    setBusy(true);
    setNetError("");
    setIssues({});
    setRefusal(null);
    try {
      if (!idemKey.current) idemKey.current = newId("ik");
      const res = await fetch("/api/intake", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mode, input: payload(), idempotency_key: idemKey.current }) });
      const data = (await res.json()) as
        | Exclude<IntakeResult, { kind: "created" }>
        | { kind: "preview"; packet: HeadsUpPacket }
        | { kind: "created"; duplicate: boolean; request: { request_id: string; access_key: string; work_name: string; created_at: string } }
        | { error: string };
      if ("error" in data) {
        setNetError(data.error);
        return;
      }
      if (data.kind === "invalid") {
        const map: Record<string, string> = {};
        for (const i of data.issues) map[i.path || "form"] = i.message;
        setIssues(map);
      } else if (data.kind === "refusal") {
        setRefusal({ message: data.safety.message ?? "", field: data.field, alternatives: data.safety.alternatives, redirect: data.safety.redirect });
      } else if (data.kind === "conflict") {
        setNetError(data.message);
      } else if (data.kind === "preview") {
        setPreview(data.packet);
      } else if (data.kind === "created") {
        const reference = { id: data.request.request_id, key: data.request.access_key, work_name: data.request.work_name, at: data.request.created_at };
        setRecentRequests([reference, ...recentRequests.filter((item) => item.id !== reference.id)].slice(0, 20));
        const savedOnDevice = rememberOnDevice && setSavedRequests([reference, ...savedRequests.filter((item) => item.id !== reference.id)].slice(0, 20));
        setCreated({ request_id: data.request.request_id, access_key: data.request.access_key, duplicate: data.duplicate, savedOnDevice });
        writeStored("session", BROWSER_STORAGE_KEYS.consultationPrefill, null);
      }
    } catch {
      setNetError("We couldn't complete that request just now. Your responses are still in the form, so you can try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  if (created && intakeEnabled) {
    return (
      <div className="card" aria-live="polite">
        <p className="kicker">Eligibility review</p>
        <h2 className="text-2xl font-extrabold">Your request is ready for DSD eligibility review</h2>
        <p>
          Reference ID: <strong>{created.request_id}</strong>
          <br />
          Access key: <strong>{created.access_key}</strong>
        </p>
        <p className="text-sm">Please keep both. You will need the reference ID and access key to check or withdraw the request. They remain available until you close this tab{created.savedOnDevice ? ", and you chose to save them on this device until you delete them" : ""}. Anyone using this computer may see a copy you chose to save. Deleting that copy does not withdraw or delete the request. {created.duplicate ? "This request was already received; a second copy was not created." : ""}</p>
        <p>An authorized reviewer will first confirm that the request concerns DSD work. The {PROGRAM.practiceOwnerRole} takes it up only after that is confirmed. Meetings are scheduled separately, so no calendar invitation has been sent.</p>
        <ActionList
          heading="What you can do now"
          actions={[
            { label: "Track this request", href: `/support/track?id=${created.request_id}` },
            { label: "Continue with the self-guided steps", href: path ? `/practice/${path.id}` : "/practice" },
            { label: "Search Resources", href: "/library" },
          ]}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <form
        className="card"
        onSubmit={(e) => {
          e.preventDefault();
          call("submit");
        }}
        noValidate
      >
        {!intakeEnabled ? (
          <Notice tone="warn">
            <strong>No consultation request will be created. </strong>
            Complete the form only if you would like to review the summary a consultation request would create.
          </Notice>
        ) : null}
        {path ? (
          <div className="notice mb-4">
            <strong>Your practice path may have what you need. </strong>
            This request is connected to the &quot;{path.staffLabel}&quot; path. For a routine question, its tools may help you move forward without waiting for a meeting. {intakeEnabled ? "A consultation remains available." : "You can review the summary, but requests are not open yet."}
          </div>
        ) : (
          <div className="notice mb-4">
            <strong>You may be able to keep moving without a meeting. </strong>
          <Link href="/ask">Ask</Link>, <Link href="/library">Library</Link>, and <Link href="/minnesota-communities">Minnesota Communities</Link> can help with many routine questions. {intakeEnabled ? "A consultation is available when you need more." : "You can fill in the form to see the summary, but it will not send or save your information."}
          </div>
        )}
        {askContext ? (
          <p className="text-sm text-muted">
            {intakeEnabled
              ? `This form includes a short excerpt from your recent Ask question. It will be included with anything you submit, so remove anything you do not want the ${PROGRAM.practiceOwnerRole} to receive:`
              : "This summary includes a short excerpt from your recent Ask question. It will not be sent or saved, but you can still review what it says:"}{" "}
            &quot;{askContext.excerpt}&quot;
          </p>
        ) : null}

        <Field id="requester_role" label="Your role (optional)" help="Your answer will not be used to rank or evaluate you.">
          <select id="requester_role" value={form.requester_role} onChange={(e) => set("requester_role", e.target.value)}>
            <option value="">Prefer not to say</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r]}
              </option>
            ))}
          </select>
        </Field>
        <Field id="work_name" label="Program or work name (required)" help="Enter the name of the program, policy, tool, or initiative. Please do not use a client's name." error={issues.work_name}>
          <input id="work_name" type="text" value={form.work_name} onChange={(e) => set("work_name", e.target.value)} aria-invalid={Boolean(issues.work_name)} />
        </Field>
        <Field id="stage" label="Stage (required)" help="Choose where the work stands today." error={issues.stage}>
          <select id="stage" value={form.stage} onChange={(e) => set("stage", e.target.value)}>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {STAGE_LABEL_CR[s]}
              </option>
            ))}
          </select>
        </Field>
        <Field id="goals" label="Goals (required)" help="What are you trying to achieve? Describe it in general terms and leave out case details." error={issues.goals}>
          <textarea id="goals" value={form.goals} onChange={(e) => set("goals", e.target.value)} aria-invalid={Boolean(issues.goals)} />
        </Field>
        <Field id="eqc" label="Equity questions already considered" help="What have you already asked or checked through Ask, a checklist, or conversations with partners? This helps the consultant build on what you have done." error={issues.equity_questions_considered}>
          <textarea id="eqc" value={form.equity_questions_considered} onChange={(e) => set("equity_questions_considered", e.target.value)} />
        </Field>

        <fieldset className="field" aria-describedby={issues.desired_support_type ? "desired-support-error" : undefined} aria-invalid={Boolean(issues.desired_support_type)}>
          <legend className="font-bold" style={{ color: "var(--blue-dark)" }}>
            What kind of support would be most useful? (choose at least one)
          </legend>
          <div className="checks">
            {SUPPORT_TYPES.map((s) => (
              <label key={s}>
                <input type="checkbox" checked={form.desired_support_type.includes(s)} onChange={() => toggle("desired_support_type", s)} />
                <span>{SUPPORT_LABEL[s]}</span>
              </label>
            ))}
          </div>
          {issues.desired_support_type ? <p className="error" id="desired-support-error" role="alert">{issues.desired_support_type}</p> : null}
        </fieldset>
        {form.desired_support_type.includes("other") ? (
          <Field id="support_other_note" label="Other support (describe)" error={issues.support_other_note}>
            <input id="support_other_note" type="text" value={form.support_other_note} onChange={(e) => set("support_other_note", e.target.value)} />
          </Field>
        ) : null}

        <Field id="timing" label="When do you need support? (required)" help="Choose the option that best reflects your timing." error={issues.timing_urgency}>
          <select id="timing" value={form.timing_urgency} onChange={(e) => set("timing_urgency", e.target.value)}>
            {TIMING.map((t) => (
              <option key={t} value={t}>
                {TIMING_LABEL[t]}
              </option>
            ))}
          </select>
        </Field>
        {form.timing_urgency === "hard_deadline" ? (
          <Field id="deadline_date" label="Deadline date" help="Include a date only when the work has a firm external deadline. It will not be used to rank requests." error={issues.deadline_date}>
            <input id="deadline_date" type="date" value={form.deadline_date} onChange={(e) => set("deadline_date", e.target.value)} />
          </Field>
        ) : null}

        <fieldset className="field">
          <legend className="font-bold" style={{ color: "var(--blue-dark)" }}>
            Communities or populations (general terms only)
          </legend>
          <p className="help m-0">Please leave out client names. Work involving a Tribal Nation must be referred first to the Office of Indian Policy.</p>
          <div className="checks">
            {POPULATIONS.map((p) => (
              <label key={p}>
                <input type="checkbox" checked={form.affected_populations.includes(p)} onChange={() => toggle("affected_populations", p)} />
                <span>{POPULATION_LABEL[p]}</span>
              </label>
            ))}
          </div>
          <label htmlFor="populations_note" className="mt-2 text-sm font-bold">
            Note (optional, up to 300 characters)
          </label>
          <input id="populations_note" type="text" value={form.populations_note} onChange={(e) => set("populations_note", e.target.value)} maxLength={300} />
        </fieldset>

        <fieldset className="field">
          <legend className="font-bold" style={{ color: "var(--blue-dark)" }}>
            Access and language needs for the consultation
          </legend>
          <div className="checks">
            {ACCESS_NEEDS.map((a) => (
              <label key={a}>
                <input type="checkbox" checked={form.access_language_needs.includes(a)} onChange={() => toggle("access_language_needs", a)} />
                <span>{ACCESS_LABEL[a]}</span>
              </label>
            ))}
          </div>
          <label htmlFor="access_note" className="mt-2 text-sm font-bold">
            Note (optional)
          </label>
          <input id="access_note" type="text" value={form.access_note} onChange={(e) => set("access_note", e.target.value)} maxLength={300} />
        </fieldset>

        <Field id="mode" label="How you would like to meet">
          <select id="mode" value={form.preferred_meeting_mode} onChange={(e) => set("preferred_meeting_mode", e.target.value)}>
            <option value="">Not stated</option>
            {MEETING_MODES.map((m) => (
              <option key={m} value={m}>
                {MEETING_LABEL[m]}
              </option>
            ))}
          </select>
        </Field>
        <Field id="links" label="Public reference links (up to 5)" help="You may include links to public web pages, one per line. Please do not include intranet pages, shared-drive links, case records, or anything that requires a staff account to open." error={issues.links || issues["links.0"]}>
          <textarea id="links" value={form.links} onChange={(e) => set("links", e.target.value)} rows={2} />
        </Field>
        <Field id="attachment_notes" label="Documents you plan to bring" help="List any documents you plan to bring to the consultation. Attachments cannot be added here. Please leave out case, medical, and personnel information." error={issues.attachment_notes}>
          <textarea id="attachment_notes" value={form.attachment_notes} onChange={(e) => set("attachment_notes", e.target.value)} rows={2} maxLength={500} />
        </Field>
        <Field id="situation" label="What would you like help with? (required)" help="Briefly describe the situation and the support you need. Please leave out case names, Social Security numbers, medical details, complaints about named people, and personnel information." error={issues.situation}>
          <textarea id="situation" value={form.situation} onChange={(e) => set("situation", e.target.value)} rows={6} aria-invalid={Boolean(issues.situation)} />
        </Field>

        <div className="checks mb-4">
          <label>
            <input
              type="checkbox"
              checked={form.dsd_eligibility_attestation}
              onChange={(e) => set("dsd_eligibility_attestation", e.target.checked)}
              aria-describedby={issues.dsd_eligibility_attestation ? "dsd-attestation-error" : undefined}
              aria-invalid={Boolean(issues.dsd_eligibility_attestation)}
            />
            <span>I confirm that this request concerns work within the Disability Services Division. Direct consultation through this program is limited to DSD work. (required)</span>
          </label>
          {issues.dsd_eligibility_attestation ? <p className="error" id="dsd-attestation-error" role="alert">{issues.dsd_eligibility_attestation}</p> : null}
        </div>

        {refusal ? (
          <div className="mb-4">
            <Notice tone="stop">
              <strong>This request has not been saved. Please review the &quot;{intakeFieldLabel(refusal.field)}&quot; response. </strong>
              {refusal.message}
            </Notice>
            {refusal.redirect ? (
              <p className="mt-2">
                <Link href={refusal.redirect.href} className="btn btn--primary">
                  {refusal.redirect.label}
                </Link>
              </p>
            ) : null}
            <ActionList heading="Other ways to get help" actions={refusal.alternatives ?? []} />
          </div>
        ) : null}

        <div className="checks mb-4">
          <label>
            <input
              type="checkbox"
              checked={form.share_confirmation}
              onChange={(e) => set("share_confirmation", e.target.checked)}
              aria-describedby={issues.share_confirmation ? "share-confirmation-error" : undefined}
              aria-invalid={Boolean(issues.share_confirmation)}
            />
            <span>{intakeEnabled ? "I understand that submitting is voluntary. I am choosing to share this request with an authorized DSD eligibility reviewer. It is a program consultation request, not an official DHS record. (required)" : "I understand that this is only a private review. No request will be created, the form and summary will not be kept, and neither will be sent to the consultant. (required)"}</span>
          </label>
          {issues.share_confirmation ? <p className="error" id="share-confirmation-error" role="alert">{issues.share_confirmation}</p> : null}
        </div>
        {intakeEnabled ? (
          <div className="checks mb-4">
            <label>
              <input
                type="checkbox"
                checked={rememberOnDevice}
                onChange={(event) => setRememberOnDevice(event.target.checked)}
              />
              <span>Remember my reference ID and private access key on this device after I close this tab. This is optional; do not select it on a shared device.</span>
            </label>
          </div>
        ) : null}
        {netError ? <p className="error" role="alert">{netError}</p> : null}
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn--light" disabled={busy} onClick={() => call("preview")}>
            Review the summary
          </button>
          {intakeEnabled ? (
            <button type="submit" className="btn btn--primary" disabled={busy}>
              Submit request
            </button>
          ) : null}
        </div>
      </form>

      <aside className="space-y-4">
        {preview ? (
          <div className="card" aria-live="polite">
            <p className="kicker">{intakeEnabled ? "Before you submit" : "Your summary"}</p>
            <h2 className="text-lg font-extrabold">{intakeEnabled ? `What the ${PROGRAM.practiceOwnerRole} will see` : `What the ${PROGRAM.practiceOwnerRole} would see if submissions open`}</h2>
            <PacketView packet={preview} compact />
          </div>
        ) : (
          <div className="panel">
            <p className="kicker">{intakeEnabled ? "What happens next" : "How this works"}</p>
            {intakeEnabled ? (
              <ol className="list-decimal pl-5 text-sm">
                <li>After you submit, you will receive a reference ID and access key.</li>
                <li>An authorized reviewer first confirms the request concerns DSD work. The {PROGRAM.practiceOwnerRole} takes up confirmed requests.</li>
                <li>Meetings are scheduled separately. This form does not send a calendar invitation.</li>
                <li>You can check the request or withdraw it during eligibility review, while it is Received, or while it is Under review.</li>
              </ol>
            ) : (
              <ol className="list-decimal pl-5 text-sm">
                <li>Complete the form using general information only.</li>
                <li>Select Review the summary to see what the {PROGRAM.practiceOwnerRole} would receive.</li>
                <li>No request, reference ID, or access key will be created.</li>
                <li>The form and summary will not be kept or sent to the consultant.</li>
              </ol>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
