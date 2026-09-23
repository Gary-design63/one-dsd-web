export type SemanticFailureStage = "binding" | "admission" | "model_files" | "projection" | "dependency_import" | "model_session" | "index_preparation" | "embedding";
const allowedCodes = new Set(["ENOENT", "MODULE_NOT_FOUND", "ERR_MODULE_NOT_FOUND", "ERR_DLOPEN_FAILED", "EACCES", "EROFS", "ENOMEM", "ERR_WORKER_OUT_OF_MEMORY"]);
const allowedReasons = new Set(["model_binding", "model_unavailable", "model_integrity", "busy", "index_warming", "capacity", "inference_failed"]);
const reportedFailures = new WeakSet<object>();

/** Finite operational metadata only. Never include exception messages or staff text. */
export function semanticFailureDiagnostic(stage: SemanticFailureStage, error: unknown) {
  const value = error && typeof error === "object" ? error as { reason?: unknown } : {};
  let code = "unclassified";
  let dependency = "undetermined";
  let current: unknown = error;
  const visited = new Set<object>();
  for (let depth = 0; depth < 4 && current && typeof current === "object" && !visited.has(current); depth++) {
    visited.add(current);
    const candidate = current as { code?: unknown; message?: unknown; cause?: unknown };
    if (code === "unclassified" && typeof candidate.code === "string" && allowedCodes.has(candidate.code)) code = candidate.code;
    if (dependency === "undetermined" && typeof candidate.message === "string") {
      const message = candidate.message.toLowerCase();
      dependency = ["sharp", "libvips", "onnxruntime-node", "onnxruntime-common", "transformers"].find(name => message.includes(name)) ?? "undetermined";
    }
    current = candidate.cause;
  }
  return {
    event: "pac_local_semantic_unavailable",
    stage,
    dependency,
    reason: typeof value.reason === "string" && allowedReasons.has(value.reason) ? value.reason : "inference_failed",
    code,
  };
}

/** A propagated initialization failure is logged once, even across shared callers. */
export function reportSemanticFailure(stage: SemanticFailureStage, error: unknown) {
  if (error && typeof error === "object") {
    if (reportedFailures.has(error)) return;
    reportedFailures.add(error);
  }
  console.warn(semanticFailureDiagnostic(stage, error));
}
