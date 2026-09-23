"use client";
import { useId, useState } from "react";
import type { CoursePack } from "@/lib/content/courses/source-types";

type Value = string | number | boolean | Value[] | { [key: string]: Value };
const labelFor = (key: string) => key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, first=>first.toUpperCase());
function ValueEditor({label,value,onChange}:{label:string;value:Value;onChange:(next:Value)=>void}) {
  const id=useId(); const [open,setOpen]=useState(false);
  if(typeof value==="string") return <label className="block my-3" htmlFor={id}>{label}<textarea id={id} rows={value.length>160?5:2} value={value} onChange={event=>onChange(event.target.value)} className="block w-full" /></label>;
  if(typeof value==="boolean") return <label className="block my-3"><input type="checkbox" checked={value} onChange={event=>onChange(event.target.checked)}/>{label}</label>;
  if(typeof value==="number") return <label className="block my-3">{label}<input type="number" min="0" value={value} onChange={event=>onChange(Number(event.target.value))}/></label>;
  const entries=Array.isArray(value)?value.map((item,index)=>[String(index),item] as const):Object.entries(value);
  return <details className="my-3 border rounded p-3" open={open} onToggle={event=>setOpen(event.currentTarget.open)}><summary>{label}</summary>{open?entries.filter(([key])=>!["id","type"].includes(key)).map(([key,item])=><ValueEditor key={key} label={Array.isArray(value)?`${label} ${Number(key)+1}`:labelFor(key)} value={item} onChange={next=>onChange(Array.isArray(value)?value.map((old,index)=>String(index)===key?next:old):{...value,[key]:next})}/>):null}</details>;
}
export function CourseContentEditor({value,onChange}:{value:CoursePack;onChange:(next:CoursePack)=>void}) {
  return <ValueEditor label={value.course.title} value={value as unknown as Value} onChange={next=>onChange(next as unknown as CoursePack)}/>;
}
