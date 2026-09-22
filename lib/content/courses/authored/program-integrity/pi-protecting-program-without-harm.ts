import type { CoursePack } from "../../source-types";

// Program Integrity curriculum, module 3: Protecting the Program Without Becoming the Harm.
const pack: CoursePack = {
  course: {
    id: "pi-protecting-program-without-harm",
    indexNumber: 1128,
    seriesLabel: "Program Integrity",
    title: "Protecting the Program Without Becoming the Harm",
    subtitle: "Practical habits for any DHS staff member whose work touches program integrity communication, review, or the people affected by it.",
    scope: "For all DHS staff who communicate with the public, supervise others who do, or whose work intersects with program integrity actions. Builds on the first two courses in this series.",
    treatment: "Four lessons with scenarios and knowledge checks",
    duration: "45–52 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/stock-people-13.jpg",
    coverAlt: "Three colleagues sit at a conference table reviewing printed documents together.",
    introTranscript: "The first two courses in this series established two things: fraud enforcement has real costs beyond the fraud itself, and public conversation about fraud can slide into generalizing about a community. This course is about what to actually do with that understanding — concrete habits for communication, for noticing bias risk in how scrutiny gets applied, and for using the Equity Analysis Toolkit when a program integrity decision affects real people.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Apply the Equity Analysis Toolkit's stages to a program integrity communication decision.",
        "Identify where bias risk can enter program integrity review through patterns rather than intentions, and name a concrete safeguard.",
        "Draft a program integrity notice or explanation that is accurate, non-alarming, and non-dismissive.",
      ],
      evidence: [
        "A worked scenario applying the toolkit's stages to a real-shaped situation.",
        "One knowledge check on where bias risk hides in review patterns.",
      ],
      appliedNextStep: "Take one program integrity communication your team sends or could send, and check it against the four elements this course describes: what's happening, what stays the same, what's still open, and who to contact.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public reporting and DHS practice, checked at authoring, September 2026",
      lastReviewed: "At authoring",
      nextReview: "When the Equity Analysis Toolkit is revised, or when DHS updates its program integrity communication standards",
      updateTriggers: ["A revision to the DHS Equity Analysis Toolkit", "A change to DHS's program integrity communication standards", "Feedback that a scenario or example needs correction"],
      relatedDoor: "This course covers general communication and awareness practice. It does not replace the official equity analysis toolkit process for an actual policy decision, program integrity's own investigative procedures, or legal review of any specific action.",
      toolkitQuestion: "If this decision is necessary, can it also be carried out in a way that treats the person affected with respect?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "pi-protect-1",
        number: 1,
        title: "Running a program integrity moment through the toolkit",
        summary: "Apply the Equity Analysis Toolkit's five stages to a realistic program integrity communication decision.",
        minutes: 12,
        learning: {
          objective: "Apply at least three of the toolkit's five stages to a program integrity scenario.",
          takeaways: [
            "The toolkit's five stages — describe the decision, consider who may be affected, compare approaches, plan participation, and review — apply to how a program integrity action is communicated, not only to policy decisions.",
            "Naming a program integrity action precisely — a routine review, not an accusation — is itself an equity practice, because imprecise language causes disproportionate fear for people with fewer alternatives and less trust in institutions to begin with.",
            "Planning how affected people can ask questions, before a notice goes out rather than only after, changes how the same necessary action lands.",
          ],
          evidence: "A worked scenario walking through the toolkit's stages.",
          appliedNextStep: "Take a real or upcoming program integrity communication and run it through the toolkit's first two stages before it goes out.",
        },
        scenario: {
          context: "Fictional example. A provider serving a small, rural community with few alternative providers nearby is flagged for a routine claims review as part of a broader, category-wide program integrity action. Several of that provider's clients have limited English proficiency. A standard, generic review notice is about to go out to every client on file.",
          prompt: "Using the toolkit's stages, what should the team do before sending that notice?",
          options: [
            { label: "Send the standard notice to everyone on file; the review is routine and the same letter works for every provider.", response: "This skips \"consider who may be affected.\" A rural community with few alternatives and language access needs experiences the same letter very differently than a client with several nearby options and no language barrier." },
            { label: "Describe the decision accurately (a routine claims review, not an accusation), consider who is affected (limited alternative providers, language access needs), compare approaches (a translated notice with a named local contact versus the generic mailing), and plan how affected clients can ask questions before the letter goes out.", response: "This runs the actual toolkit stages: naming the decision accurately, taking the specific community's circumstances seriously, comparing a real alternative, and building in a way to ask questions before anyone is alarmed by a form letter.", recommended: true },
            { label: "Delay the review because clients might be upset.", response: "The toolkit doesn't ask program integrity to stop doing its job — it asks for the review and the communication about it to be done well. Delaying a legitimate review isn't equity, it's avoidance." },
          ],
        },
        transfer: {
          prompt: "Which of your own team's communications could use the toolkit's first two stages before it goes out?",
          options: ["Name one review, hold, or audit notice your team sends or could send", "Identify who it affects differently and what a generic version misses for them", "Write one sentence naming the action accurately, without inflating or minimizing it"],
        },
        blocks: [
          { type: "text", heading: "The same five stages, a program integrity decision", body: "<p>The Equity Analysis Toolkit's five stages were built for policy and budget decisions, but they apply just as directly to how a program integrity action gets communicated and carried out. <strong>Describe the decision</strong> means naming, precisely, what is actually happening: a claims review is not an accusation, a revalidation is not a service termination, and conflating them causes fear that isn't warranted by the facts. <strong>Consider who may be affected</strong> means asking whether the people connected to a provider have real alternatives, language needs, or circumstances that change what a generic notice actually does to them. <strong>Compare approaches</strong> means treating the standard, one-size-fits-all communication as one option among several, not the only option. <strong>Plan participation</strong> means building in a real way for affected people to ask questions before or as the action happens, not just after. And <strong>review and revisit</strong> means checking afterward whether the communication actually worked.</p>" },
          { type: "flashcards", heading: "Four things a good program integrity notice says", cards: [
            { front: "What's happening", back: "<p>Name the actual action in plain language — a review, a revalidation, a hold — without inflating or minimizing it.</p>" },
            { front: "What stays the same", back: "<p>Tell people clearly what is not changing right now, so they aren't left assuming the worst about services they still have.</p>" },
            { front: "What's still open", back: "<p>Be honest about what hasn't been decided yet, rather than implying more certainty than actually exists.</p>" },
            { front: "Who to contact", back: "<p>Give a real, working way to ask a question and get an answer from a person, not just a form.</p>" },
          ] },
          { type: "list", heading: "The toolkit's five stages, applied to communication", ordered: true, items: ["Describe the decision: name precisely what is happening, without inflating or minimizing it.", "Consider who may be affected: alternatives, language needs, trust in institutions.", "Compare approaches: treat the standard notice as one option among several, not the default.", "Plan participation: build in a real way to ask questions before the action lands, not only after.", "Review and revisit: check afterward whether the communication actually worked."] },
          { type: "leaderMove", heading: "Run the first two stages before anything goes out", control: "You control whether a program integrity communication is checked against the toolkit's first two stages before it is sent, or only reviewed for accuracy.", failure: "Do not treat a factually correct notice as automatically a well-designed one. Naming the decision precisely and considering who is affected are separate checks.", next: "Add the toolkit's first two stages as a standing step before your team's next program integrity communication goes out." },
          { type: "knowledgeCheck", id: "pi-protect-1-check", question: "Why does naming a claims review as 'a routine review, not an accusation' matter, rather than being merely a wording preference?", options: [
            { text: "It doesn't matter; any wording communicates the same thing.", correct: false },
            { text: "Imprecise language that blurs a review with an accusation causes disproportionate fear, especially for people with fewer alternatives and less institutional trust to begin with.", correct: true },
            { text: "It matters only for legal reasons, not for the people receiving the notice.", correct: false },
          ], feedbackCorrect: "Right. Precise language is itself part of treating people fairly, not just a stylistic choice.", feedbackIncorrect: "Think about what happens to someone with few alternatives and little institutional trust when a routine review reads like an accusation." },
        ],
      },
      {
        id: "pi-protect-2",
        number: 2,
        title: "Where bias risk hides, and the safeguard against it",
        summary: "Learn to look for bias risk in review patterns rather than intentions, and practice the concrete safeguard available to any staff member.",
        minutes: 11,
        learning: {
          objective: "Identify where bias risk enters program integrity review through patterns, and describe a concrete safeguard any staff member can apply.",
          takeaways: [
            "Bias in program integrity review rarely announces itself as intention — it shows up in patterns of who gets flagged, reviewed, or held more often.",
            "A risk-scoring model or review process is only as fair as the data and definitions that built it; data-driven does not automatically mean bias-free.",
            "The concrete safeguard available to any staff member is noticing disaggregated patterns — does scrutiny concentrate in a particular provider type, region, or population — and asking why, rather than assuming it's coincidental.",
          ],
          evidence: "One knowledge check on the concrete safeguard against bias in review patterns.",
          appliedNextStep: "If you have visibility into any program integrity pattern in your own work, ask whether it concentrates anywhere unexpected, and raise the question with the appropriate lead rather than assuming it's coincidental.",
        },
        scenario: {
          context: "Fictional example. A staff member notices that within a risk-scoring system, providers in one rural region are flagged for review at more than twice the rate of providers elsewhere, though no one designed the model to consider region.",
          prompt: "What is the most useful next step?",
          options: [
            { label: "Assume the model is accurate; if it flags that region more, providers there are probably more likely to have issues.", response: "This treats the model's output as automatically neutral. A model can encode disparities present in its underlying data or definitions without anyone intending it to." },
            { label: "Raise the pattern with the person or team responsible for the model, asking what in the data or definitions might explain the regional concentration, before assuming it reflects real risk.", response: "This applies the actual safeguard: naming a disaggregated pattern and asking why, rather than assuming either that the model is neutral or that the region is genuinely riskier.", recommended: true },
            { label: "Say nothing, since raising it might be seen as questioning the review process.", response: "Staying silent when a pattern is visible removes the one safeguard staff outside the modeling team can actually apply." },
          ],
        },
        transfer: {
          prompt: "Where in your own work might a review or flagging pattern be worth checking?",
          options: ["Name one process where you can see who gets reviewed, flagged, or held", "Identify whether it concentrates anywhere unexpected", "Name the person you would raise the question with"],
        },
        blocks: [
          { type: "text", heading: "Where bias risk actually hides", body: "<p>Bias in program integrity review rarely announces itself as anyone's intention. It shows up in patterns: which providers get flagged more often, whether smaller providers with less compliance staff are reviewed at a different rate than larger ones, or whether communities with less institutional trust in government are more likely to have confusion read as noncompliance. Data-driven, risk-scored review is meant to reduce this kind of drift by grounding decisions in evidence rather than assumption — but a risk-scoring model is only as fair as the data and definitions that built it, and it can encode the same disparities it was meant to remove if no one checks.</p><p>The concrete safeguard available to DHS staff isn't rewriting anyone's risk model. It's disaggregating what you can see: when a service disruption or review pattern seems to concentrate in a particular provider type, region, or population, that's worth naming and asking about, not assuming is coincidental. Staff with access to program integrity data have a responsibility to look for these patterns; staff without that access still have a responsibility to raise the question when they notice something that looks like a pattern in their own work.</p>" },
          { type: "flashcards", heading: "Two ways bias risk hides", cards: [
            { front: "In who gets flagged", back: "<p>A concentration of scrutiny in one provider type, region, or population, without anyone intending it.</p>" },
            { front: "In what counts as noncompliance", back: "<p>Confusion or a language barrier read as evasion, when it is really an access gap in the process itself.</p>" },
          ] },
          { type: "leaderMove", heading: "Ask about the pattern, not just the case", control: "You control whether a single unusual case gets treated as an isolated event or as a possible signal of a broader pattern worth checking.", failure: "Do not assume a concentration of scrutiny in one place is coincidental without asking whether it's been checked. Do not treat 'the data flagged it' as the end of the question.", next: "The next time you notice a pattern in program integrity work — who gets reviewed, who gets held, who gets flagged — name it to the person responsible for that data, rather than letting it pass as background noise." },
          { type: "knowledgeCheck", id: "pi-protect-2-check", question: "What is the most concrete safeguard against bias drifting into program integrity review decisions?", options: [
            { text: "Trusting that data-driven review automatically removes bias.", correct: false },
            { text: "Looking at disaggregated patterns — which providers, regions, or populations are flagged more often — and asking why, rather than assuming it's coincidental.", correct: true },
            { text: "Reviewing every provider at exactly the same rate regardless of risk factors.", correct: false },
          ], feedbackCorrect: "Right. Data-driven review reduces some bias risk but isn't automatically fair — disaggregating patterns and asking why is the concrete check.", feedbackIncorrect: "A risk model is only as fair as what built it. The safeguard is actively checking disaggregated patterns for who gets flagged more often, not assuming the data is neutral by default." },
          { type: "list", heading: "Questions that disaggregate a pattern", items: ["Does scrutiny concentrate in one provider type, size, or region more than others?", "Does a language barrier or unfamiliarity with a process get read as noncompliance?", "Has anyone actually checked, or is 'the data flagged it' being treated as the final answer?"] },
        ],
      },
      {
        id: "pi-protect-3",
        number: 3,
        title: "Drafting the notice: a worked example",
        summary: "Draft an actual program integrity notice using the four elements from lesson one, and see how the same information lands differently depending on how it is written.",
        minutes: 12,
        learning: {
          objective: "Draft a program integrity notice that names what is happening, what stays the same, what is still open, and who to contact, and explain why each element matters to the person receiving it.",
          takeaways: [
            "The same underlying fact — a routine review is underway — can read as alarming or as manageable depending entirely on how the four elements are written, not on the facts themselves.",
            "Leaving out 'what stays the same' is one of the most common gaps in a real notice, and it is often the single line that most reduces unnecessary fear.",
            "A notice that is honest about what is still open, rather than implying more certainty than exists, holds up better if the situation changes than one that overpromises.",
          ],
          evidence: "A scenario comparing two drafts of the same notice, and a knowledge check on what a complete notice includes.",
          appliedNextStep: "Take an actual notice, letter, or message your team has sent recently and check it against the four elements; rewrite the weakest one.",
        },
        scenario: {
          context: "Fictional example. Two drafts of the same notice go to a provider selected for a routine, category-wide claims review with no payment hold attached. Draft A: \"Your claims are under review. Contact the review office with questions.\" Draft B: \"Your practice has been selected for a routine claims review as part of a category-wide effort; this is not an accusation of wrongdoing. Your current services and payments continue as normal during the review. We expect to complete this review within ninety days and will update you if that changes. If you have questions at any point, contact [named reviewer] directly at [phone/email].\"",
          prompt: "What is the most accurate assessment of the difference between the two drafts?",
          options: [
            { label: "There is no meaningful difference; both convey that a review is happening.", response: "Draft A leaves the provider uncertain whether payments are already affected, offers no timeframe, and gives only a general office rather than a named contact. The facts may be the same, but the experience of reading them is not." },
            { label: "Draft B is better because it is friendlier in tone.", response: "Tone is not the main difference. Draft B is better because it includes the four elements Draft A omits: that services continue, an expected timeframe, and a named contact." },
            { label: "Draft B is more complete because it explicitly states what stays the same, gives an expected timeframe for what is still open, and names a specific contact, while Draft A leaves all three ambiguous.", response: "This identifies the actual structural difference: Draft B includes the elements that reduce unnecessary fear and give the provider something concrete to act on.", recommended: true },
          ],
        },
        transfer: {
          prompt: "Find an actual notice your team has sent. Which of the four elements is present, and which is missing?",
          options: ["Name the notice and read it against the four elements", "Identify the weakest or missing element", "Rewrite that one element and note who could review the change"],
        },
        blocks: [
          { type: "text", heading: "The same facts, two different experiences", body: "<p>A provider or client reading a program integrity notice is not evaluating it the way a policy analyst would. They are trying to answer three urgent questions as fast as possible: is something already being taken away from me, how long does this last, and who can I actually talk to. A notice that answers all three, even briefly, produces a completely different experience than one that leaves all three open, even if the two notices describe the exact same underlying review.</p><p>This is why 'what stays the same' matters as much as 'what's happening.' A notice that only announces a review, without saying that current services and payments continue unless stated otherwise, leaves the reader to assume the worst, because the notice itself did not rule anything out.</p>" },
          { type: "tabs", heading: "The four elements, applied to one notice", tabs: [
            { label: "What's happening", body: "<p>\"Your practice has been selected for a routine claims review as part of a category-wide effort; this is not an accusation of wrongdoing.\" Names the action precisely and rules out the worst assumption immediately.</p>" },
            { label: "What stays the same", body: "<p>\"Your current services and payments continue as normal during the review.\" This single sentence does more to reduce unnecessary fear than almost anything else in the notice.</p>" },
            { label: "What's still open", body: "<p>\"We expect to complete this review within ninety days and will update you if that changes.\" Honest about the timeframe and about the possibility it could shift, without implying false certainty.</p>" },
            { label: "Who to contact", body: "<p>\"If you have questions at any point, contact [named reviewer] directly at [phone/email].\" A specific person, not just a department, makes the contact line usable.</p>" },
          ] },
          { type: "leaderMove", heading: "Read your own draft as the person receiving it", control: "You control whether a notice you draft or approve gets read once for accuracy and once for what it feels like to receive.", failure: "Do not assume a factually accurate notice is automatically a clear or reassuring one. Facts and experience are not the same test.", next: "Before your next notice goes out, read it once as the person receiving it would, and check whether all four elements are answered." },
          { type: "flashcards", heading: "What each element does for the reader", cards: [
            { front: "What's happening", back: "<p>Rules out the worst assumption immediately by naming the action precisely.</p>" },
            { front: "What stays the same", back: "<p>Often the single most fear-reducing line in the entire notice.</p>" },
            { front: "What's still open", back: "<p>Honest about the timeframe without promising more certainty than exists.</p>" },
            { front: "Who to contact", back: "<p>A named person the reader can actually reach, not just a general office.</p>" },
          ] },
          { type: "knowledgeCheck", id: "pi-protect-3-check", question: "Why does omitting 'what stays the same' from a program integrity notice matter, even if the notice is factually accurate?", options: [
            { text: "It doesn't matter, since the reader can infer that services continue unless told otherwise.", correct: false },
            { text: "Without that line, the reader has no basis to rule out the worst assumption, so an accurate notice can still produce unnecessary fear.", correct: true },
            { text: "It only matters for notices sent to providers, not to clients.", correct: false },
          ], feedbackCorrect: "Right. Accuracy alone does not prevent unnecessary fear; the reader needs to be told explicitly what is not changing.", feedbackIncorrect: "Consider what a reader assumes when a notice is silent on whether their services or payments are affected: silence does not read as reassurance." },
        ],
      },
      {
        id: "pi-protect-4",
        number: 4,
        title: "Your commitment: a check you will actually run",
        summary: "Commit to running the four-element check on one real communication and the pattern-safeguard question on one real process, with a specific date and colleague attached.",
        minutes: 12,
        learning: {
          objective: "Commit to applying the toolkit stages, the four-element notice check, or the pattern safeguard to one real, named situation in your own work.",
          takeaways: [
            "This course's three tools — the toolkit's stages, the four-element notice check, and the pattern safeguard — are only useful if applied to something real, not kept as general knowledge.",
            "Small, concrete commitments, run once and reported to a colleague, build the habit faster than a general intention to apply the training eventually.",
            "Protecting the program and respecting the person are not competing goals; a scoped, well-communicated, bias-checked review does both at once.",
          ],
          evidence: "A scenario choosing between a vague and a specific commitment, and a written commitment naming a real situation.",
          appliedNextStep: "Run one of this course's three tools on one real, current piece of your work within the next two weeks, and tell the colleague you named what happened.",
        },
        scenario: {
          context: "Fictional example. At the end of this course, a supervisor asks each staff member to name one thing they will actually do differently.",
          prompt: "Which answer is most likely to lead to a real change in practice?",
          options: [
            { label: "\"I'll keep these ideas in mind for the future.\"", response: "This names no specific action, no specific situation, and no timeframe, which makes it very unlikely to change what actually happens in practice." },
            { label: "\"Before the notice for our category review goes out next week, I'll check it against the four elements and ask my supervisor to review the 'what stays the same' line specifically.\"", response: "This names a specific communication, a specific check, a specific timeframe, and a specific colleague, which is what makes a commitment actually happen.", recommended: true },
            { label: "\"I'll wait until I'm assigned a program integrity task before applying any of this.\"", response: "Every one of the three tools in this course — the toolkit stages, the notice check, the pattern safeguard — can be applied to work already underway, not only to a newly assigned task." },
          ],
        },
        transfer: {
          prompt: "Which real, current piece of your work will you apply one of this course's tools to?",
          options: ["Name a real notice, review, or pattern you can check this week", "Name which tool you will apply: the toolkit stages, the notice check, or the pattern safeguard", "Name the colleague who will hear what you found"],
        },
        blocks: [
          { type: "text", heading: "Three tools, one habit", body: "<p>This course gave you three specific tools: the Equity Analysis Toolkit's stages applied to a communication decision, a four-element check for any notice, and a disaggregation habit for spotting bias risk in review patterns. Each one is small enough to apply in a single sitting, and each one works on something you are likely already doing, rather than requiring a new assignment to use it on. The habit this course is actually asking you to build is not memorizing all three; it is reaching for one of them the next time a real situation calls for it.</p><p>Protecting the program from fraud and respecting the people the program serves are not two goals in tension that require a trade-off. A review that is scoped to the evidence, communicated with all four elements, and checked for pattern-level bias risk protects program dollars and treats the people affected with respect, at the same time. That is what this course has been building toward across all three lessons.</p>" },
          { type: "list", heading: "Before you close this course", items: ["Name one real, current notice, review, or communication in your own work.", "Pick the tool that fits it best: toolkit stages, four-element check, or pattern safeguard.", "Set a specific date to apply it, within the next two weeks.", "Name the colleague or supervisor who will hear what you found."] },
          { type: "leaderMove", heading: "Apply it once before you file this course away", control: "You control whether this course's three tools get used on something real in the next two weeks, or filed away as ideas you learned once.", failure: "Do not let a good training end with only agreement. Name the real situation you will apply it to.", next: "Put the date and the colleague's name somewhere you will actually see them again." },
          { type: "knowledgeCheck", id: "pi-protect-4-check", question: "Why does this course treat protecting the program and respecting the person as the same goal rather than a trade-off?", options: [
            { text: "Because program integrity work should be slowed down whenever it might cause any disruption.", correct: false },
            { text: "Because a review that is scoped to the evidence, clearly communicated, and checked for pattern-level bias protects program dollars and treats affected people with respect at the same time.", correct: true },
            { text: "Because respecting the person means declining to pursue a review at all.", correct: false },
          ], feedbackCorrect: "Right. A well-scoped, well-communicated, bias-checked review serves both goals at once; they are not opposed.", feedbackIncorrect: "Think about what a scoped, clearly communicated, bias-checked review actually does for both program dollars and the people affected — it is not a trade-off between the two." },
          { type: "statement", body: "Commitment: “The real notice, review, or pattern I will check is… The tool I will apply is… The colleague who will hear what I found is… by [date].” Write it now." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Program integrity, done well",
    subtitle: "A one-page reminder for anyone communicating about or reviewing program integrity work",
    quote: "Protecting the program and respecting the person are the same job, done right.",
    use: {
      purpose: "Keep the toolkit's stages and the bias-pattern safeguard ready for the next review, notice, or program integrity question.",
      remember: ["The toolkit's five stages apply to how a program integrity action is communicated, not just to policy decisions.", "A good notice says what's happening, what stays the same, what's still open, and who to contact.", "Bias risk hides in patterns, not intentions — disaggregate who gets flagged and ask why.", "Raising a pattern you've noticed is everyone's responsibility, not only the responsibility of staff with direct data access.", "Omitting 'what stays the same' from a notice is a common gap that drives unnecessary fear even in an accurate notice.", "Protecting the program and respecting the person are the same goal when a review is scoped, communicated well, and checked for bias."],
      doNext: "Run your next program integrity communication through the toolkit's first two stages before it goes out.",
    },
    sections: [
      { heading: "Before a notice goes out, ask", items: ["Have we named the actual action accurately, without inflating or minimizing it?", "Who does this affect differently, and have we accounted for it?", "Is there a real way for someone to ask a question and get an answer from a person?", "After this goes out, how will we know if it worked?"] },
      { heading: "Read your own draft as the reader would", items: ["Have we said clearly what is not changing right now?", "Have we given an honest, specific timeframe for what's still open?", "Is the contact a named person, not just a general office?"] },
      { heading: "What this course does not replace", items: ["The official equity analysis toolkit process for an actual policy or budget decision.", "Program integrity's own investigative procedures and legal standards.", "Legal review of any specific provider action or communication."] },
    ],
  },
  sources: [
    { title: "KFF, What to Know About Recent Federal Actions Involving State Medicaid Program Integrity", href: "https://www.kff.org/medicaid/what-to-know-about-recent-federal-actions-involving-state-medicaid-program-integrity/", note: "Nonpartisan explainer on federal program integrity actions, including data-driven review approaches states are adopting." },
    { title: "Centers for Medicare & Medicaid Services, Program Integrity", href: "https://www.medicaid.gov/medicaid/program-integrity", note: "Federal guidance on Medicaid program integrity strategy, including risk-based provider screening." },
  ],
};

export default pack;
