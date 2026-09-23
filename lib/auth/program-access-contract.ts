import { z } from "zod";

export const ACCESS_ASSIGNABLE_ROLES = [
  "content_contributor",
  "program_steward",
  "publishing_approver",
  "one_dsd_team_member",
] as const;

export const ACCESS_ROLE_SCOPES = Object.freeze({
  content_contributor: ["one-dhs", "dsd"],
  program_steward: ["one-dhs", "dsd"],
  publishing_approver: ["one-dhs", "dsd"],
  one_dsd_team_member: ["one-dsd-team"],
} as const);

export const ACCESS_ROLE_LABELS = Object.freeze({
  content_contributor: "Content contributor",
  program_steward: "Program steward",
  publishing_approver: "Publishing approver",
  one_dsd_team_member: "One DSD Team member",
} as const);

export const ACCESS_SCOPE_LABELS = Object.freeze({
  "one-dhs": "One DHS",
  dsd: "Disability Services Division",
  "one-dsd-team": "One DSD Team",
} as const);

const Uuid = z.string().uuid();
const Reason = z.string().trim().min(3).max(500).regex(/^[^\u0000-\u001f\u007f]*$/);
const SignInId = z.string().trim().toLowerCase().regex(/^[a-z0-9][a-z0-9._-]{2,63}$/);

const InviteAccount = z.object({
  action: z.literal("invite_account"),
  signInId: SignInId,
  displayName: z.string().trim().min(2).max(120).regex(/^[^\u0000-\u001f\u007f]*$/),
  expiresInHours: z.union([z.literal(24), z.literal(72), z.literal(168)]),
}).strict();

const InviteCredentialReset = z.object({
  action: z.literal("invite_credential_reset"),
  accountId: Uuid,
  expiresInHours: z.union([z.literal(1), z.literal(8), z.literal(24)]),
}).strict();

const IssueGrant = z.object({
  action: z.literal("issue_grant"),
  accountId: Uuid,
  role: z.enum(ACCESS_ASSIGNABLE_ROLES),
  scopeId: z.enum(["one-dhs", "dsd", "one-dsd-team"]),
  expiresInDays: z.union([z.literal(30), z.literal(90), z.literal(365), z.null()]),
  reason: Reason,
}).strict();

const RevokeGrant = z.object({
  action: z.literal("revoke_grant"),
  grantId: Uuid,
  reason: Reason,
}).strict();

const RevokeInvitation = z.object({
  action: z.literal("revoke_invitation"),
  invitationId: Uuid,
  reason: Reason,
}).strict();

const ChangeAccountState = z.object({
  action: z.literal("change_account_state"),
  accountId: Uuid,
  state: z.enum(["active", "suspended", "revoked"]),
  reason: z.string().trim().min(3).max(483).regex(/^[^\u0000-\u001f\u007f]*$/),
  confirmSignInId: SignInId.optional(),
}).strict();

const CorrectAccountIdentity = z.object({
  action: z.literal("correct_account_identity"),
  accountId: Uuid,
  expectedIdentityVersion: z.number().int().positive(),
  confirmCurrentSignInId: SignInId,
  signInId: SignInId,
  displayName: z.string().trim().min(2).max(120).regex(/^[^\u0000-\u001f\u007f]*$/),
  reason: Reason,
}).strict();

const TransferOwner = z.object({
  action: z.literal("transfer_owner"),
  successorAccountId: Uuid,
  expectedIdentityVersion: z.number().int().positive(),
  confirmSignInId: SignInId,
  reason: z.string().trim().min(3).max(471).regex(/^[^\u0000-\u001f\u007f]*$/),
}).strict();

export const ProgramAccessActionSchema = z.discriminatedUnion("action", [
  InviteAccount,
  InviteCredentialReset,
  IssueGrant,
  RevokeGrant,
  RevokeInvitation,
  ChangeAccountState,
  CorrectAccountIdentity,
  TransferOwner,
]).superRefine((value, context) => {
  if (value.action === "issue_grant") {
    const scopes = ACCESS_ROLE_SCOPES[value.role] as readonly string[];
    if (scopes.includes(value.scopeId)) return;
    context.addIssue({
      code: "custom",
      path: ["scopeId"],
      message: "That permission is not available for the selected program area.",
    });
    return;
  }
  if (value.action === "change_account_state") {
    if (value.state === "revoked" && !value.confirmSignInId) {
      context.addIssue({
        code: "custom",
        path: ["confirmSignInId"],
        message: "Enter the account's exact sign-in ID before ending access permanently.",
      });
    } else if (value.state !== "revoked" && value.confirmSignInId !== undefined) {
      context.addIssue({
        code: "custom",
        path: ["confirmSignInId"],
        message: "Sign-in confirmation applies only when access is ended permanently.",
      });
    }
    return;
  }
});

export type ProgramAccessAction = z.infer<typeof ProgramAccessActionSchema>;
