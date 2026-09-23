import { notFound, redirect } from "next/navigation";
import { currentLearningStage } from "@/lib/domains/learning";

/** Preserve original stage bookmarks while using the current six-stage learning page. */
export default async function LearningStageAlias({ params }: { params: Promise<{ stage: string }> }) {
  const stage = currentLearningStage((await params).stage);
  if (!stage) notFound();
  redirect("/learn#" + stage.id);
}
