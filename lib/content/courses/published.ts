import "server-only";
import sanitizeHtml from "sanitize-html";
import type { CoursePack, Lesson } from "./source-types";
import { ALL_COURSE_SURFACES } from "./definitions";
import { loadPublishedEditableSurfaces } from "../editable-surfaces";
import type { StaffProgramScope } from "../staff-publications";


export function courseHref(id:string, lessonId?:string) { return `/courses/${encodeURIComponent(id)}${lessonId?`/${encodeURIComponent(lessonId)}`:""}`; }
export async function publishedCourses(scope:StaffProgramScope) {
  const rows=await loadPublishedEditableSurfaces(ALL_COURSE_SURFACES.map(surface=>surface.surfaceId),scope);
  return rows.map(row=>({pack:row.values.pack as CoursePack,publication:row}));
}
export function courseText(value:unknown):string {
  if(typeof value==="string") return sanitizeHtml(value,{allowedTags:[],allowedAttributes:{}});
  if(Array.isArray(value)) return value.map(courseText).join(" ");
  if(value && typeof value==="object") return Object.entries(value).filter(([key])=>!["href","src","id","type","coverImage","introAudio"].includes(key)).map(([,child])=>courseText(child)).join(" ");
  return "";
}
export function courseLink(href:string):string | undefined {
  if(href==="#" || !href) return undefined;
  const retired:Record<string,string>={"/blueprint":"/about","/communities":"/minnesota-communities","/communities/from-the-list":"/minnesota-communities","/professional-support":"/support","https://one-dhs-equity-resource.vercel.app/equal-opportunity-access":"/courses/equal-opportunity-in-employment"};
  const base=href.split(/[?#]/)[0];if(retired[base])return retired[base]+href.slice(base.length);
  if(href.startsWith("/c/")) return href.replace(/^\/c\//,"/courses/");
  if(href.startsWith("/ci/")) return href.replace(/^\/ci\//,"/courses/cultural-intelligence-");
  if(/^(?:\/(?!\/)|#[a-zA-Z0-9_-]|https:\/\/)/.test(href) && !/[\u0000-\u0020\\]/.test(href)) return href;
  return undefined;
}
export function safeCourseMarkup(value:string):string {
  return sanitizeHtml(value,{allowedTags:["p","br","strong","em","b","i","ul","ol","li","blockquote","h2","h3","h4","a","code","sup","sub"],allowedAttributes:{a:["href","title"]},allowedSchemes:["https"],allowProtocolRelative:false,transformTags:{a:(_tag,attributes)=>({tagName:"a",attribs:courseLink(attributes.href??"")?{href:courseLink(attributes.href)!}:{} as Record<string,string>})}});
}
/** Create a render-only copy. Stored original wording and source hashes stay unchanged. */
export function sanitizedLesson(lesson:Lesson):Lesson {
  const visit=(value:unknown):unknown=>typeof value==="string"?safeCourseMarkup(value):Array.isArray(value)?value.map(visit):value && typeof value==="object"?Object.fromEntries(Object.entries(value).map(([key,child])=>[key,visit(child)])):value;
  return visit(lesson) as Lesson;
}
export function lessonObjectives(lesson:Lesson):string[] {
  const original=lesson.learning?.objective ?? `Apply ${lesson.title} to a decision in your work.`;
  const scenario=lesson.scenario;
  const practical=lesson.blocks.find(block=>block.type==="artifact");
  const takeaways=lesson.learning?.takeaways ?? [];
  return [original,
    scenario?`Compare the responses to this question and explain your choice: ${courseText(scenario.prompt)}`:`Explain the practical significance of this lesson's central point: ${courseText(takeaways[0]??lesson.summary)}`,
    practical?.type==="artifact"?`Draft ${courseText(practical.title).replace(/^A /,"a ")} for your work, including ${practical.fields.slice(0,3).map(field=>courseText(field.label).toLowerCase()).join(", ")}.`:`Document a next step for ${courseText(lesson.title)}: ${courseText(lesson.learning?.appliedNextStep??lesson.transfer?.prompt??lesson.summary)}`,
  ];
}
export function courseSummary(pack:CoursePack):string { return courseText(pack.course.subtitle || pack.course.introTranscript || pack.course.title); }

export function courseContentItem(pack:CoursePack): import("../types").ContentItem {
  return {id:`course-${pack.course.id}`,title:pack.course.title,type:"learning_module",authority:"learning",layer:"L2",summary:courseSummary(pack),body:pack.course.lessons.map(lesson=>courseText(lesson)),nextActions:[],tags:[pack.course.contentType??"learning"],intents:[],owner:pack.course.author,reviewDate:"",status:"approved",scope:"agencywide",accessibility:"pending",version:"1",href:courseHref(pack.course.id)};
}
