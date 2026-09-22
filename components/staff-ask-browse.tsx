import Link from "next/link";
import { ResourceDownloads } from "@/components/resource-downloads";
import styles from "@/components/workspace-presentation.module.css";
import type { StaffAskTopic } from "@/lib/content/staff-ask-topics";
import { staffAskFacets } from "@/lib/content/staff-ask-topics";
import type { DownloadScope } from "@/lib/downloads/catalog";

export function StaffAskBrowse({
  topics,
  initialTopicId,
  facet = "all",
  scope,
}: {
  topics: StaffAskTopic[];
  initialTopicId?: string;
  facet?: string;
  scope?: DownloadScope;
}) {
  const facets = staffAskFacets(topics);
  const selected = facets.includes(facet) ? facet : "all";
  const visible = selected === "all" ? topics : topics.filter((topic) => topic.facet === selected);

  return (
    <div className={styles.askLayout}>
      <div>
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <p className="help m-0 max-w-xl">These are published answers from the knowledge base. Choosing a topic is not stored on the server.</p>
          <Link href="/library" className="btn btn--light">Browse the Library</Link>
        </div>
        <nav aria-label="Browse by kind of work" className="mb-4 flex flex-wrap gap-2">
          <Link href="/ask" className={selected === "all" ? "btn btn--primary" : "btn btn--light"}>All published topics</Link>
          {facets.map((item) => (
            <Link
              key={item}
              href={`/ask?facet=${encodeURIComponent(item)}`}
              className={selected === item ? "btn btn--primary" : "btn btn--light"}
            >
              {item}
            </Link>
          ))}
        </nav>

        <ul className="m-0 grid list-none gap-3 p-0">
          {visible.map((topic) => (
            <li key={topic.id}>
              <details className="rounded-xl border border-[#cbd4da] bg-white p-4" open={topic.id === initialTopicId}>
                <summary className="cursor-pointer">
                  <p className="kicker m-0">{topic.facet}</p>
                  <p className="mt-1 text-lg font-bold text-[#003865]">{topic.title}</p>
                  <p className="mt-1 text-sm">{topic.question}</p>
                </summary>
                <article className={`${styles.answer} mt-4`}>
                  <p className="kicker">Published answer</p>
                  <h2 className="text-xl font-extrabold">{topic.title}</h2>
                  <p className="mt-2 whitespace-pre-wrap">{topic.answer}</p>
                  {topic.checks.length ? (
                    <div className="mt-4">
                      <h3 className="text-lg font-bold">Questions this topic covers</h3>
                      <ul className="list-disc pl-6">
                        {topic.checks.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                  ) : null}
                  <ResourceDownloads kind={topic.download.kind} id={topic.download.id} noun={topic.download.noun} scope={scope} />
                  {topic.links.length ? (
                    <p className="mt-4 text-sm">
                      {topic.links.map((link, index) => (
                        <span key={link.href}>
                          {index ? " · " : ""}
                          <Link href={link.href}>{link.label}</Link>
                        </span>
                      ))}
                    </p>
                  ) : null}
                </article>
              </details>
            </li>
          ))}
        </ul>
      </div>
      <aside className={styles.askRail}>
        <div className={styles.railNote}>
          <p className="kicker">How this page works</p>
          <ul className="list-disc pl-5 text-sm">
            <li>Choose a common question. The published answer and a downloadable copy come from the knowledge base.</li>
            <li>There is no place to type a question. Staff pages do not send or store what you write.</li>
            <li>If the topic is not listed, browse the Library or Areas of work.</li>
            <li>Decisions stay with the responsible person or office.</li>
          </ul>
        </div>
        <div className={styles.railNote}>
          <p className="kicker">If a card is not enough</p>
          <p className="text-sm">Use Find the right person to match the work with its responsible supervisor, Equity Director or Specialist, policy owner, or office.</p>
          <p className="mt-2"><Link href="/support/right-person">Find the right person</Link></p>
        </div>
      </aside>
    </div>
  );
}
