import type { CoursePack } from "../../source-types";

// Cultural Intelligence curriculum, module 4: Eastern Europe — The Resilience Cluster.
// Based on: Livermore, D. (2013). Expand Your Borders: Discover Ten Cultural Clusters. Cultural Intelligence Center.
const pack: CoursePack = {
  course: {
    id: "cq-eastern-europe",
    indexNumber: 1132,
    seriesLabel: "Cultural Intelligence \u00b7 Expand Your Borders",
    title: "Eastern Europe: The Resilience Cluster",
    subtitle: "Eastern Europe is a cluster shaped by centuries of empire, occupation, and survival.",
    scope: "For all DHS staff. One of ten modules in the Expand Your Borders cross-cultural intelligence curriculum. Clusters describe broad patterns, not individual people — use them as starting points for curiosity, never as endpoints for judgment about any one person.",
    treatment: "One module with a scenario, reflection questions, suggestive practices, and a knowledge check",
    duration: "45\u201350 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/stock-people-04.jpg",
    coverAlt: "Colleagues meeting around a table, including a colleague using a wheelchair.",
    introTranscript: "Eastern Europe is a cluster shaped by centuries of empire, occupation, and survival. These cultures tend to be collectivist and relationship-driven, with high respect for elders and authority figures — yet a simultaneous wariness of institutional power born from historical trauma. Emotional expression is authentic and open among trusted circles, yet guarded with strangers. Hospitality is a deep cultural value. Once trust is earned, loyalty is profound.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Describe the core cultural dimensions of the Eastern Europe cluster and how they shape communication and decision-making.",
        "Respond to a realistic cross-cultural scenario in a way that reads the situation accurately rather than through your own cultural default.",
        "Apply at least one suggestive practice from this module in a real cross-cultural interaction.",
      ],
      evidence: [
        "A worked scenario decision with an explanation of why it fits the cluster's cultural patterns.",
        "One knowledge check on this cluster's most distinctive cultural dimension.",
      ],
      appliedNextStep: "Practice one suggestive behavior from this module in your next interaction with a colleague or partner connected to the Eastern Europe cluster.",
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
        id: "cq-eastern-europe-1",
        number: 1,
        title: "Eastern Europe",
        summary: "The Resilience Cluster. Eastern Europe is a cluster shaped by centuries of empire, occupation, and survival",
        minutes: 20,
        learning: {
          objective: "Describe the Eastern Europe cluster’s core cultural dimensions and respond accurately to a realistic cross-cultural scenario.",
          takeaways: [
            "Power distance: Moderate to high — respect for authority and elders",
            "Collectivism: Strong in-group loyalty; family and community centered",
            "Uncertainty avoidance: High — preference for stability and known systems",
            "Communication: Moderate context — direct within trusted circles",
            "Resilience: Adaptive — history of navigating systemic hardship"
          ],
          evidence: "A worked scenario decision, a set of reflection questions, and a knowledge check.",
          appliedNextStep: "Choose one suggestive practice from this module and apply it in your next relevant interaction.",
        },
        scenario: {
          context: "You are managing a new team member from Poland, Marta, who is highly competent but never volunteers ideas in group meetings. In one-on-ones she is thoughtful and full of insights. Your instinct is to coach her to \"speak up more.\"",
          prompt: "How do you respond?",
          options: [
        { label: "Address it directly: tell Marta she needs to share her ideas in meetings to be seen as a leader.", response: "This treats a cultural norm around when it feels appropriate to speak as a personal deficiency to be corrected." },
        { label: "Recognize that in high power distance contexts, speaking up uninvited can feel presumptuous — and restructure meetings to explicitly invite her voice.", response: "This is the accurate reading. The barrier is structural, not personal — an explicit invitation removes it without asking her to abandon a norm she's comfortable with.", recommended: true },
        { label: "Assign Marta a presentation to force her into the spotlight.", response: "This forces a change in behavior without addressing why she hasn't volunteered ideas, and risks feeling punitive rather than supportive." }
          ],
        },
        transfer: {
          prompt: "Eastern European cultures place deep value on loyalty to in-groups. Who do you consider your \"in-group\" at work, and how might that limit your cross-cultural relationships?",
          options: ["How might historical trauma — such as occupation, censorship, or authoritarian rule — shape how someone relates to institutional authority today?", "Have you ever dismissed someone's quietness as lack of engagement? What might you have missed?", "Name one meeting where you could build in a structured, explicit invitation for a quieter colleague to speak."],
        },
        blocks: [
          { type: "text", heading: "Cluster overview", body: "<p>Eastern Europe is a cluster shaped by centuries of empire, occupation, and survival. These cultures tend to be collectivist and relationship-driven, with high respect for elders and authority figures — yet a simultaneous wariness of institutional power born from historical trauma. Emotional expression is authentic and open among trusted circles, yet guarded with strangers. Hospitality is a deep cultural value. Once trust is earned, loyalty is profound.</p><p><strong>Region:</strong> Czech Republic, Greece, Hungary, Kazakhstan, Poland, Russia, Slovakia, Slovenia</p>" },
          { type: "list", heading: "Key cultural dimensions", items: ["Power distance: Moderate to high — respect for authority and elders", "Collectivism: Strong in-group loyalty; family and community centered", "Uncertainty avoidance: High — preference for stability and known systems", "Communication: Moderate context — direct within trusted circles", "Resilience: Adaptive — history of navigating systemic hardship"] },
          { type: "list", heading: "Reflect", ordered: true, items: ["Eastern European cultures place deep value on loyalty to in-groups. Who do you consider your \"in-group\" at work, and how might that limit your cross-cultural relationships?", "How might historical trauma — such as occupation, censorship, or authoritarian rule — shape how someone relates to institutional authority today?", "Have you ever dismissed someone's quietness as lack of engagement? What might you have missed?"] },
          { type: "flashcards", heading: "Suggestive practices", cards: [
            { front: "Invest in trust before tasks", back: "<p>Relationship-building is non-negotiable in Eastern European cultures. Share personal context before diving into business requests.</p>" },
            { front: "Create structured invitation", back: "<p>In meetings, use round-robin formats or explicit invitations (\"Marta, what's your take?\") to welcome voices shaped by high power distance norms.</p>" },
            { front: "Accept hospitality graciously", back: "<p>Refusing food, drink, or a host's care in Eastern European contexts can signal disrespect. Participate warmly even when it's not your custom.</p>" },
            { front: "Learn a word or two", back: "<p>Making the effort to greet someone in their language — even imperfectly — signals respect that crosses cultural barriers immediately.</p>" }
          ] },
          { type: "knowledgeCheck", id: "cq-eastern-europe-1-check", question: "What best explains why Eastern European professionals may be reluctant to speak up in hierarchical meetings?", options: [{ text: "They lack confidence in their professional skills", correct: false }, { text: "High power distance norms shape when speaking up feels appropriate", correct: true }, { text: "They prefer written communication over verbal", correct: false }, { text: "They are disengaged from the organization's goals", correct: false }], feedbackCorrect: "High power distance norms mean that speaking up uninvited — especially to challenge authority — can feel culturally inappropriate. This is a structural norm, not a sign of disengagement or incapacity.", feedbackIncorrect: "Look again at the cluster’s key dimensions — High power distance norms mean that speaking up uninvited — especially to challenge authority — can feel culturally inappropriate. This is a structural norm, not a sign of disengagement or incapacity." },
        ],
      },
      {
        id: "cq-eastern-europe-2",
        number: 2,
        title: "Quiet caution is not disengagement",
        summary: "Guarded caution toward a new institution or a new colleague from a colleague connected to the Eastern Europe cluster is often a learned response to authority, not a lack of interest.",
        minutes: 9,
        learning: {
          objective: "Recognize guarded, cautious behavior toward an institution or a new colleague as a possible population-level response shaped by historical experience with authority, rather than as disengagement or distrust of a specific person.",
          takeaways: [
            "Population-level research describes a wariness of institutional power in some communities in this cluster, often shaped by historical experience with occupation, censorship or authoritarian rule.",
            "Trust in this cluster is often earned gradually and through relationship, not assumed at the outset — caution at first contact is not the same as a closed door.",
            "Consistent, transparent follow-through over time is the accurate response to guardedness, not more information delivered faster.",
          ],
          evidence: "A scenario decision about a new colleague who is guarded in early team interactions, and a knowledge check on distinguishing caution from disengagement.",
          appliedNextStep: "With a new colleague or contact who seems guarded, commit to consistent, transparent follow-through over several interactions rather than trying to build trust in one conversation.",
        },
        scenario: {
          context: "A new colleague on your team, whose family emigrated from Poland, answers questions carefully in team meetings, rarely volunteers information about her own work, and seems to hold back until she has watched how the team operates for several weeks. A supervisor comments, “She doesn't seem very invested yet.”",
          prompt: "What is the most accurate response to that comment?",
          options: [
            { label: "Agree, and suggest giving her a smaller role until she shows more investment.", response: "This reads caution as low investment and could reduce her opportunities based on a likely misread of a normal trust-building process." },
            { label: "Note that careful, guarded behavior with a new team is common and often reflects a learned caution around institutions rather than low investment, and suggest continuing consistent, transparent follow-through.", response: "This is the accurate read. Guardedness at the outset is common and typically resolves as trust is built through consistent, transparent behavior over time.", recommended: true },
            { label: "Ask her directly in a team meeting why she seems so quiet, to encourage her to open up faster.", response: "Putting the request on public display in a meeting risks feeling like pressure rather than the steady, private trust-building that usually works better." },
          ],
        },
        transfer: {
          prompt: "Think of a colleague or participant who seemed guarded when you first worked with them. What changed, if anything, as trust built over time?",
          options: ["Name one colleague or participant who seemed guarded at first", "Note what, if anything, helped trust develop over subsequent interactions", "Identify one thing you could do consistently to build trust with someone new"],
        },
        blocks: [
          { type: "text", heading: "Caution as a learned, reasonable response", body: "<p>Population-level research on Eastern Europe describes communities shaped by histories of occupation, censorship and authoritarian institutions, alongside strong loyalty within trusted in-groups. One common pattern that follows is caution toward new institutions and new relationships until trust is established — not because the person lacks investment or interest, but because guardedness has historically been a reasonable, protective response to institutional power.</p><p>This is a broad, population-level pattern; some colleagues and participants connected to this cluster will be immediately open, and some colleagues from entirely different backgrounds will be just as guarded for their own reasons. The service-relevant skill is not assuming disengagement from caution, and building trust gradually and consistently rather than expecting it upfront.</p>" },
          { type: "list", heading: "What builds trust over time", items: ["Following through consistently on small commitments, so reliability is demonstrated rather than only claimed.", "Being transparent about process and decisions, even when the news is not what the person wants to hear.", "Giving space for trust to build gradually rather than pushing for openness in the first few interactions."] },
          { type: "leaderMove", heading: "Read caution as a signal to build trust, not a verdict on investment", control: "You control how you interpret and respond to a new colleague's or participant's guardedness.", failure: "Do not reduce someone's role or opportunities based on early caution that may simply reflect a normal trust-building process.", next: "With a colleague or participant who seems guarded, track your own consistency and transparency over the next several interactions rather than expecting rapid openness." },
          { type: "flashcards", heading: "Distinguishing caution from disengagement", cards: [
            { front: "Why might a new colleague seem guarded at first?", back: "<p>A population-level pattern of caution toward institutions, often shaped by historical experience, that typically eases as trust builds.</p>" },
            { front: "What is the risk of misreading it?", back: "<p>Treating caution as low investment can lead to reduced opportunities or trust, reinforcing the very guardedness it misread.</p>" },
            { front: "What actually builds trust here?", back: "<p>Consistent, transparent follow-through over multiple interactions, not a single conversation or faster information delivery.</p>" },
          ] },
          { type: "knowledgeCheck", id: "cq-eastern-europe-2-check", question: "A new colleague is guarded and slow to volunteer information in her first weeks on a team. What is the most accurate interpretation?", options: [
            { text: "She is likely not invested in the team's work.", correct: false },
            { text: "Her caution may reflect a common, learned response to institutions and will likely ease as consistent trust is built.", correct: true },
            { text: "She should be given a smaller role until she opens up.", correct: false },
          ], feedbackCorrect: "Right. Reading caution as a trust-building process, not a verdict on investment, is the accurate response.", feedbackIncorrect: "Consider what guardedness with a new institution commonly reflects, and what response actually builds trust over time." },
        ],
      },
      {
        id: "cq-eastern-europe-3",
        number: 3,
        title: "Serving a participant who is wary of the system",
        summary: "A participant who is guarded with a government agency may be responding to real historical experience with institutions, not to anything the caseworker has done.",
        minutes: 9,
        learning: {
          objective: "Serve a participant who shows wariness toward a government agency by building trust through transparency and consistency, without assuming every participant from this background will respond the same way.",
          takeaways: [
            "Population-level research describes wariness of institutional power in some communities in this cluster, shaped by historical experience that predates any interaction with this agency.",
            "A participant's guardedness toward paperwork, disclosure or an agency's authority may reflect this broader pattern rather than anything about the specific caseworker.",
            "Any individual participant may not carry this wariness at all — the respectful approach is transparency, consistency and patience, regardless of the participant's background.",
          ],
          evidence: "A scenario decision about a participant who is reluctant to disclose full information on an application, and a knowledge check on responding with transparency rather than pressure.",
          appliedNextStep: "With a participant who seems wary of the process, explain clearly what information is used for and why, and follow through visibly on what you say you will do.",
        },
        scenario: {
          context: "A participant whose family emigrated from Hungary is reluctant to provide full household information on a benefits application, asks repeatedly who will see the information, and seems anxious about the process generally. A colleague suggests, “Just tell her it's required, she has to fill it out.”",
          prompt: "What is the most respectful next step?",
          options: [
            { label: "Tell her plainly that the information is required and she must provide it to proceed.", response: "This is accurate but does not address the underlying wariness that is likely the actual barrier to her comfort with the process." },
            { label: "Explain clearly and specifically who will see the information, what it is used for, and why it is required, and give her time to ask follow-up questions before she completes the form.", response: "This treats her wariness as a reasonable response to unfamiliarity with the agency's process, and addresses it with transparency rather than pressure.", recommended: true },
            { label: "Suggest she skip the sections she is uncomfortable with and note them as declined.", response: "This may leave the application incomplete or delay her eligibility rather than addressing the actual source of her hesitation." },
          ],
        },
        transfer: {
          prompt: "Think of a participant who seemed wary of a required process. What would change if you explained the purpose and handling of the information more transparently before asking them to comply?",
          options: ["Name one recent case where a participant seemed hesitant about required disclosure", "Write what explanation, if any, was given about how the information would be used", "Draft a clearer explanation you could offer next time before asking for compliance"],
        },
        blocks: [
          { type: "text", heading: "Wariness with a purpose", body: "<p>Population-level research on Eastern Europe describes a wariness of institutional power in some communities, shaped by real historical experience with surveillance, censorship or authoritarian control. A participant who hesitates to disclose household information to a government agency, or asks repeated questions about who will see it, may be carrying this pattern into an interaction that otherwise has nothing to do with their history.</p><p>This is a population-level tendency and will not describe every participant connected to this cluster, nor is it exclusive to this cluster — many participants from many backgrounds are wary of institutions for their own reasons. The service response is the same regardless of the reason: transparency about what information is used for, who sees it, and why it is required, delivered patiently rather than as a demand for compliance.</p>" },
          { type: "list", heading: "Practices that address wariness with transparency", items: ["Explain specifically who will see the information and what it is used for, before asking the participant to provide it.", "Answer follow-up questions about the process directly rather than treating them as delay tactics.", "Follow through visibly on what you say you will do with the information, since demonstrated reliability builds trust faster than reassurance alone."] },
          { type: "leaderMove", heading: "Meet wariness with transparency, not pressure", control: "You control how much you explain about a required process before asking a participant to comply with it.", failure: "Do not tell a wary participant that a step is simply required without explaining why, and do not let staff shortcut the application by skipping sections instead of addressing the hesitation.", next: "In your next case where a participant seems wary of a required disclosure, explain the purpose and handling of the information clearly before asking again." },
          { type: "flashcards", heading: "Serving a wary participant", cards: [
            { front: "Why might a participant hesitate to disclose required information?", back: "<p>A population-level pattern of wariness toward institutions, often shaped by historical experience unrelated to the specific agency or caseworker.</p>" },
            { front: "What response addresses it best?", back: "<p>Clear, specific transparency about how information is used and handled, delivered patiently rather than as a demand.</p>" },
            { front: "What should never be assumed?", back: "<p>That a specific participant's wariness, or lack of it, is explained by their cultural background alone.</p>" },
          ] },
          { type: "knowledgeCheck", id: "cq-eastern-europe-3-check", question: "A participant is reluctant to disclose required household information and asks repeatedly who will see it. What is the most respectful response?", options: [
            { text: "State plainly that the information is required and she must provide it.", correct: false },
            { text: "Explain specifically who will see the information, what it is used for, and why, and give her time to ask questions.", correct: true },
            { text: "Let her skip the sections she is uncomfortable with and mark them declined.", correct: false },
          ], feedbackCorrect: "Right. Transparency addresses the likely source of hesitation without pressuring or shortcutting the process.", feedbackIncorrect: "Consider what response addresses wariness toward an institution rather than simply restating the requirement." },
        ],
      },
      {
        id: "cq-eastern-europe-4",
        number: 4,
        title: "Inviting voices that hierarchy has taught to wait",
        summary: "A team practice built around speaking up unprompted can quietly silence colleagues shaped by higher power-distance norms. Structured invitation fixes the practice, not the person.",
        minutes: 9,
        learning: {
          objective: "Redesign a team meeting practice so that colleagues shaped by higher power-distance norms have a structured way to contribute, without requiring them to adopt an unprompted-speaking-up style that feels culturally uncomfortable.",
          takeaways: [
            "A team norm that rewards speaking up unprompted can systematically miss the input of colleagues who were raised to wait for an explicit invitation before addressing authority.",
            "A structured, round-robin or directly-invited turn to speak removes the barrier without asking anyone to abandon their comfort with hierarchy.",
            "The goal is a meeting practice that surfaces every colleague's expertise, not a request that quieter colleagues perform assertiveness that does not reflect them.",
          ],
          evidence: "A scenario decision about redesigning a team meeting to include a colleague who rarely speaks unprompted, and a knowledge check on structured invitation as the fix.",
          appliedNextStep: "In your next team meeting, build in one explicit, named turn for input from a colleague who typically waits to be asked.",
        },
        scenario: {
          context: "A highly capable colleague, whose background traces to Slovakia, rarely offers ideas in open team meetings but is thoughtful and detailed in one-on-one conversations. Her supervisor has started to wonder whether she has less to contribute than other, more vocal staff.",
          prompt: "What is the best way to address this?",
          options: [
            { label: "Coach her to speak up more often and more quickly in meetings to be seen as an equal contributor.", response: "This asks her to adopt a communication style that may conflict with a comfortable, culturally shaped norm around initiating with authority present." },
            { label: "Restructure meetings to include a specific, named turn for her input — for example, “[Name], what's your view on this?” — so her expertise has a structured opening.", response: "This removes the structural barrier to her participation without requiring her to change how she is comfortable engaging.", recommended: true },
            { label: "Continue as is, since it would be unfair to single her out for special treatment in meetings.", response: "Leaving the practice unchanged continues to advantage colleagues who are comfortable speaking up unprompted and misses her expertise." },
          ],
        },
        transfer: {
          prompt: "Think of a meeting practice on your team that assumes everyone will speak up unprompted. What would change if you built in a structured, named invitation instead?",
          options: ["Name one meeting or discussion format that rewards unprompted speaking", "Identify one colleague whose input might be missed by that format", "Draft a structured way to invite that colleague's input explicitly"],
        },
        blocks: [
          { type: "text", heading: "Structure removes the barrier hierarchy creates", body: "<p>In cultures with higher power distance, speaking up unprompted — especially in front of authority or in a group setting — can feel presumptuous, even when the person has real expertise to offer. A meeting practice that relies on people volunteering their views unprompted will systematically favor colleagues who are comfortable with that norm, and miss colleagues who are simply waiting for an appropriate, explicit invitation to speak.</p><p>The fix is structural, not personal: build a specific turn into the meeting — round-robin, a named question, a request for written input beforehand — so that speaking is invited rather than assumed to be volunteered. This gives every colleague, regardless of their comfort with unprompted speech, a real opening to contribute.</p>" },
          { type: "list", heading: "Structured invitations that work across this difference", items: ["Use a round-robin format so every person gets an explicit turn, rather than relying on volunteers.", "Name the person directly with a specific question: “[Name], what's your view on the timeline?”", "Offer a written or pre-meeting channel for input from colleagues who prefer to prepare before speaking in a group."] },
          { type: "leaderMove", heading: "Invite explicitly, do not wait for volunteers", control: "You control whether your meeting format relies on volunteered input or builds in structured turns for everyone.", failure: "Do not conclude that a quiet colleague has less to contribute before you have tried a structured way of inviting their input.", next: "In your next team meeting, add one specific, named turn for input from a colleague who typically waits to be asked." },
          { type: "flashcards", heading: "Building structured invitation", cards: [
            { front: "Why might a capable colleague stay quiet in meetings?", back: "<p>Higher power-distance norms can make speaking up unprompted feel presumptuous, regardless of the quality of the colleague's ideas.</p>" },
            { front: "What is the structural fix?", back: "<p>A round-robin, a directly named question, or a pre-meeting written channel — any format that invites input explicitly rather than assuming it will be volunteered.</p>" },
            { front: "What should the fix never require?", back: "<p>That the colleague change their comfort level with speaking up unprompted in order to be heard.</p>" },
          ] },
          { type: "knowledgeCheck", id: "cq-eastern-europe-4-check", question: "A capable colleague rarely speaks up unprompted in team meetings. What is the best way to include her expertise?", options: [
            { text: "Coach her to speak up more quickly and confidently like other team members.", correct: false },
            { text: "Build a structured, explicit turn into the meeting format so her input is directly invited.", correct: true },
            { text: "Leave the format unchanged to avoid singling her out.", correct: false },
          ], feedbackCorrect: "Right. A structural change invites her expertise without requiring her to change her comfort with speaking up unprompted.", feedbackIncorrect: "Consider whether the fix belongs to the colleague's communication style or to the meeting's structure." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Eastern Europe: quick reference",
    subtitle: "A one-page reminder for working with colleagues and partners connected to the Eastern Europe cluster",
    quote: "High power distance norms mean that speaking up uninvited — especially to challenge authority — can feel culturally inappropriate. This is a structural norm, not a sign of disengagement or incapacity.",
    use: {
      purpose: "Keep the Eastern Europe cluster’s key patterns and suggestive practices ready for your next cross-cultural interaction.",
      remember: ["Power distance: Moderate to high — respect for authority and elders", "Collectivism: Strong in-group loyalty; family and community centered", "Uncertainty avoidance: High — preference for stability and known systems", "Communication: Moderate context — direct within trusted circles", "Resilience: Adaptive — history of navigating systemic hardship"],
      doNext: "Apply one suggestive practice from this module in your next relevant interaction.",
    },
    sections: [
      { heading: "Suggestive practices", items: ["Invest in trust before tasks \— Relationship-building is non-negotiable in Eastern European cultures. Share personal context before diving into business requests.", "Create structured invitation \— In meetings, use round-robin formats or explicit invitations (\"Marta, what's your take?\") to welcome voices shaped by high power distance norms.", "Accept hospitality graciously \— Refusing food, drink, or a host's care in Eastern European contexts can signal disrespect. Participate warmly even when it's not your custom.", "Learn a word or two \— Making the effort to greet someone in their language — even imperfectly — signals respect that crosses cultural barriers immediately."] },
      { heading: "Before you assume", items: ["Clusters describe broad patterns, not individual people.", "Use this module as a starting point for curiosity, never as a conclusion about a specific person.", "When in doubt, ask the person directly about their own preferences and context."] },
    ],
  },
  sources: [
    { title: "Livermore, D. (2013). Expand Your Borders: Discover Ten Cultural Clusters. Cultural Intelligence Center.", href: "https://culturalq.com", note: "Source framework for the ten cultural clusters, their key dimensions, and this module's scenario and practice content." },
  ],
};

export default pack;
