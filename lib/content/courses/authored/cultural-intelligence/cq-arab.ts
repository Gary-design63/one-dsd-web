import type { CoursePack } from "../../source-types";

// Cultural Intelligence curriculum, module 10: Arab — The Honor and Hospitality Cluster.
// Based on: Livermore, D. (2013). Expand Your Borders: Discover Ten Cultural Clusters. Cultural Intelligence Center.
const pack: CoursePack = {
  course: {
    id: "cq-arab",
    indexNumber: 1138,
    seriesLabel: "Cultural Intelligence \u00b7 Expand Your Borders",
    title: "Arab: The Honor and Hospitality Cluster",
    subtitle: "The Arab cluster is a linguistic and cultural grouping shaped by tribal loyalty, honor culture, and hospitality, spanning many countries and religious traditions.",
    scope: "For all DHS staff. One of ten modules in the Expand Your Borders cross-cultural intelligence curriculum. Clusters describe broad patterns, not individual people — use them as starting points for curiosity, never as endpoints for judgment about any one person.",
    treatment: "Four lessons with scenarios, reflection questions, suggestive practices, and knowledge checks",
    duration: "45\u201350 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/stock-people-10.jpg",
    coverAlt: "Four colleagues talking together in a bright office space.",
    introTranscript: "The Arab cluster is a linguistic and cultural grouping — people who share Arabic language and cultural heritage across many countries — shaped by tribal loyalty, honor culture, and hospitality. Religious practice varies widely within the cluster, including Islam, Christianity, Druze communities, secular views, and others, so faith should never be assumed about a specific person. Personal honor — and the honor of one's family and community — guides decisions. Generosity toward guests is treated as a sacred obligation. Relationships and trust are built slowly and are extraordinarily durable once established. Gender norms vary across the cluster but tend toward traditional roles.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Describe the core cultural dimensions of the Arab cluster and how they shape communication and decision-making.",
        "Respond to a realistic cross-cultural scenario in a way that reads the situation accurately rather than through your own cultural default.",
        "Apply at least one suggestive practice from this module in a real cross-cultural interaction.",
      ],
      evidence: [
        "A worked scenario decision with an explanation of why it fits the cluster's cultural patterns.",
        "One knowledge check on this cluster's most distinctive cultural dimension.",
      ],
      appliedNextStep: "Practice one suggestive behavior from this module in your next interaction with a colleague or partner connected to the Arab cluster.",
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
        id: "cq-arab-1",
        number: 1,
        title: "Arab",
        summary: "The Honor and Hospitality Cluster. The Arab cluster is a linguistic and cultural grouping shaped by tribal loyalty, honor culture, and hospitality",
        minutes: 20,
        learning: {
          objective: "Describe the Arab cluster’s core cultural dimensions and respond accurately to a realistic cross-cultural scenario.",
          takeaways: [
            "Collectivism: Very high — family, tribe, and community before self",
            "Power distance: High — hierarchy, age, and religious authority respected",
            "Communication: High context — indirect, face-protecting, honor-aware",
            "Honor and reputation: Central — personal and family reputation shapes decisions",
            "Hospitality: Sacred obligation — generosity toward guests is a core value"
          ],
          evidence: "A worked scenario decision, a set of reflection questions, and a knowledge check.",
          appliedNextStep: "Choose one suggestive practice from this module and apply it in your next relevant interaction.",
        },
        scenario: {
          context: "You are partnering with an organization in the UAE. During Ramadan, your counterpart, Khalid, shifts meeting times, is unavailable during certain prayer windows, and the pace of work slows noticeably. You have a deadline approaching.",
          prompt: "How do you respond?",
          options: [
        { label: "Press Khalid to maintain the original schedule — your deadline hasn't changed.", response: "This treats a period of sacred observance as an inconvenience to work around rather than a legitimate rhythm to plan for." },
        { label: "Recognize Ramadan as a month of sacred observance, proactively adjust your project timeline, and communicate this as an act of respect.", response: "This is the accurate reading. Adjusting proactively, and naming it as respect rather than a concession, builds the relationship rather than straining it.", recommended: true },
        { label: "Work around Khalid's availability without acknowledging Ramadan directly.", response: "Working around the schedule without naming why misses the chance to signal genuine respect for the observance itself." }
          ],
        },
        transfer: {
          prompt: "Arab cultures see modesty as an honorable virtue, not a limitation. How does your culture's framework around modesty — especially for women — compare, and what assumptions are embedded there?",
          options: ["Honor culture means a single public slight can permanently damage a relationship. Think of a time a public correction or critique may have caused more harm than intended.", "Hospitality as a sacred duty means your presence in someone's space is a gift they are obligated to honor. How does that reframe being a guest or a host?", "Name one colleague or partner connected to this cluster and one thing you would ask them directly rather than assume"],
        },
        blocks: [
          { type: "text", heading: "Cluster overview", body: "<p>The Arab cluster is a linguistic and cultural grouping — people who share Arabic language and cultural heritage across many countries — shaped by tribal loyalty, honor culture, and hospitality. Religious practice varies widely within the cluster, including Islam, Christianity, Druze communities, secular views, and others, so faith should never be assumed about a specific person. Personal honor — and the honor of one's family and community — guides decisions. Generosity toward guests is treated as a sacred obligation. Relationships and trust are built slowly and are extraordinarily durable once established. Gender norms vary across the cluster but tend toward traditional roles.</p><p><strong>Region:</strong> Bahrain, Egypt, Iraq, Jordan, Kuwait, Lebanon, Morocco, Qatar, Saudi Arabia, United Arab Emirates</p>" },
          { type: "list", heading: "Key cultural dimensions", items: ["Collectivism: Very high — family, tribe, and community before self", "Power distance: High — hierarchy, age, and religious authority respected", "Communication: High context — indirect, face-protecting, honor-aware", "Honor and reputation: Central — personal and family reputation shapes decisions", "Hospitality: Sacred obligation — generosity toward guests is a core value"] },
          { type: "list", heading: "Reflect", ordered: true, items: ["Arab cultures see modesty as an honorable virtue, not a limitation. How does your culture's framework around modesty — especially for women — compare, and what assumptions are embedded there?", "Honor culture means a single public slight can permanently damage a relationship. Think of a time a public correction or critique may have caused more harm than intended.", "Hospitality as a sacred duty means your presence in someone's space is a gift they are obligated to honor. How does that reframe being a guest or a host?"] },
          { type: "flashcards", heading: "Suggestive practices", cards: [
            { front: "Learn the Islamic calendar", back: "<p>Know when Ramadan, Eid al-Fitr, and Eid al-Adha fall. Proactively adjust deadlines and don't schedule major asks during sacred observance.</p>" },
            { front: "Accept hospitality fully", back: "<p>Refusing offered tea, food, or welcome is a relational insult. Accept warmly, even if briefly. The offer is the relationship.</p>" },
            { front: "Protect honor in feedback", back: "<p>Never correct, critique, or challenge colleagues publicly. Find private, face-preserving ways to address concerns.</p>" },
            { front: "Build slowly and sustain", back: "<p>Trust is earned through repeated, reliable presence over time — not a single meeting. Invest in the relationship before the transaction.</p>" }
          ] },
          { type: "knowledgeCheck", id: "cq-arab-1-check", question: "Why is it particularly important to avoid public criticism when working with colleagues from Arab cultural contexts?", options: [{ text: "They are more emotionally fragile than other cultures", correct: false }, { text: "Public dishonor in honor cultures can permanently damage relationships and violate core cultural values", correct: true }, { text: "Arab cultures prefer written feedback to verbal feedback", correct: false }, { text: "Public settings make communication less clear", correct: false }], feedbackCorrect: "Honor culture means that personal and family reputation are central values. Public criticism — even when well-intentioned — can be experienced as profound dishonor that damages trust irreparably. Private, face-preserving approaches are essential.", feedbackIncorrect: "Look again at the cluster’s key dimensions — Honor culture means that personal and family reputation are central values. Public criticism — even when well-intentioned — can be experienced as profound dishonor that damages trust irreparably. Private, face-preserving approaches are essential." },
        ],
      },
      {
        id: "cq-arab-2",
        number: 2,
        title: "Confirming a plan instead of assuming one",
        summary: "A warm, general answer to a scheduling question is not the same as a confirmed plan. Asking a direct, respectful follow-up question — with any colleague, regardless of background — gets a real answer sooner than guessing what was meant.",
        minutes: 10,
        learning: {
          objective: "Respond to a warm but general answer by asking a direct, respectful follow-up question that confirms the actual plan, rather than assuming what the person meant.",
          takeaways: [
            "A relationship-first, high-context communication style — one of the dimensions introduced in Lesson 1 — can produce a warm, general answer that leaves a specific commitment unclear.",
            "The accurate response is never to decode a particular word or phrase as a hidden signal — a religious phrase most of all should never be treated as a coded business signal — but to ask a direct, respectful follow-up question.",
            "This practice works the same way with anyone, regardless of background: confirm specifics directly and closer to the date, rather than assuming either a firm yes or a hidden no.",
          ],
          evidence: "A scenario decision about a general response to a scheduling request, and a knowledge check on confirming a specific commitment directly.",
          appliedNextStep: "The next time a colleague gives a warm, general answer to a request, ask one direct, respectful follow-up question to confirm the specific plan before relying on it.",
        },
        scenario: {
          context: "You ask Layla, a partner-agency colleague, whether her office can join a joint training session next Thursday. She responds warmly, \"We'll do our best to make it work.\" You mark the session as confirmed on your calendar. On Wednesday, Layla lets you know her office cannot attend after all.",
          prompt: "What is the most accurate way to understand what happened?",
          options: [
            { label: "Layla changed her mind at the last minute and should have committed clearly the first time.", response: "This assumes a change of heart, when a warm, general answer was never a specific commitment in the first place." },
            { label: "A warm, general answer like \"we'll do our best\" is not the same as a confirmed plan; a direct, respectful follow-up question closer to the date would have surfaced the real answer sooner.", response: "This is accurate for any colleague, in any communication style: a general answer calls for a direct follow-up question, not an assumption in either direction.", recommended: true },
            { label: "Stop scheduling joint sessions with Layla's office since they cannot be relied on to attend.", response: "This treats an honest, warm answer as unreliability, when the real gap was never confirming a specific commitment in the first place." },
          ],
        },
        transfer: {
          prompt: "Recall a recent warm but general answer you treated as a firm plan. What direct, respectful follow-up question would have confirmed it sooner?",
          options: ["Write the exact phrase used and what you assumed it meant", "Draft a direct follow-up question you could ask a few days before the date, not the day before", "Decide one upcoming plan where you will confirm directly rather than assume"],
        },
        blocks: [
          { type: "text", heading: "A warm answer is not always a specific commitment", body: "<p>In a relationship-first, high-context communication style — documented as a pattern in this cluster's indirect, face-protecting communication (see Lesson 1) — a warm, general response can stand in for a direct one when a firm answer might feel abrupt or risk straining the relationship. The same pattern shows up across many cultures and communication styles, and any individual person may be more direct or more indirect than the general pattern suggests.</p><p>The fix is never to decode a specific word or phrase — especially a religious expression — as a coded business signal. People who share a language, region, or cultural cluster hold many different beliefs, and a phrase's religious or personal meaning should never be reinterpreted as a hidden yes or no. Instead, ask a direct, respectful, specific question: \"To help me plan, should I count on Thursday, or would it help to check back midweek?\"</p><p>As with every pattern in this course, this describes a documented tendency in communication research, not a script for any one person. The pattern tells you what to listen for; a specific, respectful question tells you what is actually true.</p>" },
          { type: "list", heading: "Signals worth a direct, respectful follow-up", items: ["A warm, general answer offered in place of a specific yes or no", "Goodwill in the response with no specific commitment to a time or action", "A repeated general answer across more than one request, suggesting a real, unstated obstacle", "Confirmation that arrives very close to the date rather than well in advance"] },
          { type: "leaderMove", heading: "Confirm closer to the date, respectfully and directly", control: "You control when and how you check a general answer. A respectful, specific question asked a few days before the date, not the day before, gives room for an honest answer.", failure: "Do not treat any specific word or phrase — especially a religious one — as a coded signal, and do not build a firm schedule around a general answer without checking again.", next: "For your next request with a general answer, schedule one respectful check-in a few days ahead of the actual date." },
          { type: "tabs", heading: "Same answer, two approaches", tabs: [
            { label: "Assume it's confirmed", body: "<p>\"She said we'll do our best, so it's basically confirmed. I'll assume Thursday is set.\"</p>" },
            { label: "Confirm directly", body: "<p>\"That's a general answer, not a specific one. I'll check in respectfully a few days ahead to confirm the actual plan.\"</p>" },
          ] },
          { type: "knowledgeCheck", id: "cq-arab-2-check", question: "A colleague responds to a scheduling request with a warm, general answer like, \"We'll do our best to make it work.\" What is the most accurate next step?", options: [{ text: "Mark the plan as fully confirmed and build the schedule around it.", correct: false }, { text: "Recognize the answer is general rather than specific, and confirm directly and respectfully closer to the date.", correct: true }, { text: "Decode the specific wording used as a hidden signal for what the colleague really means.", correct: false }], feedbackCorrect: "Right. A respectful, specific confirmation closer to the date resolves the ambiguity without decoding any particular phrase or assuming unreliability.", feedbackIncorrect: "Consider what a general, warm answer actually confirms, and what kind of follow-up gets you a specific answer." },
        ],
      },
      {
        id: "cq-arab-3",
        number: 3,
        title: "Serving a client who offers hospitality you cannot fully accept",
        summary: "Hospitality as a sacred obligation means an offered gift or meal is not a bribe attempt; declining it carelessly can damage trust. Navigating policy limits respectfully takes more care than a flat refusal.",
        minutes: 10,
        learning: {
          objective: "Respond to a client connected to the Arab cluster who offers a gift or hospitality during a home visit in a way that honors the relational meaning of the offer while staying within program policy, without assuming every client will make such an offer.",
          takeaways: [
            "Hospitality is documented as a sacred obligation in this cluster; an offered meal, tea, or small gift during a home visit is typically an expression of welcome and relationship, not an attempt to influence a decision.",
            "A flat, unexplained refusal of hospitality can be experienced as a relational insult; a caseworker can decline what policy does not allow while still accepting what it does, and explaining why warmly.",
            "Any individual client's practice may differ, and hospitality should never be assumed or expected; the skill is responding well when it is offered, not requesting or anticipating it.",
          ],
          evidence: "A service-delivery scenario about a client offering tea and a small gift during a home visit, and a knowledge check on honoring hospitality within policy limits.",
          appliedNextStep: "Before your next home visit, review your program's gift policy so you can explain it warmly and specifically if hospitality is offered, rather than declining abruptly.",
        },
        scenario: {
          context: "During a home visit, a client, Hana, offers you tea and pastries, and also tries to send you home with a small wrapped gift as a thank-you for your help. Program policy allows accepting light refreshments during a visit but prohibits accepting gifts of any value.",
          prompt: "What is the most respectful and appropriate way to handle this?",
          options: [
            { label: "Politely decline both the tea and the gift to avoid any appearance of favoritism.", response: "Declining the tea as well treats an act of welcome, which policy allows, the same as a gift policy does not allow, and can read as a rejection of Hana's hospitality itself." },
            { label: "Accept the tea and pastries warmly, and decline the gift specifically, explaining clearly that program rules do not allow accepting gifts so that every client is treated the same way, while thanking her for the thought.", response: "This distinguishes what policy allows from what it does not, honors the relational meaning of the hospitality that can be accepted, and explains the limit warmly and specifically rather than as a blanket refusal.", recommended: true },
            { label: "Accept the gift privately since refusing it would be more disrespectful than the minor policy violation.", response: "This sets aside a policy that exists to protect every client's equal treatment, based on an assumption about what would offend rather than a clear, respectful explanation." },
          ],
        },
        transfer: {
          prompt: "Think about your program's policy on accepting refreshments or gifts. Could you explain the exact line, warmly and specifically, if hospitality were offered during your next visit?",
          options: ["Write the specific policy line you would need to explain", "Draft a warm, specific way to decline a gift while accepting an offer of refreshment", "Decide how you would document the interaction if hospitality was offered and how you responded"],
        },
        blocks: [
          { type: "text", heading: "An offer of hospitality is relationship, not leverage", body: "<p>Generosity toward guests is documented as a sacred obligation across the Arab cluster, not a courtesy that depends on the occasion. A client who offers tea, food, or a small gift during a home visit is very likely expressing welcome and honoring the caseworker's presence in their home, consistent with a deeply held cultural and often religious value, not attempting to influence a decision.</p><p>A caseworker bound by policy against accepting gifts still has room to respond well: accepting a light refreshment where policy allows it honors the relational meaning of the offer, while declining an actual gift can be done warmly and specifically, naming the policy reason so it reads as a rule applied equally to everyone rather than a personal rejection of the client's generosity.</p><p>This does not mean every client connected to this cluster will offer hospitality, and a caseworker should never expect, request, or hint that an offer would be welcome. The skill is responding gracefully when it happens, not anticipating it as a given.</p>" },
          { type: "list", heading: "Responding well within policy", items: ["Know your program's specific line between allowed refreshments and prohibited gifts before a visit, not during one", "Accept what policy allows, warmly and without hesitation", "Decline what policy does not allow specifically and warmly, naming the reason as a rule applied to every client equally", "Document the interaction accurately if a gift was offered and declined, as your program requires"] },
          { type: "accordion", heading: "Two ways this can go wrong", items: [
            { title: "Declining all hospitality by default", body: "<p>Refusing even allowed refreshments to avoid any appearance issue can read as a rejection of the client's welcome itself, damaging trust unnecessarily.</p>" },
            { title: "Accepting a gift to avoid discomfort", body: "<p>Setting aside a real policy limit to avoid an awkward moment undermines the equal treatment the policy exists to protect — the opposite failure.</p>" },
          ] },
          { type: "quote", text: "I did not offer the tea to get anything from her. I offered it because she was a guest in my home and that is simply what you do. She explained the gift rule kindly, and I understood completely.", cite: "Composite client perspective, illustrative" },
          { type: "knowledgeCheck", id: "cq-arab-3-check", question: "A client connected to the Arab cluster offers tea and a small gift during a home visit, and program policy allows refreshments but not gifts. What is the most respectful response?", options: [{ text: "Decline both the tea and the gift to avoid any appearance of favoritism.", correct: false }, { text: "Accept the tea warmly and decline the gift specifically, explaining the policy applies equally to every client.", correct: true }, { text: "Accept the gift quietly rather than risk seeming to reject the client's generosity.", correct: false }], feedbackCorrect: "Right. Accepting what policy allows and declining what it does not, with a warm and specific explanation, honors the hospitality while respecting equal treatment.", feedbackIncorrect: "Consider both failure modes: refusing all hospitality by default, and accepting a gift policy does not allow." },
        ],
      },
      {
        id: "cq-arab-4",
        number: 4,
        title: "Building observance-aware scheduling into team practice",
        summary: "A team can build prayer times, fasting periods, and other religious observances into its standard scheduling practice for colleagues and clients of any background, without asking anyone to hide or explain their own practice.",
        minutes: 10,
        learning: {
          objective: "Adapt a team's meeting scheduling practice to account for prayer times and other religious observance, for colleagues of any background, as a structural, standing habit rather than a case-by-case accommodation requested each time.",
          takeaways: [
            "Some colleagues and clients, across many backgrounds, observe prayer times, fasting periods, or other religious practices; inclusive scheduling asks about constraints directly rather than assuming any group's religion.",
            "A structural scheduling habit — such as checking a shared calendar of religious and cultural observances and asking about scheduling constraints before setting a recurring time — removes the need for a colleague to request an adjustment every time.",
            "This is not a requirement that every colleague adopt the same practice; colleagues who do not observe these rhythms are not asked to change anything about their own schedule.",
          ],
          evidence: "A leadership scenario about redesigning a team's default meeting scheduling habits, and a knowledge check on structural versus case-by-case fixes.",
          appliedNextStep: "Add a step to your team's scheduling practice — a shared reference of religious and cultural observances and a habit of asking about scheduling constraints — before booking recurring meetings.",
        },
        scenario: {
          context: "A team lead schedules a recurring weekly meeting at a time that regularly falls during a prayer window for two team members, who have each individually asked, on separate occasions, to shift the time slightly. The lead has accommodated each request individually but keeps defaulting back to the original time for new meetings.",
          prompt: "What is the best way to fix this going forward?",
          options: [
            { label: "Continue shifting the time whenever a team member raises it, since the current approach has been responsive so far.", response: "This keeps the burden of noticing and requesting the adjustment on the same individuals, meeting after meeting, rather than fixing the underlying default." },
            { label: "Build a standing scheduling habit: check common prayer windows and major religious observances before setting any recurring meeting time, for the whole team, going forward.", response: "This is a structural fix that removes the need for anyone to ask again, and applies to how the team schedules everything, not just this one recurring meeting.", recommended: true },
            { label: "Ask the two team members to submit their prayer schedule in writing so it can be referenced for future meetings.", response: "This puts the documentation burden on the individuals affected, rather than building a general scheduling habit the team lead owns." },
          ],
        },
        transfer: {
          prompt: "Look at your team's current scheduling habits. Where could checking for common prayer windows or observances become a standing step, rather than a request someone has to make?",
          options: ["Name one recurring meeting where this check could be added before the next scheduling cycle", "Identify where your team could keep a shared reference of major observances", "Decide who owns checking this before new recurring meetings are set"],
        },
        blocks: [
          { type: "text", heading: "A repeated individual request is a sign the default needs to change", body: "<p>When the same colleagues have to ask, more than once, for a meeting time to move around a prayer window, the problem is not that they asked; it is that the team's default scheduling habit was never built to ask about constraints in the first place. Some colleagues and clients, across many backgrounds, observe prayer times, fasting periods, or other religious practices — this is true well beyond any one cluster or region — and inclusive scheduling asks about those constraints directly rather than assuming any group's religion.</p><p>The structural fix is to move the check upstream: before setting any recurring meeting time, the person scheduling it checks a shared reference of major observances and asks whether the time works, the same way they would check a public holiday calendar. This removes the recurring burden from the individuals affected and prevents the same accommodation from having to be requested again for every new meeting.</p><p>This is a scheduling habit for the person setting meetings, not a requirement placed on colleagues who do not observe these rhythms, and it never assumes which religion, if any, a specific colleague or client practices. Nobody is asked to adopt a practice that is not their own, or to disclose one they would rather keep private; the team simply stops defaulting to a schedule that assumes no one needs to ask.</p>" },
          { type: "list", heading: "What the structural habit includes", items: ["Checking common prayer windows before setting a new recurring meeting time", "Keeping a shared, simple reference of major religious observances relevant to the team", "Applying the check by default, for every new meeting, not only after someone has already had to ask", "Making no assumptions about who observes what — the check simply avoids common windows generally, and adjusts further at any individual's specific request"] },
          { type: "leaderMove", heading: "Move the check upstream, before the request", control: "You control when the check for prayer windows and observances happens: before scheduling, as a habit, or after a complaint, as a repeated favor.", failure: "Do not rely on colleagues to keep requesting the same adjustment, and do not require them to justify or document their practice to get it.", next: "Before your next round of recurring meeting scheduling, check common prayer windows and observances as a standing step." },
          { type: "sorting", id: "cq-arab-4-sort", heading: "Structural habit or repeated individual request?", categories: ["Structural habit", "Repeated individual request"], items: [
            { text: "Checking common prayer windows before setting any new recurring meeting", category: "Structural habit" },
            { text: "Waiting for a colleague to ask again each time a new meeting is scheduled", category: "Repeated individual request" },
            { text: "Keeping a shared reference of major observances the whole team can consult", category: "Structural habit" },
            { text: "Requiring a colleague to submit their prayer schedule in writing to be accommodated", category: "Repeated individual request" },
          ] },
          { type: "flashcards", heading: "Scheduling without repeated requests", cards: [
            { front: "What moves the fix upstream?", back: "<p>Checking prayer windows and observances before scheduling, as a standing habit, rather than after someone asks.</p>" },
            { front: "Who does the structural habit apply to?", back: "<p>The person scheduling meetings, for every recurring meeting, regardless of who is on the team that cycle.</p>" },
            { front: "Does this ask non-observing colleagues to change anything?", back: "<p>No. It only changes when the person scheduling checks a shared reference before setting a time.</p>" },
          ] },
          { type: "knowledgeCheck", id: "cq-arab-4-check", question: "Two team members keep having to individually request a meeting time shift around a prayer window. What is the best structural fix?", options: [{ text: "Keep accommodating each individual request as it comes in.", correct: false }, { text: "Build a standing habit of checking common prayer windows and observances before scheduling any new recurring meeting.", correct: true }, { text: "Ask the two team members to document their prayer schedule for future reference.", correct: false }], feedbackCorrect: "Right. Moving the check upstream, as a standing habit for whoever schedules meetings, removes the need for repeated individual requests.", feedbackIncorrect: "Look for the option that changes the scheduling process itself, rather than continuing to rely on individuals to ask each time." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Arab: quick reference",
    subtitle: "A one-page reminder for working with colleagues and partners connected to the Arab cluster",
    quote: "Honor culture means that personal and family reputation are central values. Public criticism — even when well-intentioned — can be experienced as profound dishonor that damages trust irreparably. Private, face-preserving approaches are essential.",
    use: {
      purpose: "Keep the Arab cluster’s key patterns and suggestive practices ready for your next cross-cultural interaction.",
      remember: ["Collectivism: Very high — family, tribe, and community before self", "Power distance: High — hierarchy, age, and religious authority respected", "Communication: High context — indirect, face-protecting, honor-aware", "Honor and reputation: Central — personal and family reputation shapes decisions", "Hospitality: Sacred obligation — generosity toward guests is a core value"],
      doNext: "Apply one suggestive practice from this module in your next relevant interaction.",
    },
    sections: [
      { heading: "Suggestive practices", items: ["Learn the Islamic calendar \— Know when Ramadan, Eid al-Fitr, and Eid al-Adha fall. Proactively adjust deadlines and don't schedule major asks during sacred observance.", "Accept hospitality fully \— Refusing offered tea, food, or welcome is a relational insult. Accept warmly, even if briefly. The offer is the relationship.", "Protect honor in feedback \— Never correct, critique, or challenge colleagues publicly. Find private, face-preserving ways to address concerns.", "Build slowly and sustain \— Trust is earned through repeated, reliable presence over time — not a single meeting. Invest in the relationship before the transaction."] },
      { heading: "Before you assume", items: ["Clusters describe broad patterns, not individual people.", "Use this module as a starting point for curiosity, never as a conclusion about a specific person.", "When in doubt, ask the person directly about their own preferences and context."] },
    ],
  },
  sources: [
    { title: "Livermore, D. (2013). Expand Your Borders: Discover Ten Cultural Clusters. Cultural Intelligence Center.", href: "https://culturalq.com", note: "Source for the cluster framework and its key cultural dimensions. This module's scenarios and practices are program-authored composites, not Livermore's case material." },
  ],
};

export default pack;
