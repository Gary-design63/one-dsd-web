import Link from "next/link";
import type { LearningStop } from "@/lib/content/learning-journey";

/** F-02: published practice prompts only. Staff do not type or save notes here. */
export function LearningPracticeNotebook({ stops }: {stops: Pick<LearningStop,"id"|"title"|"practice"|"reflection">[]; initialFocus?: string}) {
  return <section id="practice-notebook" className="scroll-mt-8 rounded-2xl border border-[#d5c8b4] bg-[#faf7f0] p-5 sm:p-8" aria-labelledby="practice-notebook-title">
    <h2 id="practice-notebook-title" className="text-3xl font-semibold">Put one idea into practice</h2>
    <p className="notice mt-3 max-w-3xl leading-7" role="note">
      <strong>Browse and download only. </strong>
      Practice notes are not typed or saved on this page. Use the published prompts below, then download related tools from the Library.
    </p>
    <ol className="mt-6 list-none space-y-6 p-0">
      {stops.map(stop => (
        <li key={stop.id} id={`practice-${stop.id}`} className="rounded-xl border border-line bg-white p-5">
          <h3 className="m-0 text-xl font-semibold">{stop.title}</h3>
          <p className="mt-3 leading-7">{stop.practice}</p>
          <p className="mt-3 font-medium">{stop.reflection}</p>
        </li>
      ))}
    </ol>
    <p className="mt-6 text-sm">
      <Link href="/library" className="font-semibold underline">Browse the Library</Link>
    </p>
  </section>;
}
