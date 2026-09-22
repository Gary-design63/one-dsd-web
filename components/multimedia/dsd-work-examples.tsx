import styles from "./dsd-media.module.css";

type Step = { title: string; body: string; question?: string; actor?: string };
type Example = { title: string; intro: string; format?: "comparison" | "report"; steps: Step[]; carry: string };

/** Original fictional companions grounded in lib/dsd/index.ts; original source text is untouched. */
export const DSD_PROGRAM_EXAMPLES: Record<string, Example> = {
  "hcbs-policy": {
    title: "Where does an authorization request become extra work?",
    intro: "Imagine a person receives a request for information already supplied elsewhere. Follow the handoff before proposing another requirement.",
    steps: [
      { title: "Find the purpose", body: "The notice explains what information is needed, why it matters and how to ask for help.", question: "Can the person find the action in a language and format they use?" },
      { title: "Check for repeated work", body: "Staff check whether the same information was already supplied and whether it can be used for this decision.", question: "Which rule or evidence need makes another copy necessary?" },
      { title: "Explain what happens next", body: "The responsible role gives a usable next step and a way to follow up while the request is considered.", question: "Who will notice a delay, and what will they do about it?" },
    ],
    carry: "Choose one authorization handoff. Identify the person carrying the work, the verified reason for the step, and an alternative to examine with the policy owner.",
  },
  "mnchoices-access": {
    title: "A first contact that can lead somewhere",
    intro: "In this fictional assessment journey, the person asks for an interpreter and wants a trusted supporter included. Neither preference is inferred from their appearance or background.",
    steps: [
      { title: "Ask how to connect", body: "Confirm the requested language, communication method and who the person wants involved.", actor: "First-contact staff", question: "Can the person reach this conversation without first navigating an English-only message?" },
      { title: "Prepare the conversation", body: "Arrange the requested support, usable material and enough time for questions before the assessment conversation.", actor: "Assessment team", question: "Which arrangements still need an owner and confirmation?" },
      { title: "Keep the handoff visible", body: "Explain the next step, how the person can reach someone and who will follow up on a wait.", actor: "Named follow-up role", question: "How will the team learn whether this handoff worked?" },
    ],
    carry: "Trace the first contact for a service you know. Mark the point where a language or access request becomes a confirmed arrangement, with someone responsible for following through.",
  },
  "support-planning": {
    title: "Whose goal appears in the plan?", format: "comparison",
    intro: "Two invented planning notes concern the same person, who says they want to join a community writing group. Compare a service-centered entry with one that keeps the person's goal visible.",
    steps: [
      { title: "Service-centered entry", body: "“Continue the available weekly activity.” The note names a service, but says little about the person's interest or what would make participation possible.", question: "Where is the person's own goal, and what choices were discussed?" },
      { title: "Goal-centered entry", body: "“Explore the writing group the person chose. Ask what communication, timing or travel support they want, compare available options together and agree a follow-up.”", question: "Who needs to confirm each support, and how will the person shape the next decision?" },
    ],
    carry: "Review one plan without recording names or case details here. Separate the person's goal, the service or support proposed, and the question that still needs their input.",
  },
  "positive-supports": {
    title: "Look at the conditions around participation", format: "comparison",
    intro: "A fictional participant says a noisy arrival period makes a chosen activity difficult. This is a question about the setting and support, not a diagnosis or a behavior rating.",
    steps: [
      { title: "Close the opportunity", body: "“The activity is not a good fit. Remove it from the plan.” The response reaches a conclusion before asking what gets in the way.", question: "What goal or opportunity disappears with that decision?" },
      { title: "Explore support with the person", body: "“What would make arrival easier?” Consider the person's suggestions about the setting, preparation or timing with the appropriate support team.", question: "How will the person say whether an adjustment helps?" },
    ],
    carry: "Name an environmental or process barrier to examine before treating participation as an individual problem. Keep clinical and support decisions with the person and the appropriate qualified team.",
  },
  "olmstead": {
    title: "An available place is only part of the choice",
    intro: "A person in this invented planning example wants to stay connected with their neighborhood. Follow that goal through the options and the capacity questions.",
    steps: [
      { title: "Start with the person's direction", body: "Ask which relationships, places and ordinary activities the person wants to keep or build.", question: "What has the person said, and what has the team assumed?" },
      { title: "Compare real options", body: "Consider community settings and the supports each would need. Record an option that is unavailable rather than quietly treating it as unwanted.", question: "Which barrier is capacity, transportation, funding or another unresolved condition?" },
      { title: "Give the gap an owner", body: "Identify who can examine the missing support and how the person will hear what happens next.", question: "What would evidence of a meaningful choice look like?" },
    ],
    carry: "Distinguish a person's preference from a system capacity gap. Bring the gap, the available evidence and the responsible role into the next planning conversation.",
  },
  "employment": {
    title: "Keep the person's work goal in the comparison", format: "comparison",
    intro: "An invented job seeker says they enjoy organizing information and want paid work with a local business. Their expressed interest starts the discussion.",
    steps: [
      { title: "Begin with the available service slot", body: "“There is an opening in the current day program.” Availability answers a scheduling question, but does not yet explore the person's employment goal.", question: "Which employment possibilities have not been considered?" },
      { title: "Explore work and support together", body: "Discuss the tasks the person wants to try, relevant paid employment possibilities and the support or access arrangements they request.", question: "Who will explore an actual opportunity and return with an answer?" },
    ],
    carry: "Separate the stated work goal, a real opportunity to investigate and the support needed to pursue it. Do not treat a service placement alone as an employment outcome.",
  },
  "eidbi-children": {
    title: "Connect a family's question to a clear follow-up",
    intro: "A fictional family calls about children's services, requests a particular language and asks how to find out about provider availability. The map concerns access and follow-through, not clinical advice.",
    steps: [
      { title: "Hear the question", body: "Ask what the family wants to understand and confirm the language and communication support they request.", question: "Can they reach qualified language support at this contact?" },
      { title: "Prepare a usable conversation", body: "Explain the planning conversation and the information that will be discussed in an accessible format.", question: "Which questions should go to a qualified service or clinical professional?" },
      { title: "Own the availability follow-up", body: "Identify who will check the provider question and how the family can reach that person or role.", question: "How will the family know what has been found and what remains unresolved?" },
    ],
    carry: "Choose a provider-availability handoff to examine. Make the next contact, requested language support and responsibility for the unanswered question explicit.",
  },
  "tbi-guardianship": {
    title: "Offer support for a decision without taking it over", format: "comparison",
    intro: "In an invented planning conversation, a person asks for more time and a written explanation of two options. They also choose someone to help them discuss the information.",
    steps: [
      { title: "Substitute someone else's choice", body: "“This seems complicated, so we will choose for you.” The response assumes that needing support settles who should decide.", question: "What assumption replaced an inquiry into the person's wishes and support needs?" },
      { title: "Make the choice understandable", body: "“How would you like us to explain the options, and what help would you like while considering them?” Check understanding and the person's preferred next step.", question: "Which rights or legal-authority questions need the appropriate professional?" },
    ],
    carry: "Name a way to make information usable and a question about chosen support. Keep a person's communication needs separate from assumptions about their decision-making authority.",
  },
  "contracts-fiscal": {
    title: "Trace a requirement before it screens someone out",
    intro: "Imagine a draft grant application asks applicants to list several previous state contracts. Follow the requirement back to the capability the work actually needs.",
    steps: [
      { title: "Name the capability", body: "Describe the work a successful provider must be able to do, such as delivering a service in the required languages and formats.", question: "Does previous state contracting establish that capability?" },
      { title: "Compare evidence routes", body: "Consider whether a work example, relevant community experience or another permitted form of evidence can demonstrate the same capability.", question: "What would make the criteria consistent and accessible to applicants?" },
      { title: "Review with the rule owner", body: "Bring the proposed criteria and reporting expectations to procurement and contract owners before the solicitation is settled.", question: "Which requirements are fixed, and which can the owner revise?" },
    ],
    carry: "Choose one requirement. Record its purpose, who may be screened out, a credible alternative to examine and the role with authority to decide.",
  },
  "leadership-strategy": {
    title: "Connect an equity commitment to a decision",
    intro: "A fictional team wants translated information to be available when a program change begins. A general commitment becomes useful when the decision, capacity and response are clear.",
    steps: [
      { title: "Make the request concrete", body: "Identify the vital information, the people who need it and the decision date that shapes the work.", question: "What evidence and affected perspectives inform the request?" },
      { title: "Locate authority and capacity", body: "Identify who can decide, what translation and review capacity is needed and what tradeoffs remain open.", question: "Are resources and responsibilities agreed or still proposed?" },
      { title: "Explain the response", body: "Tell the team what was decided, what remains unresolved and when it can be reconsidered.", question: "How will the people affected learn what changed?" },
    ],
    carry: "Take one commitment from intention to a decision record: the request, evidence, responsible authority, resources and report-back. Do not assume that naming a role commits its time.",
  },
};

