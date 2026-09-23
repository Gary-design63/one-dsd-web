import type { CoursePack } from "../../source-types";

// Disability Inclusion · Practitioner, module 8: Facilitation and Peer Learning.
// Program-authored course for internal trainers, learning leaders, inclusion champions and equity professionals.
const pack: CoursePack = {
  course: {
    id: "di-facilitation-and-peer-learning",
    indexNumber: 1119,
    seriesLabel: "Disability Inclusion · Practitioner",
    title: "Facilitation and Peer Learning",
    subtitle: "Lead disability inclusion conversations that people can join without disclosing, that answer defensiveness and misinformation calmly, and that everyone can take part in.",
    scope: "For accessibility coordinators, equity professionals, learning leaders, human resources partners, program managers, supervisors, policy analysts, internal trainers and inclusion champions who facilitate discussions, trainings or peer learning on disability inclusion. Participation in this program is voluntary and does not replace required training.",
    treatment: "Four short lessons with scenarios, a response-sorting exercise, flashcards, a session-opening artifact and knowledge checks",
    duration: "40–50 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/intercultural-competence-no-score.jpg",
    coverAlt: "Four colleagues talk in a hallway with coffee.",
    introTranscript: "Facilitating a conversation about disability is different from facilitating most other topics, because some of the people in the room are the subject and may not want anyone to know. This course teaches you to design sessions nobody has to disclose in, to respond to defensiveness, misinformation and the anxiety of saying the wrong thing without shaming anyone, to write scenarios that teach without stereotyping, and to run virtual and in-person sessions that every participant can actually take part in.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Design discussion prompts and activities that invite reflection on disability inclusion without asking any participant to disclose a disability.",
        "Respond to defensive, misinformed or anxious statements using a calling-in sequence that corrects the content and keeps the person in the conversation.",
        "Write a learning scenario that centers a specific barrier, gives the disabled person agency and competence, and avoids default or stereotyped portrayals.",
        "Set and hold accessible facilitation norms for virtual, in-person and hybrid sessions and for ongoing peer learning groups.",
      ],
      evidence: [
        "A completed sort of participant statements into defensiveness, misinformation and what-if anxiety with a matched response.",
        "One rewritten scenario checked against the stereotype tests.",
        "A session opening and norms sheet built with the artifact.",
      ],
      appliedNextStep: "Rewrite the opening ten minutes of a session you already run so that it invites reflection without disclosure, names the accessibility norms, and gives people two ways to contribute. Run it and note what changed.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Change in ADA, Section 504 or Section 508 guidance", "Change in DHS accessibility or language access standards", "Feedback from disabled staff or participants that a scenario reads as unrealistic or stigmatizing"],
      relatedDoor: "Questions about a participant’s own accommodation, a complaint raised in a session, or a legal obligation go to human resources, the ADA coordinator or the civil rights office; a facilitator hears, acknowledges and routes, and does not decide.",
      toolkitQuestion: "Can everyone in this room take part fully without telling anyone why they need what they need, and what have I designed to make that true?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "facilitation-and-peer-learning-1",
        number: 1,
        title: "Facilitating without requiring disclosure",
        summary: "Design prompts, activities and openings so that people can reflect and contribute without anyone being asked, or feeling expected, to share a disability.",
        minutes: 11,
        learning: {
          objective: "Design discussion prompts, activities and a session opening that invite reflection on disability inclusion without asking or expecting any participant to disclose a disability.",
          takeaways: [
            "In any room of ten or more, someone has a disability the facilitator does not know about; design as if that is always true, because it is.",
            "Third-person and system-focused prompts produce richer discussion than personal-experience prompts, and nobody has to choose between silence and exposure.",
            "If a participant chooses to disclose, the facilitator thanks them briefly, does not make them the lesson, and returns to the work.",
          ],
          evidence: "Three prompts rewritten from personal-disclosure form to system-focused form; a session opening built with the artifact.",
          appliedNextStep: "Go through the prompts in a session you run and rewrite any that can only be answered by revealing a disability, a diagnosis or a family member’s condition.",
        },
        scenario: {
          context: "Fifteen minutes into a disability inclusion session for a county child-protection unit, an enthusiastic participant says, “Let’s go around and everyone share whether they have a disability or someone close to them does, so we know who we’re talking about.”",
          prompt: "What does the facilitator do?",
          options: [
            { label: "Go along with it; the participant means well and it will build openness.", response: "A go-around makes disclosure the price of participation. People who do not want to share will lie, leave or resent the session, and the facilitator has just taught them the program cannot be trusted with their privacy." },
            { label: "Thank the participant for wanting the conversation to be real, say the session is designed so nobody needs to share anything personal, note that about one in four adults has a disability so “who we’re talking about” is already everyone in the room, and offer a system-focused prompt instead.", response: "This honors the intent, protects everyone, corrects the assumption that disability is elsewhere, and keeps the energy in the room.", recommended: true },
            { label: "Say firmly that disclosure is inappropriate and move on.", response: "The correction is right, but the tone shames a participant who was trying to help and teaches the room that mistakes are punished. Calling in works better than calling out." },
          ],
        },
        transfer: {
          prompt: "Which of your current prompts can only be answered by disclosing?",
          options: ["List every prompt or activity in one session you run", "Mark any that ask about personal experience of disability", "Rewrite each in third-person or system-focused form"],
        },
        blocks: [
          { type: "text", heading: "Design as if disabled people are in the room, because they are", body: "<p>Facilitators often imagine a disability inclusion session as people without disabilities learning about people with disabilities who are somewhere else. In a room of fifteen staff, the Centers for Disease Control and Prevention’s estimate that about one in four adults has a disability suggests several are present, most with non-apparent disabilities, and most of them are weighing whether this session is safe. Every design choice tells them.</p><p>The most common mistake is to build participation on personal disclosure: go-arounds about experience with disability, pair shares about “a time you needed help,” or reflection prompts that can only be answered honestly by naming a condition. These force a choice between silence and exposure. The alternative is to put the system, the scenario or a third person at the center: what barrier does this process create, what would you do in this situation, what does this policy assume about who reads it. People who want to bring their own experience still can. Nobody has to.</p><p>When someone does choose to disclose, the facilitator’s job is brief: thank them, honor what they said, and do not make them the expert witness for the rest of the day. Then return to the material. If they later want to be asked, they will say so.</p>" },
          { type: "list", heading: "Prompts that do not require disclosure", items: ["“Walk this process as a participant who uses a screen reader. Where does it stop them?”", "“What does this notice assume about the person reading it?”", "“What would it take for someone to ask for a different format here, and what might stop them?”", "“In this scenario, what does the supervisor control?”", "“Think of a time a process was designed without you in mind, for any reason. What did it feel like to work around it?”", "“What one thing in our own team’s practice would you change after today?”"] },
          { type: "artifact", kind: "invitation", label: "Practical artifact", title: "A session opening that protects everyone", summary: "The lines to say in the first five minutes so people know they can take part fully without sharing anything personal.", fields: [
            { label: "Why we are here", value: "“We are here to look at how our own processes, documents and meetings include or exclude people with disabilities, and what each of us controls.”" },
            { label: "No disclosure needed", value: "“Nothing today asks you to share whether you or anyone close to you has a disability. Some of us do; that is already true in every room. Bring your experience if you want to and only as far as you want to.”" },
            { label: "How to take part", value: "“You can speak, write in the chat or on cards, or send me a note afterwards. All three count. Captions are on and the materials were sent ahead; tell me if anything is not working for you.”" },
            { label: "What happens to what is said", value: "“What people share about themselves stays in this room. Ideas about our processes leave with us so we can act on them. If something comes up that needs the ADA coordinator or human resources, I will help you reach them.”" },
          ], action: "Adapt these four lines to your own words and say them at the start of every session, including the ones you have run many times." },
          { type: "leaderMove", heading: "Never make disclosure the ticket in", control: "You control whether participation depends on saying something personal.", failure: "Do not run go-arounds about disability experience. Do not turn a participant who discloses into the session’s example or authority. Do not ask “does anyone here have a disability?” to make a point.", next: "Check your next session plan: can every activity be completed fully by someone who says nothing personal all day?" },
          { type: "flashcards", heading: "Design moves", cards: [
            { front: "Third-person framing", back: "<p>“What would you do if a colleague asked for…” instead of “When have you needed…”. Same reflection, no exposure.</p>" },
            { front: "System-first prompts", back: "<p>Put the form, the meeting, the policy or the process in the center. People critique a system freely; they defend or hide themselves.</p>" },
            { front: "Multiple channels", back: "<p>Speak, write, send later. Written channels let people contribute experience without being identified as its owner.</p>" },
            { front: "Receiving a disclosure", back: "<p>“Thank you for sharing that.” Honor it in a sentence, do not follow up with questions in front of the group, return to the material. Check in privately afterwards if it seems right.</p>" },
            { front: "The population fact", back: "<p>About one in four adults in the United States has a disability, by the Centers for Disease Control and Prevention’s estimate. Use it early to move the room from “them” to “us.”</p>" },
          ] },
          { type: "knowledgeCheck", id: "facilitation-and-peer-learning-1-check", question: "Which reflection prompt best invites engagement without requiring disclosure?", options: [
            { text: "“Share a time your disability or a family member’s disability affected your work.”", correct: false },
            { text: "“Walk our intake process as a participant with a processing disability. Where would it slow or stop them, and what do we control?”", correct: true },
            { text: "“Raise your hand if you have ever needed an accommodation.”", correct: false },
          ], feedbackCorrect: "Yes. The system is the subject, the reflection is real, and nobody has to reveal anything to answer.", feedbackIncorrect: "Two prompts can only be answered honestly by disclosing. Look for the one that puts a process, not a person, at the center." },
        ],
      },
      {
        id: "facilitation-and-peer-learning-2",
        number: 2,
        title: "Defensiveness, misinformation and the fear of getting it wrong",
        summary: "Recognize the three most common difficult moments in a disability inclusion session and respond to each in a way that corrects the content and keeps the person in the room.",
        minutes: 12,
        learning: {
          objective: "Distinguish defensiveness, misinformation and what-if anxiety in participant statements and respond to each with a calling-in sequence that corrects content, protects disabled participants and keeps the speaker engaged.",
          takeaways: [
            "Defensiveness is usually about the speaker’s sense of being a good person; misinformation is about facts; what-if anxiety is about fear of harm. Each needs a different first sentence.",
            "Correct misinformation every time, briefly and with a source, because disabled participants are listening to see whether you will.",
            "A calling-in response names the impact or the fact, offers a better frame, and gives the person a way to stay in the conversation without losing face.",
          ],
          evidence: "A completed sort of six statements into the three types, and one scripted response for each type.",
          appliedNextStep: "Write down the three statements you most dread hearing in a session. Classify each and script the first two sentences of your response.",
        },
        scenario: {
          context: "During a session on accessible service delivery for a Disability Services Division team, a participant says, “Honestly, half the people with accessible parking tags don’t look disabled. People fake it to get the good spots.”",
          prompt: "What is the most effective facilitator response?",
          options: [
            { label: "Ignore it and continue; engaging will derail the session.", response: "Disabled participants in the room, some of whom may have tags and non-apparent disabilities, have just heard that their legitimacy is doubted. Silence from the facilitator confirms it is an acceptable view here." },
            { label: "“I want to pick that up, because it comes up a lot. Most disabilities are non-apparent: heart and lung conditions, chronic pain, neurological conditions, many others. Not looking disabled tells us nothing. Tags are issued through a medical process, and the assumption that people are faking is one of the main reasons people with non-apparent disabilities avoid using the access they are entitled to. What would we want a colleague to do instead of judging?”", response: "This corrects the fact calmly, names the harm without naming the speaker as the problem, and turns the room toward practice. It also shows disabled participants that misinformation will be answered.", recommended: true },
            { label: "“That is an ableist stereotype and it has no place in this session.”", response: "The content is right and the delivery ends the conversation. The speaker becomes defensive, others learn not to say what they think, and the misinformation is labeled but not corrected." },
          ],
        },
        transfer: {
          prompt: "Which of the three types do you find hardest to respond to, and why?",
          options: ["Notice whether you tend to avoid, over-correct or over-reassure", "Script a first sentence for the type you find hardest", "Ask a co-facilitator to watch for it in your next session"],
        },
        blocks: [
          { type: "text", heading: "Three different moments that feel the same", body: "<p>Difficult statements in a disability session tend to be one of three things. <strong>Defensiveness</strong>: “I treat everyone the same,” “we are already very accommodating,” “this feels like we are being called ableist.” The speaker is protecting their sense of being a fair person; a response that attacks that sense produces more defense. <strong>Misinformation</strong>: “people fake it,” “service animals can be any pet,” “accommodations give an unfair advantage,” “if you can’t do the job as written you shouldn’t have it.” The speaker believes something false; the response must correct the fact, briefly and with a source, every time. <strong>What-if anxiety</strong>: “what if I say the wrong word,” “what if I offer help and offend someone,” “what if I ask about needs and it’s illegal.” The speaker is afraid of causing harm; the response should reduce fear with a concrete practice, not add rules.</p><p>Facilitators who treat all three as resistance either avoid them or fight them. Calling in offers a middle path. Acknowledge the person, name the fact or the impact without characterizing the speaker, offer a better frame, and give them a way to rejoin. It is not softer on the content; it is harder on the content and easier on the person, which is the combination that lets people change their minds in public.</p><p>One non-negotiable: misinformation about disability is corrected every time it appears. Disabled participants are watching, and a facilitator who lets “people fake it” pass has told them what the program will and will not protect.</p>" },
          { type: "accordion", heading: "Statements and first sentences", items: [
            { title: "“I treat everyone exactly the same.” (defensiveness)", body: "<p>“That instinct comes from fairness, and it matters. The thing is that the same treatment produces different results when the starting points differ. A form everyone gets in the same format works for most people and stops a screen-reader user entirely. Equity is the same standard with different routes to it.”</p>" },
            { title: "“Service animals can be any pet if you have a note.” (misinformation)", body: "<p>“That is a common belief and it is not accurate. Under the Americans with Disabilities Act a service animal is a dog individually trained to do work or tasks for a person with a disability; emotional support animals are treated differently. The Department of Justice publishes plain-language guidance on this, and I will put the link in the follow-up.”</p>" },
            { title: "“What if I say the wrong word and offend someone?” (what-if anxiety)", body: "<p>“You probably will at some point, and so will I. What matters is what you do next: say ‘thank you, I will use that,’ use it, and keep going. People are far more bothered by being avoided than by a corrected word. Here is the practice: ask, use what they use, and do not make the correction about your feelings.”</p>" },
            { title: "“Accommodations give some people an unfair advantage.” (misinformation)", body: "<p>“An accommodation removes a barrier so a person can meet the same standard; it does not lower the standard. Extra time for someone whose reading is slowed by a disability is the equivalent of a ramp, not a head start. Federal equal employment guidance describes it exactly that way.”</p>" },
            { title: "“This feels like we are being told we are ableist.” (defensiveness)", body: "<p>“I hear that, and it is not what this is. Ableism lives in designs and defaults far more than in intentions. The question today is not who is a good person; it is what our processes assume and what we can change. Everyone in this room inherited those defaults.”</p>" },
            { title: "“What if I offer help and they’re insulted?” (what-if anxiety)", body: "<p>“Ask, do not assume, and accept the answer. ‘Would you like a hand with that?’ followed by ‘no thanks’ and you moving on is a complete, respectful interaction. The insult comes from helping without asking or insisting after a no.”</p>" },
          ] },
          { type: "sorting", id: "facilitation-and-peer-learning-2-sort", heading: "Defensiveness, misinformation or what-if anxiety?", categories: ["Defensiveness", "Misinformation", "What-if anxiety"], items: [
            { text: "“We already do more than most agencies, I don’t know why we’re being singled out.”", category: "Defensiveness" },
            { text: "“Most people with a disability tag are just older, not disabled.”", category: "Misinformation" },
            { text: "“What if I ask about access needs and it turns out that’s not allowed?”", category: "What-if anxiety" },
            { text: "“Nobody on my team has ever complained, so I don’t think we have a problem.”", category: "Defensiveness" },
            { text: "“If they can’t use the standard software they shouldn’t be in the role.”", category: "Misinformation" },
            { text: "“I’m scared I’ll use the wrong term and make things worse for the person.”", category: "What-if anxiety" },
          ] },
          { type: "leaderMove", heading: "Correct the fact, keep the person", control: "You control whether misinformation is answered and whether the answer leaves the speaker room to stay.", failure: "Do not let a false statement about disability pass to protect the mood. Do not label the speaker to correct the statement.", next: "Prepare a one-line, sourced correction for the three most common myths in your setting and keep them in your facilitator notes." },
          { type: "flashcards", heading: "The calling-in sequence", cards: [
            { front: "1. Acknowledge", back: "<p>“I want to pick that up.” “That comes up a lot.” “I can hear where that comes from.” One sentence that signals the person is not about to be attacked.</p>" },
            { front: "2. Name the fact or the impact", back: "<p>The correction or the consequence, stated about the content: “Most disabilities are non-apparent.” “That framing makes people avoid access they are entitled to.” Not: “That is an ableist thing to say.”</p>" },
            { front: "3. Offer a better frame", back: "<p>Equity as same standard, different routes. Ableism as defaults, not villains. Accommodation as a ramp, not a head start.</p>" },
            { front: "4. Turn to practice", back: "<p>“So what would we want a colleague to do instead?” Moves the room from judgment to behavior and gives the speaker a way to rejoin.</p>" },
            { front: "Reducing what-if anxiety", back: "<p>Replace rules with one repeatable practice: ask, use what the person uses, accept no, and recover from mistakes by thanking and moving on. Fear shrinks when people know what to do next.</p>" },
          ] },
          { type: "knowledgeCheck", id: "facilitation-and-peer-learning-2-check", question: "A participant says, “What if I ask someone what accommodation they need and I get in trouble for asking about their disability?” What is the best response?", options: [
            { text: "“You are right to worry; it is safest never to ask anything.”", correct: false },
            { text: "“Good question, and there is a clear practice. Asking what would help someone take part, offering options, and routing formal requests to human resources or the ADA coordinator is exactly right. What you avoid is asking about diagnosis or medical detail. Ask about the need, not the condition.”", correct: true },
            { text: "“That is a legal question and I cannot answer it here.”", correct: false },
          ], feedbackCorrect: "Yes. The anxiety is met with a concrete, repeatable practice and a clear line, which reduces fear without giving legal advice.", feedbackIncorrect: "This is what-if anxiety. Refusing to answer or advising silence both increase avoidance. Offer the practice: ask about the need, not the condition, and route formal requests." },
        ],
      },
      {
        id: "facilitation-and-peer-learning-3",
        number: 3,
        title: "Scenarios that teach without stereotyping",
        summary: "Write and choose learning scenarios that center a specific barrier, give the disabled person competence and agency, and avoid the default images and inspiration framings that teach the wrong lesson.",
        minutes: 11,
        learning: {
          objective: "Write a learning scenario that centers a specific barrier and a decision the learner controls, portrays the disabled person as competent and specific, varies disability across a set, and passes the stereotype tests.",
          takeaways: [
            "A good scenario asks the learner to make a decision about a system; a bad one asks the learner to feel something about a disabled person.",
            "Across a set of scenarios, disability should vary: sensory, physical, cognitive, mental health, chronic illness, apparent and non-apparent. Defaulting to wheelchair use teaches that other disabilities are not real.",
            "The disabled person in a scenario has a name, a job, a preference and a view; they are never only the occasion for someone else’s learning.",
          ],
          evidence: "One scenario rewritten and checked against the six stereotype tests.",
          appliedNextStep: "Review the scenarios in a session you run against the six tests. Rewrite the weakest one and vary the disabilities across the set.",
        },
        scenario: {
          context: "A colleague drafts a scenario for a new-supervisor session: “Maria is blind and struggles with the new case system. Her kind coworker Dan stays late every night to enter her cases for her. How can the team support Maria?”",
          prompt: "What is the main problem with this scenario?",
          options: [
            { label: "It should specify Maria’s exact diagnosis so learners can plan the right support.", response: "Diagnosis is not the point and would make it worse. The problem is not what learners know about Maria’s eyes; it is that the scenario makes her a passive object of kindness." },
            { label: "It makes Maria the problem and Dan the hero, hides the actual barrier, and asks the wrong question. Rewrite it so the case system’s inaccessibility is the subject, Maria is a competent worker with a clear request, and the learner decides what the supervisor does about the system.", response: "This moves the scenario from pity to practice. Learners now make a decision they will actually face: what to do when a required tool is inaccessible.", recommended: true },
            { label: "It is fine; it shows a supportive team culture.", response: "It shows a coworker doing a colleague’s job at night because a tool is inaccessible, framed as kindness. Learners take away that the answer to a barrier is a helpful person, and that disabled staff need rescuing." },
          ],
        },
        transfer: {
          prompt: "Which scenario in your own materials would fail the tests, and how?",
          options: ["Run each scenario through the six tests", "Rewrite the one that fails most, keeping the same learning point", "Check that the set as a whole varies disability and does not default to wheelchair use"],
        },
        blocks: [
          { type: "text", heading: "What a scenario is for", body: "<p>A scenario exists to put the learner in a decision they will really face and let them practice choosing well. In disability inclusion training, the decision is almost always about a system: a tool, a policy, a meeting, a conversation the learner controls. When a scenario instead asks the learner to feel sympathy, admiration or relief about a disabled person, it teaches attitudes rather than practice, and usually the wrong attitudes.</p><p>The common failures are recognizable once named. The disabled person is defined by a condition and has no name, job or view. The barrier is hidden and the disability is presented as the problem. A non-disabled character rescues them. The disability defaults to wheelchair use, teaching that other disabilities are not real or not serious. The story ends in inspiration: the person overcomes, the team is moved. Or the disabled person exists only so that someone else can learn.</p><p>Good scenarios do the reverse. They name a specific barrier. They give the disabled character competence, a preference and a request. They put the decision in the learner’s hands. Across a set they vary disability widely and include people whose disabilities are not apparent. They end with a decision, not a feeling.</p>" },
          { type: "list", heading: "Six tests for a scenario", ordered: true, items: ["Is the barrier specific and named, and is it the subject rather than the person?", "Does the disabled person have a name, a role, competence and a stated preference or request?", "Is the decision one the learner actually controls in their own role?", "Does the set vary disability, including non-apparent disabilities, rather than defaulting to wheelchair use?", "Is there no rescuer, no overcoming, and no one moved to tears?", "Would a disabled colleague recognize the situation as realistic and the portrayal as respectful? Ask one, and compensate their time where appropriate."] },
          { type: "tabs", heading: "Before and after", tabs: [
            { label: "Before", body: "<p>“Maria is blind and struggles with the new case system. Her kind coworker Dan stays late every night to enter her cases for her. How can the team support Maria?”</p><p>Fails tests one, two, three and five: the system is hidden, Maria is a problem, Dan is a hero, and the learner is asked to feel supportive rather than to decide.</p>" },
            { label: "After", body: "<p>“Maria, a senior case aide with a strong accuracy record, uses a screen reader. The new case system’s data-entry screens cannot be navigated by keyboard, so she cannot complete entries independently. She has told her supervisor she wants to keep doing her own entries and has asked what the plan is. Two other staff have mentioned the screens are confusing. You are the supervisor. What do you do this week, and what do you raise with the system owner?”</p><p>Passes: the barrier is the subject, Maria is competent and has a request, the learner decides, and the resolution is a system change, not a rescue.</p>" },
            { label: "Varying the set", body: "<p>A session with four scenarios might include a participant with a processing disability facing a timed online form, a staff member with a chronic illness and an unpredictable shift schedule, a Deaf participant at a public meeting with no interpreter arranged, and a colleague with a mental health condition asked to explain absences in a team meeting. No wheelchair by default; one may appear where the barrier is physical.</p>" },
          ] },
          { type: "leaderMove", heading: "Give the disabled person the request and the learner the decision", control: "You control who has agency in the scenario and who has to act.", failure: "Do not write scenarios where the disabled character is silent, rescued or inspiring. Do not let every scenario feature a wheelchair.", next: "Rewrite one scenario so the disabled person states what they want and the learner must decide what to do about the system." },
          { type: "flashcards", heading: "Scenario craft", cards: [
            { front: "Name the barrier", back: "<p>“The data-entry screens cannot be navigated by keyboard” rather than “Maria struggles with the system.” The sentence tells the learner where the fix is.</p>" },
            { front: "Competence and preference", back: "<p>A strong accuracy record, a stated wish to keep doing her own work, a direct question to her supervisor. The character is a colleague, not a case.</p>" },
            { front: "The learner’s decision", back: "<p>End with a question the learner can answer from their own role: what do you do this week, what do you raise, what do you change. Not: how do you feel.</p>" },
            { front: "Vary the disabilities", back: "<p>Across a set: sensory, physical, cognitive, mental health, chronic illness, apparent and non-apparent. Wheelchair use appears where the barrier is physical, not as the default image of disability.</p>" },
            { front: "No inspiration ending", back: "<p>The scenario ends in a decision about a system, not in a colleague overcoming or a team being moved. Disabled people are not the lesson; the barrier is.</p>" },
          ] },
          { type: "knowledgeCheck", id: "facilitation-and-peer-learning-3-check", question: "Which scenario ending best supports learning about practice?", options: [
            { text: "“Despite everything, Jordan finished the project on time and the team gave him a standing ovation.”", correct: false },
            { text: "“Jordan has asked for the meeting notes in advance and a written summary afterwards. You run the meetings. What do you change, and for whom?”", correct: true },
            { text: "“The team learned so much from Jordan’s courage.”", correct: false },
          ], feedbackCorrect: "Yes. Jordan has a request, the learner has a decision, and the change is to the meeting, not to Jordan.", feedbackIncorrect: "Two endings are about feelings toward Jordan. Look for the ending that gives the learner a decision about a system." },
        ],
      },
      {
        id: "facilitation-and-peer-learning-4",
        number: 4,
        title: "Accessible norms for virtual, in-person and peer sessions",
        summary: "Set and hold the facilitation norms that let everyone take part: materials ahead, captions, described visuals, pacing, breaks, multiple channels and no forced cameras, in every format and in ongoing peer learning groups.",
        minutes: 10,
        learning: {
          objective: "Set accessible facilitation norms for virtual, in-person and hybrid sessions and for ongoing peer learning groups, and hold them when a session drifts.",
          takeaways: [
            "Accessibility norms are set before the session, said aloud at the start, and held when a participant or a presenter drifts from them.",
            "Hybrid sessions fail remote participants first; the facilitator’s job is to make the remote experience the design baseline, not an afterthought.",
            "Peer learning groups need the same norms plus a shared agreement about confidentiality, rotation of facilitation and how disagreement is handled.",
          ],
          evidence: "A norms sheet for one session format and one peer learning group, and a note on how you will hold each norm when it slips.",
          appliedNextStep: "Choose the format you run most. Write its norms on one page, send them with the invitation, say them at the start, and name one norm you will actively hold in the next session.",
        },
        scenario: {
          context: "A hybrid peer learning session on accessible notices has twelve people in a conference room and five online. The in-room group is lively, talking over one another and pointing at a whiteboard. The online participants have gone silent. One has typed in the chat that they cannot hear and cannot see what is being drawn.",
          prompt: "What does the facilitator do?",
          options: [
            { label: "Ask the online participants to be patient and promise to send a photo of the whiteboard afterwards.", response: "A photo later is not participation now. The five people online, who may include someone who joined remotely because the room is inaccessible to them, are excluded from the discussion as it happens." },
            { label: "Pause the room, restate the norm that one person speaks at a time and near the microphone, read the chat message aloud, describe what is on the whiteboard, move the drawing into a shared document everyone can see, and invite the online participants to respond first.", response: "This holds the norm publicly, repairs the exclusion immediately, and re-centers the people who were pushed out. It takes two minutes and changes the rest of the session.", recommended: true },
            { label: "Move the online participants to a separate breakout so they can discuss among themselves.", response: "Separating remote participants confirms they are a second class of attendee. The session was meant to be one conversation." },
          ],
        },
        transfer: {
          prompt: "Which norm slips most often in sessions you run, and what will you say when it does?",
          options: ["Write the one-sentence reminder you will use for that norm", "Send your norms with the next invitation", "Ask a participant to co-hold one norm with you"],
        },
        blocks: [
          { type: "text", heading: "Norms are set, said and held", body: "<p>Level 2 of this curriculum covered inclusive meetings, events and learning: accessible invitations, materials in advance, captions, interpretation on request, accessible rooms and more than one way to take part. Facilitation adds the live layer: norms that are stated at the start and actively held when a presenter reads a slide the remote group cannot see, when three people talk at once, or when a session runs ninety minutes without a break.</p><p>Hybrid sessions deserve particular care because they fail remote participants first and quietly. The room has energy, eye contact and a whiteboard; the remote participants have a small window and whatever the microphone picks up. The design principle is to make the remote experience the baseline: if it works for the person online, it works for the room. Shared documents instead of whiteboards, one speaker at a time near a microphone, visuals described aloud, chat read into the conversation, and a co-facilitator whose job is the remote group.</p><p>Peer learning groups, which meet repeatedly and often without a formal trainer, need the same norms plus a few of their own: what stays in the group, how facilitation rotates so one person is not always carrying it, how disagreement is handled, and how new members are brought in without restarting. Written down and revisited, these agreements are what let a peer group discuss hard things over months.</p>" },
          { type: "tabs", heading: "Norms by format", tabs: [
            { label: "Virtual", body: "<p>Captions on. Materials sent ahead in accessible formats. Cameras optional and said to be optional. Visuals described aloud. Chat monitored and read into the room. Names and pronouns visible. One speaker at a time, with a hand-raise or chat cue. A break every 50 to 60 minutes. Recording and transcript policy stated at the start.</p>" },
            { label: "In-person", body: "<p>Step-free route, accessible restroom and quiet room named at the start. Microphones used, even in small rooms, and passed rather than shouted over. Materials in large print available. Flip charts and whiteboards read aloud. Movement activities offered with a seated equivalent. Fragrance-free request in the invitation. Breaks announced and kept.</p>" },
            { label: "Hybrid", body: "<p>Design for the remote participant first. A co-facilitator owns the remote experience. Shared documents instead of whiteboards. In-room speakers use the microphone every time. Remote participants invited to respond first in each round. One conversation, never two.</p>" },
            { label: "Peer learning group", body: "<p>All of the above, plus a written agreement on confidentiality, rotating facilitation, how disagreement is raised and resolved, how new members join, and how the group will act on what it learns rather than only discuss it.</p>" },
          ] },
          { type: "leaderMove", heading: "Hold the norm out loud", control: "You control whether a norm that slips is restored in the moment or quietly abandoned.", failure: "Do not let “can you all see this?” substitute for describing the visual. Do not let a lively room override the microphone rule. Do not skip the break because the discussion is good.", next: "Pick one norm and, in your next session, restore it publicly the first time it slips, in one calm sentence." },
          { type: "quote", text: "I joined online because the building is hard for me. For forty minutes I watched people laugh at a whiteboard I could not see. The facilitator finally noticed the chat. That was the only part of the session I actually attended.", cite: "Composite participant perspective, illustrative" },
          { type: "flashcards", heading: "Live facilitation habits", cards: [
            { front: "Describe every visual", back: "<p>“The slide shows a three-step process: request, review, decision.” Do it for slides, whiteboards, gestures and anything held up. It helps remote, blind and low-vision participants and everyone taking notes.</p>" },
            { front: "Cameras optional, and say so", back: "<p>Forced cameras exclude people managing energy, sensory load, home situations or anxiety. State that cameras are welcome and optional, and mean it by never commenting on who is off.</p>" },
            { front: "Read the chat in", back: "<p>Chat is a participation channel, not a side conversation. Read contributions aloud with the person’s name unless they ask otherwise, and respond to them as you would to a raised hand.</p>" },
            { front: "The remote-first test", back: "<p>Before any hybrid activity ask: can the person online do this fully, at the same time, in the same conversation? If not, redesign the activity, not the person’s expectations.</p>" },
            { front: "Breaks are access", back: "<p>Pain, fatigue, medication, attention and interpreting all need breaks. Announce them, keep them, and never say “let’s push through.”</p>" },
          ] },
          { type: "knowledgeCheck", id: "facilitation-and-peer-learning-4-check", question: "In a hybrid session, which practice does most to keep remote participants in the same conversation as the room?", options: [
            { text: "Recording the session so remote participants can watch it later.", correct: false },
            { text: "Using shared documents instead of a whiteboard, requiring the microphone for every in-room speaker, and inviting remote participants to respond first in each round.", correct: true },
            { text: "Giving remote participants their own breakout discussion.", correct: false },
          ], feedbackCorrect: "Yes. Each of these makes the remote experience the baseline and keeps one conversation going.", feedbackIncorrect: "A recording is not participation and a separate breakout is separation. Look for the option that designs the live session around the remote participant." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Facilitating disability inclusion conversations",
    subtitle: "Before, during and after any session or peer learning meeting",
    quote: "Nobody has to disclose. Every myth gets answered. Every scenario ends in a decision. Everyone can take part.",
    use: {
      purpose: "Keep the facilitator’s four jobs in view: protect privacy, correct content kindly, teach with respectful scenarios, and hold accessible norms.",
      remember: ["Design as if disabled people are in the room; about one in four adults has a disability and most disabilities are non-apparent.", "Defensiveness, misinformation and what-if anxiety each need a different first sentence; misinformation is corrected every time, with a source.", "A scenario centers a barrier and a decision, gives the disabled person a name, competence and a request, and never ends in inspiration.", "Norms are sent ahead, said at the start and held aloud when they slip; hybrid sessions are designed for the remote participant first."],
      doNext: "Rewrite the opening ten minutes of one session with the artifact, and script your response to the myth you hear most.",
    },
    sections: [
      { heading: "Before the session", items: ["Send materials in accessible formats and the norms with the invitation; include an access-needs line and a named contact.", "Rewrite any prompt that can only be answered by disclosing a disability.", "Check every scenario against the six tests and vary disability across the set.", "Prepare one-line, sourced corrections for the three most common myths in your setting."] },
      { heading: "During the session", items: ["Open with: why we are here, no disclosure needed, how to take part, what happens to what is said.", "Call in: acknowledge, name the fact or impact, offer a better frame, turn to practice.", "Describe every visual, read the chat in, use the microphone, keep the breaks, cameras optional.", "If someone discloses: thank them briefly, do not make them the lesson, return to the material."] },
      { heading: "After the session", items: ["Send the follow-up with sources for any correction you made and the actions the group named.", "Route anything raised that belongs to human resources, the ADA coordinator or the civil rights office.", "Ask a disabled colleague or advisor for feedback on the scenarios and the norms, and compensate their time where appropriate."] },
    ],
  },
  sources: [
    { title: "ADA National Network, Guidelines for Writing About People with Disabilities", href: "https://adata.org/factsheet/adann-writing/", note: "Respectful, specific language and cautions against pity, inspiration and “superhuman” portrayals, useful for scenario writing and live correction." },
    { title: "ADA.gov, Service Animals", href: "https://www.ada.gov/topics/service-animals/", note: "Plain-language explanation of what counts as a service animal under the Americans with Disabilities Act, for correcting a common piece of misinformation." },
    { title: "W3C Web Accessibility Initiative, How to Make Your Presentations and Meetings Accessible to All", href: "https://www.w3.org/WAI/teach-advocate/accessible-presentations/", note: "Practical guidance for speakers and organizers on accessible materials, describing visuals, captions and pacing." },
    { title: "Centers for Disease Control and Prevention, Disability Inclusion", href: "https://www.cdc.gov/disability-inclusion/about/index.html", note: "Population context, including the estimate that about one in four adults in the United States has a disability, and the range of visible and non-apparent disabilities." },
    { title: "Job Accommodation Network", href: "https://askjan.org/", note: "Accurate information on accommodations and the interactive process for answering misinformation about cost and fairness." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "Minnesota-specific guidance on access, etiquette and inclusive practice for facilitators working in state and county settings." },
  ],
};

export default pack;
