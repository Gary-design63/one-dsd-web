import type { CoursePack } from "../../source-types";

// Program Integrity curriculum, module 1: What Fraud Enforcement Actually Costs.
const pack: CoursePack = {
  course: {
    id: "pi-what-fraud-enforcement-costs",
    indexNumber: 1126,
    seriesLabel: "Program Integrity",
    title: "What Fraud Enforcement Actually Costs",
    subtitle: "Real fraud causes real harm. So does enforcement that isn't careful. Both are true at once, and DHS staff need to hold both.",
    scope: "For all DHS staff. Awareness-level; it does not replace any required agency training on fraud, waste, and abuse.",
    treatment: "Four short lessons with a scenario, flashcards, and knowledge checks",
    duration: "40–48 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/stock-people-11.jpg",
    coverAlt: "A man reviews a document on his laptop at an office desk.",
    introTranscript: "Medicaid fraud is real, and it takes resources from people who need them. Enforcement against it is necessary. This course is about a harder truth that sits right next to that one: when enforcement moves fast and broad, it can also disrupt services for people who did nothing wrong, force honest providers out of business, and leave the people depending on them without care. A recent, large Minnesota program closure, and another large program's sweeping wave of provider terminations and a new enrollment freeze, show exactly how this plays out. You will leave able to describe both sides of that reality accurately, without minimizing either one.",
    kind: "course",
    contentType: "foundation",
    learning: {
      objectives: [
        "Explain, using real Minnesota program history, how fraud in a Medicaid-funded service can grow large enough to force a program-wide response.",
        "Describe how enforcement actions — revalidation, payment holds, provider terminations — can disrupt care for people who were never involved in any wrongdoing.",
        "Identify why under-resourced, legitimate providers are often the most vulnerable to being swept up in broad enforcement.",
        "State, in your own words, why 'fraud is real' and 'enforcement can cause harm' are not contradictory statements.",
      ],
      evidence: [
        "A worked account of two real Minnesota Medicaid programs' growth, fraud discovery, and the different enforcement responses that followed.",
        "Two knowledge checks on the dual reality of enforcement's costs and benefits.",
      ],
      appliedNextStep: "Next time you hear about a program integrity action in the news or at work, ask both questions: what harm was this meant to stop, and who besides the wrongdoers might it affect?",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public reporting and Minnesota Department of Human Services announcements, checked at authoring, September 2026",
      lastReviewed: "At authoring",
      nextReview: "When either referenced program's status changes, or when new statewide program integrity data becomes available",
      updateTriggers: ["A material change to either referenced program's status", "New statewide data on program integrity outcomes", "Feedback that a scenario reads as minimizing fraud's real harm, or as minimizing harm to people affected by enforcement"],
      relatedDoor: "This course describes public program history to build general understanding. It is not legal guidance, and it does not describe or comment on any specific ongoing investigation, provider, or individual.",
      toolkitQuestion: "What harm was this decision meant to prevent, and who besides the wrongdoers does it actually reach?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "pi-costs-1",
        number: 1,
        title: "How a Medicaid-funded service can outgrow its safeguards",
        summary: "Trace how rapid growth in a Medicaid-funded service, without matching oversight, created conditions for large-scale fraud — and why closing the door afterward is never simple.",
        minutes: 11,
        learning: {
          objective: "Explain how a Medicaid-funded service can grow faster than its oversight, and why that gap is a system design problem, not a story about any one group of people.",
          takeaways: [
            "Some Minnesota Medicaid-funded services grew extremely quickly in a short period, with far more providers and much higher spending than the program's original safeguards were built for.",
            "Fast growth without matching oversight investment creates the conditions fraud exploits — this is a pattern in program design, not a description of the people the program serves.",
            "When fraud is eventually discovered at scale, the response often has to be broad and fast, which is exactly what makes it hard to keep narrow and precise.",
          ],
          evidence: "One knowledge check on why oversight gaps develop.",
          appliedNextStep: "Think of one program or service your team touches that has grown quickly. Ask whether its oversight capacity grew at the same pace.",
        },
        scenario: {
          context: "Fictional example. A Medicaid-funded service triples its enrolled providers and its annual spending in three years. A colleague says, \"Growth this fast is exactly what precedes a fraud scandal — we should be worried.\"",
          prompt: "What is the most accurate response to that statement?",
          options: [
            { label: "Agree completely; fast growth in a Medicaid-funded service is itself a sign of fraud.", response: "Growth alone is not evidence of fraud; it can also mean a program is finally reaching people who always needed it. The real question is whether oversight capacity grew at the same pace." },
            { label: "Disagree completely; growth and oversight capacity are unrelated, and this concern is overblown.", response: "This dismisses a real, documented pattern. Growth that outpaces oversight investment is exactly the condition that has preceded large Minnesota program integrity cases." },
            { label: "Note that growth itself is not the problem, but ask whether verification, auditing, and oversight staffing grew at the same rate as enrollment and spending.", response: "This names the actual risk factor precisely, without treating growth or the people served as suspect.", recommended: true },
          ],
        },
        transfer: {
          prompt: "Where in your own work has growth outpaced oversight capacity, or could it?",
          options: ["Name one program or service you touch that has grown quickly", "Ask whether verification or oversight staffing kept pace with that growth", "Write down one question you would ask to find out"],
        },
        blocks: [
          { type: "text", heading: "Growth outpacing safeguards", body: "<p>One Minnesota Medicaid-funded service intended to support children with a developmental condition grew from a small program serving a few hundred people, at a cost of roughly half a million dollars a year, to a program serving thousands of people at a cost of several hundred million dollars a year — in well under a decade. The number of enrolled providers grew by roughly seven times over the same period. Growth on that scale is not automatically a warning sign; it can also mean a program is finally reaching people who always needed it. But growth that fast, without a matching increase in verification, auditing, and oversight staff, creates exactly the conditions that let fraud take root and spread before anyone catches it.</p><p>This is a pattern that shows up across public benefit programs generally, not a story about the people any specific program serves. A program built to prioritize access — get help to people quickly, minimize paperwork barriers, trust practitioners' clinical judgment — can, without anyone intending it, also become easier for a small number of bad actors to exploit. The design tension is real: the same features that make a program work well for the overwhelming majority of honest people and providers are often the features fraud takes advantage of.</p>" },
          { type: "text", heading: "What discovery looks like, and what happens next", body: "<p>In the case above, investigators eventually identified fraud schemes involving false diagnoses, kickback payments, and billing for services that were never delivered. Once fraud is confirmed at that scale, the state faces a genuine dilemma: move slowly and carefully, and more public money keeps flowing to fraudulent claims while the investigation continues; move quickly and broadly, and the response will almost certainly catch legitimate, honest providers and the people they serve in its wake, because a fast response cannot always distinguish precisely between the two in the moment.</p><p>In the program above, the response has stopped short of closing the benefit itself. It has included a wave of provider terminations, a temporary freeze on enrolling new providers in that service, and new licensing requirements for the providers who remain. The benefit continues for the children and families who rely on it, even as oversight around it has tightened considerably.</p><p>A separate, similarly large Minnesota program — one that helped elderly and disabled Minnesotans at risk of losing their housing stay housed — followed a comparable arc: rapid growth, warning signs that went unaddressed for over a year, and, eventually, the termination of the entire program rather than a narrower fix. Every person who had been receiving legitimate help through that program lost it on the same day as everyone who had been defrauding it. That is the real cost this course is asking you to hold alongside the real fraud that made the closure necessary.</p>" },
          { type: "leaderMove", heading: "Ask about oversight capacity, not just growth numbers", control: "You control whether a report on program growth also names whether oversight staffing and verification kept pace.", failure: "Do not treat rapid growth alone as either good news or a warning sign. The number that matters is the gap between growth and oversight capacity.", next: "The next time you see a growth figure for a program you touch, ask the paired question: did oversight capacity grow at the same rate." },
          { type: "flashcards", heading: "Keep the pattern straight", cards: [
            { front: "What grew?", back: "<p>Enrollment, spending, and the number of participating providers — sometimes by several times over, in a short period.</p>" },
            { front: "What didn't keep pace?", back: "<p>Verification, auditing, and oversight staffing — the capacity needed to catch problems as the program scaled.</p>" },
            { front: "Who does the gap describe?", back: "<p>A program design and resourcing choice. Not the people the program serves.</p>" },
          ] },
          { type: "knowledgeCheck", id: "pi-costs-1-check", question: "Why does rapid growth in a Medicaid-funded service, without matching oversight, create conditions that fraud can exploit?", options: [
            { text: "Because the people the program serves are more likely to commit fraud.", correct: false },
            { text: "Because verification, auditing, and oversight capacity did not grow at the same pace as enrollment and spending, leaving gaps a small number of bad actors could exploit.", correct: true },
            { text: "Because Medicaid funding itself is inherently prone to fraud regardless of program design.", correct: false },
          ], feedbackCorrect: "Right. The gap is between program growth and oversight capacity — a design and resourcing problem, not a statement about who a program serves.", feedbackIncorrect: "The honest explanation is a resourcing gap: oversight capacity that didn't keep pace with rapid growth, not anything about the people the program was built to help." },
        ],
      },
      {
        id: "pi-costs-2",
        number: 2,
        title: "Who else is standing in the blast radius",
        summary: "Understand how legitimate providers and the people who depend on them can be harmed by broad enforcement, and why smaller, under-resourced providers are especially exposed.",
        minutes: 12,
        learning: {
          objective: "Describe at least two concrete ways broad enforcement can harm people and providers who were never involved in fraud.",
          takeaways: [
            "Payment holds, off-cycle revalidation, and provider terminations can financially threaten honest providers just as effectively as they stop dishonest ones — legitimate providers have reported being owed hundreds of thousands of dollars during review periods.",
            "Smaller, under-resourced providers — who often lack the compliance staff and cash reserves larger organizations have — are disproportionately vulnerable to being forced to close during a broad enforcement sweep, even when they did nothing wrong.",
            "When a provider closes or a program ends, the people who depended on it lose access immediately, often with little notice and few equivalent alternatives nearby.",
          ],
          evidence: "One knowledge check distinguishing a targeted response from a broad one, and their different costs.",
          appliedNextStep: "If your work touches a provider or program going through a program integrity review, ask what continuity plan exists for the people who depend on it — not just what the review is investigating.",
        },
        scenario: {
          context: "Fictional example. A small, independently owned provider serving a limited number of clients is included in a broad payment-hold action affecting an entire high-risk service category, after a state agency identifies large-scale fraud elsewhere in that category. There is no specific allegation against this provider. The hold freezes its payments for ninety days while the agency reviews claims across the category.",
          prompt: "What is the most accurate way to think about this provider's situation?",
          options: [
            { label: "If the provider is innocent, the ninety-day hold is a minor inconvenience with no real cost.", response: "A ninety-day payment freeze can be the difference between staying open and closing for a provider without large cash reserves — treating it as a minor inconvenience ignores what a review period actually costs a small operation." },
            { label: "The hold is unfair and enforcement should never affect anyone who isn't personally under investigation.", response: "This ignores why broad reviews sometimes have to happen: fraud discovered at scale can require category-wide scrutiny to find every instance, not just the ones already known. The tension is real, not a simple unfairness to eliminate outright." },
            { label: "The hold is a real cost this provider bears because of fraud committed by others in the same service category — a cost the state should work to minimize and shorten wherever it can, while still completing the review it needs to do.", response: "This holds both truths: the review may be necessary, and it still imposes a real, uneven cost on an innocent provider that the state has a responsibility to minimize.", recommended: true },
          ],
        },
        transfer: {
          prompt: "Where has a broad program integrity tool touched a provider or program you know, whether or not fraud was ever found?",
          options: ["Name the action and who it affected besides the people responsible for any wrongdoing", "Identify whether the affected provider or program had the cushion to absorb it", "Write one thing that could have reduced that cost without weakening the review"],
        },
        blocks: [
          { type: "text", heading: "Broad tools have broad reach", body: "<p>The tools state agencies use to respond to large-scale fraud — payment holds, more frequent revalidation, provider enrollment moratoria, category-wide claims reviews — are built to be broad on purpose, because fraud discovered at scale often can't be traced precisely to every bad actor without reviewing the whole category. That breadth is also exactly what makes these tools costly to the honest majority caught inside them. A legitimate provider under a payment hold does not get paid for services it has actually delivered, sometimes for months, while the review runs its course. For a small, independently owned provider without deep cash reserves, that alone can be enough to force a closure that has nothing to do with anything that provider did.</p><p>This falls unevenly by design, even without anyone intending it to. Larger organizations typically have compliance staff, legal counsel, and financial reserves built for exactly this kind of disruption. Smaller and newer providers — who are often the ones best positioned to serve a community closely, build trust quickly, and respond to specific needs — usually have none of that cushion. The providers most likely to close during a broad enforcement action are often not the ones most likely to have committed fraud; they are the ones least able to absorb the disruption of being reviewed.</p>" },
          { type: "text", heading: "The people behind the provider", body: "<p>When a provider closes — for fraud, for financial failure during a review, or because an entire program is terminated — the people who depended on that provider do not experience it as an abstract policy outcome. They experience it as a therapist, a home care worker, or a housing support specialist they trusted suddenly gone, often with little warning and, depending on where they live, few or no comparable alternatives nearby. A person's relationship with a provider is not interchangeable the way a claims system treats it. Someone who has spent months building trust with a specific worker, in a specific language, with a specific understanding of their situation, does not simply transfer that relationship to whoever is next available.</p><p>None of this is an argument against acting on real fraud. It is a reminder that the honest, complete description of what enforcement costs includes this population — the people who did nothing wrong and lost something real anyway — and that DHS staff who understand this are better equipped to communicate about it honestly, and to look for ways enforcement can be both effective and less disruptive to the people not involved.</p>" },
          { type: "knowledgeCheck", id: "pi-costs-2-check", question: "Why are smaller, under-resourced providers disproportionately vulnerable during broad enforcement actions, even when they haven't committed fraud?", options: [
            { text: "They are more likely to be investigated because they are smaller.", correct: false },
            { text: "They typically lack the compliance staff and financial reserves that larger organizations have to absorb a payment hold or review period without closing.", correct: true },
            { text: "Broad enforcement actions are specifically designed to target smaller providers.", correct: false },
          ], feedbackCorrect: "Right. It's about capacity to absorb disruption, not likelihood of wrongdoing or intentional targeting.", feedbackIncorrect: "The vulnerability comes from limited financial cushion and compliance capacity, not from being more likely to have done something wrong." },
          { type: "flashcards", heading: "Two costs to hold apart", cards: [
            { front: "The cost to a provider", back: "<p>Frozen payments, a review period with no guaranteed end, and no cushion for a small operation to absorb the wait.</p>" },
            { front: "The cost to the people served", back: "<p>A trusted worker or provider gone with little warning, and often no comparable alternative nearby.</p>" },
          ] },
          { type: "leaderMove", heading: "Ask what continuity plan exists, not just what the review covers", control: "You control whether a program integrity briefing you receive or give names a continuity plan for the people affected, not only the review's scope.", failure: "Do not treat 'the review is necessary' as the end of the conversation. Ask what happens to the people and providers caught inside it while it runs.", next: "The next time you're briefed on a program integrity action, ask specifically what continuity plan exists for people who depend on the providers involved." },
        ],
      },
      {
        id: "pi-costs-3",
        number: 3,
        title: "What a proportionate response actually looks like",
        summary: "Move from naming the dual cost of enforcement to describing what a fair, precise, evidence-based response looks like in practice, and why precision is itself a form of respect.",
        minutes: 12,
        learning: {
          objective: "Describe at least three features of a proportionate program integrity response, and explain why precision protects both program dollars and innocent people.",
          takeaways: [
            "A proportionate response scopes its reach to the actual evidence: it targets the specific claims, billing patterns, or individuals implicated, and widens only as far as new evidence requires, rather than starting broad by default.",
            "Time-boxing a review, and communicating that time box to the people affected, turns an open-ended hold into a bounded one — which matters enormously to a small provider deciding whether it can stay open.",
            "Proportionality is not softness on fraud. A response that is scoped, time-boxed, and evidence-based is usually more durable in court and more defensible publicly than one that swept broadly and had to walk parts of itself back.",
          ],
          evidence: "A scenario comparing a broad, indefinite hold to a scoped, time-boxed review, and a knowledge check on what proportionality means in practice.",
          appliedNextStep: "The next time you see or hear about a program integrity action described only as 'broad' or 'sweeping,' ask what would have made it scoped instead, and whether that scoping was considered.",
        },
        scenario: {
          context: "Fictional example. Investigators confirm fraud among a subset of providers in a home-care billing category. A draft plan proposes an indefinite payment hold on every provider in the category, state-wide, until the investigation concludes with no announced end date.",
          prompt: "What change would make this response more proportionate without weakening the investigation?",
          options: [
            { label: "Keep the plan as written; a wider net catches more potential wrongdoing.", response: "A net with no time box and no scoping catches wrongdoing and ordinary operating providers indiscriminately, and offers no way for an honest provider to know when the disruption ends." },
            { label: "Scope the hold to the billing codes and geographic area tied to the confirmed pattern, set a defined review period with a stated end or renewal date, and communicate both clearly to every affected provider.", response: "This keeps the investigation's reach tied to actual evidence, gives honest providers a horizon they can plan around, and remains free to widen later if new evidence justifies it.", recommended: true },
            { label: "Cancel the hold entirely and rely on after-the-fact recovery of any fraudulent payments once the investigation concludes.", response: "This protects every provider's cash flow but stops nothing while fraud may still be occurring, and recovery after the fact is far less reliable than stopping active fraudulent billing." },
          ],
        },
        transfer: {
          prompt: "Think of a review, hold, or audit your team has run or been part of. Was it scoped to the evidence and time-boxed, or open-ended by default?",
          options: ["Name one action and whether it had a defined scope and end date", "Identify what evidence would have justified narrowing or widening it", "Write down what you would tell an affected provider about when the action ends"],
        },
        blocks: [
          { type: "text", heading: "Scope to the evidence, not to convenience", body: "<p>A broad, indefinite response is often easier to write than a scoped one — it requires less analysis up front and covers the investigator against missing someone. But easier to write is not the same as proportionate. A response scoped to the actual evidence starts with the specific claims, billing codes, providers, or geographic area where the pattern was found, and widens only when new evidence supports widening it. That discipline takes more analytical work at the outset. It also means far fewer honest providers get caught in an action that was never about them.</p><p>Scoping is not a courtesy extended to providers; it is a more accurate description of where the actual risk lives. A category-wide hold treats every provider in the category as equally suspect, which is rarely true. A scoped hold treats the providers connected to the confirmed pattern as the priority, and reserves the broader tool for cases where the pattern genuinely cannot be isolated.</p>" },
          { type: "text", heading: "Time-boxing turns an open wound into a bounded one", body: "<p>An indefinite hold is one of the most damaging things a state agency can do to a small provider, not because of its size but because of its shape: a provider cannot plan, cannot tell staff when payroll stabilizes, and cannot tell clients when normal service resumes, because there is no stated end point. A time-boxed review with a published review date does something simple but important: it gives the honest provider a horizon. Even a ninety-day review with a clear renewal decision date is a different experience than a hold with no stated end, because it can be planned around.</p><p>Time-boxing does not mean rushing the investigation. It means the state commits to revisiting the scope and duration on a schedule, publicly enough that affected providers know when that revisiting happens, rather than leaving the hold in place by default until someone remembers to lift it.</p>" },
          { type: "leaderMove", heading: "Ask for the scope and the end date, every time", control: "You control whether you accept 'category-wide' and 'until further notice' as adequate descriptions of a program integrity action, or ask what would narrow and bound it.", failure: "Do not treat breadth and indefinite duration as neutral defaults. They are choices with real costs, and often there is a narrower, time-boxed alternative that serves the investigation just as well.", next: "The next time you review or hear about a proposed enforcement action, ask two questions before it proceeds: what evidence sets this scope, and when will it be revisited." },
          { type: "flashcards", heading: "Three features of a proportionate response", cards: [
            { front: "Scoped to evidence", back: "<p>The action targets the specific claims, codes, providers, or area tied to the confirmed pattern, and widens only when new evidence justifies it.</p>" },
            { front: "Time-boxed", back: "<p>The action has a stated review or end date, published to the people affected, rather than continuing indefinitely by default.</p>" },
            { front: "Clearly communicated", back: "<p>Affected providers and clients know what is happening, what stays the same, and when the next decision point arrives.</p>" },
          ] },
          { type: "knowledgeCheck", id: "pi-costs-3-check", question: "Why does scoping and time-boxing a program integrity action usually make it more durable, not less effective?", options: [
            { text: "Because it is less likely to be publicly noticed.", correct: false },
            { text: "Because it ties the action's reach and duration to actual evidence, which is easier to defend and gives honest providers a clear horizon to plan around, rather than sweeping broadly and indefinitely.", correct: true },
            { text: "Because it guarantees no fraud will be missed.", correct: false },
          ], feedbackCorrect: "Right. Evidence-based scope and a defined duration make the action both more defensible and less disruptive to people not involved.", feedbackIncorrect: "Think about what makes an action easier to justify afterward and easier for an honest provider to plan around: tying reach and duration to actual evidence, not breadth for its own sake." },
        ],
      },
      {
        id: "pi-costs-4",
        number: 4,
        title: "Your commitment: the two questions in practice",
        summary: "Turn the course's two guiding questions into a habit you actually use, and commit to one concrete place you will apply it.",
        minutes: 12,
        learning: {
          objective: "Apply the toolkit question — what harm was this meant to stop, and who besides the wrongdoers might it reach — to a real situation in your own work, and commit to using it again.",
          takeaways: [
            "The two-question habit — what harm was this meant to prevent, and who besides the wrongdoers does it actually reach — works on program integrity news, a policy proposal, or a decision inside your own team.",
            "Writing the commitment down, naming a specific process and a specific colleague who will ask about it, is what separates an intention from a habit.",
            "Holding fraud's real cost and enforcement's real cost together is not a compromise position between two sides; it is the accurate description of what is actually happening.",
          ],
          evidence: "A scenario applying the two-question habit to a real-shaped internal decision, and a written commitment.",
          appliedNextStep: "Apply the two-question habit to one program integrity item, in the news or at work, within the next week, and tell the colleague you named what you found.",
        },
        scenario: {
          context: "Fictional example. Your unit is asked to help design outreach for a new provider-screening requirement, prompted by a recent fraud case. The draft plan describes the requirement only in terms of the fraud it is meant to stop, with no mention of which honest providers it will also affect or how their concerns will be heard.",
          prompt: "What is the most useful contribution you can make to this draft?",
          options: [
            { label: "Approve the draft; describing the fraud clearly is the most important part of outreach about a new requirement.", response: "Describing the fraud is necessary but incomplete. Without naming who else the requirement reaches and how they can ask questions, the outreach only tells half the true story." },
            { label: "Add a section naming which honest, currently compliant providers this requirement will also affect, and a real channel for them to ask questions or flag hardship before the requirement takes effect.", response: "This applies the two-question habit directly: it keeps the harm the requirement addresses, and adds the reach and channel the draft was missing.", recommended: true },
            { label: "Recommend delaying the requirement until every affected provider has been individually consulted.", response: "This is not realistic for a state-wide requirement and would delay a legitimate protection. The goal is a real channel for concerns, not unanimous prior consultation." },
          ],
        },
        transfer: {
          prompt: "Where will you apply the two-question habit this month, and who will you tell what you found?",
          options: ["Name a specific program integrity item, policy, or team decision you will examine", "Write the harm it is meant to stop and who else it might reach, in your own words", "Name the colleague or supervisor you will share the answer with"],
        },
        blocks: [
          { type: "text", heading: "A habit, not a debate position", body: "<p>Across this course, two questions have done the actual work: what harm was this decision meant to prevent, and who besides the wrongdoers does it actually reach? These are not two sides of an argument to be weighed against each other and resolved into a single verdict. They are two facts that are both true at the same time, in nearly every real program integrity action. Fraud enforcement that ignores the first question tolerates real harm. Fraud enforcement that ignores the second question causes real harm of its own. Holding both is simply an accurate description of what a program integrity decision actually does.</p><p>This applies well beyond program integrity news. It applies to a screening requirement your unit is asked to communicate, a review your team is asked to help design, or a policy question raised in a meeting. The habit is the same size regardless of scale: name the harm being addressed, and name who else the response reaches.</p>" },
          { type: "list", heading: "Where to apply the habit this week", items: ["A program integrity story in the news: what specific harm does it describe, and who else does the response affect?", "A policy or screening change proposed in your own unit: same two questions, applied internally.", "A conversation with a colleague who states only one half of the picture: ask the question that surfaces the other half.", "A notice or communication you are asked to review: does it name what is happening and who it reaches, or only one of the two?"] },
          { type: "leaderMove", heading: "Name both halves out loud", control: "You control whether a conversation about program integrity, in a meeting or at your desk, states only the harm being addressed or also names who else the response reaches.", failure: "Do not let a one-sided description pass unremarked, in either direction: neither minimizing real fraud nor ignoring real harm to people not involved.", next: "The next time program integrity comes up in your work, say the sentence that names both: what this addresses, and who else it reaches." },
          { type: "quote", text: "I used to think being fair to the honest providers meant going slower on the fraud. It took me a while to see they're not actually in tension if you scope the response to the evidence.", cite: "Composite staff perspective, illustrative" },
          { type: "knowledgeCheck", id: "pi-costs-4-check", question: "Why are 'fraud is real and causes harm' and 'enforcement can also cause harm' not contradictory statements?", options: [
            { text: "Because one of them is exaggerated and should be discounted.", correct: false },
            { text: "Because they describe two different, simultaneously true facts about the same real situation, and a complete, accurate description of a program integrity action includes both.", correct: true },
            { text: "Because they only apply to different programs and never occur in the same case.", correct: false },
          ], feedbackCorrect: "Right. Both are accurate at once; treating them as opposing positions to pick between misses what is actually happening.", feedbackIncorrect: "Consider whether a single program integrity action can genuinely stop real fraud and also impose real cost on people who did nothing wrong — both at the same time." },
          { type: "statement", body: "Commitment: “The program integrity item I will examine this month is… The harm it addresses is… Who else it might reach is… The colleague who will ask me what I found is…” Write it now." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Holding both truths",
    subtitle: "A one-page reminder for any DHS staff member touching program integrity work",
    quote: "Fraud is real and takes resources from people who need them. So is the cost enforcement can impose on people who did nothing wrong. Neither cancels the other out.",
    use: {
      purpose: "Keep both halves of this reality available when program integrity work touches your day — a conversation, a policy question, a piece of news.",
      remember: ["Rapid program growth without matching oversight is a design gap, not a statement about who a program serves.", "Broad enforcement tools are broad on purpose, and that breadth has a real, uneven cost.", "Smaller, under-resourced providers are usually the most exposed to closure during a review — not the most likely to have committed fraud.", "The people who lose a provider or a program lose a real relationship, not an interchangeable service.", "A proportionate response is scoped to the evidence and time-boxed, with a stated date to revisit it.", "Holding fraud's real cost and enforcement's real cost together is the accurate description, not a compromise between two sides."],
      doNext: "When you hear about a program integrity action, ask both questions: what harm was it meant to stop, and who besides the wrongdoers might it reach?",
    },
    sections: [
      { heading: "Two questions to hold together", items: ["What fraud or harm was this action responding to?", "Who, besides the people responsible for that harm, is affected by the response?"] },
      { heading: "What makes a response proportionate", items: ["Scoped to the specific claims, providers, or area tied to the evidence, widening only when new evidence supports it.", "Time-boxed, with a stated review or end date shared with the people affected.", "Clearly communicated: what is happening, what stays the same, and when the next decision point arrives."] },
      { heading: "What this course does not do", items: ["It does not name or describe any specific investigation, provider, or individual.", "It does not take a position on any specific pending legislation or policy proposal.", "It does not replace legal guidance on any actual program integrity matter."] },
    ],
  },
  sources: [
    { title: "Minnesota Department of Human Services, program integrity and fraud prevention announcements", href: "https://mn.gov/dhs/", note: "Official DHS communications on program status changes, service classifications, and provider actions." },
    { title: "Minnesota Reformer, reporting on Medicaid program integrity in Minnesota", href: "https://minnesotareformer.com/", note: "Independent nonprofit newsroom reporting on state program integrity actions and their financial scale." },
    { title: "KFF, What to Know About Recent Federal Actions Involving State Medicaid Program Integrity", href: "https://www.kff.org/medicaid/what-to-know-about-recent-federal-actions-involving-state-medicaid-program-integrity/", note: "Nonpartisan health policy research organization's explainer on federal program integrity actions affecting states." },
    { title: "MPR News, on the end of a Minnesota Medicaid-funded housing program", href: "https://www.mprnews.org/episode/2025/11/04/minnesotas-housing-stabilization-program-has-ended-what-happens-to-minnesotans-that-used-it", note: "Public radio reporting confirming a Minnesota Medicaid program's termination for fraud, and describing its effect on the people who had been receiving services through it." },
  ],
};

export default pack;
