import type { CoursePack, Source } from '../../source-types';
import { conceptualChecks } from './checks';

export type FoundationLesson = {
  title: string; objectives: [string, string, string]; teaching: string; example: string;
  reflection: string; action: string; question: string;
  choices: [string, string, string]; feedback: [string, string, string];
};
export type FoundationSpec = {
  id: string; number: number; title: string; subtitle: string; lessons: FoundationLesson[];
  sources: Source[]; cards: {front: string; back: string}[];
  aid: {heading: string; items: string[]}[];
};
export function foundation(spec: FoundationSpec): CoursePack {
  const html = (value: string) => value.trim().split(/\n\s*\n/).map(p => `<p>${p.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</p>`).join('');
  return {
    course: {
      id: spec.id, indexNumber: 1300 + spec.number, title: spec.title,
      seriesLabel: 'Diversity learning · Foundation', subtitle: spec.subtitle,
      scope: 'For One DHS and One DSD colleagues exploring diversity in their lives and public-service work. Participation is voluntary and lessons can be opened in any order. Examples are fictional. Keep reflection notes without identifying coworkers or members of the public. Completion does not count toward DHS-required training credits unless management, a director, or DHS leadership expressly approves an exception.',
      treatment: 'Four lessons with explanations, fictional cases, practice decisions and feedback, knowledge checks, private reflection, flashcards, and a practical job aid.',
      duration: 'About 48 minutes, plus optional practice', author: 'One DHS / One DSD — People, Access and Culture',
      coverImage: '/images/covers/stock-people-13.jpg', coverAlt: 'Two people examine an open book together; one points to a passage.',
      kind: 'course', contentType: 'foundation',
      learning: { objectives: spec.lessons.map(l => l.objectives[0]), evidence: ['Explain the distinctions in each knowledge check.', 'Compare the fictional case responses and their consequences.', 'Prepare and revisit the course job aid using a situation you choose.'], appliedNextStep: spec.lessons[3].action },
      governance: { contentOwner: 'One DHS / One DSD — People, Access and Culture', reviewers: [], evidenceDate: '2026-09-22', lastReviewed: 'Authoring and source checks, 2026-09-22; no independent reviewer recorded', nextReview: '2027-03-22 or when evidence or relevant guidance changes', updateTriggers: ['Updated research or official guidance', 'Learner feedback about accuracy, accessibility, or a stereotyping example'], relatedDoor: 'Use the responsible agency office for formal policy, employment, accommodation, or civil-rights decisions. This course supports learning rather than making those determinations.', toolkitQuestion: 'What assumption, effect, or opportunity does this example help me examine?', status: 'current' },
      lessons: spec.lessons.map((l, i) => ({
        id: `${spec.id}-${i+1}`, number: i+1, title: l.title, summary: l.objectives[0], minutes: 12,
        learning: { objective: l.objectives[0], objectives: l.objectives, takeaways: l.teaching.split(/\n\s*\n/).map(p => p.trim().match(/^.*?[.!?](?:\s|$)/)?.[0].trim() ?? p.trim()), evidence: l.action, appliedNextStep: l.action },
        scenario: {context: l.example, prompt: l.question, options: l.choices.map((label, j) => ({label, response: l.feedback[j], recommended: j === 0}))},
        transfer: {prompt: l.reflection, options: ['Explore this privately using the fictional case.', 'Apply the exercise to a situation I choose without identifying anyone.', 'Return to this practice later.']},
        blocks: [
          {type: 'text' as const, heading: l.title, body: html(l.teaching)},
          {type: 'text' as const, heading: 'A fictional example to examine', body: html(l.example)},
          {type: 'text' as const, heading: 'Practice and review', body: html(l.action)},
          {type: 'text' as const, heading: 'Private reflection', body: html(l.reflection)},
          ...(i === 0 ? [{type: 'flashcards' as const, heading: 'Concepts to carry forward', cards: spec.cards}] : []),
          {type: 'knowledgeCheck' as const, id: `${spec.id}-${i+1}-check`, question: conceptualChecks[spec.number-1][i][0], options: conceptualChecks[spec.number-1][i].slice(1,4).map((text, j) => ({text, correct: j === 0})), feedbackCorrect: conceptualChecks[spec.number-1][i][4], feedbackIncorrect: conceptualChecks[spec.number-1][i][4]},
        ],
      })),
    },
    jobAid: {title: `${spec.title}: practice guide`, subtitle: 'A reusable guide for a situation you choose', use: {purpose: spec.subtitle, remember: ['Use observable details rather than assigning motives.', 'Invite perspectives without requiring personal disclosure.', 'Keep learning separate from individual assessment or personnel decisions.'], doNext: spec.lessons[3].action}, sections: [...spec.aid, {heading:'Try the guide and revisit it',items:[spec.lessons[3].action, spec.lessons[3].reflection]}]},
    sources: spec.sources,
  };
}

