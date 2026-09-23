import { beforeEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const mocks=vi.hoisted(()=>({active:true,principal:vi.fn(),store:{inviteAccount:vi.fn(),inviteCredentialReset:vi.fn(),issueGrant:vi.fn(),revokeGrant:vi.fn(),revokeInvitation:vi.fn(),accountAccessTarget:vi.fn(),changeAccountState:vi.fn(),correctAccountIdentity:vi.fn(),transferOwner:vi.fn()}}));
vi.mock("@/lib/auth/protected-feature-activation",()=>({protectedFeatureActivation:()=>({active:mocks.active})}));
vi.mock("@/lib/auth/program-request",()=>({programMutationPrincipalFromRequest:mocks.principal}));
vi.mock("@/lib/auth/program-identity",()=>({PROGRAM_SESSION_COOKIE:"pac_program_session",PROGRAM_SESSION_SECONDS:28800,programIdentityStore:()=>mocks.store}));
import { POST } from "@/app/api/contribute/access/route";
const owner="10000000-0000-4000-8000-000000000001", colleague="10000000-0000-4000-8000-000000000002", reference="10000000-0000-4000-8000-000000000003", token="x".repeat(43);
const invite={action:"invite_account",signInId:"test.colleague",displayName:"Test Colleague",expiresInHours:72};
const target={accountId:colleague,signInId:"test.colleague",displayName:"Test Colleague",identityVersion:3,state:"active",createdAt:"2026-09-08T00:00:00.000Z"};
const correction={action:"correct_account_identity",accountId:colleague,expectedIdentityVersion:3,confirmCurrentSignInId:"test.colleague",signInId:"corrected.colleague",displayName:"Corrected Colleague",reason:"Correct a misspelling."};
const transfer={action:"transfer_owner",successorAccountId:colleague,expectedIdentityVersion:3,confirmSignInId:"test.colleague",reason:"Planned succession."};
function request(body:unknown=invite,origin="https://program.example"){return new NextRequest("https://program.example/api/contribute/access",{method:"POST",headers:{origin,"content-type":"application/json",cookie:"pac_owner=synthetic"},body:JSON.stringify(body)});}
beforeEach(()=>{vi.resetAllMocks();mocks.active=true;mocks.principal.mockResolvedValue({sessionToken:token,identity:{accountId:owner}});mocks.store.accountAccessTarget.mockResolvedValue(target);mocks.store.inviteAccount.mockResolvedValue({token:"one-time-synthetic",invitationId:reference,expiresAt:"2026-09-11T00:00:00.000Z"});mocks.store.inviteCredentialReset.mockResolvedValue({token:"reset-synthetic",invitationId:reference,expiresAt:"2026-09-09T00:00:00.000Z"});});
it("rejects cross-origin and inactive mutations before named authority lookup",async()=>{
 expect((await POST(request(invite,"https://elsewhere.example"))).status).toBe(403);mocks.active=false;expect((await POST(request())).status).toBe(503);expect(mocks.principal).not.toHaveBeenCalled();expect(mocks.store.inviteAccount).not.toHaveBeenCalled();
});
it("requires the named global owner even when a legacy owner cookie is supplied",async()=>{
 mocks.principal.mockResolvedValue(null);const response=await POST(request());expect(response.status).toBe(401);expect(mocks.principal).toHaveBeenCalledWith(expect.anything(),"one-dhs-pac","owner");expect(mocks.store.inviteAccount).not.toHaveBeenCalled();
});
it("refuses oversized, unknown, and role/scope-forged actions before any write",async()=>{
 expect((await POST(request({...invite,displayName:"x".repeat(9000)}))).status).toBe(413);
 expect((await POST(request({...invite,unknown:"field"}))).status).toBe(400);
 expect((await POST(request({action:"issue_grant",accountId:colleague,role:"owner",scopeId:"one-dhs-pac",expiresInDays:null,reason:"Synthetic"}))).status).toBe(400);
 expect((await POST(request({action:"issue_grant",accountId:colleague,role:"one_dsd_team_member",scopeId:"one-dhs",expiresInDays:null,reason:"Synthetic"}))).status).toBe(400);
 expect(mocks.store.inviteAccount).not.toHaveBeenCalled();expect(mocks.store.issueGrant).not.toHaveBeenCalled();
});
it("returns a one-time invitation only in a no-store response from the named owner's token",async()=>{
 const response=await POST(request());expect(response.status).toBe(200);expect(response.headers.get("cache-control")).toBe("no-store");expect(await response.json()).toMatchObject({oneTimeCode:"one-time-synthetic",invitationId:reference});expect(mocks.store.inviteAccount).toHaveBeenCalledWith(token,{signInId:"test.colleague",displayName:"Test Colleague",expiresAt:expect.any(String)});expect(response.headers.get("set-cookie")).toBeNull();
});
it("dispatches scoped grant, revoke, reset, and invitation-close actions without trusting an actor ID",async()=>{
 const grant={action:"issue_grant",accountId:colleague,role:"content_contributor",scopeId:"dsd",expiresInDays:null,reason:"Prepare resources."};
 expect((await POST(request(grant))).status).toBe(200);expect(mocks.store.issueGrant).toHaveBeenCalledWith(token,{accountId:colleague,role:"content_contributor",scopeId:"dsd",expiresAt:null,reason:"Prepare resources."});
 await POST(request({action:"revoke_grant",grantId:reference,reason:"Work reassigned."}));expect(mocks.store.revokeGrant).toHaveBeenCalledWith(token,reference,"Work reassigned.");
 await POST(request({action:"revoke_invitation",invitationId:reference,reason:"Invitation replaced."}));expect(mocks.store.revokeInvitation).toHaveBeenCalledWith(token,reference,"Invitation replaced.");
 await POST(request({action:"invite_credential_reset",accountId:colleague,expiresInHours:8}));expect(mocks.store.inviteCredentialReset).toHaveBeenCalledWith(token,{accountId:colleague,expiresAt:expect.any(String)});
});
it("refuses self-suspension, no-op state changes, and changes to permanently revoked accounts",async()=>{
 expect((await POST(request({action:"change_account_state",accountId:owner,state:"suspended",reason:"Synthetic pause."}))).status).toBe(400);
 expect((await POST(request({action:"change_account_state",accountId:colleague,state:"active",reason:"Synthetic resume."}))).status).toBe(400);
 mocks.store.accountAccessTarget.mockResolvedValue({...target,state:"revoked"});expect((await POST(request({action:"change_account_state",accountId:colleague,state:"active",reason:"Synthetic resume."}))).status).toBe(400);expect(mocks.store.changeAccountState).not.toHaveBeenCalled();
});
it("requires the exact current sign-in ID for permanent account revocation",async()=>{
 const action={action:"change_account_state",accountId:colleague,state:"revoked",reason:"Account no longer needed.",confirmSignInId:"wrong.colleague"};
 expect((await POST(request(action))).status).toBe(400);expect(mocks.store.changeAccountState).not.toHaveBeenCalled();
 expect((await POST(request({...action,confirmSignInId:target.signInId}))).status).toBe(200);expect(mocks.store.changeAccountState).toHaveBeenCalledWith(token,colleague,"revoked",action.reason,target.signInId);
});
it("rejects stale identity correction and no-op edits before calling the atomic store operation",async()=>{
 expect((await POST(request({...correction,expectedIdentityVersion:2}))).status).toBe(409);
 expect((await POST(request({...correction,confirmCurrentSignInId:"old.colleague"}))).status).toBe(409);
 expect((await POST(request({...correction,signInId:target.signInId,displayName:target.displayName}))).status).toBe(400);expect(mocks.store.correctAccountIdentity).not.toHaveBeenCalled();
});
it("passes exact correction version and identity to the store and clears only the named cookie on a self-correction",async()=>{
 mocks.store.accountAccessTarget.mockResolvedValue({...target,accountId:owner});const response=await POST(request({...correction,accountId:owner}));
 expect(mocks.store.correctAccountIdentity).toHaveBeenCalledWith(token,{accountId:owner,expectedIdentityVersion:3,currentSignInId:"test.colleague",signInId:"corrected.colleague",displayName:"Corrected Colleague",reason:correction.reason});
 expect(await response.json()).toMatchObject({currentSessionEnded:true});expect(response.headers.get("set-cookie")).toContain("pac_program_session=;");expect(response.headers.get("set-cookie")).not.toContain("pac_owner");
});
it.each([{expectedIdentityVersion:2},{confirmSignInId:"wrong.colleague"},{successorAccountId:owner}])("refuses stale, mismatched or self-directed ownership transfer",async patch=>{
 if(patch.successorAccountId===owner)mocks.store.accountAccessTarget.mockResolvedValue({...target,accountId:owner});
 expect((await POST(request({...transfer,...patch}))).status).toBe(400);expect(mocks.store.transferOwner).not.toHaveBeenCalled();
});
it("refuses inactive successors and preserves the final atomic transfer confirmation",async()=>{
 mocks.store.accountAccessTarget.mockResolvedValueOnce({...target,state:"suspended"});expect((await POST(request(transfer))).status).toBe(400);
 const response=await POST(request(transfer));expect(mocks.store.transferOwner).toHaveBeenCalledWith(token,colleague,3,"test.colleague","Planned succession.");expect(await response.json()).toMatchObject({transferred:true});expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
});
it.each([["PAI01",401],["PAA01",403],["42501",403],["PAF01",503],["23505",409],["40001",409],["22023",400],["P0002",404]])("maps %s to a safe response without leaking database details",async(code,status)=>{
 mocks.store.inviteAccount.mockRejectedValue(Object.assign(Error("private database text"),{code}));const response=await POST(request());expect(response.status).toBe(status);expect(response.headers.get("cache-control")).toBe("no-store");expect(await response.text()).not.toContain("private database");if(code==="PAI01")expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
});
