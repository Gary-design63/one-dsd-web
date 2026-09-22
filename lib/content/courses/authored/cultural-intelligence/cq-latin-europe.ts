import type { CoursePack } from "../../source-types";

// Cultural Intelligence curriculum, module 5: Latin Europe — The Expressive Relationship Cluster.
// Based on: Livermore, D. (2013). Expand Your Borders: Discover Ten Cultural Clusters. Cultural Intelligence Center.
const pack: CoursePack = {
  course: {
    id: "cq-latin-europe",
    indexNumber: 1133,
    seriesLabel: "Cultural Intelligence \u00b7 Expand Your Borders",
    title: "Latin Europe: The Expressive Relationship Cluster",
    subtitle: "Latin Europe blends individualism with expressive emotionality — a rare combination.",
    scope: "For all DHS staff. One of ten modules in the Expand Your Borders cross-cultural intelligence curriculum. Clusters describe broad patterns, not individual people — use them as starting points for curiosity, never as endpoints for judgment about any one person.",
    treatment: "One module with a scenario, reflection questions, suggestive practices, and a knowledge check",
    duration: "45\u201350 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/stock-people-05.jpg",
    coverAlt: "Two colleagues share a warm conversation over coffee.",
    introTranscript: "Latin Europe blends individualism with expressive emotionality — a rare combination. People here are proud of their cultural heritage, passionate in debate, and deeply relationship-oriented despite valuing personal autonomy. Status and intellectual prestige matter. Meals are treated as important social events. Time is polychronic — multiple things happen simultaneously, and punctuality is interpreted more flexibly than in Germanic or Nordic clusters. Philosophy, food, and family are elevated alongside professional success.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Describe the core cultural dimensions of the Latin Europe cluster and how they shape communication and decision-making.",
        "Respond to a realistic cross-cultural scenario in a way that reads the situation accurately rather than through your own cultural default.",
        "Apply at least one suggestive practice from this module in a real cross-cultural interaction.",
      ],
      evidence: [
        "A worked scenario decision with an explanation of why it fits the cluster's cultural patterns.",
        "One knowledge check on this cluster's most distinctive cultural dimension.",
      ],
      appliedNextStep: "Practice one suggestive behavior from this module in your next interaction with a colleague or partner connected to the Latin Europe cluster.",
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
        id: "cq-latin-europe-1",
        number: 1,
        title: "Latin Europe",
        summary: "The Expressive Relationship Cluster. Latin Europe blends individualism with expressive emotionality — a rare combination",
        minutes: 20,
        learning: {
          objective: "Describe the Latin Europe cluster’s core cultural dimensions and respond accurately to a realistic cross-cultural scenario.",
          takeaways: [
            "Individualism: Moderate to high — personal expression and autonomy valued",
            "Power distance: Moderate — expertise and status respected",
            "Communication: High context — implicit meaning, relational signals",
            "Expressiveness: Affective — emotions openly shared and welcomed",
            "Time: Polychronic — flexible, relationship-driven time use"
          ],
          evidence: "A worked scenario decision, a set of reflection questions, and a knowledge check.",
          appliedNextStep: "Choose one suggestive practice from this module and apply it in your next relevant interaction.",
        },
        scenario: {
          context: "You're negotiating a partnership with a French firm. They want to meet for a two-hour lunch before any contracts are discussed. You have a busy travel schedule and suggest shortening the lunch to 45 minutes to \"get to business faster.\"",
          prompt: "How do you respond?",
          options: [
        { label: "Hold firm — your time is limited and they should understand that.", response: "This risks the relationship the meal is meant to build, since the shared meal is often the actual foundation of the future deal, not a delay before it." },
        { label: "Accept the two-hour lunch fully, understanding that the relationship built over the meal IS the foundation of any future deal.", response: "This is the accurate reading. In Latin European business culture, the relationship built over the meal often is the deal-making process, not a delay before it.", recommended: true },
        { label: "Compromise on 90 minutes and explain your constraints diplomatically.", response: "A reasonable middle ground, but it still signals that the relationship-building itself is secondary to your schedule." }
          ],
        },
        transfer: {
          prompt: "How does your culture's relationship with time shape your judgment of others' \"efficiency\"?",
          options: ["Think of a situation where passion in disagreement was misread as aggression. What was actually happening?", "Latin European cultures elevate philosophy, cuisine, and aesthetics as seriously as productivity. What does your culture elevate — and what might you be missing?", "Name one meeting where you could build in a few unhurried minutes for relationship before business."],
        },
        blocks: [
          { type: "text", heading: "Cluster overview", body: "<p>Latin Europe blends individualism with expressive emotionality — a rare combination. People here are proud of their cultural heritage, passionate in debate, and deeply relationship-oriented despite valuing personal autonomy. Status and intellectual prestige matter. Meals are treated as important social events. Time is polychronic — multiple things happen simultaneously, and punctuality is interpreted more flexibly than in Germanic or Nordic clusters. Philosophy, food, and family are elevated alongside professional success.</p><p><strong>Region:</strong> France, French-speaking Canada, Italy, Portugal, Spain</p>" },
          { type: "list", heading: "Key cultural dimensions", items: ["Individualism: Moderate to high — personal expression and autonomy valued", "Power distance: Moderate — expertise and status respected", "Communication: High context — implicit meaning, relational signals", "Expressiveness: Affective — emotions openly shared and welcomed", "Time: Polychronic — flexible, relationship-driven time use"] },
          { type: "list", heading: "Reflect", ordered: true, items: ["How does your culture's relationship with time shape your judgment of others' \"efficiency\"?", "Think of a situation where passion in disagreement was misread as aggression. What was actually happening?", "Latin European cultures elevate philosophy, cuisine, and aesthetics as seriously as productivity. What does your culture elevate — and what might you be missing?"] },
          { type: "flashcards", heading: "Suggestive practices", cards: [
            { front: "Make time for the meal", back: "<p>In Latin European relationships, shared meals are where trust is built. Block calendar time for relationship cultivation, not just task completion.</p>" },
            { front: "Engage ideas passionately", back: "<p>Don't shy away from spirited debate. It's a sign of intellectual respect. Calm agreement can read as indifference.</p>" },
            { front: "Read between the lines", back: "<p>High context communication means key information is embedded in tone, timing, and relationship. Pay attention to what isn't said.</p>" },
            { front: "Honor expertise with deference", back: "<p>Credentials and professional experience matter. Introduce your background and recognize the expertise of your counterparts explicitly.</p>" }
          ] },
          { type: "knowledgeCheck", id: "cq-latin-europe-1-check", question: "Which combination is most characteristic of Latin European cultures?", options: [{ text: "Low power distance and monochronic time", correct: false }, { text: "Collective orientation and high uncertainty avoidance", correct: false }, { text: "Individual expression combined with affective, high-context communication", correct: true }, { text: "Flat hierarchy and task-first orientation", correct: false }], feedbackCorrect: "Latin Europe is distinctive in blending individualism with emotional expressiveness and high-context communication — people value personal autonomy and deep relational attunement simultaneously.", feedbackIncorrect: "Look again at the cluster’s key dimensions — Latin Europe is distinctive in blending individualism with emotional expressiveness and high-context communication — people value personal autonomy and deep relational attunement simultaneously." },
        ],
      },
      {
        id: "cq-latin-europe-2",
        number: 2,
        title: "Passionate disagreement is not anger",
        summary: "Animated, expressive debate from a colleague connected to the Latin Europe cluster is a common sign of engagement, not a loss of professional composure.",
        minutes: 9,
        learning: {
          objective: "Distinguish animated, expressive disagreement from anger or a breakdown in professionalism when working with a colleague shaped by an affective, high-context communication style.",
          takeaways: [
            "Population-level research describes affective communication in this cluster: emotion is expressed openly and is a normal, welcomed part of professional debate, not a loss of control.",
            "Reading passionate disagreement as anger can lead a colleague to feel dismissed or shut down for engaging seriously with the work.",
            "The accurate response is to engage with the substance of the disagreement and let the emotional expressiveness be what it is — a sign of investment.",
          ],
          evidence: "A scenario decision about a colleague who raises her voice in animated disagreement during a planning meeting, and a knowledge check on reading expressiveness as engagement.",
          appliedNextStep: "The next time a colleague's disagreement feels unusually animated, note the specific point being made before deciding whether the exchange has become unprofessional.",
        },
        scenario: {
          context: "In a planning meeting, a colleague whose background traces to Italy disagrees passionately with a proposed timeline, raising her voice and gesturing as she makes her point. A teammate later says, “That got pretty heated — maybe we should ask her to calm down in meetings.”",
          prompt: "What is the most accurate response?",
          options: [
            { label: "Agree, and plan to ask her privately to keep her tone calmer in future meetings.", response: "This treats a common expressive communication style as a discipline issue rather than engaging with the substantive disagreement she raised." },
            { label: "Note that animated, expressive disagreement is a common and welcomed part of debate in this style, and that calm agreement can sometimes signal indifference rather than support — then focus on the substance of her concern about the timeline.", response: "This is the accurate read. Expressiveness here typically signals engagement and investment, not a loss of professionalism — the timeline concern deserves a real answer.", recommended: true },
            { label: "Avoid raising contested topics with her in group settings to prevent future animated exchanges.", response: "This removes a colleague's substantive engagement from group discussions rather than addressing the concern on its merits." },
          ],
        },
        transfer: {
          prompt: "Think of a time animated disagreement from a colleague felt unprofessional to you. What was the actual point being made, and did it deserve a substantive response?",
          options: ["Name one instance of animated disagreement you observed or were part of", "Write the specific concern being raised, separate from its delivery", "Decide whether that concern received a real answer"],
        },
        blocks: [
          { type: "text", heading: "Expressiveness as investment, not loss of control", body: "<p>Population-level research on Latin Europe describes an affective communication style paired with high-context meaning: emotion is expressed openly, debate can be animated and passionate, and this is a normal, even valued, part of engaging seriously with an idea. Calm, even-toned agreement in this style can sometimes read as indifference, while passionate disagreement reads as investment and respect for the conversation.</p><p>This is a population-level pattern; not every colleague connected to this cluster will communicate this way, and colleagues from many other backgrounds express passionate disagreement too. The useful habit is separating the emotional register of a disagreement from its substance, and responding to the actual point being raised.</p>" },
          { type: "list", heading: "Signs animated disagreement is engagement, not a breakdown", items: ["The colleague is making a specific, substantive point rather than a personal attack.", "The colleague continues to work collaboratively once the point has been addressed.", "You have not yet actually evaluated whether the concern raised is valid."] },
          { type: "leaderMove", heading: "Address the point, let the tone be what it is", control: "You control whether you respond to the substance of a passionate disagreement or to its volume and energy.", failure: "Do not ask a colleague to suppress an expressive communication style before you have engaged with the point they are making.", next: "The next time a disagreement feels unusually animated, write down the specific concern raised and address it before deciding whether a separate conversation about tone is needed." },
          { type: "flashcards", heading: "Reading expressiveness accurately", cards: [
            { front: "What does animated disagreement often signal in this style?", back: "<p>Investment and engagement with the topic — a sign the person takes the conversation and the work seriously.</p>" },
            { front: "What can calm agreement signal instead?", back: "<p>In some cases, indifference, since enthusiasm and concern are often expressed openly rather than held back.</p>" },
            { front: "What is the safest first move?", back: "<p>Evaluate the specific point raised on its merits before deciding whether the tone itself needs to be addressed.</p>" },
          ] },
          { type: "knowledgeCheck", id: "cq-latin-europe-2-check", question: "A colleague raises her voice in animated disagreement about a project timeline. What is the most accurate response?", options: [
            { text: "Ask her privately to keep a calmer tone in future meetings before addressing her concern.", correct: false },
            { text: "Recognize the expressiveness as a common sign of engagement and respond to the substance of her timeline concern.", correct: true },
            { text: "Avoid raising contested topics with her in group settings going forward.", correct: false },
          ], feedbackCorrect: "Right. Responding to the substance respects her engagement and avoids misreading an expressive style as unprofessional.", feedbackIncorrect: "Consider what animated disagreement typically signals in this communication style, and what deserves the actual response." },
        ],
      },
      {
        id: "cq-latin-europe-3",
        number: 3,
        title: "Serving a participant who wants the relationship first",
        summary: "A participant who wants to talk, build rapport and be known as a person before diving into paperwork is not stalling — relational connection is a strong population-level value in this cluster.",
        minutes: 9,
        learning: {
          objective: "Serve a participant who wants relational connection before business by making room for it within the appointment, without assuming every participant from this background wants the same pacing.",
          takeaways: [
            "Population-level research describes strong relational and high-context communication norms in this cluster; time spent in personal conversation before business is often experienced as the foundation of a trustworthy relationship, not a delay.",
            "A participant who wants to talk before the paperwork begins may be signaling that they need to feel personally known before they trust the process.",
            "Any individual participant may prefer to move straight to business — the respectful approach is to read the specific person's cues rather than assuming pacing from background alone.",
          ],
          evidence: "A scenario decision about a participant who wants to talk before starting a benefits interview, and a knowledge check on making room for relational connection within an appointment.",
          appliedNextStep: "In your next appointment, notice whether the participant wants to talk before business starts, and build a few minutes of genuine conversation into your own pacing rather than redirecting immediately.",
        },
        scenario: {
          context: "A participant whose family background traces to Portugal spends the first several minutes of a scheduled benefits appointment talking about her family and asking about your day before you can begin the intake questions. Your schedule has back-to-back appointments booked in fifteen-minute blocks.",
          prompt: "What is the most respectful next step?",
          options: [
            { label: "Politely redirect immediately: “I'd love to chat, but let's get started on the paperwork so we don't run out of time.”", response: "This treats the relational opening as an obstacle to the real work, when for this participant it may be part of how trust and comfort with the process are built." },
            { label: "Allow a few genuine minutes of conversation, then transition warmly into the intake questions, adjusting your schedule where possible to make room for it.", response: "This respects a relational pacing preference without abandoning the required intake, and treats the conversation as part of good service rather than a delay.", recommended: true },
            { label: "Ask her to reschedule for a longer appointment slot so there is time for both conversation and paperwork.", response: "This may be useful going forward, but redirects a reasonable, immediate need rather than making a small accommodation in the moment." },
          ],
        },
        transfer: {
          prompt: "Think of an appointment where a participant wanted to talk before business began. What would change if you built a few minutes of that into your own pacing rather than redirecting immediately?",
          options: ["Name one recent appointment where a participant wanted to talk first", "Note how you responded in the moment", "Identify how you could build a few minutes of room into similar appointments going forward"],
        },
        blocks: [
          { type: "text", heading: "Relationship as the foundation, not the delay", body: "<p>Population-level research on Latin Europe describes strong relational values and high-context communication: personal connection is often the foundation that makes business trustworthy, not a separate, optional step before the real work starts. A participant who wants to talk, ask about you, or share context about their family before an intake interview may be building the comfort they need to engage fully and honestly with the process that follows.</p><p>This is a population-level tendency, and it will not describe every participant connected to this cluster, nor is the need for rapport exclusive to this cluster. The service skill is reading the specific participant's cues — does this person want to talk first, or move straight to business — and making room for a few minutes of genuine connection when that is what is needed, without letting it replace the required intake.</p>" },
          { type: "list", heading: "Practices that make room for relational pacing", items: ["Allow a few minutes of genuine conversation at the start of an appointment when a participant initiates it, rather than redirecting immediately.", "Build a small buffer into scheduling for appointments where relational pacing is likely to matter, where your caseload allows.", "Transition warmly and explicitly — “I'd love to hear more about that — let's start the paperwork so we have time for both” — rather than cutting the conversation off abruptly."] },
          { type: "leaderMove", heading: "Make room without losing the required work", control: "You control how the first few minutes of an appointment are paced. You do not control, and should not skip, the required intake content.", failure: "Do not treat a participant's wish to connect personally as an obstacle to be redirected away from immediately.", next: "In your next appointment, notice whether the participant wants to talk first, and build a warm, brief transition into your pacing instead of redirecting right away." },
          { type: "flashcards", heading: "Serving a relational pacing preference", cards: [
            { front: "Why might a participant want to talk before business starts?", back: "<p>A population-level value placing personal connection as the foundation for trust, not a delay tactic or lack of seriousness about the process.</p>" },
            { front: "What should never be skipped?", back: "<p>The required intake or eligibility content — making room for connection means adjusting pacing, not the substance of the appointment.</p>" },
            { front: "What is the safest approach?", back: "<p>Read the specific participant's cues rather than assuming pacing preferences from background alone.</p>" },
          ] },
          { type: "knowledgeCheck", id: "cq-latin-europe-3-check", question: "A participant wants to talk personally for a few minutes before a scheduled benefits interview begins. What is the most respectful response?", options: [
            { text: "Redirect immediately to the intake questions to protect the appointment schedule.", correct: false },
            { text: "Allow a few genuine minutes of conversation, then transition warmly into the required intake.", correct: true },
            { text: "Ask her to reschedule for a longer appointment before continuing.", correct: false },
          ], feedbackCorrect: "Right. Making room for a brief relational opening respects her pacing preference while still completing the required work.", feedbackIncorrect: "Consider how to make room for relational connection without skipping or delaying the required intake." },
        ],
      },
      {
        id: "cq-latin-europe-4",
        number: 4,
        title: "Pacing meetings so relationship and task both fit",
        summary: "A team that moves straight to business can miss the relational foundation that makes collaboration work well for some colleagues. Adjust pacing, not standards.",
        minutes: 9,
        learning: {
          objective: "Adjust a team's meeting pacing and feedback approach so that colleagues who value relational connection and colleagues who prefer a fast, task-first pace can both work well together, without asking either group to abandon their preference.",
          takeaways: [
            "A meeting culture that moves straight to business by default can leave relationally-oriented colleagues feeling that the team, and their contributions, are not really known or valued.",
            "A brief, intentional relational opening does not have to come at the expense of an efficient agenda — the two can coexist with deliberate structure.",
            "The goal is a shared meeting practice that works for both pacing preferences, not a request that either group permanently adapt to the other's default.",
          ],
          evidence: "A scenario decision about redesigning a team's meeting format to include relational time, and a knowledge check on structuring both without sacrificing either.",
          appliedNextStep: "In your next team meeting, add a short, genuine relational opening before the agenda, and track whether it changes engagement from colleagues who value that pacing.",
        },
        scenario: {
          context: "Your team includes a colleague, shaped by a relational, high-context communication style, who has mentioned that team meetings feel cold and impersonal because they move straight into the agenda every time. Other staff prefer to keep meetings short and task-focused because of a heavy caseload.",
          prompt: "What is the best way to adjust the team's meeting practice?",
          options: [
            { label: "Add a full ten to fifteen minutes of open social time to every meeting to build relationships properly.", response: "This may address the relational concern but could overcorrect for a team already managing a heavy caseload and tight schedules." },
            { label: "Add a short, intentional relational opening — two or three minutes — to every meeting, then move into a focused, efficient agenda.", response: "This makes room for genuine connection without significantly extending meeting length, addressing both the relational and time-pressure concerns.", recommended: true },
            { label: "Keep meetings exactly as they are, since changing the format for one colleague would be unfair to the rest of the team.", response: "Leaving the format unchanged continues to make the relationally-oriented colleague feel unseen, and does not test whether a small, low-cost change would help." },
          ],
        },
        transfer: {
          prompt: "Think of a recurring meeting your team runs that goes straight to business. What would change if you added a short, genuine relational opening without extending the meeting significantly?",
          options: ["Name one recurring meeting that currently skips relational opening", "Draft a short relational opening question you could add", "Note how you would keep the rest of the agenda on schedule"],
        },
        blocks: [
          { type: "text", heading: "A short opening can serve both preferences", body: "<p>A meeting culture built entirely around efficiency can unintentionally signal to relationally-oriented colleagues that the team, and by extension their contributions, are not really known as people. At the same time, a heavy caseload is a real constraint, and a lengthy social period before every meeting is not a realistic fix for most DHS teams. The useful middle path is a short, intentional relational opening — two or three minutes, genuinely engaged with rather than rushed through — followed by a focused, efficient agenda.</p><p>This is not a permanent tradeoff between relationship and efficiency; a brief, consistent relational habit tends to build trust that makes the rest of the meeting run more smoothly, not less.</p>" },
          { type: "list", heading: "Building pacing that works for both preferences", items: ["Open meetings with a short, genuine question — not a scripted icebreaker — before moving into the agenda.", "Keep the relational opening time-bounded and consistent, so it does not crowd out the task-focused work the team also needs.", "Check in periodically with the team about whether the pacing is working for both preferences, rather than assuming it once and leaving it unexamined."] },
          { type: "leaderMove", heading: "Protect a short relational opening as part of the agenda, not separate from it", control: "You control whether your meeting format includes a brief, genuine relational opening or moves straight to task.", failure: "Do not let a heavy caseload become an excuse to skip a two-minute opening that could meaningfully change how included a colleague feels.", next: "In your next team meeting, add a short relational opening and ask afterward whether it felt useful to the team." },
          { type: "tabs", heading: "A short opening in practice", tabs: [
            { label: "Before", body: "<p>Meeting opens immediately with “Okay, four items today” and moves straight through the agenda.</p>" },
            { label: "After", body: "<p>Meeting opens with a genuine question — “how did the training go this week?” — for two to three minutes, then moves into the same four-item agenda.</p>" },
          ] },
          { type: "knowledgeCheck", id: "cq-latin-europe-4-check", question: "A relationally-oriented colleague finds team meetings cold because they move straight to business, while other staff are pressed for time. What is the best fix?", options: [
            { text: "Add ten to fifteen minutes of open social time to every meeting.", correct: false },
            { text: "Add a short, intentional relational opening of a few minutes before an efficient, focused agenda.", correct: true },
            { text: "Keep the meeting format unchanged to avoid favoring one colleague's preference.", correct: false },
          ], feedbackCorrect: "Right. A brief, consistent relational opening serves both the need for connection and the team's time constraints.", feedbackIncorrect: "Consider a solution that makes room for genuine connection without significantly extending the meeting." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Latin Europe: quick reference",
    subtitle: "A one-page reminder for working with colleagues and partners connected to the Latin Europe cluster",
    quote: "Latin Europe is distinctive in blending individualism with emotional expressiveness and high-context communication — people value personal autonomy and deep relational attunement simultaneously.",
    use: {
      purpose: "Keep the Latin Europe cluster’s key patterns and suggestive practices ready for your next cross-cultural interaction.",
      remember: ["Individualism: Moderate to high — personal expression and autonomy valued", "Power distance: Moderate — expertise and status respected", "Communication: High context — implicit meaning, relational signals", "Expressiveness: Affective — emotions openly shared and welcomed", "Time: Polychronic — flexible, relationship-driven time use"],
      doNext: "Apply one suggestive practice from this module in your next relevant interaction.",
    },
    sections: [
      { heading: "Suggestive practices", items: ["Make time for the meal \— In Latin European relationships, shared meals are where trust is built. Block calendar time for relationship cultivation, not just task completion.", "Engage ideas passionately \— Don't shy away from spirited debate. It's a sign of intellectual respect. Calm agreement can read as indifference.", "Read between the lines \— High context communication means key information is embedded in tone, timing, and relationship. Pay attention to what isn't said.", "Honor expertise with deference \— Credentials and professional experience matter. Introduce your background and recognize the expertise of your counterparts explicitly."] },
      { heading: "Before you assume", items: ["Clusters describe broad patterns, not individual people.", "Use this module as a starting point for curiosity, never as a conclusion about a specific person.", "When in doubt, ask the person directly about their own preferences and context."] },
    ],
  },
  sources: [
    { title: "Livermore, D. (2013). Expand Your Borders: Discover Ten Cultural Clusters. Cultural Intelligence Center.", href: "https://culturalq.com", note: "Source framework for the ten cultural clusters, their key dimensions, and this module's scenario and practice content." },
  ],
};

export default pack;
