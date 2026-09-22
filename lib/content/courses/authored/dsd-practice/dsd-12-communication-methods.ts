import type { CoursePack } from "../../source-types";

// DSD Service System curriculum, module 12: Communication methods and access.
// Program-authored for staff who communicate with people who use a method other than spoken English, or who decide how information is provided.
const pack: CoursePack = {
  course: {
    id: "dsd-12-communication-methods",
    indexNumber: 1192,
    seriesLabel: "DSD Service System · Practice",
    title: "Communication Methods and Access",
    subtitle: "Presuming competence, the methods people use to communicate when speech is not available or not enough, what it takes to work with an interpreter or a communication device well, and how to make what you say and write usable.",
    scope: "For care coordinators, case managers, direct support staff, intake and front-line staff, program and policy staff who write for the public, and supervisors. Five short lessons you can take in any order. Voluntary and self-directed: no score, no ranking, no completion requirement. Completion here does not count toward required training credits unless management, a director, or leadership expressly approves an exception.",
    treatment: "Five short lessons with practice examples, a sort separating competence from method, scenarios, flashcards on methods, and a communication-access review you can run on one interaction",
    duration: "50–55 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/dsd-communication-methods.jpg",
    coverAlt: "A young woman uses a tablet-based communication device to answer a question while a worker across the table waits, looking at her rather than the screen.",
    introTranscript: "Communication is where a service either meets a person or misses them entirely. Many people served by the Division do not use spoken English as their main method: they sign, they use a device, they point, they type, they use a language other than English, or they communicate through behavior that someone has to learn to read. This module covers the assumption that has to come first, the methods people use, what it takes to work with an interpreter or a device well, and how to make what you say and write usable by the person in front of you. Nothing here is scored, ranked or collected.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Explain what presuming competence means in practice and identify one situation where a person's method has been mistaken for their capacity.",
        "Describe the main methods people use to communicate and the support each requires from the listener.",
        "Work with a sign language interpreter or a spoken language interpreter in a way that keeps the person as the party to the conversation.",
        "Support a person who uses a communication device without speaking for them or filling their silences.",
        "Run a communication-access review on one interaction and produce one change.",
      ],
      evidence: [
        "A sort separating competence from method.",
        "Five scenario decisions and five knowledge checks with explanations.",
        "A completed communication-access review with one change.",
      ],
      appliedNextStep: "In your next conversation with a person who uses a method other than spoken English, wait twice as long as feels comfortable before speaking again.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Change in Department language access or communication access policy", "Change in interpreter service arrangements", "Feedback from staff or participants that a description no longer matches practice"],
      relatedDoor: "Questions about a specific person's communication assessment or device go to a speech-language clinician; questions about interpreter booking go to the Department's language access resources. This course builds practice, it does not assess anyone.",
      toolkitQuestion: "In this interaction, who was the conversation with, and how long did we wait?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "dsd-communication-methods-1",
        number: 1,
        title: "Presume competence",
        summary: "Start from the assumption that the person understands and has something to say, and see what changes when you do.",
        minutes: 10,
        learning: {
          objective: "Explain presuming competence as a practice stance and identify one situation in which a person's communication method was treated as evidence about their understanding.",
          takeaways: [
            "Presuming competence means assuming the person understands, has opinions, and can communicate them given the right method and enough time, until there is real evidence otherwise.",
            "The alternative — assuming the person does not understand because they do not speak — is the most common error in disability services and produces decades of people being talked about in their presence.",
            "The cost of presuming competence wrongly is some wasted effort; the cost of presuming incompetence wrongly is a person's whole life.",
          ],
          evidence: "A sort separating competence from method, a statement, a scenario decision and a knowledge check.",
          appliedNextStep: "Identify one person who is routinely talked about in their presence, and next time, speak to them.",
        },
        scenario: {
          context: "A planning meeting for a man in his thirties who does not speak and has limited motor control. The team discusses his housing options among themselves. He is in the room. Nobody addresses him. Afterwards, his sister mentions that he types slowly with one finger on a tablet and has strong views about where he wants to live.",
          prompt: "What happened?",
          options: [
            { label: "The team did not know he could type; now that they do, they can include him next time.", response: "They did not ask. Not speaking was taken as not understanding, and a decision about his life was made in front of him without anyone checking whether he had a method." },
            { label: "The team presumed incompetence from the absence of speech, and a person with a method and strong views was treated as furniture; the repair is to reconvene with his tablet and enough time, and to make asking about method the first step of every meeting.", response: "This names the error, repairs the decision, and changes the practice so it does not recur with the next person.", recommended: true },
            { label: "His sister should have spoken up during the meeting.", response: "She may have wished she had. The responsibility for asking how a person communicates lies with the people running the meeting." },
          ],
        },
        transfer: {
          prompt: "Who in your caseload is routinely talked about in their presence?",
          options: ["Name the person", "Find out from them or from someone who knows them how they communicate, and how long it takes", "At the next meeting, speak to them first and wait"],
        },
        blocks: [
          { type: "text", heading: "The first assumption decides everything", body: "<p>Before any method, any interpreter or any device, there is an assumption. Either the person in front of you understands and has something to say, or they do not. The first assumption leads you to find the method and wait for the answer. The second leads you to talk to the person beside them. For a very long time, the second was the default in disability services, and the result was generations of people with rich inner lives who were spoken about in their presence, planned for without being asked, and recorded as having nothing to say.</p><p>Presuming competence is the decision to start from the first assumption. It is not a claim that everyone understands everything. It is a stance about where the burden lies: on the service to find the method, not on the person to prove they deserve one. The asymmetry of the errors settles it. Presume competence wrongly and you have wasted some effort. Presume incompetence wrongly and you have taken a person's voice for as long as you were in their life.</p>" },
          { type: "sorting", id: "dsd-communication-methods-1-sort", heading: "About competence, or about method?", categories: ["About competence", "About method"], items: [
            { text: "He does not speak.", category: "About method" },
            { text: "She types slowly with one finger and needs several minutes to answer.", category: "About method" },
            { text: "He understands what is said to him and has views about it.", category: "About competence" },
            { text: "She uses American Sign Language and English is her second language.", category: "About method" },
            { text: "He communicates yes and no by looking up or down.", category: "About method" },
            { text: "She can weigh two options and choose between them.", category: "About competence" },
          ] },
          { type: "statement", body: "Not speaking is a fact about method. It is not evidence about understanding, and treating it as evidence is the most common error in this work." },
          { type: "leaderMove", heading: "Ask about method before anything else", control: "You control the first question of any meeting. Asking how the person communicates and how long it takes, before any content, is what makes the rest of the meeting theirs.", failure: "Do not let a meeting proceed with the person in the room and no established method. Every decision made that way is one they were excluded from.", next: "Make the method question the first item on every meeting agenda you set." },
          { type: "knowledgeCheck", id: "dsd-communication-methods-1-check", question: "Why does presuming competence make sense even when a person's understanding is uncertain?", options: [
            { text: "Because everyone understands everything.", correct: false },
            { text: "Because the cost of presuming competence wrongly is wasted effort, while the cost of presuming incompetence wrongly is the person's voice for as long as you are in their life.", correct: true },
            { text: "Because it is required by policy.", correct: false },
          ], feedbackCorrect: "Yes. The asymmetry of the two errors settles the question of where to start.", feedbackIncorrect: "It is not a claim that everyone understands, and it is not only a policy. It is a judgment about which error is worse." },
        ],
      },
      {
        id: "dsd-communication-methods-2",
        number: 2,
        title: "The methods people use",
        summary: "Meet the main methods people use when speech is not available or not enough, and what each requires of the listener.",
        minutes: 10,
        learning: {
          objective: "Describe the main communication methods people use and, for each, state what the listener has to do differently.",
          takeaways: [
            "Methods include sign language, speech-generating devices, letter and picture boards, typing, gesture and eye-gaze, and behavior that someone has learned to read; many people use several.",
            "Each method asks something specific of the listener: an interpreter, time, a position where the board can be seen, a willingness to learn what a particular sound or movement means.",
            "The method belongs to the person; the listener's job is to learn it, not to require the person to use a different one.",
          ],
          evidence: "A flashcard set on methods, an accordion on what to do, a scenario decision and a knowledge check.",
          appliedNextStep: "For one person you support, write down their method in specific terms so the next worker does not have to guess.",
        },
        scenario: {
          context: "A woman in her sixties has a communication book with pictures and words that she points to. Her new worker finds it slow, and starts asking yes-or-no questions instead, which she answers by nodding. Within a month the book is in a drawer.",
          prompt: "What has happened?",
          options: [
            { label: "The worker found a faster method that works for both of them.", response: "The worker found a faster method for the worker. Yes-or-no questions can only answer what the worker thought to ask. The book let her say what she wanted to say, and it is in a drawer." },
            { label: "The worker replaced her method with one that suits the worker, and her range of expression has shrunk to agreeing or disagreeing with someone else's questions; the book comes out of the drawer and the worker learns to wait.", response: "This names the loss. Speed for the listener was bought with the person's ability to initiate, and that trade is never the listener's to make.", recommended: true },
            { label: "She should be assessed for a faster device.", response: "Perhaps, if she wants one. The immediate problem is that a method she had was taken away for the worker's convenience." },
          ],
        },
        transfer: {
          prompt: "Is one person's method written down specifically enough that a new worker could use it?",
          options: ["Name the person and describe their method in specific terms", "Include how long it takes and what the listener must do", "Put it where the next worker will see it first"],
        },
        blocks: [
          { type: "text", heading: "Many methods, one rule", body: "<p>People communicate in every way that works. Some sign. Some use a device that speaks for them, selected by touch, by switch, or by eye movement. Some point to letters, words or pictures on a board. Some type. Some use gesture, facial expression, or the direction of their gaze. Some communicate through vocalizations and movements that mean specific things to the people who have learned them. Many use several, depending on the setting and the day.</p><p>The rule that covers all of them: the method belongs to the person, and the listener's job is to learn it. Replacing it with something faster for the listener, or requiring the person to use a method they did not choose, takes away the range of what they can say. Yes-or-no questions are the most common substitution, and they reduce a person to agreeing or disagreeing with whatever the questioner thought to ask.</p>" },
          { type: "flashcards", heading: "Methods, and what each asks of you", cards: [
            { front: "Sign language", back: "<p>A full language with its own grammar. American Sign Language is not English on the hands. Asks of you: a qualified interpreter, and speaking to the person rather than to the interpreter.</p>" },
            { front: "Speech-generating device", back: "<p>A tablet or dedicated device that speaks selected words. Selection may be by touch, switch or eye movement, and may be slow. Asks of you: time, silence while the person composes, and never finishing their sentence.</p>" },
            { front: "Boards and books", back: "<p>Letters, words or pictures the person points to. Asks of you: a position where you can see the board, reading aloud what is pointed to so the person can confirm, and time.</p>" },
            { front: "Typing", back: "<p>On a phone, tablet or keyboard, sometimes with one finger, sometimes very slowly. Asks of you: waiting without watching the screen impatiently, and reading what is typed rather than guessing ahead.</p>" },
            { front: "Gesture, gaze and expression", back: "<p>Looking up for yes, down for no. Pointing. A hand raised. A specific face. Asks of you: learning this person's specific signals from someone who knows them, and writing them down.</p>" },
            { front: "Behavior someone has learned to read", back: "<p>A vocalization, a movement, a change that means something specific. Asks of you: humility, a person who knows the meaning, and the assumption that it means something.</p>" },
          ] },
          { type: "accordion", heading: "Three things to do with every method", items: [
            { title: "Learn it from someone who knows", body: "<p>The person, a family member, a long-serving worker, a clinician. Ask what each signal means, how long answers take, and what to avoid. Write it down.</p>" },
            { title: "Wait longer than is comfortable", body: "<p>Every method that is not speech is slower than speech. The most common failure is filling the silence. Count to ten, then count again.</p>" },
            { title: "Confirm rather than assume", body: "<p>Say back what you understood. Let the person correct it. A wrong interpretation acted on is worse than a slow one confirmed.</p>" },
          ] },
          { type: "leaderMove", heading: "Write the method down", control: "You control whether a person's method travels with them or has to be rediscovered by every new worker. A written description, specific enough to use, is the difference.", failure: "Do not let a method be replaced by yes-or-no questions because they are faster. Speed for the listener is paid for by the person's range.", next: "For one person, write a one-page description of their method and put it where the next worker will see it first." },
          { type: "knowledgeCheck", id: "dsd-communication-methods-2-check", question: "Why are yes-or-no questions a poor substitute for a person's own communication method?", options: [
            { text: "Because they are too simple.", correct: false },
            { text: "Because they limit the person to agreeing or disagreeing with what the questioner thought to ask, removing the ability to initiate, elaborate or say something unexpected.", correct: true },
            { text: "Because people find them patronizing.", correct: false },
          ], feedbackCorrect: "Yes. The loss is range. The person can only respond to the questioner's agenda.", feedbackIncorrect: "The issue is not simplicity or tone. It is that the person can no longer say anything the questioner did not think to ask." },
        ],
      },
      {
        id: "dsd-communication-methods-3",
        number: 3,
        title: "Working with an interpreter",
        summary: "Work with a sign language or spoken language interpreter in a way that keeps the person as the party to the conversation.",
        minutes: 12,
        learning: {
          objective: "Describe how to book, brief and work with an interpreter so that the conversation is with the person, and identify three common errors.",
          takeaways: [
            "Book a qualified interpreter in advance, for the full length of the meeting, in the person's actual language; family members and staff are not interpreters.",
            "Speak to the person, not the interpreter. Look at them. Use first person. Pause for interpretation and do not talk over it.",
            "The interpreter interprets everything said in the room, and that includes side conversations, which means there are no side conversations.",
          ],
          evidence: "A tabs walk through before, during and after, a quote, a scenario decision and a knowledge check.",
          appliedNextStep: "Before your next interpreted meeting, brief the interpreter for five minutes on the purpose and the terms that will come up.",
        },
        scenario: {
          context: "A meeting with a Deaf man is arranged with an interpreter. During the meeting, the coordinator looks at the interpreter while speaking, says \"tell him that his application was approved,\" and, while the interpreter is signing, turns to a colleague to discuss the next case.",
          prompt: "What went wrong?",
          options: [
            { label: "Nothing significant; the information was conveyed.", response: "The information was conveyed to the interpreter, in the third person, while the coordinator held a separate conversation the interpreter was also obliged to interpret. The man was not a party to his own meeting." },
            { label: "Three errors: addressing the interpreter instead of the man, using third person, and holding a side conversation that the interpreter must also interpret; the repair is to look at him, say \"your application was approved,\" and stop talking while it is interpreted.", response: "This names each error and its fix. All three are habits, and all three are broken by the same practice: the conversation is with the person.", recommended: true },
            { label: "The interpreter should have corrected the coordinator.", response: "Interpreters sometimes do. It is the coordinator's responsibility to run the meeting correctly, not the interpreter's to manage the coordinator." },
          ],
        },
        transfer: {
          prompt: "Which of the three errors do you make, and what will you do differently?",
          options: ["Recall your last interpreted conversation and check for each error", "Choose the one you will fix first", "Brief the interpreter before the next meeting and ask them to tell you afterwards if you did it"],
        },
        blocks: [
          { type: "text", heading: "The conversation is with the person", body: "<p>An interpreter is not a participant in the conversation. They are the means by which two people who do not share a language speak to each other. Everything about working with one well follows from that. You look at the person. You speak to them directly, in first person, as you would if you shared a language. You pause so the interpretation can happen. You do not say \"tell him.\" You do not have a side conversation, because the interpreter will interpret it, and because it is rude.</p><p>The other half is logistics. A qualified interpreter, booked in advance, for the full meeting, in the person's language and the right variety of it. Not a family member, who has their own stake and their own filter. Not a bilingual staff member pulled from another task, who is not trained and whose presence changes what the person will say. For a Deaf person, a certified sign language interpreter; for some, a Deaf interpreter working alongside a hearing one. Ask the person what they need.</p>" },
          { type: "tabs", heading: "Before, during and after", tabs: [
            { label: "Before", body: "<p>Ask the person what language and what kind of interpreter they need. Book a qualified interpreter for the full length plus margin. Send the interpreter the purpose of the meeting and any terms that will come up. Arrange seating so the person can see both you and the interpreter.</p>" },
            { label: "During", body: "<p>Look at the person. Speak in first person. Pause. Do not talk over the interpretation. Do not have side conversations. If you do not understand something, ask the person, not the interpreter. Check understanding by asking the person to say back, not by asking if they understood.</p>" },
            { label: "After", body: "<p>Provide a written summary in a form the person can use, which may be a different language or format. Ask the interpreter whether anything about your practice made their job harder. Record what language and what kind of interpreter worked, so the next booking is right.</p>" },
          ] },
          { type: "quote", text: "There are no side conversations in an interpreted meeting. Everything said in the room is interpreted, and everything is the person's to hear." },
          { type: "leaderMove", heading: "Never use family as the interpreter", control: "You control whether an interpreter is booked or a family member is asked to fill in. The second is faster and it changes everything the person will say, and what they will hear.", failure: "Do not let a meeting proceed with a family member interpreting because the booking failed. Reschedule. A meeting in which the person cannot speak freely is not a meeting.", next: "Check the interpreter booking for your next interpreted meeting a week in advance." },
          { type: "knowledgeCheck", id: "dsd-communication-methods-3-check", question: "A coordinator says to the interpreter, \"Can you ask her whether she has any questions?\" What should have been said instead?", options: [
            { text: "\"Please ask her if she has questions.\"", correct: false },
            { text: "Looking at the woman: \"Do you have any questions?\"", correct: true },
            { text: "Nothing; the interpreter will handle it.", correct: false },
          ], feedbackCorrect: "Yes. First person, to the person, while looking at them. The interpreter interprets what you say to her, not what you say about her.", feedbackIncorrect: "Both other options keep the interpreter as the party to the conversation. The woman is the party." },
        ],
      },
      {
        id: "dsd-communication-methods-4",
        number: 4,
        title: "Working with a device",
        summary: "Support a person who uses a communication device without speaking for them, finishing their sentences, or filling their silence.",
        minutes: 10,
        learning: {
          objective: "Describe what a listener does while a person composes on a device, identify three habits that undermine device users, and state the one rule that fixes all three.",
          takeaways: [
            "Composing on a device is slow, and the most common listener failures are guessing ahead, finishing the sentence, answering for the person, and changing the subject during the silence.",
            "The one rule: wait. Look at the person, not the screen. Do not speak until they indicate they are finished.",
            "A device is the person's voice; treating it as a tool the worker operates, or reading over their shoulder, is the equivalent of putting words in their mouth.",
          ],
          evidence: "An accordion on the habits, a statement, a scenario decision and a knowledge check.",
          appliedNextStep: "In your next conversation with a device user, count silently to twenty before you speak, every time.",
        },
        scenario: {
          context: "A young man uses an eye-gaze device. Composing a sentence takes him two to three minutes. During a planning conversation, his worker watches the screen, reads each word aloud as it appears, guesses the sentence after three words, and moves on when he is correct.",
          prompt: "What is the effect?",
          options: [
            { label: "The conversation moves faster and the worker is usually right.", response: "The worker is usually right about what the man was going to say, and the man never gets to say it. He has learned that his sentences will be finished for him, and he will compose less." },
            { label: "The man's voice has been taken over: his words are read before he chooses to release them, his sentences are finished for him, and the conversation proceeds at the worker's pace; the repair is to look at him, not the screen, and wait until he plays the sentence.", response: "This names the loss. Being right about what someone was going to say is not the same as letting them say it, and the difference is whose conversation it is.", recommended: true },
            { label: "The worker should ask him whether he minds.", response: "Worth asking, and the answer will be shaped by years of people doing this. The practice should change regardless." },
          ],
        },
        transfer: {
          prompt: "Which of the habits do you have, and what will you do in the next conversation?",
          options: ["Recall your last conversation with a device user and check each habit", "Decide where you will look while they compose", "Count to twenty before speaking, every time, and note what changes"],
        },
        blocks: [
          { type: "text", heading: "The silence is the person talking", body: "<p>Composing on a device is slow. A sentence may take a minute, or three, or ten. During that time the listener's instinct is to help: read the words as they appear, guess the rest, finish the sentence, or, if the silence goes on, change the subject to something easier. Each of these takes the person's voice. Reading the words before they are released is reading over their shoulder. Guessing the sentence is putting words in their mouth. Changing the subject is telling them their turn is over.</p><p>The rule that fixes all of it is to wait. Look at the person, not the screen. Let them compose. When they play the sentence, that is when it has been said. Then respond to what they said, not to what you guessed.</p>" },
          { type: "accordion", heading: "Habits that take the person's voice", items: [
            { title: "Watching the screen", body: "<p>Reading words as they are selected, before the person has chosen to release them. The person is drafting; you are reading their draft. Look at their face instead.</p>" },
            { title: "Finishing the sentence", body: "<p>Guessing after three words and saying the rest. Even when correct, it teaches the person that composing the whole sentence is unnecessary, and they compose less.</p>" },
            { title: "Answering for them", body: "<p>A question is asked; the worker answers from what they think the person would say. The person has become a topic.</p>" },
            { title: "Filling the silence", body: "<p>Changing the subject, or moving on, because the silence feels long. The silence is the person talking.</p>" },
            { title: "Operating the device", body: "<p>Taking the device to select something for the person. Their voice is now in your hands.</p>" },
          ] },
          { type: "statement", body: "Being right about what someone was going to say is not the same as letting them say it. The difference is whose conversation it is." },
          { type: "leaderMove", heading: "Set the pace to the device", control: "You control the pace of a conversation. Setting it to the device rather than to your comfort is the whole of the practice.", failure: "Do not let a meeting agenda force the pace. If the meeting cannot accommodate the person's method, the meeting is the thing to change.", next: "For your next meeting with a device user, double the time allotted and put their items first." },
          { type: "knowledgeCheck", id: "dsd-communication-methods-4-check", question: "A worker guesses a device user's sentence after three words and is right. What is the harm?", options: [
            { text: "None, since the guess was correct.", correct: false },
            { text: "The person did not get to say it, and learns that composing whole sentences is unnecessary; over time they compose less and their voice shrinks to what listeners can guess.", correct: true },
            { text: "The worker might have been wrong.", correct: false },
          ], feedbackCorrect: "Yes. The harm is in the pattern, not the single instance. The person's range narrows to what can be guessed.", feedbackIncorrect: "The harm exists even when the guess is right. It is about whose words they are." },
        ],
      },
      {
        id: "dsd-communication-methods-5",
        number: 5,
        title: "A communication-access review you can run",
        summary: "Review one interaction for communication access and produce one change.",
        minutes: 12,
        learning: {
          objective: "Complete a communication-access review of one interaction and produce one change with a named owner.",
          takeaways: [
            "The review asks whether the method was established, whether the right support was in place, who the conversation was with, how long the listener waited, and what the person left with in a form they could use.",
            "Most interactions fail at least one of these, and the most common failure is waiting.",
            "Written material the person cannot use is a communication failure as much as an unbooked interpreter.",
          ],
          evidence: "A list of the review's questions, an artifact, a scenario decision and a knowledge check.",
          appliedNextStep: "Run the review on one interaction this week and change one thing about the next.",
        },
        scenario: {
          context: "Your review of an intake finds that the interpreter was booked, the worker spoke to the person directly, and the conversation went well. The person left with a twelve-page printed document in English, which is not a language they read.",
          prompt: "What is the finding?",
          options: [
            { label: "The intake was successful; the document is a minor issue.", response: "The document contains everything the person needs to know about what happens next, and they cannot read it. The conversation was accessible; what they left with was not." },
            { label: "The interaction was accessible and the output was not; the person left with nothing they can use, and the change is a summary in their language, or in a format they can use, before they leave.", response: "This treats what the person leaves with as part of the interaction, which it is. A good conversation followed by an unusable document is half an interaction.", recommended: true },
            { label: "The document should be translated and mailed.", response: "Better than nothing, and the person leaves without knowing what happens next. The summary needs to exist before they go." },
          ],
        },
        transfer: {
          prompt: "Which interaction will you review, and what will you change?",
          options: ["Pick one recent interaction with a person who uses a method other than spoken English", "Run the five questions", "Change one thing about the next interaction, and name who will do it"],
        },
        blocks: [
          { type: "text", heading: "What the person leaves with", body: "<p>Communication access is usually reviewed as a question about the conversation: was there an interpreter, did the worker speak to the person. Those matter. So does what the person takes away. A conversation that went well followed by a document the person cannot read, a letter in a language they do not use, or a voicemail for a person who does not hear, is an interaction that ended in a communication failure. The review counts both halves.</p>" },
          { type: "list", heading: "The five questions", ordered: true, items: ["Was the person's method established before the content began? Was it written down?", "Was the right support in place: a qualified interpreter, the device, the board, enough time?", "Who was the conversation with? Did the worker look at the person, speak in first person, and avoid side conversations?", "How long did the worker wait? Were sentences finished, subjects changed, answers given for the person?", "What did the person leave with, in what form, and can they use it?"] },
          { type: "artifact", kind: "plain-language-flyer", label: "Review record", title: "Communication-access review", summary: "One page that records how one interaction handled method, support, address, waiting and what the person left with.", fields: [
            { label: "Method established and written down", value: "Yes or no; where recorded" },
            { label: "Support in place", value: "Interpreter, device, board, time" },
            { label: "Who the conversation was with", value: "The person, or someone else" },
            { label: "Waiting", value: "Sentences finished, subjects changed, answers given for the person" },
            { label: "What the person left with", value: "Form, language, usable or not" },
          ], action: "Run it on one interaction and change one thing about the next." },
          { type: "leaderMove", heading: "Count the output as part of the interaction", control: "You control whether a written summary in a usable form is part of the standard sequence or an afterthought. Making it standard removes the most common failure at the end of otherwise good meetings.", failure: "Do not let a person leave with a document they cannot use. The document is where the next steps are, and they now do not have them.", next: "For the next interpreted or device-supported meeting, prepare the usable summary before the meeting starts." },
          { type: "flashcards", heading: "Usable, for this person, means", cards: [
            { front: "A Deaf person who uses sign language", back: "<p>A signed video summary, or plain-language written English if they read it well; ask which. English may be a second language.</p>" },
            { front: "A person who reads a language other than English", back: "<p>A translated summary, by a qualified translator, in the language they read. Not a machine-translated document handed over unchecked.</p>" },
            { front: "A person who does not read", back: "<p>An audio recording, a picture-supported summary, or a call to a person they choose who will go through it with them.</p>" },
            { front: "A person who uses a device", back: "<p>The summary loaded onto the device or sent in a form the device can read, so the person can refer to it themselves.</p>" },
          ] },
          { type: "knowledgeCheck", id: "dsd-communication-methods-5-check", question: "An interpreted meeting goes well and the person leaves with a printed document in a language they do not read. How should the interaction be assessed?", options: [
            { text: "As successful, since the meeting itself was accessible.", correct: false },
            { text: "As half accessible: the conversation was, and the output was not, so the person left without the next steps in a form they can use.", correct: true },
            { text: "As a translation problem for another department.", correct: false },
          ], feedbackCorrect: "Yes. What the person leaves with is part of the interaction, and it failed.", feedbackIncorrect: "The output is where the next steps are. Its inaccessibility is a failure of this interaction, not of some other process." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Communication access",
    subtitle: "A one-page reference for anyone who communicates with people who use a method other than spoken English",
    quote: "Not speaking is a fact about method. It is not evidence about understanding.",
    use: {
      purpose: "Start from the assumption that the person understands, learn their method, keep the conversation with them, wait, and make sure they leave with something they can use.",
      remember: ["Presume competence: the burden is on the service to find the method.", "The method belongs to the person; yes-or-no questions are a substitution.", "Speak to the person, in first person, and never have side conversations.", "The silence is the person talking. Wait."],
      doNext: "Run the communication-access review on one interaction and change one thing about the next.",
    },
    sections: [
      { heading: "Before", items: ["Ask how the person communicates and how long it takes.", "Book a qualified interpreter, not family, for the full time.", "Double the time allotted for a device user.", "Prepare the usable summary in advance."] },
      { heading: "During", items: ["Look at the person, not the interpreter or the screen.", "First person. Pause. No side conversations.", "Wait longer than is comfortable, then wait again.", "Say back what you understood; let them correct it."] },
      { heading: "After", items: ["Give a summary in a form they can use, before they leave.", "Write the method down for the next worker.", "Ask the interpreter what would have helped.", "Record what worked so the next booking is right."] },
    ],
  },
  sources: [
    { title: "Minnesota Department of Human Services, language access and communication access", href: "https://mn.gov/dhs/general-public/publications-forms-resources/language-and-format-access/", note: "Department information on interpreter services and alternative formats." },
    { title: "Minnesota Commission of the Deaf, DeafBlind and Hard of Hearing", href: "https://mn.gov/deaf-commission/", note: "State commission with guidance on communication access for Deaf, DeafBlind and hard of hearing Minnesotans." },
    { title: "American Speech-Language-Hearing Association, augmentative and alternative communication", href: "https://www.asha.org/public/speech/disorders/aac/", note: "Public information on augmentative and alternative communication methods and supports." },
    { title: "Registry of Interpreters for the Deaf", href: "https://rid.org/", note: "Professional standards for sign language interpreters, including working with interpreters." },
    { title: "ADA National Network, effective communication", href: "https://adata.org/factsheet/communication", note: "Guidance on the effective communication obligations of public entities." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "State council offering guidance and technical assistance on disability access and policy in Minnesota." },
  ],
};

export default pack;
