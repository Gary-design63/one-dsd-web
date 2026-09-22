import { type NextRequest } from "next/server";
import { handleContributorResourceGet } from "./handlers";
export function GET(request: NextRequest) { return handleContributorResourceGet(request); }
