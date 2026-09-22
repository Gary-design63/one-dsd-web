import type { Metadata } from "next";
import Link from "next/link";
import { LearningTile } from "@/components/learning-tile";
import { PageIntro } from "@/components/ui";
import { editingModeFromCookies } from "@/lib/auth/request";
import { groupDiversityCourses } from "@/lib/content/courses/diversity-series";
import { courseContentItem, courseHref, courseSummary, publishedCourses } from "@/lib/content/courses/published";
import { requestedContentScope } from "@/lib/product/request-context";
import { TRAINING_CREDIT_NOTICE } from "@/lib/program/learning-credit";
import styles from "../learning-family.module.css";

export const metadata: Metadata = { title: "Diversity: understanding and practice" };
export const dynamic = "force-dynamic";

export default async function DiversityCoursesPage() {
  const scope = await requestedContentScope();
  const [published, owner] = await Promise.all([publishedCourses(scope), editingModeFromCookies()]);
  const groups = groupDiversityCourses(published.map(row => row.pack));
  return <div>
    <PageIntro kicker="People, Access and Culture" title="Diversity: understanding and practice"
      lede="Explore identity, culture, privilege, bias, and belonging through explanation, realistic situations, reflection, and practice." />
    <div className="wrap space-y-10 py-10">
      <p><Link href="/learn">← Learning and resources</Link></p>
      <p>Choose a course that speaks to a question or experience you want to explore. Foundation, Intermediate, and Advanced describe the depth of the material. They do not label you or restrict where you can begin. Each course includes four lessons, activities with feedback, a practical job aid, and sources for further reading.</p>
      <nav className={styles.themes} aria-label="Diversity course groups">
        {groups.map(group => <a href={`#${group.id}`} key={group.id}>{group.title}</a>)}
      </nav>
      {groups.map(group => <section key={group.id} id={group.id} className={styles.section} aria-labelledby={`${group.id}-heading`}>
        <div className={styles.sectionHeading}><h2 id={`${group.id}-heading`}>{group.title}</h2><span>{group.courses.length} courses</span></div>
        <p>{group.description}</p>
        {group.courses.length ? <ul className={styles.courseGrid}>
          {group.courses.map(pack => <li key={pack.course.id}><LearningTile
            item={courseContentItem(pack)} href={courseHref(pack.course.id)} owner={owner}
            presentation={{ imageSrc: pack.course.coverImage, imageAlt: pack.course.coverAlt, summary: courseSummary(pack) }} />
          </li>)}
        </ul> : <p>No courses in this group are currently published for this view.</p>}
      </section>)}
      <p>{TRAINING_CREDIT_NOTICE}</p>
    </div>
  </div>;
}
