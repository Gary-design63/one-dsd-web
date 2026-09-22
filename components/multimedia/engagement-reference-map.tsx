import styles from "./engagement-diagrams.module.css";

type ReferenceExample = { title: string; rows: readonly (readonly [string, string])[] };
const examples: Record<string, ReferenceExample> = {
  "purpose": { title: "Start with the relationship", rows: [
    ["A person’s service experience", "Which part of the experience needs to be understood, and whose perspective is missing?"],
    ["DHS and its partners", "Identify the relevant county, Tribal Nation, provider or community relationship. These are different roles, not one chain of command."],
    ["A proposed change", "Find who can decide about this part of the work and how the people affected can inform it."],
  ] },
  "structure": { title: "Match the question to a function", rows: [
    ["A service question", "Begin with the relevant service area in the agency directory."],
    ["A payment or budget question", "Explore the financial operations information."],
    ["A workforce or technology question", "Distinguish Employee Culture responsibilities from MNIT support."],
    ["Before making a handoff", "Use the current directory to confirm the responsible function; a division name is a starting point."],
  ] },
  "dsd-placement": { title: "Keep the responsibilities distinct", rows: [
    ["Aging and Disability Services", "The organizational context in which the cited sources place Disability Services."],
    ["Disability Services Division", "Program expertise about the publicly funded supports described above."],
    ["DHS Licensing", "A separate licensing function. A retained license category does not establish DSD responsibility for it."],
  ] },
  "county-tribal": { title: "Different relationships, different purposes", rows: [
    ["County operational work", "County Relations supports DHS relationships with counties. Bring the relevant operational knowledge into the question."],
    ["Government-to-government consultation", "Use the appropriate Office of Indian Policy route for consultation with Tribal governments."],
    ["Community engagement", "Learn from people’s experiences and perspectives. This does not replace formal Tribal consultation."],
  ] },
  "assessment": { title: "Separate the handoffs in an assessment question", rows: [
    ["The person and planning partners", "Understand the support-planning experience and what the person wants clarified."],
    ["Lead-agency workflow", "Identify the relevant county, Tribal or managed-care relationship for the question."],
    ["Policy guidance", "Use DHS guidance and the CBSM for the policy question."],
    ["Application support", "Separate the technology question from policy and service planning. Using MnCHOICES does not establish system-administration responsibility."],
  ] },
  "person-centered": { title: "Keep the person’s choice in the conversation", rows: [
    ["Fictional expressed choice", "“I want to keep seeing the people I know in my community.”"],
    ["A question to understand it", "“Which relationships and activities would you like the plan to support?”"],
    ["Across partners", "Carry that stated goal into planning, provider discussions and transition questions, with the person’s chosen supports."],
  ] },
  "employment": { title: "Explore the employment question across partners", rows: [
    ["The person’s goal", "What kind of work would the person like to explore, and what support do they want?"],
    ["E1MN partnership", "The source connects DHS, DEED and the Department of Education."],
    ["Useful questions", "Distinguish employment exploration, development, ongoing support and benefits planning. Follow the relevant source for each."],
  ] },
  "licensing": { title: "Three questions to keep separate", rows: [
    ["Licensure", "Which current licensing requirements and processes apply? Check the licensing source."],
    ["MHCP enrollment", "What does the enrollment source require of the provider? A license is not the same question."],
    ["Individual service planning", "What needs to be addressed with the person’s lead agency? Do not infer authorization from licensure or enrollment."],
  ] },
  "transitions": { title: "Additional expertise alongside the existing process", rows: [
    ["Fictional transition question", "A person wants to return to community life, and the planning partners need help understanding a barrier."],
    ["Existing relationship first", "The hospital works with the person’s lead agency."],
    ["Additional technical assistance", "Explore whether Complex Transitions expertise can supplement that work. A request does not promise a placement outcome."],
  ] },
  "language-access": { title: "Follow the information through first contact", rows: [
    ["Ask about communication", "Ask which language and form of communication the person wants; do not infer this from appearance or identity."],
    ["Connect with the right support", "Identify the document owner and appropriate translation or interpretation support."],
    ["Check the next step", "Ask whether the information and the next contact are understandable. Keep the original language-access resources close at hand."],
  ] },
  "operations": { title: "Three questions, three starting points", rows: [
    ["“Where can I understand a payment?”", "Financial operations information."],
    ["“Where can I find information about disputing a service decision?”", "The appeals source and its current instructions."],
    ["“Where can I ask about records?”", "Privacy information and the data-request source."],
  ] },
  "behavioral-health": { title: "Separate the coordination and requirement questions", rows: [
    ["Care coordination", "How do the relevant services connect for the person?"],
    ["Service requirements", "What does the current CCBHC guidance require of the service?"],
    ["Coverage", "What does the relevant Medicaid source say about coverage?"],
    ["Provider responsibilities", "Check licensing and background-study information separately; these questions have their own sources."],
  ] },
  "mhcp": { title: "Separate the questions in a coverage journey", rows: [
    ["Eligibility", "Which program’s current eligibility information applies to the question?"],
    ["Enrollment", "Which county, Tribal or other partner relationship supports the enrollment step?"],
    ["Service delivery", "Which fee-for-service or managed-care relationship applies to that program? Check the source before assuming."],
  ] },
  "housing": { title: "Several questions around a chosen community goal", rows: [
    ["Fictional goal", "“I want to live in a community where I can keep the relationships that matter to me.”"],
    ["Housing", "What housing possibilities does the person want to explore?"],
    ["Services", "What support does the person want to make daily life work?"],
    ["Income supports", "Which current information is needed about resources and eligibility? Keep the individual answer with the responsible source."],
  ] },
  "legislative": { title: "Trace what a document can establish", rows: [
    ["A proposal", "What change is being suggested, and when was the proposal published?"],
    ["A fact sheet or report", "What evidence or explanation does this dated document provide?"],
    ["Law or funding", "Which enacted or budget source confirms what was decided and when it takes effect? A proposal alone cannot establish that."],
  ] },
};

/** Compact companions to the existing source-linked DHS reference cards. */
export function EngagementReferenceMap({ topicId, application }: { topicId: string; application: string }) {
  const example = examples[topicId.replace(/^ext-dhs-org-/, "")];
  if (!example) return null;
  return (
    <details className={styles.referenceExample}>
      <summary>Explore the relationships in a work question</summary>
      <table className={styles.comparison}>
        <caption>{example.title}</caption>
        <thead><tr><th scope="col">Question or relationship</th><th scope="col">What to consider</th></tr></thead>
        <tbody>{example.rows.map(([question, connection]) => <tr key={question}><th scope="row">{question}</th><td>{connection}</td></tr>)}</tbody>
      </table>
      <p className={styles.annotation}>{application}</p>
    </details>
  );
}
