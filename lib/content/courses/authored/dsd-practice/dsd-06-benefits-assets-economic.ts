import type { CoursePack } from "../../source-types";

// DSD Service System curriculum, module 6: Benefits, assets and economic stability.
// Program-authored for staff whose work touches a person's income, savings, coverage or financial decisions.
const pack: CoursePack = {
  course: {
    id: "dsd-06-benefits-assets-economic",
    indexNumber: 1186,
    seriesLabel: "DSD Service System · Foundations",
    title: "Benefits, Assets and Economic Stability",
    subtitle: "How asset limits, benefit rules and the fear of losing coverage shape the financial lives of people with disabilities, and what staff can do so that the system does not keep people poor by design.",
    scope: "For care coordinators, case managers, financial workers, program and policy staff, employment staff, and supervisors whose teams touch a person's income, savings or coverage. Four short lessons you can take in any order. Voluntary and self-directed: no score, no ranking, no completion requirement. Completion here does not count toward required training credits unless management, a director, or leadership expressly approves an exception.",
    treatment: "Four short lessons with Minnesota examples, a sort separating rules from assumptions about rules, scenarios, flashcards on the tools that exist, and a financial-stability conversation you can hold with one person",
    duration: "45–50 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/dsd-benefits-and-assets.jpg",
    coverAlt: "A woman in her forties and a financial worker sit side by side at a county office desk reviewing a printed budget worksheet.",
    introTranscript: "People with disabilities are far more likely to live in poverty than other adults, and part of the reason is built into the rules meant to help them. Asset limits, income cliffs and coverage tied to not working create a situation where saving is penalized and earning is frightening. This module covers how those rules work in general, the tools that exist to work within them, why the fear of losing coverage is rational, and how to hold a conversation about financial stability that leaves a person better informed rather than more anxious. It is not benefits advice; that comes from certified planners, and the module says where to find them. Nothing here is scored, ranked or collected.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Explain how asset limits and income rules can trap a person in poverty, and distinguish the actual rules from staff assumptions about them.",
        "Describe the main tools that let a person save, earn and keep coverage, and know which questions require a certified planner.",
        "Recognize how financial fear affects decisions about work, marriage, housing and saving, and respond without either dismissing it or reinforcing it.",
        "Hold a financial-stability conversation with a person that ends with one accurate next step.",
      ],
      evidence: [
        "A sort separating rules from assumptions about rules.",
        "Four scenario decisions and four knowledge checks with explanations.",
        "One financial-stability conversation held and recorded with a next step.",
      ],
      appliedNextStep: "Find out how a person in your area reaches a certified benefits planner, and whether anyone you support has been told that saving would cost them their benefits.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Change in federal or Minnesota asset limits or income rules", "Change in tax-advantaged savings account rules for people with disabilities", "Change in Minnesota medical assistance programs for working people with disabilities", "Feedback from staff or participants that a description no longer matches practice"],
      relatedDoor: "Questions about a specific person's benefits, savings, earnings or coverage go to a certified benefits planner or the responsible financial worker; this course builds understanding, it does not give individual advice.",
      toolkitQuestion: "What has this person been told they cannot do with money, and by whom, and was it true?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "dsd-benefits-assets-1",
        number: 1,
        title: "Poverty by design",
        summary: "See how asset limits and income cliffs, written to target help, end up penalizing saving and earning.",
        minutes: 12,
        learning: {
          objective: "Explain how asset limits and income cliffs affect the decisions of a person receiving disability benefits, and distinguish the actual rules from the assumptions staff and families make about them.",
          takeaways: [
            "Asset limits in some programs cap what a person can hold in savings at a level that makes an emergency fund impossible, so spending down becomes the rational move.",
            "An income cliff is a point where a small increase in earnings causes a large loss of benefits or coverage, which makes the hours just before the cliff the most expensive a person can work.",
            "Much of what people are told about these rules is out of date or wrong, and the harm from a wrong belief is the same as the harm from a real rule.",
          ],
          evidence: "A sort separating rules from assumptions, a scenario decision and a knowledge check.",
          appliedNextStep: "Ask one person you support what they believe they cannot do with money, and find out from a planner whether it is true.",
        },
        scenario: {
          context: "A man in his twenties receives disability benefits. His grandmother wants to leave him a modest sum. His mother tells the coordinator that he cannot accept it because he would lose everything, and that the family will leave it to his sister instead.",
          prompt: "What is the most useful response?",
          options: [
            { label: "Confirm the mother's understanding; asset limits are real and the inheritance would exceed them.", response: "Asset limits are real, and tools exist precisely so that a gift like this does not have to be lost. Confirming the fear turns a solvable problem into a permanent loss." },
            { label: "Say that asset limits are real and that there are established ways to receive money like this without losing benefits, and connect the family to a certified benefits planner or a lawyer familiar with special needs planning before any decision is made.", response: "This takes the rule seriously and the family's decision seriously. The sum may be small; the principle that he cannot ever receive anything is what needs correcting.", recommended: true },
            { label: "Say it is a family matter and not something the coordinator can advise on.", response: "It is not the coordinator's place to advise on the specifics, and pointing the family toward someone who can is squarely within the role. Silence here lets a wrong belief decide." },
          ],
        },
        transfer: {
          prompt: "What has one person you support been told they cannot do with money, and is it true?",
          options: ["Write down one belief about money rules that a person or family has stated as fact", "Find out from a planner or reliable source whether it is accurate", "If it is not, make sure the person hears the correction from someone qualified"],
        },
        blocks: [
          { type: "text", heading: "Rules written to target, and what they do instead", body: "<p>Asset limits exist so that public benefits go to people with few resources. Income rules exist so that benefits phase out as a person earns. Both are reasonable in intent. In practice, a limit set low enough that a person cannot hold a month's rent in savings does not target help; it makes saving irrational. A person who saves toward a car, a deposit or an emergency finds the savings counted against them, and the sensible response is to spend the money before it is counted. That is not fecklessness. It is what the rule teaches.</p><p>Income cliffs do the same to earning. Where a small increase in wages triggers a large loss of coverage or cash, the hours just before the cliff cost more than they pay. People learn where the cliff is and stop short of it, and the record shows a person who chose not to work more.</p>" },
          { type: "sorting", id: "dsd-benefits-assets-1-sort", heading: "A rule, or an assumption about a rule?", categories: ["Rule", "Assumption"], items: [
            { text: "Some programs count savings above a set limit against eligibility.", category: "Rule" },
            { text: "A person on disability benefits can never have more than a few hundred dollars.", category: "Assumption" },
            { text: "Earnings above certain thresholds affect cash benefits, with the effect depending on the program.", category: "Rule" },
            { text: "Any job means losing health coverage.", category: "Assumption" },
            { text: "Certain accounts and trusts hold money that is not counted toward asset limits.", category: "Rule" },
            { text: "Getting married always ends a person's benefits.", category: "Assumption" },
          ] },
          { type: "leaderMove", heading: "Separate the rule from the story", control: "You control whether a stated belief about money rules is accepted or checked. Most such beliefs arrived years ago from someone who was partly right.", failure: "Do not confirm a fear you have not verified. A fear confirmed by a staff member becomes a fact the family will act on for years.", next: "For the next money belief you hear stated as fact, write it down and check it with a planner." },
          { type: "statement", body: "A wrong belief about a rule does the same damage as the rule. People do not save, do not earn, and do not marry on the strength of things nobody checked." },
          { type: "knowledgeCheck", id: "dsd-benefits-assets-1-check", question: "Why is it inaccurate to describe a person who spends their savings before an eligibility review as irresponsible with money?", options: [
            { text: "It is accurate; they should have saved.", correct: false },
            { text: "Because a rule that counts savings against eligibility makes spending down the rational response, and the behavior is what the rule teaches rather than a character trait.", correct: true },
            { text: "Because it is unkind to describe people that way.", correct: false },
          ], feedbackCorrect: "Yes. The behavior is a correct reading of the incentive. Changing it means changing the incentive or the tools available, not the person.", feedbackIncorrect: "The issue is not kindness. It is that the description locates in the person a behavior the rule produced." },
        ],
      },
      {
        id: "dsd-benefits-assets-2",
        number: 2,
        title: "The tools that exist",
        summary: "Learn the main tools that let a person save, earn and keep coverage, and where the line falls between general knowledge and individual advice.",
        minutes: 12,
        learning: {
          objective: "Name the main tools that let a person with a disability save, earn and keep coverage, describe what each is for in general terms, and state which questions require a certified planner.",
          takeaways: [
            "Tax-advantaged savings accounts for people with disabilities let many people save without the savings being counted against asset limits, within annual and total limits.",
            "Special needs trusts hold money for a person's benefit without counting as their asset, and they require a lawyer to set up.",
            "Work incentives and Minnesota's medical assistance program for employed people with disabilities let many people earn and keep coverage; the specific fit requires a planner.",
          ],
          evidence: "A flashcard set on the tools, an accordion on what requires a planner, a scenario decision and a knowledge check.",
          appliedNextStep: "Find out which people you support have a tax-advantaged disability savings account, and whether the others have been told one exists.",
        },
        scenario: {
          context: "A woman in her thirties with cerebral palsy works part-time and wants to save for a modified vehicle. She has been keeping cash at home because she was told a bank balance would cost her benefits. She has about three thousand dollars in a drawer.",
          prompt: "What is the most useful response?",
          options: [
            { label: "Advise her to open a tax-advantaged disability savings account and deposit the cash.", response: "The account may well be the right tool. Whether she is eligible, how the deposit interacts with her specific benefits, and how the vehicle purchase should be structured are individual questions, and giving the answer directly is advising outside your competence." },
            { label: "Tell her that accounts exist that let people in her situation save without the savings being counted, that a modified vehicle is the kind of thing they are meant for, and connect her to a certified planner to confirm the fit and the steps.", response: "This corrects the belief that keeps her cash in a drawer, names the tool, and puts the individual decision where it belongs.", recommended: true },
            { label: "Suggest she keep doing what she is doing, since it has worked so far.", response: "Cash in a drawer is uninsured, unearning and at risk. The belief that put it there is the thing to correct." },
          ],
        },
        transfer: {
          prompt: "Which tool would most change one person's financial life, and do they know it exists?",
          options: ["Pick one person you support who is saving, earning or afraid to do either", "Identify which tool most likely applies", "Make sure they hear about it from you in general terms and from a planner in specific ones"],
        },
        blocks: [
          { type: "text", heading: "Knowing what exists is the staff role", body: "<p>Staff who are not certified benefits planners should not tell a person what will happen to their benefits if they do a particular thing. That is individual advice, and getting it wrong has real costs. What staff can and should do is know that tools exist, describe them in general terms, correct beliefs that no such tools exist, and make the referral. A person who has never heard of a savings account that does not count against asset limits will never ask a planner about one.</p>" },
          { type: "flashcards", heading: "The main tools, in general terms", cards: [
            { front: "Tax-advantaged disability savings account", back: "<p>A savings account for people whose disability began before a set age, in which savings up to a limit are not counted toward asset limits for most programs. Withdrawals for qualified disability expenses, which are broad, are not taxed. The main answer to the saving problem for many people.</p>" },
            { front: "Special needs trust", back: "<p>A trust that holds money for a person's benefit without the money counting as their asset. Used for inheritances, settlements and gifts. Requires a lawyer to set up; several types exist with different rules.</p>" },
            { front: "Work incentives", back: "<p>Provisions across benefit programs that let a person earn without losing eligibility as fast as base rules imply: earnings disregards, trial work periods, expense deductions and others. Which apply depends on the person.</p>" },
            { front: "Medical assistance for employed people with disabilities", back: "<p>A Minnesota program that lets working people with disabilities keep medical assistance with a premium based on income, at income and asset levels well above the standard program. A central answer to the coverage fear.</p>" },
            { front: "Plan to achieve self-support", back: "<p>A written plan, approved by the benefits agency, that lets a person set aside income or resources toward a specific work goal without those amounts counting against benefits.</p>" },
          ] },
          { type: "accordion", heading: "What you can say, and what needs a planner", items: [
            { title: "You can say", body: "<p>That tools exist. What each is for in general. That many people in similar situations use them. That a planner can confirm the fit. That planning is free. How to reach one.</p>" },
            { title: "A planner should say", body: "<p>Whether this person is eligible for a given tool. How a specific deposit, earning or purchase would affect their specific benefits. What sequence of steps to take. What to report and when. Anything with a number in it.</p>" },
            { title: "A lawyer should say", body: "<p>Anything about trusts, inheritances, settlements or estate planning. Planners will often know who to refer to.</p>" },
          ] },
          { type: "leaderMove", heading: "Make the referral routine", control: "You control whether benefits planning is something a person gets when a crisis forces it or something offered at every financial change: a job, a gift, a move, a marriage.", failure: "Do not wait for the person to ask. People do not ask about tools they have never heard of.", next: "Add a standard question to your planning conversation: has a benefits planner looked at your situation in the last year?" },
          { type: "knowledgeCheck", id: "dsd-benefits-assets-2-check", question: "A person asks a coordinator whether depositing a specific amount into a disability savings account will affect their housing assistance. What should the coordinator do?", options: [
            { text: "Answer from general knowledge that such accounts are not counted.", correct: false },
            { text: "Say that the account is designed so that savings are generally not counted, that the specific interaction with housing assistance is a question for a certified planner, and make the referral.", correct: true },
            { text: "Say it is outside their role and leave it there.", correct: false },
          ], feedbackCorrect: "Yes. The general reassurance is accurate and the specific answer requires someone qualified. The referral is the deliverable.", feedbackIncorrect: "The general statement is safe; the specific one is not. And declining to help at all leaves the person with nothing." },
        ],
      },
      {
        id: "dsd-benefits-assets-3",
        number: 3,
        title: "What fear decides",
        summary: "See how financial fear shapes decisions about work, marriage, housing and saving, and how to respond without dismissing it or reinforcing it.",
        minutes: 10,
        learning: {
          objective: "Recognize decisions that financial fear is making for a person, and respond in a way that takes the fear seriously and gets it checked.",
          takeaways: [
            "Fear of losing benefits decides more than employment: it shapes whether people marry, move in with a partner, accept help from family, or keep a job that is going well.",
            "The fear is rational, and it is often based on rules that have changed or were never as described; the harm is the same either way.",
            "The response is neither reassurance nor confirmation but a route to someone who can give the actual answer, offered before the decision is made.",
          ],
          evidence: "A tabs walk through the decisions fear makes, a quote, a scenario decision and a knowledge check.",
          appliedNextStep: "Think of one decision a person you support has made or avoided because of benefits, and find out whether the belief behind it was accurate.",
        },
        scenario: {
          context: "A man in his forties with a spinal cord injury has been with his partner for eight years. They want to marry. He has heard that marriage would end his benefits and coverage, so they have not. His partner is increasingly hurt by it and the relationship is under strain.",
          prompt: "What is the most useful response?",
          options: [
            { label: "Acknowledge that marriage can affect benefits and respect their decision.", response: "It can, depending on the programs involved. Leaving it there lets an unverified belief keep deciding a question this important to both of them." },
            { label: "Say that marriage affects different benefits differently, that the specific answer for them requires a planner, and connect them to one so the decision is made on facts rather than on something he heard.", response: "This takes the fear seriously, names that it may or may not be right for his situation, and puts the answer within reach. What they decide with the facts is theirs.", recommended: true },
            { label: "Reassure them that it will probably be fine.", response: "It may be fine and it may not, and probably is not good enough for a decision of this kind. Reassurance without facts is a different way of not helping." },
          ],
        },
        transfer: {
          prompt: "What decision is fear making for one person you support?",
          options: ["Name one decision a person has avoided because of what it might do to their benefits", "Find out whether the belief has been checked with a planner", "If not, make the referral before the next time the decision comes up"],
        },
        blocks: [
          { type: "text", heading: "Fear is a decision-maker", body: "<p>The fear of losing benefits is often discussed as an employment issue. It is much broader. People decline to marry because a spouse's income might count. They avoid moving in with a partner, or with family, for the same reason. They refuse help from relatives who could give it. They leave a job that is going well because they have reached the number of hours they believe is safe. They keep cash in drawers. Each decision is a rational response to a rule as they understand it.</p><p>Some of those understandings are accurate. Many are out of date, apply to a different program, or were never right. The staff role is not to know which is which; it is to notice when a belief is deciding something important and to get it checked before the decision is final.</p>" },
          { type: "tabs", heading: "The decisions fear makes", tabs: [
            { label: "Work", body: "<p>Stopping short of a threshold. Turning down a raise. Declining full-time hours in a job that is going well. Leaving a job when it starts to succeed.</p>" },
            { label: "Relationships", body: "<p>Not marrying. Not living with a partner. Keeping a relationship secret from the system. Ending one over what it might cost.</p>" },
            { label: "Family", body: "<p>Refusing gifts, help with rent, or an inheritance. Asking family to leave money to a sibling instead. Living separately from family who would house them.</p>" },
            { label: "Saving", body: "<p>Cash in drawers. Spending down before reviews. Never accumulating a deposit, an emergency fund, or the price of a car.</p>" },
          ] },
          { type: "quote", text: "Nobody chooses to stay poor. People respond to the rules as they understand them, and the understanding is often years old." },
          { type: "leaderMove", heading: "Get it checked before it decides", control: "You control the timing of a referral. A planner consulted before a decision informs it; one consulted afterwards explains what was lost.", failure: "Do not offer reassurance in place of a referral, and do not confirm a fear you have not verified. Both feel like help and neither is.", next: "The next time a person tells you what they cannot do because of benefits, ask when that was last checked." },
          { type: "knowledgeCheck", id: "dsd-benefits-assets-3-check", question: "A person tells you they turned down a promotion because it would put them over the limit. What is the most useful first question?", options: [
            { text: "How much was the raise?", correct: false },
            { text: "When was that limit last checked with a planner, and for which benefit?", correct: true },
            { text: "Would you like to be referred for a different job?", correct: false },
          ], feedbackCorrect: "Yes. The belief may be right for one program and wrong for another, or years out of date. Finding out is the first step.", feedbackIncorrect: "The amount and the alternative both assume the belief is accurate. The question is whether it is." },
        ],
      },
      {
        id: "dsd-benefits-assets-4",
        number: 4,
        title: "A financial-stability conversation you can hold",
        summary: "Hold a conversation about money that leaves the person better informed rather than more anxious, and ends with one accurate next step.",
        minutes: 12,
        learning: {
          objective: "Hold a financial-stability conversation using open questions, identify one belief to check and one tool to explore, and end with a referral or a next step with a date.",
          takeaways: [
            "The conversation asks what the person wants for their financial life before it asks about benefits, so that the rules are discussed in service of a goal rather than as the whole subject.",
            "It surfaces beliefs about what the person cannot do and marks each one to be checked rather than confirmed or dismissed.",
            "It ends with one next step: a planner appointment, a tool to ask about, or a document to gather, with a name and a date.",
          ],
          evidence: "A list of the conversation's sequence, an artifact, a scenario decision and a knowledge check.",
          appliedNextStep: "Hold the conversation with one person this month and make the referral it produces.",
        },
        scenario: {
          context: "You hold the conversation with a woman in her fifties who has been on benefits for twenty years. She says she has never thought about money beyond the monthly check and has no goals for it. She seems uncomfortable and wants to change the subject.",
          prompt: "What is the most useful move?",
          options: [
            { label: "Respect her discomfort and end the conversation.", response: "Discomfort about money is common and is often the residue of twenty years of being told what she cannot do. Ending the conversation confirms that money is not a subject for her." },
            { label: "Ease off the goals question and ask something smaller — whether there is anything she has wanted and put off, or anything she has been told she cannot do — and offer one piece of general information about a tool she may not have heard of.", response: "This lowers the stakes and gives her something new. People who have had no financial goals for twenty years usually have one, and it is usually small and specific.", recommended: true },
            { label: "Explain the tools that exist and refer her to a planner.", response: "Too much, too soon. A referral she did not ask for, about goals she has not named, is likely to be declined." },
          ],
        },
        transfer: {
          prompt: "Who will you hold the conversation with, and what next step will it produce?",
          options: ["Name one person whose financial life is shaped by rules or beliefs about rules", "Hold the conversation using the sequence", "Record one belief to check and one next step with a date"],
        },
        blocks: [
          { type: "text", heading: "Goals first, rules second", body: "<p>Most conversations about benefits start with the rules and end there. The person leaves knowing more about what they cannot do. A conversation that starts with what the person wants for their financial life, however small, puts the rules in their proper place: as constraints to work within on the way to something, rather than as the subject. It also surfaces the beliefs that are shaping the person's decisions, which can then be marked for checking rather than argued about.</p>" },
          { type: "list", heading: "The sequence", ordered: true, items: ["Ask what the person would want for their financial life if the rules were not a concern: a car, a deposit, an emergency fund, a trip, a job with more hours. Wait.", "Ask what they have been told they cannot do, and by whom, and when. Write each one down without confirming or correcting it.", "Offer one piece of general information: a tool that may apply, described in general terms, with the note that a planner confirms the fit.", "Ask what they would want to know from a planner if they met one.", "Agree on one next step with a name and a date: a planner appointment, a document to gather, a question to ask."] },
          { type: "artifact", kind: "plain-language-flyer", label: "Conversation record", title: "Financial-stability conversation", summary: "One page that records what the person wants, what they believe they cannot do, one tool to explore, and one next step.", fields: [
            { label: "What they want", value: "In their words; however small" },
            { label: "Beliefs to check", value: "Each with who said it and when; none confirmed or dismissed" },
            { label: "One tool to explore", value: "Named in general terms; fit to be confirmed by a planner" },
            { label: "Questions for a planner", value: "The person's own" },
            { label: "One next step, one owner, one date", value: "Planner appointment, document, or question" },
          ], action: "Hold the conversation with one person and make the referral it produces." },
          { type: "leaderMove", heading: "Mark beliefs, do not rule on them", control: "You control whether a stated belief becomes an argument or an item to check. Writing it down without a verdict keeps the conversation open and the answer accurate.", failure: "Do not correct a belief from general knowledge. You may be right and the person will remember only that staff contradict each other.", next: "Hold one conversation this month and send every belief it surfaces to a planner." },
          { type: "knowledgeCheck", id: "dsd-benefits-assets-4-check", question: "Why does the conversation ask what the person wants before it discusses any rule?", options: [
            { text: "Because it is polite to ask about goals first.", correct: false },
            { text: "Because rules discussed without a goal teach the person what they cannot do, while rules discussed in service of a goal become constraints to work within.", correct: true },
            { text: "Because most people do not have financial goals and the question is quick.", correct: false },
          ], feedbackCorrect: "Yes. The order changes what the person leaves with: a longer list of prohibitions, or a direction and a way to check what is actually in the way.", feedbackIncorrect: "The reason is not courtesy or speed. It is that the sequence decides whether the rules are the subject or the constraints." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Money, rules and what to say",
    subtitle: "A one-page reference for staff whose work touches a person's income, savings or coverage",
    quote: "A wrong belief about a rule does the same damage as the rule.",
    use: {
      purpose: "Keep the rules from deciding a person's financial life by default, know the tools that exist, and get every belief checked by someone qualified before it decides something important.",
      remember: ["Spending down and stopping short of thresholds are what the rules teach, not character traits.", "Tools exist: disability savings accounts, special needs trusts, work incentives, Minnesota's coverage program for working people with disabilities.", "General information is your job; individual advice is a certified planner's.", "Fear decides work, marriage, family help and saving. Get it checked before the decision."],
      doNext: "Hold one financial-stability conversation and make the referral it produces.",
    },
    sections: [
      { heading: "What you can say", items: ["Tools exist that let many people save, earn and keep coverage.", "Here is what each one is for, in general.", "A certified planner can confirm what applies to you, and it is free.", "Here is how to reach one."] },
      { heading: "What you should not say", items: ["What will happen to this person's benefits if they do a specific thing.", "That a stated belief is right or wrong, unless you have checked it.", "Anything with a number in it about their benefits."] },
      { heading: "When to make the referral", items: ["Before a job start date, a raise, or a change in hours.", "Before a marriage, a move, or a change in household.", "When a gift, inheritance or settlement is possible.", "When a person says they cannot do something because of benefits and it has not been checked in a year."] },
    ],
  },
  sources: [
    { title: "Disability Hub MN", href: "https://disabilityhubmn.org/", note: "Minnesota's free resource for people with disabilities, including benefits planning and questions about work, saving and coverage." },
    { title: "Minnesota Department of Human Services, medical assistance for employed persons with disabilities", href: "https://mn.gov/dhs/people-we-serve/people-with-disabilities/health-care/", note: "State information on health coverage programs for Minnesotans with disabilities, including coverage for people who work." },
    { title: "Social Security Administration, work incentives", href: "https://www.ssa.gov/work/", note: "Federal information on work incentives for people receiving disability benefits, including trial work and expense provisions." },
    { title: "ABLE National Resource Center", href: "https://www.ablenrc.org/", note: "Information on tax-advantaged savings accounts for people with disabilities, including eligibility and how savings are treated." },
    { title: "Minnesota ABLE Plan", href: "https://savewithable.com/mn/home.html", note: "Minnesota's tax-advantaged savings program for eligible people with disabilities." },
    { title: "National Disability Institute", href: "https://www.nationaldisabilityinstitute.org/", note: "Research and resources on the financial lives of people with disabilities, including asset limits and financial stability." },
  ],
};

export default pack;
