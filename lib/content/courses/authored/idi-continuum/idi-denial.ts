import type { CoursePack } from "../../source-types";

// Program intercultural development continuum, stage 1 of 6: Denial.
// The program's continuum draws on the five orientations the IDI measures (Hammer, M. R. (2011).
// The Intercultural Development Inventory. IDI, LLC.) plus Integration from Bennett, M. J. (1993).
// Developmental Model of Intercultural Sensitivity. A licensed IDI assessment does not measure Integration.
const pack: CoursePack = {
  course: {
    id: "idi-denial",
    indexNumber: 1139,
    seriesLabel: "Intercultural Development Continuum · Stage 1 of 6",
    title: "Denial: Not Yet Noticing Cultural Difference",
    subtitle: "Denial is the starting orientation on the intercultural continuum — cultural difference is not yet real or relevant, often because someone's own world has stayed narrow enough that it never had to become visible.",
    scope: "For all DHS staff, whether or not they have taken the IDI, including and especially staff examining their own starting point on this continuum. This module is based on the Intercultural Development Continuum concept, not the licensed IDI instrument, and it does not assess anyone: no orientation, result, or stage is ever inferred about, recorded for, or attached to any person. It describes a starting orientation everyone begins somewhere on, not a diagnosis of any individual.",
    treatment: "Four short lessons with scenarios, personal reflection questions, suggestive practices, and knowledge checks",
    duration: "45–50 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/stock-people-01.jpg",
    coverAlt: "Four colleagues standing together, reviewing a document one of them is holding.",
    introTranscript: "Denial is the starting orientation on the intercultural development continuum. It is not hostility — it is more like cultural difference has not yet become real enough to notice. Someone at Denial may say \"people are people\" and mean it kindly, while genuinely not perceiving the specific differences in front of them. This often comes from a narrow range of intercultural contact, not from ill will. The way out is not guilt — it is exposure, curiosity, and beginning to notice what was previously invisible.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Describe Denial as a starting orientation on the intercultural development continuum, not a character flaw.",
        "Identify a work practice, form, or default process that quietly assumes everyone's experience is the same, and describe how it would change if it made room for real difference.",
        "Identify one honest way to begin noticing cultural difference in your own daily work.",
      ],
      evidence: [
        "A worked scenario decision with an explanation of why it fits this stage.",
        "One knowledge check on what distinguishes Denial from other stages on the continuum.",
      ],
      appliedNextStep: "Notice one moment this week where you assumed a colleague's or client's experience was 'basically the same' as your own, and ask what you might not be seeing.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Hammer, M. R. (2011). The Intercultural Development Inventory. IDI, LLC.; Bennett, M. J. (1993). Developmental Model of Intercultural Sensitivity.",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Feedback that this module reads as an accusation rather than a starting point everyone begins somewhere on", "A revision to the licensed IDI framework's published stage descriptions"],
      relatedDoor: "This module describes a general developmental orientation from published intercultural-development research. It never assigns any specific person to a stage, and it is not a substitute for a licensed IDI assessment and a qualified debrief.",
      toolkitQuestion: "Am I using this to understand a starting point, or to quietly sort people into 'aware' and 'unaware' categories?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "idi-denial-1",
        number: 1,
        title: "Denial",
        summary: "Not Yet Noticing Cultural Difference. Denial is the starting orientation on the intercultural continuum — cultural difference is not yet real or relevant",
        minutes: 20,
        learning: {
          objective: "Describe Denial as a starting orientation on the continuum and identify where a version of it shows up in an everyday work practice.",
          takeaways: [
            "Disinterest, not hostility: cultural difference has not yet registered as real or relevant",
            "Often comes from limited intercultural contact, not from prejudice",
            "Can coexist with genuine warmth and good intentions",
            "\"People are people\" said sincerely, while missing real differences in front of you",
            "The way through is curiosity and exposure, not guilt",
          ],
          evidence: "A worked scenario decision, a set of reflection questions, and a knowledge check.",
          appliedNextStep: "Choose one moment this week to notice a difference you might otherwise have flattened, and sit with it rather than resolving it immediately.",
        },
        scenario: {
          context: "A unit is updating its standard intake script, the same questions in the same order for every household. Someone proposes adding a line asking each household what would make the conversation work best for them. Another team member says, \"Honestly, everyone who comes through the door wants the same things — a stable home, a good job, help for their kids. Why add a question when the script already works?\"",
          prompt: "What is the best next step for the team?",
          options: [
            { label: "Drop the proposal — the current script treats every household exactly the same, which is the fairest approach.", response: "Treating every household identically feels neutral, but it is exactly how a script stays built around one assumed household story. Shared human needs are real, but they coexist with real differences in how people communicate, seek help, and experience the system — a script that never asks misses them by design." },
            { label: "Scrap the whole script and require an improvised, fully individualized conversation for every household instead.", response: "This overcorrects. A shared script keeps intake consistent and fair; the gap is that it never asks what a household needs, not that it has structure at all." },
            { label: "Keep the shared script, and add the one question — what would make this conversation work best for you — with room for staff to actually use the answer.", response: "This is the accurate move. It keeps a consistent, fair starting point and builds in the first real chance to notice specific, not generic, difference.", recommended: true },
          ],
        },
        transfer: {
          prompt: "Think of a time you said or thought something like \"we're all the same underneath\" about people you serve or work with. What might that framing have made it easier not to notice?",
          options: ["Denial isn't usually cruel — it's often sincerely well-meaning. Does that make it easier or harder to move past, in your own experience?", "What part of your own life (neighborhood, schooling, workplaces) may have kept certain kinds of difference less visible to you than they are to a colleague with a different background?", "What is one specific, recent example you could offer if someone gently asked you to make a generalization you hold more concrete?"],
        },
        blocks: [
          { type: "text", heading: "Stage overview", body: "<p>Denial is the starting orientation on the intercultural development continuum. It is not hostility — it is more like cultural difference has not yet become real enough to notice. Someone at Denial may say \"people are people\" and mean it kindly, while genuinely not perceiving the specific differences in front of them. This often comes from a narrow range of intercultural contact, not from ill will. The way out is not guilt — it is exposure, curiosity, and beginning to notice what was previously invisible.</p><p><strong>Where it sits:</strong> Stage 1 of 6 on the continuum this program uses: Denial → Polarization → Minimization → Acceptance → Adaptation → Integration. The program's continuum draws on the five orientations the Intercultural Development Inventory measures — Denial through Adaptation — plus Integration from Bennett's developmental model; a licensed IDI assessment does not measure Integration.</p>" },
          { type: "list", heading: "Key markers of this stage", items: ["Disinterest rather than hostility toward cultural difference", "Often the product of limited intercultural contact, not prejudice", "Can coexist with genuine kindness and good intentions", "Sincere use of \"people are people\" while missing real, specific differences", "Movement forward comes through curiosity and exposure, not guilt or shame"] },
          { type: "list", heading: "Reflect", ordered: true, items: ["Think of a time you said or thought something like \"we're all the same underneath\" about people you serve or work with. What might that framing have made it easier not to notice?", "Denial isn't usually cruel — it's often sincerely well-meaning. Does that make it easier or harder to move past, in your own experience?", "What part of your own life (neighborhood, schooling, workplaces) may have kept certain kinds of difference less visible to you than they are to a colleague with a different background?"] },
          { type: "flashcards", heading: "Suggestive practices", cards: [
            { front: "Ask for the specific, not the general", back: "<p>When a generalization comes up (\"everyone wants the same things\"), ask for one specific, recent example — yours or someone else's. A specific example makes real difference easier to see than a broad statement does.</p>" },
            { front: "Increase real contact, not just content", back: "<p>Reading about a culture is useful; a real conversation with a specific person is what actually moves Denial. Seek out the direct relationships this program's community briefs point toward.</p>" },
            { front: "Notice your own narrow ranges", back: "<p>Everyone has areas of real Denial — places where difference genuinely hasn't registered yet. Naming your own, honestly, is safer and more useful than assuming you've moved past all of them.</p>" },
            { front: "Don't weaponize the stage name", back: "<p>Calling a colleague \"in Denial\" as an insult defeats the entire purpose of a developmental model. The point is to describe a starting place, not to score people.</p>" },
          ] },
          { type: "knowledgeCheck", id: "idi-denial-1-check", question: "What best distinguishes Denial from Polarization on the intercultural development continuum?", options: [{ text: "Denial involves active hostility toward other cultures; Polarization does not", correct: false }, { text: "Denial is disinterest — difference hasn't registered as real yet; Polarization actively judges difference as better or worse", correct: true }, { text: "Denial only occurs in rural areas; Polarization only occurs in urban areas", correct: false }, { text: "Denial and Polarization are the same stage under different names", correct: false }], feedbackCorrect: "Denial is characterized by disinterest and non-perception of difference — it hasn't yet registered as real or relevant. Polarization, the next stage, actively notices difference but judges it in us-versus-them terms. They are distinct orientations with different paths forward.", feedbackIncorrect: "Look again at the stage's key markers — Denial is characterized by disinterest and non-perception of difference, not active judgment. Polarization, the next stage, is where active us-versus-them judgment begins." },
        ],
      },
      {
        id: "idi-denial-2",
        number: 2,
        title: "Noticing Denial in a team's default practice",
        summary: "Denial often shows up as a shared team default, not one person's flaw. How to name what you notice about a practice without labeling the person.",
        minutes: 9,
        learning: {
          objective: "Recognize when a team's default practice reflects Denial-style thinking and raise it in a way that invites noticing rather than defensiveness.",
          takeaways: [
            "Denial in a team usually looks like a shared default — one template, one language, one assumed client story — more than one person's individual attitude.",
            "Naming what you notice about a practice (\"this notice only goes out in English\") is safer and more productive than naming what you assume about a colleague's character or intentions.",
            "The goal of raising Denial in a colleague or team is to open a door to noticing, not to win an argument or prove you have moved further along the continuum than they have.",
            "A team can look busy and effective while still operating from Denial about who its actual audience is.",
          ],
          evidence: "A workplace scenario decision about a team default, and a knowledge check on raising a pattern without labeling a person.",
          appliedNextStep: "Identify one recurring team practice — a form, a script, a notice — that assumes a single kind of recipient, and raise it with the owner as a specific, observable pattern rather than a character judgment.",
        },
        scenario: {
          context: "In a unit meeting, someone points out that renewal notices go out only in English. The unit lead responds, \"Our clients all seem to read English fine when they call in — I don't think that's really an issue for our team.\" No one else in the room has direct evidence either way.",
          prompt: "What is the most useful next step?",
          options: [
            { label: "Let it go — the lead has more experience with this caseload and probably has a point.", response: "This treats an assumption as if it were evidence. Nobody in the room has actually checked, and the calls that come in are not proof about the people who never call." },
            { label: "Tell the lead directly that their assumption is unfair and they need to rethink their attitude.", response: "Naming a person's character rather than the claim is likely to produce defensiveness rather than curiosity, and it turns a description of a pattern into a judgment of the person." },
            { label: "Ask whether anyone has checked how many households on the caseload have requested another language elsewhere in the file, and offer to pull that number before the next meeting.", response: "This moves the conversation from a character judgment to a checkable fact, and gives the lead a concrete, low-stakes way to notice something new.", recommended: true },
          ],
        },
        transfer: {
          prompt: "Think of a team practice you have quietly assumed works fine for everyone because nobody has complained. What would it take to actually check?",
          options: ["Name one team default that assumes a single kind of recipient, reader, or caller", "Identify one piece of existing data (call logs, file notes, prior requests) that could test the assumption without a new project", "Write down who owns that practice and how you would raise the question with them"],
        },
        blocks: [
          { type: "text", heading: "A team default, not just a personal trait", body: "<p>Because Denial is about what has not yet registered as real, it rarely announces itself as an opinion. It shows up instead as a routine nobody has reconsidered: the one language a notice goes out in, the one script an intake interview follows, the one assumed household shape on a form. Everyone on the team can be kind, competent, and busy while the routine itself has never been checked against who is actually on the other end of it.</p><p>This is why raising Denial in a colleague works better as a question about the practice than a statement about the person. \"Have we checked this\" invites a look. \"You're not seeing this\" invites a defense. Both may be pointing at the same gap, but only one leaves room for the other person to notice it themselves.</p>" },
          { type: "list", heading: "Signs a team default may be operating from Denial", items: ["A single format, language, or channel is used for everyone, and nobody can say when it was last reconsidered.", "\"Nobody has complained\" is treated as proof the practice works, rather than one weak signal among several.", "A generalization about \"our clients\" is offered with confidence but without a specific, checkable example behind it.", "Questions about who might be missed are met with reassurance rather than curiosity."] },
          { type: "flashcards", heading: "Ways to raise it without labeling anyone", cards: [
            { front: "Ask for the check, not the confession", back: "<p>\"Have we looked at the data on this\" is easier to hear than \"you're assuming too much,\" and it produces the same useful information.</p>" },
            { front: "Bring one concrete case, not a general theory", back: "<p>A single specific example — one household, one form, one missed notice — moves a conversation further than an abstract claim about bias ever will.</p>" },
            { front: "Offer to do the legwork", back: "<p>Volunteering to pull the number or run the check lowers the cost of being wrong for the person whose default is being questioned, which makes it easier for them to say yes.</p>" },
            { front: "Separate the pattern from the person", back: "<p>\"This form only exists in English\" is a fact about a document. \"You don't care about non-English speakers\" is a claim about a person. Only the first one is usually true, and only the first one is useful to say out loud.</p>" },
          ] },
          { type: "leaderMove", heading: "Question the routine, not the person", control: "You control whether you frame a team default as a checkable fact or a personal failing.", failure: "Do not open with a diagnosis of someone's awareness. Open with a specific, checkable question about the practice itself.", next: "Before your next meeting, identify one team default worth checking and bring a specific way to check it, not just a concern." },
          { type: "knowledgeCheck", id: "idi-denial-2-check", question: "A colleague says a form works fine for everyone because no one has complained about it. What is the most accurate response?", options: [{ text: "Accept it, since a lack of complaints is reliable evidence a form works for everyone who uses it.", correct: false }, { text: "Tell the colleague their claim is unfair and they need to change their attitude.", correct: false }, { text: "Treat the absence of complaints as one weak signal, and propose checking against actual data such as returned or incomplete forms.", correct: true }], feedbackCorrect: "Right. Absence of complaints is weak evidence, especially from people who may not know how to complain or expect it to help. A specific, checkable data point moves the conversation further than either accepting the claim or diagnosing the person.", feedbackIncorrect: "Consider what \"nobody has complained\" actually proves, and whether a specific, checkable fact would move the conversation further than either accepting the claim or naming the person's stage." },
        ],
      },
      {
        id: "idi-denial-3",
        number: 3,
        title: "Finding your own Denial, honestly",
        summary: "A non-punitive look at where cultural difference has not yet become real or relevant in your own daily work, without treating the finding as a verdict.",
        minutes: 9,
        learning: {
          objective: "Identify at least one place in your own daily work where a cultural difference has likely gone unnoticed, without treating the finding as a character verdict.",
          takeaways: [
            "Everyone has real areas of Denial — places where a difference genuinely has not registered — regardless of how much other intercultural work they have done.",
            "The honest question is not \"am I in Denial\" as a fixed identity, but \"where, specifically, has difference not yet become real to me?\"",
            "Finding your own Denial is evidence the reflection is working, not evidence that something is wrong with you.",
            "A specific, honest answer is more useful than a general, reassuring one like \"I try to treat everyone the same.\"",
          ],
          evidence: "A first-person reflection scenario and a knowledge check on what an honest self-assessment of Denial actually looks like.",
          appliedNextStep: "Write down one specific area of your own work where you suspect a difference has not yet become real to you, and name one way you could find out whether you are right.",
        },
        scenario: {
          context: "You are filling out a short self-reflection for this program. The first question asks, \"Where might cultural difference not yet be real or relevant to you in your daily work?\" Your first instinct is to write, \"I treat everyone the same, so this doesn't really apply to me.\"",
          prompt: "What is the more honest next step?",
          options: [
            { label: "Write that answer down. Treating everyone the same is a fair and safe standard to hold yourself to.", response: "Treating everyone identically can itself flatten real differences in what people need to be reached, understood, or served well. It is a comfortable answer, not necessarily an accurate one." },
            { label: "Assume the honest answer must be dramatic, and if nothing dramatic comes to mind, conclude you have nothing to find here.", response: "Denial is usually quiet, not dramatic. Waiting for a dramatic example to surface is a way of not looking at the ordinary ones." },
            { label: "Push past the first answer and name one specific group, community, or situation you interact with rarely enough that you would not actually know if your usual approach worked for them.", response: "This treats the reflection as a real search rather than a formality, and produces something specific enough to actually check later.", recommended: true },
          ],
        },
        transfer: {
          prompt: "Where in your own daily work would a specific, honest answer to \"what have I not yet noticed\" be more useful than a general, reassuring one?",
          options: ["Name one community, coworker group, or client population you interact with rarely enough to have limited real information about", "Write down what your current, comfortable assumption about them actually is", "Identify one low-cost way you could test that assumption in the next month"],
        },
        blocks: [
          { type: "text", heading: "The honest version of this question", body: "<p>It is easy to answer \"where are you in Denial\" with a reassuring generality: \"I treat everyone the same,\" \"I don't really see color,\" \"people are people to me.\" Those answers feel safe because they are unfalsifiable — there is nothing specific enough in them to actually check. They are also, often, the clearest sign that Denial is still operating in exactly the place the question was asking about.</p><p>A more honest version of the question is narrower and less comfortable: not \"am I a person who notices culture,\" but \"which specific group, community, or situation do I interact with rarely enough that I genuinely would not know if my usual approach worked for them?\" That question has an answer for almost everyone, including people who have done a great deal of intercultural work in other areas. Naming it plainly is not a confession of failure. It is the actual first step the rest of this program is built on.</p>" },
          { type: "list", heading: "What an honest self-check for Denial actually looks like", items: ["A specific group, community, or situation, not a general claim about your character.", "An honest account of how much real, direct contact you have had with that group, not how much you have read or heard about them.", "A guess at what you might be missing, stated as a guess rather than a certainty.", "One concrete, low-cost way to actually find out whether your guess is right."] },
          { type: "quote", text: "I said I treated every family the same, and I believed it. It took a colleague asking me, specifically, when I had last had a real conversation with a family who used an interpreter, for me to notice I couldn't answer.", cite: "Composite staff perspective, illustrative" },
          { type: "flashcards", heading: "Reframes that help this land honestly", cards: [
            { front: "\"I don't know yet\" is a legitimate answer", back: "<p>Naming a genuine gap in your own contact or knowledge is more useful, and more honest, than filling it with a comfortable generalization.</p>" },
            { front: "This is not a ranking exercise", back: "<p>The point of finding your own Denial is not to score yourself against a colleague. Everyone doing this reflection honestly will find something.</p>" },
            { front: "Specificity is the test of honesty", back: "<p>If your answer could apply to literally anyone, it probably has not found anything real yet. Push for a name, a group, a situation.</p>" },
          ] },
          { type: "knowledgeCheck", id: "idi-denial-3-check", question: "Which self-reflection answer is most likely to actually locate a real area of Denial?", options: [{ text: "\"I try to treat everyone the same, so I don't think this applies to me.\"", correct: false }, { text: "\"I have had almost no direct conversations with families who primarily use an interpreter, and I'm not sure whether my usual intake approach works for them.\"", correct: true }, { text: "\"I don't see how this could apply to someone in my role.\"", correct: false }], feedbackCorrect: "Right. The specific, checkable answer names a real gap in contact and knowledge. The general, reassuring answers are exactly the kind of framing that keeps Denial invisible.", feedbackIncorrect: "Look for the answer that names something specific and checkable, rather than a general reassurance that could apply to anyone." },
        ],
      },
      {
        id: "idi-denial-4",
        number: 4,
        title: "What actually moves someone through Denial",
        summary: "Curiosity and real contact move Denial forward; guilt and lectures generally do not. A practical look at what helps, for a colleague or for yourself.",
        minutes: 9,
        learning: {
          objective: "Identify a concrete, low-pressure practice that helps move Denial toward noticing, and apply it to a real upcoming interaction.",
          takeaways: [
            "Real, direct contact with a specific person moves Denial more reliably than general information, a training module, or a lecture about bias.",
            "Guilt and shame tend to produce defensiveness or performance, not genuine noticing; curiosity tends to produce the opposite.",
            "Small, repeatable practices — asking for a specific example, seeking out one real conversation — outperform a single dramatic intervention.",
            "Movement through Denial is usually gradual and uneven, not a single moment of realization.",
          ],
          evidence: "A scenario decision about supporting a colleague's movement, and a knowledge check on what reliably helps.",
          appliedNextStep: "Set up one real, direct conversation with someone whose experience differs from your own in a way relevant to your work, and go into it planning to listen for one specific thing you have not noticed before.",
        },
        scenario: {
          context: "A unit is redesigning how it onboards new caseworkers, to help them start noticing the real variation among the families on their caseload from the beginning. Two options are on the table: a required module on general cultural awareness, or pairing each new caseworker with a colleague for two shadowed intake conversations with interpreter-supported families, followed by a short debrief.",
          prompt: "Which approach is more likely to actually help?",
          options: [
            { label: "The required module, since it covers the topic systematically and creates a documented record of completion.", response: "A general module can build vocabulary, but it rarely produces the specific, real-contact noticing that actually loosens Denial, and a completion record is not evidence of a shift in awareness." },
            { label: "Neither — noticing cultural difference is a personal trait and onboarding design can't really move it.", response: "Denial is a starting point, not a permanent trait, and the conditions a team builds into onboarding regularly help new staff move past it." },
            { label: "The shadowing and debrief, because it creates real, direct contact with a specific situation and a low-pressure conversation to reflect on it afterward.", response: "This matches what actually tends to move Denial: specific contact plus a chance to notice and talk about it, without a test or a grade attached.", recommended: true },
          ],
        },
        transfer: {
          prompt: "What is one real, direct contact you could seek out or create in the next month that would test one of your own assumptions rather than confirm it?",
          options: ["Name the specific person, team, or situation you would seek contact with", "Decide who could set it up or introduce you, if it is not already accessible to you directly", "Write down one question you genuinely do not know the answer to that you hope the contact will help you notice"],
        },
        blocks: [
          { type: "text", heading: "What reliably helps, and what usually does not", body: "<p>It is tempting to treat Denial as a knowledge problem, fixable with the right training module or the right statistic. Real contact with a specific person, in a low-pressure setting, tends to do far more: it turns an abstract category into someone whose experience does not fit the assumption, which is exactly the kind of noticing Denial is missing. A single well-designed conversation often moves someone further than a much larger amount of general content.</p><p>Guilt-based approaches, by contrast, tend to produce one of two results: defensiveness, where the person argues back to protect their sense of themselves as a good person, or performance, where the person says the expected thing without actually noticing anything new. Neither is movement. Curiosity-based approaches — an interesting question, a real story, a chance to be surprised — tend to produce the genuine noticing that curiosity, not guilt, is what actually moves someone.</p>" },
          { type: "list", heading: "Practices that tend to help", items: ["Arranging real, direct contact with a specific person, not just information about a group.", "Asking for one concrete, recent example instead of a general opinion.", "Following contact with a low-pressure debrief question, such as \"what surprised you,\" rather than a test.", "Treating movement as gradual, with credit for small, honest noticing rather than a single before-and-after moment."] },
          { type: "flashcards", heading: "For helping a colleague, or yourself", cards: [
            { front: "Contact beats content", back: "<p>A real conversation with one specific person usually does more than a module covering the topic in general terms.</p>" },
            { front: "Curiosity beats guilt", back: "<p>An interesting question invites noticing. A guilt-based appeal invites defensiveness or performance.</p>" },
            { front: "Small and repeatable beats big and rare", back: "<p>A pattern of small, real contacts moves someone further than one large, dramatic intervention that is never repeated.</p>" },
            { front: "Expect gradual, uneven movement", back: "<p>Someone can notice a great deal in one area and still have real Denial in another. That is normal, not a failure of the process.</p>" },
          ] },
          { type: "leaderMove", heading: "Create the conditions for contact, not the content of a lecture", control: "You control whether you respond to Denial with an assignment to read or a chance to actually meet someone.", failure: "Do not default to a training module as the whole plan. A module can support real contact; it rarely substitutes for it.", next: "The next time you want to help someone move past Denial, arrange one specific, real conversation before you assign anything to read." },
          { type: "knowledgeCheck", id: "idi-denial-4-check", question: "Which approach is most consistently associated with helping someone move past Denial?", options: [{ text: "A guilt-based appeal to the person's sense of being a fair-minded professional", correct: false }, { text: "Real, direct contact with a specific person, followed by a low-pressure debrief question", correct: true }, { text: "A single, comprehensive training module covering the topic in general terms", correct: false }], feedbackCorrect: "Right. Specific, real contact plus room to reflect on it tends to produce genuine noticing, which is what actually moves Denial. Guilt tends to produce defensiveness or performance instead.", feedbackIncorrect: "Consider which option creates a specific, real experience for the person to notice something in, rather than general content or an appeal to guilt." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Denial: quick reference",
    subtitle: "A one-page reminder for recognizing and moving through this starting orientation, in yourself or a colleague",
    quote: "Denial is characterized by disinterest and non-perception of difference — it hasn't yet registered as real or relevant. The way through is curiosity and exposure, not guilt.",
    use: {
      purpose: "Keep this stage's markers and suggestive practices ready for your own reflection or a colleague's.",
      remember: ["Disinterest rather than hostility toward cultural difference", "Often comes from limited intercultural contact, not prejudice", "Can coexist with genuine kindness and good intentions", "Movement forward comes through curiosity and exposure, not guilt"],
      doNext: "Notice one moment this week where you assumed a colleague's or client's experience was 'basically the same' as your own, and ask what you might not be seeing.",
    },
    sections: [
      { heading: "Suggestive practices", items: ["Ask for the specific, not the general \— when someone generalizes, ask for one recent concrete example.", "Increase real contact, not just content \— a real conversation moves Denial further than reading alone.", "Notice your own narrow ranges honestly, rather than assuming you've moved past all of them.", "Don't weaponize the stage name \— the point is description, not scoring."] },
      { heading: "Before you assume", items: ["This describes a starting orientation, not a fixed trait or a character flaw.", "This program's continuum draws on the five orientations the IDI measures plus Integration from Bennett's developmental model; a licensed IDI assessment does not measure Integration.", "No one's placement on this continuum is ever a personnel record or a score.", "When in doubt, a licensed IDI assessment with a qualified debrief — not this module — is the actual assessment tool."] },
    ],
  },
  sources: [
    { title: "Hammer, M. R. (2011). The Intercultural Development Inventory. IDI, LLC.", href: "https://www.idiinventory.com/", note: "Source for the five orientations a licensed IDI assessment measures — Denial, Polarization, Minimization, Acceptance, and Adaptation, including this module's stage — which this program's continuum draws on. The IDI does not measure Integration." },
    { title: "Bennett, M. J. (1993). Towards Ethnorelativism: A Developmental Model of Intercultural Sensitivity.", href: "https://www.idrinstitute.org/resources/chapters-on-dmis/", note: "Foundational developmental model the IDI grew from; source for Integration, the sixth stage of this program's continuum, which a licensed IDI assessment does not measure." },
  ],
};

export default pack;
