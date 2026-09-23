import styles from "../../course-design.module.css";
import { LearningJourneyLink } from "@/components/learning-journey-link";
import { TRAINING_CREDIT_NOTICE } from "@/lib/program/learning-credit";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseLesson } from "@/components/course-lesson";
import { PlainLanguageComparison } from "@/components/multimedia/plain-language-comparison";
import { CriticalIncidentScene } from "@/components/multimedia/critical-incident-scene";
import { LearningCompanion } from "@/components/multimedia/learning-companion";
import { prepareEditableSurface } from "@/components/editable-surface";
import { getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";
import { CoursePackSchema } from "@/lib/content/courses/contract";
import { courseHref, courseText, sanitizedLesson, lessonObjectives } from "@/lib/content/courses/published";
import type { Metadata } from "next";
import { requestedContentScope } from "@/lib/product/request-context";
import "../../courses.css";
export const dynamic="force-dynamic";
/** A shared lesson link previews with the lesson's own title and summary. */
export async function generateMetadata({params}:{params:Promise<{courseId:string;lessonId:string}>}):Promise<Metadata> {
  const {courseId,lessonId}=await params;
  if(!getEditableSurfaceDefinition(`course.${courseId}`))return {};
  const surface=await prepareEditableSurface(`course.${courseId}`,{scope:await requestedContentScope(),includeOwner:false});
  if(!surface.available)return {};
  const {course}=CoursePackSchema.parse(surface.values.pack);const lesson=course.lessons.find(item=>item.id===lessonId);
  return lesson?{title:`${lesson.title} · ${course.title}`,description:courseText(lesson.summary)}:{};
}
export default async function LessonPage({params}:{params:Promise<{courseId:string;lessonId:string}>}) {
  const {courseId,lessonId}=await params;
  if(!getEditableSurfaceDefinition(`course.${courseId}`))notFound();
  const scope=await requestedContentScope();
  const surface=await prepareEditableSurface(`course.${courseId}`,{scope,includeOwner:false});
  if(!surface.available)notFound();
  const {course}=CoursePackSchema.parse(surface.values.pack);const index=course.lessons.findIndex(lesson=>lesson.id===lessonId);
  if(index<0)notFound();const lesson=course.lessons[index];
  return <div className={`course-page ${styles.page}`}><Link className={styles.breadcrumb} href={courseHref(courseId)}>← {course.title}</Link><div className={styles.lessonLayout}><div className={styles.lessonMain}><CourseLesson key={`${courseId}:${lessonId}`} courseId={courseId} companion={<><LearningCompanion courseId={courseId} lessonId={lessonId}/>{courseId === "plain-language-in-human-services" && lessonId === "pl-how" ? <PlainLanguageComparison /> : courseId === "critical-incidents-in-the-work" && lessonId === "ci-write" ? <CriticalIncidentScene /> : null}</>} lesson={sanitizedLesson(lesson)} objectives={lessonObjectives(lesson)} previous={index>0?courseHref(courseId,course.lessons[index-1].id):undefined} next={index<course.lessons.length-1?courseHref(courseId,course.lessons[index+1].id):undefined}/><LearningJourneyLink scope={scope} resourceId={"course-"+courseId}/><p className={styles.credit}>{TRAINING_CREDIT_NOTICE}</p></div><nav className={styles.outline} aria-label="Course lessons"><h2>Explore this course</h2><ol>{course.lessons.map(item=><li key={item.id}><Link href={courseHref(courseId,item.id)} aria-current={item.id===lessonId?"page":undefined}>{item.title}</Link></li>)}</ol></nav></div></div>;
}