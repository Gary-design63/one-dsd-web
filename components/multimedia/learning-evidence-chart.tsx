import { useId } from "react";

export const LEARNING_CHART_ROUTES = [
  { courseId: "employee-viewpoint-and-wellbeing-surveys", lessonId: "vs-blend" },
  { courseId: "outcomes-not-intentions", lessonId: "out-blend" },
] as const;
const surveyGroups = [
  { title: "Predictable schedule", favorable: 90, respondents: 100 },
  { title: "Frequently changing schedule", favorable: 50, respondents: 100 },
] as const;
const waits = [2, 2, 2, 2, 2, 2, 2, 2, 2, 82] as const;

export function LearningEvidenceChart({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  const uid = useId();
  const route = LEARNING_CHART_ROUTES.find(item => item.courseId === courseId && item.lessonId === lessonId);
  if (!route) return null;
  const isSurvey = courseId === "employee-viewpoint-and-wellbeing-surveys";
  return <section aria-labelledby={uid + "-heading"} className="my-8 rounded-2xl border border-[#dcd5c8] bg-[#faf7f1] p-5 sm:p-8">
    <p className="text-sm font-semibold uppercase tracking-wider text-[#71502f]">Fictional example · not DHS data</p>
    <h2 id={uid + "-heading"} className="mt-3 text-2xl font-bold text-[#123f60] sm:text-3xl">{isSurvey ? "One survey result, two work patterns" : "An average wait can hide a long wait"}</h2>
    <p className="mt-4 leading-7">{isSurvey ? "In this made-up example, 140 of 200 respondents report that they can plan their workload: 70% overall. The two groups have different work patterns and the same number of respondents." : "Ten made-up applications have an average wait of 10 days. Looking at the individual waits changes the question you might ask next."}</p>
    <figure className="m-0 mt-6 rounded-xl bg-white p-4 sm:p-5">
      <figcaption className="text-lg font-bold">{isSurvey ? "Respondents who could plan their workload" : "Days each application waited"}</figcaption>
      {isSurvey ? <svg viewBox="0 0 500 225" role="img" aria-labelledby={uid + "-title " + uid + "-description"} className="mt-4 block h-auto w-full">
        <title id={uid + "-title"}>Predictable schedule: 90%. Frequently changing schedule: 50%. Overall: 70%.</title>
        <desc id={uid + "-description"}>Each group has 100 fictional respondents. Ninety in the first group and 50 in the second gave the favorable response. The zero-to-100% chart and the complete table show a difference in these responses, not its cause.</desc>
        {surveyGroups.map((group, index) => <g key={group.title}>
          <text x="15" y={25 + index * 85} fontSize="18" fill="#172b3a">{group.title}</text>
          <rect x="15" y={38 + index * 85} width="460" height="32" rx="4" fill="#e7edf2" />
          <rect x="15" y={38 + index * 85} width={group.favorable * 4.6} height="32" rx="4" fill={index === 0 ? "#123f60" : "#526b81"} />
          <text x={group.favorable * 4.6 + 7} y={60 + index * 85} textAnchor="end" fontSize="18" fontWeight="700" fill="white">{group.favorable}%</text>
        </g>)}
        <text x="15" y="205" fontSize="16" fill="#445868">0%</text><text x="245" y="205" fontSize="16" textAnchor="middle" fill="#445868">50%</text><text x="475" y="205" fontSize="16" textAnchor="end" fill="#445868">100%</text>
      </svg> : <svg viewBox="0 0 520 270" role="img" aria-labelledby={uid + "-title " + uid + "-description"} className="mt-4 block h-auto w-full">
        <title id={uid + "-title"}>Nine applications waited 2 days. One waited 82 days. The average was 10 days.</title>
        <desc id={uid + "-description"}>Each row is one fictional application. The dashed line marks the 10-day average. The complete individual values are in the table below.</desc>
        <line x1="100" x2="480" y1="235" y2="235" stroke="#a4b4c1" />
        <line x1={100 + 380 * 10 / 90} x2={100 + 380 * 10 / 90} y1="30" y2="235" stroke="#71502f" strokeWidth="2" strokeDasharray="5 4" />
        <text x="150" y="19" fontSize="15" fill="#71502f">Average: 10 days</text>
        {waits.map((days, index) => <g key={index}>
          <text x="10" y={47 + index * 20} fontSize="15" fill="#445868">Case {index + 1}</text>
          <circle cx={100 + 380 * days / 90} cy={42 + index * 20} r="5" fill="#123f60" />
          <text x={113 + 380 * days / 90} y={47 + index * 20} fontSize="14" fill="#172b3a">{days}</text>
        </g>)}
        {[0, 30, 60, 90].map(days => <text key={days} x={100 + 380 * days / 90} y="258" textAnchor="middle" fontSize="15" fill="#445868">{days}</text>)}
      </svg>}
    </figure>
    <div className="mt-5 overflow-x-auto rounded-xl border border-[#dcd5c8] bg-white" role="region" aria-label="Complete fictional data table" tabIndex={0}>
      <table className="w-full border-collapse text-left text-sm">
        <caption className="p-4 text-left text-base font-bold">{isSurvey ? "All fictional survey responses" : "All ten fictional waits"}</caption>
        <thead className="border-y border-[#dcd5c8] bg-[#edf2f6]"><tr><th scope="col" className="p-3">{isSurvey ? "Work pattern" : "Application"}</th><th scope="col" className="p-3">{isSurvey ? "Favorable / respondents" : "Wait in days"}</th>{isSurvey ? <th scope="col" className="p-3">Percent</th> : null}</tr></thead>
        <tbody>{isSurvey ? <>{surveyGroups.map(group => <tr key={group.title} className="border-b border-[#e4e0d8]"><th scope="row" className="p-3 font-semibold">{group.title}</th><td className="p-3">{group.favorable} / {group.respondents}</td><td className="p-3">{group.favorable}%</td></tr>)}<tr><th scope="row" className="p-3 font-semibold">Combined</th><td className="p-3">140 / 200</td><td className="p-3">70%</td></tr></> : waits.map((days, index) => <tr key={index} className="border-b border-[#e4e0d8]"><th scope="row" className="p-3 font-semibold">Case {index + 1}</th><td className="p-3">{days}</td></tr>)}</tbody>
      </table>
    </div>
    <div className="mt-5 rounded-xl bg-white p-5">
      <h3 className="text-lg font-bold">What the numbers can and cannot show</h3>
      <p className="mb-0 mt-3 leading-7">{isSurvey ? "The groups differ by 40 percentage points on this one question. We do not know who did not respond or what caused the difference. These work patterns are not identities or scores for a team. In real work, use only authorized breakdowns that protect privacy and make uncertainty visible." : "The median is 2 days and the longest wait is 82 days. The average is mathematically correct; it does not describe every experience. We have not been told why the last case waited longer. A closer review could identify a process barrier, a recording problem or another explanation."}</p>
    </div>
    <h3 className="mt-6 text-xl font-bold">Bring a better question to the next review</h3>
    <p className="mb-0 mt-3 leading-7">{isSurvey ? "In the lesson notes, write one question about working conditions and one limit of this evidence. What would you need to learn before deciding what to change?" : "In the lesson notes, name the overall number you currently use, the variation it might hide and one additional view or question that could guide a useful change."}</p>
  </section>;
}

