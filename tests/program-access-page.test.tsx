import {beforeEach,it,expect,vi} from "vitest";
import {renderToStaticMarkup} from "react-dom/server";
const mocks=vi.hoisted(()=>({active:true,principal:vi.fn(),overview:vi.fn(),redirect:vi.fn()}));
vi.mock("@/lib/auth/protected-feature-activation",()=>({protectedFeatureActivation:()=>({active:mocks.active})}));
vi.mock("@/lib/auth/program-request",()=>({programMutationPrincipalFromCookies:mocks.principal}));
vi.mock("@/lib/auth/program-identity",()=>({programIdentityStore:()=>({accessOverview:mocks.overview})}));
vi.mock("next/navigation",()=>({redirect:mocks.redirect}));
vi.mock("@/components/program-access-manager",()=>({ProgramAccessManager:()=> <p>Named access controls</p>}));
import Page from "@/app/contribute/access/page";
const result={accounts:[],grants:[],openInvitations:[],pagination:{accountOffset:0,accountLimit:50,accountTotal:0,invitationOffset:0,invitationLimit:50,invitationTotal:0}};
beforeEach(()=>{vi.resetAllMocks();mocks.active=true;mocks.principal.mockResolvedValue({sessionToken:"synthetic-bearer",identity:{accountId:"synthetic-owner"}});mocks.overview.mockResolvedValue(result);mocks.redirect.mockImplementation((href:string)=>{throw Error("REDIRECT:"+href)});});
it("does not read named accounts while access is inactive",async()=>{
 mocks.active=false;expect(renderToStaticMarkup(await Page({}))).toContain("People and access is not active.");expect(mocks.principal).not.toHaveBeenCalled();expect(mocks.overview).not.toHaveBeenCalled();
});
it("requires a named global owner before reading the paginated overview",async()=>{
 mocks.principal.mockResolvedValue(null);await expect(Page({})).rejects.toThrow("REDIRECT:/contribute");expect(mocks.principal).toHaveBeenCalledWith("one-dhs-pac","owner");expect(mocks.overview).not.toHaveBeenCalled();
});
it("reads independently bounded account and invitation pages with only the verified bearer",async()=>{
 mocks.overview.mockResolvedValue({...result,pagination:{...result.pagination,accountTotal:200,invitationTotal:200}});
 expect(renderToStaticMarkup(await Page({searchParams:Promise.resolve({accounts:"3",invitations:"2"})}))).toContain("Named access controls");
 expect(mocks.overview).toHaveBeenCalledWith("synthetic-bearer",{accountOffset:100,accountLimit:50,invitationOffset:50,invitationLimit:50});
});
it("normalizes invalid page numbers and redirects after totals shrink",async()=>{
 await Page({searchParams:Promise.resolve({accounts:"-1",invitations:"9999999999"})});expect(mocks.overview).toHaveBeenCalledWith("synthetic-bearer",{accountOffset:0,accountLimit:50,invitationOffset:0,invitationLimit:50});
 await expect(Page({searchParams:Promise.resolve({accounts:"9",invitations:"8"})})).rejects.toThrow("REDIRECT:/contribute/access?accounts=1&invitations=1");
});
it("shows an honest service failure without claiming accounts were changed or opened",async()=>{
 mocks.overview.mockRejectedValue(Error("Synthetic storage unavailable"));const html=renderToStaticMarkup(await Page({}));expect(html).toContain("could not be opened");expect(html).not.toContain("Named access controls");expect(html).not.toContain("Synthetic storage");
});
