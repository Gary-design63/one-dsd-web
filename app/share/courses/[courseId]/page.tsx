import Image from "next/image";
import styles from "../../../courses/course-design.module.css";
import { notFound } from "next/navigation";
import { prepareEditableSurface } from "@/components/editable-surface";
import { CoursePackSchema } from "@/lib/content/courses/contract";
import { courseLink, courseSummary } from "@/lib/content/courses/published";
import { getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";
import { requestedContentScope } from "@/lib/product/request-context";
import { SourceState, registerSourceFor } from "@/components/source-evidence";
import { TRAINING_CREDIT_NOTICE } from "@/lib/program/learning-credit";
import type { Metadata } from "next";
import "../../../courses/courses.css";

export const dynamic = "force-dynamic";

function shareCourseHref(courseId: string, lessonId?: string) {
  return `/share/courses/${encodeURIComponent(courseId)}${lessonId ? `/${encodeURIComponent(lessonId)}` : ""}`;
}

export async function generateMetadata({ params }: { params: Promise<{ courseId: string }> }): Promise<Metadata> {
  const { courseId } = await params;
  if (!getEditableSurfaceDefinition(`course.${courseId}`)) return {};
  const surface = await prepareEditableSurface(`course.${courseId}`, { scope: await requestedContentScope(), includeOwner: false });
  if (!surface.available) return {};
  const pack = CoursePackSchema.parse(surface.values.pack);
  return { title: pack.course.title, description: courseSummary(pack) };
}

/**
 * Opened by a shared link only. It shows one course on its own, with no
 * navigation into the rest of the program — see /courses/[courseId] for the
 * same course inside the full staff experience. Lesson links stay inside
 * /share/courses so the whole course (and only this course) stays isolated.
 * The program view (One DHS or One DSD) follows the same request context as
 * every other page, so a link shared from the One DSD view opens the One DSD
 * version here too.
 */
export default async function SharedCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  if (!getEditableSurfaceDefinition(`course.${courseId}`)) notFound();
  const surface = await prepareEditableSurface(`course.${courseId}`, { scope: await requestedContentScope(), includeOwner: false });
  if (!surface.available) notFound();
  const pack = CoursePackSchema.parse(surface.values.pack);
  const course = pack.course;
  return (
    <div className={`course-page ${styles.page}`}>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>{course.seriesLabel}</p>
          <h1>{course.title}</h1>
          <p className={styles.description}>{courseSummary(pack)}</p>
          <p className={styles.duration}>{course.duration} · {course.lessons.length} lessons</p>
          <p className="text-sm text-muted mt-2">You&rsquo;re viewing a shared link to this course only. It doesn&rsquo;t include the rest of the program.</p>
        </div>
        <div className={styles.cover}>
          <Image src={course.coverImage} alt={course.coverAlt} fill sizes="(max-width: 700px) 90vw, 480px" style={{ objectFit: "contain" }} unoptimized />
        </div>
      </header>
      <nav className={styles.sectionNav} aria-label="In this course">
        <a href="#lessons">Lessons</a>
        <a href="#job-aid">{pack.jobAid.title}</a>
        <a href="#sources">Sources and further reading</a>
      </nav>
      {course.introAudio ? (
        <section>
          <h2>Listen to the introduction</h2>
          <audio controls preload="none" src={course.introAudio}>This recording cannot play here. Use the transcript below.</audio>
          {course.introTranscript ? <details><summary>Read the introduction</summary><p>{course.introTranscript}</p></details> : null}
        </section>
      ) : course.introTranscript ? <p>{course.introTranscript}</p> : null}
      {course.learning ? (
        <section className={styles.outcomes}>
          <h2>What you&rsquo;ll be able to do</h2>
          <div><h3>Explore and practice</h3><ul>{course.learning.objectives.map((item, i) => <li key={i}>{item}</li>)}</ul></div>
          <div><h3>What you can take into your work</h3><ul>{course.learning.evidence.map((item, i) => <li key={i}>{item}</li>)}</ul></div>
          <p>{course.learning.appliedNextStep}</p>
        </section>
      ) : null}
      <section id="lessons">
        <h2>Explore the lessons</h2>
        <ol className={styles.lessons}>
          {course.lessons.map((lesson, i) => (
            <li key={lesson.id}>
              <span className={styles.lessonNumber} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3><a href={shareCourseHref(course.id, lesson.id)}>{lesson.title}</a></h3>
                <p>{lesson.summary}</p>
              </div>
              <span className={styles.lessonTime}>{lesson.minutes} minutes</span>
            </li>
          ))}
        </ol>
      </section>
      <section id="job-aid" className={styles.jobAid}>
        <h2>{pack.jobAid.title}</h2>
        <p>{pack.jobAid.subtitle}</p>
        {pack.jobAid.quote ? <blockquote>{pack.jobAid.quote}</blockquote> : null}
        {pack.jobAid.use ? (
          <>
            <p>{pack.jobAid.use.purpose}</p>
            <ul>{pack.jobAid.use.remember.map((item, i) => <li key={i}>{item}</li>)}</ul>
            <p>{pack.jobAid.use.doNext}</p>
          </>
        ) : null}
        <div className={styles.jobSections}>
          {pack.jobAid.sections.map((section, i) => (
            <div key={i}><h3>{section.heading}</h3><ul>{section.items.map((item, n) => <li key={n}>{item}</li>)}</ul></div>
          ))}
        </div>
      </section>
      <p className={styles.credit}>{TRAINING_CREDIT_NOTICE}</p>
      <section id="sources" className={styles.sources}>
        <h2>Sources and further reading</h2>
        <ul>
          {pack.sources.map((source, i) => (
            <li id={`source-${i + 1}`} key={i}>
              {courseLink(source.href) ? <a href={courseLink(source.href)}>{source.title}</a> : <span>{source.title}</span>}
              <p>{source.note}</p>
              <p className="source-state-line"><SourceState source={registerSourceFor(source)} /></p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
