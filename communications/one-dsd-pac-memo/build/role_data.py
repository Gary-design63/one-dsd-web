# -*- coding: utf-8 -*-
#
# Content for the ten job-family nodes -- the second lens on the same
# Division, alongside the twelve program-area nodes. "does" is WORK_PROFILES'
# own purpose sentence, copied verbatim (lib/content/work-learning.ts); so is
# every resource title, resolved from the id lists WORK_PROFILES already
# carries against lib/content/corpus.ts, not retyped from memory. Only the
# three entry points per role and the program crosswalk are written for this
# page.
#
# The crosswalk is by position and function, not by name: the consultant's
# own direction is that this program is designed around what a role does,
# not who currently holds it, so "directly_in" and "indirectly_in" name
# which program areas a job family's work sits inside versus touches from
# outside it -- a judgment call grounded in DSD_PROGRAMS' own "does"
# sentences, stated as one in its own text, not a fact pulled from a field
# that does not exist: WORK_PROFILES carries no domains axis the way
# DSD_PROGRAMS does. A role with no direct program (data/equity-style
# cross-cutting work) is left with an empty directly_in rather than forced
# into a false home.
#
# What this deliberately does not do: name individual leaders, or build a
# fourth lens of formal administrative units with named managers. No
# structure anywhere in the Program's data assigns a specific person to a
# specific team -- the organization file's own declared gap says as much.
# The direct/indirect crosswalk above is the honest, position-based answer
# to "which unit is most likely involved here": it is not a substitute for
# an org chart, and does not claim to be one.

