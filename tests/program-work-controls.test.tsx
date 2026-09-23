// @vitest-environment jsdom
import { afterEach,expect,it,vi } from "vitest";
import { render,fireEvent,waitFor,cleanup } from "@testing-library/react";
import { ProgramWorkControls,ProgramObservationForm } from "@/components/program-work-controls";
const router=vi.hoisted(()=>({refresh:vi.fn()}));
vi.mock("next/navigation",()=>({useRouter:()=>router}));
afterEach(()=>{cleanup();router.refresh.mockClear();vi.restoreAllMocks();vi.unstubAllGlobals();});
it("preserves an unsaved assignment and reuses its request id after an unconfirmed save",async()=>{
 const fetcher=vi.fn().mockResolvedValueOnce({ok:false,status:503,json:async()=>({error:"The save could not be confirmed."})}).mockResolvedValueOnce({ok:true,status:201,json:async()=>({task:{id:"saved"}})});
 vi.stubGlobal("fetch",fetcher);const view=render(<ProgramWorkControls/>);
 fireEvent.change(view.getByLabelText("Work item"),{target:{value:"Prepare a meeting agenda"}});
 fireEvent.change(view.getByLabelText("What should this accomplish?"),{target:{value:"An accessible meeting with clear preparation and follow-through."}});
 fireEvent.submit(view.container.querySelector("form")!);
 await waitFor(()=>expect(view.getByRole("status").textContent).toContain("could not be confirmed"));
 expect((view.getByLabelText("Work item") as HTMLInputElement).value).toBe("Prepare a meeting agenda");
 const first=JSON.parse(fetcher.mock.calls[0][1].body);
 fireEvent.submit(view.container.querySelector("form")!);
 await waitFor(()=>expect(view.getByRole("status").textContent).toBe("Work saved."));
 const second=JSON.parse(fetcher.mock.calls[1][1].body);expect(second.requestId).toBe(first.requestId);
 expect((view.getByLabelText("Work item") as HTMLInputElement).value).toBe("");
});
it("keeps observation writing through a stale-version conflict and asks for a fresh task state",async()=>{
 const fetcher=vi.fn().mockResolvedValue({ok:false,status:409,json:async()=>({error:"This work changed. Refresh it before continuing."})});vi.stubGlobal("fetch",fetcher);
 const task={id:"task-"+"a".repeat(32),status:"started",receipt:undefined,lastEventId:"11111111-1111-4111-8111-111111111111"};
 const view=render(<ProgramObservationForm task={task}/>);
 expect(view.queryByRole("option",{name:"Retry the preparation"})).toBeNull();
 fireEvent.change(view.getByLabelText("Observation and evidence"),{target:{value:"Stop this preparation while the question is clarified."}});
 fireEvent.submit(view.container.querySelector("form")!);
 await waitFor(()=>expect(view.getByRole("status").textContent).toContain("work changed"));
 expect((view.getByLabelText("Observation and evidence") as HTMLTextAreaElement).value).toContain("Stop this preparation");
 expect(JSON.parse(fetcher.mock.calls[0][1].body)).toMatchObject({expectedEventId:task.lastEventId,phase:"cancelled"});
 expect(router.refresh).toHaveBeenCalledTimes(1);
});
it("keeps program-area preparation explicit and reports unfinished work",async()=>{
 const fetcher=vi.fn().mockResolvedValueOnce({ok:true,json:async()=>({prepared:["task-one"]})}).mockResolvedValueOnce({ok:true,json:async()=>({result:{completed:[],failed:[{id:"task-one",reason:"provider unavailable"}],skipped:[]}})});
 vi.stubGlobal("fetch",fetcher);const view=render(<ProgramWorkControls/>);
 fireEvent.click(view.getByRole("button",{name:"Prepare program-area resource reviews"}));
 await waitFor(()=>expect(view.getByRole("status").textContent).toContain("reviews are ready"));
 expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual({action:"prepare"});
 fireEvent.click(view.getByRole("button",{name:"Run assigned work"}));
 await waitFor(()=>expect(view.getByRole("status").textContent).toContain("1 unfinished"));
});
