import type { CoursePack } from "../../source-types";

// Disability Inclusion · Practitioner, module 7: Change Management and Implementation.
// Program-authored course for accessibility coordinators, program managers, equity professionals and policy analysts.
const pack: CoursePack = {
  course: {
    id: "di-change-management-and-implementation",
    indexNumber: 1118,
    seriesLabel: "Disability Inclusion · Practitioner",
    title: "Change Management and Implementation",
    subtitle: "Turn a list of accessibility findings into a roadmap with owners, decision rights and measures, and carry it through the resistance it will meet.",
    scope: "For accessibility coordinators, equity professionals, learning leaders, human resources partners, program managers, supervisors, policy analysts, internal trainers and inclusion champions responsible for acting on audit findings. Participation in this program is voluntary and does not replace required training.",
    treatment: "Five short lessons with scenarios, a prioritization sort, flashcards, a roadmap-line artifact and knowledge checks",
    duration: "45–55 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/change-management.jpg",
    coverAlt: "A Black woman in a navy blazer huddles with colleagues in a government office.",
    introTranscript: "An accessibility audit usually ends with a long list and a short attention span. This course is about what happens next: grouping findings into a roadmap, deciding who owns each item and who has the right to decide, attaching dates, budget needs and measures, and understanding the resistance you will meet well enough to answer it. You will practice telling a knowledge gap from a structural constraint, and making the case for inclusion in the language each audience actually uses.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Group and prioritize audit findings by severity, reach and effort into quick fixes, planned projects and policy changes.",
        "Write a roadmap line for a finding that names an owner, a decision-maker, a date, a budget need and a success measure.",
        "Diagnose resistance as a knowledge gap, a structural constraint or a values disagreement and choose a response that fits.",
        "Make the case for a specific inclusion change in terms of service quality, workforce participation, innovation, trust and legal risk management, tailored to the audience.",
        "Design a review cadence that keeps a roadmap alive and reports progress back to disabled staff and participants.",
      ],
      evidence: [
        "A completed sort of findings into quick fix, planned project and policy change.",
        "One roadmap line built with the artifact and checked against the decision-rights questions.",
        "A one-paragraph case for one change, written for a named audience.",
      ],
      appliedNextStep: "Take the findings from your Level 3 audit, or any recent accessibility review, and build the first ten lines of a roadmap using the artifact. Bring it to the person who can approve the first three items.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Change in ADA, Section 504 or Section 508 guidance", "Change in DHS accessibility or language access standards", "Feedback from disabled staff or participants that a scenario reads as unrealistic or stigmatizing"],
      relatedDoor: "Questions about legal obligations behind a finding go to the ADA coordinator or civil rights office; budget and procurement decisions follow the agency’s own approval routes. This course helps you build and carry the plan, it does not grant authority to spend or decide.",
      toolkitQuestion: "Who owns this change, who has the right to decide it, how will we know it worked, and who will feel the difference?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "change-management-and-implementation-1",
        number: 1,
        title: "From a list of findings to a roadmap",
        summary: "Group findings by the barrier and its root cause, rate severity, reach and effort, and sort the work into quick fixes, planned projects and policy changes.",
        minutes: 11,
        learning: {
          objective: "Group audit findings by root cause, rate each group for severity, reach and effort, and sort the work into quick fixes, planned projects and policy changes.",
          takeaways: [
            "Forty findings are often eight problems; grouping by root cause turns a list into a plan.",
            "Severity asks who is stopped entirely; reach asks how many people and how often; effort asks what it takes to fix. Prioritize with all three, and never with effort alone.",
            "Quick fixes build credibility, planned projects need owners and money, and policy changes are what stop the same finding from returning.",
          ],
          evidence: "A completed sort of six findings and a short list of grouped root causes from your own audit.",
          appliedNextStep: "Group your audit findings by root cause and write each group as a single problem statement about the system, not the person who found it.",
        },
        scenario: {
          context: "An accessibility audit of a county human-services lobby, its website and its notices has produced 47 findings. The division director asks the accessibility coordinator for “the plan” by Friday and suggests starting with the cheapest items.",
          prompt: "What is the most useful first move?",
          options: [
            { label: "Sort the 47 findings by cost and schedule the cheapest twenty for the first month.", response: "Cost-first ordering can leave the barrier that stops people entirely, such as an inaccessible application form, at the bottom because it is expensive. Cheap and important are different lists." },
            { label: "Group the findings by root cause, rate each group for severity, reach and effort, and bring the director a short roadmap of quick fixes, planned projects and policy changes with the highest-severity items visible at the top.", response: "This answers the director’s real need for a plan, keeps the people most excluded in view, and shows that some cheap fixes and some expensive ones both belong in the first phase.", recommended: true },
            { label: "Explain that 47 findings cannot be planned by Friday and ask for a month.", response: "The director does not need all 47 scheduled by Friday. A grouped roadmap with the first phase named is achievable and builds trust for the longer work." },
          ],
        },
        transfer: {
          prompt: "What are the three root causes behind most of your own audit’s findings?",
          options: ["Group your findings and write one system-level problem statement per group", "Rate each group for severity, reach and effort on a simple scale", "Mark which groups are quick fixes, planned projects or policy changes"],
        },
        blocks: [
          { type: "text", heading: "The list is not the plan", body: "<p>Audits produce findings; organizations need decisions. Between the two sits a translation step that many teams skip, which is why so many audit reports are filed rather than acted on. The step has three parts. First, group findings by root cause. Twelve notices with poor contrast, unlabeled form fields and image-only content are one problem: nobody who produces public documents has an accessible template or a check before publishing. Second, rate each group. Third, sort the groups into the kind of work they are.</p><p>Rating uses three lenses. <strong>Severity</strong>: does this barrier stop someone entirely, make the task much harder, or cause friction? A form that cannot be completed with a screen reader stops people. <strong>Reach</strong>: how many people meet this barrier and how often? A monthly notice to every participant reaches more than an internal page. <strong>Effort</strong>: what does the fix take in time, money, skill and authority? Prioritize using all three. Effort alone produces a plan of easy things; severity alone produces a plan nobody funds.</p><p>Finally, sort. <strong>Quick fixes</strong> can be done within days by the people who own the thing: turn on captions, add an access line to the invitation, fix the door closer. <strong>Planned projects</strong> need an owner, a budget and a schedule: replace the kiosk, remediate the form library, procure captioning. <strong>Policy changes</strong> alter how work is done so the finding does not come back: an accessible-template standard, a check before publication, an accessibility clause in every contract.</p>" },
          { type: "list", heading: "Building the roadmap", ordered: true, items: ["Group findings by root cause and write one problem statement per group about the system.", "Rate each group for severity, reach and effort.", "Sort each group into quick fix, planned project or policy change; many root causes need one of each.", "Order the roadmap with highest severity first, and place quick fixes early regardless of severity to build momentum.", "For each line, name the owner, the decision-maker, a date, the budget need and a measure; the next lesson shows how.", "Share the draft with the disabled people who took part in the audit before it goes to leadership."] },
          { type: "sorting", id: "change-management-and-implementation-1-sort", heading: "Quick fix, planned project or policy change?", categories: ["Quick fix", "Planned project", "Policy change"], items: [
            { text: "Turn captions on by default for every virtual meeting on the division’s platform.", category: "Quick fix" },
            { text: "Replace the lobby check-in kiosk with one usable from a seated position and with a screen reader.", category: "Planned project" },
            { text: "Require an accessibility check before any public document is published.", category: "Policy change" },
            { text: "Add an access-needs line and a named contact to the community meeting invitation template.", category: "Quick fix" },
            { text: "Remediate the two hundred forms in the program’s document library.", category: "Planned project" },
            { text: "Add accessibility requirements to the standard contract language for purchased software.", category: "Policy change" },
          ] },
          { type: "leaderMove", heading: "Keep the most excluded at the top", control: "You control the order of the roadmap and therefore whose barriers are fixed first.", failure: "Do not let cost or convenience push the barrier that stops people entirely to a later phase. Do not present a plan of quick fixes as the plan.", next: "Check your roadmap’s first phase: does it contain at least one item that removes a barrier that currently stops someone completely?" },
          { type: "flashcards", heading: "Rating and sorting", cards: [
            { front: "Severity", back: "<p>Stops the person entirely, makes the task much harder, or causes friction. A barrier that stops people is always in the first phase, whatever it costs.</p>" },
            { front: "Reach", back: "<p>How many people meet the barrier and how often. Public notices and application forms reach more people than internal pages; weigh accordingly.</p>" },
            { front: "Effort", back: "<p>Time, money, skill and authority required. A useful tie-breaker and a scheduling input. Never the first sort key.</p>" },
            { front: "Root cause", back: "<p>The reason the finding exists: a missing template, no check, no budget line, no owner, a contract without requirements. Fixing findings without root causes means auditing the same thing next year.</p>" },
          ] },
          { type: "knowledgeCheck", id: "change-management-and-implementation-1-check", question: "An online application cannot be completed with a keyboard or screen reader. Remediating it will take a vendor and a budget request. Where does it belong?", options: [
            { text: "In a later phase, because it is expensive and needs procurement.", correct: false },
            { text: "In the first phase as a planned project, because it stops people entirely, with an interim accessible route offered now.", correct: true },
            { text: "Off the roadmap, because the vendor owns the application.", correct: false },
          ], feedbackCorrect: "Yes. Severity puts it first; effort shapes how it is delivered. An interim route is the quick fix that accompanies the project.", feedbackIncorrect: "Ask who is stopped and how completely. A barrier that stops people belongs in the first phase, with an interim route while the project runs." },
        ],
      },
      {
        id: "change-management-and-implementation-2",
        number: 2,
        title: "Owners, decision rights, dates, budget and measures",
        summary: "Give every roadmap line an owner who does the work, a decision-maker who can approve it, a date, a budget need and a measure that shows it worked.",
        minutes: 12,
        learning: {
          objective: "Write a roadmap line that names the owner, the person with decision rights, the date, the budget need and the success measure, and explain why a line missing any of the five will stall.",
          takeaways: [
            "The owner does the work; the decision-maker can approve, fund or require it. Most stalled items have one but not the other.",
            "A budget need written as “none” is a claim to test; a budget need written as a number is a request that can be answered.",
            "The success measure describes the barrier removed, not the task completed: “applicants can complete the form with a screen reader,” not “vendor engaged.”",
          ],
          evidence: "One roadmap line built with the artifact and checked against the decision-rights questions.",
          appliedNextStep: "Take the three highest-severity lines on your roadmap and confirm, by asking, that the named decision-maker agrees they hold that decision.",
        },
        scenario: {
          context: "A roadmap item to provide live captioning for all public meetings has been “in progress” for five months. The accessibility coordinator is listed as owner. Nobody has been asked to fund it, the communications team believes the meetings team owns it, and the meetings team believes captioning is a communications expense.",
          prompt: "What is missing from this roadmap line?",
          options: [
            { label: "A more detailed task list for the coordinator.", response: "The coordinator cannot approve a recurring expense or require another team to change its practice. More tasks for someone without decision rights produces more waiting." },
            { label: "A named decision-maker with authority over the meetings budget, a stated annual cost, a date for the funding decision, and a measure such as the share of public meetings with live captions.", response: "The line has an owner but no decision rights, no number and no measure. Naming who can say yes, what it costs and how success will be seen is what unsticks it.", recommended: true },
            { label: "A stronger legal argument to persuade both teams.", response: "Both teams may already agree captioning matters. They disagree about whose budget it comes from. That is a decision-rights gap, not a persuasion gap." },
          ],
        },
        transfer: {
          prompt: "Which line on your roadmap has an owner but no one who can decide?",
          options: ["Ask each owner whether they can approve, fund or require the change themselves", "Where they cannot, name the person who can and get their agreement", "Rewrite each measure so it describes the barrier removed"],
        },
        blocks: [
          { type: "text", heading: "Five things every line needs", body: "<p>A roadmap line stalls for predictable reasons. The person doing the work cannot approve it. Nobody knows what it costs, so nobody asks. There is no date, so it is always next quarter. There is no measure, so no one can say whether it is done. The remedy is to write five things on every line and to refuse to call a line planned until all five are there.</p><p>The <strong>owner</strong> does or coordinates the work. The <strong>decision-maker</strong> holds the right to approve, fund or require the change; in a public agency this is often a different person, and sometimes a committee or a procurement route. The <strong>date</strong> is for the next decision or finished piece of work, not the whole project. The <strong>budget need</strong> is a number, a range or an honest “to be scoped by” with a date. The <strong>measure</strong> describes the barrier removed in terms a disabled participant would recognize.</p><p>Decision rights deserve the most attention, because they are the least visible. Ask three questions for each line: who can say yes, who can say no, and who must be consulted before either happens? In Minnesota state and county work, answers often involve a supervisor’s manager, a budget owner, a contracts office, an information technology governance group or a labor agreement. Find out early. A roadmap that assumes the accessibility coordinator can decide everything is a roadmap that waits.</p>" },
          { type: "tabs", heading: "Decision rights in practice", tabs: [
            { label: "Who decides", body: "<p>The person or body that can approve, fund or require the change. Confirm by asking them directly: “Is this yours to decide?” If the answer is “partly,” find the other part.</p>" },
            { label: "Who does", body: "<p>The owner who coordinates or performs the work. May be the accessibility coordinator, a communications lead, a facilities manager or a vendor manager. One name, not a team.</p>" },
            { label: "Who is consulted", body: "<p>Disabled staff and participants who experience the barrier, the ADA coordinator or civil rights office for obligations, procurement for purchases, labor relations where practices change.</p>" },
            { label: "Who is informed", body: "<p>Everyone who will notice the change: staff who run the meetings, participants, front-desk teams, and the people who reported the finding in the first place.</p>" },
          ] },
          { type: "artifact", kind: "tagged-document", label: "Practical artifact", title: "A roadmap line", summary: "The fields a single roadmap item needs before it can honestly be called planned.", fields: [
            { label: "Barrier and root cause", value: "What stops or slows whom, and why it exists. Example: public meetings have no live captions because no budget line and no owner exist for captioning." },
            { label: "Owner and decision-maker", value: "One named role who does the work, and one named role or body who can approve, fund or require it. Confirmed with both." },
            { label: "Date and budget need", value: "The date of the next decision or finished piece of work, and the cost as a number, a range, or “to be scoped by” a date." },
            { label: "Success measure", value: "The barrier removed, stated observably. Example: share of public meetings with live captions, reported quarterly, target set with the decision-maker." },
          ], action: "Fill in one line for your highest-severity finding, then check it with the named decision-maker before adding it to the roadmap." },
          { type: "leaderMove", heading: "Name who can say yes", control: "You control whether each line names a person who can actually decide it, or only a person who hopes to.", failure: "Do not list yourself as owner of things you cannot approve, fund or require. Do not write “leadership” as the decision-maker; write a role.", next: "Go through your roadmap and, for each line, write the role that can say yes. Where you do not know, that is your next task." },
          { type: "flashcards", heading: "Words that keep a roadmap honest", cards: [
            { front: "Owner", back: "<p>Does or coordinates the work and reports progress. Accountable for effort, not for authority they do not have.</p>" },
            { front: "Decision-maker", back: "<p>Holds the right to approve, fund or require. Often a budget owner, a director, a governance group or a contracts office. Confirm with them that they agree.</p>" },
            { front: "Budget need", back: "<p>A number, a range, or “to be scoped by” with a date. “No cost” is a hypothesis; write it as one and check it.</p>" },
            { front: "Success measure", back: "<p>Describes the barrier removed in terms a participant would recognize: can complete, can read, can attend, can hear. “Vendor engaged” is a milestone, not a measure.</p>" },
            { front: "Interim route", back: "<p>What people can do now while the project runs: a phone or in-person alternative, a staffed assistance route, a manually remediated document. Every stopped-entirely barrier gets one.</p>" },
          ] },
          { type: "knowledgeCheck", id: "change-management-and-implementation-2-check", question: "Which success measure belongs on a roadmap line about remediating an inaccessible application form?", options: [
            { text: "“Remediation vendor contract signed.”", correct: false },
            { text: "“Applicants can complete and submit the form using a keyboard and screen reader, confirmed by user testing, and the interim assisted route stays available until then.”", correct: true },
            { text: "“Accessibility coordinator has reviewed the form.”", correct: false },
          ], feedbackCorrect: "Yes. The measure describes the barrier removed and how you will know, and it keeps the interim route in view.", feedbackIncorrect: "Milestones describe what the organization did. Measures describe what people can now do. Look for the one a screen-reader user would recognize." },
        ],
      },
      {
        id: "change-management-and-implementation-3",
        number: 3,
        title: "Understanding resistance before answering it",
        summary: "Tell a knowledge gap from a structural constraint from a values disagreement, because each needs a different response and mistaking one for another wastes months.",
        minutes: 11,
        learning: {
          objective: "Diagnose a case of resistance as a knowledge gap, a structural constraint or a values disagreement and choose a response that matches the diagnosis.",
          takeaways: [
            "Most resistance to accessibility is not opposition to disabled people; it is not knowing how, not being able to, or not being convinced it matters compared with everything else.",
            "Training answers a knowledge gap and does nothing for a structural constraint; removing a constraint does nothing for a values disagreement.",
            "Ask before you diagnose: “What would need to be true for this to work here?” usually reveals which kind you are facing.",
          ],
          evidence: "Three real objections from your own work, each diagnosed and paired with a matching response.",
          appliedNextStep: "Before your next roadmap conversation with a reluctant team, write down what you believe the resistance is and the one question you will ask to test it.",
        },
        scenario: {
          context: "A unit manager in a county says the eligibility notices “cannot be changed because they come out of the state system.” The accessibility coordinator has heard this as a refusal. The notices fail contrast and structure checks and generate regular complaints.",
          prompt: "What should the coordinator do first?",
          options: [
            { label: "Escalate to the director as an example of resistance to accessibility.", response: "The manager may be describing a real constraint accurately. Escalating a structural constraint as a values problem damages the relationship and does not change the system." },
            { label: "Ask what specifically the unit can and cannot change about the notices, who owns the template in the state system, and what the unit could do with the parts it controls, such as the cover letter and the accompanying plain-language sheet.", response: "This tests the constraint, finds the real owner of the template, and identifies work the unit can do now. Most “cannot” statements contain a smaller “can.”", recommended: true },
            { label: "Offer the manager’s staff a training on accessible documents.", response: "If the template is generated by a system the unit does not control, training staff to fix it will frustrate everyone. Diagnose before you prescribe." },
          ],
        },
        transfer: {
          prompt: "Which objection have you been treating as a values problem that might be a constraint, or the reverse?",
          options: ["Write the three objections you hear most", "Diagnose each as knowledge gap, structural constraint or values disagreement", "Plan the question you will ask to check your diagnosis"],
        },
        blocks: [
          { type: "text", heading: "Three kinds of no", body: "<p>When a team does not act on an accessibility finding, practitioners tend to hear one thing: resistance. In practice there are at least three different things, and the response that works for one makes the others worse.</p><p>A <strong>knowledge gap</strong> sounds like “we did not know,” “how do we do that,” or a confident wrong belief such as “the PDF is fine because it opens.” The answer is skill: a template, a checklist, a short training, a person to call. A <strong>structural constraint</strong> sounds like “we cannot,” and is often true: the notice comes from a system the unit does not control, there is no budget line for interpreters, the contract with the vendor has no accessibility clause, the staff who could do it have no time allocated. The answer is to change the structure, which usually means finding the decision-maker from the previous lesson. A <strong>values disagreement</strong> sounds like “this is not a priority,” “nobody has asked,” or “we cannot do everything for everyone.” The answer is the case for change, made in the language the person uses, and sometimes a requirement from above.</p><p>Diagnosis matters because the mismatches are expensive. Training people who face a structural constraint produces trained, frustrated people. Removing a constraint for people who do not think the work matters produces unused capacity. Making the values case to people who simply did not know how produces defensiveness where a checklist would have produced action. One question usually sorts it: “What would need to be true for this to work here?”</p>" },
          { type: "accordion", heading: "Hearing the difference", items: [
            { title: "“We’ve never had a complaint.”", body: "<p>Often a knowledge gap about how barriers work: people who are excluded rarely complain, they leave. Share the audit evidence and the point about absence. If it persists after evidence, it may be a values disagreement.</p>" },
            { title: "“The system won’t let us.”", body: "<p>Usually a structural constraint, and worth testing precisely. What part is fixed? Who owns the template or configuration? What can the unit control around it? Route the fixed part to the real owner.</p>" },
            { title: "“We don’t have time.”", body: "<p>A structural constraint about allocation. Accessibility work that is nobody’s assigned time will not happen. The response is a decision-maker who allocates hours, not a reminder of importance.</p>" },
            { title: "“This is compliance theater.”", body: "<p>A values disagreement, sometimes rooted in past experience of box-ticking. Answer with the concrete barrier and the specific person it stops, and involve the speaker in designing something that is not theater.</p>" },
            { title: "“Just tell us exactly what to do.”", body: "<p>A knowledge gap, and an invitation. Provide the template, the checklist and a named contact. Do not answer with the case for inclusion; they are already convinced.</p>" },
            { title: "“Legal hasn’t told us we have to.”", body: "<p>Mixed. Partly a structural expectation that requirements come from above, partly a values position. Clarify obligations through the ADA coordinator or civil rights office, and make the service-quality case alongside.</p>" },
          ] },
          { type: "quote", text: "For a year they kept sending us to trainings about accessible documents. We knew how. The template came from a system we could not touch, and nobody with the authority to change it was ever in the room.", cite: "Composite staff perspective, illustrative" },
          { type: "leaderMove", heading: "Ask before you diagnose", control: "You control whether you respond to what you assume the resistance is, or to what the person tells you it is.", failure: "Do not treat every delay as opposition, and do not treat every “we cannot” as final. Do not schedule training as the default response to any objection.", next: "In your next difficult conversation about a finding, ask “what would need to be true for this to work here?” and write down the answer before proposing anything." },
          { type: "flashcards", heading: "Matching response to resistance", cards: [
            { front: "Knowledge gap", back: "<p>Sounds like: how, we did not know, it seemed fine. Respond with: template, checklist, short training, named contact. Do not respond with the values case.</p>" },
            { front: "Structural constraint", back: "<p>Sounds like: we cannot, the system, no budget, no time. Respond with: find the decision-maker, change the allocation, contract or configuration, and do what the unit can meanwhile.</p>" },
            { front: "Values disagreement", back: "<p>Sounds like: not a priority, nobody asked, we cannot do everything. Respond with: the specific barrier and person, the case in their language, and where needed a requirement from the decision-maker.</p>" },
            { front: "The sorting question", back: "<p>“What would need to be true for this to work here?” The answer tells you which kind you are facing, and often names the decision-maker you need.</p>" },
          ] },
          { type: "knowledgeCheck", id: "change-management-and-implementation-3-check", question: "A communications team keeps publishing image-only social posts despite two trainings. When asked, they say the scheduling tool they are required to use strips alternative text. What kind of resistance is this, and what is the right response?", options: [
            { text: "A knowledge gap; schedule a third training on alternative text.", correct: false },
            { text: "A structural constraint; identify who owns the tool decision and either configure, replace or supplement it, while the team adds descriptions in the post text meanwhile.", correct: true },
            { text: "A values disagreement; escalate the team’s lack of commitment.", correct: false },
          ], feedbackCorrect: "Right. Two trainings did not fix it because knowledge was never the problem. The tool and its owner are.", feedbackIncorrect: "Listen to the reason given. A required tool that strips alternative text is a constraint; training and escalation both miss it." },
        ],
      },
      {
        id: "change-management-and-implementation-4",
        number: 4,
        title: "Making the case in the language each audience uses",
        summary: "Explain why an inclusion change matters for service quality, workforce participation, innovation, trust and legal risk management, and choose the argument that fits the room.",
        minutes: 10,
        learning: {
          objective: "Make the case for a specific inclusion change using the argument that fits a named audience, drawing on service quality, workforce participation, innovation, trust and legal risk management without overstating any of them.",
          takeaways: [
            "The same change has five true reasons; leading with the one your audience already cares about is not manipulation, it is translation.",
            "Legal risk is a real reason and a poor lead: it produces the minimum, and it invites the answer “nobody has sued us.”",
            "Specifics persuade; “inclusion is important” does not. Name the barrier, the people it stops, and the measurable result of removing it.",
          ],
          evidence: "A one-paragraph case for one roadmap item, written for a named audience, with the argument chosen and the claim kept to what you can support.",
          appliedNextStep: "Write the case for your highest-severity roadmap item three times: for a finance lead, for a front-line supervisor and for a program director. Notice what changes and what stays the same.",
        },
        scenario: {
          context: "A finance director asks why the division should fund form remediation this year when “the forms have worked for a decade and nobody has complained.”",
          prompt: "Which case fits this audience best?",
          options: [
            { label: "“The Americans with Disabilities Act requires it and we could be sued.”", response: "True, and the weakest lead here. It invites the reply that no one has sued, and it frames the work as a cost to avoid a penalty rather than an improvement worth paying for." },
            { label: "“Applicants who cannot complete the forms call, visit or give up. Each assisted application costs staff time we can count, each abandoned one delays a benefit and generates rework, and the audit found the form stops screen-reader users entirely. Remediation costs this much once; the assisted route costs this much every year. It also brings us into line with our legal obligations.”", response: "This speaks in the finance director’s terms, uses the audit evidence, names the people stopped, and puts the legal point in its place as a supporting reason rather than the only one.", recommended: true },
            { label: "“Inclusion is one of our values and this is the right thing to do.”", response: "Also true, and not an answer to a finance question. Values without specifics sound like a request to trust rather than a case to fund." },
          ],
        },
        transfer: {
          prompt: "Who is the decision-maker for your first roadmap item, and which of the five reasons do they already talk about?",
          options: ["Write the case in one paragraph using their reason first", "Add the specific barrier, the people it stops and the measure", "Check every claim against what you can actually support"],
        },
        blocks: [
          { type: "text", heading: "Five true reasons, one at a time", body: "<p>Accessibility changes are usually justified honestly in five ways, and most audiences respond strongly to one or two. <strong>Service quality</strong>: people can complete the application, understand the notice, attend the meeting; rework, calls and appeals fall. <strong>Workforce participation</strong>: about one in four adults in the United States has a disability by the Centers for Disease Control and Prevention’s estimate, and an agency that cannot accommodate them cannot recruit or keep them. <strong>Innovation</strong>: designing for the widest range of people produces simpler forms, clearer notices and more flexible processes that help everyone; curb cuts, captions and plain language all began as access features. <strong>Trust</strong>: disabled participants and staff, and the communities they belong to, judge an agency by whether it works for them. <strong>Legal risk management</strong>: the Americans with Disabilities Act, Section 504 and state law create real obligations, and complaints and findings carry cost and reputational harm.</p><p>Choosing the lead argument for the audience is translation, not spin, as long as every argument you use is true and proportionate. Overstating produces distrust; a finance lead who checks your cost figure and finds it inflated will discount everything after it. Keep claims to what the audit, the measures and the sources support.</p><p>Legal risk deserves a special note. It is real, it belongs in the case, and it is almost always the wrong lead. Leading with it produces the minimum required and invites the reply that nobody has complained. Put it last, state it plainly, and let the ADA coordinator or civil rights office speak to the specifics.</p>" },
          { type: "tabs", heading: "The case by audience", tabs: [
            { label: "Finance", body: "<p>Lead with service quality in cost terms: assisted applications, rework, appeals, repeated printing, staff time. Give the one-time cost and the recurring cost of the workaround. Legal risk last, stated as an exposure with a source.</p>" },
            { label: "Program director", body: "<p>Lead with service quality in outcome terms: completion rates, timeliness, complaint themes. Add trust with the communities the program serves. Show the measure that will move.</p>" },
            { label: "Human resources", body: "<p>Lead with workforce participation: recruitment, retention and the cost of losing trained staff. Add the accommodation process measures. Connect to the agency’s stated workforce commitments.</p>" },
            { label: "Front-line supervisor", body: "<p>Lead with the daily reality: fewer confused callers, fewer repeat visits, clearer notices, meetings that run better. Innovation in the form of simpler work. Keep it concrete and short.</p>" },
            { label: "Executive sponsor", body: "<p>Lead with trust and the agency’s public commitments, then service quality at scale, then workforce, then risk. Offer a small set of measures they can watch and a date for the first result.</p>" },
          ] },
          { type: "statement", body: "The strongest case names one barrier, the people it stops, the cost of leaving it in place, the cost of removing it, and the measure that will show the difference. Everything else is supporting material." },
          { type: "leaderMove", heading: "Lead with their reason, keep every reason true", control: "You control which argument opens the conversation and whether each claim can survive a fact check.", failure: "Do not open with legal threat unless asked about obligations. Do not round a benefit up or a cost down to win the room.", next: "Before your next funding or approval conversation, write the audience’s likely lead reason and check each figure you plan to use against its source." },
          { type: "flashcards", heading: "Arguments and their limits", cards: [
            { front: "Service quality", back: "<p>Strongest with operational and finance audiences. Support it with audit evidence, call and rework counts, completion and timeliness measures. Do not claim savings you have not calculated.</p>" },
            { front: "Workforce participation", back: "<p>Strongest with human resources and executives. Attribute the population estimate to the Centers for Disease Control and Prevention. Avoid claiming specific retention gains without your own data.</p>" },
            { front: "Innovation", back: "<p>Strongest with design and technology audiences. Use examples of access features that became universal. Do not present it as the main reason; it is a benefit, not the purpose.</p>" },
            { front: "Trust", back: "<p>Strongest with program leaders and executives. Tie it to the communities served and to what disabled participants and staff have actually said. Do not speak for them; quote or invite them.</p>" },
            { front: "Legal risk management", back: "<p>Real, necessary, last. State obligations plainly and route specifics to the ADA coordinator or civil rights office. Never the only argument.</p>" },
          ] },
          { type: "knowledgeCheck", id: "change-management-and-implementation-4-check", question: "Why is legal risk usually a poor lead argument even though it is true?", options: [
            { text: "Because accessibility obligations are not actually legal requirements.", correct: false },
            { text: "Because it invites a minimum-compliance response and the reply that nobody has complained, and it frames a service improvement as penalty avoidance.", correct: true },
            { text: "Because finance audiences do not care about risk.", correct: false },
          ], feedbackCorrect: "Yes. Keep it in the case, state it plainly, and put it after the reasons that describe better service and better work.", feedbackIncorrect: "The obligations are real and finance audiences do care about risk. The problem is what leading with it does to the conversation." },
        ],
      },
      {
        id: "change-management-and-implementation-5",
        number: 5,
        title: "Keeping the roadmap alive",
        summary: "Set a review cadence, report progress honestly, close the loop with the people who found the barriers, and adjust when the plan meets reality.",
        minutes: 9,
        learning: {
          objective: "Design a review cadence and progress report for a roadmap that keeps decision-makers engaged, reports honestly on stalled items, and shares results with disabled staff and participants.",
          takeaways: [
            "A roadmap reviewed on a schedule with its decision-makers present survives; one reviewed only by its owner fades within two quarters.",
            "Report stalled items as stalled, with the reason and the decision needed; a green progress summary nobody believes is worse than an honest amber one.",
            "The people who found the barriers should hear what was fixed before the leadership deck does, and should be thanked in ways they choose.",
          ],
          evidence: "A one-page review format with cadence, attendees, the four status lines and the share-back step.",
          appliedNextStep: "Schedule the first roadmap review with the decision-makers named on your top five lines, and send them the status format from this lesson a week ahead.",
        },
        scenario: {
          context: "Six months into a division accessibility roadmap, the quick fixes are done, two planned projects are waiting on budget decisions nobody has scheduled, and the monthly status email now gets no replies. The staff and participants who took part in the audit have heard nothing since.",
          prompt: "What restores momentum?",
          options: [
            { label: "Send a longer status email with more detail on every line.", response: "Length is not the problem. The email reaches people who cannot decide and asks nothing of them. The stalled items need a decision, and the decision-makers need to be in a room." },
            { label: "Replace the email with a short quarterly review attended by the named decision-makers, present stalled items as decisions needed with a date, and send the audit participants a plain summary of what has been fixed and what is next.", response: "This puts decisions in front of those who hold them, makes stalls visible and actionable, and repays the people whose evidence started the work.", recommended: true },
            { label: "Declare the roadmap complete on the strength of the quick fixes and start a new audit.", response: "The barriers that stop people entirely are in the stalled projects. A new audit would find them again. Finish the decisions." },
          ],
        },
        transfer: {
          prompt: "Who found the barriers on your roadmap, and what have they heard since?",
          options: ["Write a plain summary of what is fixed, what is stalled and why, and what is next", "Send it to the people who took part in the audit before it goes to leadership", "Put the next review with decision-makers on the calendar"],
        },
        blocks: [
          { type: "text", heading: "Plans fade; reviews do not have to", body: "<p>Most accessibility roadmaps do not fail dramatically. They fade. The quick fixes get done, momentum drops, the planned projects wait for decisions that never get scheduled, and the status email becomes a message nobody opens. Sustaining a roadmap is a design problem with a known answer: a review cadence that puts decision-makers in front of the decisions, a status format that tells the truth, and a share-back step that keeps faith with the people who found the barriers.</p><p>The review should be short, scheduled and attended by the people named as decision-makers on the open lines. Its agenda is the roadmap itself: what moved, what stalled and why, what decision is needed and by whom, and what the measures show. Stalled items are presented as decisions needed, with a date, not as apologies.</p><p>Honesty in status reporting is what makes the review worth attending. A progress summary of green items that everyone knows are not green teaches leaders to ignore it. An honest report that says three items are waiting on a budget decision, names the decision-maker and proposes a date is a report that produces action.</p>" },
          { type: "list", heading: "A status line that tells the truth", items: ["Moved: what was completed, and the measure it changed.", "Stalled: what has not moved, the specific reason, and whether it is a knowledge gap, a constraint or a values disagreement.", "Decision needed: what, from whom, by when. This is the line the review exists for.", "Measures: the two or three access and outcome measures the roadmap committed to, with the current value and the trend.", "Shared back: when and how the people who found the barriers were told."] },
          { type: "leaderMove", heading: "Put the decision in the room", control: "You control whether stalled items are reported to people who can decide them or to people who can only sympathize.", failure: "Do not send status to a distribution list and call it governance. Do not mark an item in progress for more than one review without naming the decision that would move it.", next: "For every stalled line, write the decision needed and the name of the person who holds it, and put both on the next review agenda." },
          { type: "statement", body: "The audit participants gave you their time and their experience of being excluded. Telling them what changed is not a communications task. It is the return on their trust, and it is what makes the next audit possible." },
          { type: "flashcards", heading: "Sustaining habits", cards: [
            { front: "Quarterly, with decision-makers", back: "<p>Short, scheduled, attended by those who can say yes. The agenda is the roadmap. Canceled reviews are the first sign of a fading plan.</p>" },
            { front: "Stalled is a status, not a failure", back: "<p>Reported honestly with the reason and the decision needed, a stalled item becomes an agenda item. Hidden behind “in progress,” it becomes a permanent one.</p>" },
            { front: "Share back first", back: "<p>Disabled staff and participants who took part in the audit hear what changed before leadership does, in plain language, with thanks in the form they choose.</p>" },
            { front: "Adjust without abandoning", back: "<p>When a project proves larger, an owner leaves or a constraint appears, rewrite the line rather than dropping it. The barrier is still there; the plan should still say so.</p>" },
          ] },
          { type: "knowledgeCheck", id: "change-management-and-implementation-5-check", question: "Which status report is most likely to keep a roadmap moving?", options: [
            { text: "All items shown as on track, with detail available on request.", correct: false },
            { text: "Two items completed with their measures, three items stalled with the reason and the decision needed from a named decision-maker by a date, and a note on when audit participants were updated.", correct: true },
            { text: "A long narrative of activity for every item, sent to the whole division.", correct: false },
          ], feedbackCorrect: "Yes. Honest, specific, addressed to people who can act, and accountable to the people who provided the evidence.", feedbackIncorrect: "Look for the report that names decisions and decision-makers. Reassurance and volume both produce silence." },
        ],
      },
    ],
  },
  jobAid: {
    title: "From findings to change",
    subtitle: "The questions that turn an accessibility audit into work that gets done",
    quote: "Group it. Rate it. Name who decides. Measure the barrier removed. Review it with the people who can say yes.",
    use: {
      purpose: "Keep a roadmap honest and moving from the day the audit report lands to the day the last barrier is removed.",
      remember: ["Findings are grouped by root cause and rated by severity, reach and effort; effort is never the first sort key.", "Every line names an owner, a decision-maker, a date, a budget need and a measure of the barrier removed.", "Resistance is a knowledge gap, a structural constraint or a values disagreement; ask before you diagnose, and match the response.", "Make the case in the audience’s language, keep every claim true, and put legal risk last."],
      doNext: "Build the first ten roadmap lines, confirm the decision-makers, and schedule the first quarterly review.",
    },
    sections: [
      { heading: "Building the roadmap", items: ["Group findings by root cause; write one system-level problem statement per group.", "Rate severity, reach and effort; anything that stops people entirely goes in the first phase with an interim route.", "Sort into quick fixes, planned projects and policy changes; most root causes need one of each.", "Review the draft with the disabled people who took part in the audit before leadership sees it."] },
      { heading: "Each roadmap line", items: ["Owner who does the work; decision-maker who can approve, fund or require it; confirmed with both.", "Date for the next decision or finished piece of work; budget need as a number, a range or “to be scoped by.”", "Success measure stated as what people can now do, not what the organization did."] },
      { heading: "Carrying it through", items: ["Diagnose resistance: knowledge gap, structural constraint or values disagreement. Ask: what would need to be true for this to work here?", "Lead with the audience’s reason: service quality, workforce participation, innovation, trust; legal risk last and plainly.", "Review quarterly with decision-makers; report stalled items as decisions needed with a name and a date.", "Tell the people who found the barriers what changed, before the leadership deck."] },
    ],
  },
  sources: [
    { title: "ADA.gov, U.S. Department of Justice", href: "https://www.ada.gov/", note: "Authoritative information on the Americans with Disabilities Act obligations of state and local governments that sit behind many audit findings." },
    { title: "W3C Web Accessibility Initiative, Planning and Managing Web Accessibility", href: "https://www.w3.org/WAI/planning-and-managing/", note: "A structured approach to initiating, planning, implementing and sustaining accessibility across an organization." },
    { title: "Section508.gov", href: "https://www.section508.gov/", note: "Federal program management, procurement and maturity resources for building accessibility into how an organization works." },
    { title: "U.S. Access Board", href: "https://www.access-board.gov/", note: "Accessibility standards and guidelines for the built environment and information technology that inform severity ratings." },
    { title: "Centers for Disease Control and Prevention, Disability Inclusion", href: "https://www.cdc.gov/disability-inclusion/about/index.html", note: "Population context, including the estimate that about one in four adults in the United States has a disability, used in the workforce participation case." },
    { title: "Minnesota Department of Human Services, Olmstead Plan", href: "https://mn.gov/dhs/general-public/about-dhs/olmstead/", note: "A Minnesota example of a plan with owners, measurable goals and public progress reporting on disability inclusion." },
  ],
};

export default pack;
