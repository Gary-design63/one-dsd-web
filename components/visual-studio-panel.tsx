"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";

import type { StudioActor, StudioBrief as SceneBrief, StudioProject, StudioStatus } from "@/lib/visual-studio/contract";

type StudioSetting = SceneBrief["setting"];
type StudioSnapshot = { status: StudioStatus; projects: StudioProject[] };
type StudioResponse = { project?: StudioProject; traceId?: string; error?: string; message?: string };

const PRESETS: { name: string; description: string; brief: SceneBrief }[] = [
  {
    name: "Make room for every voice",
    description: "A team meeting about participation.",
    brief: {
      title: "Make room for every voice",
      learningObjective: "Practice inviting input in more than one way and explain how that input will shape a team decision.",
      setting: "meeting",
      dialogue: [
        { participant: "Facilitator", text: "Before we decide, whose perspective are we missing?" },
        { participant: "Colleague", text: "Could we offer time to respond in writing? I need a moment to think." },
        { participant: "Facilitator", text: "Yes. Let us leave the decision open and explain how we will use everyone's input." },
      ],
    },
  },
  {
    name: "Look beyond a first impression",
    description: "An interview focused on evidence.",
    brief: {
      title: "Look beyond a first impression",
      learningObjective: "Practice asking a job-related follow-up question and connecting an assessment to evidence from the response.",
      setting: "interview",
      dialogue: [
        { participant: "Interviewer", text: "Tell me about a time you helped someone work through an unfamiliar process." },
        { participant: "Candidate", text: "I asked what was unclear, walked through the next step, and checked whether my explanation helped." },
        { participant: "Interviewer", text: "What did you learn from their feedback, and what did you change?" },
      ],
    },
  },
  {
    name: "Find a workable next step",
    description: "A service conversation about access.",
    brief: {
      title: "Find a workable next step",
      learningObjective: "Practice asking about a barrier without making assumptions and agreeing on a next step that works for the person.",
      setting: "service",
      dialogue: [
        { participant: "Visitor", text: "I tried the online form, but I could not finish it." },
        { participant: "Staff member", text: "Thank you for telling me. What got in the way, and how would you prefer to work through it?" },
        { participant: "Visitor", text: "Could we look at the questions together before I try again?" },
      ],
    },
  },
];
const SETTING_LABELS: Record<StudioSetting, string> = {
  meeting: "Team meeting",
  interview: "Interview",
  service: "Service conversation",
};
const PREVIEW_DESCRIPTIONS: Record<StudioSetting, string> = {
  meeting: "Three abstract figures in teal, ochre, and plum sit around a round table with notes in a softly lit room.",
  interview: "Three abstract figures sit around a rectangular interview table with notes, with a plant and wood paneling behind them.",
  service: "Three abstract figures sit around a broad rectangular table in a quiet service conversation setting, with notes on the tabletop.",
};
const control = "mt-2 w-full rounded-xl border border-[#bec8ce] bg-white px-3 py-2.5 text-base font-normal text-ink disabled:bg-[#f1f2ef] disabled:text-muted";
const secondaryButton = "inline-flex min-h-11 items-center justify-center rounded-xl border border-[#b8c6ce] bg-white px-4 py-2 text-sm font-bold text-navy no-underline transition-colors hover:bg-[#eef3f6] disabled:cursor-not-allowed disabled:opacity-50";
const primaryButton = "inline-flex min-h-12 items-center justify-center rounded-xl bg-navy px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-navy-deep disabled:cursor-not-allowed disabled:opacity-50";

function copyBrief(brief: SceneBrief): SceneBrief {
  return { ...brief, dialogue: brief.dialogue.map((line) => ({ ...line })) };
}

function assetUrl(project: StudioProject, kind: "preview" | "project" | "receipt") {
  return `/api/consultant/studio/${encodeURIComponent(project.id)}/${kind}`;
}

function StudioMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="5" width="26" height="20" rx="3" />
      <path d="M10 29h12M16 25v4M3 11h26M8 8h1m3 0h1M10 20l6-6 6 6M16 14v8" />
    </svg>
  );
}

