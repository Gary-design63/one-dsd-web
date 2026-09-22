import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ownerFromRequest } from "@/lib/auth/request";
import { isSameOriginMutation } from "@/lib/auth/mutation";
import { readBoundedJson } from "@/lib/http/request";
import { createProgramTask, listProgramWork, prepareProgramWork, recordProgramDecision, runProgramWork, summarizeProgramWork, ProgramWorkConflict } from "@/lib/program/work";
import { programFunctions } from "@/lib/program/model";

const headers={"cache-control":"no-store"};
const taskId=z.string().regex(/^task-[a-f0-9]{32}$/);
const Command=z.discriminatedUnion("action",[
  z.object({action:z.literal("run"),limit:z.number().int().min(1).max(4).default(2)}).strict(),
  z.object({action:z.literal("prepare")}).strict(),
  z.object({action:z.literal("create"),requestId:z.uuid(),functionId:z.string().refine(v=>programFunctions.some(f=>f.id===v)),kind:z.enum(["work_preparation","resource_review"]).default("work_preparation"),title:z.string().trim().min(5).max(180),objective:z.string().trim().min(10).max(3000),dueAt:z.iso.datetime()}).strict(),
  z.object({action:z.literal("observe"),requestId:z.uuid(),taskId,expectedEventId:z.uuid().nullable(),phase:z.enum(["applied","reviewed","cancelled","retry_requested"]),note:z.string().trim().min(10).max(3000),disposition:z.enum(["retain","revise","stop","not_yet_known"]).optional(),followUpAt:z.iso.datetime().optional(),humanMinutes:z.number().min(0).max(100000).optional()}).strict(),
]);
export async function handleProgramGet(request:NextRequest) {
  if(!(await ownerFromRequest(request)))return NextResponse.json({error:"Sign in to the Consultant Workspace to open program work."},{status:401,headers});
  try {const items=await listProgramWork();return NextResponse.json({items,summary:summarizeProgramWork(items)},{headers});}
  catch{return NextResponse.json({error:"Program work could not be opened. Please try again."},{status:503,headers});}
}
export async function handleProgramPost(request:NextRequest) {
  if(!(await ownerFromRequest(request)))return NextResponse.json({error:"Sign in to the Consultant Workspace to manage program work."},{status:401,headers});
  if(!isSameOriginMutation(request))return NextResponse.json({error:"Open program work in this program before making changes."},{status:403,headers});
  const body=await readBoundedJson(request,16384);
  if(!body.ok)return NextResponse.json({error:body.message},{status:body.status,headers});
  const parsed=Command.safeParse(body.value);
  if(!parsed.success)return NextResponse.json({error:"Check the work item, date and required fields, then try again."},{status:400,headers});
  try {
    const command=parsed.data;
    if(command.action==="run")return NextResponse.json({result:await runProgramWork({limit:command.limit})},{headers});
    if(command.action==="prepare")return NextResponse.json({prepared:(await prepareProgramWork()).map(t=>t.id)},{headers});
    if(command.action==="create"){
      const task=await createProgramTask({functionId:command.functionId,kind:command.kind,title:command.title,objective:command.objective,dueAt:command.dueAt,eligible:true,source:"owner",evidenceMode:"operational"},command.requestId);
      return NextResponse.json({task},{status:201,headers});
    }
    const event=await recordProgramDecision(command.taskId,{requestId:command.requestId,expectedEventId:command.expectedEventId,phase:command.phase,note:command.note,disposition:command.disposition,followUpAt:command.followUpAt,humanMinutes:command.humanMinutes});
    return NextResponse.json({event},{headers});
  }catch(error){
    if(error instanceof ProgramWorkConflict)return NextResponse.json({error:error.message},{status:409,headers});
    return NextResponse.json({error:"This change could not be confirmed. Your writing is still here; refresh the work item before retrying."},{status:503,headers});
  }
}
