/**
 * Practice paths added in the September 12, 2026 practice-infrastructure pass (GP-12 and GP-13).
 * Same contract as GP-1 to GP-11: scaffold, practice with real work, review, optional handoff.
 * Both are voluntary self-checks for a person's own routine decision or own material. Neither
 * approves anything; the decision owner or content owner still decides.
 */
import type { GraduationPath, RubricRule } from "./paths";

const COMMON_RUBRIC: RubricRule[] = [
  { key: "owners", label: "Every follow-up has a named owner", failMessage: "Please name the person responsible for each follow-up." },
  { key: "review_date", label: "A next review date is set", failMessage: "Please choose a specific date to review this work again." },
  { key: "specific_work", label: "This is connected to your specific work", failMessage: "Please name the decision, message, or material this is for." },
];

const ACCESS_RULE: RubricRule = { key: "access", label: "Language, disability, and communication access were considered for this work", failMessage: "Please note the access checks you completed, including language, disability and communication access, and what you found." };
const INVOLVED_RULE: RubricRule = { key: "involved", label: "You named who was involved and the role they had", failMessage: "Please list who you checked with or who should look at this, and what role or authority they have." };
const NOT_ASSUMED_RULE: RubricRule = { key: "not_assumed", label: "You noted what you chose not to assume", failMessage: "Please note what you chose not to assume about the people affected." };
const NO_NAMES_RULE: RubricRule = { key: "no_named_parties", label: "No names of employees, clients, or complainants are included", failMessage: "Please leave out individual names. Describe the decision and the people it affects in general terms." };

