import type { CoursePack } from "../../source-types";

// Intercultural Practice and Equity · Complex systems · Module 19: History, disability and public institutions.
// Program-authored for internal DHS and DSD staff. Voluntary, self-directed, no scores and no completion requirement.
const pack: CoursePack = {
  course: {
    id: "ipe-19-history-public-institutions",
    indexNumber: 1161,
    seriesLabel: "Intercultural Practice and Equity · Complex systems",
    title: "History, Disability and Public Institutions",
    subtitle: "Four lessons on what public disability systems were first built to do, how ableism and racial inequity worked together inside them, why distrust is an accurate memory rather than a communications problem, and how to read a current initiative through the history it inherits.",
    scope: "For internal DHS and DSD staff whose decisions carry forward arrangements somebody else designed: policy and program staff; quality, compliance and performance staff; data, research and evaluation staff; executive and senior leaders; and the operations, fiscal, contracting, communications and engagement colleagues who work alongside them. This is a useful starting module for all four of those groups. Four short lessons you can take in any order and return to. Voluntary and self-directed: no score, no ranking, no completion requirement, and nothing you write in a reflection is collected. Completion here does not count toward DHS-required training credits unless management, a director, or DHS leadership expressly approves an exception.",
    treatment: "Four short lessons with Minnesota examples, an era timeline told without dates, scenarios, sorting and flashcard practice, private reflection prompts, and a historical context review you can copy into your own work",
    duration: "40–45 minutes",
    author: "One DSD — People, Access and Culture",
    coverImage: "/images/covers/the-record.jpg",
    coverAlt: "A man reads bound reports at a library table.",
    introTranscript: "Public disability systems in Minnesota did not begin as service systems. They began as custodial systems, built to hold and separate people, and the shift toward supporting a life in the community came later, under sustained pressure from families, self-advocates, litigation and federal law. This module is about what that origin left behind. It looks at the arrangements we inherited and still administer; at how ableism and racial inequity operated inside the same system rather than on separate tracks; at why some communities approach a state program slowly, and what that tells a public administrator; and it ends with a five-question historical context review you run on something you are working on right now. Nothing here is scored, ranked or collected, and the reflection prompts are yours alone.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Describe how institutionalization, segregation and exclusion by public systems shaped the programs the division administers now, and point to one place in a current process where that history is still visible.",
        "Explain how ableism and racial inequity operated together inside the same public systems, and identify one current practice where both could be producing unequal access.",
        "Explain community distrust of public systems as a reasonable response to a documented record, and name what an institution has to do, rather than say, for that to change.",
        "Distinguish a change that alters a design from one that only explains it or moves the work onto the person affected.",
        "Complete a historical context review for one initiative you are working on now, ending in a single design change with an owner and a review point.",
      ],
      evidence: [
        "Four worked scenarios drawn from rule revision, program evaluation, community engagement and a pre-launch review, each with a recommended response and the reasoning behind it.",
        "A knowledge check in every lesson with feedback that explains the usable answer.",
        "Sorting practice that separates documented history from the patterns it leaves behind and the assumptions worth checking, and that separates real design changes from explanations and from burden shifted onto the person.",
        "A completed historical context review for one current initiative, kept with the project file rather than in a personal folder.",
      ],
      appliedNextStep: "Choose one rule, form, threshold or process you are working on now. Run the five-question historical context review with one long-serving colleague and one paid community advisor, and finish it with a single design change that has a name and a date attached.",
    },
    governance: {
      contentOwner: "One DSD — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: [
        "A change in Minnesota's Olmstead Plan direction, or in federal guidance on the integration mandate under the Americans with Disabilities Act",
        "A change in DHS or DSD policy on eligibility, assessment, guardianship practice or the settings in which services may be delivered",
        "Feedback from self-advocates, families or community organizations that the historical account here is incomplete, inaccurate or told in a way that flattens their experience",
      ],
      relatedDoor: "Formal decisions about program rules, eligibility policy, published data, and any official statement about past harm belong to the responsible DHS policy, legal, data governance and communications offices, and anything touching Tribal Nations belongs to the Office of Indian Affairs and the DHS offices that handle tribal matters; this module prepares the review, it does not make the decision.",
      toolkitQuestion: "What is this process still doing that it was designed to do for reasons nobody here would defend now, and who carries the cost of that today?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "ipe-19-1",
        number: 1,
        title: "What the system was built to do",
        summary: "Public disability systems began as custodial systems. The buildings mostly closed; many of the categories, thresholds and defaults written for them are still in service.",
        minutes: 11,
        learning: {
          objective: "Describe how institutionalization, segregation and exclusion by public systems shaped the programs the division administers now, and point to one place in a current process where that history is still visible.",
          takeaways: [
            "Minnesota's public disability system began as a custodial system. Its purpose was to hold and separate people, and the shift toward supporting a life in the community came later, under pressure from families, self-advocates, journalists, lawyers and federal law.",
            "History is carried in structures, not in memory. Rationing, eligibility built on proving deficit, substitute decision-making defaults, congregate settings and wide county-by-county variation are inherited arrangements, and each one was designed to answer a question that may no longer be the question.",
            "“That was a long time ago” is true about events and false about arrangements. Closing a building does not retire the rule, the category or the habit that was written for it.",
            "Knowing the history is operational, not ceremonial. It tells you which parts of a current design are live choices and which are simply leftovers that were never anyone's job to revisit.",
          ],
          evidence: "A scenario about a rule revision that treats history as background, an era-by-era timeline told without dates, an accordion on four inherited arrangements, flashcards, and a knowledge check on what “a long time ago” does and does not cover.",
          appliedNextStep: "Pick one rule, form or threshold you work with. Find out, from a long-serving colleague or from the public record, what problem it was originally written to solve, and whether that problem is the one in front of you now.",
        },
        scenario: {
          context: "A DSD policy team is revising an eligibility form that has been in use, with small edits, for longer than anyone on the team has worked here. A colleague says the history is interesting but not relevant: the institutions closed decades ago, current statute is what governs, and the revision is already behind schedule.",
          prompt: "What is the most useful response?",
          options: [
            {
              label: "Agree. Work from current statute and current practice, finish the revision, and keep the historical material for a communications piece later.",
              response: "Current statute governs what the form may require. It does not tell you why the form asks what it asks. Most long-standing forms carry questions written for a system that rationed access and asked people to document deficit; revising the wording without asking what each question is for preserves that design under new language.",
            },
            {
              label: "Ask what each question on the form was originally written to establish, and which of those things the decision actually turns on now. Keep the questions that carry weight, and remove the ones that only survive because nobody has asked.",
              response: "This is the operational use of history. It is quick, it fits inside the revision you are already doing, and it separates the requirements the rule needs from the leftovers. It also gives you a defensible record of why each remaining question is there.",
              recommended: true,
            },
            {
              label: "Add a short historical background section to the rule preamble so the context is on the record, and leave the form itself as it is.",
              response: "Acknowledgment without design change is the most common way this work stalls. The preamble tells a reader that the agency knows the history; the form still asks the person to prove what they cannot do. People notice the gap between the two, and it costs trust rather than building it.",
            },
          ],
        },
        transfer: {
          prompt: "Which rule, form or threshold in your own work has an origin nobody on the team can explain?",
          options: [
            "Name the one you would have the hardest time justifying to someone outside the agency",
            "Find one colleague or public source that can tell you what it was first written to do",
            "Write down what would change if that original purpose no longer applied",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "A system built to separate, later asked to include",
            body: "<p>It is easy to read the current disability service system as a support system that has not yet finished improving. That is not where it started. Minnesota, like every other state, first built a custodial system: large public institutions for people labeled at the time as feeble-minded, epileptic or insane, run by the state, filled by county officials and courts, and located far from the communities people came from. Placement was often for life. The system was administered by capable public servants who believed they were being humane.</p><p>What followed was not a smooth improvement. Families organized. Disabled people organized and spoke for themselves. Journalists and lawyers made conditions inside institutions public, and federal courts intervened. Congress passed education rights, then Section 504, then the Americans with Disabilities Act. The Supreme Court held in the Olmstead decision that keeping people with disabilities segregated when they could live in the community is discrimination. Federal waiver authority made it possible to pay for services in a person's own home. Minnesota closed its large state institutions for people with developmental disabilities and built a community system in their place, and the state's Olmstead Plan set commitments that are still being worked through.</p><p>That arc matters here for one practical reason. A service system built on top of a custodial one inherits its furniture. The categories, the thresholds, the assumption that access should be rationed, the habit of asking a person to document what they cannot do, the reflex toward substitute decision-making, the tolerance for a congregate setting when nothing else is available: none of these arrived from nowhere. Each was a reasonable answer to a question the system used to ask. The work in front of you is deciding, item by item, whether it is still the question.</p>",
          },
          {
            type: "timeline",
            heading: "Six eras, told without dates",
            events: [
              { year: "The custodial era", title: "Hold and separate", body: "States built large institutions for people with developmental disabilities and mental illness. Counties held the poor-relief role and made placements. Separation from family and community was the design, not a failure of it." },
              { year: "The eugenics era", title: "Law, label and record", body: "Minnesota, like most states, had a law permitting the sterilization of people held in state institutions, and legal categories that authorized commitment and guardianship on the strength of a label. The reasoning was discredited; the record-keeping, the categories and the habit of deciding for people outlasted it." },
              { year: "The exclusion era", title: "Kept out, and called kindness", body: "Public schools were permitted to exclude children considered uneducable. Disabled adults were kept out of ordinary work, housing and public life, and separate provision was widely understood as a generous response rather than a denial." },
              { year: "The rights era", title: "Made public, then made law", body: "Families, self-advocates, journalists and lawyers brought institutional conditions into public view. Education rights, Section 504, the Americans with Disabilities Act and the Olmstead decision followed, each narrowing what a public system may lawfully do." },
              { year: "The community era", title: "Money follows the person, slowly", body: "Federal waiver authority allowed states to pay for services in homes and communities. Minnesota closed its large state institutions for people with developmental disabilities, built home and community-based services, and set commitments through its Olmstead Plan." },
              { year: "The present", title: "The furniture stayed", body: "The buildings are mostly gone. Waiting lists, deficit-based eligibility, guardianship as a default, congregate settings used for want of alternatives, and uneven access by county, by language and by disability type are still here. They are the work." },
            ],
          },
          {
            type: "accordion",
            heading: "Four arrangements we inherited and still administer",
            items: [
              { title: "Rationing, and the waiting list as a normal object", body: "<p>A custodial system had finite beds, so access had to be rationed and the queue was a permanent feature. A community system inherited the queue. Waiting lists are now treated as an ordinary administrative object rather than as a measurable harm with a distribution: who waits longest, in which counties, in which languages, with which disability types. Ask any program for its waiting time and you usually get an average. Ask for the distribution and the conversation changes.</p>" },
              { title: "Eligibility built on proving deficit", body: "<p>When the decision was whether to admit someone to an institution, establishing incapacity was the point of the assessment. Community services need a different question — what does this person want, and what support makes it possible — but many assessments still open by asking a person to document, often annually, what they cannot do. People describe this as having to fail well enough to qualify. It is a design inherited from a different purpose.</p>" },
              { title: "Deciding for people, by default", body: "<p>Commitment and guardianship were the ordinary mechanisms of the old system, and substitute decision-making became the reflex answer whenever a person needed support with a decision. Supported decision-making, person-centered planning and informed choice are the current direction, but the default still reasserts itself in forms, in practice and in the questions staff are trained to ask first.</p>" },
              { title: "Congregate settings and county-by-county variation", body: "<p>Counties administered the old system, so geography always determined what was available. It still does. A person's options depend heavily on which county they live in, which providers operate there, and whether anyone in reach can serve them in their language. A setting chosen because nothing else exists nearby is not a choice, whatever the file records.</p>" },
            ],
          },
          {
            type: "flashcards",
            heading: "Four sentences worth keeping straight",
            cards: [
              { front: "What did the system start as?", back: "<p>A custodial system whose purpose was to hold and separate people, administered by counties and courts, with placement often far from home and often permanent.</p>" },
              { front: "What changed it?", back: "<p>Sustained pressure: families and self-advocates organizing, conditions made public, litigation and federal court oversight, then education rights, Section 504, the Americans with Disabilities Act, the Olmstead decision and federal waiver authority.</p>" },
              { front: "What is still here?", back: "<p>Rationing and queues, deficit-based eligibility, substitute decision-making as a default, congregate settings used for want of alternatives, and access that varies sharply by county and by language.</p>" },
              { front: "Why does this belong in a rule revision?", back: "<p>Because it separates the requirements a decision actually turns on from the leftovers nobody has revisited. That is a faster and more defensible revision, not a slower one.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Ask what the question was for",
            control: "You control whether a long-standing requirement gets carried forward because it is required, or because it has always been there.",
            failure: "Do not treat “this is how the form has always read” as a reason. It is a description of inheritance, and it is the single most common way an obsolete design survives a modernization.",
            next: "In the next revision you touch, write one line beside each requirement saying what decision it informs. Anything with a blank line beside it is a candidate for removal.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-19-1-check",
            question: "A team says: “The institutions closed long before any of us worked here, so their history has nothing to tell us about this rule.” Which response is best supported?",
            options: [
              { text: "Broadly correct. Current statute and current practice are the right scope for a rule revision, and history belongs in public communications.", correct: false },
              { text: "The buildings closed, but many of the categories, thresholds and defaults written for them were carried directly into current rules. History tells you which parts of the design are live requirements and which are leftovers.", correct: true },
              { text: "History matters mainly because communities expect acknowledgment, so the most useful step is a background paragraph in the preamble.", correct: false },
            ],
            feedbackCorrect: "Yes. The useful question is not whether the past was bad; it is which of its arrangements you are still administering, and whether each one still earns its place.",
            feedbackIncorrect: "Separate the events from the arrangements. The events ended. The rationing, the deficit-based assessment and the substitute decision-making defaults did not end with them, and those are the parts a revision can actually reach.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you and recorded nowhere: think of one requirement you administer that you would find hard to justify to a person outside this agency. What would you need to know about where it came from before you could either defend it or change it?",
          },
        ],
      },
      {
        id: "ipe-19-2",
        number: 2,
        title: "Two histories, one system",
        summary: "Ableism and racial inequity were never separate tracks in public administration. Where they met, the effects compounded, and some of that compounding is visible in current program data.",
        minutes: 11,
        learning: {
          objective: "Explain how ableism and racial inequity operated together inside the same public systems, and identify one current practice where both could be producing unequal access.",
          takeaways: [
            "Public systems sorted people on more than one axis at a time. Who was labeled, who was committed, who was believed, who was offered a service and who was offered supervision depended on race, language, income and immigration status as well as on disability.",
            "A label carried consequences that were not medical. It could decide schooling, work, marriage, parenting and where a person lived, and the labels were never evenly distributed across communities.",
            "Intersectionality is operational here, not theoretical. A program that looks at disability alone will report an average that conceals the two or three groups it is failing.",
            "Present-day disparity does not require present-day intent. A rule written for one population and applied uniformly reproduces the old distribution unless somebody checks, and checking is a design task rather than an accusation.",
          ],
          evidence: "A scenario about program access reported as a single statewide average, tabbed views of four questions the old system answered differently for different people, sorting practice separating documented history from the patterns it leaves and the assumptions worth checking, and a knowledge check.",
          appliedNextStep: "Take one measure your program already reports. Ask whether it can be broken out by race, language, county and disability type. If it cannot, find out what would have to change so that it could, and who owns that change.",
        },
        scenario: {
          context: "An evaluation team reports on a DSD program's access rate. The statewide figure has been steady for three reporting periods, and the draft summary concludes that access is stable and the program is performing as intended. A colleague asks whether the figure has been broken out by race, primary language and county.",
          prompt: "What should the team do with that question?",
          options: [
            {
              label: "Note it as a limitation in the methodology section. The statewide figure is the measure the program is accountable for, and smaller breakouts are unreliable.",
              response: "A limitation note preserves the conclusion while admitting it may be wrong. Small-cell reliability is a real constraint and there are established ways to handle it: combine periods, group counties, report ranges. Declining to look is a choice, and it is the choice that keeps an inherited distribution invisible.",
            },
            {
              label: "Break the measure out by race, primary language, county and disability type, treat any unexplained difference as a question about the design rather than about the communities, and ask the people affected what they think is producing it before publishing a conclusion.",
              response: "This is the honest version of the same analysis. A stable average is consistent with a program that works well for most people and barely reaches some. Treating the gap as a design question keeps the attention where the fix is, and asking the people affected usually produces a better explanation than the team would have reached alone.",
              recommended: true,
            },
            {
              label: "Publish the statewide figure as drafted and add a paragraph acknowledging that historical inequity contributes to disparities in access.",
              response: "The paragraph is true and it changes nothing. It also lets a specific, fixable, measurable difference stay unexamined behind a general statement about history. Readers who live that difference will recognize the move.",
            },
          ],
        },
        transfer: {
          prompt: "Where does your own work report an average that could be hiding a distribution?",
          options: [
            "Name one measure you publish or rely on that has never been broken out",
            "Find out whether the underlying data can support a breakout, and who would have to agree",
            "Decide in advance what you would do if the breakout showed a gap, so the answer is not left to the moment",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Two histories that were never separate",
            body: "<p>It is tempting to treat disability history and racial history as parallel lines. In public administration they were the same line. The institution, the school board, the county relief office, the court and the clinic were often the same set of officials applying the same discretion, and that discretion was shaped by race, language, income and immigration status as much as by any clinical judgment.</p><p>The consequences compounded rather than added. A label of incapacity attached to a person who was also poor, also not a native English speaker, or also from a community the agency did not know, produced a different outcome from the same label attached to a person with a family that could argue, a lawyer, and a shared language with the official. Which children were sent away and which were kept home, which parents were believed about their own child, which families got a service and which got a case file, which adults were offered work and which were supervised: these were not decided by diagnosis alone.</p><p>Where this history involves Tribal Nations and Native American communities, this program defers to the Office of Indian Affairs and to the DHS offices that handle tribal matters. That history is theirs to tell and to lead on, and Module 20 in this area is where those responsibilities belong.</p><p>The administrative point is straightforward. If your program measures disability alone, you inherit the old distribution and report it as an average. The compounding is only visible when you look at more than one thing at once, which is what makes this a data and design question rather than a matter of belief.</p>",
          },
          {
            type: "tabs",
            heading: "Four questions the old system answered differently for different people",
            tabs: [
              { label: "Who was labeled", body: "<p>Labels were applied by officials with wide discretion and little review. A child who was quiet in one household and disruptive in another, a family that could not attend a hearing, an assessment conducted through a relative acting as interpreter: each of these tilted the outcome. The distribution of labels followed the distribution of power to object.</p>" },
              { label: "Who was believed", body: "<p>A parent's account of their own child, an adult's account of their own capability, a community's account of what it needed: all of these were weighed differently depending on who was speaking. Being believed was itself unevenly distributed, and it decided which cases got a second look.</p>" },
              { label: "Who got a service and who got supervision", body: "<p>The same presenting situation could produce support in one family and monitoring in another. Support asks what a person wants; supervision asks whether they are complying. Communities that received mostly the second version learned what the system was for, and passed that knowledge on.</p>" },
              { label: "Who could appeal", body: "<p>Appeal rights that exist on paper are used by people who know they exist, can read the notice, can meet the deadline, can take a day off, and expect to be heard. Every one of those is unevenly distributed, which is why an appeals process is a poor substitute for a decision that was right the first time.</p>" },
            ],
          },
          {
            type: "sorting",
            id: "ipe-19-2-sort",
            heading: "Documented history, present-day pattern, or assumption to check?",
            categories: ["Documented historical practice", "Pattern it can leave behind", "Assumption worth checking"],
            items: [
              { text: "State law permitted the sterilization of people held in public institutions, and legal categories authorized commitment and guardianship on the strength of a label.", category: "Documented historical practice" },
              { text: "Public schools were permitted to exclude children considered uneducable, and separate provision was widely described as a kindness.", category: "Documented historical practice" },
              { text: "Federal housing and benefit programs of the last century were written and administered in ways that excluded many Black and immigrant families from what they offered.", category: "Documented historical practice" },
              { text: "An eligibility process that asks a person to document what they cannot do before it will discuss what they want.", category: "Pattern it can leave behind" },
              { text: "Program participation that is high in metropolitan counties and low in counties with few providers and no interpreters.", category: "Pattern it can leave behind" },
              { text: "Guardianship treated as the natural answer whenever a person needs support with a decision.", category: "Pattern it can leave behind" },
              { text: "Fewer applications from a community means there is less need in that community.", category: "Assumption worth checking" },
              { text: "If the rule is applied the same way to everyone, the outcome will be fair.", category: "Assumption worth checking" },
              { text: "A family that misses two appointments has shown that it is not interested.", category: "Assumption worth checking" },
            ],
          },
          {
            type: "accordion",
            heading: "Three places compounding shows up in ordinary administration",
            items: [
              { title: "In the data you publish", body: "<p>A single statewide figure is the most common hiding place. It is not dishonest; it is simply the wrong resolution for the question. Break the measure out by race, primary language, county and disability type, and by the intersections rather than one at a time, and decide in advance what you will do if a gap appears. Where cells are small, combine periods or group geographies rather than dropping the question.</p>" },
              { title: "In discretion", body: "<p>Wherever a rule says “as appropriate”, “where feasible” or “at the worker's discretion”, outcomes will vary with who is applying it and who is in front of them. Discretion is often necessary, but it should be visible: record what it is for, sample how it is being used, and check whether it is being used the same way across communities.</p>" },
              { title: "In distance", body: "<p>Distance is a design variable that looks neutral. Meetings in the metropolitan area, notices in English, business-hours phone lines, buildings a long drive away and forms that require a reliable address all favor the same people repeatedly. Nobody decides to exclude anyone; the arrangement does it quietly, every time.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Look at more than one thing at once",
            control: "You control the resolution of the analysis you commission and the questions you ask before a summary is signed off.",
            failure: "Do not accept a single average as evidence that a program works. An average is consistent with a program that serves most people well and barely reaches others, and that is precisely the pattern history predicts.",
            next: "Before the next report goes out, ask for one measure broken out by race, language, county and disability type, and ask what the team will do if a gap appears.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-19-2-check",
            question: "A program's overall access rate is steady, but when the measure is broken out, one group of counties and one language group sit well below the rest. What does this most likely indicate?",
            options: [
              { text: "A data quality problem. The breakout groups are small, so the differences are probably noise and the statewide figure remains the reliable measure.", correct: false },
              { text: "That the average was concealing a distribution, and the design should be examined where the differences are, together with the people affected.", correct: true },
              { text: "That outreach to those groups should be increased while the program design itself stays as it is.", correct: false },
              { text: "That the program is performing as intended, since demand naturally varies between communities.", correct: false },
            ],
            feedbackCorrect: "Yes. A gap is a question about the design, not a verdict about the community. The people inside the gap usually know more about its cause than the team reporting it.",
            feedbackIncorrect: "Ask what the average is made of. Steady overall performance is fully consistent with a program that reaches most people and barely reaches some, which is what an inherited distribution looks like in current data.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you: think of a program measure you trust. If it were broken out by race, language and county, which result would surprise you, and which would you rather not see? Neither answer goes anywhere but your own notes.",
          },
        ],
      },
      {
        id: "ipe-19-3",
        number: 3,
        title: "Trust is a record, not a feeling",
        summary: "When a community approaches a state program slowly, that is usually accurate memory rather than a communications failure. What earned the distrust, and what changes it.",
        minutes: 11,
        learning: {
          objective: "Explain community distrust of public systems as a reasonable response to a documented record, and name what an institution has to do, rather than say, for that to change.",
          takeaways: [
            "Distrust is information. When engagement is slow, the first question is what this system has done to these people or to people like them, not why they are disengaged.",
            "The record includes removal from families and communities, procedures and research carried out without meaningful consent, promises made in engagement and not kept, and information collected to help someone and later used against them.",
            "Trust responds to repeated, verifiable behavior: keeping small promises, reporting back what changed, correcting harm when it happens, and paying people for their expertise.",
            "Minimization is where this work most often stalls. “That was then”, “we treat everyone the same”, and “I wasn't there” are all true statements that leave the design untouched.",
          ],
          evidence: "A scenario about three listening sessions almost nobody attended, an accordion on four things public institutions did that people remember, tabbed descriptions of the stages this conversation moves through, a composite community perspective, and a knowledge check on what actually changes a relationship.",
          appliedNextStep: "Find one commitment your program made to a community group in the past year. Check whether anyone reported back on what happened to it. If nobody did, do it now, however late, and say plainly that it is late.",
        },
        scenario: {
          context: "A DSD program holds three evening listening sessions in a community where participation in its services is unusually low. Two people attend across all three. The project team's draft conclusion is that interest is low, and the proposed next step is an online survey distributed through the program's mailing list.",
          prompt: "What is the most useful next step?",
          options: [
            {
              label: "Run the online survey. It reaches more people for less effort, and the sessions demonstrated that in-person engagement is not what this community wants.",
              response: "The mailing list contains the people already reached by the program, which is the population whose absence you are trying to explain. The survey will return a confident answer from the wrong sample, and it moves the effort of participating onto people who have already shown that this arrangement does not work for them.",
            },
            {
              label: "Find out what this program, or the offices that came before it, previously asked of this community and what happened afterward. Go through organizations people already use, pay for time and expertise, and open by reporting what happened to the last round of input.",
              response: "This treats low attendance as evidence about the relationship rather than about the community. It also starts where trust is actually rebuilt: with an account of the previous ask. If nothing came of the last one, saying so plainly is more persuasive than any new invitation.",
              recommended: true,
            },
            {
              label: "Hold more sessions, improve the flyer, and add refreshments and a raffle to increase turnout.",
              response: "More invitations to the same arrangement will produce the same result, and a raffle reads as payment for attendance rather than as respect for expertise. The obstacle is not the flyer.",
            },
          ],
        },
        transfer: {
          prompt: "Which community relationship in your own work is quieter than you would expect, and what does your program's record with them actually look like?",
          options: [
            "Find out what was asked of them last time and what they were told afterward",
            "Identify one unkept commitment and the person who could close it out",
            "Name one organization people in that community already use, and ask what going through them would require",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Distrust as accurate memory",
            body: "<p>Public agencies tend to treat distrust as a perception problem, which makes it a communications assignment: better materials, more outreach, a clearer message. That framing is comfortable and usually wrong. Distrust of public systems is most often an accurate summary of what those systems did, held by people who were there or who were raised by people who were.</p><p>Disability history supplies plenty of it. People were removed from their families and communities and placed far away. Procedures were carried out on institutionalized people without meaningful consent, and research was conducted on populations that could not refuse. Families were told that placement was temporary when it was not. Information given to one part of government to obtain help appeared later in a decision about custody, immigration, benefits or criminal charges. None of this is disputed history, and none of it requires anyone currently employed to have done anything wrong for its effects to persist.</p><p>The administrative consequence is specific. People who have learned that giving information to a public system is risky will give less of it, later, and through someone they already trust. That looks like disengagement in your participation data. It is actually a rational response to a documented record, and it will not be moved by a better flyer.</p>",
          },
          {
            type: "accordion",
            heading: "Four things public institutions did that people remember",
            items: [
              { title: "Removal and separation", body: "<p>Children and adults were taken from families and communities and placed at a distance, frequently permanently, frequently on an official's judgment. Families lost contact and were told it was better that way. Communities that experienced this at scale remember it as policy, because it was.</p>" },
              { title: "Procedures and research without meaningful consent", body: "<p>Institutionalized people were subject to procedures and studies they could not refuse, under laws and practices that treated their consent as unnecessary. Public health and medical research in the United States has a documented record of using people who lacked the standing to say no, and that record circulates in affected communities far more accurately than most agencies assume.</p>" },
              { title: "Information collected to help, used for something else", body: "<p>A family gives information to obtain a service. It later surfaces in an eligibility decision, a custody matter, an enforcement action or an immigration process. Once that has happened to someone a person knows, every subsequent request for information carries a cost that the form does not mention.</p>" },
              { title: "Engagement that asked and never answered", body: "<p>This is the one still being made now. A program runs sessions, collects input, thanks people, and is never heard from again. Each round teaches the community that participating costs time and returns nothing, which is a lesson they apply the next time an agency arrives with a survey.</p>" },
            ],
          },
          {
            type: "tabs",
            heading: "Where this conversation tends to sit, and where it can move",
            tabs: [
              { label: "Denial", body: "<p>The history is simply not present. “I have never heard anything about that here.” Nothing in the design changes, because nothing is visible to change. The usual remedy is exposure to the record itself rather than argument.</p>" },
              { label: "Polarization", body: "<p>Two shapes, same distance. Defensive: “that was a different agency and I wasn't there.” Or judging: “the people who did that were monsters, and we are nothing like them.” Both keep the record at arm's length and neither reaches the arrangements still in service.</p>" },
              { label: "Minimization", body: "<p>Where public agencies most often sit, and where this module is aimed. “That was a long time ago.” “We treat everyone the same.” “People just need better information.” Fairness is defined as uniform treatment, so an inherited arrangement looks neutral and goes unexamined. It is a decent instinct producing an inaccurate result.</p>" },
              { label: "Acceptance and adaptation", body: "<p>The record is allowed to stand as fact without needing to be about anyone personally, and then the design changes: who is asked first, what is paid for, which requirement is removed, what gets reported back and by when. These stages describe conversations and designs. They are not a label, a score or a record about any individual, and nothing here is assessed or kept about you.</p>" },
            ],
          },
          {
            type: "quote",
            text: "You are the fourth group from the state to ask us this question. I can tell you what we said the first three times. What I cannot tell you is what any of you did with it.",
            cite: "Composite community advisor perspective, illustrative",
          },
          {
            type: "leaderMove",
            heading: "Open with the last ask, not the new one",
            control: "You control what the first slide says. It can introduce your project, or it can account for the previous one.",
            failure: "Do not open a new engagement without saying what happened to the last round of input. If the answer is that nothing happened, say that. People already know, and pretending otherwise costs more than the admission.",
            next: "Before your next community meeting, find the previous round of input, write one honest paragraph about what came of it, and lead with that.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-19-3-check",
            question: "A program has made and missed the same commitment to a community organization twice. The organization now declines meeting invitations. What is most likely to change the relationship?",
            options: [
              { text: "A clear written explanation of the constraints that caused both delays, so the organization understands the program was not at fault.", correct: false },
              { text: "Naming what was promised and not delivered, saying what will happen now and by when, then doing it and reporting back, repeatedly and in small pieces.", correct: true },
              { text: "A broader engagement plan with additional partners, so the program is not dependent on one organization's willingness to meet.", correct: false },
              { text: "An invitation to a higher-level meeting with senior leaders, signalling that the program takes the relationship seriously.", correct: false },
            ],
            feedbackCorrect: "Yes. Trust follows verifiable behavior over time. Small promises kept and reported on move a relationship; explanations and seniority do not.",
            feedbackIncorrect: "Ask what the organization can verify. An explanation asks them to accept a reason; a routing around them removes them; a bigger meeting is still a meeting. Only a kept promise with a report-back changes the record.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you: think of a time you were asked for input by an organization that never told you what happened to it. What did you conclude, and what would have changed your mind? Nothing you write here is collected or seen by anyone.",
          },
        ],
      },
      {
        id: "ipe-19-4",
        number: 4,
        title: "Reading a current initiative through its history",
        summary: "A five-question review you run on something you are working on now, ending in one design change with a name and a date attached.",
        minutes: 11,
        learning: {
          objective: "Complete a historical context review for one initiative you are working on now, naming what it inherits, who carries the cost of that today, and the first design change with an owner and a review point.",
          takeaways: [
            "The review is short. Five questions, one page, about half an hour with a long-serving colleague and one paid community advisor.",
            "The most useful finding is rarely a wrong committed in the past. It is a live arrangement nobody has revisited, because revisiting it was never anyone's job.",
            "Name what has genuinely changed as carefully as what has not. A review that produces only indictment loses the staff whose cooperation the change requires, and it is also inaccurate.",
            "Separate three kinds of response: a change that alters the design, a change that only explains it, and a change that moves the work onto the person affected. Only the first one counts as a finding closed.",
          ],
          evidence: "A scenario about a historical framing paragraph added to a launch plan, a completed historical context review you can copy into your own work, sorting practice on design change against explanation against shifted burden, flashcards on the five questions, and a knowledge check on what makes a finding usable.",
          appliedNextStep: "Run the review on one initiative this month with one long-serving colleague and one paid community advisor, finish it with a single design change that has an owner and a date, and put the page in the project file rather than in your own notes.",
        },
        scenario: {
          context: "A DSD team is four weeks from launching a redesigned assessment process. At a planning meeting, someone proposes adding a paragraph to the communications plan acknowledging the history of exclusion in disability services, so that the launch is framed respectfully.",
          prompt: "What is the most useful response to that proposal?",
          options: [
            {
              label: "Support it. Acknowledging the history in the launch communication is a meaningful step and costs nothing, and the assessment redesign has already been through consultation.",
              response: "Acknowledgment attached to an unexamined design is the move communities recognize fastest. If the assessment still opens by asking a person to document what they cannot do, the paragraph draws attention to the gap rather than covering it, and the launch pays for that.",
            },
            {
              label: "Run the five-question review on the assessment itself before launch: what it inherits, who the arrangement was built to screen out, what has genuinely changed, who carries the cost of the leftover now, and one design change with an owner and a date. Then write the communication.",
              response: "This puts the review where it can still affect something. Four weeks is enough for one substantive change, and a launch that can point to a specific requirement removed is far more persuasive than one that points to a paragraph.",
              recommended: true,
            },
            {
              label: "Ask a community organization to review the communications plan for tone before it goes out, so the language lands well with the people most affected.",
              response: "This asks for expertise, usually unpaid, about wording, at the point where the decisions are already fixed. It is the narrowest possible use of a partner and it tends to end the relationship rather than build it.",
            },
          ],
        },
        transfer: {
          prompt: "Which initiative will you run this review on, and who will sit with you for the half hour?",
          options: [
            "Name the initiative and the week you will do it",
            "Name the long-serving colleague who remembers the earlier version of it",
            "Name the community advisor you will invite, and find out from contracting or fiscal colleagues how they will be paid",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Five questions, one page",
            body: "<p>A historical context review is not a research project and it does not need a historian. It is five questions asked about one live initiative, written on one page, with two people in the room who know things you do not: a colleague who remembers the program's earlier form, and a community advisor who is paid for their time.</p><p>The questions are: what does this initiative inherit, and from what purpose? Who was that arrangement built for, and who did it screen out? What has genuinely changed since, and what has not? Who carries the cost of the leftover now? And what is the first design change, who owns it, and when is it reviewed?</p><p>Two things make the difference between a useful review and a reading exercise. The first is that it ends in one change with a name and a date attached. The second is that it names what has actually improved, honestly and specifically. Most of this system has changed a great deal, and staff who are asked to help change the rest will disengage from an account that pretends otherwise. Accuracy in both directions is what makes the finding credible.</p>",
          },
          {
            type: "artifact",
            kind: "tagged-document",
            label: "Practical tool",
            title: "A historical context review for one initiative",
            summary: "One page that turns history from background into a design change somebody owns.",
            fields: [
              { label: "The initiative and what it inherits", value: "Annual renewal for a long-standing service. It inherits an annual re-documentation requirement written when access was rationed against a fixed number of places and the assessment's job was to establish incapacity." },
              { label: "Who it was built for and who it screened out", value: "Built to help officials ration a scarce resource and defend the decision on review. It screened out people who could not produce documentation on a schedule: people without a steady clinician, people who move, people who need an interpreter to complete anything, and families already managing more paperwork than time." },
              { label: "What has genuinely changed and what has not", value: "Changed: services are delivered in people's own homes and communities, person-centered planning is the stated direction, and the old placement authority is gone. Not changed: the renewal still asks a person to re-document a permanent condition every year, and the first question is still what they cannot do." },
              { label: "Who carries the cost of the leftover now", value: "Families and adults using the service, who repeat a demonstration of deficit annually. County lead workers, who chase documentation instead of planning. The effect is heaviest where clinicians are scarce and where an interpreter is needed, which is not evenly distributed across the state." },
              { label: "The first design change, its owner and the review point", value: "Remove annual re-documentation for conditions recorded as permanent, and move the opening question from limitation to what the person wants this year. Owner: policy lead, with the forms and communications leads named. Reviewed at the agreed point with the paid advisors who took part in this review." },
            ],
            action: "Copy the five fields, fill them in for one initiative you are working on now, and keep the completed page with the project file rather than in your own notes.",
          },
          {
            type: "sorting",
            id: "ipe-19-4-sort",
            heading: "Does it change the design, explain the design, or move the work onto the person?",
            categories: ["Changes the design", "Explains the design", "Moves the work onto the person"],
            items: [
              { text: "Remove the requirement that a person re-document a permanent condition at every renewal.", category: "Changes the design" },
              { text: "Move the opening conversation from what a person cannot do to what they want, and rewrite the form to match.", category: "Changes the design" },
              { text: "Pay the community advisors who reviewed the draft, at the rate the division uses for other advisors.", category: "Changes the design" },
              { text: "Add a paragraph about the program's history to the public webpage.", category: "Explains the design" },
              { text: "Include an acknowledgment of past exclusion in the launch announcement.", category: "Explains the design" },
              { text: "Brief the leadership team on the findings of the review.", category: "Explains the design" },
              { text: "Add a line to the notice inviting people to call if they find it hard to understand, leaving the notice itself unchanged.", category: "Moves the work onto the person" },
              { text: "Ask community organizations to explain the new process to their members on our behalf, with no funding attached.", category: "Moves the work onto the person" },
              { text: "Tell applicants they may request an extension if the documentation deadline is difficult for them.", category: "Moves the work onto the person" },
            ],
          },
          {
            type: "list",
            heading: "Where to look when nobody remembers",
            items: [
              "Long-serving colleagues, including administrative and support staff, who often hold the only account of why a form asks what it asks.",
              "The published state record of disability history, including the material the Minnesota Governor's Council on Developmental Disabilities has collected, listed in this module's sources.",
              "Earlier versions of the rule, the form and the guidance, which usually survive in program files even when the reasoning does not.",
              "Community organizations' own records and newsletters, which frequently document what an agency asked for and what followed.",
              "Self-advocates and family advisors who dealt with the earlier version, paid for their time like any other advisor.",
              "Closure and transition files from programs that ended, which show what was promised to the people moved out of them.",
            ],
          },
          {
            type: "flashcards",
            heading: "The five questions",
            cards: [
              { front: "What does this inherit?", back: "<p>Name the arrangement and the purpose it was built to serve. Most long-standing requirements answer a question the system used to ask.</p>" },
              { front: "Who was it built for, and who did it screen out?", back: "<p>Be specific about both. “Everyone” is not an answer, and the screened-out group is usually still being screened out.</p>" },
              { front: "What has genuinely changed?", back: "<p>Write the real improvements plainly. A review that only indicts loses the people whose cooperation the change needs, and it is also an inaccurate account.</p>" },
              { front: "Who carries the cost now?", back: "<p>Name the people and the places. Costs from a leftover arrangement usually land on the same groups the arrangement originally excluded.</p>" },
              { front: "What is the first design change?", back: "<p>One change, one owner, one review point. Without those three, the review is a reading exercise with a conclusion.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Finish with a change, not a finding",
            control: "You control whether the review ends in a summary or in a single named change with a date attached.",
            failure: "Do not circulate a set of findings with no owner. An unowned finding becomes background for the next review, and the arrangement survives another cycle unexamined.",
            next: "Before you close the review document, write the design change, the owner's name and the review date at the top of the page, not the bottom.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-19-4-check",
            question: "Which finding from a historical context review can actually be acted on?",
            options: [
              { text: "The program has roots in an era when disabled people were excluded from community life, and staff should keep that context in mind as the redesign proceeds.", correct: false },
              { text: "The renewal form still requires annual re-documentation of a permanent condition, a leftover from a rationing rule that no longer applies. Families and county lead workers carry the cost, heaviest where clinicians and interpreters are scarce. Owner: policy lead. First change: drop re-documentation for permanent conditions. Reviewed at the agreed point with the advisors who took part.", correct: true },
              { text: "Historical exclusion contributed to current disparities in access, which the program will address through improved outreach and clearer communication.", correct: false },
            ],
            feedbackCorrect: "Yes. The arrangement, its origin, the people carrying the cost, a named owner, one specific change and a review point. Every part of that can be done or asked about.",
            feedbackIncorrect: "Read each option and ask who does what, by when, and how anyone would know it happened. Only one of them survives those three questions; the others describe a state of mind.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you and recorded nowhere: read your finished review as a person who has never worked inside this agency and who was affected by the arrangement you described. Does it say plainly what happened, what changed and what you are doing next — and which line would you rewrite first?",
          },
        ],
      },
    ],
  },
  jobAid: {
    title: "History, disability and public institutions",
    subtitle: "One page for anyone revising a rule, a form, a process, a measure or a plan",
    quote: "The buildings closed. Most of the rules written for them did not.",
    use: {
      purpose: "Keep the inherited arrangements, the compounding of ableism and racial inequity, and the five review questions in view while you revise a long-standing requirement, interpret program data, plan an engagement, or prepare an initiative for launch.",
      remember: [
        "The system began as a custodial system. A service system built on top of one inherits its categories, thresholds and defaults unless somebody removes them deliberately.",
        "“That was a long time ago” is true about events and false about arrangements. Ask what the requirement was written to do, and whether that is still the question.",
        "Ableism and racial inequity ran through the same offices and the same discretion. Look at more than one thing at once or you will report an average that hides the gap.",
        "Present-day disparity does not require present-day intent, and naming it is a design task rather than an accusation.",
        "Distrust is information about the record, not a communications problem. Open with what happened to the last round of input, even when the answer is nothing.",
        "Trust follows verifiable behavior: small promises kept, changes reported back, harm corrected, expertise paid for.",
        "Name what has genuinely improved as carefully as what has not. Accuracy in both directions is what makes the finding credible to colleagues.",
        "Where the work touches Tribal Nations or Native American communities, the Office of Indian Affairs and the DHS offices that handle tribal matters lead; this program defers to them.",
      ],
      doNext: "Run the historical context review on one initiative you are working on now, and finish it with a single design change that has an owner and a review date.",
    },
    sections: [
      {
        heading: "The historical context review, in short",
        items: [
          "What does this initiative inherit, and what purpose was that arrangement built to serve?",
          "Who was it built for, and who did it screen out? Be specific about both.",
          "What has genuinely changed since, and what has not?",
          "Who carries the cost of the leftover now, and where does it land hardest?",
          "What is the first design change, who owns it, and when is it reviewed?",
        ],
      },
      {
        heading: "When you are revising something long-standing",
        items: [
          "Write one line beside each requirement saying what decision it informs; a blank line is a candidate for removal.",
          "Check whether the assessment opens by asking what a person cannot do, and whether it needs to.",
          "Look for substitute decision-making treated as the default, and for settings offered because nothing else is available nearby.",
          "Ask a long-serving colleague what the requirement was originally for before you rewrite its wording.",
          "Finish with one change, one owner and one date, at the top of the page.",
        ],
      },
      {
        heading: "When you are reading program data",
        items: [
          "Break the measure out by race, primary language, county and disability type, and by the intersections rather than one at a time.",
          "Where cells are small, combine periods or group geographies instead of dropping the question.",
          "Decide in advance what you will do if a gap appears, so the answer is not improvised under pressure.",
          "Treat an unexplained difference as a question about the design, and ask the people inside it before publishing a conclusion.",
          "Watch for discretion clauses: “as appropriate” and “where feasible” are where variation lives.",
        ],
      },
      {
        heading: "When a community is slow to engage",
        items: [
          "Find out what was asked of them last time and what they were told afterward.",
          "Open with that account, even when it is that nothing came of it, and say plainly that it is late.",
          "Go through organizations people already use, rather than through your own mailing list.",
          "Pay for time and expertise, and arrange the payment route before the first invitation.",
          "Never read low attendance as low need; read it as evidence about the relationship.",
        ],
      },
      {
        heading: "Who this helps",
        items: [
          "Policy and program staff, whose revisions decide which inherited requirement survives another cycle — a useful place to start.",
          "Quality, compliance and performance staff, who see the same findings recur and can ask what design keeps producing them — a useful place to start.",
          "Data, research and evaluation staff, who choose the resolution at which a gap becomes visible or stays hidden — a useful place to start.",
          "Executive and senior leaders, who decide whether a review ends in an acknowledgment or in a change with a name and a date attached — a useful place to start.",
          "Operations, fiscal, contracting, communications and engagement colleagues, who hold the payment routes, the notices and the relationships this work depends on.",
        ],
      },
      {
        heading: "Related modules",
        items: [
          "Tribal sovereignty and state responsibilities",
          "Race, disability, and unequal outcomes",
          "Trauma-responsive public administration",
          "Power, conflict, and repair",
          "Ethical decision-making",
        ],
      },
    ],
  },
  sources: [
    { title: "Minnesota Governor's Council on Developmental Disabilities", href: "https://mn.gov/mnddc/", note: "Minnesota's council on developmental disabilities, which maintains extensive public material on the state's institutional history, self-advocacy and the move to community services." },
    { title: "Parallels in Time: A History of Developmental Disabilities", href: "https://mn.gov/mnddc/parallels/index.html", note: "The council's public history of developmental disabilities, covering custodial institutions, the eugenics era, exclusion from schooling, and the rights movement that changed them." },
    { title: "Parallels in Time II: 1950 to the Present", href: "https://mn.gov/mnddc/parallels2/index.html", note: "The second part of the same history, covering deinstitutionalization, self-advocacy, litigation and the development of home and community-based services." },
    { title: "ADA.gov, Olmstead: Community integration for everyone", href: "https://www.ada.gov/olmstead/", note: "U.S. Department of Justice material on Olmstead v. L.C. (1999) and the integration mandate under Title II of the Americans with Disabilities Act." },
    { title: "Minnesota Olmstead Implementation Office", href: "https://mn.gov/olmstead/", note: "Minnesota's Olmstead Plan work toward integrated, self-determined lives, including the state's commitments, measures and public reporting." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "Minnesota's advisory council on disability policy, access and rights, including guidance for state agencies working with disabled Minnesotans." },
    { title: "U.S. Department of Justice, Civil Rights Division", href: "https://www.justice.gov/crt", note: "Federal civil rights enforcement, including disability rights, and the historical record of consent decrees and investigations involving public institutions." },
    { title: "Minnesota Framework for Universal Multicultural Instructional Design", href: "https://mncpd.org/wp-content/uploads/2016/12/MN_Framework_for_Universal_Multicultural_Instructional_Design.pdf", note: "The design reference for this curriculum: multiple ways to engage, culturally responsive materials and accessible instruction." },
  ],
};

export default pack;
