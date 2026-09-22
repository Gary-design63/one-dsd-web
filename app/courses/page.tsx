import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/ui";
import { courseHref, courseSummary, publishedCourses } from "@/lib/content/courses/published";
import { requestedContentScope } from "@/lib/product/request-context";
import { TRAINING_CREDIT_NOTICE } from "@/lib/program/learning-credit";

export const metadata: Metadata = { title: "Courses" };
export const dynamic = "force-dynamic";

/** Index of published courses for the selected program view; every course page links back to /courses. */
export default async function CoursesPage() {
  const scope = await requestedContentScope();
  const courses = await publishedCourses(scope);
  const countLabel = courses.length === 1 ? "1 course" : `${courses.length} courses`;
  return (
    <div>
      <PageIntro
        kicker="Learning and resources"
        title="Courses"
        lede="Short, self-paced courses built for DHS staff. Each course has lessons, a job aid, and sources you can check."
      />
      <div className="wrap max-w-5xl space-y-8 py-10">
        <p><Link href="/learn">← Learning and resources</Link></p>
        <section aria-labelledby="course-list-title">
          <h2 id="course-list-title" className="text-2xl font-extrabold">{countLabel}</h2>
          {courses.length ? (
            <ul className="mt-4 grid list-none gap-x-12 gap-y-7 p-0 md:grid-cols-2">
              {courses.map(({ pack }) => (
                <li key={pack.course.id} className="border-t border-line pt-4">
                  {pack.course.seriesLabel ? <p className="kicker">{pack.course.seriesLabel}</p> : null}
                  <h3 className="text-xl font-extrabold">
                    <Link href={courseHref(pack.course.id)}>{pack.course.title}</Link>
                  </h3>
                  <p>{courseSummary(pack)}</p>
                  <p className="text-sm">{pack.course.duration} · {pack.course.lessons.length} lessons</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4">No courses are published for this view yet. Explore <Link href="/learn">learning and resources</Link> for other material.</p>
          )}
        </section>
        <p className="text-sm">{TRAINING_CREDIT_NOTICE}</p>
      </div>
    </div>
  );
}
