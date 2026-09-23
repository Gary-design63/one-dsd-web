import type { CoursePack } from "../../source-types";

// Cultural Intelligence curriculum, module 2: Anglo — The Individualism Cluster.
// Based on: Livermore, D. (2013). Expand Your Borders: Discover Ten Cultural Clusters. Cultural Intelligence Center.
const pack: CoursePack = {
  course: {
    id: "cq-anglo",
    indexNumber: 1130,
    seriesLabel: "Cultural Intelligence \u00b7 Expand Your Borders",
    title: "Anglo: The Individualism Cluster",
    subtitle: "The Anglo cluster is among the most individualistic in the world.",
    scope: "For all DHS staff. One of ten modules in the Expand Your Borders cross-cultural intelligence curriculum. Clusters describe broad patterns, not individual people — use them as starting points for curiosity, never as endpoints for judgment about any one person.",
    treatment: "One module with a scenario, reflection questions, suggestive practices, and a knowledge check",
    duration: "45\u201350 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/stock-people-02.jpg",
    coverAlt: "Colleagues shaking hands and greeting each other on a city sidewalk.",
    introTranscript: "The Anglo cluster is among the most individualistic in the world. Personal achievement, self-reliance, and results-orientation define the cultural core. Communication tends to be direct but socially cushioned — Anglo cultures say what they mean, but often wrap it in politeness. Competition is a driver, task completion is prioritized, and time is treated as a commodity. Though enormously diverse internally, these cultures share a common thread of meritocracy and informality in relationship-building.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Describe the core cultural dimensions of the Anglo cluster and how they shape communication and decision-making.",
        "Respond to a realistic cross-cultural scenario in a way that reads the situation accurately rather than through your own cultural default.",
        "Apply at least one suggestive practice from this module in a real cross-cultural interaction.",
      ],
      evidence: [
        "A worked scenario decision with an explanation of why it fits the cluster's cultural patterns.",
        "One knowledge check on this cluster's most distinctive cultural dimension.",
      ],
      appliedNextStep: "Practice one suggestive behavior from this module in your next interaction with a colleague or partner connected to the Anglo cluster.",
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
        id: "cq-anglo-1",
        number: 1,
        title: "Anglo",
        summary: "The Individualism Cluster. The Anglo cluster is among the most individualistic in the world",
        minutes: 20,
        learning: {
          objective: "Describe the Anglo cluster’s core cultural dimensions and respond accurately to a realistic cross-cultural scenario.",
          takeaways: [
            "Individualism: Very high — personal achievement and autonomy",
            "Power distance: Low — informality with leaders is accepted",
            "Communication: Low context — explicit, polite directness",
            "Time orientation: Short-term — results now; monochronic time use",
            "Being–doing: Doing — task completion over relationship nurturing"
          ],
          evidence: "A worked scenario decision, a set of reflection questions, and a knowledge check.",
          appliedNextStep: "Choose one suggestive practice from this module and apply it in your next relevant interaction.",
        },
        scenario: {
          context: "You join a multinational task force. A colleague from a collectivist culture spends the first 30 minutes of each meeting building rapport — asking about families, sharing stories, offering food. Your Anglo instinct is to get to the agenda quickly. The project timeline is tight.",
          prompt: "How do you respond?",
          options: [
        { label: "Politely redirect the group: \"I appreciate the connection — let's make sure we protect time for the agenda.\"", response: "This protects the timeline but treats relationship-building as overhead rather than as legitimate work for some team members." },
        { label: "Recognize that relationship-building IS the agenda for some team members, and adjust your timeline expectations accordingly.", response: "This is the accurate reading. For many collectivist colleagues, the relationship work is not separate from the task — it is the foundation the task rests on.", recommended: true },
        { label: "Schedule a separate \"social\" call so the task meetings can stay on-point.", response: "This segregates relationship-building from the actual work, which can read as treating the connection as optional rather than integral." }
          ],
        },
        transfer: {
          prompt: "Anglo cultures often assume their work style is the \"default\" global style. Where have you noticed this assumption operating in your own professional environment?",
          options: ["When you evaluate someone as \"high-performing,\" what cultural metrics are you using? Whose definition of performance is it?", "How does your comfort with informality (calling leaders by first name, casual dress) translate — or fail to translate — in other cultural contexts?", "Name one relationship at work you could invest more time in before the next task-focused request."],
        },
        blocks: [
          { type: "text", heading: "Cluster overview", body: "<p>The Anglo cluster is among the most individualistic in the world. Personal achievement, self-reliance, and results-orientation define the cultural core. Communication tends to be direct but socially cushioned — Anglo cultures say what they mean, but often wrap it in politeness. Competition is a driver, task completion is prioritized, and time is treated as a commodity. Though enormously diverse internally, these cultures share a common thread of meritocracy and informality in relationship-building.</p><p><strong>Region:</strong> Australia, Canada, Ireland, New Zealand, South Africa, United Kingdom, United States</p>" },
          { type: "list", heading: "Key cultural dimensions", items: ["Individualism: Very high — personal achievement and autonomy", "Power distance: Low — informality with leaders is accepted", "Communication: Low context — explicit, polite directness", "Time orientation: Short-term — results now; monochronic time use", "Being–doing: Doing — task completion over relationship nurturing"] },
          { type: "list", heading: "Reflect", ordered: true, items: ["Anglo cultures often assume their work style is the \"default\" global style. Where have you noticed this assumption operating in your own professional environment?", "When you evaluate someone as \"high-performing,\" what cultural metrics are you using? Whose definition of performance is it?", "How does your comfort with informality (calling leaders by first name, casual dress) translate — or fail to translate — in other cultural contexts?"] },
          { type: "flashcards", heading: "Suggestive practices", cards: [
            { front: "Audit your default standard", back: "<p>List three team norms you assume are universal. Research which cultural clusters share them and which don't.</p>" },
            { front: "Slow the agenda", back: "<p>In cross-cultural settings, build in relational time before business. Even 10 minutes of intentional connection shifts dynamics.</p>" },
            { front: "Expand your performance lens", back: "<p>Consider whether your feedback systems reward Anglo-coded behaviors (assertiveness, speed, individual output) over other equally valid approaches.</p>" },
            { front: "Read politeness carefully", back: "<p>Anglo \"no\" often sounds like \"that's interesting but...\". Learn to recognize polite deflection versus genuine agreement across cultures.</p>" }
          ] },
          { type: "knowledgeCheck", id: "cq-anglo-1-check", question: "Which combination of traits most distinctly characterizes Anglo cultures?", options: [{ text: "High collectivism and high power distance", correct: false }, { text: "High individualism, low context communication, and task orientation", correct: true }, { text: "High uncertainty avoidance and cooperative orientation", correct: false }, { text: "High context communication and long-term time orientation", correct: false }], feedbackCorrect: "Anglo cultures score among the highest globally on individualism, pair it with direct (low context) communication, and prioritize getting things done — placing task completion above relationship maintenance.", feedbackIncorrect: "Look again at the cluster’s key dimensions — Anglo cultures score among the highest globally on individualism, pair it with direct (low context) communication, and prioritize getting things done — placing task completion above relationship maintenance." },
        ],
      },
      {
        id: "cq-anglo-2",
        number: 2,
        title: "When “getting to the point” reads as dismissive",
        summary: "A task-first, no-preamble style is a common Anglo-cluster pattern. A colleague who expects relationship-building first may read it as dismissive rather than efficient.",
        minutes: 9,
        learning: {
          objective: "Recognize when a task-first communication habit is landing as dismissive with a colleague who expects relational context first, and adjust the opening of the interaction rather than the substance of the work.",
          takeaways: [
            "Population-level research describes Anglo-cluster communication as low-context and task-oriented; skipping small talk is often meant as respectful efficiency, not coldness.",
            "A colleague from a more relationship-first background may read the same habit as a sign that the working relationship, or the person, does not matter.",
            "Adding thirty seconds of genuine relational opening rarely costs meaningful time and often prevents a misread that costs much more.",
          ],
          evidence: "A scenario decision about a colleague who feels rushed past in a recurring check-in, and a knowledge check on adjusting the opening without diluting the work.",
          appliedNextStep: "In your next meeting with a colleague who has mentioned feeling rushed, open with one genuine, unhurried question before moving to the task.",
        },
        scenario: {
          context: "You run a weekly fifteen-minute check-in with a caseworker colleague. You open every call with “Okay, three things,” and move straight into the list. The colleague, whose working style values relationship-building before business, has started arriving late and seeming disengaged.",
          prompt: "What is the most accurate response?",
          options: [
            { label: "Keep the format as-is since it is efficient, and address the lateness as a separate performance issue.", response: "This treats a likely communication mismatch as an unrelated behavior problem and misses the actual cause of the disengagement." },
            { label: "Recognize that jumping straight to the task list may be reading as dismissive, and open the next few check-ins with a genuine, unhurried question before the agenda.", response: "This is the accurate read. A brief relational opening is a small change that can restore engagement without adding meaningful time to the call.", recommended: true },
            { label: "Cancel the recurring check-in and switch to email updates instead.", response: "This removes the relational opportunity entirely rather than adjusting the format that is causing the disengagement." },
          ],
        },
        transfer: {
          prompt: "Think of a recurring meeting you run that jumps straight to the task. What would change if you opened it differently for one colleague, without changing the substance of the work?",
          options: ["Name one recurring meeting that opens straight into the task list", "Identify one colleague who might read that opening as rushed", "Draft the one relational question you would add before the agenda"],
        },
        blocks: [
          { type: "text", heading: "Efficiency and dismissal can look identical from outside", body: "<p>Population-level research on the Anglo cluster describes a low-context, task-first communication style: state the point, move through the agenda, treat time as something not to be wasted. For colleagues shaped by the same norm, this reads as respectful and efficient. For a colleague shaped by a more relationship-first norm, the identical behavior — no greeting, straight to the list — can read as a signal that the relationship, or the person, does not matter enough to warrant a moment of attention.</p><p>This is a pattern seen at the population level, not a fact about any individual on either side of the interaction. The service-relevant skill is noticing when a habitual opening is landing badly for a specific colleague, and adjusting the opening — not the substance of the work — to fit them.</p>" },
          { type: "list", heading: "Signs a task-first opening may be landing as dismissive", items: ["A colleague has started arriving late, going quiet, or disengaging from a recurring meeting.", "Feedback mentions feeling rushed, unheard, or like the relationship does not matter.", "You have never actually asked the colleague what opening would work better for them."] },
          { type: "leaderMove", heading: "Adjust the opening, not the outcome", control: "You control the first thirty seconds of a meeting you run. You do not need to sacrifice the agenda to change them.", failure: "Do not dismiss a colleague's disengagement as a performance issue before checking whether your own default opening is the cause.", next: "In your next check-in with a colleague who has seemed disengaged, open with one genuine question before the task list, and see what changes." },
          { type: "flashcards", heading: "Same habit, different reads", cards: [
            { front: "Why does task-first feel respectful to some colleagues?", back: "<p>It signals that their time is valuable and not being wasted on unnecessary preamble — a common Anglo-cluster pattern.</p>" },
            { front: "Why might the same habit feel dismissive to others?", back: "<p>For colleagues from more relationship-first backgrounds, skipping relational opening can read as a signal that the relationship does not matter.</p>" },
            { front: "What is the low-cost fix?", back: "<p>A brief, genuine relational opening before the agenda. It rarely costs meaningful time and often prevents a real misread.</p>" },
          ] },
          { type: "knowledgeCheck", id: "cq-anglo-2-check", question: "A colleague who values relationship-building first seems disengaged in a meeting that always opens straight into the task list. What is the most accurate first step?", options: [
            { text: "Treat the disengagement as an unrelated performance issue.", correct: false },
            { text: "Consider whether the task-first opening is reading as dismissive, and add a brief relational opening before the agenda.", correct: true },
            { text: "Cancel the meeting and move all updates to email.", correct: false },
          ], feedbackCorrect: "Right. A small adjustment to the opening addresses the likely cause without changing the substance of the work.", feedbackIncorrect: "Consider what a task-first opening can signal to a colleague who expects relationship-building first, and what a low-cost fix would look like." },
        ],
      },
      {
        id: "cq-anglo-3",
        number: 3,
        title: "Serving a participant who expects a fast, direct answer",
        summary: "Some participants connected to the Anglo cluster expect quick, plain answers and can read relationship-building steps as delay. Respectful service adapts pacing without skipping required steps.",
        minutes: 9,
        learning: {
          objective: "Serve a participant who expects fast, direct answers by front-loading clear, plain information, without skipping required relationship-building or eligibility steps.",
          takeaways: [
            "Population-level research describes a preference in this cluster for direct answers and visible progress toward a result, over extended process explanation.",
            "A participant who seems impatient with process steps may simply want to know what happens next and how long it will take, stated plainly and early.",
            "Any individual participant may not match this pattern — the safe approach is to lead with a plain-language summary of the process, then explain the required steps.",
          ],
          evidence: "A scenario decision about a participant who interrupts a benefits explanation, and a knowledge check on leading with a plain answer before the required detail.",
          appliedNextStep: "In your next eligibility conversation, open with a one-sentence plain-language summary of what will happen and how long it will take before walking through the steps.",
        },
        scenario: {
          context: "A participant applying for emergency assistance interrupts your standard intake explanation: “Just tell me — am I going to get help or not, and how long will it take?” The full explanation includes required verification steps you still need to complete with him.",
          prompt: "What is the most respectful next step?",
          options: [
            { label: "Continue the standard explanation in order, since all the steps are required regardless of how he feels about the pace.", response: "This meets the letter of the process but ignores a direct, reasonable request for the plain answer he actually needs first." },
            { label: "Give a plain, honest one-sentence answer about his likely eligibility and timeline first, then explain the required verification steps that still need to happen.", response: "This respects his preference for a direct answer while still completing every required step — nothing is skipped, only reordered.", recommended: true },
            { label: "Tell him the process cannot be explained any faster and ask him to be patient.", response: "This treats a reasonable request for clarity as impatience to be managed rather than served." },
          ],
        },
        transfer: {
          prompt: "Think of a required process you explain the same way to everyone. What would change if you led with a plain-language summary of the outcome and timeline before the required steps?",
          options: ["Name one process where you walk participants through every step in order", "Draft a one-sentence plain-language summary you could lead with instead", "Note which required steps would still need full explanation afterward"],
        },
        blocks: [
          { type: "text", heading: "Fast and direct is not impatient", body: "<p>Population-level research on the Anglo cluster describes a preference for direct answers, visible progress and getting to the result — not because process does not matter, but because the outcome and the timeline are usually the most useful information a person can have. A participant who interrupts to ask “will I get help, and how long will it take” is often asking a completely reasonable question that a standard, in-order explanation buries under required detail.</p><p>Serving this well does not mean skipping any required verification, eligibility or documentation step. It means reordering the conversation: state the plain, honest answer and timeline first, then walk through what still has to happen. Any participant, from any background, may prefer this order — it is not exclusive to one cluster, and not every participant connected to this cluster will want it.</p>" },
          { type: "list", heading: "Practices that serve a direct-answer preference without cutting corners", items: ["Open with a one-sentence plain-language summary of the likely outcome and timeline before detailing required steps.", "Name every required step clearly, but frame it as “what has to happen to get you the result,” not as unrelated bureaucracy.", "Check in — “would it help if I gave you the short version first each time?” — rather than assuming the preference."] },
          { type: "leaderMove", heading: "Reorder, do not remove", control: "You control the order in which required information is presented. You do not control, and should not skip, which steps are legally or programmatically required.", failure: "Do not treat a participant's request for a direct answer as a reason to shortcut verification or eligibility requirements.", next: "In your next intake, lead with the plain-language outcome and timeline before walking through the required steps, and see whether it changes the conversation." },
          { type: "flashcards", heading: "Serving the direct-answer preference", cards: [
            { front: "Why might a participant interrupt a process explanation?", back: "<p>They may be asking a reasonable, direct question about outcome and timeline that a standard in-order explanation delays answering.</p>" },
            { front: "What should never be skipped?", back: "<p>Any required verification, eligibility or documentation step — reordering the conversation is not the same as shortcutting the process.</p>" },
            { front: "What is a safe universal practice?", back: "<p>Leading with a one-sentence plain-language summary of outcome and timeline works for many participants, regardless of cultural background.</p>" },
          ] },
          { type: "knowledgeCheck", id: "cq-anglo-3-check", question: "A participant interrupts a required intake explanation to ask for a direct answer about eligibility and timeline. What is the best response?", options: [
            { text: "Continue the explanation in the standard order without changing anything.", correct: false },
            { text: "Give a plain, honest summary of outcome and timeline first, then complete all required steps.", correct: true },
            { text: "Skip the remaining required steps since he has indicated he wants to move fast.", correct: false },
          ], feedbackCorrect: "Right. Reordering to lead with a plain answer respects his preference while still completing every required step.", feedbackIncorrect: "Consider how to respect a direct-answer preference without skipping any step the process actually requires." },
        ],
      },
      {
        id: "cq-anglo-4",
        number: 4,
        title: "Building a feedback practice that does not reward one style",
        summary: "A meritocratic, results-first feedback culture can quietly reward Anglo-coded traits like assertiveness and speed over equally valid work styles. Adjust the practice, not the standard.",
        minutes: 9,
        learning: {
          objective: "Adjust a team's feedback and recognition practice so it evaluates actual results and contribution, rather than defaulting to Anglo-coded traits like assertiveness, speed and self-promotion as proxies for performance.",
          takeaways: [
            "A results-first, individualist feedback culture can unintentionally reward visible, vocal self-promotion over quieter but equally valuable contributions.",
            "Naming the actual criteria for good performance, separate from communication style, helps a mixed team see how contribution is really being judged.",
            "The goal is a shared standard that recognizes different working styles fairly, not a standard that asks quieter or more relationship-first colleagues to perform assertiveness they do not have.",
          ],
          evidence: "A scenario decision about redesigning a team's recognition practice, and a knowledge check on separating performance criteria from communication style.",
          appliedNextStep: "Before your next round of team recognition, write down the specific outcome or contribution being recognized, separate from how loudly or quickly it was communicated.",
        },
        scenario: {
          context: "In team meetings, the staff who speak up quickly and confidently get noticed and praised, while a colleague who works carefully behind the scenes and prefers to raise ideas in writing afterward rarely gets mentioned, despite strong results. A peer says, “She just needs to speak up more if she wants credit.”",
          prompt: "What is the most accurate response to that comment?",
          options: [
            { label: "Agree, and coach the quieter colleague to speak up faster and more often in meetings.", response: "This asks a colleague to adopt an Anglo-coded assertiveness style rather than fixing a recognition practice that only notices one kind of contribution." },
            { label: "Recognize that the recognition practice is rewarding speed and assertiveness rather than results, and build a habit of asking for written input and naming specific contributions regardless of who voiced them first.", response: "This changes the practice so contribution is recognized on its merits, without requiring anyone to change their communication style to be seen.", recommended: true },
            { label: "Stop giving public recognition altogether so no one's communication style has an advantage.", response: "This removes recognition for everyone rather than fixing the specific bias in how it has been distributed." },
          ],
        },
        transfer: {
          prompt: "Think of your team's recognition or feedback practice. Who tends to get noticed, and does that track actual results or communication style?",
          options: ["Name one recent instance of team recognition or praise", "Identify whether it rewarded a result or a communication style", "Draft one change that would separate the two going forward"],
        },
        blocks: [
          { type: "text", heading: "Assertiveness is a style, not a measure of contribution", body: "<p>Anglo-cluster norms tend to reward direct, confident, fast self-presentation — speaking up quickly in meetings, stating accomplishments plainly, moving fast. When a team's informal recognition and feedback practice tracks these traits rather than actual outcomes, it can systematically undercount colleagues who contribute just as much through quieter, slower or more written channels, including many colleagues shaped by different cultural norms and plenty who simply have a different working style regardless of background.</p><p>Fixing this does not mean asking assertive colleagues to quiet down, or asking quieter colleagues to perform assertiveness they do not have. It means building a recognition and feedback practice that actively looks for contribution across multiple channels — spoken, written, behind-the-scenes — and names specific results rather than rewarding whoever spoke first and loudest.</p>" },
          { type: "list", heading: "Practices that separate contribution from communication style", items: ["Solicit written input before or after meetings, and credit ideas from those channels as visibly as ideas spoken in the room.", "In recognition and reviews, name the specific outcome or contribution, not “great energy in meetings.”", "Rotate who summarizes team wins so credit is not always assigned by whoever speaks first."] },
          { type: "leaderMove", heading: "Recognize the result, not the delivery", control: "You control what your team's recognition practice actually measures.", failure: "Do not coach quieter or more relationship-first colleagues to change their communication style as the fix for an uneven recognition practice.", next: "In your next team update, credit at least one contribution that came through a written or behind-the-scenes channel, and name it as specifically as you would a spoken one." },
          { type: "sorting", id: "cq-anglo-4-sort", heading: "Result or delivery style?", categories: ["Actual result or contribution", "Communication style, not a result"], items: [
            { text: "Reduced a backlog of cases by a documented amount over the quarter.", category: "Actual result or contribution" },
            { text: "Spoke first and confidently in every team meeting.", category: "Communication style, not a result" },
            { text: "Wrote a process fix that another team later adopted.", category: "Actual result or contribution" },
            { text: "Volunteered ideas quickly and loudly before others could speak.", category: "Communication style, not a result" },
          ] },
          { type: "knowledgeCheck", id: "cq-anglo-4-check", question: "A team's recognition practice consistently favors staff who speak up quickly in meetings over quieter colleagues with strong results. What is the best fix?", options: [
            { text: "Coach the quieter colleagues to speak up faster and more confidently.", correct: false },
            { text: "Change the recognition practice to actively track specific results and contributions across written and spoken channels alike.", correct: true },
            { text: "Eliminate all team recognition to avoid any style advantage.", correct: false },
          ], feedbackCorrect: "Right. Fixing the practice, not the person's communication style, addresses the actual bias.", feedbackIncorrect: "Consider whether the fix should change the colleague's communication style or the practice that is measuring the wrong thing." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Anglo: quick reference",
    subtitle: "A one-page reminder for working with colleagues and partners connected to the Anglo cluster",
    quote: "Anglo cultures score among the highest globally on individualism, pair it with direct (low context) communication, and prioritize getting things done — placing task completion above relationship maintenance.",
    use: {
      purpose: "Keep the Anglo cluster’s key patterns and suggestive practices ready for your next cross-cultural interaction.",
      remember: ["Individualism: Very high — personal achievement and autonomy", "Power distance: Low — informality with leaders is accepted", "Communication: Low context — explicit, polite directness", "Time orientation: Short-term — results now; monochronic time use", "Being–doing: Doing — task completion over relationship nurturing"],
      doNext: "Apply one suggestive practice from this module in your next relevant interaction.",
    },
    sections: [
      { heading: "Suggestive practices", items: ["Audit your default standard \— List three team norms you assume are universal. Research which cultural clusters share them and which don't.", "Slow the agenda \— In cross-cultural settings, build in relational time before business. Even 10 minutes of intentional connection shifts dynamics.", "Expand your performance lens \— Consider whether your feedback systems reward Anglo-coded behaviors (assertiveness, speed, individual output) over other equally valid approaches.", "Read politeness carefully \— Anglo \"no\" often sounds like \"that's interesting but...\". Learn to recognize polite deflection versus genuine agreement across cultures."] },
      { heading: "Before you assume", items: ["Clusters describe broad patterns, not individual people.", "Use this module as a starting point for curiosity, never as a conclusion about a specific person.", "When in doubt, ask the person directly about their own preferences and context."] },
    ],
  },
  sources: [
    { title: "Livermore, D. (2013). Expand Your Borders: Discover Ten Cultural Clusters. Cultural Intelligence Center.", href: "https://culturalq.com", note: "Source framework for the ten cultural clusters, their key dimensions, and this module's scenario and practice content." },
  ],
};

export default pack;
