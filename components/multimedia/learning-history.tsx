import Image from "next/image";

type HistoryEntry = { date: string; text: string; source: string; sourceTitle: string };
export const LEARNING_HISTORY: readonly { courseId: string; lessonId: string; title: string; introduction: string; entries: HistoryEntry[]; question: string; note?: string }[] = [
  { courseId: "cultural-intelligence-hmong", lessonId: "ci-hmong-orientation-2", title: "Read the dates without assigning a life story", introduction: "This selected timeline connects war, displacement and resettlement. It supplies public history; a person decides what they want to share about their own life.", entries: [
    { date: "1961", text: "U.S.-supported recruitment of Hmong forces in Laos expanded during the conflict known as the Secret War.", source: "https://www.mnhs.org/hmong/hmong-timeline", sourceTitle: "MNHS: Hmong timeline" },
    { date: "1975", text: "As the war ended, some Hmong families were airlifted to Thailand; many others escaped on foot. Refugee camps became part of many families' journeys.", source: "https://www.mnhs.org/hmong/hmong-timeline", sourceTitle: "MNHS: Hmong timeline" },
    { date: "November 1975", text: "MNHS dates the first Hmong family's resettlement in Minnesota to November 1975.", source: "https://www.mnhs.org/hmong/hmong-timeline", sourceTitle: "MNHS: Hmong timeline" },
    { date: "After 1980 and in 2004", text: "Further arrivals followed the Refugee Act of 1980. Another wave arrived after Wat Tham Krabok closed in 2004.", source: "https://www.mnhs.org/hmong/hmong-timeline", sourceTitle: "MNHS: Hmong timeline" },
  ], note: "Date comparison: the lesson above says December 1975. The linked MNHS timeline says November 1975; MNopedia identifies November 5. Use the cited source and its stated date when writing about the arrival.", question: "A fictional team meets a U.S.-born young adult and an older relative. What does this timeline help the team understand, and what must they still ask each person?" },
  { courseId: "cultural-intelligence-bosnian", lessonId: "ci-bosnian-orientation-2", title: "Keep the historical sequence and the present person distinct", introduction: "These non-graphic entries orient the lesson's history. They do not ask anyone to describe personal experiences of war.", entries: [
    { date: "1992–1995", text: "War in Bosnia and Herzegovina brought civilian targeting and mass displacement.", source: "https://main.ushmm.org/genocide-prevention/countries/bosnia-herzegovina/srebrenica-1993", sourceTitle: "USHMM: Srebrenica, 1993–1995" },
    { date: "July 1995", text: "Bosnian Serb forces committed genocide at Srebrenica after the enclave fell.", source: "https://main.ushmm.org/genocide-prevention/countries/bosnia-herzegovina/srebrenica-1993", sourceTitle: "USHMM: Srebrenica, 1993–1995" },
    { date: "December 14, 1995", text: "The peace agreement initialed at Dayton was formally signed in Paris.", source: "https://clintonwhitehouse6.archives.gov/1995/12/1995-12-22-president-letter-on-us-support-of-nato-in-bosnia.html", sourceTitle: "National Archives: December 1995 letter" },
  ], note: "Children and later generations have their own lives. A family connection to this history does not establish a person's experience, language preference or willingness to discuss it.", question: "What is a respectful way to confirm the support needed for a present-day appointment without asking the person to narrate war history?" },
  { courseId: "cultural-intelligence-cuban", lessonId: "ci-cuban-orientation-2", title: "More than one arrival period", introduction: "Read these selected periods alongside the lesson. The timeline gives historical context; it does not determine an individual's circumstances or eligibility.", entries: [
    { date: "1959 and the early 1960s", text: "The Cuban Revolution was followed by a major period of migration to the United States.", source: "https://www.loc.gov/classroom-materials/immigration/puerto-rican-cuban/crossing-the-straits/", sourceTitle: "Library of Congress: Crossing the Straits" },
    { date: "1980", text: "The Mariel boatlift brought another substantial group of Cuban arrivals.", source: "https://www.loc.gov/classroom-materials/immigration/puerto-rican-cuban/crossing-the-straits/", sourceTitle: "Library of Congress: Crossing the Straits" },
    { date: "1994", text: "A further period of departures by boat forms another part of the migration history.", source: "https://guides.loc.gov/latinx-civil-rights/cuban-adjustment-act", sourceTitle: "Library of Congress: Cuban migration chronology" },
  ], note: "Later arrivals and U.S.-born descendants are also part of Cuban American life. A date cannot tell you a person's language preference, politics or reasons for moving.", question: "A fictional household includes a recent arrival and a U.S.-born adult. What would you confirm separately instead of assigning one migration story to the household?" },
];

