import type { CoursePack } from "../../source-types";

// Cultural Intelligence curriculum, module 7: Confucian Asia — The Harmony and Order Cluster.
// Based on: Livermore, D. (2013). Expand Your Borders: Discover Ten Cultural Clusters. Cultural Intelligence Center.
const pack: CoursePack = {
  course: {
    id: "cq-confucian-asia",
    indexNumber: 1135,
    seriesLabel: "Cultural Intelligence \u00b7 Expand Your Borders",
    title: "Confucian Asia: The Harmony and Order Cluster",
    subtitle: "Confucian Asia is shaped by centuries of philosophical tradition emphasizing harmony, hierarchy, collective well-being, and long-term thinking.",
    scope: "For all DHS staff. One of ten modules in the Expand Your Borders cross-cultural intelligence curriculum. Clusters describe broad patterns, not individual people — use them as starting points for curiosity, never as endpoints for judgment about any one person.",
    treatment: "Four lessons with scenarios, reflection questions, suggestive practices, and knowledge checks",
    duration: "45\u201350 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/stock-people-07.jpg",
    coverAlt: "A colleague considers a question thoughtfully during a meeting.",
    introTranscript: "Confucian Asia is shaped by centuries of philosophical tradition emphasizing harmony, hierarchy, collective well-being, and long-term thinking. \"Face\" — one's social reputation and honor — governs interaction. Direct confrontation is avoided to preserve relationships. Silence is meaningful. Indirect communication requires careful listening. Loyalty flows through social structures: family, company, nation. This cluster scores among the highest globally on performance orientation and long-term planning.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Describe the core cultural dimensions of the Confucian Asia cluster and how they shape communication and decision-making.",
        "Respond to a realistic cross-cultural scenario in a way that reads the situation accurately rather than through your own cultural default.",
        "Apply at least one suggestive practice from this module in a real cross-cultural interaction.",
      ],
      evidence: [
        "A worked scenario decision with an explanation of why it fits the cluster's cultural patterns.",
        "One knowledge check on this cluster's most distinctive cultural dimension.",
      ],
      appliedNextStep: "Practice one suggestive behavior from this module in your next interaction with a colleague or partner connected to the Confucian Asia cluster.",
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
        id: "cq-confucian-asia-1",
        number: 1,
        title: "Confucian Asia",
        summary: "The Harmony and Order Cluster. Confucian Asia is shaped by centuries of philosophical tradition emphasizing harmony, hierarchy, collective well-being, and long-term thinking",
        minutes: 20,
        learning: {
          objective: "Describe the Confucian Asia cluster’s core cultural dimensions and respond accurately to a realistic cross-cultural scenario.",
          takeaways: [
            "Power distance: High — hierarchy accepted and expected",
            "Collectivism: High — in-group and family loyalty is paramount",
            "Communication: High context — indirect, face-preserving, silence-rich",
            "Time orientation: Long-term — strategic patience; planning for generations",
            "Performance: Very high — achievement and excellence are core values"
          ],
          evidence: "A worked scenario decision, a set of reflection questions, and a knowledge check.",
          appliedNextStep: "Choose one suggestive practice from this module and apply it in your next relevant interaction.",
        },
        scenario: {
          context: "In a team meeting, you ask your colleague Ji-ho if he thinks the product launch timeline is realistic. He says, \"Yes, it can be done.\" Later you learn he had serious reservations but did not voice them to preserve group harmony. The launch is delayed.",
          prompt: "How do you respond?",
          options: [
        { label: "Tell Ji-ho that you need him to be more direct in the future — the team can't afford this kind of miscommunication.", response: "This puts the burden entirely on Ji-ho to change, rather than examining whether the question itself was structured in a way he could safely answer honestly." },
        { label: "Recognize that asking yes/no questions in group settings puts high-context communicators in an impossible position — and redesign how you seek input.", response: "This is the accurate reading. The barrier was structural — a public yes/no question — and redesigning how input is gathered removes it for everyone, not just Ji-ho.", recommended: true },
        { label: "Schedule a post-mortem and address the culture of indirect communication as a project risk.", response: "Useful for the record, but framing indirect communication itself as \"the risk\" misses the chance to change how input is actually gathered next time." }
          ],
        },
        transfer: {
          prompt: "\"Face\" — social honor and reputation — is a structural value, not just individual sensitivity. How might protecting someone's face lead to better outcomes than exposing their uncertainty publicly?",
          options: ["Confucian cultures plan for generations. How does your planning horizon compare? What might change if you thought in twenty-year arcs?", "Silence in conversation often signals thought and respect in Confucian cultures, not disengagement. When have you rushed to fill silence — and what might you have missed?", "Name one colleague or partner connected to this cluster and one question you would ask privately rather than assume an answer"],
        },
        blocks: [
          { type: "text", heading: "Cluster overview", body: "<p>Confucian Asia is shaped by centuries of philosophical tradition emphasizing harmony, hierarchy, collective well-being, and long-term thinking. \"Face\" — one's social reputation and honor — governs interaction. Direct confrontation is avoided to preserve relationships. Silence is meaningful. Indirect communication requires careful listening. Loyalty flows through social structures: family, company, nation. This cluster scores among the highest globally on performance orientation and long-term planning.</p><p><strong>Region:</strong> China, Hong Kong, Japan, Singapore, South Korea, Taiwan</p>" },
          { type: "list", heading: "Key cultural dimensions", items: ["Power distance: High — hierarchy accepted and expected", "Collectivism: High — in-group and family loyalty is paramount", "Communication: High context — indirect, face-preserving, silence-rich", "Time orientation: Long-term — strategic patience; planning for generations", "Performance: Very high — achievement and excellence are core values"] },
          { type: "list", heading: "Reflect", ordered: true, items: ["\"Face\" — social honor and reputation — is a structural value, not just individual sensitivity. How might protecting someone's face lead to better outcomes than exposing their uncertainty publicly?", "Confucian cultures plan for generations. How does your planning horizon compare? What might change if you thought in twenty-year arcs?", "Silence in conversation often signals thought and respect in Confucian cultures, not disengagement. When have you rushed to fill silence — and what might you have missed?"] },
          { type: "flashcards", heading: "Suggestive practices", cards: [
            { front: "Ask privately before publicly", back: "<p>Seek honest input in one-on-one conversations before group settings. Remove the face-threat of public contradiction.</p>" },
            { front: "Interpret silence as engagement", back: "<p>Don't rush to fill pauses. In Confucian contexts, silence often means someone is thinking carefully — it's a sign of respect.</p>" },
            { front: "Respect hierarchy in protocol", back: "<p>Address senior people first, use formal titles, and present business cards with both hands. These are signals of relational intelligence.</p>" },
            { front: "Think long", back: "<p>Bring long-term perspective to partnerships. Demonstrate that you're invested in a sustained relationship, not just a quick transaction.</p>" }
          ] },
          { type: "knowledgeCheck", id: "cq-confucian-asia-1-check", question: "Why might a Confucian Asian colleague agree with a plan they actually have doubts about?", options: [{ text: "They lack the confidence to disagree", correct: false }, { text: "Preserving group harmony and avoiding face-loss often outweighs individual dissent", correct: true }, { text: "They don't fully understand the plan", correct: false }, { text: "They are being strategically passive", correct: false }], feedbackCorrect: "Preserving \"face\" — social honor — and group harmony are deeply structural values. Public contradiction risks embarrassing others and oneself, so agreement is often chosen to maintain relational integrity.", feedbackIncorrect: "Look again at the cluster’s key dimensions — Preserving \"face\" — social honor — and group harmony are deeply structural values. Public contradiction risks embarrassing others and oneself, so agreement is often chosen to maintain relational integrity." },
        ],
      },
      {
        id: "cq-confucian-asia-2",
        number: 2,
        title: "Reading silence and hedged language accurately",
        summary: "A pause before answering, or a soft \"that might be difficult,\" often carries a clear signal in this cluster's documented communication style. Misreading it as confusion or as agreement causes real problems, and it is never a guarantee about a specific colleague.",
        minutes: 10,
        learning: {
          objective: "Read a colleague's silence and hedged phrasing accurately as likely communication signals from this cluster's documented style, while still confirming meaning directly rather than assuming it.",
          takeaways: [
            "In this cluster's high-context style, a pause before answering often signals careful thought or discomfort with a question, not confusion or a lack of an answer.",
            "\"That might be difficult\" or \"we will consider it\" frequently function as a soft no in this style; treating them as an open maybe can lead to real surprise later.",
            "Because any specific colleague may communicate more directly or less formally than the cluster pattern, the safest move is still to ask a clarifying, face-preserving question rather than guess.",
          ],
          evidence: "A scenario decision about a hedged response in a planning meeting, and a knowledge check distinguishing hedged language from an open answer.",
          appliedNextStep: "The next time a colleague responds with a pause or a soft qualifier, ask one private, face-preserving follow-up question before treating the answer as settled.",
        },
        scenario: {
          context: "You propose a new documentation requirement in a meeting with your partner agency's team. Wei-Lin, the team lead, pauses for several seconds, then says, \"That could be a bit difficult on our end, but we will look into it.\" You move forward assuming the requirement is basically agreed to. Two weeks later, nothing has changed and no one has raised a concern.",
          prompt: "What is the most accurate reading of what happened?",
          options: [
            { label: "Wei-Lin's team is simply slow to implement changes and needs a follow-up reminder.", response: "This assumes the delay is about pace rather than about what the original answer actually meant." },
            { label: "\"That could be a bit difficult, but we will look into it\" was very likely a soft no; a private follow-up at the time, asking specifically what would make it workable, would have surfaced the real concern.", response: "This reads the hedge accurately and points to the actual fix: a direct but face-preserving question asked closer to the original conversation.", recommended: true },
            { label: "Wei-Lin agreed to the requirement and is simply behind schedule; escalate to their supervisor for accountability.", response: "This treats a likely soft no as a broken commitment, which risks damaging the relationship over a misread rather than a real failure." },
          ],
        },
        transfer: {
          prompt: "Recall a recent hedged or paused response from a colleague. What private, specific follow-up question would have told you what they actually meant?",
          options: ["Write the exact phrase they used and what you assumed it meant at the time", "Draft one private follow-up question aimed at the real obstacle, not just re-asking for agreement", "Decide when in the conversation you will ask it next time, rather than after the deadline passes"],
        },
        blocks: [
          { type: "text", heading: "Hedges are often information, not indecision", body: "<p>Direct, low-context communication treats a pause as a gap and a qualifier like \"it might be difficult\" as an open question still being weighed. In the high-context communication style documented across the Confucian Asia cluster, both often carry a clearer meaning: the pause signals careful, respectful consideration, and the qualifier is frequently a polite way of declining or flagging a real problem without a blunt public no, which would risk causing someone to lose face.</p><p>Treating a hedge as an open maybe, or worse, as agreement, sets up a later moment where the real answer becomes unavoidable, usually as a missed deadline or an unspoken standoff. The better move is to notice the hedge in the moment and follow up privately and specifically: not \"are you sure?\" which reopens the face-threat, but a concrete question about what would make the idea workable.</p><p>This is a documented pattern in cross-cultural research, not a formula for any one person's meaning. Some colleagues connected to this cluster are quite direct, especially in professional settings shaped by other influences. The pattern tells you what to listen for; the person in front of you tells you what it actually means.</p>" },
          { type: "list", heading: "Common hedges and what they often signal", items: ["\"That could be a bit difficult\" — frequently a soft no", "\"We will consider it\" or \"we will look into it\" — often means no without saying so directly", "A pause before answering — usually careful thought, not confusion", "Agreement paired with no follow-up questions — sometimes a sign the real reaction has not been voiced yet"] },
          { type: "leaderMove", heading: "Follow up privately, specifically, and soon", control: "You control when and how you check a hedge. A private, specific question asked soon after the meeting preserves face far better than a public re-ask weeks later.", failure: "Do not treat silence or a soft qualifier as agreement, and do not publicly press someone to clarify in front of the group that heard the original hedge.", next: "After your next meeting with a hedge in it, send one private, specific question within a day, not a general check-in weeks later." },
          { type: "tabs", heading: "Same phrase, two readings", tabs: [
            { label: "Surface reading", body: "<p>\"They said they'd look into it, so it's basically agreed. I'll follow up if I don't hear back.\"</p>" },
            { label: "Accurate reading", body: "<p>\"That phrasing is likely a soft no. I'll ask privately and specifically what would make this workable, before I build a plan around an agreement that may not exist.\"</p>" },
          ] },
          { type: "knowledgeCheck", id: "cq-confucian-asia-2-check", question: "A colleague connected to the Confucian Asia cluster responds to a proposal with a pause and then, \"That could be a bit difficult, but we'll look into it.\" What is the most accurate next step?", options: [{ text: "Proceed as though the proposal is agreed to, since no direct no was given.", correct: false }, { text: "Recognize this phrasing as a likely soft no, and ask a private, specific follow-up question soon after.", correct: true }, { text: "Publicly ask them in the next meeting to give a clear yes or no.", correct: false }], feedbackCorrect: "Right. The hedge is likely information, not indecision, and a private, specific, timely question is the way to confirm it without causing a face-threat.", feedbackIncorrect: "Consider what a pause and a soft qualifier often signal in this cluster's documented style, and what kind of follow-up preserves face while still getting a real answer." },
        ],
      },
      {
        id: "cq-confucian-asia-3",
        number: 3,
        title: "Serving a client who defers rather than raises a concern",
        summary: "A client who agrees readily with a caseworker's plan and does not raise concerns may be following a documented respect-for-authority pattern, not confirming the plan actually fits their life. Any individual client may feel differently.",
        minutes: 10,
        learning: {
          objective: "Serve a client connected to the Confucian Asia cluster who defers to a caseworker's authority in a way that actively checks for unspoken concerns, rather than treating quick agreement as informed consent.",
          takeaways: [
            "High power distance and face-preservation are documented patterns that can make it uncomfortable for a client to question a caseworker's plan directly, even when they have real concerns.",
            "Quick, agreeable responses from a client are not proof the plan fits; a caseworker who wants informed consent needs to create low-pressure, private ways for concerns to surface.",
            "When a client needs language support, offer a qualified interpreter at no cost rather than relying on a family member to translate, and never a child. The family member is welcome to stay as support; the interpreter is what makes a private question possible.",
            "This is never a reason to assume a specific client is hiding something or to withhold information; it is a reason to ask more carefully and give more room.",
          ],
          evidence: "A service-delivery scenario about a home-care plan presented while a family member offers to translate, and a knowledge check on confirming genuine informed consent.",
          appliedNextStep: "In your next plan review with a client from any background, add one private, specific question aimed at surfacing a concern before you finalize anything.",
        },
        scenario: {
          context: "You present a home-care plan to Mr. Han, an older client who prefers to speak in his first language. His adult daughter has come with him and offers to translate so the meeting can move along. Mr. Han nods and agrees to every element quickly, without questions. Later, a home visit reveals he has not been using two of the approved services, and it turns out he was uncomfortable with a male aide entering certain rooms of his home, but never said so.",
          prompt: "What is the most accurate and respectful way to have handled the original plan review?",
          options: [
            { label: "Let the daughter translate so the meeting moves quickly, and accept the quick agreement from both of them as informed consent.", response: "This leaves Mr. Han without a qualified interpreter and routes his consent through a family member. A concern like the one about a male aide is exactly the kind of thing a person may not want to say through his own daughter, and a documented respect-for-authority pattern can make questioning the caseworker harder still." },
            { label: "Welcome the daughter to stay as support, arrange a qualified interpreter (by phone or video if none is on site) and present the plan through the interpreter, then ask Mr. Han privately, with the interpreter's help and away from the meeting's momentum, whether any part of the plan raises a concern he has not mentioned, and offer a private or written way to flag it later.", response: "This is the accurate and respectful path. A qualified interpreter gives Mr. Han his own voice in the conversation, his daughter's presence stays welcome as support, and a private, lower-pressure check makes room for a real concern to surface without assuming he has none.", recommended: true },
            { label: "Ask the daughter directly whether her father actually agrees, since she can speak more freely.", response: "This routes the client's own consent through a family member by default, which can override the client's own voice rather than protect it, and it still leaves him without a qualified interpreter." },
          ],
        },
        transfer: {
          prompt: "Think of a recent plan or decision a client agreed to quickly. What private, low-pressure question could you add to check whether the agreement was fully informed?",
          options: ["Write the exact private question you would ask, separate from the group conversation", "Note one way to make it comfortable for a concern to surface after the meeting, such as a follow-up call or written option", "If the client needs language support, note whether a qualified interpreter was offered or whether a family member was translating, and what you would change", "Decide how you will document that you checked, without turning it into an interrogation"],
        },
        blocks: [
          { type: "text", heading: "Agreement is not the same as fit", body: "<p>The high power distance and face-preservation patterns documented across the Confucian Asia cluster can make a caseworker's authority feel like something not to be questioned directly, especially in a formal meeting with family present. A client shaped by this pattern may agree quickly and completely, not because the plan fits every part of their life, but because voicing a concern in that setting risks discomfort for everyone in the room.</p><p>This does not mean the client has no preferences or no voice. It means the setting in which the plan was presented may not have been one where those preferences could safely surface. Serving the client well means building a separate, lower-pressure opportunity for concerns to be raised: a private moment, a follow-up call, a written option, or simply a specific, gentle question asked away from the group.</p><p>Language access is part of this. When a client needs an interpreter, offer a qualified interpreter at no cost to the client rather than relying on a family member to translate, and never a child. This is a language-access requirement for public programs, not a courtesy. A family member who translates is placed in the middle of the client's own decisions, and a client may hold back a concern, like discomfort with a male aide, precisely because a daughter or son would have to be the one to say it. The family member is welcome to stay as support. The interpreter is there so that the client's words, and any private question you ask, are his own.</p><p>Any individual client, including any client connected to this cluster, may be entirely comfortable raising concerns directly and immediately. The pattern is a reason to build in an extra check, not a reason to assume silence means either full agreement or hidden reluctance.</p>" },
          { type: "list", heading: "Ways to create room for a concern to surface", items: ["Ask a private, specific question separate from the group conversation, such as, \"Is there any part of this that would be hard for you personally?\"", "Offer a follow-up call or written option a day or two after the meeting, once the pressure of the room has passed", "Offer a qualified interpreter when the client needs one, by phone or video if none is on site, rather than relying on a family member to translate, and never a child; welcome the family member to stay as support", "Avoid routing the client's consent through a family member by default", "Watch for a gap between quick verbal agreement and actual use of approved services, and treat it as a signal to check back in"] },
          { type: "accordion", heading: "Three ways this can go wrong", items: [
            { title: "Treating quick agreement as full consent", body: "<p>Finalizing a plan on the strength of an immediate yes can leave real concerns, like the one about a male aide, undiscovered until they cause a real problem.</p>" },
            { title: "Letting a family member stand in for a qualified interpreter", body: "<p>A daughter or son who translates is placed between the client and his own decision. He may leave out the one concern he would not want them to hear, and you will not know what was left out. Offer a qualified interpreter, and keep the family member's presence as support.</p>" },
            { title: "Assuming every client in this cluster is hiding something", body: "<p>Over-interpreting agreement as concealment disrespects clients who mean exactly what they say, and turns a respectful caution into a stereotype.</p>" },
          ] },
          { type: "quote", text: "I said yes to all of it because that is what you say to the person helping you. My daughter was doing the talking, and I was not going to tell her which rooms I did not want a stranger in. Nobody asked me alone, in my own language, what actually worried me. If they had, I would have told them.", cite: "Composite client perspective, illustrative" },
          { type: "knowledgeCheck", id: "cq-confucian-asia-3-check", question: "A client connected to the Confucian Asia cluster agrees quickly and fully to a service plan in a formal meeting where his adult daughter has been translating. What is the most respectful next step?", options: [{ text: "Finalize the plan, since the client and family both agreed.", correct: false }, { text: "Arrange a qualified interpreter, welcome the daughter to stay as support, and create a private, lower-pressure opportunity, separate from the family, for the client to raise any concern before finalizing.", correct: true }, { text: "Assume the client is hiding a concern and question him more firmly.", correct: false }], feedbackCorrect: "Right. A qualified interpreter gives the client his own voice, and a lower-pressure opportunity respects the documented pattern while still checking for genuine informed consent, without assuming concealment.", feedbackIncorrect: "Consider who is speaking for the client and what setting would make it safe for a real concern to surface. Avoid accepting quick agreement at face value, relying on a family member to interpret, and assuming hidden reluctance." },
        ],
      },
      {
        id: "cq-confucian-asia-4",
        number: 4,
        title: "Adapting feedback and documentation practices",
        summary: "A team can shift feedback into private channels and build in written follow-up, as a structural practice that works for everyone, without asking colleagues from this cluster to become comfortable with public correction.",
        minutes: 10,
        learning: {
          objective: "Adapt a team's feedback and documentation practice to fit the face-preservation pattern this cluster's research describes, as a structural team standard rather than a special accommodation.",
          takeaways: [
            "Public correction, even when well-intentioned, can cause a face-loss that a colleague shaped by this pattern will remember far longer than the substance of the feedback.",
            "Moving critical feedback to a private channel, and following any verbal exchange with a brief written summary, is a structural practice that improves clarity for the whole team, not just for one cluster.",
            "The goal is not to make everyone communicate identically; it is to build a standard practice that removes an unnecessary barrier for people shaped by this pattern, while still working for colleagues who prefer direct, in-the-moment feedback.",
          ],
          evidence: "A leadership scenario about redesigning a team's feedback routine, and a knowledge check on structural versus individual fixes.",
          appliedNextStep: "Move your next piece of critical feedback for anyone on your team into a private conversation followed by a brief written summary, and keep doing it as a standing practice.",
        },
        scenario: {
          context: "A supervisor is used to raising errors in the team's weekly group meeting so everyone learns from them. After doing this with Tae-yang's work in front of the team, Tae-yang becomes noticeably withdrawn in meetings for weeks, though the error itself was minor and easily fixed.",
          prompt: "What is the best way to adjust the team's feedback practice going forward?",
          options: [
            { label: "Continue giving feedback in the group meeting, since transparency helps the whole team learn from mistakes.", response: "This keeps a format that, for some team members, causes lasting relational damage disproportionate to the value of the shared learning." },
            { label: "Move individual, error-specific feedback to a private conversation for everyone on the team, and share only anonymized, general lessons in the group meeting.", response: "This is a structural change that protects everyone from public correction while preserving the shared-learning value the supervisor wanted, without singling anyone out.", recommended: true },
            { label: "Give Tae-yang feedback privately going forward, but continue giving other team members feedback in the group meeting as before.", response: "This treats the fix as a personal accommodation for one person rather than a team standard, which can itself signal Tae-yang out as different." },
          ],
        },
        transfer: {
          prompt: "Look at how your team currently delivers critical feedback. Where could a private-first, written-follow-up standard replace a public default?",
          options: ["Name the current group setting where individual feedback is given, and identify the private channel that could replace it", "Draft what a brief written follow-up summary would look like after a feedback conversation", "Decide how you would still share general, anonymized lessons with the team so learning is not lost"],
        },
        blocks: [
          { type: "text", heading: "Public correction has a cost the substance does not explain", body: "<p>A team practice of raising errors in a group setting can feel efficient and transparent to a leader shaped by direct, low-context norms. For a colleague shaped by the face-preservation pattern documented across the Confucian Asia cluster, being corrected in front of peers can cause a loss of standing that lingers well past the meeting, regardless of how minor the original error was or how gently the correction was delivered.</p><p>The fix is not to soften the content of feedback or to avoid giving it. It is to change the setting: individual, specific feedback moves to a private conversation, and a brief written summary follows so the points are not lost or reinterpreted later. General, anonymized lessons can still be shared with the whole team, preserving the shared-learning value without exposing any one person.</p><p>This becomes a genuine team standard, applied to everyone, rather than a workaround built around one colleague's discomfort. It also does not ask colleagues who are comfortable with direct, public feedback to stop offering or receiving it informally among themselves; it changes what the leader's formal practice defaults to.</p>" },
          { type: "list", heading: "What the structural practice includes", items: ["Individual, error-specific feedback happens in a private conversation, for every team member, every time", "A brief written summary follows within a day, capturing what was discussed and any next step", "General, anonymized lessons are still shared with the group so the team learns together", "The practice applies regardless of who is on the team that week, not only when someone from this cluster is present"] },
          { type: "leaderMove", heading: "Build the private-first habit into your own routine", control: "You control the setting where you deliver feedback and whether a written summary follows. That is the structural lever.", failure: "Do not single out one person for private feedback while keeping a public default for everyone else, and do not drop the shared-learning value entirely.", next: "Adopt private-first feedback with written follow-up as your standing practice for the next month, for every team member." },
          { type: "sorting", id: "cq-confucian-asia-4-sort", heading: "Structural practice or individual accommodation?", categories: ["Structural practice", "Individual accommodation"], items: [
            { text: "Private, individual feedback followed by a brief written summary, applied to every team member", category: "Structural practice" },
            { text: "Giving one colleague private feedback while others still get public correction", category: "Individual accommodation" },
            { text: "Sharing general, anonymized lessons with the whole team after private conversations", category: "Structural practice" },
            { text: "Asking one colleague to speak up more in meetings so they seem less withdrawn", category: "Individual accommodation" },
          ] },
          { type: "flashcards", heading: "Adapting without assimilation", cards: [
            { front: "What changes under the new practice?", back: "<p>Where and how feedback is delivered — privately, with written follow-up — for everyone on the team, every time.</p>" },
            { front: "What stays the same?", back: "<p>The substance and honesty of the feedback, and the team's shared learning through anonymized lessons.</p>" },
            { front: "Why is applying it to everyone important?", back: "<p>Applying a practice to only one person turns a structural fix into a label, which is exactly what the change is meant to avoid.</p>" },
          ] },
          { type: "knowledgeCheck", id: "cq-confucian-asia-4-check", question: "A supervisor wants to reduce the face-loss risk of public correction for a team member connected to the Confucian Asia cluster, without singling that person out. What is the best approach?", options: [{ text: "Give that one team member private feedback while continuing public feedback for everyone else.", correct: false }, { text: "Adopt private, individual feedback with written follow-up as a standard practice for the entire team.", correct: true }, { text: "Stop giving critical feedback in meetings altogether and rely only on informal comments.", correct: false }], feedbackCorrect: "Right. A structural practice applied to everyone protects the colleague without labeling them, and preserves honest feedback and shared learning.", feedbackIncorrect: "Look for the option that changes the team's practice for everyone, rather than singling out one person or dropping feedback altogether." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Confucian Asia: quick reference",
    subtitle: "A one-page reminder for working with colleagues and partners connected to the Confucian Asia cluster",
    quote: "Preserving \"face\" — social honor — and group harmony are deeply structural values. Public contradiction risks embarrassing others and oneself, so agreement is often chosen to maintain relational integrity.",
    use: {
      purpose: "Keep the Confucian Asia cluster’s key patterns and suggestive practices ready for your next cross-cultural interaction.",
      remember: ["Power distance: High — hierarchy accepted and expected", "Collectivism: High — in-group and family loyalty is paramount", "Communication: High context — indirect, face-preserving, silence-rich", "Time orientation: Long-term — strategic patience; planning for generations", "Performance: Very high — achievement and excellence are core values"],
      doNext: "Apply one suggestive practice from this module in your next relevant interaction.",
    },
    sections: [
      { heading: "Suggestive practices", items: ["Ask privately before publicly \— Seek honest input in one-on-one conversations before group settings. Remove the face-threat of public contradiction.", "Interpret silence as engagement \— Don't rush to fill pauses. In Confucian contexts, silence often means someone is thinking carefully — it's a sign of respect.", "Respect hierarchy in protocol \— Address senior people first, use formal titles, and present business cards with both hands. These are signals of relational intelligence.", "Think long \— Bring long-term perspective to partnerships. Demonstrate that you're invested in a sustained relationship, not just a quick transaction."] },
      { heading: "Before you assume", items: ["Clusters describe broad patterns, not individual people.", "Use this module as a starting point for curiosity, never as a conclusion about a specific person.", "When in doubt, ask the person directly about their own preferences and context."] },
    ],
  },
  sources: [
    { title: "Livermore, D. (2013). Expand Your Borders: Discover Ten Cultural Clusters. Cultural Intelligence Center.", href: "https://culturalq.com", note: "Source framework for the ten cultural clusters, their key dimensions, and this module's scenario and practice content." },
  ],
};

export default pack;
