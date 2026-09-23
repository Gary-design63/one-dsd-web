// @vitest-environment jsdom
import React from "react";
import { afterAll, afterEach, expect, it, vi } from "vitest";
import { render, fireEvent, within, act, cleanup } from "@testing-library/react";
import { writeEvidenceReceipt } from "@/tests/helpers/evidence-receipts";
import { CourseLesson } from "@/components/course-lesson";
import { RECOVERED_COURSES } from "@/lib/content/courses/definitions";
import { lessonImageOverrides } from "@/lib/content/courses/lesson-image-overrides";
import { duplicateLessonImageKeys } from "@/lib/content/courses/lesson-image-repeat-suppression";
import { sanitizedLesson, lessonObjectives } from "@/lib/content/courses/published";

const receipts:Array<{course:string;lesson:string;blocks:number;types:string[];optionsChecked:number;notesReloaded:boolean}>=[];
const plain=(value:string)=>{const element=document.createElement("div");element.innerHTML=value;return element.textContent??"";};
afterEach(()=>{cleanup();localStorage.clear();vi.restoreAllMocks();});
afterAll(()=>writeEvidenceReceipt("evidence/next-pass-2026-09-08/course-interaction-matrix.json",{environment:"React DOM in jsdom; complete source instances, separate real-browser checks",lessons:receipts.length,blocks:receipts.reduce((sum,row)=>sum+row.blocks,0),receipts}));

for(const pack of RECOVERED_COURSES) it(`all lesson interactions and saved notes: ${pack.course.id}`,async()=>{
  for(const original of pack.course.lessons){
    const lesson=sanitizedLesson(original);const props={courseId:pack.course.id,lesson,objectives:lessonObjectives(original)};
    let view=render(<CourseLesson {...props}/>);
    await act(async()=>{await Promise.resolve();});
    expect(view.container.querySelectorAll("[data-course-block]")).toHaveLength(lesson.blocks.length);
    let optionsChecked=0;
    for(const [index,block]of lesson.blocks.entries()){
      const element=view.container.querySelectorAll<HTMLElement>("[data-course-block]")[index];const ui=within(element);
      if(block.type==="knowledgeCheck"){
        const radios=ui.getAllByRole("radio");
        for(const [optionIndex,option]of block.options.entries()){
          fireEvent.click(radios[optionIndex]);fireEvent.click(ui.getByRole("button",{name:"Check answer"}));
          expect(ui.getByRole("status").textContent).toContain(plain(option.correct?block.feedbackCorrect:block.feedbackIncorrect));optionsChecked++;
          fireEvent.click(ui.getByRole("button",{name:"Try again"}));expect((radios[optionIndex] as HTMLInputElement).checked).toBe(false);
        }
      }else if(block.type==="sorting"){
        const selects=ui.getAllByRole("combobox");
        for(const [itemIndex,item]of block.items.entries())fireEvent.change(selects[itemIndex],{target:{value:item.category}});
        fireEvent.click(ui.getByRole("button",{name:"Check matches"}));expect(ui.getAllByText("That fits.")).toHaveLength(block.items.length);optionsChecked+=block.items.length;
        fireEvent.click(ui.getByRole("button",{name:"Reset"}));expect(selects.every(select=>(select as HTMLSelectElement).value==="")).toBe(true);
      }else if(block.type==="tabs"){
        const tabs=ui.getAllByRole("tab");for(const [tabIndex,tab]of block.tabs.entries()){fireEvent.click(tabs[tabIndex]);expect(tabs[tabIndex].getAttribute("aria-selected")).toBe("true");expect(ui.getByRole("tabpanel").textContent).toContain(plain(tab.body));optionsChecked++;}
        fireEvent.keyDown(tabs[0],{key:"End"});expect(tabs.at(-1)?.getAttribute("aria-selected")).toBe("true");fireEvent.keyDown(tabs.at(-1)!,{key:"Home"});expect(tabs[0].getAttribute("aria-selected")).toBe("true");
      }else if(block.type==="accordion"||block.type==="flashcards"){
        for(const summary of element.querySelectorAll("summary")){fireEvent.click(summary);expect((summary.parentElement as HTMLDetailsElement).open).toBe(true);fireEvent.click(summary);expect((summary.parentElement as HTMLDetailsElement).open).toBe(false);optionsChecked++;}
      }else if(block.type==="artifact"){
        expect(element.textContent).toContain(plain(block.title));
        expect(ui.queryAllByRole("textbox")).toHaveLength(0);
        fireEvent.click(ui.getByRole("button",{name:"Download this published draft"}));optionsChecked++;
      }else if(block.type==="image"){
        const replacement=lessonImageOverrides[block.src];
        const expectedCaption=replacement?.caption??block.caption;
        if(duplicateLessonImageKeys.has(`${pack.course.id}|${lesson.id}|${index}`)){
          expect(ui.queryByRole("img")).toBeNull();
          if(expectedCaption)expect(element.textContent).toContain(plain(expectedCaption));
        }else{
          expect(ui.getByRole("img").getAttribute("src")).toBe(replacement?.src??block.src);
        }
      }
    }
    if(lesson.scenario){const group=within(view.getByRole("group",{name:plain(lesson.scenario.prompt)}));const radios=group.getAllByRole("radio");for(const [index,option]of lesson.scenario.options.entries()){fireEvent.click(radios[index]);fireEvent.click(group.getByRole("button",{name:"Consider your choice"}));expect(group.getByRole("status").textContent).toContain(plain(option.response));optionsChecked++;}}
    expect(view.queryByRole("textbox",{name:"Notes to take with you"})).toBeNull();
    fireEvent.click(view.getByRole("checkbox",{name:"Mark this lesson complete"}));view.unmount();
    view=render(<CourseLesson {...props}/>);await act(async()=>{await Promise.resolve();});
    expect(view.queryByRole("textbox")).toBeNull();
    expect((view.getByRole("checkbox",{name:"Mark this lesson complete"}) as HTMLInputElement).checked).toBe(true);
    receipts.push({course:pack.course.id,lesson:lesson.id,blocks:lesson.blocks.length,types:[...new Set(lesson.blocks.map(block=>block.type))],optionsChecked,notesReloaded:false});view.unmount();localStorage.clear();
  }
},120_000);

it("does not keep a course notes field on staff lessons",async()=>{
  const pack=RECOVERED_COURSES[0],lesson=sanitizedLesson(pack.course.lessons[0]);const view=render(<CourseLesson courseId={pack.course.id} lesson={lesson} objectives={lessonObjectives(lesson)}/>);await act(async()=>{await Promise.resolve();});
  expect(view.queryByRole("textbox",{name:"Notes to take with you"})).toBeNull();
  expect(view.getByText(/Course notes are not typed or saved/)).toBeTruthy();
});
