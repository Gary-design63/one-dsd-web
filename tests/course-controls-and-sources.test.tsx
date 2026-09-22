// @vitest-environment jsdom
import React from 'react';
import {it,expect,vi,afterEach} from 'vitest';
import {render,fireEvent,act,cleanup} from '@testing-library/react';
import {writeEvidenceReceipt} from '@/tests/helpers/evidence-receipts';
import {CourseLesson} from '@/components/course-lesson';
import {RECOVERED_COURSES} from '@/lib/content/courses/definitions';
import {safeCourseMarkup,courseLink,lessonObjectives,sanitizedLesson} from '@/lib/content/courses/published';
afterEach(()=>{cleanup();localStorage.clear();vi.restoreAllMocks();vi.unstubAllGlobals();});
it('downloads the published artifact as a usable file without staff typing',async()=>{
 const pack=RECOVERED_COURSES.find(p=>p.course.lessons.some(l=>l.blocks.some(b=>b.type==='artifact')))!;
 const original=pack.course.lessons.find(l=>l.blocks.some(b=>b.type==='artifact'))!;
 const artifact=original.blocks.find(b=>b.type==='artifact')!;
 const lesson=sanitizedLesson({...original,blocks:[artifact]});
 let downloaded:Blob|undefined;const create=vi.fn((blob:Blob)=>{downloaded=blob;return 'blob:verified';});vi.stubGlobal('URL',Object.assign(URL,{createObjectURL:create,revokeObjectURL:vi.fn()}));
 const click=vi.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(function(this:HTMLAnchorElement){expect(this.download).toMatch(/\.txt$/);expect(this.href).toBe('blob:verified');});
 const view=render(<CourseLesson courseId={pack.course.id} lesson={lesson} objectives={lessonObjectives(lesson)}/>);await act(async()=>{await Promise.resolve();});
 expect(view.queryAllByRole('textbox')).toHaveLength(0);
 fireEvent.click(view.getByRole('button',{name:'Download this published draft'}));
 expect(click).toHaveBeenCalledOnce();expect(downloaded?.type).toBe('text/plain;charset=utf-8');
 const text=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=reject;reader.readAsText(downloaded!);});expect(text).toContain(artifact.title);
});
it('removes executable markup while preserving useful authored formatting',()=>{
 const html=safeCourseMarkup('<p>Hello <strong>staff</strong><script>alert(1)</script><img src=x onerror=alert(1)><a href="javascript:alert(1)">unsafe</a><a href="/c/language-access-plan">Read</a></p>');
 expect(html).toContain('<strong>staff</strong>');expect(html).toContain('href="/courses/language-access-plan"');expect(html).not.toMatch(/script|onerror|javascript:|<img/);
});
it('resolves retired local destinations and keeps original source values separate',()=>{
 expect(courseLink('/blueprint')).toBe('/about');expect(courseLink('/communities')).toBe('/minnesota-communities');expect(courseLink('/professional-support')).toBe('/support');expect(courseLink('/c/language-access-plan?from=learn#sources')).toBe('/courses/language-access-plan?from=learn#sources');expect(courseLink('#')).toBeUndefined();
});
it('records three distinct observable objectives for every recovered lesson',()=>{
 const records=RECOVERED_COURSES.flatMap(pack=>pack.course.lessons.map(lesson=>({courseId:pack.course.id,lessonId:lesson.id,original:lesson.learning?.objective,objectives:lessonObjectives(lesson)})));
 expect(records).toHaveLength(780);for(const row of records){expect(new Set(row.objectives).size).toBe(3);if(row.original)expect(row.objectives[0]).toBe(row.original);expect(row.objectives[1]).toMatch(/^(Compare|Explain)/);expect(row.objectives[2]).toMatch(/^(Draft|Document)/);}
 writeEvidenceReceipt('evidence/next-pass-2026-09-08/lesson-objective-additions.json',{basis:'Original objective retained; separate program-authored additions derived from each lesson scenario, work product, and transfer task.',records});
});
