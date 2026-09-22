import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ParticipationNotice } from "@/components/participation-notice";
import { PARTICIPATION_CONTRACTS } from "@/lib/participation/contracts";
import { TRAINING_CREDIT_NOTICE, trainingCreditContext } from "@/lib/program/learning-credit";

describe("the program training-credit rule", () => {
  it.each(["learning", "path_practice"] as const)("states the explicit exception boundary beside %s", (surface) => {
    const html = renderToStaticMarkup(createElement(ParticipationNotice, { surface }));
    expect(html).toContain(TRAINING_CREDIT_NOTICE);
    expect(html).toContain("do not count toward DHS-required training credits unless management, a director, or DHS leadership expressly approves an exception");
    expect(html.split(TRAINING_CREDIT_NOTICE)).toHaveLength(2);
    expect(html).toContain("stay on this device until you delete them");
    expect(html).toContain("anyone using this computer may see them");
    expect(html).toMatch(/not shared with supervisors|not sent to your supervisor/);
  });

  it("keeps the exception consistent across optional learning, support, and collaboration contracts", () => {
    const surfaces = ["ask", "learning", "path_practice", "my_work", "consultation_preview", "consultation_submission", "consultation_tracking", "one_dsd_team"] as const;
    for (const surface of surfaces) {
      const contract = PARTICIPATION_CONTRACTS[surface];
      expect(contract.disclosure.purpose).toContain(TRAINING_CREDIT_NOTICE);
      expect(contract.requirement).toBe("voluntary");
      expect(contract.officialRecord).toBe(false);
    }
  });

  it("does not turn participation or encouragement into an established credit exception", () => {
    const context = trainingCreditContext();
    expect(context).toContain(TRAINING_CREDIT_NOTICE);
    expect(context).toContain("No training-credit exception is established by this program");
    expect(context).toContain("a manager encouraging learning");
    expect(context).toContain("cannot grant or verify an exception without actual evidence");
  });

  it("preserves applicable duties and distinguishes private learning from official records", () => {
    const context = trainingCreditContext();
    expect(context).toContain("does not waive existing DHS policy, required training, or applicable Equity Analysis Toolkit obligations");
    expect(context).toContain("does not by itself change those obligations");
    expect(PARTICIPATION_CONTRACTS.learning.disclosure.officialRecord).toContain("does not create an official DHS training record");
    expect(PARTICIPATION_CONTRACTS.learning.viewers).toEqual(["participant", "same_browser_user"]);
    expect(PARTICIPATION_CONTRACTS.path_practice.viewers).toEqual(["participant", "same_browser_user"]);
  });
});
