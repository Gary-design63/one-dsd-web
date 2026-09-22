// @vitest-environment jsdom
import {beforeEach,afterEach,it,expect,vi} from "vitest";
import {render,screen,fireEvent,waitFor,within,cleanup} from "@testing-library/react";
import {ProgramAccessManager} from "@/components/program-access-manager";
import type {ProgramAccessOverview} from "@/lib/auth/program-identity";
const routing=vi.hoisted(()=>({refresh:vi.fn(),replace:vi.fn()}));
vi.mock("next/navigation",()=>({useRouter:()=>routing}));
const owner="10000000-0000-4000-8000-000000000001", colleague="10000000-0000-4000-8000-000000000002";
const overview:ProgramAccessOverview={accounts:[
 {accountId:owner,identityVersion:1,signInId:"test.owner",displayName:"Test Owner",state:"active",createdAt:"2026-09-08T00:00:00.000Z"},
 {accountId:colleague,identityVersion:7,signInId:"test.colleague",displayName:"Test Colleague",state:"active",createdAt:"2026-09-08T00:00:00.000Z"}],
 grants:[],openInvitations:[],pagination:{accountOffset:0,accountLimit:50,accountTotal:2,invitationOffset:0,invitationLimit:50,invitationTotal:0}};
let fetchMock:ReturnType<typeof vi.fn>;
beforeEach(()=>{vi.clearAllMocks();fetchMock=vi.fn().mockResolvedValue(new Response(JSON.stringify({ok:true,message:"Access updated."}),{status:200,headers:{"content-type":"application/json"}}));vi.stubGlobal("fetch",fetchMock);});
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
function mount(value=overview){render(<ProgramAccessManager initialOverview={value} currentAccountId={owner}/>);}
function section(name:string){return within(screen.getByRole("region",{name}));}
function submitWith(button:HTMLElement){fireEvent.submit(button.closest("form")!);}
it("keeps account invitation separate from assigning a scoped responsibility",async()=>{
 mount();const invite=section("Create named access");fireEvent.change(invite.getByLabelText("Person's name"),{target:{value:"New Colleague"}});fireEvent.change(invite.getByLabelText(/^Sign-in ID/),{target:{value:"new.colleague"}});submitWith(invite.getByRole("button",{name:"Create invitation"}));
 await waitFor(()=>expect(fetchMock).toHaveBeenCalledOnce());expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({action:"invite_account",displayName:"New Colleague",signInId:"new.colleague",expiresInHours:72});expect(JSON.parse(fetchMock.mock.calls[0][1].body)).not.toHaveProperty("role");
});
it("restricts role choices and resets the available scope when responsibility changes",async()=>{
 mount();const permissions=section("Add permission");const role=permissions.getByLabelText("Responsibility");
 expect(within(role).queryByRole("option",{name:"Program owner"})).toBeNull();fireEvent.change(role,{target:{value:"one_dsd_team_member"}});
 expect(within(permissions.getByLabelText("Program area")).getAllByRole("option").map(option=>option.textContent)).toEqual(["One DSD Team"]);
 fireEvent.change(permissions.getByLabelText("Person"),{target:{value:colleague}});fireEvent.change(permissions.getByLabelText("Reason for this permission"),{target:{value:"Support the team."}});fireEvent.change(permissions.getByLabelText("Permission duration"),{target:{value:"none"}});submitWith(permissions.getByRole("button",{name:"Add permission"}));
 await waitFor(()=>expect(fetchMock).toHaveBeenCalledOnce());expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({action:"issue_grant",accountId:colleague,role:"one_dsd_team_member",scopeId:"one-dsd-team",expiresInDays:null,reason:"Support the team."});
});
it("keeps the exact correction identity version, asks for current ID, and routes a self-correction to sign-in",async()=>{
 fetchMock.mockResolvedValue(new Response(JSON.stringify({ok:true,currentSessionEnded:true}),{status:200}));mount();
 const article=screen.getByRole("heading",{name:"Test Owner · Current program owner"}).closest("article")!;
 const controls=within(article);fireEvent.change(controls.getByLabelText("Corrected name"),{target:{value:"Corrected Owner"}});fireEvent.change(controls.getByLabelText("Enter the current sign-in ID to confirm"),{target:{value:"test.owner"}});fireEvent.change(controls.getByLabelText(/^Reason for the correction/),{target:{value:"Name corrected."}});submitWith(controls.getByRole("button",{name:"Save corrected details",hidden:true}));
 await waitFor(()=>expect(routing.replace).toHaveBeenCalledWith("/contribute?identity=corrected"));expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({action:"correct_account_identity",accountId:owner,expectedIdentityVersion:1,confirmCurrentSignInId:"test.owner",displayName:"Corrected Owner"});expect(controls.queryByRole("button",{name:"End access permanently",hidden:true})).toBeNull();
});
it("sends the selected successor's current version and exact ID without including current owner as an option",async()=>{
 fetchMock.mockResolvedValue(new Response(JSON.stringify({ok:true,transferred:true}),{status:200}));mount();const transfer=section("Program ownership");const select=transfer.getByLabelText("Successor");expect(within(select).queryByRole("option",{name:/Test Owner/})).toBeNull();
 fireEvent.change(select,{target:{value:colleague}});fireEvent.change(transfer.getByLabelText("Enter the successor's exact sign-in ID"),{target:{value:"test.colleague"}});fireEvent.change(transfer.getByLabelText("Reason for transferring ownership"),{target:{value:"Planned succession."}});submitWith(transfer.getByRole("button",{name:"Transfer program ownership"}));
 await waitFor(()=>expect(routing.replace).toHaveBeenCalledWith("/contribute?ownership=transferred"));expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({action:"transfer_owner",successorAccountId:colleague,expectedIdentityVersion:7,confirmSignInId:"test.colleague",reason:"Planned succession."});
});
it("keeps one-time codes in the current view only and handles failed clipboard access",async()=>{
 fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ok:true,oneTimeCode:"synthetic-code",invitationId:"invitation-reference",expiresAt:"2026-09-11T00:00:00.000Z"}),{status:200}));
 const localSpy=vi.spyOn(Storage.prototype,"setItem");Object.defineProperty(navigator,"clipboard",{value:{writeText:vi.fn().mockRejectedValue(Error("Blocked"))},configurable:true});
 mount();submitWith(section("Create named access").getByRole("button",{name:"Create invitation"}));await waitFor(()=>expect(screen.getByLabelText("One-time invitation code").textContent).toContain("synthetic-code"));
 expect(localSpy).not.toHaveBeenCalled();fireEvent.click(screen.getByRole("button",{name:"Copy code"}));await waitFor(()=>expect(screen.getByRole("alert").textContent).toContain("Select and copy"));
 submitWith(section("Create named access").getByRole("button",{name:"Create invitation"}));await waitFor(()=>expect(screen.queryByLabelText("One-time invitation code")).toBeNull());localSpy.mockRestore();
});
it("keeps rejected forms and tells the owner a change did not complete",async()=>{
 fetchMock.mockResolvedValue(new Response(JSON.stringify({error:"Access changed. Reload this page."}),{status:409}));mount();const invite=section("Create named access");fireEvent.change(invite.getByLabelText("Person's name"),{target:{value:"Keep This Name"}});submitWith(invite.getByRole("button",{name:"Create invitation"}));await waitFor(()=>expect(screen.getByRole("alert").textContent).toContain("Access changed"));expect((invite.getByLabelText("Person's name") as HTMLInputElement).value).toBe("Keep This Name");expect(routing.refresh).not.toHaveBeenCalled();
});
it("offers independent account and invitation pagination without losing the other page",()=>{
 mount({...overview,pagination:{...overview.pagination,accountOffset:50,accountTotal:130,invitationOffset:100,invitationTotal:180}});
 expect(screen.getByRole("link",{name:"Previous accounts"}).getAttribute("href")).toBe("/contribute/access?accounts=1&invitations=3");
 expect(screen.getByRole("link",{name:"Next accounts"}).getAttribute("href")).toBe("/contribute/access?accounts=3&invitations=3");
 expect(screen.getByRole("link",{name:"Previous invitations"}).getAttribute("href")).toBe("/contribute/access?accounts=2&invitations=2");
 expect(screen.getByRole("link",{name:"Next invitations"}).getAttribute("href")).toBe("/contribute/access?accounts=2&invitations=4");
});
