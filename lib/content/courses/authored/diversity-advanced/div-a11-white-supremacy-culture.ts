import type { CoursePack } from "../../source-types";
import { intermediatePack } from "../diversity-intermediate/build";

const id = "div-a11-white-supremacy-culture";

const base = intermediatePack({
  id,
  number: 21,
  title: "White Supremacy Culture: Examine Workplace Norms",
  subtitle: "Use a well-known framework to question whose knowledge counts, how decisions are made, and what changes in practice could make public service more equitable.",
  sources: [
    {
      title: "Tema Okun, White Supremacy Culture: Characteristics (updated 2025)",
      href: "https://www.whitesupremacyculture.info/characteristics.html",
      note: "The primary framework. Okun describes it as an analytical tool, cautions against using it to accuse people, and distinguishes high standards from perfectionism and sound writing from treating written words as the only valid knowledge. The framework draws on practice and reflection; the original list was not an empirical diagnostic instrument.",
    },
    {
      title: "Tema Okun, Racial Equity Principles",
      href: "https://www.whitesupremacyculture.info/racial-equity-principles.html",
      note: "Companion principles for shared power, accountability, and more equitable ways of working. Read alongside the characteristics, as the author recommends.",
    },
    {
      title: "Minnesota Department of Human Services, Equity Policy",
      href: "https://mn.gov/dhs/assets/equity-policy_tcm1053-646921.pdf",
      note: "Agency policy on considering equity in daily work and using the DHS Equity Analysis Toolkit for decisions across policy, budgets, procurement, hiring, and service delivery. This course is learning material, not a substitute for the policy.",
    },
    {
      title: "State of Minnesota, Equity Analysis Toolkit",
      href: "https://mn.gov/oeoa/resources/equity-analysis-toolkit/",
      note: "A state-government resource for asking who is affected, engaging people meaningfully, and reviewing equity impacts in a decision.",
    },
    {
      title: "O'Donovan and McAuliffe, systematic review of speaking-up and psychological-safety interventions",
      href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7011517/",
      note: "A peer-reviewed review finding mixed results from interventions to improve psychological safety and voice. It supports checking effects rather than assuming a single workshop or invitation changes a workplace.",
    },
  ],
  lessons: [
    {
      title: "Understand the framework without labeling people",
      objectives: ["Explain what the framework is intended to examine.", "Distinguish a workplace pattern from a person's racial identity or motive.", "Identify the limits of this framework as evidence."],
      teaching: [
        "Tema Okun's White Supremacy Culture framework grew from antiracism organizing with Kenneth Jones and many other contributors. It names habits that can become normal in institutions shaped by racial hierarchy. The phrase concerns patterns of power and whose standards are treated as universal. It does not mean that every white person acts alike, that only white people can reproduce a pattern, or that a single workplace habit proves someone is a white supremacist. People of every race can be affected by organizational rules; the effects and risks are not necessarily equal.",
        "The framework is a lens for inquiry, not a checklist that diagnoses a coworker or settles why a particular decision happened. Okun says the original list came from years of practice and reflection, not from a formal research study. It is one way to ask better questions. Evidence about a local decision still matters: what rule was used, who shaped it, who could participate, what happened, and what other explanations are plausible? Avoid turning a useful question into a certainty the evidence cannot support.",
        "For DHS work, begin with a process rather than a person. A team might notice that proposals are accepted only when delivered in a polished written memo. Written records can protect accountability and accessibility. The question is whether the team also has an accessible way to hear, document, and fairly assess relevant knowledge from staff or community members who communicate differently. Formal legal requirements remain in place. The aim is to examine an unnecessary barrier while preserving the requirements that serve a legitimate purpose.",
      ],
      case: "Fictional case: A DSD team is reviewing a service notice. A staff member says the team may be overlooking comments from people who use plain language, an interpreter, or an assistive communication method. Another member calls the concern an accusation that the team is racist. The concern actually points to a review process: which comments were invited, recorded, and considered? No conclusion about any team member's character is needed to check that process.",
      question: "What is the strongest first response?",
      options: ["Decide which colleague is a white supremacist before reviewing the notice.", "Trace how comments reached the team and how each was considered, without assigning motives.", "Dismiss the concern because the team intended to be fair."],
      reasons: ["The framework is not a tool for labeling a colleague's identity or motives.", "A process review gives the team observable evidence and a path to improvement.", "Good intent alone does not show that the invitation or review worked for everyone."],
      check: "What can Okun's framework establish by itself?",
      answer: "A question worth investigating about a workplace pattern, not a verdict about a person or a specific outcome.",
      distractors: ["A coworker's hidden beliefs and motives.", "Proof that every instance of urgency or careful writing is racially harmful."],
      explanation: "Treat the framework as a prompt to examine power and impact with evidence, not as a diagnostic test.",
      reflection: "Which routine in your work feels so normal that its purpose is rarely discussed? You may use the fictional case and need not disclose a personal experience.",
      practice: "For the fictional notice, write one question about the process, one piece of evidence to examine, and one question to ask an affected person only if participation is invited and accessible.",
    },
    {
      title: "Notice standards that may narrow participation",
      objectives: ["Describe several characteristics in the source framework without treating them as fixed traits.", "Distinguish necessary standards and deadlines from avoidable barriers.", "Propose a more accessible way to gather knowledge."],
      teaching: [
        "Okun's original list names perfectionism; a sense of urgency; defensiveness or denial; quantity over quality; treating the written word as the only valid knowledge; one right way; paternalism; either/or thinking; power hoarding; fear of open conflict; individualism; defining progress as more; a right to profit; claims of objectivity; and a right to comfort. The updated website groups and revises these ideas, adding more attention to fear and intersecting forms of power. You do not need to memorize the list. Use the characteristics that illuminate a real decision, and check the author's updated explanation before using a term.",
        "A deadline may be required by law, safety, or a commitment to people waiting for services. Calling every deadline harmful would be careless. The concern is manufactured urgency that leaves no time to hear people affected, test an assumption, or correct an avoidable error. Similarly, quality checks and clear writing are valuable. The problem is a standard so narrow or punitive that it discourages questions, hides mistakes, or excludes useful knowledge. Ask what the standard protects, who can meet it, and whether another method would protect the same purpose with less burden.",
        "The distinction between a written record and 'worship of the written word' matters in public service. DHS often needs an accurate record of decisions and reasons. That does not require every contribution to arrive as a polished English memo. A spoken comment, an interpreted conversation, an accessible form, or a community meeting can be documented and considered through a sound process. Staff should follow records, privacy, accessibility, and language-access requirements while widening the routes by which relevant evidence can be heard.",
      ],
      case: "Fictional case: A project team has ten days to recommend changes to a DSD information sheet. The due date is real, but only staff who can submit a two-page written memo by the next morning are invited to comment. The team can keep the deadline and still ask what shorter or more accessible feedback routes are possible, how they will document responses, and whether more time is needed for an affected group's input.",
      question: "Which revision preserves accountability while widening participation?",
      options: ["Remove the deadline and all documentation requirements without checking why they exist.", "Keep the required due date, offer accessible response routes, document input, and disclose what could not be gathered in time.", "Keep the memo-only rule because a written record is the only reliable form of knowledge."],
      reasons: ["The team must understand and meet legitimate requirements.", "This protects the deadline and record while testing avoidable barriers and naming a real limit.", "An accountable written record can be made from several accessible ways of contributing."],
      check: "Which statement best describes the framework's concern about urgency?",
      answer: "Routine pressure can become a reason to bypass participation and reflection even when a better process is possible.",
      distractors: ["Every deadline is unnecessary.", "Speed always proves a decision is fair."],
      explanation: "Examine the source of the deadline and its effects. Preserve real obligations while removing avoidable exclusion.",
      reflection: "Where does your team distinguish a legal or service deadline from a preferred internal pace? What input might be lost when the two are treated as the same?",
      practice: "Draft a two-route feedback invitation for the fictional information sheet. Include a way to capture comments in the record and a sentence explaining the deadline honestly.",
    },
    {
      title: "Examine power, disagreement, and who decides",
      objectives: ["Identify where decision authority sits in a routine process.", "Distinguish a respectful challenge from an accusation about someone's character.", "Design a response that makes disagreement and decision reasons visible."],
      teaching: [
        "Power hoarding, paternalism, and fear of open conflict can interact. A manager may sincerely want to protect a schedule and still make every substantive decision before people affected can respond. A team may ask for input while keeping the criteria and final reasons private. Silence in a meeting does not prove agreement. People may need time, a different format, or confidence that a respectful question will not be punished. None of these observations tells us a leader's secret motive; they direct attention to the design of the decision.",
        "Shared power does not mean pretending that every participant has the same legal authority. In state government, a manager may be accountable for a decision, and staff may have duties they cannot transfer. A more equitable process makes the scope of participation honest: which parts are open to change, who will decide, what evidence will be used, and how will the team explain its answer? It also gives people a way to disagree without making public disclosure of identity or past harm a condition of being heard.",
        "Research on employee voice and psychological safety suggests that invitations alone are insufficient; the response to concerns and the fairness of procedures matter. The available intervention evidence is mixed, so a listening session is not proof that people feel safe or that the decision improved. Look at what happened after a concern was raised. Were questions answered? Was a reason given? Did an option change? What remains unresolved? When an issue calls for a formal workplace response, use the proper channel rather than turning a course discussion into an investigation.",
      ],
      case: "Fictional case: A DSD manager proposes a new method for reviewing provider-facing instructions. A staff analyst says the change could make a step harder for people using screen readers. The manager thanks the analyst but closes the meeting without deciding who will test the concern or when the group will hear back. The analyst's suggestion has been heard, but it has not yet been considered in a visible decision process.",
      question: "What should the manager do next?",
      options: ["Treat the analyst's question as disloyal and move on.", "Assign an accessibility review, explain who decides and when, and return with reasons and any change made.", "Announce that listening has already solved the problem."],
      reasons: ["A relevant concern should not be punished or dismissed as a character issue.", "This connects input to an accountable decision and a clear response.", "An invitation to speak is only a first step; the effect still needs to be checked."],
      check: "What does meaningful participation require after someone raises a concern?",
      answer: "A clear way for the concern to be evaluated and for the decision and reasons to be shared.",
      distractors: ["A promise that every suggestion will be adopted.", "A meeting invitation, even if no response follows."],
      explanation: "People need an honest account of decision authority and what happened to their input.",
      reflection: "In the fictional case, what would make it easier for someone to raise a second concern if the first did not lead to a change?",
      practice: "Write a short follow-up note for the fictional manager: the concern, who will review it, when the decision will return, and how the reasons will be shared.",
    },
    {
      title: "Change one process and check what happened",
      objectives: ["Select a process change within an appropriate role.", "Connect the change to people affected and to a documented decision purpose.", "Choose evidence that could reveal improvement or an unintended burden."],
      teaching: [
        "The course is useful only if it helps someone make a better decision. Choose one routine: how an opportunity is announced, how a notice is reviewed, how community input reaches a project, or how a service concern is escalated. State its purpose and any legal, policy, privacy, accessibility, or program-integrity obligations. Then ask which assumptions are built into its current steps. Who gets information early? Whose knowledge counts? Who can question the result? Do not assume the framework alone tells you the answer.",
        "Use the DHS Equity Analysis Toolkit or the State of Minnesota Equity Analysis Toolkit to structure a decision where appropriate. Identify who is affected, what information is missing, how people can participate without undue burden, what alternatives exist, and how effects will be reviewed. A staff member might identify a gap and bring it to the person with authority; a supervisor might change an invitation or response practice; a manager might revise criteria or resource the review. Make the action fit the role and follow agency processes. Do not collect sensitive personal stories merely to make the exercise feel authentic.",
        "Choose a small number of meaningful checks. Counting invitations tells you little if people could not use them. More useful questions are whether intended participants received and understood the invitation, whether their input was considered, whether an accessibility barrier remained, and whether the decision was explained. Look for unintended effects: did an extra form create new work, did a written summary misrepresent a spoken contribution, or did a shortened deadline shift the burden elsewhere? Review and revise. This is practice, not a certification that a team has overcome racism.",
      ],
      case: "Fictional case: A cross-team group revises a service guide. It decides to offer both a short written form and an accessible conversation for feedback, with a documented summary of each. A manager names who will decide and commits to explaining which suggestions were adopted and why. The group still needs to check whether the routes were usable and whether the final guide works for people who rely on it.",
      question: "Which observation would best help the group learn from the change?",
      options: ["The group held a meeting and sent an invitation.", "The intended participants could use the feedback routes, their input reached the decision, and remaining barriers were documented.", "The manager described the process as equitable."],
      reasons: ["Activities alone do not show that participation worked.", "This checks access, decision use, and limits rather than only the team's intention.", "A label does not replace evidence about the process and its effects."],
      check: "What is a sound use of this framework at work?",
      answer: "Use it to ask testable questions about a process, make a proportionate change, and review its effects.",
      distractors: ["Use it to diagnose coworkers based on race or personality.", "Treat one revised form as proof that inequity has ended."],
      explanation: "The framework prompts inquiry; responsible action needs role clarity, evidence, participation, and follow-up.",
      reflection: "Which step in the fictional guide process is most likely to remain invisible unless the group asks about it?",
      practice: "Complete the job aid for the fictional guide or a nonidentifying process you can influence. Name the purpose, a possible barrier, the evidence to seek, the responsible decision-maker, one change, and a review date. Use the established equity-analysis and workplace channels for an actual decision.",
    },
  ],
  aid: {
    title: "Examine a workplace norm without labeling a person",
    sections: [
      { heading: "Name the process", items: ["State the decision, its purpose, and the actual requirement or deadline.", "Write down who has authority and what can change."] },
      { heading: "Ask whose knowledge counts", items: ["Identify who can participate and how their input enters the record.", "Look for a relevant perspective or access need that the process may miss."] },
      { heading: "Test a possible barrier", items: ["Separate an observation from an assumption about motive or identity.", "Use available evidence and ask affected people only through respectful, accessible participation."] },
      { heading: "Change and review", items: ["Choose a proportionate step within the responsible role and explain the decision.", "Check whether the step improved access or created another burden; revisit it when needed."] },
    ],
  },
});

