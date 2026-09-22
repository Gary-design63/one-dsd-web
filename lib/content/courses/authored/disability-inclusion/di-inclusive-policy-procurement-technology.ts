import type { CoursePack } from "../../source-types";

// Disability Inclusion curriculum, Strategic leadership, module 3:
// Inclusive Policy, Procurement and Technology.
const pack: CoursePack = {
  course: {
    id: "di-inclusive-policy-procurement-technology",
    indexNumber: 1122,
    seriesLabel: "Disability Inclusion · Strategic leadership",
    title: "Inclusive Policy, Procurement and Technology",
    subtitle: "Build accessibility into what the agency buys, builds, publishes and approves, so barriers are prevented at the contract and the charter instead of discovered at launch.",
    scope: "For executive leaders, board members, commissioners, senior directors, policy leaders, procurement leaders, finance leaders and enterprise equity or accessibility sponsors. Participation in this program is voluntary and does not replace required training.",
    treatment: "Five short lessons with a procurement scenario, contract language, a sorting exercise, flashcards and knowledge checks",
    duration: "48–56 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/accessibility-leadership.jpg",
    coverAlt: "A mixed-race team meets around a sunlit conference table in a Minnesota office.",
    introTranscript: "Most of the technology and content staff and the public use every day was bought or approved by someone with the authority to require accessibility and no habit of doing so. This course is about building that habit into the agency’s systems: solicitations, contracts, vendor evaluation, technology selection, project governance and content processes. It works through a realistic decision about a learning platform that cannot be used by keyboard, and it shows how accessibility written in early costs a fraction of what a retrofit costs later. You will leave with contract and charter language you can use.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Explain how inaccessible technology blocks employment, services, learning and civic participation, with examples from agency operations.",
        "Specify the accessibility requirements, evidence and remedies a solicitation and contract must contain, and evaluate a vendor’s conformance claims critically.",
        "Decide on a response to an inaccessible product already under contract that assesses impact, uses the contract's terms, provides interim access and prevents recurrence.",
        "Place accessibility requirements and testing at the right stages of project governance and explain why early placement reduces cost.",
        "Set policy and content-process requirements so documents, forms, communications and rules are accessible at the source.",
      ],
      evidence: [
        "Five knowledge checks tied to contract, testing and governance decisions.",
        "A sort of solicitation and contract elements into required, evidence and remedy.",
        "A written response plan for an inaccessible product in your own area covering impact, contract, interim access and prevention.",
      ],
      appliedNextStep: "Pull the last technology or content solicitation issued in your area. Check it for the standard, the evidence required and the remedies. Send what is missing to procurement and the accessibility lead with a request to update the template.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Change in ADA, Section 504 or Section 508 guidance", "Change in DHS accessibility or language access standards", "Feedback from disabled staff or participants that a scenario reads as unrealistic or stigmatizing"],
      relatedDoor: "Contract terms, remedies and vendor disputes follow the agency’s procurement office and legal counsel; technical standards follow the State of Minnesota accessibility standard maintained by Minnesota IT Services and the agency’s accessibility lead. This course prepares a leader to require the right things, not to draft the contract alone.",
      toolkitQuestion: "Before we sign, approve or publish this, who has tested it with a keyboard and a screen reader, and what happens under the contract if it fails?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "inclusive-policy-procurement-technology-1",
        number: 1,
        title: "Inaccessible technology blocks participation",
        summary: "See how a single inaccessible system can lock people out of a job, a benefit, a class or a public meeting, and why the leaders who approve technology own that outcome.",
        minutes: 10,
        learning: {
          objective: "Explain how inaccessible technology blocks employment, services, education and civic participation, using examples from agency systems and the public they serve.",
          takeaways: [
            "Technology is now the front door to employment, benefits, learning and public input; when it is inaccessible the door is locked for a predictable group of people.",
            "The people locked out are counted nowhere, which is why leaders rarely see the cost.",
            "Accessibility requirements for technology are settled and specific; the work is requiring them, not inventing them.",
          ],
          evidence: "One knowledge check; a written list of the systems in your area that are a person’s only route to a job, a service or a decision.",
          appliedNextStep: "List the systems in your area that a person must use to apply, work, learn or be heard. Ask the accessibility lead which of them have been tested with a keyboard and a screen reader.",
        },
        scenario: {
          context: "A new time-and-attendance system is rolled out agencywide. Employees who use screen readers find they cannot submit leave requests because the calendar control is mouse-only. The project team suggests those employees email their supervisors instead, who will enter the requests for them.",
          prompt: "As the sponsoring executive, how do you see this?",
          options: [
            { label: "A reasonable temporary arrangement while the vendor works on it.", response: "It may be a necessary interim step, but only if it comes with a remediation deadline, a contractual remedy and a decision that the same failure will not be accepted at the next purchase. Alone, it makes disabled employees dependent on supervisors for something everyone else does privately." },
            { label: "A failure of the purchase and the acceptance process: the system should not have gone live without keyboard testing, and the response has to include interim access, a fixed remediation date under the contract and a change to how systems are accepted.", response: "This reads the event as a system failure with a system fix, which is what it is. Interim access protects people now; the contract and the acceptance change protect them next time.", recommended: true },
            { label: "A minor usability issue affecting a small number of employees.", response: "The number affected is not the measure. A system that removes a group’s ability to manage their own leave privately, on a tool every other employee uses, is an access barrier and an employment equity issue." },
          ],
        },
        transfer: {
          prompt: "Which system in your area is currently a person’s only route to something they need?",
          options: ["Name it and who owns it", "Ask whether it has been tested by disabled users", "Decide what interim access would look like if it fails tomorrow"],
        },
        blocks: [
          { type: "text", heading: "The front door is a login page", body: "<p>A generation ago, an inaccessible building kept people out of a job or a service. Today the building has an accessible entrance and the application is online only. The applicant tracking system, the benefits portal, the learning platform, the meeting software and the public comment form are now the front door, and when they cannot be used by keyboard, by screen reader, with captions or with enough time, they lock out a predictable group of people: blind and low-vision users, people who cannot use a mouse, Deaf and hard-of-hearing participants, people with cognitive and learning disabilities and many others.</p><p>The people locked out are counted nowhere. An applicant who cannot complete the online form does not appear as an incomplete application; a staff member who cannot use the training platform appears as noncompliant with a requirement; a resident who cannot join the virtual hearing appears as uninterested. The damage is real and the reports are clean, which is why leaders who approve technology seldom see what it did.</p><p>The requirements are settled. The Web Content Accessibility Guidelines from the World Wide Web Consortium define what accessible digital content and interfaces do. Section 508 sets the federal standard for information and communication technology, and the State of Minnesota maintains an accessibility standard for state agencies that Minnesota IT Services publishes and supports. The Department of Justice has made clear that state and local government web content and mobile applications are within the ADA’s reach. None of this has to be invented by the agency. It has to be required, in writing, before the purchase.</p>" },
          { type: "tabs", heading: "Four things one inaccessible system can block", tabs: [
            { label: "Employment", body: "<p>An applicant tracking system with unlabeled fields or a timed assessment that cannot be paused ends a candidacy before a person sees it. A time-and-attendance or performance system that cannot be used with a screen reader makes an employee dependent on others for routine tasks.</p>" },
            { label: "Services", body: "<p>An eligibility portal with a mouse-only date picker, a document upload that gives no feedback, or a session that times out during a slow, careful completion turns an eligible person into a nonapplicant.</p>" },
            { label: "Learning", body: "<p>A learning platform that cannot be navigated by keyboard or whose assessments are drag-and-drop only makes required training impossible for some staff, then records them as out of compliance.</p>" },
            { label: "Civic participation", body: "<p>A public hearing on a platform with captions disabled, or a comment form that screen readers cannot complete, removes people from decisions about their own services while the record shows a public process took place.</p>" },
          ] },
          { type: "leaderMove", heading: "Ask who tested it before you approve it", control: "You control whether a system reaches staff or the public without anyone having tried it with a keyboard and a screen reader.", failure: "Do not accept a vendor’s statement of conformance as a test. Do not approve a go-live with a plan to accommodate by exception whoever gets stuck.", next: "For every technology approval on your desk, ask for the test record before you sign, and ask for the interim access plan if it is not there." },
          { type: "flashcards", heading: "Standards a leader should be able to name", cards: [
            { front: "WCAG", back: "<p>The Web Content Accessibility Guidelines from the World Wide Web Consortium. The widely adopted technical standard for accessible web content and interfaces, organized around content being perceivable, operable, understandable and robust. Conformance is usually specified at level AA.</p>" },
            { front: "Section 508", back: "<p>The federal standard requiring that information and communication technology developed, procured, maintained or used by federal agencies be accessible. Its standards and its procurement guidance are widely used as a model by states.</p>" },
            { front: "State of Minnesota accessibility standard", back: "<p>The accessibility standard for state agencies, published and supported by Minnesota IT Services. The agency’s accessibility lead can say how it applies to a given purchase.</p>" },
            { front: "ADA Title II and the web", back: "<p>The Department of Justice has made clear that web content and mobile applications of state and local governments must be accessible. Legal counsel and the ADA coordinator advise on specifics.</p>" },
          ] },
          { type: "list", heading: "Questions to ask before approving any technology", ordered: true, items: ["Is this anyone’s only route to a job, a benefit, required training or a public decision?", "Who has tried it with a keyboard alone and with a screen reader, on our real tasks, and where is the record?", "Are captions, transcripts and other access features on by default, or does someone have to ask?", "What does the contract let us require if it fails after launch?", "What is the interim access plan if a defect is found on the first day?"] },
          { type: "knowledgeCheck", id: "inclusive-policy-procurement-technology-1-check", question: "Why do leaders who approve inaccessible technology rarely see its effects?", options: [
            { text: "Because most people with disabilities do not use technology.", correct: false },
            { text: "Because the people locked out appear in the data as nonapplicants, noncompliant staff or uninterested residents, not as people the system excluded.", correct: true },
            { text: "Because vendors are required to report accessibility problems and usually do not.", correct: false },
          ], feedbackCorrect: "Yes. The exclusion is real and the reports are clean. That is why testing before approval matters more than waiting for complaints.", feedbackIncorrect: "The harm hides in ordinary categories. A person who cannot complete the form is recorded as someone who did not apply." },
        ],
      },
      {
        id: "inclusive-policy-procurement-technology-2",
        number: 2,
        title: "Accessibility in solicitations, contracts and vendor evaluation",
        summary: "Learn what a solicitation must require, what evidence to ask for, how to read a vendor’s conformance claims, and what remedies the contract needs.",
        minutes: 12,
        learning: {
          objective: "Specify the accessibility requirements, evidence and remedies a solicitation and contract must contain, and evaluate a vendor’s conformance claims critically.",
          takeaways: [
            "A solicitation needs three things: the standard, the evidence and the remedy. Most agency templates have the first and neither of the others.",
            "A vendor’s accessibility conformance report is a self-declaration; read it for what it admits, and verify it with a hands-on test before award.",
            "Weight accessibility in scoring so it can decide the award, and make conformance a contract obligation with dates and consequences.",
          ],
          evidence: "A completed sort of solicitation elements; one knowledge check; a marked-up copy of your area’s standard solicitation language.",
          appliedNextStep: "Ask procurement for the accessibility language in the current solicitation template and mark what is missing against the standard, evidence and remedy list in this lesson.",
        },
        scenario: {
          context: "Three vendors respond to a solicitation for a new case-management system. The highest-scoring proposal includes an accessibility conformance report in which most criteria are marked “supports” and several are marked “partially supports,” with notes such as “keyboard navigation is available for primary tasks.” The evaluation team recommends award.",
          prompt: "As the procurement leader, what do you require before award?",
          options: [
            { label: "Accept the report; the vendor has documented conformance and scored highest overall.", response: "A conformance report is a self-declaration. “Partially supports” and “primary tasks” are the vendor telling you where it will fail. Award now and you own those failures." },
            { label: "Require a hands-on test of the actual product by the accessibility lead and disabled users on the agency’s key tasks, ask the vendor to specify each partial item and its remediation date, and make those dates and remedies part of the contract before award.", response: "This turns a self-declaration into verified evidence and turns promises into obligations. It is the moment of greatest influence the agency will ever have with this vendor.", recommended: true },
            { label: "Award to the second-place vendor, whose report has no partial items.", response: "A cleaner report is not a more accessible product; it may only be a less candid one. Test both before deciding, and hold whichever is chosen to contract terms." },
          ],
        },
        transfer: {
          prompt: "What does your area’s current solicitation template say about accessibility?",
          options: ["Find the standard it names, if any", "Find the evidence it requires and whether anyone tests it", "Find the remedy if the product fails after award"],
        },
        blocks: [
          { type: "text", heading: "Standard, evidence, remedy", body: "<p>A solicitation for anything people will use, whether software, a website, documents, training or a service that produces content, needs three elements. The <strong>standard</strong>: name the conformance level, typically the Web Content Accessibility Guidelines at level AA and the State of Minnesota accessibility standard, and say it applies to every user-facing function including administrative and reporting screens, not only the public ones. The <strong>evidence</strong>: require an accessibility conformance report, a description of the vendor’s own testing including testing with assistive technology, and access to a working version of the product for the agency’s own test before award. The <strong>remedy</strong>: the contract must state that conformance is a material obligation, set remediation timelines for defects found before and after award, provide for interim access at the vendor’s cost, and allow withheld payment, cure periods and termination for persistent failure. Section508.gov’s buy and sell guidance and the W3C Web Accessibility Initiative both cover these elements in detail; procurement and legal counsel adapt them to state contract rules.</p><p>Read a conformance report as an admission, not a guarantee. Vendors write their own. “Supports” means the vendor believes it does; “partially supports” means it does not; “not applicable” deserves a question. Ask what version was tested, by whom, with which assistive technology, and when. Then have the accessibility lead and, where possible, disabled staff or participants run the agency’s real tasks on the real product. Ten minutes with a keyboard finds what a forty-page report conceals.</p><p>Finally, make accessibility count in the score. If it carries a small weight, the highest-scoring proposal can be the least accessible, and the evaluation team will feel bound to recommend it. Set a minimum accessibility threshold below which a proposal is not considered, and weight verified accessibility heavily enough that it can decide between otherwise close bids.</p>" },
          { type: "sorting", id: "inclusive-policy-procurement-technology-2-sort", heading: "Standard, evidence or remedy?", categories: ["Standard", "Evidence", "Remedy"], items: [
            { text: "All user-facing functions, including administrative screens, conform to the Web Content Accessibility Guidelines at level AA.", category: "Standard" },
            { text: "The vendor provides a conformance report naming the version tested, the testers and the assistive technology used.", category: "Evidence" },
            { text: "Defects found after award are remediated within agreed timelines, with interim access provided at the vendor’s cost.", category: "Remedy" },
            { text: "The agency may test a working version of the product on its own key tasks before award.", category: "Evidence" },
            { text: "Payment may be withheld and the contract terminated for persistent nonconformance after a cure period.", category: "Remedy" },
            { text: "Captions, transcripts and keyboard operability are required for all training content delivered under the contract.", category: "Standard" },
          ] },
          { type: "leaderMove", heading: "Use the influence you have before you sign", control: "You control the moment of greatest influence with a vendor: before award, when accessibility can still decide the outcome.", failure: "Do not treat a conformance report as proof. Do not let accessibility carry so little weight in scoring that the least accessible proposal can win.", next: "Set a minimum accessibility threshold and a meaningful weight in the next evaluation plan, and require a hands-on test before any award." },
          { type: "accordion", heading: "Questions to ask about any conformance report", items: [
            { title: "What exactly was tested?", body: "<p>Which product version, which modules, and does that match what the agency is buying? A report on an older version or on the public site alone tells you little about the administrative screens staff will use all day.</p>" },
            { title: "Who tested it and how?", body: "<p>Did the vendor test with screen readers, keyboard only, magnification and captions, or only run a checker? Checkers find a minority of barriers. Ask for the method.</p>" },
            { title: "What do the partial and unsupported items mean for our users?", body: "<p>Ask the vendor to translate each one into a task a person could not complete. “Partially supports keyboard navigation” may mean a screen-reader user cannot approve a case.</p>" },
            { title: "What is the remediation commitment?", body: "<p>For each gap, a date and a description of the fix, written into the contract. A roadmap without dates is a hope.</p>" },
            { title: "Can we test it ourselves before award?", body: "<p>If the answer is no, that is an answer.</p>" },
          ] },
          { type: "flashcards", heading: "Contract language, in outline", cards: [
            { front: "Conformance as a material obligation", back: "<p>The product and everything delivered under the contract conform to the named standard for the life of the contract, including updates. Nonconformance is a breach, not a feature request.</p>" },
            { front: "Remediation timelines", back: "<p>Defects that block a task are fixed within a short agreed window; others within a longer one. The clock starts when the agency reports the defect.</p>" },
            { front: "Interim access at vendor cost", back: "<p>While a defect is open, the vendor funds an equivalent accessible way to complete the task. This keeps the cost of failure with the party that caused it.</p>" },
            { front: "Cure, withholding and termination", back: "<p>A cure period, the right to withhold payment tied to conformance milestones, and termination for persistent failure. Legal counsel adapts these to state contract rules.</p>" },
            { front: "Testing rights", back: "<p>The agency may test the product with assistive technology and with disabled users at any time, and the vendor cooperates with the tests.</p>" },
          ] },
          { type: "knowledgeCheck", id: "inclusive-policy-procurement-technology-2-check", question: "A vendor’s conformance report marks every criterion “supports.” What is the appropriate next step before award?", options: [
            { text: "Accept the report; a complete “supports” rating meets the requirement.", correct: false },
            { text: "Ask which version was tested, by whom and with what assistive technology, and have the accessibility lead and disabled users test the agency’s key tasks on the actual product.", correct: true },
            { text: "Ask the vendor to sign a statement that the report is accurate.", correct: false },
          ], feedbackCorrect: "Yes. A self-declaration is verified by testing, not by a second signature. A uniformly perfect report deserves more scrutiny, not less.", feedbackIncorrect: "The report is the vendor’s opinion of the vendor’s product. Only a hands-on test on your own tasks tells you what your users will meet." },
        ],
      },
      {
        id: "inclusive-policy-procurement-technology-3",
        number: 3,
        title: "Testing, remediation timelines and vendor accountability",
        summary: "Decide what to do when a product under contract turns out to be inaccessible, using a learning platform that cannot be navigated by keyboard as the case.",
        minutes: 11,
        learning: {
          objective: "Decide on a response to an inaccessible product already under contract that assesses impact, uses the contract's terms, provides interim access and prevents recurrence through procurement standards.",
          takeaways: [
            "The four parts of a sound response are impact, contract, interim access and prevention; a response that skips any of them will repeat.",
            "Accepting a workaround, requiring remediation, choosing another vendor and delaying implementation are not exclusive; the right answer usually combines them in sequence.",
            "Interim access is owed now, it should not depend on the vendor’s timeline, and it should not require disabled staff to disclose anything to get it.",
          ],
          evidence: "One knowledge check; a written four-part response plan for a real or plausible inaccessible product in your area.",
          appliedNextStep: "Ask the accessibility lead which products currently under contract have known access defects, and for one of them write the impact, the contract terms, the interim access and the prevention step.",
        },
        scenario: {
          context: "The agency’s new learning-management system, six weeks from mandatory rollout, turns out to lack reliable keyboard navigation, and its assessments are drag-and-drop only, so employees who use screen readers or cannot use a mouse can neither complete courses nor pass the checks that record completion. The vendor offers a workaround: staff who cannot use it can request a paper version through their supervisor. Leaders are weighing four paths: accept the workaround, require remediation, select another vendor, or delay implementation.",
          prompt: "What is the recommended response?",
          options: [
            { label: "Accept the vendor’s workaround so the rollout stays on schedule, and revisit accessibility in the next contract cycle.", response: "This makes disabled employees disclose to a supervisor to get required training, records them as exceptions and leaves the defect and the contract untouched. It is the path that guarantees the same failure at the next purchase." },
            { label: "Assess who is affected and how; invoke the contract to require remediation with dated milestones and interim access at the vendor’s cost; provide an equivalent accessible way to complete each course and assessment now, without requiring disclosure; delay mandatory status for anyone the defect blocks; and change the procurement standard and acceptance testing so no platform is accepted again without keyboard and assessment testing.", response: "This is the four-part response: impact, contract, interim access and prevention. It keeps the rollout honest, keeps the cost with the vendor and closes the door the defect came through.", recommended: true },
            { label: "Cancel the contract and start a new procurement for a different platform.", response: "Sometimes the right end point, but on its own it leaves staff without training for the year the new procurement takes and does nothing to prevent the next platform from having the same defect. Remediation with a termination remedy in reserve is usually the stronger sequence." },
          ],
        },
        transfer: {
          prompt: "Which product under contract in your area would this scenario describe if you changed the name?",
          options: ["Write who is affected and what they cannot do", "Find the contract clause that gives you the right to require a fix, or note that there is none", "Decide what equivalent access you will provide this month"],
        },
        blocks: [
          { type: "text", heading: "Four parts, in order", body: "<p>When a product already under contract turns out to be inaccessible, the four options leaders usually see, accept a workaround, require remediation, select another vendor or delay, are not a menu with one right item. A sound response does four things, in an order that protects people first and the agency second.</p><p><strong>Assess impact.</strong> Who cannot do what? Which tasks are blocked entirely and which are merely harder? Is the product a person’s only route to something required, such as mandatory training, leave requests or a benefit? The accessibility lead runs the product with a keyboard, a screen reader and magnification, and disabled staff or participants confirm what it is like in practice. <strong>Use the contract.</strong> Notify the vendor in writing that the product does not conform, cite the clause, and require a remediation plan with dated milestones, interim access at the vendor’s cost and a cure period. If the contract has no such clause, that is a finding for the prevention step, and legal counsel advises on what options remain. <strong>Provide interim access.</strong> People are owed a working way to do the task now, not when the vendor ships a fix. That means an equivalent accessible path, offered to everyone without requiring anyone to disclose a disability or ask a supervisor, and a pause on any deadline or mandatory status the defect makes unfair. <strong>Prevent recurrence.</strong> Change the solicitation template, the evaluation weights and the acceptance test so the next product cannot be accepted without hands-on testing of the tasks that failed here.</p><p>Choosing another vendor and delaying implementation both belong inside this structure. Delay is often part of interim access; a different vendor is what a termination remedy is for when remediation fails. Neither is a substitute for the four parts.</p>" },
          { type: "list", heading: "The response plan, written down", ordered: true, items: ["Impact: the tasks blocked, the groups affected and whether the product is anyone’s only route to something required.", "Contract: the written notice, the clause cited, the remediation milestones requested and the cure period.", "Interim access: the equivalent accessible path, offered to all without disclosure, and the deadlines paused.", "Prevention: the changes to the solicitation template, scoring and acceptance testing, with the owner and date for each.", "Record: what was found, decided and done, so the next review point can check it."] },
          { type: "leaderMove", heading: "Owe access now, not when the vendor ships", control: "You control whether disabled staff wait for a vendor’s roadmap or get an equivalent way to do the task this week.", failure: "Do not make interim access conditional on disclosure to a supervisor. Do not let a mandatory deadline stand for people the defect blocks.", next: "For any product with a known access defect in your area, confirm the interim path exists and is offered to everyone, and confirm the vendor notice has been sent." },
          { type: "quote", text: "The paper version was fine. What was not fine was having to tell my new supervisor why I needed it, on my second week, to do the same training everyone else did at their desk.", cite: "Composite staff perspective, illustrative" },
          { type: "flashcards", heading: "What each option is for", cards: [
            { front: "Accept a workaround", back: "<p>Acceptable only as interim access: temporary, equivalent, offered to all without disclosure, with the defect still under remediation. Never acceptable as the resolution.</p>" },
            { front: "Require remediation", back: "<p>The usual center of the response. Written notice, the clause, dated milestones, vendor-funded interim access and a cure period.</p>" },
            { front: "Select another vendor", back: "<p>What the termination remedy is for when remediation fails or the vendor will not commit. Plan for the transition and do not lose the lessons for the new solicitation.</p>" },
            { front: "Delay implementation", back: "<p>Often right for mandatory status and deadlines, so no one is recorded as out of compliance for a defect the agency accepted. Rarely right as a substitute for interim access.</p>" },
          ] },
          { type: "knowledgeCheck", id: "inclusive-policy-procurement-technology-3-check", question: "A vendor commits to fixing keyboard navigation in a required system within four months. Which element must still be in place during those months?", options: [
            { text: "A note in the release communication asking affected staff to be patient.", correct: false },
            { text: "An equivalent accessible way to complete each blocked task, offered to everyone without requiring disclosure, with any related deadlines paused and the interim cost carried by the vendor where the contract allows.", correct: true },
            { text: "A list of affected employees kept by human resources so they can be excused from the requirement.", correct: false },
          ], feedbackCorrect: "Yes. Interim access is owed now and must not depend on disclosure or on the vendor’s schedule.", feedbackIncorrect: "Patience is not access, and a list of affected employees turns a product defect into a record about people. Provide the equivalent path to everyone." },
        ],
      },
      {
        id: "inclusive-policy-procurement-technology-4",
        number: 4,
        title: "Accessibility early in project governance",
        summary: "Place accessibility requirements, testing and sign-off at the right stages of a project so retrofits become rare, and see what it costs when they are not.",
        minutes: 10,
        learning: {
          objective: "Place accessibility requirements and testing at the right stages of project governance and explain why early placement reduces cost and risk.",
          takeaways: [
            "A barrier costs least to prevent at requirements, more at design, much more at build and most after launch; the order never changes.",
            "Stage gates are where a sponsor’s authority lives; an accessibility criterion at each gate is how that authority is exercised without a meeting.",
            "Testing with disabled users belongs before launch, on real tasks, with time in the schedule to act on what is found.",
          ],
          evidence: "One knowledge check; a marked-up copy of your area’s project stage-gate checklist with accessibility criteria added.",
          appliedNextStep: "Take your area’s project approval template and add one accessibility criterion at each gate: charter, design, build, acceptance and post-launch review.",
        },
        scenario: {
          context: "A benefits portal redesign is at the final acceptance gate. Testing with screen-reader users, scheduled for the first time this week, finds that the document upload gives no feedback and the multi-step form loses data when a screen reader user moves backward. The project manager asks to launch on schedule and fix the issues in a later release.",
          prompt: "As the executive at the gate, what do you decide?",
          options: [
            { label: "Launch on schedule and track the fixes in the next release.", response: "Launching a benefits portal that loses blind applicants’ data is a program failure and a civil rights exposure, and later releases have a way of moving. The gate exists for this decision." },
            { label: "Hold the launch until the blocking defects are fixed and retested, provide the existing channels in the meantime, and change the governance so testing with disabled users happens at design and build, not at final acceptance.", response: "This uses the gate for what it is for and treats the late discovery as the real finding: the testing was in the wrong place.", recommended: true },
            { label: "Launch for the general public and keep the old portal available for people with disabilities.", response: "A separate, older system for disabled applicants is the outcome the law was written to prevent, and it will be maintained badly because nobody is measured on it." },
          ],
        },
        transfer: {
          prompt: "At which gate does accessibility first appear in your area’s projects today?",
          options: ["Find the project approval template and mark where accessibility is mentioned", "Add a criterion at charter, design, build, acceptance and post-launch", "Name who signs each criterion and what evidence they look at"],
        },
        blocks: [
          { type: "text", heading: "The cost curve and the stage gate", body: "<p>Every project discipline knows the same curve: a requirement missed at the start costs little to add, more to add at design, much more at build and most after launch, when it means rework, parallel processes, complaints and sometimes a second procurement. Accessibility follows the curve exactly. A keyboard-operable date picker is a line in a requirements document; after launch it is a change request, a vendor negotiation, a retest and an interim process for everyone the defect blocked.</p><p>Project governance already has the mechanism to move accessibility to the cheap end of the curve: stage gates. Each gate is a moment when a sponsor’s signature is required and criteria are checked. An accessibility criterion at each gate exercises the sponsor’s authority automatically. At the charter gate, the criterion is that access is a named success criterion with a standard and an owner. At design, that the accessibility lead has reviewed the designs and that tasks have been walked with assistive technology in mind. At build, that both a checker and hands-on testing are running and defects are tracked with the same priority as any other. At acceptance, that disabled users have completed the key tasks on the real product and blocking defects are closed. After launch, that barrier reports are monitored and a retest is scheduled.</p><p>Testing with disabled users is the part most often left to the end, where there is no time to act on it. Move it earlier and budget time to respond. The W3C Web Accessibility Initiative’s evaluation guidance is clear that involving users with disabilities throughout finds problems that expert review alone misses, and finds them when they are still cheap.</p>" },
          { type: "accordion", heading: "An accessibility criterion at every gate", items: [
            { title: "Charter", body: "<p>Access is a named success criterion with the standard, the acceptance test and the owner. The budget includes testing, remediation and disabled-user testing. The sponsor does not sign without it.</p>" },
            { title: "Design", body: "<p>The accessibility lead has reviewed the designs, key tasks have been described for keyboard and screen-reader use, and content plans include captions, transcripts, plain language and accessible documents.</p>" },
            { title: "Build", body: "<p>Accessibility checks run as the product is built, manual testing is scheduled, and accessibility defects are tracked and prioritized alongside every other defect, not in a separate list that ships last.</p>" },
            { title: "Acceptance", body: "<p>Disabled users have completed the key tasks on the real product. Blocking defects are closed and retested. The vendor’s remediation dates for remaining items are in the contract. The go-live includes an interim access plan.</p>" },
            { title: "Post-launch", body: "<p>Barrier reports have a route and an owner, a retest is scheduled, and the review point checks whether the remaining items were fixed on the dates promised.</p>" },
          ] },
          { type: "leaderMove", heading: "Let the gate do the work", control: "You control the criteria at each gate you sign, and therefore whether accessibility is checked five times before launch or once after.", failure: "Do not allow a project to reach acceptance with disabled-user testing scheduled for the first time that week. Do not approve a launch that relies on a separate system for disabled users.", next: "Add the five gate criteria to your area’s project template and send it to the project management office this month." },
          { type: "flashcards", heading: "Where a barrier costs what", cards: [
            { front: "At requirements", back: "<p>One sentence in a document and a line in the budget. This is where a keyboard-operable control, captions and accessible documents cost almost nothing.</p>" },
            { front: "At design", back: "<p>A review and a revision. Still cheap, and the moment to walk the tasks with assistive technology in mind.</p>" },
            { front: "At build", back: "<p>Rework of code and content, retesting and schedule pressure. Manageable if defects are tracked with normal priority.</p>" },
            { front: "After launch", back: "<p>Change requests, vendor negotiation, interim processes, complaints, retrofit budgets and sometimes a second procurement. The most expensive place to learn.</p>" },
          ] },
          { type: "statement", body: "A stage gate is the sponsor’s authority made routine. Put an accessibility criterion at every gate and the right question gets asked five times before launch, whether or not anyone remembers to ask it." },
          { type: "knowledgeCheck", id: "inclusive-policy-procurement-technology-4-check", question: "Which change to project governance most reduces the cost of accessibility defects?", options: [
            { text: "Adding a thorough accessibility audit after launch.", correct: false },
            { text: "Requiring an accessibility criterion at every gate, with disabled-user testing on real tasks before acceptance and time in the schedule to act on it.", correct: true },
            { text: "Requiring the vendor to certify accessibility in the contract.", correct: false },
          ], feedbackCorrect: "Yes. Defects found at each gate are cheaper than the same defects found at the next, and a criterion at every gate exercises the sponsor’s authority without a meeting.", feedbackIncorrect: "A post-launch audit finds defects at their most expensive, and a certification is a promise. Put the checks where the cost is low." },
        ],
      },
      {
        id: "inclusive-policy-procurement-technology-5",
        number: 5,
        title: "Policy and content that are accessible at the source",
        summary: "Set the policy language and the content process requirements so documents, forms, communications and rules are accessible when created, not repaired afterward.",
        minutes: 9,
        learning: {
          objective: "Set policy and content-process requirements so documents, forms, communications and rules are accessible at the source, and write policy language that does not create barriers.",
          takeaways: [
            "Most inaccessible content is produced by staff using inaccessible templates and untested tools; fix the templates and the tools, not the staff.",
            "A content process has three places to build in access: the template, the check before publication and the owner who answers for it.",
            "Policies create barriers too: single channels, rigid timelines, and requirements to appear in person or disclose a diagnosis are policy choices that can be changed.",
          ],
          evidence: "One knowledge check; a list of the three highest-use templates in your area and their accessibility status.",
          appliedNextStep: "Ask communications and the accessibility lead which of your area’s three highest-use templates are accessible at the source, and set a date for the rest.",
        },
        scenario: {
          context: "A policy division is drafting a rule that requires people to renew a service in person at a county office within a fixed ten-day window, with a written notice sent as a scanned letter. The division sees this as a program integrity measure.",
          prompt: "As the policy leader, what do you ask for before the rule advances?",
          options: [
            { label: "Advance the rule; program integrity justifies the requirements.", response: "Program integrity is a legitimate aim, but a single in-person channel, a rigid window and a scanned notice are three barriers layered on one another. The rule will exclude people who cannot travel, cannot read the letter or cannot make the window, and none of that serves integrity." },
            { label: "Require an accessibility and equity review of the rule: more than one renewal channel, a window with an extension process that does not require a diagnosis, and a notice produced from an accessible template; then confirm with the ADA coordinator that the design meets the agency’s obligations.", response: "This keeps the aim and removes the barriers. Policy is content too, and it is checked the same way: who cannot use this, and what changes so they can.", recommended: true },
            { label: "Add a sentence that reasonable accommodations are available on request.", response: "An accommodation sentence at the end of an inaccessible rule moves the cost to the person. The rule itself is the barrier and the rule is what changes." },
          ],
        },
        transfer: {
          prompt: "Which policy or rule in your area sets a single channel, a rigid window or an in-person requirement?",
          options: ["Name it and the people it most likely excludes", "Draft the alternative channel and the extension process", "Send it to the ADA coordinator and the accessibility lead for review before it advances"],
        },
        blocks: [
          { type: "text", heading: "Fix the template, check before publishing, name the owner", body: "<p>The agency produces thousands of documents, forms, notices, slide decks and web pages a year, almost all of them by staff who are not accessibility specialists. Remediating them afterward is endless and expensive. The leadership decision is to make access the default at the source: accessible templates for every high-use document type, authoring tools that have been tested, a required check before anything is published or sent at scale, and a named owner for each content stream who answers for it at review points. The accessibility lead sets the standard and tests the templates; communications owns the templates; each unit owns what it produces with them.</p><p>Policies and rules are content, and they create barriers of their own. A single way to apply or renew, a rigid window, an in-person requirement, a demand for a diagnosis or a doctor’s letter where a description of need would do, a notice that is only mailed: each is a policy choice, and each has a more accessible alternative that serves the same purpose. Build an accessibility and equity review into the policy development process, before a rule advances, with the ADA coordinator and the accessibility lead among the reviewers.</p><p>Plain language belongs here as well. A rule or notice that a person cannot understand is not accessible even if it is technically readable. The agency’s writing standards and plain-language reviewers are part of the content process, not an afterthought to it.</p>" },
          { type: "list", heading: "Content process requirements a leader can set", items: ["Accessible templates for notices, letters, forms, slides, newsletters and web pages, tested by the accessibility lead and maintained by communications.", "Authoring and publishing tools tested with assistive technology before they are approved for use.", "A required accessibility and plain-language check before anything is published or sent at scale, with the evidence kept.", "A named owner for each content stream who reports on template status and defects at review points.", "Training for content creators built into a new employee's first weeks and refreshed when templates or tools change.", "A barrier-report route printed on public documents and web pages, with an owner who responds."] },
          { type: "leaderMove", heading: "Review the rule for the barriers it creates", control: "You control whether a policy advances with one channel, a rigid window and a diagnosis requirement, or with alternatives built in.", failure: "Do not let an accommodation sentence at the end substitute for an accessible rule. Do not accept a scanned or image-only notice as the official communication of anything.", next: "Add an accessibility and equity review step, with the ADA coordinator and accessibility lead, to your area’s policy development checklist." },
          { type: "artifact", kind: "plain-language-flyer", label: "Practical artifact", title: "Before this goes out: a four-line check", summary: "The check every content owner runs before publishing or sending at scale. Print it, post it, build it into the routine.", fields: [
            { label: "Source", value: "Made from the current accessible template; real text, not an image; headings, alt text, labeled fields and descriptive links in place." },
            { label: "Language", value: "Plain language checked; the reader can tell what it is, what to do and by when in the first few lines." },
            { label: "Channels", value: "More than one way to respond or act; a phone number and a named contact for alternative formats; no requirement to disclose a diagnosis to get help." },
            { label: "Owner and route", value: "The content owner is named; the barrier-report route is printed; the check is recorded for the review point." },
          ], action: "Add these four lines to the publishing checklist for your unit and ask the content owner to sign each one." },
          { type: "flashcards", heading: "Policy choices that create barriers, and the alternative", cards: [
            { front: "One channel to apply or renew", back: "<p>Alternative: online, phone, paper and in person, each leading to the same result, with the accessible version the default rather than the exception.</p>" },
            { front: "A rigid window", back: "<p>Alternative: a window with a plain extension process that asks what the person needs, not for a diagnosis or a doctor’s letter.</p>" },
            { front: "In person only", back: "<p>Alternative: an equivalent remote or proxy-free option, so people who cannot travel keep their privacy and independence.</p>" },
            { front: "A mailed, scanned notice as the only communication", back: "<p>Alternative: an accessible notice from a template, offered in the person’s chosen format and channel, with a named contact for alternatives.</p>" },
          ] },
          { type: "knowledgeCheck", id: "inclusive-policy-procurement-technology-5-check", question: "Which approach most reduces inaccessible documents across a large agency?", options: [
            { text: "Fund a remediation team to repair documents after they are published.", correct: false },
            { text: "Make the high-use templates and authoring tools accessible at the source, require a check before publication, and name an owner for each content stream.", correct: true },
            { text: "Require every staff member to complete an advanced document accessibility course.", correct: false },
          ], feedbackCorrect: "Yes. Templates, a check and an owner change what thousands of people produce by default. Remediation and universal advanced training chase the output instead.", feedbackIncorrect: "Repairing afterward is endless and training everyone to expert level is unrealistic. Change the source: templates, tools, a check and an owner." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Buy it, build it, publish it accessible",
    subtitle: "A one-page reminder for procurement, technology, policy and program leaders",
    quote: "Standard, evidence, remedy. Impact, contract, interim access, prevention.",
    use: {
      purpose: "Keep the questions that prevent barriers at hand when approving a purchase, a project gate, a rule or a template.",
      remember: ["A conformance report is a self-declaration; a hands-on test on your tasks is evidence.", "Before award is the moment of greatest influence; use it.", "Interim access is owed now, to everyone, without disclosure.", "A barrier costs least at requirements and most after launch; put the checks at the gates."],
      doNext: "Check your area’s solicitation template and project approval template for the standard, the evidence, the remedy and a criterion at every gate.",
    },
    sections: [
      { heading: "Before you sign a contract", items: ["Does the solicitation name the standard for every user-facing function, including administrative screens?", "Did the accessibility lead and disabled users test the real product on our key tasks?", "Does the contract make conformance a material obligation with remediation dates, vendor-funded interim access, cure, withholding and termination?", "Does accessibility carry enough weight in scoring to decide the award?"] },
      { heading: "When a product under contract fails", items: ["Impact: who cannot do what, and is this their only route to something required?", "Contract: written notice, the clause, dated milestones, a cure period.", "Interim access: an equivalent path for everyone, no disclosure, deadlines paused.", "Prevention: the template, the scoring and the acceptance test changed, with an owner and date."] },
      { heading: "Before a rule or a template goes out", items: ["More than one channel; an extension process that does not require a diagnosis; no in-person-only requirement without an alternative.", "Made from an accessible template; real text; plain language; a named contact for alternative formats.", "Reviewed by the ADA coordinator and the accessibility lead before it advances."] },
    ],
  },
  sources: [
    { title: "Section508.gov, Buy and Sell Accessible Products and Services", href: "https://www.section508.gov/buy-sell/", note: "Federal guidance on writing accessibility requirements into solicitations, evaluating conformance reports and managing vendor accountability." },
    { title: "W3C Web Accessibility Initiative, WCAG 2 Overview", href: "https://www.w3.org/WAI/standards-guidelines/wcag/", note: "The Web Content Accessibility Guidelines and their conformance levels, the technical standard named in most procurements." },
    { title: "W3C Web Accessibility Initiative, Evaluating Web Accessibility", href: "https://www.w3.org/WAI/test-evaluate/", note: "Guidance on evaluation, including the value of involving users with disabilities throughout a project." },
    { title: "U.S. Access Board, Information and Communication Technology", href: "https://www.access-board.gov/ict/", note: "The Section 508 standards for information and communication technology that many state requirements follow." },
    { title: "Minnesota IT Services, Accessibility", href: "https://mn.gov/mnit/about-mnit/accessibility/", note: "The State of Minnesota accessibility standard and resources for state agencies, including procurement and content guidance." },
    { title: "ADA.gov, Guidance on Web Accessibility and the ADA", href: "https://www.ada.gov/resources/web-guidance/", note: "Department of Justice guidance that state and local government web content must be accessible to people with disabilities." },
  ],
};

export default pack;
