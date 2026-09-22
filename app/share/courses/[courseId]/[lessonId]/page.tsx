import styles from "../../../../courses/course-design.module.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseLesson } from "@/components/course-lesson";
import { PlainLanguageComparison } from "@/components/multimedia/plain-language-comparison";
import { CriticalIncidentScene } from "@/components/multimedia/critical-incident-scene";
import { LearningCompanion } from "@/components/multimedia/learning-companion";
import { prepareEditableSurface } from "@/components/editable-surface";
import { getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";
import { CoursePackSchema } from "@/lib/content/courses/contract";
import { courseText, sanitizedLesson, lessonObjectives } from "@/lib/content/courses/published";
import { requestedContentScope } from "@/lib/product/request-context";
import { TRAINING_CREDIT_NOTICE } from "@/lib/program/learning-credit";
import type { Metadata } from "next";
import "../../../../courses/courses.css";

export const dynamic = "force-dynamic";

function shareCourseHref(courseId: string, lessonId?: string) {
  return `/share/courses/${encodeURIComponent(courseId)}${lessonId ? `/${encodeURIComponent(lessonId)}` : ""}`;
}

export async function generateMetadata({ params }: { params: Promise<{ courseId: string; lessonId: string }> }): Promise<Metadata> {
  const { courseId, lessonId } = await params;
  if (!getEditableSurfaceDefinition(`course.${courseId}`)) return {};
  const surface = await prepareEditableSurface(`course.${courseId}`, { scope: await requestedContentScope(), includeOwner: false });
  if (!surface.available) return {};
  const { course } = CoursePackSchema.parse(surface.values.pack);
  const lesson = course.lessons.find((item) => item.id === lessonId);
  return lesson ? { title: `${lesson.title} · ${course.title}`, description: courseText(lesson.summary) } : {};
}

/**
 * Opened by a shared link only. Previous/next and the course-overview
 * fallback all stay inside /share/courses so the course stays isolated. The
 * program view (One DHS or One DSD) follows the same request context as
 * every other page, so a link shared from the One DSD view opens the One DSD
 * version here too.
 */
export default async function SharedLessonPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const { courseId, lessonId } = await params;
  if (!getEditableSurfaceDefinition(`course.${courseId}`)) notFound();
  const surface = await prepareEditableSurface(`course.${courseId}`, { scope: await requestedContentScope(), includeOwner: false });
  if (!surface.available) notFound();
  const { course } = CoursePackSchema.parse(surface.values.pack);
  const index = course.lessons.findIndex((lesson) => lesson.id === lessonId);
  if (index < 0) notFound();
  const lesson = course.lessons[index];
  return (
    <div className={`course-page ${styles.page}`}>
      <Link className={styles.breadcrumb} href={shareCourseHref(courseId)}>← {course.title}</Link>
      <div className={styles.lessonLayout}>
        <div className={styles.lessonMain}>
          <CourseLesson
            key={`${courseId}:${lessonId}`}
            courseId={courseId}
            courseOverviewHref={shareCourseHref(courseId)}
            companion={
              <>
                <LearningCompanion courseId={courseId} lessonId={lessonId} />
                {courseId === "plain-language-in-human-services" && lessonId === "pl-how" ? <PlainLanguageComparison /> : courseId === "critical-incidents-in-the-work" && lessonId === "ci-write" ? <CriticalIncidentScene /> : null}
              </>
            }
            lesson={sanitizedLesson(lesson)}
            objectives={lessonObjectives(lesson)}
            previous={index > 0 ? shareCourseHref(courseId, course.lessons[index - 1].id) : undefined}
            next={index < course.lessons.length - 1 ? shareCourseHref(courseId, course.lessons[index + 1].id) : undefined}
          />
          <p className={styles.credit}>{TRAINING_CREDIT_NOTICE}</p>
        </div>
        <nav className={styles.outline} aria-label="Course lessons">
          <h2>Explore this course</h2>
          <ol>
            {course.lessons.map((item) => (
              <li key={item.id}><Link href={shareCourseHref(courseId, item.id)} aria-current={item.id === lessonId ? "page" : undefined}>{item.title}</Link></li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}
