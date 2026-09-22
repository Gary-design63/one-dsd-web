import { beforeEach, expect, it } from "vitest";
import { getStore, resetStoreForTests } from "@/lib/intelligence/memory/store";
import { surveillanceRefuse } from "@/lib/intelligence/safety";
import { DOMAIN_CORPUS } from "@/lib/content/corpus-domains";
import type { ConsultRequest } from "@/lib/intelligence/consult/schema";
import { buildTestConsultationRecord } from "./helpers/consultation-record";
import { assertWorkObjectPersistence } from "@/lib/trust/work-object-contract";
import { matchStaffAskTopic } from "@/lib/content/staff-ask-topics";
import { expectStaffAskClosed } from "./helpers/staff-ask-closed";

beforeEach(() => resetStoreForTests());

it("does not open a staff Ask-to-consultation handoff", async () => {
  await expectStaffAskClosed();
  expect(matchStaffAskTopic("gp-10")?.id).toBe("gp-10");
  expect(await getStore().list<ConsultRequest>("consult_request")).toEqual([]);
  const source = DOMAIN_CORPUS.find(item => item.id === "pn-measurement-without-surveillance");
  expect(source?.title).toBeTruthy();
});

it.each([
  "Measuring whether equity work is working, without scoring people",
  "Review the program outcomes, without ranking employees.",
])("accepts the bounded negative modifier in guidance: %s", title => {
  expect(surveillanceRefuse(title)).toEqual({ ok: true });
});

it.each([
  "Score employees by equity maturity.",
  "Rank staff by equity participation, without scoring people",
  "Measuring whether equity work is working, without scoring people. Rank staff by participation.",
  "Measure equity not without scoring people",
  "Measure equity, without not scoring people",
])("still rejects affirmative, appended, and double-negative scoring: %s", title => {
  expect(surveillanceRefuse(title)).toMatchObject({ ok: false, code: "surveillance_refused" });
  const request = buildTestConsultationRecord();
  request.packet.related_resources = [{
    id: "pn-measurement-without-surveillance", title,
    href: "/library/pn-measurement-without-surveillance",
    authority: "practice_note", authorityLabel: "Practice note",
    reviewDate: "2027-03-01", excerpt: "Program measurement guidance.", citeable: true,
  }];
  expect(() => assertWorkObjectPersistence("consult_request", request.request_id, request)).toThrow();
});
