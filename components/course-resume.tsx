"use client";
import { useEffect,useState } from "react";
import Link from "next/link";
export function CourseResume({courseId,lessons}:{courseId:string;lessons:Array<{id:string;title:string}>}) {
  const [resume,setResume]=useState<string>();const [completed,setCompleted]=useState(0);const [error,setError]=useState("");
  useEffect(()=>{let active=true;Promise.resolve().then(()=>{if(!active)return;try{const id=localStorage.getItem(`pac-course-resume:${courseId}`);if(lessons.some(lesson=>lesson.id===id))setResume(id!);setCompleted(lessons.filter(lesson=>{try{return JSON.parse(localStorage.getItem(`pac-course:${courseId}:${lesson.id}`)??"{}").completed===true;}catch{setError("Some saved progress could not be opened. You can choose any lesson below.");return false;}}).length);}catch{setError("Your saved progress could not be opened. You can choose any lesson below.");}});return()=>{active=false;};},[courseId,lessons]);
  return <div><Link className="button" href={`/courses/${courseId}/${resume??lessons[0].id}`}>{resume?"Continue learning":"Start learning"}</Link>{error?<p role="status">{error}</p>:null}{completed?<p>{completed} of {lessons.length} lessons complete</p>:null}</div>;
}
