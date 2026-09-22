import type { CoursePack } from "../../source-types";

// Cultural Intelligence curriculum, module 8: Southern Asia — The Spiritual Diversity Cluster.
// Based on: Livermore, D. (2013). Expand Your Borders: Discover Ten Cultural Clusters. Cultural Intelligence Center.
const pack: CoursePack = {
  course: {
    id: "cq-southern-asia",
    indexNumber: 1136,
    seriesLabel: "Cultural Intelligence \u00b7 Expand Your Borders",
    title: "Southern Asia: The Spiritual Diversity Cluster",
    subtitle: "Southern Asia is a mosaic of languages, religions, and traditions — yet clusters around several core cultural patterns.",
    scope: "For all DHS staff. One of ten modules in the Expand Your Borders cross-cultural intelligence curriculum. Clusters describe broad patterns, not individual people — use them as starting points for curiosity, never as endpoints for judgment about any one person.",
    treatment: "Four lessons with scenarios, reflection questions, suggestive practices, and knowledge checks",
    duration: "45\u201350 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/stock-people-08.jpg",
    coverAlt: "A colleague presents an idea to two others gathered around a table.",
    introTranscript: "Southern Asia is a mosaic of languages, religions, and traditions — yet clusters around several core cultural patterns. Spiritual life permeates daily work. Hierarchy is accepted and navigated skillfully. Relationships are collectivist, warm, and contextual. Communication is high-context: tone, relationship, and timing carry as much meaning as words. Adaptability is a deep cultural strength — these societies have integrated enormous change while preserving ancient roots.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Describe the core cultural dimensions of the Southern Asia cluster and how they shape communication and decision-making.",
        "Respond to a realistic cross-cultural scenario in a way that reads the situation accurately rather than through your own cultural default.",
        "Apply at least one suggestive practice from this module in a real cross-cultural interaction.",
      ],
      evidence: [
        "A worked scenario decision with an explanation of why it fits the cluster's cultural patterns.",
        "One knowledge check on this cluster's most distinctive cultural dimension.",
      ],
      appliedNextStep: "Practice one suggestive behavior from this module in your next interaction with a colleague or partner connected to the Southern Asia cluster.",
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
        id: "cq-southern-asia-1",
        number: 1,
        title: "Southern Asia",
        summary: "The Spiritual Diversity Cluster. Southern Asia is a mosaic of languages, religions, and traditions — yet clusters around several core cultural patterns",
        minutes: 20,
        learning: {
          objective: "Describe the Southern Asia cluster’s core cultural dimensions and respond accurately to a realistic cross-cultural scenario.",
          takeaways: [
            "Power distance: High — hierarchy respected; directive leadership valued",
            "Collectivism: Strong — family, community, and spiritual community",
            "Communication: High context — indirect, tonal, relationship-embedded",
            "Spirituality: Central — religious values shape work and relationships",
            "Time: Polychronic and context-driven; flexible with time"
          ],
          evidence: "A worked scenario decision, a set of reflection questions, and a knowledge check.",
          appliedNextStep: "Choose one suggestive practice from this module and apply it in your next relevant interaction.",
        },
        scenario: {
          context: "You have a team lead, Priya, who excels at execution but rarely pushes back on directives from senior leadership — even when she sees flaws in the plan. You want her to be more assertive.",
          prompt: "How do you respond?",
          options: [
        { label: "Directly coach her to be more assertive and willing to challenge leadership.", response: "This asks her to abandon a norm around respecting hierarchy without giving her a way to contribute that still fits within it." },
        { label: "Recognize that in high power distance cultures, openly challenging a superior can be culturally inappropriate — and create a structure where her expertise is explicitly sought before decisions are made.", response: "This is the accurate reading. Building an explicit structure to invite her expertise respects the cultural norm while still surfacing her insight before decisions are locked in.", recommended: true },
        { label: "Reassign her to a role that requires less upward influence so she can succeed within her natural style.", response: "This removes her from decisions where her expertise matters most, rather than building a way for that expertise to be heard." }
          ],
        },
        transfer: {
          prompt: "Southern Asian societies integrate spiritual life and professional life. How does your workplace culture treat spiritual expression — as private, invisible, or welcome?",
          options: ["High context communication requires you to read the relationship, not just the message. Where have you missed signals that were there but not explicit?", "What does \"leadership\" look like in a high power distance culture, and how does that expand or challenge your organization's leadership model?", "Name one colleague or partner connected to this cluster and one thing you would ask them directly rather than assume"],
        },
        blocks: [
          { type: "text", heading: "Cluster overview", body: "<p>Southern Asia is a mosaic of languages, religions, and traditions — yet clusters around several core cultural patterns. Spiritual life permeates daily work. Hierarchy is accepted and navigated skillfully. Relationships are collectivist, warm, and contextual. Communication is high-context: tone, relationship, and timing carry as much meaning as words. Adaptability is a deep cultural strength — these societies have integrated enormous change while preserving ancient roots.</p><p><strong>Region:</strong> India, Indonesia, Malaysia, Pakistan, Philippines, Sri Lanka, Thailand</p>" },
          { type: "list", heading: "Key cultural dimensions", items: ["Power distance: High — hierarchy respected; directive leadership valued", "Collectivism: Strong — family, community, and spiritual community", "Communication: High context — indirect, tonal, relationship-embedded", "Spirituality: Central — religious values shape work and relationships", "Time: Polychronic and context-driven; flexible with time"] },
          { type: "list", heading: "Reflect", ordered: true, items: ["Southern Asian societies integrate spiritual life and professional life. How does your workplace culture treat spiritual expression — as private, invisible, or welcome?", "High context communication requires you to read the relationship, not just the message. Where have you missed signals that were there but not explicit?", "What does \"leadership\" look like in a high power distance culture, and how does that expand or challenge your organization's leadership model?"] },
          { type: "flashcards", heading: "Suggestive practices", cards: [
            { front: "Create explicit permission structures", back: "<p>In high power distance settings, formally invite dissent and input. People need structural permission to challenge authority respectfully.</p>" },
            { front: "Acknowledge spiritual and cultural observances", back: "<p>Diwali, Eid, Vesak, and other observances matter deeply. Acknowledge them proactively rather than waiting to be educated.</p>" },
            { front: "Navigate hierarchy respectfully", back: "<p>Communicate decisions through appropriate levels. Going around hierarchy — even with good intent — can damage trust and respect.</p>" },
            { front: "Listen for what's unsaid", back: "<p>In high-context cultures, a polite \"yes\" or \"we'll see\" often carries more nuanced meaning. Build relationships where truth can emerge.</p>" }
          ] },
          { type: "knowledgeCheck", id: "cq-southern-asia-1-check", question: "What is a primary reason a Southern Asian professional may not openly challenge a flawed plan from senior leadership?", options: [{ text: "Lack of professional competence", correct: false }, { text: "Disinterest in the project outcome", correct: false }, { text: "High power distance norms make open upward challenge culturally inappropriate", correct: true }, { text: "Fear of losing their job", correct: false }], feedbackCorrect: "High power distance is a structural cultural norm, not a personal character trait. In these contexts, openly challenging superiors can violate relational and professional norms — even when the professional clearly sees the problem.", feedbackIncorrect: "Look again at the cluster’s key dimensions — High power distance is a structural cultural norm, not a personal character trait. In these contexts, openly challenging superiors can violate relational and professional norms — even when the professional clearly sees the problem." },
        ],
      },
      {
        id: "cq-southern-asia-2",
        number: 2,
        title: "Confirming what was actually agreed",
        summary: "A quick agreement is not always a confirmed plan, from anyone. High-context communication, documented across this cluster, is one possibility to keep in mind, never a diagnosis of a specific colleague. The habit that protects the work is the same with everyone: confirm the specifics and put them in writing.",
        minutes: 10,
        learning: {
          objective: "Confirm a specific commitment — the date, the number, the next step — with any colleague or partner, in writing, and check your own assumptions before explaining a missed date by someone's culture.",
          takeaways: [
            "Confirming specifics in writing is ordinary project hygiene you apply with everyone: what will be done, by when, and by whom. It is not a special precaution reserved for colleagues from any particular background.",
            "Research on high-context communication describes one possibility worth keeping in mind: a courteous agreement can keep an exchange warm and respectful without being a detailed commitment. That is a reason to ask a clearer question, not an explanation you can attach to a specific person.",
            "When a plan slips, ordinary reasons — competing priorities, an unclear request, a handoff that never happened, a date heard as a target — are far more common than any cultural explanation, and they apply to everyone. Ask the person what happened.",
            "A specific, closed confirmation (\"so the batch is processed by end of day on the fifteenth, is that right?\") followed by a short written recap gets a clearer answer from anyone than a general \"can you do this?\"",
          ],
          evidence: "A scenario decision about a partner's quick agreement and a missed date, and a knowledge check on checking your own assumptions before attributing behavior to culture.",
          appliedNextStep: "In your next request to anyone — colleague, partner, or supervisor — restate the specific commitment, get a direct confirmation, and send a two-line written recap before you rely on it.",
        },
        scenario: {
          context: "You ask Arjun, a partner agency contact, whether his office can process a batch of referrals by the fifteenth. He says yes, and the conversation moves on to the next topic. You do not restate the date, and you do not send a follow-up note. On the fifteenth, nothing has been processed. When you follow up, Arjun says he understood the fifteenth as a target rather than a firm deadline, and that two urgent requests landed on his desk that week.",
          prompt: "What is the most accurate way to understand what happened?",
          options: [
            { label: "Arjun agreed and then failed to follow through; escalate to his supervisor.", response: "This treats a general yes as a firm, confirmed commitment without checking whether the date was ever pinned down, and it skips the conversation with Arjun himself." },
            { label: "Arjun said yes because people from his background agree to be polite, so you cannot rely on a verbal yes from his office.", response: "This turns a population-level research pattern into a statement about one person's motives. It also does not fit what Arjun actually told you: the date was never confirmed and other work landed. Deciding it was his culture stops you from asking the question that would have helped, and it is not a fair reading of him." },
            { label: "The date was never confirmed in a form either of you could point back to. Check your own assumptions, ask Arjun what a workable timeline looks like now, and make written confirmation your standard practice with everyone.", response: "This is the accurate reading. It starts with what you can verify — no restated date, no written recap — asks the person rather than deciding for him, and fixes the habit rather than the relationship.", recommended: true },
          ],
        },
        transfer: {
          prompt: "Think of a recent agreement that did not turn into the outcome you expected. What did you confirm at the time, what did you assume, and what would a two-line written recap have changed?",
          options: ["Write the exact closed question you would ask, aimed at a specific date, number, or action rather than general agreement", "Note whether you explained the slip by the person or their background before you asked them what happened", "Decide one upcoming request, with anyone, where you will confirm the specifics and send a short written recap"],
        },
        blocks: [
          { type: "text", heading: "Confirm the specifics with everyone", body: "<p>Cross-cultural research describes the Southern Asia cluster as high-context: tone, relationship, and timing carry meaning alongside the literal words. One possibility that research suggests is worth keeping in mind is that a courteous agreement can be a way of keeping an exchange warm and respectful without being a detailed commitment to a date or a number. It is a possibility to check, not a fact about the person in front of you, and it is never the reason any particular person said yes.</p><p>The practical habit is the same no matter who you are talking with. Restate the specific commitment before the conversation ends: not \"can you do this?\" but \"so the batch will be processed by end of day on the fifteenth, is that right?\" Then send a short written recap that names what will be done, by when, and by whom. This is ordinary project hygiene. It protects the work with a colleague down the hall exactly as much as with a partner across the state, and it never singles anyone out.</p><p>When a plan slips anyway, resist the shortcut of explaining it by someone's background, even sympathetically. Competing priorities, an unclear request, a handoff that never happened, and a date heard as a target rather than a deadline are all more common than any cultural explanation, and they apply to everyone. Ask the person what happened. Their answer is the reliable one.</p>" },
          { type: "list", heading: "Signals that a commitment is not yet specific, from anyone", items: ["A yes with no restatement of the date, number, or action", "\"We'll see\" or \"it should be fine\" offered without a specific date", "Agreement that moves quickly past the details of the request", "No agreed way for either of you to flag a problem before the date arrives"] },
          { type: "leaderMove", heading: "Confirm in the conversation, recap in writing", control: "You control whether a request ends with a restated, confirmed commitment and a written recap. That habit belongs in every request you make, not only requests to colleagues from a particular background.", failure: "Do not treat a general yes as a confirmed date, and do not explain a missed date by someone's culture before you have asked them what happened.", next: "In your next request, restate the specific commitment, get a direct confirmation, and send a two-line recap before you rely on it." },
          { type: "tabs", heading: "Same missed date, three readings", tabs: [
            { label: "Character reading", body: "<p>\"He said yes and did not deliver. He should have been straight with me.\" This decides Arjun's character before you have the facts.</p>" },
            { label: "Culture reading", body: "<p>\"He said yes because that is how people from his background keep things polite. I can't rely on a yes from him.\" This sounds more understanding, but it still decides his motive for him and treats a population-level pattern as a fact about one person.</p>" },
            { label: "Checked reading", body: "<p>\"I never restated the date or sent a recap. He told me he heard it as a target and that other work landed. I'll confirm the specifics in writing from now on, with everyone.\"</p>" },
          ] },
          { type: "flashcards", heading: "Checking assumptions", cards: [
            { front: "What does high-context research suggest you keep in mind?", back: "<p>That a courteous agreement can keep an exchange warm without pinning down specifics. That is a reason to ask a clearer question, not a conclusion about any one person.</p>" },
            { front: "What confirms a commitment with anyone?", back: "<p>A specific, closed question restating the date, number, or action, followed by a short written recap naming what, when, and who.</p>" },
            { front: "A plan slipped. What comes first?", back: "<p>Ask the person what happened. Competing priorities, an unclear request, or a date heard as a target are far more common than any cultural explanation, and they apply to everyone.</p>" },
          ] },
          { type: "knowledgeCheck", id: "cq-southern-asia-2-check", question: "A partner contact agreed to a date in conversation, nothing was confirmed in writing, and the date passed without the work being done. What is the most accurate next step?", options: [{ text: "Conclude that agreement means something different in the partner's culture and stop relying on a verbal yes from that office.", correct: false }, { text: "Check your own assumptions: notice that the specifics were never confirmed, ask the partner what happened, and make written confirmation your standard practice with everyone.", correct: true }, { text: "Treat the missed date as a broken commitment and escalate to the partner's supervisor.", correct: false }], feedbackCorrect: "Right. The reliable path is to ask the person and fix the confirmation habit for every request, rather than explaining one person's behavior by a population-level pattern or by their character.", feedbackIncorrect: "Both other answers decide the partner's motive for them. Look for the answer that starts with what you can verify, asks the person directly, and applies the same habit to everyone." },
        ],
      },
      {
        id: "cq-southern-asia-3",
        number: 3,
        title: "Serving a client whose faith shapes daily rhythms",
        summary: "Spiritual practice is central to daily life for many people connected to this cluster. Serving a client well means planning around observances proactively, without assuming any specific client's practice or level of observance.",
        minutes: 10,
        learning: {
          objective: "Serve a client connected to the Southern Asia cluster in a way that proactively makes room for religious or spiritual observance in scheduling and service delivery, while confirming the individual client's own practice rather than assuming it.",
          takeaways: [
            "Religious and spiritual observance is documented as central, not peripheral, to daily life and decision-making across this cluster, and can shape availability, diet, and comfort with certain requests.",
            "Proactively asking about observances when scheduling or planning services respects the pattern without requiring a client to explain or justify their practice.",
            "Individual practice varies enormously within the cluster, by religion, region, and personal observance; a client's own description of their needs always governs over any assumption.",
          ],
          evidence: "A service-delivery scenario about scheduling around a client's religious observance, and a knowledge check on proactive versus assumption-based accommodation.",
          appliedNextStep: "Add one proactive scheduling question about observances or dietary needs to your next intake or service-planning conversation, for any client.",
        },
        scenario: {
          context: "You are scheduling a series of in-home visits for Meera, a new client, during a month that includes a major religious observance period for several faiths represented in your caseload. You do not know which, if any, Meera observes.",
          prompt: "What is the most respectful way to schedule the visits?",
          options: [
            { label: "Schedule the visits at the times that work best for your calendar, and adjust only if Meera raises an objection.", response: "This puts the burden entirely on the client to notice a conflict and speak up, rather than building the question into the process." },
            { label: "Ask Meera directly, early in scheduling, whether any dates or times need to work around a religious or personal observance, without guessing which faith or practice applies to her.", response: "This proactively makes room for observance as a normal part of scheduling, without assuming what Meera practices or how observant she is.", recommended: true },
            { label: "Avoid scheduling anything during the observance period for any client on the caseload, to be safe.", response: "This assumes observance applies to everyone and can create unnecessary delays for clients who do not observe it, while still not asking Meera directly what she needs." },
          ],
        },
        transfer: {
          prompt: "Think of your intake or scheduling process. Where could a proactive, open-ended question about observances or dietary needs replace waiting for a client to raise it?",
          options: ["Name the point in the process where the question would fit naturally", "Draft an open-ended version of the question that does not assume a specific faith or practice", "Decide how you will record the answer so it is not asked repeatedly across appointments"],
        },
        blocks: [
          { type: "text", heading: "Ask early, ask openly, and let the client define it", body: "<p>Across the Southern Asia cluster, spiritual life is documented as woven into daily rhythms rather than separated from work and public life. For many clients, a religious calendar shapes availability, comfortable meeting times, dietary needs during a home visit, or willingness to make certain decisions on certain days. A scheduling process that never asks about this puts the entire burden of noticing and raising a conflict on the client.</p><p>The respectful fix is a proactive, open-ended question, asked as a normal part of intake or scheduling for every client, not just clients who look like they might observe something: \"Is there anything about timing, food, or the day of the visit I should know to plan around?\" This makes room for the pattern without requiring a client to disclose their faith, justify their observance, or educate the caseworker on the spot.</p><p>The variation within this cluster is enormous: multiple major faiths, many levels of observance, and plenty of clients for whom this simply does not apply. The open-ended question respects all of that by letting the client define what matters to them, rather than the caseworker guessing based on a name, appearance, or region of origin.</p>" },
          { type: "list", heading: "Building the proactive question into practice", items: ["Ask an open-ended scheduling question about timing, food, or observance during intake, for every client", "Avoid guessing a client's faith or practice from their name, appearance, or country of origin", "Record the answer once, respectfully, so the client is not asked to repeat it at every appointment", "Revisit the question if a major observance period is approaching and plans have not been discussed"] },
          { type: "tabs", heading: "Two approaches to the same schedule", tabs: [
            { label: "Assumption-based", body: "<p>\"Her name sounds like she might observe this holiday, so I'll avoid that week just in case.\" Nothing was actually confirmed with the client.</p>" },
            { label: "Proactive and open-ended", body: "<p>\"I asked her directly if there was anything about timing or the day of the visit I should plan around, and she told me exactly what mattered to her.\"</p>" },
          ] },
          { type: "quote", text: "Nobody assumed anything about me, and nobody made me explain my faith to get a schedule that worked. They just asked, once, at the start, and wrote it down.", cite: "Composite client perspective, illustrative" },
          { type: "knowledgeCheck", id: "cq-southern-asia-3-check", question: "A caseworker is scheduling visits for a new client connected to the Southern Asia cluster during a period that includes major religious observances for several faiths. What is the most respectful approach?", options: [{ text: "Guess the client's likely faith from her name and schedule around that assumption.", correct: false }, { text: "Ask the client directly and openly whether any timing, food, or day-of-visit needs should shape scheduling.", correct: true }, { text: "Avoid scheduling anything during the observance period for every client on the caseload.", correct: false }], feedbackCorrect: "Right. An open-ended, proactive question lets the client define what matters without the caseworker guessing based on identity.", feedbackIncorrect: "Consider which approach respects the pattern of observance mattering, without assuming a specific faith or applying a blanket rule to every client." },
        ],
      },
      {
        id: "cq-southern-asia-4",
        number: 4,
        title: "Building structured permission for dissent",
        summary: "A team can build an explicit, structural way for input to surface before decisions are locked in, respecting hierarchy norms this cluster's research documents, without asking anyone to abandon the hierarchy they are comfortable working within.",
        minutes: 10,
        learning: {
          objective: "Adapt a team's decision process to include a structural, low-risk way for staff connected to this cluster's hierarchy norms to contribute expertise before decisions are finalized, as a standing practice rather than a personal appeal.",
          takeaways: [
            "High power distance is a documented, structural norm; asking someone shaped by it to \"just speak up\" in an open meeting does not remove the real relational cost of publicly challenging a superior.",
            "A structural fix — a standing step where each team member's input is explicitly requested before a decision is finalized — creates permission without requiring public confrontation.",
            "The change applies to how the whole team makes decisions; it does not ask any team member, from any background, to change how comfortable they personally are with hierarchy.",
          ],
          evidence: "A leadership scenario about redesigning how a team gathers input before a decision, and a knowledge check on structural versus individual fixes.",
          appliedNextStep: "Add a standing step to your next team decision where each person's input is explicitly and individually requested before the decision is finalized.",
        },
        scenario: {
          context: "A program manager finalizes decisions at the end of open team meetings, after asking, \"Does anyone have concerns?\" to the whole group. Priya, a team member who has deep expertise in a related process, rarely speaks up in that moment, though she later mentions concerns privately that would have improved the decision.",
          prompt: "What is the best way to change the decision process?",
          options: [
            { label: "Continue asking the open question in meetings, and encourage Priya specifically to speak up more.", response: "This keeps a format that has already shown it does not surface Priya's input, and places the burden of change on her rather than on the process." },
            { label: "Add a standing step where the manager individually and explicitly asks each team member, including Priya, for input before finalizing any decision, in whatever format is most comfortable for them.", response: "This is a structural change that creates explicit permission for every team member's input, matching the documented pattern without singling anyone out.", recommended: true },
            { label: "Ask Priya to submit her concerns in writing before every meeting, while keeping the open-floor process for everyone else.", response: "This creates a separate track for one person rather than a structural change to how the whole team gathers input." },
          ],
        },
        transfer: {
          prompt: "Look at how your team currently gathers input before a decision. Where could an explicit, individual request replace a general open-floor question?",
          options: ["Name the decision point where the open question currently happens", "Draft how you would individually and explicitly request each person's input", "Decide what format options you would offer, since not everyone will want to speak in the same way"],
        },
        blocks: [
          { type: "text", heading: "An open floor is not a neutral invitation", body: "<p>\"Does anyone have concerns?\" asked to a full room sounds like an equal invitation to everyone, but it is not experienced equally. For a team member shaped by the high power distance norms documented across the Southern Asia cluster, publicly volunteering a concern, especially one that implies a leader's plan has a flaw, carries a real relational cost that a general open floor does not remove, no matter how welcoming the tone.</p><p>The structural fix is to build an explicit, individual step into the decision process: the leader asks each person directly, by name, for their input, before the decision is finalized, and offers more than one way to give it, such as a private conversation or a written note, alongside speaking up in the room. This creates permission that a general invitation cannot, because it removes the need to be the one who breaks the group's silence first.</p><p>This does not ask any team member to become more or less comfortable with hierarchy than they already are. Team members who are happy to speak up in open meetings can keep doing so; the structural step simply ensures that input from someone who needs a different format is not lost.</p>" },
          { type: "list", heading: "What the structural step includes", items: ["The leader individually and explicitly asks each team member for input before finalizing a decision", "More than one format is offered: speaking in the meeting, a private conversation, or a written note", "The step happens every time, for every decision of consequence, not only when it seems needed", "No team member is asked to change their own comfort level with speaking up in open settings"] },
          { type: "leaderMove", heading: "Ask by name, not to the room", control: "You control whether input is requested from the room in general or from each person individually. The individual ask is the structural lever.", failure: "Do not rely on a general open-floor question as your only way of gathering input, and do not create a separate process for only one team member.", next: "Before your next team decision, individually ask each person for input, offering at least one format besides speaking in the meeting." },
          { type: "sorting", id: "cq-southern-asia-4-sort", heading: "Structural fix or individual burden?", categories: ["Structural fix", "Individual burden"], items: [
            { text: "Individually and explicitly asking every team member for input before a decision", category: "Structural fix" },
            { text: "Encouraging one quiet team member to speak up more in open meetings", category: "Individual burden" },
            { text: "Offering a private or written option for input alongside speaking in the room", category: "Structural fix" },
            { text: "Creating a separate written-input process for only one team member", category: "Individual burden" },
          ] },
          { type: "flashcards", heading: "Structural permission for dissent", cards: [
            { front: "Why doesn't a general open-floor question work equally for everyone?", back: "<p>Publicly volunteering a concern carries a real relational cost under high power distance norms, regardless of how welcoming the invitation sounds.</p>" },
            { front: "What makes the fix structural?", back: "<p>It applies to every team member, every time, and offers more than one format for giving input.</p>" },
            { front: "Does this ask anyone to change their comfort with hierarchy?", back: "<p>No. It creates permission without requiring anyone to become more comfortable with public challenge than they already are.</p>" },
          ] },
          { type: "knowledgeCheck", id: "cq-southern-asia-4-check", question: "A team member connected to the Southern Asia cluster rarely raises concerns in open meetings, though she has valuable expertise. What is the best structural fix?", options: [{ text: "Encourage her specifically to speak up more in meetings.", correct: false }, { text: "Add a standing step where the leader individually asks every team member for input, offering more than one format, before finalizing decisions.", correct: true }, { text: "Create a separate written-input process just for her.", correct: false }], feedbackCorrect: "Right. A structural step applied to the whole team creates permission for input without singling anyone out or asking her to change her own style.", feedbackIncorrect: "Look for the option that changes the process for the whole team, offering multiple ways to contribute, rather than targeting one person." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Southern Asia: quick reference",
    subtitle: "A one-page reminder for working with colleagues and partners connected to the Southern Asia cluster",
    quote: "High power distance is a structural cultural norm, not a personal character trait. In these contexts, openly challenging superiors can violate relational and professional norms — even when the professional clearly sees the problem.",
    use: {
      purpose: "Keep the Southern Asia cluster’s key patterns and suggestive practices ready for your next cross-cultural interaction.",
      remember: ["Power distance: High — hierarchy respected; directive leadership valued", "Collectivism: Strong — family, community, and spiritual community", "Communication: High context — indirect, tonal, relationship-embedded", "Spirituality: Central — religious values shape work and relationships", "Time: Polychronic and context-driven; flexible with time"],
      doNext: "Apply one suggestive practice from this module in your next relevant interaction.",
    },
    sections: [
      { heading: "Suggestive practices", items: ["Create explicit permission structures \— In high power distance settings, formally invite dissent and input. People need structural permission to challenge authority respectfully.", "Acknowledge spiritual and cultural observances \— Diwali, Eid, Vesak, and other observances matter deeply. Acknowledge them proactively rather than waiting to be educated.", "Navigate hierarchy respectfully \— Communicate decisions through appropriate levels. Going around hierarchy — even with good intent — can damage trust and respect.", "Listen for what's unsaid \— In high-context cultures, a polite \"yes\" or \"we'll see\" often carries more nuanced meaning. Build relationships where truth can emerge."] },
      { heading: "Before you assume", items: ["Clusters describe broad patterns, not individual people.", "Use this module as a starting point for curiosity, never as a conclusion about a specific person.", "When in doubt, ask the person directly about their own preferences and context."] },
    ],
  },
  sources: [
    { title: "Livermore, D. (2013). Expand Your Borders: Discover Ten Cultural Clusters. Cultural Intelligence Center.", href: "https://culturalq.com", note: "Source framework for the ten cultural clusters, their key dimensions, and this module's scenario and practice content." },
  ],
};

export default pack;
