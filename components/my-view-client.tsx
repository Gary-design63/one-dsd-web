"use client";

import Link from "next/link";
import styles from "@/components/workspace-presentation.module.css";
import { useMemo, useState } from "react";
import { readPracticeNotes } from "@/lib/content/learning-practice";
import { PROGRAM } from "@/lib/constants";
import { GRADUATION_PATHS } from "@/lib/content/paths";
import { useHydrated, useStoredAll, writeStored } from "@/lib/client/storage";
import {
  BROWSER_STORAGE_KEYS,
  clearRegisteredPrivateBrowserData,
  courseNoteIdentity,
} from "@/lib/client/storage-keys";
import type { EditableSurfaceValues } from "@/lib/content/editable-surface-contract";

type Entry = { key: string; label: string; href?: string; detail: string; preview?: string };
export type MyWorkCourse = { id: string; title: string; lessons: { id: string; title: string }[] };
export type MyWorkLearningFocus = { id: string; title: string };
const NO_COURSES: MyWorkCourse[] = [];
const NO_FOCI: MyWorkLearningFocus[] = [];

function copyText(copy: EditableSurfaceValues, key: string): string {
  const value = copy[key];
  return typeof value === "string" ? value : "";
}

export function MyViewClient({ intakeEnabled, copy, courses = NO_COURSES, learningFoci = NO_FOCI }: { intakeEnabled: boolean; copy: EditableSurfaceValues; courses?: MyWorkCourse[]; learningFoci?: MyWorkLearningFocus[] }) {
  const hydrated = useHydrated();
  const all = useStoredAll();
  const [clearNotice, setClearNotice] = useState("");

  const data = useMemo(() => {
    let unreadable = 0;
    const artifacts: Entry[] = [];
    const progress: Entry[] = [];
    const requests: Entry[] = [];
    for (const p of GRADUATION_PATHS) {
      const artifactKey = BROWSER_STORAGE_KEYS.pathArtifact(p.id);
      const progressKey = BROWSER_STORAGE_KEYS.pathProgress(p.id);
      const a = all[`local:${artifactKey}`] as Record<string, string | string[]> | null | undefined;
      if (a) artifacts.push({ key: artifactKey, label: `${p.artifactTitle} (${p.title})`, href: `/practice/${p.id}`, detail: a.work_name ? `${copyText(copy, "forPrefix")}: ${a.work_name}` : copyText(copy, "startedLabel") });
      const pr = all[`local:${progressKey}`] as { complete?: boolean; updatedAt?: string } | null | undefined;
      if (pr) progress.push({ key: progressKey, label: p.title, href: `/practice/${p.id}`, detail: `${pr.complete ? copyText(copy, "completeLabel") : copyText(copy, "inProgressLabel")}${pr.updatedAt ? `, ${copyText(copy, "updatedPrefix")} ${new Date(pr.updatedAt).toLocaleDateString()}` : ""}` });
    }
    for (const [storageId, savedState] of Object.entries(all)) {
      if (!storageId.startsWith("local:")) continue;
      const key = storageId.slice(6);
      const identity = courseNoteIdentity(key);
      if (!identity) continue;
      if (!savedState || typeof savedState !== "object") { unreadable += 1; continue; }
      const state = savedState as { schemaVersion?: unknown; fields?: unknown; completed?: unknown };
      if (state.schemaVersion !== 1 || typeof state.completed !== "boolean" || !state.fields || typeof state.fields !== "object" || Array.isArray(state.fields)) { unreadable += 1; continue; }
      const fields = Object.values(state.fields);
      if (!fields.every(value => typeof value === "string")) { unreadable += 1; continue; }
      const course = courses.find(item => item.id === identity.courseId);
      const lesson = course?.lessons.find(item => item.id === identity.lessonId);
      const href = course && lesson ? "/courses/" + encodeURIComponent(course.id) + "/" + encodeURIComponent(lesson.id) : undefined;
      const label = course && lesson ? lesson.title + " (" + course.title + ")" : "Saved course work";
      const detail = (state.completed ? "Lesson marked complete" : copyText(copy, "inProgressLabel")) + (href ? "" : "; this lesson is not currently available");
      progress.push({ key, label, href, detail });
      if (fields.some(value => value.trim())) artifacts.push({ key, label, href, detail, preview: href ? undefined : fields.filter(value => value.trim()).join("\n\n") });
    }
    const practice = all["local:" + BROWSER_STORAGE_KEYS.learningPracticeNotes];
    if (practice && typeof practice === "object" && "notes" in practice && practice.notes && typeof practice.notes === "object") {
      try {
        const notes = readPracticeNotes(JSON.stringify(practice), Object.keys(practice.notes).filter(id => /^[a-z0-9][a-z0-9-]{0,159}$/.test(id)));
        for (const [id, note] of Object.entries(notes)) {
          const focus = learningFoci.find(item => item.id === id);
          artifacts.push({ key: "learning-note:" + id, label: focus?.title ?? "Saved learning practice", href: focus ? "/learn/intercultural?focus=" + encodeURIComponent(id) + "#practice-notebook" : undefined, detail: note.situation || copyText(copy, "startedLabel"), preview: focus ? undefined : Object.values(note).filter(Boolean).join("\n\n") });
        }
      } catch { unreadable += 1; }
    } else if (Object.hasOwn(all, "local:" + BROWSER_STORAGE_KEYS.learningPracticeNotes)) unreadable += 1;
    const saved = (all[`local:${BROWSER_STORAGE_KEYS.savedConsultationReferences}`] as Array<{ id: string; work_name: string; at: string }> | null | undefined) ?? [];
    const recent = (all[`session:${BROWSER_STORAGE_KEYS.recentConsultationReferences}`] as Array<{ id: string; work_name: string; at: string }> | null | undefined) ?? [];
    for (const x of saved) requests.push({ key: `req:local:${x.id}`, label: `${x.id}: ${x.work_name}`, href: `/support/track?id=${x.id}`, detail: `${copyText(copy, "savedDeviceLabel")}; ${copyText(copy, "submittedPrefix")} ${new Date(x.at).toLocaleDateString()}` });
    for (const x of recent.filter((entry) => !saved.some((item) => item.id === entry.id))) requests.push({ key: `req:session:${x.id}`, label: `${x.id}: ${x.work_name}`, href: `/support/track?id=${x.id}`, detail: `${copyText(copy, "availableTabLabel")}; ${copyText(copy, "submittedPrefix")} ${new Date(x.at).toLocaleDateString()}` });
    const s = all[`session:${BROWSER_STORAGE_KEYS.askSession}`] as { turns?: unknown[] } | null | undefined;
    const askTurns = s?.turns?.length ?? 0;
    return { artifacts, progress, requests, askTurns, unreadable };
  }, [all, copy, courses, learningFoci]);

  function remove(key: string) {
    if (key.startsWith("learning-note:")) {
      const practice = all["local:" + BROWSER_STORAGE_KEYS.learningPracticeNotes] as { version: number; notes: Record<string, unknown> } | undefined;
      if (!practice?.notes) return;
      const notes = { ...practice.notes };
      delete notes[key.slice("learning-note:".length)];
      writeStored("local", BROWSER_STORAGE_KEYS.learningPracticeNotes, Object.keys(notes).length ? { ...practice, notes } : null);
    } else if (key.startsWith("req:")) {
      const [, area, id] = key.split(":");
      const storageArea = area === "session" ? "session" : "local";
      const storageKey = storageArea === "session"
        ? BROWSER_STORAGE_KEYS.recentConsultationReferences
        : BROWSER_STORAGE_KEYS.savedConsultationReferences;
      const list = ((all[`${storageArea}:${storageKey}`] as Array<{ id: string }> | null | undefined) ?? []).filter((x) => x.id !== id);
      writeStored(storageArea, storageKey, list);
    } else {
      const removed = writeStored("local", key, null);
      const path = GRADUATION_PATHS.find(item => BROWSER_STORAGE_KEYS.pathArtifact(item.id) === key);
      if (removed && path) writeStored("local", BROWSER_STORAGE_KEYS.pathArtifactSource(path.id), null);
    }
  }

  function clearAsk() {
    writeStored("session", BROWSER_STORAGE_KEYS.askSession, null);
  }

  function clearEverything() {
    if (!confirm(copyText(copy, "deleteAllConfirmation"))) return;
    const result = clearRegisteredPrivateBrowserData(writeStored);
    setClearNotice(result.ok ? "Your private information has been removed from this computer." : "Some saved information could not be deleted. It may still be on this device. Please try again.");
  }

  if (!hydrated) return <p className="text-muted">{copyText(copy, "openingLabel")}</p>;

  return (
    <div className={styles.notebook}>
      {data.unreadable ? <p role="status">Some saved notes could not be opened. They are still on this device. You can try opening the lesson again or remove the saved information here.</p> : null}
      <Section title={copyText(copy, "notesTitle")} entries={data.artifacts} empty={copyText(copy, "notesEmpty")} onRemove={remove} deleteLabel={copyText(copy, "deleteItemLabel")} />
      <Section title={copyText(copy, "progressTitle")} entries={data.progress} empty={copyText(copy, "progressEmpty")} onRemove={remove} deleteLabel={copyText(copy, "deleteItemLabel")} />
      <Section title={copyText(copy, "requestsTitle")} entries={data.requests} empty={copyText(copy, "requestsEmpty")} onRemove={remove} deleteLabel={copyText(copy, "deleteItemLabel")} />
      <section className={styles.notebookSection}>
        <h2 className="text-xl font-extrabold">{copyText(copy, "askTitle")}</h2>
        <p className="text-sm">{data.askTurns ? `${data.askTurns} ${data.askTurns === 1 ? copyText(copy, "askCountSingular") : copyText(copy, "askCountPlural")}.` : copyText(copy, "askEmpty")}</p>
        {data.askTurns ? (
          <button type="button" className="btn btn--light" onClick={clearAsk}>
            {copyText(copy, "clearAskLabel")}
          </button>
        ) : null}
      </section>
      <section className={styles.deleteNote}>
        <p className="kicker">{copyText(copy, "deletingKicker")}</p>
        <ul className="list-disc pl-6 text-sm">
          <li>{intakeEnabled ? `${copyText(copy, "intakeOpenBeforeRole")} ${PROGRAM.practiceOwnerRole} ${copyText(copy, "intakeOpenAfterRole")}` : `${copyText(copy, "intakePreviewBeforeRole")} ${PROGRAM.practiceOwnerRole}${copyText(copy, "intakePreviewAfterRole")}`}</li>
          <li>{copyText(copy, "deleteReferenceBody")}</li>
        </ul>
        <button type="button" className="btn btn--light mt-2" onClick={clearEverything}>
          {copyText(copy, "deleteAllLabel")}
        </button>
        {clearNotice ? <p role="status">{clearNotice}</p> : null}
      </section>
    </div>
  );
}

function Section({ title, entries, empty, onRemove, deleteLabel }: { title: string; entries: Entry[]; empty: string; onRemove: (k: string) => void; deleteLabel: string }) {
  return (
    <section className={styles.notebookSection}>
      <h2 className="text-xl font-extrabold">{title}</h2>
      {entries.length ? (
        <ul className="list-none space-y-2 p-0">
          {entries.map((e) => (
            <li key={e.key} className="flex flex-wrap items-start justify-between gap-2">
              <div>
                {e.href ? <Link href={e.href}>{e.label}</Link> : e.label}
                <span className="block text-sm text-muted">{e.detail}</span>
                {e.preview ? <details><summary>Read your saved responses</summary><p className="whitespace-pre-wrap">{e.preview}</p></details> : null}
              </div>
              <button type="button" className="btn btn--light" onClick={() => onRemove(e.key)}>
                {deleteLabel}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">{empty}</p>
      )}
    </section>
  );
}
