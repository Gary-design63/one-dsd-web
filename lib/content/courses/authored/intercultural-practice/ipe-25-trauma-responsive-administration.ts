import type { CoursePack } from "../../source-types";

// Intercultural Practice and Equity · Complex systems · Module 25: Trauma-responsive public administration.
// Program-authored for internal DHS and DSD staff. Voluntary, self-directed, no scores and no completion requirement.
const pack: CoursePack = {
  course: {
    id: "ipe-25-trauma-responsive-administration",
    indexNumber: 1167,
    seriesLabel: "Intercultural Practice and Equity · Complex systems",
    title: "Trauma-Responsive Public Administration",
    subtitle: "Four lessons on what a public process does to the person who meets it: where an ordinary step turns punitive, how complaint routes and listening sessions can repeat the harm they were built to address, and how to revise one step so it keeps what it protects and stops being frightening to receive.",
    scope: "For internal DHS and DSD staff whose decisions reach people through a notice, a form, a deadline, a complaint route, a contract or a public meeting. Policy and program staff will find the deeper material here; quality, compliance and performance staff and data, research and evaluation staff can use this as a starting module; communications, contracting, operations, engagement and administrative colleagues will recognize their own work throughout. Four short lessons you can take in any order and return to. This module is about the design of public processes. It does not ask you to assess, treat, screen for or ask anyone about trauma, and it is not clinical training. Voluntary and self-directed: no score, no ranking, no completion requirement, and nothing you write in a reflection is collected. You are never asked to disclose your own identity, health, history or beliefs. Completion here does not count toward DHS-required training credits unless management, a director, or DHS leadership expressly approves an exception.",
    treatment: "Four short lessons with Minnesota public-administration examples, scenarios, sorting and flashcard practice, private reflection prompts, and a process revision worksheet you can copy into your own work",
    duration: "40–45 minutes",
    author: "One DSD — People, Access and Culture",
    coverImage: "/images/covers/from-noticing-to-shifting.jpg",
    coverAlt: "Hands revise a printed form with a red pen.",
    introTranscript: "Most of the people a public process reaches will never meet the person who designed it. What they meet is an envelope, a deadline, a phone line and a decision. This module is about what those objects do to someone who has already been harmed once by a system like this one, and how a public administrator changes that without ever needing to know who has and who has not. It covers the six commitments a trauma-responsive approach asks of an organization, the five features that make an ordinary step read as a punishment, the three places public administration most often repeats the harm it means to address — complaints, engagement and internal change — and it ends with a process revision you run on one step in your own work. Nothing here is scored, ranked or collected, the reflection prompts are yours alone, and nothing in it asks you to screen, diagnose or ask anyone about their history.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Explain trauma-responsive public administration as a set of design commitments applied to processes rather than to individuals, and distinguish it from clinical care and from asking anyone about their history.",
        "Identify the specific features of a notice, form, deadline or route that make it read as punitive, confusing or impersonal, and name the one doing the most damage in a process you touch.",
        "Apply the same commitments to a complaint route, a community engagement plan and a change announced to staff, naming what each currently asks a person to spend and what it returns.",
        "Distinguish a revision that changes what a step does from one that only explains it or moves the work onto the person affected.",
        "Complete a process revision for one step in your own work, keeping the protection the step carries and ending with a named owner, a date and a signal you can already see.",
      ],
      evidence: [
        "Four worked scenarios drawn from participant correspondence, a renewal packet, a community engagement plan and a quality review of an automatic closure rule, each with a recommended response and the reasoning behind it.",
        "A knowledge check in every lesson with feedback that explains the usable answer.",
        "Sorting practice that identifies which feature a real sentence of notice language is carrying, and that separates genuine design changes from explanations and from burden moved onto the person.",
        "A completed process revision for one step, kept with the project file rather than in a personal folder, with an owner and a review point attached.",
      ],
      appliedNextStep: "Choose one step you administer that people find punitive, confusing or impersonal. Run the five-field process revision with the colleague who takes the phone calls about it, keep whatever the step was protecting, and send the result to the person who owns the step with a date attached.",
    },
    governance: {
      contentOwner: "One DSD — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: [
        "A change in federal guidance on trauma-informed approaches from the Substance Abuse and Mental Health Services Administration, or in the National CLAS Standards",
        "A change in DHS or DSD policy on participant notices, appeal and grievance routes, renewal and closure rules, or language access and accessible communication",
        "Feedback from self-advocates, families, community organizations or staff that a scenario here reads as unrealistic, or that a recommended revision would create a new burden somewhere else",
      ],
      relatedDoor: "Formal decisions about notice language, appeal and grievance procedures, closure and termination rules, published data and official apologies belong to the responsible DHS policy, legal, appeals, data governance and communications offices; this module prepares the revision, it does not make the decision.",
      toolkitQuestion: "What is this step asking a person to survive in order to get what they are entitled to, and what would it cost us to stop asking that without giving up what the step protects?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "ipe-25-1",
        number: 1,
        title: "What trauma-responsive means for an office that never meets the person",
        summary: "A design standard for processes, not a screening question, a diagnosis or a service. It changes what a notice, a deadline and a route do to everyone who receives them.",
        minutes: 10,
        learning: {
          objective: "Explain trauma-responsive public administration as a set of design commitments applied to processes rather than to individuals, and distinguish it from clinical care and from asking anyone about their history.",
          takeaways: [
            "The working assumption is simple and it stops there: some of the people meeting this process have already been harmed by a system like it, and the office will never know which ones. Everything follows from designing as though that is true, not from finding out who.",
            "Six commitments carry the approach: physical and emotional safety; trustworthiness and transparency; support from people with shared experience; collaboration rather than one-way decision; voice, choice and agency; and honest attention to culture, history and structural context.",
            "Every public process carries three costs for the person who meets it: working out what is being asked, doing what is asked, and what it feels like to be treated that way. Offices sometimes measure the second. The third is designed, rarely measured, and often the one that decides whether a person comes back.",
            "Staff in policy, data, contracting, quality and communications are not being asked to become clinicians. Collecting a private history you have no training to interpret and no authority to act on adds risk to the person and gives the office nothing it can use.",
          ],
          evidence: "A knowledge check on what a trauma-responsive approach actually asks of an administrative office, and a scenario decision about a request to make participant correspondence trauma-informed.",
          appliedNextStep: "Take one notice, letter or form your unit sends and read it once as the person receiving it, on a hard day, with nobody there to explain it. Write down the first sentence that would raise your pulse.",
        },
        scenario: {
          context: "A DSD policy unit is asked by leadership to make its participant correspondence trauma-informed. At the first working meeting, someone proposes adding a short optional question to the intake form asking whether the person has experienced trauma, so staff can flag those files and handle them differently.",
          prompt: "What should the unit do with that proposal?",
          options: [
            {
              label: "Add the question. It is brief, it is optional, and it gives staff something they can use to be gentler with the people who need it most.",
              response: "It also asks a person to hand a government office the most private thing about them before they know where the answer goes, in exchange for treatment they should be receiving anyway. The unit cannot interpret the answer, cannot promise what happens to it, and has now made a disclosure the price of being handled decently.",
            },
            {
              label: "Set the screening question aside and change the correspondence itself: what it says will happen, in what order and by when, how to ask a question, what the person can still do, who to reach, and the tone of the whole thing — for everyone, without knowing anything about anyone.",
              response: "This is the work, and it is the only version the unit has the standing and the skill to deliver. A trauma-responsive process is one that does not need to identify who was hurt before, because it is already predictable, plain and answerable for everybody.",
              recommended: true,
            },
            {
              label: "Ask the training office to send policy staff to clinical trauma training first, and pause the correspondence work until they finish.",
              response: "Clinical training belongs to clinical roles and would not change a single sentence in the letter. Meanwhile the paused correspondence keeps producing exactly the effect leadership asked about, and no amount of clinical knowledge repairs a ten-day deadline with no way to reply.",
            },
          ],
        },
        transfer: {
          prompt: "Where in your own work would it be tempting to solve a design problem by asking the person a question instead?",
          options: [
            "Name one form or conversation where your unit collects a sensitive answer it cannot actually act on.",
            "Write what the process would have to do differently if nobody ever answered that question.",
            "Check who sees the answer once it is given, and for how long it stays with the file.",
            "Ask whether the better treatment that answer unlocks could simply become the default for everyone.",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "A design standard, not a service",
            body: "<p>Trauma-responsive public administration starts from a plain assumption and stops there: some of the people who meet this process have already been harmed by a system like it, and the office will never know which ones. That assumption does not call for a screening question, a flag on a file or a clinician. It calls for a process that is predictable, plain, answerable and possible to get out of without a fight, for everyone, by default.</p><p>This matters most in a division where the majority of staff never meet the person their work reaches. A rule written in one office becomes a sentence in a letter, a date on a calendar, a hold on a phone line and, eventually, a closed file. Every one of those is a designed object. Somebody chose the wording, the window, the channel, the default and what happens when nothing comes back. That is where the harm sits, and it is also where the repair sits.</p><p>Every public process carries three costs for the person on the other side of it. There is the cost of working out what is being asked. There is the cost of doing it: the documents, the appointment, the trip, the wait on the phone. And there is the cost of what it feels like to be treated that way, to be suspected, rushed, unanswered or told nothing. Offices measure the second one sometimes. The third is designed just as deliberately, is almost never measured, and is frequently the one that decides whether a person tries again.</p>",
          },
          {
            type: "accordion",
            heading: "Six commitments, translated into public administration",
            items: [
              {
                title: "Safety, physical and emotional",
                body: "<p>In an office context this is rarely about the building. It is about whether meeting the process is predictable: whether a person can tell what will happen, whether the same question gets the same answer twice, whether anyone is going to appear at the door, and whether saying “I do not understand” is safe to say. A process that behaves differently depending on who answers the phone is not a safe process, however polite each person is.</p>",
              },
              {
                title: "Trustworthiness and transparency",
                body: "<p>Say what will happen and then do it. Say what you cannot do. Say who holds the decision, what they are deciding on, and when. When a date slips, write and say so before the person notices. Most distrust of public systems is not a misunderstanding to be corrected with better wording; it is an accurate memory of being told one thing and given another.</p>",
              },
              {
                title: "Support from people with shared experience",
                body: "<p>In direct service this is peer support. In administration it means the people who have been through the process are treated as the ones who know most about it, are paid for that knowledge, and are brought in while the design is still open. It also means routing people to the independent advocacy and ombudsman routes that exist outside your own unit, plainly and early, rather than only when a complaint is already formal.</p>",
              },
              {
                title: "Collaboration rather than one-way decision",
                body: "<p>Ask what the person needs before deciding what they will be offered. Where the rules allow choices — a channel, a format, a time, an order of steps — surface the choices instead of picking one silently. Where the rules allow no choice, say so plainly. Pretending a decision is shared when it is not costs more trust than making the decision openly.</p>",
              },
              {
                title: "Voice, choice and agency",
                body: "<p>Every step should have a way to say “that is not right” or “here is what happened” that reaches somebody before the outcome lands. A route that exists only after a decision is an appeal, not a voice. Choice means real alternatives in format, channel and pace; agency means the person is still the one deciding about their own life, including in ways the office would not choose.</p>",
              },
              {
                title: "Culture, history and structural context",
                body: "<p>The same envelope does not land the same way in every household. History with public institutions, immigration status, language, race, disability, faith and past contact with child protection, corrections or eligibility systems all change what a demand for proof means. This is not a reason to treat people differently on assumption. It is a reason to design so that the least-trusting reasonable reading of your notice is still survivable.</p>",
              },
              {
                title: "Where this sits in the program's theory of change",
                body: "<p>This program uses the intercultural development continuum — Denial, Polarization, Minimization, Acceptance, Adaptation and Integration — as its map of how an organization's practice changes. Trauma-responsive administration is largely a Minimization problem. Minimization is the comfortable belief that treating everyone identically is the same as treating everyone fairly, and it is where a uniform notice, a uniform window and a uniform proof requirement look like neutrality. Acceptance notices that the same envelope lands differently depending on what a household has already lived through. Adaptation changes the envelope. None of this is a label, a score or a record about any individual: the continuum describes practice, not people.</p>",
              },
            ],
          },
          {
            type: "tabs",
            heading: "Three different jobs, often confused",
            tabs: [
              {
                label: "Clinical care",
                body: "<p>Assessment, diagnosis and treatment by licensed clinicians, with consent and a therapeutic relationship. Nothing in this module prepares anyone for that work, and no administrative role should attempt it. If a conversation reaches something a person needs help with, the useful move is a warm route to the right place, not a question you cannot follow.</p>",
              },
              {
                label: "Direct support and provider practice",
                body: "<p>The daily work of people who support someone in their home, their job, their classroom or their community. Minnesota supports that learning separately, including online disability-services provider learning through DirectCourse. That work has its own standards and its own training, and this module is not a substitute for either.</p>",
              },
              {
                label: "Public-administration design",
                body: "<p>What this module is about: the notices, rules, windows, forms, complaint routes, engagement plans, contracts, data requests and reorganizations that DHS and DSD staff design, write, fund and evaluate. You can make every one of these less frightening to meet without ever knowing a single person's history.</p>",
              },
            ],
          },
          {
            type: "flashcards",
            heading: "Keep these apart",
            cards: [
              { front: "Trauma-responsive design", back: "<p>Building a process on the assumption that some of the people meeting it have been harmed by a system before, without needing to know who. The change happens in the design, not in the file.</p>" },
              { front: "A screening question", back: "<p>Asking a person to disclose a private history to an office that cannot interpret it, cannot treat it, and cannot promise where the answer goes. It moves risk onto the person and returns nothing usable.</p>" },
              { front: "Safety, in an administrative process", back: "<p>Predictability. The same question gets the same answer, the next step is stated, nothing arrives without warning, and saying “I do not understand” costs nothing.</p>" },
              { front: "Transparency", back: "<p>Saying what will happen, what will not, who decides, on what, and by when — including when the answer is that you do not know yet and will write again by a stated date.</p>" },
              { front: "Voice, before the outcome", back: "<p>A route to correct a fact or explain a circumstance that reaches somebody before the decision lands. A route that only opens afterward is an appeal, and most people never use one.</p>" },
              { front: "What staff are not asked to do", back: "<p>Screen, diagnose, counsel, or record what somebody has survived. None of that is inside an administrative role, and none of it is required to design a better process.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Change the default, not the person's answer",
            control: "You control the default behavior of what your unit sends: the wording, the window, the channel, the sequence, who is named, and what happens when nobody replies.",
            failure: "Do not build a better experience that a person has to ask for, disclose something to receive, or already know exists. That is the same process with a gate in front of it.",
            next: "Pick one default in your unit's correspondence and change it so the better version is simply what everyone gets.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-25-1-check",
            question: "A unit wants its process to be trauma-responsive. Which step fits what an administrative office can actually do?",
            options: [
              { text: "Add an optional question to the intake form asking whether the person has experienced trauma, so staff can respond differently.", correct: false },
              { text: "Rewrite the process so it states what happens next and by when, names a unit and a direct number, and gives a route to ask for more time — for everyone, without identifying anyone.", correct: true },
              { text: "Ask supervisors to note in the file which participants seem distressed, so colleagues are prepared before the next contact.", correct: false },
              { text: "Wait until policy staff have completed clinical trauma training before changing any of the correspondence.", correct: false },
            ],
            feedbackCorrect: "Yes. The commitments are delivered through the design of the process, which the office controls, rather than through private information about a person, which it cannot interpret and should not hold.",
            feedbackIncorrect: "Ask two questions of each option: does it require knowing something private about a person, and could the office lawfully and competently act on that information if it had it? The workable step needs neither.",
          },
          {
            type: "statement",
            body: "A private reflection, for you alone and never collected: how might my role, my authority and my assumptions be shaping what I have been treating as a neutral process, and who could be helped, burdened, excluded or misunderstood by the way it currently works?",
          },
        ],
      },
      {
        id: "ipe-25-2",
        number: 2,
        title: "Where a process turns punitive",
        summary: "Five features make an ordinary public step feel like a punishment: a threat with no path, silence about what comes next, no way to be heard, proof demanded as suspicion, and having to tell the story again.",
        minutes: 10,
        learning: {
          objective: "Identify the specific features of a notice, form, deadline or route that make it read as punitive, confusing or impersonal, and name the one doing the most damage in a process you touch.",
          takeaways: [
            "A threat with no path is the most common and the most fixable. The consequence is usually accurate and worth stating; the absence of an equally clear route to avoid it is a choice somebody made, often without noticing.",
            "Silence is a design feature, not an accident. Where a process says nothing about what happens next or when, people fill the gap with the worst outcome they have already lived through, and then act on that.",
            "Verification written in the language of fraud prevention tells an honest person they are suspected. The same requirement can be written as what the office needs, why it needs it, and what happens if it is hard to get.",
            "Repetition — retelling the same history to a new person at every step — is the cost people name most often, and it is usually caused by records that do not travel between offices rather than by any rule that requires the retelling.",
            "None of this is about tone. A warm sentence can still contain a threat with no path, and a blunt sentence can contain a date, a route and a name.",
          ],
          evidence: "A sorting exercise that identifies which feature a real sentence of notice language is carrying, and a scenario about a renewal packet whose return rate has dropped.",
          appliedNextStep: "Find the single sentence in one of your unit's letters that you would least like to receive on a hard day, and rewrite it so it carries a path, a date and a person.",
        },
        scenario: {
          context: "A DSD program unit tracks returns on an annual renewal packet and finds that returns have fallen, with the steepest drop in counties where the packet most often has to be read in another language. The packet opens: “Failure to return the enclosed forms by the date below will result in termination of services.” It gives a ten-day window, a general phone line, and no named unit.",
          prompt: "The unit has budget for one change this cycle. Which change does the most?",
          options: [
            {
              label: "Send a second copy of the same packet a week later to every household that has not returned it.",
              response: "A second copy repeats the same opening sentence to the same household on a shorter clock. It may lift returns slightly and it teaches the unit nothing about why the first one failed.",
            },
            {
              label: "Rewrite the opening so it states what is needed, by when, what happens if it is late, and exactly how to get more time or help — with a named unit and a direct number — and extend the window.",
              response: "This takes the threat and gives it a path, replaces silence with a date and a route, and puts a reachable person at the other end. It changes what the first ten seconds of the envelope do, which is where most non-returns are actually decided.",
              recommended: true,
            },
            {
              label: "Add a line at the bottom of the packet offering translation and accommodation on request.",
              response: "Worth doing and not enough on its own. A person who has already read the opening sentence and set the packet down never reaches the bottom line, and “on request” still asks the household to act first, in a language the packet has not used.",
            },
          ],
        },
        transfer: {
          prompt: "Which of the five features is strongest in the process you administer?",
          options: [
            "Read your process's first contact out loud and mark the sentence that carries a threat.",
            "Find the place where the process goes quiet, and write down what a person would reasonably assume there.",
            "Count how many times a person has to tell the same history to reach the end.",
            "Ask the staff who take the phone calls which single sentence generates the most calls.",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Five features, one reasonable decision at a time",
            body: "<p>Processes rarely turn punitive on purpose. They turn punitive one reasonable decision at a time: a consequence added after an audit finding, a window shortened to hit a reporting date, a named contact replaced by a general line during a vacancy, a verification requirement tightened after a bad headline. Each of those decisions made sense in the room where it was taken. The person receiving the result experiences all of them at once, in a single envelope, with no access to any of the rooms.</p><p>Five features do most of the damage. A <strong>threat with no path</strong>: a consequence stated plainly, with no equally plain route to avoid it. <strong>Silence</strong>: nothing about what happens next, when, or who holds it now. <strong>No voice</strong>: no way to correct a fact or explain a circumstance before the outcome lands. <strong>Proof demanded as suspicion</strong>: verification written in the vocabulary of fraud, so an honest person reads an accusation. <strong>Repetition</strong>: telling the same history again at every step, usually because records do not travel between offices rather than because anything requires it.</p><p>It is worth being precise about what is not the problem. The problem is not that public processes have consequences; people can handle a consequence they can see coming and act on. The problem is not bluntness; plain writing is a kindness. The problem is a sentence that tells a person something bad will happen and gives them nothing to do about it.</p>",
          },
          {
            type: "accordion",
            heading: "What each feature looks like in writing",
            items: [
              {
                title: "A threat with no path",
                body: "<p>As written: “Failure to comply will result in termination of services.” As revised: “We need the enclosed form by the date on page one to keep your services running. If you cannot get it to us in time, call the renewal unit at the number on this page and we will give you more time or help you fill it in.” The consequence survives. What changes is that the sentence now hands the person something to do.</p>",
              },
              {
                title: "Silence about what happens next",
                body: "<p>As written: “Your request has been received and is being processed.” As revised: “We have your request. A reviewer will look at it and we will write to you with a decision by the date below. If we need anything else from you, we will call first. If you have not heard from us by that date, call the number on this page.” Silence is where people put their worst previous experience.</p>",
              },
              {
                title: "No voice before the outcome",
                body: "<p>As written: a decision letter with appeal rights on the back. As revised: a step before the decision where a person can correct a fact or explain a circumstance and reach somebody who can still act on it. Appeal rights matter and must stay. They are not a substitute for a voice, because most people will never file an appeal against a government office.</p>",
              },
              {
                title: "Proof demanded as suspicion",
                body: "<p>As written: “You must submit proof of all income for the last ninety days. Incomplete submissions will be referred for review.” As revised: “We need to see your income for the last ninety days so we can work out the right amount. Pay stubs, a benefit letter or a bank statement all work. If some of it is hard to get, call us and we will tell you what else we can accept.” Same requirement, and the honest person is no longer reading an accusation.</p>",
              },
              {
                title: "Repetition of the story",
                body: "<p>As written: an intake, an assessment, a review and an appeal, each starting from a blank page. As revised: the information travels with the file where the rules permit it, each step opens by confirming what is already known rather than asking for it again, and where a retelling is genuinely required, somebody says why. Most repetition is a records problem being carried by the person least able to carry it.</p>",
              },
            ],
          },
          {
            type: "sorting",
            id: "ipe-25-2-sort",
            heading: "Which feature is this sentence carrying?",
            categories: ["Threat with no path", "Silence about what happens next", "Proof demanded as suspicion"],
            items: [
              { text: "“Failure to respond by the date below will result in closure of your request.”", category: "Threat with no path" },
              { text: "“Your request has been received and is being processed.” No date, no next step, no contact.", category: "Silence about what happens next" },
              { text: "“You must submit proof of all income for the last ninety days. Incomplete submissions will be referred for review.”", category: "Proof demanded as suspicion" },
              { text: "“If we do not hear from you, your services will end.” No number, no named unit, no way to ask for more time.", category: "Threat with no path" },
              { text: "“A determination will be made.” No indication of who decides, on what, or when.", category: "Silence about what happens next" },
              { text: "“Any discrepancy between your statement and our records may result in an overpayment determination.”", category: "Proof demanded as suspicion" },
            ],
          },
          {
            type: "quote",
            text: "The letter said my services would end. It did not say who to call, and the number on the back was the main line. I spent four days telling my family it was already over.",
            cite: "Composite participant perspective, illustrative",
          },
          {
            type: "leaderMove",
            heading: "Put the path in the same breath as the threat",
            control: "You control whether a consequence and the route to avoid it appear in the same place — the same sentence, or the one right after it.",
            failure: "Do not put the consequence on the first page and the route on the fourth, in a separate enclosure, or behind a general line that takes forty minutes to answer.",
            next: "Find one letter that ends, closes or denies something, and move the route up so it sits beside the consequence.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-25-2-check",
            question: "A notice reads: “Failure to return the enclosed form by the date below will result in termination of services.” Which rewrite addresses the feature doing the most damage?",
            options: [
              { text: "“We know paperwork can be hard. Please return the enclosed form by the date below or your services will end.”", correct: false },
              { text: "“We need the enclosed form by the date below to keep your services running. If you cannot return it in time, call the renewal unit at the number on this page and we will give you more time or help you complete it.”", correct: true },
              { text: "“Return of the enclosed form is required under program rules. Non-return results in termination of services.”", correct: false },
              { text: "“Please return the enclosed form promptly to avoid an interruption in your services.”", correct: false },
            ],
            feedbackCorrect: "Yes. The consequence is still stated honestly, and it now arrives with a route, a date and somebody reachable. That is the difference a person can act on.",
            feedbackIncorrect: "Look for the route out. Warmth added to a threat with no path leaves the threat exactly where it was, and vagueness replaces one problem with another.",
          },
          {
            type: "statement",
            body: "A private reflection, for you alone and never collected: does this process make sense to someone who does not already know how DHS works, and what might accessibility mean here beyond a legal minimum?",
          },
        ],
      },
      {
        id: "ipe-25-3",
        number: 3,
        title: "Complaints, engagement and the organization itself",
        summary: "The three places public administration most often repeats the harm it meant to address: the complaint route, the listening session, and a reorganization announced to staff.",
        minutes: 11,
        learning: {
          objective: "Apply the commitments to a complaint route, a community engagement plan and a change announced to staff, naming what each one currently asks a person to spend and what it returns.",
          takeaways: [
            "Filing a complaint costs the person who files it: time, the risk of losing something, and the work of putting something painful into words for a stranger. A route that never acknowledges receipt, names a person or says what happened at the end has taken all three and returned nothing.",
            "Engagement that requires people to tell their hardest story in order to be taken seriously is extraction, not participation. Pay for expertise, ask what should change rather than what went wrong, and let people contribute without a disclosure.",
            "The same commitments apply inward. Reorganizations, rule changes and new oversight reach staff through the identical features: a threat with no path, silence, no voice before the decision. Naming that is a design observation, not a morale complaint.",
            "The reflex all three run into is the belief that treating everyone identically is the same as treating everyone fairly. Identical treatment distributes an existing disadvantage evenly and calls the result neutral.",
          ],
          evidence: "A scenario about an engagement plan built on public testimony, a knowledge check on what a complaint acknowledgment has to contain, and practice separating contribution from disclosure.",
          appliedNextStep: "Choose the complaint, feedback or engagement route closest to your work and write down two things: what it currently costs a person to use it, and what it returns to them.",
        },
        scenario: {
          context: "A DSD workgroup planning a service redesign proposes three evening listening sessions. People who use the service would be invited to describe, in an open room with a transcriptionist present and staff seated at the front, the worst thing that has happened to them in the system. There is no payment, no childcare, no interpreter budget yet, and the notes will be published as an appendix with first names attached.",
          prompt: "What should the workgroup change before the invitations go out?",
          options: [
            {
              label: "Keep the format and add a note saying participation is voluntary and people may share as much or as little as they wish.",
              response: "The note is true and changes nothing. The open room, the staff at the front, the transcriptionist and the published appendix all say that a painful story is the admission ticket, and “as little as you wish” leaves each person to negotiate that alone, in public, in front of the agency.",
            },
            {
              label: "Redesign the invitation: pay people for their time and say the rate up front, ask what should change rather than what went wrong, offer written, small-group and one-to-one routes, arrange interpreters and childcare before inviting anyone, say plainly what will be published and let people choose their own attribution, and commit to reporting back what changed.",
              response: "This is the difference between participation and extraction. It keeps the expertise the workgroup actually came for — what should change — and stops charging people their history for the privilege of handing it over.",
              recommended: true,
            },
            {
              label: "Replace the sessions with an online survey so nobody has to speak in public.",
              response: "Safer, and it loses most of what the workgroup needs. A survey written by the people who designed the service asks only the questions they already thought of, reaches the households most comfortable with forms, and still pays nobody.",
            },
          ],
        },
        transfer: {
          prompt: "Where does your work currently ask someone to spend something it does not return?",
          options: [
            "Name one route people use to tell your unit something, and write down what they get back.",
            "Write the acknowledgment your own unit would want to receive if it had filed the complaint.",
            "Find one place where a story is being asked for and a suggestion would do just as well.",
            "Check whether anyone was paid for the expertise your last plan relied on.",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Three places it shows up",
            body: "<p>Complaints, engagement and internal change are where good intentions most often reproduce the exact experience they were meant to address. All three involve inviting somebody to say something difficult to an institution that holds more power than they do. All three are usually designed by people who will never be on the receiving end of them.</p><p>The reflex underneath all three is worth naming directly, because it is sincere and it is where most public administration sits: the belief that treating everyone identically is the same as treating everyone fairly. In the program's map of intercultural development, that is Minimization. Identical treatment takes a disadvantage that already exists — no transportation, no interpreter, a previous experience of being disbelieved by a public office — and distributes the process evenly on top of it. The result looks neutral from inside the office and is not neutral in the household.</p><p>The move out of it is not to guess who has been hurt and treat them differently. It is to design the route so that the person who has the least reason to trust you can still use it. If the route works for them, it works for everybody else too.</p>",
          },
          {
            type: "tabs",
            heading: "The same commitments in three settings",
            tabs: [
              {
                label: "A complaint route",
                body: "<p>What it costs: time, the fear of losing something, and the work of writing a painful thing down for a stranger. What a trauma-responsive route returns: an acknowledgment within a stated number of days that names a person and says what happens next and by when; a way to give the account once; an explicit statement that raising a concern will not affect the person's services; and a closing message that says what was found, what changed, and what did not. If the answer is no, say no clearly and say why. Silence is the one response that confirms every fear the person had about filing.</p>",
              },
              {
                label: "An engagement plan",
                body: "<p>What it costs: travel, childcare, time off, and the emotional work of telling a hard story in front of an agency. What a trauma-responsive plan returns: payment arranged before the invitation goes out, access arranged before anyone is asked to attend, a question that asks what should change rather than what went wrong, several ways to contribute including quiet ones, clarity about what will be published, and a report back to the same people about what their contribution changed. External community members, people with disabilities, families and culturally specific organizations come in here as compensated advisors and co-designers, not as an audience for a plan that is already finished.</p>",
              },
              {
                label: "A change announced to staff",
                body: "<p>What it costs: the same three costs, in the same order. A reorganization, a new reporting requirement or a change in who approves what reaches staff as a threat with no path, a long silence, and a decision with no route to be heard beforehand. The commitments do not change: say what is decided and what is genuinely still open, name who holds it, give a date, make the route to ask a question real, and report back. Nobody should be asked to disclose anything about themselves for this to work.</p>",
              },
            ],
          },
          {
            type: "list",
            heading: "Ways to invite contribution without requiring a disclosure",
            items: [
              "Ask what should change rather than what went wrong. Most people can answer the first question without spending anything.",
              "Offer more than one way in: a written note, a small group, a one-to-one call, a short survey that genuinely takes four minutes.",
              "Pay people for their time and expertise, arrange it before the invitation goes out, and state the rate in the invitation itself.",
              "Arrange interpreters, captioning, accessible materials, childcare and travel before anyone is invited, rather than on request afterward.",
              "Say plainly what will be written down, what will be published, and let each person choose their own level of attribution.",
              "Accept anonymous contributions and weigh them the same as signed ones.",
              "Report back what changed because of what people said — to the same people, in the same formats, whether or not the answer was yes.",
            ],
          },
          {
            type: "leaderMove",
            heading: "Acknowledge before you resolve",
            control: "You control whether a complaint, comment or piece of feedback receives an acknowledgment with a name, a date and a next step, long before anybody decides the outcome.",
            failure: "Do not let silence be the first thing a person receives after taking a risk, and do not let “under review” be the only status anyone sees for months.",
            next: "Write the acknowledgment your unit would want to receive, and make it the standard first reply this month.",
          },
          {
            type: "quote",
            text: "I told it four times to four people. By the fourth I was flat about it, and I could see him deciding I was not really that upset.",
            cite: "Composite participant perspective, illustrative",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-25-3-check",
            question: "A unit is redesigning its complaint route. Which change most directly reduces what filing costs the person?",
            options: [
              { text: "A new online form that captures more detail up front so the file is complete before review begins.", correct: false },
              { text: "An acknowledgment within a stated number of days that names a person and says what happens next and by when, plus a closing message saying what was found and what changed.", correct: true },
              { text: "A monthly summary of complaint volumes and themes for division leadership.", correct: false },
              { text: "A line on the form reminding people that retaliation is prohibited.", correct: false },
            ],
            feedbackCorrect: "Yes. The costs are risk, effort and uncertainty. An acknowledgment with a name and a date, followed by a closing that reports what happened, returns something against all three.",
            feedbackIncorrect: "Ask what the person actually receives. More fields, internal reporting and a policy reminder all leave someone waiting in silence after they have taken a risk.",
          },
          {
            type: "statement",
            body: "A private reflection, for you alone and never collected: whose expertise is missing from this decision, and how could the people most affected have shaped this work earlier? Nothing you write is collected, scored or shown to anyone.",
          },
        ],
      },
      {
        id: "ipe-25-4",
        number: 4,
        title: "Revise one process",
        summary: "Take one step that feels punitive, confusing or impersonal; find what it is actually protecting; and change the design without giving up the protection.",
        minutes: 11,
        learning: {
          objective: "Complete a process revision for one step in your own work, keeping what the step protects and ending with a named owner, a date and a signal you can already see.",
          takeaways: [
            "Most punitive steps are protecting something real: a legal deadline, an audit finding, a limited budget, a duty to verify, a queue that once ran out of control. The revision keeps the protection and changes the delivery.",
            "A real design change alters what the process does by default. An explanation added to the top of an unchanged process is not a change, and “available on request” moves the work onto the person least able to carry it.",
            "The revision is finished when it names an owner, carries a date, and has a way to tell whether it worked that uses signals already in the records — returns, calls, reschedules, time to a decision — rather than asking anyone to describe their distress.",
            "You almost certainly already hold the authority for the first change. Wording, sequence, timing, who is named and what the default is usually sit inside the unit that sends the thing.",
          ],
          evidence: "A completed process revision for one step, a sorting exercise separating genuine design changes from explanations and from burden moved onto the person, and a knowledge check on what makes a revision finished.",
          appliedNextStep: "Run the revision on one step this month with the colleague who takes the phone calls about it, then send it to the person who owns the step with a date attached.",
        },
        scenario: {
          context: "A quality unit reviews a DSD process in which a missed appointment automatically closes a request, and the person must start over from the beginning. The automatic closure exists because a backlog review found requests sitting open for months with no activity. Staff agree the closure is harsh. The backlog finding is real, and nobody wants it back.",
          prompt: "What does a sound revision look like?",
          options: [
            {
              label: "Keep the automatic closure and add a paragraph to the appointment letter explaining why the rule exists and what it protects.",
              response: "The explanation is honest and the outcome is identical. Explaining a design is not revising it, and the person who missed the appointment because of a hospital stay, a shift change or a bus that did not come is closed either way.",
            },
            {
              label: "Remove the automatic closure entirely and manage the backlog by asking staff to follow up more often on open requests.",
              response: "This trades one unowned problem for another. The backlog finding comes back, the follow-up lands on whoever has the least protected time, and the design itself has not changed at all.",
            },
            {
              label: "Keep a closing rule and change what happens before it: a reminder in the person's own channel, one automatic reschedule instead of a closure, a clear route to say what happened, and closure only after that route has been offered and the file records it.",
              response: "The protection survives — files still close and the queue stays managed — and the step stops punishing the circumstance most likely to cause a missed appointment. It is also specific enough to hand to a named owner with a date.",
              recommended: true,
            },
          ],
        },
        transfer: {
          prompt: "What is the one step you will revise, and who owns it?",
          options: [
            "Name the step and the protection it is carrying.",
            "Write the single default you will change.",
            "Name the owner and the date you will ask them.",
            "Decide how you will know it worked, using a signal already in the records.",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Keep the protection, change the delivery",
            body: "<p>The fastest way to lose an argument about a punitive step is to ask for it to be removed. Almost every harsh rule in a public system is protecting something a colleague can name in one sentence: a federal timeline, a finding from a review, a budget that only stretches so far, a duty to verify before paying, a queue that once grew until nobody could see the bottom of it. The person defending the rule is usually right about the risk and wrong about the only way to manage it.</p><p>So the revision separates two questions that normally arrive fused together. What is this step protecting? And is the current delivery the only way to protect it? In most cases the protection needs a boundary — files do have to close, money does have to be accounted for, decisions do have to be made by a date — and the punishment is an accident of how that boundary was implemented. You can keep a closing rule and stop closing on somebody's worst week. You can keep a verification duty and stop writing it like an accusation.</p><p>Three things separate a revision from a conversation. It changes what happens by default rather than what is available on request. It has a name attached to it and a date by which the change is in the mail. And it carries a way to tell whether it worked that uses something already being recorded, so nobody has to be interviewed about how frightening the old version was.</p>",
          },
          {
            type: "artifact",
            kind: "tagged-document",
            label: "Practical tool",
            title: "A process revision for one punitive step",
            summary: "One page that turns “this step feels harsh” into a change somebody owns by a date.",
            fields: [
              { label: "The step and the moment a person meets it", value: "Automatic closure of an open request after one missed appointment. The person meets it as a letter saying the request is closed and they may reapply, arriving days after an appointment they could not attend." },
              { label: "What the step currently does to the person", value: "Threat with no path, then silence. The appointment letter states the closure consequence with no way to reschedule or explain; the closure letter arrives with no route back other than starting over. People who miss appointments for the most serious reasons — a hospital stay, a caregiving crisis, a shift they could not leave — are the ones most likely to be closed." },
              { label: "What the step is protecting", value: "A real backlog finding: requests sitting open for months with no activity, no way to tell live work from dormant work, and a queue nobody could see the bottom of. Files do have to close, and the review will be repeated." },
              { label: "The revision: default, wording, timing and route", value: "Keep a closing rule. Before it: a reminder in the person's own channel two days ahead; one automatic reschedule on a first missed appointment rather than a closure; a named unit and direct number to say what happened; a rewritten appointment letter that carries the consequence and the route in the same paragraph. Closure only after the reschedule and the route have both been offered, with that recorded in the file." },
              { label: "Owner, review point, and how you will know it worked", value: "Owner: the request-processing lead, with the correspondence lead named for the letter. Reviewed at the agreed point using counts already collected — reschedules used, closures, reapplications after closure, and time from request to decision. No one is asked to describe their distress, and the paid advisors who reviewed the letter are asked what they think of the new version." },
            ],
            action: "Copy the five fields, fill them in for one step you administer, and keep the completed page with the project file rather than in your own notes.",
          },
          {
            type: "sorting",
            id: "ipe-25-4-sort",
            heading: "Real change, explanation, or work moved onto the person?",
            categories: ["Changes what the step does", "Only changes the explanation", "Moves the work onto the person"],
            items: [
              { text: "The renewal window goes from ten days to thirty for everyone.", category: "Changes what the step does" },
              { text: "A paragraph is added to the notice explaining why the deadline exists and what it protects.", category: "Only changes the explanation" },
              { text: "The notice now says that extensions are available on request.", category: "Moves the work onto the person" },
              { text: "A first missed appointment now produces one automatic reschedule instead of a closure.", category: "Changes what the step does" },
              { text: "A sentence is added saying the unit understands this process can be stressful.", category: "Only changes the explanation" },
              { text: "People who need the notice in another format may submit a written request to the unit.", category: "Moves the work onto the person" },
              { text: "The packet is sent in the language already recorded for the household, by default.", category: "Changes what the step does" },
            ],
          },
          {
            type: "list",
            heading: "Revisions that rarely need anyone's permission",
            items: [
              "Move the route out of the consequence and into the same paragraph as the consequence.",
              "Name a unit and a direct number instead of a general line.",
              "Say what happens next and by when, including when the honest answer is “we do not know yet, and we will write again by the date below.”",
              "Replace “failure to” with what is needed and why it is needed.",
              "Send a reminder before a deadline rather than a notice after it.",
              "Make the first reschedule automatic before anything closes.",
              "Reply to every comment a participant sends with what happened to it.",
              "Confirm what is already known at the start of a step instead of asking for it again.",
            ],
          },
          {
            type: "leaderMove",
            heading: "Finish it with a name and a date",
            control: "You control whether a revision leaves the meeting as a decision with an owner and a review point, or as a shared agreement that the current design is unfortunate.",
            failure: "Do not send the whole process upward and wait for permission you already have. Do not measure the change by asking people to describe how distressing the old version was.",
            next: "Assign the first change to a named owner with a date, and pick a signal already in the records — returns, calls, reschedules, time to a decision — to tell you whether it worked.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-25-4-check",
            question: "Which entry describes a finished process revision?",
            options: [
              { text: "“The automatic closure is harsh and we should look at alternatives in the next planning cycle.”", correct: false },
              { text: "“A first missed appointment now produces one automatic reschedule and a reminder in the person's own channel; closure only after that route has been offered and recorded. Owner: the request-processing lead. Reviewed at the agreed point using reschedule and closure counts already collected.”", correct: true },
              { text: "“We will explain the closure rule better in the appointment letter and remind staff to be sympathetic on the phone.”", correct: false },
              { text: "“Automatic closure is removed; staff will follow up on open requests as time allows.”", correct: false },
            ],
            feedbackCorrect: "Yes. It keeps the protection, changes the default rather than the explanation, names an owner, carries a review point, and uses a signal already in the records instead of asking anyone about their distress.",
            feedbackIncorrect: "A finished revision changes what happens by default, keeps what the step was protecting, and carries a name, a date and a way to tell whether it worked.",
          },
          {
            type: "statement",
            body: "A private reflection, for you alone and never collected: if harm or exclusion has already happened through this process, what would accountability and repair actually require of my office — not of the person who was harmed? Write it for yourself. Nothing here is collected, scored or shown to anyone.",
          },
        ],
      },
    ],
  },
  jobAid: {
    title: "Trauma-responsive public administration",
    subtitle: "One page for a notice, a complaint route, an engagement plan, or a step you are about to change",
    quote: "Assume some of the people meeting this process have been hurt by one before. Build it so nobody has to say so.",
    use: {
      purpose: "Keep the commitments and the five features in view while you write a notice, redesign a step, plan an engagement, set a deadline or answer a complaint.",
      remember: [
        "The assumption is that some people meeting this process have been harmed by a system before, and you will never know which ones. Design as though that is true; do not try to find out.",
        "Six commitments: safety through predictability; trustworthiness and transparency; support from people with shared experience; collaboration rather than one-way decision; voice, choice and agency; and honest attention to culture, history and structural context.",
        "Five features turn an ordinary step punitive: a threat with no path, silence about what comes next, no voice before the outcome, proof demanded as suspicion, and having to tell the story again.",
        "Identical treatment is not the same as fair treatment. It distributes an existing disadvantage evenly and calls the result neutral.",
        "Keep the protection, change the delivery. Almost every harsh rule is guarding something real, and almost none of them needs to be delivered the way it currently is.",
        "Nothing in this work requires screening, diagnosing or recording anything about a person's history, and nothing asks a staff member to disclose their own.",
      ],
      doNext: "Run the five-field process revision on one step this month and send it to the person who owns that step with a date attached.",
    },
    sections: [
      {
        heading: "The process revision, in short",
        items: [
          "The step, and the moment a person meets it.",
          "What the step currently does to the person: which of the five features is it carrying?",
          "What the step is protecting, said in one sentence a colleague would recognize.",
          "The revision: what changes by default — wording, timing, sequence, channel, who is named.",
          "Owner, review point, and a signal already in the records that will tell you whether it worked.",
        ],
      },
      {
        heading: "Before a notice or letter goes out",
        items: [
          "Every consequence has a route beside it, in the same paragraph.",
          "A named unit and a direct number, not a general line.",
          "What happens next and by when, even when the answer is that you do not know yet.",
          "Verification written as what you need and why, not as a warning about discrepancies.",
          "A way to correct a fact or explain a circumstance that reaches somebody before the decision lands.",
          "Read it once as the person receiving it, on a hard day, with nobody there to explain it.",
        ],
      },
      {
        heading: "Before an engagement plan goes out",
        items: [
          "Payment arranged and stated in the invitation, not settled afterward.",
          "Interpreters, captioning, accessible materials, childcare and travel arranged before anyone is invited.",
          "Ask what should change rather than what went wrong.",
          "Several ways to contribute, including written, small-group, one-to-one and anonymous.",
          "Say plainly what will be written down and published, and let people choose their own attribution.",
          "Commit to reporting back what changed, to the same people, in the same formats.",
        ],
      },
      {
        heading: "When a complaint arrives",
        items: [
          "Acknowledge within a stated number of days, with a person's name and what happens next.",
          "Say clearly that raising a concern will not affect the person's services.",
          "Take the account once, and do not make the person repeat it at each step.",
          "Close the loop: what was found, what changed, what did not, and why.",
          "Point to the independent advocacy and ombudsman routes that sit outside your own unit, early and plainly.",
        ],
      },
      {
        heading: "Who this helps",
        items: [
          "Policy and program staff, whose drafting decisions set the wording, the windows, the defaults and the consequences before anyone outside the division sees them, and who have the most to gain from going deeper here.",
          "Quality, compliance and performance staff, for whom this is a useful starting module: it separates the protection a rule carries from the way that rule is currently delivered, which is exactly the distinction a review needs.",
          "Data, research and evaluation staff, also starting here: this module is about signals you can already see in the records, and about not asking people to describe their distress in order to measure a change.",
          "Communications, contracting, operations, engagement and administrative colleagues, who hold the letters, the phone lines, the deadlines, the invitations and the agreements where these features usually enter.",
        ],
      },
      {
        heading: "Related modules",
        items: [
          "History, disability and public institutions",
          "Race, disability and unequal outcomes",
          "Immigration, resettlement, and state-system navigation",
          "Power, conflict and repair",
          "Ethical decision-making",
        ],
      },
    ],
  },
  sources: [
    { title: "Substance Abuse and Mental Health Services Administration, Concept of Trauma and Guidance for a Trauma-Informed Approach", href: "https://www.samhsa.gov/resource/dbhis/samhsas-concept-trauma-guidance-trauma-informed-approach", note: "The federal source for the six principles used throughout this module — safety; trustworthiness and transparency; peer support; collaboration and mutuality; empowerment, voice and choice; and cultural, historical and gender issues — together with the guidance that a trauma-informed approach is an organizational and program-design responsibility rather than a clinical service." },
    { title: "Substance Abuse and Mental Health Services Administration, Trauma and violence", href: "https://www.samhsa.gov/mental-health/trauma-violence", note: "Federal overview of trauma, including the distinction between clinical treatment, which belongs to licensed practitioners, and organizational practices that reduce the chance of a system re-creating harm." },
    { title: "U.S. Department of Health and Human Services, National CLAS Standards", href: "https://thinkculturalhealth.hhs.gov/clas", note: "National standards for culturally and linguistically appropriate services, including the standards on governance and leadership, community partnership, language assistance, grievance and conflict-resolution processes, and communicating a program's progress back to the communities it serves." },
    { title: "plainlanguage.gov, Federal plain language guidelines", href: "https://www.plainlanguage.gov/", note: "Federal guidance on writing public documents people can understand and act on: leading with what the reader must do, using everyday words, short sentences and active voice, and organizing a notice around the reader's decision rather than the agency's process." },
    { title: "Minnesota Department of Human Services", href: "https://mn.gov/dhs/", note: "The department's public site. Formal decisions about participant notices, appeal and grievance routes, closure and termination rules, and official communications are made through the responsible DHS policy, legal, appeals and communications offices reached through the department and your own division's directory." },
    { title: "Minnesota Office of Ombudsman for Mental Health and Developmental Disabilities", href: "https://mn.gov/omhdd/", note: "The state office that reviews complaints and concerns about services for people with mental illness, developmental disabilities, substance use disorders and emotional disturbances — an example of the independent route that belongs in a complaint process early and plainly, rather than only after an internal answer." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "Minnesota's advisory council on disability policy, access and rights, including guidance on accessible communication and the state's obligations to people with disabilities." },
    { title: "Minnesota Framework for Universal Multicultural Instructional Design", href: "https://mncpd.org/wp-content/uploads/2016/12/MN_Framework_for_Universal_Multicultural_Instructional_Design.pdf", note: "The design reference for this curriculum: multiple ways to engage, culturally responsive materials, accessible instruction, and learning that does not depend on disclosure or on a single mode of participation." },
  ],
};

export default pack;
