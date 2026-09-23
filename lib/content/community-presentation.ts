// First six are the owner's explicit order. The remaining are provisional
// presentation choices, not an official CLAS population or language ranking.
// "american", "minnesota", and "european-american" were added September 14 so the
// self-examination briefs get the same featured standing as community-specific
// briefs — this program's whole-person purpose treats a dominant-culture staff
// member examining their own background as equally valid to studying someone
// else's, not a lesser or secondary use of the material.
export const FEATURED_COMMUNITY_IDS = [
  "african-american", "latino", "hmong", "somali", "karen", "oromo",
  "vietnamese", "khmer", "lao", "arabic-speaking",
  "american", "minnesota", "european-american",
] as const;

// Every brief about Native American individuals, communities, or Tribal
// Nations defers explicitly to the Office of Indian Affairs and to the
// Department of Human Services offices that handle Tribal relations and
// consultation (September 14 owner directive). This is not framed as "under
// construction" or a production timeline question — it is a standing
// deference, not a status this program will complete or expand itself.
export const NATIVE_DEFERENCE_COMMUNITY_IDS = ["native-american", "tribal-nations", "alaska-native"] as const;

export function orderCommunities<T extends { id: string; title: string }>(entries: readonly T[]): T[] {
  const ranks = new Map<string, number>(FEATURED_COMMUNITY_IDS.map((id, index) => [id, index]));
  return [...entries].sort((a, b) => (ranks.get(a.id) ?? 100) - (ranks.get(b.id) ?? 100) || a.title.localeCompare(b.title));
}

export function communityReadingGroups<T extends { heading: string }>(chapters: readonly T[]) {
  const groups: Array<{ title: string; chapters: T[] }> = [
    { title: "History and place", chapters: [] },
    { title: "Culture and everyday life", chapters: [] },
    { title: "Services, opportunity, and participation", chapters: [] },
  ];
  for (const chapter of chapters) {
    const heading = chapter.heading.toLowerCase();
    const index = /origin|histor|geograph|migration|civil rights/.test(heading) ? 0
      : /health|education|business|work|gates|human services|statistics|resources|considerations/.test(heading) ? 2 : 1;
    groups[index].chapters.push(chapter);
  }
  return groups;
}

export const COMMUNITY_QUESTIONS: Record<string, { question: string; response: string }> = {
  "african-american": { question: "A proposed housing-support process favors an uninterrupted rental history. What would you examine before recommending it?", response: "Examine whether the requirement serves its purpose, whose circumstances it excludes, and what alternative evidence could work. Historical context helps identify questions; it does not establish any particular applicant’s circumstances." },
  latino: { question: "An outreach team has translated a notice into Spanish. A participant says their preferred language is an Indigenous language spoken in Guatemala. What needs to change?", response: "Ask which language and form of communication the person prefers, then arrange appropriate language support. A Spanish translation does not establish access for every Latino person. Include people using different languages when evaluating the outreach." },
  hmong: { question: "An adult asks to include several relatives in a planning meeting. How can the team welcome that support while preserving the person’s own choices?", response: "Ask the person whom they want involved and how they want decisions discussed. Provide professional language support if needed. Family involvement and personal choice can coexist; neither is determined by community identity." },
  somali: { question: "A Somali colleague describes years of professional experience. An outreach draft nevertheless addresses everyone in the community as a newcomer unfamiliar with public services. What would you revise?", response: "Recognize the range of experience within the community. Make an introduction to services available without assuming everyone needs it. Ask community readers whether the draft reflects their lives, contributions, and questions." },
  karen: { question: "A team requests a Burmese interpreter for a Karen-speaking participant because the referral names Myanmar as the country of origin. What should happen before the meeting?", response: "Confirm the participant’s language and dialect, then arrange a suitable interpreter. Country of origin is not a reliable substitute for language preference. Give the participant a way to say whether the interpretation is working." },
  oromo: { question: "An appointment notice offers Amharic interpretation, but the person has asked for Afaan Oromoo. How would you address the mismatch?", response: "Honor the stated language preference and arrange Oromo interpretation. Record the preference accurately so the person does not have to correct it at every visit. Oromo and Amharic are not interchangeable." },
  "russian-speaking": { question: "A planning form treats Russian language preference as evidence of Russian nationality. What assumptions could that introduce?", response: "Language does not establish nationality, political beliefs, or migration history. Ask only for the information needed for the service, and let people describe their own identity and language needs." },
  "arabic-speaking": { question: "A team assumes that one Arabic translation and one religious calendar will meet everyone’s needs. What would you check?", response: "Ask about language, literacy, dialect, and scheduling preferences without presuming religion. Arabic-speaking communities include different faiths, countries of origin, and individual experiences." },
  "deaf-deafblind-hard-of-hearing": { question: "A meeting offers captions, but a DeafBlind participant cannot use the projected display. What would make participation possible?", response: "Ask the participant which communication and access arrangements work for them. Arrange those supports before the meeting and check the materials as well as the conversation. Captions alone do not meet every access need." },
  rural: { question: "A listening session is available only by video during the workday. Attendance from rural communities is low. What would you examine before interpreting that as lack of interest?", response: "Consider broadband access, work schedules, transportation, caregiving, and the available ways to respond. Offer alternatives and ask participants which arrangements would work. Low attendance alone does not explain why people could not take part." },
  american: { question: "A colleague says a team should 'just treat everyone the same' rather than learn community-specific context. Where does that instinct come from, and what does it miss?", response: "Treating a norm as universal rather than as one culture's default is itself a cultural pattern, not the absence of one. Sameness-as-fairness can miss real differences in what people need to be treated equitably. Examine the norm's own origin before applying it as neutral." },
  minnesota: { question: "A team describes their office as unfailingly polite and wonders why some colleagues and clients still describe it as hard to read or unwelcoming. What might explain the gap?", response: "Politeness and directness are not the same thing, and a room that avoids friction can still be difficult for someone whose communication style is more direct. Ask what 'welcoming' would actually look like to the person describing the gap, rather than assuming good intentions closed it." },
  "european-american": { question: "A staff member of German and Norwegian descent says they 'don't really have a culture' compared to colleagues from other backgrounds. How would you respond?", response: "Everyone operates inside a culture, including staff whose background is treated as the unmarked default. Naming the specific streams — German, Norwegian, Irish, Iron Range, or another — makes those norms visible and examinable, the same way any other community's norms are treated in this program." },
};