export const PRACTICE_INFRASTRUCTURE_PATHS: GraduationPath[] = [
  {
    id: "gp-12",
    title: "Equity Pause for a routine decision",
    staffLabel: "I'm making a routine decision and want a quick equity check",
    signals: ["A meeting invitation, announcement, or internal notice about to go out", "A small change to a process, schedule, or form", "A routine choice with limited reach that you could still adjust"],
    startingCompetence: "You are about to make a routine decision and want a short, honest check of who it affects and what you might change before it goes out.",
    graduatedLooksLike:
      "By the end, you will have a short record of the decision: who is affected differently, who can change it, the access needs you checked, what you know and do not know yet, one alternative you considered, and your next step with a review date. You can complete routine decisions on your own and recognize when a fuller analysis applies.",
    launchType: "program_service",
    askStarters: [
      "I am sending a division-wide meeting invitation. What should I check before it goes out?",
      "Is this small change to our intake schedule something that needs an equity look, or can I go ahead?",
      "Which routine decisions deserve an equity pause before they go out?",
    ],
    steps: [
      { key: "ask", title: "Ask the first question", guidance: "Describe the decision in a sentence and ask what to check. The response includes its sources and says when a fuller review applies.", links: [{ label: "Browse common questions", href: "/ask?path=gp-12" }] },
      { key: "ci", title: "Consider community context", guidance: "If the decision reaches particular Minnesota communities, read the relevant brief for access needs and what not to assume.", links: [{ label: "Explore Minnesota Communities", href: "/minnesota-communities" }], optional: true },
      { key: "resources", title: "Choose practical resources", guidance: "Use the plain-language and language access checklists for anything people will read. If the decision turns out to have real reach, the toolkit companion shows what a scan or full analysis asks.", links: [{ label: "Plain language and accessible documents", href: "/resources/ja-plain-language" }, { label: "Language access checklist", href: "/resources/ja-language-access-checklist" }, { label: "Equity Analysis Toolkit companion", href: "/learn/equity-toolkit" }, { label: "Record this pause in the open register (optional)", href: "/equity-policy/analysis?kind=pause" }] },
      { key: "artifact", title: "Write your pause", guidance: "Answer the questions for this decision. Your notes are saved only on this computer, so please leave out names and case details.", links: [] },
      { key: "selfcheck", title: "Review your pause", guidance: "Confirm the decision is specific, you checked access, you know who can change it, you noted what you did not assume, and you have a next step with a date. If the reach or the stakes are larger than you first thought, move to the Equity Analysis Toolkit.", links: [{ label: "Equity analysis for a decision", href: "/practice/gp-7" }] },
      { key: "consult", title: "Talk it through (optional)", guidance: "Most routine decisions do not need a conversation. If a question remains, or the decision affects people more than you expected, a consultation or the right office can help.", links: [{ label: "Find the right person", href: "/support/right-person" }] },
    ],
    artifactTitle: "Equity Pause",
    artifactFields: [
      { id: "work_name", label: "The decision, in one sentence", help: "Name the meeting, notice, change, or choice. Not a person.", type: "text", required: true, rubric: "specific_work" },
      { id: "affected", label: "Who this affects, and who it affects differently", help: "Think about language, disability, schedule, location, technology, trust, and who might miss it entirely.", type: "textarea", required: true },
      { id: "involved", label: "Who can change this decision, and who you checked with", help: "The role that decides, and anyone you asked before settling it.", type: "textarea", required: true, rubric: "involved" },
      { id: "access_checks", label: "Access needs you checked", help: "Plain language, an accessible format, interpretation or translation, timing, and a way to take part or respond that does not require one channel.", type: "textarea", required: true, rubric: "access" },
      { id: "known", label: "What you know, and what you do not know yet", help: "Evidence you have, and the question you would ask if you had five more minutes.", type: "textarea", required: true },
      { id: "alternative", label: "One alternative that would reduce a barrier", help: "A different time, format, channel, wording, or usual choice. Note whether you chose it, and why.", type: "textarea", required: true },
      { id: "not_assumed", label: "What you chose not to assume", help: "About the people affected and how they will receive this.", type: "textarea", required: true, rubric: "not_assumed" },
      { id: "owners", label: "Your next step, and who is responsible", help: "One line for each step, including who does it.", type: "list", required: true, rubric: "owners" },
      { id: "review_date", label: "When you will look at this again", help: "Choose a date after the decision has had an effect.", type: "date", required: true, rubric: "review_date" },
    ],
    rubric: [...COMMON_RUBRIC, ACCESS_RULE, INVOLVED_RULE, NOT_ASSUMED_RULE, NO_NAMES_RULE],
    antiPerformative: {
      fake: ["A pause completed after the decision already went out", "\"No one is affected\" with no one asked", "A check that never names a next step"],
      real: ["A specific decision, the people it affects differently, and one thing you changed or kept with a reason", "A clear sense of whether a fuller analysis applies"],
    },
    privacy: "Describe the decision and the people it affects in general terms. Do not include names or case details. Your notes are saved only on this computer and are not used to rank anyone.",
    consultSupportType: "equity_embed_review",
  },
  {
    id: "gp-13",
    title: "Checking your own material for access, assumptions, and tone",
    staffLabel: "I'm checking something I wrote before I share it",
    signals: ["A notice, email, web page, slide deck, or training material you wrote", "A job posting or staff guidance you are about to send", "Anything that will reach staff or the public and that you can still change"],
    startingCompetence: "You wrote something and want to check it yourself in three passes before it goes out: whether people can read and reach it, whether it assumes knowledge or norms people may not share, and whether it invites rather than warns.",
    graduatedLooksLike:
      "By the end, you will have a three-part check of your material: what you found and changed for access and plain language, for assumed knowledge and representation, and for tone, along with what remains and when you will look again. You can run this check on your own writing routinely, and you know when to ask a colleague to review a draft instead.",
    launchType: "form_notice",
    askStarters: [
      "Can you check this announcement for reading level, acronyms, and tone before I send it?",
      "What am I assuming people already know in my guidance?",
      "How do I say this so it invites people instead of warning them?",
    ],
    steps: [
      { key: "ask", title: "Get a first read", guidance: "Paste your text into Ask and choose Review my draft. You will receive findings in the same three passes, with the limits of the review stated.", links: [{ label: "Ask: review my draft", href: "/ask?path=gp-13&mode=review" }] },
      { key: "ci", title: "Consider community context", guidance: "If your material is for or names particular Minnesota communities, read the relevant brief for naming, language, and access.", links: [{ label: "Explore Minnesota Communities", href: "/minnesota-communities" }], optional: true },
      { key: "resources", title: "Choose practical resources", guidance: "Use the plain-language and language access checklists, and the two short courses on accessible content and inclusive communication.", links: [{ label: "Plain language and accessible documents", href: "/resources/ja-plain-language" }, { label: "Language access checklist", href: "/resources/ja-language-access-checklist" }, { label: "Accessible content and digital learning", href: "/courses/di-accessible-content-and-digital-learning" }, { label: "Inclusive communication", href: "/courses/di-inclusive-communication" }] },
      { key: "artifact", title: "Run the three passes", guidance: "Record what you found and changed in each pass. Your notes are saved only on this computer. Do not paste confidential material.", links: [] },
      { key: "selfcheck", title: "Review your check", guidance: "Confirm each pass names specific changes, you noted what you assumed, you know who else should look, and you have a date to send or revisit it.", links: [] },
      { key: "consult", title: "Ask a colleague to review it (optional)", guidance: "A second reader catches what the writer cannot. If you would like someone to review your draft, the draft review path gives them a structure, and the right office can help with language access or accessibility questions.", links: [{ label: "Reviewing a draft for equity, access, and plain language", href: "/practice/gp-9" }, { label: "Find the right person", href: "/support/right-person?matter=accessibility_barrier" }] },
    ],
    artifactTitle: "Three-pass check of your material",
    artifactFields: [
      { id: "work_name", label: "What you wrote, and who it is for", help: "The notice, message, page, or material, and its audience.", type: "text", required: true, rubric: "specific_work" },
      { id: "access_checks", label: "Pass one: access and plain language", help: "Sentence length and reading level. Acronyms defined the first time they appear. Headings that use real heading styles. Alternative text for images. Color contrast. Links that say where they go. Note what you found and what you changed.", type: "textarea", required: true, rubric: "access" },
      { id: "not_assumed", label: "Pass two: what you assumed people already know", help: "Deadlines, formats, places, and processes stated in full. Dates that avoid major religious observances or offer an alternative. Languages people may need. Examples that show a range of people without stereotypes. Note what you made explicit.", type: "textarea", required: true, rubric: "not_assumed" },
      { id: "check_tone", label: "Pass three: tone", help: "Invitational rather than punitive. Person-first or identity-first language as the community prefers. Acknowledges that we are still learning. Strengths and goals rather than deficits. Note the sentences you rewrote.", type: "textarea", required: true },
      { id: "changes", label: "Changes you made", help: "One line each. Specific and short.", type: "list", required: true },
      { id: "involved", label: "Who else should look at this, and why", help: "Language access, accessibility, communications, or the owner of the process you describe.", type: "textarea", required: true, rubric: "involved" },
      { id: "owners", label: "Who owns each remaining change", help: "One line for each change that is not yet done, including who does it.", type: "list", required: true, rubric: "owners" },
      { id: "review_date", label: "When you will send it or check it again", help: "", type: "date", required: true, rubric: "review_date" },
    ],
    rubric: [...COMMON_RUBRIC, ACCESS_RULE, INVOLVED_RULE, NOT_ASSUMED_RULE, NO_NAMES_RULE],
    antiPerformative: {
      fake: ["A reading-level number with nothing changed", "\"Everyone knows what we mean\"", "A warning rewritten in friendlier words that still threatens"],
      real: ["Specific sentences you shortened, terms you defined, and images you described", "One assumption you made explicit", "A sentence that now tells people how to succeed instead of what happens if they fail"],
    },
    privacy: "Do not paste confidential or predecisional material. Your notes are saved only on this computer.",
    consultSupportType: "access_language_check",
  },
];
