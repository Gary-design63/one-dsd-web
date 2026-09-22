import styles from "./dsd-media.module.css";

type WorkedMap = { goal: string; practice: string; support: string; evidence: string; feedback: string; returnTo: string };
const maps: Record<string, WorkedMap> = {
  evidence: {
    goal: "Explain the difference between an observation and an interpretation when reviewing a proposed process change.",
    practice: "Use a fictional intake example to mark what a small review group knows, assumes and still needs to ask.",
    support: "A colleague helps choose a manageable example and makes time for a practice review. Use a format everyone can work with.",
    evidence: "A revised comparison that separates recorded facts from assumptions and identifies one unresolved question.",
    feedback: "Ask the colleague which conclusion was supported and where the reasoning still made a leap.",
    returnTo: "After the review, compare the first and revised explanations. Use the next conversation to decide what evidence to seek.",
  },
  communication: {
    goal: "Facilitate a short decision discussion where written and spoken contributions receive attention.",
    practice: "Co-facilitate one agenda item. Share the question in advance, invite more than one way to respond, and explain how the group will use input.",
    support: "A co-facilitator provides preparation time, an accessible agenda and a brief feedback conversation after the meeting.",
    evidence: "An agenda and a decision summary showing which contribution changed an option or raised an unresolved question.",
    feedback: "Ask the co-facilitator how contributions entered the decision and where the invitation remained unclear.",
    returnTo: "If written input arrived too late for discussion, adjust the timing before the next meeting and check whether the change helped.",
  },
  access: {
    goal: "Find and address one barrier in how colleagues use a meeting document.",
    practice: "Review a sample agenda for structure, clear links and understandable next actions, then invite a willing colleague to try it.",
    support: "Arrange work time and help from the appropriate accessibility resource. Invite preferences without requesting a diagnosis.",
    evidence: "The revised agenda, the task someone tried and the barrier that was removed or remains unresolved.",
    feedback: "Ask whether the person could find the decision and next action using their preferred way of working.",
    returnTo: "Revise the part that still caused difficulty and ask whether the next version works better; one review does not establish universal accessibility.",
  },
  opportunity: {
    goal: "Make a small development opportunity easier to discover and enter.",
    practice: "Help a supervisor describe a supported co-leading task, invite expressions of interest and explain how participation will be decided.",
    support: "Agree time, preparation, access and feedback with the task owner before offering the opportunity.",
    evidence: "A clear invitation and a record of which support was actually provided, without ranking individual potential.",
    feedback: "Ask whether the invitation explained the task and whether the agreed learning time was available.",
    returnTo: "If urgent work displaced the practice time, revise the workload arrangement before offering another assignment.",
  },
  decisions: {
    goal: "Explain a workforce decision using the work requirement, available evidence and an unanswered question.",
    practice: "Review a fictional role criterion with a hiring partner and compare two credible ways someone could demonstrate the capability.",
    support: "Use a practice example and obtain guidance from the appropriate hiring or HR partner before applying a change.",
    evidence: "A criterion-to-duty comparison that explains what each example does and does not demonstrate.",
    feedback: "Ask the partner where the criterion remained vague or gave unnecessary weight to a familiar background.",
    returnTo: "Revise the explanation and identify the proper next review. A practice map does not change selection requirements or guarantee advancement.",
  },
  continuity: {
    goal: "Help a colleague carry out a recurring handoff with enough context to make the next decision.",
    practice: "Write a short handover for a fictional monthly review and let a colleague walk through it while you observe.",
    support: "Provide practice time, accessible materials and a clear contact for decisions that need the process owner's authority.",
    evidence: "A revised handover showing the missing decision context discovered during the walkthrough.",
    feedback: "Ask which next step was clear and where the colleague had to rely on knowledge that was not written down.",
    returnTo: "Test the revised handover again and make the learning opportunity available through a clear, open process.",
  },
  "self-examination": {
    goal: "Notice one moment where your own norm was treated as neutral or universal, and name whose norm it actually was.",
    practice: "Review a fictional meeting note or piece of feedback and ask what default was applied without being named, and who had to adapt to it.",
    support: "A colleague or supervisor helps you look at the example honestly, without treating the exercise as a personal judgment.",
    evidence: "A specific example of your own default named plainly, not a general statement about valuing difference.",
    feedback: "Ask a trusted colleague whether the example rings true, and whether they noticed the same default in the same moment.",
    returnTo: "Revisit the example after a few weeks and see whether you now notice similar moments as they happen, not only afterward.",
  },
};

export function DsdDevelopmentMapExample({ capabilityId }: { capabilityId: string }) {
  const example = maps[capabilityId];
  if (!example) return null;
  return <details className={styles.miniMap}>
    <summary>See a fictional map for this capability</summary>
    <p>This example shows how a goal connects with supported practice and feedback. Use your own situation in the fields below.</p>
    <dl>
      <dt>Learning goal</dt><dd>{example.goal}</dd>
      <dt>A manageable practice</dt><dd>{example.practice}</dd>
      <dt>Support and access</dt><dd>{example.support}</dd>
      <dt>Evidence to keep</dt><dd>{example.evidence}</dd>
      <dt>A feedback question</dt><dd>{example.feedback}</dd>
      <dt>Return and adjust</dt><dd>{example.returnTo}</dd>
    </dl>
  </details>;
}

export function DsdContinuityExample() {
  return <details className={styles.miniMap}>
    <summary>See a fictional handover and readiness check</summary>
    <p>A team wants more than one colleague to be able to prepare a recurring review. The example follows the work and its decision points.</p>
    <dl>
      <dt>Critical work</dt><dd>Prepare a monthly list of unresolved cross-team handoffs for the process owner to review.</dd>
      <dt>Capability needed</dt><dd>Distinguish a missing update from an unresolved decision and direct each question to the right role.</dd>
      <dt>Open opportunity</dt><dd>Invite interested colleagues to shadow and then co-prepare one review, with agreed time, accessible materials and feedback.</dd>
      <dt>First handover</dt><dd>A checklist names the files and the sequence, but does not explain when the process owner must decide.</dd>
      <dt>Readiness check</dt><dd>A colleague tries a fictional case. They find the files but cannot tell who may resolve the exception. That identifies a gap in the handover, rather than establishing a lack of potential.</dd>
      <dt>Revise and test</dt><dd>Add the decision boundary and the responsible role, then repeat the walkthrough. Keep appropriate process knowledge in the approved workplace location.</dd>
    </dl>
    <p>A useful readiness check observes a task with its support in place. This learning plan does not designate a successor or replace a selection process.</p>
  </details>;
}
