import type { CoursePack } from "../../source-types";

// Disability Inclusion · Practitioner, module 5: Disability Data, Privacy and Equity Measurement.
// Program-authored course for accessibility coordinators, equity professionals, analysts and program leads.
const pack: CoursePack = {
  course: {
    id: "di-disability-data-privacy-and-measurement",
    indexNumber: 1116,
    seriesLabel: "Disability Inclusion · Practitioner",
    title: "Disability Data, Privacy and Equity Measurement",
    subtitle: "Use disability data to find and remove barriers while protecting the people the data describes.",
    scope: "For accessibility coordinators, equity professionals, learning leaders, human resources partners, program managers, supervisors, policy analysts, internal trainers and inclusion champions who collect, analyze or report information about disability and access. Participation in this program is voluntary and does not replace required training.",
    treatment: "Five short lessons with scenarios, a sorting exercise, flashcards, a measurement plan artifact and knowledge checks",
    duration: "45–55 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/the-record.jpg",
    coverAlt: "A man reads bound reports at a library table.",
    introTranscript: "Disability data can show where a program is failing people and where it is working, but every number describes a person who may not want to be visible. This course teaches you to tell five kinds of disability data apart, to protect small groups when you break results down, and to build measures that show access and outcomes rather than attendance. The measures you will design describe systems, documents, meetings and processes. They never score or rank an individual employee.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Explain, with an example, how the same disability data can support equity and create a privacy or trust risk.",
        "Classify a piece of information as voluntary self-identification, service-use, accommodation, feedback or accessibility-test data and name the handling rule that follows.",
        "Apply a minimum-group threshold, suppression and aggregation to a disaggregated table before it is shared.",
        "Select measures of access and outcome for a program area and state what each one would and would not show.",
        "Write a short results summary that describes systems and processes without measuring or ranking any individual.",
      ],
      evidence: [
        "A completed sort of eight data items into five data types with the handling rule for each.",
        "A table reviewed for small-group disclosure risk with the suppression decisions written down.",
        "A one-page measurement plan for one program area with three to five measures, sources, owners and a review point.",
      ],
      appliedNextStep: "Take one report, progress summary or survey summary you already produce and review it against the five questions in the job aid. Fix what it reveals about small groups, and add one access or outcome measure it is missing.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Change in ADA, Section 504 or Section 508 guidance", "Change in DHS accessibility or language access standards", "Feedback from disabled staff or participants that a scenario reads as unrealistic or stigmatizing"],
      relatedDoor: "Questions about how a specific data set is classified, retained or released go to the agency’s data practices office; questions about accommodation records go to human resources or the ADA coordinator. This course prepares you to ask the right question, it does not decide a release.",
      toolkitQuestion: "Who could be identified, singled out or harmed by this number, and what will change in the design so they are not?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "disability-data-privacy-and-measurement-1",
        number: 1,
        title: "Why disability data helps, and where it harms",
        summary: "See what disability data can reveal about barriers, why the same data creates privacy and trust risks, and how to decide whether to collect it at all.",
        minutes: 10,
        learning: {
          objective: "Explain how disability data supports equity work and identify the privacy, trust and misuse risks that must be managed before any collection begins.",
          takeaways: [
            "Data about disability is useful when it points at a barrier the organization can remove; it is harmful when it points at a person the organization can judge.",
            "The Centers for Disease Control and Prevention estimates that about one in four adults in the United States has a disability, so low numbers in your data usually describe reluctance to disclose, not absence.",
            "Purpose, minimum collection, secure handling and a plan to share results back are decided before the first question is asked.",
          ],
          evidence: "A written purpose statement for one data collection, with the barrier it is meant to find and the risk it must manage.",
          appliedNextStep: "Find one place where your unit already asks about disability or access needs. Write down why it asks, who sees the answer and what changed because of it. If you cannot answer all three, raise it with the owner.",
        },
        scenario: {
          context: "A program manager in a county eligibility office wants to add the question “Do you have a disability?” to the annual team survey. The stated reason is “so we can see who needs help.” The team has fourteen people.",
          prompt: "What is the most useful response from the accessibility coordinator?",
          options: [
            { label: "Add the question; more data is always better for equity work.", response: "A question with no barrier in view and no privacy plan collects a sensitive fact about identifiable people in a fourteen-person team. It creates risk and produces nothing the manager can act on." },
            { label: "Ask what barrier the manager is trying to find, and suggest asking about access needs and obstacles in the work instead of asking about disability status.", response: "This keeps the purpose, protects the people, and gives the manager something they can change: the meeting format, the software, the schedule. Status questions in tiny groups identify people; barrier questions identify fixes.", recommended: true },
            { label: "Refuse; disability data should never be collected by supervisors.", response: "A flat refusal loses the chance to redirect a real concern. The problem is the purpose and the group size, not the manager’s interest in supporting people." },
          ],
        },
        transfer: {
          prompt: "Where does your program already hold disability information without a clear purpose?",
          options: ["List the forms, surveys and logs in your area that ask about disability or access needs", "For each, write the barrier the information is meant to find", "Retire or redesign one collection that has no purpose you can state"],
        },
        blocks: [
          { type: "text", heading: "Two truths at once", body: "<p>Disability data can show that accommodation requests take six weeks in one division and six days in another, that public notices from one program fail accessibility checks far more often than another’s, or that disabled participants leave a service earlier than others. Without this information, barriers stay invisible and equity work runs on anecdote. The Centers for Disease Control and Prevention estimates that about one in four adults in the United States has a disability, so when a program’s data shows two percent, the number is describing who felt safe enough to say so.</p><p>The same data carries risk. Disability status is sensitive personal information. In a small team it identifies people even when names are removed. It can be misread as a cause of low performance, used to steer people away from opportunities, or shared beyond the purpose it was collected for. Every one of those harms lands on people who already carry more than their share of scrutiny.</p><p>Practitioners hold both truths. The skill is not choosing between collecting and not collecting; it is designing collection, analysis and reporting so the data describes systems and protects people.</p>" },
          { type: "list", heading: "Five questions before you collect anything", ordered: true, items: ["What barrier or outcome are we trying to see, and could we see it without asking about disability status at all?", "What is the smallest set of information that would answer the question?", "Who will see the raw answers, where will they live, and how long will they be kept? In Minnesota government, the agency’s data practices office answers how the data is classified.", "How will results be broken down, and what is the smallest group we will ever report on?", "How and when will people who answered learn what the results were and what changed?"] },
          { type: "statement", body: "A number that helps you fix a form, a meeting or a process is equity data. A number that helps you form an opinion about a named person is surveillance. The difference is decided by design, not by intention." },
          { type: "leaderMove", heading: "Name the barrier before the question", control: "You control whether a request for disability data starts with a barrier or with curiosity.", failure: "Do not approve a disability question because someone says it would be “good to know.” Ask what they will change if the answer is yes, and what they will change if it is no.", next: "The next time someone proposes collecting disability data, write the purpose statement with them before anything else is designed." },
          { type: "flashcards", heading: "Words the data work depends on", cards: [
            { front: "Data minimization", back: "<p>Collect the least information that answers the question. If “do you need materials in a different format?” answers it, do not ask “what is your disability?”</p>" },
            { front: "Purpose limitation", back: "<p>Use the information only for the reason it was collected. Accommodation records opened to arrange an interpreter are not a source for a productivity discussion.</p>" },
            { front: "Aggregate", back: "<p>Combine individual answers into counts, percentages or averages so no single person’s response can be read from the result.</p>" },
            { front: "Disclosure", back: "<p>A person choosing to share their disability. It is theirs to give, can be partial, and can be withdrawn. Data collection must never make it feel required.</p>" },
            { front: "Sharing back", back: "<p>Telling the people who answered what the results showed and what changed because of them. Without it, the next response rate falls.</p>" },
          ] },
          { type: "knowledgeCheck", id: "disability-data-privacy-and-measurement-1-check", question: "A division’s voluntary self-identification rate is three percent. What is the most defensible reading?", options: [
            { text: "Few disabled people work in the division, so accessibility investment can wait.", correct: false },
            { text: "Most disabled staff have not chosen to disclose, which is itself information about trust and about how the question was asked.", correct: true },
            { text: "The survey tool is broken and the number should be discarded.", correct: false },
          ], feedbackCorrect: "Yes. A rate far below the population estimate points to reluctance to disclose, not absence. It is a reason to examine trust and process, not to deprioritize access.", feedbackIncorrect: "Compare the rate with the population estimate of about one in four adults. The gap describes what people felt safe to say, not who is in the division." },
        ],
      },
      {
        id: "disability-data-privacy-and-measurement-2",
        number: 2,
        title: "Five kinds of disability data",
        summary: "Tell voluntary self-identification, service-use, accommodation, feedback and accessibility-test data apart, because each has different owners, rules and uses.",
        minutes: 11,
        learning: {
          objective: "Classify a piece of information as voluntary self-identification, service-use, accommodation, feedback or accessibility-test data and state the handling rule and appropriate use for each.",
          takeaways: [
            "The five types answer different questions and must never be merged into one file or one progress summary.",
            "Accommodation records are confidential medical-related information kept apart from personnel files; they are counted in aggregate, never browsed.",
            "Accessibility-test results describe documents, sites and rooms, not people; they are the least sensitive and the most underused.",
          ],
          evidence: "A completed sort of eight items into five types, with one line on how each type may be used.",
          appliedNextStep: "Map the disability-related data your area holds against the five types. Note any place where two types are stored together or where a type is used to answer a question it was not collected for.",
        },
        scenario: {
          context: "A facilities lead planning an office remodel asks human resources for the accommodation log “so we can see how many people use wheelchairs and where they sit.” The log holds every accommodation request in the division, including medical documentation.",
          prompt: "What should human resources do?",
          options: [
            { label: "Share the log; the purpose is to make the building more accessible.", response: "A good purpose does not unlock a confidential file. The log contains medical-related information about identifiable staff and it was not collected to plan a floor layout." },
            { label: "Decline the log, and offer aggregate counts by accommodation category, an accessibility assessment of the space, and a way for staff to state access needs for the new layout directly.", response: "The remodel needs to know about routes, doors, counters, lighting and quiet space, and it needs staff to say what would help. Aggregate counts and an accessibility assessment give that without exposing anyone.", recommended: true },
            { label: "Send only the names of people who use mobility devices, since that is the relevant part.", response: "A filtered list of named disabled staff is more exposing, not less. Nobody agreed to be on a list handed to facilities." },
          ],
        },
        transfer: {
          prompt: "Which two data types are closest together in your unit’s files, and what would separate them?",
          options: ["Ask where accommodation records live and who can open them", "Check whether feedback forms ask for disability status they do not need", "Find the most recent accessibility-test result for a document or site your unit owns"],
        },
        blocks: [
          { type: "text", heading: "Different questions, different rules", body: "<p>“Disability data” sounds like one thing. In practice a program holds at least five kinds, and confusing them is the most common way to break trust. A count of documents that pass an accessibility check is safe to publish on a wall. A list of staff who asked for a modified schedule is confidential and must stay in a separate, restricted file. Both are disability data.</p><p>The types differ in who provides the information, whether it was voluntary, whether it identifies a person, what law or policy governs it, and what question it can honestly answer. Learn the five, and you will know within a minute whether a request for data is safe, needs redesign or needs to be declined.</p>" },
          { type: "tabs", heading: "The five types", tabs: [
            { label: "Self-identification", body: "<p><strong>What it is:</strong> A person voluntarily reporting that they have a disability, usually in a workforce survey or applicant form.</p><p><strong>Use it for:</strong> Aggregate workforce indicators such as representation, retention and engagement, compared across large groups.</p><p><strong>Rules:</strong> Voluntary, anonymous or confidential, never linked to a supervisor’s view of an individual, reported only above a minimum group size.</p>" },
            { label: "Service-use", body: "<p><strong>What it is:</strong> Records of people receiving disability-related services or supports, such as waiver services, assessments or case management.</p><p><strong>Use it for:</strong> Program planning, equity of access across counties and communities, timeliness and outcomes.</p><p><strong>Rules:</strong> Governed by program law and data practices classifications; participants did not consent to be used as a workforce or facilities data source.</p>" },
            { label: "Accommodation", body: "<p><strong>What it is:</strong> Requests, decisions and supporting documentation for workplace or program accommodations.</p><p><strong>Use it for:</strong> Aggregate process measures: time to resolve, categories requested, approval patterns, cost.</p><p><strong>Rules:</strong> Confidential medical-related information kept apart from personnel files with restricted access, as federal equal employment guidance describes. Counted, never browsed.</p>" },
            { label: "Feedback", body: "<p><strong>What it is:</strong> Complaints, survey comments, suggestions and testimony about access and experience.</p><p><strong>Use it for:</strong> Themes, patterns and resolution times; the earliest signal that a barrier exists.</p><p><strong>Rules:</strong> Do not require disability status to give feedback; protect free-text comments, which often identify people by detail.</p>" },
            { label: "Accessibility test", body: "<p><strong>What it is:</strong> Results of checking documents, websites, applications, rooms and events against standards such as the Web Content Accessibility Guidelines.</p><p><strong>Use it for:</strong> Measuring the accessibility of the organization’s own products and spaces; the most direct barrier measure there is.</p><p><strong>Rules:</strong> Describes things, not people. Safe to share widely. Include severity, not only pass or fail.</p>" },
          ] },
          { type: "sorting", id: "disability-data-privacy-and-measurement-2-sort", heading: "Which type is it?", categories: ["Self-identification", "Service-use", "Accommodation", "Feedback", "Accessibility test"], items: [
            { text: "Count of staff who marked “yes” to the voluntary disability question on the workforce survey.", category: "Self-identification" },
            { text: "Number of people in a county receiving a home and community-based waiver service this quarter.", category: "Service-use" },
            { text: "Average working days between an accommodation request and a decision.", category: "Accommodation" },
            { text: "Three complaints that the lobby check-in kiosk cannot be used from a seated position.", category: "Feedback" },
            { text: "Share of public notices on the program page that pass both an accessibility checker and a review by a person.", category: "Accessibility test" },
            { text: "A medical provider’s letter supporting a request for a modified schedule.", category: "Accommodation" },
          ] },
          { type: "leaderMove", heading: "Refuse the merge", control: "You control whether different data types are joined in one file, report or progress summary.", failure: "Do not build a view that places accommodation records next to performance ratings, or self-identification answers next to names. A join like that turns protective data into exposure with one click.", next: "Review the next progress summary or spreadsheet request you receive for hidden joins between the five types, and separate them before you build." },
          { type: "flashcards", heading: "Handling rules to remember", cards: [
            { front: "Where do accommodation records live?", back: "<p>In a separate confidential file with restricted access, apart from the personnel file. Supervisors learn what the accommodation is, not the diagnosis behind it.</p>" },
            { front: "Can service-use data describe the workforce?", back: "<p>No. Participants receiving services are not the staff population, and they did not consent to that use. Keep program data and workforce data in their own lanes.</p>" },
            { front: "Should a feedback form ask about disability status?", back: "<p>Only if it is optional and the answer changes what happens next. Ask about the barrier experienced; that is what you can fix.</p>" },
            { front: "What makes accessibility-test data powerful?", back: "<p>It measures the organization, not the person. It can be repeated, compared over time and published without any privacy risk.</p>" },
          ] },
          { type: "knowledgeCheck", id: "disability-data-privacy-and-measurement-2-check", question: "Which use of accommodation data is appropriate?", options: [
            { text: "Reporting the average time to resolve requests across the agency, by request category, with no group smaller than the agreed threshold.", correct: true },
            { text: "Giving supervisors a list of which staff on their team have active accommodations and the medical reason for each.", correct: false },
            { text: "Adding accommodation status as a column in the performance-review export so analysts can compare ratings.", correct: false },
          ], feedbackCorrect: "Right. Aggregate process measures show whether the system works. The other two options expose confidential medical-related information and invite exactly the misuse the confidentiality rule exists to prevent.", feedbackIncorrect: "Ask whether the use describes the process or the person. Only the aggregate timeliness measure describes the process." },
        ],
      },
      {
        id: "disability-data-privacy-and-measurement-3",
        number: 3,
        title: "Breaking results down without exposing anyone",
        summary: "Disaggregate carefully: apply a minimum group size, suppress and combine cells, and watch for the cross-tabulation that quietly identifies a person.",
        minutes: 11,
        learning: {
          objective: "Apply a minimum-group threshold, primary and complementary suppression, aggregation over time or units, and a cross-tabulation check to a disaggregated table before it is shared.",
          takeaways: [
            "Removing names does not protect anyone in a small group; the combination of unit, role and characteristic does the identifying.",
            "Suppressing one small cell is not enough when the row or column total lets a reader subtract it back; a second cell must also be hidden.",
            "When a group is too small to report, combine it across time, across units or into a broader category rather than dropping it from view forever.",
          ],
          evidence: "A sample table reviewed for disclosure risk, with each suppression or aggregation decision and its reason written down.",
          appliedNextStep: "Confirm the minimum reporting group size your agency’s data practices office or research unit expects. Apply it to the next disaggregated table you produce, and keep a note of what you suppressed and why.",
        },
        scenario: {
          context: "Engagement survey results arrive for a licensing unit of twelve people. Three answered “yes” to the voluntary disability question. A director asks for the “disabled versus non-disabled” breakdown of the unit’s scores on the “my supervisor supports me” item.",
          prompt: "What should the analyst do?",
          options: [
            { label: "Provide the breakdown; the names are not attached, so it is anonymous.", response: "Twelve people, three of whom disclosed. Anyone on the team who knows two colleagues’ situations can work out the third, and the supervisor can read three people’s opinion of them." },
            { label: "Explain that the group is below the reporting threshold, offer the same comparison at the division level where the group is large enough, and offer the unit its overall scores without the disability breakdown.", response: "The director’s question is legitimate and can be answered at a level where it does not identify anyone. Offering the alternative keeps the equity question alive while protecting three colleagues.", recommended: true },
            { label: "Provide the breakdown but round the scores so they look less precise.", response: "Rounding does not change the fact that a reader learns what three identifiable people think about their supervisor. The problem is the group size, not the decimal places." },
          ],
        },
        transfer: {
          prompt: "Which report in your area breaks results into the smallest groups, and who checks it before release?",
          options: ["Find the smallest group ever reported in your unit’s progress summaries or reports", "Ask whether a complementary suppression check is part of the release step", "Propose a standing rule for combining small groups across time or units"],
        },
        blocks: [
          { type: "text", heading: "Disaggregation is where equity and privacy meet", body: "<p>Averages hide inequity. A program with a ninety percent satisfaction rate can be failing every Deaf participant. Breaking results down by disability, and further by race, language, age or geography, is how practitioners find the people a system is failing. It is also the exact point where a report can identify an individual.</p><p>Small-group disclosure risk works like this. A table shows results for a unit of nine people, one of whom disclosed a disability. That row does not name anyone, but colleagues know who it is, and the row now tells them how that person answered. Add a second breakdown, say gender, and a group of two becomes a group of one. The identifier is not the name; it is the intersection of characteristics.</p><p>Agencies manage this with a minimum reporting group size, often described as a cell-size threshold, together with suppression and aggregation rules. The precise threshold is set by your agency’s data practices office or research unit; this course teaches the method, not a number to quote as policy.</p>" },
          { type: "list", heading: "Before you release a disaggregated table", ordered: true, items: ["Check every cell against the minimum group size, including cells for “prefer not to say” and for the comparison group.", "Suppress any cell below the threshold. Show it as suppressed, not as zero.", "Check whether row or column totals allow a reader to subtract the suppressed cell back. If they do, suppress a second cell or remove the total.", "Check cross-tabulations. Disability by unit may be fine; disability by unit by gender may not be.", "Where a group is too small, combine it across time, across similar units or into a broader category so its experience still appears.", "Write down each decision. Reviewers, and the people described, deserve to know what was hidden and why."] },
          { type: "accordion", heading: "Techniques and when to use them", items: [
            { title: "Primary suppression", body: "<p>Hide the cell that is below the threshold. Label it clearly, for example “fewer than the reporting minimum,” so readers know a group exists and was protected rather than absent.</p>" },
            { title: "Complementary suppression", body: "<p>Hide a second cell so the first cannot be recovered from totals. If a row shows 40 total, 34 in one cell and a suppressed cell, everyone can see the suppressed value is 6. Hide the 34 as well, or drop the total.</p>" },
            { title: "Aggregation over time", body: "<p>Combine several quarters or years of results for a small group so the count clears the threshold. Say plainly that the figure covers a longer period.</p>" },
            { title: "Aggregation across units", body: "<p>Report at division or regional level when a unit is too small. Pair it with the unit’s overall results so local leaders still get something to act on.</p>" },
            { title: "Broader categories", body: "<p>Combine detailed disability categories into fewer, wider ones. Do this in consultation with disabled staff or advisors so the wider category still means something.</p>" },
            { title: "Ranges instead of counts", body: "<p>For some public reports, showing “fewer than 10” or “10 to 19” protects people while still communicating scale. Check that ranges cannot be narrowed by combining tables.</p>" },
          ] },
          { type: "leaderMove", heading: "Show the protection, not a blank", control: "You control whether a suppressed cell reads as “no one here” or as “people here, protected.”", failure: "Do not leave a blank or a zero where a small group was suppressed. A blank erases the group; a zero tells a falsehood about who is present.", next: "Add a standard footnote to your reports that explains the minimum group size and what a suppressed cell means." },
          { type: "flashcards", heading: "Disclosure risk in five cards", cards: [
            { front: "Why names are not the problem", back: "<p>In small groups, the combination of unit, role, shift, tenure or another characteristic identifies a person as surely as a name would. Protect combinations, not just names.</p>" },
            { front: "The subtraction problem", back: "<p>Suppressing one cell fails if the total minus the other cells reveals it. Complementary suppression or removing totals closes the gap.</p>" },
            { front: "The comparison group can be small too", back: "<p>If eleven of twelve people disclosed a disability, the one who did not is just as identifiable. Apply the threshold to every group in the table.</p>" },
            { front: "Free text is data too", back: "<p>A survey comment that mentions “my hearing aids” or “my service dog” identifies a person in a small unit. Review comments before quoting them, and paraphrase.</p>" },
            { front: "Combining is not hiding", back: "<p>Aggregation across time or units keeps a small group in the picture. Deleting them from the report tells leaders the group does not exist.</p>" },
          ] },
          { type: "knowledgeCheck", id: "disability-data-privacy-and-measurement-3-check", question: "A table shows a unit total of 30, with 26 in one category and a suppressed cell for staff who disclosed a disability. What is the remaining risk?", options: [
            { text: "None; the small cell has been suppressed.", correct: false },
            { text: "A reader can subtract 26 from 30 and recover the suppressed cell, so a second cell or the total must also be hidden.", correct: true },
            { text: "The risk is that the number 26 is too precise and should be rounded.", correct: false },
          ], feedbackCorrect: "Correct. This is why complementary suppression exists. One hidden cell next to a visible total is not hidden at all.", feedbackIncorrect: "Do the arithmetic a curious reader would do: 30 minus 26. The suppressed value is exposed by the total." },
        ],
      },
      {
        id: "disability-data-privacy-and-measurement-4",
        number: 4,
        title: "Measures that show access and outcomes",
        summary: "Build indicators that describe whether people can get in, get through and get results, instead of counting attendance or checking a compliance box.",
        minutes: 10,
        learning: {
          objective: "Select access, experience and outcome measures for a program area, identify the data source and owner for each, and state what each measure does and does not show.",
          takeaways: [
            "Attendance and training completion measure exposure; access measures whether a person could use the thing; outcome measures whether it worked for them.",
            "Every good measure names the system it describes: documents, requests, meetings, services, complaints, products. Not one names a person.",
            "A small set of measures reviewed on a schedule beats a large set nobody reads.",
          ],
          evidence: "A one-page measurement plan with three to five measures, each with a source, an owner, a review point and a line on its limits.",
          appliedNextStep: "Draft the measurement plan for one program area using the artifact in this lesson. Ask a disabled colleague or advisory member whether the measures would show the barriers they actually meet, and compensate their time where appropriate.",
        },
        scenario: {
          context: "Senior leaders ask the accessibility coordinator for “one number” to track disability inclusion. The candidate on the table is the percentage of staff who completed the disability awareness course.",
          prompt: "What is the strongest response?",
          options: [
            { label: "Use completion rate; it is easy to collect and leaders understand it.", response: "Completion measures exposure to a course. It says nothing about whether a participant can read a notice, get an accommodation in time or take part in a meeting." },
            { label: "Offer a small set of access and outcome measures, such as time to resolve accommodation requests and the share of public documents that pass accessibility checks, and explain why completion alone cannot show whether barriers are falling.", response: "Leaders asked for something meaningful; they said “one number” because nobody had offered them better. A short set of system measures answers the real question.", recommended: true },
            { label: "Propose the self-identification rate as the single number.", response: "Self-identification reflects trust and reluctance as much as anything else, and it identifies people in small groups. It belongs in a set, not alone." },
          ],
        },
        transfer: {
          prompt: "Which of the suggested measures could your area report within 30 days from data it already has?",
          options: ["Pick one access measure and one outcome measure from the list", "Name the data source and the owner for each", "Write the limit of each measure in one sentence"],
        },
        blocks: [
          { type: "text", heading: "Three layers of measurement", body: "<p>Most programs already count something: people trained, meetings held, policies signed. Those are activity measures. They are easy and they are not wrong, but they answer “what did we do,” not “did it work.” Practitioners add two layers. <strong>Access</strong> measures ask whether a person could get in and take part: could the document be read, was the request resolved in time, did the meeting have captions. <strong>Outcome</strong> measures ask whether the result was fair: did disabled participants finish the process at the same rate, stay in the job as long, report the same satisfaction.</p><p>The best measures share three features. They describe a system, so they can be improved without judging a person. They can be repeated, so change is visible. And they come with a known limit written next to them, so nobody reads more into the number than it holds.</p><p>One rule is absolute. Measures describe documents, requests, meetings, services and processes. They never score, compare or rank individual employees, and they never combine disability information with individual performance information.</p>" },
          { type: "list", heading: "Suggested measures", items: ["Percentage of public documents meeting accessibility standards, with severity of remaining issues.", "Average and longest time to resolve accommodation requests, by request category.", "Percentage of meetings and events planned with accessible practices: materials in advance, captions, an access-needs line and a named contact.", "Satisfaction with access, broken down by service type where the group size allows.", "Complaint themes about access and the pattern of how they were resolved.", "Hiring, retention, promotion and engagement indicators, using voluntary self-identification data only in aggregate and only above the minimum group size.", "Number and severity of barriers found through user testing with disabled people, and the share fixed within an agreed window."] },
          { type: "artifact", kind: "tagged-document", label: "Practical artifact", title: "A one-page measurement plan", summary: "The fields that turn a good intention into a measure someone will actually collect, read and act on.", fields: [
            { label: "Measure and layer", value: "What is counted, and whether it describes activity, access or outcome. Example: share of program notices passing an accessibility check (access)." },
            { label: "Source and owner", value: "Where the data comes from and the named role responsible for producing it on schedule." },
            { label: "Protection rule", value: "The minimum group size, suppression approach and which of the five data types it draws on." },
            { label: "Limit and review point", value: "One sentence on what the measure cannot show, and when the group that owns it will look at it and decide what to change." },
          ], action: "Complete the plan for one program area and review it with the people the measures are meant to serve before adopting it." },
          { type: "leaderMove", heading: "Measure the system you can change", control: "You control whether a measure is written about a process or about a person.", failure: "Do not accept “accommodations per supervisor” or “absences among staff with accommodations” as inclusion measures. They point at individuals and invite exactly the judgment the data must never support.", next: "Rewrite any person-pointing measure in your area so the subject of the sentence is a document, request, meeting or process." },
          { type: "flashcards", heading: "Measure or mirage?", cards: [
            { front: "“Percent of staff who completed the course”", back: "<p>Activity. Useful as context, useless alone. Pair it with a measure of what changed in documents, meetings or requests.</p>" },
            { front: "“Median days from accommodation request to decision”", back: "<p>Access. Describes the process, repeatable, actionable by the office that owns the process. Report the longest wait too; medians hide the person who waited four months.</p>" },
            { front: "“Retention after two years, disabled and non-disabled staff”", back: "<p>Outcome. Powerful at agency or division scale using voluntary self-identification in aggregate. Never produced for a team small enough to identify anyone.</p>" },
            { front: "“Barriers found in user testing, by severity”", back: "<p>Access, and the most direct barrier measure available. Requires paying disabled testers and fixing what they find.</p>" },
            { front: "“Number of people with disabilities on each team”", back: "<p>Not a measure of inclusion. It identifies people in small teams and says nothing about whether the team is accessible.</p>" },
          ] },
          { type: "knowledgeCheck", id: "disability-data-privacy-and-measurement-4-check", question: "Which measure best shows whether a service is accessible rather than whether staff were trained?", options: [
            { text: "Percentage of staff who attended the accessibility briefing.", correct: false },
            { text: "Percentage of the service’s public forms and notices that pass an accessibility check, with remaining issues rated by severity.", correct: true },
            { text: "Number of staff who have disclosed a disability in the service unit.", correct: false },
          ], feedbackCorrect: "Yes. This measure describes the service’s own products, can be repeated, and tells the owner exactly what to fix.", feedbackIncorrect: "Ask what each number describes. Only the second describes whether the service itself can be used." },
        ],
      },
      {
        id: "disability-data-privacy-and-measurement-5",
        number: 5,
        title: "Reporting honestly and acting on what you find",
        summary: "Write results that describe systems, share them back with the people who provided the data, and turn findings into decisions without ever rating an individual.",
        minutes: 10,
        learning: {
          objective: "Write a short results summary that describes processes and barriers, states limits, protects small groups and leads to a named action, without measuring or ranking any individual employee.",
          takeaways: [
            "A results summary has four parts: what was measured, what it showed, what it cannot show, and what will change and who owns that change.",
            "Sharing results back with disabled staff and participants is part of the method, not a courtesy; it is how the next collection earns a response.",
            "Any progress summary, table or comparison that lets a reader see an individual’s disability status or rank employees by it is out of scope, whatever its stated purpose.",
          ],
          evidence: "A one-page results summary for one measure, reviewed against the four-part structure and the individual-measurement rule.",
          appliedNextStep: "Take the most recent disability or access result your area produced and rewrite it in the four-part structure. Send it to the people who provided the data, with the action and owner named.",
        },
        scenario: {
          context: "A progress summary proposal for a Disability Services Division leadership team includes a panel showing the number of accommodation requests by supervisor, with a color scale from green to red. The sponsor says it will “show which supervisors are supportive.”",
          prompt: "What should the practitioner recommend?",
          options: [
            { label: "Build it; leaders should be able to see which supervisors handle accommodations.", response: "Request counts per supervisor identify small teams and their disabled members, reward supervisors whose staff are too wary to ask, and turn a process measure into a personal scorecard. It measures the wrong thing and harms people doing it." },
            { label: "Replace the panel with division-level time-to-resolve and approval-pattern measures, and offer supervisors their own aggregate process data privately where the group size allows.", response: "The sponsor wants supervisors to do the process well. Time to resolve and consistency of decisions describe that process. Ranking supervisors by request volume does not.", recommended: true },
            { label: "Build it but remove the color scale so it looks less like a ranking.", response: "A ranking without colors is still a ranking. The exposure of small teams and the perverse incentive remain." },
          ],
        },
        transfer: {
          prompt: "Who provided the data behind your last report, and have they seen the result?",
          options: ["List the groups whose answers or records fed your most recent report", "Schedule how and when they will hear what it showed and what changed", "Name the one decision the report should drive, and who owns it"],
        },
        blocks: [
          { type: "text", heading: "The report is part of the relationship", body: "<p>People disclose, respond to surveys and file complaints because they hope something will change. When results vanish into a leadership deck, the next response rate falls and the data gets worse. Reporting back closes the loop: here is what you told us, here is what it means, here is what we cannot tell from it, and here is what will happen next and who is responsible.</p><p>Honest reporting also means stating limits. A three percent self-identification rate is not a workforce count. A rising complaint count may mean people finally trust the complaint process. A perfect accessibility-check score on documents says nothing about the phone line. Write the limit next to the number and readers will trust both.</p><p>Finally, hold the line on individuals. No report, progress summary or comparison in this program measures, scores or ranks an individual employee by disability, accommodation use or self-identification. That is not a data quality rule; it is a condition of the trust that makes the data possible.</p>" },
          { type: "tabs", heading: "Four parts of an honest summary", tabs: [
            { label: "What we measured", body: "<p>The measure, the layer it belongs to, the period, the data type it draws on and the group size rule applied. One or two sentences.</p>" },
            { label: "What it showed", body: "<p>The result, any comparison across large enough groups, and the change since the last period. Plain language; no adjectives doing the work of numbers.</p>" },
            { label: "What it cannot show", body: "<p>The known limits: small groups protected, reluctance to disclose, measures that describe products not experience, or a period too short to read a trend.</p>" },
            { label: "What changes now", body: "<p>The decision the result supports, the owner, the date by which it will be done and how the people who provided the data will hear about it.</p>" },
          ] },
          { type: "quote", text: "I answered the survey honestly because someone finally asked. Then I never heard another word. Next year I left it blank.", cite: "Composite staff perspective, illustrative" },
          { type: "leaderMove", heading: "Close the loop in writing", control: "You control whether the people behind the data learn what happened to it.", failure: "Do not let a result live only in a leadership deck. Do not summarize a small group’s experience in a way that lets colleagues recognize them, even in praise.", next: "Add a “shared back on” line to every disability or access report you produce, and fill it in." },
          { type: "flashcards", heading: "Reporting habits", cards: [
            { front: "Write the limit next to the number", back: "<p>“Self-identification rate: 4 percent. This reflects who chose to disclose, not the number of disabled staff.” The sentence protects the reader from a false conclusion.</p>" },
            { front: "Praise can expose too", back: "<p>“Our colleague who uses a screen reader found twelve barriers” names a person in a small unit as surely as a complaint would. Thank people in ways they choose.</p>" },
            { front: "A rising complaint count", back: "<p>Can mean more barriers, or more trust in the complaint route. Report the themes and resolution times alongside the count so readers can tell which.</p>" },
            { front: "The individual-measurement rule", back: "<p>No measure, progress summary or comparison rates or ranks an individual employee by disability, accommodation use or self-identification. No exceptions for good intentions.</p>" },
          ] },
          { type: "knowledgeCheck", id: "disability-data-privacy-and-measurement-5-check", question: "Which sentence belongs in an honest results summary?", options: [
            { text: "“Accommodation requests were resolved in a median of nine working days; the longest took 61 days, which the human resources office is reviewing with a target of 20 by the next review point.”", correct: true },
            { text: "“Two staff in the licensing unit who disclosed disabilities rated their supervisor lower than the rest of the team.”", correct: false },
            { text: "“Inclusion improved significantly this year.”", correct: false },
          ], feedbackCorrect: "Yes. It names the measure, the result, the outlier, the owner and the next step, and it describes a process rather than a person.", feedbackIncorrect: "One option exposes two identifiable colleagues; another makes a claim with no measure behind it. Look for the sentence that describes a process, states a result and names an owner." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Disability data: use it, protect it, act on it",
    subtitle: "Five questions to ask before any disability data is collected, broken down or reported",
    quote: "Measure the document, the request, the meeting and the process. Never the person.",
    use: {
      purpose: "Keep purpose, privacy and usefulness in view whenever disability information is collected, analyzed or shared.",
      remember: ["Five data types, five sets of rules: self-identification, service-use, accommodation, feedback and accessibility test. Never merge them.", "Names are not the risk; small groups and cross-tabulations are. Apply the minimum group size to every cell, including the comparison group.", "Access and outcome measures describe systems and can be improved. Activity measures only describe effort.", "No report measures, scores or ranks an individual employee by disability, accommodation use or self-identification."],
      doNext: "Review one existing report against the five questions below and fix the first thing it gets wrong.",
    },
    sections: [
      { heading: "Before collecting", items: ["What barrier or outcome are we trying to see, and can we see it without asking about disability status?", "What is the least information that answers the question?", "Who sees the raw answers, where do they live, and what does the data practices office say about classification and retention?", "How will people who answered learn the result and what changed?"] },
      { heading: "Before breaking results down", items: ["Check every cell, including “prefer not to say” and the comparison group, against the minimum group size.", "Suppress small cells and show them as protected, not as zero or blank.", "Check that totals and other tables cannot be used to recover a suppressed cell; hide a second cell if needed.", "Combine across time, units or categories so small groups stay in the picture."] },
      { heading: "Before reporting", items: ["Use the four parts: what we measured, what it showed, what it cannot show, what changes now and who owns it.", "Write the limit next to the number.", "Remove any view that lets a reader see an individual’s status or compare employees by it.", "Send the result to the people who provided the data, with the action and owner named."] },
    ],
  },
  sources: [
    { title: "Centers for Disease Control and Prevention, Disability Inclusion", href: "https://www.cdc.gov/disability-inclusion/about/index.html", note: "Population context for disability, including the estimate that about one in four adults in the United States has a disability, and a definition of inclusion as supported participation." },
    { title: "U.S. Equal Employment Opportunity Commission", href: "https://www.eeoc.gov/", note: "Federal guidance on reasonable accommodation and on keeping employee medical information confidential and separate from personnel records." },
    { title: "Job Accommodation Network", href: "https://askjan.org/", note: "Practical guidance on the accommodation process, documentation and confidentiality that shapes how accommodation data should be handled." },
    { title: "W3C Web Accessibility Initiative", href: "https://www.w3.org/WAI/", note: "The Web Content Accessibility Guidelines and evaluation resources behind accessibility-test measures for documents and digital products." },
    { title: "Section508.gov", href: "https://www.section508.gov/", note: "Federal accessibility testing, conformance reporting and program maturity resources useful for building access measures." },
    { title: "Minnesota Department of Human Services, Olmstead Plan", href: "https://mn.gov/dhs/general-public/about-dhs/olmstead/", note: "Minnesota’s plan for community integration of people with disabilities, an example of measurable goals and public progress reporting." },
  ],
};

export default pack;
