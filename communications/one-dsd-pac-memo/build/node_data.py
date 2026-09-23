# -*- coding: utf-8 -*-
#
# Content for all twelve DSD program nodes. HCBS and Data, Quality, and
# Evaluation were built first and by hand, to prove the pattern before it was
# templated (the shared instrument was diffed byte-for-byte between them);
# they are transcribed here in the same schema as the other ten so one
# generator now produces all twelve, with no hand-authored exception to drift
# out of step. Every "does" and "entryPoints" line is copied verbatim from
# lib/dsd/index.ts (DSD_PROGRAMS), owner-approved. Every org-context fact and
# partner name is copied from data/organization/minnesota-dhs.json, each
# traceable to a cited entry. Only the connective prose -- which step an
# entry point usually lands under, and the "in brief" and "gap" framing -- is
# written for this page.

NODES = [

 {
  "id": "hcbs-policy",
  "slug": "HCBS",
  "title": "Home and Community-Based Services Policy and Waivers",
  "eyebrow": "Program node &middot; pilot unit",
  "pilot": True,
  "does": "Sets policy for waiver and community-based services, including eligibility, service menus, rates, and provider standards.",
  "brief_extra": "In the Combined Manual this is where BI, CAC, CADI, DD and Elderly Waiver guidance lives, alongside CFSS and the surrounding eligibility, employment and service-option chapters.",
  "entries": [
   ("Who gets which service mix, and why",
    "Work that sets eligibility rules or service menus tends to raise this first: two people with similar needs can end up with different service mixes, and the reason is not always visible in the record. Usually where <strong>step 1</strong> and <strong>step 4</strong> do the most work."),
   ("The burden of documentation and authorization steps",
    "A requirement that is the same on paper for everyone can still cost some people more time or help to complete than others. Usually <strong>step 4</strong> and scan <strong>question 4</strong>."),
   ("The language and format of notices",
    "A notice that is accurate and still unreadable to the person it is for is a common failure point in waiver work. Usually a <strong>step 3</strong> and <strong>step 6</strong> question."),
   ("Provider capacity in different communities",
    "A policy can be neutral and still land unevenly if providers who can deliver it are not evenly available. Usually <strong>step 2 (data)</strong> &mdash; who can actually reach a provider, not only who is technically eligible."),
  ],
  "org_note": "<strong>Disability Services Division</strong> sits within <strong>Aging and Disability Services</strong>. DSD is not the DHS Licensing function &mdash; HCBS licensing under chapter 245D is DHS Licensing&rsquo;s decision, separate from MHCP provider enrollment and separate again from the service planning this program sets policy for.",
  "partners": [
   ("Disability Waiver Program changes", "Counties, Tribal Nations, and providers, through the Advisory Task Force on Waiver Reimagine."),
   ("The Disability Waiver Rate System", "Lead agencies and service providers, through the Rate Management System."),
   ("MnCHOICES assessment and support planning", "County and Tribal lead agencies, managed care organizations, and Aging and Adult Services."),
   ("HCBS licensing versus enrollment", "DHS Licensing and MHCP Provider Enrollment &mdash; a separate decision from this program's own."),
   ("CFSS and the transition from PCA and CSG", "Lead agencies, through the CFSS Manual's transition guidance."),
  ],
  "neighbours": ["MnCHOICES assessment and access", "Support planning and case management", "Olmstead and community integration", "Employment and day services"],
  "neighbours_note": "Data, quality and evaluation, and contracts and fiscal work, share this program's measurement footing rather than its service footing, and usually enter through step 2 rather than step 3.",
  "gap_extra": "your unit's current internal teams, working relationships, or who actually holds a given decision day to day",
 },

 {
  "id": "mnchoices-access",
  "slug": "MnCHOICES",
  "title": "MnCHOICES Assessment and Access",
  "eyebrow": "Program node",
  "does": "Governs how people are assessed for and connected to long-term services and supports.",
  "brief_extra": "MnCHOICES is the assessment and support-planning tool counties, Tribal Nations and managed care organizations use together. It is usually the first place a person's actual circumstances -- language, home situation, what support already exists -- become part of the official record, which is why so much of what happens later depends on how this step goes.",
  "entries": [
   ("First contact in the person's language",
    "The record shows the first conversation runs through counties, Tribal Nations and managed care organizations before it ever reaches DSD. If that first conversation cannot happen in the language the person actually uses, the assessment that follows is built on whatever the person could get across in a language that was not theirs. This usually belongs under <strong>step 3 (engagement)</strong> and scan <strong>question 2</strong> -- who is being assessed, in what language."),
   ("Accessibility of the assessment process",
    "An assessment that is accurate on paper can still be inaccessible in practice -- a format a person cannot use, a setting that does not accommodate how they communicate, a pace set by the tool rather than the person. This usually surfaces in <strong>step 4 (benefits, burdens)</strong>: the burden of being assessed at all."),
   ("Person-centered practice and supported decision-making",
    "Whether the person's own goals drive the assessment, or the tool's categories do, is a live question in every assessment. This is usually a <strong>step 1 (desired results)</strong> question -- whose desired result is actually being recorded."),
   ("Wait times and follow-up by community",
    "How long someone waits for an assessment, and whether follow-up happens reliably, is not necessarily even across communities. This usually belongs in <strong>step 2 (data)</strong> -- disaggregated by community, not only reported as a single average."),
  ],
  "partners": [
   ("County and Tribal lead agencies", "Conduct assessments and support planning directly."),
   ("Managed care organizations", "Use MnCHOICES for their own enrolled members."),
   ("Aging and Adult Services", "Coordinates related updates through shared aging and disability channels."),
   ("MNIT", "Provides the technology the assessment tool runs on."),
  ],
  "neighbours": ["Home and community-based services policy and waivers", "Support planning and case management", "Olmstead and community integration", "Training, communication, and strategic communications"],
  "gap_extra": "which lead agencies or managed care organizations your work actually touches most, and what the current wait-time picture looks like in practice",
 },

 {
  "id": "support-planning",
  "slug": "SupportPlanning",
  "title": "Support Planning and Case Management",
  "eyebrow": "Program node",
  "does": "Standards and support for the people who plan services with individuals and families.",
  "brief_extra": "This is the work of turning an assessment into an actual plan, and DHS's own person-centered protocol names counties, Tribal organizations and managed care organizations as the people who do it -- alongside providers and DHS Licensing, since a plan only means something once it connects to a service someone can actually receive.",
  "entries": [
   ("Plans that reflect the person's goals",
    "A plan can satisfy every box on the form and still not be the plan the person actually wanted. This usually belongs under <strong>step 1 (desired results)</strong> and <strong>step 5 (equity impact statement)</strong> -- did the plan change because of what the person said, or was the form filled in around a decision already made."),
   ("Cultural and linguistic responsiveness of planning conversations",
    "A planning conversation is not only about content -- it is about whether the person could actually participate in it on their own terms. This usually surfaces under <strong>step 3 (engagement)</strong> and scan <strong>question 2</strong>."),
   ("Caseload and time as equity issues",
    "A planner carrying too many cases has less time for the conversations that make a plan genuinely person-centered, and that time is not necessarily distributed evenly. This usually belongs in <strong>step 2 (data)</strong> as a capacity question, not only a budget one."),
  ],
  "partners": [
   ("Lead agency", "Holds the planning relationship with the person."),
   ("Service providers", "Deliver what a plan calls for."),
   ("DHS Licensing", "Oversees the settings a plan can point to."),
   ("Disability Services Division", "Sets standards for how planning is done."),
  ],
  "neighbours": ["Home and community-based services policy and waivers", "MnCHOICES assessment and access", "Positive supports and person-centered practice", "Training, communication, and strategic communications"],
  "gap_extra": "current caseload levels, or how planning time is actually distributed across a unit",
 },

 {
  "id": "positive-supports",
  "slug": "PositiveSupports",
  "title": "Positive Supports and Person-Centered Practice",
  "eyebrow": "Program node",
  "does": "Guidance and oversight for positive support strategies and person-centered planning.",
  "brief_extra": "This is the program area that decides how DSD's person-centered protocol is actually applied when a support plan involves a person's behavior -- where the line falls between supporting someone and restricting them.",
  "entries": [
   ("Restriction versus support",
    "The same intervention can be described as either, and the description usually depends on who is doing the describing. This is usually a <strong>step 4 (benefits, burdens)</strong> question asked directly: who decided this was support rather than restriction, and how would we know if it were the other way."),
   ("Whose behavior is treated as a problem",
    "A behavior that draws a formal response in one setting may draw none in another, and the difference is not always about the behavior itself. This usually belongs under <strong>step 2 (data)</strong> -- disaggregated by who the behavior belonged to, and by setting."),
   ("Access to positive supports across communities",
    "Positive support strategies require training and time to do well, and both are unevenly distributed. This usually surfaces in <strong>step 2 (data)</strong> as a provider-capacity question."),
  ],
  "partners": [
   ("Disability Services Division", "Sets guidance and oversight."),
   ("Lead agency", "Applies it in individual support plans."),
   ("Providers", "Deliver positive support strategies directly."),
  ],
  "neighbours": ["Home and community-based services policy and waivers", "Support planning and case management", "Employment and day services", "Brain injury, guardianship, and related programs"],
  "gap_extra": "how a restriction is currently reviewed once it is in place, or who holds that decision day to day",
 },

 {
  "id": "olmstead",
  "slug": "Olmstead",
  "title": "Olmstead and Community Integration",
  "eyebrow": "Program node",
  "does": "Work toward services in the most integrated setting appropriate to the person.",
  "brief_extra": "This program area holds the Division's Olmstead commitment directly -- whether people actually receive services in the most integrated setting appropriate to them, not only whether that setting is technically available.",
  "entries": [
   ("Defaults that steer people to segregated settings",
    "A choice can be technically open and still not really be a choice, if the easier path or the one with more available capacity happens to be the more segregated one. This usually belongs under <strong>step 1 (desired results)</strong> -- what counts as the default, and who set it."),
   ("Community capacity by place",
    "The most integrated setting appropriate to a person is not equally available everywhere in the state. This usually surfaces in <strong>step 2 (data)</strong>, disaggregated by place rather than reported as a single statewide figure."),
   ("Data on who moves and who does not",
    "Whether someone moves toward a more integrated setting, and how long that takes, is measurable -- and whether it is measured evenly across groups is a direct equity question. This usually belongs under <strong>step 6 (accountability, evaluation, and communication)</strong>."),
  ],
  "partners": [
   ("Disability Services Division", "Holds the Olmstead commitment."),
   ("Aging and Disability Services", "The administration DSD sits within."),
  ],
  "neighbours": ["Home and community-based services policy and waivers", "Employment and day services", "Contracts, grants, fiscal, and capacity work", "Division leadership, legislative work, and strategy"],
  "gap_extra": "the current state of movement data in practice, or who reviews it and how often",
 },

 {
  "id": "employment",
  "slug": "Employment",
  "title": "Employment and Day Services",
  "eyebrow": "Program node",
  "does": "Employment-first practice and day service policy.",
  "brief_extra": "Employment First and E1MN connect DHS with the Department of Employment and Economic Development and the Department of Education -- this program area does not stand alone, even inside DHS.",
  "entries": [
   ("Competitive integrated employment as the first option",
    "\"First option\" is a policy statement; whether it is actually offered first, to everyone, before other paths are suggested, is a practice question. This usually belongs under <strong>step 1 (desired results)</strong> -- is competitive employment actually presented as the default, or as one option among several offered unevenly."),
   ("Provider practice with different communities",
    "Employment support providers may work more readily with some communities than others, for reasons that have nothing to do with a person's employability. This usually surfaces in <strong>step 2 (data)</strong> as a provider-practice pattern, and in <strong>step 3 (engagement)</strong> when checked against what people actually experienced."),
   ("Outcomes by disability, race, language, and place",
    "Employment outcomes can and should be split more than one way at once -- by disability, by race, by language, by place -- because a good outcome for one cut of the data can hide a poor one for the combination. This usually belongs under <strong>step 2 (data)</strong>, and connects directly to the layered, intersecting view of data this toolkit describes further down this page."),
  ],
  "partners": [
   ("DEED Vocational Rehabilitation Services", "Delivers employment exploration, development and support services."),
   ("Minnesota Department of Education", "Partners through E1MN on the transition to employment."),
   ("Lead-agency employment liaison", "Connects the person to these services locally."),
  ],
  "neighbours": ["Home and community-based services policy and waivers", "MnCHOICES assessment and access", "Positive supports and person-centered practice", "Brain injury, guardianship, and related programs"],
  "gap_extra": "which providers your unit works with most, or how outcomes are currently tracked across DEED and DHS systems",
 },

 {
  "id": "eidbi-children",
  "slug": "EIDBI",
  "title": "EIDBI and Children's Services",
  "eyebrow": "Program node",
  "does": "Services for children with autism and related conditions and their families.",
  "brief_extra": "This program area works with families at a point that is often their first sustained contact with the disability service system -- which makes how that first contact goes unusually consequential for everything after it.",
  "entries": [
   ("Family language and cultural context in diagnosis and planning",
    "A diagnosis and a plan are both built from what a family can communicate and what a clinician can understand of the family's own frame for their child's needs. This usually belongs under <strong>step 3 (engagement)</strong> and scan <strong>question 2</strong> -- explicit to the family's language and cultural context, not assumed."),
   ("Provider availability by community",
    "EIDBI providers, like most specialized services, are not evenly distributed, and a family's community can determine how far they travel or how long they wait. This usually surfaces in <strong>step 2 (data)</strong>."),
   ("Trust with families who have experienced the system badly",
    "A family that has already had a difficult experience with a public system does not arrive neutral, and rebuilding that trust is real work, not a formality before the actual work begins. This usually belongs under <strong>step 3 (engagement)</strong>, and it is one of the clearest places where the intersectionality section further down this page applies directly."),
  ],
  "partners": [
   ("Families", "The primary participants in diagnosis and planning."),
   ("MnCHOICES assessment and access", "Where EIDBI eligibility and planning connect to the wider assessment system."),
  ],
  "neighbours": ["MnCHOICES assessment and access", "Training, communication, and strategic communications"],
  "gap_extra": "which specific communities your caseload draws from, or what has already been tried to rebuild trust where it has broken down",
 },

 {
  "id": "tbi-guardianship",
  "slug": "TBIGuardianship",
  "title": "Brain Injury, Guardianship, and Related Programs",
  "eyebrow": "Program node",
  "does": "Programs for people with brain injury and work related to guardianship and supported decision-making.",
  "brief_extra": "This program area sits at a genuinely high-stakes decision point: whether a person retains their own decision-making authority, or whether someone else is given it instead.",
  "entries": [
   ("Supported decision-making before guardianship",
    "Guardianship removes a person's legal authority over their own decisions; supported decision-making does not. Whether the less restrictive option was genuinely tried first, and not just mentioned before guardianship proceeded anyway, is usually a <strong>step 1 (desired results)</strong> and <strong>step 4 (benefits, burdens)</strong> question."),
   ("Accessible communication about rights",
    "A person cannot exercise a right they were never told about in a way they could understand. This usually belongs under <strong>step 6 (accountability, evaluation, and communication)</strong>, and it is a plain-language question in the most literal sense."),
   ("Who is presumed capable",
    "The presumption a system starts with -- capable until shown otherwise, or the reverse -- shapes everything that follows, and that presumption is not always applied evenly. This usually surfaces in <strong>step 2 (data)</strong>, disaggregated by disability type, and in <strong>step 4</strong> as a direct equity question."),
  ],
  "partners": [
   ("Disability Services Division", "Administers programs for people with brain injury."),
   ("Courts", "Hold formal guardianship decisions, outside DHS."),
  ],
  "neighbours": ["Home and community-based services policy and waivers", "MnCHOICES assessment and access", "Positive supports and person-centered practice", "Employment and day services"],
  "gap_extra": "how supported decision-making is currently documented before a guardianship recommendation, or who makes that recommendation",
 },

 {
  "id": "contracts-fiscal",
  "slug": "ContractsFiscal",
  "title": "Contracts, Grants, Fiscal, and Capacity Work",
  "eyebrow": "Program node",
  "does": "Contracting, grants, rates, and capacity building for the division's providers and partners.",
  "brief_extra": "This program area decides who gets the resources to do the Division's work at all -- which makes it one of the places an equity analysis has the most leverage before a single service is ever delivered.",
  "entries": [
   ("Who wins awards and who never applies",
    "A fair scoring process still produces an uneven result if the applicant pool itself is uneven -- and the people who never apply are invisible to a process that only reviews the applications it receives. This usually belongs under <strong>step 2 (data)</strong> and <strong>step 3 (engagement)</strong> together: who applied, and who was never reached to ask why not."),
   ("Requirements in solicitations",
    "A requirement that is neutral on its face -- years of experience, a minimum organizational size, a particular certification -- can still exclude smaller or newer organizations more likely to be rooted in the communities being served. This usually surfaces in <strong>step 4 (benefits, burdens)</strong>."),
   ("Reporting that shows who is served",
    "A grant or contract report that counts people served without breaking that count down by group cannot show whether the award is reaching everyone it was meant to. This usually belongs under <strong>step 6 (accountability, evaluation, and communication)</strong>."),
  ],
  "partners": [
   ("DSD grants staff", "Runs the Division's competitive grant process."),
   ("DHS procurement and grants", "The department-level contracting function."),
  ],
  "neighbours": ["Home and community-based services policy and waivers", "Olmstead and community integration", "Data, quality, and evaluation", "Division leadership, legislative work, and strategy"],
  "gap_extra": "the current applicant pool for a specific solicitation, or what outreach has already happened before a solicitation is posted",
 },

 {
  "id": "data-quality",
  "slug": "DataQuality",
  "title": "Data, Quality, and Evaluation",
  "eyebrow": "Program node",
  "does": "Division data, quality assurance, and evaluation of services and outcomes.",
  "brief_extra": "This is the program area most others quietly depend on: step 2 of a full analysis and scan question 3 both ask what the data shows, and the answer usually has to come from here, or through here.",
  "entries": [
   ("Disaggregation with small-group protection",
    "Splitting numbers by group is what step 2 and scan question 3 both ask for &mdash; and once a group is small enough, showing the real count can identify the very people the analysis is trying to protect. Usually worked out here, before a number reaches another program's analysis."),
   ("Systems built for billing rather than equity analysis",
    "Most DHS data systems were built to pay claims, not to answer whether a service reaches people evenly. Usually surfaces in <strong>step 2</strong> as a named gap, and in <strong>step 8 (sustainability)</strong> as a case for building the capacity."),
   ("Qualitative evidence alongside numbers",
    "A count can show that something happened without showing why, or to whom it mattered most. Usually a <strong>step 3</strong> and <strong>step 5</strong> question as much as a data one."),
  ],
  "org_note": "<strong>Easy to miss:</strong> this program area is usually where another program's own step 2 actually gets answered. If a colleague in waiver policy, MnCHOICES, or employment services cannot get a decision split the way an analysis needs it, this is usually where that conversation starts &mdash; a normal handoff this work exists to receive.",
  "partners": [
   ("Finance, appeals, and data requests", "Financial Operations, the Appeals Division, and DHS's data-request contact."),
   ("Technology and infrastructure", "MNIT supplies the information infrastructure most of this work runs on."),
   ("Legislation, budgets, and evidence", "Legislative Relations and program policy staff, when session materials need evidence this program area holds."),
  ],
  "neighbours": ["Home and community-based services policy and waivers", "Contracts, grants, fiscal, and capacity work"],
  "gap_extra": "which systems your team actually pulls from day to day, or who currently fields a data request like these",
 },

 {
  "id": "communications-training",
  "slug": "Communications",
  "title": "Training, Communication, and Strategic Communications",
  "eyebrow": "Program node",
  "does": "Division learning, internal and external communication, and plain-language practice.",
  "brief_extra": "This program area sets the standard the rest of the Division's written and spoken material is measured against -- including, in its way, the standard this toolkit itself is trying to meet.",
  "entries": [
   ("Plain language and accessible documents by default",
    "A document written in plain language for one audience and left dense for another is a decision, even when nobody intended it as one. This usually belongs under <strong>step 6 (accountability, evaluation, and communication)</strong> in every other program's analysis -- and it is this program area's own first responsibility."),
   ("Language access in every channel",
    "A translation available on request is not the same as language access built into the channel from the start; the difference shows up in who actually gets reached. This usually surfaces under scan <strong>question 6</strong> -- how results are communicated back, and to whom."),
   ("Learning that is voluntary and private",
    "Training that is technically optional can still feel compulsory if declining it is visible to a supervisor, and training that touches personal reflection needs real privacy to be honest. This usually belongs under <strong>step 4 (benefits, burdens)</strong> -- from the learner's side, not only the program's."),
  ],
  "partners": [
   ("Office of Employee Culture", "Handles Division learning and development."),
   ("Communications", "Supports public and internal information."),
   ("Language-access support", "Produces translated program documents."),
  ],
  "neighbours": ["MnCHOICES assessment and access", "Support planning and case management", "Early Intensive Developmental and Behavioral Intervention and children's services"],
  "gap_extra": "which channels your unit's audience actually uses, or what has already been tried and did not work",
 },

 {
  "id": "leadership-strategy",
  "slug": "Leadership",
  "title": "Division Leadership, Legislative Work, and Strategy",
  "eyebrow": "Program node",
  "does": "Division direction, legislative coordination, and the DSD equity implementation plan.",
  "brief_extra": "This program area holds the decisions that make every other node's equity work either sustained or not: whose job it is, whether it is funded, and whether staff ever hear what changed because of it.",
  "entries": [
   ("Decision rights and bottlenecks",
    "An equity analysis can identify exactly the right change and still go nowhere if no one holds clear authority to act on it. This usually belongs under <strong>step 1 (desired results)</strong> -- naming who has decision authority is one of its explicit questions -- and under <strong>step 7 (alignment)</strong>."),
   ("Funded and staffed equity commitments",
    "A commitment without a budget line or a named person behind it tends to compete with everything else that does have both. This usually surfaces under <strong>step 8 (sustainability)</strong> directly."),
   ("Reporting back to staff on what changed",
    "Staff who raise a concern or take part in an analysis and never hear what happened to it learn, reasonably, that raising concerns does not lead anywhere. This is <strong>step 6 (accountability, evaluation, and communication)</strong>, aimed inward rather than only at the public."),
  ],
  "partners": [
   ("Office of Employee Culture", "Shares responsibility for staff culture and inclusion."),
   ("Equity and Inclusion", "The department-level equity function this Program works alongside."),
   ("Office of Strategy and Performance", "Holds the department's strategic plan."),
  ],
  "neighbours": ["Olmstead and community integration", "Contracts, grants, fiscal, and capacity work"],
  "gap_extra": "where a specific decision actually gets made once it leaves this page, or who currently owns following up",
 },

]
