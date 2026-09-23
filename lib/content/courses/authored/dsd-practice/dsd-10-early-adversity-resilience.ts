import type { CoursePack } from "../../source-types";

// DSD Service System curriculum, module 10: Early adversity, resilience and service response.
// Program-authored for staff who assess, plan for or support people whose lives include early adversity, and who decide what gets asked and recorded.
const pack: CoursePack = {
  course: {
    id: "dsd-10-early-adversity-resilience",
    indexNumber: 1190,
    seriesLabel: "DSD Service System · Practice",
    title: "Early Adversity, Resilience and Service Response",
    subtitle: "What early adversity does over a lifetime, why people with disabilities carry more of it, what protective factors actually are, and how a service can respond without making a person tell the story again.",
    scope: "For care coordinators, case managers, intake and assessment staff, direct support staff, program and policy staff who design what gets asked, and supervisors. Four short lessons you can take in any order. Voluntary and self-directed: no score, no ranking, no completion requirement. Completion here does not count toward required training credits unless management, a director, or leadership expressly approves an exception.",
    treatment: "Four short lessons with practice examples, a sort separating protective factors from risk factors, scenarios, flashcards, and an intake review you can run on what your process asks",
    duration: "45–50 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/dsd-early-adversity-resilience.jpg",
    coverAlt: "A woman in her forties sits on a community center bench with a cup of coffee, in conversation with a peer worker, both relaxed and facing the room.",
    introTranscript: "A large share of the people the Division serves have lives that include early adversity: abuse, neglect, household instability, institutional placement, and the specific adversities that come with growing up disabled in a world not built for it. Research on early adversity is now well known, and it is often applied badly: as a score, as a screening question asked at intake, as a reason. This module covers what early adversity does over a lifetime, why people with disabilities carry more of it, what protective factors and resilience actually mean, and how a service can respond well without requiring the person to tell the story again. Nothing here is scored, ranked or collected.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Describe what early adversity does over a lifetime and explain why people with disabilities are more likely to have experienced it.",
        "Explain what protective factors and resilience are, and distinguish them from a demand that the person cope.",
        "Identify when a service process asks a person to disclose adversity without a purpose, and redesign the question.",
        "Run an intake review on what your process asks about adversity and produce one change.",
      ],
      evidence: [
        "A sort separating protective factors from risk factors and from demands.",
        "Four scenario decisions and four knowledge checks with explanations.",
        "A completed intake review with one changed question.",
      ],
      appliedNextStep: "Look at one intake or assessment form you use and find every question that asks about adversity; for each, write down what the answer changes.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Change in the Division's intake or assessment instruments", "Change in trauma-responsive practice standards adopted by the Department", "Feedback from staff or participants that a description no longer matches practice"],
      relatedDoor: "Questions about a specific person's history, safety or mental health go to the responsible clinician or the adult protection process where required; this course builds practice, it does not assess anyone.",
      toolkitQuestion: "What does this question about the person's past change about what we do, and if nothing, why are we asking it?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "dsd-early-adversity-1",
        number: 1,
        title: "What early adversity does",
        summary: "Understand what early adversity does over a lifetime and why people with disabilities carry more of it.",
        minutes: 12,
        learning: {
          objective: "Describe the long-term effects of early adversity and explain three reasons people with disabilities are more likely to have experienced it.",
          takeaways: [
            "Early adversity — abuse, neglect, household instability, loss — affects health, learning, relationships and stress response across the lifespan, in ways that are well documented and not deterministic.",
            "People with disabilities experience more early adversity: higher rates of abuse and neglect, institutional placement, medical trauma, and the daily adversity of exclusion.",
            "The research is a description of populations, not a prediction about a person, and using it as a score for individuals misreads what it shows.",
          ],
          evidence: "An accordion on why rates are higher, a statement, a scenario decision and a knowledge check.",
          appliedNextStep: "Think of one person you support whose behavior the file describes; consider what history the file does not contain.",
        },
        scenario: {
          context: "An intake form asks a person to check boxes for ten categories of childhood adversity and produces a number. A worker receives a file with the number eight on it and no other context, and the person is coming in tomorrow.",
          prompt: "What does the number tell the worker?",
          options: [
            { label: "That the person has a high level of trauma and will need specialized handling.", response: "The number says that eight boxes were checked. It says nothing about which, what happened after, what supports existed, or what the person wants now. Handling someone according to a number is what the research warns against." },
            { label: "Very little about this person: the research describes population-level associations, the number carries no information about severity, timing, support or recovery, and the worker's job tomorrow is to meet the person, not the score.", response: "This is the accurate reading. The number was produced by a process that borrowed a research tool for a purpose it was never built for. The worker starts from the person.", recommended: true },
            { label: "That the intake was thorough.", response: "It was intrusive. Thorough would mean asking questions whose answers change what happens next, and this number does not." },
          ],
        },
        transfer: {
          prompt: "Where in your process does a count of adversity appear, and what does it change?",
          options: ["Find any question or score about childhood adversity in a form you use", "Write down what a different answer would change about the service", "If nothing, mark the question for the review in lesson four"],
        },
        blocks: [
          { type: "text", heading: "A lifetime, not a childhood", body: "<p>Research over several decades has established that adversity in childhood — abuse, neglect, a household with violence, addiction, mental illness or incarceration, the loss of a parent — is associated with worse health, more chronic disease, more mental illness, and shorter lives in adulthood. The effect is graded: more adversity, more risk. The mechanism is partly biological, through a stress response that stays switched on, and partly social, through the disruption of learning, relationships and safety.</p><p>Two things about this research are routinely lost. First, it describes populations. It says that people with more adversity are more likely, as a group, to have worse outcomes. It does not say that any one person will, and many do not. Second, it was not designed as a screening tool for individuals, and using it as one, at intake, produces a number that carries almost no information about the person in front of you.</p>" },
          { type: "accordion", heading: "Why people with disabilities carry more of it", items: [
            { title: "Higher rates of abuse and neglect", body: "<p>Children with disabilities are abused and neglected at markedly higher rates than other children, by family, by caregivers and in institutions. Dependence on others for care, communication barriers, and isolation all raise the risk and lower the likelihood of disclosure.</p>" },
            { title: "Institutional placement", body: "<p>Many adults now served in the community spent childhood in institutions, and institutions were sites of adversity: separation from family, regimentation, restraint, abuse, and the absence of anyone whose job was to love them.</p>" },
            { title: "Medical trauma", body: "<p>Repeated surgeries, painful procedures, long hospitalizations, and treatment decisions made without the child's understanding or consent. Adversity that was also care.</p>" },
            { title: "The adversity of exclusion", body: "<p>Being the child who was left out, bullied, spoken about, moved to a separate class, and told in a thousand ways that the world was not built for them. Not on any checklist, and formative.</p>" },
          ] },
          { type: "statement", body: "The research describes populations. It was never a prediction about a person, and a number at intake tells you almost nothing about the person coming in tomorrow." },
          { type: "leaderMove", heading: "Take the score off the front page", control: "You control whether a number about a person's childhood travels with their file. A number with no context shapes how every reader meets them.", failure: "Do not let a research instrument become a triage tool. It was not built for that and it does not work as one.", next: "Find out whether any score about adversity appears in the files your team receives, and what readers do with it." },
          { type: "knowledgeCheck", id: "dsd-early-adversity-1-check", question: "What does research on early adversity establish?", options: [
            { text: "That a person with a high count of adverse experiences will have poor outcomes.", correct: false },
            { text: "That across populations, more early adversity is associated with more risk of poor health and other outcomes, with wide variation between individuals and without predicting any one person.", correct: true },
            { text: "That childhood adversity can be reliably measured with a ten-question form.", correct: false },
          ], feedbackCorrect: "Yes. Population association, graded, real, and not a prediction about an individual.", feedbackIncorrect: "The research is population-level and is not a measurement or prediction tool for individuals." },
        ],
      },
      {
        id: "dsd-early-adversity-2",
        number: 2,
        title: "Protective factors and resilience",
        summary: "Learn what protective factors are, what resilience actually means, and how to tell either from a demand that the person cope.",
        minutes: 10,
        learning: {
          objective: "Define protective factors and resilience as the research uses them, and distinguish them from an expectation that the person cope with what the system does.",
          takeaways: [
            "Protective factors are conditions — a stable relationship with a caring adult, safe housing, a sense of belonging, skills for managing stress — that reduce the effect of adversity. They are things people have, not things they are.",
            "Resilience is the observable outcome of protective factors operating; it is not a personal trait to be praised or a capacity to be demanded.",
            "A service that talks about resilience while removing protective factors is asking the person to cope with the service.",
          ],
          evidence: "A sort separating protective factors from risk factors and from demands, a flashcard set, a scenario decision and a knowledge check.",
          appliedNextStep: "For one person, list the protective factors currently in their life and the one your service could add or protect.",
        },
        scenario: {
          context: "A team is reviewing a man in his thirties who was moved three times in a year between providers. Each move cost him the staff he knew. The review notes that he has coped remarkably well and describes him as resilient.",
          prompt: "What is the most useful observation?",
          options: [
            { label: "Agree; he has shown real strength through a difficult year.", response: "He has. Praising it while the system continues to remove the relationships that protect him is a way of not noticing what the system is doing." },
            { label: "Name that each move removed a protective factor — a known, trusted relationship — and that describing him as resilient in the review obscures that; the useful question is how to stop the moves.", response: "This puts the responsibility where it belongs. His resilience is real, and the system is spending it. Protecting the factor is the service's job.", recommended: true },
            { label: "Recommend a resilience-building program for him.", response: "He does not lack resilience. He lacks stability, which the service controls. Sending him to a program to cope better with instability is exactly the confusion the lesson is about." },
          ],
        },
        transfer: {
          prompt: "Which protective factor in one person's life is your service in a position to protect or remove?",
          options: ["List the protective factors currently in the person's life", "Mark which ones the service affects: relationships, housing, routine, belonging", "Decide one thing the service will do to protect one of them"],
        },
        blocks: [
          { type: "text", heading: "Things people have, not things they are", body: "<p>The same research that documented the effects of early adversity also documented what reduces them. A stable relationship with at least one caring adult. Safe and stable housing. A sense of belonging to a community, a culture, a faith. Skills for managing stress. Access to help when needed. These are protective factors, and their defining feature is that they are conditions in a person's life, not qualities of the person. They can be provided, protected, and removed.</p><p>Resilience is what protective factors produce. When a person with a difficult history does well, the research points to the factors that were present, not to an inner quality of toughness. This matters for services because services routinely praise resilience while removing its causes: moving people between providers, changing staff, disrupting routine, ending relationships. A service that does this and then calls the person resilient is asking them to cope with the service.</p>" },
          { type: "sorting", id: "dsd-early-adversity-2-sort", heading: "Protective factor, risk factor, or demand to cope?", categories: ["Protective factor", "Risk factor", "Demand to cope"], items: [
            { text: "A support worker the person has known for six years.", category: "Protective factor" },
            { text: "A third change of provider in twelve months.", category: "Risk factor" },
            { text: "A note commending the person for adjusting well to the third change.", category: "Demand to cope" },
            { text: "A faith community the person has attended since childhood.", category: "Protective factor" },
            { text: "Housing that may end at the next review.", category: "Risk factor" },
            { text: "A referral to a stress-management class instead of stabilizing the housing.", category: "Demand to cope" },
          ] },
          { type: "flashcards", heading: "The protective factors services touch", cards: [
            { front: "A stable, caring relationship", back: "<p>The single most protective factor in the research. Services touch it every time they change a worker, a provider, or a housemate.</p>" },
            { front: "Safe, stable housing", back: "<p>Protective in itself and the base for everything else. Services touch it through placement decisions, funding reviews and eviction responses.</p>" },
            { front: "Belonging", back: "<p>Membership in a community, a culture, a faith, a group. Services touch it by supporting or failing to support access, and by moving people away from it.</p>" },
            { front: "Predictability", back: "<p>Routine, warning before change, knowing what happens next. Services touch it constantly and rarely count it.</p>" },
            { front: "Access to help", back: "<p>Knowing whom to call and being answered. Services are this factor, when they work.</p>" },
          ] },
          { type: "leaderMove", heading: "Count the protective factors the service controls", control: "You control whether a decision to move, change or end something is made with the protective factor it removes in view. Naming it is what puts it in view.", failure: "Do not describe a person as resilient in a review of a decision that removed something protective. It converts a cost the service imposed into a credit to the person.", next: "Before the next change to a person's worker, provider or housing, write down the protective factor it affects." },
          { type: "knowledgeCheck", id: "dsd-early-adversity-2-check", question: "A service moves a person between providers and notes that the person has shown resilience. What has been confused?", options: [
            { text: "Nothing; the person coped and deserves credit.", correct: false },
            { text: "A cost the service imposed by removing a protective factor has been recorded as a strength of the person, which obscures the service's responsibility for the factor.", correct: true },
            { text: "The person should have been consulted about the move.", correct: false },
          ], feedbackCorrect: "Yes. Resilience is produced by protective factors, and the service removed one. The note credits the person for absorbing what the service did.", feedbackIncorrect: "Consultation matters and is a different point. The confusion is between a factor the service controls and a trait attributed to the person." },
        ],
      },
      {
        id: "dsd-early-adversity-3",
        number: 3,
        title: "Not asking for the story",
        summary: "Learn when a process asks a person to disclose adversity without a purpose, and how to redesign the question.",
        minutes: 12,
        learning: {
          objective: "Identify a question in a service process that asks for disclosure of adversity without changing what happens next, and rewrite it or remove it.",
          takeaways: [
            "Every question about a person's history has a cost to the person; a question is justified only when the answer changes what the service does.",
            "Most intake and assessment questions about adversity change nothing: the service offered is the same whatever the answer, and the story has been told again for no purpose.",
            "The alternative is to ask about what the person needs now — what helps, what to avoid, who to involve — which is what a trauma-responsive service actually acts on.",
          ],
          evidence: "A tabs comparison of history questions and present-need questions, a quote, a scenario decision and a knowledge check.",
          appliedNextStep: "Rewrite one history question on a form you use as a present-need question.",
        },
        scenario: {
          context: "A woman in her forties is asked at intake to describe any history of abuse. She has been asked this by seven services in twenty years. She answers briefly, becomes withdrawn, and the rest of the intake is difficult. The answer is recorded and does not affect the service plan.",
          prompt: "What should change?",
          options: [
            { label: "The worker should have been more skilled in asking.", response: "Skill helps with the asking, and it does not answer why the question was asked. The answer changed nothing, and the cost was paid anyway." },
            { label: "The question should be removed or replaced with one about present need — what helps her feel safe, what to avoid, whom to involve — because a question whose answer changes nothing about the service is a cost without a purpose.", response: "This is the design fix. The service can be responsive to her history without requiring her to recite it, by asking what she needs now.", recommended: true },
            { label: "The question should stay, since history is clinically relevant.", response: "It may be relevant to a clinician who will act on it. At a service intake where the plan is the same either way, it is relevant to nobody and costly to her." },
          ],
        },
        transfer: {
          prompt: "Which history question on your form changes nothing, and what present-need question replaces it?",
          options: ["Find one question about the person's past on a form you use", "Write down what a different answer changes; if nothing, mark it", "Rewrite it as a question about what the person needs now"],
        },
        blocks: [
          { type: "text", heading: "The cost of the question", body: "<p>Telling the story of what happened to you is not free. It costs something every time, and it costs more when the listener is a stranger, the setting is an office, and nothing visible happens as a result. People who have been in services for years have told the story to many workers, in many intakes, and have learned that the telling changes nothing. The question is a ritual the service performs, and the person pays for it.</p><p>The test for any history question is simple: what does the answer change? If the plan, the service, the worker or the approach would be different depending on the answer, the question has a purpose, and the way it is asked can be made as safe as possible. If nothing changes, the question is intrusion, and the fix is to remove it.</p><p>What a service can act on is present need. What helps you feel safe here. What we should avoid. Who you want involved, and who you do not. Whether you want to be told before things change. These questions produce answers the service can use, and they do not require the person to say what happened.</p>" },
          { type: "tabs", heading: "History questions and present-need questions", tabs: [
            { label: "History", body: "<p>\"Have you experienced abuse or neglect?\" \"Describe any trauma history.\" \"Were you ever placed in an institution?\" Each asks for the story. Ask what the answer changes.</p>" },
            { label: "Present need", body: "<p>\"What helps you feel comfortable in a new place?\" \"Is there anything we should avoid doing or saying?\" \"Who would you like involved, and who would you not?\" \"Do you want to be told before something changes?\" Each produces something the service does differently.</p>" },
            { label: "When history is needed", body: "<p>Sometimes it is: a clinician who will act on it, a safety question that must be answered, a legal requirement. Then ask once, explain why, say who will see it, and make sure the person does not have to say it again to the next worker.</p>" },
          ] },
          { type: "quote", text: "A question about a person's past is justified when the answer changes what the service does. Otherwise it is a cost with no purpose, paid by the person." },
          { type: "leaderMove", heading: "Ask what the answer changes", control: "You control what your process asks. For every history question, you can ask what a different answer would change. Where the answer is nothing, you can remove it.", failure: "Do not keep a question because it has always been there or because it feels thorough. Thoroughness that changes nothing is intrusion.", next: "Take one form and write, beside every history question, what the answer changes." },
          { type: "knowledgeCheck", id: "dsd-early-adversity-3-check", question: "What is the test for whether a question about a person's adversity history belongs in a service process?", options: [
            { text: "Whether the worker is trained to ask it sensitively.", correct: false },
            { text: "Whether the answer changes what the service does; if nothing changes, the question is a cost to the person with no purpose.", correct: true },
            { text: "Whether the information might be useful someday.", correct: false },
          ], feedbackCorrect: "Yes. Purpose is the test. Sensitivity governs how a justified question is asked, not whether it should be.", feedbackIncorrect: "Sensitivity and possible future use both leave the person paying for a question that changes nothing now." },
        ],
      },
      {
        id: "dsd-early-adversity-4",
        number: 4,
        title: "An intake review you can run",
        summary: "Review what your process asks about adversity and change one question.",
        minutes: 12,
        learning: {
          objective: "Complete an intake review of one form or process and produce one changed question with a named owner.",
          takeaways: [
            "The review asks, for each question about the person's past, what the answer changes, who sees it, and whether the person will have to say it again.",
            "Most forms contain at least one question that fails the test and one place where a present-need question would serve the person better.",
            "One question changed on a form that hundreds of people complete is a larger change than most practice improvements.",
          ],
          evidence: "A list of the review's questions, an artifact, a scenario decision and a knowledge check.",
          appliedNextStep: "Run the review on one form this month and send the changed question to whoever owns the form.",
        },
        scenario: {
          context: "Your review of an intake form finds four history questions. For two, a different answer would change the plan. For two, it would not. The form is used across the program and changing it requires approval.",
          prompt: "What do you propose?",
          options: [
            { label: "Leave the form as it is, since half the questions are justified.", response: "Half are justified. The other half cost every person who completes the form and produce nothing. That is what the review exists to find." },
            { label: "Propose removing the two questions that change nothing, adding two present-need questions in their place, and, for the two that remain, adding a sentence that says why they are asked and who will see the answer.", response: "This keeps what has purpose, removes what does not, adds what the service can act on, and makes the remaining questions safer to answer. It is a proposal a form owner can act on.", recommended: true },
            { label: "Propose removing all four to be safe.", response: "Two of them change the plan. Removing them means the service cannot respond to what it needs to know." },
          ],
        },
        transfer: {
          prompt: "Which form will you review, and which question will you change?",
          options: ["Name the form and list every question about the person's past", "For each, write what the answer changes and who sees it", "Send one proposed change to the form's owner"],
        },
        blocks: [
          { type: "text", heading: "A form is a policy", body: "<p>A form is completed by everyone who enters a service, so a question on it is a decision about what every one of those people will be asked. That makes the form the highest-leverage place to change practice. One history question removed, or one present-need question added, changes the intake of every person who follows. The review is short because forms are worth reviewing often.</p>" },
          { type: "list", heading: "The five questions", ordered: true, items: ["List every question on the form that asks about the person's past: abuse, neglect, trauma, placement, family history.", "For each, what does a different answer change about the plan, the service or the approach? Write it down. If nothing, mark the question.", "For each, who sees the answer, and will the person have to say it again to the next worker or the next service?", "What present-need question could replace each marked one: what helps, what to avoid, whom to involve, whether to warn before change?", "What is the one change you will propose, to whom, and by when?"] },
          { type: "artifact", kind: "plain-language-flyer", label: "Review record", title: "Intake review", summary: "One page that lists every history question on a form, what each changes, and the one change proposed.", fields: [
            { label: "Form and history questions", value: "Each question listed" },
            { label: "What each answer changes", value: "Plan, service, approach, or nothing" },
            { label: "Who sees it; will it be asked again", value: "For each" },
            { label: "Present-need replacements", value: "For each question that changes nothing" },
            { label: "One change, one owner, one date", value: "Proposed to the form's owner" },
          ], action: "Run it on one form and send the change to its owner." },
          { type: "leaderMove", heading: "Change the form, not the worker", control: "You control whether a finding about a question becomes a note to workers about asking sensitively or a change to the form. The form change reaches everyone; the note reaches whoever reads it.", failure: "Do not let a question survive because removing it requires approval. Approval is one email; the question is asked hundreds of times.", next: "Send one proposed question change to a form owner this month." },
          { type: "flashcards", heading: "Present-need questions that work", cards: [
            { front: "\"What helps you feel comfortable somewhere new?\"", back: "<p>Produces things the service can do on the first day: a quiet space, a familiar person, a written plan, time.</p>" },
            { front: "\"Is there anything we should avoid?\"", back: "<p>Produces the specific: a tone, a topic, a kind of touch, a time of day. Without requiring the reason.</p>" },
            { front: "\"Who do you want involved, and who not?\"", back: "<p>Produces the boundary the service most often crosses by default: contacting family, sharing with providers.</p>" },
            { front: "\"Do you want to know before something changes?\"", back: "<p>Almost everyone says yes. The service can then do it.</p>" },
          ] },
          { type: "knowledgeCheck", id: "dsd-early-adversity-4-check", question: "Why is changing a question on an intake form a larger practice change than training workers to ask it more sensitively?", options: [
            { text: "Because training is expensive.", correct: false },
            { text: "Because the form is completed by every person who enters the service, so a changed question changes every intake, while training changes only the workers who absorbed it.", correct: true },
            { text: "Because workers resist training.", correct: false },
          ], feedbackCorrect: "Yes. Reach is the reason. A form is a policy applied to everyone.", feedbackIncorrect: "The point is not cost or resistance. It is that a form change reaches everyone and a training change reaches some." },
        ],
      },
    ],
  },
  jobAid: {
    title: "Early adversity: what to ask and what to protect",
    subtitle: "A one-page reference for anyone who designs intake, assesses, plans or supports people with difficult histories",
    quote: "A question about a person's past is justified when the answer changes what the service does. Otherwise it is a cost with no purpose, paid by the person.",
    use: {
      purpose: "Respond to early adversity by protecting the factors that reduce its effects and by asking only what the service will act on.",
      remember: ["The research describes populations; a score at intake describes almost nothing about the person.", "Protective factors are conditions the service can provide, protect or remove: relationships, housing, belonging, predictability.", "Resilience is what protective factors produce, not a trait to praise while removing them.", "Ask what the answer changes. If nothing, remove the question."],
      doNext: "Run the intake review on one form and send one changed question to its owner.",
    },
    sections: [
      { heading: "When you design what gets asked", items: ["For every history question, write what the answer changes.", "Replace questions that change nothing with present-need questions.", "For the ones that remain, say why they are asked and who will see the answer.", "Make sure the person does not have to say it again."] },
      { heading: "When you make a decision that changes a person's life", items: ["Name the protective factor it affects: a relationship, a home, a routine, a community.", "Ask whether the factor can be kept.", "Do not describe the person as resilient in the review of the decision."] },
      { heading: "When you meet a person with a difficult file", items: ["Take the score off the front page.", "Start from what the person needs now.", "Ask what helps, what to avoid, whom to involve, and whether to warn before change."] },
    ],
  },
  sources: [
    { title: "Centers for Disease Control and Prevention, adverse childhood experiences", href: "https://www.cdc.gov/aces/", note: "Federal public health information on early adversity, its effects, and prevention." },
    { title: "Center on the Developing Child, Harvard University, resilience", href: "https://developingchild.harvard.edu/science/key-concepts/resilience/", note: "Accessible description of protective factors and how resilience is produced." },
    { title: "Substance Abuse and Mental Health Services Administration, trauma-informed approach", href: "https://www.samhsa.gov/", note: "Federal guidance on trauma-informed principles for organizations and services." },
    { title: "Minnesota Department of Human Services, Disability Services Division", href: "https://mn.gov/dhs/people-we-serve/people-with-disabilities/", note: "State program information on services for Minnesotans with disabilities." },
    { title: "Vera Institute of Justice, people with disabilities and abuse", href: "https://www.vera.org/", note: "Research on the elevated rates of abuse and violence experienced by people with disabilities." },
    { title: "Minnesota Council on Disability", href: "https://www.disability.state.mn.us/", note: "State council offering guidance and technical assistance on disability access and policy in Minnesota." },
  ],
};

export default pack;
