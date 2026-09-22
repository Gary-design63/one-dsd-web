"use client";

import { useMemo, useState } from "react";
import type { OneDsdTeamMutation } from "@/lib/collaboration/schema";
import type {
  OneDsdActionView,
  OneDsdMeetingView,
  OneDsdPostView,
  OneDsdTeamWorkspaceView,
} from "@/lib/collaboration/view";

const MEETING_STATUS_LABEL: Record<OneDsdMeetingView["status"], string> = {
  planning: "Planning",
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
};

const ACTION_STATUS_LABEL: Record<OneDsdActionView["status"], string> = {
  planned: "Planned",
  in_progress: "In progress",
  blocked: "Blocked",
  complete: "Complete",
};

function key(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function OneDsdTeamClient({
  initialState,
  microsoftConnection,
}: {
  initialState: OneDsdTeamWorkspaceView;
  microsoftConnection: "off";
}) {
  const [state, setState] = useState(initialState);
  const [channelId, setChannelId] = useState(initialState.channels[0]?.id ?? "");
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingSummary, setEditingSummary] = useState(false);
  const [summaryDraft, setSummaryDraft] = useState(initialState.workspace.summary);
  const [editingChannel, setEditingChannel] = useState(false);
  const [channelDraft, setChannelDraft] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [postDraft, setPostDraft] = useState("");
  const [editingMeeting, setEditingMeeting] = useState<string | null>(null);
  const [meetingDraft, setMeetingDraft] = useState<OneDsdMeetingView | null>(null);
  const [editingAction, setEditingAction] = useState<string | null>(null);
  const [actionDraft, setActionDraft] = useState<OneDsdActionView | null>(null);
  const [feedbackDraft, setFeedbackDraft] = useState("");

  const channel = state.channels.find((item) => item.id === channelId) ?? state.channels[0];
  const threads = useMemo(
    () =>
      state.threads
        .filter((thread) => thread.channelId === channel?.id)
        .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt.localeCompare(a.updatedAt)),
    [channel?.id, state.threads],
  );

  async function save(mutation: OneDsdTeamMutation, label: string): Promise<boolean> {
    setBusy(label);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/one-dsd/team", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(mutation),
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(typeof payload.error === "string" ? payload.error : "We couldn't save that change. Please try again.");
        return false;
      }
      setState(payload.workspace as OneDsdTeamWorkspaceView);
      setMessage(`${label} saved.`);
      return true;
    } catch {
      setError("We couldn't save that change. Please try again.");
      return false;
    } finally {
      setBusy("");
    }
  }

  async function createThread(event: React.FormEvent) {
    event.preventDefault();
    if (!channel || !newTitle.trim() || !newBody.trim()) return;
    if (
      await save(
        {
          action: "create_thread",
          channelId: channel.id,
          title: newTitle.trim(),
          body: newBody.trim(),
          idempotencyKey: key("thread"),
        },
        "Discussion",
      )
    ) {
      setNewTitle("");
      setNewBody("");
    }
  }

  return (
    <div className="wrap py-8">
      <div className="grid gap-3 lg:grid-cols-2">
        <p className="notice m-0">
          <strong>This is a place for the One DSD Team to learn and practice together. </strong>
          The committee can use what it learns here to shape how the team works. Until the committee agrees to use this space for official work, keep official committee records in the place the team has approved.
        </p>
        <p className="notice m-0">
          <strong>{microsoftConnection === "off" ? "This space is separate from Microsoft Teams. " : ""}</strong>
          It does not read, send, or change anything in Microsoft Teams. It is also separate from Minnesota Department of Human Services, Aging and Disability Services Administration, and Disability Services Division services and records.
        </p>
      </div>

      <section className="card mt-6" aria-labelledby="workspace-summary">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-3xl">
            <p className="kicker">Purpose</p>
            <h2 id="workspace-summary" className="text-2xl font-extrabold">{state.workspace.programName}</h2>
          </div>
          {!editingSummary ? (
            <button
              type="button"
              className="btn btn--light"
              onClick={() => {
                setSummaryDraft(state.workspace.summary);
                setEditingSummary(true);
              }}
            >
              Edit purpose
            </button>
          ) : null}
        </div>
        {editingSummary ? (
          <div className="field mt-4">
            <label htmlFor="workspace-summary-edit">Purpose</label>
            <textarea id="workspace-summary-edit" value={summaryDraft} onChange={(event) => setSummaryDraft(event.target.value)} />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn--primary"
                disabled={Boolean(busy)}
                onClick={async () => {
                  if (await save({ action: "update_workspace_summary", summary: summaryDraft }, "Purpose")) setEditingSummary(false);
                }}
              >
                Save purpose
              </button>
              <button type="button" className="btn btn--light" onClick={() => setEditingSummary(false)} disabled={Boolean(busy)}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-3 whitespace-pre-wrap">{state.workspace.summary}</p>
        )}
        <p className="m-0 text-sm text-muted">Covers: {state.workspace.scopeLabel}.</p>
      </section>

      {message ? <p className="notice mt-4" role="status">{message}</p> : null}
      {error ? <p className="notice notice--stop mt-4" role="alert">{error}</p> : null}

      <div className="collaboration-layout mt-6">
        <nav className="panel" aria-label="One DSD Team discussion areas">
          <p className="kicker">Discussion areas</p>
          <ul className="m-0 list-none space-y-1 p-0">
            {state.channels
              .slice()
              .sort((a, b) => a.position - b.position)
              .map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`channel-button ${item.id === channel?.id ? "channel-button--active" : ""}`}
                    aria-current={item.id === channel?.id ? "page" : undefined}
                    onClick={() => {
                      setChannelId(item.id);
                      setEditingChannel(false);
                    }}
                  >
                    {item.name}
                    {item.access === "private" ? <span>Restricted team area</span> : null}
                  </button>
                </li>
              ))}
          </ul>
        </nav>

        <div className="min-w-0">
          {channel ? (
            <>
              <section className="panel" aria-labelledby="channel-title">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="kicker">Discussion area</p>
                    <h2 id="channel-title" className="text-2xl font-extrabold">{channel.name}</h2>
                  </div>
                  {!editingChannel ? (
                    <button
                      type="button"
                      className="btn btn--light"
                      onClick={() => {
                        setChannelDraft(channel.purpose);
                        setEditingChannel(true);
                      }}
                    >
                      Edit description
                    </button>
                  ) : null}
                </div>
                {editingChannel ? (
                  <div className="field mt-3">
                    <label htmlFor="channel-purpose">About this discussion area</label>
                    <textarea id="channel-purpose" value={channelDraft} onChange={(event) => setChannelDraft(event.target.value)} />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn btn--primary"
                        disabled={Boolean(busy)}
                        onClick={async () => {
                          if (await save({ action: "update_channel", channelId: channel.id, purpose: channelDraft }, "Discussion area description")) setEditingChannel(false);
                        }}
                      >
                        Save description
                      </button>
                      <button type="button" className="btn btn--light" onClick={() => setEditingChannel(false)} disabled={Boolean(busy)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 whitespace-pre-wrap">{channel.purpose}</p>
                )}
              </section>

              <form className="card mt-4" onSubmit={createThread}>
                <h3 className="text-xl font-bold">Start a discussion</h3>
                <p className="text-sm text-muted">Please keep the discussion general and leave out names or details that could identify someone.</p>
                <div className="field">
                  <label htmlFor="discussion-title">Title</label>
                  <input id="discussion-title" type="text" maxLength={240} value={newTitle} onChange={(event) => setNewTitle(event.target.value)} required />
                </div>
                <div className="field">
                  <label htmlFor="discussion-body">Opening message</label>
                  <textarea id="discussion-body" maxLength={4000} value={newBody} onChange={(event) => setNewBody(event.target.value)} required />
                </div>
                <button type="submit" className="btn btn--primary" disabled={Boolean(busy)}>
                  {busy === "Discussion" ? "Adding discussion..." : "Start discussion"}
                </button>
              </form>

              <section className="mt-6" aria-labelledby="discussions-title">
                <h3 id="discussions-title" className="text-xl font-extrabold">Discussions</h3>
                {threads.length ? (
                  <div className="mt-3 space-y-4">
                    {threads.map((thread) => {
                      const posts = state.posts
                        .filter((post) => post.threadId === thread.id)
                        .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
                      return (
                        <article key={thread.id} className="card">
                          <p className="kicker">{thread.pinned ? "Featured discussion" : "Discussion"}</p>
                          <h4 className="text-lg font-bold">{thread.title}</h4>
                          <div className="mt-3 space-y-3">
                            {posts.map((post) => (
                              <PostView
                                key={post.id}
                                post={post}
                                editing={editingPost === post.id}
                                draft={postDraft}
                                disabled={Boolean(busy)}
                                onEdit={() => {
                                  setEditingPost(post.id);
                                  setPostDraft(post.body);
                                }}
                                onDraft={setPostDraft}
                                onCancel={() => setEditingPost(null)}
                                onSave={async () => {
                                  if (await save({ action: "edit_post", postId: post.id, body: postDraft }, "Post")) setEditingPost(null);
                                }}
                              />
                            ))}
                          </div>
                          <form
                            className="mt-4 border-t border-line pt-3"
                            onSubmit={async (event) => {
                              event.preventDefault();
                              const body = (replyDrafts[thread.id] ?? "").trim();
                              if (!body) return;
                              if (await save({ action: "reply", threadId: thread.id, body, idempotencyKey: key("reply") }, "Reply")) {
                                setReplyDrafts((current) => ({ ...current, [thread.id]: "" }));
                              }
                            }}
                          >
                            <div className="field">
                              <label htmlFor={`reply-${thread.id}`}>Your reply</label>
                              <textarea
                                id={`reply-${thread.id}`}
                                value={replyDrafts[thread.id] ?? ""}
                                maxLength={4000}
                                onChange={(event) => setReplyDrafts((current) => ({ ...current, [thread.id]: event.target.value }))}
                                required
                              />
                            </div>
                            <button type="submit" className="btn btn--light" disabled={Boolean(busy)}>Add reply</button>
                          </form>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted">No discussions have been started here yet.</p>
                )}
              </section>
            </>
          ) : null}
        </div>

        <aside className="space-y-4">
          <section className="panel" aria-labelledby="meetings-title">
            <p className="kicker">Coming up</p>
            <h2 id="meetings-title" className="text-xl font-extrabold">Meetings and Open Hours</h2>
            <div className="mt-3 space-y-4">
              {state.meetingOccurrences.map((meeting) => (
                <MeetingView
                  key={meeting.id}
                  meeting={meeting}
                  editing={editingMeeting === meeting.id}
                  draft={editingMeeting === meeting.id ? meetingDraft : null}
                  disabled={Boolean(busy)}
                  onEdit={() => {
                    setEditingMeeting(meeting.id);
                    setMeetingDraft({ ...meeting });
                  }}
                  onDraft={setMeetingDraft}
                  onCancel={() => setEditingMeeting(null)}
                  onSave={async () => {
                    if (!meetingDraft) return;
                    if (
                      await save(
                        {
                          action: "update_meeting",
                          occurrenceId: meeting.id,
                          title: meetingDraft.title,
                          scheduleNote: meetingDraft.scheduleNote,
                          accessNote: meetingDraft.accessNote,
                          status: meetingDraft.status,
                        },
                        "Meeting",
                      )
                    ) setEditingMeeting(null);
                  }}
                />
              ))}
            </div>
          </section>

          <section className="panel" aria-labelledby="actions-title">
            <p className="kicker">Follow-through</p>
            <h2 id="actions-title" className="text-xl font-extrabold">Action items</h2>
            <div className="mt-3 space-y-4">
              {state.actionItems.map((item) => (
                <ActionView
                  key={item.id}
                  item={item}
                  editing={editingAction === item.id}
                  draft={editingAction === item.id ? actionDraft : null}
                  disabled={Boolean(busy)}
                  onEdit={() => {
                    setEditingAction(item.id);
                    setActionDraft({ ...item });
                  }}
                  onDraft={setActionDraft}
                  onCancel={() => setEditingAction(null)}
                  onSave={async () => {
                    if (!actionDraft) return;
                    if (
                      await save(
                        {
                          action: "update_action",
                          actionItemId: item.id,
                          title: actionDraft.title,
                          ownerLabel: actionDraft.ownerLabel,
                          dueNote: actionDraft.dueNote,
                          status: actionDraft.status,
                        },
                        "Action item",
                      )
                    ) setEditingAction(null);
                  }}
                />
              ))}
            </div>
          </section>

          {state.feedback.map((item) => (
            <form
              key={item.id}
              className="panel"
              onSubmit={async (event) => {
                event.preventDefault();
                if (!feedbackDraft.trim()) return;
                if (await save({ action: "submit_feedback", feedbackId: item.id, response: feedbackDraft.trim(), idempotencyKey: key("feedback") }, "Feedback")) setFeedbackDraft("");
              }}
            >
              <p className="kicker">Feedback</p>
              <h2 className="text-lg font-bold">{item.prompt}</h2>
              <div className="field mt-3">
                <label htmlFor={`feedback-${item.id}`}>Your response</label>
                <textarea id={`feedback-${item.id}`} value={feedbackDraft} onChange={(event) => setFeedbackDraft(event.target.value)} maxLength={4000} required />
              </div>
              <button type="submit" className="btn btn--light" disabled={Boolean(busy)}>Share feedback</button>
              <p className="mt-2 text-sm text-muted">Responses so far: {item.responseCount}</p>
            </form>
          ))}
        </aside>
      </div>
    </div>
  );
}

function PostView({
  post,
  editing,
  draft,
  disabled,
  onEdit,
  onDraft,
  onCancel,
  onSave,
}: {
  post: OneDsdPostView;
  editing: boolean;
  draft: string;
  disabled: boolean;
  onEdit: () => void;
  onDraft: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className={`discussion-post ${post.parentPostId ? "discussion-post--reply" : ""}`}>
      <p className="m-0 text-sm font-bold">{post.authorLabel}{post.sample ? ", practice example" : ""}</p>
      {editing ? (
        <div className="field mt-2">
          <label htmlFor={`post-${post.id}`}>Discussion text</label>
          <textarea id={`post-${post.id}`} value={draft} onChange={(event) => onDraft(event.target.value)} maxLength={4000} />
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn--primary" onClick={onSave} disabled={disabled}>Save changes</button>
            <button type="button" className="btn btn--light" onClick={onCancel} disabled={disabled}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <p className="my-2 whitespace-pre-wrap">{post.body}</p>
          <button type="button" className="text-button" onClick={onEdit}>Edit post</button>
        </>
      )}
    </div>
  );
}

function MeetingView({
  meeting,
  editing,
  draft,
  disabled,
  onEdit,
  onDraft,
  onCancel,
  onSave,
}: {
  meeting: OneDsdMeetingView;
  editing: boolean;
  draft: OneDsdMeetingView | null;
  disabled: boolean;
  onEdit: () => void;
  onDraft: (value: OneDsdMeetingView) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  if (editing && draft) {
    return (
      <div className="border-t border-line pt-3 first:border-0 first:pt-0">
        <div className="field"><label htmlFor={`meeting-title-${meeting.id}`}>Title</label><input id={`meeting-title-${meeting.id}`} type="text" value={draft.title} onChange={(event) => onDraft({ ...draft, title: event.target.value })} /></div>
        <div className="field"><label htmlFor={`meeting-time-${meeting.id}`}>Schedule</label><input id={`meeting-time-${meeting.id}`} type="text" value={draft.scheduleNote} onChange={(event) => onDraft({ ...draft, scheduleNote: event.target.value })} /></div>
        <div className="field"><label htmlFor={`meeting-access-${meeting.id}`}>Access information</label><textarea id={`meeting-access-${meeting.id}`} value={draft.accessNote} onChange={(event) => onDraft({ ...draft, accessNote: event.target.value })} /></div>
        <div className="field"><label htmlFor={`meeting-status-${meeting.id}`}>Status</label><select id={`meeting-status-${meeting.id}`} value={draft.status} onChange={(event) => onDraft({ ...draft, status: event.target.value as OneDsdMeetingView["status"] })}><option value="planning">Planning</option><option value="scheduled">Scheduled</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div>
        <div className="flex flex-wrap gap-2"><button type="button" className="btn btn--primary" onClick={onSave} disabled={disabled}>Save meeting</button><button type="button" className="btn btn--light" onClick={onCancel} disabled={disabled}>Cancel</button></div>
      </div>
    );
  }
  return (
    <div className="border-t border-line pt-3 first:border-0 first:pt-0">
      <p className="m-0 font-bold">{meeting.title}</p>
      <p className="m-0 text-sm">{meeting.scheduleNote}. {MEETING_STATUS_LABEL[meeting.status]}</p>
      <p className="mt-1 text-sm text-muted">{meeting.accessNote}</p>
      <button type="button" className="text-button" onClick={onEdit}>Edit meeting</button>
    </div>
  );
}

function ActionView({
  item,
  editing,
  draft,
  disabled,
  onEdit,
  onDraft,
  onCancel,
  onSave,
}: {
  item: OneDsdActionView;
  editing: boolean;
  draft: OneDsdActionView | null;
  disabled: boolean;
  onEdit: () => void;
  onDraft: (value: OneDsdActionView) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  if (editing && draft) {
    return (
      <div className="border-t border-line pt-3 first:border-0 first:pt-0">
        <div className="field"><label htmlFor={`action-title-${item.id}`}>Action</label><input id={`action-title-${item.id}`} type="text" value={draft.title} onChange={(event) => onDraft({ ...draft, title: event.target.value })} /></div>
        <div className="field"><label htmlFor={`action-owner-${item.id}`}>Owner</label><input id={`action-owner-${item.id}`} type="text" value={draft.ownerLabel} onChange={(event) => onDraft({ ...draft, ownerLabel: event.target.value })} /></div>
        <div className="field"><label htmlFor={`action-due-${item.id}`}>Due</label><input id={`action-due-${item.id}`} type="text" value={draft.dueNote} onChange={(event) => onDraft({ ...draft, dueNote: event.target.value })} /></div>
        <div className="field"><label htmlFor={`action-status-${item.id}`}>Status</label><select id={`action-status-${item.id}`} value={draft.status} onChange={(event) => onDraft({ ...draft, status: event.target.value as OneDsdActionView["status"] })}><option value="planned">Planned</option><option value="in_progress">In progress</option><option value="blocked">Blocked</option><option value="complete">Complete</option></select></div>
        <div className="flex flex-wrap gap-2"><button type="button" className="btn btn--primary" onClick={onSave} disabled={disabled}>Save action</button><button type="button" className="btn btn--light" onClick={onCancel} disabled={disabled}>Cancel</button></div>
      </div>
    );
  }
  return (
    <div className="border-t border-line pt-3 first:border-0 first:pt-0">
      <p className="m-0 font-bold">{item.title}</p>
      <p className="m-0 text-sm">{item.ownerLabel}. {item.dueNote}</p>
      <p className="m-0 text-sm text-muted">Status: {ACTION_STATUS_LABEL[item.status]}</p>
      <button type="button" className="text-button" onClick={onEdit}>Edit action item</button>
    </div>
  );
}
