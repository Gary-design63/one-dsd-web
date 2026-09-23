/** The owner's program-wide training-credit rule; this does not grant an exception. */
export const TRAINING_CREDIT_NOTICE =
  "Participation and course completion in this program do not count toward DHS-required training credits unless management, a director, or DHS leadership expressly approves an exception.";

/** Shared reasoning context; staff receive the concise notice when it is relevant. */
export function trainingCreditContext(): string {
  return [
    TRAINING_CREDIT_NOTICE,
    "No training-credit exception is established by this program. Do not infer one from participation, a completed course, a saved work product, a referral, or a manager encouraging learning. The program and ASK cannot grant or verify an exception without actual evidence of the relevant authorization.",
    "Optional program participation does not waive existing DHS policy, required training, or applicable Equity Analysis Toolkit obligations. A training-credit exception does not by itself change those obligations or make this program's notes and progress official DHS records.",
  ].join("\n");
}
