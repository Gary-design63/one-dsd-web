import { ONE_DSD_TEAM_SEED } from "@/lib/collaboration/seed";
import type { OneDsdTeamWorkspaceState } from "@/lib/collaboration/schema";

const AT = "2026-09-05T00:00:00.000Z";

/** A legitimate, fully populated workspace used to exercise every collection contract. */
export function completeCollaborationWorkspace(): OneDsdTeamWorkspaceState {
  const state = structuredClone(ONE_DSD_TEAM_SEED);
  state.channelMemberships.push({
    id: "channel_member_general",
    channelId: "general",
    workspaceMembershipId: "member_program_steward",
    sample: true,
  });
  state.reactions.push({
    id: "reaction_welcome",
    postId: "post_welcome",
    memberId: "member_program_steward",
    label: "Helpful",
    sample: true,
  });
  state.attachments.push({
    id: "attachment_welcome",
    postId: "post_welcome",
    fileName: "welcome.txt",
    mediaType: "text/plain",
    byteSize: 64,
    checksum: "sha256-example",
    status: "approved",
    accessibilityStatus: "reviewed",
    sample: true,
  });
  state.decisions.push({
    id: "decision_first_focus",
    workspaceId: "one_dsd_team",
    title: "First shared focus",
    summary: "The team will begin with accessible practice.",
    status: "confirmed",
    confirmedByLabel: "Program steward",
    confirmedAt: AT,
    sourceThreadId: "thread_welcome",
    sample: true,
  });
  state.pollResponses.push({
    id: "poll_response_first_focus",
    pollId: "poll_first_focus",
    memberId: "member_program_steward",
    optionId: "accessible_practice",
    sample: true,
  });
  state.feedbackResponses.push({
    id: "feedback_response_workspace",
    feedbackId: "feedback_workspace",
    authorLabel: "Program steward",
    response: "Keep the working space clear and welcoming.",
    createdAt: AT,
    sample: true,
  });
  state.notificationPreferences.push({
    id: "notification_program_steward",
    memberId: "member_program_steward",
    channelId: "general",
    mode: "digest",
    quietHoursNote: "Outside working hours",
    sample: true,
  });
  state.notificationDeliveries.push({
    id: "notification_delivery_example",
    preferenceId: "notification_program_steward",
    destinationClass: "native",
    status: "delivered",
    attemptCount: 1,
    sample: true,
  });
  state.contentProposals.push({
    id: "content_proposal_example",
    workspaceId: "one_dsd_team",
    title: "Accessible meeting preparation",
    sourceThreadId: "thread_welcome",
    status: "submitted",
    sample: true,
  });
  state.automationRuns.push({
    id: "automation_run_example",
    policyId: "automation_microsoft_bridge",
    status: "stopped",
    resultNote: "No external information was sent.",
    createdAt: AT,
    sample: true,
  });
  return state;
}

type MutableWorkspace = Record<string, unknown>;
type MutableEntry = Record<string, unknown>;

function entry(value: MutableWorkspace, collection: string): MutableEntry {
  return (value[collection] as MutableEntry[])[0];
}

const concealedProfile = () => ({ worker: "E17", belief: "synthetic" });

export const collaborationScalarObjectAttacks: ReadonlyArray<{
  name: string;
  mutate: (value: MutableWorkspace) => void;
}> = [
  { name: "workspace.summary", mutate: (value) => { (value.workspace as MutableEntry).summary = concealedProfile(); } },
  { name: "memberships.displayLabel", mutate: (value) => { entry(value, "memberships").displayLabel = concealedProfile(); } },
  { name: "channels.purpose", mutate: (value) => { entry(value, "channels").purpose = concealedProfile(); } },
  { name: "channelMemberships.channelId", mutate: (value) => { entry(value, "channelMemberships").channelId = concealedProfile(); } },
  { name: "threads.title", mutate: (value) => { entry(value, "threads").title = concealedProfile(); } },
  { name: "posts.body", mutate: (value) => { entry(value, "posts").body = concealedProfile(); } },
  { name: "reactions.label", mutate: (value) => { entry(value, "reactions").label = concealedProfile(); } },
  { name: "attachments.mediaType", mutate: (value) => { entry(value, "attachments").mediaType = concealedProfile(); } },
  { name: "meetingSeries.cadence", mutate: (value) => { entry(value, "meetingSeries").cadence = concealedProfile(); } },
  { name: "meetingOccurrences.accessNote", mutate: (value) => { entry(value, "meetingOccurrences").accessNote = concealedProfile(); } },
  { name: "agendaItems.minutes", mutate: (value) => { entry(value, "agendaItems").minutes = concealedProfile(); } },
  { name: "decisions.summary", mutate: (value) => { entry(value, "decisions").summary = concealedProfile(); } },
  { name: "polls.question", mutate: (value) => { entry(value, "polls").question = concealedProfile(); } },
  {
    name: "polls.options.label",
    mutate: (value) => {
      ((entry(value, "polls").options as MutableEntry[])[0]).label = concealedProfile();
    },
  },
  { name: "pollResponses.optionId", mutate: (value) => { entry(value, "pollResponses").optionId = concealedProfile(); } },
  { name: "feedback.prompt", mutate: (value) => { entry(value, "feedback").prompt = concealedProfile(); } },
  { name: "feedbackResponses.response", mutate: (value) => { entry(value, "feedbackResponses").response = concealedProfile(); } },
  { name: "learningActivities.reflectionPrompt", mutate: (value) => { entry(value, "learningActivities").reflectionPrompt = concealedProfile(); } },
  { name: "notificationPreferences.mode", mutate: (value) => { entry(value, "notificationPreferences").mode = concealedProfile(); } },
  { name: "notificationDeliveries.attemptCount", mutate: (value) => { entry(value, "notificationDeliveries").attemptCount = concealedProfile(); } },
  { name: "actionItems.ownerLabel", mutate: (value) => { entry(value, "actionItems").ownerLabel = concealedProfile(); } },
  { name: "contentProposals.title", mutate: (value) => { entry(value, "contentProposals").title = concealedProfile(); } },
  { name: "automationPolicies.allowedAction", mutate: (value) => { entry(value, "automationPolicies").allowedAction = concealedProfile(); } },
  { name: "automationRuns.resultNote", mutate: (value) => { entry(value, "automationRuns").resultNote = concealedProfile(); } },
];
