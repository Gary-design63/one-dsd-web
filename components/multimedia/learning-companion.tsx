import { LearningEvidenceChart } from "./learning-evidence-chart";
import { LearningDialogue } from "./learning-dialogue";
import { LearningHistory } from "./learning-history";
import { getLearningCompanion } from "./learning-companion-data";

/** Native HTML companions retain the complete text without client state or storage. */
export function LearningCompanion({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  const example = getLearningCompanion(courseId, lessonId);
  if (!example) return <><LearningEvidenceChart courseId={courseId} lessonId={lessonId} /><LearningDialogue courseId={courseId} lessonId={lessonId} /><LearningHistory courseId={courseId} lessonId={lessonId} /></>;
  const headingId = "companion-" + courseId + "-" + lessonId;
  const isFlow = example.format === "flow";
  const isDocument = example.format === "document";
  const columns = isFlow ? "md:grid-cols-2 xl:grid-cols-4" : isDocument ? "" : "md:grid-cols-2";
  return <section aria-labelledby={headingId} className="my-8 rounded-2xl border border-[#dcd5c8] bg-[#faf7f1] p-5 sm:p-8">
    <p className="text-sm font-semibold uppercase tracking-wider text-[#71502f]">Fictional working example</p>
    <h2 id={headingId} className="mt-3 text-2xl font-bold text-[#123f60] sm:text-3xl">{example.title}</h2>
    <p className="mt-4 leading-7">{example.introduction}</p>
    <ol aria-label={isFlow ? "Process and handoffs" : isDocument ? "Annotated scope sheet" : "Planning comparison"} className={"mt-6 grid list-none gap-4 p-0 " + columns}>
      {example.panels.map((panel, index) => <li key={panel.title} className={"rounded-xl border border-[#dcd5c8] bg-white p-5 " + (example.format === "parallel" && index === example.panels.length - 1 ? "md:col-span-2" : "")}>
        <div className="flex items-center gap-3">
          {isFlow || isDocument ? <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#123f60] text-sm font-bold text-white">{index + 1}</span> : null}
          <h3 className="text-lg font-bold text-[#123f60]">{panel.title}</h3>
          {isFlow && index < example.panels.length - 1 ? <span aria-hidden="true" className="ml-auto text-2xl text-[#71502f]">→</span> : null}
        </div>
        <p className="mt-3 leading-7">{panel.text}</p>
        <details className="mt-4 border-t border-[#dcd5c8] pt-3">
          <summary className="cursor-pointer font-semibold text-[#123f60]">Examine this {isFlow ? "handoff" : isDocument ? "clause" : "part"}</summary>
          <p className="mb-0 mt-3 leading-7">{panel.annotation}</p>
        </details>
      </li>)}
    </ol>
    <div className="mt-6 border-t border-[#dcd5c8] pt-5">
      <h3 className="text-xl font-bold">Try it with the work</h3>
      <p className="mt-3 leading-7">{example.practice}</p>
      <p className="mb-0 mt-3 leading-7">{example.workProduct}</p>
    </div>
  </section>;
}


