import type { CoursePack } from "../../source-types";

// Cultural Intelligence curriculum, module 6: Latin America — The Relational Heart Cluster.
// Based on: Livermore, D. (2013). Expand Your Borders: Discover Ten Cultural Clusters. Cultural Intelligence Center.
const pack: CoursePack = {
  course: {
    id: "cq-latin-america",
    indexNumber: 1134,
    seriesLabel: "Cultural Intelligence \u00b7 Expand Your Borders",
    title: "Latin America: The Relational Heart Cluster",
    subtitle: "Latin America weaves together collectivism, warmth, hierarchy, and joy.",
    scope: "For all DHS staff. One of ten modules in the Expand Your Borders cross-cultural intelligence curriculum. Clusters describe broad patterns, not individual people — use them as starting points for curiosity, never as endpoints for judgment about any one person.",
    treatment: "Four lessons with scenarios, reflection questions, suggestive practices, and knowledge checks",
    duration: "45\u201350 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/stock-people-06.jpg",
    coverAlt: "A colleague presenting to two others at a whiteboard during a meeting.",
    introTranscript: "Latin America weaves together collectivism, warmth, hierarchy, and joy. Family (\"familia\") sits at the center of social life. Personal relationships — \"personalismo\" — matter more than systems or contracts. Status signals are important, but warmth transcends status. Time is fluid and life-integrated. The indigenous cultural legacies of Central and South America blend with Latin European influences to create cultures that are simultaneously deeply rooted and vibrantly adaptive.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Describe the core cultural dimensions of the Latin America cluster and how they shape communication and decision-making.",
        "Respond to a realistic cross-cultural scenario in a way that reads the situation accurately rather than through your own cultural default.",
        "Apply at least one suggestive practice from this module in a real cross-cultural interaction.",
      ],
      evidence: [
        "A worked scenario decision with an explanation of why it fits the cluster's cultural patterns.",
        "One knowledge check on this cluster's most distinctive cultural dimension.",
      ],
      appliedNextStep: "Practice one suggestive behavior from this module in your next interaction with a colleague or partner connected to the Latin America cluster.",
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
        id: "cq-latin-america-1",
        number: 1,
        title: "Latin America",
        summary: "The Relational Heart Cluster. Latin America weaves together collectivism, warmth, hierarchy, and joy",
        minutes: 20,
        learning: {
          objective: "Describe the Latin America cluster’s core cultural dimensions and respond accurately to a realistic cross-cultural scenario.",
          takeaways: [
            "Collectivism: High — family and community over individual goals",
            "Power distance: Moderate to high — status respected, warmth expected",
            "Communication: High context — relationship-embedded, expressive",
            "Time orientation: Polychronic — life-integrated, present-focused",
            "Being: Being orientation — relationships alongside productivity"
          ],
          evidence: "A worked scenario decision, a set of reflection questions, and a knowledge check.",
          appliedNextStep: "Choose one suggestive practice from this module and apply it in your next relevant interaction.",
        },
        scenario: {
          context: "A business partner, Eduardo, consistently starts meetings 20 minutes late, rearranges agenda items mid-conversation, and frequently digresses into personal stories. The work is excellent when delivered, but the process differs from your expectations. You are feeling frustrated.",
          prompt: "How do you respond?",
          options: [
        { label: "Set firm boundaries: send a written protocol specifying meeting structure and punctuality expectations.", response: "This imposes one cultural process on the relationship without acknowledging that the excellent output and the relational style may be inseparable." },
        { label: "Reflect on whether your frustration is culturally driven — recognize that Eduardo's relational style and excellent output may be inseparable.", response: "This is a useful first move, but naming your own frustration without also communicating your real constraints leaves both sides guessing." },
        { label: "Adapt your process partially: communicate your timeline needs while genuinely engaging with his relational approach.", response: "This is the balanced response. It respects the relational style that produces good work while being honest about real timeline needs.", recommended: true }
          ],
        },
        transfer: {
          prompt: "\"Personalismo\" means relationships matter more than processes. Where in your work do you prioritize process over people — and what is the cost?",
          options: ["The concept of \"simpatia\" — being warm, pleasant, and agreeable — shapes social interaction in Latin America. How might that norm be misread in a culture that prizes blunt directness?", "Think about what \"being on time\" signals in your culture. Is punctuality a universal virtue or a cultural preference?", "Name one colleague or partner connected to this cluster and one thing you would ask them directly rather than assume"],
        },
        blocks: [
          { type: "text", heading: "Cluster overview", body: "<p>Latin America weaves together collectivism, warmth, hierarchy, and joy. Family (\"familia\") sits at the center of social life. Personal relationships — \"personalismo\" — matter more than systems or contracts. Status signals are important, but warmth transcends status. Time is fluid and life-integrated. The indigenous cultural legacies of Central and South America blend with Latin European influences to create cultures that are simultaneously deeply rooted and vibrantly adaptive.</p><p><strong>Region:</strong> Argentina, Bolivia, Brazil, Chile, Colombia, Costa Rica, Mexico, Venezuela</p>" },
          { type: "list", heading: "Key cultural dimensions", items: ["Collectivism: High — family and community over individual goals", "Power distance: Moderate to high — status respected, warmth expected", "Communication: High context — relationship-embedded, expressive", "Time orientation: Polychronic — life-integrated, present-focused", "Being: Being orientation — relationships alongside productivity"] },
          { type: "list", heading: "Reflect", ordered: true, items: ["\"Personalismo\" means relationships matter more than processes. Where in your work do you prioritize process over people — and what is the cost?", "The concept of \"simpatia\" — being warm, pleasant, and agreeable — shapes social interaction in Latin America. How might that norm be misread in a culture that prizes blunt directness?", "Think about what \"being on time\" signals in your culture. Is punctuality a universal virtue or a cultural preference?"] },
          { type: "flashcards", heading: "Suggestive practices", cards: [
            { front: "Lead with relationship", back: "<p>Open every new interaction with genuine personal interest before business. Ask about family, journey, or community — and mean it.</p>" },
            { front: "Stay present in the conversation", back: "<p>Resist redirecting digression. Relational storytelling is how trust is built and ideas are explored in Latin American contexts.</p>" },
            { front: "Express warmth visibly", back: "<p>A handshake, a greeting in Spanish or Portuguese, an offer of food — these small acts signal belonging and respect.</p>" },
            { front: "Build in flex time", back: "<p>When working with Latin American partners, build relationship buffer into your timelines. Rushed interactions produce shallow results.</p>" }
          ] },
          { type: "knowledgeCheck", id: "cq-latin-america-1-check", question: "The concept of \"personalismo\" in Latin American cultures refers to what?", options: [{ text: "A preference for individual achievement over group goals", correct: false }, { text: "The primacy of personal relationships over systems, contracts, or protocols", correct: true }, { text: "A resistance to authority figures", correct: false }, { text: "A strong sense of national identity", correct: false }], feedbackCorrect: "\"Personalismo\" is the cultural value that personal relationships are the foundation of trust and collaboration. In Latin American contexts, who you are in relationship with matters more than what a contract says.", feedbackIncorrect: "Look again at the cluster’s key dimensions — \"Personalismo\" is the cultural value that personal relationships are the foundation of trust and collaboration. In Latin American contexts, who you are in relationship with matters more than what a contract says." },
        ],
      },
      {
        id: "cq-latin-america-2",
        number: 2,
        title: "Confirming capacity with everyone",
        summary: "\"Simpatía\" — warm, pleasant, agreeable conduct — is a population-level pattern worth keeping in mind, not a prediction about any one colleague. The habit that protects the work is the same with everyone: ask about capacity, confirm the specifics, and put them in writing.",
        minutes: 10,
        learning: {
          objective: "Ask about capacity and confirm a commitment in writing with any colleague or partner, and check your own assumptions before explaining a missed deadline by someone's culture.",
          takeaways: [
            "Asking a capacity question (\"what else is on your plate, and does Friday still work?\") and sending a short written recap is ordinary project hygiene you apply with everyone, not a precaution for colleagues from a particular background.",
            "Cross-cultural research describes \"simpatía,\" a broad preference for pleasant, harmonious exchange, across the Latin America cluster. It is one possibility to keep in mind: a warm yes can express goodwill without settling capacity. It is not a diagnosis of why a specific person said yes.",
            "When a deadline is missed, ordinary reasons — competing requests, an unclear ask, a date heard as a target — are far more common than any cultural explanation, and they apply to everyone. Ask the person what happened; their answer is the reliable one.",
            "Explaining a colleague's behavior by their culture, even kindly, treats a population-level tendency as a fact about them. It damages trust as surely as calling a missed deadline dishonesty.",
          ],
          evidence: "A scenario decision about a partner's warm agreement and a missed deadline, and a knowledge check on checking your own assumptions before attributing behavior to culture.",
          appliedNextStep: "In your next request to anyone, follow the yes with one capacity question, confirm the date, and send a short written recap before you treat it as a commitment.",
        },
        scenario: {
          context: "You ask Camila, a program partner, whether her team can turn around a data request by Friday. She smiles warmly and says, \"Of course, no problem at all!\" You do not ask what else her team is carrying, and you do not send a follow-up note. Friday passes with no data. When you follow up, she is apologetic and explains that her team was already behind on two other requests when you asked.",
          prompt: "What is the most accurate way to understand what happened?",
          options: [
            { label: "Camila was not honest with you; she should have said no if she could not deliver.", response: "This reads a missed deadline as a character failing before you have the facts. It also skips the more useful question: what would have surfaced her team's real capacity before Friday?" },
            { label: "Camila said yes because people from her background agree to keep things pleasant, so a warm yes from her cannot be relied on.", response: "This turns a population-level research pattern into a statement about one person's motives. Camila told you the actual reason: her team was already behind. Deciding it was her culture stops you from asking the question that would have helped, and it is not a fair reading of her." },
            { label: "You asked about willingness, never about capacity, and nothing was confirmed in writing. Check your own assumptions, ask Camila what a workable timeline looks like now, and make capacity questions and written recaps your standard practice with everyone.", response: "This is the accurate reading. It starts with what you can verify — no capacity question, no recap — takes Camila's own explanation seriously, and fixes the habit rather than the relationship.", recommended: true },
          ],
        },
        transfer: {
          prompt: "Think of a recent \"yes\" from anyone that did not turn into action. What did you ask at the time, what did you assume, and what would a capacity question and a two-line recap have changed?",
          options: ["Write the exact capacity question you would ask next time, aimed at competing work and timeline rather than willingness", "Notice whether you explained the slip by the person's background before you asked them what happened", "Decide one upcoming request, with anyone, where you will confirm the specifics and send a short written recap"],
        },
        blocks: [
          { type: "text", heading: "Warmth is not the same as a plan", body: "<p>\"Simpatía\" describes a broad preference, documented across the Latin America cluster, for pleasant, harmonious social exchange and for avoiding a blunt no. Research suggests one possibility worth keeping in mind: a warm \"yes\" can express goodwill about the relationship without settling the question of capacity. That is a reason to ask a better question. It is not a fact about the specific colleague in front of you, and it is never the reason any particular person said yes.</p><p>The habit that protects the work is the same no matter who you are talking with. A willingness question (\"can you do this?\") invites a yes from almost anyone. A capacity question (\"what else is your team carrying this week, and does Friday still work?\") invites real information. Confirm the date, then send a short written recap that names what will be delivered, by when, and by whom. This is ordinary project hygiene, and it never singles anyone out.</p><p>When a deadline is missed anyway, resist explaining it by someone's background, even sympathetically. Competing requests, an unclear ask, a date heard as a target, and a handoff that never happened are all more common than any cultural explanation, and they apply to everyone. Ask the person what happened. In this scenario, Camila told you: her team was already behind. That is the answer to work with.</p>" },
          { type: "list", heading: "Good confirmation habits, for any request", items: ["Ask a capacity question, not only a willingness question: what else is on their plate, and does the date still hold?", "Restate the specific deliverable and date, and get a direct confirmation", "Send a short written recap naming what, when, and who", "Agree on how either of you will flag a problem before the date arrives", "When something slips, ask the person what happened before you decide why"] },
          { type: "leaderMove", heading: "Ask the capacity question, then recap in writing", control: "You control what you ask and whether the request ends with a written recap. A capacity question and a two-line recap belong in every request you make, not only requests to colleagues from a particular background.", failure: "Do not treat a pleasant tone as confirmation of a plan, and do not explain a missed deadline by someone's culture — or their character — before you have asked them what happened.", next: "Before your next deadline request to anyone, ask one specific capacity question, confirm the date, and send a short written recap." },
          { type: "tabs", heading: "Same exchange, three readings", tabs: [
            { label: "Character reading", body: "<p>\"She said yes and then missed the deadline. She over-promised and should have been straight with me.\" This decides Camila's character before you have the facts.</p>" },
            { label: "Culture reading", body: "<p>\"She said yes because that is how people from her background keep things pleasant. I can't rely on a yes from her.\" This sounds more understanding, but it still decides her motive for her and treats a population-level pattern as a fact about one person.</p>" },
            { label: "Checked reading", body: "<p>\"I asked whether she was willing, never what her team was carrying, and I sent nothing in writing. She told me her team was already behind. I'll ask about capacity and send a recap next time, with everyone.\"</p>" },
          ] },
          { type: "flashcards", heading: "Checking assumptions", cards: [
            { front: "What does \"simpatía\" describe?", back: "<p>A documented cluster-level preference for pleasant, harmonious exchange and avoiding a blunt no. A broad pattern to keep in mind, never a statement about why a specific person said yes.</p>" },
            { front: "What do you ask instead of \"can you do this?\"", back: "<p>A capacity question — what else is on their plate, and does the date still hold — followed by a confirmed date and a short written recap. With everyone.</p>" },
            { front: "A deadline was missed. What comes first?", back: "<p>Ask the person what happened. Ordinary reasons such as competing requests or an unclear ask are far more common than any cultural explanation, and they apply to anyone.</p>" },
          ] },
          { type: "knowledgeCheck", id: "cq-latin-america-2-check", question: "A partner answered a deadline request with warm, immediate agreement, nothing was confirmed in writing, and the deadline was missed. What is the most accurate next step?", options: [{ text: "Conclude the partner was dishonest and stop relying on their word.", correct: false }, { text: "Conclude that a warm yes means something different in the partner's culture and treat their agreements as unreliable.", correct: false }, { text: "Check your own assumptions: notice you asked about willingness rather than capacity, ask the partner what happened, and make capacity questions and written recaps your standard practice with everyone.", correct: true }], feedbackCorrect: "Right. The reliable path is to ask the person and fix the confirmation habit for every request, rather than explaining one person's behavior by their character or by a population-level pattern.", feedbackIncorrect: "Both other answers decide the partner's motive for them. Look for the answer that starts with what you can verify, asks the person directly, and applies the same habit to everyone." },
        ],
      },
      {
        id: "cq-latin-america-3",
        number: 3,
        title: "Serving a client whose family shows up too",
        summary: "When \"familia\" is central, a client's decision may genuinely involve people beyond the client. Serving that well means welcoming it without assuming every client from this cluster wants the same thing.",
        minutes: 10,
        learning: {
          objective: "Respond to a client from the Latin America cluster who involves extended family in a DHS decision in a way that respects the pattern while still confirming the individual client's own preference and consent.",
          takeaways: [
            "Family-centered decision-making is a well-documented pattern in this cluster; a client bringing several relatives to an appointment is not automatically confusion, dependency, or a boundary problem to correct.",
            "Respecting the pattern does not mean assuming it for a specific client — some clients connected to this cluster want to decide alone, and the client's own stated preference always governs, including who is in the room and what is shared.",
            "The practical skill is making room for family involvement procedurally, while still confirming consent and decision-making authority directly with the client, not through relatives.",
          ],
          evidence: "A service-delivery scenario about a client's family attending an eligibility appointment, and a knowledge check on confirming individual consent within a family-centered pattern.",
          appliedNextStep: "In your next appointment with a client who brings family, name the room out loud and ask the client directly, in front of everyone, who they want to be part of the conversation and the decision.",
        },
        scenario: {
          context: "Rosa arrives for a home-care eligibility appointment with her adult daughter, her sister, and her elderly mother. All four expect to participate in the conversation. The appointment slot is thirty minutes and the room seats three comfortably.",
          prompt: "What is the most respectful and accurate way to handle this appointment?",
          options: [
            { label: "Ask the family members to wait outside so you can speak with Rosa alone, since she is the applicant.", response: "This assumes an individual-only decision model without checking what Rosa herself wants, and treats a family that came to support her as an inconvenience." },
            { label: "Welcome everyone, then ask Rosa directly, in front of the group, who she wants involved in the conversation and the decision, and arrange the room and time to make that possible.", response: "This respects the likely pattern of family involvement while still confirming Rosa's own authority over her own decision and information, rather than assuming it on her behalf.", recommended: true },
            { label: "Proceed with the appointment as planned and let whoever speaks up first answer the questions.", response: "This lets the loudest voice in the room stand in for the client's own decision, which risks overriding Rosa's actual preference either way." },
          ],
        },
        transfer: {
          prompt: "Think of a client interaction where family or community members were present. Did you confirm the client's own preference about their role, or assume it either way?",
          options: ["Name one appointment type where you could build in the direct question, \"who do you want part of this conversation?\"", "Note how you would adjust scheduling or room setup to make family involvement workable when a client wants it", "Write the exact wording you would use to confirm consent directly with the client, not through a relative"],
        },
        blocks: [
          { type: "text", heading: "Family involvement is a pattern, not a problem to manage", body: "<p>Across the Latin America cluster, family is commonly the primary unit of social life, and major decisions, including decisions about health, housing, and care, are often made with family present and involved. For a DHS process built around a single applicant signing a single form, a client who brings three relatives to an eligibility appointment can look like a scheduling problem or a boundary issue. It is neither. It is a documented pattern about how decisions are made well.</p><p>Serving this pattern respectfully means adjusting the process, not the client: building in enough time, arranging seating, and treating the extra people as participants rather than obstacles. It does not mean assuming every client wants this. Some clients connected to this cluster prefer to decide alone, for reasons ranging from privacy to a specific family dynamic. The only way to know is to ask the client directly, with the same respect either answer deserves.</p><p>The caveat matters here as much as the pattern: this is what cross-cultural research documents about the cluster as a whole. It tells you what to expect and prepare for. It does not tell you what Rosa, specifically, wants.</p>" },
          { type: "list", heading: "Making room for the pattern, practically", items: ["Schedule extra time when you know or expect several family members will attend", "Set up seating so everyone present can hear and see, rather than crowding one chair at the desk", "Ask the client directly, in front of the group, who they want involved and what they want shared", "Confirm consent and decisions with the client by name, even when a relative answers first"] },
          { type: "accordion", heading: "Two things that can go wrong in either direction", items: [
            { title: "Excluding family by default", body: "<p>Sending relatives out of the room without asking treats a support system as a disruption, and can make the client feel isolated at a moment they wanted company.</p>" },
            { title: "Letting family speak for the client by default", body: "<p>Directing questions to whoever is most vocal, instead of the client, can override the client's own voice and consent — the opposite failure, and just as disrespectful.</p>" },
          ] },
          { type: "quote", text: "My mother came with three of us to that appointment. Nobody asked me what I wanted. They just started talking to my daughter because she spoke the fastest English. I was still the one whose name was on the form.", cite: "Composite client perspective, illustrative" },
          { type: "knowledgeCheck", id: "cq-latin-america-3-check", question: "A client connected to the Latin America cluster brings several family members to an appointment. What is the most respectful next step?", options: [{ text: "Ask the family to leave so the appointment can proceed with the applicant alone.", correct: false }, { text: "Welcome the group and ask the client directly who they want involved in the conversation and decision.", correct: true }, { text: "Assume the family is there to make the decision and direct all questions to them.", correct: false }], feedbackCorrect: "Right. Family involvement is a documented pattern to make room for, and the client's own stated preference is what actually governs the appointment.", feedbackIncorrect: "Consider both failure modes: excluding family by default, and letting family speak for the client by default. The client's own direct answer resolves both." },
        ],
      },
      {
        id: "cq-latin-america-4",
        number: 4,
        title: "Building relationship time into a fast-paced team",
        summary: "A team can build in the warmth and relational pacing this cluster's research describes, as one legitimate way of working, without asking every colleague to adopt it personally or asking members of this cluster to drop it.",
        minutes: 10,
        learning: {
          objective: "Adapt a team's meeting practice to include relational time for colleagues connected to this cluster, as a structural change the team owns, rather than an individual accommodation or a demand to assimilate.",
          takeaways: [
            "A meeting agenda that allots zero minutes to personal connection is itself a cultural default, not a neutral baseline; building in relational time is a design choice available to any team lead.",
            "The fix is structural — a standing two minutes at the top of the agenda — not a request that one colleague personally adjust how much small talk they need to feel ready to work.",
            "This is also not a request that colleagues who prefer to get straight to business change how they operate; both paces can coexist inside the same short structural window.",
          ],
          evidence: "A leadership scenario about redesigning a recurring meeting's opening minutes, and a knowledge check on structural versus individual fixes.",
          appliedNextStep: "Add a standing two-minute opening to your next recurring meeting, and note after four weeks whether participation and decision quality changed.",
        },
        scenario: {
          context: "A supervisor leads a fifteen-minute standup that starts on the second with the first agenda item. Two team members connected to the Latin America cluster have mentioned, separately, that the meeting feels abrupt. Other team members like the efficiency and do not want the meeting to run longer.",
          prompt: "What is the best way to adjust the meeting?",
          options: [
            { label: "Ask the two team members to adapt to the team's existing fast-paced style, since it works for most of the group.", response: "This treats the current format as neutral rather than as one cultural default among several, and puts the entire adjustment on two people." },
            { label: "Add a standing two-minute opening for informal check-in before the agenda starts, keeping the total meeting length the same by trimming elsewhere.", response: "This is a structural fix available to the whole team, keeps the meeting's total length intact for people who value efficiency, and does not single anyone out.", recommended: true },
            { label: "Schedule a separate, optional social meeting once a month for people who want more relational time.", response: "This segregates relational connection into an optional extra rather than building it into the way the team actually works and decides things together." },
          ],
        },
        transfer: {
          prompt: "Look at one recurring meeting you run or attend. Where could two minutes of relational time fit without adding meeting length?",
          options: ["Name the meeting and the exact spot in the agenda where the two minutes would go", "Identify what you would trim to keep the total time the same", "Decide how you will check, after a month, whether it changed how people show up"],
        },
        blocks: [
          { type: "text", heading: "The current format is a choice, not a neutral default", body: "<p>A meeting that opens directly with the first agenda item feels efficient to people whose cultural default already matches that pace. It is still a choice about how to run a meeting, not a neutral baseline that other styles deviate from. Research on the Latin America cluster documents a broad preference for relationship before task; arriving cold into business can read as impersonal, even hostile, to someone shaped by that norm, independent of the actual content of the meeting.</p><p>The goal is not to slow every meeting down, and it is not to ask colleagues who prefer efficiency to perform small talk they do not want. It is to build a small, predictable structural space, the same for everyone, every time, so that relational connection has a place without displacing the work.</p><p>This is a team-level design decision the leader owns. It does not require identifying which individuals \"need\" it, and it should not be framed as an accommodation granted to specific people — that framing alone can create the discomfort it is meant to solve.</p>" },
          { type: "list", heading: "What a structural fix looks like", items: ["A standing two minutes at the top of the agenda, the same in every meeting, for anyone to use or pass on", "A rotating opening question light enough to answer in one sentence", "Trimming a status item that could be handled asynchronously, to protect the total meeting length", "Applying the same structure whether or not a member of any particular cluster is present that day"] },
          { type: "leaderMove", heading: "Change the structure, not the person", control: "You control the agenda's shape and where time is spent. That is the lever, not asking any one person to want less warmth or more speed than they actually want.", failure: "Do not frame a structural change as a favor to specific colleagues, and do not ask anyone to permanently mute a working style that serves them well.", next: "Redesign your next agenda with a standing opening, run it for a month, and ask the team directly whether it is working." },
          { type: "sorting", id: "cq-latin-america-4-sort", heading: "Structural fix or individual burden?", categories: ["Structural fix", "Individual burden"], items: [
            { text: "A standing two-minute check-in built into every meeting's agenda", category: "Structural fix" },
            { text: "Asking one colleague to text a compressed personal update instead of sharing it live", category: "Individual burden" },
            { text: "Trimming a status item to protect the total meeting length", category: "Structural fix" },
            { text: "Telling a colleague they need to adjust their pace to match the team", category: "Individual burden" },
          ] },
          { type: "flashcards", heading: "Adapting without asking for assimilation", cards: [
            { front: "What makes a fix structural rather than individual?", back: "<p>It applies to everyone in the meeting, every time, regardless of who is in the room that day.</p>" },
            { front: "What should you avoid framing this as?", back: "<p>An accommodation granted to specific people — that framing can create the exact discomfort the change is meant to solve.</p>" },
            { front: "Does this ask efficiency-minded colleagues to change?", back: "<p>No. The structure protects total meeting length so both working styles are served inside the same short window.</p>" },
          ] },
          { type: "knowledgeCheck", id: "cq-latin-america-4-check", question: "A team wants to make its meetings work better for colleagues who value relational connection, without lengthening meetings or singling anyone out. What is the best approach?", options: [{ text: "Ask the specific colleagues to adjust their expectations to the team's existing pace.", correct: false }, { text: "Add a standing, brief relational opening to the agenda for everyone, and trim elsewhere to keep total length the same.", correct: true }, { text: "Create a separate optional social meeting for people who want more connection time.", correct: false }], feedbackCorrect: "Right. A structural change applied to everyone respects the pattern without asking any individual to assimilate or segregating connection into an extra.", feedbackIncorrect: "Look for the fix that changes the meeting's structure for everyone, rather than asking specific people to adapt or moving connection outside the working meeting." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Latin America: quick reference",
    subtitle: "A one-page reminder for working with colleagues and partners connected to the Latin America cluster",
    quote: "\"Personalismo\" is the cultural value that personal relationships are the foundation of trust and collaboration. In Latin American contexts, who you are in relationship with matters more than what a contract says.",
    use: {
      purpose: "Keep the Latin America cluster’s key patterns and suggestive practices ready for your next cross-cultural interaction.",
      remember: ["Collectivism: High — family and community over individual goals", "Power distance: Moderate to high — status respected, warmth expected", "Communication: High context — relationship-embedded, expressive", "Time orientation: Polychronic — life-integrated, present-focused", "Being: Being orientation — relationships alongside productivity"],
      doNext: "Apply one suggestive practice from this module in your next relevant interaction.",
    },
    sections: [
      { heading: "Suggestive practices", items: ["Lead with relationship \— Open every new interaction with genuine personal interest before business. Ask about family, journey, or community — and mean it.", "Stay present in the conversation \— Resist redirecting digression. Relational storytelling is how trust is built and ideas are explored in Latin American contexts.", "Express warmth visibly \— A handshake, a greeting in Spanish or Portuguese, an offer of food — these small acts signal belonging and respect.", "Build in flex time \— When working with Latin American partners, build relationship buffer into your timelines. Rushed interactions produce shallow results."] },
      { heading: "Before you assume", items: ["Clusters describe broad patterns, not individual people.", "Use this module as a starting point for curiosity, never as a conclusion about a specific person.", "When in doubt, ask the person directly about their own preferences and context."] },
    ],
  },
  sources: [
    { title: "Livermore, D. (2013). Expand Your Borders: Discover Ten Cultural Clusters. Cultural Intelligence Center.", href: "https://culturalq.com", note: "Source framework for the ten cultural clusters, their key dimensions, and this module's scenario and practice content." },
  ],
};

export default pack;
