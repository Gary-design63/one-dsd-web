// @vitest-environment jsdom
import { afterEach,beforeEach,it,expect,vi } from 'vitest';
import { cleanup,render,screen,fireEvent,waitFor } from '@testing-library/react';
import { PathClient } from '@/components/path-client';
import { readPracticeValues,practiceNotesText } from '@/lib/client/practice-export';
import { getEditableSurfaceDefinition } from '@/lib/content/staff-surface-registry';
import { BROWSER_STORAGE_KEYS } from '@/lib/client/storage-keys';
import { writeStored } from '@/lib/client/storage';
import { meetingArtifact,meetingPath } from './helpers/practice-artifact-fixtures';
vi.mock('@/components/program-context',()=>({useProgramContext:()=>({context:'one_dsd'})}));
const key=BROWSER_STORAGE_KEYS.pathArtifact(meetingPath.id), copy=getEditableSurfaceDefinition('practice.path-shell')!.approvedValues;
beforeEach(()=>{writeStored('local',key,null);writeStored('local',BROWSER_STORAGE_KEYS.pathProgress(meetingPath.id),null)});
afterEach(()=>{cleanup();vi.restoreAllMocks();writeStored('local',key,null)});
it('recovers legacy list strings and rejects nested objects without mutating original data',()=>{
 const raw={ahead:'My current agenda.',formats:'Captions\nWritten responses',owners:{bad:'not a list'}};
 const restored=readPracticeValues(raw,meetingPath);
 expect(restored.values.formats).toEqual(['Captions','Written responses']);expect(restored.values.ahead).toBe(raw.ahead);expect(restored.values.owners).toBeUndefined();expect(restored.needsAttention).toBe(true);expect(raw.owners).toEqual({bad:'not a list'});
});
it.each([null,42,['bad']])('does not crash for invalid root data %j',raw=>{expect(()=>readPracticeValues(raw,meetingPath)).not.toThrow()});
it('exports human labels and current values with source context, not opaque identity or access fields',()=>{
 const text=practiceNotesText(meetingPath,{ahead:'Unsaved updated agenda.',formats:['Captioning'],accessKey:'do-not-export'},meetingArtifact());
 expect(text).toContain('Unsaved updated agenda.');expect(text).toContain(meetingPath.artifactFields.find(f=>f.id==='ahead')!.label);expect(text).toContain('Prepared with ASK');expect(text).not.toContain('do-not-export');expect(text).not.toContain(meetingArtifact().revisionId);
});
it('copies the current unsaved draft after failed browser saving',async()=>{
 render(<PathClient path={meetingPath} intakeEnabled={false} copy={copy}/>);
 fireEvent.change(document.getElementById('f-gp-8-ahead')!,{target:{value:'Current unsaved agenda for export.'}});
 vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('full')});
 fireEvent.click(screen.getByRole('button',{name:String(copy.saveNotesLabel)}));
 const writeText=vi.fn().mockResolvedValue(undefined);Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText}});
 fireEvent.click(screen.getByRole('button',{name:'Copy notes'}));
 await waitFor(()=>expect(writeText).toHaveBeenCalledWith(expect.stringContaining('Current unsaved agenda for export.')));
 expect(localStorage.getItem(key)).toBeNull();expect(screen.getByText('Notes copied.')).toBeTruthy();
});
it('offers selectable current notes when clipboard access fails',async()=>{
 render(<PathClient path={meetingPath} intakeEnabled={false} copy={copy}/>);
 fireEvent.change(document.getElementById('f-gp-8-ahead')!,{target:{value:'Keep this text.'}});
 Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:vi.fn().mockRejectedValue(new Error('denied'))}});
 fireEvent.click(screen.getByRole('button',{name:'Copy notes'}));
 expect(await screen.findByRole('textbox',{name:'Your notes'})).toHaveProperty('value',expect.stringContaining('Keep this text.'));
});
it('keeps corrupt stored data intact while allowing readable notes to open',()=>{
 const raw={ahead:'Keep my notes',formats:{broken:true}};writeStored('local',key,raw);
 render(<PathClient path={meetingPath} intakeEnabled={false} copy={copy}/>);
 expect(document.getElementById('f-gp-8-ahead')).toHaveProperty('value','Keep my notes');
 expect(JSON.parse(localStorage.getItem(key)!)).toEqual(raw);expect(screen.getByText(/Some saved information could not be read/)).toBeTruthy();
});
it('retains the work area and task on the available support link',()=>{
 render(<PathClient path={meetingPath} intakeEnabled={false} copy={copy} origin={{originArea:'accessibility_language_access',area:'access-language',task:'accessible-meeting'}}/>);
 const link=screen.getByRole('link',{name:'Find the right person or office'});
 const url=new URL(link.getAttribute('href')!,'https://program.test');
 expect(url.pathname).toBe('/support/right-person');expect(url.searchParams.get('area')).toBe('accessibility_language_access');expect(url.searchParams.get('domain')).toBe('access-language');expect(url.searchParams.get('task')).toBe('accessible-meeting');
 expect(url.searchParams.get('path')).toBeNull();
});
it('downloads current notes without requiring a successful save',async()=>{
 render(<PathClient path={meetingPath} intakeEnabled={false} copy={copy}/>);
 fireEvent.change(document.getElementById('f-gp-8-ahead')!,{target:{value:'Download this current draft.'}});
 const create=vi.fn().mockReturnValue('blob:synthetic-local-notes');const revoke=vi.fn();
 Object.defineProperty(URL,'createObjectURL',{configurable:true,value:create});Object.defineProperty(URL,'revokeObjectURL',{configurable:true,value:revoke});
 const click=vi.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(()=>{});
 fireEvent.click(screen.getByRole('button',{name:'Download notes'}));
 const blob=create.mock.calls[0][0] as Blob;const reader=new FileReader();const text=await new Promise(resolve=>{reader.onload=()=>resolve(reader.result);reader.readAsText(blob)});
 expect(text).toContain('Download this current draft.');expect(click).toHaveBeenCalledOnce();expect(localStorage.getItem(key)).toBeNull();
});
