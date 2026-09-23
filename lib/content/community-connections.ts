import { defineEditableSurface } from './editable-surface-contract';

export const CONNECTION_TOPICS = ['employment', 'housing', 'community', 'evidence'] as const;
const copy = {
  title: 'Community engagement: from input to action',
  intro: 'Connect a decision with the people it affects, the knowledge they bring, and the changes that follow.',
  back: 'Equity Analysis Toolkit',
  sourceNote: 'Program-authored practice informed by the ADSA Outreach and Engagement Guide, April 2026. The original guidance remains unchanged. Follow the applicable agency processes for official work.',
  employmentTitle: 'Employment and transitions',
  housingTitle: 'Housing and community living',
  communityTitle: 'Community knowledge and participation',
  evidenceTitle: 'Data and research',
  relationshipNote: 'These are starting points, not an exhaustive partner list. E1MN documents a state agency partnership. Other listings identify relevant resources, not a claim of a formal DSD agreement. Confirm current services, geographic reach, and arrangements before planning together.',
  planningTitle: 'What can change because people participate?',
  planningIntro: 'An invitation is a beginning. Meaningful engagement also makes room for influence, disagreement, and a response from the people responsible for the decision.',
  questions: [
    'What decision is still open, who can make it, and what can participants influence?',
    'Whose experience is missing, including people who could not access the service or take part previously?',
    'Which existing relationships could help, and who should participate directly rather than be represented by an organization?',
    'What language, communication, transportation, technology, timing, or rural-access barriers need attention?',
    'What compensation and participation supports can be offered through approved arrangements, and who will confirm them?',
    'How will participants review the way their experiences are represented and choose how their contributions may be used?',
    'What changed, what did not change, why, and when will participants hear back?',
  ],
  exampleTitle: 'A fictional employment-planning example',
  exampleIntro: 'A team is preparing an employment-support learning session. It first proposes a weekday online meeting and an online interest form. Community members explain that the timing conflicts with work, some need communication support, and others have unreliable internet access.',
  activityTitle: 'Activity', activity: 'The team holds two conversations. Attendance describes participation, but does not establish that the approach was effective.',
  influenceTitle: 'Influence on the decision', influence: 'The team revises the plan to offer a phone response option, different meeting times, and a way to request communication support. It records which suggestions it could act on and which need another decision-maker.',
  resultTitle: 'Results to examine', result: 'After the revised session, the team asks whether people could participate in their preferred way and whether the information helped them identify a next step. It checks whose experience is still missing. It does not infer improved employment outcomes from attendance.',
  returnTitle: 'Report back and revisit', return: 'Participants receive an accessible summary of what changed, what remains unresolved, and who will follow up. They can correct the summary and explain whether it reflects their contributions.',
  objectivesTitle: 'After this example, you can',
  objectives: ['Distinguish an activity count from evidence of a result.', 'Identify a choice that participants can influence.', 'Connect a participation barrier with a practical adjustment.', 'Explain how participants will hear back and correct the account.'],
  evidenceNote: 'Check the reporting period, population, definitions, and missing data before drawing conclusions. Group differences invite investigation; a dashboard alone does not establish their cause. Use the accessible alternatives offered by the source. Public dashboards are not the internal equity-submission tracker.',
  tribalNote: 'Engagement with community organizations does not replace government-to-government Tribal consultation. Seek the appropriate guidance when a decision may have Tribal implications.',
};
export const COMMUNITY_CONNECTIONS_SURFACE = defineEditableSurface({
  surfaceId: 'community-connections.home', route: '/learn/community-connections', scopePolicy: 'inheritable', label: 'Community engagement and resources',
  fields: [
    ...Object.entries(copy).map(([key,value]) => ({key,label:key,kind:Array.isArray(value) ? 'string-list' as const : 'long' as const,required:true})),
    ...CONNECTION_TOPICS.map(topic => ({key:`${topic}Links`,label:`${topic} resources`,kind:'link-list' as const,required:true})),
  ],
  approvedValues: {...copy,
    employmentLinks: [
      {label:'E1MN: DHS, DEED, and Education employment alignment',href:'https://www.dhs.state.mn.us/main/idcplg?IdcService=GET_DYNAMIC_CONVERSION&RevisionSelectionMethod=LatestReleased&dDocName=mndhs-074455'},
      {label:'Department of Labor and Industry: disability employment information',href:'https://www.dli.mn.gov/business/employment-practices/worker-disability-employment-information'},
      {label:'PACER: transition planning for families',href:'https://media.pacer.org/php/php-c157.pdf'},
      {label:'University of Minnesota: employment-provider technical assistance',href:'https://mti.ici.umn.edu/providers'},
    ],
    housingLinks: [
      {label:'DEED: regional Centers for Independent Living',href:'https://mn.gov/deed/job-seekers/disabilities/independent/'},
      {label:'PACER: navigating housing and services',href:'https://media.pacer.org/php/php-a83.pdf'},
      {label:'University of Minnesota: community-living research and training',href:'https://ici.umn.edu/welcome/centers'},
    ],
    communityLinks: [
      {label:'Multicultural Autism Action Network: education and training',href:'https://www.maanmn.org/training'},
      {label:'Governor’s Council on Developmental Disabilities: advocacy and learning',href:'https://www.mn.gov/mnddc/index.html'},
      {label:'Community briefs: preparation for asking better questions',href:'/minnesota-communities'},
    ],
    evidenceLinks: [
      {label:'DHS: LTSS demographic dashboard and accessible spreadsheets',href:'https://mn.gov/dhs/partners-and-providers/news-initiatives-reports-workgroups/long-term-services-and-supports/public-planning-performance-reporting/performance-reports/demographic-dashboard/'},
      {label:'DHS: LTSS performance measures and accessible spreadsheets',href:'https://mn.gov/dhs/partners-and-providers/news-initiatives-reports-workgroups/long-term-services-and-supports/public-planning-performance-reporting/performance-reports/performance-measures-dashboard/'},
      {label:'Minnesota Department of Health: health-equity data',href:'https://data.web.health.state.mn.us/en/web/mndata/equity'},
      {label:'Wilder Research: research publications',href:'https://www.wilder.org/wilder_research/'},
    ],
  },
});
