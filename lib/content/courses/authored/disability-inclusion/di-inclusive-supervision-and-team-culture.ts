import type { CoursePack } from "../../source-types";

// Disability Inclusion · Practitioner, module 6: Inclusive Supervision and Team Culture.
// Program-authored course for supervisors, human resources partners, program managers and inclusion champions.
const pack: CoursePack = {
  course: {
    id: "di-inclusive-supervision-and-team-culture",
    indexNumber: 1117,
    seriesLabel: "Disability Inclusion · Practitioner",
    title: "Inclusive Supervision and Team Culture",
    subtitle: "Lead a team where people can ask for what they need, work is judged fairly, and disability is neither a secret nor a spectacle.",
    scope: "For accessibility coordinators, equity professionals, learning leaders, human resources partners, program managers, supervisors, policy analysts, internal trainers and inclusion champions who lead or advise teams. Participation in this program is voluntary and does not replace required training.",
    treatment: "Five short lessons with scenarios, a myth-sorting exercise, flashcards, a conversation-planning artifact and knowledge checks",
    duration: "45–55 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/teams-in-minimization.jpg",
    coverAlt: "A government team sits around a conference table.",
    introTranscript: "Most of what makes a team accessible is decided in ordinary supervision: how meetings are run, how a request for support is received, what happens when a comment lands badly, and how performance is discussed when a person’s capacity changes from week to week. This course works through those moments. You will practice responding to a disclosure you did not ask for, answer the productivity myths that circulate in most workplaces, and prepare a fair performance conversation that separates the work from the diagnosis.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Describe three supervisory habits that make it safer to request support and explain how each removes stigma from the request.",
        "Respond to an unrequested disclosure, and to a suspected but undisclosed disability, without asking for a diagnosis or applying pressure to disclose.",
        "Answer four common productivity myths with accurate information and redirect an ableist comment in a team setting.",
        "Plan a performance conversation that names expectations, separates essential functions from method and timing, and routes accommodation questions to the interactive process.",
        "Build predictable, accessible management routines into one-on-ones, meetings, scheduling and written communication.",
      ],
      evidence: [
        "A completed sort of workplace statements into myth, fact and question to explore.",
        "A performance-conversation plan using the artifact, reviewed against the fairness checks.",
        "A short list of three management routines you changed and what each removed for the team.",
      ],
      appliedNextStep: "Choose one routine you run every week and make it accessible by default: agenda and materials in advance, more than one way to contribute, and a written summary of decisions. Tell your team why.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Change in ADA, Section 504 or Section 508 guidance", "Change in DHS accessibility or language access standards", "Feedback from disabled staff or participants that a scenario reads as unrealistic or stigmatizing"],
      relatedDoor: "Accommodation decisions, leave questions and performance actions involve human resources, the ADA coordinator and labor relations where applicable; this course prepares a supervisor for the conversation, it does not replace those offices.",
      toolkitQuestion: "What does this person need to do the work well, what do I actually control, and who else needs to be involved before I act?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "inclusive-supervision-and-team-culture-1",
        number: 1,
        title: "A team where asking is ordinary",
        summary: "Understand what makes a request for support feel risky, what supervisors control about that risk, and how to make asking an unremarkable part of how the team works.",
        minutes: 10,
        learning: {
          objective: "Identify the signals that make requesting support feel risky on a team and apply three supervisory habits that make such requests ordinary.",
          takeaways: [
            "People weigh the cost of asking against the cost of struggling silently; a supervisor lowers the cost of asking or raises the cost of struggling, usually without noticing which.",
            "Offering flexibility to everyone by default removes the need for most people to disclose anything to get what they need.",
            "How a supervisor responds to the first request in front of the team teaches everyone else whether to ask.",
          ],
          evidence: "Three habits chosen for your own team, each with the signal it changes.",
          appliedNextStep: "At your next team meeting, state one support that is available to everyone without explanation, such as written follow-up or a choice of how to contribute. Watch who uses it.",
        },
        scenario: {
          context: "A new eligibility worker asks in a team meeting whether decisions can be sent in writing after meetings because she finds it hard to hold details from spoken discussion. A longer-tenured colleague laughs and says, “Welcome to county work, we all just keep up.”",
          prompt: "What does the supervisor do in the moment?",
          options: [
            { label: "Let it pass to avoid embarrassing either person, and talk to the colleague privately later.", response: "Silence in the room tells the new worker, and everyone watching, that asking costs something. A private word later does not repair the public lesson." },
            { label: "Say that written decisions after meetings are a good practice for the whole team, make it the standard starting today, and briefly note that requests like this are welcome.", response: "The request becomes a team improvement rather than one person’s need, the joke is answered without a lecture, and the norm is set publicly.", recommended: true },
            { label: "Ask the new worker to explain why she needs written decisions so the team understands.", response: "This turns a reasonable request into a demand for justification and possibly a disclosure. Nobody owes the team a reason for a sensible practice." },
          ],
        },
        transfer: {
          prompt: "What did the last person who asked your team for something different learn from the response?",
          options: ["Recall the most recent request for flexibility or support and how it was received in front of others", "Name one support you can make available to everyone without a reason", "Decide what you will say the next time a request is met with a joke"],
        },
        blocks: [
          { type: "text", heading: "The quiet arithmetic of asking", body: "<p>Before a person asks for a different format, a quieter desk, a predictable schedule or an extra day, they do a private calculation. What will it cost me to ask? Will I be seen as difficult, fragile or less committed? Will I have to explain a condition I would rather keep to myself? Against that they weigh the cost of not asking: mistakes, exhaustion, missed information, and eventually a performance problem that looks like a personal failing.</p><p>Supervisors rarely see this arithmetic, but they set its terms. A team where the last person who asked was teased, questioned or quietly sidelined has taught everyone to struggle in silence. A team where flexibility is offered before anyone asks, where the supervisor responds to a request as a design improvement, and where nobody has to say why, has made asking ordinary.</p><p>The goal is not a team where everyone discloses a disability. It is a team where nobody has to, because the ordinary way of working already includes them, and where a request for something more is received as useful information about the work.</p>" },
          { type: "list", heading: "Signals people read before they ask", items: ["How the last request was received, especially in front of others.", "Whether flexibility is described as a favor, a perk or a standard.", "Whether the supervisor ever models needing something: a break, a written summary, a changed deadline.", "Whether jokes about “special treatment” go unanswered.", "Whether the accommodation process is described as routine or as a last resort.", "Whether people who use supports are still given visible, career-building work."] },
          { type: "leaderMove", heading: "Make it about the work, out loud", control: "You control whether the first response to a request is “why do you need that?” or “what would that make possible?”", failure: "Do not ask for a reason before you have considered the request. Do not grant it quietly as a private exception while leaving the team practice unchanged.", next: "The next request you receive, answer it in terms of the work it enables, and ask whether the whole team would benefit from the same change." },
          { type: "sorting", id: "inclusive-supervision-and-team-culture-1-sort", heading: "Lowers the cost of asking, or raises it?", categories: ["Lowers the cost of asking", "Raises the cost of asking"], items: [
            { text: "Meeting agendas and materials go out two days ahead as a standing practice.", category: "Lowers the cost of asking" },
            { text: "The supervisor says, “I need this in writing or I will lose it,” and means it.", category: "Lowers the cost of asking" },
            { text: "A request for a quieter workspace is answered with, “Everyone would like that.”", category: "Raises the cost of asking" },
            { text: "Flexible start times are listed in the team’s working agreement for everyone.", category: "Lowers the cost of asking" },
            { text: "The one colleague with an accommodation is left off the high-visibility project “to keep their load light.”", category: "Raises the cost of asking" },
            { text: "The supervisor tells the team the accommodation process is “a lot of paperwork” and best avoided.", category: "Raises the cost of asking" },
          ] },
          { type: "flashcards", heading: "Three habits", cards: [
            { front: "Offer before asked", back: "<p>Build the common supports into the team’s standard practice: written decisions, materials in advance, a choice of contribution channels, predictable schedules. Most needs are met without anyone disclosing anything.</p>" },
            { front: "Respond to the work, not the reason", back: "<p>When someone asks, discuss what the change would make possible and how to do it. If a formal accommodation is needed, route it; do not investigate it yourself.</p>" },
            { front: "Answer the room", back: "<p>When a request is mocked or questioned in front of others, say something in the moment. A short, calm sentence resets the norm; silence confirms the joke.</p>" },
            { front: "Model needing things", back: "<p>Supervisors who say what helps them work well give everyone else permission. It costs nothing and it changes the arithmetic.</p>" },
          ] },
          { type: "knowledgeCheck", id: "inclusive-supervision-and-team-culture-1-check", question: "Which supervisory response does most to make future requests ordinary?", options: [
            { text: "Approving the request privately and asking the person not to mention it so others do not expect the same.", correct: false },
            { text: "Adopting the requested practice for the whole team where it makes sense, and saying so.", correct: true },
            { text: "Asking the person to bring documentation before discussing the request.", correct: false },
          ], feedbackCorrect: "Yes. Turning a request into a shared practice removes the stigma and the need for the next person to ask.", feedbackIncorrect: "Secrecy and documentation-first responses both teach the team that asking is risky. Look for the response that changes the team’s standard." },
        ],
      },
      {
        id: "inclusive-supervision-and-team-culture-2",
        number: 2,
        title: "Disclosure is theirs, not yours",
        summary: "Handle a disclosure you did not ask for, avoid pressuring anyone to disclose, and respond to a suspected disability by talking about the work.",
        minutes: 11,
        learning: {
          objective: "Respond to an unrequested disclosure, keep it confidential, and address a suspected but undisclosed disability by discussing work expectations and available supports without asking for a diagnosis.",
          takeaways: [
            "Nobody owes their supervisor a diagnosis. A supervisor may discuss performance and offer the accommodation route; a supervisor may not ask “do you have a disability?” or guess at one.",
            "When someone discloses, the supervisor’s job is to thank them, ask what would help, keep it confidential, and route any formal request. Not to solve, diagnose or share.",
            "Disclosure pressure is often indirect: repeated questions about health, comments that a person “seems off,” or requiring a reason for ordinary flexibility.",
          ],
          evidence: "A written response to the scenario disclosure, checked against the four-step response, and one sentence you would use to open a work-focused conversation with someone you are worried about.",
          appliedNextStep: "Review how you last responded when a team member shared something about their health or a condition. Note what you did with the information and who else learned it. Correct anything that went further than it should have.",
        },
        scenario: {
          context: "In a one-on-one, a case aide tells his supervisor, “I have ADHD. It is why I sometimes miss steps in the intake checklist. Please do not tell the rest of the team.” He has not asked for anything else.",
          prompt: "What is the supervisor’s best response?",
          options: [
            { label: "Thank him for telling you, say it will stay between you, ask what would help with the checklist, and let him know the accommodation process is available if he wants it.", response: "This receives the disclosure with respect, keeps control with him, focuses on the work and opens the formal route without forcing it. It is the whole job in four sentences.", recommended: true },
            { label: "Ask what medication he takes and whether it is working, so you can understand the situation.", response: "Medical detail is not the supervisor’s to ask for. It adds nothing to the checklist problem and turns a disclosure into an examination." },
            { label: "Tell him you understand, then mention it to the lead worker so she can keep an eye on his intakes.", response: "He asked that it stay between you. Sharing it, even to help, breaks confidentiality and teaches him and eventually others that disclosure spreads." },
          ],
        },
        transfer: {
          prompt: "Where might your team be applying disclosure pressure without meaning to?",
          options: ["Listen for questions about health or “what’s going on with you” in your own one-on-ones", "Check whether flexibility on your team requires a stated reason", "Write the one sentence you would use to raise a work concern without inviting a diagnosis"],
        },
        blocks: [
          { type: "text", heading: "What a supervisor may and may not do", body: "<p>Federal equal employment guidance is clear that an employer’s questions about disability and requests for medical information are limited, and that medical information an employee does share must be kept confidential. In practice, a supervisor can always talk about the work: what is expected, what is happening, what support is available. A supervisor should not ask whether a person has a disability, speculate about one, ask about medication or treatment, or require a diagnosis before discussing a change. When formal accommodation is on the table, the interactive process, with human resources or the ADA coordinator, handles documentation. The supervisor’s role is to route, not to examine.</p><p>Disclosure pressure is rarely a direct question. It shows up as “are you okay, you seem off lately,” asked for the third time. As “just tell me what’s going on and I can help.” As a rule that flexibility is granted only with a reason. As a culture where the people with accommodations are known to everyone. Each of these tells a person that privacy has a price.</p><p>When someone does disclose, they are handing you something. Treat it that way. Thank them. Ask what would help. Say who, if anyone, will know, and keep to it. Offer the formal route without insisting on it. Then return to the work.</p>" },
          { type: "accordion", heading: "Moments that test the rule", items: [
            { title: "Someone discloses and asks for nothing", body: "<p>Thank them, confirm confidentiality, ask whether anything would help now or later, and note that the accommodation route exists if they ever want it. Do not go looking for problems to solve.</p>" },
            { title: "You suspect a disability behind a performance change", body: "<p>Talk about the work: what you have observed, what is expected, and what supports the team offers everyone. Mention that the accommodation process is available to anyone. Do not name your suspicion. The person decides what to share.</p>" },
            { title: "A colleague asks why someone gets a different schedule", body: "<p>“That is arranged with them and it is working. If a different schedule would help you, let’s talk about it.” Never confirm or deny that an accommodation exists.</p>" },
            { title: "Someone discloses in front of the team", body: "<p>Respond briefly and warmly, keep the discussion on the work or the practice, and follow up privately to ask what they want the team to know going forward. Their choice, not yours.</p>" },
            { title: "Human resources asks you for information", body: "<p>Share what you know about the job and its essential functions. Do not pass along medical details the person told you in confidence unless they have agreed that is how the process should work.</p>" },
          ] },
          { type: "quote", text: "The day I told my supervisor, she said thank you, asked what would help, and moved on. Nothing about my work changed except that I stopped hiding. I would not have risked it if I had seen anyone else’s disclosure travel.", cite: "Composite staff perspective, illustrative" },
          { type: "leaderMove", heading: "Talk about the work, not the diagnosis", control: "You control whether a performance concern is raised as a question about a person’s health or as a description of the work.", failure: "Do not open with “is everything okay at home?” or “have you thought about seeing someone?” Do not diagnose in your head and manage to the diagnosis.", next: "Prepare your next difficult one-on-one by writing the observed behavior, the expectation, and the supports available to everyone. Leave the reason to the person." },
          { type: "flashcards", heading: "Four steps when someone discloses", cards: [
            { front: "1. Thank", back: "<p>“Thank you for telling me.” It cost them something. Do not say “I had a feeling” or “that explains a lot.”</p>" },
            { front: "2. Ask what would help", back: "<p>“Is there anything that would make the work easier, now or later?” Accept “nothing right now.” Do not propose solutions to problems they have not raised.</p>" },
            { front: "3. Say who will know, and keep to it", back: "<p>Tell them what stays with you, what human resources would need if they choose the formal route, and nothing else. Then honor it, including with your own manager.</p>" },
            { front: "4. Offer the route, do not insist", back: "<p>“If you ever want to make a formal request, the process is there and I will support it.” Then return to ordinary work. Disclosure is not a project.</p>" },
            { front: "What never to ask", back: "<p>Diagnosis, medication, treatment, prognosis, or whether a condition is “real.” None of these is the supervisor’s to know, and none changes what the work needs.</p>" },
          ] },
          { type: "knowledgeCheck", id: "inclusive-supervision-and-team-culture-2-check", question: "A supervisor notices a strong performer has become withdrawn and is missing deadlines. Which opening keeps the supervisor within their role?", options: [
            { text: "“I’ve noticed you seem depressed lately. Is that what’s going on?”", correct: false },
            { text: "“I’ve noticed the last three reports came in after the deadline, which is not like you. I want to understand what is getting in the way and what support might help, including anything the team can change.”", correct: true },
            { text: "“Do you have a disability I should know about?”", correct: false },
          ], feedbackCorrect: "Yes. The supervisor describes the work, states the expectation, and opens the door to support without naming or asking for a condition.", feedbackIncorrect: "Two openings guess at or demand a diagnosis. The supervisor’s territory is the observed work and the supports available." },
        ],
      },
      {
        id: "inclusive-supervision-and-team-culture-3",
        number: 3,
        title: "Productivity myths and comments that land badly",
        summary: "Answer the myths about cost, output and fairness that shape supervisory decisions, and respond to ableist comments in a way that teaches rather than shames.",
        minutes: 11,
        learning: {
          objective: "Answer four common productivity myths with accurate, attributable information and use a calling-in response to redirect an ableist comment in a team setting.",
          takeaways: [
            "The Job Accommodation Network reports that many workplace accommodations cost nothing, and most of the rest involve a modest one-time expense; the myth of the expensive accommodation drives decisions far more than the reality.",
            "“If I do it for one I have to do it for everyone” confuses equal treatment with equitable treatment; and if the change is good, doing it for everyone is often the right answer.",
            "A comment that lands badly is best answered by naming the impact and the fact, not the speaker’s character.",
          ],
          evidence: "A completed sort of statements into myth, fact and question to explore; one scripted calling-in response.",
          appliedNextStep: "Write down the myth you hear most often in your own workplace and the two-sentence answer you will give next time, with the source you would point to.",
        },
        scenario: {
          context: "During a team huddle in a call center, a staff member remarks, “Must be nice to work from home two days a week. Some of us have to actually be here.” The colleague being referred to has an accommodation the team does not know the details of.",
          prompt: "What does the supervisor say?",
          options: [
            { label: "Nothing in the huddle; take the commenter aside afterwards.", response: "The comment landed on the whole team. Answering only in private leaves the colleague exposed and the myth standing." },
            { label: "“Working arrangements are set with each person based on what lets them do the job well, and that is available to talk about for anyone. What we measure here is the work, and the work is getting done.” Then move on.", response: "This neither confirms an accommodation nor lets the comment stand. It restates the standard, offers the same conversation to everyone, and returns attention to results.", recommended: true },
            { label: "Explain that the colleague has a medical reason so the team understands it is not a perk.", response: "This discloses on someone else’s behalf. Even without a diagnosis, confirming a medical reason breaks confidentiality and makes the colleague the subject of the meeting." },
          ],
        },
        transfer: {
          prompt: "Which myth does your own decision-making lean on when a request feels inconvenient?",
          options: ["Notice the first objection that comes to mind when a request arrives", "Check it against the facts in this lesson", "Prepare the sentence you will use to answer it in front of the team"],
        },
        blocks: [
          { type: "text", heading: "Myths do the deciding when facts are absent", body: "<p>Most supervisors do not set out to exclude anyone. They make quick decisions under pressure, and in the absence of facts, common beliefs fill the gap: accommodations are expensive, disabled staff are less productive or more often absent, flexibility is a perk that breeds resentment, and any exception must be extended to everyone or refused to all. Each of these has a factual answer, and each answer changes the decision.</p><p>The Job Accommodation Network, a federally funded service that has surveyed employers for many years, reports that a large share of accommodations cost nothing at all, and that most of the rest involve a modest one-time cost. Employers in those surveys also report benefits: retaining a valued employee, increased productivity, and improved morale across the team. Federal disability employment resources reach the same conclusion. The expensive, disruptive accommodation is the exception that shapes the rule in people’s minds.</p><p>Comments that grow from these myths need answering in the moment, but not with a lecture. The most useful pattern is to state the impact or the fact, restate the standard, and move on. People can hear a correction that does not require them to be a villain.</p>" },
          { type: "tabs", heading: "Four myths and what to say", tabs: [
            { label: "“Too expensive”", body: "<p><strong>Myth:</strong> Accommodations are a major cost.</p><p><strong>Fact:</strong> The Job Accommodation Network reports many accommodations cost nothing and most others involve a modest one-time expense. Compare that with the cost of recruiting and training a replacement.</p><p><strong>Say:</strong> “Most accommodations cost little or nothing. Let’s find out what this one actually needs before we assume.”</p>" },
            { label: "“Less productive”", body: "<p><strong>Myth:</strong> Disabled employees produce less or are absent more.</p><p><strong>Fact:</strong> Productivity depends on whether barriers have been removed, and employers report equal or better retention and performance once they have. Absence patterns vary by person, not by disability status.</p><p><strong>Say:</strong> “We measure the work. Let’s look at what would let this person do it well.”</p>" },
            { label: "“It’s a perk”", body: "<p><strong>Myth:</strong> Flexibility for one person is unfair to the rest.</p><p><strong>Fact:</strong> An accommodation removes a barrier so a person can meet the same standard; it is not a reward. And if a flexible practice is good, extending it to everyone is often the best fix.</p><p><strong>Say:</strong> “Arrangements are set so each person can do the job. If something would help you, let’s talk.”</p>" },
            { label: "“Everyone or no one”", body: "<p><strong>Myth:</strong> If I change something for one person I must change it for all, so I should refuse.</p><p><strong>Fact:</strong> Treating people equitably means responding to different needs. Consistency lies in the process and the standard, not in identical arrangements.</p><p><strong>Say:</strong> “The standard is the same for everyone. How people meet it can differ.”</p>" },
          ] },
          { type: "list", heading: "Calling in, not calling out", ordered: true, items: ["Pause the flow: “Let me pick that up for a second.”", "Name the impact or the fact, not the person: “That frames a working arrangement as a favor, and it is not one.”", "Restate the standard: “We measure the work, and arrangements are set so people can do it.”", "Offer the same door: “If something would help you, I want to hear it.”", "Move on. Do not require an apology in front of the team; follow up privately if the pattern continues."] },
          { type: "leaderMove", heading: "Answer the room, protect the person", control: "You control whether a comment about “special treatment” is answered, and whether the answer exposes the colleague it was aimed at.", failure: "Do not defend an accommodation by explaining its medical reason. Do not stay silent because the comment was “just a joke.”", next: "Prepare one calm sentence that restates the standard, and use it the next time a comment about fairness or perks comes up." },
          { type: "flashcards", heading: "Facts to have ready", cards: [
            { front: "The cost of accommodation", back: "<p>Per the Job Accommodation Network’s employer surveys, many accommodations cost nothing and most of the rest involve a modest one-time cost. Retention and productivity gains are commonly reported alongside.</p>" },
            { front: "Equal versus equitable", back: "<p>Equal gives everyone the same thing. Equitable gives each person what they need to meet the same standard. Fair supervision is equitable in arrangements and equal in expectations.</p>" },
            { front: "Fluctuating does not mean unreliable", back: "<p>Many conditions vary week to week. Reliability is built through predictable structure, clear priorities and agreed ways to flex; it is not a fixed personal trait.</p>" },
            { front: "The joke is data", back: "<p>A joke about special treatment tells you what the team believes about fairness. Answer it as information, not as an offense to punish.</p>" },
          ] },
          { type: "knowledgeCheck", id: "inclusive-supervision-and-team-culture-3-check", question: "A colleague says, “If we let her use speech-to-text, everyone will want it.” What is the most accurate and useful answer?", options: [
            { text: "“Then no one gets it; that is the only fair way.”", correct: false },
            { text: "“If it helps her do the job it is not a favor, and if it would help others too, that is a reason to look at offering it more widely, not a reason to refuse.”", correct: true },
            { text: "“She has a medical condition, so it is different for her.”", correct: false },
          ], feedbackCorrect: "Right. The answer rejects the everyone-or-no-one framing, keeps the standard consistent, and protects the colleague’s privacy.", feedbackIncorrect: "One answer refuses out of a fairness myth, another discloses on a colleague’s behalf. Look for the answer that separates the standard from the arrangement." },
        ],
      },
      {
        id: "inclusive-supervision-and-team-culture-4",
        number: 4,
        title: "Fluctuating capacity and fair performance conversations",
        summary: "Manage performance fairly when capacity varies, separate the essential result from the method and timing, and know where the accommodation process takes over.",
        minutes: 12,
        learning: {
          objective: "Plan a performance conversation that states the expected result, separates essential functions from method and timing, considers what the team can change, and routes accommodation questions to the interactive process rather than lowering or hiding standards.",
          takeaways: [
            "Fluctuating capacity is normal for many chronic, mental health and neurological conditions; it is managed by structure and agreed flexibility, not by guessing at good and bad weeks.",
            "Fairness means the same standard for the result and honest flexibility about how and when it is met; quietly lowering expectations is as unfair as quietly punishing.",
            "A supervisor addresses the work and offers the accommodation route; the interactive process, not the supervisor alone, decides what adjustments are reasonable.",
          ],
          evidence: "A completed conversation plan using the artifact, with the essential result, the observed gap, what the team can change and the route named.",
          appliedNextStep: "For one role you supervise, write the essential results in one column and the current method and timing in another. Circle what is truly essential. That is the standard you hold; the rest is negotiable.",
        },
        scenario: {
          context: "A policy analyst with a condition that flares unpredictably produces excellent work most weeks and, roughly one week in five, misses internal deadlines and goes quiet. Her supervisor has said nothing for months, has been quietly reassigning her work in the bad weeks, and is now being asked by his own director why the analyst’s mid-year review does not mention timeliness.",
          prompt: "What should the supervisor have been doing, and do now?",
          options: [
            { label: "Document the missed deadlines and address them formally in the review; standards are standards.", response: "Raising months of silent concern in a formal review, with no earlier conversation and no offer of support, is unfair and likely to be experienced as an ambush. It also ignores that the supervisor changed the arrangement informally without saying so." },
            { label: "Keep covering the bad weeks quietly; her work is good and she is dealing with enough.", response: "Silent reassignment lowers the standard without telling her, hides a pattern the interactive process could address properly, and leaves the supervisor unable to be honest with his director or with her." },
            { label: "Have a direct conversation now about the pattern and the expected results, ask what would help, agree how she will flag a difficult week early, and let her know the accommodation process is available if she wants a formal arrangement.", response: "This is honest about the expectation, treats her as a professional who can help design the answer, builds a predictable way to flex, and routes any formal adjustment to the right process.", recommended: true },
          ],
        },
        transfer: {
          prompt: "Where are you currently holding a standard silently, either too low or too high, for someone whose capacity varies?",
          options: ["Name the essential result and the negotiable method for that role", "Plan the conversation with the artifact in this lesson", "Decide who else needs to be involved before you act"],
        },
        blocks: [
          { type: "text", heading: "Fair does not mean identical, and it does not mean silent", body: "<p>Many disabilities are not constant. Autoimmune conditions, migraine, mental health conditions, chronic pain, epilepsy and many others vary from week to week and are not predictable. A supervisor who manages to an imagined steady state will read a bad week as a character flaw and a good week as proof that the bad week was a choice. Neither is true.</p><p>Fair performance management holds the essential result steady and is honest and flexible about the rest. Start by separating what the role must deliver from how and when it is usually delivered. A determination must be accurate and issued within the required window; whether it is drafted at 7 a.m. or 7 p.m., in the office or at home, in one sitting or three, is method. Most performance conversations that go wrong are arguments about method disguised as arguments about results.</p><p>Two failures look opposite but share a cause. Quietly lowering the standard, by reassigning work without discussion, protects the supervisor from a hard conversation and denies the person a fair account of their performance and a chance at real support. Quietly punishing, by withholding opportunity or building a file, does the same. The alternative is to name the result, describe the gap, ask what would help, agree how to flex, and route formal accommodation to the interactive process where human resources or the ADA coordinator can consider it properly.</p>" },
          { type: "list", heading: "Before a performance conversation", ordered: true, items: ["Write the essential results for the role and check them against the position description.", "Describe what you have observed in terms of work: dates, finished work, gaps. No adjectives about attitude.", "List what the team or process could change: priorities, sequencing, notice periods, backup arrangements.", "Decide what you will offer everyone regardless of disclosure, and note that the accommodation process is available.", "Identify who else needs to be involved: human resources, the ADA coordinator, labor relations where a formal action is possible.", "Plan how the person will be able to flag a difficult week early, and what happens when they do."] },
          { type: "artifact", kind: "tagged-document", label: "Practical artifact", title: "A fair performance conversation plan", summary: "Four fields that keep a conversation about fluctuating performance honest, specific and within the supervisor’s role.", fields: [
            { label: "Essential result", value: "The outcome the role must deliver and the standard it is held to, stated the same way for everyone in the role." },
            { label: "What I observed", value: "Specific, dated work facts: what was due, what arrived, what the impact was. No guesses about cause." },
            { label: "What we can change", value: "Method, timing, sequencing, notice, backup and priority options the team can offer, and what is already available to everyone." },
            { label: "Route and follow-up", value: "The offer of the accommodation process, who else is involved, the agreed early-warning signal for hard weeks, and when we will review." },
          ], action: "Complete the plan before the conversation and share the essential result and observed facts with the person so they are not hearing them for the first time." },
          { type: "leaderMove", heading: "Hold the result, negotiate the method", control: "You control which parts of a role you treat as fixed and which you treat as open to design.", failure: "Do not reassign work in a difficult week without saying so, and do not save concerns for a formal review. Do not decide on your own what accommodation is reasonable; that belongs to the interactive process.", next: "Before your next review cycle, separate essential results from method for each role you supervise, and share the list with your team." },
          { type: "flashcards", heading: "Fluctuating capacity, steady practice", cards: [
            { front: "Essential function", back: "<p>A core duty the role exists to perform. The position description and human resources help define it. Standards for essential functions stay the same; how they are met can be adjusted.</p>" },
            { front: "Early-warning agreement", back: "<p>An agreed, low-effort way for a person to signal a difficult week before deadlines slip, and an agreed response: re-sequencing, backup, or a shifted date. Predictability protects everyone.</p>" },
            { front: "Silent lowering", back: "<p>Reassigning work or dropping expectations without discussion. Feels kind, denies the person an honest account and any real support, and eventually surfaces unfairly.</p>" },
            { front: "The interactive process", back: "<p>The structured conversation between employee, human resources or the ADA coordinator and the supervisor about what adjustment is reasonable. Supervisors contribute knowledge of the job; they do not decide alone.</p>" },
            { front: "Leave is not the only tool", back: "<p>Schedule changes, re-sequenced work, remote days, task swaps and adjusted deadlines often keep a person contributing. The process explores options; the supervisor should not default to “take time off.”</p>" },
          ] },
          { type: "knowledgeCheck", id: "inclusive-supervision-and-team-culture-4-check", question: "An employee with a fluctuating condition meets every quality standard but misses about one internal deadline a month. Which supervisory approach is fair?", options: [
            { text: "Lower the standard quietly so the misses stop counting.", correct: false },
            { text: "Raise the pattern directly, restate the required result, ask what would help, agree an early-warning practice, and offer the accommodation route for any formal change.", correct: true },
            { text: "Say nothing until the annual review, then rate timeliness as unsatisfactory.", correct: false },
          ], feedbackCorrect: "Yes. Honest about the standard, collaborative about the method, and routed to the right process for anything formal.", feedbackIncorrect: "Both silent options fail the person: one by hiding the standard, the other by hiding the concern. Fairness is spoken, specific and supported." },
        ],
      },
      {
        id: "inclusive-supervision-and-team-culture-5",
        number: 5,
        title: "Management habits that include by default",
        summary: "Build the routines of one-on-ones, meetings, scheduling and written communication so most access needs are met before anyone has to ask.",
        minutes: 9,
        learning: {
          objective: "Adopt predictable, accessible management routines for one-on-ones, meetings, scheduling and written communication and explain what barrier each routine removes.",
          takeaways: [
            "Predictability is an accommodation almost everyone benefits from: known agendas, stable schedules, decisions in writing and advance notice of change.",
            "Offering more than one way to contribute, in writing, aloud, before or after the meeting, includes people whose processing, speech, hearing or energy differ without requiring anyone to explain.",
            "A supervisor’s written follow-up after decisions is the single cheapest access practice available.",
          ],
          evidence: "Three routines changed on your team, each paired with the barrier it removes.",
          appliedNextStep: "Write a one-page team working agreement that states the accessible routines as standard practice, review it with the team, and revisit it when new members join.",
        },
        scenario: {
          context: "A supervisor in a residential licensing unit posts the next week’s field visit schedule on Friday afternoon and often moves visits with a day’s notice. Two staff have quietly struggled: one manages a condition that needs planned rest, another arranges care for a family member. Neither has said anything.",
          prompt: "What is the most inclusive change?",
          options: [
            { label: "Ask staff to let the supervisor know if the schedule is a problem for them.", response: "This asks people to disclose in order to get predictability, and it treats a design problem as individual requests." },
            { label: "Publish the schedule two weeks ahead, set a rule that changes inside three days need the staff member’s agreement, and explain the change to the whole team as a standard.", response: "Predictable scheduling removes the barrier for everyone, including the two people who have not disclosed and never need to. It also improves the work.", recommended: true },
            { label: "Keep the schedule as it is; field work is unpredictable and everyone signed up for it.", response: "Some unpredictability is real, but a Friday posting for Monday visits is a choice. Structure the predictable part and manage the truly unpredictable part with agreement." },
          ],
        },
        transfer: {
          prompt: "Which routine you run this week could become accessible by default?",
          options: ["Send the agenda and materials for your next meeting two working days ahead", "Add a written summary of decisions and owners after your next one-on-one", "Publish your team’s schedule further ahead and set a notice rule for changes"],
        },
        blocks: [
          { type: "text", heading: "Design the routine, not the exception", body: "<p>Level 1 of this curriculum introduced accessibility by design: build the ramp before anyone arrives. Supervision has its own ramps. A meeting with an agenda sent ahead, materials in accessible formats, captions on, a written summary of decisions afterwards and more than one way to contribute is accessible to a person with a processing disability, a hearing disability, a chronic condition, a caregiving load or simply a heavy week. Nobody has to ask, and nobody has to explain.</p><p>Predictability deserves special mention because it is so often overlooked. Stable schedules, advance notice of change, known expectations and consistent one-on-ones are, for many disabled staff, the difference between managing a condition and being managed by it. They are also good management for everyone.</p>" },
          { type: "tabs", heading: "Routines by setting", tabs: [
            { label: "One-on-ones", body: "<p>Same time each week, held rather than bumped. A shared running agenda both people can add to beforehand. Decisions and owners written down afterwards. An open standing question: “Is anything about how we work getting in the way?”</p>" },
            { label: "Team meetings", body: "<p>Agenda and materials two working days ahead in accessible formats. Captions on for anything virtual or hybrid. Contributions welcome in writing before, in chat during, or in follow-up after. Breaks in anything over an hour. A written summary with decisions and owners.</p>" },
            { label: "Scheduling", body: "<p>Publish as far ahead as the work allows. Set a notice rule for changes, and get agreement inside the notice window. Offer flexible start and end times as standard where the role allows. Treat the truly unpredictable as the exception it is.</p>" },
            { label: "Written communication", body: "<p>Plain language, headings, one request per message, a clear deadline and a named contact. Important information sent, not only said. Real text, not screenshots or scanned images.</p>" },
          ] },
          { type: "leaderMove", heading: "Write it down, every time", control: "You control whether decisions, expectations and changes exist only in conversation or also in writing.", failure: "Do not rely on “I told the team.” Do not send important changes as a screenshot, a voice note or a hallway comment.", next: "After your next meeting or one-on-one, send a three-line summary: what was decided, who owns it, by when. Keep doing it." },
          { type: "statement", body: "Every access practice you make standard is one less thing a person has to disclose to get. A team where nobody needs to ask for the basics is a team where asking for more is easy." },
          { type: "flashcards", heading: "Small habits, large effects", cards: [
            { front: "Agenda two days ahead", back: "<p>Lets people who process more slowly, use assistive technology, or need to plan energy come prepared. Also produces better meetings.</p>" },
            { front: "More than one way in", back: "<p>Written comments before, chat during, follow-up after. Includes people with speech, hearing, anxiety or processing differences without anyone identifying themselves.</p>" },
            { front: "Notice rule for changes", back: "<p>“Changes inside three days need your agreement.” Turns scheduling from something done to people into something done with them.</p>" },
            { front: "Standing question", back: "<p>“Is anything about how we work getting in the way?” Asked every one-on-one, it becomes ordinary, and answers arrive when people are ready.</p>" },
          ] },
          { type: "knowledgeCheck", id: "inclusive-supervision-and-team-culture-5-check", question: "Which change does most to include staff with non-apparent disabilities without requiring anyone to disclose?", options: [
            { text: "Inviting staff with disabilities to a separate meeting about their needs.", correct: false },
            { text: "Making agendas in advance, captions, multiple ways to contribute and written decisions the standard for every meeting.", correct: true },
            { text: "Asking each person privately whether they have a condition the supervisor should plan around.", correct: false },
          ], feedbackCorrect: "Yes. Standard practice removes the barrier for everyone and removes the need to disclose to get the basics.", feedbackIncorrect: "Two options require people to identify themselves to get access. The design change does not." },
          { type: "text", heading: "Take it to your work", body: "<p>Before a posting goes out, give it an <a href=\"/practice/gp-12\">Equity Pause</a>. For the whole selection, the <a href=\"/practice/gp-6\">inclusive hiring path</a> takes a position from requirements to offer with your human resources partner.</p>" },
        ],
      },
    ],
  },
  jobAid: {
    title: "Inclusive supervision in practice",
    subtitle: "What a supervisor controls when disability, disclosure or fluctuating capacity is part of the picture",
    quote: "Hold the result. Negotiate the method. Talk about the work, never the diagnosis.",
    use: {
      purpose: "Keep the supervisor’s role clear in the moments that matter: a request, a disclosure, a comment, a performance concern.",
      remember: ["Nobody owes you a diagnosis. You may discuss the work and offer the accommodation route; you may not ask, guess or share.", "Offer flexibility as a standard so most people never have to ask, and answer requests in terms of the work they enable.", "Answer comments about “special treatment” in the room, without disclosing anyone’s reason.", "Fairness is the same standard for the result, honest flexibility about method and timing, and no silent lowering or silent punishing."],
      doNext: "Choose one routine, one myth and one conversation from this course and act on each within the month.",
    },
    sections: [
      { heading: "When someone discloses", items: ["Thank them. Ask what would help, now or later. Accept “nothing right now.”", "Say who will know and keep to it, including with your own manager.", "Offer the accommodation process without insisting. Return to ordinary work."] },
      { heading: "When a comment lands badly", items: ["Pause: “Let me pick that up for a second.”", "Name the impact or the fact, not the person. Restate the standard: we measure the work.", "Offer the same door to everyone. Move on; follow up privately if it continues.", "Never defend an arrangement by explaining its medical reason."] },
      { heading: "Before a performance conversation", items: ["Write the essential result and the dated work facts you observed.", "List what the team can change: priority, sequence, notice, backup, timing.", "Agree an early-warning practice for difficult weeks and when you will review.", "Involve human resources, the ADA coordinator or labor relations before any formal step."] },
      { heading: "Interviewing and selecting", items: ["Test each requirement three ways before posting: which task needs it, could someone learn it in the first months, and what shows it predicts success rather than habit.", "Give every candidate the questions in writing at the start, a quiet room or a video platform with captions on, water and a break, and accommodations without asking for a diagnosis.", "Ask about past situations, the same core questions for everyone; follow-up questions only to clarify, and used the same way with each person.", "Three interviewers or more, at least one outside the reporting line, each scoring alone against criteria written before the first interview, then comparing scores and evidence.", "References answer the same questions about the same essential work, documented with examples rather than impressions.", "Decisions rest on the scores and the evidence, not on fit or a feeling, and the record shows why."] },
    ],
  },
  sources: [
    { title: "Job Accommodation Network", href: "https://askjan.org/", note: "Employer-focused guidance on accommodations, the interactive process, and survey findings on the low cost and reported benefits of accommodations." },
    { title: "U.S. Equal Employment Opportunity Commission", href: "https://www.eeoc.gov/", note: "Federal guidance on reasonable accommodation, limits on disability-related inquiries, and confidentiality of medical information in employment." },
    { title: "ADA National Network", href: "https://adata.org/", note: "Plain-language information and training resources on employment rights and responsibilities under the Americans with Disabilities Act." },
    { title: "U.S. Department of Labor, Office of Disability Employment Policy", href: "https://www.dol.gov/agencies/odep", note: "Policy and employer resources on inclusive workplaces, flexible work and retention of employees with disabilities." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "Minnesota-specific guidance and technical assistance on disability rights, access and inclusive practice." },
    { title: "Centers for Disease Control and Prevention, Disability Inclusion", href: "https://www.cdc.gov/disability-inclusion/about/index.html", note: "Definition of disability inclusion and context on the range of visible and non-apparent disabilities in any workforce." },
  ],
};

export default pack;
