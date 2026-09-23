// @vitest-environment jsdom
import { beforeEach, afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { ProgramIdentity } from "@/lib/auth/program-identity";
const mocks = vi.hoisted(() => ({ active:true, contributionActive:true, identity:vi.fn(), contribution:vi.fn(), role:vi.fn(), scope:vi.fn() }));
vi.mock("@/lib/auth/protected-feature-activation",()=>({protectedFeatureActivation:(feature:string)=>({active:feature==="protected_identity"?mocks.active:mocks.contributionActive})}));
vi.mock("@/lib/auth/program-request",()=>({programIdentityFromCookies:mocks.identity,programContributionAccessFromCookies:mocks.contribution,programIdentityHasRole:mocks.role}));
vi.mock("@/lib/product/request-context",()=>({requestedContentScope:mocks.scope}));
import { ContributorWorkspace } from "@/components/contributor-workspace";
import AcceptPage from "@/app/contribute/accept/page";
const copy={ noticeLead:"Invited colleague access is taking a pause.", noticeBody:"Our published access explanation.", staffBody:"Keep exploring.", staffLinks:[{label:"Learning",href:"/learn"},{label:"Practice",href:"/practice"}] };
const identity:ProgramIdentity={ sessionId:"10000000-0000-4000-8000-000000000001", accountId:"10000000-0000-4000-8000-000000000002", credentialId:"10000000-0000-4000-8000-000000000003",signInId:"test.colleague",displayName:"Test Colleague",issuedAt:"2026-09-08T00:00:00.000Z",expiresAt:"2026-09-09T00:00:00.000Z",grants:[] };
beforeEach(()=>{vi.resetAllMocks();mocks.active=true;mocks.contributionActive=true;mocks.identity.mockResolvedValue(null);mocks.scope.mockResolvedValue("dsd");mocks.role.mockReturnValue(false);mocks.contribution.mockResolvedValue({ordinaryActive:true,canDraft:false,canReview:false,canPublish:false,canWithdraw:false});});
afterEach(cleanup);
async function workspace(query:Record<string,string>={}){render(await ContributorWorkspace({copy,searchParams:Promise.resolve(query)}));}
it("keeps published inactive copy and open learning links without identity calls or forms",async()=>{
 mocks.active=false;await workspace();expect(screen.getByText(copy.noticeLead)).toBeTruthy();expect(screen.getByText(copy.noticeBody)).toBeTruthy();expect(screen.getByRole("link",{name:"Learning"}).getAttribute("href")).toBe("/learn");
 expect(document.querySelector("form")).toBeNull();expect(mocks.identity).not.toHaveBeenCalled();
});
it("offers a labeled individual sign-in with native secure-field semantics",async()=>{
 await workspace({denied:"1"});const password=screen.getByLabelText("Passphrase");expect(password.getAttribute("type")).toBe("password");expect(password.getAttribute("autocomplete")).toBe("current-password");
 expect(screen.getByLabelText("Sign-in ID").getAttribute("autocomplete")).toBe("username");expect(password.closest("form")?.getAttribute("action")).toBe("/api/contribute/login");expect(screen.getByRole("alert").textContent).toContain("did not match");expect(screen.getByRole("link",{name:"Set up your individual access"})).toBeTruthy();
});
it("does not convert a valid sign-in without permissions into authoring access",async()=>{
 mocks.identity.mockResolvedValue(identity);await workspace();expect(screen.getByRole("heading",{name:"Welcome, Test Colleague"})).toBeTruthy();expect(screen.queryByRole("link",{name:"Open resource workspace"})).toBeNull();expect(screen.queryByRole("link",{name:"Manage people and access"})).toBeNull();
 expect(mocks.contribution).toHaveBeenCalledWith("dsd");expect(screen.getByRole("button",{name:"Sign out"}).closest("form")?.getAttribute("action")).toBe("/api/contribute/logout");
});
it("shows only the assigned resource workspace, preserving private notes and the current scope",async()=>{
 mocks.identity.mockResolvedValue({...identity,grants:[{grantId:"test-grant",scopeId:"dsd",role:"content_contributor",expiresAt:null}]});mocks.contribution.mockResolvedValue({ordinaryActive:true,canDraft:true});
 await workspace();expect(screen.getByRole("link",{name:"Open resource workspace"}).getAttribute("href")).toBe("/contribute/resources");expect(screen.getByText(/private learning and practice notes remain yours/)).toBeTruthy();
 expect(document.querySelector('a[href="/contribute/content"]')).toBeNull();expect(screen.queryByRole("link",{name:"Manage people and access"})).toBeNull();
});
it("shows named owner administration only after the explicit global owner check",async()=>{
 mocks.identity.mockResolvedValue(identity);mocks.role.mockReturnValue(true);await workspace();expect(mocks.role).toHaveBeenCalledWith(identity,"one-dhs-pac","owner");expect(screen.getByRole("link",{name:"Manage people and access"}).getAttribute("href")).toBe("/contribute/access");
});
it("keeps withdrawal reachable during a pause and explains the limit",async()=>{
 mocks.identity.mockResolvedValue(identity);mocks.contributionActive=false;mocks.contribution.mockResolvedValue({ordinaryActive:false,canWithdraw:true});await workspace();expect(screen.getByRole("link",{name:"Open resource workspace"})).toBeTruthy();expect(screen.getByText(/New changes are paused/)).toBeTruthy();
});
it("tells the person when only this browser was signed out",async()=>{
 await workspace({signout:"local_only"});expect(screen.getByText(/sign-in could not be fully ended/)).toBeTruthy();
});
it("hides invitation forms until access is active",async()=>{
 mocks.active=false;render(await AcceptPage({searchParams:Promise.resolve({})}));expect(screen.queryByRole("button",{name:"Create my sign-in"})).toBeNull();expect(screen.getByText("Invitation acceptance is not open yet.")).toBeTruthy();
});
it("uses a single-use code field and matching new-password fields without displaying a passphrase",async()=>{
 render(await AcceptPage({searchParams:Promise.resolve({denied:"1"})}));expect(screen.getByLabelText("One-time invitation code").getAttribute("autocomplete")).toBe("one-time-code");expect(screen.getByLabelText("New passphrase").getAttribute("autocomplete")).toBe("new-password");expect(screen.getByLabelText("Enter the new passphrase again").getAttribute("type")).toBe("password");expect(screen.getByRole("alert").textContent).toContain("couldn’t finish");expect(document.querySelector("form")?.getAttribute("method")).toBe("post");
});