function ProjectPreview({ project }: { project: StudioProject }) {
  const [imageFailed, setImageFailed] = useState(false);
  if (!project.previewAvailable || imageFailed) {
    return (
      <div className="flex aspect-video flex-col items-center justify-center gap-3 bg-[#edf0ec] px-6 text-center text-muted">
        <StudioMark className="h-10 w-10" />
        <p className="m-0 max-w-sm text-sm leading-6">
          {imageFailed ? "The preview could not be loaded. Refresh the studio to check the connection." : project.status === "rendering" ? "Blender is building the scene and rendering its preview." : "A rendered preview is not available for this scene."}
        </p>
      </div>
    );
  }
  return (
    <Image
      src={`${assetUrl(project, "preview")}?v=${encodeURIComponent(project.updatedAt)}`}
      alt={PREVIEW_DESCRIPTIONS[project.brief.setting]}
      width={1280}
      height={720}
      unoptimized
      className="aspect-video w-full bg-[#edf0ec] object-contain"
      onError={() => setImageFailed(true)}
    />
  );
}

export function VisualStudioPanel() {
  const [brief, setBrief] = useState<SceneBrief>(() => copyBrief(PRESETS[0].brief));
  const [actor, setActor] = useState<StudioActor>("owner");
  const [snapshot, setSnapshot] = useState<StudioSnapshot | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [previewRevision, setPreviewRevision] = useState(0);
  const [pending, setPending] = useState<"create" | "launch" | "open" | null>(null);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  const refreshSequence = useRef(0);
  const busyAction = useRef(false);
  const resultHeading = useRef<HTMLHeadingElement>(null);

  const refreshStudio = useCallback((signal?: AbortSignal) => {
    const sequence = ++refreshSequence.current;
    return fetch("/api/consultant/studio", { cache: "no-store", signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(response.status === 401 || response.status === 403 ? "Your consultant session is unavailable. Sign in again to use the studio." : "The studio connection could not be checked. Your scene brief is still here.");
        }
        const data: StudioSnapshot = await response.json();
        if (signal?.aborted || sequence !== refreshSequence.current) return;
        setSnapshot(data);
        setSelectedId((current) => data.projects.some((project) => project.id === current) ? current : data.projects[0]?.id ?? null);
        setLoadError("");
      })
      .catch((error: unknown) => {
        if (signal?.aborted || sequence !== refreshSequence.current) return;
        setLoadError(error instanceof Error ? error.message : "The studio connection could not be checked.");
      })
      .finally(() => {
        if (!signal?.aborted && sequence === refreshSequence.current) {
          setLoading(false);
          setRefreshing(false);
        }
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void refreshStudio(controller.signal);
    return () => controller.abort();
  }, [refreshStudio]);

  const rendering = Boolean(snapshot?.projects.some((project) => project.status === "rendering"));
  useEffect(() => {
    if (!rendering || pending) return;
    const controller = new AbortController();
    const timer = window.setInterval(() => void refreshStudio(controller.signal), 4000);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [rendering, pending, refreshStudio]);

  const selected = snapshot?.projects.find((project) => project.id === selectedId);
  const localReady = Boolean(snapshot?.status.available) && !loadError;
  const studioBusy = Boolean(snapshot?.status.busy) || rendering;
  const canCreate = localReady && !studioBusy && !pending;

  async function performAction(action: "create" | "launch" | "open", id?: string) {
    if (busyAction.current) return;
    busyAction.current = true;
    setPending(action);
    setActionError("");
    setNotice("");
    try {
      const response = await fetch("/api/consultant/studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action === "create" ? { action, actor, brief } : { action, ...(id ? { id } : {}) }),
      });
      const data: StudioResponse = await response.json();
      if (data.project) {
        const project = data.project;
        setSnapshot((current) => current ? { ...current, projects: [project, ...current.projects.filter((item) => item.id !== project.id)] } : current);
        setSelectedId(project.id);
      }
      if (!response.ok) {
        throw new Error(data.error || (response.status === 401 || response.status === 403 ? "Your consultant session is unavailable. Sign in again to continue." : "The studio could not complete this request."));
      }
      if (action === "create") {
        if (!data.project) throw new Error("The studio did not return a scene record. Refresh the studio before creating another scene.");
        setNotice(data.project.status === "ready" ? "Your scene is ready. Explore the preview or open the editable project in Blender." : data.project.status === "failed" ? "The scene could not be completed. Its work receipt is available below." : "The scene is rendering. Its status will update here.");
      } else {
        setNotice(action === "open" ? "The scene was sent to Blender on this computer." : "Blender was asked to open on this computer.");
      }
    } catch (error) {
      setActionError(error instanceof TypeError || error instanceof SyntaxError ? "The request ended before completion could be confirmed. Refresh the studio before creating another scene; your brief is still here." : error instanceof Error ? error.message : "The studio could not complete this request. Your brief is still here.");
    } finally {
      setRefreshing(true);
      await refreshStudio();
      setPending(null);
      busyAction.current = false;
      if (action === "create") resultHeading.current?.focus();
    }
  }

  function createScene(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canCreate) return;
    if (!brief.title.trim() || !brief.learningObjective.trim() || brief.dialogue.some((line) => !line.participant.trim() || !line.text.trim())) {
      setActionError("Add a title, learning objective, speaker, and words for every dialogue line before creating the scene.");
      return;
    }
    void performAction("create");
  }

  function updateLine(index: number, key: "participant" | "text", value: string) {
    setBrief((current) => ({ ...current, dialogue: current.dialogue.map((line, lineIndex) => lineIndex === index ? { ...line, [key]: value } : line) }));
  }

  return (
    <div className="space-y-8">
      <section aria-labelledby="studio-connection" className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-[#d4dbd4] bg-[#f2f4ed] p-5 md:px-7">
        <div className="flex max-w-2xl items-start gap-4">
          <span className="hidden rounded-xl bg-white p-3 text-navy sm:block"><StudioMark /></span>
          <div>
            <h2 id="studio-connection" className="text-lg font-bold">
              {loading ? "Checking Blender connection…" : loadError ? "Connection needs attention" : localReady ? "Blender is ready on this computer" : "Local Blender connection unavailable"}
            </h2>
            <p className="mb-0 mt-1 text-sm leading-6 text-muted">
              {loading ? "Looking for your installed editor and saved scenes." : loadError || snapshot?.status.reason}
            </p>
            {snapshot?.status.blenderVersion && !loadError ? <p className="mb-0 mt-1 text-xs text-muted">{snapshot.status.blenderVersion} · Local workspace</p> : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={secondaryButton} onClick={() => { setPreviewRevision((current) => current + 1); setRefreshing(true); void refreshStudio(); }} disabled={loading || refreshing || Boolean(pending)}>{refreshing ? "Checking…" : "Refresh studio"}</button>
          <button type="button" className={secondaryButton} onClick={() => void performAction("launch")} disabled={!localReady || Boolean(pending)}>{pending === "launch" ? "Opening…" : "Open Blender"}</button>
        </div>
      </section>

      <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <section aria-labelledby="scene-brief-heading" className="min-w-0 rounded-2xl border border-[#d7dddf] bg-white p-5 shadow-[0_8px_30px_rgba(0,34,68,0.04)] md:p-7">
          <p className="mb-2 mt-0 text-xs font-bold uppercase tracking-[0.14em] text-muted">01 · Shape the conversation</p>
          <h2 id="scene-brief-heading" className="text-2xl font-bold">Your scene brief</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Choose a setting to create an editable scene with three abstract figures. Your dialogue and learning purpose are saved with the project for you to develop in Blender.</p>
          <form onSubmit={createScene} aria-busy={pending === "create"}>
            <fieldset disabled={pending === "create"} className="m-0 min-w-0 space-y-5 border-0 p-0">
              <div>
                <label htmlFor="studio-starter" className="text-sm font-bold">Conversation starter</label>
                <select id="studio-starter" className={control} defaultValue="" onChange={(event) => {
                  const index = Number(event.target.value);
                  if (event.target.value !== "" && PRESETS[index]) setBrief(copyBrief(PRESETS[index].brief));
                  event.target.value = "";
                }} aria-describedby="studio-starter-help">
                  <option value="">Choose a starter…</option>
                  {PRESETS.map((preset, index) => <option key={preset.name} value={index}>{preset.name}</option>)}
                </select>
                <p id="studio-starter-help" className="mb-0 mt-2 text-xs leading-5 text-muted">Choosing a starter replaces the current brief. These examples use fictional speakers.</p>
              </div>
              <div>
                <label htmlFor="studio-title" className="text-sm font-bold">Scene title</label>
                <input id="studio-title" className={control} required maxLength={120} value={brief.title} onChange={(event) => setBrief({ ...brief, title: event.target.value })} />
              </div>
              <div>
                <label htmlFor="studio-objective" className="text-sm font-bold">What should someone learn or practice?</label>
                <textarea id="studio-objective" className={control} rows={3} required maxLength={1000} value={brief.learningObjective} onChange={(event) => setBrief({ ...brief, learningObjective: event.target.value })} />
              </div>
              <div>
                <label htmlFor="studio-setting" className="text-sm font-bold">Scene setting</label>
                <select id="studio-setting" className={control} value={brief.setting} onChange={(event) => setBrief({ ...brief, setting: event.target.value as StudioSetting })}>
                  {Object.entries(SETTING_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </div>
              <fieldset className="m-0 min-w-0 border-0 p-0">
                <legend className="text-sm font-bold">Dialogue</legend>
                <p className="mb-4 mt-1 text-xs leading-5 text-muted">Shape the conversation in up to six lines. These are editable notes for the scene; the preview is a still image without spoken audio.</p>
                <ol className="m-0 list-none space-y-3 p-0">
                  {brief.dialogue.map((line, index) => (
                    <li key={index} className="rounded-xl border border-[#dde1e2] bg-[#f7f8f6] p-4">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted">Line {index + 1}</span>
                        <button type="button" className="min-h-8 px-2 text-xs font-semibold text-navy underline disabled:opacity-40" aria-label={`Remove dialogue line ${index + 1}`} disabled={brief.dialogue.length <= 1} onClick={() => setBrief({ ...brief, dialogue: brief.dialogue.filter((_, lineIndex) => lineIndex !== index) })}>Remove</button>
                      </div>
                      <label htmlFor={`studio-speaker-${index}`} className="text-sm font-semibold">Speaker</label>
                      <input id={`studio-speaker-${index}`} className={`${control} mb-3`} required maxLength={60} value={line.participant} onChange={(event) => updateLine(index, "participant", event.target.value)} />
                      <label htmlFor={`studio-words-${index}`} className="text-sm font-semibold">What they say</label>
                      <textarea id={`studio-words-${index}`} className={control} rows={2} required maxLength={400} value={line.text} onChange={(event) => updateLine(index, "text", event.target.value)} />
                    </li>
                  ))}
                </ol>
                <button type="button" className={`${secondaryButton} mt-3`} disabled={brief.dialogue.length >= 6} onClick={() => setBrief({ ...brief, dialogue: [...brief.dialogue, { participant: "", text: "" }] })}>Add a dialogue line <span className="ml-2 font-normal">({brief.dialogue.length}/6)</span></button>
              </fieldset>
              <div className="border-t border-[#d7dddf] pt-5">
                <label htmlFor="studio-creator" className="text-sm font-bold">Who will create this scene?</label>
                <select id="studio-creator" className={control} value={actor} onChange={(event) => setActor(event.target.value as StudioActor)}>
                  <option value="owner">You</option>
                  <option value="chief_of_staff">Chief of Staff</option>
                </select>
                <p className="mb-4 mt-2 text-xs leading-5 text-muted">{actor === "chief_of_staff" ? "Your Chief of Staff will create the selected starting scene, save your brief, and record the result." : "Create the selected starting scene, then shape its characters, composition, and action in Blender."}</p>
                <button type="submit" className={`${primaryButton} w-full`} disabled={!canCreate}>
                  {pending === "create" ? "Creating scene and rendering preview…" : actor === "chief_of_staff" ? "Ask Chief of Staff to create" : "Create scene"}
                </button>
                <p className="mb-0 mt-3 text-center text-xs leading-5 text-muted">{pending === "create" ? "Rendering can take about a minute. Keep this page open while Blender works." : studioBusy ? "Blender is already rendering a scene. Refresh to check its progress." : "Creates an editable Blender scene, a still preview, and a work receipt."}</p>
              </div>
            </fieldset>
          </form>
        </section>

        <div className="min-w-0 space-y-6 xl:sticky xl:top-6">
          <section aria-labelledby="studio-result-heading" className="overflow-hidden rounded-2xl border border-[#d7dddf] bg-white shadow-[0_8px_30px_rgba(0,34,68,0.04)]">
            <div className="p-5 md:p-7">
              <p className="mb-2 mt-0 text-xs font-bold uppercase tracking-[0.14em] text-muted">02 · See it take shape</p>
              <h2 id="studio-result-heading" ref={resultHeading} tabIndex={-1} className="text-2xl font-bold">{selected ? selected.title : "Your scene preview"}</h2>
              {selected ? <p className="mb-0 mt-2 text-sm text-muted">{SETTING_LABELS[selected.brief.setting]} · {selected.actor === "chief_of_staff" ? "Created by Chief of Staff" : "Created by you"}</p> : null}
            </div>
            <div role="status" aria-live="polite" aria-atomic="true" className="px-5 md:px-7">
              {notice ? <p className="mb-5 mt-0 rounded-xl bg-[#eef3f6] p-4 text-sm leading-6 text-navy">{notice}</p> : null}
              {pending === "create" ? <p className="mb-5 mt-0 rounded-xl bg-[#fff5e4] p-4 text-sm leading-6 text-[#765016]">Blender is creating your new scene and rendering its preview. {selected ? "The previous scene remains below until the new result is available." : "The completed result will appear here."}</p> : null}
            </div>
            {actionError ? <p role="alert" className="mx-5 mb-5 mt-0 rounded-xl border border-[#e6bfb4] bg-[#fff2ec] p-4 text-sm leading-6 text-[#833c26] md:mx-7">{actionError}</p> : null}
            {selected ? <ProjectPreview key={`${selected.id}-${selected.updatedAt}-${previewRevision}`} project={selected} /> : (
              <div className="flex aspect-video flex-col items-center justify-center gap-4 bg-[#edf0ec] px-7 text-center">
                <span className="rounded-2xl border border-[#cbd5ce] bg-[#f8faf6] p-5 text-[#61766b]"><StudioMark className="h-12 w-12" /></span>
                <div><p className="m-0 text-lg font-bold text-navy">A conversation, made visible</p><p className="mb-0 mt-2 max-w-sm text-sm leading-6 text-muted">Create a scene from your brief to see its rendered preview here.</p></div>
              </div>
            )}
            {selected ? (
              <div className="p-5 md:p-7">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${selected.status === "ready" ? "bg-[#edf3e5] text-[#40542d]" : selected.status === "failed" ? "bg-[#fff0e9] text-[#833c26]" : "bg-[#fff5e4] text-[#765016]"}`}>{selected.status === "ready" ? "Scene ready" : selected.status === "failed" ? "Scene needs attention" : "Rendering"}</span>
                  <time dateTime={selected.createdAt} className="text-xs text-muted">{new Date(selected.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</time>
                </div>
                <p className="my-4 text-sm leading-6 text-muted">{selected.brief.learningObjective}</p>
                {selected.failure ? <p className="mb-4 text-sm leading-6 text-[#833c26]">{selected.failure.message}</p> : null}
                <div className="flex flex-wrap gap-2">
                  <button type="button" className={primaryButton} disabled={!selected.projectAvailable || !localReady || Boolean(pending)} onClick={() => void performAction("open", selected.id)}>{pending === "open" ? "Opening scene…" : "Open scene in Blender"}</button>
                  {selected.projectAvailable ? <a className={secondaryButton} href={assetUrl(selected, "project")} download>Download .blend</a> : null}
                  {selected.previewAvailable ? <a className={secondaryButton} href={assetUrl(selected, "preview")} target="_blank" rel="noreferrer">View full preview<span className="sr-only"> (opens in a new tab)</span></a> : null}
                  <a className={secondaryButton} href={assetUrl(selected, "receipt")} download>Download work receipt</a>
                </div>
                <details className="mt-5 border-t border-[#d7dddf] pt-4">
                  <summary className="cursor-pointer text-sm font-bold text-navy">Read the scene dialogue</summary>
                  <ol className="mb-0 mt-4 space-y-3 pl-5 text-sm leading-6">
                    {selected.brief.dialogue.map((line, index) => <li key={index}><strong>{line.participant}:</strong> {line.text}</li>)}
                  </ol>
                </details>
              </div>
            ) : <p className="m-0 p-5 text-sm leading-6 text-muted md:p-7">The editable project opens in your installed Blender app so you can adjust the scene, lighting, camera, and composition.</p>}
          </section>

          {snapshot?.projects.length ? (
            <section aria-labelledby="studio-projects-heading" className="rounded-2xl border border-[#d7dddf] bg-[#f8f9f6] p-5 md:p-7">
              <h2 id="studio-projects-heading" className="text-lg font-bold">Recent scenes</h2>
              <ul className="mb-0 mt-4 list-none space-y-2 p-0">
                {snapshot.projects.map((project) => <li key={project.id}>
                  <button type="button" aria-pressed={project.id === selectedId} className={`flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left ${project.id === selectedId ? "border-[#7994a4] bg-white" : "border-transparent hover:bg-white"}`} onClick={() => { setSelectedId(project.id); setNotice(""); }}>
                    <span className="min-w-0"><span className="block break-words text-sm font-bold text-navy">{project.title}</span><span className="mt-1 block text-xs text-muted">{project.actor === "chief_of_staff" ? "Chief of Staff" : "You"} · {new Date(project.createdAt).toLocaleDateString()}</span></span>
                    <span className="shrink-0 text-xs text-muted">{project.status === "ready" ? "Ready" : project.status === "failed" ? "Needs attention" : "Rendering"}</span>
                  </button>
                </li>)}
              </ul>
            </section>
          ) : null}
          <p className="m-0 px-2 text-sm leading-6 text-muted">This first connection works with Blender on this computer. Video and publishing are future additions. Scene authoring stays in your consultant workspace.</p>
        </div>
      </div>
    </div>
  );
}
