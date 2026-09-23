/** Original owner definition and pillars preserved from reconstruction 5680911. */
export const OPERATIONALIZING_EQUITY = {
  definition:
    "Operationalizing equity means moving it out of awareness training and slogans and into the ordinary machinery of how the organization decides, spends, hires, serves, and corrects itself.",
  characteristics: [
    { title: "Equity lives inside real decisions, not beside them.", detail: "Policies, program design, budgets, forms, procurement, technology, and services get an explicit equity look while they can still change. The Minnesota Equity Analysis Toolkit and GARE tools are the structured ways to do this." },
    { title: "It is everyone's work with named owners.", detail: "The program or policy owner is responsible for building equity in, with equity professionals as support. Follow-ups have a person and a review date, not a committee." },
    { title: "It reaches the whole employee lifecycle.", detail: "Role design, recruitment, screening, interviews, accommodation, selection, onboarding, review, pay and classification, advancement, sponsorship, retention, and exits. Job-relatedness is tested rather than assumed." },
    { title: "Accessibility and language access are practice, not exceptions.", detail: "Vital documents, plain language, accessible meetings, interpreters at first contact, and a clear owner for every fix." },
    { title: "Community engagement shares influence and closes the loop.", detail: "Start before the decision is fixed, be honest about inform versus consult versus co-design, compensate participants, and report back what changed. Tribal consultation is a separate government-to-government route." },
    { title: "Evidence is disaggregated but protective.", detail: "Follow the data by community, language, disability, and place; state what it does not show; protect small groups; never invent targets." },
    { title: "Culture changes through observable practices.", detail: "Psychological safety, repair after harm, and positional-power awareness, measured by what a team member would see in a normal week." },
    { title: "It is governed and accountable.", detail: "Decision rights, funding, review dates, feedback, correction, and withdrawal are explicit. Progress is measured at the program level, never by scoring or surveilling individuals." },
    { title: "Tools are inputs, not the system.", detail: "IDI, GARE, CLAS, LifeCourse, and implicit-association resources inform practice; none defines it, and none becomes a personnel label." },
    { title: "It matures in stages.", detail: "Foundation, integration, then institutionalization, where equity is simply how the organization runs." },
  ],
} as const;

/**
 * The three pillars and the through-line (owner source of truth, Gary Banks, September 5, 2026).
 * Engagement surfaces what staff and communities experience; analysis turns that into evidence about
 * the system; applied practice changes a specific decision with a specific owner. Display verbatim.
 */
export const PRACTICE_PILLARS = {
  throughLine:
    "Engagement surfaces what staff and communities experience, the analysis turns that into evidence about the system, and applied practice changes a specific decision with a specific owner. The program measures whether that cycle happened, not how any individual scored.",
  pillars: [
    {
      id: "engagement",
      title: "Employee engagement: staff as participants, not audiences",
      points: [
        "People with lived experience help shape decisions, with their role, authority, and compensation stated. This is the center lived experience commitment and the DSD listening work.",
        "Engagement is voluntary, private, and non-shaming. Staff learn on their own time, reflect without being recorded, and are never scored or profiled. That is why participation classes are labeled on every experience.",
        "Feedback loops close. Staff hear what changed because of their input and what could not change and why. The DSD needs assessment found that staff doubted their input mattered; the report-back practice answers that directly.",
        "Role-aware entry meets people in their actual work. A hiring manager, a fiscal analyst, and a supervisor each get a different door into the same knowledge base.",
        "Governed contribution paths let Equity Directors, Specialists, and One DSD Team members add and review material with attribution, rather than only consume it.",
      ],
      inTheBuild: "Ask, Learn stages, Practice paths, the One DSD Team workspace, the contributor roles, and the aggregate listening themes, published only after owner approval.",
      hrefs: [{ label: "Learn", href: "/learn" }, { label: "Practice", href: "/paths" }, { label: "One DSD", href: "/one-dsd" }],
    },
    {
      id: "uncovering",
      title: "Uncovering systemic inequities: seeing the pattern, not the person",
      points: [
        "Follow the data by community, language, disability, and place, with denominators, baselines, and small-group protection. Say what the data does not show.",
        "Look at each decision point in a process. Who is delayed, denied, or missing at each stage of hiring, eligibility, or service access?",
        "Question what is treated as immovable. Approval bottlenecks, diffuse decision rights, credential gatekeeping, and legacy data built for billing are choices someone made and can remake.",
        "Use structural analysis with intersectionality, positional power, and institutional history, but tie every insight to a decision with an owner.",
        "Distinguish unfamiliarity from intentional harm, and distinguish individual conduct, which belongs in a confidential HR channel, from a systemic pattern, which belongs in the equity practice.",
      ],
      inTheBuild: "The measurement area of work, the equity scan and full analysis path, the job-relatedness check, the operational equity review canvas, and the Ask safety gates that refuse ranking and profiling.",
      hrefs: [{ label: "Measurement and accountability", href: "/domains/measurement" }, { label: "Equity analysis for a decision", href: "/paths/gp-7" }, { label: "Is this requirement job related?", href: "/resources/ja-job-relatedness-check" }],
    },
    {
      id: "applied",
      title: "Applied practices: fixing the system where it lives",
      points: [
        "Every analysis ends with something you can use, with a named owner and a review date: an equity review plan, an engagement plan, an inclusive hiring plan, a decision record, a revision checklist.",
        "Equity questions are built into the artifact the organization already uses, such as the position description, the request for proposals, the notice, the assessment process, or the budget memo.",
        "Accessibility, language access, and plain language are default practices with owners, not accommodations granted on request.",
        "Leaders run observable team practices: agendas in advance, rotating who opens, written input read aloud, captions on, and a visible check on who gets the visible work.",
        "Change is staged from foundation to integration to institutionalization, and it is funded, staffed, and reviewed rather than only stated.",
      ],
      inTheBuild: "The ten Practice paths, the domain task model, the right-person routing so practice reaches whoever holds authority, and the DSD consultation pathway for a real decision.",
      hrefs: [{ label: "Practice paths", href: "/paths" }, { label: "Areas of work", href: "/domains" }, { label: "Find the right person", href: "/support/right-person" }],
    },
  ],
} as const;
