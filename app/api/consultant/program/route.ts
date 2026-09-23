import type { NextRequest } from "next/server";
import { handleProgramGet, handleProgramPost } from "./handlers";
export const maxDuration=240;
export async function GET(request:NextRequest){return handleProgramGet(request);}
export async function POST(request:NextRequest){return handleProgramPost(request);}
