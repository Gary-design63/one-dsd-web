import type { CoursePack } from "../../source-types";

// Cultural Intelligence curriculum, module 1: Nordic Europe — The Equality Cluster.
// Based on: Livermore, D. (2013). Expand Your Borders: Discover Ten Cultural Clusters. Cultural Intelligence Center.
const pack: CoursePack = {
  course: {
    id: "cq-nordic-europe",
    indexNumber: 1129,
    seriesLabel: "Cultural Intelligence \u00b7 Expand Your Borders",
    title: "Nordic Europe: The Equality Cluster",
    subtitle: "Nordic Europe is one of the most egalitarian cultural clusters in the world.",
    scope: "For all DHS staff. One of ten modules in the Expand Your Borders cross-cultural intelligence curriculum. Clusters describe broad patterns, not individual people — use them as starting points for curiosity, never as endpoints for judgment about any one person.",
    treatment: "One module with a scenario, reflection questions, suggestive practices, and a knowledge check",
    duration: "45\u201350 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/stock-people-01.jpg",
    coverAlt: "Four colleagues standing together, reviewing a document one of them is holding.",
    introTranscript: "Nordic Europe is one of the most egalitarian cultural clusters in the world. Status differences are minimized, direct communication is prized, and personal freedom coexists with strong social responsibility. Societies here tend to be \"loose\" cultures — adaptable, tolerant of ambiguity, and open to individual expression. Work-life balance is treated as a right, not a perk, and hierarchy is kept flat by design.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Describe the core cultural dimensions of the Nordic Europe cluster and how they shape communication and decision-making.",
        "Respond to a realistic cross-cultural scenario in a way that reads the situation accurately rather than through your own cultural default.",
        "Apply at least one suggestive practice from this module in a real cross-cultural interaction.",
      ],
      evidence: [
        "A worked scenario decision with an explanation of why it fits the cluster's cultural patterns.",
        "One knowledge check on this cluster's most distinctive cultural dimension.",
      ],
      appliedNextStep: "Practice one suggestive behavior from this module in your next interaction with a colleague or partner connected to the Nordic Europe cluster.",
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
        id: "cq-nordic-europe-1",
        number: 1,
        title: "Nordic Europe",
        summary: "The Equality Cluster. Nordic Europe is one of the most egalitarian cultural clusters in the world",
        minutes: 20,
        learning: {
          objective: "Describe the Nordic Europe cluster’s core cultural dimensions and respond accurately to a realistic cross-cultural scenario.",
          takeaways: [
            "Individualism: Moderate — personal freedom with social responsibility",
            "Power distance: Very low — flat hierarchies, status minimized",
            "Communication: Low context — direct, explicit, understated",
            "Competition: Cooperative — relationships and well-being valued",
            "Time orientation: Short-term — present quality of life matters most"
          ],
          evidence: "A worked scenario decision, a set of reflection questions, and a knowledge check.",
          appliedNextStep: "Choose one suggestive practice from this module and apply it in your next relevant interaction.",
        },
        scenario: {
          context: "You are leading a multinational project kickoff meeting. Your Nordic colleague, Astrid, consistently challenges the project manager's decisions in open discussion — including yours. She speaks plainly, sometimes bluntly, and does not soften her critiques. Other team members from more hierarchical cultures seem uncomfortable.",
          prompt: "How do you respond?",
          options: [
        { label: "Speak privately with Astrid after the meeting to ask her to tone down her feedback in front of the group.", response: "Recognizing her directness as a cultural norm, not a personal overstep, is the more accurate reading — asking her to soften it treats a low-power-distance norm as a personal fault." },
        { label: "Recognize that Astrid's directness reflects low power distance norms and publicly affirm the value of her honest input.", response: "This is the accurate reading. Nordic directness reflects a cultural norm of minimized status difference, not disrespect — affirming it openly signals that honest challenge is welcome.", recommended: true },
        { label: "Restructure the meeting to make feedback anonymous so no one feels put on the spot.", response: "This avoids the discomfort without helping the team understand why directness shows up differently across cultures — it treats the symptom, not the pattern." }
          ],
        },
        transfer: {
          prompt: "Think of a time you equated directness with disrespect. What cultural assumption was underneath that reaction?",
          options: ["How does your organization's hierarchy compare to Nordic flat-structure norms? What would change if status were minimized?", "The \"Janteloven\" (Law of Jante) warns against thinking you are better than others. Where do you see this value — or its absence — in your workplace?", "Name one meeting or message this week where you could test a flatter, more direct approach."],
        },
        blocks: [
          { type: "text", heading: "Cluster overview", body: "<p>Nordic Europe is one of the most egalitarian cultural clusters in the world. Status differences are minimized, direct communication is prized, and personal freedom coexists with strong social responsibility. Societies here tend to be \"loose\" cultures — adaptable, tolerant of ambiguity, and open to individual expression. Work-life balance is treated as a right, not a perk, and hierarchy is kept flat by design.</p><p><strong>Region:</strong> Denmark, Finland, Iceland, Norway, Sweden</p>" },
          { type: "list", heading: "Key cultural dimensions", items: ["Individualism: Moderate — personal freedom with social responsibility", "Power distance: Very low — flat hierarchies, status minimized", "Communication: Low context — direct, explicit, understated", "Competition: Cooperative — relationships and well-being valued", "Time orientation: Short-term — present quality of life matters most"] },
          { type: "list", heading: "Reflect", ordered: true, items: ["Think of a time you equated directness with disrespect. What cultural assumption was underneath that reaction?", "How does your organization's hierarchy compare to Nordic flat-structure norms? What would change if status were minimized?", "The \"Janteloven\" (Law of Jante) warns against thinking you are better than others. Where do you see this value — or its absence — in your workplace?"] },
          { type: "flashcards", heading: "Suggestive practices", cards: [
            { front: "Flatten your meeting structure", back: "<p>Invite challenge from everyone, regardless of seniority. Create explicit space for dissent before decisions are finalized.</p>" },
            { front: "Honor work-life signals", back: "<p>Avoid scheduling communications after-hours with Nordic colleagues. Respect boundaries around personal time as a professional norm.</p>" },
            { front: "Communicate without bling", back: "<p>In written or visual materials, understate rather than oversell. Modesty in presentation signals credibility, not weakness.</p>" },
            { front: "Practice understated affirmation", back: "<p>Nordic cultures find effusive praise uncomfortable. Recognize good work with specificity and restraint rather than superlatives.</p>" }
          ] },
          { type: "knowledgeCheck", id: "cq-nordic-europe-1-check", question: "Which cultural value most distinctly characterizes Nordic Europe compared to other Western clusters?", options: [{ text: "High uncertainty avoidance and preference for rules", correct: false }, { text: "Very low power distance and cooperative orientation", correct: true }, { text: "Strong collectivism and in-group loyalty", correct: false }, { text: "High context communication and implicit meaning", correct: false }], feedbackCorrect: "Nordic Europe stands out for its very low power distance — authority is questioned openly, flat hierarchies are the norm, and egalitarianism shapes both social and professional life.", feedbackIncorrect: "Look again at the cluster’s key dimensions — Nordic Europe stands out for its very low power distance — authority is questioned openly, flat hierarchies are the norm, and egalitarianism shapes both social and professional life." },
        ],
      },
      {
        id: "cq-nordic-europe-2",
        number: 2,
        title: "Blunt is not cold: reading directness accurately",
        summary: "A short, unadorned email from a colleague connected to the Nordic Europe cluster can read as curt. Population-level research suggests it usually is not — and any one colleague may not fit the pattern at all.",
        minutes: 9,
        learning: {
          objective: "Read a blunt, unadorned message from a colleague connected to the Nordic Europe cluster as a likely communication-style difference rather than as coldness or disrespect, while checking that read against the specific person.",
          takeaways: [
            "Population-level research on low-context, low-power-distance cultures describes messages that state the point first and skip cushioning language — this is a broad pattern, never a fact about any one colleague until you know them.",
            "Reading a short, direct message as anger or dismissal often says more about the reader's own cultural default than about the sender's intent.",
            "The fastest way to close the gap is to ask directly how the person prefers to communicate, rather than guessing from tone in text.",
          ],
          evidence: "A scenario decision about a terse case-note email, and a knowledge check on the difference between directness and disrespect.",
          appliedNextStep: "Before you react to a blunt message from a colleague, pause and ask yourself whether you are reading tone into words that were only ever meant to be efficient.",
        },
        scenario: {
          context: "A DHS colleague whose family background traces to Norway sends a two-line email about a shared case plan: “This approach will not work. We need the updated income verification before Friday.” No greeting, no softening. Another teammate forwards it to you asking, “Is she mad at us?”",
          prompt: "What is the most accurate response to your teammate?",
          options: [
            { label: "Agree that the tone seems harsh and suggest the team ask her to add more warmth to future emails.", response: "This asks a colleague to abandon a direct communication style that, for many people raised in low-context, low-power-distance settings, signals efficiency and respect for the reader's time — not anger." },
            { label: "Explain that the message is stating the problem and the deadline plainly, most likely without any emotional charge behind it, and reply to the content rather than a tone that may not be there.", response: "This is the more accurate read. Directness in this style usually signals clarity and respect for time, not frustration — responding to the substance keeps the case moving.", recommended: true },
            { label: "Ignore the email until she follows up, since a short message like that does not deserve a quick reply.", response: "This treats an efficient message as a slight and stalls a case that has a real deadline attached to it." },
          ],
        },
        transfer: {
          prompt: "Think of a time you read a short, unadorned message from a colleague as cold. What would change if you responded to the content first and asked about tone directly, rather than guessing?",
          options: ["Name one recent message you read as blunt or curt", "Write what you assumed about the sender's mood, and whether you ever checked it with them", "Draft the reply you would send if you took the message at face value instead"],
        },
        blocks: [
          { type: "text", heading: "Why short can still mean respectful", body: "<p>Population-level research on Nordic Europe describes a low-context communication style paired with very low power distance: people say what they mean, skip the cushioning language, and expect the reader to take the words at face value rather than search them for hidden meaning. Combined with a strong work-life boundary, an email that gets straight to the point is often a sign that the writer respects your time enough not to pad the message.</p><p>None of this means every colleague with a Nordic-heritage background writes this way, or that anyone from a different background who writes a short email is imitating a cluster trait. It is a starting point for reading an ambiguous message with curiosity instead of alarm, and for checking the read against the actual person in front of you.</p>" },
          { type: "list", heading: "Signs you may be reading tone that was never intended", items: ["The message states a fact or a deadline with no adjectives attached, and you are supplying the emotional adjective yourself.", "You would use several sentences of cushioning for the same request, and its absence reads to you as a rebuke.", "You have not actually asked the person how they intended the message to land."] },
          { type: "leaderMove", heading: "Answer the content before you diagnose the tone", control: "You control whether you reply to what a message says or to a tone you inferred from its brevity.", failure: "Do not forward a blunt message around the office asking whether someone is upset before you have asked that person directly.", next: "The next time a message reads as curt, answer the substance first, then ask the sender directly how they prefer to communicate if the question still matters." },
          { type: "flashcards", heading: "Directness, not disrespect", cards: [
            { front: "What does a low-context style sound like in writing?", back: "<p>The point comes first, with little or no cushioning language. It is a stylistic pattern seen at the population level, not a judgment about the reader.</p>" },
            { front: "What is the safest first move?", back: "<p>Respond to the request or fact in the message. If tone still matters, ask the person directly rather than guessing.</p>" },
            { front: "What should you never assume?", back: "<p>That every colleague connected to this cluster communicates this way, or that a colleague from any other background who writes briefly is being cold.</p>" },
          ] },
          { type: "knowledgeCheck", id: "cq-nordic-europe-2-check", question: "A colleague's message is short, states a deadline, and has no greeting. What is the best first step?", options: [
            { text: "Assume the colleague is upset and address the tone before responding to the request.", correct: false },
            { text: "Respond to the deadline and the request in the message, since brevity in this style often signals efficiency rather than emotion.", correct: true },
            { text: "Wait for a warmer follow-up message before replying at all.", correct: false },
          ], feedbackCorrect: "Right. Answering the substance keeps the work moving and avoids reading emotion into a message that may carry none.", feedbackIncorrect: "Consider what a short, direct message usually signals in a low-context style, and whether the safest first move is to respond to its content." },
        ],
      },
      {
        id: "cq-nordic-europe-3",
        number: 3,
        title: "Serving a participant who declines help gracefully",
        summary: "Self-reliance is a strong population-level value in the Nordic Europe cluster. When a participant declines an offered service, the accurate read is rarely refusal.",
        minutes: 9,
        learning: {
          objective: "Serve a participant whose background traces to the Nordic Europe cluster respectfully when they decline offered assistance, without assuming every person from that background will respond the same way.",
          takeaways: [
            "Population-level research describes strong value placed on self-reliance and personal autonomy in this cluster; declining help can reflect that value rather than a lack of need.",
            "Describing an offer accurately, as a public service the person qualifies for and has every right to use rather than as charity, often changes whether a self-reliant participant accepts it.",
            "Any individual participant may not match this pattern at all — the accurate approach is to offer respectfully, explain the offer in plain terms, and let the person decide.",
          ],
          evidence: "A scenario decision about a home-care participant who declines a service, and a knowledge check on describing an offer as a public service the person qualifies for rather than as charity.",
          appliedNextStep: "In your next case where a participant declines a service, note how the offer was framed and whether describing it plainly as a public service the person qualifies for and has every right to use changes the response.",
        },
        scenario: {
          context: "You are completing a home-care needs assessment for an older participant whose family immigrated from Sweden two generations ago. She qualifies for home-delivered meals and light housekeeping support but says, “I don't need charity. I've always managed on my own.”",
          prompt: "What is the most respectful next step?",
          options: [
            { label: "Mark the services as declined and close that section of the assessment.", response: "This may leave a participant without support she qualifies for, simply because the first framing did not land." },
            { label: "Explain that these are public services she qualifies for and has every right to use, not charity, describe exactly what each service involves and what it would cost her, if anything, and let her decide again with that information.", response: "This respects her autonomy while correcting, truthfully, a framing that may have been the actual barrier — the decision stays hers either way.", recommended: true },
            { label: "Ask a family member to convince her to accept the services.", response: "This routes around her own decision-making rather than giving her the information to decide for herself." },
          ],
        },
        transfer: {
          prompt: "Think of a participant who declined a service you believed they needed. How was the offer framed, and what might change if you described it accurately as a public service the person qualifies for and has every right to use, and gave more specific detail?",
          options: ["Name one declined service from a recent case", "Write how the offer was originally framed", "Draft a plain-language reframe that names the service as something the person qualifies for and has every right to use, not a favor"],
        },
        blocks: [
          { type: "text", heading: "Self-reliance as a value, not a barrier", body: "<p>Population-level research on the Nordic Europe cluster describes a strong cultural emphasis on personal autonomy and self-sufficiency, alongside a societal expectation that public benefits are a shared right rather than a personal favor. A participant who has internalized a strong self-reliance norm may decline an offer that sounds like charity, while accepting the same service once it is described as a public service they qualify for and have every right to use.</p><p>Be accurate about what the service is. Home and community-based services are public programs a person qualifies for based on need and eligibility rules. They are not insurance a person has paid into, and telling a participant she has earned or paid for them may sound persuasive, but it is not true, and a participant who values straight talk is likely to notice. What is true is enough: she qualifies, it is not charity, and she has every right to use it.</p><p>This is a population-level tendency, not a rule for any specific person. Some participants whose families trace to this cluster will accept help readily; some participants from entirely different backgrounds will decline for the same self-reliance reasons. The service-delivery skill is the same either way: offer clearly, explain the service in plain terms, and respect whatever the person decides.</p>" },
          { type: "list", heading: "Practices that keep the decision with the participant", items: ["Describe the service specifically — what it includes, how often, and what it costs the participant, if anything.", "Frame eligibility as something the person qualifies for, not something being given out of pity.", "Offer once clearly, note the decision, and leave the door open for the person to ask again later without re-litigating the offer."] },
          { type: "leaderMove", heading: "Separate the offer from the outcome", control: "You control how clearly and respectfully a service is explained. You do not control whether the participant accepts it.", failure: "Do not treat a decline as a case-closed problem, and do not pressure a participant into a service they have clearly refused after a fair explanation.", next: "Before your next assessment, write out how you would explain a declined service, in plain language, as a public service the person qualifies for and has every right to use, before the conversation starts." },
          { type: "flashcards", heading: "Serving with respect, not assumption", cards: [
            { front: "Why might a participant decline a service they qualify for?", back: "<p>A strong self-reliance norm can make an offer sound like charity. Describing it accurately, as a public service she qualifies for and has every right to use, sometimes changes the answer — sometimes it does not, and that is the person's right.</p>" },
            { front: "What should never change based on cluster background?", back: "<p>The participant's right to decide. Cluster research informs how you explain an offer, never whether you respect the answer.</p>" },
            { front: "What is the safest assumption about any one participant?", back: "<p>That they may or may not match this pattern at all. Ask, explain clearly, and let them lead.</p>" },
          ] },
          { type: "knowledgeCheck", id: "cq-nordic-europe-3-check", question: "A participant connected to the Nordic Europe cluster declines a service she qualifies for, saying she does not need charity. What is the most respectful next step?", options: [
            { text: "Close out the service as declined without further explanation.", correct: false },
            { text: "Explain the service in plain terms as a public service she qualifies for and has every right to use, and let her decide again with that information.", correct: true },
            { text: "Assume all participants from this background will decline the same way and stop offering it to them going forward.", correct: false },
          ], feedbackCorrect: "Right. A clearer, respectful explanation keeps the decision with the participant without assuming her answer speaks for anyone else.", feedbackIncorrect: "Consider whether the framing of the offer, not the participant's actual need, may be the barrier — and whether the decision should stay hers." },
        ],
      },
      {
        id: "cq-nordic-europe-4",
        number: 4,
        title: "Leading a team across this difference",
        summary: "Adjust meeting structure, feedback and documentation so directness and relational warmth can both work on the same team, without asking anyone to abandon their style.",
        minutes: 9,
        learning: {
          objective: "Adjust a team's meeting, feedback and documentation practices so that colleagues with flat, direct norms and colleagues who expect more relational cushioning can both work well, without requiring either group to assimilate.",
          takeaways: [
            "A flat, direct meeting style can feel efficient to some staff and abrupt to others; naming the style explicitly, rather than assuming it, helps a mixed team calibrate.",
            "Written feedback that is accurate and useful for a direct-style colleague may need an added sentence of context for a colleague who expects more relational framing — both versions can be true and respectful.",
            "The goal is a team practice that works across the difference, not a request that either style become the only one used.",
          ],
          evidence: "A scenario decision about redesigning a team's feedback process, and a knowledge check on adapting practice without asking for assimilation.",
          appliedNextStep: "Before your next round of team feedback, ask each person, once, how direct they want written comments to be — and use their answer, not your own default.",
        },
        scenario: {
          context: "You supervise a unit with several staff whose direct, say-it-plainly style works well for a colleague raised in a Nordic-heritage household, but reads as harsh to two newer staff who expect more relational warmth before critical feedback. Written performance comments have started to cause friction on both sides.",
          prompt: "What is the best way to adjust the team's practice?",
          options: [
            { label: "Ask the direct-style staff member to soften all future written feedback to match what the newer staff expect.", response: "This asks one style to fully assimilate to the other rather than building a practice that works for the whole team." },
            { label: "Set a short, explicit norm for written feedback — lead with the specific behavior and its impact, then check with each person how much additional context they want — and apply it consistently across the team.", response: "This keeps feedback direct and useful while giving each person a say in how much framing they need, without forcing either style to disappear.", recommended: true },
            { label: "Let each person keep giving feedback in whatever style they prefer, since asking anyone to change is unfair.", response: "Without a shared norm, the friction will keep recurring for anyone whose default style differs from the reader's expectations." },
          ],
        },
        transfer: {
          prompt: "Think of a team practice — a meeting format, a feedback template, a documentation habit — that quietly assumes one communication style. What would change if you asked each person what works for them instead of assuming?",
          options: ["Name one team practice built around a single communication style", "Ask two colleagues with different styles what they would each want changed", "Draft one adjustment that keeps the practice useful for both"],
        },
        blocks: [
          { type: "text", heading: "Adapting practice, not requiring assimilation", body: "<p>A team that includes colleagues shaped by very different norms around directness and relational framing does not need everyone to adopt one style. It needs a shared, explicit practice that works across the difference. That usually means naming the default out loud — “we lead with the specific issue, then check how much context each person wants” — rather than leaving everyone to guess at an unstated norm drawn from whoever is loudest or most senior.</p><p>This applies to meetings, written feedback and documentation alike. A meeting that always opens with business may need two minutes of relational check-in added for staff who read straight-to-business as cold; a feedback template built entirely around efficient bullet points may need an optional line of context for staff who read bare bullet points as blunt. Neither addition erases the direct style; it makes room alongside it.</p>" },
          { type: "list", heading: "Adjustments that make room for more than one style", items: ["Open meetings with a brief, optional check-in before moving to the agenda, rather than assuming everyone wants business first.", "Offer a short menu for feedback delivery — direct and brief, or direct with added context — and let each person choose once.", "In documentation, separate the factual record (clear and specific) from any relational framing, so both needs are met without diluting either."] },
          { type: "leaderMove", heading: "Ask once, apply consistently", control: "You control whether your team's default practice is named explicitly and applied the same way for everyone, or left as an unstated assumption.", failure: "Do not single out the direct-style colleague as the one who needs to change, and do not let the newer staff's discomfort go unaddressed either.", next: "This month, ask each person on your team one question about how they want feedback framed, and build the answer into a shared written norm." },
          { type: "tabs", heading: "The same feedback, adapted for the reader", tabs: [
            { label: "Direct-style reader", body: "<p>“The report was submitted two days late. Please build in a buffer for the next deadline.” Clear, specific, no extra framing needed.</p>" },
            { label: "Context-preferring reader", body: "<p>“The report was submitted two days late, which pushed back the eligibility review. I know the caseload has been heavy — let's look at what would help you build in a buffer for the next deadline.” Same facts, with added context.</p>" },
          ] },
          { type: "knowledgeCheck", id: "cq-nordic-europe-4-check", question: "A supervisor wants written feedback to work for both direct-style staff and staff who expect more relational framing. What is the best approach?", options: [
            { text: "Require every staff member to adopt the same direct, no-context style.", correct: false },
            { text: "Set a shared norm that leads with the specific fact and impact, then lets each person choose how much added context they want.", correct: true },
            { text: "Give feedback only verbally so the written record never has to address the difference.", correct: false },
          ], feedbackCorrect: "Right. A shared, explicit norm that flexes on context — without losing clarity — works across the difference without requiring assimilation.", feedbackIncorrect: "Consider a practice that keeps feedback clear for everyone while giving each person a say in how much relational framing they want." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Nordic Europe: quick reference",
    subtitle: "A one-page reminder for working with colleagues and partners connected to the Nordic Europe cluster",
    quote: "Nordic Europe stands out for its very low power distance — authority is questioned openly, flat hierarchies are the norm, and egalitarianism shapes both social and professional life.",
    use: {
      purpose: "Keep the Nordic Europe cluster’s key patterns and suggestive practices ready for your next cross-cultural interaction.",
      remember: ["Individualism: Moderate — personal freedom with social responsibility", "Power distance: Very low — flat hierarchies, status minimized", "Communication: Low context — direct, explicit, understated", "Competition: Cooperative — relationships and well-being valued", "Time orientation: Short-term — present quality of life matters most"],
      doNext: "Apply one suggestive practice from this module in your next relevant interaction.",
    },
    sections: [
      { heading: "Suggestive practices", items: ["Flatten your meeting structure \— Invite challenge from everyone, regardless of seniority. Create explicit space for dissent before decisions are finalized.", "Honor work-life signals \— Avoid scheduling communications after-hours with Nordic colleagues. Respect boundaries around personal time as a professional norm.", "Communicate without bling \— In written or visual materials, understate rather than oversell. Modesty in presentation signals credibility, not weakness.", "Practice understated affirmation \— Nordic cultures find effusive praise uncomfortable. Recognize good work with specificity and restraint rather than superlatives."] },
      { heading: "Before you assume", items: ["Clusters describe broad patterns, not individual people.", "Use this module as a starting point for curiosity, never as a conclusion about a specific person.", "When in doubt, ask the person directly about their own preferences and context."] },
    ],
  },
  sources: [
    { title: "Livermore, D. (2013). Expand Your Borders: Discover Ten Cultural Clusters. Cultural Intelligence Center.", href: "https://culturalq.com", note: "Source framework for the ten cultural clusters, their key dimensions, and this module's scenario and practice content." },
  ],
};

export default pack;
