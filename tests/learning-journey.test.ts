import {describe,it,expect} from "vitest";
import {staffCorpus} from "@/lib/content/staff-corpus";
import recovered from "@/lib/content/courses/recovered.json";
import {AUTHORED_COURSES} from "@/lib/content/courses/definitions";
import {LEARNING_JOURNEY_SURFACE,getLearningJourney,selectJourneyResources,journeyResourceHref,learningStageHref} from "@/lib/content/learning-journey";
import {parseEditableSurfaceValues} from "@/lib/content/editable-surface-contract";
import {courseContentItem} from "@/lib/content/courses/published";
import {CoursePackSchema} from "@/lib/content/courses/contract";
const values=LEARNING_JOURNEY_SURFACE.approvedValues;
const items=[...staffCorpus(),...recovered.map(pack=>courseContentItem(CoursePackSchema.parse(pack))),...AUTHORED_COURSES.map(courseContentItem)];
describe("intercultural learning progression",()=>{
 it("resolves every curated reference to an existing complete resource without dropping the course collection",()=>{
  const stops=getLearningJourney(values);
  expect(stops).toHaveLength(5);
  for(const stop of stops){
   expect(stop.objectives.length).toBeGreaterThanOrEqual(3);
   expect(stop.objectives.length).toBeLessThanOrEqual(5);
   const selected=selectJourneyResources(stop,items);
   expect(selected.map(item=>item.id)).toEqual(stop.resourceIds);
   expect(selected.filter(item=>item.id.startsWith("course-")).length).toBeGreaterThanOrEqual(2);
   for(const item of selected) expect(journeyResourceHref(item)).toMatch(/^\/(courses|library)\//);
  }
  expect(recovered).toHaveLength(86);
 });
 it("honors published membership edits and never substitutes withdrawn or unavailable resources",()=>{
  const revised={...values,foundationsIds:["not-published","pn-intercultural-method","pn-intercultural-method"]};
  expect(parseEditableSurfaceValues(LEARNING_JOURNEY_SURFACE,revised)).toEqual(revised);
  const stop=getLearningJourney(revised)[0];
  expect(selectJourneyResources(stop,items).map(item=>item.id)).toEqual(["pn-intercultural-method"]);
  expect(selectJourneyResources(stop,[])).toEqual([]);
  expect(selectJourneyResources(getLearningJourney({...values,foundationsIds:[]})[0],items)).toEqual([]);
 });
 it("preserves edited teaching text and gives each old learning stage a concrete destination",()=>{
  expect(getLearningJourney({...values,foundationsPurpose:"An updated explanation."})[0].purpose).toBe("An updated explanation.");
  expect(learningStageHref("orientation")).toBe("/orientation");
  for(const id of ["foundations","intercultural-practice","application","systems-practice","leadership-continuity"]){
   expect(learningStageHref(id)).toMatch(/^\/learn\/intercultural#/);
   expect(learningStageHref(id)).not.toContain("?q=");
  }
 });
});

