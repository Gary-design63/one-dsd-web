import { ADDITIONAL_LEARNING_EXAMPLES } from "./learning-additional-examples";

export type LearningCompanionPanel = Readonly<{ title: string; text: string; annotation: string }>;
export type LearningCompanionSpec = Readonly<{
  courseId: string;
  lessonId: string;
  title: string;
  introduction: string;
  format: "flow" | "parallel" | "document" | "comparison";
  panels: readonly LearningCompanionPanel[];
  practice: string;
  workProduct: string;
}>;

/** Original companion examples. Keys name exact lessons; source packs are not modified. */
export const LEARNING_COMPANIONS: readonly LearningCompanionSpec[] = [
  ...ADDITIONAL_LEARNING_EXAMPLES,
  {
    courseId: "anti-racism-resource", lessonId: "ar-tokenism", format: "flow",
    title: "Follow the invitation to the decision",
    introduction: "A fictional team is updating its recruitment materials. Follow what happens after someone responds to the invitation. A photograph can show who is present; these steps ask what people can influence.",
    panels: [
      { title: "Invitation", text: "The team changes its recruitment message and where it appears.", annotation: "Check who can find the opportunity and understand the work. A new message does not by itself change selection or working conditions." },
      { title: "Entry", text: "Applicants encounter the actual requirements, screening and interview process.", annotation: "Ask which requirements are connected to the work and where applicants can request access support." },
      { title: "Staying", text: "People encounter assignments, feedback, support and opportunities to progress.", annotation: "Look for evidence about these processes. A recruitment image cannot tell you whether people receive support or stay." },
      { title: "Decision rights", text: "Someone sets the rules, controls resources and responds to concerns.", annotation: "Name a decision that participants can still shape, how their input reaches it and who explains the result." },
    ],
    practice: "Choose one step that the revised recruitment message leaves unchanged. What evidence would help you decide whether that process needs to change?",
    workProduct: "In the lesson notes, name the decision, the people who can influence it, the responsible role and what you will check."
  },
  {
    courseId: "disability-and-language", lessonId: "dl-book", format: "parallel",
    title: "Arrange the supports, then check the whole meeting",
    introduction: "This fictional planning sheet separates two requests so that neither disappears inside the other. Disability can be visible or invisible; ask what makes participation workable without assuming a diagnosis.",
    panels: [
      { title: "Language arrangements", text: "Confirm the language support requested and who will arrange a qualified interpreter.", annotation: "Record the responsible role and how the arrangement will be confirmed with the participant. A family member is not the default interpreter." },
      { title: "Access arrangements", text: "Confirm the requested format, communication support, setting and time through the relevant process.", annotation: "Ask about what the person needs for this meeting. Do not infer their needs from appearance or require them to explain a diagnosis to the group." },
      { title: "Shared meeting check", text: "Bring the arrangements together before the meeting: usable materials, working connections, enough time and a named contact if something fails.", annotation: "Confirm that the combination works for the participant. Completing one booking does not confirm the other request." },
    ],
    practice: "A meeting has an interpreter booking, but the requested document format has not been confirmed. Which part of this plan remains open, and who should follow through?",
    workProduct: "In the lesson notes, record the two separate arrangements and the shared confirmation step for one real meeting."
  },
  {
    courseId: "cultural-broker-as-a-role", lessonId: "cb-scope", format: "document",
    title: "Read a scope of work before agreeing to it",
    introduction: "This fictional scope sheet is a discussion aid. Open each annotation to see what the sentence needs to make the role workable.",
    panels: [
      { title: "The systems being connected", text: "Help this service team and this named community organization understand the referral process.", annotation: "Specify the actual organizations and work. One person is not responsible for representing an entire community." },
      { title: "Time and compensation", text: "Agree on the hours, workload and compensation before the work begins.", annotation: "Put the agreement in the appropriate work arrangement. Do not treat additional relationship work as unlimited informal availability." },
      { title: "Boundaries", text: "Name what this role will do and where interpreting, investigation or training belongs.", annotation: "A trusted relationship does not automatically authorize other professional duties. Record the appropriate referral when a request falls outside the role." },
      { title: "Decision responsibility", text: "Tell participants who remains responsible for the service decision.", annotation: "Make the assigned worker or decision-maker visible. The bridge between organizations must not obscure who is accountable for the decision." },
    ],
    practice: "A draft says only, “Help us work with the community.” Which two clauses would you add first, and what would you need to agree with the person doing the work?",
    workProduct: "Draft a bounded scope in the lesson notes: systems, time, role limits and decision responsibility."
  },
  {
    courseId: "language-access-plan", lessonId: "lp-walk", format: "flow",
    title: "Walk one request all the way through",
    introduction: "Use a fictional appointment request to test a plan. At every handoff, ask who acts next and how the person requesting support will know what happened.",
    panels: [
      { title: "Receive the request", text: "A person asks for language support while arranging an appointment.", annotation: "Confirm what they are requesting and the preferred way to communicate about the arrangement. Record only what the process needs." },
      { title: "Arrange the support", text: "The responsible role uses the appropriate booking process.", annotation: "Name that role and the backup. A plan should be usable when the usual person is unavailable." },
      { title: "Confirm it works", text: "The team checks the arrangement, connection, materials and meeting time.", annotation: "Confirm the details with the person, including how to report a problem. A sent booking request is not yet a completed arrangement." },
      { title: "Respond to a failure", text: "If the support is unavailable or unusable, someone owns the next step.", annotation: "Use the responsible office or process to resolve the failure and communicate what happens next. Then review what the channel needs to change." },
    ],
    practice: "Imagine the usual booking contact is away when the request arrives. At which step does your current plan stop giving a usable answer?",
    workProduct: "Write the actual channel, responsible role, backup and confirmation method in the lesson notes."
  },
  {
    courseId: "language-access-as-a-design", lessonId: "la-who", format: "comparison",
    title: "Compare the work a phone channel asks of a caller",
    introduction: "These fictional channel descriptions make the assumptions visible. Use them to examine one real form, phone line or lobby process.",
    panels: [
      { title: "A channel with untested assumptions", text: "The caller hears instructions only in English, waits on hold and is told to call again during a narrow time window.", annotation: "This design assumes the caller can use the language, stay connected and return during that window. Describe those demands before guessing who can meet them." },
      { title: "A channel to test with people who use it", text: "The team checks language needs, explains available ways to receive support and agrees on a workable next contact.", annotation: "Confirm what the channel can actually provide and who will follow through. Test whether the arrangement works; a promise or translated prompt alone is not evidence." },
    ],
    practice: "Name one demand your chosen channel places on a person. What would you ask someone who uses it, and what could your team still change?",
    workProduct: "Complete the lesson's pattern sentence with the channel's actual demands, then record one change to test."
  },
{
  "courseId": "career-mentorship-and-sponsorship",
  "lessonId": "ms-sponsor",
  "format": "document",
  "title": "Make the assignment a real opportunity",
  "introduction": "A fictional employee is offered a stretch assignment. These annotations show what the offer needs beyond encouragement.",
  "panels": [
    {
      "title": "The work",
      "text": "Name the assignment, its purpose and the decisions the employee can make.",
      "annotation": "An opportunity needs enough authority to do useful work. Ask what success would look like and how it will be evaluated."
    },
    {
      "title": "The support",
      "text": "Agree on time, workload coverage and someone who can help.",
      "annotation": "Extra work without coverage can turn a development offer into a burden. Discuss support before the person accepts."
    },
    {
      "title": "The recognition",
      "text": "Agree how the employee's contribution will be described where decisions are made.",
      "annotation": "Give accurate credit for the work. A sponsor can make the contribution visible without speaking over the person."
    }
  ],
  "practice": "Which part of this offer is missing from a stretch assignment you have seen? What would make the opportunity usable?",
  "workProduct": "Draft an assignment note with the work, authority, support and credit in the lesson notes."
},
{
  "courseId": "performance-and-development",
  "lessonId": "pd-work",
  "format": "comparison",
  "title": "Give feedback someone can act on",
  "introduction": "Compare two fictional feedback notes. One judges the person; the other names a piece of work and opens a conversation about what would improve it.",
  "panels": [
    {
      "title": "A label without usable evidence",
      "text": "You are not ready to lead this work.",
      "annotation": "The sentence does not identify an action, its effect or what support would help. It invites a judgment about the person rather than a discussion of the work."
    },
    {
      "title": "A concrete observation and request",
      "text": "The revised agenda arrived as the meeting began. Two participants asked for reading time. What would help us share the next version early enough for people to prepare?",
      "annotation": "Check that these observations are accurate. Ask about the process and support, then agree on the next step without grading a person's identity or intercultural orientation."
    }
  ],
  "practice": "Choose one feedback sentence you use. Can the other person identify the work, the observation and a possible next step?",
  "workProduct": "Rewrite that sentence in the lesson notes and add a question that invites their account of what happened."
},
{
  "courseId": "onboarding-and-first-90-days",
  "lessonId": "on-access",
  "format": "flow",
  "title": "Check readiness through the first week",
  "introduction": "This fictional planning sequence follows the lesson's first-day focus. Adapt the timing and responsibilities to the role and the person's requests.",
  "panels": [
    {
      "title": "Before arrival",
      "text": "Confirm the tools, information and access arrangements needed to begin.",
      "annotation": "Name who will check each arrangement. A request marked sent may still need follow-through through the relevant process."
    },
    {
      "title": "At the start",
      "text": "Try the actual tools and first task with the new colleague.",
      "annotation": "Ask what works and what is getting in the way. Visible equipment cannot tell you whether all access needs are met."
    },
    {
      "title": "During the first week",
      "text": "Return to unresolved issues with a named person who can act.",
      "annotation": "Make it clear how to ask for help and how the colleague will hear back. Do not make them repeat the same request to several people."
    }
  ],
  "practice": "Where could a new colleague currently arrive with a request unresolved? Who would notice and follow through?",
  "workProduct": "Record one readiness check, its responsible role and a follow-up point in the lesson notes."
},
{
  "courseId": "screening-and-selection",
  "lessonId": "ss-sample",
  "format": "comparison",
  "title": "Compare the evidence and burden of a work sample",
  "introduction": "A fictional team is choosing how to assess one writing skill. The examples are design questions to review through the appropriate hiring process.",
  "panels": [
    {
      "title": "A broad take-home assignment",
      "text": "Write a complete strategy paper, with no stated time expectation or clear assessment criteria.",
      "annotation": "Ask which parts demonstrate essential work, what effort the assignment requires and whether unrelated resources or available time affect the result."
    },
    {
      "title": "A bounded sample to review",
      "text": "Use a focused task that demonstrates the required skill, with clear criteria, a stated time expectation and confirmed access arrangements.",
      "annotation": "Check the proposed design with the responsible hiring office. Consider whether a shorter or scheduled task could produce the needed evidence and how any compensation question should be handled."
    }
  ],
  "practice": "What evidence does your proposed sample actually need to produce? Identify one demand that may not help assess that skill.",
  "workProduct": "Write the skill, evidence, expected effort and one design question for the hiring team in the lesson notes."
},
{
  "courseId": "job-design-and-the-posting",
  "lessonId": "jd-essential",
  "format": "document",
  "title": "Annotate the requirement before keeping it",
  "introduction": "Read this fictional posting excerpt for a role that prepares reports and coordinates meetings. Check each requirement against the actual work.",
  "panels": [
    {
      "title": "Prepare clear reports",
      "text": "Prepare reports that explain findings and next actions to the intended audience.",
      "annotation": "This describes work. Ask what evidence would demonstrate the skill and how it will be assessed."
    },
    {
      "title": "Driver's license required",
      "text": "The draft requires a driver's license, but the role description does not identify driving.",
      "annotation": "Ask the responsible hiring team whether driving is an essential function. Do not invent a reason for the requirement or make an individual exception in place of reviewing the job."
    },
    {
      "title": "Great culture fit",
      "text": "The draft asks for a person who will be a great culture fit.",
      "annotation": "Name the actual work behavior the phrase is meant to describe. Check whether it belongs in the requirement and whether candidates can understand how it will be assessed."
    }
  ],
  "practice": "Open one posting you work with. Which line needs a clearer connection to the work before it is used?",
  "workProduct": "Record the line, the actual function and the question to resolve with the hiring team in the lesson notes."
},
{
  "courseId": "equity-centered-leadership",
  "lessonId": "el-agenda",
  "format": "comparison",
  "title": "Move input to a point where it can matter",
  "introduction": "Compare two fictional agendas for the same decision. The order changes what participants can still influence.",
  "panels": [
    {
      "title": "Input after the decision",
      "text": "Approve the proposed process. Assign implementation. Invite comments if time remains.",
      "annotation": "The comments come after the choice. Ask which decisions remain open and whether participants know that limit."
    },
    {
      "title": "Input before the decision",
      "text": "Name the decision and its limits. Examine who is affected and what they have raised. Compare options. Record the decision, reasons and follow-up.",
      "annotation": "Assign time and responsibility for considering the input. Explain which suggestions changed the proposal and how the team will respond to the rest."
    }
  ],
  "practice": "Where does input appear on the next agenda you help prepare? What can it still change at that point?",
  "workProduct": "Draft an agenda line with the decision, input needed and response owner in the lesson notes."
},
{
  "courseId": "culture-without-theater",
  "lessonId": "cu-educate",
  "format": "document",
  "title": "Plan the learning as work",
  "introduction": "A fictional team wants to learn after someone identifies a problem. These annotations keep responsibility with the team and make any teaching contribution voluntary and supported.",
  "panels": [
    {
      "title": "The purpose",
      "text": "Name the process the team needs to understand and improve.",
      "annotation": "A colleague who points out a problem has not agreed to teach a session. Start with the work rather than assigning expertise by identity."
    },
    {
      "title": "The resources",
      "text": "Choose an appropriate course, job aid or qualified support.",
      "annotation": "Use resources already available for the question. Check what additional expertise is needed without making one person represent a whole community."
    },
    {
      "title": "The work arrangement",
      "text": "If someone agrees to contribute, discuss the scope, time, support and compensation through the appropriate arrangement.",
      "annotation": "Make it possible to decline. The team still owns the learning and the response to the original issue."
    }
  ],
  "practice": "What would be missing if the plan were simply to ask the colleague who raised the problem to lead a lunch session?",
  "workProduct": "Write a learning purpose, resource and responsible role in the lesson notes; name how a voluntary contribution would be supported."
},
{
  "courseId": "how-it-shows-up-in-minnesota-human-services",
  "lessonId": "mn-greater",
  "format": "flow",
  "title": "Follow the whole service journey",
  "introduction": "Use the lesson's main-street image as context, then examine a fictional appointment journey. A photograph cannot tell you a household's travel, connectivity or work circumstances.",
  "panels": [
    {
      "title": "Receive the information",
      "text": "The person receives the appointment details and instructions.",
      "annotation": "Ask whether the language, format and delivery method are usable. Do not assume the town or household has one shared preference."
    },
    {
      "title": "Arrange the contact",
      "text": "The person tries to confirm or change the appointment.",
      "annotation": "Check the offered channels and hours. A portal may work for some people while another method is needed by others."
    },
    {
      "title": "Reach the appointment",
      "text": "The person makes the trip or joins remotely.",
      "annotation": "Ask about the actual journey, connection and timing rather than using the map or a rural label as a substitute."
    },
    {
      "title": "Complete the next step",
      "text": "The person leaves with the information and support needed to act.",
      "annotation": "Check how the next step fits their week and how they can ask for help. A successful arrival does not establish that the rest of the process worked."
    }
  ],
  "practice": "Which step in a process you use assumes travel or connection conditions you have not checked?",
  "workProduct": "Describe that assumption and a second channel to explore in the lesson notes."
},
{
  "courseId": "neurodiversity-and-cognitive-difference",
  "lessonId": "nd-environment-first-loop",
  "format": "parallel",
  "title": "Ask what would make this setting work",
  "introduction": "The lesson's room image shows people reading and using a laptop. It cannot tell us how the light, sound, pace or communication method feels to either person.",
  "panels": [
    {
      "title": "The person's request",
      "text": "A person asks to receive the questions in writing and have more time to respond.",
      "annotation": "Use the request as information about this conversation. It does not establish a diagnosis, ability level or need for the same arrangement in every setting."
    },
    {
      "title": "A change to try",
      "text": "Share the questions in a usable written format, allow time and offer a quieter or different setting if requested.",
      "annotation": "Ask whether the proposed change helps. Keep the person's own purpose for the conversation in view."
    },
    {
      "title": "What to record",
      "text": "Record the requested communication method, the adjustment tried and what the person says about it.",
      "annotation": "Describe the environment and what worked rather than turning silence, movement or eye contact into a character judgment."
    }
  ],
  "practice": "What could you change in a meeting before deciding that a person's way of participating is the problem?",
  "workProduct": "Write one environmental assumption, a question to ask and a change to test in the lesson notes."
},
];

export function getLearningCompanion(courseId: string, lessonId: string) {
  return LEARNING_COMPANIONS.find(item => item.courseId === courseId && item.lessonId === lessonId);
}

