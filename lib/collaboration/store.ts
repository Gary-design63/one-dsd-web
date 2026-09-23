import { randomUUID } from "node:crypto";
import { getStore } from "@/lib/intelligence/memory/store";
import { ONE_DSD_TEAM_SEED } from "./seed";
import {
  inspectCollaborationText,
  OneDsdTeamMutationSchema,
  type OneDsdTeamMutation,
  type OneDsdTeamWorkspaceState,
} from "./schema";

const WORKSPACE_ID = "one_dsd_team";
let writeChain: Promise<unknown> = Promise.resolve();

export class CollaborationMutationError extends Error {
  constructor(
    public readonly code: "not_found" | "unsafe_content" | "invalid_state",
    message: string,
  ) {
    super(message);
  }
}

function cloneSeed(): OneDsdTeamWorkspaceState {
  return structuredClone(ONE_DSD_TEAM_SEED);
}

export async function readOneDsdTeamWorkspace(): Promise<OneDsdTeamWorkspaceState> {
  return (await getStore().get<OneDsdTeamWorkspaceState>("collaboration_workspace", WORKSPACE_ID)) ?? cloneSeed();
}

function safeText(...values: string[]): void {
  for (const value of values) {
    const finding = inspectCollaborationText(value);
    if (finding) {
      throw new CollaborationMutationError(
        "unsafe_content",
        finding.message,
      );
    }
  }
}

function idempotent(state: OneDsdTeamWorkspaceState, key?: string): boolean {
  return Boolean(key && state.processedKeys.includes(key));
}

function recordKey(state: OneDsdTeamWorkspaceState, key?: string): void {
  if (!key) return;
  state.processedKeys = [...state.processedKeys, key].slice(-250);
}

function touch(state: OneDsdTeamWorkspaceState, at: string): void {
  state.revision += 1;
  state.workspace.updatedAt = at;
}

async function persist(state: OneDsdTeamWorkspaceState, action: OneDsdTeamMutation["action"]): Promise<void> {
  const store = getStore();
  await store.put("collaboration_workspace", WORKSPACE_ID, state);
  await store.appendAudit({
    trace_id: randomUUID(),
    span_id: randomUUID().slice(0, 8),
    at: new Date().toISOString(),
    agent_id: "system",
    agent_version: "collaboration-owner-v1",
    tool_name: `collaboration.${action}`,
    autonomy_level_used: "A0",
    permission_mode: "owner_only",
    dry_run: false,
    content_ids_touched: [WORKSPACE_ID],
    allowlist_hit: true,
    human_disposition: "edit",
    ok: true,
    latency_ms: 0,
  });
}

async function mutateUnlocked(mutation: OneDsdTeamMutation): Promise<OneDsdTeamWorkspaceState> {
  const state = await readOneDsdTeamWorkspace();
  if ("idempotencyKey" in mutation && idempotent(state, mutation.idempotencyKey)) return state;
  const at = new Date().toISOString();

  switch (mutation.action) {
    case "update_workspace_summary": {
      safeText(mutation.summary);
      state.workspace.summary = mutation.summary;
      state.workspace.sample = false;
      break;
    }
    case "update_channel": {
      safeText(mutation.purpose);
      const channel = state.channels.find((item) => item.id === mutation.channelId);
      if (!channel) throw new CollaborationMutationError("not_found", "That channel was not found.");
      channel.purpose = mutation.purpose;
      channel.sample = false;
      channel.updatedAt = at;
      break;
    }
    case "create_thread": {
      safeText(mutation.title, mutation.body);
      if (!state.channels.some((item) => item.id === mutation.channelId)) {
        throw new CollaborationMutationError("not_found", "That channel was not found.");
      }
      const threadId = `thread_${randomUUID()}`;
      state.threads.push({
        id: threadId,
        channelId: mutation.channelId,
        title: mutation.title,
        createdByLabel: "Program steward",
        createdAt: at,
        updatedAt: at,
        pinned: false,
        sample: false,
      });
      state.posts.push({
        id: `post_${randomUUID()}`,
        threadId,
        parentPostId: null,
        body: mutation.body,
        authorLabel: "Program steward",
        createdAt: at,
        updatedAt: at,
        moderationStatus: "visible",
        sample: false,
      });
      recordKey(state, mutation.idempotencyKey);
      break;
    }
    case "reply": {
      safeText(mutation.body);
      const thread = state.threads.find((item) => item.id === mutation.threadId);
      if (!thread) throw new CollaborationMutationError("not_found", "That discussion was not found.");
      const root = state.posts.find((item) => item.threadId === thread.id && item.parentPostId === null);
      state.posts.push({
        id: `post_${randomUUID()}`,
        threadId: thread.id,
        parentPostId: root?.id ?? null,
        body: mutation.body,
        authorLabel: "Program steward",
        createdAt: at,
        updatedAt: at,
        moderationStatus: "visible",
        sample: false,
      });
      thread.updatedAt = at;
      recordKey(state, mutation.idempotencyKey);
      break;
    }
    case "edit_post": {
      safeText(mutation.body);
      const post = state.posts.find((item) => item.id === mutation.postId);
      if (!post) throw new CollaborationMutationError("not_found", "That post was not found.");
      post.body = mutation.body;
      post.sample = false;
      post.updatedAt = at;
      break;
    }
    case "update_meeting": {
      safeText(mutation.title, mutation.scheduleNote, mutation.accessNote);
      const occurrence = state.meetingOccurrences.find((item) => item.id === mutation.occurrenceId);
      if (!occurrence) throw new CollaborationMutationError("not_found", "That meeting was not found.");
      Object.assign(occurrence, {
        title: mutation.title,
        scheduleNote: mutation.scheduleNote,
        accessNote: mutation.accessNote,
        status: mutation.status,
        sample: false,
        updatedAt: at,
      });
      break;
    }
    case "update_action": {
      safeText(mutation.title, mutation.ownerLabel, mutation.dueNote);
      const item = state.actionItems.find((entry) => entry.id === mutation.actionItemId);
      if (!item) throw new CollaborationMutationError("not_found", "That action item was not found.");
      Object.assign(item, {
        title: mutation.title,
        ownerLabel: mutation.ownerLabel,
        dueNote: mutation.dueNote,
        status: mutation.status,
        sample: false,
        updatedAt: at,
      });
      break;
    }
    case "submit_feedback": {
      safeText(mutation.response);
      if (!state.feedback.some((item) => item.id === mutation.feedbackId && item.status === "open")) {
        throw new CollaborationMutationError("not_found", "That feedback question is not open.");
      }
      state.feedbackResponses.push({
        id: `feedback_response_${randomUUID()}`,
        feedbackId: mutation.feedbackId,
        authorLabel: "Program steward",
        response: mutation.response,
        createdAt: at,
        sample: false,
      });
      recordKey(state, mutation.idempotencyKey);
      break;
    }
    default:
      throw new CollaborationMutationError("invalid_state", "That change is not supported.");
  }

  touch(state, at);
  await persist(state, mutation.action);
  return state;
}

export function applyOneDsdTeamMutation(mutation: OneDsdTeamMutation): Promise<OneDsdTeamWorkspaceState> {
  const parsed = OneDsdTeamMutationSchema.safeParse(mutation);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Check the change and try again.";
    return Promise.reject(new CollaborationMutationError("unsafe_content", message));
  }
  const next = writeChain.then(() => mutateUnlocked(parsed.data));
  writeChain = next.catch(() => undefined);
  return next;
}
