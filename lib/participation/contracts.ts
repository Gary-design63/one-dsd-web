import { TRAINING_CREDIT_NOTICE } from "@/lib/program/learning-credit";
import { CONSULTATION_TOMBSTONE_RETENTION_DAYS } from "@/lib/privacy/consultation-terminal-retention";
import { OPERATIONAL_RECORD_RETENTION_DAYS } from "@/lib/privacy/operational-retention";
import {
  CONSULTATION_PARTICIPATION_NOTICE_CONTRACT_VERSION,
  CONSULTATION_PARTICIPATION_NOTICE_ID,
} from "@/lib/participation/consultation-notice";

export const PARTICIPATION_CLASSES = [
  "voluntary_private",
  "voluntary_shared",
  "supports_required",
  "required_record",
] as const;

export type ParticipationClass = (typeof PARTICIPATION_CLASSES)[number];

export const PARTICIPATION_SURFACES = [
  "start_routing",
  "support_routing",
  "ask",
  "learning",
  "path_practice",
  "my_work",
  "consultation_preview",
  "consultation_submission",
  "consultation_tracking",
  "consultant_sign_in",
  "consultant_workspace",
  "one_dsd_team",
] as const;

export type ParticipationSurface = (typeof PARTICIPATION_SURFACES)[number];
export type ParticipationRequirement = "voluntary" | "required";
export type ParticipationHandling = "private" | "recorded";
export type ParticipationPurpose =
  | "learning"
  | "practice"
  | "support"
  | "compliance"
  | "program_operations"
  | "collaboration";
export type ParticipationViewer =
  | "participant"
  | "same_browser_user"
  | "approved_processing_service"
  | "authorized_program_operator"
  | "supervisor"
  | "program_owner"
  | "authorized_consultant_workspace_user"
  | "authorized_one_dsd_team_member"
  | "released_staff_reader";
export type ParticipationOutput =
  | "route_recommendation"
  | "answer"
  | "ask_response_record"
  | "source_list"
  | "browser_session_history"
  | "browser_learning_progress"
  | "browser_working_notes"
  | "browser_saved_request_reference"
  | "self_review"
  | "consultation_preview"
  | "confidential_consultation_request"
  | "tracking_credential"
  | "consultation_status_view"
  | "consultation_correction_update"
  | "consultation_withdrawal_update"
  | "consultation_credential_rotation"
  | "privacy_minimized_operational_event"
  | "privacy_minimized_research_usage"
  | "short_lived_rate_limit_bucket"
  | "owner_session_cookie"
  | "owner_session_revocation"
  | "consultation_operational_update"
  | "program_governance_record"
  | "review_and_publication_record"
  | "collaboration_working_record";

/** Content-free operational traces and research-usage records are removed after this period. */
export const OPERATIONAL_EVENT_RETENTION_DAYS = OPERATIONAL_RECORD_RETENTION_DAYS;

export type ParticipationContract = {
  id: string;
  version: number;
  surface: ParticipationSurface;
  participationClass: ParticipationClass;
  requirement: ParticipationRequirement;
  handling: ParticipationHandling;
  purpose: ParticipationPurpose;
  viewers: readonly ParticipationViewer[];
  creates: readonly ParticipationOutput[];
  officialRecord: boolean;
  sensitivityClass?: "S2" | "S3";
  activeQueueAdmission?: "confirmed_dsd_only";
  disclosure: {
    participation: string;
    privacy: string;
    purpose: string;
    viewers: string;
    creates: string;
    officialRecord: string;
    retention: string;
  };
};

