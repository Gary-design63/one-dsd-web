import type { CoursePack } from "../../source-types";

// Intercultural Practice and Equity · Public-service practice · Module 13: Program and service design.
// Program-authored for internal DHS and DSD staff. Voluntary, self-directed, no scores and no completion requirement.
const pack: CoursePack = {
  course: {
    id: "ipe-13-program-service-design",
    indexNumber: 1155,
    seriesLabel: "Intercultural Practice and Equity · Public-service practice",
    title: "Program and Service Design",
    subtitle: "Most of a service is decided before anyone calls it design. Four lessons on carrying lived experience, accessibility and equity from discovery through requirements, contracting and rollout, ending with an impact-on-people section you add to a real project charter.",
    scope: "For internal DHS and DSD staff who shape how a program or service is built: policy and program staff; contracts, fiscal, grants and procurement staff; executive and senior leaders; project and change staff; quality and performance staff; data and analytics staff; communications, training and learning design staff; and administrative and support staff who run the steps people actually meet. Four short lessons you can take in any order and return to. Voluntary and self-directed: no score, no completion requirement, and nothing you write in a reflection is collected. Completion here does not count toward DHS-required training credits unless management, a director, or DHS leadership expressly approves an exception.",
    treatment: "Four short lessons with Minnesota examples, scenarios, sorting and flashcard practice, private reflection prompts, and a charter section you can copy into a project you are working on now",
    duration: "40–45 minutes",
    author: "One DSD — People, Access and Culture",
    coverImage: "/images/covers/change-management.jpg",
    coverAlt: "A Black woman in a navy blazer huddles with colleagues in a government office.",
    introTranscript: "Ask when a state service was designed and most project records will point to a phase with the word design in its name. By then, most of what decides whether the service works for people has already been settled: what the problem is called, who is assumed to be at the other end of it, what counts as evidence, and how much time the work has. This module follows a division project from discovery through requirements, contracting, pilot and rollout. It looks at whose expertise counts in defining a problem, how requirements and defaults create burden that falls unevenly, how to make trade-offs visible instead of quiet, and how to write an impact-on-people section into a project charter so those questions travel with the project instead of arriving after it.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Map the points in a division project where the design of a program or service is actually settled, and name the open points where your own role gives you a say.",
        "Plan a discovery step that brings lived experience and community expertise into defining the problem, and distinguish co-design, advisory review, consultation and testing a draft.",
        "Examine a proposed design for the burden it places on people through its steps, documents, channels, timing and defaults.",
        "Record design trade-offs so that what was accepted, who carries it and who decided are visible to the people who come after.",
        "Add an impact-on-people section to a real project charter and set the points in the project where it will be reopened.",
      ],
      evidence: [
        "Four worked scenarios drawn from division project, program, contracting and sponsorship work, each with a recommended response and the reasoning behind it.",
        "A knowledge check in every lesson with feedback that explains the supported answer.",
        "Sorting practice separating evidence the division already holds from evidence only people outside it can give, and burden the division carries from burden it assigns to others.",
        "A completed impact-on-people section for one real project charter.",
      ],
      appliedNextStep: "Choose one project you are working on now. Add the six-field impact-on-people section to its charter, complete what you can, name the person you will ask about each unknown, and reopen it at the next decision point.",
    },
    governance: {
      contentOwner: "One DSD — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: [
        "A change in ADA Title II program-access or web accessibility requirements for state and local government, or in Section 508 guidance",
        "A change in Minnesota's accessibility standard for state digital content, or in state contracting requirements that affect how accessibility and language access are specified in solicitations and contracts",
        "Feedback from disabled Minnesotans, community co-designers, interpreters or culturally specific organizations that a design step or example in this module does not match what they experience",
      ],
      relatedDoor: "Formal decisions about approving a project charter, issuing a solicitation, awarding or amending a contract, and clearing a service for public launch belong to the responsible DHS program, contracting, accessibility and communications offices; this module prepares the questions and the draft section, it does not approve or clear them.",
      toolkitQuestion: "Who could be helped, burdened, excluded or misunderstood by this design, and how could the people most affected shape it earlier?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "ipe-13-1",
        number: 1,
        title: "Where a service is actually designed",
        summary: "The six points in a division project where the shape of a service is settled, what it costs to change a decision at each one, and why accessibility handled at the end becomes an exception process.",
        minutes: 11,
        learning: {
          objective: "Map the points in a division project where the design of a program or service is actually settled — problem definition, scope, requirements, solicitation and contract, pilot and rollout — and name which of those points your own role can still influence.",
          takeaways: [
            "Most of what decides whether a service works for people is settled in early conversations that do not feel like design: what the problem is called, who is assumed to be at the other end of it, what counts as evidence and how long the work has.",
            "Accessibility, language access and cultural responsiveness are inexpensive while a design is still on paper and expensive after a requirement is written into a contract or a system.",
            "A project has a small number of hard points where change is still easy. After each one closes, the cost of the same change rises sharply.",
            "“We will handle accessibility at the end” is a scheduling decision. In practice it usually means handling access by exception, one person at a time, after the design has already decided who has to ask.",
          ],
          evidence: "A scenario about a solicitation six weeks from posting, a tab set on the six decision points, flashcards on what a change costs at each stage, and a knowledge check on a general accessibility clause.",
          appliedNextStep: "Take one project you are part of. Write down which of the six decision points are still open, which have closed, and the one open point where your role gives you a real say.",
        },
        scenario: {
          context: "A Disability Services Division project will replace a paper request process with an online one. The solicitation for a supplier is six weeks from being posted. The project charter covers scope, milestones, budget and risks. It describes the people who will use the process only as “applicants,” and the requirements list mentions accessibility in one line: “The system will comply with applicable accessibility standards.” You are asked to review the package for anything missing before it moves to contracting.",
          prompt: "What is the most useful thing to raise?",
          options: [
            {
              label: "The package is complete enough to proceed; plan an accessibility review of the finished system before launch.",
              response: "A review of the finished system will find real defects at the most expensive moment to fix them. And a general clause gives the division nothing specific to hold the finished work against, so defects found then become negotiations rather than corrections.",
            },
            {
              label: "Ask two questions the charter cannot answer yet — who this process affects, and what it will require of them — and turn the single accessibility line into named requirements, acceptance criteria and a review with people who will use the process, while the solicitation is still open.",
              response: "This is the recommended path. The weeks before a solicitation posts are the last point where access is something a supplier agrees to deliver rather than something the division asks for afterward. Naming the people affected now gives the requirements something real to be written for.",
              recommended: true,
            },
            {
              label: "Add accessibility to the risk register and raise it at the first steering meeting after the contract is awarded.",
              response: "A risk that is recorded but never turned into a requirement changes nothing about what gets built. After award, every one of those changes arrives as a change order and a schedule conversation.",
            },
          ],
        },
        transfer: {
          prompt: "Think about a project you are part of now. Where is its design already settled, and where is there still room?",
          options: [
            "List the six decision points and mark each one open, closing soon or closed",
            "Name the next open point and the meeting where it will be decided",
            "Write the two questions you will bring to that meeting: who does this affect, and what will it require of them?",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "The design is mostly finished before the design phase starts",
            body: "<p>Ask when a service was designed and most project records will point to a phase with the word design in its name: the weeks when screens are drawn, letters are drafted and a workflow is diagrammed. By then, much of what decides whether the service works for people has already been settled, usually in a handful of early conversations that did not feel like design at all.</p><p>What gets settled in those conversations? What the problem is called. Who is assumed to be at the other end of it. What counts as evidence that the problem is real. How much time the work has, and what that timeline quietly rules out. Whether the process will have one path or several. Those choices travel into requirements, then into a solicitation, then into a contract, then into a system that may run for many years, and each step makes them harder to revisit.</p><p>This is not an argument for slowing every project down. It is an argument for spending attention where it is cheap. A question asked while the problem statement is still open costs a meeting. The same question asked after a contract is awarded costs a change order, a delay and, usually, an apology to people who were already left out. Policy and program staff, contracting staff and senior sponsors each hold one of those early moments. That is why this module is a useful starting point for all three.</p>",
          },
          {
            type: "tabs",
            heading: "Six points where the design is actually set",
            tabs: [
              { label: "Problem definition", body: "<p>The first description of the problem decides who the service is for. “Reduce processing time” produces a different design than “help people who currently give up at the second step get to a decision.” Ask who described the problem, from which side of the counter, and whether anyone who experiences it was part of that description.</p>" },
              { label: "Scope and schedule", body: "<p>Scope decides what is in and out; the schedule decides what the team will have time to learn. A timeline with no room for discovery with the people affected is a decision to design from staff assumptions. Ask what the schedule leaves out, and who that absence affects most.</p>" },
              { label: "Requirements", body: "<p>Requirements turn intentions into things someone must deliver. Formats, channels, time windows, reading level, interpretation, accessibility conformance and testing with people who will use the service can all be written here as requirements with acceptance criteria. Anything not written here is optional in practice, whatever the charter says.</p>" },
              { label: "Solicitation and contract", body: "<p>Once a supplier is selected, the contract defines what the division can require without renegotiating. Accessibility described as a general promise gives a reviewer nothing to measure. Accessibility described as named deliverables, tests and acceptance steps gives the division a way to accept work or send it back. Contracts and procurement staff hold this moment.</p>" },
              { label: "Build and pilot", body: "<p>A pilot tells you what you designed it to tell you. Pilots placed where they are easiest to run tend to include the people the design already works for. Ask whether the pilot includes the people the design is most likely to fail, and whether they have a way to say so.</p>" },
              { label: "Rollout and after", body: "<p>Rollout decides who hears about the change, in what language and format, and how long they have to adjust. After launch, the design keeps making decisions through its defaults. Ask what you will look at to find out who stopped, and what you will change when you find out.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Ask the two questions while the answer is still cheap",
            control: "You control which questions are asked while a decision is still open — in the problem statement, the charter, the requirements list and the contract language you draft, review or sign.",
            failure: "Do not let “accessibility will be handled at the end” stand as a plan. Handled at the end, access becomes an exception process run one person at a time, after the design has already decided who has to ask for it.",
            next: "On the project closest to you, find the next decision point that has not closed and bring two questions into that meeting: who does this affect, and what will it require of them?",
          },
          {
            type: "flashcards",
            heading: "What it costs to change a decision, and when",
            cards: [
              { front: "While the problem statement is open", back: "<p>A conversation. Redefining who a service is for costs attention and nothing else, and it changes everything downstream.</p>" },
              { front: "While requirements are being written", back: "<p>An edit. Naming a format, a channel, a time window or an accessibility acceptance criterion is one line of text now and a negotiation later.</p>" },
              { front: "While the solicitation is still open", back: "<p>A revision. This is the last point where access is something a supplier agrees to deliver instead of something the division asks for as a favor.</p>" },
              { front: "After the contract is awarded", back: "<p>A change order and a schedule conversation. Almost everything is still possible. Almost nothing is cheap.</p>" },
              { front: "After launch", back: "<p>A repair project, a workaround for staff, and a group of people who have already met the version that did not work for them.</p>" },
            ],
          },
          {
            type: "knowledgeCheck",
            id: "ipe-13-1-check",
            question: "A project's requirements list says only: “The system will comply with applicable accessibility standards.” What is the most accurate assessment of that line?",
            options: [
              { text: "It is sufficient, because the standards it refers to are already detailed.", correct: false },
              { text: "It states an obligation without naming what will be delivered, tested or accepted, so there is nothing specific to check the work against before it is accepted.", correct: true },
              { text: "It is unnecessary, because accessibility obligations apply whether or not a contract mentions them.", correct: false },
              { text: "It belongs in the risk register rather than in the requirements.", correct: false },
            ],
            feedbackCorrect: "Yes. Legal obligations apply either way. What a written requirement adds is a named deliverable, a test and a point where work can be accepted or sent back.",
            feedbackIncorrect: "Ask what a reviewer could actually check before accepting the work. A general promise gives them nothing to measure and nothing to refuse.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you and not collected anywhere: think of a project you are part of now. How might your role, your authority or your familiarity with how DHS works shape what the team treats as an obvious design choice?",
          },
        ],
      },
      {
        id: "ipe-13-2",
        number: 2,
        title: "Discovery, and whose expertise counts as evidence",
        summary: "What the division's own records can and cannot say about a process, and how to bring lived experience and community expertise into defining the problem before the design is fixed.",
        minutes: 11,
        learning: {
          objective: "Plan a discovery step that brings lived experience and community expertise into defining the problem, and tell the difference between co-design, advisory review, targeted consultation and testing a draft.",
          takeaways: [
            "Discovery answers two questions: what problem are we solving, and for whom? If only staff answer them, the design inherits whatever staff already believe about how the process works.",
            "The division's records mostly describe people who reached the process and got far enough to be counted. They are close to silent about people who stopped, never started or were never told.",
            "Co-design, advisory review, targeted consultation and testing a draft are different arrangements that share different amounts of power. Saying honestly which one you are offering is part of the design.",
            "People with disabilities, families, interpreters, disability-led organizations and culturally specific organizations contribute professional expertise. Arrange access before the invitation and payment before anyone agrees.",
          ],
          evidence: "A scenario about designing from administrative data, a sorting exercise on where different kinds of evidence come from, an accordion on four ways to bring expertise in, and a knowledge check on the limits of the division's own records.",
          appliedNextStep: "For one project, write down the evidence the team is designing from and who had to succeed at the current process to appear in it. Then name one person or organization who sees the people that evidence misses, and what a paid, accessible conversation with them would take.",
        },
        scenario: {
          context: "A division program and quality team is redesigning an annual renewal step. The evidence on hand is administrative: completion rates, call volumes, average processing time, and a satisfaction question answered mostly by people who finished the renewal. The project sponsor says the data is strong enough to design from and that engaging disability-led and culturally specific organizations would add two months to the schedule.",
          prompt: "What is the most accurate thing to say about that evidence?",
          options: [
            {
              label: "It is the best evidence available; proceed with the design and ask community organizations to review the result before launch.",
              response: "A review before launch is a review of a finished design. It can catch errors, but it cannot change what the problem was taken to be. And the data the design rests on describes only people the current renewal already worked for.",
            },
            {
              label: "It describes the people the current renewal worked for well enough to finish, and it cannot show who stopped, who never started or why. Name that gap in the charter, and hold a short, paid discovery step with people and organizations who see the people the data is missing.",
              response: "This is the recommended path. It keeps the administrative data and uses it for what it can show, states plainly what it cannot show, and fills the gap with the people who hold that knowledge. A short discovery step can be sized to the schedule; a redesign built on half the picture usually costs more than two months later.",
              recommended: true,
            },
            {
              label: "Add a question to the renewal packet asking people what was difficult about it.",
              response: "The question reaches the same people the data already describes. Someone who could not use the packet will not answer a question printed inside it.",
            },
          ],
        },
        transfer: {
          prompt: "What evidence is a project you work on being designed from, and who is missing from it?",
          options: [
            "List the evidence the team is relying on and where each piece comes from",
            "Write down who had to succeed at the current process to be counted in that evidence",
            "Name one person, organization or front-line team who sees the people the evidence misses, and what it would take to hear from them",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "What the division's own records can and cannot tell you",
            body: "<p>A division holds a great deal of evidence about its own processes: completion rates, call volumes, processing times, denial and closure reasons, satisfaction responses. It is real evidence, and it is worth reading closely. It also has one shape that is easy to forget. Nearly all of it comes from people who reached the process and got far enough to be recorded. It describes the population the current design already works for, at least well enough to finish.</p><p>The people a redesign most needs to hear from are on the other side of that line. Someone who opened the packet, read two pages and set it down. Someone who heard about the program from a neighbor rather than from the division, months after it would have helped. Someone whose request was closed as withdrawn because the third return call came during a work shift. In the records, all of them look alike, and there is very little to read. In their lives, they are different problems with different fixes.</p><p>More analysis of the same records does not close that gap. It closes when the project hears from people who see what the records miss: disabled Minnesotans and their families, interpreters, disability-led organizations, culturally specific organizations, and division staff whose job is the first call or the first letter. Their knowledge is evidence. Treat it as expertise that is arranged for, paid for and recorded, not as a story gathered to illustrate a decision that has already been made.</p>",
          },
          {
            type: "sorting",
            id: "ipe-13-2-sort",
            heading: "Where would this evidence have to come from?",
            categories: ["Already in the division's records", "Only from people outside the division", "An assumption presented as evidence"],
            items: [
              { text: "How many renewal packets come back complete, and how many come back late.", category: "Already in the division's records" },
              { text: "The number of calls the help line received in the week after a notice went out.", category: "Already in the division's records" },
              { text: "Closure reasons recorded by staff at the point of decision.", category: "Already in the division's records" },
              { text: "Which of three notices a household reads first, and which one they believe.", category: "Only from people outside the division" },
              { text: "What a person does between opening the packet and the deadline, and where they stop.", category: "Only from people outside the division" },
              { text: "How long it takes a family to arrange a ride, an interpreter and time away from work for one appointment.", category: "Only from people outside the division" },
              { text: "If the packet were confusing, people would call and tell us.", category: "An assumption presented as evidence" },
              { text: "People who need a different way to apply will ask for one.", category: "An assumption presented as evidence" },
            ],
          },
          {
            type: "accordion",
            heading: "Four ways to bring expertise in, and what each one can carry",
            items: [
              { title: "Co-design", body: "<p>People with lived experience work alongside staff while the problem and the options are still open. They shape what the service is for and how it works, not only how it is worded. Co-design only means something if the project still has real decisions left to make, and it asks the most of everyone: several sessions, access arranged for each one, and payment that reflects the time and expertise involved.</p>" },
              { title: "Advisory review", body: "<p>A standing group of community members and organizations reads drafts and options at agreed points in the project. It can catch a great deal and build trust over time. It cannot invent a direction the project never put in front of it, so the timing of each review matters as much as who is in the group.</p>" },
              { title: "Targeted consultation", body: "<p>A specific question goes to people with specific knowledge: an interpreter about how a term lands, a disability-led organization about a channel, a culturally specific organization about who in a household decides. It is quick and useful. It stays honest only if you say what is already fixed and what their answer can still change.</p>" },
              { title: "Testing a draft with people who will use it", body: "<p>A few people attempt the real task with a draft form, letter or page while staff watch and do not help. It is the only arrangement that shows whether the design works. It belongs before launch and after any major change, and it complements the first three rather than replacing them. Testers are paid for their time and told what changed because of them.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Say which arrangement you are offering",
            control: "You control what you tell people about the decision they are being invited into: what is still open, what is already fixed, how their contribution will be used, how they will be paid and when they will hear back.",
            failure: "Do not invite people into a finished design and call it engagement. People can tell, they remember, and the next invitation from the division becomes harder for everyone.",
            next: "Before the next invitation goes out, write one paragraph naming what is open, what is decided and why, and what the person will receive for their time. If that paragraph is uncomfortable to write, it is the design that needs changing, not the paragraph.",
          },
          {
            type: "quote",
            text: "They asked us to look at it the week before it went live. Everything we raised was real, and everything we raised was too late. Ask us in the month when you are still arguing about what the thing is for.",
            cite: "Composite community advisor perspective, illustrative",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-13-2-check",
            question: "A project team has completion rates, call volumes and a satisfaction question answered by people who finished a renewal. What is the clearest limit of that evidence for a redesign?",
            options: [
              { text: "The sample is too small and needs more responses before it can be used.", correct: false },
              { text: "It comes almost entirely from people the current process worked for well enough to finish, so it says very little about who stopped, who never started and why.", correct: true },
              { text: "It measures satisfaction rather than outcomes, which is its only real weakness.", correct: false },
            ],
            feedbackCorrect: "Yes. The limit is who is in the evidence, not how much of it there is. More of the same records will not describe the people they never reached.",
            feedbackIncorrect: "Ask who had to succeed at the current process in order to appear in these numbers at all.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you and not collected anywhere: think about the last decision you helped make about how a program works. Whose expertise was missing from that room, and what would it have taken to have them there early rather than late?",
          },
        ],
      },
      {
        id: "ipe-13-3",
        number: 3,
        title: "Requirements, defaults and the burden they create",
        summary: "Every requirement is a task assigned to someone outside the building. How to see where a design puts the work, change the defaults that decide who gets through, and write down the trade-offs you accept.",
        minutes: 11,
        learning: {
          objective: "Examine a proposed design for the burden it places on people — its steps, documents, channels, timing and defaults — and record the trade-offs accepted, who carries them and who decided.",
          takeaways: [
            "Every requirement in a service is a task someone has to complete: find a document, take time off, arrange a ride, ask for help, explain something again. Burden is something a design produces, and it falls unevenly.",
            "Defaults do most of the work. The default channel, format, time window, proof and assumed decision-maker determine who gets through without having to ask for anything.",
            "“The same for everyone” describes the process, not the result. Seeing where the burden actually lands, and changing what puts it there, is how a design moves past minimization.",
            "Legal accessibility requirements set a floor for the finished service. Design asks a further question: what would make this usable without a special request in the first place?",
            "Trade-offs are a normal part of public work. The one that causes lasting harm is the trade-off nobody wrote down, with no owner and no date to look at it again.",
          ],
          evidence: "A scenario about choosing a default channel, a sorting exercise on where a design puts the work, a tab set on five defaults, and a knowledge check on why exclusion rarely shows up as demand.",
          appliedNextStep: "Pick one requirement in a process you work on. Write down the task it assigns a person, who that task is heaviest for, and whether the division already holds what it asks for. If the requirement stays, write the trade-off in one sentence with a name and a date.",
        },
        scenario: {
          context: "A division project team must choose the default channel for a new request process. An online-only path is cheaper to run and can be built in the time available. Keeping a staffed phone path and a mailed paper path would cost more and push the launch back by a quarter. Discovery showed that the people most likely to need the service include older adults, people without reliable internet at home, people who read English as a second or third language, and people who rely on a family member or supporter to complete forms.",
          prompt: "How should the team handle the choice?",
          options: [
            {
              label: "Launch online only, and add phone and paper paths later if demand for them appears.",
              response: "People who cannot use the only available path rarely show up as demand. They show up as people who did not apply. The evidence the team would need to justify adding a path is the evidence this design prevents it from collecting.",
            },
            {
              label: "Treat it as an explicit trade-off: name who an online-only default leaves out, cost the alternatives, and decide with the sponsor on the record. If other paths are deferred, write down who carries the delay, how they will be served in the meantime, who decided and when it will be revisited.",
              response: "This is the recommended path. It does not pretend the constraint away, and it does not let a budget choice quietly become an access decision. It leaves a record the next team, and the people affected, can hold the division to.",
              recommended: true,
            },
            {
              label: "Launch online only, with a line on the page inviting anyone who needs another way to request an accommodation.",
              response: "This turns a design gap into a series of individual requests. It relies on people knowing they can ask, being willing to ask, and reaching the page that tells them, which the people most affected are least likely to do. It also hands staff an exception process with no design behind it.",
            },
          ],
        },
        transfer: {
          prompt: "Where does a process you work on put the work, and who is carrying it?",
          options: [
            "List every task the process assigns to a person outside the division",
            "Mark any task that asks for something the division already holds",
            "Choose one default — channel, format, timing, proof or who decides — that you could change or raise this month",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Burden is something a design produces",
            body: "<p>Every requirement in a service is a task assigned to a person outside the building. Find a document. Take a morning off work. Arrange a ride. Ask a relative to explain a paragraph. Repeat a difficult account to a fourth staff member. Get a signature witnessed. None of these appear in a project budget, and together they decide who completes a process and who does not.</p><p>The same design distributes that burden unevenly. One document request is a small errand for one household and a two-week project for another: for someone without a car, without stable housing, without a scanner, without paid leave, or without a supporter who can take a call at eleven in the morning. When a process assigns the same task to everyone, it does not produce the same result for everyone. It produces the same result for the people whose lives resemble the one the design assumed.</p><p>Naming this is what changes designs. “We treat everyone the same” is a true statement about a process, and it is a claim about fairness that the process cannot support on its own. The intercultural framework this program uses calls that position minimization: difference is acknowledged but treated as small enough to deal with later. Moving toward acceptance and adaptation is practical work here, not a matter of attitude. You look at where the burden actually falls, you change the defaults that put it there, and you write down what you could not change and who is carrying it. That describes a design, never a person.</p>",
          },
          {
            type: "sorting",
            id: "ipe-13-3-sort",
            heading: "Where does this design put the work?",
            categories: ["The division carries it", "The person carries it", "It is pushed onto someone else"],
            items: [
              { text: "Staff check information the division already holds instead of asking the person to send it again.", category: "The division carries it" },
              { text: "Before returning a packet as undeliverable, staff check division records for a newer address.", category: "The division carries it" },
              { text: "A notice is mailed and emailed, with a phone number answered during the hours the notice lists.", category: "The division carries it" },
              { text: "A person must get a letter from a clinic confirming something already in their file.", category: "The person carries it" },
              { text: "A person must explain the same circumstances to three separate units.", category: "The person carries it" },
              { text: "The response window counts from the date printed on the letter, not from when it arrives.", category: "The person carries it" },
              { text: "No interpreter is arranged, so a person's teenage child interprets a question about their health.", category: "It is pushed onto someone else" },
              { text: "The form can only be completed during office hours, so a working adult asks a neighbor to handle it for them.", category: "It is pushed onto someone else" },
            ],
          },
          {
            type: "tabs",
            heading: "Five defaults that decide who gets through without asking",
            tabs: [
              { label: "Channel", body: "<p>Which way of reaching the service works without extra effort, and which ways exist only for people who know to ask? A default channel is a decision about who has an easy path. Offer more than one, and name them in the first paragraph rather than the last.</p>" },
              { label: "Format", body: "<p>Real text, a clear reading structure, documents that work with a screen reader and still print cleanly, and a version that can go to an interpreter ahead of time. Format decided at the start costs little. Format repaired at the end tends to break something else.</p>" },
              { label: "Timing", body: "<p>A window measured from when a letter is likely to arrive, not from the date printed on it. Time to read, ask a question, gather a document, arrange an interpreter and respond. A reminder before an automatic closure rather than a notice after it.</p>" },
              { label: "Proof", body: "<p>What a person must produce to be believed, whether the division already holds it, and what happens to someone who cannot produce it. Every document requirement is worth the question: what decision does this change, and could staff confirm it another way?</p>" },
              { label: "Who decides", body: "<p>Whether the design assumes one adult acting alone. A household that decides together, a person who uses supported decision-making, or a family where a different member handles letters than handles calls all meet a single-person design as a barrier. Ask how the design recognizes the people a person has chosen to involve.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Write the trade-off down where the decision lives",
            control: "You control whether a trade-off is recorded in the charter, the decision log or the requirements, with the name of the person who made it and the date it will be reviewed.",
            failure: "Do not let a deferred access decision disappear into a schedule. An access path postponed without a record, an owner and a date has, in practice, been canceled quietly.",
            next: "In the next design decision you take part in, write one sentence: what we chose, who it leaves out, what we will offer them meanwhile, who decided, and when we will look at it again.",
          },
          {
            type: "list",
            heading: "Design moves that need nobody's permission",
            ordered: false,
            items: [
              "Stop asking people for information the division already holds.",
              "Write deadlines as dates, and set the window from the day a letter is likely to arrive.",
              "Put plain language and readable structure into the requirements, not into a cleanup task at the end.",
              "Offer more than one way to complete a step, and say so near the top.",
              "Send materials early enough that a person can read them, ask a question and arrange an interpreter before the date that matters.",
              "Ask what a person needs in order to take part, with examples of what is available, instead of asking about their condition.",
              "Let people save and return to any request that takes longer than one sitting.",
              "Send a reminder before an automatic closure, in the channel the person already uses.",
            ],
          },
          {
            type: "knowledgeCheck",
            id: "ipe-13-3-check",
            question: "A team plans to launch a request process online only and add other paths later “if demand appears.” Which statement about that demand is most accurate?",
            options: [
              { text: "Demand will show up clearly in the number of accommodation requests after launch.", correct: false },
              { text: "People who cannot use the only available path mostly appear as people who did not apply, so the design suppresses the very evidence needed to justify adding a path.", correct: true },
              { text: "Demand can be estimated reliably from statewide home internet figures, so no further input is needed.", correct: false },
              { text: "Demand is not relevant, because channel choices are purely budget decisions.", correct: false },
            ],
            feedbackCorrect: "Yes. A design that leaves people out also hides the evidence that it left them out. That is why the trade-off has to be named when the decision is made, not tested for afterward.",
            feedbackIncorrect: "Ask how a person who cannot use the only path would show up in the numbers at all.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you and not collected anywhere: think of one requirement in a process you work on. What does it actually ask a person to do, who could be burdened or excluded by it, and what would accessibility mean here beyond the legal minimum?",
          },
        ],
      },
      {
        id: "ipe-13-4",
        number: 4,
        title: "Writing impact on people into the charter",
        summary: "A six-field section you can add to any project charter, the five moments to reopen it, and how to keep it honest when the answer is “we do not know yet.”",
        minutes: 11,
        learning: {
          objective: "Write an impact-on-people section into a project charter that names who is affected, whose expertise is missing, the burden the design creates and the trade-offs accepted, and set the points in the project where the section will be reopened.",
          takeaways: [
            "A charter is where a project's questions become official. A question that is not in the charter is one somebody has to argue for later, usually when the schedule is tight.",
            "Six short fields carry most of the value: who is affected, whose expertise is missing, burden and who carries it, access and language decisions, trade-offs and who decided, and how we will know.",
            "The section earns its place by being reopened at a few moments — requirements, contract, pilot, launch and once after — for a few minutes each time.",
            "“We do not know yet” is a sound entry when it names who will be asked and by when. A field filled with a general phrase to look complete is not.",
            "The loop closes when the people who contributed hear what changed because of them, what did not and why.",
          ],
          evidence: "A scenario about a sponsor with four projects at different stages, a charter section completed for one real project, an accordion of five reopening points, and a knowledge check on what makes an entry usable.",
          appliedNextStep: "Copy the six fields into the charter of one project you are working on now. Complete what you can in one sitting, mark each unknown with a name and a date, and take the section to the next project meeting.",
        },
        scenario: {
          context: "A senior leader sponsors four division projects. Their charters use a standard template: scope, milestones, budget, risks and dependencies. One project is writing requirements. One is drafting a solicitation. One is in build. One launched last quarter and has drawn complaints that nobody can trace to a specific decision. The leader asks whether an impact-on-people section is worth adding, and where.",
          prompt: "Where does adding the section do the most good?",
          options: [
            {
              label: "Add it to new charters only, so projects already underway are not disrupted.",
              response: "It is tidy, and it leaves the two projects that can still change cheaply without the questions, and the launched project without any record to trace its complaints against. The benefit arrives a full project cycle later than it could.",
            },
            {
              label: "Add it to all four, sized to where each one is: the full section for the projects writing requirements and drafting the solicitation, and a shorter version for the project in build and the launched project that records who has been affected, what burden the design created and what repair would take.",
              response: "This is the recommended path. It puts the most effort where decisions are still open, gives the build team a way to catch what can still be caught, and gives the launched project the record it is missing, which is the first step toward accountability and repair.",
              recommended: true,
            },
            {
              label: "Add it to the launched project first, since that is where the complaints are.",
              response: "The instinct to start where people are already affected is sound, and that project does need the record. Starting there alone, though, lets the two projects that could still avoid the same problems close their requirements and contract without it.",
            },
          ],
        },
        transfer: {
          prompt: "Which project will you bring the charter section to first?",
          options: [
            "Name the project and the decision point it is approaching",
            "Complete the first two fields — who this affects and whose expertise is missing — before the next project meeting",
            "Put the five reopening moments into the project schedule next to the milestones they belong with",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Why the charter, and not a separate form",
            body: "<p>Most organizations already have somewhere equity and accessibility questions could live: a review form, a checklist held by another office, a note in a plan. The reason to put them in the project charter instead is not that the charter is better written. It is that the charter is the document the project actually uses. A sponsor signs it. A project manager reads it at status meetings. A contracting colleague refers to it when drafting a solicitation. A new team member reads it in their first week. A question that lives in the charter gets asked. A question that lives in a separate form tends to be completed once and filed.</p><p>The section below is short on purpose: six fields, no specialist vocabulary, each answerable in a few sentences. It is not an assessment of anyone, and it produces no rating. What it produces is a record. This is who we believed the work affects. This is what we did not know and who we asked. This is the burden we accepted and who carries it. This is who decided. That record is what makes later questions answerable, including the hardest one: if this design harmed or excluded someone, what would accountability and repair require?</p>",
          },
          {
            type: "artifact",
            kind: "tagged-document",
            label: "Practical tool",
            title: "A project charter section on impact on people",
            summary: "Six fields you can copy into a project charter, scoping document or change request. It fits on one page and is meant to be reopened at five points across a project.",
            fields: [
              { label: "Who this affects, and who is most affected", value: "Name the groups of people the program or service touches, specifically enough that a reader can picture them and check later whether the design worked for them. Go beyond “applicants” or “Minnesotans”: people applying for the first time, people renewing, people who live far from a county office, people who read English as a second or third language, people who use a screen reader or magnification, people who rely on a family member or supporter to complete a step, people without reliable internet at home. Mark the groups most likely to be harmed if the design is wrong. Describe groups, never individuals, and record no one's private information." },
              { label: "Whose expertise is missing", value: "List the knowledge the project does not have: people who use the service, families and supporters, interpreters, disability-led organizations, culturally specific organizations, and division staff who take the first call or send the first letter. For each, record the arrangement you are offering — co-design, advisory review, targeted consultation or testing a draft — what is still open to change, how access will be arranged in advance, and how people will be paid. Community contributors are co-designers and advisors, not learners." },
              { label: "Burden this design creates, and who carries it", value: "Walk the process as a person would and write down every task it assigns: documents to find, calls to make, time to take off, trips to arrange, explanations to repeat, signatures to obtain, deadlines counted from a printed date. For each task, note who it is heaviest for and what happens to someone who cannot complete it. Flag anything the process asks for that the division already holds." },
              { label: "Access, language and format decisions", value: "Record decisions, not intentions: which channels exist and which is the default; which formats are produced and when; how a person tells the division what they need to take part; how interpretation and translation are arranged and paid for; which accessibility requirements are written into the requirements and acceptance criteria rather than left to a final check; and which of these are already fixed by a system or contract the project does not control." },
              { label: "Trade-offs accepted, and who decided", value: "Write down what the project chose not to do and why: a path deferred, a review shortened, a format postponed, a pilot narrowed. For each, name who is left out or delayed, what they will be offered in the meantime, who made the decision, and the date it will be reviewed. A trade-off with no name and no date tends to be rediscovered later as a complaint." },
              { label: "How we will know, and what we will tell people", value: "Name the few things you will look at to learn whether the design worked for the groups in the first field — not only completion and volume, but who stopped and where. Say when you will look and who will look. Say what you will tell the people who contributed: what changed because of them, what did not and why. Include how someone raises a problem with the service and what happens when they do." },
            ],
            action: "Copy the six fields into the charter of one project you are working on now. Complete what you can in one sitting, mark each unknown with the person you will ask and a date, and reopen the section at requirements, before the contract, before the pilot, before launch and once after.",
          },
          {
            type: "accordion",
            heading: "Five moments to reopen the section, and what to ask each time",
            items: [
              { title: "When requirements are written", body: "<p>Does every requirement that assigns a task to a person appear in the burden field? Which requirements exist only because the process has always asked for them? Are the access, language and format decisions written as requirements with acceptance criteria?</p>" },
              { title: "Before a solicitation posts or a contract is signed", body: "<p>Which access and language commitments are named deliverables with a test attached? What could the division refuse to accept, and on what grounds? Contracts and procurement staff are the natural owners of this check.</p>" },
              { title: "Before a pilot", body: "<p>Does the pilot include the groups the design is most likely to fail, or only the places where it is easiest to run? How will pilot participants tell the team something is wrong, and in what languages and formats?</p>" },
              { title: "Before launch", body: "<p>What did testing with people who will use the service show? What is still unresolved, and is it recorded as a trade-off with a name and a date? What will the people who raised an issue hear back?</p>" },
              { title: "Once after launch, at the agreed point", body: "<p>What happened to the groups named in the first field? What did each accepted trade-off actually cost, and who paid it? If the design harmed or excluded people, what would accountability and repair require, and who owns that work?</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "When the honest answer is “we do not know yet”",
            control: "You control whether an unknown is written down with a question, a name and a date, or left blank, or covered with a general phrase.",
            failure: "Do not fill a field with a sweeping statement so it looks complete. “All Minnesotans” in the first field tells the next reader nothing and hides the people the design is most likely to fail.",
            next: "Wherever you do not know, write the question, the person or organization you will ask, and the date you expect an answer. Then put that date in the project schedule alongside the other dependencies.",
          },
          {
            type: "list",
            heading: "What this section is not",
            ordered: false,
            items: [
              "Not a rating of a project, a team or a person.",
              "Not an approval step. The offices that approve a charter, a solicitation or a launch still make those decisions.",
              "Not a substitute for a required accessibility review or a language-access obligation.",
              "Not a place for anyone's private information or a description of an individual's disability.",
              "Not finished when it is first written. Its value comes from the few minutes spent reopening it.",
            ],
          },
          {
            type: "knowledgeCheck",
            id: "ipe-13-4-check",
            question: "Which entry in the “who this affects” field is most useful to the next person who reads the charter?",
            options: [
              { text: "“All Minnesotans who use division services.”", correct: false },
              { text: "“People renewing this service each year, including people who do not read English comfortably, people who use a screen reader, people who rely on a supporter to complete forms, and people without reliable internet at home. The last two groups are most likely to be harmed by an online-only default.”", correct: true },
              { text: "“Applicants and their authorized representatives.”", correct: false },
              { text: "“Anyone with a disability, as required by law.”", correct: false },
            ],
            feedbackCorrect: "Yes. It names groups specifically enough that a reader can ask what the design requires of each one, and check later whether it worked for them.",
            feedbackIncorrect: "Ask what a colleague could do differently tomorrow because of each entry. The useful one names people specifically enough to design for and check on.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you and not collected anywhere: the project I can bring this section to is… the field I already cannot answer is… and the person or organization who could help me answer it is… If harm or exclusion has already occurred in a service I work on, what would accountability and repair ask of me and of the division?",
          },
        ],
      },
    ],
  },
  jobAid: {
    title: "Program and service design",
    subtitle: "One page for anyone shaping a division project from discovery to rollout",
    quote: "Ask the question while the answer is still cheap. After award, every change is a change order.",
    use: {
      purpose: "Keep the design questions in view while you define a problem, write requirements, draft a solicitation, plan a pilot or sponsor a project.",
      remember: [
        "Most of what decides whether a service works is settled before anyone calls it design: the problem statement, the scope, the requirements and the contract.",
        "The division's records mostly describe people the current process already worked for. They say very little about who stopped or never started.",
        "Co-design, advisory review, targeted consultation and testing a draft share different amounts of power. Say honestly which one you are offering.",
        "Community co-designers contribute professional expertise. Arrange access before the invitation and payment before anyone agrees.",
        "Burden is something a design produces, and it falls unevenly. The same requirement is a small errand for one household and a two-week project for another.",
        "A trade-off with no name and no date comes back as a complaint nobody can trace. Write down what you chose, who it leaves out and who decided.",
      ],
      doNext: "Add the six-field impact-on-people section to the charter of one project you are working on now, and bring it to the next project meeting.",
    },
    sections: [
      {
        heading: "Before the problem statement closes",
        items: [
          "Ask who described the problem, and whether anyone who experiences it was part of that description.",
          "List the evidence you are designing from, and who had to succeed at the current process to appear in it.",
          "Name the people and organizations who see what that evidence misses, and plan a short, paid, accessible way to hear from them.",
          "Check whether the schedule leaves any room to learn from the people affected before requirements are written.",
        ],
      },
      {
        heading: "The charter section, in short",
        items: [
          "Who this affects, and who is most affected.",
          "Whose expertise is missing, the arrangement offered and how people are paid.",
          "Burden this design creates, and who carries it.",
          "Access, language and format decisions, written as decisions.",
          "Trade-offs accepted, who is left out, who decided and the review date.",
          "How we will know, and what we will tell the people who contributed.",
          "Reopen it at requirements, before the contract, before the pilot, before launch and once after.",
        ],
      },
      {
        heading: "When you are choosing defaults",
        items: [
          "Channel: offer more than one way in, and name them near the top.",
          "Format: real text and readable structure, decided at the start.",
          "Timing: count windows from arrival, and remind before closing.",
          "Proof: do not ask for what the division already holds.",
          "Who decides: recognize the people a person has chosen to involve.",
        ],
      },
      {
        heading: "Who this helps",
        items: [
          "Policy and program staff, who define the problem, set the scope and decide what a service asks of people — a useful place to start.",
          "Contracts, fiscal and procurement staff, who turn accessibility and language access into named deliverables and acceptance criteria while a solicitation is still open — a useful place to start.",
          "Executive and senior leaders, who sponsor projects, sign charters and decide which trade-offs are accepted and on whose behalf — a useful place to start.",
          "Quality, data, communications and project staff, who can build these questions into the way a project is checked and reported.",
        ],
      },
      {
        heading: "Related modules",
        items: [
          "Accessible public communications",
          "Policy writing through an equity lens",
          "Equitable stakeholder partnership",
          "Digital equity and accessible technology",
          "Cross-division coordination",
        ],
      },
    ],
  },
  sources: [
    { title: "ADA.gov, ADA Title II Primer: State and Local Government Services", href: "https://www.ada.gov/resources/title-ii-primer/", note: "U.S. Department of Justice guidance on the obligations of state and local governments to make programs, services and activities accessible to people with disabilities, including program access and effective communication." },
    { title: "W3C Web Accessibility Initiative, Involving users in web projects for better, easier accessibility", href: "https://www.w3.org/WAI/planning/involving-users/", note: "Guidance on involving people with disabilities from the start of a project and throughout it, and on why early involvement finds problems that a late standards check does not." },
    { title: "Section508.gov, Program management", href: "https://www.section508.gov/manage/program-management/", note: "Federal guidance on building accessibility into program management, including roles, policies and incorporating accessibility requirements into acquisition and project lifecycles." },
    { title: "PlainLanguage.gov, Test your assumptions", href: "https://www.plainlanguage.gov/guidelines/test/", note: "Federal plain-language guidance on testing drafts with the people who will use them, including task-based and paraphrase testing." },
    { title: "U.S. Department of Health and Human Services, National CLAS Standards", href: "https://thinkculturalhealth.hhs.gov/clas", note: "National standards for culturally and linguistically appropriate services, including governance, community partnership in design and evaluation, and language assistance." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "Minnesota's council advising state government on disability policy, accessibility and the participation of people with disabilities." },
    { title: "Minnesota Management and Budget, Impact Evaluation", href: "https://mn.gov/mmb/impact-evaluation/", note: "Minnesota's state program for evaluating whether programs achieve their intended results, and for building evidence into program decisions." },
    { title: "Minnesota Framework for Universal Multicultural Instructional Design", href: "https://mncpd.org/wp-content/uploads/2016/12/MN_Framework_for_Universal_Multicultural_Instructional_Design.pdf", note: "The design reference for this curriculum: multiple ways to engage, culturally responsive materials and accessible instruction." },
  ],
};

export default pack;