const pack: CoursePack = {
  ...base,
  course: {
    ...base.course,
    indexNumber: 1331,
    seriesLabel: "Diversity learning · Advanced",
    scope: "For One DHS and One DSD staff, supervisors, and managers who want to examine workplace norms and public-service decisions. All lessons are open without prerequisites; participation is voluntary. Fictional cases allow practice without personal disclosure. This course does not diagnose people or replace DHS policy, legal requirements, or formal workplace processes. Completion does not count toward DHS-required training credits unless management, a director, or DHS leadership expressly approves an exception.",
    treatment: "Four substantive lessons with source context, fictional DHS and DSD cases, response practice, feedback, private reflection, and a reusable process-review aid.",
    duration: "About 48 minutes, plus optional practice",
    coverImage: "/images/covers/white-supremacy-culture-workplace.png",
    coverAlt: "Four colleagues in a meeting room reviewing a proposed work process together.",
    introTranscript: "Examine familiar workplace routines through a framework about power and participation. Consider the evidence, avoid labeling people, and practice one change that can be reviewed.",
    governance: {
      contentOwner: "One DHS / One DSD — People, Access and Culture",
      reviewers: [],
      evidenceDate: "2026-09-24",
      lastReviewed: "2026-09-24",
      nextReview: "2027-03-24",
      updateTriggers: ["A material change in the primary framework or DHS equity policy", "A correction to a cited source or a course example"],
      relatedDoor: "/learn",
      toolkitQuestion: "Whose knowledge counts in this decision, and what evidence would show that the process is fair and accessible?",
      status: "current",
    },
  },
};

export default pack;
