/** Toolkit Studio v1.1.1 — official 8-step lock. Browse and download only. */

export const TOOLKIT_STEPS = [
  { number: 1, title: "Desired results" },
  { number: 2, title: "Data" },
  { number: 3, title: "Engagement" },
  { number: 4, title: "Benefits, burdens, and design change" },
  { number: 5, title: "Impact statement" },
  { number: 6, title: "Accountability" },
  { number: 7, title: "Alignment" },
  { number: 8, title: "Sustainability" },
] as const;

export type ToolkitStudioCardId = "reminder-channel" | "assessment-scheduling" | "eligibility-notice";

export type ToolkitStudioStep = {
  number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  walked: string;
  insight: string;
  antiStereotype?: string;
  coverSheetFail?: string;
  walkedPass?: string;
  checkboxFail?: string;
  designChange?: string;
};

export type ToolkitStudioCard = {
  id: ToolkitStudioCardId;
  featured: true;
  title: string;
  prompt: string;
  tags: string[];
  kicker: string;
  lede: string;
  leaveAbleTo?: string;
  brief: {
    decision: string;
    owner: string;
    lockDate: string;
    goal: string;
    people: string;
    institutionalSelf: string;
  };
  steps: ToolkitStudioStep[];
  formalDoors: string[];
  briefs: Array<{ href: string; label: string; use: string }>;
  practice: { label: string; body: string; href: string };
  downloadBlurb: string;
};

export const TOOLKIT_WHY = {
  title: "Why the Equity Analysis Toolkit",
  authority:
    "Guidance from this program — not Official DHS policy text, not a decision engine, and not a substitute for filing the enterprise Equity Analysis Toolkit / User Guide.",
  chrome: "This is the only required learning path in the program. Everything else stays optional.",
  beats: [
    {
      title: "Hook",
      body: "An equity analysis is not a cover sheet after the decision is locked. At DHS it is the method: who is affected, what the data show, who was heard, benefits and burdens, and who owns the follow-up — with a date.",
    },
    {
      title: "Anti-racism / disparity",
      body: "Race-neutral rules (English-first, digital-first, daytime-only, short deadlines) can still widen unequal access. Name that risk in the process — do not explain people by culture.",
    },
    {
      title: "Insight vs checkbox",
      body: "Insight = design change, involvement path, honest gap, or owner + revisit date. “We considered equity” is a checkbox.",
    },
    {
      title: "Scan-first",
      body: "Equity scan when time is short — still written, still honest. Full analysis when the effect lasts or needs leadership approval. This Studio teaches both; filing stays on the enterprise path.",
    },
    {
      title: "Authority limits",
      body: "Does not create Official policy, approve a decision, replace Equal Opportunity and Access, Tribal consultation, or labor relations, or score you.",
    },
    {
      title: "How to use",
      body: "Pick a work moment → walk the eight steps with insight panels → download the pack for your own work offline.",
    },
  ],
};

export const TOOLKIT_INSIGHT_CHROME = [
  "Briefs help you ask better questions. They do not tell you what an individual believes, needs, or prefers.",
  "Name the process, not the people.",
  "Confirm preferences with the person. Involve partners when the decision affects communities.",
  "Anti-racism beat: Does this continue a race-neutral process that has already produced unequal access or outcomes? What alternative redistributes burden?",
];

export const TOOLKIT_CATALOG = [
  { id: "grant-rfp", title: "Grant RFP / procurement window", prompt: "Who can bid when the turnaround favors insider vendors?" },
  { id: "hiring-minimums", title: "Hiring minimum qualifications", prompt: "Which credentials are job-related — and which only feel like quality?" },
  { id: "listening-session", title: "One-off community listening session", prompt: "Is this engagement — or extraction on our timeline?" },
  { id: "disparity-dashboard", title: "Disparity dashboard without process cuts", prompt: "Do the numbers explain systems, or invite cultural blame?" },
  { id: "interpreter-budget", title: "Budget cut to interpreters / liaisons", prompt: "Is access treated as core service cost or optional overhead?" },
  { id: "positive-supports", title: "Positive supports / “compliance” process (DSD)", prompt: "Who gets labeled noncompliant when the process is uniform?" },
  { id: "tribal-deadline", title: "Tribal consultation vs launch deadline", prompt: "Is Nation engagement a formal door — or a workshop we skipped?" },
  { id: "campaign-imagery", title: "Campaign imagery and messaging", prompt: "Representation without consent, access, or usable language?" },
  { id: "colorblind-process", title: "Colorblind “same process for everyone” (team climate)", prompt: "Same process ≠ fair outcomes when access needs differ" },
] as const;

