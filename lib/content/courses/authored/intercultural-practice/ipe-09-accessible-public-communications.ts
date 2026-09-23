import type { CoursePack } from "../../source-types";

// Intercultural Practice and Equity · Public-service practice · Module 9: Accessible public communications.
// Program-authored for internal DHS and DSD staff. Voluntary, self-directed, no scores and no completion requirement.
const pack: CoursePack = {
  course: {
    id: "ipe-09-accessible-public-communications",
    indexNumber: 1151,
    seriesLabel: "Intercultural Practice and Equity · Public-service practice",
    title: "Accessible Public Communications",
    subtitle: "For most Minnesotans, this division is a web page, a letter, a form or a slide at a public meeting. Four lessons on designing those well, ending with a usability review you run on one real resource.",
    scope: "For internal DHS and DSD staff who design, write, approve or publish anything the public meets: communications and training staff, administrative and support staff, policy and program staff, quality and performance staff, and anyone whose page, letter, notice, form, presentation or training reaches people outside the division. Four short lessons you can take in any order and return to. Voluntary and self-directed: no score, no completion requirement, and nothing you write in a reflection is collected. Completion here does not count toward DHS-required training credits unless management, a director, or DHS leadership expressly approves an exception.",
    treatment: "Four short lessons with Minnesota examples, scenarios, sorting and flashcard practice, private reflection prompts, and a usability review record you can copy into your own work",
    duration: "40–45 minutes",
    author: "One DSD — People, Access and Culture",
    coverImage: "/images/covers/plain-language.jpg",
    coverAlt: "An older man fills out a form while a staff member points to a sentence.",
    introTranscript: "For most Minnesotans, this division is a web page found through a search, a letter in the mail, a form with a deadline on it, a slide at a public meeting, or a training someone told them to take. This module is about designing those things so they work, and about the one method that tells you whether they do. It covers the decisions made before anyone writes a sentence, the assumptions a resource carries about who is reading it, the difference between a standards check and a review with the people who actually use a resource, and how to run one review on one real thing and act on what you find.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Design a public-facing web page, letter, notice, form, presentation or training so that plain language, accessibility and cultural responsiveness are decided while it is being built rather than checked at the end.",
        "Name the assumptions a public communication makes about its reader, and change the design so people who do not already know how DHS works can still act.",
        "Distinguish a standards check, a task-based usability review and community review, and say what each one can and cannot tell you.",
        "Plan and run a usability review of one public-facing resource, including who reviews it, which tasks they attempt, what access is arranged and how they are compensated.",
        "Turn review findings into fixes you own, routed handoffs with suggested wording, and a report back to the people who took part.",
      ],
      evidence: [
        "Four worked scenarios drawn from division communications, language access, quality review and publishing work, each with a recommended response and the reasoning behind it.",
        "A knowledge check in every lesson with feedback that explains the usable answer.",
        "Sorting practice separating design that assumes an expert reader from design that meets the actual range of readers, and findings you can act on from opinions.",
        "A completed usability review record for one real public-facing resource.",
      ],
      appliedNextStep: "Choose one public-facing resource you own or maintain. Run the usability review on it with people who actually use it, make the fixes inside your control, route the rest with suggested wording, and tell the reviewers what changed.",
    },
    governance: {
      contentOwner: "One DSD — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: [
        "A change in ADA Title II effective-communication or web accessibility requirements, or in Section 508 guidance",
        "A change in Minnesota's accessibility standard for state digital content, or in DHS content and writing guidance",
        "Feedback from disabled Minnesotans, community reviewers or interpreters that a review method or example in this module does not match what they experience",
      ],
      relatedDoor: "Formal decisions about publishing a state page, issuing a required notice, approving a vital-document translation or resolving an accommodation request belong to the responsible DHS communications, accessibility, language-access and ADA offices; this module prepares the review and the draft, it does not approve or clear them.",
      toolkitQuestion: "Does this make sense to someone who does not already know how DHS works, and who is left out when the answer is no?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "ipe-09-1",
        number: 1,
        title: "Published is not the same as usable",
        summary: "Six things the division publishes, the one job each of them has, and why plain language, accessibility and cultural responsiveness have to be design decisions rather than a final check.",
        minutes: 11,
        learning: {
          objective: "Design a public-facing web page, letter, notice, form, presentation or training so that plain language, accessibility and cultural responsiveness are decided while it is being built, not checked after it is finished.",
          takeaways: [
            "Every public-facing resource has one job: something a person should be able to do after meeting it. If nobody can write that sentence, more editing will not rescue it.",
            "Plain language, accessibility and cultural responsiveness are the same design work seen from three sides. Done in sequence at the end, each one undoes part of the last.",
            "The parts that stop people most often are structural — the reading path, the format, the channel and the deadline — and they are settled long before anyone writes a sentence.",
            "Publishing is a claim that the resource works. A usability review is the only way to find out whether the claim is true.",
          ],
          evidence: "A scenario about one change carried by three connected resources, flashcards on the five questions that decide whether a resource works, and a knowledge check on where a remaining problem belongs.",
          appliedNextStep: "Take the next public-facing thing you are asked to help with and write its one job in a sentence before you write anything else. If nobody can agree on that sentence, that disagreement is the first finding.",
        },
        scenario: {
          context: "A Disability Services Division program team is changing how people request a service. Three things will carry the change: a public web page owned by the division's communications staff, a letter produced by a statewide system and owned by another office, and an online request form a project team finished last month and has now locked. You are asked to “put it in plain language” a week before the change takes effect.",
          prompt: "Where should the work start?",
          options: [
            {
              label: "Rewrite the web page and the letter in plain language, since the form is locked and the date is fixed.",
              response: "The rewrite will help and it will not be enough. If the form asks for something a person cannot produce, or the letter arrives after the date it refers to, clear sentences describe an obstacle instead of removing one.",
            },
            {
              label: "Ask what a person is supposed to be able to do, check which of the three pieces still has room to change, fix those, and write down in one place what the locked form and the fixed date will cost people.",
              response: "This is the recommended path. It puts the reader's task first, spends the remaining week where it can still change something, and turns the parts you cannot change into a specific record the owners can act on rather than a complaint nobody receives.",
              recommended: true,
            },
            {
              label: "Add a plain-language summary to the top of the web page and note the form as a known issue.",
              response: "A summary at the top of a page most people never reach does not carry the change, and “known issue” without the sentence, the location and the effect on the reader gives the owning office nothing to act on.",
            },
          ],
        },
        transfer: {
          prompt: "Think about the next public-facing resource you will touch. Where is the design already decided, and where is there still room?",
          options: [
            "Name the one thing a person should be able to do after meeting it",
            "List which parts are still open — wording, reading path, format, channel, timing — and which are already fixed",
            "Write one sentence describing what the fixed parts will cost the reader, and name the office that owns them",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "What the division publishes, and what each piece is for",
            body: "<p>A division administers programs. Most Minnesotans never meet a program. They meet a web page they found through a search, a letter that arrived in the mail, a form with a deadline on it, a slide at a public meeting, or a training someone told them to take. Those things are not a description of the work. For the person reading them, they are the work.</p><p>That is why the design of a public-facing resource carries as much weight as the policy behind it. A correct policy announced in a notice nobody can act on produces the same result as no announcement: people miss a deadline, call a line already at capacity, or decide the whole thing is not for them. And the parts that stop people are rarely the sentences. They are the reading path, the format, the channel, the timing and the assumed knowledge, all of which are settled before anyone writes a word.</p><p>Three qualities have to be built in at the same time. Plain language means a reader can understand it on the first read. Accessibility means the resource works with the ways people actually read: screen readers, magnification, a keyboard, captions, print, and a mind that is tired at four in the afternoon. Cultural responsiveness means it makes sense to someone who does not already know how DHS works. Handled one after another at the end, each one undoes part of the last — the plain rewrite breaks the heading structure, the accessibility repair puts the jargon back, the translation preserves a gap nobody saw. Handled together at the start, they are one piece of design work.</p>",
          },
          {
            type: "tabs",
            heading: "Six public-facing products, and the job each one has",
            tabs: [
              { label: "Web content", body: "<p>A page is met in the middle, not at the top. Most people arrive from a search or a forwarded link, land halfway down, and read two lines before deciding whether they are in the right place. Its job is to let someone confirm they are in the right place and reach the next step. Design for that: a first line saying what this is and who it is for, real headings a reader can skim and a screen reader can jump between, link text that names its destination, and the action near the top rather than after the background.</p>" },
              { label: "Letters", body: "<p>A letter arrives without context, often to someone who did not expect it, sometimes months after the conversation it refers to. Its job is to tell one person what has happened, what it means for them, and what they need to do next. Design for that: the decision and the action in the first paragraph, the reason after it, dates written out in full, one named way to ask a question, and nothing essential buried in a paragraph so long the reader gives up before reaching it.</p>" },
              { label: "Notices", body: "<p>A notice carries an obligation and usually a deadline. Some notices have required wording that is not yours to change. Its job is to make sure a person knows something is required of them and by when. Design for that: separate the required text from the part you control, put a plain summary of what to do above the required text rather than below it, make the date unmissable, and check how long the notice actually takes to arrive before setting the window.</p>" },
              { label: "Forms", body: "<p>A form is where a resource stops being reading and starts being work. Its job is to collect exactly what is needed to make a decision, and nothing else. Design for that: ask only what will be used, say why anything sensitive is needed, use plain labels rather than program vocabulary, let a person save and return, and make sure every question can be answered by someone who does not have the document you assumed they have.</p>" },
              { label: "Presentations", body: "<p>A slide deck at a public meeting does two jobs at once: it supports a live explanation and it survives afterwards as a handout. Design for both: real text rather than pictures of text, a size people can read from the back, enough contrast for a bright room, every point also carried in the spoken words for anyone who cannot see the screen, captions for anything recorded, and a version sent out in advance for people who need to read ahead or pass it to an interpreter.</p>" },
              { label: "Training", body: "<p>Training published for people outside the division is a communication with a longer running time. Its job is to leave someone able to do something differently. Design for that: more than one way in, no timed interactions, captions and transcripts, nothing that depends on color or motion alone to carry meaning, plain vocabulary with program terms defined at first use, and examples that reflect the range of communities in Minnesota rather than one default household.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Decide the structure before the sentences",
            control: "You control the order of the work: what the resource is for, who it reaches, what it must carry, then the reading path and format, and only then the wording.",
            failure: "Do not accept “make it plain language” as the whole task when the structure, channel and deadline are the parts stopping people. Accepting the narrow version of a request is how a resource gets edited three times and still does not work.",
            next: "On the next request, ask two questions before you start: what should a person be able to do after this, and which parts are still open to change?",
          },
          {
            type: "flashcards",
            heading: "Five questions that decide whether a resource works",
            cards: [
              { front: "What should a person be able to do?", back: "<p>One sentence, in plain words. If the team cannot agree on it, that disagreement is the first finding, not a delay.</p>" },
              { front: "Where will they meet it?", back: "<p>A search result, a forwarded link, a mailbox, a lobby, a meeting room, a phone. The place decides the format and how much context the opening has to carry.</p>" },
              { front: "What do they have to already know?", back: "<p>Every program term, acronym and process step the resource assumes. Each one is a place where a reader can be shut out while the sentence itself reads perfectly well.</p>" },
              { front: "How much time does it assume?", back: "<p>Time to receive it, read it, ask someone, gather a document, arrange an interpreter and respond. Count backwards from the deadline and see whether the window is real.</p>" },
              { front: "How will you know it worked?", back: "<p>Not by how it reads to you. By watching a few people who actually use it attempt the task it exists for.</p>" },
            ],
          },
          {
            type: "knowledgeCheck",
            id: "ipe-09-1-check",
            question: "A division web page explaining a program change was rewritten in plain language, but the request form it links to still asks for a document most applicants do not have. Where does the remaining problem belong?",
            options: [
              { text: "With the page; the rewrite should explain the document requirement more clearly.", correct: false },
              { text: "With the design of the request itself; clear wording about an obstacle does not remove the obstacle, and whether the document is genuinely needed is a program decision to raise with its owner.", correct: true },
              { text: "With applicants, who should call the help line if they cannot supply the document.", correct: false },
              { text: "Nowhere; the page now meets the plain-language standard.", correct: false },
            ],
            feedbackCorrect: "Yes. Wording can describe a requirement well. Only the people who own the requirement can decide whether it is needed, and that is the question worth raising.",
            feedbackIncorrect: "Ask what actually stops the applicant: the sentence describing the document, or the requirement itself? Editing the first cannot change the second.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you and not collected anywhere: think of something you helped publish. How might your role, your familiarity with the program, or the vocabulary you use every day have shaped what you assumed a reader would already understand?",
          },
        ],
      },
      {
        id: "ipe-09-2",
        number: 2,
        title: "The reader you did not design for",
        summary: "Every public communication carries assumptions about who is reading it. Naming those assumptions is what makes a resource culturally responsive rather than merely translated.",
        minutes: 11,
        learning: {
          objective: "Identify the assumptions a public-facing resource makes about its reader — knowledge, reading, channel, trust, time and who decides — and change at least one of them so people outside those assumptions can still act.",
          takeaways: [
            "The default reader is a fiction: someone who already knows the program, reads English comfortably, trusts an envelope from the state, has a stable address and a device, and can act inside ten days. Most resources are built for that person without anyone deciding to.",
            "Translation carries whatever the source already was. An unclear notice translated into ten languages is an unclear notice in ten languages.",
            "Cultural responsiveness in a public communication is mostly structural: what the resource assumes you already know, which channel it assumes you trust, how much time it assumes you have, and who it assumes decides.",
            "“If it is clear, it is clear for everybody” is the most common and most expensive assumption in public writing, because it treats one way of reading as the neutral one.",
          ],
          evidence: "A scenario about a translated notice that did not reduce calls, a sorting exercise separating design that assumes an expert reader from design that meets the actual range, and a knowledge check on where a translation problem starts.",
          appliedNextStep: "Take one resource you maintain and list what it assumes the reader already knows. Change the single assumption that stops the most people, and note who you would ask to check the change.",
        },
        scenario: {
          context: "A division notice about an annual reassessment was translated into several languages after community organizations reported that people did not understand it. Three months later, calls to the help line have not dropped, and a culturally specific organization that reviewed the translations tells the division the wording is accurate but readers still cannot tell whether they have to do anything, or by when.",
          prompt: "What is the most useful reading of that feedback?",
          options: [
            {
              label: "The translations need a second review by a different translator.",
              response: "Accuracy was not the failure. A second translation of the same source will reproduce the same confusion, because the confusion is in what the English notice leaves unsaid.",
            },
            {
              label: "The English source never states whether a response is required, what to do or by when; translating it moved the same gap into every language. Repair the source with the reviewers who located the problem, pay them for that work, then translate again.",
              response: "This is the recommended path. It treats the community reviewers as the experts who found the defect, puts the repair where the defect is, and stops the division paying twice for the same gap.",
              recommended: true,
            },
            {
              label: "Add a line to the translated versions directing readers to call the help line with questions.",
              response: "That sends the cost of an unclear notice back to the people who received it, and to the staff answering the line. The notice still does not tell anyone what to do.",
            },
          ],
        },
        transfer: {
          prompt: "What does one of your own resources assume about the person reading it?",
          options: [
            "Write down what it assumes the reader already knows about how DHS works",
            "Write down which channel, address, device or amount of time it assumes",
            "Name one assumption you can change this month, and one you will need to raise with someone else",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Who a resource was quietly built for",
            body: "<p>Every public communication has a reader in mind. Usually nobody chose that reader on purpose. The default reader is the person the writer can picture most easily: someone who already knows what the program is called, reads English comfortably, receives mail at a stable address, trusts an envelope from a state agency, has a device and a connection, understands that being eligible and being authorized are different things, and can act within ten days without rearranging work, transportation or care.</p><p>Real readers differ from that in ordinary ways. A person may be reading a second or third language. A person may be Deaf, with American Sign Language as a first language, which makes English text a translation task rather than a reading task. A person may have moved twice this year. A person may have learned from experience that a letter from a government office is usually bad news, and set it aside unopened. A family may make this kind of decision together, across two households, with a different sense of who speaks for whom. None of that is unusual, and none of it is the reader's failure.</p><p>What keeps this invisible is the belief that clear writing is clear for everybody — that difference exists but is small enough to handle later. The framework this program uses names that position minimization, and in public communication it is the most expensive assumption there is, because it treats one way of reading as the neutral one. Moving toward acceptance and adaptation means something concrete here: you find out what the resource assumes, you change the design so more than one kind of reader can act, and you check the change with people who are not you. That is a statement about the work. It is never a label attached to a person.</p>",
          },
          {
            type: "accordion",
            heading: "Six assumptions worth checking in any public communication",
            items: [
              { title: "What the reader already knows", body: "<p>Program names, acronyms, the difference between applying and being authorized, what the local agency does, what a service agreement changes. Write down every term the resource uses without explaining it. Each one is a point where a reader can be shut out while the sentence itself is perfectly clear.</p>" },
              { title: "How the reader reads", body: "<p>English as a second or third language; American Sign Language as a first language; low vision and magnification; a screen reader; fatigue, pain or medication that shortens attention; a small phone screen shared with other people. The resource has to survive all of these, and short sentences with defined terms help every one of them.</p>" },
              { title: "Which channel reaches them", body: "<p>Mail assumes a stable address. Email assumes an account someone checks. A web page assumes a search that returns it. A phone line assumes time on hold during working hours. Communities reach for different channels, and people who move often, work nights or share a device are reached by very few of them. Ask which channel your readers actually use before choosing one.</p>" },
              { title: "Whether they trust the sender", body: "<p>Trust is not evenly distributed, and the reasons predate anyone on your team. Some people open an envelope from the state with confidence; others have learned to expect a denial, an investigation or a bill. A resource that assumes goodwill gets read less carefully than one that says plainly, near the top, what this is, what it is not, and what happens next.</p>" },
              { title: "How much time it assumes", body: "<p>Count backwards from the deadline: printing, mailing, forwarding, reading, understanding, asking someone, arranging an interpreter, gathering a document, responding through the one channel offered. A ten-day window is rarely ten days. If the real window is three, the deadline is a barrier wearing the clothes of a policy.</p>" },
              { title: "Who is expected to decide", body: "<p>Public writing often assumes one adult deciding alone and quickly. Many families decide together; some people use supported decision-making; some rely on a person who holds no legal role but is the one who reads the mail. A resource that speaks only to a single named individual, or demands an immediate answer, works against the way many households actually make decisions.</p>" },
            ],
          },
          {
            type: "sorting",
            id: "ipe-09-2-sort",
            heading: "Assumes an expert reader, meets the actual range, or responsive in name only?",
            categories: ["Assumes an expert reader", "Meets the actual range of readers", "Responsive in name only"],
            items: [
              { text: "The notice opens with the program's formal name and a statutory citation, then explains what happened in the fourth paragraph.", category: "Assumes an expert reader" },
              { text: "The first line says what this letter is about, whether the reader has to do anything, and by when.", category: "Meets the actual range of readers" },
              { text: "A page showing photographs of people from several communities, published as a scanned image a screen reader cannot read.", category: "Responsive in name only" },
              { text: "The form says why it asks for a date of birth, and lets a person save their answers and return later.", category: "Meets the actual range of readers" },
              { text: "A translated version produced from an English notice that never says whether a response is required.", category: "Responsive in name only" },
              { text: "The request assumes the reader can name which of three programs they are enrolled in.", category: "Assumes an expert reader" },
            ],
          },
          {
            type: "quote",
            text: "We told them the translation was accurate. That was never the question. People were calling because the letter never said whether they had to do anything. Accurate and useless are not opposites.",
            cite: "Composite community reviewer perspective, illustrative",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-09-2-check",
            question: "A division notice is translated into several languages. Community organizations report that readers still cannot tell whether a response is required. Where does the repair belong?",
            options: [
              { text: "With the translations; a different translator should review the wording.", correct: false },
              { text: "With the English source, which never states plainly whether a response is required or by when; translating it carried the same gap into every language.", correct: true },
              { text: "With readers, who should call the help line printed at the bottom of the notice.", correct: false },
              { text: "With the mailing schedule, which should allow more time.", correct: false },
            ],
            feedbackCorrect: "Yes. Translation carries whatever the source already was. Repair the source with the reviewers who located the gap, then translate again.",
            feedbackIncorrect: "Ask what the reader could not determine, and whether any language version of that same source would have told them. The gap sits upstream of the translation.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you and not collected anywhere: pick one resource you helped produce. Who could be helped, burdened, excluded or misunderstood by it, and whose expertise was missing from the room when it was designed?",
          },
        ],
      },
      {
        id: "ipe-09-3",
        number: 3,
        title: "What a usability review is, and what it is not",
        summary: "A standards check, a staff opinion and a task-based review with the people who use a resource answer three different questions. Only one of them tells you whether the resource works.",
        minutes: 11,
        learning: {
          objective: "Distinguish a standards check, a task-based usability review and community review; choose the right one for a given question; and write findings that name the task, the stopping point and who was affected.",
          takeaways: [
            "A standards check asks whether a resource meets a requirement. A usability review asks whether a person can do the thing it exists for. Both are needed; neither substitutes for the other.",
            "Ask people to attempt a real task and watch where they stop. Do not explain, do not rescue, and do not ask whether they liked it.",
            "A small number of reviewers surfaces most of what is wrong. The constraint is who they are, not how many.",
            "Disabled Minnesotans, people who work with interpreters, families and culturally specific organizations take part as compensated advisors and co-designers. They are contributing expertise, not receiving training.",
          ],
          evidence: "A scenario about testing a new public page, tabs comparing three kinds of review, a sorting exercise separating findings you can act on from opinions, and a knowledge check on writing a finding another office can use.",
          appliedNextStep: "Write the three tasks you would ask someone to attempt on a resource you maintain, in the words a member of the public would use, and name who you would ask and how they would be paid.",
        },
        scenario: {
          context: "The division has rebuilt a public page explaining how to request a service. A quality and performance analyst proposes to test it by sending the link to two internal workgroups and collecting staff comments. A contract is also available for an automated accessibility scan.",
          prompt: "What should the review include?",
          options: [
            {
              label: "The staff comments and the scan. Between them they cover expertise and compliance.",
              response: "Between them they cover the division's own knowledge and the part of the standard a tool can measure. Neither tells you whether a person who does not work here can find the page, understand what is being asked and complete the request.",
            },
            {
              label: "Run the scan, keep the staff comments as background, and add a task-based review in which a small number of people who actually use the service attempt three real tasks while someone watches where they stop, with reviewers reached through community organizations and paid for their time.",
              response: "This is the recommended combination. The scan finds what a tool can find, staff comments catch internal inaccuracies, and only the task-based review answers the question the page exists to answer. Paying reviewers is what makes the expertise real rather than borrowed.",
              recommended: true,
            },
            {
              label: "Skip the scan and rely on the task-based review, since real people will find the accessibility problems anyway.",
              response: "A review with people is not a substitute for the standards check. Reviewers will not encounter every requirement, and treating disabled reviewers as the division's accessibility check makes them responsible for obligations that belong to the division.",
            },
          ],
        },
        transfer: {
          prompt: "If you had one afternoon and a small budget, how would you review a resource you maintain?",
          options: [
            "Write the three tasks a member of the public would actually attempt",
            "Name who you would ask, how you would reach them, and how they would be compensated",
            "Decide in advance what you will do with a finding you cannot fix yourself",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Three different questions, three different reviews",
            body: "<p>“We reviewed it” can mean three unrelated things. A standards check asks whether the resource meets a requirement: heading structure, contrast, keyboard access, captions, link text, alternative text on images that carry meaning, marked table headers. Much of that can be checked quickly, some of it by an automated scan, and the result is a list measured against a rule.</p><p>A task-based usability review asks a different question: can a person do the thing this resource exists for? You ask a small number of people who actually use the service to attempt a real task while someone watches. You learn where they stop, what they expected, what they tried that you did not anticipate, and what they would do next in real life, which is often to give up or to ask a relative.</p><p>Community review and co-design ask the third question: what does this resource assume, and what does it cost the people it assumes wrong about? That work belongs to disabled Minnesotans, families, interpreters and culturally specific organizations, invited as advisors and compensated for their expertise. They are not being trained by this, and they are not a focus group brought in to approve a decision already made. They are being asked early enough that the answer can still change something.</p><p>All three are worth doing and none of them replaces another. A resource can pass every automated check and still be unusable. It can test beautifully with staff and fail with everyone else. And it can be technically correct and culturally illegible at the same time.</p>",
          },
          {
            type: "tabs",
            heading: "What each kind of review can and cannot tell you",
            tabs: [
              { label: "Standards check", body: "<p><strong>Tells you:</strong> whether headings, contrast, keyboard access, link text, alternative text, captions and document structure meet the requirement. Fast, repeatable, and partly automatic.</p><p><strong>Cannot tell you:</strong> whether the content makes sense, whether the task can be completed, or whether the deadline is realistic. An automated scan finds a minority of real problems, and it will never notice a heading that is structurally correct and meaningless.</p>" },
              { label: "Task-based usability review", body: "<p><strong>Tells you:</strong> where a real person stops, what they expected, what they could not find, what they misread, and what they would do next. A handful of reviewers surfaces most of what is wrong.</p><p><strong>Cannot tell you:</strong> whether every requirement is met, or how the resource behaves for someone whose access needs nobody in the group shares. It is evidence about the resource. It is never a measurement of the people reviewing it.</p>" },
              { label: "Community review and co-design", body: "<p><strong>Tells you:</strong> what the resource assumes, which words land differently than intended, what would make people trust it, and what should have been asked before drafting began.</p><p><strong>Cannot tell you:</strong> what any one person or organization speaks for. Invite early, pay for the time, be specific about what is still open to change, and say afterwards what happened as a result.</p>" },
            ],
          },
          {
            type: "list",
            heading: "How to run a task-based review in one afternoon",
            ordered: true,
            items: [
              "Write the one thing the resource exists for, then turn it into three tasks in the words a member of the public would use.",
              "Invite five or six people who actually use the service, reaching them through organizations that already have the relationship. Say how long it will take and how they will be paid.",
              "Arrange access before the invitation goes out: interpreters, captioning, a format that works with a screen reader, a room someone can get into, or a remote option.",
              "Give each person the task, then stop talking. Do not explain the page, define the terms or point at anything.",
              "Watch where they stop. Note the exact words they read aloud, what they tried, and where they hesitated.",
              "When they stop, ask what they expected to happen and what they would do next in real life.",
              "Write down what happened rather than what you concluded, the same day, while the wording is still exact.",
              "Sort the findings by who is stopped and how completely, decide what you will fix yourself, and route the rest with suggested wording.",
            ],
          },
          {
            type: "sorting",
            id: "ipe-09-3-sort",
            heading: "A finding you can act on, an opinion, or a fix in disguise?",
            categories: ["Finding you can act on", "Opinion", "A fix in disguise"],
            items: [
              { text: "Four of five reviewers read the deadline as the date they had to call, not the date the form was due.", category: "Finding you can act on" },
              { text: "The page feels cluttered.", category: "Opinion" },
              { text: "We should move the request button to the top of the page.", category: "A fix in disguise" },
              { text: "Two reviewers using a screen reader reached the third question and could not tell which answer field belonged to it.", category: "Finding you can act on" },
              { text: "I think most people would understand this fine.", category: "Opinion" },
              { text: "Add a short recorded walkthrough explaining the form.", category: "A fix in disguise" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Watch, do not rescue",
            control: "You control what you say while someone is attempting a task, and the difference between watching and helping is the whole value of the review.",
            failure: "Do not explain the page, define a term, point at the button or fill an awkward silence. The moment you help, you have replaced the finding with your own knowledge, and the next reader will not have you sitting beside them.",
            next: "Before your next review, write the three tasks and the one sentence you will repeat when someone asks for help: “I want to see what you would do if I were not here.”",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-09-3-check",
            question: "Which of these is written as a finding another office can act on?",
            options: [
              { text: "The online form is confusing and needs to be redesigned.", correct: false },
              { text: "Reviewers did not like the form.", correct: false },
              { text: "Three of five reviewers, asked to request a service, stopped at the question about who may act for them because they could not tell whether it applied; two of the three used a screen reader and could not tell which field went with the question. Suggested wording is attached.", correct: true },
              { text: "The form has accessibility issues that should be addressed as soon as possible.", correct: false },
            ],
            feedbackCorrect: "Yes. The task, the number of people, the exact stopping point, the effect and a suggested replacement give the owner something they can act on this week.",
            feedbackIncorrect: "Compare what each one hands to the person who has to fix it. Only one names the task, the stopping point, who was affected and what to change.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you and not collected anywhere: think about the last time a resource you worked on was reviewed. How could the people most affected have shaped it earlier, and what would it take to invite them at that point next time?",
          },
        ],
      },
      {
        id: "ipe-09-4",
        number: 4,
        title: "Review one resource",
        summary: "The practical tool: a usability review record you can copy, complete for one real public-facing resource, and turn into fixes, routed handoffs and a report back to the people who took part.",
        minutes: 11,
        learning: {
          objective: "Complete a usability review record for one public-facing resource, naming the resource, the reviewers and their compensation, the tasks attempted, what happened, the findings with owners, and what changed.",
          takeaways: [
            "Pick something real, currently in use, and reaching people outside the division. One finished review teaches more than a plan to review everything.",
            "Record what happened, not what you concluded. “Four of five reviewers stopped at the third question” survives a handoff; “the form is confusing” does not.",
            "Rank findings by who is stopped and how completely, not by how annoying they are.",
            "Telling reviewers what changed is part of the method, not a courtesy. Without it the next invitation is worth less, and deserves to be.",
          ],
          evidence: "A usability review record you can copy into your own work, a scenario about carrying findings you do not all own, and a knowledge check on a handoff another office can act on.",
          appliedNextStep: "Run the review on one resource this month. Make the fixes you own, route the rest with suggested wording, and send the reviewers a short note saying what changed because of them.",
        },
        scenario: {
          context: "You have run a short review of a public information sheet your unit maintains. Five reviewers attempted three tasks. Four could not tell whether they needed to respond. Two could not use the linked online form at all with a screen reader, and that form belongs to another office. One reviewer said the photograph at the top does not look like anyone she knows. The next print run is in a week.",
          prompt: "How do you carry the findings?",
          options: [
            {
              label: "Fix the wording about responding, reprint, and hold the rest until there is time to handle it properly.",
              response: "The wording fix is right, and stopping there buries the most serious finding. Two reviewers could not use the form at all; every week that finding waits is a week the barrier stays in place for everyone else who arrives.",
            },
            {
              label: "Fix the wording and the reading path in the sheet you own before the print run; send the form's owner the exact task, what happened and suggested wording that same week; record the photograph comment with what you would change and who should decide; and tell all five reviewers what happened to each finding.",
              response: "This is the recommended handling. It separates what you own from what you do not, routes the most disabling finding immediately with enough detail to act on, keeps a comment you cannot resolve alone visible instead of dropping it, and closes the loop with the people who did the work.",
              recommended: true,
            },
            {
              label: "Send all five findings to the accessibility office and wait for direction before changing anything.",
              response: "Sending everything upward stalls the fixes that sit inside your own authority and hands another office work that is yours. Route what you cannot change; do what you can.",
            },
          ],
        },
        transfer: {
          prompt: "Which resource will you review, and who will hear what came of it?",
          options: [
            "Name the resource, the three tasks and the week you will run it",
            "Name who you will invite, how you will reach them, and how they will be paid",
            "Name the colleague or office that will receive the findings you cannot fix yourself",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Pick one real resource and review it properly",
            body: "<p>The temptation at the end of a module like this is to propose a review program for everything the division publishes. Do not. Choose one resource that is in use now, that reaches people outside the division, and that you can change at least part of: the page you maintain, the standing letter your unit sends, the information sheet you reprint every year, the deck you present at public meetings, the training your unit publishes.</p><p>Run it small and run it properly. Three tasks. Five or six reviewers reached through organizations that already have the relationship. Access arranged before the invitation goes out, and payment arranged before anyone says yes. Watch rather than help, write down what happened, and sort what you find by who is stopped and how completely.</p><p>Then keep the record honest. Compare two ways of writing the same finding. “The form is confusing” cannot be acted on, cannot be checked later, and quietly puts the fault on the reader. “Asked to request a service, four of five reviewers stopped at the question about who may act for them; three said they could not tell whether it applied to them, and two using a screen reader could not tell which field went with the question” names the task, the stopping point, the number of people and the effect. The second version is the one that still means something months later, in another office, to someone who was not in the room.</p>",
          },
          {
            type: "artifact",
            kind: "tagged-document",
            label: "Practical tool",
            title: "A usability review of one public-facing resource",
            summary: "One page you can copy into your own work and complete for a single web page, letter, notice, form, presentation or training.",
            fields: [
              { label: "Resource and the task it exists for", value: "Name the resource, where people meet it, who owns each part of it, and the one thing a person should be able to do after meeting it. Example: the public page explaining how to request a service; found through a search; page owned by our unit, linked form owned by another office; a person should be able to tell whether they can ask for the service and then submit a complete request." },
              { label: "Reviewers, how they were invited and how they are paid", value: "Five or six people who actually use the service, reached through organizations that already have the relationship. Record how you invited them, what you told them about the time involved and what is still open to change, the access arranged in advance — interpreters, captioning, a format that works with a screen reader, a room someone can get into, a remote option — and the payment arranged before anyone agreed. Community reviewers are contributing expertise; they are not learners here." },
              { label: "Tasks attempted, in the reader's own words", value: "Three real tasks written the way a member of the public would say them, not the way the division names them. Example: “Find out whether you can ask for this service.” “Start the request and get as far as you can.” “Find out what happens after you send it, and who to call if you hear nothing.”" },
              { label: "What happened, recorded as it happened", value: "For each task and each reviewer: where they stopped, the exact words they read aloud or repeated back, what they tried, what they expected instead, and what they said they would do next in real life. Record events, not conclusions. Note anything you had to say to keep the session moving, because that is a finding too." },
              { label: "Findings, owners, first fixes and what you told the reviewers", value: "Write each finding as a sentence naming the task, how many reviewers were affected, the stopping point and the effect. Rank by who is stopped and how completely, not by how annoying it is. Mark each one as yours to fix, someone else's to fix, or a decision for a named office, and for anything that is not yours attach the exact location and suggested wording. Finish with the short note you sent every reviewer saying what changed because of them and what is still open." },
            ],
            action: "Copy the five fields into a blank page, complete them for one resource you maintain this month, make the fixes inside your control, route the rest with suggested wording, and send every reviewer the last field.",
          },
          {
            type: "list",
            heading: "Fixes that need nobody's permission",
            ordered: false,
            items: [
              "Put what the reader must do, and by when, in the first two lines.",
              "Write dates out in full instead of “within ten days of the date of this letter.”",
              "Replace a program term with the plain words for it, keeping the program term once in brackets if it is needed later.",
              "Move essential information out of an attachment, a scan or a photograph and into real text.",
              "Give link text that names where it goes, and headings a reader can skim and a screen reader can jump between.",
              "Name a real person or team, a real way to reach them, and the hours they actually answer.",
              "Add one line inviting people to say what they need in order to take part, with examples of what is available.",
              "Send materials early enough that someone can read them, ask a question and arrange an interpreter before the date that matters.",
            ],
          },
          {
            type: "leaderMove",
            heading: "Fix what you own, route the rest the same week",
            control: "You control the wording, the reading path, the timing and the channel of the parts you maintain, and you control how precisely you describe the parts you do not.",
            failure: "Do not hold every finding until the whole set can be solved, and do not send a general concern about accessibility upward. A vague message lands nowhere and comes back as a question, while the barrier stays in place for everyone who arrives meanwhile.",
            next: "Make your own fixes before the next print run or publication, and send each remaining finding the same week as a named location, what happened, who was affected and suggested wording.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-09-4-check",
            question: "Your review found that a form owned by another office cannot be completed with a screen reader. What is the most useful thing to send that office?",
            options: [
              { text: "A message asking them to review the form for accessibility when they have time.", correct: false },
              { text: "The exact task reviewers attempted, the question where they stopped, what the screen reader announced instead, how many reviewers were affected, suggested wording or structure for the fields, and a question about who owns the change.", correct: true },
              { text: "A copy of the full review record with a note asking them to look at the relevant part.", correct: false },
              { text: "A line added to your own page warning people that the linked form may be difficult to use with a screen reader.", correct: false },
            ],
            feedbackCorrect: "Yes. The task, the stopping point, what actually happened, who was affected and a proposed change give the owning office something they can act on immediately.",
            feedbackIncorrect: "Ask what each message leaves the receiving office to work out for themselves. Only one hands them the location, the effect and a suggested repair.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you and not collected anywhere: if this resource has been excluding someone for a while, what would accountability and repair require beyond quietly correcting it, and what might accessibility mean here beyond the legal minimum?",
          },
        ],
      },
    ],
  },
  jobAid: {
    title: "Accessible public communications",
    subtitle: "One page for anyone designing or reviewing something the public will meet",
    quote: "Publishing is a claim that it works. A review is how you find out whether the claim is true.",
    use: {
      purpose: "Keep the design questions and the review method in view while you plan a page, a letter, a notice, a form, a presentation or a training.",
      remember: [
        "Write the one thing a person should be able to do after meeting this resource. If nobody can agree on that sentence, start there.",
        "Plain language, accessibility and cultural responsiveness are one piece of design work. Done in sequence at the end, each one undoes part of the last.",
        "Translation carries whatever the source already was. Repair the source first.",
        "A standards check asks whether it meets a requirement. A usability review asks whether a person can do the thing.",
        "Ask people to attempt a real task and watch where they stop. Do not explain and do not rescue.",
        "Community reviewers are compensated advisors, not learners. Tell them what changed because of them.",
      ],
      doNext: "Run one usability review this month on a resource you maintain, fix what you own, and route the rest with suggested wording.",
    },
    sections: [
      {
        heading: "Before anything is written",
        items: [
          "Write the one thing a person should be able to do after meeting this resource.",
          "Name where they will meet it: a search result, a mailbox, a lobby, a meeting room, a phone.",
          "List every program term and acronym the resource assumes, and decide which to explain and which to remove.",
          "Count backwards from the deadline through mailing, reading, asking, arranging an interpreter and gathering documents, and see whether the window is real.",
          "Decide the reading path, the format and the channel before the wording; those are the parts that stop people.",
        ],
      },
      {
        heading: "The usability review, in short",
        items: [
          "Three tasks, written in the words a member of the public would use.",
          "Five or six people who actually use the service, reached through organizations that already have the relationship.",
          "Access arranged before the invitation; payment arranged before anyone agrees.",
          "Give the task, then stop talking. Do not explain, define, point or rescue.",
          "Record what happened, not what you concluded, the same day.",
          "Rank findings by who is stopped and how completely, then say what changed.",
        ],
      },
      {
        heading: "Writing a finding someone can act on",
        items: [
          "Name the task the person was attempting.",
          "Name the exact stopping point and what happened instead.",
          "Name how many reviewers were affected and what it cost them.",
          "Attach suggested wording or structure, and ask who owns the change.",
        ],
      },
      {
        heading: "Who this helps",
        items: [
          "Communications and training staff, who design and maintain most of what the public actually meets — a useful place to start.",
          "Administrative and support staff, who send the standing letters, publish the sheets and arrange the sessions — a useful place to start.",
          "Policy and program staff, who decide what a change is called, what a form asks for and how long people have to respond.",
          "Quality, performance and data staff, who can build a review into the way a change is checked rather than adding it afterwards.",
        ],
      },
      {
        heading: "Related modules",
        items: [
          "Language access in state programs",
          "Inclusive meetings and engagement",
          "Program and service design",
          "Digital equity and accessible technology",
          "Responding to concerns and feedback",
        ],
      },
    ],
  },
  sources: [
    { title: "Minnesota Department of Human Services, Content and writing guidelines", href: "https://mn.gov/dhs/digital-showcase/content-guidelines/", note: "The department's own editorial guidance on first-read understanding, descriptive headings, familiar terms and writing suited to the reader." },
    { title: "Minnesota IT Services, Accessibility", href: "https://mn.gov/mnit/about-mnit/accessibility/", note: "Minnesota's accessibility standard for state digital content, the Web Content Accessibility Guidelines it follows, and practical guidance for documents and web pages." },
    { title: "PlainLanguage.gov, Test your assumptions", href: "https://www.plainlanguage.gov/guidelines/test/", note: "Federal plain-language guidance on testing a document with the people who will use it, including task-based testing and paraphrase testing." },
    { title: "Section508.gov, Test for accessibility", href: "https://www.section508.gov/test/", note: "How federal programs test digital content for accessibility, including what automated checking can and cannot find." },
    { title: "W3C Web Accessibility Initiative, Involving users in web projects", href: "https://www.w3.org/WAI/planning/involving-users/", note: "Guidance on involving people with disabilities throughout a project, and why informal task-based evaluation finds problems that standards checking alone does not." },
    { title: "ADA.gov, Effective communication", href: "https://www.ada.gov/resources/effective-communication/", note: "U.S. Department of Justice guidance on Title II effective communication, auxiliary aids and services, and primary consideration of the person's expressed preference." },
    { title: "U.S. Department of Health and Human Services, National CLAS Standards", href: "https://thinkculturalhealth.hhs.gov/clas", note: "National standards for culturally and linguistically appropriate services, including language assistance, communication practices and community engagement." },
    { title: "Minnesota Framework for Universal Multicultural Instructional Design", href: "https://mncpd.org/wp-content/uploads/2016/12/MN_Framework_for_Universal_Multicultural_Instructional_Design.pdf", note: "The design reference for this curriculum: multiple ways to engage, culturally responsive materials and accessible instruction." },
  ],
};

export default pack;