ROLES = [

 {
  "id": "leadership", "slug": "JF-Leadership",
  "title": "Executive and Division Leadership",
  "does": "Examine the effects of a proposed direction, identify who can act, and plan how to check results.",
  "entries": [
   ("The effects of a proposed direction",
    "Before a direction is set is when it is cheapest to ask who it could affect differently, not after. Usually <strong>step 1 (desired results)</strong> and <strong>step 4 (benefits, burdens)</strong>."),
   ("Who can actually act on it",
    "A sound direction with no one holding clear authority to carry it out usually stalls. Usually <strong>step 1</strong> and <strong>step 7 (alignment)</strong> &mdash; step 1 asks who has decision authority directly."),
   ("How results will be checked",
    "Deciding in advance what would count as working, and for whom, is usually a <strong>step 6 (accountability, evaluation, and communication)</strong> question, asked before the decision rather than after."),
  ],
  "resources": ["DHS Equity Analysis Toolkit", "Equity impact questions for policy, budget, technology, and procurement", "Building equity into an idea while it takes shape"],
  "directly_in": ["Division Leadership, Legislative Work, and Strategy"],
  "indirectly_in": ["Olmstead and Community Integration", "Contracts, Grants, Fiscal, and Capacity Work"],
  "gap_extra": "which decisions in front of you this week actually call for an analysis, or how your own direction-setting process currently works",
 },

 {
  "id": "policy", "slug": "JF-Policy",
  "title": "Policy and Program Analysis",
  "does": "Examine who benefits from a rule, where it creates burden, and what evidence could support a better alternative.",
  "entries": [
   ("Who benefits from a rule",
    "A rule that is neutral in its wording can still benefit some people more than others in practice. Usually <strong>step 1</strong> and <strong>step 4</strong>."),
   ("Where it creates burden",
    "The same requirement can cost different people different amounts of time, travel, or help to meet. Usually <strong>step 4</strong> and scan <strong>question 4</strong>."),
   ("What evidence supports a better alternative",
    "A recommendation is stronger once it names what was compared and why. Usually <strong>step 2 (data)</strong> and <strong>step 5 (equity impact statement)</strong>."),
  ],
  "resources": ["DHS Equity Analysis Toolkit", "Questions about the steps, time, and effort a process requires", "Equity impact questions for policy, budget, technology, and procurement"],
  "directly_in": ["Home and Community-Based Services Policy and Waivers"],
  "indirectly_in": ["MnCHOICES Assessment and Access", "Employment and Day Services"],
  "gap_extra": "which specific rules or proposals are active in your queue right now",
 },

 {
  "id": "service", "slug": "JF-Service",
  "title": "Eligibility and Service Delivery",
  "does": "Look at the steps people must navigate, communication needs, and opportunities to make access easier.",
  "entries": [
   ("The steps people must navigate",
    "A process that is the same on paper for everyone can still take more steps, more trips, or more help for some people than others. Usually <strong>step 4</strong>."),
   ("Communication needs",
    "Whether a person can act on what they are told depends on the language and format it arrives in. Usually <strong>step 3 (engagement)</strong> and <strong>step 6</strong>."),
   ("Opportunities to make access easier",
    "Once a barrier is named, the next question is what could change about the process itself. Usually <strong>step 4</strong> and <strong>step 5</strong>."),
  ],
  "resources": ["Questions about the steps, time, and effort a process requires", "Access checks before a meeting, outreach, or session", "Using community context without profiling"],
  "directly_in": ["MnCHOICES Assessment and Access", "Support Planning and Case Management"],
  "indirectly_in": ["Home and Community-Based Services Policy and Waivers"],
  "gap_extra": "which specific step in your process is the one people get stuck on most often",
 },

 {
  "id": "management", "slug": "JF-Management",
  "title": "Supervision and Management",
  "does": "Connect fair decisions with the conditions that help staff contribute, raise concerns, and do their work well.",
  "entries": [
   ("Fair decisions",
    "A decision applied consistently on paper can still land unevenly across a team. Usually <strong>step 4</strong>."),
   ("Conditions that help staff contribute",
    "Whether staff have the time and support to do equity-conscious work at all is itself a capacity question. Usually <strong>step 8 (sustainability)</strong>."),
   ("Raising concerns safely",
    "Whether a staff member can name a problem without it costing them something is usually a <strong>step 6</strong> question, aimed inward."),
  ],
  "resources": ["Team climate basics: participation, honest conversation, and fair opportunities", "Team climate action plan template", "Access checks before a meeting, outreach, or session"],
  "directly_in": ["Support Planning and Case Management", "Positive Supports and Person-Centered Practice"],
  "indirectly_in": ["Training, Communication, and Strategic Communications"],
  "gap_extra": "how concerns currently reach you from your team, or what your unit's actual caseload or workload picture looks like",
 },

 {
  "id": "workforce", "slug": "JF-Workforce",
  "title": "Hiring and Workforce Development",
  "does": "Examine requirements, access to opportunity, and the employee experience beyond the initial hiring decision.",
  "entries": [
   ("Requirements",
    "A qualification the work does not actually need can narrow the field before anyone applies. Usually <strong>step 4</strong>."),
   ("Access to opportunity",
    "Who applies, who advances, and who never hears about an opening are three different questions. Usually <strong>step 2 (data)</strong>."),
   ("The employee experience beyond hiring",
    "Equity in hiring that stops at the offer letter is not sustained. Usually <strong>step 8</strong>."),
  ],
  "resources": ["DHS Equity Analysis Toolkit", "Equity impact questions for policy, budget, technology, and procurement", "Team climate basics: participation, honest conversation, and fair opportunities"],
  "directly_in": ["Training, Communication, and Strategic Communications"],
  "indirectly_in": ["Employment and Day Services", "Division Leadership, Legislative Work, and Strategy"],
  "gap_extra": "current hiring or promotion data broken out by group, or what has already been tried",
 },

 {
  "id": "fiscal", "slug": "JF-Fiscal",
  "title": "Budgets, Grants, and Contracts",
  "does": "Consider who can meet the requirements, where costs and burdens fall, and how the decision will be reviewed.",
  "entries": [
   ("Who can meet the requirements",
    "A solicitation requirement can be reasonable on its face and still exclude smaller or newer organizations. Usually <strong>step 4</strong>."),
   ("Where costs and burdens fall",
    "A budget decision moves cost somewhere; the question is where, and onto whom. Usually <strong>step 4</strong> and <strong>step 2</strong>."),
   ("How the decision will be reviewed",
    "Naming the review point in advance is usually a <strong>step 6</strong> question."),
  ],
  "resources": ["Equity impact questions for policy, budget, technology, and procurement", "Questions about the steps, time, and effort a process requires", "Building equity into an idea while it takes shape"],
  "directly_in": ["Contracts, Grants, Fiscal, and Capacity Work"],
  "indirectly_in": ["Home and Community-Based Services Policy and Waivers", "Data, Quality, and Evaluation"],
  "gap_extra": "the current applicant pool for a specific solicitation or budget line",
 },

 {
  "id": "data", "slug": "JF-Data",
  "title": "Data, Research, and Quality",
  "does": "Define the decision question, examine what the evidence can show, and identify whose experience may be missing.",
  "entries": [
   ("Defining the decision question",
    "What the data can answer depends on what was actually asked. Usually <strong>step 1</strong>."),
   ("What the evidence can show",
    "A number answers a narrower question than it looks like it does; naming that limit is part of the work. Usually <strong>step 2</strong>."),
   ("Whose experience may be missing",
    "A system built for one purpose may simply not capture the split an equity question needs. Usually <strong>step 2</strong> and <strong>step 3</strong>."),
  ],
  "resources": ["Equity impact questions for policy, budget, technology, and procurement", "Planning with partners: who to involve", "A final review for your working plan"],
  "directly_in": ["Data, Quality, and Evaluation"],
  "indirectly_in": ["Home and Community-Based Services Policy and Waivers", "Olmstead and Community Integration"],
  "gap_extra": "which systems your team actually pulls from, or what has already been tried to fill a known gap",
 },

 {
  "id": "engagement", "slug": "JF-Engagement",
  "title": "Community Engagement and Partnership",
  "does": "Consider who can influence a decision, what participation requires, and how people will hear what happened next.",
  "entries": [
   ("Who can influence a decision",
    "Naming who could still change the outcome, before engagement starts, is what makes the engagement genuine rather than symbolic. Usually <strong>step 3</strong>."),
   ("What participation requires",
    "Participation has its own accessibility questions &mdash; language, timing, format. Usually <strong>step 3</strong> and scan <strong>question 2</strong>."),
   ("How people hear what happened next",
    "Engagement without a return loop reads, eventually, as not having mattered. Usually <strong>step 6</strong>."),
  ],
  "resources": ["Six commitments for working in partnership", "Planning with partners: who to involve", "Using community context without profiling"],
  "directly_in": ["EIDBI and Children's Services"],
  "indirectly_in": ["MnCHOICES Assessment and Access", "Employment and Day Services"],
  "gap_extra": "who you have already engaged on a specific decision, or what accessible participation currently looks like in practice",
  "program_link": ("Mentoring and peers", "https://one-dhs-pac.vercel.app/one-dsd/amplify/mentoring",
   "Peer-to-peer mentoring is already live in the wider One DSD Program, under Amplify Equity &mdash; this toolkit doesn't replace it."),
 },

 {
  "id": "communication", "slug": "JF-Communication",
  "title": "Communication and Accessibility",
  "does": "Examine whether people can find, understand, and use information in the form they need.",
  "entries": [
   ("Whether people can find it",
    "Information that exists somewhere is not the same as information a person can locate when they need it. Usually <strong>step 6</strong>."),
   ("Whether people can understand it",
    "Plain language and translation are both part of this, and neither is optional for one audience and required for another. Usually <strong>step 6</strong> and scan <strong>question 6</strong>."),
   ("Whether people can use it",
    "A format that is accurate and still inaccessible &mdash; to a screen reader, to someone without broadband &mdash; has not actually reached the person. Usually <strong>step 4</strong>."),
  ],
  "resources": ["Access checks before a meeting, outreach, or session", "Questions about the steps, time, and effort a process requires", "Using community context without profiling"],
  "directly_in": ["Training, Communication, and Strategic Communications"],
  "indirectly_in": ["MnCHOICES Assessment and Access", "Home and Community-Based Services Policy and Waivers", "Brain Injury, Guardianship, and Related Programs"],
  "gap_extra": "which channels your actual audience uses, or what has already been tried and not worked",
 },

 {
  "id": "equity", "slug": "JF-Equity",
  "title": "Equity Practice and Organizational Change",
  "does": "Connect a specific barrier with the wider process, responsible partners, and a change that can be sustained.",
  "entries": [
   ("A specific barrier and the wider process",
    "A barrier found in one place usually has a cause that sits upstream of it. Usually <strong>step 7 (alignment)</strong>."),
   ("Responsible partners",
    "Naming who else needs to be at the table is usually a <strong>step 3</strong> and <strong>step 7</strong> question."),
   ("A change that can be sustained",
    "A fix that depends on one person remembering to do it by hand is not yet sustained. Usually <strong>step 8</strong>."),
  ],
  "resources": ["DHS Equity Analysis Toolkit", "Building equity into an idea while it takes shape", "Equity and access checklist for new work"],
  "directly_in": [],
  "indirectly_in": ["Division Leadership, Legislative Work, and Strategy", "Olmstead and Community Integration", "Training, Communication, and Strategic Communications"],
  "gap_extra": "which barriers are already named in your area and who currently owns following up on them",
  "program_link": ("Tool card: Intercultural Development Inventory (IDI)", "https://one-dhs-pac.vercel.app/library/tool-idi",
   "The wider One DSD Program names the IDI continuum as its own theory of change for this kind of work &mdash; never scored or attached to a person, always developmental."),
 },

]
