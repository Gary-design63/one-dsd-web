import type { CoursePack } from "../../source-types";

// Cultural Intelligence curriculum, module 3: Germanic Europe — The Structured Order Cluster.
// Based on: Livermore, D. (2013). Expand Your Borders: Discover Ten Cultural Clusters. Cultural Intelligence Center.
const pack: CoursePack = {
  course: {
    id: "cq-germanic-europe",
    indexNumber: 1131,
    seriesLabel: "Cultural Intelligence \u00b7 Expand Your Borders",
    title: "Germanic Europe: The Structured Order Cluster",
    subtitle: "Germanic Europe is defined by its commitment to order, precision, and structured living.",
    scope: "For all DHS staff. One of ten modules in the Expand Your Borders cross-cultural intelligence curriculum. Clusters describe broad patterns, not individual people — use them as starting points for curiosity, never as endpoints for judgment about any one person.",
    treatment: "One module with a scenario, reflection questions, suggestive practices, and a knowledge check",
    duration: "45\u201350 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/stock-people-03.jpg",
    coverAlt: "Coworkers gathered around a conference table for a meeting.",
    introTranscript: "Germanic Europe is defined by its commitment to order, precision, and structured living. Rules are not bureaucratic annoyances — they are expressions of respect for the collective and protections of individual rights. Punctuality is a core value, directness is a sign of respect, and academic credentials carry great weight. This cluster is moderately individualist and highly skeptical of ambiguity. It is one of the world's most precise cultural clusters — and also one of its most economically powerful.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Describe the core cultural dimensions of the Germanic Europe cluster and how they shape communication and decision-making.",
        "Respond to a realistic cross-cultural scenario in a way that reads the situation accurately rather than through your own cultural default.",
        "Apply at least one suggestive practice from this module in a real cross-cultural interaction.",
      ],
      evidence: [
        "A worked scenario decision with an explanation of why it fits the cluster's cultural patterns.",
        "One knowledge check on this cluster's most distinctive cultural dimension.",
      ],
      appliedNextStep: "Practice one suggestive behavior from this module in your next interaction with a colleague or partner connected to the Germanic Europe cluster.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Livermore, D. (2013). Expand Your Borders: Discover Ten Cultural Clusters. Cultural Intelligence Center.",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Feedback that a scenario reads as stereotyping rather than describing a broad pattern", "A revision to the source Cultural Intelligence Center material"],
      relatedDoor: "This module describes broad cultural patterns from published cultural-dimensions research. It does not predict any individual person's beliefs or behavior, and it is not a substitute for asking someone directly about their own preferences and context.",
      toolkitQuestion: "Am I treating this pattern as a starting point for a real conversation, or as a conclusion about a specific person?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "cq-germanic-europe-1",
        number: 1,
        title: "Germanic Europe",
        summary: "The Structured Order Cluster. Germanic Europe is defined by its commitment to order, precision, and structured living",
        minutes: 20,
        learning: {
          objective: "Describe the Germanic Europe cluster’s core cultural dimensions and respond accurately to a realistic cross-cultural scenario.",
          takeaways: [
            "Uncertainty avoidance: High — rules, systems, and predictability valued",
            "Power distance: Low — flat, but formal until trust is established",
            "Communication: Very low context — blunt, direct, explicit",
            "Competition: Competitive and task-focused (doing orientation)",
            "Individualism: Moderate — individual rights protected by collective rules"
          ],
          evidence: "A worked scenario decision, a set of reflection questions, and a knowledge check.",
          appliedNextStep: "Choose one suggestive practice from this module and apply it in your next relevant interaction.",
        },
        scenario: {
          context: "You've arranged a 9:00 AM video call with a German partner firm. Your team joins at 9:07. Your German counterpart is visibly terse, and the meeting never quite recovers its warmth. Later, a team member says, \"It was only seven minutes.\"",
          prompt: "How do you respond?",
          options: [
        { label: "Agree — seven minutes is not a big deal and the German team should be more flexible.", response: "This dismisses a real cultural signal: in Germanic contexts, lateness reads as disrespect for the other person's planning, regardless of how minor it seems to you." },
        { label: "Explain that in Germanic culture, lateness communicates disrespect for the other person's time and planning, and commit to punctuality going forward.", response: "This is the accurate reading. Punctuality in Germanic culture is a signal of respect, not a rigid formality — treating it as such repairs trust going forward.", recommended: true },
        { label: "Send a formal apology email and restructure your team's meeting prep protocol.", response: "A good instinct, but without naming why punctuality matters here, the team is likely to repeat the same misstep with a different partner." }
          ],
        },
        transfer: {
          prompt: "Germanic cultures create rules to protect individual comfort and predictability. How does that reframe your view of \"bureaucracy\"?",
          options: ["Think of a time your informality may have read as unprofessional or disrespectful to someone from a more structured culture.", "Where in your work life do you resist structure? What cultural value drives that resistance?", "Name one agreement or deadline you could put in writing this week to reduce ambiguity."],
        },
        blocks: [
          { type: "text", heading: "Cluster overview", body: "<p>Germanic Europe is defined by its commitment to order, precision, and structured living. Rules are not bureaucratic annoyances — they are expressions of respect for the collective and protections of individual rights. Punctuality is a core value, directness is a sign of respect, and academic credentials carry great weight. This cluster is moderately individualist and highly skeptical of ambiguity. It is one of the world's most precise cultural clusters — and also one of its most economically powerful.</p><p><strong>Region:</strong> Austria, Belgium, Germany, Netherlands, German-speaking Switzerland</p>" },
          { type: "list", heading: "Key cultural dimensions", items: ["Uncertainty avoidance: High — rules, systems, and predictability valued", "Power distance: Low — flat, but formal until trust is established", "Communication: Very low context — blunt, direct, explicit", "Competition: Competitive and task-focused (doing orientation)", "Individualism: Moderate — individual rights protected by collective rules"] },
          { type: "list", heading: "Reflect", ordered: true, items: ["Germanic cultures create rules to protect individual comfort and predictability. How does that reframe your view of \"bureaucracy\"?", "Think of a time your informality may have read as unprofessional or disrespectful to someone from a more structured culture.", "Where in your work life do you resist structure? What cultural value drives that resistance?"] },
          { type: "flashcards", heading: "Suggestive practices", cards: [
            { front: "Honor punctuality as respect", back: "<p>Arrive or log in two minutes early to meetings with Germanic counterparts. Treat their time as a finite, precious resource.</p>" },
            { front: "Lead with substance", back: "<p>Germanic professionals value credentials and intellectual rigor. Establish your expertise clearly and early rather than relying on rapport alone.</p>" },
            { front: "Embrace productive debate", back: "<p>Disagreement in Germanic culture signals engagement. Don't interpret pushback as hostility — it means they take you seriously.</p>" },
            { front: "Write it down", back: "<p>Document agreements, timelines, and expectations in writing. This reduces ambiguity and signals you share their commitment to precision.</p>" }
          ] },
          { type: "knowledgeCheck", id: "cq-germanic-europe-1-check", question: "Which cultural dimension is most distinctively Germanic compared to other Western clusters?", options: [{ text: "High collectivism", correct: false }, { text: "High uncertainty avoidance", correct: true }, { text: "High power distance", correct: false }, { text: "High context communication", correct: false }], feedbackCorrect: "Uncertainty avoidance is the defining Germanic trait. While other Western clusters tolerate ambiguity, Germanic Europe builds systems of rules and procedures specifically to minimize unpredictability and protect order.", feedbackIncorrect: "Look again at the cluster’s key dimensions — Uncertainty avoidance is the defining Germanic trait. While other Western clusters tolerate ambiguity, Germanic Europe builds systems of rules and procedures specifically to minimize unpredictability and protect order." },
        ],
      },
      {
        id: "cq-germanic-europe-2",
        number: 2,
        title: "Blunt pushback is not hostility",
        summary: "Pointed disagreement from a colleague connected to the Germanic Europe cluster is often a sign of engagement, not conflict. Reading it as hostility can shut down useful debate.",
        minutes: 9,
        learning: {
          objective: "Distinguish direct, substantive pushback from hostility when working with a colleague shaped by low-context, high-uncertainty-avoidance norms, and respond to the content of the disagreement.",
          takeaways: [
            "Population-level research describes very low-context, direct communication in this cluster; blunt disagreement is often a sign of taking the work seriously, not a personal attack.",
            "Reading direct pushback as hostility can cause a colleague to withdraw useful critique rather than continue offering it.",
            "The accurate response is to engage with the substance of the disagreement, not to smooth over the exchange or take it personally.",
          ],
          evidence: "A scenario decision about a colleague who challenges a proposed case plan in a meeting, and a knowledge check on reading pushback as engagement.",
          appliedNextStep: "The next time a colleague pushes back bluntly on your work, respond to the specific point raised before deciding whether the exchange felt personal.",
        },
        scenario: {
          context: "In a case review meeting, a colleague whose background traces to Germany says flatly, “This plan has a gap — the housing timeline does not account for the waitlist. It needs to be redone before we present it.” The delivery is blunt, with no cushioning. Another teammate later asks if you are upset.",
          prompt: "What is the most accurate response?",
          options: [
            { label: "Tell the teammate you are upset and plan to raise the tone of the comment with the colleague privately.", response: "This treats direct, substantive feedback as a tone problem rather than engaging with a real gap that was identified in the plan." },
            { label: "Tell the teammate the comment was direct but accurate, and focus the conversation on fixing the housing timeline gap.", response: "This is the accurate read. Blunt, specific pushback in this style usually signals engagement with the work, not personal hostility — the gap identified is worth fixing.", recommended: true },
            { label: "Avoid bringing plans to that colleague for review in the future to prevent similar exchanges.", response: "This removes a colleague's substantive, useful scrutiny from the process rather than addressing a tone concern that may not reflect the colleague's intent." },
          ],
        },
        transfer: {
          prompt: "Think of a time direct pushback from a colleague felt like hostility. What was the actual content of the disagreement, and was it worth addressing on its merits?",
          options: ["Name one instance of blunt pushback you received recently", "Write the specific point being raised, separate from its delivery", "Decide whether the point itself deserved a substantive response"],
        },
        blocks: [
          { type: "text", heading: "Directness as a sign of seriousness", body: "<p>Population-level research on Germanic Europe describes a very low-context communication style paired with high uncertainty avoidance: people say precisely what they think, especially about gaps, risks or errors, because leaving a problem unstated feels irresponsible. A blunt correction in a meeting is often a sign the colleague is taking the work seriously enough to name a flaw plainly, not a sign of anger or disrespect toward the person who made it.</p><p>This is a population-level pattern, and any individual colleague, regardless of background, may deliver or receive feedback differently. The useful habit is separating the delivery of a comment from its content, and responding to the substance — is the point accurate? — before deciding how to feel about the tone.</p>" },
          { type: "list", heading: "Signs pushback is substantive, not personal", items: ["The comment names a specific gap, risk or error rather than a general complaint about you.", "The colleague continues to engage seriously with the work afterward rather than withdrawing.", "You have not actually checked whether the point raised is accurate before reacting to its delivery."] },
          { type: "leaderMove", heading: "Address the point before you address the tone", control: "You control whether you respond first to what was said or to how it was said.", failure: "Do not quietly stop bringing work to a direct colleague for review because their honest feedback felt uncomfortable.", next: "The next time a colleague's pushback feels blunt, write down the specific point raised and evaluate it on its merits before deciding whether the tone needs a separate conversation." },
          { type: "flashcards", heading: "Reading pushback accurately", cards: [
            { front: "What does blunt feedback often signal in this style?", back: "<p>Engagement and seriousness about the work, driven by a strong preference for identifying and closing gaps before they become bigger problems.</p>" },
            { front: "What is the risk of reading it as hostility?", back: "<p>A colleague may stop offering useful, direct critique if it is consistently treated as a personal attack.</p>" },
            { front: "What is the safest first move?", back: "<p>Evaluate the specific point raised on its merits before responding to how it was delivered.</p>" },
          ] },
          { type: "knowledgeCheck", id: "cq-germanic-europe-2-check", question: "A colleague bluntly identifies a gap in a case plan during a meeting. What is the most accurate response?", options: [
            { text: "Treat the blunt delivery as hostility and address the tone before the content.", correct: false },
            { text: "Evaluate the specific gap identified and address it, recognizing the directness as engagement rather than hostility.", correct: true },
            { text: "Stop bringing plans to that colleague for review to avoid future blunt exchanges.", correct: false },
          ], feedbackCorrect: "Right. Responding to the substance keeps useful scrutiny in the process and avoids misreading directness as disrespect.", feedbackIncorrect: "Consider what blunt, specific pushback usually signals in this communication style, and what the safest first response is." },
        ],
      },
      {
        id: "cq-germanic-europe-3",
        number: 3,
        title: "Serving a participant who wants the rules stated precisely",
        summary: "A participant who wants exact rules, documentation and a clear process is not being difficult — precision and predictability are strong population-level values in this cluster.",
        minutes: 9,
        learning: {
          objective: "Serve a participant who asks for precise rules, documentation and a clear process by providing exact information rather than reassurance, without assuming every participant from this background wants the same level of detail.",
          takeaways: [
            "Population-level research describes a strong preference for rules, systems and predictability in this cluster; a request for exact detail reflects that value, not distrust of the worker.",
            "Vague reassurance (“it'll probably be fine”) can feel like an evasion to a participant who wants precise information, even when it is meant kindly.",
            "Any individual participant may want more or less detail than this pattern predicts — the respectful approach is to offer precision and let the participant set the pace.",
          ],
          evidence: "A scenario decision about a participant who asks for the exact rule and citation behind a benefit decision, and a knowledge check on responding with precision rather than reassurance.",
          appliedNextStep: "In your next conversation where a participant asks for exact detail, provide the specific rule or citation rather than a general reassurance, and note whether that resolves the concern.",
        },
        scenario: {
          context: "A participant whose family background traces to Germany asks exactly which regulation limits his benefit amount, wants the specific rule cited in writing, and asks what would change the calculation. Another staff member says, “I told him it'll probably work out, but he keeps pushing for the exact rule.”",
          prompt: "What is the most respectful next step?",
          options: [
            { label: "Reassure him again that the case is being handled and it will likely work out.", response: "General reassurance does not answer a specific, reasonable request for the exact rule governing his benefit, and may increase his concern." },
            { label: "Provide the specific regulation and citation in writing, along with what would change the calculation, exactly as requested.", response: "This meets a reasonable request for precision directly and respects a preference for exact, documented information over general reassurance.", recommended: true },
            { label: "Suggest he speak with a supervisor since the questions seem unusually detailed.", response: "This escalates a reasonable, answerable request rather than simply providing the exact information he asked for." },
          ],
        },
        transfer: {
          prompt: "Think of a time a participant asked for more precise detail than you initially gave. What changed when you provided the exact rule or citation instead of a general answer?",
          options: ["Name one recent case where a participant asked for exact detail", "Write the general answer you gave first", "Draft the precise, documented answer that would have addressed it directly"],
        },
        blocks: [
          { type: "text", heading: "Precision as respect, not distrust", body: "<p>Population-level research on Germanic Europe describes high uncertainty avoidance: a strong preference for clear rules, documented procedures and predictable outcomes. A participant asking for the exact regulation behind a decision, in writing, with a citation, is often expressing this value — not expressing distrust of the caseworker personally. General reassurance, however well-intentioned, can feel evasive to someone who wants precise, verifiable information.</p><p>This is a population-level tendency and not every participant, from this background or any other, will want the same level of detail. Providing precise information when asked costs little and respects the participant's actual request; the caution is not to assume every participant wants this level of detail unprompted, or to treat requests for precision as suspicion.</p>" },
          { type: "list", heading: "Practices that respect a precision preference", items: ["Cite the specific rule, regulation or policy section in writing when asked, rather than summarizing generally.", "Explain exactly what would change an outcome, in concrete terms, rather than saying it “depends.”", "Offer written documentation proactively when a participant has already asked for exact detail once."] },
          { type: "leaderMove", heading: "Answer with the citation, not the reassurance", control: "You control whether your answer to a specific question is precise and documented or general and reassuring.", failure: "Do not escalate a participant's request for exact information as if it were a behavior problem.", next: "The next time a participant asks for an exact rule or citation, provide it directly and in writing before offering any general reassurance." },
          { type: "flashcards", heading: "Serving a precision preference", cards: [
            { front: "Why might a participant want the exact rule cited?", back: "<p>A population-level preference for predictability and documented process, not distrust of the individual worker.</p>" },
            { front: "What response can feel evasive?", back: "<p>General reassurance in place of the specific, documented answer that was actually requested.</p>" },
            { front: "What should never be assumed?", back: "<p>That every participant wants this level of detail, or that any who do not are being less thorough.</p>" },
          ] },
          { type: "knowledgeCheck", id: "cq-germanic-europe-3-check", question: "A participant repeatedly asks for the exact regulation behind a benefit decision instead of accepting general reassurance. What is the best response?", options: [
            { text: "Continue offering general reassurance since the case is being handled appropriately.", correct: false },
            { text: "Provide the specific regulation and citation in writing, along with what would change the calculation.", correct: true },
            { text: "Treat the repeated requests as an escalation requiring supervisor involvement.", correct: false },
          ], feedbackCorrect: "Right. Precise, documented answers directly meet a reasonable request and respect the participant's preference.", feedbackIncorrect: "Consider what kind of answer actually addresses a request for exact, documented information." },
        ],
      },
      {
        id: "cq-germanic-europe-4",
        number: 4,
        title: "Balancing structure and flexibility on a mixed team",
        summary: "A team with both rule-and-documentation-oriented staff and more flexible, improvisational staff can build one practice that gives both what they need.",
        minutes: 9,
        learning: {
          objective: "Design a team documentation and decision-making practice that gives rule-oriented staff the clarity they need and gives more flexible staff room to adapt, without treating either style as the problem.",
          takeaways: [
            "Staff who want detailed, written procedures are not being rigid for its own sake; clear documentation reduces real ambiguity and protects consistency for participants.",
            "Staff who prefer flexibility are not being careless; they may be responding well to cases that do not fit a standard template.",
            "A written baseline procedure with an explicit, named process for documented exceptions serves both groups better than an unwritten norm favoring one style.",
          ],
          evidence: "A scenario decision about a disagreement over how detailed a new intake procedure should be, and a knowledge check on building one practice that serves both preferences.",
          appliedNextStep: "Before your next procedure update, write the baseline steps clearly, and add one explicit, documented path for handling exceptions.",
        },
        scenario: {
          context: "Your unit is writing a new intake procedure. One staff member, shaped by a strong preference for structure, wants every step, form and decision point documented precisely. Another staff member argues that too much detail will make it impossible to handle unusual cases and prefers a short, flexible guideline instead.",
          prompt: "What is the best way to resolve the disagreement?",
          options: [
            { label: "Adopt the short, flexible guideline and skip detailed documentation to keep the process adaptable.", response: "This removes the clarity and consistency that a documented baseline procedure provides, and may create ambiguity for staff and participants alike." },
            { label: "Write a clear, documented baseline procedure for standard cases, and add an explicit, named process for documenting and handling exceptions.", response: "This gives the structure-oriented staff the clarity they need and gives the flexibility-oriented staff a real, documented path for handling unusual cases — neither preference is dismissed.", recommended: true },
            { label: "Require every exception to go through a lengthy formal review before any flexible decision can be made.", response: "This over-corrects toward rigidity and could slow down legitimate case-by-case judgment that unusual cases sometimes require." },
          ],
        },
        transfer: {
          prompt: "Think of a procedure on your team built around one preference — either strict documentation or informal flexibility. What would a version look like that served both?",
          options: ["Name one procedure that leans heavily toward one style", "Identify what the other style would need to work well under it", "Draft one addition that would serve both without removing either"],
        },
        blocks: [
          { type: "text", heading: "Structure and flexibility are not opposites", body: "<p>A team member who wants precise, written procedures is usually responding to a real value: predictability reduces error, protects consistency across cases, and makes expectations clear for new staff. A team member who prefers flexibility is often responding to a different real value: rigid procedures can fail unusual cases that do not fit the standard pattern. Framing this as one style being right and the other wrong misses that both concerns are legitimate.</p><p>The practical fix is usually a written baseline for the common case, paired with an explicit, documented process for exceptions — so structure-oriented staff have the clarity they need, and flexibility-oriented staff have a real, sanctioned path for adapting to a case that does not fit, rather than having to work around an unwritten rule either way.</p>" },
          { type: "list", heading: "Building one practice for both preferences", items: ["Document the standard steps clearly enough that a new staff member could follow them without guessing.", "Name a specific, approved process for exceptions — who decides, what gets documented, how it is reviewed — rather than leaving exceptions informal.", "Revisit the procedure together periodically so both structure-oriented and flexibility-oriented staff can flag what is and is not working."] },
          { type: "leaderMove", heading: "Write the baseline, name the exception path", control: "You control whether your team's procedures name both the standard steps and the approved way to depart from them.", failure: "Do not let one preference — rigid documentation or informal flexibility — win by default because it is louder or more senior.", next: "In your next procedure review, add an explicit, documented exception process if one does not already exist." },
          { type: "accordion", heading: "What each preference is actually protecting", items: [
            { title: "The case for detailed documentation", body: "<p>Reduces ambiguity, protects consistency across staff and cases, and makes onboarding new colleagues easier. This is a legitimate operational value, not rigidity for its own sake.</p>" },
            { title: "The case for flexibility", body: "<p>Protects the ability to serve unusual cases well and avoids forcing a participant's situation into a template that does not fit. This is a legitimate service value, not carelessness.</p>" },
          ] },
          { type: "knowledgeCheck", id: "cq-germanic-europe-4-check", question: "Two staff disagree about how detailed a new procedure should be — one wants full documentation, one wants flexibility. What is the best resolution?", options: [
            { text: "Choose one preference and apply it across the whole procedure.", correct: false },
            { text: "Write a clear documented baseline for standard cases and add an explicit, documented process for exceptions.", correct: true },
            { text: "Leave the procedure undocumented so staff can decide case by case without a written standard.", correct: false },
          ], feedbackCorrect: "Right. A documented baseline with a named exception path serves both the need for clarity and the need for flexibility.", feedbackIncorrect: "Consider a solution that gives structure-oriented staff clarity and flexibility-oriented staff a real, documented path for exceptions." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Germanic Europe: quick reference",
    subtitle: "A one-page reminder for working with colleagues and partners connected to the Germanic Europe cluster",
    quote: "Uncertainty avoidance is the defining Germanic trait. While other Western clusters tolerate ambiguity, Germanic Europe builds systems of rules and procedures specifically to minimize unpredictability and protect order.",
    use: {
      purpose: "Keep the Germanic Europe cluster’s key patterns and suggestive practices ready for your next cross-cultural interaction.",
      remember: ["Uncertainty avoidance: High — rules, systems, and predictability valued", "Power distance: Low — flat, but formal until trust is established", "Communication: Very low context — blunt, direct, explicit", "Competition: Competitive and task-focused (doing orientation)", "Individualism: Moderate — individual rights protected by collective rules"],
      doNext: "Apply one suggestive practice from this module in your next relevant interaction.",
    },
    sections: [
      { heading: "Suggestive practices", items: ["Honor punctuality as respect \— Arrive or log in two minutes early to meetings with Germanic counterparts. Treat their time as a finite, precious resource.", "Lead with substance \— Germanic professionals value credentials and intellectual rigor. Establish your expertise clearly and early rather than relying on rapport alone.", "Embrace productive debate \— Disagreement in Germanic culture signals engagement. Don't interpret pushback as hostility — it means they take you seriously.", "Write it down \— Document agreements, timelines, and expectations in writing. This reduces ambiguity and signals you share their commitment to precision."] },
      { heading: "Before you assume", items: ["Clusters describe broad patterns, not individual people.", "Use this module as a starting point for curiosity, never as a conclusion about a specific person.", "When in doubt, ask the person directly about their own preferences and context."] },
    ],
  },
  sources: [
    { title: "Livermore, D. (2013). Expand Your Borders: Discover Ten Cultural Clusters. Cultural Intelligence Center.", href: "https://culturalq.com", note: "Source framework for the ten cultural clusters, their key dimensions, and this module's scenario and practice content." },
  ],
};

export default pack;