const CONTRACTS = {
  start_routing: {
    id: "staff-start-routing-private-v1",
    version: 1,
    surface: "start_routing",
    participationClass: "voluntary_private",
    requirement: "voluntary",
    handling: "private",
    purpose: "practice",
    viewers: ["participant", "same_browser_user"],
    creates: ["route_recommendation"],
    officialRecord: false,
    disclosure: {
      participation: "Voluntary. You choose whether to answer the three routing questions.",
      privacy: "Private on this page. Your choices are not sent to a supervisor or added to a staff profile.",
      purpose: "Find a useful place to begin based on your role, task, and timing. This is not training or compliance.",
      viewers: "You can see the choices and suggestion. Someone looking at the same open page may also see them.",
      creates: "A pointer to relevant guidance, practice, and the right person to ask.",
      officialRecord: "The route is not an official record and does not document participation or completion.",
      retention: "The choices remain only on the open page until you clear them by refreshing, closing, or leaving it.",
    },
  },
  support_routing: {
    id: "staff-support-routing-private-v1",
    version: 1,
    surface: "support_routing",
    participationClass: "voluntary_private",
    requirement: "voluntary",
    handling: "private",
    purpose: "support",
    viewers: ["participant", "same_browser_user"],
    creates: ["route_recommendation"],
    officialRecord: false,
    disclosure: {
      participation: "Voluntary. You choose whether to use the support route.",
      privacy: "Private on this page. Use general work information only; the choices are not sent to a supervisor or consultant.",
      purpose: "Identify self-service guidance and the person or office responsible for the work. This is not a complaint or case channel.",
      viewers: "You can see the choices and route. Someone looking at the same open page may also see them.",
      creates: "An on-screen list of relevant guidance and responsible roles or offices. It does not contact anyone.",
      officialRecord: "The route is not an official record and does not submit a consultation request.",
      retention: "The choices remain only on the open page until you clear them by refreshing, closing, or leaving it.",
    },
  },
  ask: {
    id: "staff-ask-recorded-v3",
    version: 3,
    surface: "ask",
    participationClass: "voluntary_shared",
    requirement: "voluntary",
    handling: "recorded",
    purpose: "learning",
    viewers: ["participant", "same_browser_user", "approved_processing_service", "authorized_program_operator", "program_owner", "authorized_consultant_workspace_user"],
    creates: [
      "answer",
      "source_list",
      "browser_session_history",
      "ask_response_record",
      "privacy_minimized_operational_event",
      "privacy_minimized_research_usage",
      "short_lived_rate_limit_bucket",
    ],
    officialRecord: false,
    disclosure: {
      participation: "Voluntary. You choose whether to use Ask.",
      privacy: "Questions and complete staff-visible responses are kept in the protected program workspace for the owner to review and improve the service. Response records do not include account, network, browser, or session identifiers, or a copy of earlier turns. A question refused for private information is omitted from its response record.",
      purpose: `Self-directed learning and work support, not required training or compliance. ${TRAINING_CREDIT_NOTICE}`,
      viewers: "You and anyone using this browser tab can see its temporary history. The program owner and authorized consultant workspace users can see kept ASK response records. Supervisors do not receive them. Authorized operators maintain the service. A connected answering service can process your question, up to four recent turns, and relevant published program sources. For outside research, the research service receives the current question.",
      creates: "An answer with sources and limits, a question-and-response record with its time and outcome, and up to 30 recent questions and answers in this browser tab. Operational traces remain content-free; outside-research usage records hold query hashes, source domains, and usage totals. If you prepare a consultation request, an editable excerpt is copied into the request preview; a consultation request is created only when you submit it.",
      officialRecord: "ASK response records are program service records. They do not create official DHS guidance, a training record, or another official DHS record.",
      retention: `By default, ASK response records remain until the program owner deletes them. If the owner configures an expiry period, it applies to new response records and is shown in the owner workspace. The browser copy keeps up to 30 recent questions and answers until you clear them or close the tab; clearing that copy does not delete the response records. Content-free operational events and outside-research usage records are removed after ${OPERATIONAL_EVENT_RETENTION_DAYS} days; the rate-limit bucket expires after 10 minutes.`,
    },
  },
  learning: {
    id: "staff-learning-private-v1",
    version: 1,
    surface: "learning",
    participationClass: "voluntary_private",
    requirement: "voluntary",
    handling: "private",
    purpose: "learning",
    viewers: ["participant", "same_browser_user"],
    creates: ["browser_learning_progress", "browser_working_notes"],
    officialRecord: false,
    disclosure: {
      participation: "Voluntary. You choose whether to read a module or begin a learning path.",
      privacy: "Private on this device. Reading a module does not create a completion report.",
      purpose: `Self-directed learning and practice, not required training or compliance. ${TRAINING_CREDIT_NOTICE}`,
      viewers:
        "You can see what you save. Anyone using the same browser on this device may also see saved notes and progress. Supervisors and program administrators do not receive them.",
      creates:
        "Reading alone creates no completion record. If you use a learning path, it can create browser-only progress and working notes for you.",
      officialRecord: "This learning does not create an official DHS training record. Saved notes and progress are for your own learning.",
      retention:
        "Saved path progress and notes remain in this browser until you delete them or clear this browser's site data.",
    },
  },
  path_practice: {
    id: "staff-path-practice-private-v1",
    version: 1,
    surface: "path_practice",
    participationClass: "voluntary_private",
    requirement: "voluntary",
    handling: "private",
    purpose: "practice",
    viewers: ["participant", "same_browser_user"],
    creates: ["browser_learning_progress", "browser_working_notes", "self_review"],
    officialRecord: false,
    disclosure: {
      participation: "Voluntary. You choose whether to begin, continue, or finish this worksheet.",
      privacy: "Private on this device. Your notes, progress, and self-review stay in this browser.",
      purpose: `Self-directed practice, not required training or compliance. ${TRAINING_CREDIT_NOTICE}`,
      viewers:
        "You can see what you save. Anyone using the same browser on this device may also see it. It is not sent to your supervisor or used to evaluate you.",
      creates: "Browser-only working notes, path progress, and a private self-review. It does not create a score.",
      officialRecord:
        "This worksheet is not an official record and cannot be used as evidence that you completed a required process.",
      retention: "Your notes and progress remain in this browser until you delete them or clear this browser's site data.",
    },
  },
  my_work: {
    id: "staff-my-work-private-v2",
    version: 2,
    surface: "my_work",
    participationClass: "voluntary_private",
    requirement: "voluntary",
    handling: "private",
    purpose: "practice",
    viewers: ["participant", "same_browser_user"],
    creates: [
      "browser_session_history",
      "browser_learning_progress",
      "browser_working_notes",
      "browser_saved_request_reference",
    ],
    officialRecord: false,
    disclosure: {
      participation: "Voluntary. You choose whether to save, return to, or delete this work.",
      privacy: "Private on this device. My View reads only the program information saved in this browser.",
      purpose: `Your self-directed learning and practice space, not required training or compliance. ${TRAINING_CREDIT_NOTICE}`,
      viewers:
        "You can see what is saved here. Anyone using the same browser on this device may also see it. Your notes, progress, and Ask history are not sent to your supervisor or used to evaluate you.",
      creates:
        "A browser-only view of working notes, learning progress, temporary Ask history, and any consultation reference and access key you chose to save. Opening My View does not create a new server record.",
      officialRecord:
        "My View is not an official record. Removing a saved consultation reference here does not withdraw or delete the separate submitted request.",
      retention:
        "Working notes, progress, and saved consultation references remain until you delete them or clear this browser's site data. The browser copy of Ask history remains until you clear it or close the browser tab. Clearing it does not delete the separate ASK response records available to the program owner.",
    },
  },
  consultation_preview: {
    id: "dsd-consultation-preview-v2",
    version: 2,
    surface: "consultation_preview",
    participationClass: "voluntary_private",
    requirement: "voluntary",
    handling: "private",
    purpose: "support",
    viewers: ["participant", "same_browser_user", "authorized_program_operator"],
    creates: ["consultation_preview", "privacy_minimized_operational_event", "short_lived_rate_limit_bucket"],
    officialRecord: false,
    disclosure: {
      participation:
        "Voluntary. You choose whether to complete the form and review a summary. Previewing does not commit you to submit a request or attend a meeting.",
      privacy:
        "Private preview. The application processes the general work information you enter to build the summary, but it does not create a consultation request, save the form or summary, or send either to the consultant workspace. It keeps a content-free service event and a short-lived request-limit bucket.",
      purpose: `Optional DSD work support, not required training or a compliance activity. ${TRAINING_CREDIT_NOTICE}`,
      viewers:
        "You can see the form and summary. Someone using the same open browser may also see them. Authorized consultant workspace users, supervisors, and other staff do not receive the preview. Authorized program operators can see that a preview tool ran and whether it succeeded, but not your form or summary.",
      creates:
        "An on-screen draft summary, a content-free operational event, and a short-lived HMAC request-limit bucket. It creates no request, queue item, reference ID, access key, meeting, or calendar invitation.",
      officialRecord:
        "The preview is not an official DHS record, training record, compliance record, or consultation record.",
      retention:
        `The form and summary remain only in the open page and are gone when you refresh, close, or leave it. Information carried in from Ask or a path remains in this browser tab until you clear it or close the tab. The original ASK response record is kept separately for the program owner. The content-free operational event is removed after ${OPERATIONAL_EVENT_RETENTION_DAYS} days, and the request-limit bucket expires after one hour.`,
    },
  },
  consultation_submission: {
    id: CONSULTATION_PARTICIPATION_NOTICE_ID,
    version: CONSULTATION_PARTICIPATION_NOTICE_CONTRACT_VERSION,
    surface: "consultation_submission",
    participationClass: "voluntary_shared",
    requirement: "voluntary",
    handling: "recorded",
    purpose: "support",
    viewers: ["participant", "same_browser_user", "authorized_consultant_workspace_user", "authorized_program_operator"],
    creates: ["confidential_consultation_request", "tracking_credential", "browser_saved_request_reference", "privacy_minimized_operational_event", "short_lived_rate_limit_bucket"],
    officialRecord: false,
    sensitivityClass: "S3",
    activeQueueAdmission: "confirmed_dsd_only",
    disclosure: {
      participation:
        "Voluntary. You choose whether to submit after reviewing the summary. Choosing Review the summary by itself does not submit a request.",
      privacy:
        "Submitting turns the information you chose to share into an S3 confidential operational request. Its full contents are visible only to authorized consultant workspace users. Leave out client, medical, personnel, complaint, and other identifying details.",
      purpose: `Optional consultation support for work within DSD, not required training or a compliance activity. ${TRAINING_CREDIT_NOTICE}`,
      viewers:
        "Before submission, you and someone using the same open browser can see the form. After submission, authorized consultant workspace users can see the confidential request. Authorized program operators can see content-free service activity but not use it to evaluate you. The request is not sent to your supervisor.",
      creates:
        "A confidential request awaiting DSD eligibility review, a reference ID and private access key, a temporary copy of both credentials in this browser tab, a content-free operational event, and a short-lived HMAC request-limit bucket. Saving the credentials on this device after the tab closes is optional. It does not schedule a meeting. Only confirmed DSD requests enter the active consultation queue.",
      officialRecord:
        "The request is an operational consultation record inside this program. It is not an official DHS system-of-record entry and does not document training or compliance.",
      retention:
        `The submitted request remains on the server for the exact approved period shown below, including if it is declined or withdrawn. At the end of that period, its submitted details are removed and a minimal expired-status record remains for ${CONSULTATION_TOMBSTONE_RETENTION_DAYS} more days before that record and its replay receipt are deleted. Its reference and access key remain in this browser tab until you close it. If you choose to remember them on this device, that copy remains until you delete it. Deleting either browser copy does not withdraw or delete the server request. Content-free operational events are removed after ${OPERATIONAL_EVENT_RETENTION_DAYS} days; the request-limit bucket expires after one hour.`,
    },
  },
  consultation_tracking: {
    id: "dsd-consultation-tracking-v2",
    version: 2,
    surface: "consultation_tracking",
    participationClass: "voluntary_shared",
    requirement: "voluntary",
    handling: "recorded",
    purpose: "support",
    viewers: ["participant", "same_browser_user", "authorized_consultant_workspace_user", "authorized_program_operator"],
    creates: ["consultation_status_view", "consultation_correction_update", "consultation_withdrawal_update", "consultation_credential_rotation", "privacy_minimized_operational_event", "short_lived_rate_limit_bucket"],
    officialRecord: false,
    sensitivityClass: "S3",
    disclosure: {
      participation:
        "Voluntary. You choose whether to check the status of a request, correct its general work information while changes are available, or withdraw it when withdrawal is available.",
      privacy:
        "The request remains S3 confidential. Your reference ID and access key are used together to return a limited status view and authorize a correction or withdrawal. Treat the access key as private; it is not placed in the page address.",
      purpose: `Optional follow-up for your DSD consultation request, not required training or a compliance activity. ${TRAINING_CREDIT_NOTICE}`,
      viewers:
        "You can see the limited status when you provide both credentials. Someone using the same browser may see a saved reference and access key. Authorized consultant workspace users can see the request and any saved correction or withdrawal. Authorized program operators can see content-free service activity; supervisors do not receive your Ask or learning activity.",
      creates:
        "Checking creates an on-screen status view and does not add Ask or learning activity to the request. Correcting updates only the allowed general work fields on the existing request, checks the revised information again, and records which fields changed; it cannot change eligibility, status, schedule, or private consultant notes. You can replace the access key for an unexpired request; the old key then stops working, and neither plaintext key is stored on the server. Withdrawing records a Withdrawn status on the existing request. None of these actions creates another request.",
      officialRecord:
        "Tracking does not create a training, compliance, or employee-performance record. It reads or updates only the consultation program record.",
      retention:
        `A temporary reference and access key remain in the browser tab until it closes. A copy you choose to remember on this device remains until you delete it. Deleting a browser copy does not withdraw or delete the server request. A correction or withdrawal does not restart the retention period. After the approved request period ends, the submitted details are removed; the minimal expired-status record remains for ${CONSULTATION_TOMBSTONE_RETENTION_DAYS} more days and is then deleted with its replay receipt. Content-free operational events are removed after ${OPERATIONAL_EVENT_RETENTION_DAYS} days; each request-limit bucket expires after ten minutes.`,
    },
  },
  consultant_sign_in: {
    id: "consultant-workspace-sign-in-v1",
    version: 1,
    surface: "consultant_sign_in",
    participationClass: "supports_required",
    requirement: "required",
    handling: "recorded",
    purpose: "program_operations",
    viewers: ["participant", "authorized_program_operator"],
    creates: ["owner_session_cookie", "owner_session_revocation", "short_lived_rate_limit_bucket"],
    officialRecord: false,
    disclosure: {
      participation: "Sign-in is required only for the protected consultant workspace. Staff reading, learning, and private practice do not require this sign-in.",
      privacy: "The access key is checked on the server and is not saved in the browser or an activity record. A secure session cookie identifies this browser as an authorized workspace session.",
      purpose: "Access control for private program operations, not staff learning, training, or compliance.",
      viewers: "The signed-in person can use the workspace. Authorized program operators can manage the access key and security records; supervisors and general staff do not receive sign-in activity.",
      creates: "A secure session lasting up to eight hours, a short-lived HMAC request-limit bucket, and—when you sign out—a revocation marker that prevents reuse of that session.",
      officialRecord: "Signing in does not create an official DHS, training, compliance, personnel, or performance record.",
      retention: "The session expires after eight hours. The sign-in request-limit bucket expires after 15 minutes. A sign-out revocation marker is removed after the session it protects has expired.",
    },
  },
  consultant_workspace: {
    id: "consultant-workspace-operations-v2",
    version: 2,
    surface: "consultant_workspace",
    participationClass: "voluntary_shared",
    requirement: "voluntary",
    handling: "recorded",
    purpose: "program_operations",
    viewers: ["program_owner", "authorized_consultant_workspace_user", "authorized_program_operator", "released_staff_reader"],
    creates: ["consultation_operational_update", "program_governance_record", "review_and_publication_record", "privacy_minimized_operational_event"],
    officialRecord: false,
    sensitivityClass: "S2",
    disclosure: {
      participation: "Using a workspace action is voluntary, but any saved change is recorded so program decisions can be reviewed and reversed where the action supports reversal.",
      privacy: "This protected space contains program working material and, in the consultation area, S3 confidential requests. Do not place case, medical, personnel, complaint, or credential information in notes.",
      purpose: "Operate, review, and improve this independent program. The workspace is not a staff learning or compliance experience.",
      viewers: "The program owner and authorized consultant workspace users can see protected working records. Authorized operators can maintain the service. Staff readers see only material released through a separate publication decision, and requesters see only their limited authenticated consultation status.",
      creates: "Depending on the action: consultation status or eligibility updates, private consultant notes, review findings, publication decisions, program settings, evaluation reports, ASK question-and-response records, and content-free operational events.",
      officialRecord: "These are program operational and governance records, not official DHS case, complaint, personnel, training, or compliance records.",
      retention: `ASK response records remain until owner deletion by default; an optional configured expiry applies to new records. Consultation records follow the exact period shown in their own participation notice. Content revisions, decisions, and their release history remain for the life of this program unless a governing records requirement says otherwise. Content-free operational events are removed after ${OPERATIONAL_EVENT_RETENTION_DAYS} days.`,
    },
  },
  one_dsd_team: {
    id: "one-dsd-team-working-space-v1",
    version: 1,
    surface: "one_dsd_team",
    participationClass: "voluntary_shared",
    requirement: "voluntary",
    handling: "recorded",
    purpose: "collaboration",
    viewers: ["participant", "program_owner", "authorized_one_dsd_team_member", "authorized_program_operator"],
    creates: ["collaboration_working_record", "privacy_minimized_operational_event"],
    officialRecord: false,
    sensitivityClass: "S2",
    disclosure: {
      participation: "Participation in this volunteer working space is optional. Posts, reactions, tasks, meeting items, feedback, and decisions are saved when you choose the corresponding action.",
      privacy: "This is a protected program working space, not a place for case, medical, personnel, complaint, accommodation, credential, or other confidential information.",
      purpose: `One DSD program collaboration, planning, learning, and follow-through—not required staff training or performance evaluation. ${TRAINING_CREDIT_NOTICE}`,
      viewers: "The program owner and authorized One DSD Team members can see the working records. Authorized operators can maintain the service. Supervisors and staff outside the space do not receive a participation dashboard.",
      creates: "Durable working posts, reactions, agenda items, tasks, polls, feedback, learning activities, proposals, and decisions, plus content-free operational events.",
      officialRecord: "The working space does not create an official DHS committee, personnel, training, compliance, complaint, or case record.",
      retention: `Working records remain for the life of this program or until an authorized participant removes them through an approved lifecycle. Content-free operational events are removed after ${OPERATIONAL_EVENT_RETENTION_DAYS} days.`,
    },
  },
} as const satisfies Record<ParticipationSurface, ParticipationContract>;

