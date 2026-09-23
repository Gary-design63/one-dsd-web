import type {
  ActionItem,
  CollaborationChannel,
  DiscussionThread,
  MeetingOccurrence,
  OneDsdTeamWorkspaceState,
  Post,
  ProgramWorkspace,
  StructuredFeedback,
} from "./schema";

export type OneDsdWorkspaceView = Pick<
  ProgramWorkspace,
  "programName" | "scopeLabel" | "summary"
>;

export type OneDsdChannelView = Pick<
  CollaborationChannel,
  "id" | "name" | "purpose" | "access" | "position"
>;

export type OneDsdThreadView = Pick<
  DiscussionThread,
  "id" | "channelId" | "title" | "updatedAt" | "pinned"
>;

export type OneDsdPostView = Pick<
  Post,
  "id" | "threadId" | "parentPostId" | "body" | "authorLabel" | "createdAt" | "sample"
>;

export type OneDsdMeetingView = Pick<
  MeetingOccurrence,
  "id" | "title" | "scheduleNote" | "accessNote" | "status"
>;

export type OneDsdActionView = Pick<
  ActionItem,
  "id" | "title" | "ownerLabel" | "dueNote" | "status"
>;

export type OneDsdFeedbackView = Pick<StructuredFeedback, "id" | "prompt"> & {
  responseCount: number;
};

export type OneDsdTeamWorkspaceView = {
  workspace: OneDsdWorkspaceView;
  channels: OneDsdChannelView[];
  threads: OneDsdThreadView[];
  posts: OneDsdPostView[];
  meetingOccurrences: OneDsdMeetingView[];
  actionItems: OneDsdActionView[];
  feedback: OneDsdFeedbackView[];
};

/**
 * The browser receives only information rendered by the owner workspace. Connection details,
 * internal operating rules, audit state, notification records, and automation policy stay on
 * the server.
 */
export function toOneDsdTeamWorkspaceView(
  state: OneDsdTeamWorkspaceState,
): OneDsdTeamWorkspaceView {
  return {
    workspace: {
      programName: state.workspace.programName,
      scopeLabel: state.workspace.scopeLabel,
      summary: state.workspace.summary,
    },
    channels: state.channels.map(({ id, name, purpose, access, position }) => ({
      id,
      name,
      purpose,
      access,
      position,
    })),
    threads: state.threads.map(({ id, channelId, title, updatedAt, pinned }) => ({
      id,
      channelId,
      title,
      updatedAt,
      pinned,
    })),
    posts: state.posts
      .filter((post) => post.moderationStatus === "visible")
      .map(({ id, threadId, parentPostId, body, authorLabel, createdAt, sample }) => ({
        id,
        threadId,
        parentPostId,
        body,
        authorLabel,
        createdAt,
        sample,
      })),
    meetingOccurrences: state.meetingOccurrences.map(
      ({ id, title, scheduleNote, accessNote, status }) => ({
        id,
        title,
        scheduleNote,
        accessNote,
        status,
      }),
    ),
    actionItems: state.actionItems.map(
      ({ id, title, ownerLabel, dueNote, status }) => ({
        id,
        title,
        ownerLabel,
        dueNote,
        status,
      }),
    ),
    feedback: state.feedback.map(({ id, prompt }) => ({
      id,
      prompt,
      responseCount: state.feedbackResponses.filter(
        (response) => response.feedbackId === id,
      ).length,
    })),
  };
}
