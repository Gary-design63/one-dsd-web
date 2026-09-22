type Moment = { title: string; dialogue: string; question: string; feedback: string };
export const LEARNING_MOMENT_AUDIO: Readonly<Record<string, readonly string[]>> = {
  "working-with-an-interpreter": ["interpreter-before.wav", "interpreter-turn.wav", "interpreter-check.wav"],
  "teams-in-minimization": ["packet-drift.wav", "packet-redirect.wav", "packet-next-step.wav"],
  "brain-injury-and-complex-disability": ["pace-today.wav", "pace-topic.wav", "pace-next-step.wav"],
};
export const LEARNING_DIALOGUES: readonly { courseId: string; lessonId: string; title: string; intro: string; moments: Moment[]; audio?: { file: string; label: string; transcript: string }[] }[] = [
  { courseId: "intercultural-conflict-styles", lessonId: "cs-notice", title: "Hear the deadline concern, then describe the delivery", intro: "The same fictional speaker raises the same deadline concern in two ways. These short synthetic recordings illustrate wording and pace; they do not represent a cultural group or an assessment.",
    audio: [
      { file: "conflict-direct.wav", label: "Version one: direct wording, steady pace", transcript: "We cannot finish the review by Friday with the packet arriving Thursday. Can we move the deadline to Tuesday?" },
      { file: "conflict-indirect.wav", label: "Version two: tentative wording, slower pace", transcript: "I wonder whether Friday gives us enough review time. The packet arrives Thursday. Would Tuesday be possible?" },
    ], moments: [{ title: "Compare what stayed the same", dialogue: "Both versions identify a Thursday packet, a Friday review deadline and Tuesday as an alternative.", question: "What changed in delivery, and what evidence about the work remained the same?", feedback: "The wording and pace changed. Neither version establishes honesty, competence, a cultural identity or leadership potential. A useful next question is: What review work must fit between receiving the packet and the decision?" }] },
  { courseId: "stay-and-exit-interviews", lessonId: "se-how", title: "Open a stay interview with a usable choice", intro: "Read or listen to this fictional opening, then examine what the interviewer still needs to resolve. The synthetic recording is a practice example.",
    audio: [{ file: "stay-opening.wav", label: "Listen to the fictional opening", transcript: "Before we begin, let us review who can see the notes and how they will be used. I cannot promise more privacy than this process provides. If speaking with me makes this harder, we can discuss another appropriate interviewer. What part of the work has made staying harder?" }],
    moments: [{ title: "Pause before asking for the story", dialogue: "Colleague: I am worried that my supervisor will see my exact words.", question: "What needs an answer before the interviewer asks for more detail?", feedback: "Explain the actual recipients, use and limits of the notes through the relevant process. Do not invent a confidentiality promise. Discuss an appropriate alternative interviewer when needed; a colleague's identity does not assign them responsibility for everyone with that identity." }] },
  { courseId: "working-with-an-interpreter", lessonId: "wi-time", title: "Make room for each turn", intro: "This fictional described conversation follows preparation, a paused exchange and an understanding check. Each moment includes the complete dialogue; move through it at your own pace.", moments: [
    { title: "Before the appointment", dialogue: "Worker to interpreter: We will discuss the appointment notice and the next step. Here are the terms used on the form. We have allowed time for each turn.", question: "What belongs in this briefing?", feedback: "Explain the topic and terms. Do not brief the interpreter on a judgment about the person's character. Confirm the arrangement and enough time for the actual conversation." },
    { title: "During the conversation", dialogue: "Worker, addressing the person: What would you like us to understand about this appointment? The worker stops speaking while the interpreter conveys the question and the person responds.", question: "Where does the worker's attention belong?", feedback: "Address the person and leave room for interpretation and their response. Avoid layering a second question over the first turn. When the interpreter joins remotely, keep direct attention to the person who is with you." },
    { title: "Before leaving", dialogue: "Worker: To check that I explained it clearly, how will this next step fit into your week? What should we clarify?", question: "How is this different from accepting a nod?", feedback: "The question checks the explanation and the usable next step without making a nod stand for understanding. Give the person time and an accessible way to respond." },
  ] },
  { courseId: "teams-in-minimization", lessonId: "tm-lines", title: "Bring the discussion back to the packet", intro: "A fictional team is discussing a late packet. Pause at each turn to consider how the chair can keep the work open to examination.", moments: [
    { title: "The discussion drifts", dialogue: "Colleague: Some people here just do not understand inclusion. Another colleague starts defending their awareness.", question: "What can the chair name without ranking either person?", feedback: "Name the drift toward evaluating people. Invite the team to describe what happened in the packet process and whose circumstances it assumed." },
    { title: "The chair redirects", dialogue: "Chair: Let us return to the packet. It arrived at the start of the meeting. Two people asked for reading time. What can we change about when it goes out?", question: "Which parts of this account can the group check?", feedback: "The arrival time and the requests are observations in this fictional scene. They give the team something to verify and change without assigning a developmental stage or motive." },
    { title: "The team records the next step", dialogue: "Chair: Who can send the next draft early enough for review? Let us agree the arrangement and check on Friday whether people had usable preparation time.", question: "What still needs agreement?", feedback: "Confirm the responsible role, practical timing and what the review will examine. A date alone does not show the change worked. A formal complaint belongs in its appropriate process." },
  ] },
  { courseId: "brain-injury-and-complex-disability", lessonId: "bi-pace-and-write-loop", title: "Agree on one topic and a next-step card", intro: "This fictional dialogue responds to a person's stated needs. It does not simulate an injury or ask the learner to test someone's memory.", moments: [
    { title: "Start with today", dialogue: "Person: A long meeting will not work for me today. Worker: Here are our previous notes. What still fits, and what is most useful to discuss today?", question: "What does offering the previous notes change?", feedback: "The person can refer to the record instead of being required to recall the last meeting. Ask about today's needs rather than assuming last month's arrangement still works." },
    { title: "Narrow the conversation", dialogue: "Person: I want to settle the transport question. Worker: Let us focus on that and leave the other topics for an agreed next conversation.", question: "Whose purpose organizes the shorter meeting?", feedback: "The person's stated transport question remains the purpose. Shortening the agenda supports that purpose; it is not a judgment about ability." },
    { title: "Put the next step in a usable form", dialogue: "Next-step card: Transport question — worker will check the available option; person prefers a written response; follow-up time to be agreed together.", question: "What must be confirmed before handing over the card?", feedback: "Confirm the actual responsible contact, response format and timing. Ask whether the card works for the person; it is an agreement aid, not a recall test." },
  ] },
];

