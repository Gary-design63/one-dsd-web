import type { CoursePack } from "../../source-types";

// Intercultural Practice and Equity · Foundations · Module 6: Accessible and respectful communication.
// Program-authored for internal DHS and DSD staff. Voluntary, self-directed, no scores and no completion requirement.
const pack: CoursePack = {
  course: {
    id: "ipe-06-accessible-communication",
    indexNumber: 1148,
    seriesLabel: "Intercultural Practice and Equity · Foundations",
    title: "Accessible and Respectful Communication",
    subtitle: "What you write is what most people will ever meet of this work. Four lessons on words, structure, format and timing, ending with one real revision.",
    scope: "For internal DHS and DSD staff who write, edit, approve or send anything: policy and program staff, communications and training staff, administrative and support staff, and anyone whose memo, page, notice or slide deck reaches people outside the unit. Four short lessons you can take in any order and return to. Voluntary and self-directed: no score, no ranking, no completion requirement, and nothing you write in a reflection is collected. Completion here does not count toward DHS-required training credits unless management, a director, or DHS leadership expressly approves an exception.",
    treatment: "Four short lessons with Minnesota examples, scenarios, sorting and flashcard practice, private reflection prompts, and a revision checklist you can copy into your own work",
    duration: "40–45 minutes",
    author: "One DSD — People, Access and Culture",
    coverImage: "/images/covers/from-noticing-to-shifting.jpg",
    coverAlt: "Hands revise a printed form with a red pen.",
    introTranscript: "Most people will never meet the program you administer. They will meet a notice, a web page, a form, a slide at a public meeting, or an email forwarded three times before it reached them. This module is about that meeting point. It covers disability-affirming and plain wording, the structure that lets a message be read aloud or translated, the format choices that quietly decide who is included, and the timing that decides whether anyone can act on what you sent. It ends with a revision pass you run on one real piece of your own work.",
    kind: "course",
    contentType: "foundation",
    learning: {
      objectives: [
        "Explain what makes a public communication usable, and separate the parts that carry a settled obligation from the parts that are practice choices.",
        "Choose disability-affirming, plain wording in internal and public text, and rewrite a sentence so the process, not the person, is the subject.",
        "Apply structural accessibility — headings, link text, alternative text, tables, contrast and captions — before a communication is sent.",
        "Plan translation, interpretation and community review into a communication at drafting time rather than at the end.",
        "Revise one real email, web page, memo or slide deck using a repeatable pass, and record what changed and who else needs to know.",
      ],
      evidence: [
        "Four worked scenarios drawn from policy, quality, engagement and communications work, each with a recommended response and the reasoning behind it.",
        "A knowledge check in every lesson with feedback that explains the usable answer.",
        "Sorting practice that separates respectful plain wording from deficit framing, and structure that helps from structure that blocks.",
        "A completed revision checklist for one real piece of your own work.",
      ],
      appliedNextStep: "Choose one email, web page, memo or slide deck you already own. Run the revision pass on it, send the revised version, and tell the people who use the original what changed.",
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
        "A change in language-access direction under Title VI, or feedback from disabled staff, community reviewers or interpreters that an example reads as unrealistic or disrespectful",
      ],
      relatedDoor: "Formal decisions about an accommodation request, a required notice, a vital-document translation or the accessibility of a published state page belong to the responsible DHS communications, accessibility, language-access and ADA offices; this module prepares your draft, it does not approve or clear it.",
      toolkitQuestion: "Does this make sense to someone who does not already know how DHS works, and who is left out if the answer is no?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "ipe-06-1",
        number: 1,
        title: "The message is the service",
        summary: "For most people, the notice is the policy. What decides whether a message arrives, and which parts of that are settled obligations rather than preferences.",
        minutes: 11,
        learning: {
          objective: "Explain what makes a public communication usable — words, structure, format, timing and channel — and name which parts of your own communications carry a settled obligation and which are practice choices.",
          takeaways: [
            "Communication is not the wrapper around the decision. A service change a person cannot read, on a page they cannot use, sent after it takes effect, is a service change they cannot act on.",
            "Five things decide whether a message arrives: the words, the structure, the format, the timing and the channel. Most failures are structure and timing, not vocabulary.",
            "Some of this is settled: effective communication and auxiliary aids under the Americans with Disabilities Act, accessible state digital content under Minnesota's standard, and meaningful access for people with limited English proficiency under Title VI. Meeting the minimum is the floor of the work, not the ceiling.",
            "The rest is practice, and practice is where most of the difference is made: sending materials early, saying plainly what changes and for whom, and asking the people affected what would have helped.",
          ],
          evidence: "A scenario about a public update to a service change, and a knowledge check that separates a settled obligation from a practice choice.",
          appliedNextStep: "Take the last thing you sent outside your unit and mark which of the five — words, structure, format, timing, channel — you actually decided on purpose, and which one simply happened.",
        },
        scenario: {
          context: "A Disability Services Division policy unit has finished a change to how a service is authorized. The unit plans to publish the county-facing memo as a scanned PDF on a public page, on the day the change takes effect, under the heading “Service Authorization Policy Update.” The memo is accurate, cites the governing authority in full, and was written for county staff who already know the program.",
          prompt: "What should the unit do before this goes out?",
          options: [
            {
              label: "Publish as planned. The memo is accurate, complete and properly cited, and the audience is county staff who understand the terms.",
              response: "Accuracy is necessary and not sufficient. A scanned page cannot be read aloud, searched or translated; the effective date has already passed for anyone reading it; and people affected by the change will find this page too, whatever audience it was written for.",
            },
            {
              label: "Keep the memo for the technical audience, and add a short plain-language summary as real text on the page: what is changing, who it affects, when, and what a person needs to do. Publish before the effective date, with headings, working link text and a named contact, and route it for translation and accessible formatting.",
              response: "This is the recommended path. The technical document is preserved for the people who need it, a usable version exists for everyone else, and the timing gives people room to act. None of it changes the policy; it changes whether the policy can be used.",
              recommended: true,
            },
            {
              label: "Publish as planned and add a line offering an accessible or translated version on request.",
              response: "An on-request line is a useful addition and a poor substitute. It puts the work of getting in on the person who is already outside, and it produces a version days later for someone who needed it on the day. Build the usable version first, then keep the offer for what you could not anticipate.",
            },
          ],
        },
        transfer: {
          prompt: "Think about the last communication your unit sent to people outside it. Which of the five decisions was made by default rather than on purpose?",
          options: [
            "Name the communication and the audience you actually had in mind while writing it",
            "Identify which of the five — words, structure, format, timing, channel — nobody decided",
            "Write the one change you would make if you were sending it again next week",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Most people meet the paperwork, not the program",
            body: "<p>A person rarely encounters public administration directly. They encounter a letter, a web page, a form, a phone tree, a slide at a public meeting, an email forwarded three times before it reached them. Whatever care went into the policy behind it, that artifact is the part they can act on. When it is unreadable, badly timed or written for an audience they are not in, the policy is effectively closed to them, and the closure looks like their failure rather than ours.</p><p>This is why communication belongs in the same conversation as program design, contracting and oversight rather than at the end of it. The decision about whether a summary exists, whether a page is real text, whether a notice goes out before or after an effective date, and whether anyone can reach a person to ask a question is a decision about who can use a public program. It is made by staff, usually quickly, often by default.</p><p>The useful news is that these decisions are ordinary and inside your reach. You are not being asked to become an accessibility specialist. You are being asked to make five decisions on purpose instead of by habit.</p>",
          },
          {
            type: "tabs",
            heading: "Five decisions inside every communication",
            tabs: [
              { label: "Words", body: "<p>Whether the reader can understand the first time through. Short sentences, familiar terms, the specific action named, jargon either avoided or defined where it appears. Plain wording is not simplified content; it is the same content, arranged so that it lands.</p>" },
              { label: "Structure", body: "<p>Real headings, short sections, lists where the content is a list, link text that says where it goes, tables used for data rather than layout. Structure is what lets a person using a screen reader move through a document, what lets a busy reader skim, and what lets a translator work accurately.</p>" },
              { label: "Format", body: "<p>Text that can be selected, read aloud, searched and translated, rather than an image of text. A slide deck is not a report. A scanned document is a picture of information. The format you choose decides which tools the reader is allowed to bring.</p>" },
              { label: "Timing", body: "<p>Whether there is time to act, to ask a question, to arrange an interpreter, to get a translated version, to bring the notice to someone who helps them read it. A perfect notice that arrives on the effective date has already failed.</p>" },
              { label: "Channel", body: "<p>Mail only, email only, a page nobody links to, an announcement inside a system a person cannot sign into. Channel decides who ever learns the thing exists, which is the barrier that leaves no trace, because the people it stops never appear in your records.</p>" },
            ],
          },
          {
            type: "accordion",
            heading: "What is settled, and what is yours to choose",
            items: [
              { title: "Effective communication under the Americans with Disabilities Act", body: "<p>Under Title II, state and local government must communicate as effectively with people with disabilities as with everyone else, which can require auxiliary aids and services such as interpreters, captioning, large print, braille or accessible electronic formats. Guidance directs public entities to give primary consideration to what the person says works for them. This is a duty of the organization, not a favor, and it does not wait for someone to prove a need.</p>" },
              { title: "Accessible digital content", body: "<p>Minnesota's accessibility standard for state digital content follows the Web Content Accessibility Guidelines, and federal requirements for state and local government web content and mobile applications point to the same guidelines. Pages, documents, forms and recorded material published by a state agency are covered. Section 508 guidance gives practical steps for producing accessible documents and slide decks with the tools you already have.</p>" },
              { title: "Meaningful access for people with limited English proficiency", body: "<p>Under Title VI of the Civil Rights Act, programs receiving federal financial assistance take reasonable steps to provide meaningful access, which includes interpretation at no cost to the person and translation of vital documents. National standards for culturally and linguistically appropriate services go further and treat language assistance as part of quality, not as an accommodation bolted on at the end.</p>" },
              { title: "What is practice rather than obligation", body: "<p>Sending materials two working days early. Writing a plain-language summary alongside the technical text. Naming a real person as the contact. Asking community reviewers, disabled Minnesotans, families and interpreters what would have helped, and paying them for that expertise. Telling people what changed because of what they said. None of this is required of you. All of it is the difference between a program that technically communicates and one that is actually usable.</p>" },
            ],
          },
          {
            type: "leaderMove",
            heading: "Decide the five, do not inherit them",
            control: "You control the words, the structure, the format, the timing and the channel of anything you draft, long before anyone reviews it.",
            failure: "Do not treat accessibility as a check someone else runs at the end. By then the format is set, the deck is built, the date has passed, and the only honest fix is to redo the work.",
            next: "On your next draft, write the five decisions at the top of the page and answer them before you write the body. Delete the line before you send.",
          },
          {
            type: "flashcards",
            heading: "Keep these in reach",
            cards: [
              { front: "Why does the notice matter as much as the policy?", back: "<p>Because the notice is the only part most people will ever meet. If it cannot be read, found or acted on in time, the policy behind it is closed to them.</p>" },
              { front: "What are the five decisions?", back: "<p>Words, structure, format, timing and channel. Most communication failures come from structure and timing rather than vocabulary.</p>" },
              { front: "What does primary consideration mean?", back: "<p>When a person tells you what form of communication works for them, that preference carries weight and is given primary consideration rather than being overridden by what is convenient to provide.</p>" },
              { front: "Is an on-request accessible version enough?", back: "<p>It is a useful backstop and a poor default. It moves the work onto the person already excluded and delivers late. Build the usable version first.</p>" },
              { front: "Where does the floor end?", back: "<p>Obligations set the minimum. Early materials, plain summaries, a named contact, and paid community review are practice choices that decide whether the minimum ever becomes usable.</p>" },
            ],
          },
          {
            type: "knowledgeCheck",
            id: "ipe-06-1-check",
            question: "A program manager says: “We meet the standard — the page passed an accessibility check, so the communication part is done.” What is the most accurate response?",
            options: [
              { text: "Correct. A passing accessibility check is the measure of whether a communication works.", correct: false },
              { text: "A passing check covers part of structure and format. It says nothing about whether the words are understandable, whether the notice arrived in time to act, or whether the people affected ever learned the page exists.", correct: true },
              { text: "The check is unnecessary; if the writing is clear, the technical standard does not matter much.", correct: false },
              { text: "Accessibility checks apply to public pages only, so internal communications need none of this.", correct: false },
            ],
            feedbackCorrect: "Yes. A technical check is one of five decisions. Clear words, workable timing and a channel people actually use are not tested by it.",
            feedbackIncorrect: "Walk the five decisions: words, structure, format, timing, channel. An accessibility check speaks to two of them at most.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you and not collected anywhere: how might my role, my authority and my everyday language shape what I assume a reader already knows?",
          },
        ],
      },
      {
        id: "ipe-06-2",
        number: 2,
        title: "Words that respect people",
        summary: "Disability-affirming language, the euphemisms that get in the way, and the grammar that quietly puts the person on trial instead of the process.",
        minutes: 11,
        learning: {
          objective: "Choose disability-affirming, plain wording in internal and public text, and rewrite a sentence so the process, not the person, is the subject.",
          takeaways: [
            "Preferences differ and both main patterns are respectful: many people say “disabled person,” many say “person with a disability.” Ask when you can ask, follow the person or community you are writing with, and stay consistent within a document.",
            "Euphemisms such as “special needs” and “differently abled,” and pity or admiration framing, are not gentler. They obscure what is actually being described and most disabled adults do not use them about themselves.",
            "Deficit grammar hides the organization. “Participants failed to respond” names a person; “the notice went out by mail only, with a fourteen-day window” names a process someone can fix.",
            "Wording in an internal memo does not stay internal. It travels into forms, letters, county practice, contract language and the record, and it sets what the next writer treats as normal.",
          ],
          evidence: "A scenario about a report finding, sorting practice that separates plain respectful wording from deficit framing and euphemism, and a knowledge check on rewriting a sentence.",
          appliedNextStep: "Search your last three memos or notes for “failed to,” “refused,” “non-compliant,” “special needs” and “unable,” and rewrite each sentence so the process is the subject and an owner is visible.",
        },
        scenario: {
          context: "A quality and performance unit is finishing a summary of renewal completion for a service. The draft finding reads: “Many participants with intellectual disabilities are unable to complete the renewal form and fail to respond within the deadline.” The form itself is nine pages of legal wording, mailed once, with a fourteen-day return window and no phone or online option.",
          prompt: "Which revision is both more accurate and more respectful?",
          options: [
            {
              label: "“Many participants with special needs require assistance to complete the renewal form.”",
              response: "The euphemism softens the sentence without changing what it claims. The person is still the site of the problem, the nine-page form is still invisible, and nothing in the finding can be acted on by the unit that owns the form.",
            },
            {
              label: "“The renewal form is nine pages of legal wording, mailed once, with a fourteen-day return window and no phone or online option. Most people who did not return it were never sent a version they could use.”",
              response: "This is the recommended revision. It is more accurate, because it describes what the unit can verify; it is more respectful, because it stops describing people as failing; and it is more useful, because the finding now points at something the organization owns and can change.",
              recommended: true,
            },
            {
              label: "Keep the original finding and add a footnote that participants may request help completing the form.",
              response: "The footnote leaves the finding aimed at people and adds one more thing a person must know to ask for. A reader of this report will conclude that the population is the problem, and the form will survive another cycle untouched.",
            },
          ],
        },
        transfer: {
          prompt: "Where does your team's standard wording put the person on trial?",
          options: [
            "Collect three sentences from templates, notes or reports that describe people as unable, refusing or failing",
            "Rewrite each so the process is the subject and the owner of that process is visible",
            "Offer the rewrites to the team as a small change to the template, not as a correction of a colleague",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Two respectful patterns, one discourtesy",
            body: "<p>Staff often ask which is correct: “disabled person” or “person with a disability.” Both are used widely and respectfully. Identity-first wording is common among disabled adults, Deaf and autistic communities in particular, and carries the claim that disability is part of who someone is rather than a misfortune attached to them. Person-first wording is common in health, education and human-services writing and is the default in much government text. Neither is a trap.</p><p>The discourtesy is not choosing the wrong one. It is refusing to find out, or overriding what someone has told you about themselves. When you are writing with or about a specific person, group or organization, use what they use. When you are writing general public text, pick the pattern your program and the communities you work with use, say so in your style notes, and stay consistent through the document rather than alternating to seem balanced.</p><p>Underneath the label question sits a larger one: what the sentence claims. A respectful noun in a sentence that still treats a person as the defect has not improved much. That is where most of the work is.</p>",
          },
          {
            type: "accordion",
            heading: "Wording that carries more weight than writers expect",
            items: [
              { title: "“Special needs” and “differently abled”", body: "<p>Both were introduced to be kind and are now largely rejected by disabled adults, who describe them as vague and infantilizing. They also hide the specific thing being discussed. A person does not have special needs; they need a document in large print, a longer appointment, or a ramp. Name the actual need and the sentence becomes both more respectful and more useful.</p>" },
              { title: "“Suffers from,” “confined to a wheelchair,” “victim of”", body: "<p>These add a judgment about someone's life that the writer is not in a position to make. A wheelchair is mobility, not confinement. Write “uses a wheelchair,” “has multiple sclerosis,” “had a stroke.” Neutral description is the professional standard and the respectful one at the same time.</p>" },
              { title: "“High-functioning,” “low-functioning,” “severe”", body: "<p>Functioning labels flatten a person into a rank and predict badly. They lead to under-support for people judged capable and to withheld choice for people judged not. Where a document needs to describe support, describe the support: “needs a written summary after a verbal conversation,” “communicates using a device,” “needs a quiet room for a long appointment.”</p>" },
              { title: "“The disabled,” “the deaf,” “the LEP population”", body: "<p>Collapsing people into a category noun, and especially into an acronym, makes a group of Minnesotans sound like a caseload line. Write “disabled Minnesotans,” “Deaf community members,” “people who speak Somali or Hmong at home,” or better, name the specific community you mean. Acronyms invented for data collection should not be how the public hears about themselves.</p>" },
              { title: "Inspiration and pity framing", body: "<p>“Despite her disability, she manages a full-time job” and “these vulnerable individuals” do the same thing from opposite directions: both set the reader above the person described. Public administration writing does not need either. State what happened, what the program does, and what a person can do next.</p>" },
            ],
          },
          {
            type: "text",
            heading: "The grammar that hides the organization",
            body: "<p>Read enough program writing and a pattern appears. When something goes well, the agency is the subject: “the division implemented,” “the team delivered.” When something goes badly, the subject shifts to the person: “clients failed to submit,” “providers did not comply,” “the family refused services.” The passive voice does similar work with no subject at all: “the notice was not returned.”</p><p>This is rarely anyone's intention. It is inherited style, and it has consequences. A finding written that way cannot be acted on, because no part of the organization is named in it. It shapes how the next reader — a supervisor, a legislator, a county partner — understands who needs to change. And it accumulates: the framing in a memo becomes the framing in a report, then in a contract requirement, then in how a worker describes someone in a note.</p><p>The repair is mechanical. Ask what actually happened, name the process step, and name the owner. “The family refused services” becomes “the only appointment offered was at 9 a.m. on a weekday, forty miles away, and no interpreter was arranged; the family did not attend.” The second sentence is longer, truer and fixable.</p>",
          },
          {
            type: "sorting",
            id: "ipe-06-2-sort",
            heading: "Plain and respectful, deficit framing, or euphemism?",
            categories: ["Plain and respectful", "Deficit framing to rewrite", "Euphemism or judgment"],
            items: [
              { text: "The renewal form is nine pages of legal wording with a fourteen-day mailed window.", category: "Plain and respectful" },
              { text: "Participants failed to respond to the notice.", category: "Deficit framing to rewrite" },
              { text: "Adults with special needs in our service population.", category: "Euphemism or judgment" },
              { text: "Jamal uses a screen reader and asks for documents as tagged files or plain text.", category: "Plain and respectful" },
              { text: "The family refused the offered service.", category: "Deficit framing to rewrite" },
              { text: "Despite being confined to a wheelchair, she serves on the advisory committee.", category: "Euphemism or judgment" },
              { text: "No interpreter was arranged for the appointment, and the appointment was not rescheduled.", category: "Plain and respectful" },
              { text: "These vulnerable individuals are unable to navigate the process.", category: "Euphemism or judgment" },
            ],
          },
          {
            type: "quote",
            text: "I read the report about my own service. I was a line about people who fail to respond. Nobody asked whether the letter was readable. It was not, and I did answer, twice, by phone, to a number that did not take messages.",
            cite: "Composite community reviewer perspective, illustrative",
          },
          {
            type: "leaderMove",
            heading: "Make the process the subject",
            control: "You control the grammar of every finding, note and memo you draft, and the templates your unit reuses without thinking.",
            failure: "Do not correct a colleague's wording in front of others, and do not treat this as a vocabulary rule. The point is accuracy: a sentence aimed at a person cannot be acted on by the organization that owns the form.",
            next: "Before your next finding goes out, take one sentence with a person as the subject, rewrite it around the process step, and name who owns that step.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-06-2-check",
            question: "A draft bulletin reads: “Providers serving the special needs population must ensure clients who are unable to read complete the attached form.” Which revision is strongest?",
            options: [
              { text: "“Providers serving individuals with special needs must ensure that clients unable to read receive assistance with the attached form.”", correct: false },
              { text: "“The attached form is available in large print, plain language and translated versions, and by phone. Tell people which options exist and record the one they choose.”", correct: true },
              { text: "“Providers must ensure that all differently abled clients are supported to complete the attached form.”", correct: false },
              { text: "“Clients who cannot complete the form independently should request accommodation from their provider.”", correct: false },
            ],
            feedbackCorrect: "Yes. The euphemism is gone, nobody is described as unable, and the sentence now names what the organization provides and what the reader does next.",
            feedbackIncorrect: "Check three things: does it still use a euphemism, does it still describe people as unable, and does it say what the organization actually provides? The strongest revision fixes all three.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you: read one paragraph you wrote this month as if you were the person it describes. What would you want changed before it reached a report, a contract or a file?",
          },
        ],
      },
      {
        id: "ipe-06-3",
        number: 3,
        title: "Design so it arrives",
        summary: "Headings, link text, alternative text, contrast and captions; what format choices quietly decide; and how translation and interpretation get planned at drafting time instead of the day before.",
        minutes: 11,
        learning: {
          objective: "Apply structural accessibility to a document, page or deck before it is sent, and plan translation, interpretation and community review into the drafting schedule rather than the last step.",
          takeaways: [
            "Structure is not decoration. Real headings, short sections, genuine lists, meaningful link text and data tables are what let a screen reader, a skimming reader and a translator all use the same document.",
            "Format decides which tools a reader may bring. Text inside an image cannot be read aloud, enlarged cleanly, searched or translated; a scanned document is a picture of information.",
            "Language access is a drafting decision. Short sentences, defined terms, no idioms, and enough calendar time for translation and community review determine whether a translated version is accurate or merely exists.",
            "Interpreters and captioners are colleagues with a job to do. Materials, names, acronyms and the agenda in advance are the difference between interpretation and improvisation.",
            "Writing the same way for every audience can feel fair and land as exclusion. Adapting the form of a message while keeping its substance intact is the move from minimization toward adaptation.",
          ],
          evidence: "A scenario about preparing a public engagement session, sorting practice on structure that helps and structure that blocks, and a knowledge check on alternative text and link wording.",
          appliedNextStep: "Run the ten-minute check on one page or document you own: headings pane, keyboard-only pass, link text read alone, contrast, and any text trapped inside an image.",
        },
        scenario: {
          context: "A communications and training staff member is preparing a public listening session for a Disability Services Division initiative. Two interpreters and live captioning are arranged. The slide deck is nearly final: dense slides with the key points in a screenshot of a table, light grey text on white, a bulleted agenda in an image, and three links written as “click here.” The plan is to send the deck to the interpreters the morning of the session and to post it afterward.",
          prompt: "What matters most to fix first?",
          options: [
            {
              label: "Post the deck afterward as planned and rely on the interpreters and captioning during the session, since anyone who needs the content can ask for it later.",
              response: "The interpreters are being asked to render specialized terms and names they have not seen, the captioners have no reference list, and anyone who wanted to prepare or follow along has nothing. The access services were arranged and then set up to fail.",
            },
            {
              label: "Send the deck and a term-and-name list to the interpreters and captioners several days ahead; replace the screenshot table and the image agenda with real text; fix the contrast; write link text that names the destination; and post the deck as an accessible file before the session, not after.",
              response: "This is the recommended path. Every fix is small, and together they decide whether the session's content is available to people in the room, people at home, the interpreters working it and anyone reading later.",
              recommended: true,
            },
            {
              label: "Simplify the deck to a handful of words per slide and present the details verbally, so nothing on screen is hard to read.",
              response: "Stripping the slides moves the whole content into speech, which is the one channel some participants cannot use, and leaves the interpreters with even less to work from. Reduce density, but keep the substance available as real text.",
            },
          ],
        },
        transfer: {
          prompt: "Pick one document, page or deck you sent in the last month and run it against the ten-minute check.",
          options: [
            "Open the headings pane and see whether the headings are real or just large bold text",
            "Put the mouse aside and move through it with the keyboard alone, watching where the focus goes",
            "Read the link text and the alternative text out loud with nothing else around them and see whether they still mean anything",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Structure is what makes content portable",
            body: "<p>A well-structured document is one that can be taken apart and used in ways you did not plan. A screen reader can jump heading to heading. A person with low vision can enlarge it without the layout collapsing. A translator can work section by section without guessing what belongs together. A colleague can skim it in ninety seconds and find the part they need. None of that depends on how it looks; it depends on whether the structure is real.</p><p>Real means using the tools rather than imitating them. A heading made by making text big and bold is not a heading; it looks like one and behaves like nothing. A list made by typing dashes is not a list. A table used to line up a page layout tells a screen reader there is data where there is none. The fix takes seconds in the software you already use, and it is the single highest-value habit in this module.</p><p>Link text works the same way. Many people navigate by pulling up a list of the links in a page, which arrives stripped of the sentences around it. A page of links all reading “click here” or “more information” is a page of doors with no signs. Write the destination into the link: “read the service authorization summary” rather than “click here to read more.”</p>",
          },
          {
            type: "tabs",
            heading: "Four things people send, and what each one needs",
            tabs: [
              { label: "Email", body: "<p>Put the ask in the first two lines, with the date and what you need. Use real headings if the message is long. Do not put the content in an attached image or a screenshot of a table. If an attachment matters, say what is in it. Long threads bury decisions; send the decision as its own message.</p>" },
              { label: "Web page", body: "<p>Real headings in order, short sections, link text that names the destination, alternative text on images that carry meaning, and no key information available only inside a PDF. If a document must be posted, post an accessible version and summarize the essentials on the page itself.</p>" },
              { label: "Memo or report", body: "<p>Lead with what changed, for whom and when. Headings that describe rather than number. Terms defined where they first appear. Tables for data, with header rows marked. A plain-language summary at the top costs a paragraph and reaches everyone who will never read page nine.</p>" },
              { label: "Slide deck", body: "<p>Slides are prompts, not the record. Text as text, not screenshots. One idea per slide, generous contrast, no information carried by color alone. Send the deck ahead to interpreters and captioners with a list of names and acronyms, and post an accessible version with the detail the slides left out.</p>" },
            ],
          },
          {
            type: "list",
            heading: "A ten-minute check anyone can run",
            ordered: true,
            items: [
              "Open the headings or navigation pane. If it is empty or the order jumps around, the headings are not real.",
              "Put the mouse aside. Move through the page or document with the keyboard alone and watch whether you can see where you are and reach everything.",
              "Read the link text on its own, away from its sentence. Does it say where it goes?",
              "Look for text inside images and screenshots. Move it into real text, and write alternative text for images that carry meaning.",
              "Check contrast between text and background, and whether anything depends on color alone to be understood.",
              "For anything recorded, confirm captions exist and are accurate, and that a transcript is available.",
              "Read the first paragraph as someone who has never heard of your program. If it does not say what this is and what to do, rewrite it.",
            ],
          },
          {
            type: "text",
            heading: "Language access is decided while you draft",
            body: "<p>Translation is often treated as a final step: finish the document, hand it over, wait. That sequence produces late, expensive and often inaccurate translated versions, because the source text was never written to be translated. Idioms, long stacked clauses, undefined program terms and unexplained acronyms all break in translation, and a translator with no context will produce something fluent and wrong.</p><p>Writing translation-ready English costs nothing and improves the English version too. Keep sentences short and one idea to a sentence. Define a program term at first use. Avoid idioms and sports metaphors. Avoid acronyms, or spell them out and keep a list. Leave room in the layout, because many languages run longer than English. Then plan the calendar: vital documents need time for translation and for review by people who speak the language and know the program, and that review is expert work that should be paid.</p><p>Interpreters need the same foresight. Send the agenda, slides, names and terms in advance; tell them the format and who is speaking; and build in pauses. A staff member who speaks quickly through a dense slide has not been interpreted so much as summarized.</p><p>There is a habit worth naming here. Treating everyone identically — one version, one format, one channel, because that feels fair — is the most common way a well-meaning unit excludes people. It is what minimization looks like in daily practice: the differences are real, but the design does not see them. Adapting the form of a message while keeping its substance intact is what moves the work toward acceptance and adaptation.</p>",
          },
          {
            type: "sorting",
            id: "ipe-06-3-sort",
            heading: "Helps the message arrive, or blocks it?",
            categories: ["Helps the message arrive", "Blocks the message"],
            items: [
              { text: "Headings applied with the heading styles, in order.", category: "Helps the message arrive" },
              { text: "The key dates shown only in a screenshot of a spreadsheet.", category: "Blocks the message" },
              { text: "Link text that names the destination page.", category: "Helps the message arrive" },
              { text: "Light grey body text on a white background.", category: "Blocks the message" },
              { text: "A term list and the agenda sent to interpreters three days ahead.", category: "Helps the message arrive" },
              { text: "Required steps marked only by a red highlight.", category: "Blocks the message" },
              { text: "A plain-language summary at the top of a technical report.", category: "Helps the message arrive" },
              { text: "A recorded briefing posted with automatic captions nobody corrected.", category: "Blocks the message" },
            ],
          },
          {
            type: "flashcards",
            heading: "Small rules worth memorizing",
            cards: [
              { front: "What makes a heading a heading?", back: "<p>Using the heading style, not making text large and bold. Real headings create the structure people navigate by and translators work from.</p>" },
              { front: "What belongs in alternative text?", back: "<p>What the image conveys in this context, in a sentence. If the image is decorative, mark it as decorative. If it contains text, move that text into the document.</p>" },
              { front: "What is wrong with “click here”?", back: "<p>Many people pull up the links alone, without the surrounding sentence. Link text has to name where it goes on its own.</p>" },
              { front: "Why avoid color as the only cue?", back: "<p>Color alone is invisible to some readers and disappears in print, on a projector and in high-contrast settings. Pair it with text or a symbol readers can name.</p>" },
              { front: "What do interpreters need in advance?", back: "<p>The agenda, the slides, the names, the acronyms and the specialized terms, several days ahead. Advance materials are the difference between interpretation and improvisation.</p>" },
              { front: "What makes text translation-ready?", back: "<p>Short sentences, one idea each, defined terms, no idioms, few acronyms, and enough calendar time for translation and paid community review.</p>" },
            ],
          },
          {
            type: "knowledgeCheck",
            id: "ipe-06-3-check",
            question: "A public page includes a chart image showing three service categories and their timelines, with alternative text reading “chart,” and a link reading “click here for details.” What is the most complete fix?",
            options: [
              { text: "Change the alternative text to “chart showing service categories” and leave the link as it is.", correct: false },
              { text: "Describe what the chart shows in the alternative text or nearby text, provide the same information as real text or a marked-up table, and rewrite the link to name its destination.", correct: true },
              { text: "Remove the chart, since images create accessibility problems.", correct: false },
              { text: "Add a note at the bottom of the page offering an accessible version on request.", correct: false },
            ],
            feedbackCorrect: "Yes. The information has to exist outside the image, the alternative text has to carry meaning, and link text has to work when read alone.",
            feedbackIncorrect: "Ask what a person gets if the image never loads and the links are read without their sentences. The information must exist as real text, and the link must name where it goes.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you: in the last thing you designed or sent, who could have been helped, burdened, excluded or misunderstood — and whose expertise was missing from the room while it was being written?",
          },
        ],
      },
      {
        id: "ipe-06-4",
        number: 4,
        title: "Revise one thing",
        summary: "A repeatable pass you can run on one real email, web page, memo or slide deck, with a checklist to copy, a worked before-and-after, and a private reflection.",
        minutes: 10,
        learning: {
          objective: "Revise one real email, web page, memo or slide deck using a repeatable pass, and record what changed and who else needs to know.",
          takeaways: [
            "One revision done well teaches more than a policy about revisions. Pick something real, currently in use, and yours to change.",
            "The pass runs in a fixed order — purpose, words and framing, structure and format, language access and timing, then what changed — because fixing wording inside the wrong format wastes the effort.",
            "Say what changed and why when you send the revised version. That is what turns a personal edit into a template other people reuse.",
            "Some findings are not yours to fix. Route those to the office that owns them with the specific sentence, the page and what you would change, rather than a general concern.",
          ],
          evidence: "A worked before-and-after revision, a checklist to copy into your own work, and a knowledge check on a complete revision note.",
          appliedNextStep: "Run the pass on one thing this week. Send the revised version, tell the people who use the original what changed, and hand anything outside your control to the office that owns it with your suggested wording attached.",
        },
        scenario: {
          context: "An administrative staff member maintains the standard email their unit sends when a scheduled public meeting moves. It reads: “Per the attached notice, the previously scheduled stakeholder engagement session referenced below has been rescheduled due to unforeseen circumstances. Impacted parties requiring accommodations should notify the undersigned at their earliest convenience.” The attachment is a scanned memo, and the email goes out two days before the new date.",
          prompt: "How should the revision start?",
          options: [
            {
              label: "Rewrite the wording into plain English and keep the rest as it is, since the format and timing were set by someone else.",
              response: "The plain rewrite is real progress and it stops short. A clear sentence attached to a scanned memo, arriving two days out, still reaches nobody who needs an interpreter, a translated version or a ride arranged.",
            },
            {
              label: "Start with what this message is for and who receives it, then fix the wording, then move the essentials out of the scanned attachment into the email itself, then set a sending time that leaves people room to arrange what they need — and note who owns each change.",
              response: "This is the recommended path. Running the pass in order keeps the effort from being spent twice, and separating what you own from what someone else owns turns the rest into a specific, routable request rather than a complaint.",
              recommended: true,
            },
            {
              label: "Add a standard accessibility statement to the bottom of the template and leave the message as it is.",
              response: "A statement at the bottom of an unreadable message is a promise made in a place people cannot reach. Fix the message first; the offer belongs there too, but it is not the repair.",
            },
          ],
        },
        transfer: {
          prompt: "What will you revise, and who will hear about it?",
          options: [
            "Name the one email, page, memo or deck you will run the pass on, and the day you will do it",
            "Name the colleague or team who uses it, and how you will tell them what changed",
            "Name the one finding that is not yours to fix, and the office you will send it to with your suggested wording",
          ],
        },
        blocks: [
          {
            type: "text",
            heading: "Pick something small, real and yours",
            body: "<p>The temptation at the end of a module like this is to write a plan for improving everything your unit sends. Do not. Pick one thing that is currently in use, that you can change without anyone's permission, and that reaches people outside your team: the standing email, the page you maintain, the memo template, the deck you present twice a year. One finished revision creates something colleagues can copy. A plan creates a document.</p><p>Run the pass in order. Purpose first, because a message with an unclear purpose cannot be fixed by better sentences. Words and framing next. Then structure and format, because moving content into real text often changes the wording again. Then language access and timing, which are calendar decisions more than writing decisions. Finish by writing down what changed, so the next person inherits the reasoning rather than repeating the discovery.</p><p>Here is the pass applied to one line. Before: “Impacted parties requiring accommodations should notify the undersigned at their earliest convenience.” After: “Tell us what you need to take part — an interpreter, captioning, large print, a translated copy, or something else. Email Dana Olsen or call the number below by the Friday before the meeting, and we will arrange it.” Same offer, named person, real deadline, examples that tell the reader what is actually available.</p>",
          },
          {
            type: "artifact",
            kind: "tagged-document",
            label: "Practical tool",
            title: "A communication revision checklist",
            summary: "One page you can copy into your own work and run on a single email, web page, memo or slide deck.",
            fields: [
              { label: "What this is and who it is for", value: "Name the piece, its audience, and the one thing a reader should be able to do after reading it. If you cannot write that sentence, the revision starts there. Example: standing email announcing a moved public meeting; anyone who planned to attend; the reader should know the new date and how to arrange what they need to take part." },
              { label: "Words and framing", value: "First read, plain meaning: what changes, for whom, when, what to do. Program terms defined at first use, acronyms spelled out or removed. No euphemisms, no functioning labels, no sentences that put a person on trial for a process problem. A named contact, not “the undersigned.”" },
              { label: "Structure and format", value: "Real headings in order; genuine lists; tables for data with header rows marked; link text that names its destination; alternative text on images that carry meaning; nothing essential trapped in a screenshot, a scanned page or color alone; readable contrast; captions and a transcript for anything recorded." },
              { label: "Language access and timing", value: "Short sentences and no idioms so the text can be translated accurately. Translated versions and formats planned on the calendar, not requested at the end. Interpreters and captioners sent the agenda, names and terms in advance. The message sent early enough that a reader can still arrange what they need." },
              { label: "What changed and who needs to know", value: "Two or three lines naming what you changed and why, sent with the revised version to the people who use it. List anything outside your control — a system-generated notice, a locked template, a page another office owns — with the exact sentence, where it appears and the wording you suggest, routed to that office." },
            ],
            action: "Copy the five fields into a blank page, fill them in against one real piece of your own work this week, make the changes you own, and send the last field to whoever owns the rest.",
          },
          {
            type: "list",
            heading: "Revisions that need nobody's permission",
            ordered: false,
            items: [
              "Move the essentials out of an attachment and into the message itself.",
              "Replace “click here” with link text that names the destination.",
              "Apply real heading styles to a document you already maintain.",
              "Replace a screenshot of a table with the table as real text.",
              "Name a person and a real deadline instead of “at your earliest convenience.”",
              "Add one line inviting people to say what they need to take part, with examples of what is available.",
              "Send the meeting materials two working days early instead of the morning of.",
              "Write a short plain-language summary at the top of a technical document.",
            ],
          },
          {
            type: "leaderMove",
            heading: "Ship the revision, then hand off the rest",
            control: "You control the pieces you write and maintain, and you control how precisely you describe the pieces you do not.",
            failure: "Do not stall the revision you can make while waiting on a decision about the system-generated notice. And do not send a general concern upward; a vague message about accessibility lands nowhere and comes back as a question.",
            next: "Make your changes, send the revised version with two lines saying what changed, and route each remaining finding as a specific sentence with suggested wording to the office that owns it.",
          },
          {
            type: "knowledgeCheck",
            id: "ipe-06-4-check",
            question: "You have revised your unit's standing notice and found that the automated confirmation message, owned by another office, is unreadable. Which handoff is most likely to result in a fix?",
            options: [
              { text: "A message asking the other office to review their automated notices for accessibility.", correct: false },
              { text: "A message naming the exact notice, quoting the sentence and where it appears, describing what a reader cannot do with it, offering suggested replacement wording, and asking who owns the change.", correct: true },
              { text: "Adding a line to your own notice warning people that the confirmation message may be hard to read.", correct: false },
              { text: "Raising it at the next all-staff meeting so everyone is aware of the problem.", correct: false },
            ],
            feedbackCorrect: "Yes. A specific sentence, a named location, the effect on the reader and proposed wording give the owner something they can act on the same day.",
            feedbackIncorrect: "Compare what each option gives the receiving office. Only one hands them the exact text, the effect and a suggested replacement.",
          },
          {
            type: "statement",
            body: "Private reflection, kept by you and not collected anywhere: what might accessibility mean here beyond the legal minimum — and if this message has been excluding someone for a while, what would repair look like beyond quietly fixing it?",
          },
        ],
      },
    ],
  },
  jobAid: {
    title: "Accessible and respectful communication",
    subtitle: "One page for anyone writing, editing or approving something that leaves the unit",
    quote: "Most people will never meet your program. They will meet your notice.",
    use: {
      purpose: "Keep the five decisions and the revision pass in view while you draft an email, page, memo, notice or slide deck.",
      remember: [
        "Words, structure, format, timing and channel. Decide all five on purpose; most failures are structure and timing.",
        "Both “disabled person” and “person with a disability” are respectful. Euphemisms and functioning labels are not; ask when you can, and stay consistent.",
        "Make the process the subject of the sentence, not the person. A finding aimed at people cannot be acted on.",
        "Real headings, real lists, real text. Nothing essential inside a screenshot, a scanned page or color alone.",
        "Translation and interpretation are drafting decisions: short sentences, defined terms, materials in advance, time on the calendar.",
        "Obligations set the floor. Early materials, a named contact and paid community review are what make the floor usable.",
      ],
      doNext: "Run the revision pass on one real piece of your own work this week, send it, and say what changed.",
    },
    sections: [
      {
        heading: "The revision pass, in short",
        items: [
          "Purpose: name the piece, its audience, and the one thing a reader should be able to do afterward.",
          "Words and framing: plain meaning on first read, terms defined, no euphemisms, a named contact and a real deadline.",
          "Structure and format: heading styles, genuine lists, marked table headers, link text that names its destination, alternative text, readable contrast, captions and a transcript.",
          "Language access and timing: short sentences, no idioms, translated versions and interpreter materials planned on the calendar, sent early enough to act on.",
          "What changed: two or three lines with the revised version, and a specific routed request for anything you do not own.",
        ],
      },
      {
        heading: "A ten-minute check before you send",
        items: [
          "Open the headings pane; if it is empty, the headings are not real.",
          "Move through it with the keyboard alone and watch where the focus goes.",
          "Read the link text and alternative text on their own; do they still mean anything?",
          "Find any text trapped in an image or a scan and move it into real text.",
          "Read the opening as someone who has never heard of your program.",
        ],
      },
      {
        heading: "Who this helps",
        items: [
          "Policy and program staff, who decide what a change is called and when the public hears about it — a useful place to start.",
          "Communications and training staff, who own the page, the deck and the template most people will actually meet — a useful place to start.",
          "Administrative and support staff, who send the standing notices, schedule the sessions and arrange the interpreters — a useful place to start.",
          "Anyone in fiscal, contracts, data, quality or engagement work whose memo, report or requirement becomes someone else's wording later.",
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
    { title: "Minnesota Department of Human Services, Content and writing guidelines", href: "https://mn.gov/dhs/digital-showcase/content-guidelines/", note: "The department's own editorial guidance on first-read understanding, descriptive headings, familiar terms and writing suited to the reader." },
    { title: "Minnesota IT Services, Accessibility", href: "https://mn.gov/mnit/about-mnit/accessibility/", note: "Minnesota's accessibility standard for state digital content, including the Web Content Accessibility Guidelines it follows and practical guidance for documents and web pages." },
    { title: "PlainLanguage.gov, Federal plain language guidelines", href: "https://www.plainlanguage.gov/guidelines/", note: "Detailed guidance on audience, organization, sentence structure, useful headings and words to avoid in public writing." },
    { title: "Section508.gov, Create accessible digital products", href: "https://www.section508.gov/create/", note: "Step-by-step instructions for accessible documents, presentations, spreadsheets, email and video using common office software." },
    { title: "W3C Web Accessibility Initiative, Easy checks", href: "https://www.w3.org/WAI/test-evaluate/easy-checks/", note: "The first-review checks used in this module: page structure, keyboard access, alternative text, link text, contrast and captions." },
    { title: "ADA.gov, Effective communication", href: "https://www.ada.gov/resources/effective-communication/", note: "U.S. Department of Justice guidance on Title II effective communication, auxiliary aids and services, and primary consideration of the person's expressed preference." },
    { title: "U.S. Department of Health and Human Services, National CLAS Standards", href: "https://thinkculturalhealth.hhs.gov/clas", note: "National standards for culturally and linguistically appropriate services, including language assistance and communication practices." },
    { title: "Minnesota Framework for Universal Multicultural Instructional Design", href: "https://mncpd.org/wp-content/uploads/2016/12/MN_Framework_for_Universal_Multicultural_Instructional_Design.pdf", note: "The design reference for this curriculum: multiple ways to engage, culturally responsive materials and accessible instruction." },
  ],
};

export default pack;
