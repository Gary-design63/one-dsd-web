const CONSULTANT_EXACT_RETURN_PATHS = new Set([
  "/consultant",
  "/consultant/audit",
  "/consultant/evals",
  "/consultant/one-dsd-team",
  "/consultant/orchestrator",
  "/consultant/registry",
  "/consultant/research",
  "/consultant/resources",
  "/consultant/review",
  "/consultant/workforce",
]);

const CONSULTANT_ITEM_RETURN_PATH = /^\/consultant\/(?:queue|resources|workforce)\/[A-Za-z0-9][A-Za-z0-9._~-]{0,127}$/;

export function safeConsultantReturnPath(value: string | null | undefined): string {
  if (!value) return "/consultant";
  if (CONSULTANT_EXACT_RETURN_PATHS.has(value)) return value;
  return CONSULTANT_ITEM_RETURN_PATH.test(value) ? value : "/consultant";
}
