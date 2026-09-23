import type { CoursePack } from "./source-types";

/**
 * Presentation-only cover replacements. Preserved course records and publication
 * history remain unchanged; both program views receive the same cover.
 */
const coverOverrides: Readonly<Record<string, { src: string; alt: string }>> = {
  "cultural-humility-vs-checklist": {
    src: "/images/covers/cultural-humility-professional-conversation.webp",
    alt: "A professionally dressed Black man explains his perspective while a white woman colleague listens across a table.",
  },
  "cultural-intelligence-amharic": {
    src: "/images/covers/amharic-speaking-minnesota.webp",
    alt: "A visitor and service navigator review a community service flyer at a counter.",
  },
  "cultural-intelligence-arabic": {
    src: "/images/covers/arabic-speaking-minnesota.webp",
    alt: "A visitor and service navigator review service options on a tablet at a library table.",
  },
  "cq-nordic-europe": {
    src: "/images/covers/cq-nordic-europe.webp",
    alt: "A meeting room is prepared beside a window overlooking a Minnesota winter scene.",
  },
  "idi-denial": {
    src: "/images/covers/idi-denial.webp",
    alt: "A closed meeting-room door stands between a quiet table and an office beyond.",
  },
  "ipe-18-cross-division-coordination": {
    src: "/images/covers/cross-division-coordination.webp",
    alt: "Colleagues align a shared project timeline and planning documents on a table.",
  },
  "cq-anglo": {
    src: "/images/covers/cq-anglo.webp",
    alt: "A library meeting room is arranged for a small facilitated conversation.",
  },
  "idi-polarization": {
    src: "/images/covers/idi-polarization.webp",
    alt: "Two chairs and notebooks face each other across a table prepared for dialogue.",
  },
  "cq-confucian-asia": {
    src: "/images/covers/cq-confucian-asia.webp",
    alt: "Colleagues arrange discussion cards and notebooks during a workshop.",
  },
  "ipe-05-bias-assumptions-accountability": {
    src: "/images/covers/bias-assumptions-accountability.webp",
    alt: "A colleague checks decision criteria against a policy binder at a desk.",
  },
  "cultural-intelligence-cambodian": {
    src: "/images/covers/cambodian-khmer-minnesota.webp",
    alt: "Two colleagues review a community service flyer together at a library table.",
  },
  "cultural-intelligence-bosnian": {
    src: "/images/covers/bosnian-minnesota.webp",
    alt: "A visitor and a Black service navigator review a folder at a civic office counter.",
  },
  "cultural-intelligence-burmese": {
    src: "/images/covers/burmese-minnesota.webp",
    alt: "A navigator points out locations on a map while two visitors look on.",
  },
  "cultural-intelligence-chinese": {
    src: "/images/covers/chinese-minnesota.webp",
    alt: "A visitor and service navigator review a form together in a community office.",
  },
  "cultural-intelligence-colombian": {
    src: "/images/covers/colombian-minnesota.webp",
    alt: "Three colleagues share perspectives around a worktable in a community office.",
  },
  "cultural-intelligence-cuban": {
    src: "/images/covers/cuban-minnesota.webp",
    alt: "A service navigator and visitors examine printed information at a table.",
  },
  "cultural-intelligence-ecuadorian": {
    src: "/images/covers/ecuadorian-minnesota.webp",
    alt: "People discuss printed community information across a library table.",
  },
  "cultural-intelligence-ethiopian": {
    src: "/images/covers/ethiopian-minnesota.webp",
    alt: "Three adults hold a thoughtful conversation around a table at a community center.",
  },
  "cultural-intelligence-filipino": {
    src: "/images/covers/filipino-minnesota.webp",
    alt: "Two adults greet a visitor across a community center table.",
  },
  "cultural-intelligence-french": {
    src: "/images/covers/french-speaking-minnesota.webp",
    alt: "Two colleagues review a service-navigation map in a civic office.",
  },
  "cultural-intelligence-guatemalan": {
    src: "/images/covers/guatemalan-minnesota.webp",
    alt: "A visitor and navigator review printed service materials together.",
  },
  "cultural-intelligence-indian": {
    src: "/images/covers/indian-minnesota.webp",
    alt: "A professional reviews planning documents at a desk overlooking the city.",
  },
  "cultural-intelligence-japanese": {
    src: "/images/covers/japanese-minnesota.webp",
    alt: "An older visitor speaks while a service navigator listens at a library table.",
  },
  "cultural-intelligence-karen": {
    src: "/images/covers/karen-minnesota.webp",
    alt: "A professional stands in a welcoming public-service office.",
  },
  "cultural-intelligence-kenyan": {
    src: "/images/covers/kenyan-minnesota.webp",
    alt: "Two colleagues collaborate over service information at a table.",
  },
  "cultural-intelligence-korean": {
    src: "/images/covers/korean-minnesota.webp",
    alt: "A professional welcomes visitors from a desk in a community office.",
  },
  "cultural-intelligence-lao": {
    src: "/images/covers/lao-minnesota.webp",
    alt: "A professional walks through a public-service building with a folder.",
  },
  "cultural-intelligence-latino": {
    src: "/images/covers/latino-minnesota.webp",
    alt: "Three colleagues talk as they walk through a public-service atrium.",
  },
  "cultural-intelligence-lebanese": {
    src: "/images/covers/lebanese-minnesota.webp",
    alt: "Two colleagues discuss a document in a neutral office setting.",
  },
  "cultural-intelligence-liberian": {
    src: "/images/covers/liberian-minnesota.webp",
    alt: "A professional walks beside a public-service building in the city.",
  },
  "cultural-intelligence-mexican": {
    src: "/images/covers/mexican-minnesota.webp",
    alt: "A professional arranges printed materials beside a window.",
  },
  "cultural-intelligence-minnesota": {
    src: "/images/covers/minnesota-culture.webp",
    alt: "Neighbors of varied ages and backgrounds enter a Minnesota public library.",
  },
  "cultural-intelligence-somali": {
    src: "/images/covers/somali-minnesota.webp",
    alt: "A professional stands in a Minnesota public-service office.",
  },
  "cultural-intelligence-nigerian": {
    src: "/images/covers/nigerian-minnesota.webp",
    alt: "A professional stands with a clipboard near an accessible meeting room.",
  },
  "cultural-intelligence-oromo": {
    src: "/images/covers/oromo-minnesota.webp",
    alt: "Two colleagues work together over a blank planning sheet.",
  },
  "cultural-intelligence-american": {
    src: "/images/covers/american-culture.webp",
    alt: "A public-service worker welcomes a visitor across a reception counter.",
  },
  "cultural-intelligence-puerto-rican": {
    src: "/images/covers/puerto-rican-minnesota.webp",
    alt: "A professional carries a folder through a public-service building.",
  },
  "cultural-intelligence-russian": {
    src: "/images/covers/russian-speaking-minnesota.webp",
    alt: "Two colleagues discuss a document in an office.",
  },
  "cultural-intelligence-salvadoran": {
    src: "/images/covers/salvadoran-minnesota.webp",
    alt: "A professional reviews documents at a public-service desk.",
  },
  "cultural-intelligence-thai": {
    src: "/images/covers/thai-minnesota.webp",
    alt: "Two colleagues review a service plan together at a table.",
  },
  "cultural-intelligence-vietnamese": {
    src: "/images/covers/vietnamese-minnesota.webp",
    alt: "A professional carries a tablet through a public-service atrium.",
  },
  "cultural-intelligence-tribal": {
    src: "/images/covers/tribal-nations-minnesota.webp",
    alt: "A Native professional and a colleague discuss a planning board together.",
  },
  "cultural-intelligence-alaska-native": {
    src: "/images/covers/alaska-native-minnesota.webp",
    alt: "A professional stands in a community office while colleagues meet nearby.",
  },
  "cultural-intelligence-european-american": {
    src: "/images/covers/european-american-minnesota.webp",
    alt: "Colleagues from varied communities listen to one another in a civic meeting room.",
  },
  "cultural-intelligence-ukrainian": {
    src: "/images/covers/ukrainian-minnesota.webp",
    alt: "Two colleagues review a document together at an office table.",
  },
  "cultural-intelligence-native-american": {
    src: "/images/covers/native-american-minnesota.webp",
    alt: "A Native professional sits in a contemporary community meeting room.",
  },
  "cultural-intelligence-rural": {
    src: "/images/covers/rural-minnesota.webp",
    alt: "Two staff members prepare materials for a community service visit.",
  },
  "dsd-01-minnesota-service-system": {
    src: "/images/covers/dsd-minnesota-service-system.webp",
    alt: "A navigator and visitor review service options on a tablet at a counter.",
  },
  "dsd-03-self-direction-independent-living": {
    src: "/images/covers/dsd-self-direction.webp",
    alt: "A man using a prosthetic leg organizes what he needs before leaving home.",
  },
  "dsd-04-personal-outcomes-quality": {
    src: "/images/covers/dsd-personal-outcomes.webp",
    alt: "A navigator and visitor discuss personal goals at a worktable.",
  },
  "dsd-05-customized-employment": {
    src: "/images/covers/dsd-customized-employment.webp",
    alt: "A worker and job coach organize materials together at a workplace.",
  },
  "dsd-07-executive-function-strengths": {
    src: "/images/covers/dsd-executive-function.webp",
    alt: "A worker uses colored planning cards and headphones to organize tasks.",
  },
  "dsd-08-brain-injury-practice": {
    src: "/images/covers/dsd-brain-injury-practice.webp",
    alt: "A visitor and navigator talk through a service plan at a table.",
  },
  "dsd-09-aging-health-access": {
    src: "/images/covers/dsd-aging-health-access.webp",
    alt: "An older adult reviews a card with a service navigator.",
  },
  "pi-protecting-program-without-harm": {
    src: "/images/covers/program-integrity-without-harm.webp",
    alt: "Two colleagues review a service process and supporting documents together.",
  },
  "div-f05-implicit-bias-iat": {
    src: "/images/covers/implicit-bias-reflection.webp",
    alt: "A colleague pauses to reflect while reviewing material at her laptop.",
  },
  "div-f02-microaggressions": {
    src: "/images/covers/microaggressions-recognition-impact.webp",
    alt: "Two colleagues discuss a workplace interaction at a sunlit table.",
  },
  "div-f01-white-privilege": {
    src: "/images/covers/white-privilege-opportunity.webp",
    alt: "Two office doorways offer different levels of access to rooms beyond.",
  },
  "div-i02-ambiguous-bias": {
    src: "/images/covers/ambiguous-bias-reflection.webp",
    alt: "A colleague reflects while considering two unmarked folders at a table.",
  },
  "div-f10-equality-equity-fairness": {
    src: "/images/covers/equality-equity-fairness.webp",
    alt: "Colleagues prepare an accessible meeting room and arrange documents on a table.",
  },
  "div-f03-intercultural-communication": {
    src: "/images/covers/intercultural-communication.webp",
    alt: "One colleague speaks while another listens closely across a table.",
  },
  "div-f04-cultural-values": {
    src: "/images/covers/cultural-values-worldviews.webp",
    alt: "Notes and a hand-drawn concept map sit on a collaborative worktable.",
  },
  "div-f06-social-identity": {
    src: "/images/covers/social-identity-belonging.webp",
    alt: "Colleagues of different ages and backgrounds share a conversation around a laptop.",
  },
  "div-f07-stereotypes-prejudice-discrimination": {
    src: "/images/covers/stereotypes-prejudice-discrimination.webp",
    alt: "Colleagues carefully review documents and assumptions together around a table.",
  },
  "div-f08-ethnocentrism": {
    src: "/images/covers/ethnocentrism.webp",
    alt: "Colleagues compare notes and perspectives around a shared worktable.",
  },
  "div-f09-intersectionality": {
    src: "/images/covers/intersectionality.webp",
    alt: "Several hands arrange overlapping translucent sheets during a workshop.",
  },
  "div-i01-microinterventions": {
    src: "/images/covers/microinterventions.webp",
    alt: "Three colleagues practice a thoughtful response in a workplace conversation.",
  },
  "dsd-06-benefits-assets-economic": {
    src: "/images/covers/dsd-benefits-assets-economic.webp",
    alt: "A benefits navigator and visitor review a blank budget worksheet together.",
  },
  "di-access-needs-and-individualized-support": {
    src: "/images/covers/di-access-needs.webp",
    alt: "Two colleagues arrange assistive input devices at an adjustable desk.",
  },
  "di-accessibility-auditing-and-barrier-analysis": {
    src: "/images/covers/di-accessibility-audit.webp",
    alt: "A staff member examines the step-free route into a public building.",
  },
  "di-accessibility-basics": {
    src: "/images/covers/di-accessibility-basics.webp",
    alt: "A hand reaches for the automatic door opener beside a step-free entrance.",
  },
  "di-accessible-content-and-digital-learning": {
    src: "/images/covers/di-accessible-content.webp",
    alt: "A colleague compares a large-print document with a simplified laptop page.",
  },
  "di-accommodations-and-interactive-process": {
    src: "/images/covers/di-accommodations.webp",
    alt: "Two colleagues adjust a monitor and chair in a shared workspace.",
  },
  "di-capstone-remove-a-real-barrier": {
    src: "/images/covers/di-capstone-remove-barrier.webp",
    alt: "A staff member measures a public doorway threshold to plan an access improvement.",
  },
  "di-co-design-and-lived-experience": {
    src: "/images/covers/di-co-design-lived-experience.webp",
    alt: "Colleagues with varied lived experiences collaborate around a worktable.",
  },
  "di-conflict-resolution-and-neurodiversity": {
    src: "/images/covers/di-conflict-neurodiversity.webp",
    alt: "Two colleagues have a calm conversation in a quiet room.",
  },
  "di-allyship-and-everyday-action": {
    src: "/images/covers/di-allyship-everyday-action.webp",
    alt: "A colleague makes space at an accessible meeting table and shares an agenda.",
  },
  "di-change-management-and-implementation": {
    src: "/images/covers/di-change-management.webp",
    alt: "Several colleagues arrange plain colored cards on a planning table.",
  },
  "di-de-escalation-without-coercion": {
    src: "/images/covers/di-de-escalation.webp",
    alt: "A staff member listens calmly to a visitor in a quiet reception room.",
  },
  "di-disability-data-privacy-and-measurement": {
    src: "/images/covers/di-data-privacy.webp",
    alt: "A data analyst reviews anonymized charts at a private workstation.",
  },
  "di-disability-diversity-belonging": {
    src: "/images/covers/di-diversity-belonging.webp",
    alt: "Colleagues of varied backgrounds talk together in an accessible meeting room.",
  },
  "di-models-and-perspectives": {
    src: "/images/covers/di-models-perspectives.webp",
    alt: "Two colleagues review an accessible office floor plan from different sides of a table.",
  },
  "di-language-and-respectful-interaction": {
    src: "/images/covers/di-respectful-language.webp",
    alt: "A staff member and wheelchair user speak with one another at eye level.",
  },
  "di-inclusive-communication": {
    src: "/images/covers/di-inclusive-communication.webp",
    alt: "Two colleagues talk face to face in a quiet, well-lit workspace.",
  },
  "di-trauma-informed-culturally-responsive-practice": {
    src: "/images/covers/di-trauma-informed.webp",
    alt: "A staff member offers a visitor a choice of seats in a calm room.",
  },
  "di-inclusive-meetings-events-learning": {
    src: "/images/covers/di-inclusive-meetings.webp",
    alt: "An accessible public-service meeting room welcomes people using varied seating.",
  },
  "di-rights-policy-and-organizational-duties": {
    src: "/images/covers/di-rights-policy.webp",
    alt: "A staff member organizes a policy binder and accessible-format documents.",
  },
  "di-inclusive-supervision-and-team-culture": {
    src: "/images/covers/di-inclusive-supervision.webp",
    alt: "A supervisor listens to a colleague during a one-to-one conversation.",
  },
  "di-facilitation-and-peer-learning": {
    src: "/images/covers/di-facilitation-peer-learning.webp",
    alt: "A colleague facilitates a small peer discussion in a civic meeting room.",
  },
  "di-governance-accountability-resourcing": {
    src: "/images/covers/di-governance-resourcing.webp",
    alt: "Colleagues review unlabeled planning and budget materials at a table.",
  },
  "di-inclusive-policy-procurement-technology": {
    src: "/images/covers/di-inclusive-procurement.webp",
    alt: "A staff member checks the usability of an accessible workstation.",
  },
  "di-measuring-culture-and-sustained-progress": {
    src: "/images/covers/di-measuring-culture.webp",
    alt: "Two colleagues review progress together at an accessible worktable.",
  },
  "di-leadership-case-for-inclusion": {
    src: "/images/covers/di-leadership-inclusion.webp",
    alt: "Two public-service leaders, one using a wheelchair, discuss an inclusion decision.",
  },
  "ipe-02-disability-culture-justice": {
    src: "/images/covers/ipe-02-disability-culture-justice.webp",
    alt: "Two colleagues, one using a wheelchair, discuss artwork at a community center.",
  },
  "ipe-04-person-centered-systems": {
    src: "/images/covers/ipe-04-person-centered-systems.webp",
    alt: "A staff member listens closely to an older visitor at a service desk.",
  },
  "ipe-06-accessible-communication": {
    src: "/images/covers/ipe-06-accessible-communication.webp",
    alt: "An older visitor and navigator use a tablet to review service information.",
  },
  "ipe-07-participation-and-voice": {
    src: "/images/covers/ipe-07-participation-and-voice.webp",
    alt: "A facilitator arranges chairs for a participatory conversation.",
  },
  "ipe-08-choosing-a-learning-focus": {
    src: "/images/covers/ipe-08-choosing-a-learning-focus.webp",
    alt: "Blank index cards and a pencil are arranged on a worktable.",
  },
  "ipe-09-accessible-public-communications": {
    src: "/images/covers/ipe-09-accessible-public-communications.webp",
    alt: "A communications professional compares a document with a tablet in a quiet office.",
  },
  "ipe-12-policy-writing-equity-lens": {
    src: "/images/covers/ipe-12-policy-writing-equity-lens.webp",
    alt: "A policy analyst compares two draft pages at his desk.",
  },
  "ipe-13-program-service-design": {
    src: "/images/covers/ipe-13-program-service-design.webp",
    alt: "People move through a welcoming, accessible civic reception area.",
  },
  "ipe-14-documentation-and-narrative": {
    src: "/images/covers/ipe-14-documentation-and-narrative.webp",
    alt: "A records analyst organizes folders at a desk.",
  },
  "ipe-15-stakeholder-partnership": {
    src: "/images/covers/ipe-15-stakeholder-partnership.webp",
    alt: "Three community partners talk while walking through a park.",
  },
  "ipe-16-digital-equity-technology": {
    src: "/images/covers/ipe-16-digital-equity-technology.webp",
    alt: "A technologist tests an accessible self-service kiosk in a public lobby.",
  },
  "ipe-17-responding-to-feedback": {
    src: "/images/covers/ipe-17-responding-to-feedback.webp",
    alt: "A manager reflects while reviewing feedback in a private office.",
  },
  "ipe-19-history-public-institutions": {
    src: "/images/covers/ipe-19-history-public-institutions.webp",
    alt: "Archival folders and a magnifier rest on a reading table.",
  },
  "ipe-20-tribal-sovereignty": {
    src: "/images/covers/ipe-20-tribal-sovereignty.webp",
    alt: "Two governance colleagues review a document together at a table.",
  },
  "ipe-21-race-disability-outcomes": {
    src: "/images/covers/ipe-21-race-disability-outcomes.webp",
    alt: "A visitor using a cane talks with a navigator at a service counter.",
  },
  "ipe-22-immigration-system-navigation": {
    src: "/images/covers/ipe-22-immigration-system-navigation.webp",
    alt: "A navigator and visitor review service information at a counter.",
  },
  "ipe-03-public-power": {
    src: "/images/covers/ipe-03-public-power.webp",
    alt: "Residents approach several service counters in a public lobby.",
  },
  "ipe-10-language-access": {
    src: "/images/covers/ipe-10-language-access.webp",
    alt: "A visitor, interpreter, and navigator talk over a tablet at a counter.",
  },
  "ipe-11-inclusive-meetings": {
    src: "/images/covers/ipe-11-inclusive-meetings.webp",
    alt: "Colleagues of varied backgrounds share a roundtable discussion.",
  },
  "ipe-23-lgbtqia2s-inclusion-privacy": {
    src: "/images/covers/ipe-23-lgbtqia2s-inclusion-privacy.webp",
    alt: "A staff member reflects at a private desk separated from the public area.",
  },
  "ipe-24-religion-spirituality-practice": {
    src: "/images/covers/ipe-24-religion-spirituality-practice.webp",
    alt: "A quiet reflection room offers flexible seating and natural light.",
  },
  "ipe-25-trauma-responsive-administration": {
    src: "/images/covers/ipe-25-trauma-responsive-administration.webp",
    alt: "A navigator offers a visitor two appointment options in a calm office.",
  },
  "ipe-26-power-conflict-repair": {
    src: "/images/covers/ipe-26-power-conflict-repair.webp",
    alt: "Two colleagues discuss a work process that needs repair.",
  },
  "ipe-27-ethical-decision-making": {
    src: "/images/covers/ipe-27-ethical-decision-making.webp",
    alt: "A professional weighs two unmarked folders before a decision.",
  },
  "ipe-28-complex-issue-inquiry": {
    src: "/images/covers/ipe-28-complex-issue-inquiry.webp",
    alt: "A facilitator helps colleagues explore an issue using blank cards.",
  },
  "ipe-29-reflective-team": {
    src: "/images/covers/ipe-29-reflective-team.webp",
    alt: "Colleagues reflect together over a planning sheet.",
  },
  "ipe-30-policy-procedure-governance": {
    src: "/images/covers/ipe-30-policy-procedure-governance.webp",
    alt: "Colleagues organize unlabeled policy binders and notes at a table.",
  },
  "ipe-31-inclusive-workforce-culture": {
    src: "/images/covers/ipe-31-inclusive-workforce-culture.webp",
    alt: "Coworkers from varied backgrounds share a casual outdoor conversation.",
  },
  "ipe-32-complaints-incident-learning": {
    src: "/images/covers/ipe-32-complaints-incident-learning.webp",
    alt: "A reviewer studies documents and a simple chart at her desk.",
  },
  "ipe-33-responsible-data-evaluation": {
    src: "/images/covers/ipe-33-responsible-data-evaluation.webp",
    alt: "An analyst studies an unlabeled data chart at her desk.",
  },
  "ipe-34-co-design-partnership": {
    src: "/images/covers/ipe-34-co-design-partnership.webp",
    alt: "Three colleagues collaborate on a service design at a table.",
  },
  "ipe-35-inclusive-learning-design": {
    src: "/images/covers/ipe-35-inclusive-learning-design.webp",
    alt: "An instructional designer reviews a tactile learning material and document.",
  },
  "ipe-36-leading-difficult-dialogue": {
    src: "/images/covers/ipe-36-leading-difficult-dialogue.webp",
    alt: "A facilitator leads a careful group conversation.",
  },
  "ipe-37-resource-allocation-equity": {
    src: "/images/covers/ipe-37-resource-allocation-equity.webp",
    alt: "A fiscal analyst arranges blank planning cards beside a calculator.",
  },
  "ipe-38-sustaining-voluntary-learning": {
    src: "/images/covers/ipe-38-sustaining-voluntary-learning.webp",
    alt: "A staff member reflects while reviewing learning material on a tablet.",
  },
  "div-i03-identity-safety": {
    src: "/images/covers/identity-safety.webp",
    alt: "Colleagues listen to one another during a small workplace conversation.",
  },
  "div-i04-code-switching": {
    src: "/images/covers/code-switching.webp",
    alt: "A formal meeting room and a relaxed conversation area sit side by side.",
  },
  "div-i05-colorism": {
    src: "/images/covers/colorism.webp",
    alt: "Three adults with varied skin tones sit together in a sunlit room.",
  },
  "div-i06-classism": {
    src: "/images/covers/classism.webp",
    alt: "Everyday work items and a packed meal sit on a shared table.",
  },
  "div-i07-gender-double-binds": {
    src: "/images/covers/gender-double-binds.webp",
    alt: "A woman facilitates a workplace discussion while colleagues listen.",
  },
  "div-i08-racial-socialization": {
    src: "/images/covers/racial-socialization.webp",
    alt: "Two family members talk together in a living room.",
  },
  "div-i09-accent-bias": {
    src: "/images/covers/accent-bias.webp",
    alt: "Two colleagues exchange ideas face to face in an office corridor.",
  },
  "div-i10-receiving-feedback": {
    src: "/images/covers/receiving-feedback.webp",
    alt: "A person reviews a feedback document with a pen at a table.",
  },
  "div-a01-aversive-racism": {
    src: "/images/covers/aversive-racism.webp",
    alt: "An empty meeting room has chairs set apart around a table.",
  },
  "div-a02-whiteness-institutional-norm": {
    src: "/images/covers/whiteness-institutional-norm.webp",
    alt: "A row of similar framed portraits ends with an empty frame.",
  },
  "div-a03-intersectional-discrimination": {
    src: "/images/covers/intersectional-discrimination.webp",
    alt: "Colleagues, including a wheelchair user, cross a public-service atrium together.",
  },
  "div-a04-epistemic-injustice": {
    src: "/images/covers/epistemic-injustice.webp",
    alt: "A colleague speaks while a small group listens closely.",
  },
  "div-a05-racial-battle-fatigue": {
    src: "/images/covers/racial-battle-fatigue.webp",
    alt: "A professional pauses by a window overlooking the city at dusk.",
  },
  "div-a06-restorative-identity-harm": {
    src: "/images/covers/restorative-identity-harm.webp",
    alt: "Chairs are arranged in a circle for a restorative conversation.",
  },
  "div-a07-networks-opportunity-hoarding": {
    src: "/images/covers/networks-opportunity-hoarding.webp",
    alt: "A network of outdoor paths includes one route that stops short of the others.",
  },
  "div-a08-bias-reduction-interventions": {
    src: "/images/covers/bias-reduction-interventions.webp",
    alt: "A professional arranges blank process cards beside a checklist.",
  },
  "div-a09-intergroup-contact": {
    src: "/images/covers/intergroup-contact.webp",
    alt: "Two neighbors work together planting seedlings in a community garden.",
  },
  "div-a10-moral-exclusion-dehumanization": {
    src: "/images/covers/moral-exclusion-dehumanization.webp",
    alt: "One chair sits apart from others in a public-service waiting area.",
  },
  "dsd-10-early-adversity-resilience": {
    src: "/images/covers/dsd-early-adversity-resilience.webp",
    alt: "A staff member prepares reflection cards in a calm service room.",
  },
  "dsd-11-community-mapping-belonging": {
    src: "/images/covers/dsd-community-mapping-belonging.webp",
    alt: "Colleagues examine a tabletop model of community connections.",
  },
  "dsd-12-communication-methods": {
    src: "/images/covers/dsd-communication-methods.webp",
    alt: "A woman using a tablet discusses communication choices with a colleague.",
  },
  "dsd-13-coaching-direct-support": {
    src: "/images/covers/dsd-coaching-direct-support.webp",
    alt: "A supervisor coaches a colleague through a work task.",
  },
  "idi-adaptation": {
    src: "/images/covers/idi-adaptation.webp",
    alt: "Two colleagues exchange perspectives in a public-service office.",
  },
  "idi-integration": {
    src: "/images/covers/idi-integration.webp",
    alt: "Colleagues from varied backgrounds listen to one another around a meeting table.",
  },
};

export function withCourseCover(pack: CoursePack): CoursePack {
  const replacement = coverOverrides[pack.course.id];
  return replacement
    ? { ...pack, course: { ...pack.course, coverImage: replacement.src, coverAlt: replacement.alt } }
    : pack;
}
