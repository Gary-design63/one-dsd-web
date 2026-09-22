// @vitest-environment jsdom
import { afterEach,expect,it,vi } from 'vitest';
import { cleanup,render,screen,fireEvent,waitFor } from '@testing-library/react';
import { MeasurementWorksheet } from '@/components/measurement-worksheet';
import { MEASUREMENT_SURFACE,measurementNotesText } from '@/lib/content/measurement-practice';
import { taskPracticeHref } from '@/lib/product/task-practice';
import { getDomain } from '@/lib/domains';
import { GRADUATION_PATHS } from '@/lib/content/paths';
const copy=MEASUREMENT_SURFACE.approvedValues,source={title:'Current published measurement note',href:'/library/pn-measurement-without-surveillance?area=measurement&task=evaluation-plan'};
afterEach(()=>{cleanup();vi.restoreAllMocks()});
it('adds the exact evaluation supplement without rewriting original task/path source',()=>{
 const task=getDomain('measurement')!.tasks.find(task=>task.id==='evaluation-plan')!;
 expect(task.pathId).toBeUndefined();expect(GRADUATION_PATHS).toHaveLength(13);
 const surfaces=new Set(['practice.measurement','practice.page']),resources=new Set(['pn-measurement-without-surveillance']);
 expect(taskPracticeHref('measurement',task,surfaces,resources)).toBe('/practice/measurement');
 expect(taskPracticeHref('workforce',task,surfaces,resources)).toBeUndefined();
 expect(taskPracticeHref('measurement',task,surfaces,new Set())).toBeUndefined();
 expect(taskPracticeHref('measurement',task,new Set(['practice.page']),resources)).toBeUndefined();
 expect(taskPracticeHref('measurement',task,new Set(['practice.measurement']),resources)).toBeUndefined();
 const originalTask=getDomain('access-language')!.tasks.find(task=>task.pathId==='gp-8')!;
 expect(taskPracticeHref('access-language',originalTask,new Set(['graduation-path.gp-8']),resources)).toBe('/practice/gp-8');
});
it('exports only known current notes with edited labels and the source, without inventing targets',()=>{
 const text=measurementNotesText({need:'Understand renewal barriers.',baseline:'Not established yet.',unexpected:'do-not-export'}, {...copy,needLabel:'Our shared question'},source);
 expect(text).toContain('Our shared question\nUnderstand renewal barriers.');expect(text).toContain('Not established yet.');expect(text).toContain(source.href);expect(text).not.toContain('do-not-export');expect(text).not.toContain('90%');
});
it('copies current edits without saving or sending notes',async()=>{
 const store=vi.spyOn(Storage.prototype,'setItem'),fetch=vi.spyOn(globalThis,'fetch');const writeText=vi.fn().mockResolvedValue(undefined);Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText}});
 render(<MeasurementWorksheet copy={copy} source={source}/>);
 fireEvent.change(screen.getByLabelText(String(copy.needLabel)),{target:{value:'Check who can use the renewal letter.'}});
 fireEvent.change(screen.getByLabelText(String(copy.reflectionLabel)),{target:{value:'Ask whether the change helped.'}});
 fireEvent.click(screen.getByRole('button',{name:'Copy notes'}));
 await waitFor(()=>expect(writeText).toHaveBeenCalledWith(expect.stringContaining('Ask whether the change helped.')));
 expect(screen.getByRole('status').textContent).toBe('Notes copied.');expect(store).not.toHaveBeenCalled();expect(fetch).not.toHaveBeenCalled();
 expect(screen.getByText(/These notes are not saved/)).toBeTruthy();expect(screen.queryByRole('button',{name:/save|complete/i})).toBeNull();
});
it('keeps selectable notes after a clipboard failure',async()=>{
 Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:vi.fn().mockRejectedValue(new Error('denied'))}});
 render(<MeasurementWorksheet copy={copy} source={source}/>);fireEvent.change(screen.getByLabelText(String(copy.limitsLabel)),{target:{value:'This comparison cannot establish causation.'}});
 fireEvent.click(screen.getByRole('button',{name:'Copy notes'}));expect(await screen.findByRole('textbox',{name:'Your notes'})).toHaveProperty('value',expect.stringContaining('cannot establish causation'));
});
it('downloads the current working plan and excludes blank fields',async()=>{
 const create=vi.fn().mockReturnValue('blob:measurement'),revoke=vi.fn();Object.defineProperty(URL,'createObjectURL',{configurable:true,value:create});Object.defineProperty(URL,'revokeObjectURL',{configurable:true,value:revoke});const click=vi.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(()=>{});
 render(<MeasurementWorksheet copy={copy} source={source}/>);fireEvent.change(screen.getByLabelText(String(copy.methodsLabel)),{target:{value:'Combine accessible feedback with service patterns.'}});fireEvent.click(screen.getByRole('button',{name:'Download notes'}));
 const blob=create.mock.calls[0][0] as Blob;const reader=new FileReader();const text=await new Promise(resolve=>{reader.onload=()=>resolve(reader.result);reader.readAsText(blob)});
 expect(text).toContain('Combine accessible feedback');expect(text).not.toContain(String(copy.baselineLabel));expect(click).toHaveBeenCalledOnce();
});
