import type { CoursePack } from "../../source-types";

// Disability Inclusion curriculum, Capstone:
// Remove a Real Barrier, for cross-functional teams.
const pack: CoursePack = {
  course: {
    id: "di-capstone-remove-a-real-barrier",
    indexNumber: 1124,
    seriesLabel: "Disability Inclusion · Capstone",
    title: "Capstone: Remove a Real Barrier",
    subtitle: "Take a cross-functional team from choosing one recurring barrier to presenting a plan that removes it, with the people it affects shaping every step.",
    scope: "For cross-functional teams of staff, supervisors, specialists and leaders who will work together on one real barrier in their part of the agency. Participation in this program is voluntary and does not replace required training.",
    treatment: "Five short lessons that walk a team through a real project, with a worked scenario, a plan template, a decision-request outline and a self-review rubric",
    duration: "48–56 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/from-noticing-to-shifting.jpg",
    coverAlt: "Hands revise a printed form with a red pen.",
    introTranscript: "The capstone turns everything in the curriculum into one improvement that people can feel. A cross-functional team chooses a recurring barrier, maps it to its root cause, brings people with disabilities into the design, writes a plan with an owner, a budget, risks and measures, and asks leadership for a decision. The lessons are short because the work happens between them, in your team and with the people the barrier affects. You will leave with a plan you can present and a way to know, at 30, 90 and 180 days, whether the barrier is really gone.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Choose one real, recurring access barrier and describe the people it affects and what it costs them, in specific terms.",
        "Map a barrier from symptom to root cause across the functions that own each part of it.",
        "Design the solution with people with disabilities, compensated and with real influence, and document their contribution.",
        "Write an implementation plan with an accountable owner, a timeline, a budget estimate, implementation risks and measures of success at 30, 90 and 180 days.",
        "Present a clear, accessible decision request to leadership and set up the ownership and review that keep the change in place.",
      ],
      evidence: [
        "Five knowledge checks on the choices a team makes at each stage.",
        "A completed sort of symptoms, root causes and contributing conditions.",
        "A drafted implementation plan and decision request for your team’s barrier, self-reviewed against the capstone rubric.",
      ],
      appliedNextStep: "Bring your plan to the leaders who own the decision, present it in an accessible format, and record what they decide. Then check the 30-day measure on the date you set.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Change in ADA, Section 504 or Section 508 guidance", "Change in DHS accessibility or language access standards", "Feedback from disabled staff or participants that a scenario reads as unrealistic or stigmatizing"],
      relatedDoor: "Budget requests, procurement changes, policy revisions and compensation for advisers follow the agency’s finance, procurement, policy and human resources processes; the accessibility lead and ADA coordinator advise on standards and obligations. This course structures the team’s work; those offices confirm how it is carried out here.",
      toolkitQuestion: "Who meets this barrier, what does it cost them, and who has been at the table since the beginning to design what replaces it?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "capstone-remove-a-real-barrier-1",
        number: 1,
        title: "Choose a real barrier and the people it affects",
        summary: "Pick one recurring barrier your team can actually change, and describe who meets it and what it costs them before proposing anything.",
        minutes: 10,
        learning: {
          objective: "Choose one real, recurring access barrier within the team’s reach and write a problem statement that names the people affected and what the barrier costs them.",
          takeaways: [
            "A good capstone barrier is recurring, specific, within the team’s combined authority to change, and felt by identifiable groups of people.",
            "The problem statement describes the barrier and its cost to people; it does not yet contain a solution.",
            "Choosing a barrier that a disabled colleague or participant has already named is usually better than choosing one the team finds interesting.",
          ],
          evidence: "One knowledge check; a written problem statement and affected-user analysis for your team’s barrier.",
          appliedNextStep: "Write the problem statement in four sentences: what the barrier is, who meets it, what it costs them, and how often. Read it to one person who meets the barrier and revise it with what they say.",
        },
        scenario: {
          context: "A cross-functional team from a county human services office, a Disability Services Division unit and the communications office is choosing its capstone. Three candidates are on the table: redesigning the entire benefits website, which belongs to another administration; making the office’s weekly hybrid team meeting accessible, which two disabled colleagues have raised repeatedly; and running a disability awareness campaign.",
          prompt: "Which barrier should the team choose, and why?",
          options: [
            { label: "The benefits website, because it affects the most people.", response: "It does, and the team cannot change it. A capstone that ends in a memo to another administration teaches the team that barriers are someone else’s problem." },
            { label: "The weekly hybrid meeting, because it is recurring, specific, within the team’s authority, and two colleagues who meet the barrier have already named it.", response: "This is a real barrier with real people attached, and the team can remove it. Small and finished beats large and recommended.", recommended: true },
            { label: "The awareness campaign, because it builds culture across the whole office.", response: "A campaign is an activity, not a barrier removed. The capstone asks the team to change something a disabled person will notice in their own day." },
          ],
        },
        transfer: {
          prompt: "Which barrier have disabled colleagues or participants already named in your area?",
          options: ["List the barriers you have heard about in the last few months", "Mark which are recurring and within your team’s combined authority", "Ask the people who named them which one matters most"],
        },
        blocks: [
          { type: "text", heading: "Small enough to finish, real enough to matter", body: "<p>The capstone is not a study. It is one barrier removed, with evidence. That changes what a good choice looks like. The barrier should be <strong>recurring</strong>, so that fixing it changes many experiences rather than one. It should be <strong>specific</strong>: a meeting series, an intake step, a document set, an accommodation process, a hiring stage, not “accessibility in our division.” It should be <strong>within the team’s combined authority</strong>, which is why the team is cross-functional; if the fix needs communications, information technology and a supervisor, all three should be on the team. And it should be <strong>felt by identifiable groups</strong>, so that the people affected can be brought into the design and can tell you afterward whether it worked.</p><p>The best source of candidates is what disabled colleagues and participants have already said. Barrier reports, accommodation requests in aggregate, steering committee recommendations and the things people mention in passing are a list of real problems with real people attached. A team that picks from that list starts with credibility; a team that picks something it finds interesting starts by explaining itself.</p><p>The problem statement comes before any solution. Four sentences: what the barrier is, who meets it, what it costs them, and how often. The affected-user analysis extends the second sentence: which groups, in what numbers where you can estimate them, meeting the barrier in what way, and who among them is affected most, by language, geography, income or other factors. Resist writing the fix. A team that writes “the meeting needs captions” before it has mapped the barrier will solve the first symptom it noticed and miss the rest.</p>" },
          { type: "list", heading: "Candidate barriers that suit a capstone", items: ["A public-facing application, registration or intake process that cannot be completed by keyboard, screen reader or phone.", "A recurring meeting series that is inaccessible by default: image-only agendas, captions off, materials sent the morning of.", "An accommodation-request process with long waits, unclear steps or a disclosure requirement.", "A set of high-use documents that are scanned images, with no process to keep them accessible.", "An emergency communication plan that assumes everyone can hear an alarm, read a screen or take the stairs.", "A hiring, new-hire or training step that filters out disabled candidates or staff.", "A customer-service or direct-support script that does not tell staff how to offer access.", "A procurement template with no accessibility standard, evidence or remedy."] },
          { type: "leaderMove", heading: "Choose what you can finish", control: "The team controls the size of its barrier. A finished small change is evidence; a large recommendation is a document.", failure: "Do not choose a barrier that belongs to another administration. Do not choose an activity, such as a campaign or a training, in place of a barrier.", next: "Agree on one barrier this week and write the four-sentence problem statement before the next meeting." },
          { type: "flashcards", heading: "The four tests of a capstone barrier", cards: [
            { front: "Recurring", back: "<p>It happens every week, every application, every hire. Fixing it changes many experiences. A one-time event is a poor capstone.</p>" },
            { front: "Specific", back: "<p>A named meeting series, intake step, document set or process. “Accessibility in our division” is a theme, not a barrier.</p>" },
            { front: "Within combined authority", back: "<p>The functions needed to fix it are on the team or committed to it. If the fix needs a leader who is not involved, recruit them now or choose differently.</p>" },
            { front: "Felt by identifiable groups", back: "<p>You can name who meets it, bring them into the design and ask them afterward whether it worked.</p>" },
          ] },
          { type: "statement", body: "Write the problem before the solution. A team that begins with “the meeting needs captions” will fix the first symptom it noticed and leave the image-only agenda, the late materials and the missing access line exactly where they were." },
          { type: "knowledgeCheck", id: "capstone-remove-a-real-barrier-1-check", question: "Which problem statement is ready for the next stage?", options: [
            { text: "Our team meeting needs captions and an accessible agenda.", correct: false },
            { text: "Our weekly hybrid team meeting sends an image-only agenda the morning of, runs with captions off, and has no way to request access; two colleagues who use a screen reader or captions cannot prepare or follow, every week, and one has stopped attending.", correct: true },
            { text: "Accessibility in our office is inconsistent and needs a culture change.", correct: false },
          ], feedbackCorrect: "Yes. It names the barrier, who meets it, what it costs them and how often, and it contains no solution yet.", feedbackIncorrect: "One option is a solution in disguise and one is a theme. A problem statement describes the barrier, the people and the cost, and stops there." },
        ],
      },
      {
        id: "capstone-remove-a-real-barrier-2",
        number: 2,
        title: "Map the barrier and find the root cause",
        summary: "Trace the barrier from what people experience to the process, ownership and default that create it, using the inaccessible team meeting as the case.",
        minutes: 11,
        learning: {
          objective: "Map a barrier from symptom to root cause across the functions that own each part of it, and distinguish root causes from contributing conditions.",
          takeaways: [
            "A symptom is what a person meets; a root cause is the process, default or missing owner that produces it every time.",
            "Most barriers have two or three root causes in different functions, which is why single-function fixes revert.",
            "Asking “why” until the answer is a process or an owner, not a person, keeps the map honest and useful.",
          ],
          evidence: "A completed sort of symptoms, root causes and contributing conditions; one knowledge check; a barrier map for your team’s barrier.",
          appliedNextStep: "Draw your barrier map: each symptom on the left, the process or default that produces it in the middle, and the function that owns that process on the right. Check that no box contains a person’s name.",
        },
        scenario: {
          context: "A program manager sends a same-day invitation for a mandatory hybrid team meeting. The agenda is an image-only file. The virtual platform has captions turned off. A staff member who uses a screen reader cannot read the agenda, and another needs real-time captions to follow. The capstone team is mapping this barrier.",
          prompt: "Which of these is the root-cause map, rather than a list of symptoms?",
          options: [
            { label: "The manager forgot to turn on captions and used the wrong file format; a reminder will fix it.", response: "This maps the barrier to a person, and it will recur with the next manager. Nothing in the process changed." },
            { label: "The agenda template exports as an image and no accessible template exists; the platform’s default has captions off and nobody owns the setting; invitations have no access line because the invitation template has none; there is no standard for advance materials. Each has an owner in communications, information technology or the unit.", response: "This is a root-cause map. Every box is a process, a default or a missing owner, and each points to the function that can change it.", recommended: true },
            { label: "The two staff members did not tell the manager in advance what they needed.", response: "This places the cause with the people the barrier excludes and asks them to carry the fix. It is the opposite of a root-cause map." },
          ],
        },
        transfer: {
          prompt: "For your team’s barrier, what process or default produces each symptom, and who owns it?",
          options: ["Write each symptom and ask why until the answer is a process or an owner", "Group the root causes by function", "Notice which functions are not yet on the team and invite them"],
        },
        blocks: [
          { type: "text", heading: "From what people meet to what produces it", body: "<p>A barrier map has three columns. On the left, the symptoms: what a disabled person meets. In the middle, the root causes: the process, template, default setting, missing standard or missing owner that produces the symptom every time. On the right, the function that owns each root cause. The discipline is to keep asking why until the middle column holds a process or an owner, not a person. “The manager forgot” is not a root cause; “the platform default is captions off and nobody owns the setting” is.</p><p>Take the inaccessible team meeting. The symptoms are an image-only agenda, captions off, no advance materials and no way to ask for access. Ask why of each. The agenda is an image because the template exports that way and no accessible template has been provided: a communications root cause. Captions are off because that is the platform default and no one has been assigned to change it: an information technology root cause. Materials arrive late because there is no standard for advance materials: a unit root cause. There is no access line because the invitation template has none: communications again. Four symptoms, three functions, and none of it is about the manager who sent the invitation.</p><p>Separate root causes from contributing conditions. Time pressure, staff turnover and a busy season make a barrier more likely but do not produce it; fixing them would not remove it. Root causes, when changed, remove the barrier for everyone who comes after. The map tells the team which functions must be part of the fix, which is often the moment a team realizes who is missing from the room.</p>" },
          { type: "sorting", id: "capstone-remove-a-real-barrier-2-sort", heading: "Symptom, root cause or contributing condition?", categories: ["Symptom", "Root cause", "Contributing condition"], items: [
            { text: "A screen-reader user cannot read the meeting agenda.", category: "Symptom" },
            { text: "The agenda template exports as an image and no accessible template has been provided.", category: "Root cause" },
            { text: "The meeting platform defaults to captions off and no one owns the setting.", category: "Root cause" },
            { text: "The unit is short-staffed this season.", category: "Contributing condition" },
            { text: "A colleague who needs captions has stopped attending.", category: "Symptom" },
            { text: "Several managers are new and have not been shown the invitation template.", category: "Contributing condition" },
          ] },
          { type: "leaderMove", heading: "No names in the middle column", control: "The team controls whether the map blames a person or names a process.", failure: "Do not stop at “the manager forgot” or “the staff did not ask.” Do not confuse busy seasons and turnover with the defaults and templates that actually produce the barrier.", next: "Review your map and replace every person’s name with the process, default or missing owner behind it." },
          { type: "accordion", heading: "The inaccessible meeting, mapped", items: [
            { title: "Symptom: image-only agenda", body: "<p><strong>Root cause:</strong> the agenda template exports as an image; no accessible template is provided or required.<br><strong>Owner:</strong> communications, with the unit adopting the template.</p>" },
            { title: "Symptom: captions off", body: "<p><strong>Root cause:</strong> the platform default is captions off; no one is assigned to set and lock the default.<br><strong>Owner:</strong> information technology, with the accessibility lead confirming the setting.</p>" },
            { title: "Symptom: materials the morning of", body: "<p><strong>Root cause:</strong> no standard for advance materials exists in the unit’s meeting practice.<br><strong>Owner:</strong> the unit leader, adopting a written standard.</p>" },
            { title: "Symptom: no way to request access", body: "<p><strong>Root cause:</strong> the invitation template has no access line or contact.<br><strong>Owner:</strong> communications for the template; the unit for using it.</p>" },
            { title: "Not a root cause: the manager", body: "<p>The manager used the templates and defaults the organization gave them. Change those and the next manager gets it right without being reminded.</p>" },
          ] },
          { type: "flashcards", heading: "Asking why until it is a process", cards: [
            { front: "“The agenda was an image”", back: "<p>Why? The template exports that way. Why? No accessible template has been provided or required. Owner: communications.</p>" },
            { front: "“Captions were off”", back: "<p>Why? That is the platform default. Why? No one has been assigned to set and lock it. Owner: information technology.</p>" },
            { front: "“Materials came the morning of”", back: "<p>Why? There is no advance-materials standard. Owner: the unit leader.</p>" },
            { front: "“Nobody asked for access”", back: "<p>Why? The invitation has no access line or private contact. Why? The template has none. Owner: communications, with the unit using it.</p>" },
          ] },
          { type: "knowledgeCheck", id: "capstone-remove-a-real-barrier-2-check", question: "Why does a fix aimed at only one function, such as giving communications an accessible agenda template, tend to leave the meeting barrier in place?", options: [
            { text: "Because communications is not responsible for meetings.", correct: false },
            { text: "Because the barrier has root causes in several functions, including the platform default and the unit’s meeting standard, and the untouched ones keep producing the symptoms.", correct: true },
            { text: "Because templates do not change behavior.", correct: false },
          ], feedbackCorrect: "Yes. The map shows three functions. A fix in one leaves two root causes running.", feedbackIncorrect: "Look at the map: agenda, captions, advance materials and access line have different owners. Fixing one symptom’s cause does not remove the others." },
        ],
      },
      {
        id: "capstone-remove-a-real-barrier-3",
        number: 3,
        title: "Bring people with disabilities into the design",
        summary: "Move from consulting people about a finished proposal to designing with them from the start, with compensation, influence and a record of what changed because of them.",
        minutes: 10,
        learning: {
          objective: "Design the solution with people with disabilities, compensated and with real influence, and document their contribution and how it changed the plan.",
          takeaways: [
            "Co-design means people who meet the barrier shape the options before they are narrowed, not react to a proposal after.",
            "Compensation, protected time and a visible record of influence are what distinguish co-design from consultation.",
            "Never ask one person to represent all disabled people, disclose a diagnosis or review the team’s work for free.",
          ],
          evidence: "One knowledge check; a co-design record for your team’s barrier naming who was involved, how they were compensated and what changed because of them.",
          appliedNextStep: "Before your team narrows options, hold one working session with people who meet the barrier, paid or with protected time, and write down what they changed.",
        },
        scenario: {
          context: "The capstone team has drafted a complete solution for the meeting barrier: a new template, captions on by default, a three-day materials standard and an access line. A team member suggests emailing the draft to the two affected colleagues “to get their sign-off” before presenting it.",
          prompt: "What should the team do instead?",
          options: [
            { label: "Send the draft for sign-off; it covers everything the colleagues raised.", response: "It covers what the team heard. Sign-off on a finished draft is consultation at the end, and it puts two colleagues in the position of approving or obstructing, unpaid, something they did not shape." },
            { label: "Reopen the design: invite the two colleagues and, if they agree, one or two others who meet similar barriers, with protected time or compensation, to work through the options with the team, and record what changes because of them.", response: "This is co-design. It will likely surface things the team missed, such as how the access line is handled privately, and it gives the plan credibility with the people it is for.", recommended: true },
            { label: "Ask the two colleagues to present the solution to leadership since it is for them.", response: "This hands the risk and the labor to the people most affected. The team owns the presentation; the colleagues’ contribution is recorded and credited, on their terms." },
          ],
        },
        transfer: {
          prompt: "Who meets your team’s barrier, and how will they shape the design rather than review it?",
          options: ["Identify people who meet the barrier, inside and outside the agency", "Confirm with finance and human resources how they will be compensated or given time", "Schedule the working session before options are narrowed"],
        },
        blocks: [
          { type: "text", heading: "Consultation reacts; co-design shapes", body: "<p>Consultation shows people a proposal and asks what they think. Co-design puts them at the table while the options are still open. The difference shows in the result: consulted people catch errors in a design built without them; co-designers change what gets built. For a capstone, co-design means at least one working session with people who meet the barrier before the team narrows its options, and a record of what changed because of them. That record is part of the work, not a courtesy.</p><p>Three conditions make it real. <strong>Compensation or protected time</strong>: disabled colleagues’ hours are recognized in their workload with their supervisor’s agreement; service users, self-advocates and community partners are paid at a professional rate through a mechanism finance confirms, with alternatives offered where payment could affect benefits. <strong>Influence</strong>: the team goes in with a map and questions, not a finished draft, and is willing to change direction. <strong>A visible record</strong>: who was involved, on what terms, what they said, and what the team changed or declined to change and why, shared back with them.</p><p>Three things to avoid. Do not ask one person to speak for all disabled people; recruit more than one where you can, and say plainly that each speaks from their own experience. Do not require anyone to disclose a diagnosis to participate; the question is what does not work, not why. Do not ask people to review the team’s work as a favor; that is the unpaid labor disabled people are asked for constantly, and the capstone should model something better.</p>" },
          { type: "list", heading: "A co-design working session, in outline", ordered: true, items: ["Share the problem statement and the barrier map in an accessible format, at least three working days ahead.", "Open with the questions, not a proposal: what does the map miss, what would a good result feel like, what has been tried and failed?", "Generate options together; write them all down before judging any.", "Ask which options people would trust, and what would make each one fail in practice.", "Agree on how the team will report back, and on what terms participants want to be credited.", "Within a week, send the record: what was heard, what changed, what did not and why."] },
          { type: "leaderMove", heading: "Pay for it and show what changed", control: "The team controls whether affected people shape the design or approve it, and whether their time is treated as expertise.", failure: "Do not send a finished draft for sign-off and call it co-design. Do not ask one colleague to represent everyone or to disclose why they need what they need.", next: "Confirm compensation or protected time this week and schedule the working session before options are narrowed." },
          { type: "quote", text: "The team had already decided captions would fix it. When they finally sat down with us, we told them the real problem was that asking for anything meant announcing it to the whole meeting. The access line with a private contact came from that conversation, not from the draft.", cite: "Composite staff perspective, illustrative" },
          { type: "flashcards", heading: "Consultation or co-design?", cards: [
            { front: "“Please review the attached proposal”", back: "<p>Consultation, at the end, unpaid. Useful for catching errors; not what the capstone requires.</p>" },
            { front: "“Here is our map; what does it miss?”", back: "<p>Co-design. Options are still open and the people affected are shaping them.</p>" },
            { front: "“Can you speak for staff with disabilities?”", back: "<p>Avoid. Each person speaks from their own experience; recruit more than one and say so.</p>" },
            { front: "“What is your disability?”", back: "<p>Never required. Ask what does not work and what would. The reason is the person’s to share or not.</p>" },
            { front: "“Here is what changed because of you”", back: "<p>The record that makes co-design real, shared back within a week and credited on the participants’ terms.</p>" },
          ] },
          { type: "knowledgeCheck", id: "capstone-remove-a-real-barrier-3-check", question: "Which practice shows that a capstone team engaged in co-design rather than consultation?", options: [
            { text: "The team emailed its final proposal to affected colleagues and incorporated their comments.", correct: false },
            { text: "The team held a compensated working session with affected people before narrowing options, and its plan records what changed because of them.", correct: true },
            { text: "The team included a disabled colleague’s quote in its presentation.", correct: false },
          ], feedbackCorrect: "Yes. Timing before options were narrowed, compensation and a record of influence are the marks of co-design.", feedbackIncorrect: "Comments on a final proposal and a quote in a deck are consultation and decoration. Co-design happens earlier, is paid for, and changes the plan visibly." },
        ],
      },
      {
        id: "capstone-remove-a-real-barrier-4",
        number: 4,
        title: "Write the plan: owner, budget, risks and measures",
        summary: "Turn the design into an implementation plan with an accountable owner, a timeline, a budget estimate, named risks, an access and equity impact check, and measures at 30, 90 and 180 days.",
        minutes: 11,
        learning: {
          objective: "Write an implementation plan with an accountable owner, a timeline, a budget estimate, implementation risks, an accessibility and equity impact assessment, and measures of success at 30, 90 and 180 days.",
          takeaways: [
            "A plan has one accountable owner by role, even when many functions do the work.",
            "Measures at 30, 90 and 180 days answer three different questions: is it in place, is it working, and is it still working.",
            "Risks are named with a response, and the impact assessment asks who could be left out by the fix itself.",
          ],
          evidence: "One knowledge check; a completed implementation plan for your team’s barrier in the format of the artifact in this lesson.",
          appliedNextStep: "Complete the plan artifact for your barrier and check it against three questions: is there one owner, could each measure be sourced, and does any measure describe an individual?",
        },
        scenario: {
          context: "The capstone team’s draft plan for the meeting barrier lists the fix, a timeline and a cost. Under owner it says “the team.” Under measures it says “meeting is accessible.” Under risks it says “none anticipated.”",
          prompt: "What has to change before this plan can be presented?",
          options: [
            { label: "Nothing; the plan describes the fix clearly.", response: "A plan owned by a team is owned by nobody once the capstone ends. “Meeting is accessible” cannot be checked, and a plan with no risks has not been thought through." },
            { label: "Name one accountable owner by role, replace the measure with checkable indicators at 30, 90 and 180 days, and name the real risks with a response to each, including old templates staying in circulation and the platform default reverting after an update.", response: "This turns a description into a plan that can be approved, funded, checked and sustained.", recommended: true },
            { label: "Add more detail to the timeline and cost estimate.", response: "Detail in the parts that already exist does not supply the parts that are missing: an owner, checkable measures and risks." },
          ],
        },
        transfer: {
          prompt: "Who will own your change after the capstone team disbands, and how will you know at 180 days that it is still working?",
          options: ["Name the operating owner by role and confirm they agree", "Write the 30, 90 and 180 day measures and their sources", "List three ways the fix could fail or revert, with a response for each"],
        },
        blocks: [
          { type: "text", heading: "The parts a decision needs", body: "<p>Leaders approve plans that answer their questions in advance: who owns this, what will it cost, what could go wrong, and how will we know it worked. The implementation plan is where the capstone team supplies those answers. One <strong>accountable owner</strong>, named by role, even though several functions do the work; a team is not an owner. A <strong>timeline</strong> with the few dates that matter. A <strong>budget estimate</strong> that is honest about what is one-time and what is ongoing, and that names the line the money would come from. <strong>Implementation risks</strong>, each with a response: old templates still in circulation, a platform update reverting the default, a change in unit leadership, participants’ time not protected. An <strong>accessibility and equity impact assessment</strong> that asks who could be left out by the fix itself: a new template that is accessible in one tool and not another, a standard that assumes everyone has the same connectivity or language.</p><p><strong>Measures at 30, 90 and 180 days</strong> answer three different questions. At 30 days: is the change in place? The template is published, the default is set, the standard is issued, the access line appears on invitations. At 90 days: is it working? Materials arrive three days ahead in most meetings, captions are on in every one, access requests through the private contact are answered, and the colleagues who met the barrier report they can prepare and follow. At 180 days: is it still working, and has it spread? The measures have held through a staffing change or a platform update, and the template and standard are in use beyond the original meeting. Every measure describes the meeting, the template, the setting or the aggregate experience; none describes an individual’s performance.</p>" },
          { type: "artifact", kind: "tagged-document", label: "Practical artifact", title: "The capstone implementation plan", summary: "The one-page plan leadership can approve. Every field is required; a blank one is a question a leader will ask.", fields: [
            { label: "Barrier, people affected and solution", value: "The four-sentence problem statement; the groups affected and who among them is affected most; the solution as co-designed, with the co-design record attached." },
            { label: "Owner, timeline and budget", value: "One accountable owner by role who has agreed; the operating owner who maintains the change after the project; the key dates; one-time and ongoing costs with the budget line each would come from." },
            { label: "Risks and impact", value: "Each implementation risk with a response, including reversion after updates, old templates in circulation and leadership change; the accessibility and equity impact check asking who could be left out by the fix itself." },
            { label: "Measures at 30, 90 and 180 days", value: "30 days: the change is in place, with the checkable evidence. 90 days: it is working, measured on the process and on the aggregate experience of the people affected. 180 days: it has held through change and spread beyond the original scope. Sources and owner for each measure; none describes an individual." },
          ], action: "Complete every field for your barrier, attach the barrier map and the co-design record, and self-review it against the rubric in the next lesson before presenting." },
          { type: "leaderMove", heading: "One owner, three dates, no blank fields", control: "The team controls whether the plan answers a leader’s questions before they are asked.", failure: "Do not write “the team” as the owner. Do not write “none anticipated” under risks. Do not write a measure that cannot be sourced or that describes a person.", next: "Fill every field of the plan and ask a leader outside the team to find the question it does not answer." },
          { type: "tabs", heading: "Measures for the meeting barrier, at three points", tabs: [
            { label: "30 days: in place", body: "<ul><li>Accessible agenda template published and the old one removed from the shared drive.</li><li>Platform default set to captions on, confirmed by the accessibility lead.</li><li>Advance-materials standard issued in writing by the unit leader.</li><li>Access line with a private contact on the invitation template.</li></ul>" },
            { label: "90 days: working", body: "<ul><li>Share of the series’ meetings with materials sent at least three working days ahead.</li><li>Share of meetings with captions on from the start.</li><li>Access requests through the private contact answered before the meeting.</li><li>The colleagues who met the barrier report, on their own terms, that they can prepare and follow; attendance in the series restored.</li></ul>" },
            { label: "180 days: sustained and spread", body: "<ul><li>All 90-day measures still holding after any staffing change or platform update.</li><li>The template and standard adopted by at least one other meeting series in the unit.</li><li>Operating owner confirmed and the item on the unit’s review agenda.</li></ul>" },
          ] },
          { type: "flashcards", heading: "Risks a capstone plan should name", cards: [
            { front: "Old way still available", back: "<p>Response: remove old templates and settings from circulation on the day the new ones go live.</p>" },
            { front: "Update reverts the default", back: "<p>Response: the setting is documented, owned by a named role in information technology, and rechecked after every platform update.</p>" },
            { front: "Leadership changes", back: "<p>Response: the standard is written, the owner is a role not a person, and the item is on a standing review agenda.</p>" },
            { front: "The fix excludes someone else", back: "<p>Response: the impact check asks who could be left out, such as people using a different tool or language, and adjusts before launch.</p>" },
          ] },
          { type: "knowledgeCheck", id: "capstone-remove-a-real-barrier-4-check", question: "Which set of measures is appropriate for a capstone plan at 90 days?", options: [
            { text: "Each manager’s compliance score with the new meeting standard.", correct: false },
            { text: "Share of meetings in the series with materials sent three days ahead and captions on, access requests answered before the meeting, and the affected colleagues’ report that they can prepare and follow.", correct: true },
            { text: "A statement that the meeting is now accessible.", correct: false },
          ], feedbackCorrect: "Yes. Checkable, sourced, about the process and the aggregate experience, and not about any individual’s performance.", feedbackIncorrect: "A per-manager score measures people rather than the system, and a statement cannot be checked. Measure the meetings and the experience." },
        ],
      },
      {
        id: "capstone-remove-a-real-barrier-5",
        number: 5,
        title: "Present the decision request and sustain the change",
        summary: "Make a clear, accessible decision request to leadership, review your work against the capstone rubric, and set up the ownership and review that keep the barrier from returning.",
        minutes: 10,
        learning: {
          objective: "Present a clear, accessible decision request to leadership, self-review the project against the capstone rubric, and establish the ownership and review points that sustain the change.",
          takeaways: [
            "A decision request asks for specific decisions: approve, fund, assign, adopt. A presentation that ends in “thank you” asked for nothing.",
            "The presentation itself must be accessible; a capstone on access delivered with an image-only deck has failed its own test.",
            "Sustainment is designed, not hoped for: an operating owner, the old way removed, and a review point on someone’s agenda.",
          ],
          evidence: "One knowledge check; a drafted decision request and a completed self-review against the rubric.",
          appliedNextStep: "Present the plan, record the decisions made, and put the 30-day check on the operating owner’s calendar before you leave the room.",
        },
        scenario: {
          context: "The capstone team is preparing to present. The draft deck has twenty slides describing the team’s journey, the last of which reads “Questions?” The plan itself is attached as a scanned image. No specific decision is requested.",
          prompt: "What does the team change?",
          options: [
            { label: "Shorten the deck to twelve slides and keep the format.", response: "Shorter is better, but the two failures remain: nothing is being asked, and the plan is inaccessible. A capstone on access has to pass its own test." },
            { label: "Lead with the decision request, approve the plan, fund the ongoing line, confirm the operating owner and adopt the standard; deliver the plan as an accessible document sent ahead; and keep the journey to two slides.", response: "This respects leaders’ time, asks for what the team needs, and demonstrates the accessibility it is proposing.", recommended: true },
            { label: "Ask the affected colleagues to present, since their story is the most persuasive part.", response: "Their contribution is credited on their terms. The team makes the request; it does not hand the risk of presenting to the people the barrier affected." },
          ],
        },
        transfer: {
          prompt: "What exactly will you ask leadership to decide, and who will check the change at 30 days?",
          options: ["Write the decisions requested in one sentence each", "Send the plan ahead as an accessible document and check it with a screen reader", "Put the 30-day check on the operating owner’s calendar"],
        },
        blocks: [
          { type: "text", heading: "Ask for decisions, pass your own test, plan the after", body: "<p>A decision request is short and specific. It opens with what the team is asking leadership to decide: approve the plan, fund the ongoing line from a named budget, confirm the operating owner, adopt the standard for the unit or beyond. It gives the problem statement, the people affected, the co-designed solution, the owner, the cost, the risks and the three sets of measures, each in a sentence or two, with the full plan sent ahead. The story of the team’s journey is two slides at most. Leaders should leave knowing what they decided, not how the team felt.</p><p>The presentation has to pass the test it is proposing. Materials go out at least three working days ahead as accessible documents; the deck uses real text, headings, alt text and sufficient contrast; captions are on; the presenter describes what is on each slide; and there is a private way to request access to the meeting. A capstone about accessibility delivered inaccessibly has failed on its own terms, and the people it is for will notice.</p><p>Sustainment starts in the room. Before the meeting ends, the operating owner is confirmed, the 30-day check is on that owner’s calendar, and the item is placed on a review agenda at the 90 and 180 day points. The old templates, settings and processes have a removal date. The co-design participants are told what was decided and credited as they chose. The capstone rubric below is for the team’s own self-review; it awards no credit or credential, and it is most useful when the team scores itself honestly before presenting and fixes the weakest criterion first.</p>" },
          { type: "accordion", heading: "The capstone rubric, for self-review", items: [
            { title: "Clearly identifies a real access barrier · 15%", body: "<p>The problem statement names a recurring, specific barrier within the team’s authority, the people who meet it and what it costs them. Strong work here reads as obvious in hindsight; weak work reads as a theme.</p>" },
            { title: "Centers lived experience and co-design · 20%", body: "<p>People who meet the barrier shaped the options before they were narrowed, were compensated or given protected time, and the plan records what changed because of them. The largest weight, because it most distinguishes work done with people from work done for them.</p>" },
            { title: "Proposes feasible, sustainable solutions · 20%", body: "<p>The solution addresses the root causes across functions, fits the authority and budget available, removes the old way, and names an operating owner. A solution that depends on reminders or goodwill scores low here.</p>" },
            { title: "Includes accessibility and equity considerations · 15%", body: "<p>The impact assessment asks who could be left out by the fix itself, by tool, language, connectivity, geography or income, and adjusts. The presentation and materials are themselves accessible.</p>" },
            { title: "Defines accountable owners and measurable outcomes · 15%", body: "<p>One accountable owner by role who has agreed; measures at 30, 90 and 180 days that can be sourced, describe the process and the aggregate experience, and never rate an individual.</p>" },
            { title: "Communicates clearly and accessibly · 15%", body: "<p>The decision request is specific and brief, the plan was sent ahead in an accessible format, the deck passes a keyboard and screen-reader check, and the presenter describes visuals. Plain language throughout.</p>" },
          ] },
          { type: "leaderMove", heading: "Leave with decisions and a calendar entry", control: "The team controls whether the meeting ends with decisions recorded and the 30-day check scheduled, or with thanks.", failure: "Do not end on “Questions?” without having asked for anything. Do not present an accessibility plan as a scanned image or an undescribed slide.", next: "Write the decision sentences now, send the accessible plan three working days ahead, and book the 30-day check before you present." },
          { type: "list", heading: "The decision request, in order", ordered: true, items: ["The decisions requested, one sentence each: approve, fund, confirm the owner, adopt the standard.", "The barrier and the people it affects, from the problem statement.", "The solution as co-designed, with what changed because of the people involved.", "Owner, timeline, budget and the line it comes from.", "Risks with responses, and the impact check.", "Measures at 30, 90 and 180 days, with sources.", "The decisions, restated, and the date of the 30-day check."] },
          { type: "flashcards", heading: "Sustaining the change", cards: [
            { front: "Operating owner", back: "<p>A role, not a person, in the function that lives with the change, confirmed in the room and reflected in that role’s responsibilities.</p>" },
            { front: "Removal date", back: "<p>The day the old templates, settings and processes leave circulation. Until then, people will revert to what is easiest to find.</p>" },
            { front: "Review points", back: "<p>The 30, 90 and 180 day checks on a named agenda, with the measures and their sources agreed in advance.</p>" },
            { front: "Closing the loop", back: "<p>Co-design participants and the people who first named the barrier are told what was decided and what happens next, and credited as they chose.</p>" },
          ] },
          { type: "knowledgeCheck", id: "capstone-remove-a-real-barrier-5-check", question: "Which opening best serves a capstone decision request to leadership?", options: [
            { text: "A description of how the team formed and what it learned along the way.", correct: false },
            { text: "The specific decisions requested, approve the plan, fund the ongoing line, confirm the operating owner and adopt the standard, followed by the barrier, the people affected and the co-designed solution.", correct: true },
            { text: "A video montage of the affected colleagues describing their experience.", correct: false },
          ], feedbackCorrect: "Yes. Lead with what you are asking leaders to decide; the evidence follows. Credit the people involved on their terms.", feedbackIncorrect: "Journeys and montages are not requests. Leaders need to know what they are deciding, and affected people are credited, not put on display." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Remove a real barrier",
    subtitle: "A one-page guide for a cross-functional capstone team",
    quote: "Small enough to finish, real enough to matter, designed with the people it affects.",
    use: {
      purpose: "Keep the team on the five steps and the standards for each, from choosing the barrier to sustaining the fix.",
      remember: ["A good barrier is recurring, specific, within the team’s combined authority and felt by identifiable people.", "Root causes are processes, defaults and missing owners, never people.", "Co-design happens before options are narrowed, is compensated, and leaves a record of what changed.", "One owner, three dates, no blank fields, and no measure that describes an individual."],
      doNext: "Complete the implementation plan, self-review it against the rubric, and present the decision request with the 30-day check already scheduled.",
    },
    sections: [
      { heading: "Before you design", items: ["Four-sentence problem statement: barrier, who, cost, how often. No solution yet.", "Barrier map: symptom, root cause, owning function. No names in the middle column.", "Invite the functions the map reveals are missing from the team."] },
      { heading: "Designing with people", items: ["Working session before options are narrowed; materials sent ahead in an accessible format.", "Compensation or protected time confirmed with finance and human resources.", "Nobody speaks for everyone, nobody discloses a diagnosis, nobody reviews for free.", "Record of what changed because of participants, shared back within a week."] },
      { heading: "The plan and the ask", items: ["One accountable owner by role; an operating owner for after the project.", "Budget with one-time and ongoing lines; risks with responses; an impact check on the fix itself.", "Measures at 30, 90 and 180 days: in place, working, sustained and spread.", "Decision request first; accessible materials three days ahead; 30-day check booked before you leave."] },
    ],
  },
  sources: [
    { title: "Centers for Disease Control and Prevention, Disability Inclusion", href: "https://www.cdc.gov/disability-inclusion/about/index.html", note: "Inclusion as participation supported by policies and practices, the standard the capstone measures against." },
    { title: "W3C Web Accessibility Initiative, Planning and Managing Web Accessibility", href: "https://www.w3.org/WAI/planning-and-managing/", note: "Guidance on involving people with disabilities, assigning responsibility and sustaining accessibility improvements." },
    { title: "ADA National Network", href: "https://adata.org/", note: "ADA information and guidance on accessible meetings, communication and program access." },
    { title: "Job Accommodation Network", href: "https://askjan.org/", note: "Practical guidance on workplace accommodation processes, useful for capstones that improve an accommodation workflow." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "Minnesota technical assistance on accessibility for public bodies, including meetings and communications." },
    { title: "Section508.gov", href: "https://www.section508.gov/", note: "Accessibility standards, testing and procurement guidance for capstones that involve technology or content." },
  ],
};

export default pack;
