import type { CoursePack } from "../../source-types";

// Program intercultural development continuum, stage 2 of 6: Polarization.
// The program's continuum draws on the five orientations the IDI measures (Hammer, M. R. (2011).
// The Intercultural Development Inventory. IDI, LLC.) plus Integration from Bennett, M. J. (1993).
// Developmental Model of Intercultural Sensitivity. A licensed IDI assessment does not measure Integration.
const pack: CoursePack = {
  course: {
    id: "idi-polarization",
    indexNumber: 1140,
    seriesLabel: "Intercultural Development Continuum · Stage 2 of 6",
    title: "Polarization: Us-and-Them Judgment",
    subtitle: "Polarization is where cultural difference first becomes visible — and gets sorted into better and worse, us and them, sometimes favoring one's own group (Defense) and sometimes favoring another group over one's own (Reversal).",
    scope: "For all DHS staff, whether or not they have taken the IDI, including staff examining their own orientation. This module is based on the Intercultural Development Continuum concept, not the licensed IDI instrument, and it does not assess anyone: no orientation, result, or stage is ever inferred about, recorded for, or attached to any person. It describes a developmental stage everyone can move through in either direction, not a fixed personality type.",
    treatment: "Four short lessons with scenarios, personal reflection questions, suggestive practices, and knowledge checks",
    duration: "45–50 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/stock-people-02.jpg",
    coverAlt: "Colleagues shaking hands and greeting each other on a city sidewalk.",
    introTranscript: "Polarization is the stage where cultural difference has become real and visible — and gets judged in us-versus-them terms. Defense favors one's own group as the correct or superior way; Reversal flips the same judgment the other direction, criticizing one's own group and idealizing another. Both are the same underlying orientation: judgment in either direction, rather than genuine understanding. Moving forward means noticing the judgment itself, not just picking the 'nicer-sounding' side of it.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Describe Polarization, including both its Defense and Reversal forms, as one underlying orientation.",
        "Recognize a Polarization-style ranking in a real DHS workplace scenario, including well-intentioned Reversal, without deciding what stage the person who voiced it is at.",
        "Identify one honest way to notice your own us-versus-them judgments before acting on them.",
      ],
      evidence: [
        "A worked scenario decision with an explanation of why it fits this stage.",
        "One knowledge check on the relationship between Defense and Reversal.",
      ],
      appliedNextStep: "Notice one moment this week where you judged a group's way of doing something as simply better or worse than another, and ask what you might be missing in both directions.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Hammer, M. R. (2011). The Intercultural Development Inventory. IDI, LLC.; Bennett, M. J. (1993). Developmental Model of Intercultural Sensitivity.",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Feedback that this module reads as favoring one political framing of Polarization over the other", "A revision to the licensed IDI framework's published stage descriptions"],
      relatedDoor: "This module describes a general developmental orientation from published intercultural-development research. It never assigns any specific person to a stage, and it is not a substitute for a licensed IDI assessment and a qualified debrief.",
      toolkitQuestion: "Am I noticing a real difference, or am I ranking it — in either direction?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "idi-polarization-1",
        number: 1,
        title: "Polarization",
        summary: "Us-and-Them Judgment. Polarization is where cultural difference first becomes visible — and gets sorted into better and worse",
        minutes: 20,
        learning: {
          objective: "Describe Polarization in both its Defense and Reversal forms and recognize the pattern in real workplace judgments, not in the person who made them.",
          takeaways: [
            "Cultural difference is now visible — but immediately ranked as better or worse",
            "Defense: one's own group's way is treated as the correct or superior way",
            "Reversal: the same judgment, flipped — one's own group is criticized and another idealized",
            "Both are the same underlying orientation: judgment instead of understanding",
            "Moving forward means noticing the ranking itself, not switching which side wins",
          ],
          evidence: "A worked scenario decision, a set of reflection questions, and a knowledge check.",
          appliedNextStep: "Choose one moment this week to notice a judgment you're making about a group's way of doing something, in either direction, and hold it as a question instead of a conclusion.",
        },
        scenario: {
          context: "In a team meeting, a well-meaning staff member says, \"Honestly, [a specific cultural group]'s way of making decisions as a family is just healthier than how individualistic and isolated our culture is — we could learn a lot from them.\" A colleague from that community in the room looks uncomfortable but says nothing.",
          prompt: "How do you respond?",
          options: [
            { label: "Agree enthusiastically — it's a generous, admiring thing to say about another culture.", response: "This treats Reversal as harmless because it flatters rather than demeans, but it's still a flattened, idealized judgment rather than genuine understanding — and it just put a colleague on the spot to represent an entire culture." },
            { label: "Say nothing and move the meeting along.", response: "This misses a real opportunity to name what happened and to check in with the colleague who was put in an uncomfortable position." },
            { label: "Name the generalization gently, and afterward ask the colleague privately how that moment landed for them.", response: "This is the accurate move. It treats Reversal as a real pattern worth naming — not because the comment was cruel, but because idealizing a whole culture is still a flattening judgment — and it checks in with the person actually affected.", recommended: true },
          ],
        },
        transfer: {
          prompt: "Have you ever caught yourself idealizing another culture as uniformly 'better' at something (family, community, work-life balance) in a way that flattened its real complexity? What did that idealization make it easier to avoid noticing?",
          options: ["Defense and Reversal feel like opposites, but the model treats them as the same orientation. Does that framing change how you think about either one?", "Where in your own work have you seen Defense — favoring 'how we've always done it' — operate quietly, without anyone naming it as a judgment?", "What is one comparison you have repeated often enough that you stopped noticing it was a ranking at all?"],
        },
        blocks: [
          { type: "text", heading: "Stage overview", body: "<p>Polarization is the stage where cultural difference has become real and visible — and gets judged in us-versus-them terms. Defense favors one's own group as the correct or superior way; Reversal flips the same judgment the other direction, criticizing one's own group and idealizing another. Both are the same underlying orientation: judgment in either direction, rather than genuine understanding. Moving forward means noticing the judgment itself, not just picking the 'nicer-sounding' side of it.</p><p><strong>Where it sits:</strong> Stage 2 of 6 on the continuum this program uses: Denial → Polarization → Minimization → Acceptance → Adaptation → Integration. The program's continuum draws on the five orientations the Intercultural Development Inventory measures — Denial through Adaptation — plus Integration from Bennett's developmental model; a licensed IDI assessment does not measure Integration.</p>" },
          { type: "list", heading: "Key markers of this stage", items: ["Cultural difference is now visible — but immediately ranked as better or worse", "Defense: one's own group's way treated as the correct or superior way", "Reversal: the same judgment, flipped toward idealizing another group", "Both forms are the same underlying orientation: judgment instead of understanding", "Moving forward means noticing the ranking itself, not switching which side wins"] },
          { type: "list", heading: "Reflect", ordered: true, items: ["Have you ever caught yourself idealizing another culture as uniformly 'better' at something in a way that flattened its real complexity? What did that idealization make it easier to avoid noticing?", "Defense and Reversal feel like opposites, but the model treats them as the same orientation. Does that framing change how you think about either one?", "Where in your own work have you seen Defense — favoring 'how we've always done it' — operate quietly, without anyone naming it as a judgment?"] },
          { type: "flashcards", heading: "Suggestive practices", cards: [
            { front: "Name the ranking, not just the difference", back: "<p>When you hear \"our way is better\" or \"their way is better,\" name that a ranking is happening. The content of the ranking matters less than noticing one is occurring at all.</p>" },
            { front: "Watch for well-intentioned Reversal", back: "<p>Idealizing another culture can feel respectful, but it still flattens real people into a simple, admirable stereotype. Genuine respect tolerates complexity and contradiction.</p>" },
            { front: "Check in with whoever is in the room", back: "<p>If a generalization about a group is made and someone from that group is present, a private check-in afterward matters more than a public correction in the moment.</p>" },
            { front: "Separate preference from superiority", back: "<p>You can genuinely prefer a way of doing something without it needing to be objectively superior. Preference doesn't require ranking.</p>" },
          ] },
          { type: "knowledgeCheck", id: "idi-polarization-1-check", question: "What is the relationship between Defense and Reversal in the Polarization stage?", options: [{ text: "Defense is a real developmental stage; Reversal is not part of the model", correct: false }, { text: "They are opposite stages entirely unrelated to each other", correct: false }, { text: "They are the same underlying orientation — us-versus-them judgment — pointed in different directions", correct: true }, { text: "Reversal only occurs in people who have already reached Integration", correct: false }], feedbackCorrect: "Defense and Reversal are two expressions of the same orientation: ranking cultures as better or worse. Defense favors one's own group; Reversal favors another group instead. Both replace genuine understanding with judgment.", feedbackIncorrect: "Look again at the stage's key markers — Defense and Reversal are two expressions of the same orientation, ranking cultures as better or worse, just pointed in different directions." },
        ],
      },
      {
        id: "idi-polarization-2",
        number: 2,
        title: "Noticing Polarization in a colleague or a team",
        summary: "A team can slide into Defense or Reversal without anyone naming it as judgment. How to raise the pattern without labeling the person who showed it.",
        minutes: 9,
        learning: {
          objective: "Recognize Defense and Reversal in a colleague's or team's ordinary language and raise the pattern without shaming the person.",
          takeaways: [
            "Polarization often enters team conversation in ordinary, well-meaning language — \"our approach just works better\" or \"we could learn so much from them\" — not as open hostility.",
            "Naming the ranking in the statement, rather than the character of the person who said it, keeps the conversation useful rather than defensive.",
            "A team can develop a shared Defense or shared Reversal that nobody individually intended, simply by repeating the same framing until it feels neutral.",
            "The response that helps is usually a specific question about the claim, not a general accusation about the person's fairness.",
          ],
          evidence: "A workplace scenario decision about a recurring team framing, and a knowledge check on raising it without labeling anyone.",
          appliedNextStep: "Notice one phrase your team repeats about \"how we do things\" versus \"how another group does things,\" and ask, out loud, what specific evidence sits behind it.",
        },
        scenario: {
          context: "In a planning meeting, a colleague says, \"Honestly, the way our unit runs meetings — direct, fast, get to the point — is just more professional than how some other teams do it, all that relationship talk first.\" Two other colleagues nod along; nobody has worked directly with the team being described.",
          prompt: "What is the most useful response in the moment?",
          options: [
            { label: "Say nothing; it's a minor comment about meeting style, not a real judgment about people.", response: "A ranking of \"professional\" versus not, applied to a whole team's way of relating to each other, is exactly the kind of everyday Defense that goes unexamined because it sounds like a preference." },
            { label: "Tell the colleague they are being closed-minded and need to work on their cultural competence.", response: "This labels the person rather than the claim, and is likely to produce defensiveness rather than the specific noticing that would actually help." },
            { label: "Ask what specific outcomes led to calling one style more professional, and whether the same standard would call a relationship-first approach unprofessional in a context where trust matters more than speed.", response: "This tests the ranking itself with a specific, answerable question, rather than accepting it as neutral or attacking the person who said it.", recommended: true },
          ],
        },
        transfer: {
          prompt: "What is a phrase your own team uses regularly that quietly ranks one way of working as better than another?",
          options: ["Write the phrase down as close to verbatim as you can", "Name what specific evidence, if any, actually supports the ranking", "Decide one specific, low-conflict question you could ask the next time you hear it"],
        },
        blocks: [
          { type: "text", heading: "How Polarization sounds in an ordinary meeting", body: "<p>Few people announce a ranking outright. It arrives instead as a comfortable, repeatable phrase: our way is more professional, more efficient, more honest; their way is warmer, wiser, more connected. Defense dresses itself up as a practical standard. Reversal dresses itself up as generosity. Both quietly settle a comparison that was never actually tested against evidence.</p><p>Raising this with a colleague works best as a question aimed at the claim, not a verdict aimed at the person. \"What specific outcome makes this more professional\" invites the person to look at their own reasoning. \"You sound biased\" invites them to defend themselves instead. The first can move a team. The second usually just ends the conversation.</p>" },
          { type: "list", heading: "Signs a team's language has settled into a ranking", items: ["A comparative word — better, healthier, more professional, more advanced — attached to a whole group's way of doing something.", "The comparison is repeated often enough that nobody in the room questions it anymore.", "No one making the comparison has significant direct experience with the group being ranked.", "The same standard, applied the other direction, would sound obviously unfair."] },
          { type: "flashcards", heading: "Ways to raise a ranking without labeling the person", cards: [
            { front: "Ask what specific evidence sits behind the ranking", back: "<p>\"What outcome makes it more professional\" turns a vague comparison into something that can actually be examined.</p>" },
            { front: "Flip the standard and ask if it still holds", back: "<p>Applying the same praise or criticism in the reverse direction often reveals whether a real standard is being used, or just a preference dressed as one.</p>" },
            { front: "Separate the style from the value judgment", back: "<p>\"Direct and fast\" and \"relationship-first and slower\" can both be named without either one being called more professional.</p>" },
            { front: "Keep the question aimed at the claim", back: "<p>\"What's the evidence for that\" keeps the conversation about the statement. \"You sound biased\" moves it to the person, and usually ends it.</p>" },
          ] },
          { type: "leaderMove", heading: "Test the ranking, don't diagnose the person", control: "You control whether your response targets the specific claim or the general character of the colleague who made it.", failure: "Do not respond to a ranking with a label for the person. Respond with a specific, answerable question about the claim itself.", next: "The next time you hear a comparative ranking in a meeting, ask the specific-evidence question before the meeting moves on." },
          { type: "knowledgeCheck", id: "idi-polarization-2-check", question: "A colleague repeatedly describes one team's approach as \"more professional\" than another's. What is the most useful response?", options: [{ text: "Say nothing, since it is only a comment about work style.", correct: false }, { text: "Tell the colleague they are showing bias and need to change their attitude.", correct: false }, { text: "Ask what specific outcome or evidence makes it more professional, and whether the same standard would hold if applied the other direction.", correct: true }], feedbackCorrect: "Right. Testing the specific claim invites real examination. Ignoring it lets the ranking stand; labeling the person tends to produce defensiveness instead of noticing.", feedbackIncorrect: "Consider which response tests the specific ranking with an answerable question, rather than ignoring it or naming the person's character." },
        ],
      },
      {
        id: "idi-polarization-3",
        number: 3,
        title: "Finding your own us-and-them judgments, honestly",
        summary: "A non-punitive look at where you may be ranking a group as simply better or worse, in either direction, and what to do once you notice it.",
        minutes: 9,
        learning: {
          objective: "Identify at least one specific ranking you hold about a group's way of doing something, in either Defense or Reversal form, without treating the finding as a verdict on your character.",
          takeaways: [
            "Everyone carries some real rankings, in both directions; the honest work is naming a specific one, not proving you have none.",
            "A ranking that flatters another group (Reversal) is just as much a ranking as one that favors your own (Defense), even though it feels more generous.",
            "The useful question is not \"am I judgmental\" as an identity, but \"which specific comparison have I been treating as settled without real evidence?\"",
            "Noticing your own ranking is progress, not proof that something is wrong with you.",
          ],
          evidence: "A first-person reflection scenario and a knowledge check on what an honest self-check for Polarization looks like.",
          appliedNextStep: "Write down one specific ranking you hold about a group's way of doing something, in either direction, and name one piece of evidence that would actually test it.",
        },
        scenario: {
          context: "You are completing a self-reflection for this program. It asks you to name a group whose approach to something — parenting, decision-making, conflict, time — you have privately judged as better or worse than your own. Your first instinct is to write, \"I don't really rank cultures, I just have my own preferences.\"",
          prompt: "What is the more honest next step?",
          options: [
            { label: "Accept that answer. Preferences are not the same as judgments, so there is nothing further to look for.", response: "A preference and a ranking can look identical from the inside. The test is not the word you use for it, but whether you would call the other approach worse if pressed." },
            { label: "Assume the honest answer has to be about Defense, favoring your own group, since that is the more commonly discussed direction.", response: "Reversal — idealizing another group's way as simply better — is just as real a ranking, and is often easier to miss because it feels generous rather than judgmental." },
            { label: "Name one specific comparison, in either direction, that you have treated as settled without ever really testing it, and write down what you actually based it on.", response: "This takes the reflection seriously in both directions and produces something specific enough to examine honestly.", recommended: true },
          ],
        },
        transfer: {
          prompt: "What is one comparison between your own way of doing something and another group's that you have quietly treated as settled?",
          options: ["Name the specific comparison and which direction it favors", "Write down what you actually based the ranking on: direct experience, something you read, or an impression", "Identify one way you could test whether the ranking actually holds up"],
        },
        blocks: [
          { type: "text", heading: "Both directions count", body: "<p>It is easier to notice Defense in yourself than Reversal, because Defense sounds like a judgment and Reversal sounds like admiration. \"Their way is healthier than ours\" can feel like the opposite of prejudice. But it still ranks a whole group's approach as simply better, based on limited contact, and it still flattens the real complexity and disagreement that exists inside that group as much as inside your own.</p><p>An honest self-check looks in both directions at once: where have I quietly decided my own group's way is the right one, and where have I quietly decided another group's way is the admirable one, without either judgment resting on much real evidence? Naming a specific example in either direction is more useful than a general claim to have no rankings at all.</p>" },
          { type: "list", heading: "What an honest self-check for Polarization looks like", items: ["A specific comparison, not a general claim to be neutral or unbiased.", "An honest account of how the ranking formed: direct experience, secondhand impression, or something absorbed without examination.", "A willingness to name a Reversal-direction ranking, not only a Defense-direction one.", "One concrete way to test the ranking against real evidence rather than impression."] },
          { type: "quote", text: "I would have told you I admired that team's culture more than mine. It took someone asking what I actually knew about how they handled real conflict, not just the parts I'd seen from outside, for me to notice I was ranking, not just admiring.", cite: "Composite staff perspective, illustrative" },
          { type: "flashcards", heading: "Reframes that help this land honestly", cards: [
            { front: "Admiration can still be a ranking", back: "<p>Idealizing another group's approach is Reversal, not neutrality. It deserves the same honest look as a Defense-direction judgment.</p>" },
            { front: "\"Preference\" needs a check", back: "<p>Ask yourself whether you would call the other approach worse if pressed. If the answer is yes, it was a ranking, not just a preference.</p>" },
            { front: "Specific beats general", back: "<p>\"I don't rank cultures\" finds nothing. \"I've treated this specific comparison as settled\" gives you something to actually test.</p>" },
          ] },
          { type: "knowledgeCheck", id: "idi-polarization-3-check", question: "Which self-reflection answer is most likely to actually locate a real ranking?", options: [{ text: "\"I don't really rank cultures, I just have my own preferences.\"", correct: false }, { text: "\"I've quietly treated one community's approach to family decisions as healthier than mine, without ever really testing that against direct experience.\"", correct: true }, { text: "\"I try to stay neutral about how different groups do things.\"", correct: false }], feedbackCorrect: "Right. The specific, checkable answer names an actual ranking, including a Reversal-direction one, and gives something concrete to test. The general answers are the kind of framing that lets a ranking hide.", feedbackIncorrect: "Look for the answer that names a specific comparison you have treated as settled, in either direction, rather than a general claim to be neutral." },
        ],
      },
      {
        id: "idi-polarization-4",
        number: 4,
        title: "What actually moves someone through Polarization",
        summary: "Complicating a flattened category, in either direction, is what moves Polarization forward. A practical look at what helps, for a colleague or for yourself.",
        minutes: 9,
        learning: {
          objective: "Identify a concrete practice that helps move Polarization toward genuine understanding, and apply it to a real comparison you or a colleague currently hold.",
          takeaways: [
            "What moves Polarization forward is contact with the real complexity and internal disagreement inside a group, not simply being told the ranking is wrong.",
            "A single counter-example rarely dissolves a ranking; sustained exposure to a range of real people and real disagreement within a group does more.",
            "Debate over which side is right tends to entrench a ranking further; curiosity about what the ranking is missing tends to loosen it.",
            "Movement out of Polarization is gradual, and a person can still be strongly ranking in one area while genuinely past it in another.",
          ],
          evidence: "A scenario decision about supporting a colleague's movement, and a knowledge check on what reliably helps.",
          appliedNextStep: "Identify one flattened comparison you or a colleague holds, and seek out one real example that shows genuine internal disagreement or variation within the group on the \"better\" or \"worse\" side of it.",
        },
        scenario: {
          context: "A staff member has said more than once that one community's approach to elder care is simply more admirable than the mainstream approach they grew up with. A colleague wants to help them move toward a more complicated, accurate understanding rather than either belief.",
          prompt: "Which approach is more likely to help?",
          options: [
            { label: "Argue directly that the mainstream approach has its own strengths, to balance the comparison.", response: "This turns the conversation into a debate about which side is right, which tends to entrench a ranking rather than loosen it, whichever direction it points." },
            { label: "Introduce them to two or three people from that community who openly disagree with each other about elder care, and ask what they notice.", response: "Real internal disagreement complicates a flattened, admiring category the way little else does, without turning the conversation into an argument to win.", recommended: true },
            { label: "Avoid the topic, since correcting an admiring comment risks seeming ungrateful or unkind.", response: "Avoiding a Reversal-direction ranking because it sounds generous still leaves the underlying flattening in place, and misses a real chance to help." },
          ],
        },
        transfer: {
          prompt: "What is one flattened comparison, in either direction, that you could actively complicate by seeking out real internal disagreement or variation within the group being ranked?",
          options: ["Name the comparison and which direction it currently favors", "Identify a specific way to encounter real variation or disagreement within that group, not just more praise or criticism of it", "Decide when you will actually do this, not just when you might"],
        },
        blocks: [
          { type: "text", heading: "Complication moves it, argument entrenches it", body: "<p>A ranking, in either direction, depends on treating a whole group as if it agreed with itself. Once real internal disagreement becomes visible — people from the same community who disagree sharply with each other about the very thing being praised or criticized — the flattened category stops holding together. This tends to do far more than a direct argument about which side is right, because it does not ask anyone to give up a position; it simply makes the position harder to keep in its original, simple form.</p><p>This is true whether the ranking favors one's own group or idealizes another. A colleague who believes another community's way is uniformly wiser benefits from meeting the disagreement inside that community as much as a colleague who believes their own way is uniformly better does. Neither shift comes from being told they are wrong. Both come from encountering more of the real thing.</p>" },
          { type: "list", heading: "Practices that tend to help", items: ["Seeking out real, visible disagreement within the group being ranked, rather than more praise or criticism of it as a whole.", "Asking curious questions about what a flattened category might be missing, instead of debating which side is correct.", "Treating a single counter-example as a start, not a cure — sustained exposure works better than one encounter.", "Expecting uneven progress: someone can loosen a ranking in one area while still holding one firmly in another."] },
          { type: "flashcards", heading: "For helping a colleague, or yourself", cards: [
            { front: "Real disagreement complicates a category", back: "<p>Meeting people within a group who disagree with each other does more to loosen a ranking than being told the ranking is wrong.</p>" },
            { front: "Curiosity beats debate", back: "<p>\"What might this be missing\" invites a second look. \"You're wrong about this\" invites a defense of the original position.</p>" },
            { front: "One example is a start, not a fix", back: "<p>A single counter-example can be dismissed as an exception. Sustained, varied contact is what actually shifts a ranking over time.</p>" },
            { front: "Expect unevenness", back: "<p>Progress in one comparison does not mean progress in every comparison. That is normal, not a sign the approach failed.</p>" },
          ] },
          { type: "leaderMove", heading: "Introduce complication, not correction", control: "You control whether you respond to a ranking with a counter-argument or with a real, complicating example.", failure: "Do not default to debating which side is right. Debate tends to entrench a ranking rather than loosen it.", next: "The next time you want to help someone move past a ranking, find them one real example of genuine internal disagreement within the group they are ranking." },
          { type: "knowledgeCheck", id: "idi-polarization-4-check", question: "Which approach is most consistently associated with helping someone move past a ranking, in either direction?", options: [{ text: "A direct argument for why the opposite ranking is actually correct", correct: false }, { text: "Exposure to real, visible disagreement or variation within the group being ranked", correct: true }, { text: "Avoiding the topic so the person does not feel corrected", correct: false }], feedbackCorrect: "Right. Real internal disagreement complicates a flattened category more effectively than a counter-argument, which tends to entrench the original ranking, or avoidance, which leaves it untouched.", feedbackIncorrect: "Consider which option actually complicates the flattened category, rather than arguing the opposite ranking or avoiding the topic." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Polarization: quick reference",
    subtitle: "A one-page reminder for recognizing us-versus-them judgment, in either direction, in yourself or a colleague",
    quote: "Defense and Reversal are two expressions of the same orientation: ranking cultures as better or worse. Both replace genuine understanding with judgment.",
    use: {
      purpose: "Keep this stage's markers and suggestive practices ready for your own reflection or a colleague's.",
      remember: ["Cultural difference is now visible — but immediately ranked as better or worse", "Defense favors one's own group; Reversal favors another group instead", "Both are the same underlying orientation, just pointed in different directions", "Moving forward means noticing the ranking itself, not switching which side wins"],
      doNext: "Notice one moment this week where you judged a group's way of doing something as simply better or worse than another, and ask what you might be missing in both directions.",
    },
    sections: [
      { heading: "Suggestive practices", items: ["Name the ranking, not just the difference, whenever you hear \"our way is better\" or \"their way is better.\"", "Watch for well-intentioned Reversal \— idealizing a culture still flattens real people.", "Check in privately with whoever in the room was affected by a generalization.", "Separate genuine preference from a claim of superiority."] },
      { heading: "Before you assume", items: ["This describes a developmental stage, not a fixed personality type.", "This program's continuum draws on the five orientations the IDI measures plus Integration from Bennett's developmental model; a licensed IDI assessment does not measure Integration.", "No one's placement on this continuum is ever a personnel record or a score.", "When in doubt, a licensed IDI assessment with a qualified debrief — not this module — is the actual assessment tool."] },
    ],
  },
  sources: [
    { title: "Hammer, M. R. (2011). The Intercultural Development Inventory. IDI, LLC.", href: "https://www.idiinventory.com/", note: "Source for the five orientations a licensed IDI assessment measures — Denial, Polarization, Minimization, Acceptance, and Adaptation, including this module's stage — which this program's continuum draws on. The IDI does not measure Integration." },
    { title: "Bennett, M. J. (1993). Towards Ethnorelativism: A Developmental Model of Intercultural Sensitivity.", href: "https://en.wikipedia.org/wiki/Milton_J._Bennett", note: "Foundational developmental model the IDI grew from; source for Integration, the sixth stage of this program's continuum, which a licensed IDI assessment does not measure." },
  ],
};

export default pack;
