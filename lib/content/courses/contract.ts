import { z } from "zod";
import type { CoursePack } from "./source-types";

// Course source wording may contain authored HTML. This contract preserves it;
// the rendering boundary sanitizes markup separately.
const text = z.string().max(100_000);
const id = z.string().regex(/^[a-z0-9][a-z0-9-]{0,159}$/);
const strings = z.array(text).max(500);
const sourceLink = text.refine(value => value === "" || value === "#" || /^(?:\/(?!\/)|#[a-zA-Z0-9_-]|https:\/\/)/.test(value), "Use a local path or secure source address.");
const list = <T extends z.ZodType>(item: T) => z.array(item).max(500);
const block = z.discriminatedUnion("type", [
  z.object({type:z.literal("image"),src:sourceLink,alt:text,caption:text.optional()}).strict(),
  z.object({type:z.literal("text"),heading:text.optional(),body:text}).strict(),
  z.object({type:z.literal("statement"),body:text}).strict(),
  z.object({type:z.literal("quote"),text,cite:text.optional()}).strict(),
  z.object({type:z.literal("list"),heading:text.optional(),ordered:z.boolean().optional(),items:strings}).strict(),
  z.object({type:z.literal("leaderMove"),heading:text.optional(),control:text,failure:text,next:text}).strict(),
  z.object({type:z.literal("artifact"),kind:z.enum(["invitation","tagged-document","captioned-video","plain-language-flyer"]),label:text,title:text,summary:text,fields:list(z.object({label:text,value:text}).strict()),action:text}).strict(),
  z.object({type:z.literal("flashcards"),heading:text.optional(),cards:list(z.object({front:text,back:text}).strict())}).strict(),
  z.object({type:z.literal("accordion"),heading:text.optional(),items:list(z.object({title:text,body:text}).strict())}).strict(),
  z.object({type:z.literal("tabs"),heading:text.optional(),tabs:list(z.object({label:text,body:text}).strict()).min(1)}).strict(),
  z.object({type:z.literal("timeline"),heading:text.optional(),events:list(z.object({year:text,title:text,body:text}).strict())}).strict(),
  z.object({type:z.literal("knowledgeCheck"),id,question:text,options:list(z.object({text,correct:z.boolean()}).strict()).min(2),feedbackCorrect:text,feedbackIncorrect:text}).strict().refine(value=>value.options.some(option=>option.correct),"Include a supported answer."),
  z.object({type:z.literal("sorting"),id,heading:text.optional(),categories:strings.min(1),items:list(z.object({text,category:text}).strict())}).strict().refine(value=>value.items.every(item=>value.categories.includes(item.category)),"Every item needs an available category."),
]);
const lesson = z.object({
  id,number:z.number().int().positive(),title:text,summary:text,minutes:z.number().nonnegative(),blocks:list(block),
  learning:z.object({objective:text,takeaways:strings,evidence:text,appliedNextStep:text}).strict().optional(),
  scenario:z.object({context:text,prompt:text,options:list(z.object({label:text,response:text,recommended:z.boolean().optional()}).strict()).min(2)}).strict().optional(),
  transfer:z.object({prompt:text,options:strings}).strict().optional(),
}).strict();
export const CoursePackSchema: z.ZodType<CoursePack> = z.object({
  course:z.object({
    id,indexNumber:z.number().int(),seriesLabel:text,title:text,subtitle:text,scope:text,treatment:text,duration:text,author:text,coverImage:sourceLink,coverAlt:text,
    introAudio:sourceLink.optional(),introTranscript:text.optional(),hubFile:text.optional(),kind:z.enum(["course","tutorial"]).optional(),contentType:z.enum(["foundation","practice","community-context","formal-support","shared-method"]).optional(),
    learning:z.object({objectives:strings,evidence:strings,appliedNextStep:text}).strict().optional(),
    governance:z.object({contentOwner:text,reviewers:strings,evidenceDate:text,lastReviewed:text,nextReview:text,updateTriggers:strings,relatedDoor:text,toolkitQuestion:text,status:z.enum(["draft","reviewed","current","archived"])}).strict().optional(),
    lessons:list(lesson).min(1),
  }).strict().refine(course=>new Set(course.lessons.map(item=>item.id)).size===course.lessons.length,"Lesson IDs must be unique."),
  jobAid:z.object({title:text,subtitle:text,quote:text.optional(),use:z.object({purpose:text,remember:strings,doNext:text}).strict().optional(),sections:list(z.object({heading:text,items:strings}).strict())}).strict(),
  sources:list(z.object({title:text,href:sourceLink,note:text}).strict()),
}).strict();
