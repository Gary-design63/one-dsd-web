import type { CoursePack } from "../../source-types";

// Disability Inclusion, Foundations, Module 5: Allyship, Accountability and Everyday Action.
// Program-authored course for every employee, board member, volunteer, contractor and new hire.
const pack: CoursePack = {
  course: {
    id: "di-allyship-and-everyday-action",
    indexNumber: 1105,
    seriesLabel: "Disability Inclusion · Foundations",
    title: "Allyship, Accountability and Everyday Action",
    subtitle: "Notice ableism in ordinary assumptions, interrupt exclusion without speaking over anyone, build access into what you already own, and know how to escalate when a barrier is not yours to fix.",
    scope: "For everyone: staff, board members, volunteers, contractors and new hires. Four short lessons on recognizing everyday ableism, responding when exclusion happens, acting with rather than for disabled people, and escalating accessibility concerns through the right office. Participation in this program is voluntary and does not replace required training.",
    treatment: "Four short lessons with scenarios, a sorting exercise, scripts, a team commitment card, flashcards and knowledge checks",
    duration: "45–55 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/acceptance-in-dhs-work.jpg",
    coverAlt: "A woman looks out a window in a government office.",
    introTranscript: "Ableism in a workplace rarely looks like hostility. It looks like a default nobody questioned, a joke nobody objected to, a request treated as a favor, and a disabled colleague who has explained the same barrier three times. This course is about what you do in those moments. You will learn to see the assumption before it becomes a design, to say something short and specific when exclusion happens, to act with disabled people instead of for them or instead of them, and to move a concern to the office that can resolve it. It ends where the Foundations level ends: with one routine you will make more accessible in the next thirty days.",
    kind: "course",
    contentType: "foundation",
    learning: {
      objectives: [
        "Identify ableism in everyday assumptions, language and workplace practices, including practices that look neutral.",
        "Respond constructively when exclusion occurs, in a meeting, in writing or in a service interaction, with a short, specific, design-focused interruption.",
        "Describe what it means to act with rather than for or instead of disabled people, and take an appropriate first step without requiring disclosure or speaking over anyone.",
        "Describe how to escalate an accessibility concern: what to fix yourself, whom to tell, which office owns which kind of concern, and how to keep a record.",
        "Write one specific commitment to make a routine task, meeting, document or interaction more accessible within thirty days.",
      ],
      evidence: [
        "A sorting exercise and four knowledge checks with explanations of why an answer reflects allyship or falls short of it.",
        "A scenario decision in each lesson, reconsidered without a personal score.",
        "One written commitment naming a routine you own, the change you will make, and the colleague who will ask you about it.",
      ],
      appliedNextStep: "Make one routine task, meeting, document or interaction more accessible in the next thirty days, tell the people it affects what changed, and find out the escalation route in your unit before you need it.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Change in ADA, Section 504 or Section 508 guidance", "Change in DHS accessibility or language access standards", "Feedback from disabled staff or participants that a scenario reads as unrealistic or stigmatizing"],
      relatedDoor: "Accommodation requests go to human resources or the ADA coordinator; digital and document accessibility to the accessibility team; buildings to facilities; discrimination or retaliation concerns to the civil rights office; this course shows you the routes, it does not replace them.",
      toolkitQuestion: "What assumption is built into this default, who carries its cost, what will I fix myself, and whom will I tell in writing about the rest?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "allyship-and-everyday-action-1",
        number: 1,
        title: "Seeing everyday ableism",
        summary: "Learn to recognize ableism where it usually lives: in defaults treated as neutral, requests treated as favors, competence judged from appearance, and stories told for a nondisabled audience.",
        minutes: 12,
        learning: {
          objective: "Identify ableism in everyday assumptions, language and workplace practices, including practices that appear neutral, and restate each as the barrier it creates.",
          takeaways: [
            "Ableism is the assumption that nondisabled bodies and minds are the standard and everything else is an exception to be managed. It lives in defaults more than in insults.",
            "Common forms in a workplace: the request treated as a favor, the “you do not look disabled” reaction, productivity norms built on one kind of body, the inspiration story, and the joke that uses disability as the punchline.",
            "The test for a practice is not whether anyone meant harm; it is who has to ask, disclose, wait or absorb a cost that others do not.",
          ],
          evidence: "A completed sort of assumptions and barrier statements and a knowledge check.",
          appliedNextStep: "List three defaults in your unit that everyone treats as neutral, and for each, write who has to ask or adapt because of it.",
        },
        scenario: {
          context: "A team is choosing a new team-building activity. Someone proposes an escape room followed by a walk to a restaurant. A colleague who has a chronic illness that limits her energy has not said anything. Another colleague says, “She can just come for the dinner part if she is not up to it.”",
          prompt: "What is the ableist assumption, and what would an ally do?",
          options: [
            { label: "There is no problem; giving her the option to skip part of it is considerate.", response: "The assumption is that the activity is fixed and the person is the variable. Offering someone half of a team event, decided for her, is exclusion with a kind face." },
            { label: "Name that the plan was built around one kind of body and energy, and suggest the team choose an activity everyone can fully take part in, asking the whole team, not just her, what would work.", response: "This puts the design on the table instead of the colleague, and asks everyone so she is not singled out or made to disclose.", recommended: true },
            { label: "Quietly ask the colleague afterward whether the plan is a problem for her.", response: "Better than nothing, and it still makes her the one who must object, privately, to a plan that has already gathered momentum. The design should change before it needs her permission." },
          ],
        },
        transfer: {
          prompt: "Which default in your unit will you look at differently this week?",
          options: ["Pick one routine, a meeting time, a room, a tool, an event or a form, and write who has to ask or adapt because of it", "Notice one moment when a request is treated as a favor and name it as an access need", "Catch one inspiration or overcoming frame in something your unit writes and rewrite it around the work"],
        },
        blocks: [
          { type: "text", heading: "What ableism looks like on a normal day", body: "<p><strong>Ableism</strong> is the set of assumptions that treat nondisabled bodies and minds as the standard and everyone else as an exception to be managed. Almost nobody in a public agency thinks of themselves as ableist, and almost every public agency runs on ableist defaults, because the defaults were set by and for people who did not have to think about them. The stairs are the default and the ramp is the extra. The ninety-minute meeting is the default and the break is the request. The phone line is the default and the relay call is the odd one. None of this requires a bad person. It requires only that nobody ask who the default leaves out.</p><p>Once you know where to look, the everyday forms are recognizable. The <strong>request treated as a favor</strong>: a colleague asks for the agenda in advance and is told “we will see what we can do,” as if a document that exists were a gift. The <strong>appearance test</strong>: “You do not look like you need that,” which puts a person in the position of proving a disability to get a chair. <strong>Productivity norms built on one kind of body</strong>: a workload that assumes nobody has appointments, flare-ups or a commute by paratransit that cannot be moved at the last minute. The <strong>inspiration story</strong>: a disabled colleague’s ordinary competence framed as courage. The <strong>joke</strong>: “I am so OCD about my desk,” “that meeting was insane,” “are you blind?” The <strong>competence assumption</strong>: speaking slowly and loudly to a wheelchair user, or explaining to a blind colleague something they said first. And the one that costs the most: the <strong>repeated explanation</strong>, where a disabled person has to educate the same organization about the same predictable barrier, meeting after meeting, year after year.</p><p>The test to carry with you is not whether anyone meant harm. It is <strong>who has to ask, disclose, wait or absorb a cost that others do not</strong>. When the answer is “the disabled person, again,” you have found ableism, however polite the room.</p>" },
          { type: "list", heading: "Eight everyday forms", items: ["The default treated as neutral: the room, the time, the tool, the format that “everyone” uses.", "The request treated as a favor: an access need answered with “we will see.”", "The appearance test: “You do not look disabled.”", "Productivity norms built on one kind of body and one kind of week.", "The inspiration frame: ordinary competence described as courage.", "Disability as a punchline or an insult: “crazy,” “lame,” “blind to,” “OCD about.”", "The competence assumption: slowing down, speaking up, explaining back, deciding for.", "The repeated explanation: the same person educating the same organization about the same barrier."] },
          { type: "leaderMove", heading: "Ask who the default leaves out", control: "You control whether a routine in your unit is examined for who it excludes or defended because it has always been that way.", failure: "Do not answer “who does this leave out?” with “nobody has complained.” People who expect a barrier stop asking; silence is not consent.", next: "Choose one default this week, ask the question out loud in your team, and write down the answer." },
          { type: "sorting", id: "allyship-and-everyday-action-1-sort", heading: "Ableist assumption, or barrier named?", categories: ["Ableist assumption", "Barrier named"], items: [
            { text: "If he needed extra time he would have said something by now.", category: "Ableist assumption" },
            { text: "Our timed quiz gives everyone the same ten minutes, which excludes people who read with a screen reader.", category: "Barrier named" },
            { text: "She is so brave to keep working with her condition.", category: "Ableist assumption" },
            { text: "The stand-up is unscripted and in front of thirty people, and the employee has asked for a written option.", category: "Barrier named" },
            { text: "We cannot plan for every possible disability, so we plan for the average person.", category: "Ableist assumption" },
            { text: "The intake line has no relay or text option, so people who cannot use voice cannot reach us.", category: "Barrier named" },
          ] },
          { type: "flashcards", heading: "Words for what you are seeing", cards: [
            { front: "Ableism", back: "<p>The assumptions and practices that treat nondisabled bodies and minds as the standard and everyone else as an exception. Lives in defaults more than insults.</p>" },
            { front: "The neutral default", back: "<p>A room, time, tool or format nobody chose on purpose, that everyone treats as natural, and that some people cannot use. The most common form of ableism in an office.</p>" },
            { front: "The appearance test", back: "<p>Judging whether someone deserves access by whether they look disabled. Most disabilities are non-apparent; the request is the information.</p>" },
            { front: "The repeated explanation", back: "<p>When a disabled person must educate the same organization about the same predictable barrier again and again. Allies carry this so the person does not have to.</p>" },
            { front: "The cost test", back: "<p>Who has to ask, disclose, wait or absorb a cost that others do not? If the answer is the disabled person, again, the practice is ableist regardless of intent.</p>" },
          ] },
          { type: "knowledgeCheck", id: "allyship-and-everyday-action-1-check", question: "A unit schedules all staff meetings at 8:00 a.m. because “that is when everyone is fresh.” An employee who relies on paratransit, which cannot guarantee arrival before 8:30, keeps missing the first half hour and has been told to “try to plan ahead.” What is the ableist assumption?", options: [
            { text: "That paratransit is unreliable.", correct: false },
            { text: "That the 8:00 start is neutral and the employee is the variable, when the schedule was built around people who control their own arrival time and the employee is being asked to absorb a cost others do not.", correct: true },
            { text: "That staff meetings need to be early.", correct: false },
          ], feedbackCorrect: "Yes. The schedule is a default that excludes someone predictably. Moving it, or recording and sharing the first half hour, is the fix; “plan ahead” is not.", feedbackIncorrect: "Apply the cost test. Who is being asked to adapt, and could the design change instead? The employee cannot move paratransit; the unit can move the meeting." },
        ],
      },
      {
        id: "allyship-and-everyday-action-2",
        number: 2,
        title: "Responding when exclusion happens",
        summary: "Practice the short, specific, design-focused interruption, in a meeting, in writing and in a service interaction, and learn what to do afterward so the person affected is supported rather than put on the spot.",
        minutes: 12,
        learning: {
          objective: "Respond constructively when exclusion occurs by naming the barrier briefly and specifically, aiming at the design rather than the person, and following up without adding to the affected person’s load.",
          takeaways: [
            "A constructive interruption is short, specific and aimed at the design: “Let’s pause. Is this accessible to everyone who needs it?” It asks a question the room has to answer.",
            "Call people in, not out: assume the exclusion was unexamined, describe what it does, and ask for the change. Shame closes conversations; specifics open them.",
            "Afterward, check in with the affected person without asking them to process it for you, and follow through on the fix so it does not become their job.",
          ],
          evidence: "A scenario decision about a planning meeting and a knowledge check on written responses.",
          appliedNextStep: "Choose your interruption sentence, practice saying it once, and use it the next time a design passes through a meeting unexamined.",
        },
        scenario: {
          context: "In a planning meeting for a new provider portal, a project lead says the training will be “a live webinar, no recording, so people actually show up,” and adds, “if someone cannot make it they can get the gist from a coworker.” A Deaf colleague on the project team is present, as is a colleague with a chronic condition that makes fixed times hard. Neither speaks.",
          prompt: "What is the ally move?",
          options: [
            { label: "Say nothing in the meeting and email the project lead afterward with your concerns.", response: "The decision leaves the meeting on the record. A private email may help later, but the exclusion was public and the correction is more useful in the same room." },
            { label: "Say: “Let’s pause on that. A live-only session with no recording excludes people who need captions checked, who cannot attend at that time, or who process information at their own pace. Can we plan captions or CART, a corrected recording with a transcript, and materials in advance before we commit?”", response: "Short, specific, aimed at the design, and it asks for a decision. It does not ask either colleague to speak for themselves or for all disabled people.", recommended: true },
            { label: "Turn to your Deaf colleague and say, “This would be a problem for you, right? Can you explain why?”", response: "This puts a person on the spot to educate the room, requires them to speak as a representative, and hands them the labor the ally should carry." },
          ],
        },
        transfer: {
          prompt: "Which interruption will you have ready this week?",
          options: ["Write your own version of “Let’s pause. Is this accessible to everyone who needs it?” in words you would actually say", "Identify one recurring meeting where designs pass unexamined and plan to ask the question there", "Decide how you will check in with an affected colleague afterward without asking them to reassure you"],
        },
        blocks: [
          { type: "text", heading: "Short, specific, aimed at the design", body: "<p>Most exclusion in a workplace passes because the moment to say something is short and the sentence is not ready. So have the sentence ready. The one this program uses is: <strong>“Let’s pause. Is this accessible to everyone who needs it?”</strong> It works because it is brief, it does not accuse anyone, and it asks a question the room has to answer. Follow it with the specific barrier and the specific ask: what the design does, whom it stops, what would fix it. “A live-only session with no recording excludes people who cannot attend at that time or who need corrected captions; can we plan a recording and a transcript before we commit?” The whole intervention takes fifteen seconds and changes the decision.</p><p>The tone matters. <strong>Calling in</strong> assumes the exclusion was unexamined rather than intended, describes what it does rather than what it says about the speaker, and asks for the change. It leaves people room to say “good point” and move. Calling out, with sarcasm or a lecture, makes the speaker defensive, makes the room uncomfortable, and often makes the disabled colleague the subject of a scene they did not ask for. You are not trying to win the exchange. You are trying to change the design, this time and next time.</p><p>Two things not to do. Do not soften the point into a preference question, “would anyone like captions?”, because access is not a preference and the question invites a no. And do not turn to the disabled person in the room for confirmation or explanation. Allies carry the load; they do not hand it back. If a colleague wants to add their own view, they will. Afterward, check in briefly and privately: “I named the recording issue; let me know if I got it wrong or if there is something else I should push for.” Then follow through on the fix, because an interruption that changes nothing is theater.</p>" },
          { type: "tabs", heading: "Three settings, three scripts", tabs: [
            { label: "In a meeting", body: "<p>“Let’s pause. Is this accessible to everyone who needs it?” Then the specific barrier and the specific ask. If the answer is “we will handle it later,” ask who and by when, and write it in the notes.</p><p>For a joke or slur: “Can we not use that word? It is a disability term and it lands badly.” Once, without a lecture, then move on.</p>" },
            { label: "In writing", body: "<p>Reply to the thread, not only to the sender, when the decision was made on the thread. “Before this goes out: the agenda is a scanned image and there is no access-needs line. I have attached a text version and a suggested line; can we use those?” Bring the fix with the concern whenever you can.</p><p>Do not correct someone’s language for an entire distribution list. Do that privately, briefly, and once.</p>" },
            { label: "In a service interaction", body: "<p>When a colleague speaks to a companion instead of the participant, redirect by modeling: turn to the participant and ask them the question. If a colleague is rushing a caller with a speech disability, offer to take the queue so they can slow down, and raise the staffing pattern with the supervisor afterward.</p><p>When a participant is being excluded by a policy in front of you, say what you can do now, and record the barrier for the policy owner.</p>" },
          ] },
          { type: "leaderMove", heading: "Interrupt the design, not the person", control: "You control whether an exclusionary decision passes through a room you are in unremarked.", failure: "Do not make your disabled colleague the one who has to object. Do not turn to them for confirmation. Do not soften access into a preference.", next: "Say the sentence once this week and wait for an answer. Then make sure the fix has an owner in the notes." },
          { type: "accordion", heading: "When it does not go smoothly", items: [
            { title: "“We do not have time for that.”", body: "<p>“Understood. Then let’s note the barrier and who owns the fix, and decide now what we will tell people who cannot use this version.” A recorded decision to exclude is harder to make than an unrecorded one.</p>" },
            { title: "“Nobody has ever asked.”", body: "<p>“People who expect a barrier usually do not ask; they stay away or work around it. Building it in is how we find out who we have been missing.”</p>" },
            { title: "“You are being too sensitive.”", body: "<p>Do not argue about your sensitivity. Return to the design: “Maybe. The recording still costs nothing and includes people the live session does not.”</p>" },
            { title: "You got it wrong", body: "<p>If the disabled colleague tells you afterward that you misread the situation or spoke for them, thank them, adjust, and do not make them reassure you. Being corrected is part of doing this.</p>" },
            { title: "Nothing changed", body: "<p>An interruption that produced a promise and no action becomes an escalation. Lesson 4 covers the route. Keep your note of what was said and when.</p>" },
          ] },
          { type: "quote", text: "The best thing a colleague ever did for me was say “wait, is this captioned?” before I had to. Not because I could not have said it. Because I had said it forty times, and this time I did not have to be the one.", cite: "Composite staff perspective, illustrative" },
          { type: "flashcards", heading: "The interruption, in parts", cards: [
            { front: "The pause", back: "<p>“Let’s pause.” Two words that make room. Nobody is accused; the decision is simply not final yet.</p>" },
            { front: "The question", back: "<p>“Is this accessible to everyone who needs it?” A question the room has to answer, not an opinion the room can dismiss.</p>" },
            { front: "The specific", back: "<p>What the design does, whom it stops, what would fix it. Vague concern is easy to defer; a named barrier with a named fix is not.</p>" },
            { front: "Calling in", back: "<p>Assume unexamined, not malicious. Describe the effect, ask for the change, leave room to say yes. You are changing a design, not winning a point.</p>" },
            { front: "Afterward", back: "<p>Brief private check-in with the affected colleague, no request for reassurance, and follow-through on the fix so it does not become their job.</p>" },
          ] },
          { type: "knowledgeCheck", id: "allyship-and-everyday-action-2-check", question: "A colleague sends an all-staff email announcing a mandatory in-person training in a room you know is reached only by stairs. Which response reflects the approach in this lesson?", options: [
            { text: "Reply all: “Once again nobody thought about accessibility. This is unacceptable.”", correct: false },
            { text: "Reply to the sender and the training owner: “Before registrations open, the room is stairs-only. Room 110 is step-free and available that day; can we move it and add an access-needs line? Happy to update the notice.”", correct: true },
            { text: "Forward the email to a disabled colleague and ask whether it is a problem for them.", correct: false },
          ], feedbackCorrect: "Yes. Specific barrier, specific fix, sent to the people who can act, with an offer to help. Nobody is shamed and nobody is put on the spot.", feedbackIncorrect: "Aim at the design, bring the fix, and do not hand the labor to a disabled colleague. A public rebuke changes the mood, not the room." },
        ],
      },
      {
        id: "allyship-and-everyday-action-3",
        number: 3,
        title: "Acting with, not for",
        summary: "Understand what disabled people have asked of allies, take a first step that does not require anyone to disclose, and build access into the things you already own so nobody has to ask.",
        minutes: 12,
        learning: {
          objective: "Describe what it means to act with rather than for or instead of disabled people and take a first step that builds access into something you own without requiring disclosure or speaking over anyone.",
          takeaways: [
            "Allyship means acting with disabled people: following their lead, amplifying rather than replacing their voices, and carrying labor they should not have to carry, without deciding for them.",
            "Nobody should have to disclose a disability to deserve an accessible environment; build access into planning so the request is never required.",
            "Do not ask a disabled colleague to speak for all disabled people, review your work for free or be your accessibility department. Where you need lived-experience advice, ask properly and compensate it.",
          ],
          evidence: "A scenario decision about an advisory request and a knowledge check on acting with rather than for.",
          appliedNextStep: "Choose one thing you own, a template, a standing meeting, a form or a checklist, and build access into it this week so the next person does not have to ask.",
        },
        scenario: {
          context: "Your unit is redesigning its intake checklist. A manager says, “Let’s have Ahmed look it over; he uses a screen reader, so he will catch anything.” Ahmed is a case aide on another team with a full caseload and has not been asked.",
          prompt: "What is the ally move?",
          options: [
            { label: "Go along with it; Ahmed’s perspective is exactly what the checklist needs.", response: "His perspective may be valuable, and this treats him as an unpaid accessibility department, assumes he wants the role, and makes the team’s accessibility depend on one colleague’s goodwill." },
            { label: "Suggest the team do its own accessibility checks first and route the checklist to the accessibility team for review, and if lived-experience input is wanted, ask Ahmed properly, with the choice to decline, time carved out of his workload, and recognition for the contribution.", response: "The team carries its own basic work, the responsible office does the specialist review, and any request to a disabled colleague is a real invitation rather than an assignment.", recommended: true },
            { label: "Ask Ahmed’s supervisor to assign him the review so it is official.", response: "Making it official without asking him makes it worse. It converts one colleague’s disability into a standing duty he never chose." },
          ],
        },
        transfer: {
          prompt: "What will you build access into this week, so nobody has to ask?",
          options: ["Add the access-needs line, materials-in-advance commitment and captions-on default to a template you own", "Put a line for interpretation, CART and accessible formats into the next budget or event plan you touch", "Stop one habit of asking a disabled colleague to check your work, and use the accessibility team instead"],
        },
        blocks: [
          { type: "text", heading: "With, not for, not instead of", body: "<p>The disability rights movement’s phrase, <strong>nothing about us without us</strong>, was a response to a long history of things being done <em>for</em> disabled people by people who did not ask: institutions built for them, decisions made on their behalf, charity offered in place of rights. Allyship in that tradition means acting <strong>with</strong>: following the lead of disabled people about what they need, amplifying their voices instead of replacing them, and carrying labor they should not have to carry, without deciding for them. It is a discipline of doing the work and not taking the microphone.</p><p>In a workplace that translates into a few habits. <strong>Build access into planning</strong> rather than waiting for a request: the access-needs line, the accessible template, captions on by default, a budget line for interpretation and CART, a room chosen for its path of travel. When access is built in, nobody has to disclose a disability to get it, which matters because <strong>nobody should have to disclose a disability to deserve an accessible environment</strong>. Many disabilities are non-apparent, disclosure carries real risk, and a person who has to ask has already been told the room was not planned for them.</p><p><strong>Do not make disabled colleagues your accessibility department.</strong> Asking the one blind colleague to check every document, the one Deaf colleague to vet every video, or the one colleague with a chronic illness to speak for “what people with disabilities want” is a common and exhausting form of extraction. It treats a person’s disability as a service they owe the organization. The team can learn the basic checks; the accessibility team exists for specialist review. Where lived-experience advice is genuinely needed, ask as you would ask any expert: with a real choice to say no, time made available, and recognition or compensation where program rules allow. And when a disabled colleague does speak, the ally’s job is to make sure they were heard and credited, not to restate their point as if it were new.</p>" },
          { type: "list", heading: "First steps that do not require anyone to disclose", items: ["Add an access-needs line and a named contact to every invitation template you own.", "Turn captions on by default and send materials three working days ahead, every time.", "Put interpretation, CART and accessible formats into the budget and the event plan before anyone asks.", "Book rooms by path of travel and evacuation route, and keep a list of the ones that pass.", "Learn the basic document checks yourself and use the accessibility team for the rest.", "When someone asks for an access change, say yes to what you control and route the rest without asking why.", "Credit disabled colleagues’ ideas by name and make sure they were heard before the meeting moves on."] },
          { type: "leaderMove", heading: "Carry the load, do not take the microphone", control: "You control whether you do the accessibility work yourself, hand it to a disabled colleague, or take credit for what they said.", failure: "Do not volunteer a disabled colleague as a reviewer, representative or example. Do not restate their point in your own words as if it were yours.", next: "This week, build one access feature into something you own, and if you want lived-experience input, ask properly with a real choice to decline." },
          { type: "artifact", kind: "plain-language-flyer", label: "Practical artifact", title: "Access is built in: a team commitment card", summary: "Four commitments a team can post and keep, so access does not depend on who asks.", fields: [
            { label: "Before we invite", value: "Every invitation has an access-needs line, a named contact and a date. Materials go out in accessible formats at least three working days ahead. Captions are on." },
            { label: "Before we book", value: "Rooms are chosen for a step-free path, an accessible restroom on the same floor, and an evacuation route that works for everyone. Interpretation, CART and formats are in the budget." },
            { label: "When someone asks", value: "We say yes to what we control, route the rest the same day, and never ask why. Nobody has to disclose a disability to get access here." },
            { label: "How we learn", value: "We do our own basic checks and use the accessibility team for review. We do not make disabled colleagues our reviewers. When we ask for lived-experience advice, it is a real invitation, with time and recognition." },
          ], action: "Bring the card to your next team meeting, adjust the wording to your unit, and post it where you plan events and send invitations." },
          { type: "flashcards", heading: "Allyship, in practice", cards: [
            { front: "Nothing about us without us", back: "<p>Decisions affecting disabled people are made with their participation and leadership. In a team, it means asking properly and following the lead, not deciding on their behalf.</p>" },
            { front: "Acting with", back: "<p>Doing the work, amplifying rather than replacing, carrying labor that should not fall on disabled colleagues, and not taking the microphone.</p>" },
            { front: "No disclosure required", back: "<p>Access built into planning means nobody has to reveal a disability to get it. Disclosure carries risk; a built-in feature carries none.</p>" },
            { front: "The unpaid accessibility department", back: "<p>Asking the disabled colleague to check everything. Learn the basics, use the accessibility team, and invite lived-experience advice like any expertise, with choice and recognition.</p>" },
            { front: "Amplify", back: "<p>When a disabled colleague raises a point, make sure it was heard and credited. Do not repeat it as your own idea, and do not let the room move on past it.</p>" },
          ] },
          { type: "knowledgeCheck", id: "allyship-and-everyday-action-3-check", question: "Which action best reflects acting with, rather than for or instead of, disabled colleagues?", options: [
            { text: "Speaking up on behalf of a disabled colleague in a meeting she is attending, before she has had a chance to speak, so she does not have to.", correct: false },
            { text: "Adding captions-on, materials-in-advance and an access-needs line to your team’s standing meeting template, and asking the accessibility team, not a disabled colleague, to review your new form.", correct: true },
            { text: "Asking the one wheelchair user in your unit to represent people with disabilities on the facilities committee.", correct: false },
          ], feedbackCorrect: "Yes. Access built in without disclosure, the work carried by the team, and the specialist review routed to the office that owns it.", feedbackIncorrect: "Speaking instead of someone and volunteering someone as a representative both take the microphone. Acting with builds access into what you own and asks properly." },
        ],
      },
      {
        id: "allyship-and-everyday-action-4",
        number: 4,
        title: "Escalating, and following through",
        summary: "Know the ladder for an accessibility concern, which office owns which kind of issue, how to keep a record that gets things fixed, and write the thirty-day commitment that closes the Foundations level.",
        minutes: 12,
        learning: {
          objective: "Describe how to escalate an accessibility concern, including what to fix yourself, whom to tell, which office owns which issue and how to keep a record, and write one specific thirty-day commitment.",
          takeaways: [
            "The ladder: fix what is yours, tell the owner specifically, use the responsible office, and keep the record. Do not let a concern sit in an inbox.",
            "Different concerns have different doors: accommodation requests, digital and document standards, buildings, and discrimination or retaliation each go to a different office. Knowing the doors in advance is part of the job.",
            "A record is what turns one person’s experience into a pattern the organization can see. Write down the barrier, the date, whom you told and what happened.",
          ],
          evidence: "A scenario decision about a stalled fix, the final knowledge check for the course, and a written thirty-day commitment.",
          appliedNextStep: "Find the escalation routes in your unit, write them where your team can find them, and make your thirty-day commitment to someone who will ask you about it.",
        },
        scenario: {
          context: "Six weeks ago you told the owner of your division’s online form that its file upload is drag-and-drop only and the timeout is five minutes. The owner said “good catch, we will fix it.” Nothing has changed. This week a participant who uses voice control could not submit the form and missed a deadline.",
          prompt: "What do you do now?",
          options: [
            { label: "Remind the owner again and give them another few weeks; they are busy.", response: "Six weeks and a missed deadline is past the point of reminders. The barrier now has a documented harm, and the owner’s promise did not remove it." },
            { label: "Make sure the participant has an immediate path today, then escalate in writing to the owner’s supervisor and the accessibility team with the original date, the promise, the harm this week and the specific fix, and ask for a completion date.", response: "Immediate access for the person, a written escalation with the record attached, the right offices copied, and a date requested. This is the ladder working as intended.", recommended: true },
            { label: "Post in the all-staff channel that the form is inaccessible so people know to warn participants.", response: "A warning is not a fix, and a public post without the owner and the responsible office is unlikely to produce one. Escalate to the people who can act." },
          ],
        },
        transfer: {
          prompt: "In the next thirty days, which routine task, meeting, document or interaction will you make more accessible, and how?",
          options: ["Write the commitment in one sentence and tell a colleague who will ask you about it", "Write the escalation routes in your unit where your team can find them", "Start a simple record: barrier, date, whom you told, what happened"],
        },
        blocks: [
          { type: "text", heading: "The ladder, and the doors", body: "<p>Most accessibility barriers get fixed by the person who created them, once they know. So the ladder starts close to home. <strong>Fix what is yours</strong>: if you own the document, meeting, form or setting, fix it now and note what changed. <strong>Name it to the owner</strong>: if someone else owns it, tell them in writing what the barrier is, whom it stops, what would fix it, and by when it matters. Most barriers are unintentional, and a specific note gets a better response than a general complaint. <strong>Use the responsible office</strong>: when a standard, a building, a system or a request is involved, or when the owner does not act, route it to the office that owns that kind of issue, with your note attached. <strong>Keep the record</strong>: write down the barrier, the date, whom you told and what happened. Patterns are how systems get fixed, and a record is what turns one person’s bad afternoon into a pattern the organization can see.</p><p>The doors are different for different concerns, and knowing them in advance is part of the job. An <strong>accommodation request</strong>, from an employee or an applicant, goes to human resources or the ADA coordinator; your role is to say yes to what you control and route the rest promptly, without asking for a diagnosis. <strong>Digital and document accessibility</strong>, a form platform, a website, a template, the state accessibility standard, goes to the accessibility team. <strong>Building and evacuation</strong> issues go to facilities and safety. <strong>Effective communication</strong> for the public, interpreters, CART, accessible formats, goes to the accessibility or language access team. And when a concern is about <strong>discrimination, harassment or retaliation</strong>, whether toward staff or toward a member of the public, it goes to the civil rights office, and it is not yours to investigate or to talk someone out of. Retaliation against a person for raising an access or discrimination concern is itself prohibited; if you see it, that goes through the same door.</p><p>Escalation is not disloyalty. A concern that sits in an inbox while a participant misses a deadline is the failure; moving it up with a clear record is the fix. Do it calmly, in writing, with the specifics, and ask for a date.</p>" },
          { type: "list", heading: "The escalation ladder", ordered: true, items: ["Provide an immediate path for anyone affected right now.", "Fix what is yours and note what changed.", "Tell the owner in writing: barrier, whom it stops, the fix, the date it matters.", "If nothing happens by the date, escalate to the owner’s supervisor and copy the responsible office, with your original note attached.", "Route standards, buildings, systems, requests and civil-rights concerns to the office that owns them, from the start.", "Keep the record: barrier, date, whom you told, what happened. Check back on the promised date."] },
          { type: "accordion", heading: "Which door", items: [
            { title: "An employee or applicant asks for an accommodation", body: "<p>Human resources or the ADA coordinator. Say yes to what you control, route the request the same day, and do not ask for a diagnosis or decide the outcome yourself. Keep the conversation confidential.</p>" },
            { title: "A form, website, template or platform is not accessible", body: "<p>The accessibility team, who can advise on the state accessibility standard, remediation and procurement. Send the specific barrier and, if you can, the steps to reproduce it.</p>" },
            { title: "A building, room, route or evacuation plan has a barrier", body: "<p>Facilities and safety. Describe the location, the barrier and whom it stops. For evacuation gaps, say so plainly; they are safety issues, not comfort issues.</p>" },
            { title: "A member of the public needs an interpreter, CART or another format", body: "<p>The accessibility or language access team, as early as possible. Primary consideration goes to what the person says works for them.</p>" },
            { title: "Someone was treated worse because of a disability, or punished for raising a concern", body: "<p>The civil rights office. This is not yours to investigate, mediate or discourage. Retaliation for raising an access or discrimination concern is itself prohibited and goes through the same door.</p>" },
            { title: "You are not sure which door", body: "<p>Start with the accessibility team or the ADA coordinator and say you are not sure. Being routed once is better than a concern that never moves.</p>" },
          ] },
          { type: "leaderMove", heading: "Do not let it sit in an inbox", control: "You control whether a barrier you found gets a written note, an owner and a follow-up date, or a hallway mention that fades.", failure: "Do not accept “we will fix it” as the end. Do not investigate a discrimination concern yourself, and do not tell someone their concern is probably nothing.", next: "Write down the escalation routes for your unit this week, and check back on the date for every open barrier in your record." },
          { type: "quote", text: "I do not need anyone to be angry for me. I need someone to write it down, send it to the person who can change it, and check whether they did.", cite: "Composite participant perspective, illustrative" },
          { type: "flashcards", heading: "Escalation essentials", cards: [
            { front: "The ladder", back: "<p>Immediate path, fix what is yours, tell the owner in writing, escalate with the record, route to the responsible office, keep the record and check back.</p>" },
            { front: "A good note to an owner", back: "<p>Barrier, whom it stops, the fix, the date it matters. Specific enough to act on; short enough to read.</p>" },
            { front: "Accommodation door", back: "<p>Human resources or the ADA coordinator. You route promptly and confidentially; you do not decide or diagnose.</p>" },
            { front: "Civil rights door", back: "<p>Discrimination, harassment, retaliation. Not yours to investigate or discourage. Retaliation for raising a concern is itself prohibited.</p>" },
            { front: "The record", back: "<p>What, when, whom you told, what happened. It turns one experience into a pattern, and a promise into something you can check.</p>" },
          ] },
          { type: "knowledgeCheck", id: "allyship-and-everyday-action-4-check", question: "A colleague tells you she asked her supervisor for a written-instructions arrangement because of a disability and was told “we do not do special treatment here,” and since then she has been left off project emails. Which route is right?", options: [
            { text: "Advise her to try asking the supervisor again, more politely, and to keep a low profile until it blows over.", correct: false },
            { text: "Tell her that the request belongs with human resources or the ADA coordinator and that being excluded after raising it may be retaliation, which the civil rights office handles, and offer to help her find both contacts.", correct: true },
            { text: "Speak to the supervisor yourself to sort it out informally.", correct: false },
          ], feedbackCorrect: "Yes. The accommodation request has a door, the possible retaliation has a door, and neither is yours to investigate or to smooth over. Helping her reach them is the ally move.", feedbackIncorrect: "Two concerns, two doors. Neither is resolved by asking more politely or by an informal chat that leaves no record and may make things worse for her." },
          { type: "statement", body: "Inclusive practice commitment: “In the next thirty days, I will make one routine task, meeting, document or interaction more accessible by…” Write the sentence, name the routine and the change, and tell a colleague who will ask you how it went. That commitment, kept, is the completion of the Foundations level." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Allyship and everyday action",
    subtitle: "A one-page reminder for noticing, interrupting, building in and escalating",
    quote: "Ask who the default leaves out. Say the sentence. Build it in. Write it down and send it to the person who can change it.",
    use: {
      purpose: "Keep the four moves of this course within reach: see the assumption, interrupt the design, act with rather than for, and escalate with a record.",
      remember: ["The cost test: who has to ask, disclose, wait or absorb a cost that others do not?", "“Let’s pause. Is this accessible to everyone who needs it?” Then the specific barrier and the specific fix.", "Nobody has to disclose a disability to deserve access; build it into what you own.", "Fix what is yours, tell the owner in writing, use the responsible office, keep the record."],
      doNext: "Make your thirty-day commitment, tell a colleague, and write the escalation routes for your unit where the team can find them.",
    },
    sections: [
      { heading: "Seeing it", items: ["Defaults treated as neutral: the room, the time, the tool, the format.", "Requests treated as favors; the appearance test; norms built on one kind of body.", "Inspiration frames, disability as a punchline, the competence assumption.", "The repeated explanation: the same person educating the organization again."] },
      { heading: "Interrupting and acting with", items: ["Short, specific, aimed at the design; call in, do not call out; do not soften access into a preference.", "Do not turn to a disabled colleague for confirmation or explanation; check in briefly afterward and follow through.", "Build access into templates, bookings, budgets and defaults so nobody has to ask.", "Do not make disabled colleagues your reviewers or representatives; ask properly and recognize the time."] },
      { heading: "Escalating", items: ["Immediate path for anyone affected; fix what is yours; tell the owner: barrier, whom it stops, fix, date.", "Accommodation: human resources or the ADA coordinator. Digital and documents: the accessibility team. Buildings: facilities and safety.", "Interpreters and formats for the public: accessibility or language access team. Discrimination or retaliation: the civil rights office.", "Keep the record and check back on the promised date."] },
    ],
  },
  sources: [
    { title: "Centers for Disease Control and Prevention, Become a Disability A.L.L.Y.", href: "https://www.cdc.gov/disability-inclusion/strategies/become-a-disability-ally.html", note: "Everyday allyship practices for individuals and organizations." },
    { title: "Centers for Disease Control and Prevention, Disability Inclusion", href: "https://www.cdc.gov/disability-inclusion/about/index.html", note: "Definition of disability inclusion and the estimate that about one in four adults in the United States has a disability." },
    { title: "U.S. Equal Employment Opportunity Commission, disability discrimination", href: "https://www.eeoc.gov/disability-discrimination", note: "Employment protections, reasonable accommodation, and the prohibition on retaliation for asserting rights." },
    { title: "Job Accommodation Network", href: "https://askjan.org/", note: "Practical guidance on accommodation requests and the interactive process for employees and employers." },
    { title: "ADA National Network", href: "https://adata.org/", note: "Plain-language ADA information for staff, supervisors and the public, including how to raise and route concerns." },
    { title: "Office of Disability Employment Policy, U.S. Department of Labor", href: "https://www.dol.gov/agencies/odep", note: "Resources on inclusive workplaces and disability employment practice." },
  ],
};

export default pack;
