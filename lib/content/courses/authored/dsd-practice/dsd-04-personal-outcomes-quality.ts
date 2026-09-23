import type { CoursePack } from "../../source-types";

// DSD Service System curriculum, module 4: Personal outcomes and quality.
// Program-authored for staff who plan services, review quality, or report on what services achieve.
const pack: CoursePack = {
  course: {
    id: "dsd-04-personal-outcomes-quality",
    indexNumber: 1184,
    seriesLabel: "DSD Service System · Foundations",
    title: "Personal Outcomes and Quality of Life",
    subtitle: "The difference between a service delivered and a life changed, how to ask about outcomes in the person's terms, and what a quality review looks like when it starts from the person rather than the file.",
    scope: "For care coordinators, case managers, quality and compliance staff, program and policy staff, data and evaluation staff, and supervisors who decide what gets counted. Four short lessons you can take in any order. Voluntary and self-directed: no score, no ranking, no completion requirement. Completion here does not count toward required training credits unless management, a director, or leadership expressly approves an exception.",
    treatment: "Four short lessons with Minnesota examples, a sort separating outputs from outcomes, scenarios, an accordion on outcome domains, and an outcome conversation you can hold with one person",
    duration: "45–50 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/dsd-personal-outcomes.jpg",
    coverAlt: "A man in his sixties waters plants on his apartment balcony while a support worker sits inside at the table with a notebook.",
    introTranscript: "A service system is very good at counting what it does: units delivered, plans completed, visits made. It is much less practiced at asking whether any of that changed a person's life in a direction the person wanted. This module is about the second question. It covers the difference between outputs and outcomes, the domains people themselves use to describe a good life, how to ask about outcomes without leading, and how a quality review changes when it starts from the person rather than from the file. Nothing here is scored, ranked or collected.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Distinguish outputs from outcomes and explain why a service system tends to measure the first and report it as the second.",
        "Describe the domains people commonly use to define a good life, and explain why their weighting is individual.",
        "Hold an outcome conversation that lets the person define the outcome, without leading toward the ones the service is set up to produce.",
        "Describe what changes in a quality review that starts from the person, and apply it to one review you take part in.",
      ],
      evidence: [
        "A sort separating outputs from outcomes.",
        "Four scenario decisions and four knowledge checks with explanations.",
        "One outcome conversation held and recorded in the person's words.",
      ],
      appliedNextStep: "Ask one person you support what a good year would look like, in their words, and compare the answer to the goals in their plan.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Change in Minnesota quality measurement or outcome reporting requirements", "Change in federal home and community-based settings or quality requirements", "Change in the Division's planning or review tools", "Feedback from staff or participants that a description no longer matches practice"],
      relatedDoor: "Questions about a specific person's plan, services or a quality concern go to the responsible lead agency, program office or the licensing and quality process; this course builds practice, it does not decide a case.",
      toolkitQuestion: "If this service stopped tomorrow, what in the person's life would be different, and would they say so?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "dsd-personal-outcomes-1",
        number: 1,
        title: "A service delivered and a life changed",
        summary: "Learn why a system built to count what it does drifts toward reporting outputs as outcomes, and how to tell them apart.",
        minutes: 12,
        learning: {
          objective: "Distinguish outputs from outcomes in your own reporting and identify one measure that is currently standing in for the other.",
          takeaways: [
            "An output is something the service did; an outcome is something that changed in the person's life. The first is easy to count and the second is the reason the first exists.",
            "Systems drift toward outputs because outputs are inside their control and outcomes are not, and because a count of visits looks like evidence.",
            "A plan full of completed goals can sit beside a life that has not changed, and the file will not show it.",
          ],
          evidence: "A sort separating outputs from outcomes, a scenario decision and a knowledge check.",
          appliedNextStep: "Take one report you produce and mark each measure as an output or an outcome.",
        },
        scenario: {
          context: "A quality report shows that ninety-six percent of plans were completed on time, all required visits occurred, and every goal was reviewed. A person served by that program, asked how things are going, says nothing has changed in three years and she is not sure what the visits are for.",
          prompt: "What is the most accurate reading?",
          options: [
            { label: "The report is accurate and her view is one person's experience; both can be true.", response: "Both are true, and only one of them is about whether the service worked. The report measures the service's activity. She is describing its effect." },
            { label: "The report is measuring outputs and presenting them as quality; her answer is the outcome, and the gap between them is the finding.", response: "This is the reading that leads somewhere. It does not say the report is wrong; it says the report is answering a different question from the one that matters.", recommended: true },
            { label: "She may not understand what the visits are for, and the coordinator should explain the plan to her again.", response: "If she does not know what three years of visits were for, the plan has not been hers. Explaining it again does not fix that." },
          ],
        },
        transfer: {
          prompt: "Which of your measures is an output standing in for an outcome?",
          options: ["Mark every measure in one report as output or outcome", "Pick one output and write down the outcome it is meant to produce", "Find one way to ask the person whether that outcome occurred"],
        },
        blocks: [
          { type: "text", heading: "Why the drift happens", body: "<p>A service system has to account for what it does, and what it does is countable: assessments completed, plans written, hours delivered, visits made. These counts are honest, and they are also within the system's control, which makes them attractive to report. Outcomes are neither. Whether a person has friends, work they value, a home they chose, and days that feel like theirs depends on many things beyond any one service. So systems report what they can count and, over time, begin to treat it as though it were the thing that mattered.</p><p>The result is a specific kind of blindness. A plan can have every goal reviewed and every visit logged while the person's life stays exactly where it was. Nothing in the file will reveal this, because the file records the service's activity, and the activity occurred.</p>" },
          { type: "sorting", id: "dsd-personal-outcomes-1-sort", heading: "Output or outcome?", categories: ["Output", "Outcome"], items: [
            { text: "Twelve hours of community support delivered this month.", category: "Output" },
            { text: "He has two friends he sees without staff present.", category: "Outcome" },
            { text: "The annual plan was completed on time.", category: "Output" },
            { text: "She chose her apartment and can name why.", category: "Outcome" },
            { text: "All required visits occurred.", category: "Output" },
            { text: "He has held the same job for a year and wants to keep it.", category: "Outcome" },
          ] },
          { type: "leaderMove", heading: "Ask the second question", control: "You control whether a report of activity is accepted as a report of quality. Asking what changed in the person's life, every time, is what keeps the two apart.", failure: "Do not treat a complete file as evidence of a good life. It is evidence of a complete file.", next: "At the next quality review, ask for one outcome in the person's words for every output on the page." },
          { type: "statement", body: "A completed plan is an output. Whether the person's life moved in a direction they wanted is the outcome, and only they can say." },
          { type: "knowledgeCheck", id: "dsd-personal-outcomes-1-check", question: "Which of these is an outcome rather than an output?", options: [
            { text: "The person attended the day program four days a week as planned.", correct: false },
            { text: "The person now has a weekly activity they chose, with people they like, that they would miss if it stopped.", correct: true },
            { text: "The person's goal of community participation was reviewed at the annual meeting.", correct: false },
          ], feedbackCorrect: "Yes. Attendance and review are things the service did. Having something you chose and would miss is a change in your life.", feedbackIncorrect: "Both other answers describe the service's activity. Neither says anything about whether the person's life is different." },
        ],
      },
      {
        id: "dsd-personal-outcomes-2",
        number: 2,
        title: "The domains people use",
        summary: "Learn the areas people themselves use to describe a good life, and why no two people weight them alike.",
        minutes: 10,
        learning: {
          objective: "Name the commonly used quality-of-life domains and explain, with an example, why their weighting must come from the person.",
          takeaways: [
            "People describe a good life in recognizable areas: relationships, home, work and purpose, health, safety, choice, community, and respect. The list is stable; the weighting is not.",
            "A service that pursues the domains it is good at, rather than the ones the person weights highest, can be busy and successful and still miss.",
            "The domains are a prompt for a conversation, not a form to fill in.",
          ],
          evidence: "An accordion on the domains, a scenario decision and a knowledge check.",
          appliedNextStep: "For one person you support, guess which two domains they weight highest, then ask them and see if you were right.",
        },
        scenario: {
          context: "A man in his thirties with a brain injury has a plan built around independent living skills: cooking, budgeting, transit. Progress is steady. Asked what he most wants, he says he wants to be back in the band he played in before the injury, and that nobody has asked him about it.",
          prompt: "What should happen next?",
          options: [
            { label: "Keep the plan as it is; skills come first and the band can follow once he is more independent.", response: "This sequences his life for him. The skills are useful and the thing he weights highest has been absent from three years of planning because it was not on the form." },
            { label: "Reopen the plan around what he weights highest, and ask what would need to be true for him to play again; some of the skills work may serve that, and some may not.", response: "This lets his weighting lead. It does not abandon the skills; it puts them in service of something he wants rather than something the service is set up to produce.", recommended: true },
            { label: "Add a goal about music to the existing plan.", response: "Better than nothing, and adding a line to a plan whose center is elsewhere tends to produce a line that is reviewed and never pursued." },
          ],
        },
        transfer: {
          prompt: "Which domains does your service pursue most, and are they the ones people weight highest?",
          options: ["List the domains your current plans most often contain goals in", "Ask two people which domains they weight highest", "Compare the two lists and note the gap"],
        },
        blocks: [
          { type: "text", heading: "A stable list, an individual weighting", body: "<p>Ask people what makes their life good and the answers group into a small number of areas that recur across cultures, ages and disabilities. Relationships. A home that feels like yours. Something to do that matters. Health. Being safe. Having choices. Being part of something beyond your household. Being treated with respect. The list is not controversial.</p><p>What varies enormously is the weighting. For one person, work is the center and everything else is arranged around it. For another, it is a relationship, or a faith community, or the particular apartment they have lived in for twenty years. A service that pursues all the domains equally, or pursues the ones it happens to be good at delivering, will spend a great deal of effort in areas the person does not weight and little in the one they do.</p>" },
          { type: "accordion", heading: "The domains, and a question for each", items: [
            { title: "Relationships", body: "<p>Who do you see when you want to, and who would you call at two in the morning? People with disabilities often have networks made up largely of paid staff and family, and the question surfaces it.</p>" },
            { title: "Home", body: "<p>Did you choose where you live and who you live with, and does it feel like yours? A setting can be in the community and still not be a home.</p>" },
            { title: "Work and purpose", body: "<p>Is there something you do that matters to you and that other people count on? Paid work is one answer and not the only one.</p>" },
            { title: "Health", body: "<p>Do you feel well, and do you have a say in your care? Health is a domain the person weights, not a set of conditions the service manages.</p>" },
            { title: "Safety", body: "<p>Do you feel safe where you live and with the people around you? Asked directly, and away from anyone the answer might be about.</p>" },
            { title: "Choice", body: "<p>What did you decide this week, and what was decided for you? A person can be in a good setting with almost no say in their day.</p>" },
            { title: "Community", body: "<p>Are you part of anything beyond your home and your services? Membership, not presence.</p>" },
            { title: "Respect", body: "<p>Are you treated as an adult, spoken to rather than about, and asked before things are done to you?</p>" },
          ] },
          { type: "statement", body: "The list of domains is shared. The weighting is the person's, and a plan that does not know the weighting is a plan for someone in general." },
          { type: "leaderMove", heading: "Let the person weight the list", control: "You control whether the domains are used as a conversation or as a form. Used as a form, every domain gets a goal. Used as a conversation, the person tells you which one matters.", failure: "Do not build a plan that is balanced across domains. A balanced plan is usually a plan nobody weighted.", next: "In your next planning conversation, ask which one area, if it changed, would change everything else." },
          { type: "knowledgeCheck", id: "dsd-personal-outcomes-2-check", question: "Why is a plan with goals evenly spread across all quality-of-life domains a warning sign rather than a strength?", options: [
            { text: "Because some domains are more important than others in general.", correct: false },
            { text: "Because people weight the domains very differently, and an even spread usually means the service, not the person, decided what mattered.", correct: true },
            { text: "Because plans should have fewer goals to be manageable.", correct: false },
          ], feedbackCorrect: "Yes. The list is shared; the weighting is individual. An even spread is what you get when nobody asked.", feedbackIncorrect: "The issue is not the number of goals or a general ranking of domains. It is whose weighting the plan reflects." },
        ],
      },
      {
        id: "dsd-personal-outcomes-3",
        number: 3,
        title: "Asking without leading",
        summary: "Learn to hold an outcome conversation in which the person defines the outcome, rather than choosing from the ones the service offers.",
        minutes: 12,
        learning: {
          objective: "Hold an outcome conversation using open questions in the person's terms, and record the answer in the person's words rather than translated into service language.",
          takeaways: [
            "A question that offers options leads; a question that asks what a good year would look like does not.",
            "The answer belongs in the person's words. Translated into service language, it becomes a goal the person may not recognize.",
            "Silence, a shrug or an answer that seems small is often the beginning of the real answer, and the useful move is to wait.",
          ],
          evidence: "A tabs comparison of leading and open questions, a flashcard set on translation, a scenario decision and a knowledge check.",
          appliedNextStep: "Hold one outcome conversation this month and write the answer down in the words the person used.",
        },
        scenario: {
          context: "A coordinator asks a woman in her fifties: \"So for this year, are we thinking more community activities, or working on independent living skills, or maybe some employment goals?\" She picks community activities. The plan records it as her goal.",
          prompt: "What has happened?",
          options: [
            { label: "A reasonable planning conversation; she was given options and chose.", response: "She was given the service's three products and asked which to buy. What she wants may not be on the list, and now the file says she chose." },
            { label: "The question offered the service's categories as the only answers, so whatever she wanted that was not on the list never entered the conversation; the plan now records a choice she did not make.", response: "This is what leading looks like when it is done politely. The repair is to ask a question that has no menu attached.", recommended: true },
            { label: "The coordinator should have offered more options.", response: "More options is a longer menu. The problem is the menu, not its length." },
          ],
        },
        transfer: {
          prompt: "What question will you ask, and how will you record the answer?",
          options: ["Write down one open question with no options in it", "Decide how you will wait through a silence without filling it", "Commit to recording the answer in the person's words before anything is added"],
        },
        blocks: [
          { type: "text", heading: "The menu problem", body: "<p>Most planning questions are menus. They offer the person a choice among the things the service is set up to provide, and they call the result the person's goal. This is efficient and it is not the same as asking. A person whose greatest wish is to see their grandchildren more often, or to stop being afraid of a housemate, or to go back to a job they lost, will not find those on the menu, and will pick something that is.</p><p>An open question is one with no answers built into it. What would a good year look like? What do you wish were different? If one thing changed, what would you want it to be? These are harder to ask, because the answers are not predictable and may not fit a service. That unpredictability is exactly what makes them worth asking.</p>" },
          { type: "tabs", heading: "Leading and open, side by side", tabs: [
            { label: "Leading", body: "<p>\"Are we thinking more community activities or more skills work?\" \"Would you like to keep the same goals as last year?\" \"Do you want to work on your budgeting?\" Each of these has an answer inside it, and the person is being asked to confirm it.</p>" },
            { label: "Open", body: "<p>\"What would a good year look like?\" \"What do you wish were different?\" \"What do you miss?\" \"What would you do more of if you could?\" None of these has a service in it. The answer may take a while.</p>" },
            { label: "What to do with the silence", body: "<p>Many people have not been asked an open question about their life in years, and the first response is often a pause, a shrug, or something small. Wait. Ask a follow-up in the same spirit. The small thing is usually connected to something larger, and the person is finding out whether you mean it.</p>" },
          ] },
          { type: "flashcards", heading: "Translation, and what it loses", cards: [
            { front: "\"I want to see my grandkids more.\"", back: "<p><strong>Translated:</strong> \"Increase community and family engagement.\" <strong>Lost:</strong> the grandchildren, the frequency, and the reason. The person will not recognize this as theirs.</p>" },
            { front: "\"I want to stop being scared of Dan.\"", back: "<p><strong>Translated:</strong> \"Improve housemate relationships.\" <strong>Lost:</strong> the fear, the name, and the possibility that this is a safety issue rather than a relationship goal.</p>" },
            { front: "\"I want my old job back.\"", back: "<p><strong>Translated:</strong> \"Explore employment options.\" <strong>Lost:</strong> the specific job, the loss, and the fact that the person is not exploring; they know what they want.</p>" },
            { front: "\"I want to be left alone in the mornings.\"", back: "<p><strong>Translated:</strong> \"Increase independence in morning routine.\" <strong>Lost:</strong> the request, which is about privacy and control, not skill.</p>" },
          ] },
          { type: "leaderMove", heading: "Record the words, then the goal", control: "You control the order in which things are written down. The person's words first, then whatever the service needs to add, keeps the translation visible.", failure: "Do not let the service's language replace the person's. Once it has, nobody can tell what the person actually said.", next: "In the next plan you write, put the person's words in quotation marks above every goal." },
          { type: "knowledgeCheck", id: "dsd-personal-outcomes-3-check", question: "A person answers an open question with a shrug and says \"I don't know, things are fine.\" What is the most useful response?", options: [
            { text: "Accept the answer and move on to the plan's existing goals.", correct: false },
            { text: "Wait, then ask a follow-up in the same spirit — what they miss, what they would do more of — since a first answer like this is often the start of a real one.", correct: true },
            { text: "Offer a few options to help them think.", correct: false },
          ], feedbackCorrect: "Yes. People who have not been asked in years often test whether the question is real. Staying with it is how you show it is.", feedbackIncorrect: "Moving on or offering options both end the open question. The useful move is to stay in it a little longer." },
        ],
      },
      {
        id: "dsd-personal-outcomes-4",
        number: 4,
        title: "A quality review that starts from the person",
        summary: "See what changes in a quality review when the first source is the person rather than the file, and apply it to one review you take part in.",
        minutes: 12,
        learning: {
          objective: "Describe the difference between a file-first and a person-first quality review and apply the person-first sequence to one review you take part in.",
          takeaways: [
            "A file-first review checks whether required things happened; a person-first review asks whether the person's life moved and then reads the file to find out why or why not.",
            "The sequence matters: read the file first and you will look for confirmation of it; talk to the person first and you will read the file for explanation.",
            "A person-first review ends with one thing to change in the service, not a compliance score.",
          ],
          evidence: "A list of the person-first sequence, an artifact, a scenario decision and a knowledge check.",
          appliedNextStep: "In your next quality review, talk to the person before opening the file and note what you would have missed.",
        },
        scenario: {
          context: "A quality reviewer has forty files to complete this quarter. Talking to each person first would take roughly twice as long. Their supervisor asks whether it is worth it.",
          prompt: "What is the most useful answer?",
          options: [
            { label: "No; the file review meets the requirement and the time is not available.", response: "It meets the requirement. It also measures activity and reports it as quality, which is the problem the review exists to catch." },
            { label: "Do the person-first sequence on a subset — perhaps ten of the forty — and compare what those reviews find with what the file-only reviews find; then decide on the evidence.", response: "This is the practical version. It respects the time constraint, produces a real comparison, and will almost certainly show that the two methods find different things.", recommended: true },
            { label: "Yes, for every file, regardless of time.", response: "Right in principle and unlikely to survive contact with the quarter. A change that cannot be sustained tends to be abandoned entirely." },
          ],
        },
        transfer: {
          prompt: "In which review will you talk to the person first, and what will you compare?",
          options: ["Pick the next review and schedule the conversation before the file is opened", "Write down what the conversation found that the file would not have shown", "Bring one finding to whoever owns the service"],
        },
        blocks: [
          { type: "text", heading: "Sequence changes what you see", body: "<p>A quality review that begins with the file looks for whether required things happened. Was the plan on time, were the visits logged, were the goals reviewed, was the incident reported. These are worth checking and they are checks on the service's activity. A reviewer who opens the file first will, without meaning to, read everything else through it: the person's comments become confirmation of the plan, and anything that does not fit becomes an anomaly.</p><p>A review that begins with the person asks a different first question: has your life moved in a direction you wanted, and if so or if not, what happened? The file is then read for explanation rather than confirmation. The same file, in this sequence, yields different findings, because the reviewer is looking for something else.</p>" },
          { type: "list", heading: "The person-first sequence", ordered: true, items: ["Talk to the person before opening the file. Ask what a good year would have looked like and whether this was one.", "Ask about one domain they weight highly: what changed, what did not, and what got in the way.", "Now read the file. Look for what explains the person's answer: what the service did that helped, what it did that did not, and what it did not do.", "Compare. Where the file's account and the person's account differ, that is a finding.", "Name one thing to change in the service, one owner, and one date to look again."] },
          { type: "artifact", kind: "plain-language-flyer", label: "Review record", title: "Person-first quality review", summary: "One page that starts from the person's answer and reads the file for explanation.", fields: [
            { label: "The person's answer, in their words", value: "What a good year would look like; whether this was one" },
            { label: "The domain they weight most", value: "What changed; what got in the way" },
            { label: "What the file explains", value: "What the service did that helped, did not help, or did not do" },
            { label: "Where the accounts differ", value: "The finding" },
            { label: "One change, one owner, one date", value: "Named person; a date to look again" },
          ], action: "Use it for one review this quarter and compare what it finds with the file-only method." },
          { type: "leaderMove", heading: "Change the first source", control: "You control the order in which a review gathers evidence. Putting the person first is a scheduling decision, and it changes everything the review finds.", failure: "Do not let the review end in a score. A score is a way of saying that nothing in particular needs to change.", next: "Set the next review's first appointment with the person, not the file." },
          { type: "knowledgeCheck", id: "dsd-personal-outcomes-4-check", question: "Why does the order of a quality review — person first or file first — matter, if both sources are consulted either way?", options: [
            { text: "It does not; the same evidence yields the same findings.", correct: false },
            { text: "Because the first source frames the second: read the file first and the person's account is checked against it; talk to the person first and the file is read for explanation.", correct: true },
            { text: "Because talking to the person first is more respectful.", correct: false },
          ], feedbackCorrect: "Yes. The evidence is the same; what the reviewer is looking for is not, and that decides what gets found.", feedbackIncorrect: "Respect is a good reason and not the reason the sequence changes findings. Framing is." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Outcomes, not outputs",
    subtitle: "A one-page reference for anyone who plans, reviews or reports on what services achieve",
    quote: "A completed plan is an output. Whether the person's life moved in a direction they wanted is the outcome, and only they can say.",
    use: {
      purpose: "Keep the difference between what the service did and what changed in the person's life visible in every plan, review and report.",
      remember: ["Outputs are inside the service's control; outcomes are the reason it exists.", "The domains are shared; the weighting belongs to the person.", "A question with options in it is a menu, not a question.", "Talk to the person before you open the file."],
      doNext: "Hold one outcome conversation and record the answer in the person's words.",
    },
    sections: [
      { heading: "When you plan", items: ["Ask what a good year would look like before anything else is discussed.", "Ask which one area, if it changed, would change everything else.", "Put the person's words above every goal.", "Wait through the silence."] },
      { heading: "When you review", items: ["Talk to the person first.", "Read the file for explanation, not confirmation.", "Treat a gap between the two accounts as the finding.", "End with one change and one owner, not a score."] },
      { heading: "When you report", items: ["Mark every measure as an output or an outcome.", "For every output, name the outcome it is meant to produce.", "Include at least one outcome in the person's words."] },
    ],
  },
  sources: [
    { title: "Minnesota Department of Human Services, Disability Services Division", href: "https://mn.gov/dhs/people-we-serve/people-with-disabilities/", note: "State program information on services for Minnesotans with disabilities, including person-centered planning and quality." },
    { title: "Minnesota Olmstead Plan", href: "https://mn.gov/dhs/general-public/about-dhs/olmstead/", note: "Minnesota's plan for supporting people with disabilities to live, learn, work and participate in the most integrated setting, including measurable goals and quality-of-life reporting." },
    { title: "Medicaid home and community-based services, Centers for Medicare and Medicaid Services", href: "https://www.medicaid.gov/medicaid/home-community-based-services", note: "Federal description of home and community-based services, including person-centered planning and quality requirements." },
    { title: "National Quality Forum, home and community-based services quality", href: "https://www.qualityforum.org/", note: "Public work on measuring the quality of home and community-based services, including domains of person-defined quality of life." },
    { title: "Administration for Community Living", href: "https://acl.gov/", note: "Federal agency supporting community living for older adults and people with disabilities, including outcome-focused quality work." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "State council offering guidance and technical assistance on disability access and policy in Minnesota." },
  ],
};

export default pack;