export const LEARNING_HISTORY_ROUTES = [
  ...LEARNING_HISTORY.map(({ courseId, lessonId }) => ({ courseId, lessonId })),
  { courseId: "cultural-intelligence-african-american", lessonId: "ci-african-american-place-5" },
  { courseId: "cultural-intelligence-american", lessonId: "ci-american-practice-13" },
];

export function LearningHistory({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  if (!LEARNING_HISTORY_ROUTES.some(x => x.courseId === courseId && x.lessonId === lessonId)) return null;
  const id = `history-${courseId}-${lessonId}`;
  const history = LEARNING_HISTORY.find(x => x.courseId === courseId && x.lessonId === lessonId);
  const isRondo = courseId === "cultural-intelligence-african-american";
  return <section aria-labelledby={id} className="my-8 rounded-2xl border border-[#d5cbbd] bg-[#faf8f3] p-5 sm:p-8">
    <p className="text-sm font-semibold uppercase tracking-wider text-[#71502f]">Read the source in context</p>
    <h2 id={id} className="mt-3 text-2xl font-bold text-[#123f60]">{history?.title ?? (isRondo ? "Rondo: a neighborhood before the highway" : "Read the number with its definition")}</h2>
    {history ? <>
      <p className="mt-4 leading-7">{history.introduction}</p>
      <ol className="ml-3 mt-6 list-none space-y-5 border-l-2 border-[#a49175] p-0 pl-6" aria-label="Selected historical timeline">
        {history.entries.map(entry => <li key={entry.date} className="relative rounded-xl bg-white p-5"><span aria-hidden="true" className="absolute -left-[33px] top-6 h-3 w-3 rounded-full bg-[#71502f]" /><h3 className="text-lg font-bold">{entry.date}</h3><p className="mt-2 leading-7">{entry.text}</p><a href={entry.source} className="mt-2 inline-block font-semibold underline">{entry.sourceTitle}</a></li>)}
      </ol>
      {history.note ? <p className="mt-5 border-t border-[#d5cbbd] pt-4 leading-7">{history.note}</p> : null}
      {courseId === "cultural-intelligence-hmong" ? <a href="https://www.mnhs.org/mnopedia/search/index/hmong-and-hmong-americans-minnesota" className="font-semibold underline">MNopedia: Hmong and Hmong Americans in Minnesota</a> : null}
      <p className="mt-5 font-semibold leading-7">{history.question}</p>
    </> : isRondo ? <>
      <p className="mt-4 leading-7">Compare an authentic streetscape with the neighborhood’s broad geographic context and MnDOT’s historical parcel map. Each shows a different part of the history.</p>
      <figure className="m-0 mt-5 rounded-xl bg-white p-4">
        <Image src="/images/learning-history/rondo-avenue-c1900.jpg" width={540} height={426} alt="Black-and-white view of Rondo Avenue around 1900, with houses, bare trees, a road and open foreground." className="mx-auto h-auto w-full max-w-[540px]" />
        <figcaption className="mt-3 text-sm leading-6">Rondo Avenue from the Josiah B. Cheney residence, 604 Rondo Avenue, around 1900. Minnesota Historical Society; listed as public domain. <a href="https://www.mnhs.org/mnopedia/search/index/place/rondo-neighborhood-st-paul" className="underline">Photograph and historical context at MNopedia</a>.</figcaption>
      </figure>
      <figure className="m-0 mt-5 rounded-xl bg-white p-4">
        <figcaption className="font-semibold">Geographic orientation — schematic, not a parcel or route-alignment map</figcaption>
        <svg viewBox="0 0 600 320" role="img" aria-labelledby={`${id}-map-title ${id}-map-desc`} className="mt-3 h-auto w-full">
          <title id={`${id}-map-title`}>Rondo’s broad historic neighborhood boundaries</title><desc id={`${id}-map-desc`}>University Avenue to the north, Selby Avenue to the south, Lexington Avenue to the west and Rice Street to the east. A band indicates that I-94 cut across the neighborhood; it does not plot the exact alignment.</desc>
          <rect x="100" y="55" width="400" height="215" rx="12" fill="#e9e0cf" stroke="#a49175" />
          <text x="300" y="34" textAnchor="middle" fontSize="18">University Avenue · north</text>
          <text x="300" y="302" textAnchor="middle" fontSize="18">Selby Avenue · south</text>
          <text x="30" y="170" transform="rotate(-90 30 170)" textAnchor="middle" fontSize="18">Lexington Avenue · west</text>
          <text x="565" y="170" transform="rotate(90 565 170)" textAnchor="middle" fontSize="18">Rice Street · east</text>
          <text x="300" y="107" textAnchor="middle" fontSize="21" fontWeight="700">Rondo neighborhood</text>
          <rect x="100" y="142" width="400" height="47" fill="#526b81" />
          <text x="300" y="171" textAnchor="middle" fill="white" fontSize="18">I-94 divided the neighborhood</text>
          <text x="300" y="231" textAnchor="middle" fontSize="16">Broad orientation only · not to scale</text>
        </svg>
        <p className="mt-3 text-sm leading-6">MNopedia describes the neighborhood’s rough boundaries as University, Selby, Rice and Lexington, and dates the highway construction that divided it to 1956–1968. <a href="https://www.mnhs.org/mnopedia/search/index/place/rondo-neighborhood-st-paul" className="underline">Read the neighborhood history</a>.</p>
      </figure>
      <div className="mt-5 rounded-xl border border-[#d5cbbd] bg-white p-5"><h3 className="text-lg font-bold">Explore the actual historical parcels</h3><p className="mt-2 leading-7">Use the mapped parcels to examine the relationship between the former neighborhood and the highway. The map opens with its own navigation and source context.</p><a href="https://experience.arcgis.com/experience/da3af29276dc4d54a571e587fc972948" className="font-semibold underline">MnDOT: Historic Rondo Parcels Within I-94</a><p className="mt-2 text-sm">Listed by the <a href="https://www.dot.state.mn.us/library/history.html" className="underline">MnDOT Library</a>.</p></div>
      <p className="mt-5 font-semibold leading-7">A fictional team is choosing a new service location. What evidence about present-day travel and participation would it need, beyond a map, before deciding who benefits and who faces a burden?</p>
    </> : <>
      <p className="mt-4 leading-7">The Census Bureau reports that the White alone, non-Hispanic population was 57.8% of the total U.S. population in the 2020 Census. That is a defined population category, not a percentage of people sharing one culture.</p>
      <div className="mt-5 overflow-x-auto rounded-xl bg-white" role="region" aria-label="Definition of the population statistic" tabIndex={0}><table className="w-full text-left"><caption className="p-4 text-left text-lg font-bold">What must travel with 57.8%</caption><tbody>{[
        ["Source and year", "U.S. Census Bureau · 2020 Census"], ["Geography", "United States"], ["Numerator category", "White alone, non-Hispanic population"], ["Denominator", "Total U.S. population"], ["What it does not measure", "A shared culture, an individual's identity or a language preference"],
      ].map(([label, value]) => <tr key={label} className="border-t border-[#d5cbbd]"><th scope="row" className="p-4 font-semibold">{label}</th><td className="p-4">{value}</td></tr>)}</tbody></table></div>
      <p className="mt-4"><a className="font-semibold underline" href="https://www.census.gov/programs-surveys/decennial-census/decade/2020/planning-management/release/faqs-race-ethnicity.html">Census Bureau: 2020 race and ethnicity definitions and results</a></p>
      <details className="mt-5 rounded-xl bg-white p-5"><summary className="cursor-pointer font-semibold">Revise this fictional claim: “57.8% of Americans share one culture.”</summary><p className="mt-3 leading-7">The statistic describes the specified race and Hispanic-origin category in the 2020 Census. It does not establish cultural uniformity. A usable sentence names the year, geography, category and denominator, then leaves cultural claims to evidence that actually addresses them.</p></details>
    </>}
    <p className="mt-5 leading-7">Use the lesson notes to record one supported observation and one question the source cannot answer.</p>
  </section>;
}
