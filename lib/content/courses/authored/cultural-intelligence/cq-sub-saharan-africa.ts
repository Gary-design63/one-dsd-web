import type { CoursePack } from "../../source-types";

// Cultural Intelligence curriculum, module 9: Sub-Saharan Africa — The Ubuntu Cluster.
// Based on: Livermore, D. (2013). Expand Your Borders: Discover Ten Cultural Clusters. Cultural Intelligence Center.
const pack: CoursePack = {
  course: {
    id: "cq-sub-saharan-africa",
    indexNumber: 1137,
    seriesLabel: "Cultural Intelligence \u00b7 Expand Your Borders",
    title: "Sub-Saharan Africa: The Ubuntu Cluster",
    subtitle: "Ubuntu — \"I am because we are\" — is a Southern African idea this module uses to illustrate a broad pattern: communal interdependence as a worldview, not a policy. It is an illustration, not a description of everyone across a region of dozens of countries and hundreds of cultures.",
    scope: "For all DHS staff. One of ten modules in the Expand Your Borders cross-cultural intelligence curriculum. Clusters describe broad patterns, not individual people — use them as starting points for curiosity, never as endpoints for judgment about any one person.",
    treatment: "Four lessons with scenarios, reflection questions, suggestive practices, and knowledge checks",
    duration: "45\u201350 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/stock-people-09.jpg",
    coverAlt: "A large group of colleagues seated around a conference table for a meeting.",
    introTranscript: "Ubuntu — \"I am because we are\" — is a Southern African idea that this module uses to illustrate the pattern cross-cultural research describes for this cluster: communal interdependence as a worldview, not a policy. In that pattern, decisions are made through community consensus, elders hold honored authority, time is relational rather than clock-driven, and oral tradition, storytelling, and shared presence carry wisdom and joy. Hold the illustration loosely. Sub-Saharan Africa spans dozens of countries and hundreds of distinct cultures, speaking well over a thousand languages, and no single concept describes all of them. In Minnesota, the colleagues, clients, and partners connected to this cluster include Somali, Ethiopian, Eritrean, Liberian, Kenyan, Nigerian, and many other communities. Their histories, languages, and paths to Minnesota differ greatly, and so do the people within each community. Use the pattern to ask better questions, never to decide what any one person believes.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Describe the core cultural dimensions of the Sub-Saharan Africa cluster and how they shape communication and decision-making.",
        "Respond to a realistic cross-cultural scenario in a way that reads the situation accurately rather than through your own cultural default.",
        "Apply at least one suggestive practice from this module in a real cross-cultural interaction.",
      ],
      evidence: [
        "A worked scenario decision with an explanation of why it fits the cluster's cultural patterns.",
        "One knowledge check on this cluster's most distinctive cultural dimension.",
      ],
      appliedNextStep: "Practice one suggestive behavior from this module in your next interaction with a colleague or partner connected to the Sub-Saharan Africa cluster.",
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
        id: "cq-sub-saharan-africa-1",
        number: 1,
        title: "Sub-Saharan Africa",
        summary: "The Ubuntu Cluster. Ubuntu — \"I am because we are\" — is a Southern African idea used here to illustrate a broad pattern of communal interdependence. The region spans dozens of countries and hundreds of cultures, so the pattern is a starting point for questions, not a description of any one person.",
        minutes: 20,
        learning: {
          objective: "Describe the Sub-Saharan Africa cluster’s core cultural dimensions and respond accurately to a realistic cross-cultural scenario.",
          takeaways: [
            "Collectivism: Very high — Ubuntu: communal interdependence as identity",
            "Power distance: High — elder authority and community leadership respected",
            "Communication: High context — oral tradition, story, communal meaning",
            "Time orientation: Polychronic — relational and present-centered",
            "Being: Being orientation — presence and community over output"
          ],
          evidence: "A worked scenario decision, a set of reflection questions, and a knowledge check.",
          appliedNextStep: "Choose one suggestive practice from this module and apply it in your next relevant interaction.",
        },
        scenario: {
          context: "You're implementing a new program in a community-based organization in Kenya. You present the initiative to the director, who is enthusiastic. But staff adoption is slow and resistance is emerging. You didn't know the director had not yet consulted community elders and peer groups before the announcement.",
          prompt: "How do you respond?",
          options: [
        { label: "Push harder on implementation — leadership has approved it, so staff should comply.", response: "This ignores that legitimacy in this context comes from community consensus, not top-down approval alone — pushing harder is likely to deepen resistance." },
        { label: "Pause implementation and co-design a community consultation process that brings elders, peer groups, and staff into the conversation before moving forward.", response: "This is the accurate reading. Legitimacy here comes from genuine community consultation — pausing to build that in is what actually earns adoption.", recommended: true },
        { label: "Create individual incentives to drive individual adoption.", response: "Individual incentives work against a communal decision-making culture and are unlikely to substitute for the consultation that was skipped." }
          ],
        },
        transfer: {
          prompt: "\"I am because we are.\" How would this worldview change the way your organization makes decisions, celebrates wins, or assigns credit?",
          options: ["Think of a change initiative that failed. Was there a consultation gap — people affected who were never genuinely asked?", "Western development and organizational models often prioritize individual metrics. How might Ubuntu reframe your organization's definition of success?", "Name one colleague or partner connected to this cluster and one thing you would ask them directly rather than assume"],
        },
        blocks: [
          { type: "text", heading: "Cluster overview", body: "<p>Ubuntu — \"I am because we are\" — is a Southern African idea. The word comes from the Nguni languages, including Zulu and Xhosa, and related ideas appear in other Bantu-language communities. This module uses it to illustrate the pattern cross-cultural research describes for this cluster: communal interdependence as a worldview, not a policy. In that pattern, decisions are made through community consensus. Elders hold honored authority. Time is relational — gatherings begin when people are ready, not when the clock says so. Oral tradition, storytelling, and shared presence carry wisdom and joy.</p><p><strong>Countries the source framework groups in this cluster:</strong> Ghana, Kenya, Namibia, Nigeria, South Africa, Zambia, Zimbabwe. That list is a sample, not the region.</p><p>Hold the illustration loosely. Sub-Saharan Africa spans dozens of countries and hundreds of distinct cultures, speaking well over a thousand languages. No single concept describes all of them, and Ubuntu is not a fact about everyone from the region. It is a lens for asking better questions.</p>" },
          { type: "list", heading: "One cluster, many peoples", items: ["In Minnesota, the colleagues, clients, and partners connected to this cluster include Somali, Ethiopian, Eritrean, Liberian, Kenyan, Nigerian, and many other communities. Their histories, languages, and paths to Minnesota differ greatly, and people within each community differ from one another.", "A colleague raised in Minneapolis by Somali parents, a Liberian nurse who arrived as an adult, and a Nigerian engineer here on a work assignment may share almost none of the patterns in this module, or may recognize all of them. You cannot tell from where someone is from.", "Use this module to notice what you might be missing and to ask a real question. Do not use it to decide what a specific person values, how they make decisions, or what time means to them."] },
          { type: "list", heading: "Key cultural dimensions", items: ["Collectivism: Very high — Ubuntu: communal interdependence as identity", "Power distance: High — elder authority and community leadership respected", "Communication: High context — oral tradition, story, communal meaning", "Time orientation: Polychronic — relational and present-centered", "Being: Being orientation — presence and community over output"] },
          { type: "list", heading: "Reflect", ordered: true, items: ["\"I am because we are.\" How would this worldview change the way your organization makes decisions, celebrates wins, or assigns credit?", "Think of a change initiative that failed. Was there a consultation gap — people affected who were never genuinely asked?", "Western development and organizational models often prioritize individual metrics. How might Ubuntu reframe your organization's definition of success?"] },
          { type: "flashcards", heading: "Suggestive practices", cards: [
            { front: "Design for community consultation", back: "<p>Before implementing anything, ask: who are the trusted community voices? Build consultation into your design process, not as an afterthought.</p>" },
            { front: "Recognize communal achievement", back: "<p>Ask before singling out an individual for public praise. Many colleagues shaped by a communal pattern want credit to go to the team; others want their own name on the work. Offer both.</p>" },
            { front: "Honor elder wisdom", back: "<p>In many communities connected to this cluster, elders hold relational and moral authority. Ask who the trusted voices are in the specific community you are working with, then acknowledge and include them meaningfully.</p>" },
            { front: "Embrace oral and narrative modes", back: "<p>Storytelling is a primary communication form. Use narrative, not just bullet points, to share information in culturally resonant ways.</p>" }
          ] },
          { type: "knowledgeCheck", id: "cq-sub-saharan-africa-1-check", question: "The concept of Ubuntu most closely reflects which cultural orientation?", options: [{ text: "Competitive individualism — each person achieves for the group", correct: false }, { text: "High uncertainty avoidance — rules protect community stability", correct: false }, { text: "Radical communal interdependence — identity and humanity are relationally constituted", correct: true }, { text: "High power distance — authority determines communal direction", correct: false }], feedbackCorrect: "Ubuntu — \"I am because we are\" — is a profound expression of collectivism that goes beyond shared goals. It is a claim that human identity itself is constituted through community relationships. It is a Southern African idea used here as an illustration, not a description of everyone across the region.", feedbackIncorrect: "Look again at the cluster’s key dimensions — Ubuntu — \"I am because we are\" — is a profound expression of collectivism that goes beyond shared goals. It is a claim that human identity itself is constituted through community relationships." },
        ],
      },
      {
        id: "cq-sub-saharan-africa-2",
        number: 2,
        title: "Time expectations without assumptions",
        summary: "A relational sense of time is a documented pattern across this cluster, and knowing it can keep you from reading a late start as disrespect. It cannot tell you why any one person is late. The useful move is to agree on expectations explicitly.",
        minutes: 10,
        learning: {
          objective: "Agree time expectations explicitly with a colleague or partner, using the cluster's documented time orientation to avoid misreading a late start as disrespect, without assuming that it explains any individual.",
          takeaways: [
            "A polychronic, relational approach to time is documented across this cluster: people and the moment take priority over the clock. Knowing this can stop you from reading a late start as a personal slight.",
            "The pattern does not explain any individual. A colleague may start late because of a relational sense of time, a caregiving obligation, a bus route, or a calendar mix-up, and the only way to know is to ask. Treating culture as the explanation is a stereotype, even when it is meant kindly.",
            "Agreeing expectations explicitly works with everyone: name the real constraint, ask what start time works, and confirm the agreement together, rather than assuming either punctuality or lateness from where someone is from.",
          ],
          evidence: "A scenario decision about a partner's late start to a planning call, and a knowledge check on agreeing time expectations without assuming any individual's relationship to time.",
          appliedNextStep: "Before your next joint deadline with a colleague or partner, agree on the start time and the reason it matters together, out loud, rather than assuming what time means to them.",
        },
        scenario: {
          context: "You schedule a planning call with Kwame, a community partner, for 10 a.m. He joins at 10:20, warm and unhurried, and picks up the conversation as though no time has passed. This is not the first time. You have a hard external deadline two days later.",
          prompt: "What is the most accurate and useful way to handle this?",
          options: [
            { label: "Tell Kwame directly that his lateness is disrespectful and that he needs to be on time from now on.", response: "This assumes you already know what the late start means to Kwame. It turns a scheduling problem into a judgment about his character before you have asked him anything." },
            { label: "Without assuming why Kwame starts late, tell him about the hard external deadline, ask what start time genuinely works for him, and agree on it together, including what each of you will do if one of you runs behind.", response: "This solves the real problem, the shared deadline, and treats Kwame as an individual. You learn what time means to him by agreeing on it with him, not by guessing from his background.", recommended: true },
            { label: "Decide that late starts are simply how time works in Kwame's culture, and quietly pad every meeting by twenty minutes without mentioning it.", response: "This is the assumption in a kinder form. It labels Kwame with a pattern he may not hold, hides the real deadline from him, and leaves the two of you with no agreed expectation." },
          ],
        },
        transfer: {
          prompt: "Think of a time you explained a colleague's lateness, or their punctuality, by where they were from. What would it have taken to agree on the expectation with them directly instead?",
          options: ["Write down the real constraint that mattered, separate from the clock time itself", "Note whether you assumed the reason for the timing, in either direction, rather than asking", "Draft the sentence you would use next time to agree on a start time, and why it matters, together"],
        },
        blocks: [
          { type: "text", heading: "A pattern can inform you; it cannot explain a person", body: "<p>Across the Sub-Saharan Africa cluster, cross-cultural research describes time as relational and present-centered: gatherings begin when the people are ready, and the conversation in front of you matters more than the clock. For someone whose default is clock-driven, knowing this pattern exists is useful for one reason. It can stop you from reading a late start as a statement about how much you, or the meeting, matter.</p><p>That is where the pattern's usefulness ends. It cannot tell you why Kwame, or anyone else, joined at 10:20. He may hold a relational sense of time. He may also have been on another call, waiting for a bus, handling a family matter, or simply have had the wrong time in his calendar. Plenty of people connected to this cluster keep exact time by habit, training, or preference. Deciding that his culture explains his timing, and adjusting around him without saying so, is a stereotype even when it is meant generously. It also leaves him without the one thing that would actually help: a clear, shared expectation.</p><p>The reliable move works with everyone. Separate the clock time from the real constraint, name that constraint plainly, ask what start time works, and agree on it together, including what each of you will do if one of you runs behind. You learn what time means to a specific person by agreeing on it with them, not by guessing from where they are from.</p>" },
          { type: "list", heading: "Agreeing expectations explicitly", items: ["Say the real constraint: a hard external deadline, a room booked for a fixed hour, a colleague who has to leave at a set time", "Ask what start time genuinely works, rather than announcing one and assuming it means the same thing to both of you", "Confirm the agreement out loud or in writing, including what each of you will do if one of you is running behind", "Have the same conversation with everyone; do not tighten expectations for one person, or loosen them, because of their background"] },
          { type: "leaderMove", heading: "Agree the expectation; do not assign the reason", control: "You control whether you guess at the reason for a late start or agree on the expectation directly. Only one of those gives the other person a real say.", failure: "Do not label anyone's relationship to time from their background, whether the label is \"disrespectful\" or \"that is just their culture,\" and do not let a real deadline go unspoken because you assumed a clock time would carry it.", next: "In your next scheduling conversation, name the constraint, ask what start time works, and confirm it together." },
          { type: "flashcards", heading: "Time without assumptions", cards: [
            { front: "What is the one thing the cluster pattern can do for you?", back: "<p>It can stop you from reading a late start as a personal slight. It cannot tell you why a specific person was late.</p>" },
            { front: "Is \"that is just how time works in their culture\" a safe assumption?", back: "<p>No. It is a stereotype, even when kindly meant. It labels a person with a pattern they may not hold and leaves the expectation unspoken.</p>" },
            { front: "What works with everyone?", back: "<p>Name the real constraint, ask what start time works, and agree on it together, including what to do if someone runs behind.</p>" },
          ] },
          { type: "knowledgeCheck", id: "cq-sub-saharan-africa-2-check", question: "A community partner has joined your last several planning calls twenty minutes after the scheduled start, warm and unhurried once he is on. You have a hard external deadline in two days. What is the most accurate and useful response?", options: [{ text: "Tell him the lateness is disrespectful and must stop.", correct: false }, { text: "Conclude that his culture treats time loosely, and quietly plan around it by padding every meeting without telling him.", correct: false }, { text: "Without assuming why he starts late, tell him about the deadline, ask what start time works for him, and agree on it together.", correct: true }, { text: "Stop scheduling live calls with him and rely only on written communication.", correct: false }], feedbackCorrect: "Right. You do not know any individual's relationship to time until you talk about it. Naming the real constraint and agreeing the start time together solves the deadline problem and treats him as a person, not a pattern.", feedbackIncorrect: "Look for the response that neither judges him nor assigns a cultural explanation to him. Agreeing the expectation explicitly is the only option that gives him a say." },
        ],
      },
      {
        id: "cq-sub-saharan-africa-3",
        number: 3,
        title: "Serving a client whose elders are part of the decision",
        summary: "When elder authority and communal consultation are central, a client's decision may genuinely wait for a respected elder's input. Serving that well means making room for it, without assuming every client wants it.",
        minutes: 10,
        learning: {
          objective: "Respond to a client connected to the Sub-Saharan Africa cluster who wants to consult a respected elder or community member before deciding on a service, in a way that respects the pattern while confirming the client's own timeline and consent.",
          takeaways: [
            "Elder authority and community consultation before a significant decision are documented patterns across this cluster; a client asking to wait and consult is not indecision or a stalling tactic.",
            "Respecting the pattern means building consultation time into the service timeline where possible, and treating it as a legitimate part of the client's decision process, not an obstacle to close out quickly.",
            "The client's own stated wishes always govern; some clients connected to this cluster will decide independently, and assuming a consultation step is needed can be just as disrespectful as refusing to allow one.",
          ],
          evidence: "A service-delivery scenario about a client requesting time to consult an elder before agreeing to a care plan, and a knowledge check on making room for consultation without assuming it.",
          appliedNextStep: "When a client asks for time to consult family, community, or an elder before deciding, build that time into your documented timeline rather than treating it as a delay to work around.",
        },
        scenario: {
          context: "Amara is offered a long-term care plan and says she would like to speak with her uncle, a respected elder in her community, before agreeing to specific elements. Your program's standard timeline expects a signed plan within five business days.",
          prompt: "What is the most respectful and workable way to handle this request?",
          options: [
            { label: "Explain the five-day timeline and ask Amara to decide on her own so the paperwork is not delayed.", response: "This treats the standard timeline as fixed and the consultation as an obstacle, rather than as a legitimate part of how Amara makes an important decision." },
            { label: "Confirm how much time Amara needs to consult her uncle, document the extension with the reason, and adjust the internal timeline while keeping her informed of any hard external deadlines that do exist.", response: "This makes room for the documented consultation pattern as a real part of the decision process, while still being transparent about any actual constraints.", recommended: true },
            { label: "Assume Amara cannot decide without her uncle's approval and require his signature on the plan as well.", response: "This overrides Amara's own decision-making authority by assuming her uncle's involvement means he decides for her rather than with her." },
          ],
        },
        transfer: {
          prompt: "Think of a program timeline you manage. Where could you build in documented flexibility for a client who wants to consult family, community, or an elder before deciding?",
          options: ["Name the specific timeline and the step where consultation time could be added", "Draft how you would document an extension request tied to consultation", "Note how you would still communicate any genuinely fixed external deadlines clearly"],
        },
        blocks: [
          { type: "text", heading: "Consultation is part of the decision, not a delay in it", body: "<p>Ubuntu and the elder-authority patterns documented across the Sub-Saharan Africa cluster describe decisions, especially significant ones, as made through community consensus and respected elder input, not solely by the individual affected. A client who asks to consult a respected elder or family member before agreeing to a service plan is engaging in a normal, legitimate part of how that decision gets made well, not stalling or failing to take ownership of their own case.</p><p>A rigid program timeline built around individual, immediate decision-making can put real pressure on a client to skip a step that matters to them. Where possible, building consultation time into the documented timeline, and clearly separating it from any genuinely fixed external deadlines, respects the pattern without pretending every deadline can move.</p><p>The client's own decision-making authority still matters most. Elder or community input generally informs the client's choice; it does not automatically transfer the decision to someone else. Assuming a client wants, or requires, an elder's approval before they can act can be just as disrespectful as refusing to allow the consultation at all.</p>" },
          { type: "list", heading: "Making room for consultation, practically", items: ["Ask how much time a client needs to consult family, community, or an elder, rather than assuming a fixed short window", "Document the reason for any extension clearly, distinguishing it from an unexplained delay", "Communicate any genuinely fixed external deadlines honestly, rather than presenting every timeline as equally rigid", "Confirm the decision, once made, directly with the client, rather than assuming an elder's involvement means they decide instead of the client"] },
          { type: "accordion", heading: "Two ways this can go wrong", items: [
            { title: "Treating consultation as a delay to minimize", body: "<p>Pressuring a client to decide immediately, without space to consult, can force a choice made without input the client genuinely wanted.</p>" },
            { title: "Assuming the elder decides instead of the client", body: "<p>Requiring an elder's signature or treating their view as final overrides the client's own authority over their own decision — the opposite failure.</p>" },
          ] },
          { type: "quote", text: "I was not confused about what I wanted. I wanted my uncle's wisdom in the room before I decided, the way I always have for decisions that matter. Nobody needed to decide for me. I needed the time.", cite: "Composite client perspective, illustrative" },
          { type: "knowledgeCheck", id: "cq-sub-saharan-africa-3-check", question: "A client connected to the Sub-Saharan Africa cluster asks to consult a respected elder before agreeing to a care plan, and the program's standard timeline expects a decision in five days. What is the most respectful response?", options: [{ text: "Ask the client to decide within the standard timeline without the consultation.", correct: false }, { text: "Confirm the time needed for consultation, document the extension, and communicate any genuinely fixed deadlines clearly.", correct: true }, { text: "Require the elder's signature on the plan alongside the client's.", correct: false }], feedbackCorrect: "Right. Making room for consultation respects the pattern while the client's own decision-making authority stays intact.", feedbackIncorrect: "Consider both failure modes: rushing past a legitimate consultation step, and assuming the elder decides instead of the client." },
        ],
      },
      {
        id: "cq-sub-saharan-africa-4",
        number: 4,
        title: "Building collective recognition into team practice",
        summary: "A team can shift how it recognizes achievement toward the collective, communal framing this cluster's research describes, as a standing practice available to everyone, without asking any colleague to stop valuing individual recognition personally.",
        minutes: 10,
        learning: {
          objective: "Adapt a team's recognition and credit practice to include collective framing that fits the communal pattern this cluster's research documents, as a structural option rather than a rule replacing individual recognition.",
          takeaways: [
            "Singling out one person for public praise can feel uncomfortable or even isolating to a colleague shaped by a strong communal orientation, even when the intention is entirely positive.",
            "Building collective framing into recognition — naming the team and the specific contribution together — is a structural option that works alongside individual recognition, not a replacement for it everywhere.",
            "The goal is offering both forms of recognition as normal options, not deciding for any individual which one they should prefer.",
          ],
          evidence: "A leadership scenario about redesigning a recognition practice after a colleague's discomfort with individual praise, and a knowledge check on structural options versus assumptions.",
          appliedNextStep: "Before your next team recognition moment, ask the person being recognized whether they would prefer individual or collective framing, and build both options into your standard practice.",
        },
        scenario: {
          context: "A supervisor publicly praises Chidi by name in an all-staff email for a successful project, expecting he will be pleased. Chidi seems uncomfortable afterward and later mentions, carefully, that he would have preferred the recognition go to the whole team that supported the work.",
          prompt: "What is the best way to adjust the team's recognition practice going forward?",
          options: [
            { label: "Continue naming individuals in recognition emails, since most of the team responds well to it and Chidi can be thanked privately instead.", response: "This keeps a single default and manages Chidi's discomfort privately rather than building a real option into the team's practice." },
            { label: "Build a standing practice of asking, before public recognition, whether the person prefers individual or collective framing, and offer both as normal options for the whole team.", response: "This creates a structural choice available to everyone, matching the communal pattern for those who want it without removing individual recognition for those who prefer it.", recommended: true },
            { label: "Switch entirely to collective, team-based recognition and stop naming individuals in any praise going forward.", response: "This replaces one default with another, still without asking each person what they actually prefer." },
          ],
        },
        transfer: {
          prompt: "Look at how your team currently recognizes achievement. Where could you build in a choice between individual and collective framing?",
          options: ["Name the current recognition practice and where the choice could be added", "Draft the exact question you would ask someone before recognizing their work publicly", "Decide how you will remember and apply each person's stated preference going forward"],
        },
        blocks: [
          { type: "text", heading: "Recognition has more than one right shape", body: "<p>A leader who defaults to naming individuals in praise is applying one cultural default among several, not a universal best practice. The Ubuntu and communal-achievement patterns documented across the Sub-Saharan Africa cluster describe identity and accomplishment as relationally constituted: a colleague shaped by this pattern may feel that being singled out separates them from the community that made the work possible, even when the praise is warmly intended.</p><p>The fix is not to abandon individual recognition, which plenty of colleagues, including some connected to this cluster, genuinely value. It is to build a real choice into the practice: ask the person, before recognizing them publicly, whether they would prefer their name highlighted individually or the achievement framed as a team effort, and treat both as equally legitimate, standing options.</p><p>This becomes a team norm — a short question asked consistently — rather than a judgment call the leader makes based on guessing who might be uncomfortable. It respects the documented pattern without assuming it applies to any specific person, including Chidi's own colleagues who may prefer individual recognition themselves.</p>" },
          { type: "list", heading: "What the structural practice includes", items: ["Asking the person, before public recognition, whether they prefer individual or collective framing", "Offering both forms of recognition as equally normal parts of team practice", "Applying the question consistently, for every team member, not only when discomfort has already surfaced", "Remembering and reusing a stated preference rather than asking fresh every single time in a way that feels burdensome"] },
          { type: "leaderMove", heading: "Ask before you praise, not after discomfort appears", control: "You control whether recognition defaults to one shape or offers a real choice. Asking in advance is the structural lever.", failure: "Do not assume you know which form of recognition someone prefers based on their background, and do not replace one default with another without asking.", next: "Before your next public recognition, ask the person which framing they would prefer, and make that question a standing habit." },
          { type: "sorting", id: "cq-sub-saharan-africa-4-sort", heading: "Structural choice or assumption?", categories: ["Structural choice", "Assumption"], items: [
            { text: "Asking each person, before public praise, whether they prefer individual or collective framing", category: "Structural choice" },
            { text: "Assuming a colleague from this cluster will prefer collective credit without asking", category: "Assumption" },
            { text: "Offering both individual and collective recognition as standing, equal options", category: "Structural choice" },
            { text: "Switching every recognition to team-based framing without asking anyone's preference", category: "Assumption" },
          ] },
          { type: "flashcards", heading: "Recognition without assumptions", cards: [
            { front: "What should a leader ask before publicly praising someone?", back: "<p>Whether they would prefer individual or collective framing for the recognition.</p>" },
            { front: "Why not just switch entirely to collective recognition?", back: "<p>That replaces one assumption with another; some colleagues genuinely prefer individual recognition, regardless of background.</p>" },
            { front: "What makes this a structural fix?", back: "<p>The question is asked consistently, for everyone, as a standing part of team practice, not only after discomfort appears.</p>" },
          ] },
          { type: "knowledgeCheck", id: "cq-sub-saharan-africa-4-check", question: "A colleague connected to the Sub-Saharan Africa cluster seems uncomfortable being singled out for public praise and would have preferred team-based recognition. What is the best structural fix going forward?", options: [{ text: "Stop naming any individual in recognition and always frame praise around the team.", correct: false }, { text: "Build a standing practice of asking each person, before public recognition, whether they prefer individual or collective framing.", correct: true }, { text: "Assume colleagues connected to this cluster generally prefer collective credit and adjust only for them.", correct: false }], feedbackCorrect: "Right. Asking each person consistently creates a real choice without assuming a preference based on cluster background.", feedbackIncorrect: "Look for the option that builds a genuine choice into the practice for everyone, rather than replacing one assumption with another." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Sub-Saharan Africa: quick reference",
    subtitle: "A one-page reminder for working with colleagues and partners connected to the Sub-Saharan Africa cluster",
    quote: "Ubuntu — \"I am because we are\" — is a profound expression of collectivism that goes beyond shared goals. It is a claim that human identity itself is constituted through community relationships.",
    use: {
      purpose: "Keep the Sub-Saharan Africa cluster’s key patterns and suggestive practices ready for your next cross-cultural interaction.",
      remember: ["Collectivism: Very high — Ubuntu: communal interdependence as identity", "Power distance: High — elder authority and community leadership respected", "Communication: High context — oral tradition, story, communal meaning", "Time orientation: Polychronic — relational and present-centered", "Being: Being orientation — presence and community over output"],
      doNext: "Apply one suggestive practice from this module in your next relevant interaction.",
    },
    sections: [
      { heading: "Suggestive practices", items: ["Design for community consultation \— Before implementing anything, ask: who are the trusted community voices? Build consultation into your design process, not as an afterthought.", "Recognize communal achievement \— Ask before singling out an individual for public praise. Many colleagues shaped by a communal pattern want credit to go to the team; others want their own name on the work. Offer both.", "Honor elder wisdom \— In many communities connected to this cluster, elders hold relational and moral authority. Ask who the trusted voices are in the specific community you are working with, then acknowledge and include them meaningfully.", "Embrace oral and narrative modes \— Storytelling is a primary communication form. Use narrative, not just bullet points, to share information in culturally resonant ways."] },
      { heading: "Before you assume", items: ["Clusters describe broad patterns, not individual people.", "Sub-Saharan Africa spans dozens of countries and hundreds of cultures. Ubuntu is a Southern African idea used here as an illustration, not a description of everyone. Minnesota's Somali, Ethiopian, Eritrean, Liberian, Kenyan, Nigerian, and other communities differ greatly, and so do the people within each.", "No one's relationship to time, deadlines, or decisions can be read from their background. Agree expectations explicitly, with everyone.","Use this module as a starting point for curiosity, never as a conclusion about a specific person.", "When in doubt, ask the person directly about their own preferences and context."] },
    ],
  },
  sources: [
    { title: "Livermore, D. (2013). Expand Your Borders: Discover Ten Cultural Clusters. Cultural Intelligence Center.", href: "https://culturalq.com", note: "Source framework for the ten cultural clusters, their key dimensions, and this module's scenario and practice content." },
  ],
};

export default pack;