export function LearningDialogue({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  const example = LEARNING_DIALOGUES.find(x => x.courseId === courseId && x.lessonId === lessonId);
  if (!example) return null;
  const id = `dialogue-${courseId}-${lessonId}`;
  return <section aria-labelledby={id} className="my-8 rounded-2xl border border-[#cbd8e2] bg-[#f3f7fa] p-5 sm:p-8">
    <p className="text-sm font-semibold uppercase tracking-wider text-[#425e75]">Fictional conversation</p>
    <h2 id={id} className="mt-3 text-2xl font-bold text-[#123f60]">{example.title}</h2>
    <p className="mt-4 leading-7">{example.intro}</p>
    {LEARNING_MOMENT_AUDIO[courseId] ? <p className="mt-3 text-sm leading-6">Optional audio uses synthetic English narration of the fictional scene. The complete spoken text appears below each player.</p> : null}
    {example.audio?.map(clip => <figure key={clip.file} className="m-0 mt-5 rounded-xl bg-white p-5">
      <figcaption className="font-bold">{clip.label}</figcaption>
      <audio controls preload="none" className="mt-3 w-full" aria-label={clip.label}><source src={`/audio/learning-examples/${clip.file}`} type="audio/wav" />Use the complete transcript below.</audio>
      <details className="mt-3"><summary className="cursor-pointer font-semibold">Read the complete transcript</summary><p className="mt-3 leading-7">{clip.transcript}</p></details>
    </figure>)}
    <ol className="mt-6 list-none space-y-5 p-0" aria-label="Conversation moments">
      {example.moments.map((moment, index) => <li key={moment.title} className="rounded-xl border border-[#cbd8e2] bg-white p-5">
        <h3 className="text-lg font-bold">{index + 1}. {moment.title}</h3>
        {LEARNING_MOMENT_AUDIO[courseId]?.[index] ? <audio controls preload="none" className="mt-3 w-full" aria-label={`Listen: ${moment.title}`}><source src={`/audio/learning-examples/${LEARNING_MOMENT_AUDIO[courseId][index]}`} type="audio/wav" />Read the complete scene below.</audio> : null}
        <blockquote className="mx-0 my-4 border-l-4 border-[#567d98] pl-4 leading-7">{moment.dialogue}</blockquote>
        <p className="font-semibold">{moment.question}</p>
        <details className="mt-3"><summary className="cursor-pointer font-semibold text-[#123f60]">Consider the response</summary><p className="mt-3 leading-7">{moment.feedback}</p></details>
      </li>)}
    </ol>
    <p className="mt-5 leading-7">In the lesson notes, draft a next line for a comparable conversation and explain what it would help you learn.</p>
  </section>;
}