export const sources = {
  privilege: {title: 'Peggy McIntosh — White Privilege: Unpacking the Invisible Knapsack', href: 'https://www.wcwonline.org/Fact-Sheets-Briefs/white-privilege-unpacking-the-invisible-knapsack-2', note: 'Original author resource on unearned racial advantages; a reflective framework, not an assessment of any individual.'},
  micro: {title: 'American Psychological Association — How to combat microaggressions', href: 'https://www.apa.org/news/podcasts/speaking-of-psychology/microaggressions', note: 'Interview with researcher Derald Wing Sue about identity-based everyday slights and responses.'},
  sue: {title: 'Sue and colleagues (2007) — Racial microaggressions in everyday life', href: 'https://www.uwindsor.ca/psychology/sites/uwindsor.ca.psychology/files/sue_et_al._2007_microaggression_in_everyday_life_implications_for_clinical_practice.pdf', note: 'Original conceptual paper; its clinical context is distinct from the original workplace exercises in this course.'},
  unesco: {title: 'UNESCO — Intercultural competences: conceptual and operational framework', href: 'https://unesdoc.unesco.org/ark:/48223/pf0000219768', note: 'Conceptual framework for intercultural dialogue, reflection, and communication; not a national-character checklist.'},
  clas: {title: 'HHS Think Cultural Health — Communication Guide', href: 'https://thinkculturalhealth.hhs.gov/education/communication-guide', note: 'Public education on cross-cultural communication; original exercises here apply communication questions to staff learning.'},
  stories: {title: 'UNESCO — Manual for Developing Intercultural Competencies: Story Circles', href: 'https://unesdoc.unesco.org/ark:/48223/pf0000370336', note: 'Intercultural learning through listening and reflection; this course does not reproduce or certify the manual’s method.'},
  iat: {title: 'Project Implicit — Frequently asked questions', href: 'https://implicit.harvard.edu/implicit/faqs.html', note: 'Explains what the IAT measures, variation in results, and caution about individual interpretation.'},
  iatEthics: {title: 'Project Implicit — Ethical considerations', href: 'https://implicit.harvard.edu/implicit/ethics.html', note: 'Read before choosing to participate in an external IAT; participation and any result remain voluntary.'},
  belonging: {title: 'UC Berkeley Othering & Belonging Institute — What is belonging?', href: 'https://belonging.berkeley.edu/what-is-belonging', note: 'Distinguishes belonging, recognition, voice, and participation in the institutions shaping people’s lives.'},
  design: {title: 'UC Berkeley Othering & Belonging Institute — Belonging design principles', href: 'https://belonging.berkeley.edu/belongingdesignprinciples', note: 'Institutional belonging and co-creation; not an individual diagnostic scale.'},
  fiske: {title: 'Susan T. Fiske — Prejudice, discrimination, and stereotyping', href: 'https://nobaproject.com/modules/prejudice-discrimination-and-stereotyping', note: 'Researcher-authored educational chapter distinguishing affect, beliefs, and behavior.'},
  idi: {title: 'Intercultural Development Inventory — The Intercultural Development Continuum', href: 'https://www.idiinventory.com/idc', note: 'Official descriptions of Denial, Polarization, Minimization, Acceptance, and Adaptation. This course does not administer or infer an individual IDI result.'},
  crenshaw: {title: 'Kimberlé Crenshaw (1989) — Demarginalizing the Intersection of Race and Sex', href: 'https://chicagounbound.uchicago.edu/uclf/vol1989/iss1/8/', note: 'Original scholarship on how single-axis analysis can obscure Black women’s experiences; original cases here extend inquiry without erasing that origin.'},
  ada: {title: 'U.S. Department of Justice — Introduction to the Americans with Disabilities Act', href: 'https://www.ada.gov/topics/intro-to-ada/', note: 'Authoritative background on equal opportunity and disability access; formal applicability belongs to the responsible agency office.'},
};
