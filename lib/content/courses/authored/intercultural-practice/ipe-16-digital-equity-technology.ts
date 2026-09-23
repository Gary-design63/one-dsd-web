import type { CoursePack } from "../../source-types";

// Intercultural Practice and Equity · Public-service practice · Module 16: Digital equity and accessible technology.
// Program-authored for internal DHS and DSD staff. Voluntary, self-directed, no scores and no completion requirement.
const pack: CoursePack = {
  course: {
    id: "ipe-16-digital-equity-technology",
    indexNumber: 1158,
    seriesLabel: "Intercultural Practice and Equity · Public-service practice",
    title: "Digital Equity and Accessible Technology",
    subtitle: "Every online process is a set of requirements about devices, connections, sign-ins, privacy and reading speed. Four lessons on seeing the whole path a person travels, ending with a review you run on one real service.",
    scope: "For internal DHS and DSD staff whose work reaches people through a screen: communications, training and learning-design staff; administrative and support staff; policy, program and operations staff; quality, performance and data staff; contracts, fiscal, grants and procurement staff; and supervisors who decide how a process is delivered. Four short lessons you can take in any order and return to. Voluntary and self-directed: no score, no ranking, no completion requirement, and nothing you write in a reflection is collected. Completion here does not count toward DHS-required training credits unless management, a director, or DHS leadership expressly approves an exception.",
    treatment: "Four short lessons with Minnesota examples, scenarios, sorting and flashcard practice, private reflection prompts, and a digital access review you can copy and run on one real service or workflow",
    duration: "40–45 minutes",
    author: "One DSD — People, Access and Culture",
    coverImage: "/images/covers/viewpoint-wellbeing-surveys.jpg",
    coverAlt: "A man fills a survey on a laptop in a cubicle.",
    introTranscript: "Most of what this division asks people to do now happens on a screen: find the page, make an account, sign in, read the form, send a document, wait for a confirmation. Every one of those steps is a requirement about equipment, connection, privacy, reading and time, and most of them were set by people who never got stuck. This module looks at the whole path rather than the page: what digital access actually asks of a person, what makes assistive technology work or fail, how identity checks and on-screen wording decide who finishes, and how to review one real service or workflow for the places it stops somebody. It ends with a review you can copy and run this month.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Trace the whole path a person travels through one DSD digital service, from learning it exists to keeping a confirmation, and name the link most likely to stop someone.",
        "Identify the ordinary choices in documents, pages, recordings and forms that make assistive technology work or fail, and fix the ones you control.",
        "Explain how identity checks, security settings, privacy conditions and on-screen wording create or remove barriers, and describe a change that keeps the requirement and removes the barrier.",
        "Plan who reviews a digital service and when, including compensated review by disabled Minnesotans and community organizations.",
        "Run a digital access review on one real service or workflow and record findings with a step, an owner, a suggested change and what you did about it.",
      ],
      evidence: [
        "Four worked scenarios drawn from public comment, internal training, grant administration and stakeholder engagement, each with a recommended response and the reasoning behind it.",
        "A knowledge check in every lesson with feedback that explains the usable answer.",
        "Sorting practice that separates what removes a barrier from what creates one, and that separates findings you fix from findings you route or send up.",
        "A completed digital access review of one real service or workflow, with what you changed and what you sent onward.",
      ],
      appliedNextStep: "Choose one digital service or workflow you touch — a public form, an online comment page, a grant application, a registration, an internal process your team runs. Run the review on it, fix what you own, route the rest with suggested wording, and tell the people who raised the problem what happened to it.",
    },
    governance: {
      contentOwner: "One DSD — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: [
        "A change in U.S. Department of Justice requirements for state and local government web content and mobile applications, or in the technical guidelines those requirements name",
        "A change in Minnesota's accessibility standard for state digital content, or in the accessibility language required when the state buys technology",
        "Feedback from disabled Minnesotans, disability-led organizations or division staff that an example does not match how a DSD digital service actually behaves",
      ],
      relatedDoor: "Formal decisions about which technology the division buys, how a state system is configured, what identity and security checks apply, and whether a digital service meets the state's accessibility standard belong to the responsible DHS business owners, Minnesota IT Services staff and accessibility coordinators; this module prepares your review, it does not approve or certify a system.",
      toolkitQuestion: "Who could be helped, burdened, excluded or misunderstood by moving this process onto a screen, and what would accessibility mean here beyond a legal minimum?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "ipe-16-1",
        number: 1,
        title: "The whole path, not the page",
        summary: "Everything an online process quietly asks for before it gives anything back: a device, a connection, an account, a readable screen, private time, and a way to ask a question that is not itself online.",
        minutes: 11,
        learning: {
          objective: "Trace the whole path a person travels through one DSD digital service, from learning it exists to keeping a confirmation, and name the link most likely to stop someone.",
          takeaways: [
            "A digital service is a chain of separate requirements: learning it exists, having a device that runs it, a connection that holds, an account you can get back into, a screen you can read, private time to finish, and a confirmation you can keep. The chain is only as strong as its weakest link, and the weak link is rarely the one that was tested.",
            "Accessibility standards describe one link very well. They say what must be true of the page. They say nothing about whether a person owns a device, has coverage where they live, has a private place to use it, or has the hours the process assumes.",
            "Moving a process online moves work; it does not remove it. Somebody absorbs the scanning, the printing, the trip to a library, the borrowed phone, the call during working hours. Digital equity asks who that somebody is and whether anyone decided it on purpose.",
            "“One online form for everyone” sounds fair and is not. Treating identical treatment as equal access is the minimization pattern this program exists to move past: sameness in the process, unevenness in who can actually use it.",
          ],
          evidence: "A scenario about an online comment form that met the technical standard, a knowledge check on what a rising completion count can and cannot show, and a walk of the six links in a service of your own.",
          appliedNextStep: "Pick one digital service your work touches. Write its six links on one line each, in the order a person meets them, and mark the link you have never actually tested yourself.",
        },
        scenario: {
          context: "A proposed amendment to one of Minnesota's disability waiver plans is posted for public comment. To make commenting easier, the division replaces the mailed comment form and the comment mailbox with a single online form built in the state's survey tool. The supplier's report says the form meets the Web Content Accessibility Guidelines at Level AA. Comment volume is higher than it was for the last amendment. Two weeks in, a disability-led organization writes to say that several of the people most affected have not been able to comment at all.",
          prompt: "What should the team look at first?",
          options: [
            {
              label: "The supplier's report and the comment volume, since the form meets the standard and more people are commenting than before.",
              response: "Both facts are true, and neither answers what was raised. A conformance report describes the page. The volume describes the people who reached the page. Neither can see a person who never got to the form at all.",
            },
            {
              label: "The whole path: how a person learns the comment period is open, what the form needs from a device and a connection, what happens to someone who cannot finish it, and what replaced the paper form and the mailbox.",
              response: "This is the review the message calls for. It treats commenting as a chain with six links rather than one page, and it looks for the people missing from the count instead of describing the people inside it.",
              recommended: true,
            },
            {
              label: "Ask the organization to gather comments from the people it works with and submit them together.",
              response: "This shifts public participation onto an unpaid third party and puts an organization between a person and their own comment. It may be worth offering as one more route, with payment for the work, but not instead of fixing the form and restoring a way through that is not online.",
            },
          ],
        },
        transfer: {
          prompt: "Take one digital service or workflow your work touches. Which of the six links have you actually tested, and which have you only assumed?",
          options: [
            "Write the six links for that service on one line each, in the order a person meets them",
            "Mark the links you have tried yourself and the links you have only read about in a report",
            "Pick the untested link that would stop the most people, and find out this month what happens there",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "A chain, and a standard that covers one link",
            body: "<p>When a process moves onto a screen, it stops being one thing a person does and becomes a chain of separate requirements. They have to learn the service exists. They need a device that runs current software. They need a connection that holds long enough to finish. They usually have to create an account and be able to get back into it later. They have to read the screen, understand what is being asked, and produce whatever it asks for, often a document photographed or scanned. Then they need a confirmation they can keep and a way to ask a question when something goes wrong.</p><p>Accessibility standards describe one of those links very well. The Web Content Accessibility Guidelines set out what has to be true of the page itself. Minnesota's accessibility standard for state digital content follows them, and the U.S. Department of Justice requirement for state and local government web content and mobile applications points to the same guidelines, with compliance dates that vary by the size of the government entity. Meeting that standard matters and is not optional. It also says nothing about whether the person has a device, a connection, a private place to sit, or the hours the process assumes.</p><p>This is how a service can be certified and still be unreachable. The division tests the link it can see. The chain breaks at the links nobody looked at: the notice that only reached people already on an email list, the upload that rejects a photograph taken on an older phone, the help line answered only during the hours a person is at work.</p>",
          },
          {
            type: "list",
            heading: "Six links, and the question each one asks",
            items: [
              "Finding out: does the person learn the service exists, in a language and format they use, from a source they already trust, or only by searching for a phrase they would have to know in advance?",
              "Getting on: do they have a device that runs what the page needs, a connection that holds for the length of the task, and enough data left in the month to finish it?",
              "Getting in: can they create an account and get back into it later, including after changing a phone number, losing a device or forgetting a password?",
              "Reading the screen: does it work with the settings and tools they use — enlarged text, a screen reader, captions, speech input, keyboard only, a small phone screen?",
              "Finishing: can they produce what is asked for, in the time allowed, somewhere private enough to enter personal information?",
              "Afterward: do they keep a confirmation they can read later, and is there a way to ask a question that is not itself online?",
            ],
          },
          {
            type: "tabs",
            heading: "Four ways the chain breaks in Minnesota",
            tabs: [
              {
                label: "The device is not theirs",
                body: "<p>A shared family laptop. A phone that belongs to a spouse. A library computer with a forty-five minute limit. A device in a residential setting that staff control. The person may be perfectly able to use the service and still have no private, unhurried time on a screen. A process that asks for personal information, a long form and a saved password has assumed a private device that many people do not have.</p>",
              },
              {
                label: "The connection comes and goes",
                body: "<p>Service quality is not spread evenly across Minnesota. In parts of the state a household may have one option, or rely on a mobile connection with a monthly limit. A long form with no save-and-return, an instruction given only as video, or a large upload turns an ordinary task into an expensive one. Minnesota's Office of Broadband Development publishes where service is and is not available; that map rarely matches the assumption inside the design.</p>",
              },
              {
                label: "The screen does not fit the person",
                body: "<p>Text that cannot be enlarged without pieces disappearing. A form whose labels are not attached to their fields. A control that responds only to a mouse. A color that is the only signal that something is wrong. Each of these is invisible to the person who built it and absolute for the person who meets it.</p>",
              },
              {
                label: "There is no way through that is not online",
                body: "<p>The paper form is discontinued, the phone line has a long wait during working hours, and the office visit needs an appointment made online. The service has not become optional. It has become conditional on being able to use one channel. Any process that moves online needs a route that does not, published in the same place, with the same weight, and staffed well enough to be a real option.</p>",
              },
            ],
          },
          {
            type: "leaderMove",
            heading: "Count who is missing, not only who finished",
            control: "You control which number goes into the report. Completions, average time and satisfaction all describe the people who got through.",
            failure: "Do not let a rising completion count stand as evidence that a change worked. It cannot see anyone who stopped at the first link, and it never will.",
            next: "In your next report on a digital service, add one line naming who the count cannot see, and one thing you will do to find out.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-16-1-check",
            question: "A division moves a public process online and reports that completions are up and average completion time is down. What does that evidence actually support?",
            options: [
              { text: "The change improved access for everyone who uses the process.", correct: false },
              { text: "The change worked well for the people who reached and finished the online form; it says nothing about the people who never reached it, and those are the people most likely to have been stopped.", correct: true },
              { text: "The change was neutral, because completion counts are not affected by how a process is delivered.", correct: false },
              { text: "The change should be reversed, because moving a process online excludes people by definition.", correct: false },
            ],
            feedbackCorrect: "Yes. A completion count is measured among the people who got in. Anyone the chain stopped is missing from the number entirely, which is part of why the number looks good.",
            feedbackIncorrect: "Ask who is inside the number. A completion count can only describe people who reached the form. Finding out who did not takes a different method: asking partners, checking who stopped responding, and walking the earlier links yourself.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you and not collected anywhere: the last time I described a process as easy, whose device, connection, reading speed and free hours was I picturing, and how close were they to my own?",
          },
        ],
      },
      {
        id: "ipe-16-2",
        number: 2,
        title: "Assistive technology, and the ordinary things that break it",
        summary: "What the tools do, what stops them working, and how much of that is decided in the documents, decks and recordings staff make themselves.",
        minutes: 11,
        learning: {
          objective: "Identify in your own documents, pages and recordings the specific choices that stop assistive technology working, and fix the one you control today.",
          takeaways: [
            "Assistive technology is ordinary equipment: screen readers, magnification and text settings, captions and transcripts, speech input, keyboard-only and switch access, reading support, alternative keyboards, communication devices. Much of it is built into a phone or computer a person already owns, and many people use several together, or only on bad days.",
            "What breaks these tools is equally ordinary: a heading made by enlarging bold text, a scanned page with no text underneath, a table drawn for looks, an image carrying information with no description, a link that says “click here”, color used as the only signal, a control that works only with a mouse.",
            "Structure is the accessible part. Heading styles, real tables, named form fields, described images and text that is actually text are what a screen reader reads, and they are also what makes a long document usable for anyone skimming it on a phone.",
            "The repair is upstream and cheap. Fixing a template, a recording routine or a standard posting once is worth more than repairing every document made from it afterward, and none of it waits for someone to disclose a disability.",
          ],
          evidence: "A scenario about a recorded policy briefing posted with a scanned deck, a sorting exercise separating what removes a barrier from what creates one, and a knowledge check on where the largest gain comes from in a long document.",
          appliedNextStep: "Open the last document or slide deck you sent to more than ten people. Check its headings, images, links and tables, fix what you can in it, then fix the template it came from so the next one starts right.",
        },
        scenario: {
          context: "A DSD training team records a two-hour policy briefing for staff who could not attend and posts it on the internal site with the slide deck and a written summary. The deck was scanned from a printed copy. The recording has automatic captions, which miss or garble most of the program terms. A staff member who is hard of hearing asks whether accurate captions are coming, and a colleague who uses a screen reader says the deck opens as a picture with nothing in it to read.",
          prompt: "What should the training team do?",
          options: [
            {
              label: "Point to the automatic captions, offer to answer questions by email, and note the issue for next time.",
              response: "This leaves two colleagues doing extra work to get what everyone else already has, and it treats a fixable defect as a preference. It also guarantees the same posting next month, because nothing upstream changed.",
            },
            {
              label: "Correct the captions against the recording, post a transcript with speaker names, replace the scan with the original file saved with its headings and described images, say in the posting what is available, then fix the template and the posting routine so the next briefing starts this way.",
              response: "This repairs what is posted and the process that produced it. Correcting automatic captions takes a fraction of the time it takes to write them, and the original file already holds the structure the scan destroyed.",
              recommended: true,
            },
            {
              label: "Ask the two staff members to send a list of what is wrong so the team can correct it.",
              response: "It asks the people who were shut out to do the checking, and it makes them explain a disability to get what colleagues already have. Ask what would help in future, after you have fixed what you already know is broken.",
            },
          ],
        },
        transfer: {
          prompt: "Which template, recording routine or standard posting does most of your team's material come out of, and what would change if you fixed it once?",
          options: [
            "Name the template or routine and the number of documents a year that come out of it",
            "List the four things to correct in it: heading styles, described images, readable link text, real tables",
            "Fix it, tell the team it changed, and say what they no longer have to do by hand",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "The tools are ordinary, and so is what breaks them",
            body: "<p>Assistive technology is not exotic equipment. It is a screen reader that speaks or brailles what is on the screen; magnification that enlarges part of it; a setting that raises contrast or text size; speech input that types what a person says; switch or keyboard-only control for someone who cannot use a mouse; captions and transcripts; reading support that highlights text as it reads aloud; an alternative keyboard; a communication device. Much of it is already in the phone or computer a person owns, and plenty of people use two or three of these at once, or only when a condition flares.</p><p>What stops these tools is just as ordinary, and nearly all of it is decided in documents and pages that staff make themselves. A heading made by enlarging bold text carries no structure, so a screen reader cannot use it to move through a long document, and neither can anyone skimming on a phone. A scanned page is a photograph of words with nothing underneath to read. A table drawn to line things up reads as a jumble. An image holding the only copy of a deadline, with no description, is a blank. A link that says “click here” tells a person moving link to link nothing at all. Color used as the only signal disappears for the reader who cannot see the difference.</p><p>The useful conclusion is not that this is technical work for somebody else. It is that the fix is upstream and cheap. Structure added once, in the template, in the recording routine, in the standard posting, outperforms any amount of repair afterward, and it never requires anyone to disclose a disability first.</p>",
          },
          {
            type: "flashcards",
            heading: "What the tools actually do",
            cards: [
              { front: "Screen reader", back: "<p>Speaks or brailles what is on the screen and moves through it by heading, link, table and form field. It reads structure, not appearance, so a heading style is the difference between a navigable document and an undifferentiated wall of text.</p>" },
              { front: "Magnification and text settings", back: "<p>Enlarges part of the screen, or raises text size and contrast across it. A layout that hides content, overlaps it, or forces side-to-side scrolling to read one line breaks under ordinary everyday use.</p>" },
              { front: "Captions and transcripts", back: "<p>Captions carry speech and important sound as text on a recording. A transcript makes the same content readable, searchable and usable at a person's own pace. Automatic captions are a first draft, and they are weakest on exactly the program terms a briefing depends on.</p>" },
              { front: "Keyboard-only and switch access", back: "<p>Some people navigate everything by keyboard or by a single switch. Anything that responds only to a mouse — a drag-only control, a menu that opens on hover, a button that cannot be reached by tab — is simply unavailable to them.</p>" },
              { front: "Speech input and reading support", back: "<p>Speech input types and controls by voice. Reading support reads text aloud and highlights it as it goes. Both depend on real text, and neither can do anything with a scanned image or a field whose label is not attached to it.</p>" },
              { front: "Communication devices", back: "<p>Some people speak using a device, and composing a sentence takes time. A process built around a phone call with a hold queue, or a meeting where speed decides who is heard, excludes them by pace rather than by rule.</p>" },
            ],
          },
          {
            type: "sorting",
            id: "ipe-16-2-sort",
            heading: "Removes the barrier, creates it, or moves the work onto the person?",
            categories: ["Removes the barrier", "Creates the barrier", "Moves the work onto the person"],
            items: [
              { text: "Using the heading styles in the template so a long document can be moved through by heading.", category: "Removes the barrier" },
              { text: "Posting the slide deck as a scan of a printed copy.", category: "Creates the barrier" },
              { text: "Adding a line that says materials are available in other formats on request, and nothing else.", category: "Moves the work onto the person" },
              { text: "Correcting the automatic captions on a recording and posting the transcript beside it.", category: "Removes the barrier" },
              { text: "Marking a required field only by turning its border red.", category: "Creates the barrier" },
              { text: "Asking the one colleague who uses a screen reader to test every new form, on top of their own job.", category: "Moves the work onto the person" },
              { text: "Writing link text that says where the link goes instead of “click here”.", category: "Removes the barrier" },
              { text: "Setting a form to time out after ten minutes with no warning and no saved answers.", category: "Creates the barrier" },
            ],
          },
          {
            type: "accordion",
            heading: "Five things staff decide without noticing",
            items: [
              { title: "Headings", body: "<p>A heading style tells the document that this line is a heading. Enlarged bold text only tells a sighted reader. With real headings, a screen reader can jump section to section, a long document gets a working table of contents, and anyone reading on a phone can find the part they need. This is one menu choice, and it is the single highest-value habit in the list.</p>" },
              { title: "Images and charts", body: "<p>If an image carries information — a deadline, a chart, a diagram of a process — that information has to exist in text as well, either as a description attached to the image or in the paragraph beside it. A chart also needs its point written out: not only what it shows, but what it means. Decoration needs no description; information always does.</p>" },
              { title: "Links", body: "<p>Many people move through a page link by link, hearing only the link text. “Click here”, “read more” and a bare web address are all dead ends out of context. Write what the link leads to, in words that make sense read on their own, and keep the same wording for the same destination across your materials.</p>" },
              { title: "Tables and layout", body: "<p>A table built with real rows, columns and header cells can be read across and down. A table drawn with spacing and boxes to make a page look tidy becomes a jumble when read aloud, and it collapses on a phone. Use tables for data, headings for structure, and never a table to lay out a page.</p>" },
              { title: "Files and formats", body: "<p>A scanned document is a picture of words: nothing to read, nothing to search, nothing to enlarge cleanly. Post the original file, saved with its structure intact, and say plainly in the posting what is available and in what form. If a form has to be completed and returned, check that it can be completed on a screen rather than only printed and signed.</p>" },
              { title: "Color and contrast", body: "<p>Color is useful as a second signal and dangerous as the only one. Red text, a green highlight or a colored status dot means nothing to someone who cannot see the difference, and low contrast defeats a much larger group than most people expect, including anyone reading outdoors or on an old screen. Add a word, a symbol in the text, or a label beside the color.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Fix the template, not the copy",
            control: "You control the template, the recording routine and the standard posting your team uses every week.",
            failure: "Do not repair documents one at a time after someone complains. The next one arrives in the same condition, and the person who complained gets asked to complain again.",
            next: "Take the template behind your most-used document or deck, give it real headings, described images and readable link text once, and tell the team it changed.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-16-2-check",
            question: "A team is asked to make a forty-page guidance document accessible before it is posted. Where does the largest gain come from?",
            options: [
              { text: "Adding a note at the end offering the document in other formats on request.", correct: false },
              { text: "Running an automated checking tool and fixing whatever it reports.", correct: false },
              { text: "Giving the document real structure — heading styles, described images, real tables, descriptive links and text that is actually text — and then fixing the template it was written in.", correct: true },
              { text: "Saving the whole document as a scan so it looks identical for every reader.", correct: false },
            ],
            feedbackCorrect: "Yes. Structure is what assistive technology reads, and it is what makes a long document usable for everyone else too. Fixing the template stops the next forty pages arriving in the same state.",
            feedbackIncorrect: "Automated checking finds some problems and misses most of the ones that matter. An offer at the end puts the work on the reader. A scan removes the text entirely. Structure is the part that does the work.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you and not collected anywhere: in the material my team sends out, what have we been treating as a favor granted on request that is really part of making the thing usable, and whose expertise is missing from how we decide that?",
          },
        ],
      },
      {
        id: "ipe-16-3",
        number: 3,
        title: "Sign-ins, privacy and the words on the screen",
        summary: "Identity checks, security settings, shared devices and error messages decide who finishes an online process, and they are usually written by people who never get stuck.",
        minutes: 11,
        learning: {
          objective: "Explain how identity checks, security settings, privacy conditions and on-screen wording create or remove barriers in an online process, and describe one change that keeps the requirement and removes the barrier.",
          takeaways: [
            "Security and privacy requirements are real obligations, and they are not the barrier. How they are met is the barrier: a code sent only to a personal mobile phone, a session measured for a fast reader, an identity check that asks for a document a person has never held.",
            "Almost every one of those can be met another way without weakening the requirement: a code by voice call, a printed backup code, a second named person on an organization's account, a longer session with a warning and saved answers, a wider range of accepted file types, an alternative verification route.",
            "Privacy assumes a private device and a private place. When a design forces someone to borrow a screen or hand a sign-in to a family member or support worker to finish a state process, the process has created a confidentiality problem it will never see, and the person carries it.",
            "The words on the screen are part of the access design. An error that says what failed, what a valid answer looks like and who to call is an accessibility feature. “Invalid entry” is a dead end with a friendly font.",
            "Every online-only process needs a route that is not online, published in the same place, at the same size, and staffed well enough that it is a real option rather than a formality.",
          ],
          evidence: "A scenario about small organizations that started a grant application and never submitted it, an accordion naming four tensions honestly, and a knowledge check on error wording.",
          appliedNextStep: "Find the last error message, sign-in instruction or timeout warning your team wrote or approved. Rewrite it so it says what happened, what a valid answer looks like and who to contact, then check that the contact is answered by a person.",
        },
        scenario: {
          context: "A DSD grant opportunity for community organizations moves to an online application. Fiscal and grants staff notice that several small organizations, including two disability-led groups and a culturally specific organization, created accounts and never submitted. The system is working as designed: each account belongs to one named individual, signing in requires a code sent to a mobile phone, the session ends after fifteen minutes without activity, and attachments must be one file type under a set size. The help line is listed at the bottom of the page.",
          prompt: "What is the most useful thing the grants team can do with this finding?",
          options: [
            {
              label: "Send a reminder to the organizations that started and did not finish, with the deadline and a link back to the application.",
              response: "A reminder sends people back to the same wall. It is worth doing after somebody has found out what the wall is; on its own it reads as pressure aimed at the organizations least able to comply.",
            },
            {
              label: "Write down exactly what the sign-in and submission steps require — a personal mobile phone, one named individual, a fast reading speed, one file type — take that list to the business owner and the staff who set the security rule, and ask which of those the requirement actually needs and which are only how it was built.",
              response: "This keeps the obligation intact and questions the implementation, which is where nearly all of the barrier lives. It also produces a specific list somebody can act on instead of a general complaint about the system.",
              recommended: true,
            },
            {
              label: "Record that the sign-in is a security requirement and therefore outside the scope of a grants review.",
              response: "Security requirements are real, and how they are met is still a design decision with a cost attached. Naming that cost is part of the review; deciding the requirement is not, and the two are easy to confuse.",
            },
          ],
        },
        transfer: {
          prompt: "Which step in a process you help run assumes something about a person's equipment, documents or reading speed that nobody has ever checked?",
          options: [
            "Name the step and write down everything it currently assumes, one line each",
            "Mark which assumptions the requirement actually needs and which are only how it was built",
            "Take the list to the person who owns the step and ask for one of those assumptions to change",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "The requirement is not the barrier; the way it is met usually is",
            body: "<p>Identity checks, sign-ins, timeouts and file rules exist for reasons that are easy to defend. Personal information has to be protected. Public money has to reach the organization it was awarded to. A state system cannot be open to anyone who finds the address. None of that is the barrier. The barrier sits in the assumptions underneath the implementation: that everyone has a personal mobile phone that receives text messages, that one individual alone speaks for an organization, that fifteen minutes is enough to read a page, that any document can be produced as a particular kind of file under a particular size.</p><p>Each of those was a decision somebody made, usually quickly, usually without anyone in the room who would be stopped by it. Almost all of them can be met another way while keeping the requirement whole: a code delivered by voice call as well as by message, printed backup codes, a second named person on an account, a longer session with a warning and answers saved when it ends, a wider range of file types, an alternative verification route for a person who has never held the usual documents.</p><p>Privacy has a second face here that is easy to miss. A design that assumes a private device forces some people to borrow one, or to hand a sign-in to a family member, a support worker or a neighbor in order to finish a state process. The process has then created a confidentiality problem it will never record, and the person carries it long after the form is submitted.</p>",
          },
          {
            type: "accordion",
            heading: "Four tensions worth naming out loud",
            items: [
              { title: "Protecting the account, and being reachable", body: "<p>A second factor at sign-in protects an account, and sending the only code to a personal mobile phone assumes a phone, a number that does not change, a plan with messages included, and coverage where the person actually is. A voice call, a code by email, printed backup codes and an in-person route each keep the protection and remove an assumption. The requirement is the protection, not the text message.</p>" },
              { title: "A private process, and a shared device", body: "<p>Confidentiality rules picture a person alone at their own screen. Many people share a device with family, use one at a library or a community organization, or live somewhere the device belongs to the setting. Save-and-return, short forms, no password stored by default, a clear way to sign out, and a route that is not online are what respect privacy in those conditions.</p>" },
              { title: "Preventing fraud, and the burden of proof", body: "<p>Verification steps are aimed at a small number of people acting in bad faith and are paid for by everyone. The heaviest payers are those least likely to hold the standard documents: people who have moved often, people whose name has changed, people who have never had a driver's license, people leaving an institution or a shelter. Ask what the check establishes, and whether anything else establishes the same thing.</p>" },
              { title: "Efficiency, and processing time", body: "<p>Timeouts, short windows and fast-moving screens are built around a reader who is quick and uninterrupted. Anyone who reads slowly, listens through a screen reader, composes on a communication device, or is caring for someone in the same room is penalized by a design that was only trying to be tidy. A warning before the session ends, and answers that survive it, cost almost nothing.</p>" },
            ],
          },
          {
            type: "list",
            heading: "Wording on the screen that decides whether someone finishes",
            items: [
              "An error that says what failed, where it is, and what to do next — not a code, not a red outline on its own, and not “invalid entry”.",
              "A required field that says what counts as a valid answer before the person has to guess at it.",
              "A sign-in instruction that says what to do when the phone number or email on the account no longer works.",
              "A warning before a session ends, early enough to act on, with the answers saved when it ends anyway.",
              "A confirmation the person can keep, in plain words, saying what was received, what happens next and roughly when.",
              "A named contact with a phone number that a person answers, published in the same place and the same size as the online route.",
              "Terms explained where they appear: what an account is for, what submitted means, and what happens between submitted and decided.",
            ],
          },
          {
            type: "quote",
            text: "I could have done it myself if the code had come to the house phone. Instead my daughter signed in for me, so now she knows everything about my services, and the system thinks she is me.",
            cite: "Composite participant perspective, illustrative",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-16-3-check",
            question: "An online form rejects a phone number and shows a message. Which message is doing its job?",
            options: [
              { text: "“Invalid entry. Please try again.”", correct: false },
              { text: "“Something went wrong. Contact the help line.”", correct: false },
              { text: "“The phone number could not be read. Enter ten digits with no spaces or dashes. If the number on your account no longer works, call the number at the top of this page and a staff member can change it.”", correct: true },
              { text: "“Error in field 3.”", correct: false },
            ],
            feedbackCorrect: "Yes. It names what failed, describes a valid answer, and offers a route for the person whose real problem is not a typing mistake.",
            feedbackIncorrect: "A useful message names the field, describes what a valid answer looks like, and gives a route to a person for anyone the screen cannot help. A code, an apology or “try again” leaves someone exactly where they were.",
          },
          {
            type: "leaderMove",
            heading: "Ask what the requirement needs, not whether it is required",
            control: "You control the question you bring to the business owner and to the staff who set the rule.",
            failure: "Do not stop at “it is a security requirement.” That answer closes the conversation without telling anyone which part is the obligation and which part is only how it was built.",
            next: "Take one step people get stuck on, list everything it currently assumes, and ask which of those the requirement actually needs. Bring the list, not the complaint.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you and not collected anywhere: who could be burdened, excluded or misunderstood by the checks in a process I help run, and if someone has been shut out of it for a while, what would accountability and repair require beyond a quiet correction?",
          },
        ],
      },
      {
        id: "ipe-16-4",
        number: 4,
        title: "Review one digital service for access barriers",
        summary: "A review anyone can run without tools or budget: walk the whole workflow, try it the way other people have to, make it fail on purpose, and write findings someone can act on.",
        minutes: 11,
        learning: {
          objective: "Run a digital access review on one real service or workflow and record findings that name the step, who is stopped, what it costs them, who owns the change and what you did about it.",
          takeaways: [
            "You do not need to be a specialist to find most barriers. Keyboard only, enlarged text, a phone screen, captions, a slow connection and a deliberate mistake will surface more than a conformance report will.",
            "A review covers the workflow, not the page: how people learn it exists, how they get on, how they get in, how they read it, how they finish, what confirmation they keep, how they ask for help, and what happens when something fails.",
            "A finding is usable when it names the step, quotes what the screen says, names who is stopped and what it costs them, names an owner, and offers wording or a setting someone can act on.",
            "Sort every finding into fix it yourself, route it with wording, or send it up for a decision. That sorting is what turns a review into changes rather than a list nobody reads.",
            "A staff review is not review by the people the service is for. Disabled Minnesotans, disability-led organizations, interpreters and culturally specific organizations can be invited and paid as reviewers and co-designers, early enough to change the design. Their time is expertise, and expertise is paid for.",
            "Working this way is the program's larger movement in miniature: away from minimization, where one process for everyone counts as fair, toward acceptance and adaptation, where a service is built to change when the people it is for say what stopped them. The continuum describes the work, never a person.",
          ],
          evidence: "A scenario about reviewing a registration form in two weeks with no budget, a completed digital access review you can copy, sorting practice that separates fix from route from decide, and a knowledge check on what makes a finding usable.",
          appliedNextStep: "Run the review on one service or workflow this month. Fix what you own, route the rest with suggested wording, and tell the people who raised the problem what happened to it.",
        },
        scenario: {
          context: "An administrative team is asked to check a new online registration and accommodation-request form before it replaces email sign-ups for a DSD community listening session. They have two weeks, no testing tools and no budget. The program manager says a full accessibility audit is not possible in the time available, so the team should simply confirm that the form works.",
          prompt: "What is the best use of the two weeks?",
          options: [
            {
              label: "Confirm the form submits correctly and note in the record that a full audit should be scheduled later.",
              response: "A submission test finds the defects that stop the team, not the ones that stop a participant. The audit scheduled for later usually arrives after the form has already been used for the event it was built for.",
            },
            {
              label: "Run the checks the team can run — keyboard only, enlarged text, a phone screen, a slow connection, captions, the route that is not online and the help line — walk the whole workflow from the invitation to the confirmation, and write findings sorted into fix, route and decide.",
              response: "These checks need no budget and no tools, and they surface a large share of the barriers that actually stop people. Sorting the findings is what turns the two weeks into changes instead of a document.",
              recommended: true,
            },
            {
              label: "Wait for specialist review so the team does not report something incorrectly.",
              response: "A review nobody runs finds nothing, and the form goes out either way. Specialist review and paid review by disabled Minnesotans are both worth arranging; neither is a reason to spend two weeks waiting.",
            },
          ],
        },
        transfer: {
          prompt: "Which service or workflow will you review, and who will you tell what you found?",
          options: [
            "Name the service and the day you will walk it end to end",
            "Name the person who owns the step you expect to be worst, and how you will send them wording they can use as written",
            "Name one thing you will pay a community reviewer or a disabled Minnesotan to look at, and where that money comes from",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "What a review is, and what it is not",
            body: "<p>A digital access review is not an audit and should not pretend to be one. An audit is a specialist assessment against the full standard, usually purchased, and it belongs in the process for a system the division is buying or rebuilding. A review is something you can run in an afternoon on a service that already exists, with nothing but the computer in front of you, to find the barriers that are stopping people now.</p><p>It covers the workflow, not the page. Start where a person starts — the invitation, the letter, the search, the flyer — and go all the way to the confirmation and the question afterward. Do it as yourself first. Then repeat the parts that matter with the settings other people have to use: keyboard only, text enlarged, sound off, a phone screen, a connection that drops. Then do the thing most reviews skip. Make it fail. Enter the wrong thing, let the session end, send the wrong file type, and read what the screen tells a person who now has to decide whether to start again.</p><p>Write findings someone can act on. A finding that says the form is not accessible produces a meeting. A finding that names the step, quotes what the screen says, names who is stopped and what it costs them, names an owner and offers specific wording produces a change. Then sort what you found into three piles — fix it yourself, route it with wording, send it up for a decision — so the review becomes work rather than a list.</p><p>One limit is worth saying plainly. A staff review is not review by the people the service is for. Disabled Minnesotans, disability-led organizations, interpreters and culturally specific organizations can be invited and paid as reviewers and co-designers, early enough that what they say can still change the design. They are not learners in this work and not a courtesy at the end of it. Their time is expertise, and expertise is paid for.</p>",
          },
          {
            type: "list",
            heading: "Checks you can run without tools or budget",
            items: [
              "Keyboard only: put the mouse aside. Can you reach every control, see where you are on the page, and finish the task?",
              "Enlarged text: raise the text size well above the default. Does anything disappear, overlap, or force you to scroll sideways to read one line?",
              "A phone screen: do the whole task on a phone, including sending any document. Is a photograph taken on a phone accepted?",
              "Sound off, then captions on: can you follow any recording without sound, and are the captions right on the terms that matter?",
              "A slow or interrupted connection: start the task, wait, come back. Are the answers still there?",
              "Make it fail: a wrong entry, a wrong file type, an ended session, a password nobody has. What does the screen tell a person to do next?",
              "The route that is not online: call the number, in the hours a working person would call. How long does it take, and does a person answer?",
              "The confirmation: is it readable later, and does it say what was received, what happens next and roughly when?",
            ],
          },
          {
            type: "artifact",
            kind: "tagged-document",
            label: "Practical tool",
            title: "A digital access review for one service or workflow",
            summary: "One page you can copy and run on a single online service, form or internal workflow.",
            fields: [
              { label: "Service and the people it is for", value: "Name the service or workflow, what a person is actually trying to accomplish, and who uses it: members of the public, families, community organizations, staff, or all of them. Then write the two or three situations you will hold in mind while you walk it — no device of their own, a mobile connection with a monthly limit, a screen reader, enlarged text, a communication device, a shared household screen, a first language that is not English." },
              { label: "Step, barrier and who is stopped", value: "One line per step, in the order a person meets them: finding out, getting on, getting in, reading the screen, finishing, confirmation, asking for help, and what happens when something fails. For each barrier, quote what the screen actually says or does, name who it stops, and say what it costs them — a second appointment, a borrowed phone, a lost deadline, a person who gives up and is never counted." },
              { label: "Owner and the change requested", value: "Name who owns the step: your own team, the business owner for the system, communications, the grants or contracts staff, the office that set the security rule. Write the change as wording or a setting somebody can act on — the sentence to replace, the session length to extend, the file type to accept, the phone number to publish — rather than as a description of the problem." },
              { label: "Fix, route or decide", value: "Sort every finding into three lists. Fix: inside your own authority, done this month. Route: send to the named owner with the quoted screen, who is stopped, and suggested wording. Decide: needs someone with authority over the requirement itself, and goes up with the cost written next to it, so the decision is made knowingly rather than by default." },
              { label: "What changed and who was told", value: "Record what you changed, what you sent onward, and what you decided not to change and why, so the next reviewer inherits the thinking instead of repeating it. Then close the loop with whoever raised the problem — the partner, the participant, the colleague — and say what happened to it. A review that never reaches the person who reported the barrier teaches them not to report the next one." },
            ],
            action: "Copy the five fields into a blank page, walk one real service this month, make the changes you own, route the rest with wording, and tell the people who raised the problem what happened.",
          },
          {
            type: "sorting",
            id: "ipe-16-4-sort",
            heading: "Fix it, route it, or send it up for a decision?",
            categories: ["Fix it yourself this month", "Route it with wording", "Send it up for a decision"],
            items: [
              { text: "The confirmation your team writes says only that a submission was received, and nothing about what happens next.", category: "Fix it yourself this month" },
              { text: "The registration page your team publishes says nothing about how to ask for captions, an interpreter or materials in another format.", category: "Fix it yourself this month" },
              { text: "The slide deck posted with your recording is a scan with no readable text in it.", category: "Fix it yourself this month" },
              { text: "The online form ends the session after ten minutes and discards everything entered.", category: "Route it with wording" },
              { text: "The help page uses program acronyms that are never explained.", category: "Route it with wording" },
              { text: "The upload accepts one file type and rejects photographs taken on a phone.", category: "Route it with wording" },
              { text: "Signing in requires a code sent to a mobile phone, and there is no other route.", category: "Send it up for a decision" },
              { text: "The only way to reach a person is a phone line staffed three hours a day, and the paper form has been discontinued.", category: "Send it up for a decision" },
            ],
          },
          {
            type: "knowledgeCheck",
            id: "ipe-16-4-check",
            question: "Which review finding can the person who receives it actually act on?",
            options: [
              { text: "“The application system is not accessible and should be reviewed.”", correct: false },
              { text: "“Several users reported difficulty with the sign-in process.”", correct: false },
              { text: "“Getting in: after the code step the page says “Invalid entry” and nothing else, and the only code route is a message to a mobile phone. This stops applicants without a mobile phone or without coverage, and they lose the deadline. Owner: the business owner for the system. Requested change: add a voice-call code and printed backup codes, and replace the message with wording that says what failed and who to call.”", correct: true },
              { text: "“Accessibility should be considered earlier in projects like this one.”", correct: false },
            ],
            feedbackCorrect: "Yes. Step, quoted screen, who is stopped, what it costs them, an owner, and a change written as something to do. That arrives as work rather than as criticism.",
            feedbackIncorrect: "Read each one as the person who has to act on it. Only one names the step, quotes what the screen says, says who is stopped and what it costs them, names an owner and offers a specific change.",
          },
          {
            type: "leaderMove",
            heading: "Make it fail on purpose, before somebody else does",
            control: "You control whether your test of a service follows the path that works or the path that breaks.",
            failure: "Do not review a digital service only by completing it correctly. Nearly every real barrier lives in what happens after a mistake, an ended session, a rejected file or a password nobody has.",
            next: "In your next review, spend half the time making the service fail, and write down exactly what the screen tells a person to do next.",
          },
          {
            type: "list",
            heading: "Where to go next in this area",
            items: [
              "Accessible public communications — the documents, pages and notices a digital service is built out of",
              "Language access in state programs — what an online process owes people who do not read English",
              "Inclusive meetings and engagement — the same questions asked of a room, a call and a hybrid session",
              "Program and service design — deciding how a service is delivered, before it is built",
              "Responding to concerns and feedback — what happens after somebody tells you a process stopped them",
            ],
          },
          {
            type: "statement",
            body: "Private reflection, kept by you and not collected anywhere: what might accessibility mean in this service beyond the legal minimum, and how could the people most affected have shaped it earlier, on paid terms, instead of being left to report what is already broken?",
          },
        ],
      },
    ],
  },
  jobAid: {
    title: "Digital equity and accessible technology",
    subtitle: "One page for anyone who publishes, buys, runs or checks something people meet on a screen",
    quote: "The standard covers the page. The person has to get through the whole path.",
    use: {
      purpose: "Keep the path, the tools and the review in view while you publish a page, post a recording, run an online process, or check a form before it goes out.",
      remember: [
        "A digital service is a chain: finding out, getting on, getting in, reading the screen, finishing, and what happens afterward. Standards describe one link of it.",
        "Completion counts describe the people who got through. Anyone the chain stopped is not in the number.",
        "Structure is the accessible part: heading styles, real tables, described images, descriptive links, text that is actually text. Fix the template, not the copy.",
        "Automatic captions are a first draft. Correcting them takes a fraction of the time writing them would.",
        "Security and privacy requirements are not the barrier; how they are met usually is. Ask what the requirement actually needs.",
        "Every online-only process needs a route that is not online, published in the same place, at the same size, and staffed enough to be real.",
        "A staff review is not review by the people the service is for. Invite and pay disabled Minnesotans and community organizations early, while the design can still change.",
      ],
      doNext: "Run the review on one real service this month, fix what you own, route the rest with wording, and tell the person who raised it what happened.",
    },
    sections: [
      {
        heading: "The review, in order",
        items: [
          "Service and the people it is for, with the two or three situations you will hold in mind while you walk it.",
          "Step, barrier and who is stopped: one line per step, with what the screen actually says and what it costs the person.",
          "Owner and the change requested, written as wording or a setting somebody can act on.",
          "Fix, route or decide: three short lists, so the review becomes work rather than a document.",
          "What changed and who was told, including the person who first reported the barrier.",
        ],
      },
      {
        heading: "Checks that need no tools or budget",
        items: [
          "Keyboard only: can you reach every control, see where you are, and finish?",
          "Enlarged text: does anything disappear, overlap or force sideways scrolling?",
          "A phone screen, including sending a document photographed on a phone.",
          "Sound off, then captions on, checking the terms that matter.",
          "A slow or interrupted connection: are the answers still there when you come back?",
          "Make it fail: wrong entry, wrong file type, ended session, a password nobody has.",
          "The route that is not online: call it in the hours a working person would call.",
        ],
      },
      {
        heading: "What usually breaks assistive technology",
        items: [
          "Headings made by enlarging bold text instead of using a heading style.",
          "Scanned pages and images of text, with nothing underneath to read.",
          "Images and charts carrying information with no description and no explanation in the text.",
          "Link text that says “click here” or shows a bare web address.",
          "Tables used to lay out a page, and data tables with no header cells.",
          "Color as the only signal, and text that is too low in contrast to read outdoors or on an old screen.",
          "Controls that work only with a mouse, and sessions that end without warning.",
        ],
      },
      {
        heading: "Wording that decides whether somebody finishes",
        items: [
          "Say what failed, where it is, and what a valid answer looks like.",
          "Say what to do when the phone number or email on an account no longer works.",
          "Warn before a session ends, early enough to act, and save the answers anyway.",
          "Give a confirmation the person can keep, saying what happens next and roughly when.",
          "Publish a named contact and a phone number a person answers, in the same place and the same size as the online route.",
        ],
      },
      {
        heading: "Who this helps",
        items: [
          "Communications, training and learning-design staff, whose pages, recordings and postings are where most of this is decided — a useful place to start.",
          "Administrative and support staff, who run the registrations, forms, scheduling and routing people actually meet — a good place to go deeper.",
          "Policy, program and operations staff, who decide whether a process is delivered online, on paper, by phone, or all three.",
          "Quality, performance and data staff, who can see who finishes a digital process and are best placed to ask who is missing from the count.",
          "Contracts, fiscal, grants and procurement staff, whose purchasing and application requirements decide whether a system is usable before anyone meets it.",
          "Supervisors, who decide whether fixing a template counts as real work.",
        ],
      },
      {
        heading: "Related modules",
        items: [
          "Accessible public communications",
          "Language access in state programs",
          "Inclusive meetings and engagement",
          "Program and service design",
          "Responding to concerns and feedback",
        ],
      },
    ],
  },
  sources: [
    { title: "Minnesota IT Services, Accessibility", href: "https://mn.gov/mnit/about-mnit/accessibility/", note: "Minnesota's accessibility standard for state digital content, the Web Content Accessibility Guidelines it follows, and practical guidance for documents, pages and purchased technology." },
    { title: "ADA.gov, Guidance on web accessibility and the ADA", href: "https://www.ada.gov/resources/web-guidance/", note: "U.S. Department of Justice guidance on why web and mobile accessibility is required of state and local government, and the technical guidelines the requirement points to." },
    { title: "W3C Web Accessibility Initiative, WCAG 2 overview", href: "https://www.w3.org/WAI/standards-guidelines/wcag/", note: "The international guidelines behind both the state and federal requirements, with the conformance levels named in supplier reports." },
    { title: "W3C Web Accessibility Initiative, Easy Checks", href: "https://www.w3.org/WAI/test-evaluate/preliminary/", note: "A first review of a page that anyone can run without specialist tools — the method behind the checks in this module's practical tool." },
    { title: "PlainLanguage.gov, Federal plain language guidelines", href: "https://www.plainlanguage.gov/guidelines/", note: "Guidance on audience, structure, useful headings and wording, including the error messages, instructions and confirmations people meet on a screen." },
    { title: "Minnesota Department of Employment and Economic Development, Office of Broadband Development", href: "https://mn.gov/deed/programs-services/broadband/", note: "Minnesota's broadband program and maps of where service is and is not available, the connection side of digital access across the state." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "Minnesota's advisory council on disability policy, access and rights, including accessibility guidance for public bodies and a route to disability-led expertise." },
    { title: "Minnesota Framework for Universal Multicultural Instructional Design", href: "https://mncpd.org/wp-content/uploads/2016/12/MN_Framework_for_Universal_Multicultural_Instructional_Design.pdf", note: "The design reference for this curriculum: multiple ways to engage, culturally responsive materials and accessible instruction." },
  ],
};

export default pack;