export const DSD_SCENARIO_EXAMPLES: Record<string, Example> = {
  "dsd-hiring-panel": {
    title: "Compare an impression with job-related evidence", format: "comparison",
    intro: "Imagine this position requires explaining service options clearly and coordinating a handoff. Those are fictional duties for examining the screening problem; the actual role still needs its own review.",
    steps: [
      { title: "Impression in the discussion", body: "“The answer was confident, and the graduate degree feels reassuring.” Neither observation yet states how the candidate demonstrated the agreed work.", question: "Which rating criterion did the panel actually apply?" },
      { title: "Evidence to examine", body: "“In the work example, the candidate explained two options, checked understanding and identified who would follow up.” Compare that evidence with the same written criteria for each candidate.", question: "Could relevant direct-support or community experience demonstrate those duties too?" },
    ],
    carry: "Replace one impression with an observable work example. Ask HR to examine the requirement and permitted alternatives; do not remove a required credential by assumption.",
  },
  "dsd-advancement-conversation": {
    title: "Make the next conversation specific", format: "comparison",
    intro: "These two fictional supervisor responses show the difference between general encouragement and a concrete development conversation.",
    steps: [
      { title: "Encouragement without a route", body: "“Keep doing good work. Your time will come.” The response leaves the next role, access to visible work and the employee's question unexplained.", question: "What can the colleague act on after this conversation?" },
      { title: "A next step to agree", body: "“Let's identify what the next role requires and what experience you already bring. We can discuss an openly offered project opportunity and take classification questions to HR.”", question: "What support and follow-up will be agreed rather than promised?" },
    ],
    carry: "Write one change to how visible work is offered and one question that needs HR or labor-relations guidance. Keep the person's interests part of the conversation.",
  },
  "dsd-accommodation-cliff": {
    title: "Keep access connected across the rotation",
    intro: "Follow the points where responsibility can disappear. The handoff concerns agreed arrangements, not an employee's diagnosis or private personnel information.",
    steps: [
      { title: "Offer and prepare", body: "Include access information with the rotation invitation for everyone. Identify the role responsible for confirming arrangements before the move.", actor: "Current and receiving teams", question: "Who owns the handoff through the established confidential process?" },
      { title: "Make the kickoff usable", body: "Plan captions, advance material and an alternative to activities that require speed. Ask participants which arrangements they need.", actor: "Cohort organizer", question: "Does participation depend on someone disclosing a condition to the room?" },
      { title: "Check the transition", body: "Ask whether the arrangements are working and respond to a missing support promptly through the appropriate route.", actor: "Receiving owner", question: "How can the pathway improve without identifying or rating the employee?" },
    ],
    carry: "Mark the role at each transition and how it receives the necessary arrangement. A withdrawal does not tell the division why someone left the opportunity.",
  },
  "dsd-service-redesign": {
    title: "Give the same next step more than one usable route",
    intro: "A self-service step can be one choice. This fictional access map keeps a real human route and a person's chosen support in view from the start.", format: "report",
    steps: [
      { title: "Online route", body: "A person who chooses it can use an accessible form, find help and understand what follows.", question: "Has the form been tested with the access methods people use?" },
      { title: "Phone or in-person route", body: "A staffed phone or in-person option can reach the same purpose without requiring the person to first fail online.", question: "Who staffs it, in which languages, and how can people reach it?" },
      { title: "Chosen support", body: "Ask who the person wants involved and what would make the decision understandable.", question: "Where does supported decision-making fit in each route?" },
      { title: "One clear handoff", body: "Every route ends with a usable explanation of the next step and the person or role responsible for follow-up.", question: "What extra work falls on the person when the routes do not connect?" },
    ],
    carry: "Trace one route from first contact to follow-up. Identify the staff capacity and access arrangements that make the route real, then ask people who would use it what is missing.",
  },
  "dsd-engagement-late": {
    title: "Put the invitation on the decision timeline",
    intro: "The decision in the scenario is approved and funded. A listening invitation should explain what remains open instead of implying influence that no longer exists.",
    steps: [
      { title: "Earlier input", body: "Another unit asked similar questions last year. Recover the purpose, commitments and unanswered report-back before asking again.", question: "Who already holds the relationship and the earlier material?" },
      { title: "Approval and funding", body: "Identify the decisions already made and the authority needed to revisit any of them.", question: "Is there a real choice that participants can still change?" },
      { title: "An honest invitation", body: "Explain the settled decision, any implementation choices still open, how input can affect them and how people will hear the response.", question: "Would the invitation still be accurate if no policy change is possible?" },
    ],
    carry: "Rewrite the invitation around an actual open choice, or describe it accurately as information sharing. Plan the outstanding report-back with existing relationship owners.",
  },
  "dsd-report-back": {
    title: "A report-back people can recognize", format: "report",
    intro: "This made-up four-part response follows listening about a meeting invitation. It demonstrates specificity without inventing a commitment about the program in the scenario.",
    steps: [
      { title: "What we heard", body: "“The reply instructions were hard to find, and a daytime discussion did not work for some participants.” Use a checked theme; quote a participant only with appropriate permission." },
      { title: "What changed", body: "“The draft invitation now puts the reply action first and offers a written contribution route.” Describe an actual change only after it has been made." },
      { title: "What remains open", body: "“An additional meeting time still needs an organizer and available capacity.” Explain the real constraint instead of promising the option." },
      { title: "What happens next", body: "Name the contact role, the next opportunity to influence the work and the agreed time to return with an answer." },
    ],
    carry: "Prepare a response in the languages, formats and channels used during engagement. Distinguish a completed change, an unresolved request and an agreed next step.",
  },
  "dsd-accessible-form": {
    title: "Repair the form and the route to using it", format: "comparison",
    intro: "This comparison describes the form problem without asking anyone to complete an inaccessible demonstration. The same required information should be usable through an accessible route.",
    steps: [
      { title: "A scan with no working route", body: "Text and blanks appear only as a picture. The person cannot navigate labeled fields, review the reading order or correct an error with a screen reader.", question: "What can the person use today while the original is fixed?" },
      { title: "A structured form to verify", body: "Headings explain the sections; every field has a programmatic label; instructions and errors are stated in text; keyboard navigation follows the task.", question: "Who will test it with assistive technology and confirm the release?" },
    ],
    carry: "Identify the form owner, an immediately usable alternative and a dated plan to fix and test the source form. A visual resemblance to a form is not evidence that it can be completed.",
  },
  "dsd-interpreter-first-contact": {
    title: "Move language access to the first contact", format: "comparison",
    intro: "These English text examples describe the service arrangement. They are not translated greetings or a substitute for qualified interpretation.",
    steps: [
      { title: "Wait for the return call", body: "An English-only message asks the caller to leave information. Language support is available only after someone calls back.", question: "How does the caller understand the message or leave the information needed?" },
      { title: "A route to a supported conversation", body: "A usable first-contact route helps the caller state the language they request and reach a staff member with qualified interpretation. Staff explain what happens next and check understanding.", question: "Who operates the route and verifies its language choices and availability?" },
    ],
    carry: "Check the first phone contact, not only the translated documents. Take the demonstrated gap and proposed staffing arrangement to the intake owner and language-access coordinator.",
  },
  "dsd-team-silence": {
    title: "Connect ways to contribute with visible influence",
    intro: "This fictional meeting sequence changes the process around contribution. It does not explain why any particular colleague is quiet.",
    steps: [
      { title: "Before the meeting", body: "Share the decision and material in advance. Offer a written route so ideas need not compete for a fast speaking turn.", question: "Can people understand what their input can change?" },
      { title: "During the discussion", body: "Bring written and spoken contributions into the same discussion. The supervisor leaves room before adding their own view.", question: "Which evidence or option was added because someone contributed?" },
      { title: "After the decision", body: "Explain what changed, what did not and why. Credit contributions appropriately and say what remains open.", question: "Will colleagues be able to see how their input was considered?" },
    ],
    carry: "Choose one observable meeting practice and one way to check whether it helped. Speaking frequency alone does not measure belonging, agreement or influence.",
  },
  "dsd-repair-after-harm": {
    title: "A leader can name the problem and change the next step", format: "comparison",
    intro: "These fictional responses address the unchallenged generalization in the scenario. They do not ask affected staff to explain or represent a community.",
    steps: [
      { title: "Leave the generalization in place", body: "“We know nobody meant anything by it. Let's move on.” The response centers an assumed intention and leaves the claim unexamined.", question: "What message does the room receive about whether the statement was accepted?" },
      { title: "Take responsibility for repair", body: "“I should have paused that generalization. It does not tell us what this person or family wants. Let's identify the evidence we need and the question we should ask.”", question: "What support and follow-through will help the behavior change?" },
    ],
    carry: "Prepare a short response that names what happened, takes responsibility and changes the next action. Use the established confidential route when the situation requires it.",
  },
  "dsd-leadership-bottleneck": {
    title: "Separate the safeguard from the waiting",
    intro: "A fictional decision record can make a stalled approval discussable without assuming the step can simply be bypassed.",
    steps: [
      { title: "Recover the reason", body: "Find what risk the approval step was meant to address and the evidence that it still needs this treatment.", question: "Is the reason documented or only repeated as a habit?" },
      { title: "Identify the decision right", body: "Name the role with authority to retain, revise or remove the step and what that role needs to decide.", question: "Which teams and people bear the cost of waiting?" },
      { title: "Compare a proportionate alternative", body: "Describe another way to address the risk, its resources and limits, and the point at which results would be reviewed.", question: "Who can agree the change and explain the decision to the waiting teams?" },
    ],
    carry: "Bring the owner a short comparison: purpose, current delay, affected work, alternative and follow-up. A process map can expose an unresolved decision; it cannot supply the authority to make it.",
  },
};

export function DsdWorkExample({ example, id }: { example: Example; id: string }) {
  return <section id={id} className={styles.example} aria-labelledby={id + "-title"}>
    <div className={styles.header}><p className={styles.eyebrow}>Fictional worked example</p><h2 id={id + "-title"} className={styles.title}>{example.title}</h2><p className={styles.intro}>{example.intro}</p></div>
    <ol className={`${styles.flow} ${example.format ? styles[example.format] : ""}`}>{example.steps.map(step => <li className={styles.step} key={step.title}><h3>{step.title}</h3><p>{step.body}</p>{step.actor && <span className={styles.actor}>{step.actor}</span>}{step.question && <p className={styles.question}>{step.question}</p>}</li>)}</ol>
    <p className={styles.carry}><strong>Bring it into your work:</strong> {example.carry}</p>
  </section>;
}
