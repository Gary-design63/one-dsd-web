import { z } from "zod";

/**
 * Data handling classes from BUILD_EXECUTION.md section 12.
 * Unknown material is S2 until an authorized review says otherwise.
 */
export const SENSITIVITY_CLASSES = ["S0", "S1", "S2", "S3", "S4"] as const;
export const SensitivityClassSchema = z.enum(SENSITIVITY_CLASSES);
export type SensitivityClass = z.infer<typeof SensitivityClassSchema>;

export const DEFAULT_SENSITIVITY_CLASS: SensitivityClass = "S2";

export type UnauthenticatedExposureDecision = {
  unauthenticatedExposurePermitted: boolean;
  exposureReason?: string | null;
};

/**
 * S0/S1 is necessary but never sufficient for staff-facing access without a
 * sign-in. A reviewer must also record an affirmative exposure decision and a
 * reason. Keeping that decision in the signature prevents callers from
 * accidentally treating S1 as public-by-default.
 */
export function mayEnterUnauthenticatedProjection(
  value: SensitivityClass,
  decision: UnauthenticatedExposureDecision,
): boolean {
  return (
    (value === "S0" || value === "S1")
    && decision.unauthenticatedExposurePermitted
    && Boolean(decision.exposureReason?.trim())
  );
}

export function mayEnterOrdinaryRetrieval(value: SensitivityClass): boolean {
  return value === "S0" || value === "S1";
}

/**
 * Exact persistence keys that would turn this program into an employee ideology,
 * participation-surveillance, or hidden-profile system. This is defense in depth:
 * domain schemas remain the primary allowlist.
 */
export const PROHIBITED_PERSON_PROFILE_KEYS = new Set([
  "belief_profile",
  "beliefs_by_worker",
  "compliance_score",
  "cultural_competence_score",
  "dei_score",
  "employee_equity_score",
  "employee_equity_readiness",
  "employee_ideology",
  "employee_profile",
  "ideology_by_employee",
  "equity_maturity_score",
  "equity_score",
  "ideology_score",
  "inferred_disability",
  "inferred_ethnicity",
  "inferred_gender_identity",
  "inferred_protected_class",
  "inferred_race",
  "learning_compliance_score",
  "learning_progress_by_employee",
  "completion_by_staff",
  "participation_by_employee",
  "participation_leaderboard",
  "political_beliefs",
  "racial_bias_score",
  "staff_inclusion_ranking",
  "supervisor_participation_dashboard",
  "supervisor_participation_score",
  "worker_inclusion_maturity_score",
  "equity_readiness_rating",
]);

const PROHIBITED_PERSON_PROFILE_KEYS_COMPACT = new Set(
  [...PROHIBITED_PERSON_PROFILE_KEYS].map((key) => key.replaceAll("_", "")),
);

function normalizedKey(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

/**
 * Semantic backstop for previously unseen spelling variants. The patterns all
 * require a sensitive people/ideology concept together with scoring,
 * profiling, ranking, inference, or per-person participation language. Plain
 * evaluation fields such as `score`, `qualityScore`, and `trust_score` remain
 * valid because they do not describe a person or protected belief.
 */
function isSemanticallyProhibitedKey(normalized: string): boolean {
  const compact = normalized.replaceAll("_", "");
  return (
    /^(?:racialbias|equityreadiness|deireadiness|culturalcompetence|equitymaturity|inclusionmaturity)(?:score|rating|ranking|rank|profile)$/.test(compact)
    || /^(?:political|religious|ideological)(?:belief|beliefs|affiliation|affiliations|profile)$/.test(compact)
    || /^(?:beliefs?|ideolog(?:y|ies)|learningprogress|trainingprogress|learningcompletion|trainingcompletion|coursecompletion|completion|activity)(?:by|per)(?:employee|staff|worker|person|individual|member|user|supervisor)$/.test(compact)
    || /^(?:participation|engagement)(?:by|per)(?:employee|staff|worker|person|individual|member|user|supervisor)$/.test(compact)
    || /^(?:employee|staff|worker|personnel|supervisor)(?:equity|dei|ideology|inclusion|bias|participation|engagement|culturalcompetence)(?:score|rating|ranking|rank|profile|dashboard|leaderboard)$/.test(compact)
    || /^(?:employee|staff|worker|personnel|supervisor)(?:equityreadiness|inclusionmaturity|learningprogress|completion|activity)(?:score|rating|ranking|rank|profile|dashboard|leaderboard)?$/.test(compact)
    || /^(?:inferred|predicted|estimated|guessed)(?:race|ethnicity|genderidentity|disability|protectedclass|politicalbeliefs?|religion)$/.test(compact)
  );
}

export class ProhibitedProfileFieldError extends Error {
  readonly code = "prohibited_profile_field";

  constructor(readonly field: string) {
    super(`The work object contains a prohibited employee-profile field: ${field}.`);
    this.name = "ProhibitedProfileFieldError";
  }
}

/** Reject prohibited keys without copying values into errors, logs, or audit records. */
export function assertNoProhibitedProfileFields(value: unknown): void {
  const seen = new WeakSet<object>();

  function visit(candidate: unknown): void {
    if (!candidate || typeof candidate !== "object") return;
    if (seen.has(candidate)) return;
    seen.add(candidate);

    if (Array.isArray(candidate)) {
      for (const item of candidate) visit(item);
      return;
    }

    for (const [key, nested] of Object.entries(candidate as Record<string, unknown>)) {
      const normalized = normalizedKey(key);
      if (
        PROHIBITED_PERSON_PROFILE_KEYS.has(normalized)
        || PROHIBITED_PERSON_PROFILE_KEYS_COMPACT.has(normalized.replaceAll("_", ""))
        || isSemanticallyProhibitedKey(normalized)
      ) {
        throw new ProhibitedProfileFieldError(normalized);
      }
      visit(nested);
    }
  }

  visit(value);
}
