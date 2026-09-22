import { defineEditableSurface, type EditableSurfaceValues } from './editable-surface-contract';
export const MEASUREMENT_RESOURCE_ID = 'pn-measurement-without-surveillance';
export const MEASUREMENT_HREF = '/practice/measurement';
export const MEASUREMENT_FIELD_IDS = ['need','activities','outputs','outcomes','baseline','methods','protection','limits','responsibility','reflection'] as const;
const copy = {
 title: 'Plan how to learn from results', intro: 'Develop an evaluation plan that connects an equity question with meaningful evidence and a practical next decision.',
 notesTitle: 'Your evaluation plan', sourceLabel: 'Read the measurement practice note',
 privacy: 'These notes are not saved. Copy or download what you want to keep before leaving. Use program-level examples and responsible roles; leave out names, private learning records, and confidential case details.',
 copyLabel: 'Copy notes', downloadLabel: 'Download notes', copied: 'Notes copied.', downloadReady: 'Your notes download is ready.', manual: 'Select and copy your notes below.', manualLabel: 'Your notes',
 needLabel: 'The question and the need', needHelp: 'What pattern, barrier, or decision do you want to understand? Whose experience will help define what matters?',
 activitiesLabel: 'Resources and activities', activitiesHelp: 'What capacity, support, or changes could address the need? Describe what will actually happen.',
 outputsLabel: 'What the work will produce', outputsHelp: 'Name the immediate products or completed activities. Keep these separate from evidence that circumstances improved.',
 outcomesLabel: 'The change you hope to see', outcomesHelp: 'Describe the change in a decision, process, service, or workplace pattern. Agree any targets and review timing with the people involved; do not invent them.',
 baselineLabel: 'The starting point', baselineHelp: 'What is known before the change? Identify the source and period, or record that a baseline still needs to be established.',
 methodsLabel: 'Numbers and experiences', methodsHelp: 'How will quantitative patterns and people’s accounts inform each other? Identify measures, questions, sources, and ways people can contribute.',
 protectionLabel: 'Differences and privacy', protectionHelp: 'Which differences could be important to examine? Agree denominators, minimum reporting groups, and suppression with the data owner. Avoid identifiable small groups and individual learning or assessment records.',
 limitsLabel: 'What the evidence cannot show', limitsHelp: 'Consider missing perspectives, incomplete data, other explanations, and whether a comparison supports a causal claim. Keep platform use separate from equity outcomes.',
 responsibilityLabel: 'Responsible roles and next decisions', responsibilityHelp: 'Which roles will gather evidence, interpret it with people affected, decide what to change, and share what was learned? Record open decisions rather than assumed commitments.',
 reflectionLabel: 'Return to what you learned', reflectionHelp: 'After reviewing evidence, what changed in your understanding? What would you keep, adjust, or investigate next?'
};
export const MEASUREMENT_SURFACE = defineEditableSurface({surfaceId:'practice.measurement',label:'Measurement evaluation worksheet',route:MEASUREMENT_HREF,scopePolicy:'inheritable',fields:Object.keys(copy).map(key=>({key,label:key,kind:'long' as const,required:true})),approvedValues:copy});
export function measurementText(copy: Readonly<EditableSurfaceValues>,key:string):string {return typeof copy[key]==='string'?copy[key] as string:'';}
export function measurementNotesText(values: Readonly<Record<string,string>>, copy: Readonly<EditableSurfaceValues>, source:{title:string;href:string}): string {
 const sections=[measurementText(copy,'title'),'Working notes'];
 for(const id of MEASUREMENT_FIELD_IDS) if(typeof values[id]==='string' && values[id].trim()) sections.push(measurementText(copy,id+'Label')+'\n'+values[id]);
 sections.push('Resource\n'+source.title+' — '+source.href);return sections.join('\n\n')+'\n';
}
