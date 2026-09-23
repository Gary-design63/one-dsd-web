import styles from "../../learn/learning-family.module.css";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prepareEditableSurface } from "@/components/editable-surface";
import { PublishedPodcast } from "@/components/published-podcast";
import { PODCASTS, type Podcast } from "@/lib/content/podcasts";
import { stringValue } from "@/lib/content/staff-surface-registry";
import { requestedContentScope } from "@/lib/product/request-context";

export const dynamic = "force-dynamic";

function findPodcast(id: string): Podcast | undefined {
  return PODCASTS.find(podcast => podcast.id === id);
}

/** A shared podcast link previews with the podcast's own title and introduction. */
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const podcast = findPodcast((await params).id);
  if (!podcast) return {};
  const surface = await prepareEditableSurface(podcast.surfaceId, { scope: await requestedContentScope(), includeOwner: false });
  if (!surface.available) return {};
  return { title: stringValue(surface.values, "title"), description: stringValue(surface.values, "intro") };
}

/** One podcast on its own page: the same player, chapters and transcript as on Learning. */
export default async function PodcastPage({ params }: { params: Promise<{ id: string }> }) {
  const podcast = findPodcast((await params).id);
  if (!podcast) notFound();
  const scope = await requestedContentScope();
  const surface = await prepareEditableSurface(podcast.surfaceId, { scope });
  if (!surface.available) notFound();
  const toolkitCompanion = podcast.href.startsWith("/learn/equity-toolkit");
  return <div className={`${styles.page} ${styles.content} ${styles.readingPage} space-y-10`}>
    <header className="max-w-3xl space-y-4 print:hidden">
      <Link href="/learn">← Learning and resources</Link>
      <p className={styles.eyebrow}>Podcast · {podcast.duration}</p>
    </header>
    <PublishedPodcast headingLevel={1} ownPage podcast={podcast} surface={surface} />
    <section className="space-y-4 border-t border-line pt-8 print:hidden" aria-labelledby="podcast-related-title">
      <h2 id="podcast-related-title" className="text-2xl font-semibold">Related</h2>
      <ul className="list-disc space-y-3 pl-6">
        <li><Link href="/learn?type=podcast">All podcasts on Learning and resources</Link></li>
        {toolkitCompanion ? <li><Link href="/learn/equity-toolkit">Equity analysis for your work, the companion to this recording</Link></li> : null}
        <li><Link href="/learn">Learning and resources</Link></li>
        <li><Link href="/library">Browse the resource library</Link></li>
        <li><Link href="/ask">Bring a question to ASK</Link></li>
      </ul>
    </section>
  </div>;
}
