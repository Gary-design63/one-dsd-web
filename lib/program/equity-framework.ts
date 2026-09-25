/**
 * Equity Strategic Framework: the operational spine of the One DHS and One DSD
 * People, Access and Culture. Adapted from the owner's concept map and
 * resource suite. All timelines, years and cadences are intentionally left open;
 * agreed review points replace fixed dates. Program-facing copy only.
 */

export type FrameworkLink = { label: string; href: string };

export type CycleStage = {
  stage: string;
  question: string;
  programStep: string;
  oneDhs: FrameworkLink[];
  oneDsd: FrameworkLink[];
};

export type Pillar = {
  id: string;
  title: string;
  purpose: string;
  objectives: string[];
  initiatives: string[];
  measures: string[];
  programFunctions: string[];
  workAreas: FrameworkLink[];
  oneDhs: FrameworkLink[];
  oneDsd: FrameworkLink[];
};

export type ToolStatus = "in_program" | "partly_in_program" | "not_yet";

export type CoreTool = {
  name: string;
  users: string;
  does: string;
  format: string;
  status: ToolStatus;
  where: FrameworkLink[];
  note: string;
};

export const TOOL_STATUS_LABEL: Record<ToolStatus, string> = {
  in_program: "In the program now",
  partly_in_program: "Partly in the program",
  not_yet: "Not in the program yet",
};

