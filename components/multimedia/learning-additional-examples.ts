import type { LearningCompanionSpec } from "./learning-companion-data";

/** Resource-specific original teaching examples, kept outside indexed source blocks. */
export const ADDITIONAL_LEARNING_EXAMPLES: readonly LearningCompanionSpec[] = [
  {
    courseId: "mobility-acting-promotion", lessonId: "mo-acting", format: "flow", title: "Follow an acting opportunity beyond the hallway",
    introduction: "In this fictional example, an acting assignment is mentioned to one colleague between meetings. The team examines the channel before making the offer.",
    panels: [
      { title: "Who heard?", text: "Only the colleague in the hallway knows the assignment exists.", annotation: "The channel has already narrowed access. Record who could learn about the opportunity through this route." },
      { title: "Check the permitted route", text: "The responsible hiring or labor contact confirms the process for this assignment.", annotation: "Use a documented notice where permitted. If the applicable process limits posting, record the actual limit; do not invent a universal posting requirement." },
      { title: "Make the offer workable", text: "Confirm the duties, classification, pay, time and coverage of existing work.", annotation: "Ask how the experience will be recognized later. Coverage is assigned work, not something another colleague silently absorbs." },
    ], practice: "Where would someone outside the usual conversation learn about this assignment?", workProduct: "Draft a notice-and-support note naming the channel, process contact, workload coverage and recognition."
  },
  {
    courseId: "facilitators-guide-equity-inclusion-curriculum", lessonId: "fg-access", format: "parallel", title: "Test the session from both sides of the connection",
    introduction: "A fictional hybrid workshop has a room microphone and a remote connection. Compare what each participant can actually use before the discussion starts.",
    panels: [
      { title: "In the room", text: "Materials are readable, paths are clear, and the microphone carries every contribution.", annotation: "Test a voice from the far side of the room. A facilitator's working microphone does not establish that participants can hear one another." },
      { title: "Joining remotely", text: "Shared materials, captions and a way to contribute are available together.", annotation: "Join through the participant link to test them. A room-only screen or discussion can leave remote colleagues outside the decision." },
      { title: "When access fails", text: "Pause the discussion, explain the next step, and restore a usable way to participate.", annotation: "A later summary cannot give back the opportunity to shape a decision already made. Keep that decision open while resolving the failure." },
    ], practice: "A remote colleague sees captions but cannot hear questions from the room. What must happen before the group decides?", workProduct: "Record one test from each perspective and who will pause the session if it fails."
  },
  {
    courseId: "equity-inclusion-leadership-and-systems", lessonId: "ei-measure", format: "document", title: "Read a process dashboard without grading colleagues",
    introduction: "This fictional monthly review contains three process indicators. Each number describes work records, not employees or their beliefs.",
    panels: [
      { title: "Analysis before approval: 6 of 8 packets", text: "Six packets included an equity analysis before the decision. Two did not.", annotation: "The denominator is eight approval packets in the example month. This measures timing and presence; examine the analysis itself before claiming quality or benefit." },
      { title: "Second channel used: 12 of 30 requests", text: "Twelve requests used the phone option; eighteen used the portal.", annotation: "Use is not proof of access. Ask whether people completed their intended task, including people who could not reach either channel." },
      { title: "Requested-language completion: unavailable", text: "The example records do not connect requested language with completion.", annotation: "Unavailable is not zero. Identify whether an appropriate source could answer the question; do not guess from names or appearance." },
    ], practice: "Which indicator can show that a process exists, and which evidence would you still need to judge whether it works?", workProduct: "Write one indicator with its denominator, period, evidence limit and next question in the lesson notes."
  },
  {
    courseId: "from-noticing-to-shifting", lessonId: "sh-meeting", format: "comparison", title: "Compare two invitations to the same decision",
    introduction: "These fictional invitations concern a draft service form. The revision changes the conditions for participation.",
    panels: [
      { title: "The first invitation", text: "Join tomorrow at noon. Register in the portal. We will show the form during the meeting and approve it at the end.", annotation: "The invitation assumes portal access, availability at noon and enough time to read while discussing. It offers no way to request communication support or contribute beforehand." },
      { title: "A revision to confirm", text: "We are reviewing the draft form before approval. The draft is attached in a usable format. You may join through the meeting link or phone, send comments beforehand, and contact the organizer about access arrangements.", annotation: "Add the actual date, contacts, working connection details and confirmed arrangements before sending. Choose timing that leaves enough preparation time; a second channel must really work." },
    ], practice: "What does the second invitation allow a participant to influence that the first makes harder?", workProduct: "Draft one invitation line that names the open decision and a usable way to contribute."
  },
  {
    courseId: "the-record", lessonId: "rec-how-we-know", format: "comparison", title: "Match the claim to the method",
    introduction: "These three fictional study cards examine different evidence. Compare the observation with the conclusion it can support.",
    panels: [
      { title: "Randomized audit", text: "Otherwise matched fictional applications are randomly assigned different signals; the study compares responses.", annotation: "A well-designed audit can test the effect of the manipulated signal in the studied setting. It does not establish every cause across other places, times or stages." },
      { title: "Administrative records", text: "A service dataset shows longer recorded waits for one group.", annotation: "The difference matters, but the records alone may not identify the mechanism. Check definitions, missing records, process steps and other evidence." },
      { title: "Attitude survey", text: "Respondents describe what they believe about service fairness.", annotation: "These are reported views among respondents. They do not directly measure whether an evening portal submission succeeds or how nonrespondents experienced it." },
    ], practice: "A packet says a survey proves the portal is accessible. Which observation is missing?", workProduct: "Write a narrower supported claim and a second source that could help answer the practical question."
  },
  {
    courseId: "dhs-equity-analysis-toolkit", lessonId: "ea-eight-step-loop", format: "flow", title: "Carry the visit-request example through the decision",
    introduction: "This fictional continuation applies the lesson's toolkit discussion to an online visit request. Use the original toolkit for its complete method and applicable requirements.",
    panels: [
      { title: "Benefits, burdens and a change", text: "The portal offers flexible submission but assumes a usable connection. A staffed phone route is proposed.", annotation: "Describe who raised the barrier and what the phone route changes. A promise to monitor does not itself create the route." },
      { title: "Impact statement", text: "The proposal would let people submit the same request by phone during confirmed staffed hours.", annotation: "Keep the statement specific to this proposal. Do not claim access improved before the route exists and people have used it." },
      { title: "Accountability and alignment", text: "Identify who can authorize the arrangement, who will respond to feedback, and when it will be reviewed.", annotation: "Check the proposal with relevant equity and policy contacts. A role on this example is not a real person's agreement." },
      { title: "Resources and sustainability", text: "Staffing and funding are not yet confirmed in this example.", annotation: "Record the route as proposed. Resolve capacity, hours, language support and evidence collection before presenting it as available." },
    ], practice: "What must change in the packet when the phone route has no confirmed staffing?", workProduct: "Draft a specific impact statement with an explicit unresolved resource and the next decision needed."
  },
  {
    courseId: "family-and-natural-support-systems", lessonId: "fn-circle-respite-loop", format: "parallel", title: "Draw the circle around the person's choices",
    introduction: "A fictional person chooses whom to involve in planning travel to a weekly activity. Each offer has a boundary.",
    panels: [
      { title: "The person's goal", text: "I want to go to the activity on Sundays and Wednesdays. I want my sister in this planning conversation.", annotation: "The person names both the goal and the participant. A relationship does not automatically grant permission to involve someone." },
      { title: "The sister's offer", text: "I can offer a ride on Sundays this month. I cannot cover Wednesday evenings.", annotation: "Record the offer as stated. Do not convert a Sunday offer into an expectation of ongoing unpaid availability." },
      { title: "The open part of the plan", text: "Wednesday transport and a backup for Sunday still need agreement.", annotation: "Keep the gap visible. Discuss options with the person and relevant support contact, then agree how and when to revisit the plan." },
    ], practice: "Which part of this circle would become an unagreed assignment if the plan simply said 'family provides transport'?", workProduct: "Record the goal, each agreed offer, the uncovered need and a review point in the lesson notes."
  },
  {
    courseId: "lgbtq-inclusion-in-disability-services", lessonId: "lg-name-and-privacy-loop", format: "flow", title: "Follow a stated preference through the daily record",
    introduction: "In this fictional example, Alex asks staff to use Alex in daily contact and asks them not to announce a private conversation to the household.",
    panels: [
      { title: "Confirm the request", text: "Ask Alex which name to use in this contact and what information may be shared with whom.", annotation: "Do not infer preferences from appearance or make one conversation a blanket consent. Explain any relevant limits through the appropriate process." },
      { title: "Correct the usable record", text: "Use the relevant record process so the daily contact list reflects the confirmed name.", annotation: "Distinguish a daily display from records with separate requirements. Confirm the right process rather than silently changing unrelated records." },
      { title: "Share only what the work needs", text: "Give the next staff member the confirmed contact preference without broadcasting the private account.", annotation: "Check authority and need before sharing. A household relationship does not by itself answer who should receive private information." },
      { title: "Check at a transition", text: "When a new staff member joins, confirm that the contact preference still works for Alex.", annotation: "A change in staff is a reason to check the handoff, not to require Alex to retell a personal history." },
    ], practice: "What is the difference between correcting a daily name field and sending a household-wide announcement?", workProduct: "Draft a minimal handoff containing the confirmed preference, relevant record and review trigger."
  },
  {
    courseId: "employment-first-and-economic-inclusion", lessonId: "ef-first-option-loop", format: "flow", title: "Keep the person's employment choice visible",
    introduction: "A fictional person wants to explore paid work and is worried about benefits. The question opens a planning conversation; it does not settle their eligibility or choice.",
    panels: [
      { title: "Explore the interest", text: "Ask what work the person wants to try and what they would like to learn about it.", annotation: "Arrange a relevant real-world exploration where appropriate. Do not interpret a benefits concern as a refusal to work." },
      { title: "Bring the benefits question to qualified support", text: "Help identify the appropriate benefits-planning contact and prepare the person's questions.", annotation: "Do not promise a financial result. The person's circumstances need qualified, current advice." },
      { title: "Choose the next phase", text: "Discuss where the work belongs in Engage, Plan, Find or Keep, using the lesson's framework.", annotation: "The phase follows the person's situation. It is not an automatic assignment based on disability or service history." },
      { title: "Record and return", text: "Record the person's choice, agreed support and a point to review what they learned.", annotation: "A referral is an action, not proof that an appointment happened or the person's concern was resolved." },
    ], practice: "What would you record if the person wants more benefits information before choosing a next employment step?", workProduct: "Write the person's question, appropriate support, agreed next action and review point."
  },
  {
    courseId: "change-management-bringing-people-along", lessonId: "c61-along-loop", format: "flow", title: "Follow a counter change from draft to repair",
    introduction: "A fictional team is changing how visitors request a callback. This timeline keeps input connected to a decision and a response.",
    panels: [
      { title: "While the draft is open", text: "Explain what would start and stop, then ask staff and affected people what the proposal misses.", annotation: "Name what can still change. Inviting input after implementation is a different kind of conversation." },
      { title: "Before the public announcement", text: "Prepare the staff who will explain and use the new process.", annotation: "Test the actual instructions and fallback. An announcement should not be the first time the counter team encounters the procedure." },
      { title: "When a failure is reported", text: "A caller says the new callback window does not work with their shift.", annotation: "Treat this as evidence to investigate. Check whether another window or channel can work instead of assuming resistance to change." },
      { title: "After the repair", text: "Explain what changed, what remains unresolved and how to report another problem.", annotation: "Return the answer to the people who contributed. A repair entry without report-back leaves them guessing." },
    ], practice: "At which point can the reported shift conflict still change the procedure?", workProduct: "Draft a report-back note naming the issue, response, remaining limit and next review."
  },
  {
    courseId: "accessibility-as-leadership-responsibility", lessonId: "a9-four-doors", format: "parallel", title: "Work back from a usable town hall",
    introduction: "A fictional town hall is ten days away. The requested interpreter arrangement cannot yet be confirmed for that date. Compare the connected planning decisions.",
    panels: [
      { title: "Time and tools", text: "Check the booking lead time, accessible materials and the equipment people will use together.", annotation: "A date in an invitation is not evidence of a confirmed arrangement. Discuss a different date or workable format when the needed support is unavailable." },
      { title: "Talk and team", text: "Agree how contributions, questions and interpretation will fit, and who will respond if access fails.", annotation: "Leave enough time for actual participation. Assign the response to a role with authority to pause or adjust the event." },
      { title: "The readiness decision", text: "Confirm with the participant whether the combined arrangement is usable before declaring the event ready.", annotation: "One working piece cannot compensate for another missing one. A recording afterward does not restore influence over a live decision." },
    ], practice: "What should the organizer resolve before sending a 'fully accessible' announcement?", workProduct: "Record the unresolved arrangement, available options, responsible role and confirmation point."
  },
  {
    courseId: "cultural-intelligence-somali", lessonId: "ci-somali-household-4", format: "document", title: "Let the person explain the name fields",
    introduction: "This fictional person gives the name Hodan Yusuf Ali. The example does not establish a naming rule for everyone; the person's explanation drives the entry.",
    panels: [
      { title: "Name as provided", text: "Hodan Yusuf Ali — please use Hodan when speaking with me.", annotation: "Keep the provided spelling while confirming pronunciation and preferred use. Do not shorten the name for staff convenience." },
      { title: "The form's assumption", text: "First name / middle name / family surname are mandatory fields.", annotation: "The labels assume a structure the person may not use. Ask how their names should be recorded and check the system's approved filing guidance." },
      { title: "Before saving", text: "Read back the proposed entry and explain how it will appear in the relevant record.", annotation: "Resolve a field constraint through the appropriate support route. Do not invent a family surname or change other household members to match." },
    ], practice: "Which question belongs before entering Ali as a family surname?", workProduct: "Draft a respectful confirmation question and a note describing the field constraint to resolve."
  },
  {
    courseId: "cultural-intelligence-amharic", lessonId: "ci-amharic-household-4", format: "document", title: "Check the relationship between the name and the field",
    introduction: "In this fictional conversation, Selam Tesfaye explains that Tesfaye is her father's given name. Use her account rather than a form's assumption.",
    panels: [
      { title: "The person's explanation", text: "My name is Selam Tesfaye. Tesfaye is my father's given name.", annotation: "Confirm spelling, pronunciation and preferred address with Selam. The example is not a rule to impose on another person." },
      { title: "The household record", text: "The form expects a parent and child to share a family surname.", annotation: "A difference between their names does not by itself establish an error or misrepresentation. Confirm each person's name separately." },
      { title: "The filing question", text: "How should your name appear here, and what guidance does this record system require?", annotation: "Explain and resolve the field constraint through the appropriate process. Do not silently rewrite a name to fit a U.S. surname pattern." },
    ], practice: "What evidence do you actually have when a parent and child's names differ?", workProduct: "Write a confirmation question and identify the filing guidance needed before saving."
  },
  {
    courseId: "cultural-intelligence-arabic", lessonId: "ci-arabic-orientation-1", format: "flow", title: "Turn a language label into a usable arrangement",
    introduction: "A fictional appointment request says Arabic. That is a starting point for confirmation, not a complete booking instruction.",
    panels: [
      { title: "Confirm spoken communication", text: "Ask which language and spoken variety the person wants for this appointment.", annotation: "Religion, a country label or another household member's preference cannot answer this question." },
      { title: "Confirm the materials", text: "Ask what written language and format the person can use for the appointment information.", annotation: "Spoken and written preferences need separate confirmation. A language label does not establish reading preference." },
      { title: "Confirm the booking", text: "Arrange qualified support through the appropriate process and check that the match works for the person.", annotation: "Keep a responsible contact for a mismatch or failed connection. A referral marked Arabic is not proof that the arrangement is usable." },
    ], practice: "Which question remains unanswered by the word Arabic on the referral?", workProduct: "Draft a request with separate spoken, written and booking-confirmation fields."
  },
  {
    courseId: "cultural-intelligence-burmese", lessonId: "ci-burmese-orientation-1", format: "flow", title: "Correct the booking when the umbrella label is wrong",
    introduction: "A fictional referral lists Burmese in a combined country/language field. The person requests Hakha Chin for the conversation.",
    panels: [
      { title: "The incoming label", text: "Country/language: Burmese.", annotation: "The combined field does not tell you which language the person wants. Do not let it override a stated request." },
      { title: "The confirmed request", text: "The person asks for Hakha Chin and confirms that this is the language needed for the appointment.", annotation: "Ask using a workable communication method. Do not require the person to accept Burmese because that label arrived first." },
      { title: "The corrected arrangement", text: "The booking contact updates the request and confirms qualified support for the stated language.", annotation: "Check the match before proceeding. If the requested support is unavailable, keep responsibility for resolving the arrangement visible." },
    ], practice: "Which field needs correction, and how will the appointment team know the correction reached the booking?", workProduct: "Write a brief correction note containing the stated request, responsible contact and confirmation step."
  },
  {
    courseId: "cultural-intelligence-chinese", lessonId: "ci-chinese-expression-7", format: "parallel", title: "Separate the conversation from the printed notice",
    introduction: "In this fictional request, a person asks for Cantonese interpretation and a notice in traditional Chinese. Record each request on its own terms.",
    panels: [
      { title: "Spoken request", text: "Cantonese interpretation for the appointment.", annotation: "Confirm the person's request and arrange qualified support. A relative's education or English ability does not replace this confirmation." },
      { title: "Written request", text: "Traditional Chinese for the notice, in a format the person can use.", annotation: "Do not substitute simplified Chinese merely because a translation already exists. Ask about the actual language and format preference." },
      { title: "Combined check", text: "Confirm that both the appointment and the notice are usable before the next action is due.", annotation: "A successful conversation does not prove the written instruction works. Ask the person how they understand the next step." },
    ], practice: "What remains unresolved if the interpreter is booked but the only available notice uses a different writing system?", workProduct: "Draft a two-part language request and a confirmation question for the next step."
  },
];
