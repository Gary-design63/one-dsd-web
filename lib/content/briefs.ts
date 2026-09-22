/**
 * Minnesota Communities briefs (Community Intelligence MVP contract v0.1).
 *
 * Shape: Level 0 (who, where, why it matters for DHS work, within-group diversity)
 * -> Level 1 work panel (what to ask, access checks, who to involve, what not to assume)
 * -> Level 2 (deeper context) only on demand. Depth varies by evidence (quality over sameness).
 *
 * Status posture: briefs that have not completed community review remain 'under_review' and are
 * absent from the ordinary staff view. The owner may open a separate review view with a clear
 * notice. The Tribal Nations page is a gated referral and contains no Nation-specific guidance.
 *
 * Several briefs harvest substance from the One DHS live application (commit 3aed646). That
 * material is a migration input, not automatic approval; provenance is recorded per brief.
 */

export type BriefStatus = "approved" | "under_review" | "gated";

export type CommunityBrief = {
  id: string;
  title: string;
  kicker: string;
  status: BriefStatus;
  tribalGate?: boolean;
  owner: string;
  reviewDate: string;
  representationReview: "reviewed" | "pending";
  languages: string[];
  level0: {
    whoAndWhere: string;
    whyItMattersForDhsWork: string;
    withinGroupDiversity: string;
  };
  names: {
    preferred: string[];
    alsoUsed: string[];
    note: string;
    uncertainty?: string;
  };
  level1: {
    whatToAsk: string[];
    accessChecks: string[];
    whoToInvolve: string[];
    whatNotToAssume: string[];
  };
  level2?: Array<{ heading: string; body: string }>;
  sources: Array<{ label: string; note: string; href?: string }>;
  observances?: Array<{ title: string; when: string; atWork: string }>;
  relatedPathIds: string[];
  tags: string[];
  provenance: string;
};

const OWNER = "Equity and Inclusion Operations Consultant";
const REVIEW = "2027-01-15";
const LIVE = "This brief draws on material from the One DHS live application (one-dhs-equity-resource, commit 3aed646). It has been reorganized for the community brief format and still needs owner and representation review.";
const NEW = "This draft draws on public, general knowledge and program guidance. It does not yet include a sourced community self-description and still needs owner, partner, and representation review.";

const COMMON_INVOLVE = [
  "Language access lead or interpreter services, with the dialect written on the request.",
  "Equity Director for the administration or the person responsible for the program.",
  "Community partner organizations identified in this brief, with a clear purpose, role, compensation, and plan to report back.",
];

