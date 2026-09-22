import type { CoursePack } from "../../source-types";

// Intercultural Practice and Equity · Internal leadership · Module 33: Responsible data and evaluation.
// Program-authored for internal DHS and DSD staff. Voluntary, self-directed, no scores and no completion requirement.
const pack: CoursePack = {
  course: {
    id: "ipe-33-responsible-data-evaluation",
    indexNumber: 1175,
    seriesLabel: "Intercultural Practice and Equity · Internal leadership",
    title: "Responsible Data and Evaluation",
    subtitle: "A number is a record of what we counted, not a record of what happened. Four lessons on who reaches the count, what a category hides, how a finding can describe a community instead of a system, and the short check to run before a number becomes a decision.",
    scope: "For internal DHS and DSD staff who produce, request, read or act on division numbers: data, research and evaluation staff; quality, compliance and performance staff; policy and program staff; contracts, fiscal, grants and procurement staff; executive and senior leaders; and the communications and operations staff who carry a finding to its audience. Four short lessons you can take in any order and return to. Voluntary and self-directed: no score, no ranking, no completion requirement, and nothing you write in a reflection is collected. Completion here does not count toward DHS-required training credits unless management, a director, or DHS leadership expressly approves an exception.",
    treatment: "Four short lessons with Minnesota DSD examples, scenarios, sorting and flashcard practice, private reflection prompts, and a one-page data-interpretation checklist you can copy into your own work",
    duration: "40–45 minutes",
    author: "One DSD — People, Access and Culture",
    coverImage: "/images/covers/outcomes-not-intentions.jpg",
    coverAlt: "A woman reviews printed charts at a desk.",
    introTranscript: "Division numbers are made of records, and a record exists because something already went right between a person and the department. Someone told them the service existed, in a language they could use. They reached a door that was open when they could get to it. Somebody entered them correctly. Everyone who did not get that far is outside the count and invisible inside it. This module is about reading division numbers with that in mind. It covers the denominator behind a rate, what a category was originally built to decide and what it flattens, the difference between a finding written about a community and the same finding written about the process that reached them, and a six-line check you can run before a number becomes a decision. Nothing here is a score, and nothing you write in a reflection is collected.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Identify the denominator behind a division number and name at least three groups the count cannot include.",
        "Trace one category in a report back to the form or rule that defined it, and state what it records, what it groups together and what it cannot show.",
        "Read a missing value as information about the process rather than as a default, and say what your own reports currently do with blanks.",
        "Rewrite a finding so the process is the subject of the sentence, and name the comparison and the causal claim the original version assumed.",
        "Draft a six-line data-interpretation checklist for one report you produce or rely on, including what happens when a line cannot be answered.",
      ],
      evidence: [
        "Four worked scenarios drawn from a timeliness figure with a hidden denominator, a breakdown requested from fields that were never built for it, a briefing sentence that explains a gap by describing a community, and an interpretation check that grew too large to use.",
        "A knowledge check in every lesson with feedback that explains the usable answer.",
        "Sorting practice that places losses before, inside and after the record, and separates a sentence about the process from a sentence about the people and a claim the data cannot carry.",
        "A completed six-line checklist for one real report, with at least one line recorded honestly as unknown.",
      ],
      appliedNextStep: "Take one report you produce or rely on. Write in one sentence what its headline number counts, list the groups that cannot appear in it, and run the six lines once with a colleague who did not build the number.",
    },
    governance: {
      contentOwner: "One DSD — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: [
        "A change in Minnesota data practices requirements, or in DHS rules on classifying, sharing, suppressing or publishing data about people who use division services",
        "A change in how DHS or DSD collects race, ethnicity, language or disability information, or in the forms and systems those fields come from",
        "Feedback from compensated community advisors or from division analysts that an example here does not match how reporting actually works, or that a published report described a community in a way this module should have caught",
      ],
      relatedDoor: "Formal decisions about how data is classified, shared, suppressed, released or published belong to the responsible DHS data practices, privacy, legal and research offices; this module helps you interpret and report numbers responsibly, not decide what may be disclosed.",
      toolkitQuestion: "Who is missing from this count, what do these categories group together, and does this finding describe the people or the process we run?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "ipe-33-1",
        number: 1,
        title: "Who reaches the count",
        summary: "Division numbers describe the people who found the door, got through it and were recorded correctly. Everything that happens before the record is a filter, and the filters do not operate at random.",
        minutes: 11,
        learning: {
          objective: "Identify the denominator behind a division number and name at least three groups the count cannot include, using one report you actually read.",
          takeaways: [
            "Administrative numbers are a record of transactions with the division, not a census of the people the division exists for. Anyone who was never referred, never got through a first contact, or was recorded somewhere else is outside the count and invisible inside it.",
            "The denominator decides the question. Share of tracked cases, share of applicants, share of people found eligible and share of people who could benefit are four different measures, and usually only the first two are available.",
            "Undercounting is patterned, not random. It concentrates among people who needed an interpreter and did not get one, people without a stable address, people in counties with a single access point, and people nobody referred.",
            "Absence reads as satisfaction unless you name it. No complaints from a language community is a finding about the complaint route, not a finding about the experience.",
          ],
          evidence: "A scenario about a timeliness figure with a hidden denominator, a sorting exercise that places losses before, inside and after the record, and a knowledge check on what a completion rate can support.",
          appliedNextStep: "Take one report you read regularly, write the denominator of its headline number in a single sentence, and list three groups that cannot appear in it.",
        },
        scenario: {
          context: "A DSD performance summary reports that ninety-six percent of annual reassessments were completed inside the required window, up four points. The figure counts cases that entered the tracking workflow with a scheduled review date. Cases closed before that date, cases still waiting for a first contact, and cases a lead agency records under a different service code are all outside it. A senior leader wants to use the figure in a division update.",
          prompt: "What is the most useful thing to raise?",
          options: [
            {
              label: "Use the figure as reported, and set a target of ninety-eight percent for the next cycle.",
              response: "The figure will hold up under scrutiny, and the improvement may well be real. The risk is what a target does to a measure with a soft entry point: the easiest way to raise it is for difficult cases to stay outside the tracked workflow a little longer. Nobody has to decide that on purpose for it to happen.",
            },
            {
              label: "Ask what the ninety-six percent is a share of: which cases entered the count, which left before the clock started, and which were never recorded here at all. Report the figure with that sentence attached, and ask for the count of cases that never entered.",
              response: "This keeps the achievement and adds the question that makes it usable. A completion rate describes the cases the process held on to. The cases it let go are the ones most likely to belong to people the process is hardest for, and counting them is usually a day of work rather than a project.",
              recommended: true,
            },
            {
              label: "Break the figure out by county before it is used, so regional differences are visible.",
              response: "Worth doing, and it will show real variation. On its own it splits the same blind spot into county-sized pieces: every county figure carries the same denominator problem, and a county that loses more cases before the clock starts can appear to be the strongest performer in the state.",
            },
          ],
        },
        transfer: {
          prompt: "What is the denominator of the number you are asked about most often?",
          options: [
            "Name one figure your team reports or receives every month.",
            "Write the sentence that says what it is a share of, in words someone outside your unit would understand.",
            "List the groups that cannot appear in it, and how you would find out how many there are.",
            "Ask whoever produces it what happens to a case that leaves before the measure starts.",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "A record of us, not a record of them",
            body: "<p>Almost every number a division reports is made of records, and a record exists because something happened between a person and the department: a referral arrived, an application was filed, an assessment was entered, a service was billed, a case was closed with a code. That is a real and useful thing to count. It is not the same as counting the people the division exists for.</p><p>Think about everything that has to go right before a person can appear in a count. Someone had to tell them the service existed, in a language and a format they could use. They had to reach a door that was open at a time they could get to it. They had to get through a first conversation, sometimes with an interpreter who may or may not have been arranged. Someone had to enter them correctly, in this system rather than another one. Only then are they countable. Every one of those steps is a filter, and none of them filters people at random.</p><p>This is why a division can run an honest, careful report and still describe a population that does not exist. The report describes the people the process managed to hold on to. The question that turns it into something you can act on is short: what is this a share of, and who could never be in it?</p>",
          },
          {
            type: "accordion",
            heading: "Five places a person falls out of a count",
            items: [
              { title: "Nobody referred them", body: "<p>A discharge planner, a school, a clinic or a county worker either knows about the service or does not. Referral patterns are relationships, and relationships are uneven across regions, hospital systems and languages. A person nobody referred has no record anywhere, and no report will ever show a space where they should have been.</p>" },
              { title: "The first contact did not work", body: "<p>A phone line open on weekday mornings. A voicemail box that fills. A return call from a blocked number. An intake conversation held in English because the interpreter line was busy and the appointment could not be moved. Each of these ends with no record at all, or with a record coded as no response. The person tried. The count shows nothing, or shows them declining.</p>" },
              { title: "They were recorded somewhere else", body: "<p>Two lead agencies enter the same support under different codes. A person moves between counties and starts a new record. A service is billed in a category the report filters out. The person exists in the data and is missing from this number, which is considerably harder to notice than being missing entirely.</p>" },
              { title: "They left before the measure started", body: "<p>Most process measures start a clock at some event: a scheduled date, an approved plan, an opened case. Anyone who leaves before that event is not late, not on time, and not counted. A measure with a soft entry point will always look better than the process it describes, and it will look best exactly where the process is failing earliest.</p>" },
              { title: "The group was too small to publish", body: "<p>Suppressing small cells protects people from being identified, and it is the right rule. Its side effect is that the smallest communities vanish from the chart, then from the discussion, then from the priority list. Suppression is a reporting decision, not evidence that nothing is happening.</p>" },
            ],
          },
          {
            type: "tabs",
            heading: "The same measure, four denominators",
            tabs: [
              { label: "Of tracked cases", body: "<p>The most available and the narrowest. It answers one question: of the cases that entered our workflow with a start event, how many finished on time? Genuinely useful for managing the workflow. It says nothing whatever about who never entered it.</p>" },
              { label: "Of applicants", body: "<p>Wider, and usually obtainable. It answers: of everyone who asked, how many got through? The space between this figure and the one above is a count of the people the workflow lost early, and that space is often exactly where the access problem lives.</p>" },
              { label: "Of people found eligible", body: "<p>This one asks a fairness question. Among people the program has already agreed it is for, is the experience even? A difference here is difficult to explain away, because eligibility has already been settled and the remaining variation belongs to the process.</p>" },
              { label: "Of people who could benefit", body: "<p>The question leaders usually mean, and the one administrative records cannot answer. Getting close to it takes population estimates, community knowledge, and compensated partners who can say who is not showing up and why. Naming the distance between this question and your available numbers is far more honest than quietly answering a smaller question instead.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Ask for the denominator before you ask for the trend",
            control: "You control which question you ask first when a figure arrives in front of you, and whether the sentence explaining what it counts travels with it.",
            failure: "Do not accept a rate without its denominator, and do not let a target be set on a measure with a soft entry point. Both are how a process becomes better at reporting rather than better at serving people.",
            next: "The next time a rate is presented to you, ask in the room what it is a share of, and what happens to a case that leaves before the count starts. Ask it as curiosity rather than challenge. Most of the time nobody has been asked.",
          },
          {
            type: "sorting",
            id: "ipe-33-1-sort",
            heading: "Where does this number lose people?",
            categories: ["Lost before any record exists", "Lost inside the record", "Lost in how it is reported"],
            items: [
              { text: "A person whose hospital discharge planner has never heard of the service.", category: "Lost before any record exists" },
              { text: "A preferred-language field left blank in a third of records.", category: "Lost inside the record" },
              { text: "A group of six people suppressed because the cell is too small to publish.", category: "Lost in how it is reported" },
              { text: "Someone who called the general line three times, never reached a worker, and stopped calling.", category: "Lost before any record exists" },
              { text: "Two lead agencies entering the same support under different codes.", category: "Lost inside the record" },
              { text: "A chart that shows only the four largest regions.", category: "Lost in how it is reported" },
              { text: "A case closed as no response after an intake call that had no interpreter.", category: "Lost inside the record" },
              { text: "A statewide total that leaves out anyone whose case is still open.", category: "Lost in how it is reported" },
            ],
          },
          {
            type: "quote",
            text: "I ran that timeliness number for three years and I was proud of it. Then a county supervisor asked me what happened to the referrals that never got a scheduled date. So I went and looked. There were more of them than I expected, they were concentrated in two regions, and not one of them had ever appeared in anything I sent upward. The number was not wrong. It was just about a smaller group of people than everyone reading it believed.",
            cite: "Composite DSD staff perspective, illustrative",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-33-1-check",
            question: "A report shows that ninety-one percent of support plans were completed within the required window. The measure counts plans that were opened with a scheduled completion date. Which statement is best supported?",
            options: [
              { text: "Ninety-one percent of people who needed a support plan received one on time.", correct: false },
              { text: "Ninety-one percent of the plans that entered the tracked workflow finished on time; the measure says nothing about people who never had a plan opened.", correct: true },
              { text: "The nine percent who were late are the division's access problem, and the ninety-one percent are evidence that the process works.", correct: false },
            ],
            feedbackCorrect: "Yes. A completion rate describes the cases the process held on to. Anyone who never got a plan opened is outside the numerator and outside the denominator.",
            feedbackIncorrect: "Look at what has to happen before a case can be counted at all. A plan has to be opened with a date. Everyone who never reached that point is invisible in both halves of the fraction, including the people the process failed earliest.",
          },
          {
            type: "statement",
            body: "A private reflection, for you only and never collected: the number I am asked about most often is... what it is actually a share of is... and the people who cannot appear in it are... If the second line takes more than one sentence, that is worth knowing before the figure is used again.",
          },
        ],
      },
      {
        id: "ipe-33-2",
        number: 2,
        title: "What the categories were built for",
        summary: "Every field in a record was defined by someone, for a reason, and the reason was usually operational. Trouble starts when a category built for payment or eligibility is asked a question about people's lives.",
        minutes: 11,
        learning: {
          objective: "Trace one category in a report back to the form or rule that created it, and state what it records, what it groups together and what it cannot show.",
          takeaways: [
            "A category is a decision with a purpose attached. Eligibility categories were built to decide payment and which rules apply. They are not descriptions of a person, a diagnosis or a culture, and they behave badly when used as one.",
            "Collapsing hides the most. A single value covering many communities, a residual box named for what it is not, or a language field that allows one answer per person will all report smoothly and conceal the differences that matter.",
            "A blank field is information. A preferred-language value missing from a third of records tells you something true about the intake conversation, and a report that reads blank as English has made a decision nobody wrote down.",
            "Disaggregation has a floor. Making small communities visible and protecting individuals from being identified genuinely pull against each other; the honest response is to say which you chose and why, not to pretend the tension is absent.",
          ],
          evidence: "A scenario about a breakdown requested from fields that were never built for it, flashcard practice on what six common fields actually record, and a knowledge check on missing values.",
          appliedNextStep: "Pick one category you use in reporting, find the form or rule that defines it, and write one sentence naming what it records and one naming what it cannot.",
        },
        scenario: {
          context: "A DSD leader asks for a breakdown of a newly expanded service by race and by language, to see whether access is even. The analyst finds three things. The race field offers six options and comes from an intake form that has not changed in a long time. Preferred language is blank in about a third of records, and the report template has always read blank as English. The disability field records the eligibility category used for payment, not how a person describes their own support needs.",
          prompt: "What should the analyst deliver?",
          options: [
            {
              label: "The breakdown as requested, with a note on data limitations at the end of the deck.",
              response: "The breakdown is worth producing and the note is honest. The problem is what happens next. The slide travels and the note does not, and six weeks later a figure from a field nobody has examined is being used to justify a decision. A limitation that matters belongs in the sentence, not in a footnote.",
            },
            {
              label: "The breakdown, with one sentence beside each chart saying what the field records, how it was collected, how much is missing and who is grouped inside each value; a separate count of the missing records; and a short proposal for asking people directly, worded with compensated community reviewers.",
              response: "This answers the leader's question, keeps the answer from being read as more than it is, and turns a reporting limit into a piece of work someone can fund. The count of missing records is frequently the most useful chart in the set, because it describes something the division controls.",
              recommended: true,
            },
            {
              label: "Hold the breakdown until the fields are corrected, since the current ones cannot support a fair comparison.",
              response: "Understandable, and it protects nobody. The decision still gets made, now on impressions rather than on flawed figures, and the fields may not change for a long time. Refusing to look is its own finding about who stays invisible. Produce it, say plainly what it can carry, and start the work of asking people directly.",
            },
          ],
        },
        transfer: {
          prompt: "Which category in your own reporting has never been examined?",
          options: [
            "Choose one field that appears in a report you produce or rely on.",
            "Find the form, screen or rule where its values were defined, and who defined them.",
            "Write what it records, what it groups together and what it cannot show, in three sentences.",
            "Find out how often it is blank, and what the report currently does with a blank.",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "A category is a decision with a purpose attached",
            body: "<p>Every field in a record started as somebody's decision. A form designer picked the options. A rule writer defined who belongs in a payment category. A system had space for one value where a person might have offered three. None of those people were careless. They were answering the question in front of them, and that question was almost always operational: how do we pay for this, how do we route it, how do we know which rule applies.</p><p>The trouble begins when a category built for one purpose is asked a question it was never built for. An eligibility category tells you which set of rules governs a person's services. It does not tell you how that person experiences disability, which supports they actually use, or how they would describe themselves. A race field with six options tells you which of six boxes was available when the record was made, and often tells you who chose it: a person describing themselves, a worker guessing under time pressure, or a system carrying a value forward from an older record.</p><p>None of this makes a field useless. It makes the field specific. The discipline is to say out loud, every single time, what a category records and what it was built to decide, so that whoever reads the chart knows which question they are looking at the answer to.</p>",
          },
          {
            type: "flashcards",
            heading: "What the field actually records",
            cards: [
              { front: "Race or ethnicity, as one field with a short list", back: "<p>Which of a fixed set of boxes was available when the record was made, and often who chose it. Most systems cannot hold more than one identity at a time, and a value carried forward from an old record can outlive several conversations with the person.</p>" },
              { front: "Preferred language", back: "<p>Usually the language someone recorded at one moment, for one purpose. It rarely separates speaking from reading, seldom says whether the person prefers written or spoken material, and does not record whether an interpreter was actually provided.</p>" },
              { front: "Disability category", back: "<p>In most administrative systems this is an eligibility or payment category, written to decide which rules apply. It is not a diagnosis, not a description of support needs, and not how the person would describe their own life.</p>" },
              { front: "County", back: "<p>The county attached to a record, which may be where a person lives, where a lead agency sits, or where a case happened to be opened. Three different things reported as one, and the difference matters most for people who move or who cross a county line to reach a service.</p>" },
              { front: "Case closure reason", back: "<p>A code selected by a worker from a short list, usually in a hurry. Closure reasons are among the most consequential and least examined fields in any system: declined, no response and moved can each describe a process that stopped working rather than a person who stopped trying.</p>" },
              { front: "A blank", back: "<p>Information about the conversation, not about the person. A field blank in a third of records is telling you the question was not asked, could not be asked, or had no answer that fit the list. What the report does with a blank is a decision somebody should be able to point to.</p>" },
            ],
          },
          {
            type: "accordion",
            heading: "Four ways a category goes quiet",
            items: [
              { title: "Collapsing", body: "<p>One value standing in for many communities reports smoothly and hides the most. Communities grouped inside a single box can have entirely different histories with public systems, different languages, different arrival stories and completely different experiences of the same process. The chart shows one bar, and the bar is an average of things that are not alike.</p>" },
              { title: "The residual box", body: "<p>A category named for what it is not, holding everyone the list did not anticipate, is not a group and cannot support a finding about a group. When the residual box is large, that is a finding about the list. The useful next step is to find out what is inside it, not to report it as though it were a population.</p>" },
              { title: "Borrowed categories", body: "<p>A field built for payment, routing or rule selection gets used for an equity question because it is the only field available. That is often reasonable, and it has to be said out loud every time, because the alternative is a report that appears to describe people and actually describes a billing structure.</p>" },
              { title: "Missing treated as normal", body: "<p>Blank read as English. Blank read as no accommodation needed. Blank read as no. Each of these is a choice made once inside a report template and then inherited for years by people who never saw it made. Find out which of these your own reports make, and write it where readers will see it.</p>" },
            ],
          },
          {
            type: "tabs",
            heading: "Disaggregation pulls two ways",
            tabs: [
              { label: "Why to push for it", body: "<p>Averages hide the people a system serves worst. A measure that looks steady overall can contain a group for whom the process almost never works. A division that never breaks a number apart cannot see that, and it will keep improving the parts that were already fine.</p>" },
              { label: "Where it stops", body: "<p>Small numbers are real people. A cell holding a handful of records in one county can identify someone, particularly once a service type or an age band is alongside it. Suppression rules exist for that reason and are not obstruction. State data practices requirements govern what may be published and released, and those decisions belong to the offices that hold them.</p>" },
              { label: "The trade you are making", body: "<p>Visibility and protection genuinely pull against each other, and choosing between them is a judgment call rather than a calculation. What responsible practice requires is that the choice be visible: say which one you chose, at what threshold, and what you did instead for the groups you had to suppress.</p>" },
              { label: "Instead of guessing", body: "<p>When the fields cannot answer the question, the answer is to ask people rather than to assume. Compensated community advisors, people with disabilities and family partners can tell you what a category is flattening and how a question ought to be worded. That is a piece of work with a real cost, and naming the cost is how it gets funded instead of deferred.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Name what the field records, every time it travels",
            control: "You control whether the sentence describing what a category actually records is attached to the chart, or sits in a paragraph at the end that nobody carries forward.",
            failure: "Do not let a limitation live only in a footnote. A slide separates from its deck within a week, and whatever is printed on the slide becomes what the division believes.",
            next: "Put one plain sentence on the chart itself: what this field records, who filled it in, and how much of it is blank.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-33-2-check",
            question: "A report's preferred-language field is blank for thirty-one percent of records, and the template counts blanks as English. What is the most accurate reading?",
            options: [
              { text: "English speakers are the large majority, since a blank almost always means no other language was needed.", correct: false },
              { text: "The blanks are a finding about how and whether the question was asked, and counting them as English creates a language need that will never appear in any report.", correct: true },
              { text: "The blank records should be dropped from the analysis so the percentages describe only records with known values.", correct: false },
            ],
            feedbackCorrect: "Yes. A third of records missing a value is information about the intake conversation, and the default turns that silence into a confident wrong answer.",
            feedbackIncorrect: "Ask what a blank actually is. Nobody recorded a language. Reading that as English invents a fact, and dropping those records quietly assumes the missing third resembles the known two thirds, which is the least likely thing about them.",
          },
          {
            type: "statement",
            body: "A private reflection, for you only and never collected: one category I use without thinking is... what it was originally built to decide is... and the thing it flattens that matters most in my work is... If you cannot answer the middle line, the form or the rule that defines it is usually a ten-minute search.",
          },
        ],
      },
      {
        id: "ipe-33-3",
        number: 3,
        title: "From a finding to a story",
        summary: "The same gap can be written as a fact about a community or a fact about the process that reached them. Both can be true. Only one of them names something the division can change.",
        minutes: 10,
        learning: {
          objective: "Rewrite a finding so the process is the subject of the sentence, and identify the comparison, the causal claim and the audience the original version assumed.",
          takeaways: [
            "A finding about a difference always has two available sentences: one about the people and one about the process that reached them. The second has an owner, and the data usually supports it at least as well.",
            "The comparison group is an argument, not a neutral choice. Comparing every community with the largest one makes that group the standard and everyone else a shortfall from it, and nobody in the room has to defend a claim they did not notice being made.",
            "Administrative records almost never support a causal claim, and the causal claim is the part that gets quoted. Say what the figures show, say what they cannot separate, and put what the division already knows about that step in the same paragraph.",
            "A chart outlives its footnotes and reaches a third audience: the people it is about. Plan for that reading before publication, share findings back with compensated community partners, and say what will change and by when.",
          ],
          evidence: "A scenario about a briefing sentence that explains a gap by describing a community, sorting practice on whether a sentence describes the process, the people, or more than the data can carry, and a knowledge check on comparison groups.",
          appliedNextStep: "Take one finding your team reported recently and write the process version of the sentence beside the original. Decide which one you would want to read if it were about you.",
        },
        scenario: {
          context: "A draft internal briefing on a support-planning step contains this sentence: “Participants from one cultural community complete the annual review at a substantially lower rate, reflecting lower engagement with formal services.” The underlying figures are sound. The division also knows, from a separate report nobody put beside it, that the reminder notice for that step goes out in English only, and that the scheduling line for two of the counties involved is open on weekday mornings.",
          prompt: "How should the sentence be handled?",
          options: [
            {
              label: "Keep the sentence and add that further research is needed to understand the cause.",
              response: "The hedge does not travel. What travels is the first clause and the explanation attached to it, and that explanation is an assertion about a community's attitudes which the data cannot support. Adding that further research is needed will read as agreement that the community is the thing to research.",
            },
            {
              label: "Remove the community breakdown so the briefing cannot be read as a statement about that group.",
              response: "This protects the division rather than the community. The gap is real and people are living inside it; deleting it means nobody owns it, and the next report will rediscover it in a year. Suppressing a small cell to protect individuals is a different act, made for a different reason, and it should be described as what it is.",
            },
            {
              label: "Rewrite the finding so the process is the subject, state what the figures can and cannot separate, and put the English-only notice and the weekday-morning scheduling line in the same paragraph.",
              response: "This keeps every true thing in the original, removes the claim the data cannot carry, and hands the reader something the division controls. It also changes who is asked to do something next: a notice and a phone schedule have owners, and a cultural attitude does not.",
              recommended: true,
            },
          ],
        },
        transfer: {
          prompt: "Which finding from your own work is still written with a community as the subject?",
          options: [
            "Find one sentence in a recent report, slide or briefing that explains a difference by describing a group of people.",
            "Write the version where the process is the subject, using only what the same data supports.",
            "List what the division already knows about that step: the notice, the hours, the channel, the form, the wait.",
            "Decide who should see the finding before it is published, and what you will tell them changed because of what they said.",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Two true sentences, one of them usable",
            body: "<p>A report shows that people in one group complete a step less often than people in another. What you write next is not determined by the data. There are at least two sentences the same figures support.</p><p>The first: this group completes the step less often. True, and it puts a community in the subject position of a problem sentence. Readers supply an explanation for what they read, and the explanation they supply will be about the people, because the people are who the sentence was about.</p><p>The second: our process for this step reaches this group less well. Supported by exactly the same figures, and it puts the division in the subject position. It invites the question a reader can act on, which is what about the notice, the hours, the channel, the form or the wait would produce this result.</p><p>Neither sentence is spin. The first is the one that gets written by default, and its cost is paid by people who were not in the room when it was drafted. This is also where the program's organizing framework, the Intercultural Development Continuum, becomes visible in ordinary work. Reading a gap as evidence that everyone was treated identically and the difference must therefore belong to them is what Minimization sounds like in a report. Reading the same gap as a question about whose experience the process was designed around is the move toward Acceptance and Adaptation. That describes two readings of a sentence, not a label for the person who wrote it.</p>",
          },
          {
            type: "tabs",
            heading: "Four choices that decide what the chart says",
            tabs: [
              { label: "The comparison group", body: "<p>Every difference is a difference from something. Comparing each community with the largest one quietly makes that group the standard. Comparing each with the overall average makes almost everyone slightly wrong. Comparing a group with itself over time, or with what the program promised, often asks a more useful question and leaves nobody holding the role of the normal case.</p>" },
              { label: "Rate or count", body: "<p>A rate can make a difference look minor in a group with a large denominator and dramatic in a small one. A count can make a small community look like a marginal problem when the process is failing nearly everyone in it. Report both, and say which one the decision should rest on.</p>" },
              { label: "The time window", body: "<p>Start and end points are chosen by somebody. A window that begins after a change shows the change working; one that begins before shows the disruption it caused. Neither is dishonest until the choice goes unstated. Say why the window is what it is.</p>" },
              { label: "What sits on the line", body: "<p>A chart with a target line invites a judgment about who missed it. A chart with a line marking the process step invites a question about what happens there. Both use the same numbers, and they produce two different meetings.</p>" },
            ],
          },
          {
            type: "sorting",
            id: "ipe-33-3-sort",
            heading: "Process, people, or more than the data can carry?",
            categories: ["Describes the process", "Describes the people", "Claims more than the data can carry"],
            items: [
              { text: "The reminder notice for this step goes out in English only.", category: "Describes the process" },
              { text: "Completion is eighteen points lower in counties with one access point than in counties with four.", category: "Describes the process" },
              { text: "Thirty percent of records for this step have no preferred-language value.", category: "Describes the process" },
              { text: "Average travel time to the nearest office is longest for residents of two regions.", category: "Describes the process" },
              { text: "Households in this community complete the annual review less often than households overall.", category: "Describes the people" },
              { text: "Participants in this group are younger on average than participants overall.", category: "Describes the people" },
              { text: "This community is harder to engage.", category: "Claims more than the data can carry" },
              { text: "Lower completion here reflects cultural attitudes toward formal services.", category: "Claims more than the data can carry" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Put the process sentence first",
            control: "You control which sentence opens the finding, and whether what the division already knows about that step appears in the same paragraph or in a different report nobody reads alongside it.",
            failure: "Do not publish a difference between communities without the operational facts beside it. A gap presented on its own will be explained by whoever reads it, and their explanation will be about the people.",
            next: "Before the next finding goes out, write both sentences, lead with the process one, and add the two things you already know about that step.",
          },
          {
            type: "accordion",
            heading: "Before a finding leaves the building",
            items: [
              { title: "Write the process sentence and keep the number", body: "<p>Rewriting for the process is not softening. The figure stays exactly as it is, the comparison stays, the size of the gap stays. What changes is the subject of the sentence, and therefore who is being asked to do something next.</p>" },
              { title: "Say what the data cannot separate", body: "<p>Administrative records rarely allow you to separate one cause from another. Two counties can differ in travel time, staffing, notice practice, referral relationships and population all at once. Name the things that move together, say plainly that the records cannot tell them apart, and resist the sentence that picks one and calls it the reason.</p>" },
              { title: "Give it back to the people it is about", body: "<p>Share findings with compensated community advisors, people with disabilities and family partners before publication where you can, and after publication where you cannot. Ask what the finding gets wrong, what it leaves out, and how it will read to the people it describes. Then tell them what changed because of what they said.</p>" },
              { title: "Say what happens next, with a date", body: "<p>A finding published with no change attached teaches the people it describes that being counted produces nothing. If nothing will change yet, say that plainly and say when it will be looked at again. That is a worse answer than action and a far better one than silence.</p>" },
            ],
          },
          {
            type: "quote",
            text: "We were shown a slide about our community at a meeting. Nobody in that room had asked us anything before it was made. The number was probably right. What it said underneath was that we do not engage, and it did not say that the letter came in English or that the office closes before most of us finish work. We could have told them that in one afternoon, and we would have expected to be paid for the afternoon, the way anyone else advising a department would be.",
            cite: "Composite community advisor perspective, illustrative",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-33-3-check",
            question: "A chart compares completion rates for each community with the rate for the largest group in the data. What is the most accurate description of that choice?",
            options: [
              { text: "It is the neutral option, because the largest group gives the most reliable baseline.", correct: false },
              { text: "It is a choice that makes one group the standard and every other group a shortfall from it; a comparison with the program's own target, or with the same group over time, often asks a more useful question.", correct: true },
              { text: "It is acceptable as long as the sample sizes for the smaller groups are large enough to be stable.", correct: false },
            ],
            feedbackCorrect: "Yes. The reference point is an argument. Sample size matters as well, and it does not make the choice of baseline neutral.",
            feedbackIncorrect: "Ask what the comparison implies before asking whether it is statistically sound. Whatever sits on the reference line becomes the normal case, and everything else becomes a distance from it.",
          },
          {
            type: "statement",
            body: "A private reflection, for you only and never collected: a finding I have written or repeated with a community as the subject is... the version with our process as the subject would read... and the person or group who should have seen it before it traveled is... You do not have to have written the original to be the person who changes how it is read next time.",
          },
        ],
      },
      {
        id: "ipe-33-4",
        number: 4,
        title: "Your data-interpretation checklist",
        summary: "Six questions to run before a number becomes a decision, short enough that you will actually use them, and written down so they do not depend on who happens to be in the room.",
        minutes: 10,
        learning: {
          objective: "Draft a six-line data-interpretation checklist for one report you produce or rely on, naming when it runs, who runs it, and what happens when a line cannot be answered.",
          takeaways: [
            "The checklist works because it runs at a moment, not because it is comprehensive. Three moments are worth naming: when the question is asked, before the finding is written, and before it is used for a decision.",
            "A line that cannot be answered is the most valuable result the checklist produces. Record it as unknown rather than filling it in, because an unknown that is written down gets fixed and a plausible guess never does.",
            "Run it with at least one person who did not build the number. The blind spots in a set of records are invisible from the inside, and the questions that find them tend to sound naive.",
            "Keep records about numbers and processes, never about people. Nothing in this checklist should become a rating of an analyst, a unit or a county, and nothing a colleague writes in a private reflection is collected.",
          ],
          evidence: "A completed six-line checklist you can copy, a scenario about a check that grew too large to use, and a knowledge check on what to do with a line that cannot be answered.",
          appliedNextStep: "Fill in the six lines for one report you produce or rely on, run them once with someone who did not build the number, and take the unanswerable lines to whoever could answer them.",
        },
        scenario: {
          context: "A DSD unit agrees to try a short interpretation check. The first version has fourteen questions, a scoring sheet and a sign-off line. The analysts run it once and it takes most of an afternoon. Two of the questions turn out to be unanswerable for any report the unit produces. By the third month the check is being completed after the finding has already gone out.",
          prompt: "What is the most useful correction?",
          options: [
            {
              label: "Cut it to six questions, attach it to a specific moment in the work, and drop the scoring sheet and the sign-off line.",
              response: "Short enough to use, tied to a moment so it cannot drift to the end, and with nothing in it that turns into a rating. Six lines answered honestly before a finding is written will change more reports than fourteen answered afterwards.",
              recommended: true,
            },
            {
              label: "Keep the fourteen questions and assign one person to complete the check for the whole unit.",
              response: "This keeps the thoroughness and loses the point. The value sits in the person who did not build the number asking a question out loud while the finding is still being written. One designated completer turns the check into paperwork and parks it on somebody's least welcome afternoon.",
            },
            {
              label: "Keep the check as designed but move it earlier, and remove the two questions nobody can answer.",
              response: "Moving it earlier is right. Removing the unanswerable questions is the mistake. Those two are the most valuable part of the exercise, because a line recorded as unknown is a piece of work somebody can pick up, and a line deleted is a gap nobody will ever see again.",
            },
          ],
        },
        transfer: {
          prompt: "Where would six questions fit in your own week?",
          options: [
            "Name one report or one recurring request you produce or rely on.",
            "Name the moment the check would run: when the question arrives, before the finding is written, or before it is used for a decision.",
            "Name the person who did not build the number and would be willing to ask the questions out loud.",
            "Decide now what you will do with the first line that cannot be answered.",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Short enough that you will use it",
            body: "<p>Most interpretation checks fail for the same reason review stages do, and it is not resistance. It is scope. A unit writes a thorough list, runs it once, discovers it costs an afternoon, and within two months it is being completed after the work it was meant to shape. A check that runs late is a record of what already happened.</p><p>Six lines is roughly the limit of what gets used. They are worth attaching to a moment rather than to a document, because the moment decides what the check can still change. Three moments matter. When a question arrives, the check asks whether the available numbers can answer it. Before a finding is written, it asks what the numbers actually support. Before a number is used for a decision, it asks who is missing and who will read it.</p><p>The point is not to certify a report. It is to make three or four questions ordinary enough that asking them is not heard as an accusation, and to make the unanswerable ones visible instead of quietly filled in.</p>",
          },
          {
            type: "artifact",
            kind: "tagged-document",
            label: "Practical tool",
            title: "A data-interpretation checklist",
            summary: "Six lines to answer before a number becomes a decision, with somewhere to record what you could not answer.",
            fields: [
              { label: "What this number counts, in one sentence", value: "Share of support plans opened with a scheduled date that were completed inside the window, for the tracked workflow only. It does not count referrals that never reached a scheduled date." },
              { label: "Who is missing, and in what pattern", value: "Referrals closed before scheduling are outside the denominator. How many is unknown; a separate report suggests they concentrate in two regions. Recorded as unknown and raised with the workflow owner rather than estimated." },
              { label: "What the categories were built for", value: "Preferred language comes from the intake form and is blank in about a third of records; the template has been reading blank as English, and that default is now stated on the chart. The disability field is the eligibility category and is used here to describe the caseload, not the people." },
              { label: "What the comparison assumes", value: "Each region is compared with the statewide target rather than with the largest region, so no region becomes the standard. The window covers four full quarters before and after the change, and the reason for that window is printed beside the chart." },
              { label: "What the data can and cannot support", value: "Supports: completion differs by region and by number of access points. Cannot separate: travel time, staffing, notice practice and referral relationships move together in these records. No causal sentence appears in the finding." },
              { label: "Who sees it before it travels, and what changes", value: "One colleague who did not build the number, plus compensated community advisors for any finding about a specific community, with their input answered in writing. Change committed: the notice translated, and evening scheduling trialled in two counties, both reviewed at the agreed point." },
            ],
            action: "Copy these six lines, fill them in for one report you produce or rely on, and run them once out loud with someone who did not build the number.",
          },
          {
            type: "accordion",
            heading: "Three ways the checklist fails",
            items: [
              { title: "It becomes a footnote", body: "<p>The lines get answered and the answers stay in a file while the chart travels alone. What catches it: put the first line, what this number counts, on the chart itself in plain words. If it will not fit in a sentence, you have found something worth knowing before anything else happens.</p>" },
              { title: "It becomes a veto", body: "<p>A check with authority to stop work and no service timeline teaches people to route around it. Findings start arriving as decisions already made, and the check hears about them last. What catches it: compare the number of findings that went through the check with the number the division actually published in the same period.</p>" },
              { title: "It becomes a rating", body: "<p>The moment a completed checklist is read as a measure of an analyst, a unit or a county, the answers turn careful and the unknown lines disappear first. What catches it: never attach a name to a result, never total the lines, and say out loud and often that unknown is a good answer.</p>" },
            ],
          },
          {
            type: "list",
            heading: "Worth writing down, and worth leaving alone",
            ordered: false,
            items: [
              "Write down: what the number counts, in one sentence a person outside your unit could repeat.",
              "Write down: the groups that cannot appear in the count, and whether you know how many there are.",
              "Write down: every line you could not answer, marked as unknown rather than filled in.",
              "Write down: the comparison you chose, and why that reference point rather than another.",
              "Write down: what you promised would change, by when, and who was told.",
              "Leave alone: anything that becomes a rating of a person, a unit or a county. It will not improve the numbers; it will reduce what anyone is willing to write down.",
              "Leave alone: anything a colleague wrote in a private reflection. Reflections in this program are not collected and are nobody else's business.",
            ],
          },
          {
            type: "leaderMove",
            heading: "Make unknown a respectable answer",
            control: "You control how the first unanswerable line is received, and whether it is written down as unknown or quietly filled with something plausible.",
            failure: "Do not reward a complete checklist over an honest one. The first time an unknown is treated as a failure, every later checklist will be complete and none of them will be true.",
            next: "The next time a line cannot be answered, write unknown, name who could answer it, and put that question somewhere it will be picked up.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-33-4-check",
            question: "You run the checklist and cannot answer the line about who is missing from the count. What is the most useful thing to do?",
            options: [
              { text: "Estimate the missing group from the records you do have, so the line is complete and the finding can go out.", correct: false },
              { text: "Record the line as unknown, say so in the finding, and name who could answer it.", correct: true },
              { text: "Set the finding aside until the missing group can be counted properly.", correct: false },
            ],
            feedbackCorrect: "Yes. An unknown that is written down is a piece of work somebody can pick up. An unknown that is filled in disappears for good.",
            feedbackIncorrect: "Think about what each option leaves behind. An estimate built from the records you have assumes the missing people resemble the counted ones, which is the least likely thing about them, and holding the finding means the decision gets made without it.",
          },
          {
            type: "statement",
            body: "A private reflection and a commitment, for you only and never collected: the report I would run these six lines on is... the colleague who did not build the number and would ask the questions out loud is... and the line I already know I cannot answer is... Write it where you will see it. If that last line stays unknown for a season, it is not a personal failure. It is the most useful thing this module can hand to whoever owns that part of the process.",
          },
        ],
      },
    ],
  },
  jobAid: {
    title: "Responsible data and evaluation",
    subtitle: "One page for reading, writing and reporting a division number",
    quote: "A number is a record of what we counted. Who never reached the count is the question the number cannot answer and you can.",
    use: {
      purpose: "Keep the six questions in view while you request a figure, read a report, write a finding, or decide what a chart means before it travels.",
      remember: [
        "Ask what the number is a share of before you ask whether it went up.",
        "Every category was built for a purpose; say what it records and what it was built to decide.",
        "A blank field is information about the conversation, not a value you may fill in.",
        "Every difference has a process sentence and a people sentence. Write the process one first.",
        "Unknown, written down, is the most useful answer a check produces.",
      ],
      doNext: "Fill in the six lines for one report you produce or rely on, and run them once with someone who did not build the number.",
    },
    sections: [
      {
        heading: "Before you accept a figure",
        items: [
          "Ask what it is a share of, in one sentence.",
          "Ask what happens to a case that leaves before the measure starts.",
          "Ask who could never appear in it: never referred, never got through a first contact, recorded somewhere else.",
          "Treat no complaints and no requests as findings about the route, not about the experience.",
        ],
      },
      {
        heading: "Before you break a number apart",
        items: [
          "Find the form or rule that defined each category, and who filled it in.",
          "Say what is grouped inside each value, and how large the residual box is.",
          "Count the blanks, and say what the report currently does with them.",
          "Where small numbers must be suppressed, say so, and say what you did instead for those groups.",
        ],
      },
      {
        heading: "Before you write the finding",
        items: [
          "Write both sentences, the one about the people and the one about the process, and lead with the process.",
          "State the comparison, and why that reference point rather than another.",
          "Name what the data cannot separate, and leave the causal sentence out.",
          "Put what the division already knows about that step in the same paragraph.",
        ],
      },
      {
        heading: "Before it travels",
        items: [
          "Put what the number counts on the chart itself, not in a footnote.",
          "Share findings about a community with compensated advisors from it, and answer what they say in writing.",
          "Say what will change and by when, or say plainly that nothing changes yet and when it will be looked at again.",
          "Record unknowns as unknown, and name who could answer them.",
        ],
      },
      {
        heading: "Who this helps",
        items: [
          "Data, research and evaluation staff, who hold most of these questions already and often lack a moment where asking them out loud is expected — a useful place to start.",
          "Quality, compliance and performance staff, whose measures decide what the division notices and what it never sees.",
          "Policy and program staff, who carry a finding into a requirement and then live with what the categories could not show.",
          "Contracts, fiscal, grants and procurement staff, whose reporting requirements decide what data exists at all, and about whom.",
          "Executive and senior leaders, who choose which figure opens a briefing and whether unknown is a respectable answer — a useful place to start.",
        ],
      },
      {
        heading: "Related modules",
        items: [
          "Quality, complaints, and incident learning",
          "Equitable policy and procedure governance",
          "Co-design and compensated partnership",
          "Resource allocation and equity",
          "Leading a reflective DSD team",
        ],
      },
    ],
  },
  sources: [
    { title: "Minnesota Department of Administration, Data Practices Office", href: "https://mn.gov/admin/data-practices/", note: "The state's guidance on the Minnesota Government Data Practices Act, including how data about individuals is classified and what summary data is — the rules behind suppression and release decisions referenced in this module." },
    { title: "Minnesota State Demographic Center", href: "https://mn.gov/admin/demography/", note: "State population estimates and demographic analysis, useful when an administrative count needs a population denominator it cannot supply on its own." },
    { title: "Washington Group on Disability Statistics", href: "https://www.washingtongroup-disability.com/", note: "Internationally used question sets and guidance on how disability is defined and measured in data collection, including what short question sets capture and what they miss." },
    { title: "American Evaluation Association, Guiding Principles for Evaluators", href: "https://www.eval.org/About/Guiding-Principles", note: "Professional principles covering systematic inquiry, competence, integrity, respect for people, and responsibility for the general and public good — the reference behind this module's reporting practices." },
    { title: "U.S. Department of Health and Human Services, National CLAS Standards", href: "https://thinkculturalhealth.hhs.gov/clas", note: "National standards for culturally and linguistically appropriate services, including the standards on collecting and maintaining demographic data, conducting assessments, and partnering with communities." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "Minnesota's advisory council on disability policy, access and rights, and a starting point for disability-led perspectives on how findings about disabled Minnesotans are framed." },
    { title: "PlainLanguage.gov, Federal plain language guidelines", href: "https://www.plainlanguage.gov/guidelines/", note: "Guidance on audience, organization and useful headings, applied here to writing a finding that can be read correctly by people outside the unit that produced it." },
    { title: "Minnesota Framework for Universal Multicultural Instructional Design", href: "https://mncpd.org/wp-content/uploads/2016/12/MN_Framework_for_Universal_Multicultural_Instructional_Design.pdf", note: "The design reference for this curriculum: multiple ways to engage, culturally responsive materials and accessible instruction." },
  ],
};

export default pack;
