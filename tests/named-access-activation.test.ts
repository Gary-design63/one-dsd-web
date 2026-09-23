import { afterEach, describe, expect, it, vi } from "vitest";
import register from "@/config/contributor-access.json";
import { protectedActivationBundleSha256, protectedFeatureActivation, contributorPublicationStopped } from "@/lib/auth/protected-feature-activation";
import { protectedMutationContextFromSessionToken, protectedMutationParameters } from "@/lib/auth/protected-mutation";
import { runCycle } from "@/lib/intelligence/agents/cycle";
import { resetStoreForTests } from "@/lib/intelligence/memory/store";
import { setPolicy } from "@/lib/intelligence/policy";

const cleanup = vi.hoisted(() => vi.fn());
vi.mock("@/lib/auth/program-identity-housekeeping", () => ({ runProgramIdentityHousekeepingIfConfigured: cleanup }));
function configured(): NodeJS.ProcessEnv {
  return { NODE_ENV: "test", PAC_DATA_ENV: "local",
    PAC_CONTRIBUTOR_DATABASE_URL: "postgresql://pac_contributor_runtime@127.0.0.1/test",
    PAC_PROGRAM_AUTH_DATABASE_URL: "postgresql://pac_authentication_broker@127.0.0.1/test",
    PAC_PROTECTED_IDENTITY_ENABLED: "on", PAC_PROTECTED_CONTRIBUTION_ENABLED: "on",
    PAC_PROTECTED_IDENTITY_ACTIVATION_EVIDENCE_ID: register.features.protected_identity.evidence_id,
    PAC_PROTECTED_IDENTITY_ACTIVATION_BUNDLE_SHA256: protectedActivationBundleSha256(register,"protected_identity"),
    PAC_PROTECTED_CONTRIBUTION_ACTIVATION_EVIDENCE_ID: register.features.protected_contribution.evidence_id,
    PAC_PROTECTED_CONTRIBUTION_ACTIVATION_BUNDLE_SHA256: protectedActivationBundleSha256(register,"protected_contribution"),
  };
}
afterEach(() => vi.unstubAllEnvs());

describe("separate named-access contract and current context", () => {
  it("leaves named access inactive in a clean clone", () => {
    expect(protectedFeatureActivation("protected_identity",{NODE_ENV:"test"}).active).toBe(false);
    expect(protectedFeatureActivation("protected_contribution",{NODE_ENV:"test"},undefined,"exposure_reduction").active).toBe(false);
  });
  it("recognizes exact contract bindings and independent role connections", () => {
    expect(protectedFeatureActivation("protected_contribution",configured())).toMatchObject({active:true,environment:"local"});
    const changed=structuredClone(register); changed.features.protected_identity.bindings.session_hours=12;
    expect(protectedFeatureActivation("protected_identity",configured(),changed).active).toBe(false);
    expect(protectedFeatureActivation("protected_identity",{...configured(),PAC_PROGRAM_AUTH_DATABASE_URL:configured().PAC_CONTRIBUTOR_DATABASE_URL}).active).toBe(false);
  });
  it("refuses mismatched evidence, missing dependencies and unsafe transport", () => {
    for(const overrides of [
      {PAC_PROTECTED_IDENTITY_ACTIVATION_BUNDLE_SHA256:"f".repeat(64)},
      {PAC_PROTECTED_IDENTITY_ACTIVATION_EVIDENCE_ID:"unrelated-evidence"},
      {PAC_PROTECTED_IDENTITY_ENABLED:"off"},
      {PAC_DATA_ENV:"preview"},
      {PAC_PROGRAM_AUTH_DATABASE_URL:undefined},
    ]) expect(protectedFeatureActivation("protected_contribution",{...configured(),...overrides}).active).toBe(false);
  });
  it("allows narrowly scoped withdrawal during a contributor pause", () => {
    const environment={...configured(),PAC_CONTRIBUTOR_WRITES_PAUSED:"on",PAC_PROTECTED_CONTRIBUTION_ENABLED:"off"};
    expect(contributorPublicationStopped(environment)).toBe(true);
    expect(protectedFeatureActivation("protected_contribution",environment).active).toBe(false);
    expect(protectedFeatureActivation("protected_contribution",environment,undefined,"exposure_reduction").active).toBe(true);
    expect(protectedFeatureActivation("protected_contribution",{...environment,PAC_PROTECTED_IDENTITY_ENABLED:"off"},undefined,"exposure_reduction").active).toBe(false);
    expect(contributorPublicationStopped({...configured(),PAC_CONTRIBUTOR_WRITES_PAUSED:"unexpected"})).toBe(true);
  });
  it("keeps bearer tokens out of mutation SQL parameters and pins server-held evidence", () => {
    const token="A".repeat(43);
    const context=protectedMutationContextFromSessionToken(token,"resource_draft_save",configured());
    const params=protectedMutationParameters(context,"dsd","resource_draft_save","resource-example",{note:"Synthetic"});
    expect(params).toHaveLength(10); expect(params).not.toContain(token);
    expect(context.sessionTokenDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(params.slice(1,7)).toEqual(["local",register.features.protected_identity.evidence_id,configured().PAC_PROTECTED_IDENTITY_ACTIVATION_BUNDLE_SHA256,register.features.protected_contribution.evidence_id,configured().PAC_PROTECTED_CONTRIBUTION_ACTIVATION_BUNDLE_SHA256,"dsd"]);
    expect(()=>protectedMutationContextFromSessionToken("bad","resource_withdraw",configured())).toThrow(/session/i);
  });
});
describe("named cleanup stays separate from agent work",()=>{
  it("runs while agents are stopped and records only counts",async()=>{
    resetStoreForTests(); await setPolicy({killed:true},"owner");
    cleanup.mockResolvedValueOnce({configured:true,expiredInvitationsClosed:2,expiredSessionsDeleted:3});
    const report=await runCycle("owner");
    expect(cleanup).toHaveBeenCalled();
    expect(report.steps).toContainEqual(expect.objectContaining({name:"purge expired named-session records",outcome:"done",detail:"2 expired invitations closed; 3 expired sessions removed"}));
    expect(report.exceptions).toEqual([]);
  });
  it("records a failure without leaking underlying connection text or stopping existing cleanup",async()=>{
    resetStoreForTests(); await setPolicy({killed:true},"owner");
    cleanup.mockRejectedValueOnce(new Error("postgresql://synthetic-sensitive-detail"));
    const report=await runCycle("owner");
    expect(report.steps).toContainEqual(expect.objectContaining({name:"purge expired named-session records",outcome:"denied"}));
    expect(report.steps).toContainEqual(expect.objectContaining({name:"purge expired ASK response records",outcome:"done"}));
    expect(report.exceptions.join(" ")).toContain("Named contributor security cleanup failed.");
    expect(JSON.stringify(report)).not.toContain("synthetic-sensitive-detail");
  });
});
