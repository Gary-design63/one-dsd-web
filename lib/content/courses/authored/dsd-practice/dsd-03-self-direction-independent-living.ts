import type { CoursePack } from "../../source-types";

// DSD Service System curriculum, module 3: Self-direction and independent living.
// Program-authored for staff who plan, authorize, support or review self-directed services and decisions.
const pack: CoursePack = {
  course: {
    id: "dsd-03-self-direction-independent-living",
    indexNumber: 1183,
    seriesLabel: "DSD Service System · Foundations",
    title: "Self-Direction and Independent Living",
    subtitle: "What it means for a person to direct their own supports, where the independent living movement came from and what it asks of a service system, and how to support a decision without taking it over.",
    scope: "For care coordinators, case managers, program and policy staff, support planners, quality staff, and supervisors who set expectations about how much say people have over their own services. Five short lessons you can take in any order. Voluntary and self-directed: no score, no ranking, no completion requirement. Completion here does not count toward required training credits unless management, a director, or leadership expressly approves an exception.",
    treatment: "Five short lessons with Minnesota examples, a sort separating support from substitution, scenarios, flashcards, and a decision-support review you can run on your own practice",
    duration: "50–55 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/dsd-self-direction.jpg",
    coverAlt: "A woman in her twenties who uses a power wheelchair reviews a monthly budget on paper at her own accessible kitchen counter, with a support worker beside her.",
    introTranscript: "Self-direction is easy to endorse and harder to practice, because practicing it means letting a person make a choice you would not have made. This module covers what self-directed services are and what they are not, where the independent living philosophy came from and why it still matters to a state agency, what dignity of risk asks of staff, how supported decision-making differs from deciding for someone, and how to review your own practice for the places where support has quietly become substitution. Nothing here is scored, ranked or collected.",
    kind: "course",
    contentType: "foundation",
    learning: {
      objectives: [
        "Describe what a self-directed service option changes about who decides, who employs and who manages a budget, and what it does not change.",
        "Explain the core commitments of the independent living philosophy and identify one place in a current process that is not consistent with them.",
        "Distinguish dignity of risk from neglect, and describe a response to a risky choice that keeps the person's authority intact.",
        "Explain how supported decision-making differs from substituted decision-making and name the conditions under which each is being used.",
        "Run a decision-support review on your own practice and name one change with an owner and a review point.",
      ],
      evidence: [
        "A sort separating support that keeps authority with the person from support that takes it over.",
        "Five scenario decisions and five knowledge checks with explanations.",
        "A completed decision-support review naming one substitution, one cause and one change.",
      ],
      appliedNextStep: "Find one decision in the last month that you made on behalf of a person who could have made it with support, and work out what support would have been needed.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Change in Minnesota self-directed service options or budget methodology", "Change in Minnesota guardianship or supported decision-making law", "Change in federal person-centered planning requirements", "Feedback from staff or participants that a description no longer matches practice"],
      relatedDoor: "Questions about a specific person's budget, employer role, guardianship status or plan go to the responsible lead agency or program office; this course builds practice, it does not decide a case.",
      toolkitQuestion: "In this decision, who had the final say, and did the process make that person the one it was about?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "dsd-self-direction-1",
        number: 1,
        title: "What self-direction changes",
        summary: "Learn what a self-directed option changes about who decides, who employs and who holds the budget, and what stays the same.",
        minutes: 10,
        learning: {
          objective: "Describe the three things a self-directed service option shifts to the person and name two things it does not shift.",
          takeaways: [
            "Self-direction moves three things toward the person: deciding what supports to buy, choosing and directing the people who provide them, and managing a budget within its rules.",
            "It does not remove eligibility requirements, program rules or accountability for public money; it changes who holds the authority inside them.",
            "The paperwork of self-direction can be heavy enough to defeat its purpose, which makes the support to manage it part of the service.",
          ],
          evidence: "A tabs comparison of agency-directed and self-directed arrangements, a scenario decision and a knowledge check.",
          appliedNextStep: "Find out what share of the people in your area of work use a self-directed option, and what the most common reason is for leaving it.",
        },
        scenario: {
          context: "A woman in her thirties wants to use a self-directed option so she can hire her neighbor, whom she trusts, rather than rotating agency staff. Her coordinator tells her it would be \"a lot of paperwork\" and steers her toward the agency option, which they describe as easier.",
          prompt: "What is the most useful reading?",
          options: [
            { label: "The coordinator is protecting her from an administrative burden she may not have anticipated.", response: "The burden is real and it was not her decision to weigh. Describing an option as too hard, rather than describing what it involves and what support exists to manage it, decides for her." },
            { label: "The coordinator has replaced her choice with their prediction about her capacity; the right move is to lay out what the option requires, what support exists for the employer role, and let her decide.", response: "This keeps the authority where the option puts it. She may still choose the agency route, and it will be her choice made with accurate information rather than a steer.", recommended: true },
            { label: "The coordinator is right that the agency option is easier and should recommend it.", response: "Easier for whom is the question. Rotating unfamiliar staff is not easy for a person who wants continuity, and easier administration is not the goal the service exists for." },
          ],
        },
        transfer: {
          prompt: "How do you describe self-direction when someone asks about it?",
          options: ["Write down the words you actually use when explaining the option", "Check whether they describe what it involves or whether they signal a recommendation", "Find out what support exists locally for the employer role and add it to your description"],
        },
        blocks: [
          { type: "text", heading: "Three shifts, and what stays put", body: "<p>A self-directed service option is not a different set of services. It is the same funding, with three things moved toward the person. First, what to buy: within the plan and the rules, the person decides which supports and goods meet their needs. Second, who provides it: the person recruits, hires, trains, schedules and, if necessary, dismisses the people who support them, often with help from a fiscal support entity that handles payroll and tax. Third, how the money is spent: the person manages a budget rather than receiving services chosen by an agency.</p><p>What does not move: eligibility, the assessed level of need that sets the budget, the rules about what public money can buy, and the accountability for spending it. Self-direction changes who holds authority inside those constraints. It does not remove them, and a person considering it is entitled to know both halves.</p>" },
          { type: "tabs", heading: "Two arrangements, side by side", tabs: [
            { label: "Agency-directed", body: "<p>A provider agency employs the workers, schedules them, supervises them and bills for services. The person receives supports chosen from the agency's menu and delivered by the staff the agency assigns. Simpler administratively for the person; less say over who arrives and when.</p>" },
            { label: "Self-directed", body: "<p>The person, or a representative they choose, holds the employer role and the budget. They decide what to buy, whom to hire, and how to schedule, with a fiscal entity handling payroll and a support planner helping with the plan. More say; more to manage, and the support to manage it is part of what the option is supposed to provide.</p>" },
            { label: "What people say they value", body: "<p>Continuity of staff, the ability to hire someone who already knows them, control over timing, and being treated as the employer rather than the recipient. What they say they struggle with: recruitment, paperwork, and what happens when a worker is sick and there is no agency to send a replacement.</p>" },
          ] },
          { type: "leaderMove", heading: "Describe, do not steer", control: "You control whether an option is presented as a choice or as a recommendation dressed as a choice. The words used to introduce it decide most of what happens next.", failure: "Do not describe an option by its burden alone. Describe what it involves, what it offers, and what support exists, and let the person weigh it.", next: "Rewrite the two sentences you use to introduce self-direction so they describe rather than advise." },
          { type: "flashcards", heading: "Terms worth keeping straight", cards: [
            { front: "Self-directed services", back: "<p>An arrangement in which the person decides what supports to purchase, chooses and directs the people who provide them, and manages a budget within program rules.</p>" },
            { front: "Representative", back: "<p>A person the participant chooses to help carry or share the employer and budget responsibilities. Chosen by the participant, not appointed for them.</p>" },
            { front: "Fiscal support entity", back: "<p>An organization that handles payroll, taxes and payment on the person's behalf so that being an employer does not require becoming an accountant.</p>" },
            { front: "Support planner", back: "<p>Someone who helps the person develop and manage the plan and budget. Support with the decision, not a substitute for it.</p>" },
          ] },
          { type: "knowledgeCheck", id: "dsd-self-direction-1-check", question: "A person using a self-directed option wants to spend part of their budget on something not on the usual service menu. What is the correct first question?", options: [
            { text: "Whether the agency would have provided it.", correct: false },
            { text: "Whether it meets an assessed need and is allowable under the program's rules, since self-direction changes who decides within the rules rather than removing them.", correct: true },
            { text: "Whether the coordinator thinks it is a good use of money.", correct: false },
          ], feedbackCorrect: "Yes. The rules still apply, and inside them the decision belongs to the person, which means the coordinator's view of whether it is a good idea is not the test.", feedbackIncorrect: "Neither an agency's menu nor a coordinator's opinion is the standard. The program rules are, and inside them the person decides." },
        ],
      },
      {
        id: "dsd-self-direction-2",
        number: 2,
        title: "Where independent living came from",
        summary: "Understand the independent living philosophy as a set of commitments made by disabled people, and what those commitments ask of a public agency.",
        minutes: 10,
        learning: {
          objective: "State the core commitments of the independent living philosophy and identify one process in your work that is not consistent with at least one of them.",
          takeaways: [
            "Independent living was built by disabled people, not for them: the commitments are consumer control, peer support, self-determination, and the right to live in the community with the supports needed to do so.",
            "Independence in this tradition means deciding, not doing everything alone; a person who directs twelve hours of daily support is living independently.",
            "Centers for independent living are run by and for disabled people, and they are a resource a state agency can work alongside rather than a service it administers.",
          ],
          evidence: "A statement, an accordion on the four commitments, a scenario decision and a knowledge check.",
          appliedNextStep: "Find out which center for independent living serves your area and what it offers that the Division does not.",
        },
        scenario: {
          context: "A planning meeting for a man in his fifties with a spinal cord injury includes his sister, a nurse, a coordinator and a provider. He is present. Ninety minutes in, the group has agreed on a residential option and the sister is asking about move-in dates. He has said very little.",
          prompt: "What is the most useful thing to do?",
          options: [
            { label: "Proceed; everyone present has his interests at heart and the plan is sound.", response: "Good intentions are not the standard. A plan he did not visibly shape, agreed by people talking about him in his presence, is the arrangement independent living was created to end." },
            { label: "Stop and ask him, directly and with the room quiet, what he wants, and whether this option is one he chose or one he accepted; then reopen whatever his answer reopens.", response: "This is the minimum the philosophy asks. It may cost the meeting its tidy ending and it protects the thing the meeting is for.", recommended: true },
            { label: "Follow up with him privately afterwards to confirm he agrees.", response: "Better than nothing, and it leaves him to overturn a decision a room full of people already made, which is a much heavier ask than being asked first." },
          ],
        },
        transfer: {
          prompt: "In your last planning meeting, who spoke most, and who was the meeting about?",
          options: ["Estimate the share of the meeting during which the person spoke", "Identify one thing that was decided that they did not visibly choose", "Change one thing about how you open the next meeting so the person speaks first"],
        },
        blocks: [
          { type: "text", heading: "Built by the people it serves", body: "<p>The independent living movement grew out of disabled people organizing to leave institutions and run their own lives, in an era when the professional consensus was that they could not. Its commitments were not proposed by agencies; they were demanded of them. That history matters because it explains the philosophy's central move: the person with the disability is the expert on their own life, and the role of everyone else is to support the decisions they make, not to make them.</p><p>Independence in this tradition has a specific meaning. It is not doing things without help. It is deciding. A person who directs a team of personal care assistants, chooses where to live, and manages their own schedule is living independently. A person who does everything for themselves in a setting someone else chose is not.</p>" },
          { type: "statement", body: "Independence means deciding, not doing everything alone." },
          { type: "accordion", heading: "Four commitments and what they ask of an agency", items: [
            { title: "Consumer control", body: "<p>The person directs their own services and their own life. For an agency, this means the plan is the person's plan, the meeting is the person's meeting, and the goals are stated in the person's words.</p>" },
            { title: "Peer support", body: "<p>People with disabilities are the best source of guidance for other people with disabilities. For an agency, this means knowing where peer support exists, and making it easy to reach, rather than substituting professional advice for it.</p>" },
            { title: "Self-determination", body: "<p>The right to make choices, including ones others would not make, and to learn from them. For an agency, this means that a person's decision is not a problem to be managed.</p>" },
            { title: "Community living", body: "<p>The right to live in the community, with whatever supports that takes. For an agency, this means that the question is never whether a person can live in the community, but what would need to be in place for them to.</p>" },
          ] },
          { type: "leaderMove", heading: "Make the person the first speaker", control: "You control who opens a planning conversation and in whose words the goals are recorded. Both are small and both decide whose meeting it is.", failure: "Do not let professionals set the agenda and then ask the person to agree with it. Agreement obtained that way is compliance, and it does not hold.", next: "At your next planning meeting, ask the person to describe what a good year would look like before anyone else speaks." },
          { type: "knowledgeCheck", id: "dsd-self-direction-2-check", question: "Which of these is the best example of independent living, as the philosophy uses the term?", options: [
            { text: "A person who lives in a group setting and manages all of their own personal care without assistance.", correct: false },
            { text: "A person who directs a team of support workers, chose their own apartment, and decides how their days are spent.", correct: true },
            { text: "A person whose family provides all of their support so that no services are needed.", correct: false },
          ], feedbackCorrect: "Yes. The test is who decides, not how much help is used.", feedbackIncorrect: "Independence in this tradition is about authority over one's own life. Doing without help, or relying on family instead of services, does not answer that question." },
        ],
      },
      {
        id: "dsd-self-direction-3",
        number: 3,
        title: "Dignity of risk",
        summary: "Learn how to respond to a choice you would not make in a way that keeps the person's authority intact and your obligations met.",
        minutes: 12,
        learning: {
          objective: "Distinguish dignity of risk from neglect, and describe a response to a risky choice that neither overrides the person nor abandons them.",
          takeaways: [
            "Dignity of risk means that the right to make choices includes choices that may not work out, and that protection from all risk is also a form of harm.",
            "The response to a risky choice is to make sure the person has the information, the alternatives and the support to reduce the risk they choose to take, not to remove the choice.",
            "Neglect is failing to provide information, support or a safety net; it is not respecting a decision you disagree with.",
          ],
          evidence: "A sort distinguishing respect for risk from neglect, a scenario decision and a knowledge check.",
          appliedNextStep: "Recall one choice by a person you support that made you uncomfortable, and write down what information and support you offered.",
        },
        scenario: {
          context: "A man in his forties with a developmental disability wants to move out of the group home he has lived in for twenty years and into his own apartment. His provider says he has never cooked, managed money or been alone overnight, and that the move is unsafe.",
          prompt: "What is the most useful response?",
          options: [
            { label: "Agree with the provider; the risks are real and documented.", response: "The risks are real. The conclusion does not follow. He has never done those things because he has lived for twenty years in a setting where he was not permitted to, which is an argument for support, not against the move." },
            { label: "Treat the move as his decision, and turn the provider's list of risks into a list of supports to arrange: skills teaching, a phased transition, remote and in-person check-ins, and a plan for what happens if it does not work.", response: "This is what dignity of risk looks like in practice. The risks are addressed rather than used as a reason to deny the choice, and the plan includes a way back that does not read as failure.", recommended: true },
            { label: "Let him move and let the consequences teach him.", response: "This is the neglect that gets confused with respect. Respecting his decision means putting support around it, not stepping back from it." },
          ],
        },
        transfer: {
          prompt: "What is one risk a person you support has chosen to take, and what did you put around it?",
          options: ["Name the choice and the risk as the person and the team each described them", "List the information and support that was offered, and what was not", "Write down what a way back would look like that does not read as failure"],
        },
        blocks: [
          { type: "text", heading: "The harm of too much protection", body: "<p>Every adult takes risks, and learning from them is how people become capable. People with disabilities have historically been denied this, on the grounds that they might be hurt, and the result has been lives so protected that nothing in them was chosen. Dignity of risk is the name for the principle that this protection is itself a harm, and that the right to make decisions includes the right to make ones that may not work out.</p><p>The principle is easy to state and demanding to practice, because it asks staff to sit with discomfort. The test of practice is not whether you feel comfortable with a person's choice. It is whether they had what they needed to make it, whether the risk was reduced as far as they wanted it reduced, and whether there is a way back that does not punish them for having tried.</p>" },
          { type: "sorting", id: "dsd-self-direction-3-sort", heading: "Dignity of risk or neglect?", categories: ["Dignity of risk", "Neglect"], items: [
            { text: "The person chooses to manage their own medication after being shown a system and offered weekly check-ins.", category: "Dignity of risk" },
            { text: "The person is left to manage their own medication after asking for help and receiving none.", category: "Neglect" },
            { text: "The person chooses to travel alone by bus after practicing the route with a worker and carrying a card with contact numbers.", category: "Dignity of risk" },
            { text: "The person is told to figure out the bus because staff are short that day.", category: "Neglect" },
            { text: "The person declines a recommended service after hearing what it offers and what declining it means.", category: "Dignity of risk" },
            { text: "The person is not told a service exists because staff assume they would not manage it.", category: "Neglect" },
          ] },
          { type: "accordion", heading: "Four questions for any choice that worries you", items: [
            { title: "Does the person have the information?", body: "<p>Not a warning; information. What the risk is, how likely it is, what has happened to others, and what would reduce it. In a form they can use, and with time to think.</p>" },
            { title: "Have the alternatives been offered honestly?", body: "<p>An alternative described as the safe option and the person's choice described as the risky one is a steer, not a menu.</p>" },
            { title: "What support would reduce the risk they choose to take?", body: "<p>Almost every risky choice has a supported version. Finding it is the work; not finding it is where neglect starts.</p>" },
            { title: "What is the way back?", body: "<p>A plan for what happens if it does not work, agreed in advance, that does not read as failure or as proof the person should not have tried.</p>" },
          ] },
          { type: "leaderMove", heading: "Convert the risk list into a support list", control: "You control whether a list of concerns ends a conversation or starts a plan. The same list can do either.", failure: "Do not let a documented risk become a documented reason. A risk is a design input, and a reason is a decision made for the person.", next: "Take the next risk list you see and write a support next to every item on it." },
          { type: "knowledgeCheck", id: "dsd-self-direction-3-check", question: "A person makes a choice the team believes is unsafe. Which of these is the correct test of whether the team has met its obligation?", options: [
            { text: "Whether the team formally documented its concerns.", correct: false },
            { text: "Whether the person had usable information, honest alternatives, support to reduce the risk, and an agreed way back.", correct: true },
            { text: "Whether the team was able to persuade the person to choose differently.", correct: false },
          ], feedbackCorrect: "Yes. Documenting concerns protects the team; persuasion measures the team's influence. Neither is the standard.", feedbackIncorrect: "The obligation is to the person's decision, not to the record or to the outcome the team preferred." },
        ],
      },
      {
        id: "dsd-self-direction-4",
        number: 4,
        title: "Supported decision-making",
        summary: "Learn the difference between helping a person decide and deciding for them, and how to tell which one is happening.",
        minutes: 12,
        learning: {
          objective: "Explain how supported decision-making differs from substituted decision-making and identify signs that support has become substitution.",
          takeaways: [
            "Supported decision-making keeps the decision with the person and adds help: explaining options, weighing consequences, communicating the choice.",
            "Substituted decision-making transfers the decision to someone else, and guardianship is its most formal form; it should be the last resort, not the default.",
            "Support has become substitution when the supporter's preference is what gets recorded, however gently it was reached.",
          ],
          evidence: "A tabs comparison, a quote, a scenario decision and a knowledge check.",
          appliedNextStep: "Ask one person you support who helps them make big decisions, and how; then compare it to what the file says.",
        },
        scenario: {
          context: "A woman in her twenties with an intellectual disability has had her parents as guardians since she turned eighteen. They are now asking whether guardianship should continue. She has a job, manages a phone, and makes most daily decisions. Her parents worry about contracts and medical consent.",
          prompt: "What is the most useful contribution?",
          options: [
            { label: "Recommend continuing guardianship; the parents know her best and their worries are reasonable.", response: "The worries are reasonable and they describe two specific decision areas. Full guardianship removes her authority over everything to address two things." },
            { label: "Describe supported decision-making and the less restrictive options, and suggest a plan naming who supports her in the specific areas her parents worry about, with guardianship considered only if that does not work.", response: "This matches the intervention to the concern. It also keeps her as the decision-maker in the large part of her life where nobody is worried.", recommended: true },
            { label: "Leave it to the family and the court; it is a legal matter.", response: "It is a legal matter and a practice matter, and the family is asking. Silence here tends to default to the most restrictive option because it is the most familiar." },
          ],
        },
        transfer: {
          prompt: "For one person you support, who actually decides, and does the file say so?",
          options: ["Write down who made the last three significant decisions in the person's life", "Compare that to what the file records about decision-making authority", "Identify one decision area where support could replace substitution"],
        },
        blocks: [
          { type: "text", heading: "Two questions that get confused", body: "<p>Who makes the decision and who helps with it are different questions, and a great deal of practice blurs them. Supported decision-making answers the first with the person, always, and the second with whomever the person chooses: a family member, a friend, a worker, a peer. Support can be extensive. It can mean explaining options several times, in several ways, over several weeks. It can mean help communicating the choice to others. What it cannot mean is that the supporter's view becomes the decision.</p><p>Substituted decision-making answers the first question with someone other than the person. Guardianship is its most formal version, and it is sometimes necessary. The problem is not that it exists. The problem is how often it is reached for first, on the basis of a diagnosis rather than a demonstrated inability to decide with support, and how rarely it is revisited once granted.</p>" },
          { type: "tabs", heading: "Support or substitution?", tabs: [
            { label: "What supported decision-making looks like", body: "<p>The person chooses their supporters. Options are explained in ways the person can use, with time. Consequences are talked through. The person's choice is communicated, in their words, to whoever needs to hear it. The record shows the person decided and who helped.</p>" },
            { label: "What substitution looks like", body: "<p>Someone else decides, sometimes after consulting the person. The record shows the substitute's decision. The person may or may not have been present. The reason is often a diagnosis or a general statement about capacity rather than a specific decision the person could not make with support.</p>" },
            { label: "The signs support has slipped", body: "<p>The supporter's preference is what gets recorded. The person is asked to agree rather than to choose. Options the supporter disfavors are not mentioned. The person stops being asked because the answer is assumed.</p>" },
          ] },
          { type: "quote", text: "The question is never whether a person can decide. It is what support it would take for them to." },
          { type: "leaderMove", heading: "Match the intervention to the concern", control: "You control whether a worry about one decision area becomes a proposal about all of them. Naming the specific area is what keeps the response proportionate.", failure: "Do not let a diagnosis stand in for a demonstrated inability to decide with support. The two are routinely confused and the confusion costs people their authority over their own lives.", next: "The next time guardianship comes up, ask which decisions specifically, and what support has been tried for each." },
          { type: "knowledgeCheck", id: "dsd-self-direction-4-check", question: "A worker explains three housing options to a person, recommends one strongly, and the person agrees. The record states the person chose it. What has happened?", options: [
            { text: "Supported decision-making; the person was informed and agreed.", correct: false },
            { text: "The worker's preference has become the decision, and the record has attributed it to the person; support has become substitution.", correct: true },
            { text: "An efficient planning conversation.", correct: false },
          ], feedbackCorrect: "Yes. Agreeing with a strong recommendation is not the same as choosing, and the record now hides the difference.", feedbackIncorrect: "The test is whose preference determined the outcome. When the answer is the worker's, calling it the person's choice is inaccurate." },
        ],
      },
      {
        id: "dsd-self-direction-5",
        number: 5,
        title: "A decision-support review you can run",
        summary: "Review your own practice for the places where support has become substitution, and leave with one change.",
        minutes: 10,
        learning: {
          objective: "Complete a decision-support review on one person's recent decisions and produce one change with a named owner and a review point.",
          takeaways: [
            "Substitution is usually invisible from the inside because it feels like helping.",
            "The review works by comparing who actually decided with what the record says, decision by decision.",
            "One decision area moved from substitution back to support is a better outcome than a complete inventory nobody acts on.",
          ],
          evidence: "A completed review naming one decision, who actually made it, what the record says, and one change.",
          appliedNextStep: "Run the review on one person this month and change one thing about how the next decision is made.",
        },
        scenario: {
          context: "Your review finds that a person's last four significant decisions were all made by their provider, each recorded as the person's choice. The provider, asked about it, says the person always agrees anyway.",
          prompt: "What is the most useful next step?",
          options: [
            { label: "Accept it; the person is content and the provider knows them well.", response: "Always agreeing is what substitution produces over time. It is not evidence that the person is choosing; it is evidence they have stopped expecting to." },
            { label: "Pick the next decision in that person's life and change how it is made: options explained without a recommendation, time to think, the person's words recorded, and a check afterwards on whether it went differently.", response: "This turns the finding into a change, at the scale of one decision, where it can be seen to work. It also gives the provider something to do rather than something to defend.", recommended: true },
            { label: "Report the provider for failing to support the person's choices.", response: "A report may be warranted in some situations. As a first response to a common pattern it creates defensiveness without changing how the next decision is made." },
          ],
        },
        transfer: {
          prompt: "Which person, which decision, and what will be different?",
          options: ["Name one person and their next significant decision", "Write down what will be different about how it is made", "Set a date to check whether the person's answer changed when the process did"],
        },
        blocks: [
          { type: "text", heading: "Why substitution is hard to see", body: "<p>Nobody sets out to decide for people. It happens because helping and deciding look alike from the inside. Explaining an option shades into recommending it. Recommending shades into steering. Steering shades into the person agreeing because that is what the conversation was shaped to produce. Each step feels like support. The result is a record in which the person made choices they were never really offered.</p><p>The review works by refusing to take the record's word for it. For each recent decision, you ask who actually determined the outcome, and you compare the answer to what was written down.</p>" },
          { type: "list", heading: "The five questions", ordered: true, items: ["List the person's last four or five significant decisions: where they live, who supports them, how they spend their days, what they spend on, what services they use.", "For each, who actually determined the outcome? Not who signed, who determined.", "For each, what does the record say? Where the answers to the last two questions differ, that is a finding.", "For one finding, what support would have kept the decision with the person?", "What will be different about the next decision, who will make sure, and when will you look again?"] },
          { type: "artifact", kind: "plain-language-flyer", label: "Review record", title: "Decision-support review", summary: "One page comparing who decided with what the record says, and turning one gap into a change.", fields: [
            { label: "Person and decisions reviewed", value: "Four or five recent significant decisions" },
            { label: "Who actually determined each outcome", value: "The person, a family member, a worker, a provider, a team" },
            { label: "What the record says", value: "Where the record and the answer above differ" },
            { label: "Support that would have kept the decision with the person", value: "For one decision" },
            { label: "One change, one owner, one date", value: "Named person; a date to look again" },
          ], action: "Run it on one person, then change how their next decision is made." },
          { type: "leaderMove", heading: "Start with the next decision, not the last four", control: "You control whether a review becomes an audit of the past or a change to the future. The past cannot be re-decided; the next decision can be made differently.", failure: "Do not let the review become a judgment of the people involved. Substitution is a pattern practice produces, and the useful response is to change the practice.", next: "Pick one upcoming decision and agree with the team, in advance, how it will be made." },
          { type: "flashcards", heading: "What you are looking for", cards: [
            { front: "The steered choice", back: "<p>Options presented with one clearly marked as sensible. The person agrees. The record says they chose.</p>" },
            { front: "The unoffered option", back: "<p>An alternative that existed and was not mentioned because someone assumed the person would not manage it.</p>" },
            { front: "The assumed answer", back: "<p>The person is no longer asked because everyone knows what they will say. Usually a sign they stopped expecting to be asked.</p>" },
            { front: "The general reason", back: "<p>A diagnosis or a statement about capacity used to justify deciding for someone across all areas, rather than a specific decision they could not make with support.</p>" },
          ] },
          { type: "knowledgeCheck", id: "dsd-self-direction-5-check", question: "The most reliable sign that support has become substitution is:", options: [
            { text: "The person has a guardian.", correct: false },
            { text: "The supporter's preference is what determines the outcome, whatever the record says.", correct: true },
            { text: "The person needs a lot of help understanding options.", correct: false },
          ], feedbackCorrect: "Yes. Needing extensive help and having a guardian are both compatible with the decision staying with the person. The supporter's preference deciding is not.", feedbackIncorrect: "Neither the amount of help nor the existence of a guardian settles the question. Who determined the outcome does." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Self-direction and supported decisions",
    subtitle: "A one-page reference for anyone who plans, authorizes or supports a person's choices",
    quote: "The question is never whether a person can decide. It is what support it would take for them to.",
    use: {
      purpose: "Keep the authority over a person's supports and life with the person, and put support around the decisions they make rather than in place of them.",
      remember: ["Self-direction moves what to buy, whom to hire and how to spend toward the person; it does not remove the rules.", "Independence means deciding, not doing everything alone.", "A risk is a design input, not a reason.", "Support has become substitution when the supporter's preference is what gets recorded."],
      doNext: "Run the decision-support review on one person and change how their next decision is made.",
    },
    sections: [
      { heading: "When you explain an option", items: ["Describe what it involves, what it offers and what support exists; do not describe it by its burden.", "Present alternatives without marking one as the sensible choice.", "Give time. A decision made in the meeting is often the meeting's decision."] },
      { heading: "When a choice worries you", items: ["Ask whether the person has usable information, honest alternatives, support to reduce the risk, and a way back.", "Write a support next to every item on the risk list.", "Record the person's decision and the support arranged, not the team's concerns alone."] },
      { heading: "When guardianship comes up", items: ["Ask which decisions specifically, and what support has been tried for each.", "Name the less restrictive options before the most restrictive one.", "If a substitute decision is truly needed, keep it as narrow as the concern and revisit it."] },
    ],
  },
  sources: [
    { title: "Minnesota Department of Human Services, Disability Services Division", href: "https://mn.gov/dhs/people-we-serve/people-with-disabilities/", note: "State program information on services for Minnesotans with disabilities, including self-directed service options." },
    { title: "Minnesota Olmstead Plan", href: "https://mn.gov/dhs/general-public/about-dhs/olmstead/", note: "Minnesota's plan for supporting people with disabilities to live, learn, work and participate in the most integrated setting, including commitments on person-centered planning and self-determination." },
    { title: "Medicaid home and community-based services, Centers for Medicare and Medicaid Services", href: "https://www.medicaid.gov/medicaid/home-community-based-services", note: "Federal description of home and community-based services, including self-directed service delivery and person-centered planning requirements." },
    { title: "Administration for Community Living, centers for independent living", href: "https://acl.gov/programs/aging-and-disability-networks/centers-independent-living", note: "Federal description of the independent living program and the consumer-controlled centers it funds." },
    { title: "National Resource Center for Supported Decision-Making", href: "https://supporteddecisionmaking.org/", note: "Resources on supported decision-making as an alternative to guardianship, including state-by-state information." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "State council offering guidance and technical assistance on disability access and policy in Minnesota." },
  ],
};

export default pack;
