import { TRAINING_CREDIT_NOTICE } from "@/lib/program/learning-credit";
import { participationContract, type ParticipationSurface } from "@/lib/participation/contracts";
import { CONSULTATION_TOMBSTONE_RETENTION_DAYS } from "@/lib/privacy/consultation-terminal-retention";

const STAFF_NOTICES: Partial<Record<ParticipationSurface, string[]>> = {
  start_routing: ["These optional questions help you find a place to begin. Your choices stay on this page and disappear when you leave it."],
  support_routing: ["Use general work information to find support. Your choices stay on this page; no one is contacted and no request is submitted."],
  ask: ["Ask is optional. Your questions and the answers are kept so the program owner can review them and improve Ask. They are not shared with your supervisor. Clearing recent questions or closing this tab removes the copy on this computer; the program owner’s copy stays.", "To prepare an answer, your question and recent follow-ups may be sent to an outside service. If you choose outside research, that service receives the question you type. Leave out private personal or case information."],
  learning: ["Explore at your own pace. This learning is optional. Saved notes and progress stay on this device until you delete them; anyone using this computer may see them. They are not shared with supervisors or program staff.", TRAINING_CREDIT_NOTICE],
  path_practice: ["These optional practice paths are for reading and downloading. This page does not save your answers or progress. Notes saved through an earlier version may still be in this browser's site data; someone using this computer could see them. This page does not show or delete those older notes. Nothing you read or download here is sent to your supervisor or used to evaluate you.", TRAINING_CREDIT_NOTICE],
  my_work: ["Your saved notes, progress, and request references stay on this device until you delete them. Recent Ask conversations on this computer disappear when you clear them or close the tab; the program owner’s copy stays. Anyone using this computer may see this information; it is not sent to your supervisor.", "Deleting a saved request reference here does not withdraw or delete a submitted consultation request."],
  consultation_preview: ["Reviewing a summary is optional. It does not save or send a consultation request or arrange a meeting. Your form and summary disappear when you leave this page. Information carried over from Ask stays on this computer until you clear it or close the tab, and the program owner’s copy of your Ask questions stays."],
  consultation_submission: ["Submitting is optional. Review the summary first, and leave out client, medical, personnel, complaint, and other identifying details. Only authorized consultants can see the request you submit; it is not sent to your supervisor.", "You receive a reference and private access key to follow up. Submission does not schedule a meeting. Only requests confirmed as DSD work enter the consultation queue. This is a program consultation request, not an official DHS record or evidence of required training."],
  consultation_tracking: ["Use your reference and private access key to check your request. Keep the access key private. You can correct general work information or withdraw the request when those options are available. Authorized consultants can see these changes.", "Saving a reference on this device is optional. Anyone using this computer may see it. Deleting that saved reference does not withdraw or delete your request. Corrections and withdrawal do not change how long the request is kept."],
};

const FACTS = [
  ["participation", "Participation"],
  ["privacy", "Privacy and recording"],
  ["purpose", "Purpose and requirements"],
  ["viewers", "Who can see it"],
  ["creates", "What this creates"],
  ["officialRecord", "Official record"],
  ["retention", "How long it stays"],
] as const;

const SURFACE_HEADINGS: Partial<Record<ParticipationSurface, string>> = {
  consultant_sign_in: "How Consultant Workspace sign-in works",
  consultant_workspace: "How the Consultant Workspace works",
  one_dsd_team: "How the One DSD Team space works",
};

type ParticipationNoticeProps = {
  surface: ParticipationSurface;
  consultationRetentionDays?: number;
  correctionEnabled?: boolean;
};

function displayedFact(
  field: (typeof FACTS)[number][0],
  value: string,
  props: ParticipationNoticeProps,
): string {
  if (
    field === "retention"
    && (props.surface === "consultation_submission" || props.surface === "consultation_tracking")
    && props.consultationRetentionDays
  ) {
    const days = props.consultationRetentionDays;
    return `${value} The approved consultation period is ${days} calendar day${days === 1 ? "" : "s"} from submission.`;
  }
  if (
    field === "creates"
    && props.surface === "consultation_tracking"
    && props.correctionEnabled === false
  ) {
    return `${value} Corrections are temporarily unavailable; checking status and any permitted withdrawal remain available.`;
  }
  return value;
}

export function ParticipationNotice(props: ParticipationNoticeProps) {
  const { surface } = props;
  const contract = participationContract(surface);
  const headingId = `participation-${contract.id}`;
  const staffNotice = STAFF_NOTICES[surface];

  if (staffNotice) {
    const consultation = surface === "consultation_submission" || surface === "consultation_tracking";
    return (
      <section className="text-sm text-muted space-y-2" aria-label="Your privacy and participation" data-participation-class={contract.participationClass}>
        {staffNotice.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {consultation && props.consultationRetentionDays && (
          <p>Your submitted details are retained for {props.consultationRetentionDays} calendar days from submission, even if you withdraw the request. After that, only an expired status remains for {CONSULTATION_TOMBSTONE_RETENTION_DAYS} more days before it is deleted.</p>
        )}
        {surface === "consultation_tracking" && props.correctionEnabled === false && (
          <p>Corrections are temporarily unavailable. You can still check status and withdraw when that option is available.</p>
        )}
      </section>
    );
  }

  return (
    <section className="panel" aria-labelledby={headingId} data-participation-class={contract.participationClass}>
      <p className="kicker">Before you begin</p>
      <h2 id={headingId} className="text-xl font-extrabold">
        {SURFACE_HEADINGS[surface] ?? "How this works"}
      </h2>
      <dl className="mt-3 grid gap-3 text-sm md:grid-cols-2">
        {FACTS.map(([field, label]) => (
          <div key={field}>
            <dt className="font-bold">{label}</dt>
            <dd className="m-0">{displayedFact(field, contract.disclosure[field], props)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
