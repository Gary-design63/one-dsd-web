import Image from "next/image";
import Link from "next/link";

/** Call only for an already-visible resource, such as a published result or ASK source. */
export function ResourceMediaPreview({ resourceId }: { resourceId: string }) {
  const frame = "mt-4 flex max-w-xl flex-wrap items-center gap-4 rounded-lg border border-[#cbd8e0] bg-[#f5f8fa] p-4";
  const podcast = ({
    "podcast-equity-toolkit": { href: "/learn/equity-toolkit#podcast-equity-toolkit", title: "DHS equity policy and toolkit" },
    "podcast-anti-racism-public-service": { href: "/learn#podcast-anti-racism-public-service", title: "Anti-racism in public service" },
  } as Record<string, { href: string; title: string }>)[resourceId];
  if (podcast) return <figure className={frame}><figcaption><p className="m-0 text-sm">Recording and reading companion</p><Link href={podcast.href} className="font-semibold">{podcast.title}: listen, read or choose a chapter</Link><p className="mb-0 mt-2 text-sm leading-6">The player identifies the transcript as a draft and keeps the original recording available for checking wording.</p></figcaption></figure>;
  if (resourceId === "course-critical-incidents-in-the-work") return <figure className={frame}>
    <Image src="/images/media-critical-incident-late-handout-v1.png" width={180} height={101} sizes="180px" alt="Colleagues at a table with newly shared meeting papers." className="h-auto rounded-md" />
    <figcaption className="min-w-0 flex-1"><p className="m-0 text-sm">Fictional meeting example</p><Link href="/courses/critical-incidents-in-the-work/ci-write" className="font-semibold">Observe what happened before interpreting it</Link></figcaption>
  </figure>;
  if (resourceId === "course-plain-language-in-human-services") return <figure className={frame}>
    <div className="border-l-4 border-[#123f60] bg-white p-3 text-sm leading-7" aria-label="Writing moves in the notice example">Action first<br />Reply date<br />A way to get help</div>
    <figcaption className="min-w-0 flex-1"><p className="m-0 text-sm">Fictional notice comparison</p><Link href="/courses/plain-language-in-human-services/pl-how" className="font-semibold">See how a reader finds the next step</Link></figcaption>
  </figure>;
  if (resourceId === "pn-measurement-without-surveillance") return <figure className={frame}>
    <ol className="m-0 border-l-4 border-[#123f60] bg-white p-3 pl-8 text-sm leading-7"><li>The question</li><li>Meaningful evidence</li><li>The next decision</li></ol>
    <figcaption className="min-w-0 flex-1"><p className="m-0 text-sm">Evaluation plan and worked example</p><Link href="/practice/measurement" className="font-semibold">Explore the chart and build an evaluation plan</Link></figcaption>
  </figure>;
  return null;
}

export function mediaResourceIdFromHref(href: string): string | null {
  const anchored = href.split("?")[0];
  if (anchored === "/learn/equity-toolkit#podcast-equity-toolkit") return "podcast-equity-toolkit";
  if (anchored === "/learn#podcast-anti-racism-public-service") return "podcast-anti-racism-public-service";
  const path = href.split(/[?#]/)[0];
  const routes: Record<string, string> = {
    "/courses/critical-incidents-in-the-work": "course-critical-incidents-in-the-work",
    "/courses/critical-incidents-in-the-work/ci-write": "course-critical-incidents-in-the-work",
    "/library/course-critical-incidents-in-the-work": "course-critical-incidents-in-the-work",
    "/courses/plain-language-in-human-services": "course-plain-language-in-human-services",
    "/courses/plain-language-in-human-services/pl-how": "course-plain-language-in-human-services",
    "/library/course-plain-language-in-human-services": "course-plain-language-in-human-services",
    "/library/pn-measurement-without-surveillance": "pn-measurement-without-surveillance",
    "/practice/measurement": "pn-measurement-without-surveillance",
  };
  return routes[path] ?? null;
}
