import type { NextRequest } from "next/server";
import { handlePracticeOrchestratorPost } from "./handlers";

export async function POST(request: NextRequest) {
  return handlePracticeOrchestratorPost(request);
}
