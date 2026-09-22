import { handleStudioGet, handleStudioPost } from "./handlers";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;
export const GET = handleStudioGet;
export const POST = handleStudioPost;
