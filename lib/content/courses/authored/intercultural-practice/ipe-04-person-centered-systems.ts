import type { CoursePack } from "../../source-types";

// Intercultural Practice and Equity · Foundations · Module 4: Person-centered thinking in state systems.
// Internal DHS/DSD staff learning. Voluntary, self-directed, unscored. People with disabilities,
// families and community organizations appear here as compensated co-designers and advisors, not as learners.
const pack: CoursePack = {
  course: {
    id: "ipe-04-person-centered-systems",
    indexNumber: 1146,
    seriesLabel: "Intercultural Practice and Equity · Foundations",
    title: "Person-Centered Thinking in State Systems",
    subtitle: "Policy, guidance, forms, measures and contracts decide what a person’s week looks like long before anyone meets them.",
    scope: "For internal DHS and DSD staff whose work shapes statewide policy, program design, guidance, data, communications, contracts and oversight. Especially useful as a starting point for policy and program staff; contracts, fiscal and procurement staff; and executive and senior leaders. Four short lessons you can take in any order and return to. Participation is voluntary and self-directed: nothing here is scored or recorded, reflections stay private, and completion does not count toward required training credits.",
    treatment: "Four short lessons with internal-work scenarios, tabs, flashcards, a sorting exercise, a copyable walkthrough guide and knowledge checks",
    duration: "40–45 minutes",
    author: "One DSD — People, Access and Culture",
    coverImage: "/images/covers/from-noticing-to-shifting.jpg",
    coverAlt: "Hands revise a printed form with a red pen.",
    introTranscript: "Person-centered practice is familiar in service planning: the plan starts from what matters to the person. Statewide work looks nothing like that. A paragraph becomes guidance, guidance becomes a form, a form becomes a deadline, and a deadline becomes somebody’s week. This course is about keeping one reachable person in view while writing a rule that applies to everyone: tracing what a decision costs, designing the default instead of the exception, and asking, early enough to matter, how this would feel and function for the person most affected.",
    kind: "course",
    contentType: "foundation",
    learning: {
      objectives: [
        "Distinguish person-centered planning for one person from person-centered design of the statewide conditions that plan has to survive.",
        "Trace a statewide decision through its chain of translations and name where the person stops being visible.",
        "Describe the learning, paperwork and worry costs a requirement places on people, and who carries each one.",
        "Identify the default in a policy, measure, notice or contract and one change that moves a common need out of the exception process.",
        "Use a five-line walkthrough at a real checkpoint to record how a pending decision would feel and function for the person most affected.",
      ],
      evidence: [
        "Four scenario decisions set in statewide policy, quality, procurement and leadership work, each with a recommended response and an explanation.",
        "A sorting exercise on who carries the cost of a requirement, and a knowledge check in every lesson.",
        "A completed walkthrough guide for one decision the learner is working on now.",
      ],
      appliedNextStep: "Take one decision you are drafting, reviewing or funding this month. Answer the five walkthrough lines in specifics, and send the answers with the draft to the people who own the parts you cannot change yourself.",
    },
    governance: {
      contentOwner: "One DSD — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: [
        "A change in DHS or Disability Services Division policy, guidance, forms or notice practice that this course describes in general terms",
        "A change in federal or state accessibility or language access requirements that affects how statewide decisions must be communicated",
        "Feedback from staff, or from compensated community advisors and people who use the services, that a scenario does not match how statewide work actually moves",
      ],
      relatedDoor: "Formal decisions about statewide disability services policy, guidance, notices, measures and contract terms rest with the Disability Services Division and the DHS offices that own each process; this course prepares the question, it does not make the decision.",
      toolkitQuestion: "How would this decision feel and function for the person most affected, and what am I willing to change before it is final?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "ipe-04-1",
        number: 1,
        title: "When the person is not in the room",
        summary: "What person-centered thinking asks of statewide work, and the point in a policy, guidance document or form where the person quietly disappears.",
        minutes: 11,
        learning: {
          objective: "Explain what person-centered thinking requires of statewide work, and identify the point in a policy, guidance document or form where the person stops being visible in the decision.",
          takeaways: [
            "Person-centered planning is about one person’s plan. Person-centered systems work is about the conditions that plan has to survive: the policy, the guidance, the form, the notice, the deadline and the phone line.",
            "Every statewide decision reaches a person through a chain of translations. Policy becomes guidance, guidance becomes a form, a form becomes a conversation, and the conversation becomes somebody’s week. Meaning is lost at every link, and each link has an owner who can fix it.",
            "A process that treats everyone identically is not automatically fair. The same requirement lands differently depending on language, distance, documentation, work schedule, health, trust and disability.",
            "Imagining the person sharpens a draft; it never replaces asking people. Community members, people with disabilities and families who shape this work are advisors and co-designers, invited early and paid for their expertise.",
          ],
          evidence: "A scenario decision about statewide guidance, a tabbed walk through one requirement as four different people meet it, and a knowledge check on where the question still has leverage.",
          appliedNextStep: "Take one thing you are drafting or reviewing now and write out the chain: draft language, guidance, form or notice, the conversation, the person’s week. Mark the link where the person stops being visible.",
        },
        scenario: {
          context: "A DSD policy unit is finishing statewide guidance for a new annual verification step. The draft is accurate, legally sound and clear to the people writing it. A colleague asks how the requirement will read to someone who receives the notice. The lead answers that guidance is written for lead agencies, not for the public, so that question belongs later, with communications.",
          prompt: "What is the most useful response at this point in the drafting?",
          options: [
            {
              label: "Agree, and leave the plain-language work to the notice that goes out afterward.",
              response: "The notice inherits whatever the guidance decides. By the time communications sees it, the deadline, the proof required and the consequence of missing it are already fixed, and wording cannot move any of them.",
            },
            {
              label: "Keep drafting, and add one step now: walk the requirement forward to the person who will receive the notice. Name what they must do, how long it takes, and what happens if they cannot. Change what the guidance can still change.",
              response: "This is person-centered work at the statewide level. The guidance is where the deadline, the proof and the consequence are actually set, so it is where the question still has leverage.",
              recommended: true,
            },
            {
              label: "Send the finished draft to a community organization for feedback before it is published.",
              response: "Worth doing, and it works when there is time, payment and a specific question. Sent late as a finished draft with a short turnaround, it asks partners to approve work they had no chance to shape.",
            },
          ],
        },
        transfer: {
          prompt: "Where in your own work does the person stop being visible?",
          options: [
            "Name one document you write where the subject shifts from what should happen for a person to what a system must record",
            "Find the sentence in it that decides what someone must do, by when, and with what proof",
            "Name the colleague who owns the next link in the chain, and what you will tell them",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Two different kinds of person-centered work",
            body: "<p>Person-centered practice is familiar in service work: the plan starts from what matters to the person, in their own words, and supports are arranged around that life. Statewide work looks nothing like that. An analyst writes a paragraph. A program manager turns it into guidance. A field on a form changes. A notice goes out under a deadline. Nobody in that chain meets the person whose month the paragraph has just rearranged.</p><p>Person-centered thinking at this level is not a softer version of planning. It is a different job: keeping one reachable person in view while writing a rule that has to work for everyone. The plan belongs to the person. The conditions that plan has to survive belong to us — the deadline, the proof, the channel, the wording, the hours the line is open, the amount a contract pays for interpretation.</p><p>The test is not whether we care about people. It is whether the design still carries that care after we stop paying attention to it.</p>",
          },
          {
            type: "tabs",
            heading: "One requirement, four vantage points",
            tabs: [
              { label: "Policy and program staff", body: "<p>The requirement is one sentence inside a long document. It is lawful, consistent with the program’s purpose and defensible. The team has its own deadline, and this sentence is not the hardest part of the draft.</p>" },
              { label: "Lead agency staff", body: "<p>The sentence becomes a task list: a new field to complete, a new document to collect, and a question they will be asked over and over before the change is understood. What was one sentence is now their week too.</p>" },
              { label: "A community organization", body: "<p>An organization the family already trusts starts explaining the change to people who call them first. Nobody funded that work, and nobody asked whether the explanation they are giving is the one we intended.</p>" },
              { label: "The person and the people around them", body: "<p>A letter arrives. It uses a word the person has not seen before. It names a date and a document. It does not say what to do if the clinic cannot produce the document in time, and the number on the letter has a long wait.</p>" },
            ],
          },
          {
            type: "list",
            heading: "Where the person usually disappears",
            items: [
              "In the shift from purpose to procedure: the draft stops describing what should happen for a person and starts describing what the system must record.",
              "In the word “simply”: simply upload it, simply call, simply return the form by the date on the letter.",
              "In the exception clause: a real need is acknowledged, then moved into a process that only works for someone who knows the exception exists.",
              "In the measure: a count of notices sent replaces any account of whether people could act on them.",
              "In the handoff: every step assumes the next one will make it understandable, and the last step is the person.",
            ],
          },
          {
            type: "leaderMove",
            heading: "Ask it while the draft can still change",
            control: "You control when the question gets asked. While the draft is open, the deadline, the proof, the channel and the consequence are still yours to set.",
            failure: "Do not save the question for the communications stage. Careful wording can soften a notice; it cannot move a deadline the guidance already fixed.",
            next: "On your current draft, mark the one line that decides what a person must do, and ask the question about that line before the next review.",
          },
          {
            type: "flashcards",
            heading: "Terms worth keeping apart",
            cards: [
              { front: "Person-centered planning", back: "<p>One person’s plan, in their words, with supports arranged around their life. It belongs to the person. Writing those plans is not what this course is about.</p>" },
              { front: "Person-centered systems work", back: "<p>Policy, guidance, data, purchasing and process designed so that a person-centered plan is possible, affordable and survivable once it meets the rules.</p>" },
              { front: "The reachable person", back: "<p>The specific person you can picture at the end of the chain: the one who receives the notice, does the task and lives with the result. A check on whether the draft still makes sense out there.</p>" },
              { front: "The translation chain", back: "<p>Policy, guidance, form, notice, conversation, the person’s week. Meaning is lost at every link, and every link has an owner who can repair it.</p>" },
              { front: "The design default", back: "<p>What happens when nobody asks for anything different. The default is the real policy. Everything else is an exception somebody has to know about.</p>" },
            ],
          },
          {
            type: "quote",
            text: "The policy made sense in the room where we wrote it. The first call I took about it was from a woman who had already missed the date, and nothing we wrote had told her what to do next.",
            cite: "Composite DHS staff perspective, illustrative",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-04-1-check",
            question: "A statewide guidance draft sets a new proof requirement and a return date. Where does person-centered thinking have the most leverage?",
            options: [
              { text: "In the notice, because that is the document the person actually reads.", correct: false },
              { text: "In the guidance itself, because the deadline, the proof and the consequence of missing it are decided there and inherited by everything downstream.", correct: true },
              { text: "In staff training, because the requirement will be explained by the people who take the calls.", correct: false },
              { text: "At the point of appeal, because that is where real problems become visible.", correct: false },
            ],
            feedbackCorrect: "Yes. Clear wording later cannot undo a deadline or a proof requirement that the guidance already fixed.",
            feedbackIncorrect: "Ask which document decides what the person must do, by when, and with what proof. That is where the question still changes something.",
          },
          {
            type: "statement",
            body: "Private reflection, for you alone. Nothing here is recorded, scored or shared: How might my role, authority, language or assumptions shape the decision I am working on this week? Who could be helped, burdened, excluded or misunderstood by it?",
          },
        ],
      },
      {
        id: "ipe-04-2",
        number: 2,
        title: "Follow the decision downstream",
        summary: "What a requirement actually costs the person who has to meet it, why the same rule is not the same experience, and where costs go when the agency stops carrying them.",
        minutes: 11,
        learning: {
          objective: "Trace one statewide decision through its chain of translations and name the learning, paperwork and worry costs it places on the person most affected, and who carries each one.",
          takeaways: [
            "People pay three kinds of cost to use a public program: learning what exists and what applies to them, doing the paperwork and proof, and carrying the worry, confusion or stigma that comes with it.",
            "The same requirement is not the same experience. Distance, language, work schedule, documentation, health, trust in government and who is available to help all change what it costs.",
            "Costs the agency stops carrying do not disappear. They move to the person, to a family member who takes on the calls, or to a partner organization that was never funded for the work.",
            "“Non-response” and “declined” in the results are usually the sound of a cost somebody could not pay, not a fact about how much people care.",
          ],
          evidence: "An accordion that reads the three costs in a process you own, a sorting exercise on who carries each cost, and a scenario about how a quality summary describes a rise in closures.",
          appliedNextStep: "Pick one requirement your work depends on. Write the real steps in order, with minutes, trips, documents and calls, and name the one step you could remove, extend or pay for.",
        },
        scenario: {
          context: "Quality and performance staff notice that closures for non-response have risen sharply in one program since a verification step was added. The program is operating exactly as written. A draft summary explains the increase as a decline in participant responsiveness.",
          prompt: "What should the summary say instead?",
          options: [
            {
              label: "Keep the finding as written and recommend a second reminder notice.",
              response: "A second notice is a reasonable small fix, and it treats the increase as a communication problem. Nothing in the summary yet says what people were actually asked to do.",
            },
            {
              label: "Describe what the step requires — the proof, the channel, the date and what it costs to comply — and report the closures as the result this design produced, then name the parts of the design that could change and who owns them.",
              response: "This is accurate reporting rather than a claim about people’s behavior, and it gives the owner of each part of the process something they can act on.",
              recommended: true,
            },
            {
              label: "Report the increase without interpretation, since the reasons are unknown.",
              response: "It sounds neutral, but the number will be read as a fact about participants. If the reasons are unknown, say what is known about the requirement and what would have to be learned to explain the rest.",
            },
          ],
        },
        transfer: {
          prompt: "Pick one requirement your work depends on. What does it actually cost the person who has to meet it?",
          options: [
            "Write the real steps, in order, with minutes, trips, documents and calls",
            "Name one group for whom the cost is several times higher, and why",
            "Name the one step you could remove, extend or pay for, and the person who owns it",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Three costs, and where they land",
            body: "<p>Every public program asks people to do something in order to use it: find out it exists, show they qualify, respond by a date, and keep doing so. A useful way to describe what that asks of someone is three costs. The <strong>learning cost</strong> is working out what exists, what applies, and what the letter means. The <strong>paperwork cost</strong> is the doing: the form, the proof, the copy, the signature, the call, the trip, the time away from work. The <strong>worry cost</strong> is what the process takes out of a person: confusion, the fear of losing a service while a decision is pending, explaining a disability again to a stranger, the memory of a previous denial.</p><p>These costs are not spread evenly, and they are not spread randomly. The same annual form costs one household ten minutes at a kitchen table. It costs another household a day of unpaid leave, a ride, an interpreter who is not available that week, and several nights of poor sleep.</p><p>Costs the agency chooses not to carry do not vanish. They move. They land on the person, on a family member who becomes the household’s caseworker, or on a community organization now doing statewide implementation work it was never funded for and never asked to do.</p>",
          },
          {
            type: "accordion",
            heading: "Read the three costs in something you own",
            items: [
              { title: "Learning cost", body: "<p>Count the steps between not knowing and knowing. Where did the process assume the person already knew the program existed, already knew which of three similar words applied to them, or already knew that an exception was possible?</p>" },
              { title: "Paperwork and proof cost", body: "<p>Add up the real minutes, trips, copies, signatures and calls. Then ask what the proof requires a person to have: a printer, a bank account, a landlord who answers, a clinic appointment inside the window, a document from a country they left.</p>" },
              { title: "Worry cost", body: "<p>Notice where the process asks somebody to explain a disability again, to be judged, or to risk losing something while a decision is pending. Worry cost is a large part of why people who plainly qualify never apply.</p>" },
              { title: "Where the cost moved", body: "<p>If a step became easier for staff, find out who it became harder for. A change that saves review time and adds a notarized form has not reduced cost. It has relocated it, usually onto the person with the least room to absorb it.</p>" },
            ],
          },
          {
            type: "sorting",
            id: "ipe-04-2-sort",
            heading: "Who is carrying this cost?",
            categories: ["Cost the agency carries", "Cost the person carries", "Cost moved to a partner"],
            items: [
              { text: "Staff call each household before the deadline to confirm the form arrived and answer questions.", category: "Cost the agency carries" },
              { text: "The form must be notarized and returned by mail within ten days.", category: "Cost the person carries" },
              { text: "A neighborhood organization explains the new requirement to the families who trust it, unpaid and unasked.", category: "Cost moved to a partner" },
              { text: "The program pays for interpretation at every step, including the follow-up call.", category: "Cost the agency carries" },
              { text: "A parent takes an unpaid afternoon off work to collect a clinic signature.", category: "Cost the person carries" },
              { text: "County staff rewrite their own counter instructions because the statewide guidance cannot be used with a person sitting in front of them.", category: "Cost moved to a partner" },
              { text: "The online form saves what a person entered, so stopping partway through is not starting over.", category: "Cost the agency carries" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Report the requirement next to the result",
            control: "You control whether a report describes what people did or what the process required of them.",
            failure: "Do not let “non-response” stand as an explanation. It is a result, not a reason, and it is usually the sound of a cost somebody could not pay.",
            next: "In your next summary or review note, put the requirement beside the result: what was asked, of whom, by when, and what happened.",
          },
          {
            type: "list",
            heading: "Questions that turn a number back into a process",
            ordered: true,
            items: [
              "What exactly were people asked to do, in what channel, by what date?",
              "Which groups had to do more than that to comply, and what did the extra consist of?",
              "What happens to someone who does everything right but late, and who tells them?",
              "Which part of this could a person have argued with before it took effect?",
              "Who, inside the program, hears about it when it fails?",
            ],
          },
          {
            type: "knowledgeCheck",
            id: "ipe-04-2-check",
            question: "A change moves a verification step from a call staff make to a form the person must return. Review time drops and closures rise. Which statement describes the change most accurately?",
            options: [
              { text: "Efficiency improved, and the closures reflect participants who did not respond.", correct: false },
              { text: "The cost of verification moved from the agency to the person, and the closures are part of that cost showing up in the results.", correct: true },
              { text: "The change is neutral, because the same information is collected either way.", correct: false },
              { text: "The closures are a communication problem that a second notice will resolve.", correct: false },
            ],
            feedbackCorrect: "Yes. Work that leaves the agency does not disappear. It lands on somebody, and it returns in the results as closures, appeals and people who stop trying.",
            feedbackIncorrect: "Follow the work itself. If a task left the agency, ask who is doing it now, what it costs them, and where that cost shows up in the numbers.",
          },
          {
            type: "statement",
            body: "Private reflection, for you alone and not recorded: Who could be helped, burdened, excluded or misunderstood by the process I am changing? Whose expertise is missing from the room where it is being decided?",
          },
        ],
      },
      {
        id: "ipe-04-3",
        number: 3,
        title: "Design the default, not the exception",
        summary: "Defaults, deadlines, proof, measures and contract terms are where person-centered intentions either survive or quietly become someone else’s problem.",
        minutes: 11,
        learning: {
          objective: "Identify the default in a policy, measure, notice or contract you influence, and describe one change that moves a common need out of the exception process and into the design.",
          takeaways: [
            "The default decides who has to ask. Anything available only by exception is available mostly to people with time, language, confidence and somebody to advocate for them.",
            "Measures teach a system what counts as real. Count notices sent, and the system will send notices. Count whether people could act on them, and the design starts to change.",
            "A contract or grant is a design document. What you require, fund and score becomes what the person receives; what you call preferred gets negotiated away.",
            "Adapting a process to how people actually live is not lowering the standard. The standard is whether the program does what it was created to do, for the people it was created for.",
          ],
          evidence: "A tabbed comparison of what the question changes in policy, data, purchasing and communication, a procurement scenario, and a knowledge check on exceptions that are granted almost every time.",
          appliedNextStep: "Find one need your process currently handles by exception. Estimate how many people have it, and write what it would take to make it the default.",
        },
        scenario: {
          context: "A solicitation is being prepared for a statewide redesign of participant-facing forms and notices. The draft lists accessible formats, plain language, translation into the languages the program serves, and review by people who use the services as preferred qualifications. The evaluation criteria weight price and delivery speed.",
          prompt: "What change matters most before this goes out?",
          options: [
            {
              label: "Leave those as preferred qualifications and address access during the project, once a vendor is selected.",
              response: "Anything preferred is negotiable, and under a price-weighted award it will be negotiated away. The project then pays twice: once to build it and once to retrofit it.",
            },
            {
              label: "Move accessible formats, plain language and translation into the required scope and the evaluation criteria, fund review by people who use the services as paid work in the budget, and say what evidence of each the vendor must provide.",
              response: "What you require, fund and score is what the person finally receives. Requirements in scope and in scoring, with money attached to the review, are the parts that survive both award and delivery.",
              recommended: true,
            },
            {
              label: "Add a contract clause requiring compliance with accessibility standards and leave the rest as drafted.",
              response: "A clause helps and is often required, but it arrives at the end as a test to pass. It does not buy plain language, translation, or the participation of the people the forms are for.",
            },
          ],
        },
        transfer: {
          prompt: "What is the default in the process you know best, and who has to ask for anything else?",
          options: [
            "Name one accommodation or flexibility your team grants routinely on request",
            "Estimate how many people need it and never ask",
            "Write the one sentence that would make it the default, and name who must approve that sentence",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "The default is the real policy",
            body: "<p>Most of what a person experiences was decided by a handful of quiet choices: which channel is standard, how long the window is, what proof counts, what the first sentence of the notice says, and who has to ask for anything different. Those choices are the default, and the default is the real policy. Everything else is an exception, available to whoever knows it exists.</p><p>That is why exception-based design tends to reverse the intent of the people who wrote it. The flexibility is real, and it reaches the person who has an advocate, a strong command of English, a flexible job and the confidence to press. The person it was designed for, working nights, reading the letter in a second language, already told no once before, never asks.</p><p>The same logic runs through data and purchasing. A measure tells a program what to optimize; if the only thing counted is agency activity, no one is accountable for whether the activity worked. A contract decides what gets built and who gets paid to check it. These are not administrative details around the edge of person-centered practice. In statewide work, they are where it lives.</p>",
          },
          {
            type: "tabs",
            heading: "What the question changes in four kinds of work",
            tabs: [
              { label: "Policy and guidance", body: "<p>The draft names what a person must do, by when, in what language, with what proof — and says what happens when they cannot. The exception process stays small because the default already fits the common case.</p>" },
              { label: "Data and measures", body: "<p>The measure says something about the person’s experience, not only the agency’s activity: not notices sent but whether people could act on them; not applications received but who is missing and why. Results are looked at separately by language, region, age and disability, because an average hides the people a program is failing.</p>" },
              { label: "Contracts and purchasing", body: "<p>Accessibility, plain language, translation and paid review by people who use the services sit in the scope, the budget and the scoring, not in the hopes. The evidence each vendor must produce is written down before award.</p>" },
              { label: "Communication and notices", body: "<p>The first lines say what happened, what the person must do, by when, and what to do if that is not possible — in plain words, in the languages the program serves, with a way to reach a person who can actually help.</p>" },
            ],
          },
          {
            type: "accordion",
            heading: "Identical is not the same as fair",
            items: [
              { title: "Where identical treatment comes from", body: "<p>“One process for everyone” feels like fairness, and in public administration it also protects something real: consistency, predictability and equal application of the law. The trouble starts when sameness of process is treated as proof of sameness of result.</p>" },
              { title: "The frame this program uses", body: "<p>This program uses the intercultural development continuum — denial, polarization, minimization, acceptance, adaptation and integration — to describe how an organization moves. Minimization is the stage where difference is acknowledged and then treated as unimportant: we serve everyone the same way. Acceptance and adaptation keep the standard and change the design so it actually reaches people whose circumstances differ. These stages describe the work of an organization. They are never a label, a score or a record about any individual person.</p>" },
              { title: "What adaptation is not", body: "<p>It is not lowering a standard, waiving a legal requirement or treating people as fragile. Accessibility and language access are obligations that come from law and policy, not favors this program invented. Adaptation means the program does what it was created to do for the people it was created for.</p>" },
            ],
          },
          {
            type: "list",
            heading: "Defaults worth checking in anything you own",
            items: [
              "Channel: what happens for somebody with no reliable mail, no printer, no smartphone, or nowhere quiet to take a call.",
              "Timing: whether the window assumes a weekday, a car, a clinic appointment that can be had inside it, and a household with no crisis in progress.",
              "Proof: whether the document required is one the person can actually obtain, and who cannot obtain it.",
              "Language and reading: whether the first sentence tells somebody who does not already know how DHS works what has happened and what to do next.",
              "Who has to ask: whether a common need is met by default, or only for the person who knows the exception exists.",
              "What happens on failure: whether missing a step ends the service, pauses it, or triggers a call from a person.",
            ],
          },
          {
            type: "leaderMove",
            heading: "Make the routine exception the rule",
            control: "You control whether a known need is designed in or handled case by case.",
            failure: "Do not answer a pattern with a workaround. If staff have built the same workaround more than a few times, the design is wrong, not the people using it.",
            next: "Name one exception your team grants routinely, and start the work to make it the default before the next review point.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-04-3-check",
            question: "A program grants extra time on request, and staff report approving nearly every request that comes in. What does that most likely indicate?",
            options: [
              { text: "The exception process is working well and should be left alone.", correct: false },
              { text: "The standard window is too short for the people the program serves, and the requirement to ask is sorting by confidence and information rather than by need.", correct: true },
              { text: "Too many people are asking, so the criteria should be tightened.", correct: false },
              { text: "Staff are being too generous with approvals.", correct: false },
            ],
            feedbackCorrect: "Yes. A near-total approval rate says the need is common. Keeping it behind a request means the people who do not know to ask carry the cost.",
            feedbackIncorrect: "Ask what an exception granted almost every time tells you about the default — and who never asks for it.",
          },
          {
            type: "statement",
            body: "Private reflection, for you alone and never recorded: What might accessibility mean here beyond a legal minimum? Does this process make sense to people who do not already know how DHS works?",
          },
        ],
      },
      {
        id: "ipe-04-4",
        number: 4,
        title: "Ask it early: how would this feel and function for the person most affected?",
        summary: "A five-line walkthrough you can copy into your own drafting, agenda or review checkpoint, plus what to do when the answer shows harm has already happened.",
        minutes: 11,
        learning: {
          objective: "Use a five-line walkthrough at a real checkpoint in your own work to describe how a pending decision would feel and function for the person most affected, and record what you will change and what you will not.",
          takeaways: [
            "The question works when it is attached to a checkpoint that already exists: a drafting template, an agenda item, the review before sign-off. Left to good intentions, it gets asked after the decision.",
            "Answer in specifics. “We considered impact” is not an answer. What the person must do, in what language, by when, with what proof, at what cost, and what happens if they cannot — that is an answer.",
            "Say plainly what you will not change and why. Cost, law, timeline and system limits are real, and a named limit is something people can plan around and argue with. A vague one reads as indifference.",
            "The question prepares you to work with people; it does not stand in for them. People with lived and community expertise are advisors and co-designers, invited early, paid for their time, and told what happened to what they said.",
            "When the answer shows harm already happened, repair is practical: name it, tell the people affected, fix the design rather than only the case, and check whether the fix worked.",
          ],
          evidence: "A completed walkthrough guide for a statewide decision, a scenario about where the checkpoint belongs, and a knowledge check on what makes an answer complete.",
          appliedNextStep: "Put the five lines in the drafting note, agenda or review checklist for one piece of work this month, answer them in specifics, and send the answers with the draft.",
        },
        scenario: {
          context: "A senior leader likes the question and proposes a new review board: every statewide policy change would go to a standing group that asks how the change would feel for the person most affected. The group would meet monthly. Teams are already waiting on three other sign-offs.",
          prompt: "What is the better way to make the question stick?",
          options: [
            {
              label: "Create the board. A standing group gives the question authority and consistency.",
              response: "Authority, yes, and one more queue. A monthly board reviews finished drafts, and the answers that actually change a design have to arrive while it is still being written.",
            },
            {
              label: "Attach the question to checkpoints that already exist — the drafting template, the agenda for the decision meeting, the review before sign-off — and expect the answers in writing, with the draft.",
              response: "The question changes work when it is part of doing the work rather than a separate approval, and it keeps responsibility with the people who own the decision.",
              recommended: true,
            },
            {
              label: "State the question as a value in the program plan and trust professional practice to carry it.",
              response: "Values without a checkpoint lose to deadlines. Naming where and when the question gets asked is what turns an intention into practice.",
            },
          ],
        },
        transfer: {
          prompt: "Where will the question live in your work?",
          options: [
            "Name the checkpoint that already exists and will carry it",
            "Name what you will send with the draft: the five lines, answered in specifics",
            "Name the person who will ask you for it if you forget",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "The question, and what makes it honest",
            body: "<p>The question is short: how would this feel, and how would it function, for the person most affected? Both halves matter. <strong>Function</strong> is mechanical — can the person do what is asked, in the time given, with what they have. <strong>Feel</strong> is not decoration. A process that works on paper but requires somebody to explain a disability to three strangers, or to admit they cannot read the letter, will not be used by everyone who qualifies for it.</p><p>Two habits keep the question honest. First, answer in specifics: not “we considered impact,” but “a person with no printer, working days, reading this in a second language, has to return a signed document by the eighth.” Second, say what you will not change and why, in the same breath. A limit named plainly is something colleagues and partners can work around and challenge. A limit left vague is indistinguishable from not caring.</p><p>And the question does not replace people. It is what you do before and between the conversations, so that when people with lived and community expertise are in the room — invited early, paid for their time, and told afterward what happened to what they said — their hours are spent on the decisions that are still open.</p>",
          },
          {
            type: "artifact",
            kind: "tagged-document",
            label: "Practical tool",
            title: "A walkthrough for the person most affected",
            summary: "Five lines you can copy into a drafting note, a meeting agenda or the review before sign-off. Filled in below for one statewide decision.",
            fields: [
              { label: "The decision and the checkpoint", value: "A new annual verification step, answered at the drafting checkpoint before guidance goes to sign-off — not after publication." },
              { label: "Who is most affected, and who is affected differently", value: "Everyone who must return the form. Within that: people who do not read English easily, people with no printer or stable mail, people whose disability makes a fixed short deadline hard, and households whose only adult cannot take a weekday afternoon." },
              { label: "What the person must do, and what it costs them", value: "Read a two-page letter, obtain one document, sign it, and return it by mail within ten days. Realistically: an afternoon, one trip, one copy, and one call to ask what a term on the letter means." },
              { label: "What happens if they cannot, and who hears about it", value: "Services close for non-response. The person hears this from an automated notice. Nobody on the drafting team hears anything unless an appeal is filed." },
              { label: "What we will change, what we will not, and how we will say so", value: "Change: accept the document by mail, phone and drop-off; lengthen the window; call before closing. Not changing: the requirement itself, which is set in the program’s rules. Say so plainly in the guidance, the notice and the message to lead agencies." },
            ],
            action: "Copy the five lines into your drafting note, agenda or review checklist. Answer them in specifics for one decision you are working on now, and send the answers with the draft to the people who own the parts you cannot change yourself.",
          },
          {
            type: "list",
            heading: "How to answer each line so it is useful",
            items: [
              "Use a checkpoint that already exists. The question belongs in the drafting template, the agenda or the review before sign-off, not in a new queue.",
              "Be specific about people without inventing them: describe circumstances the program already knows it serves — language, distance, documentation, work schedule, disability, age, household.",
              "Count in real units: minutes, trips, documents, calls, and days without an answer.",
              "Write the failure path. Most harm in public programs happens in what occurs after somebody cannot complete a step.",
              "Separate what you can decide from what you must hand upward, and name the office that owns each part.",
              "Say what you are not changing and give the reason in the same sentence.",
            ],
          },
          {
            type: "accordion",
            heading: "When the answer shows that harm already happened",
            items: [
              { title: "Name it plainly", body: "<p>Say what happened and who was affected, in the record, without softening it into “challenges” or “lessons learned.” People can tell the difference, and the honest account is what makes everything after it credible.</p>" },
              { title: "Tell the people affected", body: "<p>The people who lost time, money or a service are the ones who most need to hear it — in the language they use, through a channel they actually receive. Telling only the people upstream is not accountability.</p>" },
              { title: "Fix the design, not only the case", body: "<p>Reopening one case repairs one person. If the design produced the harm, it is still producing it for everyone who never appealed.</p>" },
              { title: "Check whether the fix worked", body: "<p>Set a point to look again, with the people affected if they are willing and compensated, and be prepared to report that the first fix was not enough.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Write the answer down",
            control: "You control whether the question is asked while the decision is open, and whether the answer is written rather than spoken.",
            failure: "Do not let the answer live only in a meeting. An unwritten answer cannot be handed to the office that owns the part you could not change.",
            next: "Answer the five lines for one decision this month and send them with the draft.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-04-4-check",
            question: "Which answer to “what happens if they cannot?” is complete enough to act on?",
            options: [
              { text: "“Participants who do not respond will be closed in accordance with program rules.”", correct: false },
              { text: "“We recognize this may be difficult for some participants and will monitor the impact.”", correct: false },
              { text: "“Services close after ten days. The person learns this from an automated notice. Nobody in the program hears about it unless an appeal is filed, so we are adding a call before closure and a regular look at closures by language and region.”", correct: true },
              { text: "“Staff will use discretion and help participants who reach out.”", correct: false },
            ],
            feedbackCorrect: "Yes. It says what happens, who finds out, who does not, and what is changing because of that.",
            feedbackIncorrect: "A complete answer names the consequence, who hears about it, who does not, and the specific change you are making now.",
          },
          {
            type: "list",
            heading: "Related modules in this learning area",
            items: [
              "Intercultural practice in public disability services",
              "Public power and institutional impact",
              "Bias, assumptions, and accountability",
              "Participation and voice",
              "Choosing a learning focus",
            ],
          },
          {
            type: "statement",
            body: "Private reflection, for you alone and never recorded: How could the people most affected shape this work earlier than they do now? If harm or exclusion has already happened here, what would accountability and repair require of me, and of my team?",
          },
        ],
      },
    ],
  },
  jobAid: {
    title: "Person-centered thinking in state systems",
    subtitle: "One page for a policy, a measure, a notice or a contract",
    quote: "Before it is a policy, it is somebody’s week.",
    use: {
      purpose: "Keep the person at the end of the chain in view while you draft, decide, measure or buy.",
      remember: [
        "The plan belongs to the person. The conditions it has to survive belong to us: the deadline, the proof, the channel, the wording, the money in the contract.",
        "The default is the real policy. Anything available only by exception reaches the people who already know how to ask.",
        "Costs the agency stops carrying move to the person, to a family member, or to a partner nobody funded.",
        "Imagining the person sharpens a draft. It never replaces inviting people early and paying them for their expertise.",
      ],
      doNext: "Answer the five walkthrough lines for one decision you are working on now, and send them with the draft.",
    },
    sections: [
      {
        heading: "The five-line walkthrough",
        items: [
          "The decision, and the checkpoint where this gets asked while the draft is still open.",
          "Who is most affected, and who is affected differently.",
          "What the person must do, and what it costs them in minutes, trips, documents and calls.",
          "What happens if they cannot, and who inside the program hears about it.",
          "What we will change, what we will not change and why, and how we will say so.",
        ],
      },
      {
        heading: "Where the person usually disappears",
        items: [
          "When purpose turns into procedure and the subject becomes what the system must record.",
          "In the word “simply,” and in an exception clause only an informed person can use.",
          "In a measure that counts agency activity rather than whether people could act on it.",
          "In the handoff, where every step assumes the next one will make it understandable.",
        ],
      },
      {
        heading: "Costs to look for",
        items: [
          "Learning cost: what somebody has to already know before the process works for them.",
          "Paperwork and proof cost: the real minutes, trips, copies, signatures and calls.",
          "Worry cost: explaining a disability again, being judged, waiting while a service hangs on a decision.",
        ],
      },
      {
        heading: "Who this helps",
        items: [
          "Policy and program staff writing statewide guidance, rules, forms and notices.",
          "Contracts, fiscal, grants and procurement staff deciding what gets required, funded and scored.",
          "Executive and senior leaders choosing where a question like this is asked, and by whom.",
          "Data, quality and communications staff who describe what a process produced.",
        ],
      },
      {
        heading: "If harm already happened",
        items: [
          "Name it plainly in the record, without softening it.",
          "Tell the people affected, in their language, through a channel they receive.",
          "Fix the design, not only the case in front of you.",
          "Set a point to check whether the fix worked, and say so if it did not.",
        ],
      },
      {
        heading: "Related modules",
        items: [
          "Intercultural practice in public disability services",
          "Public power and institutional impact",
          "Bias, assumptions, and accountability",
          "Participation and voice",
          "Choosing a learning focus",
        ],
      },
    ],
  },
  sources: [
    { title: "National Center on Advancing Person-Centered Practices and Systems", href: "https://ncapps.acl.gov/", note: "Federal technical assistance center on person-centered practice at the systems level: policy, financing, workforce and quality, not only individual planning." },
    { title: "Administration for Community Living, Person-Centered Planning", href: "https://acl.gov/programs/consumer-control/person-centered-planning", note: "Federal overview of person-centered planning principles and the systems conditions that make them possible." },
    { title: "LifeCourse Nexus, Charting the LifeCourse", href: "https://www.lifecoursetools.com/", note: "The LifeCourse framework and tools used across Minnesota disability services for planning with people and families." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "Minnesota's policy, training and technical resource on disability access and rights, including accessible communication guidance for public bodies." },
    { title: "Disability Hub MN", href: "https://disabilityhubmn.org/", note: "The statewide free resource network Minnesotans actually reach first; useful for seeing how state decisions read to the public." },
    { title: "Minnesota Framework for Universal Multicultural Instructional Design", href: "https://mncpd.org/wp-content/uploads/2016/12/MN_Framework_for_Universal_Multicultural_Instructional_Design.pdf", note: "The design reference for this curriculum: multiple ways to engage, culturally responsive materials, and accessibility built in rather than added." },
    { title: "U.S. Department of Health and Human Services, National CLAS Standards", href: "https://thinkculturalhealth.hhs.gov/clas/standards", note: "National standards for culturally and linguistically appropriate services, including governance, workforce, communication and accountability." },
    { title: "Plain language guidelines, Digital.gov", href: "https://www.plainlanguage.gov/guidelines/", note: "Federal plain-language guidance for writing public documents people can act on the first time they read them." },
  ],
};

export default pack;
