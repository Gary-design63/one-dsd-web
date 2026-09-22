/**
 * Product federation contract from BUILD_EXECUTION.md sections 4 and 7.
 *
 * A context preference changes the material and recommendations a person sees.
 * It is never an authorization decision for a protected capability.
 */

export const PRODUCT_CONTEXT_IDS = ["one_dhs", "one_dsd"] as const;
export const PRODUCT_CONTEXT_COOKIE = "pac_context";

export type ProductContextId = (typeof PRODUCT_CONTEXT_IDS)[number];

export type ProductContextDefinition = Readonly<{
  id: ProductContextId;
  label: string;
  shortLabel: string;
  description: string;
  relationship: "shared_spine" | "modular_overlay";
  inheritsFrom: ProductContextId | null;
}>;

export const DEFAULT_PRODUCT_CONTEXT: ProductContextId = "one_dhs";

export const PRODUCT_CONTEXTS = [
  {
    id: "one_dhs",
    label: "One DHS — department-wide",
    shortLabel: "One DHS",
    description: "Shared knowledge, tools, and ways to reach the right person for work across DHS.",
    relationship: "shared_spine",
    inheritsFrom: null,
  },
  {
    id: "one_dsd",
    label: "One DSD — Disability Services Division",
    shortLabel: "One DSD",
    description: "One DSD adds the division's own examples, scenarios, and services to everything in One DHS.",
    relationship: "modular_overlay",
    inheritsFrom: "one_dhs",
  },
] as const satisfies readonly ProductContextDefinition[];

const PRODUCT_CONTEXT_BY_ID = new Map<ProductContextId, ProductContextDefinition>(
  PRODUCT_CONTEXTS.map((context) => [context.id, context]),
);

export function resolveProductContext(preference?: unknown): ProductContextId {
  return PRODUCT_CONTEXT_IDS.includes(preference as ProductContextId)
    ? preference as ProductContextId
    : DEFAULT_PRODUCT_CONTEXT;
}

export function getProductContext(context: ProductContextId): ProductContextDefinition {
  return PRODUCT_CONTEXT_BY_ID.get(context) ?? PRODUCT_CONTEXT_BY_ID.get(DEFAULT_PRODUCT_CONTEXT)!;
}

export function contextLineage(context: ProductContextId): readonly ProductContextId[] {
  return context === "one_dsd" ? ["one_dhs", "one_dsd"] : ["one_dhs"];
}

export const PROTECTED_CAPABILITIES = [
  "edit_content",
  "contribute_content",
  "review_content",
  "publish_content",
  "administer_program",
  "use_protected_uploads",
  "submit_dsd_consultation",
  "create_formal_record",
] as const;

export type ProtectedCapability = (typeof PROTECTED_CAPABILITIES)[number];
export type ProtectedAccess = Readonly<Record<ProtectedCapability, boolean>>;

export const NO_PROTECTED_ACCESS: ProtectedAccess = Object.freeze({
  edit_content: false,
  contribute_content: false,
  review_content: false,
  publish_content: false,
  administer_program: false,
  use_protected_uploads: false,
  submit_dsd_consultation: false,
  create_formal_record: false,
});

export type FederatedContextResolution = Readonly<{
  context: ProductContextId;
  definition: ProductContextDefinition;
  lineage: readonly ProductContextId[];
  contextPreferenceGrantsAccess: false;
  protectedAccess: ProtectedAccess;
}>;

function preserveProtectedAccess(access: ProtectedAccess): ProtectedAccess {
  return Object.freeze(Object.fromEntries(
    PROTECTED_CAPABILITIES.map((capability) => [capability, access[capability] === true]),
  ) as unknown as ProtectedAccess);
}

export function resolveFederatedContext(
  preference?: unknown,
  protectedAccess: ProtectedAccess = NO_PROTECTED_ACCESS,
): FederatedContextResolution {
  const context = resolveProductContext(preference);
  return Object.freeze({
    context,
    definition: getProductContext(context),
    lineage: contextLineage(context),
    contextPreferenceGrantsAccess: false,
    protectedAccess: preserveProtectedAccess(protectedAccess),
  });
}