export const PARTICIPATION_CONTRACTS: Readonly<Record<ParticipationSurface, ParticipationContract>> = CONTRACTS;

export function participationContract(surface: ParticipationSurface): ParticipationContract {
  return PARTICIPATION_CONTRACTS[surface];
}

export function participationContractProblems(
  contracts: Readonly<Record<ParticipationSurface, ParticipationContract>> = PARTICIPATION_CONTRACTS,
): string[] {
  const problems: string[] = [];
  const seenIds = new Set<string>();

  for (const surface of PARTICIPATION_SURFACES) {
    const contract = contracts[surface];
    if (!contract) {
      problems.push(`${surface}: contract is missing`);
      continue;
    }
    if (contract.surface !== surface) problems.push(`${surface}: surface does not match its registry key`);
    if (!contract.id.trim()) problems.push(`${surface}: id is missing`);
    else if (seenIds.has(contract.id)) problems.push(`${surface}: id is not unique`);
    else seenIds.add(contract.id);
    if (!Number.isInteger(contract.version) || contract.version < 1) problems.push(`${surface}: version must be a positive integer`);
    if (!PARTICIPATION_CLASSES.includes(contract.participationClass)) problems.push(`${surface}: participation class is invalid`);
    if (!contract.viewers.length) problems.push(`${surface}: at least one viewer must be declared`);
    if (!contract.creates.length) problems.push(`${surface}: at least one output must be declared`);
    for (const [field, value] of Object.entries(contract.disclosure)) {
      if (!value.trim()) problems.push(`${surface}: disclosure.${field} is missing`);
    }
    if (contract.participationClass === "voluntary_private") {
      if (contract.requirement !== "voluntary") problems.push(`${surface}: voluntary_private must be voluntary`);
      if (contract.handling !== "private") problems.push(`${surface}: voluntary_private must be private`);
      if (contract.officialRecord) problems.push(`${surface}: voluntary_private cannot be an official record`);
      if (
        contract.viewers.includes("supervisor") ||
        contract.viewers.includes("program_owner") ||
        contract.viewers.includes("authorized_consultant_workspace_user")
      ) {
        problems.push(`${surface}: private participation cannot name a supervisor or workspace user as a viewer`);
      }
    }
    if (contract.participationClass === "voluntary_shared") {
      if (contract.requirement !== "voluntary") problems.push(`${surface}: voluntary_shared must be voluntary`);
      if (contract.handling !== "recorded") problems.push(`${surface}: voluntary_shared must be recorded`);
      if (contract.officialRecord) problems.push(`${surface}: voluntary_shared cannot be an official record`);
    }
    if (surface === "consultation_submission" || surface === "consultation_tracking") {
      if (!contract.viewers.includes("authorized_consultant_workspace_user")) {
        problems.push(`${surface}: consultation must name authorized consultant workspace users`);
      }
      if (contract.viewers.includes("supervisor") || contract.viewers.includes("program_owner")) {
        problems.push(`${surface}: consultation cannot name a supervisor or general program owner as a viewer`);
      }
      if (contract.sensitivityClass !== "S3") problems.push(`${surface}: consultation must be S3`);
    }
    if (surface === "consultation_submission" && contract.activeQueueAdmission !== "confirmed_dsd_only") {
      problems.push(`${surface}: active queue admission must require confirmed DSD eligibility`);
    }
  }

  for (const key of Object.keys(contracts)) {
    if (!PARTICIPATION_SURFACES.includes(key as ParticipationSurface)) problems.push(`${key}: surface is not registered`);
  }

  return problems;
}

const contractProblems = participationContractProblems();
if (contractProblems.length) {
  throw new Error(`Invalid participation contract registry:\n${contractProblems.join("\n")}`);
}
