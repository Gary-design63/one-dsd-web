import Image from "next/image";
import styles from "../course-design.module.css";
import { LearningJourneyLink } from "@/components/learning-journey-link";
import { TRAINING_CREDIT_NOTICE } from "@/lib/program/learning-credit";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prepareEditableSurface, EditableSurfaceRegion } from "@/components/editable-surface";
import { CoursePackSchema } from "@/lib/content/courses/contract";
import { courseHref, courseLink, courseSummary } from "@/lib/content/courses/published";
import { getEditableSurfaceDefinition } from "@/lib/content/staff-surface-registry";
import { requestedContentScope } from "@/lib/product/request-context";
import { CourseResume } from "@/components/course-resume";
import { ResourceShare } from "@/components/resource-tools";
import { SourceState, registerSourceFor } from "@/components/source-evidence";
import type { Metadata } from "next";
import "../courses.css";
export const dynamic="force-dynamic";
/** A shared course link previews with the course's own title and summary. */
export async function generateMetadata({params}:{params:Promise<{courseId:string}>}):Promise<Metadata> {
  const {courseId}=await params;
  if(!getEditableSurfaceDefinition(`course.${courseId}`))return {};
  const surface=await prepareEditableSurface(`course.${courseId}`,{scope:await requestedContentScope(),includeOwner:false});
  if(!surface.available)return {};
  const pack=CoursePackSchema.parse(surface.values.pack);
  return {title:pack.course.title,description:courseSummary(pack)};
}
export default async function CoursePage({params}:{params:Promise<{courseId:string}>}) {
  const {courseId}=await params;
  if(!getEditableSurfaceDefinition(`course.${courseId}`))notFound();
  const scope=await requestedContentScope();
  const surface=await prepareEditableSurface(`course.${courseId}`,{scope});
  if(!surface.available)notFound();
  const pack=CoursePackSchema.parse(surface.values.pack);const course=pack.course;
  return <div className={`course-page ${styles.page}`}><Link className={styles.breadcrumb} href="/learn">← Learning and resources</Link><EditableSurfaceRegion surface={surface}>
    <header className={styles.hero}><div><p className={styles.eyebrow}>{course.seriesLabel}</p><h1>{course.title}</h1><p className={styles.description}>{courseSummary(pack)}</p><p className={styles.duration}>{course.duration ? <>{course.duration} · </> : null}{course.lessons.length} lessons · Voluntary learning</p><CourseResume courseId={course.id} lessons={course.lessons.map(({id,title})=>({id,title}))}/><details className={styles.supporting}><summary>Share this course</summary><ResourceShare title={course.title} href={`/share/courses/${encodeURIComponent(course.id)}`} noun="course" /></details></div><div className={styles.cover}><Image src={course.coverImage} alt={course.coverAlt} fill sizes="(max-width: 700px) 90vw, 480px" style={{objectFit:"contain"}} unoptimized /></div></header>
    {/^div-[fia]/.test(course.id) ? <p><Link href="/learn/diversity">All diversity courses: Foundation, Intermediate, and Advanced</Link></p> : null}
    <nav className={styles.sectionNav} aria-label="In this course">{course.learning ? <Link href="#outcomes">Outcomes</Link> : null}<Link href="#lessons">Course outline</Link><Link href="#job-aid">{pack.jobAid.title}</Link><Link href="#sources">Sources and further reading</Link></nav>
    {course.learning?<section id="outcomes" className={styles.outcomes}><h2>What you’ll be able to do</h2><div><h3>Explore and practice</h3><ul>{course.learning.objectives.map((item,i)=><li key={i}>{item}</li>)}</ul></div><div><h3>What you can take into your work</h3><ul>{course.learning.evidence.map((item,i)=><li key={i}>{item}</li>)}</ul></div><p>{course.learning.appliedNextStep}</p></section>:null}
    {course.introAudio?<section><h2>Listen to the introduction</h2><audio controls preload="none" src={course.introAudio}>This recording cannot play here. Use the transcript below.</audio>{course.introTranscript?<details><summary>Read the introduction</summary><p>{course.introTranscript}</p></details>:null}</section>:course.introTranscript?<p>{course.introTranscript}</p>:null}
    <section id="lessons"><h2>Course outline</h2><ol className={styles.lessons}>{course.lessons.map((lesson,i)=><li key={lesson.id}><span className={styles.lessonNumber} aria-hidden="true">{String(i+1).padStart(2,"0")}</span><div><h3><Link href={courseHref(course.id,lesson.id)}>{lesson.title}</Link></h3><p>{lesson.summary}</p></div>{lesson.minutes > 0 ? <span className={styles.lessonTime}>{lesson.minutes} minutes</span> : null}</li>)}</ol></section>
    <section id="job-aid" className={styles.jobAid}><h2>{pack.jobAid.title}</h2><p>{pack.jobAid.subtitle}</p>{pack.jobAid.quote?<blockquote>{pack.jobAid.quote}</blockquote>:null}{pack.jobAid.use?<><p>{pack.jobAid.use.purpose}</p><ul>{pack.jobAid.use.remember.map((item,i)=><li key={i}>{item}</li>)}</ul><p>{pack.jobAid.use.doNext}</p></>:null}<div className={styles.jobSections}>{pack.jobAid.sections.map((section,i)=><div key={i}><h3>{section.heading}</h3><ul>{section.items.map((item,n)=><li key={n}>{item}</li>)}</ul></div>)}</div></section>
    <LearningJourneyLink scope={scope} resourceId={"course-"+course.id} />
    <p className={styles.credit}>{TRAINING_CREDIT_NOTICE}</p>
    <section id="sources" className={styles.sources}><h2>Sources and further reading</h2><ul>{pack.sources.map((source,i)=><li id={`source-${i+1}`} key={i}>{courseLink(source.href)?<a href={courseLink(source.href)}>{source.title}</a>:<span>{source.title}</span>}<p>{source.note}</p><p className="source-state-line"><SourceState source={registerSourceFor(source)} /></p></li>)}</ul><p><Link href="/learn/sources">All research and sources across the program</Link></p></section>
  </EditableSurfaceRegion></div>;
}
