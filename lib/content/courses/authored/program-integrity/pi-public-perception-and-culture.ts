import type { CoursePack } from "../../source-types";

// Program Integrity curriculum, module 2: Public Perception, Misperception, and the Communities We Serve.
const pack: CoursePack = {
  course: {
    id: "pi-public-perception-and-culture",
    indexNumber: 1127,
    seriesLabel: "Program Integrity",
    title: "Public Perception, Misperception, and the Communities We Serve",
    subtitle: "How a story about individual wrongdoing can turn into a story about an entire community — and why DHS staff have to actively guard against that slide.",
    scope: "For all DHS staff, especially staff whose work involves public communication, community engagement, or intercultural interaction. Builds on What Fraud Enforcement Actually Costs.",
    treatment: "Four lessons with scenarios, a sort, and a knowledge check",
    duration: "45–52 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/stock-people-12.jpg",
    coverAlt: "Two colleagues exchange a printed handout at an outdoor community event.",
    introTranscript: "When fraud is discovered inside a specific service, and the people involved happen to share a cultural, national, or linguistic background, public conversation about the fraud can quietly slide into public suspicion of that entire community. This has happened in Minnesota program integrity cases, and it can happen with any community. This course is about recognizing that slide, understanding why it violates DHS's own equity commitments, and knowing how to communicate about program integrity in a way that stays accurate to the individuals responsible without generalizing to anyone else.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Explain how individual wrongdoing can, through media coverage and public conversation, come to be misperceived as characteristic of an entire community.",
        "Identify why generalizing fraud committed by a small number of individuals to an entire community conflicts directly with DHS's equity, diversity, and inclusion commitments.",
        "Describe intercultural communication practices that keep program integrity communication accurate and avoid feeding stigma.",
        "Locate and use the program's community briefs as a safeguard against relying on assumption or stereotype when a community is mentioned in program integrity context.",
      ],
      evidence: [
        "A sort distinguishing accurate, individual-scoped statements from generalized, community-scoped ones.",
        "A worked scenario on responding to a public question that generalizes fraud to a community.",
      ],
      appliedNextStep: "The next time you hear or read a statement that links fraud to a community rather than to the specific individuals responsible, notice it, and consider how you would restate it accurately.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public reporting on Minnesota program integrity communication, checked at authoring, September 2026",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Feedback that this course reads as minimizing real fraud", "Feedback that a scenario reads as identifying or implying any specific community", "A significant public incident involving program integrity communication and community stigma"],
      relatedDoor: "Questions about a specific ongoing investigation, a specific community's concerns, or a specific communication crisis belong with communications, legal counsel, and community engagement leads, not with this course.",
      toolkitQuestion: "Am I describing what specific individuals did, or have I let that slide into describing a whole community?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "pi-perception-1",
        number: 1,
        title: "How individual wrongdoing becomes a story about a community",
        summary: "See the mechanism by which fraud committed by specific individuals gets misattributed to an entire cultural or immigrant community, and why that mechanism can take hold regardless of which community is involved.",
        minutes: 12,
        learning: {
          objective: "Describe the mechanism by which individual fraud becomes generalized to a community, and explain why any community is vulnerable to it.",
          takeaways: [
            "When people who commit fraud within a specific service happen to share a cultural, national, or linguistic background, media coverage and public conversation can drift from describing the fraud to describing the community — even when the overwhelming majority of that community had nothing to do with it.",
            "This mechanism is not particular to any one community; it can happen to any group when a high-profile case involves members of that group, and Minnesota program integrity coverage has shown it happening in more than one instance.",
            "The shift from 'these specific people committed fraud' to 'this community is associated with fraud' is where real harm to public trust and real harm to DHS's equity commitments both begin.",
          ],
          evidence: "One knowledge check on the difference between an accurate, individual-scoped fraud description and a generalized one.",
          appliedNextStep: "Practice restating one fraud-related headline or comment you've encountered so that it names the specific individuals or entities responsible, not a community.",
        },
        scenario: {
          context: "Fictional example. A news segment on a fraud case involving several providers who share a national background runs for two weeks. By the second week, a comment thread under a related article includes statements like \"you can't trust anyone from that community with public money.\"",
          prompt: "What is the most accurate way to describe what happened between week one and week two?",
          options: [
            { label: "Nothing changed; the comments simply reflect the facts of the case.", response: "The facts of the case describe specific individuals and providers. Comments generalizing to an entire community are not a restatement of those facts; they are a documented drift beyond them." },
            { label: "Public conversation slid from describing specific individuals' actions to describing an entire community, a pattern that can happen to any group once a shared trait is visible in a high-profile case.", response: "This names the mechanism accurately: a shift from individual-scoped fact to group-scoped generalization, driven by ordinary media and conversation dynamics rather than by any new evidence.", recommended: true },
            { label: "This only happens to communities that already have a reputation problem.", response: "Reporting shows this mechanism is not particular to any one community; it can happen to any group when a high-profile case involves members of that group." },
          ],
        },
        transfer: {
          prompt: "Where have you seen a fraud story drift from naming individuals to describing a community?",
          options: ["Name one headline, comment, or conversation where you noticed the shift", "Identify the specific individuals or organizations the facts actually named", "Write a one-sentence, individual-scoped restatement"],
        },
        blocks: [
          { type: "text", heading: "The slide from individual to community", body: "<p>Fraud investigations produce facts about specific people and specific businesses: who submitted false claims, who paid or received kickbacks, who billed for services never delivered. Those facts are properly reported and properly prosecuted at the individual and organizational level. But when the people involved in a fraud scheme happen to share a cultural, linguistic, or national background — as has occurred in more than one large Minnesota program integrity case — public conversation doesn't always stay at that individual level. Headlines shorten. Comment sections generalize. A story about a specific service provider or a specific set of billing schemes can, over weeks of coverage, quietly become a story that readers associate with an entire community, most of whom had no connection to the fraud at all and are themselves navigating the same public systems and often the same distrust of institutions that any community can carry.</p><p>This is not a hypothetical risk. Reporting on Minnesota's large-scale Medicaid fraud cases has documented exactly this pattern: coverage that outpaced the actual evidence, community members describing new fear and scrutiny, and advocates noting that an entire community found itself defending its reputation while also, rightly, condemning the specific wrongdoing that occurred. The mechanism does not care which community it happens to. It only requires a high-profile case, a shared identifiable trait among the specific people involved, and public conversation that does not do the work of staying precise.</p>" },
          { type: "text", heading: "Why this matters specifically for DHS staff", body: "<p>DHS staff are not usually the ones writing headlines, but staff talk to the public, to providers, to colleagues, and to each other every day, and casual language in any of those conversations can either reinforce the slide from individual to community, or interrupt it. A staff member who says \"that community has a fraud problem\" has made a factual error — fraud was committed by specific individuals and organizations, not by a community — and has also, without necessarily intending to, contributed to exactly the kind of generalization that public reporting has already shown causes real harm. A staff member who says \"specific providers and individuals committed fraud, and DHS is responding to that\" has stayed accurate and has not fed the slide.</p><p>This is a live equity issue, not an abstract one. DHS's own commitments to diversity, equity, and inclusion rest on treating people as individuals rather than as representatives of a group. Fraud enforcement that is accurate about individuals and organizations is consistent with those commitments. Public conversation, or internal staff conversation, that generalizes fraud to a community is not — regardless of which community it happens to involve, and regardless of whether real fraud actually occurred.</p>" },
          { type: "sorting", id: "pi-perception-1-sort", heading: "Sort these statements", categories: ["Accurate, individual-scoped", "Generalized to a community"], items: [
            { text: "Several providers operating a specific service were charged with submitting false claims.", category: "Accurate, individual-scoped" },
            { text: "That community has been the source of a lot of fraud lately.", category: "Generalized to a community" },
            { text: "A small number of individuals exploited gaps in a program's oversight to defraud it.", category: "Accurate, individual-scoped" },
            { text: "You can't really trust providers from that background.", category: "Generalized to a community" },
            { text: "The people responsible for this specific scheme have been charged; most providers in this service category were not involved.", category: "Accurate, individual-scoped" },
          ] },
          { type: "quote", text: "The story was about three people who did something wrong. By the third week, my neighbor asked me if 'people like us' were the reason the program got cut. I never even worked in that service.", cite: "Composite community member perspective, illustrative" },
          { type: "knowledgeCheck", id: "pi-perception-1-check", question: "Why is the claim 'this mechanism only happens to communities that already have a reputation problem' inaccurate?", options: [
            { text: "Because it is true only for communities involved in Minnesota program integrity cases specifically.", correct: false },
            { text: "Because reporting shows the individual-to-community slide can happen to any group once a shared trait is visible in a high-profile case, regardless of that group's prior reputation.", correct: true },
            { text: "Because the mechanism never actually occurs and is only a hypothetical risk.", correct: false },
          ], feedbackCorrect: "Right. The mechanism is general — it depends on a high-profile case and a shared visible trait, not on any prior reputation.", feedbackIncorrect: "Reporting on more than one Minnesota case shows this pattern is not limited to any one community's prior reputation." },
        ],
      },
      {
        id: "pi-perception-2",
        number: 2,
        title: "Communicating accurately, and using the community briefs",
        summary: "Practice intercultural communication that stays accurate under pressure, and learn how the program's community briefs function as a safeguard against assumption.",
        minutes: 13,
        learning: {
          objective: "Respond accurately to a public question that generalizes fraud to a community, and explain how the community briefs function as a safeguard against relying on assumption.",
          takeaways: [
            "An accurate response to a generalizing question corrects the premise without commenting on the specifics of any case, and without repeating or validating the generalization.",
            "The program's community briefs exist precisely so that, if a community is ever relevant to a conversation, staff have an accurate, respectful reference instead of relying on assumption, stereotype, or whatever they've absorbed from news coverage.",
            "Because the community briefs cover many of Minnesota's communities on equal terms, using them signals that no single community is being treated as an exception or a special case of concern.",
          ],
          evidence: "A worked scenario on responding to a generalizing public question; a review of what the community briefs are for.",
          appliedNextStep: "Locate the program's community briefs and read one you haven't read before, so you have it as a reference before a program integrity conversation ever requires it.",
        },
        scenario: {
          context: "Fictional example. During a public meeting, a community member asks a DHS staff member: \"Isn't it true that most of the fraud in this program came from one particular community? Shouldn't people from that community get extra scrutiny before they're approved as providers?\"",
          prompt: "What is the most accurate and appropriate response?",
          options: [
            { label: "\"That's a fair point — extra scrutiny for that community would probably help catch more fraud.\"", response: "This validates a generalization that isn't supported by how fraud actually works — fraud is committed by specific individuals and organizations, not predicted by someone's community membership. Extra scrutiny based on identity, rather than on actual risk factors, is also inconsistent with DHS's equity commitments and likely unlawful." },
            { label: "\"I can't discuss that.\"", response: "This isn't inaccurate, but it misses the chance to actually correct a factually wrong and harmful premise. Declining to engage leaves the generalization unchallenged." },
            { label: "\"I can't speak to any specific case — that's for our communications office and the program office responsible for this service, and being charged with something isn't the same as being found responsible for it. What I can tell you is that provider screening applies the same risk-based standards to every applicant, regardless of background, and that's what keeps it fair and effective.\"", response: "This declines to comment on any specific investigation or prosecution, corrects the mistaken idea that a charge equals guilt, routes case-specific questions to the offices responsible for them, and still answers the real, legitimate question about the standard DHS applies — all without being defensive or dismissive of the person's underlying concern about fraud.", recommended: true },
          ],
        },
        transfer: {
          prompt: "Where might you need this three-part response, in a public meeting or in an ordinary workplace conversation?",
          options: ["Name one setting where a generalizing question or comment could come up", "Practice the three parts: what's known, what's not true, what standard applies", "Identify which community brief you would check first if you needed background"],
        },
        blocks: [
          { type: "text", heading: "What to say when a question generalizes", body: "<p>Questions like the one in this lesson's scenario are not rare, and they usually come from a real, legitimate concern about fraud, mixed with a factually incorrect premise about who commits it. The useful move is not to dismiss the concern about fraud — that concern deserves a real answer — but to separate it clearly from the incorrect premise, without commenting on the specifics of any investigation or prosecution. Being charged is a legal step, not a finding of responsibility, and questions about a specific case belong with the communications office and the program office responsible for that service, not with whichever staff member happens to be asked. What any staff member can say is the standard itself: provider screening and program integrity review apply risk-based standards evenly, and scrutiny based on someone's community membership rather than actual risk factors would be both inaccurate and inconsistent with how these programs are supposed to work.</p><p>This same discipline applies in ordinary workplace conversation, not just public meetings. If a colleague generalizes a fraud story to a community in a hallway conversation or a team meeting, the same correction applies: don't speak for or about any specific case, and note that most people connected to that service, program, or community were not involved at all.</p>" },
          { type: "text", heading: "Why the community briefs exist, and how they help here", body: "<p>The program maintains community briefs covering many of Minnesota's cultural, linguistic, and immigrant communities, published on the program's own <a href=\"/minnesota-communities\">Minnesota communities</a> page. Each brief is written to help staff understand a community's context, history, and common concerns with genuine respect, not as a checklist and not as a source of suspicion. In ordinary work, these briefs support things like language access planning, culturally responsive outreach, and understanding a community's relationship with public institutions. Tribal Nations are not one more entry on that list: Minnesota's Tribal Nations are sovereign governments with a government-to-government relationship with the state, not a cultural community like the others the briefs cover. Content and decisions involving Native American individuals, communities, or Tribal Nations defer to the Office of Indian Affairs and to the DHS offices that handle Tribal relations, rather than being finished inside this program.</p><p>In a program integrity context, the briefs that do exist serve an additional, important purpose: they are a standing reminder that DHS engages with every community it profiles on the same respectful terms, regardless of whether that community has ever been mentioned in connection with a fraud case. If a staff member ever finds themselves needing background on a community for legitimate reasons — planning outreach, understanding a service gap, preparing for a meeting — going to the community briefs, rather than to assumption or to whatever a news cycle has implied, keeps that engagement accurate. For anything involving a Tribal Nation, the right next step is contacting the Office of Indian Affairs or the DHS Tribal relations offices directly, not treating a community brief as the reference.</p>" },
          { type: "leaderMove", heading: "Correct the premise, not just decline the question", control: "You control whether a generalizing question gets a real, factual correction or gets deflected and left unchallenged.", failure: "Do not validate identity-based scrutiny as a reasonable response to fraud, and do not simply refuse to engage with the underlying concern about fraud.", next: "The next time you hear a generalization about fraud and a community, in public or internally, practice the same three-part response: what the individuals actually did, that most people were not involved, and why the standard applied is risk-based, not identity-based." },
          { type: "flashcards", heading: "Three-part response to a generalizing question", cards: [
            { front: "Decline to comment on the case", back: "<p>Any specific investigation or prosecution is for the communications office and the program office responsible for that service — and a charge is not the same as being found responsible.</p>" },
            { front: "Name what's not true", back: "<p>Most people connected to that service, program, or community were not involved, and identity is not evidence of wrongdoing.</p>" },
            { front: "Name the actual standard", back: "<p>Program integrity review applies risk-based standards evenly to every provider and applicant, which is what keeps it both fair and effective.</p>" },
          ] },
          { type: "knowledgeCheck", id: "pi-perception-2-check", question: "What makes the recommended response to a generalizing public question effective?", options: [
            { text: "It avoids the topic entirely so no one is offended.", correct: false },
            { text: "It declines to comment on the specific case, corrects the mistaken idea that a charge equals guilt, routes case questions to the offices responsible for them, and still affirms the actual risk-based standard, without dismissing the underlying concern about fraud.", correct: true },
            { text: "It agrees that extra scrutiny for one community would probably help.", correct: false },
          ], feedbackCorrect: "Right. It stays factual, respectful of the real concern about fraud, and accurate about the standard DHS applies — without commenting on anyone's specific case.", feedbackIncorrect: "The best response declines to comment on the specific case, corrects the premise, and explains the actual standard, rather than deflecting or validating the generalization." },
        ],
      },
      {
        id: "pi-perception-3",
        number: 3,
        title: "Writing and reviewing communication before it goes out",
        summary: "Learn to review a draft communication, a talking point, or a social post for generalization risk before it reaches the public, using a short checklist rather than instinct alone.",
        minutes: 12,
        learning: {
          objective: "Review a draft piece of program integrity communication for generalization risk, and revise it so responsibility stays scoped to the individuals or organizations involved.",
          takeaways: [
            "Generalization risk is easiest to catch and fix before a communication is published, not after; a short checklist applied at the draft stage catches most of it.",
            "The riskiest phrases are often the shortest ones: a headline, a subject line, or a one-sentence summary compresses detail in a way that can accidentally shift the subject from named individuals to an unnamed group.",
            "A second reader, especially one not close to the drafting, catches generalization risk more reliably than the original author reviewing their own work.",
          ],
          evidence: "A scenario reviewing a draft social media post for generalization risk, and a checklist for pre-publication review.",
          appliedNextStep: "The next time you draft or review any program integrity communication, run it through the checklist in this lesson before it is sent or posted.",
        },
        scenario: {
          context: "Fictional example. A draft social media post about a recently resolved fraud case reads: \"State cracks down on fraud in [service type], one of the largest cases involving [named community] providers to date.\" The post is scheduled to go out in one hour.",
          prompt: "What is the most useful edit before this post goes out?",
          options: [
            { label: "Post it as written; the community reference is factually accurate background about who was involved.", response: "Naming a shared community trait in a headline-style post, even if factually present in the case, invites readers to generalize the fraud to the whole community rather than to the specific individuals charged." },
            { label: "Remove all identifying detail and post only \"State cracks down on fraud,\" with no other information.", response: "This avoids the generalization risk but also removes the substance the public has a legitimate interest in, such as the service type and scale of the case." },
            { label: "Revise to name the service type and scale of the case without naming any community, for example: \"State resolves one of its largest fraud cases in [service type], recovering funds from the specific providers involved.\"", response: "This keeps the substantive, legitimate public information and removes the detail most likely to trigger generalization to a community that was not itself the subject of the case.", recommended: true },
          ],
        },
        transfer: {
          prompt: "Where do you draft or review communication that could carry generalization risk?",
          options: ["Name one type of communication you draft, review, or approve", "Identify the shortest, most compressed part of it, such as a headline or subject line", "Apply the checklist to the next one before it goes out"],
        },
        blocks: [
          { type: "text", heading: "Catch it at the draft stage", body: "<p>Generalization risk is far easier to prevent than to correct after publication. Once a post, a headline, or a talking point is out, a correction rarely reaches everyone who saw the original, and the correction itself can draw more attention to the generalization than the original piece did. The practical response is to build a short review step into the drafting process itself, applied before anything goes out, rather than relying on the original author to catch their own drift.</p><p>The riskiest spots are usually the shortest ones. A full article or a complete internal memo has room to stay precise. A headline, a subject line, a one-sentence summary for a supervisor, or a social post has to compress, and compression is exactly where a community reference can substitute for a longer, more accurate description of who was actually involved.</p>" },
          { type: "list", heading: "A short pre-publication checklist", items: ["Does the headline or first sentence name individuals or organizations, or does it name a group?", "If a community, nationality, or shared trait is mentioned, is it necessary to the point being made, or could the sentence work without it?", "Would this sentence read the same way if the people involved had a different background?", "Has someone other than the original drafter reviewed it specifically for this risk?"] },
          { type: "leaderMove", heading: "Build in a second reader for this specific risk", control: "You control whether a draft goes out after one person's review or after a second reader has checked it specifically for generalization risk.", failure: "Do not rely on the original drafter to catch their own generalization risk; familiarity with a draft makes this exact kind of drift harder to see.", next: "Add one line to your team's communication review process: a second reader checks specifically for whether the language stays scoped to individuals and organizations." },
          { type: "flashcards", heading: "Where generalization risk hides", cards: [
            { front: "Headlines and subject lines", back: "<p>The most compressed part of any communication, and the most likely place a community reference substitutes for a longer, accurate description.</p>" },
            { front: "Talking points", back: "<p>Written for speed in a live conversation, which can shortcut the individual-scoped detail a fuller answer would include.</p>" },
            { front: "Social posts", back: "<p>Short by design, shared widely, and rarely followed by everyone who saw the original if a correction is needed later.</p>" },
          ] },
          { type: "knowledgeCheck", id: "pi-perception-3-check", question: "Why is a pre-publication checklist more effective than correcting a generalization after it is published?", options: [
            { text: "Because corrections are against agency policy.", correct: false },
            { text: "Because a published generalization rarely reaches everyone who saw the original once corrected, so preventing it at the draft stage is more reliable than fixing it afterward.", correct: true },
            { text: "Because published communication cannot legally be corrected.", correct: false },
          ], feedbackCorrect: "Right. Prevention at the draft stage is more reliable than after-the-fact correction, which rarely reaches the full original audience.", feedbackIncorrect: "Think about what happens to a correction once something is already published and shared: it does not reliably reach everyone who saw the original." },
        ],
      },
      {
        id: "pi-perception-4",
        number: 4,
        title: "Your commitment: reading one brief and using the habit",
        summary: "Commit to reading a community brief you have not yet read, and to using the accurate-restatement habit in a specific, upcoming situation.",
        minutes: 13,
        learning: {
          objective: "Identify a specific community brief to read and a specific upcoming situation where you will apply accurate, individual-scoped language.",
          takeaways: [
            "Reading a community brief before you need it, rather than after a program integrity question puts you on the spot, is what makes it a usable resource instead of a document you know exists but have never opened.",
            "The habit of restating fraud accurately at the individual level gets easier with practice in low-stakes settings, before it is needed in a high-stakes one like a public meeting.",
            "A commitment that names a specific brief, a specific situation, and a specific colleague who will ask about it is far more likely to happen than a general intention to 'be more careful.'",
          ],
          evidence: "A scenario choosing between a vague and a specific commitment, and a written commitment naming a brief and a situation.",
          appliedNextStep: "Read one community brief you have not read before this week, and use the accurate-restatement habit the next time a fraud-related conversation comes up.",
        },
        scenario: {
          context: "Fictional example. At the end of a training session, a facilitator asks each participant to state one commitment related to this course.",
          prompt: "Which commitment is most likely to actually happen?",
          options: [
            { label: "\"I'll try to be more careful about how I talk about fraud and communities going forward.\"", response: "This is a genuine intention, but it names no specific brief, no specific situation, and no one who will ask about it, which makes it easy to forget by the following week." },
            { label: "\"I'll read the community brief for a group I don't know well by Friday, and the next time fraud comes up in a team conversation, I'll practice the three-part response, and I'll tell my supervisor what I noticed.\"", response: "This names a specific brief, a specific practice opportunity, and a specific person who will follow up, which is what turns an intention into something that actually happens.", recommended: true },
            { label: "\"I already do this well, so I don't need a specific commitment.\"", response: "Even staff who already communicate carefully benefit from a concrete, renewed commitment; the habit weakens without practice, and everyone has a next brief they have not yet read." },
          ],
        },
        transfer: {
          prompt: "Which community brief will you read, and where will you practice the restatement habit?",
          options: ["Name the specific community brief you will read this week", "Name the specific upcoming conversation or meeting where you will practice", "Name the colleague or supervisor who will ask what you found"],
        },
        blocks: [
          { type: "text", heading: "Specific beats general, every time", body: "<p>A commitment to \"be more careful\" rarely survives a busy week. A commitment that names a specific document, a specific upcoming moment, and a specific person who will check in is far more durable, because each of those three things creates a small amount of accountability that a vague intention does not. This course closes the same way the first lesson opened: with the reminder that the mechanism this course describes can happen to any community, which means the safeguard has to be something you actually use, not something you know about in the abstract.</p><p>Reading a community brief before a program integrity conversation ever requires it means you are not learning about a community for the first time under pressure, in a public meeting, with a generalizing question already on the table. It means you already have an accurate, respectful reference in hand, and can reach for it the way you would reach for any other resource you know well.</p>" },
          { type: "list", heading: "Before you close this course", items: ["Pick one community brief you have not read, and set a specific day to read it this week.", "Pick one upcoming meeting, conversation, or piece of communication where the restatement habit might come up.", "Name the colleague or supervisor who will ask you what you found or how it went.", "Write both down somewhere you will actually see them again."] },
          { type: "leaderMove", heading: "Turn today's intention into next week's habit", control: "You control whether this course's commitment becomes a specific, dated action or a general intention that fades by next week.", failure: "Do not close this course with only a feeling of having learned something. Name the brief, the situation, and the person who will ask.", next: "Send yourself, or the colleague you named, a short note today with the specific brief and the specific situation you committed to." },
          { type: "knowledgeCheck", id: "pi-perception-4-check", question: "Why does naming a specific brief, situation, and follow-up person make a commitment more likely to happen than a general intention?", options: [
            { text: "Because it satisfies a training requirement.", correct: false },
            { text: "Because each specific element creates a small piece of accountability that a vague intention to 'be more careful' does not provide.", correct: true },
            { text: "Because general intentions are against agency policy.", correct: false },
          ], feedbackCorrect: "Right. Specificity and a named follow-up person are what turn an intention into an action that actually happens.", feedbackIncorrect: "Think about what makes any commitment durable: something specific enough to act on, and someone who will actually ask about it." },
          { type: "statement", body: "Commitment: “The community brief I will read this week is… The situation where I will practice accurate, individual-scoped language is… The person who will ask me how it went is…” Write it now." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Staying accurate under pressure",
    subtitle: "A one-page reminder for public-facing and intercultural communication about program integrity",
    quote: "Fraud is committed by specific people. It is never committed by a community.",
    use: {
      purpose: "Keep program integrity communication accurate at the individual level, and interrupt the slide toward generalizing fraud to any community.",
      remember: ["Individual wrongdoing can become misperceived as characteristic of a community through ordinary media and conversation dynamics — this can happen to any community.", "Generalizing fraud to a community conflicts directly with DHS's equity, diversity, and inclusion commitments.", "The community briefs exist so staff have an accurate, respectful reference for any community, on equal terms, instead of relying on assumption.", "A three-part response — what's actually known, what's not true, what standard actually applies — keeps a hard conversation accurate.", "Generalization risk is easiest to catch at the draft stage, especially in headlines, subject lines, and short posts.", "A commitment that names a specific brief, situation, and follow-up person is far more durable than a general intention."],
      doNext: "Read one community brief you haven't read before, so it's a resource you already know before you need it.",
    },
    sections: [
      { heading: "Before repeating a fraud-related generalization, ask", items: ["Am I describing specific individuals and organizations, or have I let that slide into describing a group?", "Would I say this the same way if the people involved had a different background?", "Is there a community brief or other real resource I should check before saying anything further?"] },
      { heading: "Before a communication goes out", items: ["Does the headline or first sentence name individuals and organizations, or a group?", "Is a community reference necessary, or could the sentence work without it?", "Has a second reader checked it specifically for this risk?"] },
      { heading: "What this course does not do", items: ["It does not name, identify, or describe any specific community in connection with fraud.", "It does not minimize the real harm fraud causes.", "It does not replace communications or legal guidance during an actual public communication situation."] },
    ],
  },
  sources: [
    { title: "Sahan Journal, reporting on Minnesota fraud-prevention legislation and community impact", href: "https://sahanjournal.com/", note: "Nonprofit newsroom covering Minnesota's immigrant and communities of color, including provider and advocate perspectives on fraud enforcement's effects on legitimate services." },
    { title: "U.S. Department of Health and Human Services, Office for Civil Rights", href: "https://www.hhs.gov/civil-rights/", note: "Federal civil rights protections against discrimination in health and human services programs, relevant to identity-based versus risk-based program integrity practice." },
  ],
};

export default pack;
