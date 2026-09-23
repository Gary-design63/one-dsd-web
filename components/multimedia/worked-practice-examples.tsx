import Link from "next/link";

const panel = "rounded-xl border border-[#cbd8e0] bg-white p-5";
const disclosure = "my-5 rounded-xl border border-[#b9cbd7] bg-[#f5f8fa] p-5 md:p-6";

export function MeetingReflectionExample() {
  return <details className={disclosure}>
    <summary className="cursor-pointer text-lg font-bold text-[#123f60]">See how one meeting change can lead to learning</summary>
    <p className="mt-4 leading-7">A fictional team wants colleagues to have a meaningful chance to shape a decision.</p>
    <ol className="mt-4 grid list-none gap-4 p-0 md:grid-cols-3" aria-label="Before, during and after the meeting">
      <li className={panel}><h3 className="text-lg font-bold">Before: open the question</h3><p className="leading-7">The agenda used to arrive with the invitation to decide. This time, the team shares the question and materials while alternatives are still open, with a way to contribute before the meeting.</p></li>
      <li className={panel}><h3 className="text-lg font-bold">During: make room to contribute</h3><p className="leading-7">Colleagues can speak, write or ask for clarification. The facilitator checks what is missing instead of treating silence as agreement.</p></li>
      <li className={panel}><h3 className="text-lg font-bold">After: show what changed</h3><p className="leading-7">The team shares the decision, the input that shaped it and questions still open. Colleagues can check whether the account reflects what they contributed.</p></li>
    </ol>
    <p className="mt-4 leading-7"><strong>A reflection to return to:</strong> More comments do not by themselves establish meaningful influence. What could colleagues change, and what happened to their input?</p>
  </details>;
}

export function FormJourneyExample() {
  return <details className={disclosure}>
    <summary className="cursor-pointer text-lg font-bold text-[#123f60]">Trace the work behind a short form</summary>
    <p className="mt-4 leading-7">Fictional example: a person is asked to confirm an appointment. The team examines the whole task, including what happens after the reply.</p>
    <div className="mt-4 overflow-x-auto"><table className="w-full border-collapse text-left">
      <caption className="p-3 text-left font-bold">What the person needs to understand, provide and do</caption>
      <thead><tr>{["Step", "A possible burden", "An option to explore"].map(text => <th key={text} scope="col" className="border-b border-[#b9cbd7] p-3">{text}</th>)}</tr></thead>
      <tbody>
        <tr><th scope="row" className="p-3 align-top">Understand the request</th><td className="p-3 align-top">The action is buried beneath internal program terms.</td><td className="p-3 align-top">Lead with the appointment, the response needed and the reply date. Preserve required information.</td></tr>
        <tr><th scope="row" className="p-3 align-top">Provide a reply</th><td className="p-3 align-top">One reply method assumes access to a particular device or format.</td><td className="p-3 align-top">Check workable response and access-support options with the responsible team and the people using them.</td></tr>
        <tr><th scope="row" className="p-3 align-top">Know what happens next</th><td className="p-3 align-top">There is no clear confirmation or way to ask a question.</td><td className="p-3 align-top">Explain what a response leads to and provide a working contact method.</td></tr>
      </tbody>
    </table></div>
    <p className="mt-4 leading-7">Try the complete task with people who use it. A simpler sentence is useful; the surrounding process also needs to work.</p>
  </details>;
}

export function ResultEvidenceExample() {
  return <details className={disclosure}>
    <summary className="cursor-pointer text-lg font-bold text-[#123f60]">See an example of a useful result note</summary>
    <p className="mt-4 leading-7">This fictional example separates a change, an observation and the questions that remain. It contains no DHS results or participant records.</p>
    <dl className="mt-4 grid gap-4 md:grid-cols-2">
      {[
        ["What changed", "A team moved the requested action and reply date to the beginning of a reminder."],
        ["What was observed", "In a small voluntary try-out, several readers found the next step without asking the facilitator."],
        ["What remains unknown", "There was no comparable earlier try-out. Some access needs and language preferences were not represented."],
        ["What happens next", "Invite further perspectives, check the complete reply process and decide which changes to retain."],
      ].map(([term, description]) => <div key={term} className={panel}><dt className="font-bold">{term}</dt><dd className="ml-0 mt-2 leading-7">{description}</dd></div>)}
    </dl>
    <p className="mt-4 leading-7">The observation is useful without claiming that the wording caused an improvement or that the experience represents everyone.</p>
  </details>;
}

export function SupportQuestionMap() {
  return <details className={disclosure}>
    <summary className="cursor-pointer text-lg font-bold text-[#123f60]">One reminder letter, three useful questions</summary>
    <p className="mt-4 leading-7">In this fictional example, a team wants a revised appointment reminder to work for the people receiving it. Different questions may call for different partners.</p>
    <dl className="mt-4 grid gap-4 md:grid-cols-3">
      <div className={panel}><dt className="font-bold">Is the message clear?</dt><dd className="ml-0 mt-2 leading-7">Ask the person responsible for the communication to check the action, necessary wording and contact details.</dd></div>
      <div className={panel}><dt className="font-bold">Can people use it?</dt><dd className="ml-0 mt-2 leading-7">Work with the appropriate language and accessibility support to examine the format, response methods and identified needs.</dd></div>
      <div className={panel}><dt className="font-bold">Does the process work?</dt><dd className="ml-0 mt-2 leading-7">Bring questions about requirements, handoffs and workable alternatives to the responsible program team.</dd></div>
    </dl>
    <p className="mt-4 leading-7">The questions help prepare a conversation. The right person depends on the work and its responsibilities.</p>
    <Link href="/learn/equity-toolkit">Explore questions in the Equity Analysis Toolkit companion</Link>
  </details>;
}

export function ProgramRelationshipMap() {
  return <details className={disclosure}>
    <summary className="cursor-pointer text-lg font-bold text-[#123f60]">See how knowledge, practice and support connect</summary>
    <nav aria-label="Connected program resources" className="mt-4"><ul className="grid list-none gap-4 p-0 md:grid-cols-2">
      <li className={panel}><Link href="/understanding-dhs" className="font-bold">Understand the organization</Link><p className="mb-0 mt-2 leading-7">Explore documented responsibilities, programs and partnerships.</p></li>
      <li className={panel}><Link href="/learn" className="font-bold">Develop understanding</Link><p className="mb-0 mt-2 leading-7">Connect questions with learning, resources and reflection.</p></li>
      <li className={panel}><Link href="/one-dsd" className="font-bold">Explore divisional practice</Link><p className="mb-0 mt-2 leading-7">Consider DSD situations, leadership and ways to contribute.</p></li>
      <li className={panel}><Link href="/support" className="font-bold">Find useful support</Link><p className="mb-0 mt-2 leading-7">Prepare a question and identify the appropriate person or resource.</p></li>
    </ul></nav>
  </details>;
}