export const EQUITY_FRAMEWORK = {
  version: "2026-09-11.1",
  title: "Equity Strategic Framework",
  kicker: "People, Access and Culture · Operational spine",
  lede:
    "The framework that every part of the One DHS and One DSD People, Access and Culture is mapped to: six pillars, one improvement cycle, shared measures and a practical tool suite. Timelines are left open on purpose; the work moves at agreed review points.",
  summary:
    "The Equity Strategic Framework makes equity, access and belonging a sustained part of leadership practice, workforce systems, service delivery, community relationships and decision-making. It moves the organization from isolated activities toward coordinated, measurable and accountable equity work.¹ In this program it is the operational spine: each page, tool, meeting pattern and record connects to a pillar and to a stage of the improvement cycle.",
  howToRead: [
    "There are no years, phases by date or fixed cadences on this page. Stages are entered when readiness conditions are met, and review points are agreed with the people involved.",
    "Measures describe program practice and organizational patterns. Nothing on this page measures an individual employee, and the program holds no personnel records.",
    "Participation in the program is voluntary. Published DHS policy requirements are separate from choosing this program as support.",
  ],

  cycle: [
    {
      stage: "Assess",
      question: "What is the real question, barrier or work need?",
      programStep: "Identify a real question, barrier or work need.",
      oneDhs: [
        { label: "Ask a question", href: "/ask" },
        { label: "Areas of work", href: "/areas" },
        { label: "Understanding DHS", href: "/understanding-dhs" },
      ],
      oneDsd: [
        { label: "One DSD home", href: "/one-dsd" },
        { label: "Bring it to Open Hours through the One DSD Team", href: "/one-dsd/team" },
      ],
    },
    {
      stage: "Plan",
      question: "Who is affected, what does the evidence say, and which options change the barrier?",
      programStep: "Find relevant evidence, organizational context and resources.",
      oneDhs: [
        { label: "Equity Analysis Toolkit companion", href: "/learn/equity-toolkit" },
        { label: "Minnesota Communities", href: "/minnesota-communities" },
        { label: "Library", href: "/library" },
      ],
      oneDsd: [
        { label: "One DSD scenarios and programs", href: "/one-dsd" },
        { label: "One DSD Team work", href: "/one-dsd/team/workspace" },
      ],
    },
    {
      stage: "Implement",
      question: "What will change in the actual work, and who has agreed to carry it?",
      programStep: "Produce or improve a useful answer, plan, learning experience or support action.",
      oneDhs: [
        { label: "Guided equity analysis walkthrough", href: "/equity-policy/analysis" },
        { label: "Practice", href: "/practice" },
        { label: "Request a consultation", href: "/support/request" },
      ],
      oneDsd: [
        { label: "Amplify Equity", href: "/one-dsd/amplify" },
        { label: "Learning Lab", href: "/one-dsd/team/learning-lab" },
      ],
    },
    {
      stage: "Measure",
      question: "What was delivered, what was applied, and what changed?",
      programStep: "Apply it in the work through the responsible person.",
      oneDhs: [
        { label: "Equity Policy dashboard", href: "/equity-policy" },
        { label: "Plan how to learn from results", href: "/practice/measurement" },
      ],
      oneDsd: [
        { label: "Register and follow-ups", href: "/equity-policy/register" },
      ],
    },
    {
      stage: "Learn",
      question: "What do the numbers and people’s accounts say together?",
      programStep: "Review what happened and retain, revise, connect, support or stop the work.",
      oneDhs: [
        { label: "Learning and resources", href: "/learn" },
        { label: "Courses", href: "/courses" },
      ],
      oneDsd: [
        { label: "One DSD Team general meeting materials", href: "/one-dsd/team" },
        { label: "Leadership development", href: "/one-dsd/leadership" },
      ],
    },
    {
      stage: "Improve",
      question: "What is retained, revised, connected, supported or stopped, and who hears about it?",
      programStep: "Carry useful knowledge and decisions into the next comparable task.",
      oneDhs: [
        { label: "Change history on the register", href: "/equity-policy/register" },
        { label: "Operationalizing equity", href: "/operationalizing-equity" },
      ],
      oneDsd: [
        { label: "Amplify Equity ideas", href: "/one-dsd/amplify/ideas" },
        { label: "Employee resource groups", href: "/employee-resource-groups" },
      ],
    },
  ] satisfies CycleStage[],

  vision:
    "An organization where equity, access and belonging are foundational to every interaction, decision, policy, program and service; where employees, people receiving services, families, partners and communities experience dignity, meaningful participation and equitable opportunity.",
  mission:
    "Drive organizational change by integrating equity into leadership, governance, workforce practices, service design, data use, communication, community engagement and accountability systems.",
  focus:
    "The organization actively identifies and reduces disparities based on race, ethnicity, disability, language, culture, geography, gender identity and expression, sexual orientation, age, veteran status, socioeconomic status and intersecting identities. It uses data, lived experience, community partnership and equity analysis to prevent harm, remove barriers and improve outcomes.",

  values: [
    { value: "Representation", meaning: "Value and seek differences in identities, backgrounds, perspectives, experiences and ways of knowing.", practice: "Recruit broadly, widen advisory groups, engage communities not historically represented in decisions and recognize intersecting identities." },
    { value: "Equity", meaning: "Identify and address systemic barriers so people have what they need to participate, succeed and experience fair outcomes.", practice: "Disaggregate data, run equity analyses, remove unnecessary requirements and allocate resources according to need." },
    { value: "Participation and belonging", meaning: "Create conditions in which people are respected, heard, valued and able to influence decisions affecting them.", practice: "Use accessible participation methods, strengthen psychological safety, respond to feedback and include staff and community members early." },
    { value: "Access", meaning: "Ensure environments, information, technology, communications, programs and services are usable by people with disabilities and diverse access needs.", practice: "Build accessibility into digital tools, documents, meetings, hiring, training, procurement and service design from the outset." },
    { value: "Accountability", meaning: "Hold leaders, teams and systems responsible for commitments, actions, outcomes and transparent reporting.", practice: "Set measurable goals, assign owners, track progress at agreed review points, publish results and course-correct when outcomes are not improving." },
    { value: "Collaboration", meaning: "Sustainable change requires shared ownership across units, communities, leaders, employees and partners.", practice: "Build cross-functional teams, compensate community expertise where appropriate, use advisory structures and coordinate through one activity inventory." },
    { value: "Cultural humility", meaning: "Commit to ongoing learning, self-reflection and recognition that communities are experts in their own lived experience.", practice: "Avoid assumptions, seek feedback, adapt practices and build reciprocal rather than extractive community relationships." },
    { value: "Anti-racism and anti-ableism", meaning: "Address the institutional patterns, policies, norms and practices that create unequal access, opportunity, treatment and outcomes.", practice: "Examine systems rather than assigning blame to individuals; redesign policies and practices that reproduce disparities." },
  ],

  pillars: [
    {
      id: "leadership",
      title: "Leadership and governance",
      purpose: "Establish visible leadership commitment, clear decision rights and infrastructure for coordinated equity implementation.",
      objectives: [
        "Create an organization-wide equity governance structure with executive sponsorship and cross-functional representation.",
        "Define roles, responsibilities, decision-making authority and escalation processes.",
        "Ensure leaders demonstrate equity competency and are accountable for equity-related outcomes.",
        "Integrate equity considerations into strategic planning, budgeting, policy development, procurement and risk management.",
      ],
      initiatives: [
        "Establish or strengthen an Equity Committee, a steering group and unit-level equity teams.",
        "Create an Equity Activity Inventory to document ongoing equity work, prevent duplication, identify gaps and coordinate across departments.",
        "Require an equity impact review for significant policies, programs, contracts, budget decisions and organizational changes.",
        "Include equity goals and expectations in executive and manager performance plans, where the responsible offices adopt them.",
        "Maintain a leadership view of progress, barriers, risks and decisions requiring executive action.",
        "Keep a governance calendar for planning, reporting, review and accountability, with dates set by the people involved.",
      ],
      measures: [
        "Share of strategic initiatives reviewed through an equity analysis process.",
        "Share of leaders with equity objectives in performance plans.",
        "Number of unit-level equity action plans completed and actively monitored.",
        "Equity Committee decisions and follow-up actions recorded.",
        "Share of identified barriers escalated and resolved by the agreed review point.",
      ],
      programFunctions: ["program_coordination", "organizational_knowledge", "equity_analysis"],
      workAreas: [{ label: "Leadership and systems change", href: "/areas/work/leadership_systems_change" }],
      oneDhs: [
        { label: "Understanding DHS", href: "/understanding-dhs" },
        { label: "DHS equity policy and guided analysis", href: "/equity-policy" },
        { label: "About the program", href: "/about" },
      ],
      oneDsd: [
        { label: "One DSD Team, the standing volunteer equity committee", href: "/one-dsd/team" },
        { label: "Leadership development", href: "/one-dsd/leadership" },
      ],
    },
    {
      id: "workforce",
      title: "Workforce equity",
      purpose: "Build, retain, develop and advance a workforce that better reflects the communities served and provides equitable access to employment opportunity.",
      objectives: [
        "Reduce barriers in recruitment, hiring, onboarding, advancement, retention and leadership development.",
        "Improve representation of historically marginalized communities, including people with disabilities, communities of color and multilingual communities.",
        "Strengthen equitable career pathways, mentorship, sponsorship and succession planning.",
        "Improve retention and reduce disparities in promotion, turnover and engagement.",
      ],
      initiatives: [
        "Audit job descriptions for unnecessary degree requirements, inaccessible language, biased criteria and barriers to nontraditional candidates.",
        "Make job postings, application systems, interviews and onboarding materials accessible.",
        "Prepare hiring managers and interview panels in structured interviewing, bias mitigation, disability inclusion and equitable selection.",
        "Use diverse, prepared interview panels whenever feasible.",
        "Develop transparent advancement pathways and competency-based career ladders.",
        "Offer mentorship and sponsorship for employees from historically marginalized groups and emerging leaders.",
        "Strengthen employee resource groups, affinity spaces and engagement structures.",
        "Analyze recruitment, hiring, promotion, retention, evaluation, compensation and exit data for disparities at the group level.",
      ],
      measures: [
        "Representation by job class, leadership level, division and demographic group.",
        "Applicant-to-interview, interview-to-offer and offer-to-hire rates by demographic group.",
        "Retention and turnover rates by demographic group over an agreed period.",
        "Promotion and leadership-development participation rates by demographic group.",
        "Share of job descriptions and hiring processes reviewed for accessibility and equity.",
      ],
      programFunctions: ["workforce_context", "learning", "staff_engagement"],
      workAreas: [{ label: "Workforce equity", href: "/areas/work/workforce_equity" }],
      oneDhs: [
        { label: "Learning for work", href: "/my-work/explore" },
        { label: "Employee resource groups", href: "/employee-resource-groups" },
      ],
      oneDsd: [
        { label: "Amplify Equity mentoring", href: "/one-dsd/amplify/mentoring" },
        { label: "Amplify Equity co-leads", href: "/one-dsd/amplify/co-leads" },
        { label: "Leadership development", href: "/one-dsd/leadership" },
      ],
    },
    {
      id: "culture",
      title: "Workplace culture and belonging",
      purpose: "Create a psychologically safe, respectful, culturally responsive workplace where employees can contribute fully and experience belonging.",
      objectives: [
        "Strengthen interpersonal, intercultural and disability-inclusion competencies across the workforce.",
        "Address microaggressions, harassment, bias, exclusion and inequitable workplace norms.",
        "Build trust through consistent communication, responsive leadership and meaningful employee voice.",
        "Make equity learning practical, role-specific and connected to daily work.",
      ],
      initiatives: [
        "Use a tiered learning strategy: foundational learning for all staff, applied learning for supervisors and teams, advanced learning for leaders and practitioners.",
        "Deliver an intercultural learning pathway covering disability history, culture, identity, bias, power, communication across differences and belonging.",
        "Use developmental assessment and coaching, where appropriate, to support intercultural competence.",
        "Develop practical scenarios, job aids, discussion guides and team-based learning tied to real situations.",
        "Run a recurring culture and inclusion survey, supplemented by listening sessions and focus groups, with timing set by the people involved.",
        "Establish clear response protocols for concerns involving bias, exclusion, discrimination and accessibility barriers.",
        "Integrate inclusive practices into onboarding, meetings, recognition, supervision and team norms.",
      ],
      measures: [
        "Learning completion, knowledge gain, confidence and application, reported in aggregate.",
        "Climate indicators for belonging, psychological safety, trust, fairness, accessibility and voice.",
        "Participation in employee resource groups, listening sessions and culture-building activities.",
        "Trends in reported concerns and the timeliness and quality of organizational responses.",
        "Movement in inclusion and belonging results across demographic groups.",
      ],
      programFunctions: ["learning", "staff_engagement", "guided_practice"],
      workAreas: [{ label: "Culture, trust, and repair", href: "/areas/work/culture_trust_repair" }],
      oneDhs: [
        { label: "Intercultural learning pathway", href: "/learn/intercultural" },
        { label: "Courses", href: "/courses" },
        { label: "Culture survey results on the Equity Policy dashboard", href: "/equity-policy" },
      ],
      oneDsd: [
        { label: "Amplify Equity gatherings", href: "/one-dsd/amplify/gatherings" },
        { label: "Amplify Equity well-being", href: "/one-dsd/amplify/well-being" },
        { label: "One DSD scenarios", href: "/one-dsd#scenarios" },
      ],
    },
    {
      id: "access",
      title: "Accessibility and service delivery",
      purpose: "Ensure policies, programs, communications, technologies and services are accessible, culturally responsive, equitable and designed with, not merely for, the people served.",
      objectives: [
        "Identify and eliminate accessibility barriers in physical spaces, digital systems, communications, processes and services.",
        "Improve equitable access, experience and outcomes for people receiving services and their families.",
        "Use disaggregated data to identify service disparities by race, disability, language, geography, age and other relevant factors.",
        "Integrate accessibility and equity requirements into program design, contracts, technology and continuous improvement.",
      ],
      initiatives: [
        "Conduct accessibility and equity audits of websites, forms, public materials, virtual meetings, training platforms, facilities and service processes.",
        "Implement plain-language, multilingual and alternative-format communication standards.",
        "Establish translation, interpretation, captioning and accommodation workflows that are timely, funded and easy to use.",
        "Maintain a service-disparity view that identifies patterns in access, timeliness, quality, outcomes, complaints and satisfaction.",
        "Create an early-warning process that flags emerging inequities or declines in service access and outcomes.",
        "Apply equity analysis to program changes, eligibility rules, policy revisions and budget decisions.",
        "Include equity and accessibility expectations in contracts, procurement templates, vendor evaluations and technology requirements.",
      ],
      measures: [
        "Share of public-facing materials meeting accessibility and plain-language standards.",
        "Timeliness and use of accommodations, translation and interpretation services.",
        "Service access, timeliness, quality and satisfaction data disaggregated by demographic group.",
        "Number and type of accessibility barriers identified, resolved or awaiting remediation.",
        "Reduction in disparities across priority service outcomes.",
      ],
      programFunctions: ["equity_analysis", "content_stewardship", "community_context"],
      workAreas: [
        { label: "Accessibility and language access", href: "/areas/work/accessibility_language_access" },
        { label: "Policy, program, and service design", href: "/areas/work/policy_program_service_design" },
      ],
      oneDhs: [
        { label: "Guided equity analysis walkthrough", href: "/equity-policy/analysis" },
        { label: "Practice tools and checklists", href: "/practice" },
        { label: "Library", href: "/library" },
      ],
      oneDsd: [
        { label: "One DSD programs", href: "/one-dsd#programs" },
        { label: "DSD consultation route", href: "/support" },
      ],
    },
    {
      id: "community",
      title: "Community partnerships",
      purpose: "Build sustained, reciprocal and accountable partnerships with the communities most affected by organizational decisions and services.",
      objectives: [
        "Move from one-time consultation to ongoing co-design, shared learning and community accountability.",
        "Improve trust, relevance, access and responsiveness through culturally grounded engagement.",
        "Compensate community members appropriately for expertise, time and participation when feasible.",
        "Strengthen relationships with Tribal Nations, culturally specific organizations, disability communities, advocacy groups and other partners.",
      ],
      initiatives: [
        "Establish a Community Advisory Board or strengthen existing advisory structures with diverse representation.",
        "Adopt a community-engagement standard that defines when, how and why community input is required.",
        "Create a stipend and compensation process for community reviewers, advisors, presenters and co-design partners.",
        "Develop cultural community profiles with paid community review.",
        "Formalize Tribal consultation processes and make sure staff complete appropriate consultation training.",
        "Fund translation and interpretation in engagement planning.",
        "Close the feedback loop: what was heard, what was decided, what changed and why.",
      ],
      measures: [
        "Number and range of community partnerships and advisory participants.",
        "Share of significant initiatives that included community input before final decisions.",
        "Share of community contributors compensated for their time and expertise.",
        "Community satisfaction, trust and perception-of-influence measures.",
        "Number of recommendations adopted, adapted or formally responded to by leadership.",
      ],
      programFunctions: ["community_context", "ask"],
      workAreas: [{ label: "Community engagement and co-design", href: "/areas/work/community_engagement_co_design" }],
      oneDhs: [
        { label: "Minnesota Communities", href: "/minnesota-communities" },
        { label: "Community connections", href: "/learn/community-connections" },
      ],
      oneDsd: [
        { label: "Amplify Equity materials", href: "/one-dsd/amplify/materials" },
        { label: "One DSD relationships", href: "/one-dsd#people" },
      ],
    },
    {
      id: "accountability",
      title: "Accountability and improvement",
      purpose: "Ensure equity commitments produce measurable results, not only activities, and that the organization learns, adjusts and reports progress honestly.",
      objectives: [
        "Establish a measurement framework with baseline data, targets, owners, agreed review points and corrective-action processes.",
        "Distinguish implementation activity from meaningful outcomes.",
        "Report progress transparently to employees, leaders, partners and communities.",
        "Use data and lived experience to continuously improve strategy and resource allocation.",
      ],
      initiatives: [
        "Keep a strategic plan scorecard with leading, intermediate and outcome indicators.",
        "Prepare progress reports for leadership, staff and governance bodies at agreed review points.",
        "Publish a public accountability report summarizing accomplishments, gaps, disparity trends, lessons learned and next priorities.",
        "Review the plan at agreed points and update priorities from data, community feedback, organizational conditions and emerging needs.",
        "Require corrective-action plans when targets are not met or disparities worsen.",
        "Integrate equity results into organizational planning, where the responsible offices adopt them.",
        "Maintain a data-governance approach that protects privacy while enabling meaningful disaggregation.",
      ],
      measures: [
        "Share of milestones completed as agreed.",
        "Number of corrective actions initiated and completed.",
        "Availability and use of disaggregated equity data in decision-making.",
        "Progress toward workforce, accessibility, service-outcome and community-engagement targets.",
        "Publication of progress and public accountability reports.",
      ],
      programFunctions: ["evaluation", "resources", "program_coordination"],
      workAreas: [{ label: "Data, research, quality, and measurement", href: "/areas/work/data_research_quality_measurement" }],
      oneDhs: [
        { label: "Equity Policy dashboard", href: "/equity-policy" },
        { label: "Register, follow-ups and change history", href: "/equity-policy/register" },
        { label: "Plan how to learn from results", href: "/practice/measurement" },
      ],
      oneDsd: [
        { label: "One DSD Team work", href: "/one-dsd/team/workspace" },
      ],
    },
  ] satisfies Pillar[],

  indicatorTypes: [
    { type: "Leading indicators", purpose: "Show whether the organization is carrying out the work needed to create change.", examples: "Learning completion, accessibility audits completed, job descriptions reviewed, equity analyses conducted, advisory meetings held." },
    { type: "Intermediate indicators", purpose: "Show whether systems and behaviors are changing.", examples: "Improved manager confidence, greater use of accessible formats, increased employee voice, higher community participation, more equitable hiring processes." },
    { type: "Lagging indicators", purpose: "Show whether outcomes and disparities are improving.", examples: "Reduced retention gaps, improved belonging results, increased workforce representation, fewer service-access disparities, improved community satisfaction." },
  ],

  stages: [
    {
      title: "Foundations",
      aim: "Build the infrastructure, baseline understanding, governance and shared capacity needed for sustainable implementation.",
      enterWhen: "Begin here. There is no calendar; the stage is complete when the readiness conditions below are met.",
      workstreams: [
        { title: "Core infrastructure", items: ["Executive sponsorship, an Equity Committee and unit-level equity teams.", "Governance roles, decision rights and accountability expectations, with meeting patterns set by the people involved.", "An Equity Activity Inventory that maps current initiatives, removes duplication and identifies gaps.", "A charter, communication plan and shared definitions for equity, access, belonging, anti-racism and cultural humility."] },
        { title: "Baseline reviews", items: ["Workforce demographics, hiring, retention, promotion, climate, service access, accessibility, communication, procurement and community engagement.", "Priority disparities and a manageable set of initial goals.", "Accessibility audits of digital materials, public communications, meetings, forms and service pathways.", "Existing policies, procedures, contracts, job descriptions and performance systems reviewed through an equity lens."] },
        { title: "Foundational learning", items: ["Equity, disability-inclusion, accessibility, cultural humility and bias-awareness learning for all staff.", "A role-specific pathway for supervisors, hiring managers, program leaders and customer-facing staff.", "Facilitators and internal champions prepared to support application in teams.", "Intercultural development assessment and coaching where appropriate."] },
        { title: "Data systems", items: ["Available data sources and data-quality gaps identified.", "Core equity measures defined and baseline reports produced.", "Privacy, governance and disaggregation standards.", "An initial equity dashboard and disparity-monitoring process."] },
        { title: "Communication", items: ["The framework introduced internally and externally.", "Regular leadership messages, staff updates and community communications.", "A feedback process for employees, people receiving services, families and partners.", "An initial state-of-equity baseline summary."] },
      ],
      readiness: ["Approved governance structure and charter.", "Organization-wide Equity Activity Inventory.", "Baseline equity and accessibility assessment.", "Foundational learning available.", "Initial dashboard and core measures framework.", "Communication and engagement plan in operation.", "Unit-level action plans for priority areas."],
    },
    {
      title: "Integration",
      aim: "Integrate equity into core business systems, deepen capability and expand partnership and accountability structures.",
      enterWhen: "Enter when the Foundations readiness conditions are met and the responsible offices agree.",
      workstreams: [
        { title: "Performance management", items: ["Equity responsibilities and measurable objectives in leader and manager performance plans, where adopted.", "Inclusive leadership behaviors in feedback, coaching, promotion and succession.", "Managers review workforce, climate and service-equity data as part of business planning.", "Corrective-action procedures for missed goals or worsening disparities."] },
        { title: "Mentorship and leadership development", items: ["Mentorship and sponsorship for emerging leaders and employees from historically marginalized groups.", "Transparent leadership-development pathways.", "Cohort-based development for supervisors and managers.", "Leader capability in conflict navigation, inclusive decision-making, accessibility, community engagement and equity-focused change."] },
        { title: "Applied and advanced learning", items: ["Structural racism, disability justice, trauma-informed practice, language access, inclusive supervision, culturally responsive service and equitable procurement.", "Simulations, case studies, team action-learning and coaching rather than awareness sessions alone.", "Skill application and changes in team practice evaluated over time."] },
        { title: "Data systems", items: ["The dashboard expanded to workforce, accessibility, service, community-engagement and climate measures.", "Disaggregated reporting by relevant demographic and geographic factors.", "An early-warning process for emerging service disparities, inequitable access or declining inclusion indicators.", "Leaders and teams prepared to interpret and act on equity data."] },
        { title: "Community partnerships", items: ["A Community Advisory Board established or strengthened.", "Compensation and stipend practices for community expertise.", "Formal Tribal consultation and culturally specific engagement protocols.", "Community profiles and resource guides developed with priority communities.", "Feedback loops that visibly show how community input influences decisions."] },
        { title: "Business processes", items: ["Equity and accessibility checkpoints in procurement, contracting, policy development, communications, technology acquisition, planning and budgeting.", "Contract and job-description equity checklists.", "Translation, interpretation and accessibility workflows across functions."] },
      ],
      readiness: ["Performance-management expectations in place where adopted.", "Mentorship and leadership-development programs running.", "Applied learning curriculum available.", "Expanded dashboard and early-warning process.", "Community Advisory Board and compensation process established.", "Equity and accessibility requirements embedded in core workflows."],
    },
    {
      title: "Sustainment",
      aim: "Institutionalize equity as a durable organizational capability, demonstrate measurable outcomes and prepare the next framework.",
      enterWhen: "Enter when the Integration readiness conditions are met and the responsible offices agree.",
      workstreams: [
        { title: "Culture", items: ["Equity, accessibility and inclusive leadership as standard elements of policy, planning, supervision, onboarding, evaluation, recognition and improvement.", "Every division maintains a current equity action plan aligned with enterprise priorities.", "Peer learning, communities of practice and internal champions.", "Proactive culture-building alongside responsive accountability processes."] },
        { title: "Sustainability framework", items: ["Permanent staffing, governance, budget, data, learning and technology needs clarified.", "Planning, reporting and review cycles defined by the people involved.", "Equity responsibilities in position descriptions, leadership expectations and procedures.", "Succession plans so progress does not depend on one leader, consultant, committee or funding source.", "The resource library, activity inventory and tool suite maintained."] },
        { title: "Community impact", items: ["Evaluate whether engagement has influenced service design, policy, resources and outcomes.", "Expand co-design with people receiving services, families, cultural communities, Tribal Nations, advocacy organizations and disability communities.", "Use service-outcome data and community feedback to prioritize disparity reduction.", "Publish accessible community-facing progress reports."] },
        { title: "Recognition", items: ["Recognition for teams and leaders who show measurable, sustainable impact.", "Recognition for innovation, collaboration, accessibility improvements, partnership and disparity reduction.", "Recognition that reflects collective contribution and does not place undue labor or visibility on employees from marginalized groups."] },
        { title: "The next framework", items: ["A formal review of implementation, outcomes, lessons, unmet needs and emerging priorities.", "Refreshed baselines and new targets.", "Employees, communities, partners and leadership engaged in setting the next agenda.", "Policies, systems and investments needed to sustain progress identified."] },
      ],
      readiness: ["Equity embedded in planning and performance systems.", "Sustainable governance, staffing, data and budget framework.", "Documented improvement in priority workforce, culture, accessibility, service and partnership measures.", "Public accountability report published.", "Next framework agreed."],
    },
  ],

  outcomes: [
    { title: "Workforce equity", items: ["More representative applicant pools, hiring outcomes, leadership pipelines and workforce composition.", "Reduced disparities in hiring, promotion, retention, evaluation and development.", "More accessible and equitable hiring, onboarding and advancement systems."] },
    { title: "Engagement and belonging", items: ["Higher employee-reported inclusion, trust, psychological safety, fairness, voice and belonging.", "Greater confidence among managers and staff in applying equity and accessibility practices.", "Stronger retention of employees from historically marginalized communities."] },
    { title: "Accessibility and service outcomes", items: ["More accessible communications, meetings, technology, programs and service pathways.", "Improved access, timeliness, quality, satisfaction and outcomes for people receiving services.", "Reduced disparities in priority service measures across race, disability, language, culture and geography."] },
    { title: "Community trust and partnership", items: ["Consistent, meaningful engagement with the communities most affected by decisions.", "Increased community confidence that input is heard, valued and used.", "Stronger partnerships with Tribal Nations, disability communities, culturally specific organizations and advocacy groups."] },
    { title: "Organizational performance", items: ["Better decisions through equity data, equity analysis and lived experience.", "Resources directed toward barriers and disparities.", "Reduced risk of inaccessible, inequitable or harmful policies and practices.", "Increased innovation, collaboration, service relevance and credibility."] },
    { title: "Sustained change", items: ["Equity is not a separate project, a one-time training or the responsibility of a small group.", "Leaders, managers, teams, systems and partners share responsibility for equitable outcomes.", "The organization has the governance, tools, data, skills, resources and learning culture to sustain improvement."] },
  ],

  coreTools: [
    { name: "Strategic plan scorecard", users: "Executive sponsors, Equity Committee, division leaders", does: "Tracks goals, initiatives, milestones, owners, risks, measures and progress across all six pillars.", format: "Shared list or spreadsheet with workflow fields", status: "partly_in_program", where: [{ label: "Equity Policy dashboard", href: "/equity-policy" }], note: "Tool-use and survey measures are counted; a full six-pillar scorecard is not yet built." },
    { name: "Equity Activity Inventory", users: "Equity lead, unit equity teams, Equity Committee", does: "One authoritative list of equity work; reduces duplication, identifies gaps and supports coordination.", format: "Shared database or spreadsheet", status: "partly_in_program", where: [{ label: "Register of analyses", href: "/equity-policy/register" }, { label: "One DSD Team work", href: "/one-dsd/team/workspace" }], note: "Analyses and Team work are recorded; an inventory across all initiatives is not yet built." },
    { name: "Equity Analysis Toolkit", users: "Leaders, policy staff, program managers, procurement staff", does: "Assesses possible disparate impacts and accessibility barriers before major decisions are final.", format: "Guided form with a saved record", status: "in_program", where: [{ label: "Guided walkthrough", href: "/equity-policy/analysis" }, { label: "Toolkit companion", href: "/learn/equity-toolkit" }], note: "Full analysis and equity scan, with teaching notes, a record and follow-ups." },
    { name: "Initiative implementation checklist", users: "Project leads, managers, consultants", does: "Converts equity commitments into concrete planning and implementation requirements.", format: "One-page checklist in the project charter or intake", status: "partly_in_program", where: [{ label: "Practice", href: "/practice" }], note: "Practice offers work-specific checklists; a single intake checklist is not yet built." },
    { name: "Accessibility review checklist", users: "Communications, technology, training and program teams", does: "Reviews documents, websites, meetings, digital tools, forms and service processes for barriers.", format: "Checklist, audit log and remediation tracker", status: "partly_in_program", where: [{ label: "Accessibility and language access", href: "/areas/work/accessibility_language_access" }, { label: "Library", href: "/library" }], note: "Guidance and tool cards exist; a remediation tracker is not yet built." },
    { name: "Inclusive hiring toolkit", users: "Human resources, hiring managers, interview panels", does: "Reduces barriers in job descriptions, recruitment, interviews, selection, onboarding and advancement.", format: "Hiring-manager guide, structured interview templates, job-description checklist", status: "partly_in_program", where: [{ label: "Workforce equity", href: "/areas/work/workforce_equity" }], note: "Area guidance exists; templates are not yet assembled as a kit." },
    { name: "Community engagement toolkit", users: "Program teams, community liaisons, leaders", does: "Standardizes reciprocal, accessible, culturally responsive and compensated engagement.", format: "Planning template, stipend process, advisory-board guide, feedback-loop template", status: "partly_in_program", where: [{ label: "Minnesota Communities", href: "/minnesota-communities" }, { label: "Community engagement and co-design", href: "/areas/work/community_engagement_co_design" }], note: "Community briefs and questions exist; stipend and advisory-board templates are not yet built." },
    { name: "Workforce culture survey", users: "Human resources, equity team, leadership", does: "Measures belonging, psychological safety, fairness, trust, accessibility, inclusion and voice.", format: "Confidential survey with disaggregation safeguards", status: "partly_in_program", where: [{ label: "Survey waves on the register", href: "/equity-policy/register#survey-title" }], note: "Department-wide results by wave are entered and charted; the survey itself is run outside this program." },
    { name: "Learning pathway", users: "All staff, managers, leaders, facilitators", does: "Role-based foundational, applied and advanced learning that builds usable skills.", format: "Courses, facilitator guides, job aids, scenario modules", status: "in_program", where: [{ label: "Learning and resources", href: "/learn" }, { label: "Intercultural pathway", href: "/learn/intercultural" }, { label: "Courses", href: "/courses" }], note: "" },
    { name: "Equity dashboard", users: "Leaders, Equity Committee, program managers", does: "Displays workforce, culture, accessibility, service and community data to identify patterns and disparities.", format: "Secure internal reporting page", status: "partly_in_program", where: [{ label: "Equity Policy dashboard", href: "/equity-policy" }], note: "Tool use and culture survey pages exist; workforce, service and community pages depend on data the program does not hold." },
    { name: "Progress report", users: "Executive sponsors, staff, community partners", does: "Communicates what is complete, what is delayed, what outcomes are emerging and what comes next.", format: "Standard report template and dashboard summary", status: "not_yet", where: [], note: "The register download supplies the analysis section; a report template is not yet built." },
    { name: "Public accountability report", users: "Leadership, employees, communities, governing bodies", does: "Transparent reporting on accomplishments, gaps, trends, outcomes, lessons and next priorities.", format: "Accessible document, web page, plain-language summary, community presentation", status: "not_yet", where: [], note: "" },
  ] satisfies CoreTool[],

  scorecardFields: [
    ["Strategic pillar", "Connects the work to one of the six pillars."],
    ["Strategic objective", "States the intended organizational change."],
    ["Initiative", "Names the specific project, action or intervention."],
    ["Executive sponsor", "The senior leader accountable for removing barriers and securing resources."],
    ["Initiative owner", "The person responsible for day-to-day implementation."],
    ["Partners", "Departments, community partners, employee groups or vendors involved."],
    ["Baseline", "The current condition before action begins."],
    ["Target", "The desired measurable change."],
    ["Milestones", "Concrete deliverables."],
    ["Review point", "The agreed point at which progress is examined; set with the people involved, not fixed here."],
    ["Status", "Not started, in progress, at risk, delayed, completed or sustained."],
    ["Equity impact", "Which groups may benefit, face barriers or need engagement."],
    ["Accessibility requirements", "Accommodations, language access, digital accessibility or alternative formats."],
    ["Evidence", "Links to implementation artifacts, data, feedback and decisions."],
    ["Risks and corrective actions", "Barriers, escalation needs and agreed responses."],
  ],
  scorecardExample: [
    ["Strategic pillar", "Workforce equity"],
    ["Initiative", "Accessible and equitable hiring redesign"],
    ["Objective", "Reduce barriers in job postings, application systems, interviews and candidate selection"],
    ["Executive sponsor", "Human resources director"],
    ["Owner", "Talent acquisition manager"],
    ["Baseline", "Job descriptions are not consistently reviewed for unnecessary degree requirements, accessibility or inclusive language"],
    ["Target", "All new or revised job descriptions reviewed; all hiring managers complete structured-interview and bias-mitigation preparation"],
    ["Key measures", "Applicant range, interview-to-offer conversion, hiring outcomes, candidate accessibility feedback, retention at agreed review points"],
    ["Risk", "Hiring teams experience the review as added administrative burden"],
    ["Corrective action", "Build review questions into the existing requisition workflow rather than creating a separate process"],
  ],

  inventoryFields: ["Initiative title", "Brief description and intended outcome", "Strategic pillar and organizational priority", "Business unit or division", "Initiative owner and executive sponsor", "Communities or populations affected", "Current stage: idea, planning, pilot, implementation, evaluation, sustained practice", "Agreed review point", "Equity-analysis status", "Accessibility-review status", "Community-engagement status", "Funding or resource needs", "Measures and available data", "Key documents, templates, reports or links", "Lessons learned, risks and replication opportunities"],
  inventoryRules: ["Register initiatives before launch.", "Review the inventory with unit equity teams at agreed points.", "Flag duplicate efforts and promote shared tools rather than parallel development.", "Archive completed initiatives only after documenting results, lessons and reusable resources.", "Use the inventory to find gaps, for example strong learning activity but little work on service disparities or accessible procurement."],

  charterSections: ["Purpose and scope of the governance structure", "Membership, representation, appointment terms and decision-making authority", "Roles of the executive sponsor, Equity Committee, equity lead, unit equity teams, human resources, data staff, accessibility experts and community advisors", "Meeting patterns and the work cycle, set by the members", "Decision-making process and escalation path", "Required reporting and documentation", "Expectations for accessibility and inclusive participation", "Conflict-of-interest and confidentiality expectations", "Community-engagement and compensation principles", "Charter review process"],
  governanceGroups: [
    ["Executive sponsor group", "Removes barriers, approves resources, sets expectations, receives progress reports."],
    ["Equity Committee", "Reviews strategy, data, initiatives, risks and accountability actions across the organization. In One DSD, the One DSD Team is the standing volunteer equity committee.²"],
    ["Implementation team", "Coordinates daily implementation, maintains tools, supports departments and prepares reports."],
    ["Unit equity teams", "Translate enterprise priorities into division-specific action plans and local implementation."],
    ["Community Advisory Board", "Provides lived-experience expertise, feedback, co-design input and an accountability perspective."],
    ["Data and evaluation workgroup", "Defines measures, improves data quality, analyzes disparities and maintains dashboard definitions."],
  ],

  analysisQuestions: [
    "What decision is being made, and what problem is it intended to solve?",
    "Which people, communities, employees, service recipients, families, providers or partners may be affected?",
    "What data, research and lived-experience information were used?",
    "What disparities or barriers already exist?",
    "Who may benefit most from this decision?",
    "Who could experience unintended burden, exclusion, harm, delay, cost or reduced access?",
    "How will disability access, language access, cultural responsiveness and digital accessibility be addressed?",
    "Which communities need to be engaged before the decision is final?",
    "What alternatives were considered, and why was this option selected?",
    "What measures will show whether the decision improves or worsens equity?",
    "Who is responsible for monitoring results and taking corrective action?",
  ],
  decisionCategories: [
    ["Routine operational decision", "Short equity and accessibility screening checklist."],
    ["New program, policy, contract or communication campaign", "Standard equity analysis and accessibility review. In this program, the equity scan."],
    ["High-impact decision involving service access, eligibility, funding, technology, staffing or enforcement", "Full equity analysis, community engagement plan, leadership review and post-implementation monitoring. In this program, the full analysis."],
    ["Urgent decision", "Expedited screening, documented rationale and a required retrospective review at an agreed point."],
  ],

  accessibilityDomains: [
    ["Digital documents", "Are headings structured? Is there alternative text? Is color never the only carrier of meaning? Does it read correctly with a screen reader?"],
    ["Websites and online tools", "Can people navigate by keyboard? Are forms labeled? Are videos captioned? Are error messages understandable?"],
    ["Meetings and events", "Is there a way to request accommodations? Are interpreters, captioning, accessible rooms, breaks and advance materials available when needed?"],
    ["Communications", "Is the content in plain language? Are translations or interpretation needed? Are communities represented respectfully?"],
    ["Service processes", "Can people apply, ask questions, appeal, participate or receive services through more than one accessible channel?"],
    ["Hiring and employment", "Are application systems, assessments, interviews, workspaces, learning and onboarding accessible?"],
    ["Procurement", "Do contracts require vendors to meet accessibility requirements and provide accessible products, services and documentation?"],
  ],
  accessibilityMinimum: ["A named accessibility reviewer or review process.", "A documented accommodation and language-access plan.", "A remediation tracker for identified barriers.", "An accountable owner and agreed review point for every remediation action.", "A test or review involving people with relevant lived experience whenever possible."],

  hiringTools: [
    ["Job-description equity checklist", "Removes unnecessary credential barriers; checks inclusive language, essential functions, accessibility, salary transparency and realistic requirements."],
    ["Recruitment outreach plan", "Identifies recruitment channels, community partners, disability-employment networks, professional associations and educational institutions."],
    ["Structured interview guide", "Consistent questions, behavioral criteria, scoring rubrics and documented rationale."],
    ["Interview-panel preparation guide", "Prepares panelists to recognize bias, use equitable practices, address accommodation needs and score consistently."],
    ["Candidate accessibility protocol", "How candidates request accommodations and how hiring teams respond promptly and confidentially."],
    ["Equitable onboarding checklist", "Accessible materials, clear role expectations, mentorship, technology access and connection to support networks."],
    ["Career-pathway map", "Transparent requirements, competencies, development opportunities and advancement routes."],
    ["Mentorship and sponsorship guide", "Matching, confidentiality, goals, meeting patterns, evaluation and sponsorship expectations."],
    ["Retention and exit-analysis template", "Group-level patterns in turnover, engagement, promotion and barriers."],
  ],

  engagementComponents: ["Community engagement planning template", "Stakeholder and partnership map", "Community Advisory Board charter", "Participant recruitment guide", "Stipend and reimbursement procedure", "Accessible meeting and event checklist", "Translation and interpretation request form", "Community reviewer agreement", "Cultural community profile template", "Feedback and response log", "“You said, we did, we are still working on” template", "Tribal consultation planning guide", "Community-engagement evaluation form"],
  engagementPlanning: [
    ["Purpose", "What decision, policy, program or service will community input influence?"],
    ["Influence", "What is open to change, and what is not?"],
    ["Participants", "Which communities, identities, languages, geographies and lived experiences need representation?"],
    ["Access", "What accommodations, formats, scheduling options, transportation, child care, interpretation and technology supports may be needed?"],
    ["Compensation", "Will community members be paid or reimbursed for expertise, time, travel or caregiving?"],
    ["Method", "Listening session, survey, advisory board, co-design workshop, interview, focus group or ongoing partnership?"],
    ["Decision loop", "When and how will participants hear what happened with their input?"],
    ["Evaluation", "How will the organization know whether engagement was inclusive, respectful and influential?"],
  ],

  learningLevels: [
    ["Foundational", "All employees", "Shared language, baseline understanding and behavioral expectations", "Equity foundations, disability history, accessibility, cultural humility, bias, respectful communication, belonging"],
    ["Applied", "Supervisors, hiring managers, program staff, human resources, procurement, communications", "Apply equity to role-specific decisions and interactions", "Inclusive hiring, equitable supervision, accessible communications, equity analysis, language access, community engagement"],
    ["Advanced", "Executives, senior leaders, champions, facilitators", "Lead change, analyze systems and hold accountability", "Structural racism, anti-ableism, data interpretation, change leadership, conflict navigation, policy analysis, strategic accountability"],
  ],
  learningEvaluation: [
    ["Reaction and accessibility", "Was the learning relevant, respectful, usable and accessible?"],
    ["Learning", "Did participants gain knowledge, skill or confidence?"],
    ["Application", "Did participants use the learning in their work by the agreed follow-up point?"],
    ["Organizational impact", "Did the learning contribute to better decisions, experiences, access or outcomes?"],
  ],
  applicationQuestions: ["What is one practice you will change next?", "What organizational barrier could prevent you from applying this learning?", "What support do you need from your supervisor or team?", "How will you know whether your changed practice improved inclusion, access or equity?", "What should be added to the learning based on real workplace conditions?"],

  surveyDomains: ["Belonging and inclusion", "Psychological safety", "Trust in leadership", "Fairness in workload, recognition, advancement and performance management", "Ability to raise concerns without retaliation", "Experiences of bias, microaggressions, harassment, exclusion or discrimination", "Accessibility of systems, technology, communications, meetings and accommodations", "Inclusive leadership practice", "Learning and development access", "Employee voice and influence", "Intent to stay and reasons for considering departure"],
  surveyItems: ["I feel respected by colleagues and leaders in my work environment.", "I can raise concerns about bias, exclusion or accessibility without fear of negative consequences.", "My supervisor demonstrates inclusive and equitable leadership practices.", "I have equitable access to career development and advancement opportunities.", "The organization provides the accommodations, accessibility and flexibility I need to do my job effectively.", "Leaders communicate clearly about how employee feedback leads to action.", "I believe the organization is making meaningful progress on its equity commitments."],
  surveyRule: "A culture survey is confidential, repeated at points the organization sets and paired with visible action. Do not survey employees without a plan to share results, explain limits, prioritize action and report progress. Results are reported for the department as a whole, never as a finding about a unit or a person.",

  measurementDomains: [
    ["Leadership and governance", "Equity analyses completed; equity goals in leader plans; committee participation", "Timely resolution of barriers; sustained cross-unit implementation"],
    ["Workforce equity", "Inclusive job descriptions reviewed; hiring-manager preparation completed", "Representation, hiring, promotion, retention and leadership trends"],
    ["Workplace culture", "Learning completion; manager action plans; resource-group participation", "Belonging, psychological safety, fairness, trust and retention"],
    ["Accessibility", "Audits completed; barriers logged; materials remediated", "Fewer accessibility complaints; better experience; timely accommodations"],
    ["Service delivery", "Programs reviewed; translation and interpretation use", "Improved access, timeliness, satisfaction, quality and reduced disparities"],
    ["Community partnership", "Engagement events; paid reviewers; advisory participation", "Community trust, perception of influence and recommendations adopted"],
    ["Accountability", "Progress reports submitted; corrective actions completed", "Progress toward targets and reduction of priority gaps"],
  ],
  dashboardPages: [
    ["Executive summary", "Overall status, top risks, key wins, decisions needed."],
    ["Workforce equity", "Representation, applicant flow, hiring, promotion, retention, development, climate."],
    ["Culture and belonging", "Belonging, psychological safety, trust, reported concerns, learning application."],
    ["Accessibility", "Audit results, remediation status, accommodation timeliness, digital accessibility, language access."],
    ["Service equity", "Access, use, timeliness, quality, satisfaction, outcomes, complaints, appeals."],
    ["Community partnership", "Participation, compensation, feedback, recommendation adoption, trust."],
    ["Implementation health", "Milestones, budget, resource constraints, delayed initiatives, corrective actions."],
  ],
  earlyWarning: ["A disparity between groups exceeds an agreed percentage-point or ratio threshold.", "A key service-access measure declines for two consecutive reporting periods.", "A demographic group experiences a materially higher turnover rate.", "Accessibility remediation items remain unresolved past the agreed review point.", "Community or employee trust results decline beyond an agreed threshold.", "A high-impact initiative proceeds without a completed equity analysis or engagement plan."],
  progressReport: ["Executive summary: accomplishments, risks, decisions needed.", "Pillar status: progress against each pillar and objective.", "Milestones: on track, at risk, delayed, completed.", "Key data trends: leading, intermediate and outcome indicators.", "Community and employee feedback: themes, concerns, actions taken.", "Accessibility and equity risks: barriers identified and remediation status.", "Corrective actions: owners, agreed points and progress.", "Next priorities: what will be completed, reviewed or escalated."],
  publicReport: ["Message from executive leadership and the Equity Committee", "Vision, commitments and strategic framework", "Accomplishments by pillar", "Workforce, culture, accessibility, service and community data", "Progress on priority disparity-reduction goals", "Community and employee perspectives", "Accessibility improvements and remaining barriers", "Major policy, practice or system changes", "Corrective actions and lessons learned", "Priorities and targets for the next period", "How employees and community members can continue to participate"],

  digitalTools: [
    ["Intake form and workflow", "Routes new initiatives through activity registration, equity review, accessibility review and approval.", "The equity lead reviews completeness and sets the level of analysis."],
    ["Job-description review aid", "Flags unnecessary degree requirements, exclusionary language, unclear essential functions and accessibility issues.", "Human resources and the hiring manager make final edits and confirm job relevance."],
    ["Contract and procurement checklist", "Prompts staff to assess vendor range, accessibility, language access, community impact and equity requirements.", "Procurement and legal staff verify requirements and contract language."],
    ["Plain-language aid", "Helps draft clearer public-facing materials.", "Communications and accessibility reviewers confirm readability, accuracy, tone and accessibility."],
    ["Translation workflow tracker", "Tracks requests, languages, turnaround, quality review and assignments.", "Qualified human translators and community reviewers validate critical materials."],
    ["Equity dashboard", "Integrates approved, de-identified data and surfaces trends.", "A data-governance group confirms data quality, privacy, interpretation and appropriate action."],
    ["Community-feedback organizer", "Groups themes from surveys, listening sessions, comments and advisory meetings.", "Engagement staff verify themes and preserve context; automated summaries never substitute for direct review."],
    ["Resource-library search", "Helps staff find approved templates, policies, case studies and learning resources.", "Version control, source citations, content review and access rules are maintained."],
  ],
  digitalToolsRule: "Digital tools can reduce administrative burden and make practice more consistent, but they support rather than replace professional judgment, community expertise, accessibility testing and human accountability. This program applies the same rule to its own assisted answers and tools.³",

  library: [
    ["Governance and strategy", ["Strategic framework and implementation plans", "Governance charter and committee membership", "Equity Activity Inventory guide", "Strategic plan scorecard", "Planning calendar, set by the people involved", "Progress and public report templates", "Roles and responsibilities matrix"]],
    ["Equity analysis and decision-making", ["Equity Analysis Toolkit", "Rapid equity screening checklist", "Policy-review guide", "Budget equity-review guide", "Program and service redesign guide", "Equity impact statement template", "Decision log and corrective-action template"]],
    ["Accessibility and communication", ["Digital accessibility checklist", "Accessible document and presentation guide", "Plain-language writing guide", "Inclusive language guide", "Captioning, interpretation, translation and accommodation request forms", "Accessible meeting and event checklist", "Website and digital-service review tool", "Communication templates and style guide"]],
    ["Workforce equity", ["Job-description review checklist", "Inclusive recruitment plan template", "Structured interview questions and scoring rubric", "Interview-panel preparation guide", "Candidate accommodation protocol", "Equitable onboarding checklist", "Mentorship and sponsorship toolkit", "Career-pathway and succession-planning guide", "Culture-survey tools and action-planning templates"]],
    ["Learning and culture", ["Foundational curriculum", "Applied role-based modules", "Facilitator guides and discussion protocols", "Case studies and scenario exercises", "Team norms and inclusive-meeting tools", "Manager coaching guides", "Post-learning application plans", "Learning evaluation and follow-up forms"]],
    ["Community partnership and service equity", ["Community engagement planning template", "Advisory-board charter and orientation", "Stipend and reimbursement process", "Cultural community profile template", "Tribal consultation guide", "Community-feedback and response log", "Service-disparity review template", "Culturally responsive service-design guide"]],
    ["Data, evaluation and reporting", ["Measures dictionary", "Data-governance standards", "Dashboard definitions and user guide", "Disaggregation and privacy guidance", "Early-warning threshold protocol", "Culture-survey reporting guide", "Progress-report template", "Public accountability report template"]],
  ] as Array<[string, string[]]>,

  launchPackage: [
    { name: "Governance charter", status: "not_yet" as ToolStatus, href: "" },
    { name: "Equity Activity Inventory", status: "partly_in_program" as ToolStatus, href: "/equity-policy/register" },
    { name: "Strategic plan scorecard", status: "partly_in_program" as ToolStatus, href: "/equity-policy" },
    { name: "Equity Analysis Toolkit", status: "in_program" as ToolStatus, href: "/equity-policy/analysis" },
    { name: "Initiative implementation checklist", status: "partly_in_program" as ToolStatus, href: "/practice" },
    { name: "Accessibility review checklist", status: "partly_in_program" as ToolStatus, href: "/areas/work/accessibility_language_access" },
    { name: "Inclusive hiring and job-description checklist", status: "partly_in_program" as ToolStatus, href: "/areas/work/workforce_equity" },
    { name: "Community engagement planning template", status: "partly_in_program" as ToolStatus, href: "/minnesota-communities" },
    { name: "Community Advisory Board charter", status: "not_yet" as ToolStatus, href: "" },
    { name: "Workforce culture survey", status: "partly_in_program" as ToolStatus, href: "/equity-policy/register#survey-title" },
    { name: "Measurement framework and baseline dashboard", status: "partly_in_program" as ToolStatus, href: "/practice/measurement" },
    { name: "Progress report template", status: "not_yet" as ToolStatus, href: "" },
  ],
  designPrinciple: "Every tool has a clear owner, a required point of use in an existing workflow, a manageable completion time, accessibility review, version control and a feedback mechanism. A template that is not embedded in a real decision, hiring, planning, procurement, service or reporting process rarely creates durable change.",

  /** Chicago-style notes. Superscript numerals in the page text refer to these. */
  notes: [
    "One DHS People, Access and Culture, “Equity Strategic Plan Concept Map and Resource and Tool Suite,” internal planning document supplied by the Equity and Inclusion Operations Consultant (2026), adapted here with all timelines removed and “equity” used in place of earlier terminology.",
    "One DHS People, Access and Culture, “Stage Zero,” internal program record, September 4, 2026, which names the One DSD Team as the standing volunteer DSD equity committee.",
    "The One DSD ecosystem proposal, as summarized in the concept map cited in note 1, positions technology tools as aids that require testing and review by people. The underlying proposal was not available for independent review; the summary is relied on as reported.",
    "The One DSD ecosystem proposal, as summarized in note 1, describes the Equity Activity Inventory as the “central nervous system” for coordinating equity work across units.",
    "State of Minnesota, Equity Analysis Toolkit, accessed September 8, 2026, https://mn.gov/oeoa/resources/equity-analysis-toolkit/; Minnesota Department of Human Services, DHS Equity Policy, version 2.0 (St. Paul: Minnesota Department of Human Services, August 4, 2023), https://mn.gov/dhs/assets/equity-policy_tcm1053-646921.pdf.",
    "Americans with Disabilities Act of 1990, Pub. L. No. 101-336, 104 Stat. 327 (1990); Rehabilitation Act of 1973, § 508, 29 U.S.C. § 794d. This program keeps WCAG 2.2 Level AA as its own standard.",
    "The implementation materials cited within the concept map (note 1) recommend auditing job descriptions, preparing hiring managers, creating advancement pathways, mentorship, a recurring culture survey, culturally competent interview panels and attention to retention gaps.",
    "The One DSD ecosystem proposal, as summarized in note 1, recommends cultural community profiles developed with paid community reviewers, formal Tribal consultation, a stipend process, funded translation and a community advisory board, and names Somali, Hmong, Ojibwe communities connected to White Earth and Red Lake, Mexican and Karen communities as first priorities in that proposal.",
    "The One DSD framework, as summarized in note 1, recommends foundational, applied and advanced learning with a multi-module intercultural pathway and facilitator preparation; the program’s pathway is at /learn/intercultural.",
    "The One DSD ecosystem proposal, as summarized in note 1, proposes that service data be analyzed by race, disability type, language and geography, with a dashboard and early-warning process.",
    "One DHS People, Access and Culture, “One DHS and One DSD Program Operating Charter,” internal program guidance, September 8, 2026, which defines the six-step value sequence, the thirteen program functions, the seven intended outcomes and the rule that program measures evaluate practice rather than individuals.",
    "One DHS People, Access and Culture, “Operationalizing Equity,” program definition, version 2026-09-08.1, drawing on the DHS Equity Policy, the Minnesota Equity Analysis Tool and the Government Alliance on Race and Equity, “Our Approach,” accessed September 8, 2026, https://www.racialequityalliance.org/who-we-are/our-approach.",
  ],
  bibliography: [
    "Americans with Disabilities Act of 1990. Pub. L. No. 101-336, 104 Stat. 327 (1990).",
    "Government Alliance on Race and Equity. “Our Approach.” Accessed September 8, 2026. https://www.racialequityalliance.org/who-we-are/our-approach.",
    "Minnesota Department of Human Services. DHS Equity Policy. Version 2.0. St. Paul: Minnesota Department of Human Services, August 4, 2023. https://mn.gov/dhs/assets/equity-policy_tcm1053-646921.pdf.",
    "One DHS People, Access and Culture. “Equity Strategic Plan Concept Map and Resource and Tool Suite.” Internal planning document, 2026.",
    "One DHS People, Access and Culture. “One DHS and One DSD Program Operating Charter.” Internal program guidance, September 8, 2026.",
    "One DHS People, Access and Culture. “Operationalizing Equity.” Program definition, version 2026-09-08.1.",
    "One DHS People, Access and Culture. “Stage Zero.” Internal program record, September 4, 2026.",
    "Rehabilitation Act of 1973, § 508. 29 U.S.C. § 794d.",
    "State of Minnesota. Equity Analysis Toolkit. Accessed September 8, 2026. https://mn.gov/oeoa/resources/equity-analysis-toolkit/.",
  ],
} as const;

export type EquityFramework = typeof EQUITY_FRAMEWORK;
