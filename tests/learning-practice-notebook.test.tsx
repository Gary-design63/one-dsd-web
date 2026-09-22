// @vitest-environment jsdom
import {afterEach,describe,it,expect} from "vitest";
import {cleanup,render,screen} from "@testing-library/react";
import {LearningPracticeNotebook} from "@/components/learning-practice-notebook";
import {emptyPractice,buildPracticeNote,readPracticeNotes,PRACTICE_FIELDS} from "@/lib/content/learning-practice";
const stops=[
 {id:"foundations" as const,title:"Begin with curiosity",practice:"Examine an observation.",reflection:"What did I assume?"},
 {id:"perspectives" as const,title:"Explore perspectives",practice:"Invite a perspective.",reflection:"What changed?"}
];
afterEach(()=>{cleanup();});
describe("learning practice notes",()=>{
 it("publishes practice prompts without typing or localStorage",()=>{
  const html=render(<LearningPracticeNotebook stops={stops}/>).container.innerHTML;
  expect(html).toContain("Begin with curiosity");
  expect(html).toContain("Examine an observation.");
  expect(html).toContain("Browse and download only");
  expect(html).not.toContain("<textarea");
  expect(html).not.toContain("Save on this device");
  expect(html).not.toContain("Create my practice note");
  expect(screen.queryByLabelText("The situation I want to work on")).toBeNull();
 });
 it("can read every permitted field at its maximum escaped length and rejects malformed saves",()=>{
  const ids=["foundations","perspectives","communication","decisions","reflection"];
  const note=Object.fromEntries(PRACTICE_FIELDS.map(field=>[field.id,"\u0001".repeat(2000)]));
  const raw=JSON.stringify({version:1,notes:Object.fromEntries(ids.map(id=>[id,note]))});
  expect(Object.keys(readPracticeNotes(raw,ids))).toHaveLength(5);
  expect(()=>readPracticeNotes('{"version":2,"notes":{}}',ids)).toThrow();
  expect(()=>readPracticeNotes('{"version":1,"notes":{"foundations":{}}}',ids)).toThrow();
  expect(buildPracticeNote("A focus",emptyPractice())).toBeNull();
 });
});