export const BRIEFS: CommunityBrief[] = [
  {
    id: "somali",
    title: "Somali Minnesotans",
    kicker: "Community brief",
    status: "under_review",
    owner: OWNER,
    reviewDate: REVIEW,
    representationReview: "pending",
    languages: ["Somali (Standard)", "Maay", "Benadiri", "Arabic (religious use)", "English (second generation)"],
    level0: {
      whoAndWhere:
        "Minnesota has the largest Somali community in the United States. Families live across the Twin Cities and in Greater Minnesota. Arrival after the 1991 collapse of the Somali state is part of the community's refugee history. DHS staff today also serve a large U.S.-born generation and work with families through disability waivers and child welfare. Counts differ by source, so include the source date with any number you cite.",
      whyItMattersForDhsWork:
        "A Somali interpreter who does not speak Maay, a form that cannot accept a three-part name, or an exception process offered only in English can prevent meaningful access. This community's history with public systems also includes times when seeking help led to a child-protection report.",
      withinGroupDiversity:
        "The community includes people who are more or less observant, women who lead households, businesses, and finances, young people who have never lived in Somalia, and people who will not discuss clan with an outsider. No one description captures every Somali person or family.",
    },
    names: {
      preferred: ["Somali", "Somali Minnesotan", "Somali American"],
      alsoUsed: ["Somali-American", "East African (umbrella; not a substitute)"],
      note: "Naming follows a given name, father's name, and grandfather's name. Many people do not use a family surname the way a database expects one. Do not invent a last name because a field requires it.",
      uncertainty: "Ask how the person wants to be addressed and which name appears on their documents.",
    },
    level1: {
      whatToAsk: [
        "Which language and dialect should we book: Standard Somali, Maay, or Benadiri?",
        "Would you like a gender-matched interpreter?",
        "Who should be in the room for this decision?",
        "How are your names written on your documents, and how would you like us to address you?",
        "What has already been hard about working with an agency, so we do not repeat it?",
      ],
      accessChecks: [
        "Interpreter request names the dialect and any gender-match request.",
        "Vital notices are translated with human review, and exception processes are available to people who do not use English.",
        "Forms accept three-part names; no invented surname.",
        "Timing respects Friday prayer, Ramadan, and Eid where relevant; ask rather than assume observance.",
        "A phone or in-person path exists for people without broadband or comfort with online accounts.",
      ],
      whoToInvolve: [
        ...COMMON_INVOLVE,
        "Involve community-based Somali organizations and mosques named by the family as partners. Include an imam in case planning only when the family asks.",
        "Do not expect Somali-speaking colleagues to interpret without compensation or to represent the entire community.",
      ],
      whatNotToAssume: [
        "Do not assume Cedar-Riverside or the metro; Greater Minnesota is part of the map.",
        "Do not ask about clan as an icebreaker or treat it as a risk factor; if the family names it, listen.",
        "Do not assume that a smile, silence, or hospitality is consent to a plan.",
        "Do not fold this household into an African American or Oromo brief because both are Black or East African.",
        "Do not treat religious observance as uniform; ask this family.",
      ],
    },
    level2: [
      {
        heading: "Language access",
        body: "Standard Somali, Maay, and Benadiri may require different interpreters. Arabic is used for religion, and many second-generation people use English. When an exception is available only in English, a household that cannot use English may not be able to access it.",
      },
      {
        heading: "Disability, autism, and public systems",
        body: "Community concern about autism identification in Minneapolis is public. A 2014 Minnesota Department of Health qualitative study with Somali parents described shame and blame, wait lists, English-only meetings, fear of housing loss, and the wish for peers who share a language. Both the fear and the system's dismissals are real. Help-seeking that turned into a child-protection report is part of this history.",
      },
      {
        heading: "Faith and family in daily life",
        body: "Prayer, Ramadan, Eid, halal food, modesty, and honor shape daily life for many families. Elders often speak first; decisions may be family decisions. Civil war and resettlement also put many Somali women in work, business, and household finance. Both can be true in the same room.",
      },
      {
        heading: "History, trust, and public systems",
        body: "Distrust of government after war, camps, and surveillance has a clear history. After public attacks on the community, a DHS badge may not automatically be understood as a sign of help. Mental-health stigma and war trauma may both shape a person's experience. Minnesota writing has described a triple jeopardy: Black, Muslim, and immigrant. Cultural context is incomplete unless it also considers these structural conditions.",
      },
    ],
    sources: [
      { label: "Minnesota Compass, Somali cultural community profile", note: "Ancestry counts and geography; include the source date when citing this information.", href: "https://www.mncompass.org/" },
      { label: "Minnesota Department of Health, 2014 Somali autism qualitative study", note: "Parent experience with identification and services; verify the current citation." },
      { label: "Community self-description", note: "Community-informed description is pending source and representation review." },
    ],
    observances: [
      { title: "Ramadan and Eid al-Fitr", when: "Lunar calendar; dates shift each year", atWork: "Avoid scheduling required meetings at fast-breaking time; ask before assuming observance." },
      { title: "Eid al-Adha", when: "Lunar calendar", atWork: "Ask about availability; do not assume." },
    ],
    relatedPathIds: ["gp-3", "gp-1", "gp-2"],
    tags: ["somali", "east african", "muslim", "refugee", "maay", "language access", "twin cities", "greater minnesota"],
    provenance: LIVE,
  },
  {
    id: "hmong",
    title: "Hmong Minnesotans",
    kicker: "Community brief",
    status: "under_review",
    owner: OWNER,
    reviewDate: REVIEW,
    representationReview: "pending",
    languages: ["Hmong (White Hmong, Hmong Daw)", "Hmong (Green Hmong, Mong Leng)", "English (second and third generation)"],
    level0: {
      whoAndWhere:
        "The United States ran a Secret War in Laos; Hmong forces allied with the CIA. After 1975 came persecution, camps in Thailand, and refugee resettlement. St. Paul is a national hub. Most Hmong Minnesotans live in the Twin Cities; many are second and third generation.",
      whyItMattersForDhsWork:
        "A broad 'Asian' category does not provide enough information to meet a person's needs. White Hmong and Green Hmong are not always interchangeable when arranging an interpreter. Clan may shape who speaks and who helps, and Hmong naming practices may not fit forms built around first, middle, and last names.",
      withinGroupDiversity:
        "Traditional healing and Christianity are both widespread. Elders and U.S.-born youth may differ sharply on language and family authority. Clan matters for some families and not for others.",
    },
    names: {
      preferred: ["Hmong", "Hmong Minnesotan", "Hmong American"],
      alsoUsed: ["Mong (used by some Green Hmong speakers)"],
      note: "Clan names are shared by many people; given names may change at marriage or with an honorific for men. Ask how the person wants to be addressed.",
      uncertainty: "Spelling of the language name itself (Hmong, Mong) is contested among speakers; follow the person.",
    },
    level1: {
      whatToAsk: [
        "Which Hmong should we book: White Hmong or Green Hmong?",
        "Who should be in the room for this decision?",
        "Are there traditional healers or church leaders the family wants involved? Do not add them unless named.",
        "How are names written on your documents?",
      ],
      accessChecks: [
        "Interpreter request specifies the dialect.",
        "Written Hmong literacy varies; do not assume a translated notice is readable by every household.",
        "Family definitions on forms may miss who actually cares for a child; note the gap.",
        "Timing around Hmong New Year (late fall) and family obligations; ask.",
      ],
      whoToInvolve: [
        ...COMMON_INVOLVE,
        "Hmong-serving organizations the family names, as partners with purpose and compensation.",
        "Do not expect Hmong-speaking colleagues to teach others about the entire community.",
      ],
      whatNotToAssume: [
        "Do not assume that nodding or a quiet response means agreement; a person may remain quiet even when a plan does not fit their household.",
        "Do not use clan as an icebreaker or collect it as data.",
        "Do not treat Hmong New Year as Chinese New Year.",
        "Do not assume deportation or profiling anxiety is folklore; it is current structure for some families.",
      ],
    },
    level2: [
      {
        heading: "Healing and disability",
        body: "Traditional healing and shamanism shape what illness means for many families; Christianity is also widespread. Hmong parents of children with autism have described late identification, unclear meaning of the word, stigma, and professionals who were not responsive. Under-identification in one community can exist alongside over-concern in another; both service systems and cultural understandings matter.",
      },
      {
        heading: "Family, ancestors, and respect",
        body: "Family and clan reputation matter. Respect for elders and ancestors is expected. Treat resilience as lived history, not as a slogan.",
      },
    ],
    sources: [
      { label: "Minnesota Compass, Hmong cultural community profile", note: "Counts and geography; include the source date when citing this information.", href: "https://www.mncompass.org/" },
      { label: "Minnesota Department of Health, 2014 autism qualitative study (Hmong parents)", note: "Verify the current citation." },
    ],
    observances: [{ title: "Hmong New Year", when: "Late November to December in St. Paul", atWork: "Public celebrations; attend respectfully as a guest rather than treating the event as a research opportunity." }],
    relatedPathIds: ["gp-3", "gp-2"],
    tags: ["hmong", "southeast asian", "laos", "refugee", "st. paul", "clan", "language access"],
    provenance: LIVE,
  },
  {
    id: "karen",
    title: "Karen Minnesotans",
    kicker: "Community brief",
    status: "under_review",
    owner: OWNER,
    reviewDate: REVIEW,
    representationReview: "pending",
    languages: ["S'gaw Karen", "Pwo Karen", "Burmese", "English"],
    level0: {
      whoAndWhere:
        "Karen (Kayin) people from Burma/Myanmar lived through decades of conflict with the Burmese state, long stays in camps in Thailand, and resettlement into the Twin Cities and Greater Minnesota, including southern Minnesota towns.",
      whyItMattersForDhsWork:
        "A broad 'Burmese' or 'Asian' category may keep a Karen person from receiving the right support. S'gaw and Pwo may require different interpreters. Services must also reach Karen communities in rural Minnesota, not only St. Paul.",
      withinGroupDiversity: "Baptist and Buddhist streams both live here. Literacy in the language of the form is not guaranteed.",
    },
    names: {
      preferred: ["Karen"],
      alsoUsed: ["Kayin (official Burmese usage)", "Burmese (a national label, not this community)"],
      note: "Ask which Karen language the household speaks and how names appear on documents.",
    },
    level1: {
      whatToAsk: ["S'gaw or Pwo Karen?", "Who should be in the room?", "Which church or community organization, if any, does the family want involved?", "Do you agree with this plan? Please tell me if not."],
      accessChecks: ["Dialect on the interpreter request.", "Church networks are often the real information channel; a mailed notice may not be.", "Transportation and distance in Greater Minnesota counties."],
      whoToInvolve: [...COMMON_INVOLVE, "Karen-led organizations in Minnesota, as partners."],
      whatNotToAssume: ["Do not assume a smile or quiet endurance is consent.", "Do not rely on a single news story for cultural context about Burma or Myanmar.", "Do not assume the family lives in the Twin Cities."],
    },
    sources: [{ label: "Community self-description", note: "Community-informed description is pending source and representation review." }],
    relatedPathIds: ["gp-3"],
    tags: ["karen", "burma", "myanmar", "refugee", "greater minnesota", "s'gaw", "pwo"],
    provenance: LIVE,
  },
  {
    id: "oromo",
    title: "Oromo Minnesotans",
    kicker: "Community brief",
    status: "under_review",
    owner: OWNER,
    reviewDate: REVIEW,
    representationReview: "pending",
    languages: ["Afaan Oromoo", "Amharic (some)", "English"],
    level0: {
      whoAndWhere:
        "Oromo people are the largest nation in the Horn of Africa by language; there is no Oromo nation-state. Minnesota holds one of the largest Oromo communities outside Africa, concentrated in the Twin Cities. Counts disagree widely by method; date the number you cite.",
      whyItMattersForDhsWork:
        "Oromo is distinct from Somali and Amharic, and 'Ethiopian' is not a substitute for Oromo identity. An interpreter requested only as 'Ethiopian' may not meet the person's language needs. Oromo naming practices are also distinct from Amharic and Somali naming practices.",
      withinGroupDiversity: "Islam, Christianity, and Waaqeffanna all live here; do not assume a Somali religious pattern. U.S.-born children may have never lived in Oromia.",
    },
    names: {
      preferred: ["Oromo", "Oromo Minnesotan"],
      alsoUsed: ["Ethiopian (umbrella; not a substitute)"],
      note: "Book Afaan Oromoo on the interpreter line. Ask how names appear on documents.",
      uncertainty: "Community counts range widely between community estimates and census-based figures; state the source and date.",
    },
    level1: {
      whatToAsk: ["Should we book Afaan Oromoo?", "Who should be in the room?", "How would you like to be addressed?"],
      accessChecks: ["Afaan Oromoo, not Amharic or Somali, on the request.", "Translated notices reviewed by an Afaan Oromoo speaker.", "Greater Minnesota households exist; do not assume the metro."],
      whoToInvolve: [...COMMON_INVOLVE, "Oromo community organizations and congregations the family names."],
      whatNotToAssume: ["Do not use a Somali or broad 'Ethiopian' brief in place of Oromo-specific context.", "Keep the service meeting focused on the person's needs rather than asking them to explain or resolve Ethiopian politics.", "Do not assume a religious pattern."],
    },
    sources: [{ label: "Minnesota Compass (Ethiopian umbrella profile)", note: "Umbrella count; not an Oromo census.", href: "https://www.mncompass.org/" }],
    relatedPathIds: ["gp-3"],
    tags: ["oromo", "east african", "ethiopia", "afaan oromoo", "language access"],
    provenance: LIVE,
  },
  {
    id: "african-american",
    title: "African American and Black Minnesotans",
    kicker: "Community brief",
    status: "under_review",
    owner: OWNER,
    reviewDate: REVIEW,
    representationReview: "pending",
    languages: ["English"],
    level0: {
      whoAndWhere:
        "U.S.-born African Americans in Minnesota carry the history of enslavement, the Great Migration, the destruction of Rondo, Northside Minneapolis, policing, and the murder of George Floyd. Minnesota ranks high on quality of life and produces some of the worst racial gaps in the country in education, wealth, homeownership, and criminal legal contact; this has been called the Minnesota Paradox.",
      whyItMattersForDhsWork:
        "Color-blind approaches can hide the unequal results a process continues to produce, including disproportionate out-of-home placement. Minnesota law on African American family preservation requires active efforts and family cultural values in case planning; a training is not a substitute.",
      withinGroupDiversity:
        "African immigrants and refugees—including Liberian, Nigerian, Ethiopian, Ghanaian, Somali, Oromo, and other communities—come from different nations, languages, and class backgrounds, and may have different relationships to 'Black' identity in the United States. These communities are not interchangeable.",
    },
    names: {
      preferred: ["Black", "African American"],
      alsoUsed: ["Black Minnesotan", "African immigrant communities by their own names"],
      note: "Ask which term the person uses. Do not assume that guidance written for Somali Minnesotans applies to an African American family from Chicago.",
    },
    level1: {
      whatToAsk: [
        "Who is family here: extended kin, fictive kin, church, community? Who should be in the room?",
        "What has happened before with this agency or with police-involved referrals that we should know?",
        "What would make this process feel fair to you?",
      ],
      accessChecks: [
        "Case plans that do not recognize a grandmother, aunt, or other important kin may exclude meaningful family support. Check how the form defines family.",
        "Plain language in notices; appeal rights explained in person.",
        "Review who is denied, delayed, or placed by race in your program's own data before you design.",
      ],
      whoToInvolve: [
        "Equity Director or administration steward.",
        "Black-led community organizations named by the family or listed in the relevant program resources, with compensation and report-back.",
        "The policy or legal owner for any question about the family-preservation statute; this program does not interpret it.",
      ],
      whatNotToAssume: [
        "Do not assume 'Minnesota Nice' neutrality is neutral for this family.",
        "Do not fold African immigrant households into this brief, or this family into an immigrant brief.",
        "Do not read directness as hostility or quiet as agreement.",
        "Understand the state's documented racial disparities before making decisions that affect families.",
      ],
    },
    level2: [
      {
        heading: "Child welfare and family preservation",
        body: "African American children in Minnesota have been about twice as likely as white peers to be placed in out-of-home care. The Minnesota African American Family Preservation and Child Welfare Disproportionality Act requires active efforts and incorporation of the family's social and cultural values in case planning and reunification. That is statute; verify the current text with the policy owner.",
      },
      {
        heading: "Kinship and family preservation",
        body: "Extended kin, fictive kin, churches, and community care can be central sources of family support. Ancestral and spiritual practices vary and may include Baptist, COGIC, Muslim, African traditional, or no religious practice. Ask the family what matters to them.",
      },
    ],
    sources: [
      { label: "Minnesota African American Family Preservation and Child Welfare Disproportionality Act", note: "Verify current statute text with the policy owner; this program does not interpret it." },
      { label: "Minnesota Compass, Black or African American profile", note: "Include the source date when citing this information.", href: "https://www.mncompass.org/" },
    ],
    observances: [{ title: "Juneteenth", when: "June 19", atWork: "Observed as a holiday; do not schedule required sessions." }],
    relatedPathIds: ["gp-3", "gp-2", "gp-1"],
    tags: ["black", "african american", "minnesota paradox", "child welfare", "rondo", "kinship"],
    provenance: LIVE,
  },
  {
    id: "latino",
    title: "Latino and Spanish-speaking Minnesotans",
    kicker: "Community brief",
    status: "under_review",
    owner: OWNER,
    reviewDate: REVIEW,
    representationReview: "pending",
    languages: ["Spanish (many national varieties)", "Indigenous languages of Mexico and Central America (some households)", "English"],
    level0: {
      whoAndWhere:
        "Latino Minnesotans include long-settled families, recent arrivals, and U.S.-born generations with roots in Mexico, Central and South America, Puerto Rico, and the Caribbean. A large share lives outside the Twin Cities, in dairy, meatpacking, and farm counties.",
      whyItMattersForDhsWork:
        "'Spanish' on a form is one language among many, and some households speak an Indigenous language first. Immigration status fear shapes help-seeking even for citizens in mixed-status families. Greater Minnesota distance and shift work are access facts.",
      withinGroupDiversity: "National origin, Indigenous identity, generation, faith, class, and legal status differ widely. Puerto Ricans are U.S. citizens. Do not assume one 'Hispanic' culture.",
    },
    names: {
      preferred: ["Latino", "Latina", "Hispanic (used by many)", "national-origin terms (Mexican, Salvadoran, Puerto Rican)"],
      alsoUsed: ["Latinx", "Latine (used by some, contested)"],
      note: "Two surnames are common, and forms that keep only one can create errors in a person's record. Ask which term the person uses for themselves.",
      uncertainty: "Term preference is contested and generational; ask.",
    },
    level1: {
      whatToAsk: ["Which language, and is Spanish the first language?", "How are your surnames written on your documents?", "Who should be in the room?", "What times work with your shift?"],
      accessChecks: ["Spanish interpreter with the right variety; ask about Indigenous languages.", "Forms accept two surnames.", "No requirement to disclose immigration status for a listening session.", "Evening or weekend options; phone paths that do not require broadband."],
      whoToInvolve: [...COMMON_INVOLVE, "Latino-led organizations and parish networks the family names."],
      whatNotToAssume: ["Do not assume immigration status, or that citizens are unaffected by status fear.", "Do not assume the metro.", "Do not assume Spanish is the first language."],
    },
    sources: [{ label: "Minnesota Compass, Hispanic or Latino profile", note: "Include the source date when citing this information; the Greater Minnesota share is notable.", href: "https://www.mncompass.org/" }],
    relatedPathIds: ["gp-3", "gp-2"],
    tags: ["latino", "hispanic", "spanish", "mexican", "greater minnesota", "immigration", "two surnames"],
    provenance: NEW,
  },
  {
    id: "vietnamese",
    title: "Vietnamese Minnesotans",
    kicker: "Community brief",
    status: "under_review",
    owner: OWNER,
    reviewDate: REVIEW,
    representationReview: "pending",
    languages: ["Vietnamese", "English"],
    level0: {
      whoAndWhere: "Vietnamese Minnesotans include refugees who arrived after 1975, later family reunification, and U.S.-born generations, mostly in the Twin Cities.",
      whyItMattersForDhsWork: "Elders may need Vietnamese for vital conversations while younger relatives use English; do not let a child interpret. Name order (family name first) breaks forms that assume otherwise.",
      withinGroupDiversity: "Buddhist, Catholic, and secular households; refugee-era and later arrivals; wide generational differences.",
    },
    names: { preferred: ["Vietnamese", "Vietnamese American"], alsoUsed: [], note: "Family name comes first in Vietnamese order; ask how the person wants to be addressed and how documents list names." },
    level1: {
      whatToAsk: ["Would you like a Vietnamese interpreter for this conversation?", "Who should be in the room?", "How do your documents list your name?"],
      accessChecks: ["Professional interpreter, not a family member.", "Name order on forms.", "Translated vital notices with human review."],
      whoToInvolve: [...COMMON_INVOLVE],
      whatNotToAssume: ["Do not assume a younger relative should interpret.", "Do not assume faith or politics."],
    },
    sources: [{ label: "Minnesota Compass, Vietnamese profile", note: "Include the source date when citing this information.", href: "https://www.mncompass.org/" }],
    relatedPathIds: ["gp-3"],
    tags: ["vietnamese", "southeast asian", "refugee", "language access"],
    provenance: NEW,
  },
  {
    id: "khmer",
    title: "Cambodian (Khmer) Minnesotans",
    kicker: "Community brief",
    status: "under_review",
    owner: OWNER,
    reviewDate: REVIEW,
    representationReview: "pending",
    languages: ["Khmer", "English"],
    level0: {
      whoAndWhere: "Cambodian Minnesotans include survivors of the Khmer Rouge era and their U.S.-born children and grandchildren.",
      whyItMattersForDhsWork: "War and genocide trauma can sit alongside mental-health stigma; older adults may need Khmer for vital conversations. Do not press for history.",
      withinGroupDiversity: "Buddhist temples are central for some families and not others; generations differ sharply on language.",
    },
    names: { preferred: ["Cambodian", "Khmer"], alsoUsed: ["Cambodian American"], note: "Khmer names may be listed family-name first; ask." },
    level1: {
      whatToAsk: ["Khmer interpreter for this conversation?", "Who should be in the room?"],
      accessChecks: ["Interpreter booked; no family interpreting.", "Trauma-aware scheduling: do not require retelling of history."],
      whoToInvolve: [...COMMON_INVOLVE],
      whatNotToAssume: ["Do not assume trauma or its absence.", "Do not lump with other Southeast Asian communities."],
    },
    sources: [{ label: "Community self-description", note: "A community-informed source and representation review are still needed." }],
    relatedPathIds: ["gp-3"],
    tags: ["cambodian", "khmer", "southeast asian", "refugee"],
    provenance: NEW,
  },
  {
    id: "lao",
    title: "Lao Minnesotans",
    kicker: "Community brief",
    status: "under_review",
    owner: OWNER,
    reviewDate: REVIEW,
    representationReview: "pending",
    languages: ["Lao", "English"],
    level0: {
      whoAndWhere: "Lao Minnesotans arrived as refugees after 1975 and through later family reunification; Lao and Hmong are distinct peoples from the same country.",
      whyItMattersForDhsWork: "'Laotian' on a form can mean Lao, Hmong, or other groups; book the actual language.",
      withinGroupDiversity: "Buddhist and Christian households; generations differ on language.",
    },
    names: { preferred: ["Lao"], alsoUsed: ["Laotian (national label)"], note: "Ask which language and how names appear on documents." },
    level1: {
      whatToAsk: ["Lao interpreter, or a different language?", "Who should be in the room?"],
      accessChecks: ["Language, not nationality, on the request.", "Translated vital notices reviewed by a Lao speaker."],
      whoToInvolve: [...COMMON_INVOLVE],
      whatNotToAssume: ["Do not assume Hmong and Lao are the same brief."],
    },
    sources: [{ label: "Community self-description", note: "A community-informed source and representation review are still needed." }],
    relatedPathIds: ["gp-3"],
    tags: ["lao", "laotian", "southeast asian", "refugee"],
    provenance: NEW,
  },
  {
    id: "russian-speaking",
    title: "Russian-speaking Minnesotans",
    kicker: "Community brief",
    status: "under_review",
    owner: OWNER,
    reviewDate: REVIEW,
    representationReview: "pending",
    languages: ["Russian", "Ukrainian", "English"],
    level0: {
      whoAndWhere: "Russian-speaking Minnesotans come from many countries of the former Soviet Union, including refugees of earlier decades and recent Ukrainian arrivals.",
      whyItMattersForDhsWork: "Russian is a shared language across people with very different national identities; for Ukrainian households, assuming Russian identity can be a harm. Book the language the person asks for.",
      withinGroupDiversity: "Jewish, Orthodox Christian, evangelical, and secular households; national identities that may be in conflict.",
    },
    names: { preferred: ["Russian-speaking (as a language group)", "national-origin terms (Ukrainian, Belarusian, and others)"], alsoUsed: [], note: "Patronymics are common; ask how the person wants to be addressed.", uncertainty: "National identity is sensitive; ask rather than infer from language." },
    level1: {
      whatToAsk: ["Which language should we book: Russian or Ukrainian?", "How would you like to be addressed?", "Who should be in the room?"],
      accessChecks: ["Interpreter language matches the request.", "Notices in the requested language, reviewed."],
      whoToInvolve: [...COMMON_INVOLVE],
      whatNotToAssume: ["Do not infer nationality or politics from language.", "Do not assume religion."],
    },
    sources: [{ label: "Community self-description", note: "A community-informed source and representation review are still needed." }],
    relatedPathIds: ["gp-3"],
    tags: ["russian", "ukrainian", "eastern european", "refugee"],
    provenance: NEW,
  },
  {
    id: "arabic-speaking",
    title: "Arabic-speaking Minnesotans",
    kicker: "Community brief",
    status: "under_review",
    owner: OWNER,
    reviewDate: REVIEW,
    representationReview: "pending",
    languages: ["Arabic (many regional varieties)", "English"],
    level0: {
      whoAndWhere: "Arabic-speaking Minnesotans come from many countries, including Iraq, Syria, Lebanon, Egypt, Sudan, Yemen, and Palestine, with refugee, immigrant, and U.S.-born generations.",
      whyItMattersForDhsWork: "Arabic varieties differ enough that an interpreter from one region may not serve another well; Arabic is also a religious language for many non-Arab Muslims, which is not the same as a household language.",
      withinGroupDiversity: "Muslim, Christian, and secular households; national identities and dialects vary widely.",
    },
    names: { preferred: ["Arabic-speaking (as a language group)", "national-origin terms"], alsoUsed: ["Arab American"], note: "Ask which variety of Arabic and how names appear on documents." },
    level1: {
      whatToAsk: ["Which variety of Arabic, and from which country?", "Would you like a gender-matched interpreter?", "Who should be in the room?"],
      accessChecks: ["Regional variety on the request when possible.", "Vital notices translated with human review."],
      whoToInvolve: [...COMMON_INVOLVE],
      whatNotToAssume: ["Do not assume religion from language.", "Do not assume Somali or Oromo households want Arabic; ask."],
    },
    sources: [{ label: "Community self-description", note: "A community-informed source and representation review are still needed." }],
    relatedPathIds: ["gp-3"],
    tags: ["arabic", "middle east", "north africa", "refugee", "language access"],
    provenance: NEW,
  },
  {
    id: "deaf-deafblind-hard-of-hearing",
    title: "Deaf, DeafBlind, and hard of hearing Minnesotans",
    kicker: "Community brief",
    status: "under_review",
    owner: OWNER,
    reviewDate: REVIEW,
    representationReview: "pending",
    languages: ["American Sign Language", "Protactile and tactile ASL (DeafBlind)", "English (written, captioned)"],
    level0: {
      whoAndWhere: "Deaf people who use American Sign Language are a cultural and linguistic community, not only a disability category. Hard of hearing and late-deafened people may prefer captioning and assistive listening. DeafBlind people may use tactile or Protactile communication.",
      whyItMattersForDhsWork: "Effective communication is a legal obligation. Exchanging written notes is not equally effective for a Deaf person who uses sign language, and a family member is not an interpreter. Your process must work with video relay and captioned phone calls.",
      withinGroupDiversity: "ASL users, oral communicators, cochlear implant users, late-deafened elders, DeafBlind people, and Deaf people from immigrant communities who use other sign languages.",
    },
    names: { preferred: ["Deaf (cultural, capital D)", "deaf", "hard of hearing", "DeafBlind"], alsoUsed: [], note: "Do not use 'hearing impaired'. Ask the person's preference." },
    level1: {
      whatToAsk: ["How would you like to communicate today: ASL interpreter, captioning, written English, or something else?", "Do you use video relay or a captioned phone?", "Who should be in the room?"],
      accessChecks: ["Qualified ASL interpreter or CART booked in advance; not a family member.", "Videos captioned; phone processes have a relay-compatible path.", "Visual alerts in waiting areas; written materials in plain language."],
      whoToInvolve: ["Accessibility or ADA coordinator.", "Minnesota's Deaf and Hard of Hearing Services Division as a resource (verify current contact).", "Equity Director or administration steward."],
      whatNotToAssume: ["Do not assume lip reading is enough.", "Do not assume written English is a first language for a Deaf ASL user.", "Do not assume a hearing aid means full access."],
    },
    sources: [{ label: "ADA Title II effective communication", note: "External; verify at ada.gov.", href: "https://www.ada.gov/" }],
    relatedPathIds: ["gp-2", "gp-3", "gp-5"],
    tags: ["deaf", "hard of hearing", "deafblind", "asl", "effective communication", "captioning", "accessibility"],
    provenance: NEW,
  },
  {
    id: "rural",
    title: "Rural and Greater Minnesota (place, not a race)",
    kicker: "Place brief",
    status: "under_review",
    owner: OWNER,
    reviewDate: REVIEW,
    representationReview: "pending",
    languages: ["English", "Spanish, Somali, Karen, and others by county"],
    level0: {
      whoAndWhere: "Rural experience is shaped by geography and infrastructure, including broadband, distance, hospital closures, and county capacity. Farming and mining communities are not the same. Somali families in Worthington, Mexican families in dairy counties, and the eleven Tribal Nations must be considered from the beginning.",
      whyItMattersForDhsWork: "A service that depends on reliable broadband can exclude people. County human services is often where people actually receive help. A missed visit may reflect fuel costs or winter roads rather than refusal.",
      withinGroupDiversity: "Iron Range, prairie, forest, and border towns are not one region. Name the town.",
    },
    names: { preferred: ["Greater Minnesota", "rural Minnesota"], alsoUsed: ["outstate (avoid; read as dismissive by some)"], note: "Do not use rural as code for white." },
    level1: {
      whatToAsk: ["What is the nearest office or partner, and how far is it?", "Does a phone process work for you? Does mail?", "Who in your town helps with paperwork?"],
      accessChecks: ["Phone and paper paths that do not require broadband.", "Office hours and distance as burden.", "Open the people brief for the household together with this place brief."],
      whoToInvolve: ["County human services partners.", "Equity Director or administration steward.", "Local organizations named by the household."],
      whatNotToAssume: ["Do not romanticize or pathologize.", "Do not assume voicemail or email works.", "Do not treat a no-show as character."],
    },
    sources: [{ label: "Minnesota Compass, geography profiles", note: "People-page shares outside the Twin Cities vary by community; date them.", href: "https://www.mncompass.org/" }],
    relatedPathIds: ["gp-1", "gp-3"],
    tags: ["rural", "greater minnesota", "broadband", "distance", "county"],
    provenance: LIVE,
  },
  {
    id: "tribal-nations",
    title: "Tribal Nations of Minnesota",
    kicker: "Sovereignty and consultation",
    status: "gated",
    tribalGate: true,
    owner: "Equity and Inclusion Operations Consultant",
    reviewDate: REVIEW,
    representationReview: "pending",
    languages: ["Ojibwe", "Dakota", "English"],
    level0: {
      whoAndWhere: "Eleven federally recognized Tribal Nations share geography with Minnesota. Each is a sovereign government with its own name, laws, leadership, and consultation process. Urban Native people also live throughout the state. This page explains when staff should seek government-to-government guidance; it does not provide Nation-specific guidance.",
      whyItMattersForDhsWork: "When work may affect a Tribal Nation, Native children, Tribal data, services, or land, contact the designated Tribal relations office or liaison before planning consultation or engagement. A general community meeting is not government-to-government consultation.",
      withinGroupDiversity: "Each Nation is distinct. Do not infer a person's Tribal citizenship, community ties, language, or residence.",
    },
    names: { preferred: ["The Nation's own name (for example Red Lake Nation, Lower Sioux Indian Community)"], alsoUsed: ["American Indian", "Native American", "Indigenous"], note: "Name the Nation. Do not use a demographic count as a substitute for a government." },
    level1: {
      whatToAsk: ["Could this work affect a Tribal Nation, Native children, Tribal data, services, or land? If so, contact the designated Tribal relations office or liaison before planning consultation or engagement."],
      accessChecks: ["This referral page does not provide Nation-specific access guidance. Ask the designated Tribal relations office or liaison which process and contacts apply."],
      whoToInvolve: ["Before planning consultation or engagement, contact the Office of Indian Policy or current designated Tribal relations office or liaison and follow the required process.", "Work with the Nation's government through the process it designates."],
      whatNotToAssume: ["Do not infer Tribal citizenship or community ties.", "Do not place a sovereign Nation in a general community partner list.", "Do not use general cultural information as a substitute for consultation with the Nation."],
    },
    sources: [{ label: "DHS Tribal and Urban Indian Relations", note: "Use the current DHS contact and guidance before planning consultation or engagement.", href: "https://mn.gov/dhs/partners-and-providers/program-overviews/tribal-and-urban-indian-relations/" }],
    relatedPathIds: ["gp-3", "gp-1"],
    tags: ["tribal", "nation", "ojibwe", "dakota", "sovereignty", "consultation", "ICWA", "indian policy"],
    provenance: "This page provides a referral only. The program does not offer Nation-specific guidance.",
  },
];

export function getBrief(id: string): CommunityBrief | undefined {
  return BRIEFS.find((b) => b.id === id);
}

export function listBriefs(): CommunityBrief[] {
  return BRIEFS;
}
