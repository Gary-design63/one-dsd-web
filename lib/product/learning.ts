export type LearningStageDefinition = Readonly<{
  id: string;
  stage: number;
  label: string;
  purpose: string;
  outcomes: readonly string[];
  searchTerm: string;
}>;

export const LEARNING_STAGES = [
  {
    id: "orientation",
    stage: 1,
    label: "Welcome and orientation",
    purpose: "Understand what the program offers, how participation works, and how to begin without needing to be an expert.",
    outcomes: [
      "Choose a route that fits the work in front of you",
      "Distinguish private learning from required processes",
      "Know when a source or a person holds the needed authority",
    ],
    searchTerm: "how this program works",
  },
  {
    id: "foundations",
    stage: 2,
    label: "Foundations",
    purpose: "Build shared language for equity, access, culture, bias, belonging, and the experiences people bring to the work.",
    outcomes: [
      "Recognize barriers and unequal effects without reducing people to labels",
      "Use cultural humility and plain language in everyday work",
      "Connect individual experience with organizational conditions",
    ],
    searchTerm: "equity access cultural foundations",
  },
  {
    id: "intercultural-practice",
    stage: 3,
    label: "Intercultural practice",
    purpose: "Develop the ability to notice different perspectives, work across cultural difference, and adapt behavior with care.",
    outcomes: [
      "Recognize when similarity is being emphasized over meaningful difference",
      "Ask before assuming what another person needs or means",
      "Use reflection, feedback, and coaching to practice a more adaptive response",
    ],
    searchTerm: "intercultural practice cultural difference",
  },
  {
    id: "application",
    stage: 4,
    label: "Applied equity",
    purpose: "Bring equity and access into workforce, policy, program, service, engagement, fiscal, and communication decisions early enough to shape them.",
    outcomes: [
      "Use practical questions and tools on a current decision",
      "Involve affected people and responsible partners before choices harden",
      "Make something you can use, with owners and a review date",
    ],
    searchTerm: "equity analysis practical tools",
  },
  {
    id: "systems-practice",
    stage: 5,
    label: "Systems and structural practice",
    purpose: "Examine patterns, power, burden, disparities, and institutional conditions across more than one decision or team.",
    outcomes: [
      "Move from isolated events to patterns supported by evidence",
      "Identify structures that reproduce barriers or unequal results",
      "Design accountability and learning without surveillance",
    ],
    searchTerm: "structural equity systems disparities accountability",
  },
  {
    id: "leadership-continuity",
    stage: 6,
    label: "Leadership and continuity",
    purpose: "Sustain change through supervision, mentoring, sponsorship, shared governance, repair, resources, and learning over time.",
    outcomes: [
      "Connect leadership behavior with structural responsibility",
      "Build mentoring, feedback, repair, and development into the work",
      "Create durable ownership, review cycles, and continuity through change",
    ],
    searchTerm: "equity leadership mentoring systems change",
  },
] as const satisfies readonly LearningStageDefinition[];