export const TOOLKIT_CARDS: ToolkitStudioCard[] = [
  {
    id: "reminder-channel",
    featured: true,
    title: "Reminder channel change",
    prompt: "What happens if SMS becomes the default and paper stops?",
    tags: ["Eligibility & service delivery", "Communication & accessibility"],
    kicker: "Featured example · Equity Analysis Toolkit Studio",
    lede: "SMS becomes the default reminder. Paper stops. “No-shows” are the reason. Walk the decision before it locks — without blaming communities.",
    brief: {
      decision: "Appointment/renewal reminders by SMS as default; email optional; paper discontinued to reduce no-shows.",
      owner: "Program operations lead (fiction)",
      lockDate: "10 business days",
      goal: "Fewer no-shows",
      people:
        "Alex Rivera — changing shifts, shared phone. Elena — helps with appointments; prefers written information in Spanish (stated). Empty-chair situations: no reliable text; unknown-number delete; ASL/CART; short-code cognitive load; rural coverage; guardian needs written notice.",
      institutionalSelf:
        "Digital-default + English-first + “efficiency = fairness.” Ending paper is framed as modernization, not as removing a channel some people still use to act.",
    },
    steps: [
      {
        number: 1,
        walked:
          "Desired result is not “send more texts.” It is: people who need the appointment/renewal receive, understand, and act on the reminder within 12 months of the change — across language, disability communication access, device stability, and place. DHS areas: program operations, language access, disability communication access. Who is easy to see: English-proficient, personal phone, texts OK, daytime attention. Who is easy to miss: shared phone; Spanish written preference (Elena); no text plan; ASL/CART; guardian-mediated contact; rural coverage; first DHS touchpoint.",
        insight: "Invisible groups (before); anti-racism beat on channel redesign.",
        antiStereotype: "Do not write “Latinx/Somali/etc. families don’t read texts.” Use stated preferences and access situations.",
      },
      {
        number: 2,
        walked: "Blended no-show averages hide who is missed. Missing breakouts: language, disability/communication need, geography, bounce/undeliverable by channel, “unreachable” after paper cut.",
        insight: "What would breakouts need to show before we claim SMS “works”? Empty chairs in the data are data — not proof paper was waste.",
      },
      {
        number: 3,
        walked: "A 10-day window rarely includes people who use paper, interpreters, or disability communication access. Staff brainstorm ≠ engagement.",
        insight: "Who was asked? Who is still missing — reason to extend the lock date?",
      },
      {
        number: 4,
        walked: "Benefit: faster reach for people who already text successfully. Burden: shared phone; Spanish written preference ignored; Deaf/HH left out; “no-show” labels rise for process reasons.",
        insight: "Design change is required. Monitoring after launch is a checkbox fail.",
        designChange: "Dual channel (SMS and mail/paper or preferred written); capture channel + language preference; measure received → understood → acted — not “texts sent.”",
        checkboxFail: "We’ll monitor after launch.",
      },
      {
        number: 5,
        walked: "Write the impact so a later reader can see the design change, not a cover sheet.",
        insight: "Cover-sheet language fails. Walked language names who is missed and what stays open.",
        coverSheetFail: "SMS improves access for all clients.",
        walkedPass:
          "SMS helps some people. Ending paper without a retained written or mail path likely widens gaps by language, disability communication access, and device stability. Keep a dual channel and capture preference before any paper sunset.",
      },
      {
        number: 6,
        walked:
          "Impact owner = program operations lead; outcome co-owners = language access + disability communication access contacts; communication owner + audience named; revisit = 90 days with breakout metrics; stop-rule = if undeliverable/unreachable rises for language or disability flags, restore paper.",
        insight: "An owner without a stop-rule is not accountability.",
      },
      {
        number: 7,
        walked:
          "Route to administration Equity Director / equity committee before the freeze when impact is prolonged or agencywide channel policy. Align to DHS equity policy (antiracist, multicultural, intercultural) and Equity Strategic Framework — analysis must be able to change the design, not decorate the launch deck.",
        insight: "Who has authority to pause for partner / Tribal gates? Shipping on the 10-day schedule is not the same as alignment.",
      },
      {
        number: 8,
        walked:
          "Dual-channel and preference capture are funded and staffed (mail/print or equivalent written path; interpreter/ASL pathways budgeted). Data collection for breakouts is possible. Unfunded mitigation is not mitigation. If paper sunset saves money that is not reinvested in access, the analysis fails sustainability.",
        insight: "Efficiency savings that cut access channels are not sustainable equity practice.",
      },
    ],
    formalDoors: [
      "Language access duties",
      "Disability communication access",
      "Equal Opportunity and Access — civil rights (when triggered)",
      "Equity Director / committee for prolonged impact",
      "Tribal / Office of Indian Policy — only if Nation-impacted",
      "Labor relations when workforce impact requires it",
    ],
    briefs: [
      { href: "/minnesota-communities/deaf-deafblind-hard-of-hearing", label: "Deaf, DeafBlind, and hard of hearing", use: "Communication access questions; formats; what not to assume" },
      { href: "/minnesota-communities/somali", label: "Somali", use: "Language/partnership questions — not “what Somali clients want”" },
    ],
    practice: { label: "Practice on a similar decision you own", body: "Download a published checklist. Staff notes are not saved here.", href: "/practice" },
    downloadBlurb: "On your own decision: keep channel mix open until preference + access are known. No case names in notes.",
  },
  {
    id: "assessment-scheduling",
    featured: true,
    title: "Assessment scheduling (MnCHOICES / HCBS)",
    prompt: "Who loses when assessments move online-only on a daytime window?",
    tags: ["Eligibility & service delivery", "Disability Services Division (DSD)"],
    kicker: "Featured example · Equity Analysis Toolkit Studio · Disability Services Division (DSD)",
    lede: "Online-only self-schedule. Daytime window. Who never books?",
    leaveAbleTo: "Treat schedule design as an equity decision in disability services",
    brief: {
      decision:
        "New online-only self-schedule window for MnCHOICES / HCBS assessment or annual review: Tue–Thu 9–3, metro-primary slots, confirmation by English automated phone/SMS only.",
      owner: "DSD program operations / scheduling lead (fiction)",
      lockDate: "15 business days",
      goal: "Cut admin time and no-shows",
      people:
        "Jordan Lee — unpaid caregiver, nights; needs evening or weekend options and written confirmation (stated). Sam Okonkwo — needs ASL interpreter booked before any assessment offer (stated). Empty chairs: Greater MN broadband limits; shared devices; guardian lead time; interpreter booking queues; rural travel to metro slots.",
      institutionalSelf:
        "9–5 institutional time + online-first + English confirmation. “Efficiency” that ignores unpaid caregiver labor, interpreter lead time, and Greater MN access reproduces disparity while looking neutral.",
    },
    steps: [
      {
        number: 1,
        walked:
          "Desired result: people can obtain and complete an assessment/review slot — not “clients who don’t engage.” 12-month change: fewer incomplete bookings without shifting burden onto caregivers and communication-access users. DHS/DSD areas: MnCHOICES / HCBS operations, disability communication access, language access.",
        insight: "Invisible before — disability access, unpaid caregivers, rural/broadband, language, device literacy.",
        antiStereotype: "No “African families don’t use portals.” Sam’s need is stated ASL, not ethnicity.",
      },
      {
        number: 2,
        walked: "Blended no-show/book rates hide caregiver time, interpreter delays, geographic distance. Missing breakouts = empty chairs.",
        insight: "What barrier-type cuts are required before claiming the portal “works”?",
      },
      {
        number: 3,
        walked: "Assessors + IT heard; caregivers, Deaf/HH pathways, Greater MN partners often missing.",
        insight: "Tribal consultation is a formal door when assessments involve Tribal members / Nation programs — escalate via Office of Indian Policy / Tribal liaison; do not invent Nation rules.",
      },
      {
        number: 4,
        walked: "Benefit: admin speed for people who can already self-schedule online daytime. Burden: night-shift caregivers; ASL users waiting on interpreter; rural/metro travel; English-only confirm.",
        insight: "Training people to use the portal is a checkbox fail.",
        designChange: "Keep phone/assisted scheduling; evening/virtual options; book interpreter before offer; written confirmation in preferred format; travel/rural alternatives.",
        checkboxFail: "Train them to use the portal. / Monitor after launch.",
      },
      {
        number: 5,
        walked: "Judge the statement by whether assisted paths stay open.",
        insight: "Cover-sheet language hides caregiver and communication-access burden.",
        coverSheetFail: "Online scheduling improves access for all members.",
        walkedPass:
          "Online daytime metro self-schedule helps some. Without assisted paths, evening/virtual options, and interpreter-first offers, burden shifts to unpaid caregivers and people who need communication access — including Greater Minnesota. Keep dual paths until access is known.",
      },
      {
        number: 6,
        walked: "DSD program owner + access lead; communication owner for confirmation channels; revisit 60–90 days on incomplete bookings by barrier type; stop-rule if assisted-path demand rises or ASL wait times block offers.",
        insight: "Stop-rule belongs with the owner, not in a later training plan.",
      },
      {
        number: 7,
        walked:
          "Equity Director / DSD equity lead before freeze when channel removal is lasting; align to disability access duties and DHS equity policy — design must be able to change. Removing assisted scheduling before freeze is a disability-access alignment issue, not an IT preference.",
        insight: "Alignment is the power to pause, not a slide in the launch deck.",
      },
      {
        number: 8,
        walked:
          "Assisted scheduling and interpreter booking are staffed and funded; barrier-type booking data collectable. Interpreter booking capacity and unpaid-caregiver time are part of the service cost — unfunded “mitigation” fails sustainability. Unfunded “portal training” is not mitigation.",
        insight: "Unfunded portal training is not sustainability.",
      },
    ],
    formalDoors: [
      "Disability communication access",
      "Language access",
      "Equity Director for prolonged impact",
      "Tribal / Office of Indian Policy when Nation-impacted",
      "Equal Opportunity and Access when a civil-rights path is triggered",
    ],
    briefs: [
      { href: "/minnesota-communities/deaf-deafblind-hard-of-hearing", label: "Deaf, DeafBlind, and hard of hearing", use: "Primary communication-access brief" },
      { href: "/minnesota-communities/rural", label: "Rural", use: "Greater Minnesota access questions" },
      { href: "/minnesota-communities/tribal-nations", label: "Tribal Nations", use: "Deference only when Nation-impacted" },
    ],
    practice: { label: "Practice on a scheduling or access decision you own", body: "Download a published checklist. Staff notes are not saved here.", href: "/practice" },
    downloadBlurb: "Schedule design is service design. List assisted options before removing them.",
  },
  {
    id: "eligibility-notice",
    featured: true,
    title: "Eligibility notice rewrite",
    prompt: "Does a “clearer” English PDF still leave people unable to act?",
    tags: ["Policy & program analysis", "Communication & accessibility"],
    kicker: "Featured example · Equity Analysis Toolkit Studio",
    lede: "A denser English PDF gets a “plain language” pass — but can people still act?",
    leaveAbleTo: "Judge notices by action, not by words mailed",
    brief: {
      decision:
        "Eligibility / renewal notice rewritten as a single English PDF branded “clearer”; 10-day response deadline; no budget yet for translation, alternate formats, or phone explanation line.",
      owner: "Policy / communications lead (fiction)",
      lockDate: "Tied to next print/mail cycle (treat as ~10 business days for Studio)",
      goal: "Fewer incomplete renewals",
      people:
        "Mei Chen — understands spoken English better than dense written English; needs extra time with a helper (stated). Luis Hagen — needs Spanish written materials to complete forms accurately (stated). Empty chairs: screen-reader users if PDF is image-only; low literacy; unstable mail address; people who need in-person help.",
      institutionalSelf:
        "Written-first + English-first + short deadline = “same for everyone.” Clarity theater (staff-readable English) ≠ usable access. Notices sent ≠ people who could act.",
    },
    steps: [
      {
        number: 1,
        walked:
          "Desired result: people can understand and respond in time — not only that the English sounds clearer to staff. 12-month change: higher completed renewals/actions across language, literacy/cognitive load, disability formats, and mailing stability. DHS areas: policy, communications, language access, accessibility.",
        insight: "Invisible before — language, literacy/cognitive load, disability formats, mailing stability, helper access.",
        antiStereotype: "Don’t invent “Asian clients need…” — Mei’s need is stated.",
      },
      {
        number: 2,
        walked: "Incomplete renewals as blended rate. Missing: language, format request, bounce, help-line volume, alternate-format requests.",
        insight: "Notices sent is not an equity metric.",
      },
      {
        number: 3,
        walked: "Comms team heard; language access + disability formats often afterthought.",
        insight: "Community review ≠ Tribal formal door unless Nation-impacted.",
      },
      {
        number: 4,
        walked: "Benefit: shorter staff-facing English for some readers. Burden: Luis’s Spanish written need unmet; Mei’s helper time unmet; inaccessible PDF; 10-day clock.",
        insight: "“We used simpler words” is a checkbox fail.",
        designChange: "Dual language path; plain language tested with users; alternate formats; longer response window or assisted path; measure completed actions.",
        checkboxFail: "We used simpler words. / Monitor after launch.",
      },
      {
        number: 5,
        walked: "Judge the notice by whether people could act.",
        insight: "Staff-readable English is not usable access.",
        coverSheetFail: "The clearer English PDF improves access for everyone.",
        walkedPass:
          "Staff-readable English is not the same as usable access. An English-only PDF with a 10-day deadline and no funded translation, alternate formats, or assisted explanation likely widens gaps. Dual language, tested plain language, formats, and time-to-act measures before the mail drop.",
      },
      {
        number: 6,
        walked: "Policy owner + language access + accessibility contact; communication owner + audience; revisit after one renewal cycle; stop-rule if incomplete rates rise for language or format flags.",
        insight: "A mail-drop date is not a revisit date.",
      },
      {
        number: 7,
        walked:
          "Equity Director / language access before freeze if the notice is a lasting statewide pattern; align to equity policy multicultural/intercultural commitments — access is not polish. Statewide notice pattern without language-access budget is misaligned even if the English PDF reads cleaner.",
        insight: "Alignment fails if language-access budget is deferred until after the freeze.",
      },
      {
        number: 8,
        walked:
          "Translation + human review and alternate formats are funded; help/phone explanation path staffed. Translation, alternate formats, and a staffed help path must be funded; clarity theater without them is not sustainable. Unfunded “we’ll translate later” fails sustainability.",
        insight: "Unfunded “we’ll translate later” is not sustainability.",
      },
    ],
    formalDoors: [
      "Language access duties",
      "Disability alternate formats",
      "Equity Director if prolonged impact",
      "Tribal only if Nation-impacted",
      "Equal Opportunity and Access when triggered",
    ],
    briefs: [
      { href: "/minnesota-communities/hmong", label: "Hmong", use: "Language/partnership questions" },
      { href: "/minnesota-communities/somali", label: "Somali", use: "Language/partnership questions" },
      { href: "/minnesota-communities/deaf-deafblind-hard-of-hearing", label: "Deaf, DeafBlind, and hard of hearing", use: "Format and access questions" },
    ],
    practice: { label: "Practice on a notice, form, or letter you are changing", body: "Download a published checklist. Staff notes are not saved here.", href: "/practice" },
    downloadBlurb: "Success = people could act. “Notices sent” is not an equity metric.",
  },
];

export function getToolkitStudioCard(id: string): ToolkitStudioCard | undefined {
  return TOOLKIT_CARDS.find((card) => card.id === id);
}

export const TOOLKIT_DOWNLOADS = [
  { id: "insights-checklist", title: "Insights checklist", noun: "checklist" },
  { id: "one-pager", title: "Official eight steps and scan one-pager", noun: "one-pager" },
  { id: "blank-worksheet", title: "Blank offline worksheet", noun: "worksheet" },
  { id: "guardrails", title: "Guardrails sheet", noun: "sheet" },
] as const;
