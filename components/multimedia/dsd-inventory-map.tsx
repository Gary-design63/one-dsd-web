import Link from "next/link";

const questions: Record<string, string> = {
  "hcbs-policy": "Where does a policy or authorization step create repeated work?",
  "mnchoices-access": "Can someone reach an assessment conversation with the support they request?",
  "support-planning": "Can the person's own goals be traced into the plan?",
  "positive-supports": "What can change about the environment before judging a person?",
  olmstead: "Which community choices are available and what barriers remain?",
  employment: "How do a stated work goal, opportunity and support connect?",
  "eidbi-children": "Who owns an unanswered family question and its follow-up?",
  "tbi-guardianship": "What supports understanding and expressing a choice?",
  "contracts-fiscal": "What does a requirement demonstrate, and whom might it screen out?",
  "data-quality": "Does a complete record explain the person's experience?",
  "communications-training": "Can a reader find and use the next action?",
  "leadership-strategy": "Who can connect a commitment with a decision and resources?",
};

/** Receives only the profiles already visible in the scoped published inventory. */
export function DsdInventoryMap({ programs }: { programs: { id: string; title: string }[] }) {
  if (!programs.length) return null;
  return <details className="my-6 rounded-xl border border-slate-300 bg-white p-5"><summary className="cursor-pointer text-lg font-semibold">Find a program through a work question</summary><dl className="mt-5 grid gap-5 md:grid-cols-2">{programs.filter(program => questions[program.id]).map(program => <div key={program.id}><dt className="font-semibold">{questions[program.id]}</dt><dd className="ml-0 mt-2"><Link href={"/one-dsd/programs/" + program.id}>{program.title} →</Link></dd></div>)}</dl></details>;
}
