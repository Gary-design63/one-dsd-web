import type { CoursePack } from "../../source-types";

// Disability Inclusion · Foundations · Course 1: Disability, Diversity and Belonging.
// Program-authored for every staff member, volunteer, contractor and new hire.
const pack: CoursePack = {
  course: {
    id: "di-disability-diversity-belonging",
    indexNumber: 1101,
    seriesLabel: "Disability Inclusion · Foundations",
    title: "Disability, Diversity and Belonging",
    subtitle: "Who is already in the room, what a barrier actually is, and why being present is not the same as belonging.",
    scope: "For every employee, board member, volunteer, contractor and new hire. Four short lessons that build the shared language the rest of the Disability Inclusion series depends on. Participation in this program is voluntary and does not replace required training.",
    treatment: "Four short lessons with scenarios, flashcards, a sorting exercise, a barrier map and knowledge checks",
    duration: "45–50 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/disability-and-language.jpg",
    coverAlt: "Two colleagues talk over two stacks of documents.",
    introTranscript: "About one in four adults in the United States lives with a disability, and most disabilities are not visible. That means disabled people are already your colleagues, your applicants, the households you serve and the partners you meet. This course gives you four words to keep apart, a way to see barriers before someone is stopped by one, and a clear picture of the difference between being present and belonging. It is the foundation for every other course in the series.",
    kind: "course",
    contentType: "foundation",
    learning: {
      objectives: [
        "Describe disability as a common, varied part of human diversity, including non-apparent, episodic and acquired disability.",
        "Distinguish impairment, disability, access need and disabling barrier in a real workplace or service example.",
        "Identify at least four sources of barriers: design, policy, training, attitude, communication and assumption.",
        "Explain the difference between presence and belonging using participation, agency, influence and return.",
        "Complete a barrier map of one process you touch and name one barrier you will look for.",
      ],
      evidence: ["A sorting exercise separating facts, barriers and assumptions.", "A knowledge check in every lesson with feedback that explains the inclusive answer.", "A completed barrier map and one written commitment."],
      appliedNextStep: "Walk one process you own as a participant would, registration, a meeting, a form, a notice or an application, and record the first barrier you find, who owns it, and what you will do about it.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Change in ADA, Section 504 or Section 508 guidance", "Change in DHS accessibility, language access or Olmstead Plan direction", "Feedback from disabled staff or participants that a scenario reads as unrealistic or stigmatizing"],
      relatedDoor: "Accommodation and access questions go to the responsible human resources, ADA coordinator or accessibility office; this course prepares you, it does not decide a request.",
      toolkitQuestion: "Who may experience barriers, burden or unintended harm in this process, and what in the design will change so they do not?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "disability-diversity-belonging-1",
        number: 1,
        title: "Disability is ordinary: who is already in the room",
        summary: "How common disability is, how varied it is, and why “we do not serve people with disabilities here” is never true of any DHS team.",
        minutes: 12,
        learning: {
          objective: "Describe the prevalence and variety of disability well enough to plan for it in any meeting, service or hiring process without waiting for a disclosure.",
          takeaways: [
            "The Centers for Disease Control and Prevention estimates that about one in four adults in the United States has a disability; the share rises with age and is higher in rural counties and among people with lower incomes.",
            "Most disabilities are not visible. Chronic pain, hearing loss, learning disabilities, mental-health conditions, brain injury and many others leave no outward sign.",
            "Disability is dynamic: temporary after an injury, episodic with a condition that flares, acquired with age or illness, lifelong from birth. Planning for the range is planning for real people.",
          ],
          evidence: "A knowledge check on prevalence and non-apparent disability, and a scenario decision about a team that believes it has no disabled participants.",
          appliedNextStep: "List the last five meetings, notices or forms you sent. For each, ask: if one in four recipients had a disability, and most of those were non-apparent, what did I assume?",
        },
        scenario: {
          context: "A county eligibility unit is redesigning its lobby check-in. The lead says, “Our clients are mostly working families; disability access is really a Disability Services Division thing, not ours.”",
          prompt: "What is the most accurate response?",
          options: [
            { label: "Agree; the Disability Services Division serves people with disabilities, and this unit serves families.", response: "About a quarter of adults have a disability, and families include disabled parents, children and grandparents. The unit already serves disabled people every day; the question is whether the check-in works for them." },
            { label: "Point out that one in four adults has a disability, most are non-apparent, and the lobby has to work for everyone who already comes through it.", response: "This is the accurate picture. Disability is not a program population; it is a fact about the public, and about the staff behind the counter.", recommended: true },
            { label: "Suggest adding a sign asking people with disabilities to identify themselves at the counter so staff can help.", response: "Asking people to announce a disability to get basic service adds a barrier and a disclosure nobody owes. The check-in itself has to be usable." },
          ],
        },
        transfer: {
          prompt: "Where in your own work does the phrase “we do not really have people with disabilities here” hide?",
          options: ["Name one team, process or audience you have assumed to be non-disabled", "Estimate how many people that assumption affects, using one in four as the starting point", "Write down the first thing that would change if you planned for them"],
        },
        blocks: [
          { type: "text", heading: "The numbers, and what they mean for a Tuesday", body: "<p>The Centers for Disease Control and Prevention estimates that about one in four adults in the United States lives with a disability. The most common are difficulties with mobility, cognition, independent living, hearing and vision. The share is higher among older adults, among people with lower incomes and in rural areas, which describes a large part of Minnesota and a large part of the people DHS serves.</p><p>For a DHS team, the arithmetic is simple. In a staff meeting of twelve, three people are likely to have a disability. In a lobby of forty, ten. On a hiring panel's slate of eight finalists, two. Most of them will not look disabled to you, and none of them owes you an explanation.</p><p>Disability is also not fixed. A broken wrist is a temporary disability. Multiple sclerosis, depression, migraine and long COVID are episodic; a person may need nothing for months and then need a great deal. Hearing and vision change with age. Brain injury is acquired. A process built only for the disability you can see, and only for the person who asks, misses most of the people it affects.</p>" },
          { type: "list", heading: "The range you are planning for", items: ["Mobility: walking, climbing stairs, standing in line, reaching a counter.", "Sensory: blindness and low vision; Deafness and hearing loss; sensitivity to light, sound or touch.", "Cognitive and developmental: intellectual disability, autism, learning disabilities, attention differences.", "Mental health: anxiety, depression, post-traumatic stress and other conditions that affect energy, concentration and how a person handles an unfamiliar office.", "Chronic health: pain, fatigue, diabetes, heart and lung conditions, conditions that flare and recede.", "Acquired and temporary: brain injury, stroke, injury, surgery, and the changes that come with age."] },
          { type: "leaderMove", heading: "Plan for the one in four, not the one who asked", control: "You control whether your default plan assumes a non-disabled audience and treats every other need as an exception.", failure: "Do not wait for a request to prove the need exists. By the time a person asks, the process has already told them it was not built for them.", next: "Before your next meeting or notice goes out, assume a quarter of the people receiving it have a disability you cannot see, and check what that changes." },
          { type: "flashcards", heading: "Facts to keep in reach", cards: [
            { front: "How common is disability?", back: "<p>About one in four adults in the United States, according to the Centers for Disease Control and Prevention. Higher among older adults, people with lower incomes and rural residents.</p>" },
            { front: "What kinds are most common?", back: "<p>Mobility, cognition and independent living lead, followed by hearing and vision. Many people have more than one.</p>" },
            { front: "What does non-apparent mean?", back: "<p>A disability with no outward sign: chronic pain, hearing loss, a learning disability, a mental-health condition, brain injury. Most disabilities are non-apparent.</p>" },
            { front: "Is disability permanent?", back: "<p>Often not. Temporary, episodic, acquired and lifelong disabilities all count. A process that works only for stable, visible disability misses most people.</p>" },
            { front: "Whose issue is it?", back: "<p>Every team's. Disabled people are staff, applicants, parents, partners and the public, not only the people served by disability programs.</p>" },
          ] },
          { type: "quote", text: "Nobody in that meeting knew I have a hearing loss. I read the room and guessed at the rest, the way I have for twenty years. A captioned call would have cost nothing and I would have heard the decision.", cite: "Composite staff perspective, illustrative" },
          { type: "knowledgeCheck", id: "disability-diversity-belonging-1-check", question: "A supervisor says, “Nobody on my team has a disability, so accessible materials are not a priority for us.” Which response is best supported?", options: [
            { text: "That is probably true for a small team; accessibility matters more for public-facing units.", correct: false },
            { text: "On a team of any size it is likely that someone has a disability, most disabilities are non-apparent, and nobody owes a disclosure to deserve usable materials.", correct: true },
            { text: "The supervisor should survey the team about disabilities so the priority can be set accurately.", correct: false },
          ], feedbackCorrect: "Yes. Prevalence, non-apparent disability and the disclosure principle all point the same way: build it in.", feedbackIncorrect: "Consider how many people have a disability, how many of those are visible, and whether anyone should have to disclose to get usable materials." },
        ],
      },
      {
        id: "disability-diversity-belonging-2",
        number: 2,
        title: "Four words, kept apart",
        summary: "Impairment, disability, access need and barrier are not synonyms. Keeping them apart is what lets you fix the right thing.",
        minutes: 12,
        learning: {
          objective: "Distinguish impairment, disability, access need and disabling barrier in a real example, and restate a problem so the barrier, not the person, is the subject.",
          takeaways: [
            "An impairment is a difference in body or mind; a disability is what happens when that difference meets a world built without it; an access need is what the person requires to take part; a barrier is the thing that creates the need.",
            "This way of seeing came from disabled activists who insisted that they were disabled by steps, attitudes and rules more than by their bodies. It is the basis of the social model of disability.",
            "The medical view is still needed for health care. It is the wrong tool for deciding how to run a meeting, write a form or design a lobby.",
          ],
          evidence: "A sorting exercise that separates facts, barriers and assumptions, and a rewritten problem statement.",
          appliedNextStep: "Find one sentence in a recent email, note or plan where a person is the subject of the problem, and rewrite it so the barrier is the subject.",
        },
        scenario: {
          context: "A waiver case manager writes in a note: “Client is unable to complete the annual paperwork due to her cognitive disability.” The paperwork is a fourteen-page packet in small type with legal language, mailed with a ten-day return window.",
          prompt: "Which rewrite puts the attention where the fix is?",
          options: [
            { label: "“Client's cognitive disability prevents completion of the annual packet; family assistance recommended.”", response: "The person is still the problem and a relative is the solution. The packet has not been looked at." },
            { label: "“The annual packet, fourteen pages of legal language with a ten-day window, is a barrier for this client. Offer a plain-language version, a phone or in-person walkthrough, and more time.”", response: "The barrier is named, the access needs follow from it, and the fixes are things the agency controls.", recommended: true },
            { label: "“Client declined to complete paperwork.”", response: "Inaccurate and harmful. A person who cannot use an inaccessible document has not declined anything." },
          ],
        },
        transfer: {
          prompt: "Which of your team's standard phrases make the person the problem?",
          options: ["Collect three sentences from notes, templates or emails that describe a person as unable", "Rewrite each so the barrier is the subject and the fix is the agency's", "Share the rewrites with the team as a small style change"],
        },
        blocks: [
          { type: "text", heading: "Where the distinction comes from", body: "<p>Disabled activists in the disability rights movement made a claim that changed how access is understood: they were disabled less by their bodies than by steps, small print, rules and attitudes. A person who uses a wheelchair is not disabled by the chair. She is disabled by the building with steps and no ramp. This is the social model of disability, and it is the working model behind accessibility law and good design.</p><p>It does not replace medical care. A person's health is their own business and their clinician's. What the social model changes is the question an organization asks. Instead of “what is wrong with this person,” it asks “what in our design, policy or practice stops this person from taking part, and what will we change.”</p><p>Four words keep the thinking honest. <strong>Impairment</strong>: a difference in body or mind. <strong>Disability</strong>: the experience produced when that difference meets an environment built without it. <strong>Access need</strong>: what the person requires to take part. <strong>Barrier</strong>: the design, rule, gap or attitude that creates the need. Barriers belong to the organization. So do the fixes.</p>" },
          { type: "tabs", heading: "The same situation, four ways", tabs: [
            { label: "Impairment", body: "<p>Marcus has a traumatic brain injury that affects short-term memory and processing speed.</p>" },
            { label: "Disability", body: "<p>In a fast intake interview with no written follow-up, Marcus loses the thread, misses a deadline and is closed for non-response.</p>" },
            { label: "Access need", body: "<p>Written summaries, one question at a time, a longer appointment, a reminder call before the deadline.</p>" },
            { label: "Barrier", body: "<p>An interview script designed for speed, no written follow-up, a single deadline with automatic closure. Every one of these is the agency's to change.</p>" },
          ] },
          { type: "leaderMove", heading: "Make the barrier the subject of the sentence", control: "You control the grammar of the problem statement in a note, a plan or a meeting.", failure: "Do not write or say “she cannot,” “he is unable,” “they failed to.” Write what in the process stopped them.", next: "This week, rewrite one problem statement so the barrier is the subject and an owner is named." },
          { type: "sorting", id: "disability-diversity-belonging-2-sort", heading: "Fact, barrier or assumption?", categories: ["Person-centered fact", "Barrier", "Assumption"], items: [
            { text: "Ana uses a screen reader and asks for documents as tagged PDFs or plain text.", category: "Person-centered fact" },
            { text: "The scheduling page cannot be used with a keyboard.", category: "Barrier" },
            { text: "People with intellectual disabilities cannot make their own decisions about services.", category: "Assumption" },
            { text: "The renewal packet is fourteen pages of legal language with a ten-day window.", category: "Barrier" },
            { text: "He looked fine at the interview, so the accommodation request is probably not necessary.", category: "Assumption" },
            { text: "Jordan asked that the agenda be sent two days before the meeting.", category: "Person-centered fact" },
          ] },
          { type: "flashcards", heading: "Keep them apart", cards: [
            { front: "Impairment", back: "<p>A difference in body or mind. Not the organization's to fix, and not something a person owes anyone an explanation for.</p>" },
            { front: "Disability", back: "<p>What happens when an impairment meets a world built without it. Produced by the meeting, not by the person.</p>" },
            { front: "Access need", back: "<p>What the person requires to take part: captions, a ramp, more time, a written summary, a quieter room.</p>" },
            { front: "Barrier", back: "<p>The specific design, rule, gap or attitude that creates the need. Owned by the organization. Fixable.</p>" },
          ] },
          { type: "knowledgeCheck", id: "disability-diversity-belonging-2-check", question: "A job posting requires a valid driver's license for a desk-based eligibility role. An applicant who is blind asks about it. Which statement identifies the barrier correctly?", options: [
            { text: "The applicant's blindness is the barrier to this role.", correct: false },
            { text: "The license requirement, which is not an essential function of a desk-based role, is the barrier; the fix is to remove it from the posting.", correct: true },
            { text: "There is no barrier; the applicant can apply for a different role.", correct: false },
          ], feedbackCorrect: "Right. A requirement unrelated to the essential functions is a barrier the agency created and can remove.", feedbackIncorrect: "Ask what stops the applicant: a difference in vision, or a requirement that has nothing to do with the job? Only one of those is the agency's to change." },
        ],
      },
      {
        id: "disability-diversity-belonging-3",
        number: 3,
        title: "Presence is not belonging",
        summary: "A disabled person in the room proves nothing. Participation, agency, influence and the wish to come back are what inclusion looks like.",
        minutes: 12,
        learning: {
          objective: "Explain the difference between presence and belonging using four observable signs, and apply them to a meeting, service or team.",
          takeaways: [
            "Belonging shows in four things you can observe: the person could participate fully, made their own choices, influenced the outcome, and would come back.",
            "“Nothing about us without us” is a practical rule, not a slogan: decisions about access are better, cheaper and more durable when disabled people shape them, and paid for their expertise.",
            "Dignity of risk means disabled adults get to make choices others might not make, including choices with risk in them. Protecting people out of participation is exclusion.",
          ],
          evidence: "A scenario decision about a community advisory meeting, and a knowledge check on the four signs of belonging.",
          appliedNextStep: "Choose one recurring meeting and score it honestly on the four signs for the disabled people in it. Pick the weakest sign and change one thing before the next meeting.",
        },
        scenario: {
          context: "A Disability Services Division workgroup invites two self-advocates to its monthly meeting. The agenda arrives the morning of the meeting as a slide deck of images. Discussion moves fast; decisions are taken by whoever speaks first. Afterward the lead reports that the meeting was “inclusive, with lived experience represented.”",
          prompt: "What is the honest assessment?",
          options: [
            { label: "The meeting was inclusive; the self-advocates were present and could speak at any time.", response: "Presence was achieved. Participation, agency and influence were not: the materials were unreadable in advance, the pace excluded anyone who needs processing time, and the decision method rewarded speed." },
            { label: "The meeting was not yet inclusive. The workgroup should send accessible materials in advance, slow the decision method, ask the self-advocates how they want to contribute, pay them for their time, and check whether they want to return.", response: "This tests the four signs and changes the design. It also treats the self-advocates as experts, not decoration.", recommended: true },
            { label: "The self-advocates should be asked to bring a support person next time so they can keep up.", response: "This asks the person to fix the meeting's design. The pace and materials are the workgroup's to change." },
          ],
        },
        transfer: {
          prompt: "Think of the last time a disabled person was in a meeting you ran. Which of the four signs can you honestly say you saw?",
          options: ["Ask the person what would have made participation easier, and act on it", "Change the decision method so speed is not the deciding factor", "Send materials early, in a format the person can use, and confirm they arrived"],
        },
        blocks: [
          { type: "text", heading: "Four signs you can actually see", body: "<p>Organizations often report inclusion by counting: a disabled person attended, a self-advocate was on the panel, the ramp was installed. Counting proves presence. Belonging is different, and it shows in four observable things.</p><p><strong>Participation:</strong> the person could take part fully, with the materials, pace, format and support that worked for them. <strong>Agency:</strong> the person made their own choices and spoke for themselves, not through a relative, a support worker or a well-meaning colleague. <strong>Influence:</strong> what the person said changed something, and they could see that it did. <strong>Return:</strong> the person would choose to come back, because the experience was worth their time and did not cost them dignity.</p><p>When any one of these is missing, presence is doing the work of hiding exclusion. The self-advocate in the room who could not read the slides, could not get a word in and never heard what happened to their comment was not included. They were displayed.</p>" },
          { type: "accordion", heading: "Two principles the disability community will expect you to know", items: [
            { title: "Nothing about us without us", body: "<p>Decisions about disabled people are made with disabled people in the room and at the table, from the beginning, with the authority to change the outcome. In practice: involve people early, pay them for expertise, and show what changed because of their input.</p>" },
            { title: "Dignity of risk", body: "<p>Disabled adults have the same right as anyone to make choices with risk in them: to live alone, to take a job that might not work out, to decline a service. Protecting people from every risk removes them from ordinary life. The Minnesota Olmstead Plan's direction toward integrated, self-determined lives rests on this principle.</p>" },
            { title: "Self-determination in DHS practice", body: "<p>Person-centered planning, supported decision-making and informed choice are not paperwork categories. They are the working form of agency: the person's goals lead, information is given in a form they can use, and the decision is theirs.</p>" },
          ] },
          { type: "leaderMove", heading: "Report belonging, not attendance", control: "You control whether your summary of a meeting or event says who attended, or whether they could participate, decide, influence and would return.", failure: "Do not write “lived experience was represented.” Say what the person could do, what changed because of them, and whether they want to come back.", next: "In your next meeting summary, replace the attendance sentence with the four signs." },
          { type: "flashcards", heading: "The four signs", cards: [
            { front: "Participation", back: "<p>Could the person take part fully: materials in a usable format, in advance; a pace that allowed processing; a way to contribute that worked for them?</p>" },
            { front: "Agency", back: "<p>Did the person speak and decide for themselves, rather than through a relative, support worker or colleague?</p>" },
            { front: "Influence", back: "<p>Did what the person said change anything, and could they see that it did?</p>" },
            { front: "Return", back: "<p>Would the person choose to come back? If the honest answer is no, the meeting was not inclusive, whatever the attendance list says.</p>" },
          ] },
          { type: "quote", text: "They kept thanking me for coming. I did not want thanks. I wanted the agenda two days early in a format I could read, and to hear later what they did with what I said.", cite: "Composite self-advocate perspective, illustrative" },
          { type: "knowledgeCheck", id: "disability-diversity-belonging-3-check", question: "A community meeting had step-free access, captions and a Deaf participant who used the interpreter provided. The participant's proposal was noted but never discussed, and no one followed up. Which sign of belonging was missing?", options: [
            { text: "Participation; the access was insufficient.", correct: false },
            { text: "Influence; the person could take part and speak for themselves, but their contribution changed nothing and they never learned what happened to it.", correct: true },
            { text: "None; access was provided and the person attended.", correct: false },
          ], feedbackCorrect: "Yes. Access made participation possible. Without influence and a report-back, the meeting stopped short of belonging.", feedbackIncorrect: "Walk the four signs in order: could they participate, did they act for themselves, did anything change, would they return? Find the first one that failed." },
        ],
      },
      {
        id: "disability-diversity-belonging-4",
        number: 4,
        title: "Your barrier map",
        summary: "Walk one process as a participant would, find where a person is stopped, name the owner, and commit to the first fix.",
        minutes: 12,
        learning: {
          objective: "Complete a barrier map for one process you touch, naming the step, the barrier, the people affected, the owner and the first fix.",
          takeaways: [
            "Barriers cluster at predictable points: finding out, getting in, understanding, responding on time, and being heard afterward.",
            "The person who owns the step usually can fix the barrier without anyone's permission; most barriers persist because nobody walked the process.",
            "A commitment is only real when it names a routine, a change and a person who will ask you about it.",
          ],
          evidence: "A completed barrier map artifact and a written commitment naming one barrier you will look for.",
          appliedNextStep: "Do the walk. Then make the first fix in a process you own, tell the people it affects, and bring the map to the next course.",
        },
        scenario: {
          context: "You are asked to walk the county's paper and online application for a home-care program as a participant would. Finding out about it requires a web search; the online form times out after ten minutes; the paper form must be picked up in person during business hours; notices come only by mail; questions go to a phone line with a forty-minute wait.",
          prompt: "Where does your barrier map start?",
          options: [
            { label: "With the phone wait, because it is the most annoying part.", response: "Annoyance is not the measure. The map starts at the first point where a person is stopped entirely, and works forward." },
            { label: "At “finding out”: a person who does not already know the program exists never reaches the form. Then map each later step, the people stopped at it, the owner and the first fix.", response: "This is the walk. Each step gets a barrier, the people it stops, an owner and a fix, in the order a real person meets them.", recommended: true },
            { label: "With a request to IT to remove the online timeout, since that is the one clear technical defect.", response: "A good fix, but a single fix is not a map. Without the walk, the paper pickup, mail-only notices and phone wait stay invisible." },
          ],
        },
        transfer: {
          prompt: "Which process will you walk this week, and who will ask you what you found?",
          options: ["Name the process and the day you will walk it", "Name the colleague who will ask you about the result", "Write the first barrier you expect to find, then check whether you were right"],
        },
        blocks: [
          { type: "text", heading: "Walk it, do not review it", body: "<p>Reviewing a process means reading the policy and looking at the form. Walking it means trying to do what a participant does, in order, with the access needs of real people in mind: a person with low vision, a person who processes slowly, a person who cannot stand in line, a person whose energy runs out by two in the afternoon, a person who needs an interpreter.</p><p>Barriers cluster at five points. <strong>Finding out</strong>: does the person learn the program exists, in a language and format they use? <strong>Getting in</strong>: can they reach the office, the page, the phone line, the room? <strong>Understanding</strong>: can they read and follow what is asked? <strong>Responding on time</strong>: can they meet the deadline in the channel available to them? <strong>Being heard afterward</strong>: can they ask a question, appeal, or learn what happened to their input?</p><p>At each point, write four things: the barrier, the people it stops, who owns the step, and the first fix. Most first fixes are small and inside the owner's authority. Most persist only because nobody walked the process.</p>" },
          { type: "artifact", kind: "tagged-document", label: "Practical artifact", title: "A barrier map for one process", summary: "One page that turns a walk into work someone can own.", fields: [
            { label: "Process and the walker's access needs", value: "Home-care program application, walked as a person with low vision who works days and has no car." },
            { label: "Step and barrier", value: "Getting in: the online form times out after ten minutes; the paper form is pickup-only, business hours." },
            { label: "People stopped and the owner", value: "Screen-reader and magnification users; anyone who works days; people without transportation. Owner: program manager for the online form, county office lead for pickup." },
            { label: "First fix and the next review point", value: "Remove or extend the timeout; mail or email the paper form on request. Review with the owners at the agreed point and record what changed." },
          ], action: "Copy the four fields for each of the five points, fill them from your walk, and send the map to the owners you named." },
          { type: "leaderMove", heading: "Own the step you own", control: "You control every barrier inside your own step: the wording, the format, the deadline, the channel, the reply.", failure: "Do not send the whole map upward and wait. Fix your own step first, then hand the rest to the people who own theirs, with the map attached.", next: "Make one first fix in a step you own before the agreed review point, and tell the people it affects." },
          { type: "list", heading: "First fixes that need nobody's permission", ordered: false, items: ["Send the agenda and materials two working days early, as real text.", "Turn captions on by default and say so in the invitation.", "Add one line: “Tell us what you need to take part,” with a named contact.", "Offer the form by email and by mail, not only by pickup.", "Extend or remove a timeout; add a reminder before a deadline.", "Reply to every comment from a participant with what happened to it."] },
          { type: "flashcards", heading: "The five points where people are stopped", cards: [
            { front: "Finding out", back: "<p>Does the person learn the service exists, in a language and format they use, from a source they trust?</p>" },
            { front: "Getting in", back: "<p>Can they reach the room, the page, the line, the phone, in the hours and channels available to them?</p>" },
            { front: "Understanding", back: "<p>Can they read, hear and follow what is asked, at their own pace, with the support they use?</p>" },
            { front: "Responding on time", back: "<p>Can they meet the deadline in a channel that works for them, with a reminder and without automatic closure?</p>" },
            { front: "Being heard afterward", back: "<p>Can they ask, appeal, and learn what happened to their input?</p>" },
          ] },
          { type: "knowledgeCheck", id: "disability-diversity-belonging-4-check", question: "Your barrier map shows that renewal notices go out by mail only, with a ten-day window. Which entry is a complete first-fix line?", options: [
            { text: "Barrier: mail-only notices. Fix: consider alternatives.", correct: false },
            { text: "Barrier: mail-only notices with a ten-day window stop people who cannot read print or who move often. Owner: notices team. First fix: offer email and phone reminders and extend the window; review at the agreed point.", correct: true },
            { text: "Barrier: people do not respond on time. Fix: send a second notice.", correct: false },
          ], feedbackCorrect: "Yes. Barrier, people stopped, owner, first fix and a review point: the line can be acted on.", feedbackIncorrect: "A complete line names the barrier as the agency's, the people it stops, an owner, a specific first fix and when it will be reviewed." },
          { type: "statement", body: "Commitment: “One barrier I will look for this month is… in the process… and the person who will ask me about it is…” Write it now. The next course in the series begins with what you found." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Disability, diversity and belonging",
    subtitle: "One page for any staff member, any process",
    quote: "One in four. Most of them you cannot see. Fix the design, not the person.",
    use: {
      purpose: "Keep the foundations in view while you plan a meeting, write a notice, design a form or report on an event.",
      remember: ["About one in four adults has a disability; most disabilities are non-apparent, many are episodic or acquired.", "Impairment, disability, access need and barrier are different things; barriers and their fixes belong to the organization.", "Presence is not belonging. Look for participation, agency, influence and return.", "Nobody owes a disclosure to deserve a usable process."],
      doNext: "Walk one process this month as a participant would and make the first fix in the step you own.",
    },
    sections: [
      { heading: "When you plan anything", items: ["Assume a quarter of the people affected have a disability you cannot see.", "Send materials early, as real text, with captions on and a named contact for access needs.", "Ask what would help; do not ask what the disability is."] },
      { heading: "When you describe a problem", items: ["Make the barrier the subject of the sentence, not the person.", "Name the people stopped, the owner of the step and the first fix.", "Never write “declined” or “unable” for someone who met an inaccessible process."] },
      { heading: "When you report on a meeting or event", items: ["Replace the attendance sentence with the four signs: participate, decide, influence, return.", "Say what changed because of what disabled participants said.", "Pay people for expertise and tell them what happened to their input."] },
    ],
  },
  sources: [
    { title: "Centers for Disease Control and Prevention, Disability Inclusion", href: "https://www.cdc.gov/disability-inclusion/about/index.html", note: "What disability inclusion means in practice and the CDC's estimate that about one in four adults in the United States has a disability." },
    { title: "ADA National Network", href: "https://adata.org/", note: "Plain-language information, guidance and training on the Americans with Disabilities Act." },
    { title: "ADA.gov, U.S. Department of Justice", href: "https://www.ada.gov/", note: "The federal government's ADA information and technical assistance." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "Minnesota's advisory council on disability policy, access and rights." },
    { title: "Minnesota Department of Human Services, Olmstead Plan", href: "https://mn.gov/dhs/general-public/about-dhs/olmstead/", note: "Minnesota's plan for integrated, self-determined lives for people with disabilities." },
    { title: "W3C Web Accessibility Initiative", href: "https://www.w3.org/WAI/", note: "International standards and introductions to accessibility of digital content." },
  ],
};

export default pack;
