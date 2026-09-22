import { evidenceForDoc } from "@/lib/intelligence/retrieval/evidence";
import { meetingArtifact } from "./helpers/practice-artifact-fixtures";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import postgres from "postgres";
import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { localPostgresServerOptions } from "@/tests/helpers/local-postgres";
import { createAskResponseRecord, PostgresAskRecordsStore } from "@/lib/intelligence/observability/ask-records";

function binary(name: string): string | null {
  const executable = name + (process.platform === "win32" ? ".exe" : "");
  return [
    process.env.PAC_TEST_POSTGRES_BIN ? path.join(process.env.PAC_TEST_POSTGRES_BIN, executable) : "",
    process.platform === "win32" ? path.join(process.env.ProgramFiles ?? "C:\\Program Files", "PostgreSQL", "16", "bin", executable) : "",
    path.join("/usr/lib/postgresql/16/bin", executable), path.join("/usr/lib/postgresql/15/bin", executable),
  ].find(value => value && existsSync(value)) ?? null;
}
const INITDB = binary("initdb"), PG_CTL = binary("pg_ctl");
function run(executable: string, args: string[]) {
  const result = spawnSync(executable, args, { stdio: "ignore", windowsHide: true, timeout: 60_000 });
  if (result.status !== 0) throw new Error(path.basename(executable) + " test setup failed.");
}
async function unusedPort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") { server.close(); reject(new Error("Local test port unavailable.")); return; }
      server.close(error => error ? reject(error) : resolve(address.port));
    });
  });
}
describe.skipIf(!INITDB || !PG_CTL)("dedicated ASK response PostgreSQL persistence", () => {
  let temporaryRoot = "", dataDirectory = "", runtimeUrl = "";
  let admin: ReturnType<typeof postgres> | undefined;
  let runtime: ReturnType<typeof postgres> | undefined;
  let store: PostgresAskRecordsStore | undefined;
  beforeAll(async () => {
    temporaryRoot = mkdtempSync(path.join(tmpdir(), "pac-ask-records-postgres-"));
    dataDirectory = path.join(temporaryRoot, "data");
    const port = await unusedPort();
    run(INITDB!, ["-D", dataDirectory, "--username=pac_test", "--auth=trust", "--encoding=UTF8", "--no-locale"]);
    run(PG_CTL!, ["-D", dataDirectory, "-l", path.join(temporaryRoot, "postgres.log"), "-o", localPostgresServerOptions(port, temporaryRoot), "-w", "start"]);
    const adminUrl = "postgresql://pac_test@127.0.0.1:" + port + "/postgres";
    admin = postgres(adminUrl, { ssl: false, max: 1, prepare: false });
    await admin.unsafe("create schema pac; create role pac_app_runtime login; grant usage on schema pac to pac_app_runtime;");
    await admin.unsafe(readFileSync(path.resolve(import.meta.dirname, "../db/migrations/0030_pac_ask_response_records.sql"), "utf8"));
    await admin.unsafe(readFileSync(path.resolve(import.meta.dirname, "../db/migrations/0041_pac_ask_practice_artifact.sql"), "utf8"));
    await admin.unsafe(readFileSync(path.resolve(import.meta.dirname, "../db/migrations/0047_pac_ask_evidence_claims.sql"), "utf8"));
    runtimeUrl = adminUrl.replace("pac_test@", "pac_app_runtime@");
    runtime = postgres(runtimeUrl, { ssl: false, max: 1, prepare: false });
    store = new PostgresAskRecordsStore(runtimeUrl);
  }, 120_000);
  afterAll(async () => {
    await store?.close();
    await runtime?.end({ timeout: 2 });
    await admin?.end({ timeout: 2 });
    if (PG_CTL && dataDirectory && existsSync(dataDirectory)) {
      spawnSync(PG_CTL, ["-D", dataDirectory, "-m", "immediate", "-w", "stop"], { stdio: "ignore", windowsHide: true, timeout: 30_000 });
    }
    if (temporaryRoot && path.dirname(path.resolve(temporaryRoot)) === path.resolve(tmpdir()) && path.basename(temporaryRoot).startsWith("pac-ask-records-postgres-")) {
      rmSync(temporaryRoot, { recursive: true, force: true });
    }
  }, 45_000);
  const record = () => createAskResponseRecord({
    traceId: randomUUID(), programScope: "one-dhs", researchMode: "current_web", status: "answered",
    httpStatus: 200, question: "A synthetic database test question.",
    response: { kind: "answer", answer: {
      shortAnswer: "Full synthetic response, including code and citations. ".repeat(300),
      whyItMatters: "", sources: [], limits: [], nextActions: [],
      publicResearch: { heading: "Public evidence", answer: "Synthetic evidence [1].", sources: [{ title: "Test source", url: "https://example.org/evidence" }], note: "Synthetic test; no network request." },
    } },
    researchStatus: "used",
  });
  it("preserves the full response through close/reopen and does not overwrite an existing record", async () => {
    const saved = record();
    await store!.append(saved);
    await store!.append(saved);
    await store!.close();
    store = new PostgresAskRecordsStore(runtimeUrl);
    const rows = await store.list(101, null, new Date().toISOString());
    expect(rows.find(value => value.id === saved.id)).toEqual(saved);
    await expect(store.append({ ...saved, question: "Unexpected replacement." })).rejects.toThrow("immutable");
  });

  it("preserves typed draft revisions through close/reopen alongside old response records", async () => {
    const firstRecord = record();
    const firstArtifact = meetingArtifact({ context: "one_dhs", traceId: firstRecord.traceId });
    if (!("kind" in firstRecord.response) || firstRecord.response.kind !== "answer") throw Error("Expected answer");
    firstRecord.response.answer.practiceArtifact = firstArtifact;
    const secondRecord = record();
    if (!("kind" in secondRecord.response) || secondRecord.response.kind !== "answer") throw Error("Expected answer");
    secondRecord.response.answer.practiceArtifact = meetingArtifact({
      context: "one_dhs", traceId: secondRecord.traceId, artifactId: firstArtifact.artifactId,
      revisionId: randomUUID(), parentRevisionId: firstArtifact.revisionId,
      values: { ...firstArtifact.values, formats: ["Remote chat", "Written contributions afterward"] },
    });
    await store!.append(firstRecord); await store!.append(secondRecord);
    await store!.close(); store = new PostgresAskRecordsStore(runtimeUrl);
    const rows = await store.list(101, null, new Date().toISOString());
    expect(rows.find(value => value.id === firstRecord.id)).toEqual(firstRecord);
    expect(rows.find(value => value.id === secondRecord.id)).toEqual(secondRecord);
    await expect(store.append({ ...firstRecord, status: "limited" })).rejects.toThrow("immutable");
  });
  it("rejects malformed draft metadata, mismatched traces and scopes at the database boundary", async () => {
    const saved = record();
    if (!("kind" in saved.response) || saved.response.kind !== "answer") throw Error("Expected answer");
    const artifact = meetingArtifact({ context: "one_dhs", traceId: saved.traceId });
    for (const malformed of [
      { ...artifact, hiddenTracking: "forbidden" },
      { ...artifact, context: "one_dsd" },
      { ...artifact, traceId: randomUUID() },
      { ...artifact, values: { ahead: { nested: "forbidden" } } },
      { ...artifact, values: { formats: ["valid", 42] } },
      { ...artifact, sources: [{ id: "source", title: "Source", href: "javascript:alert(1)" }] },
      { ...artifact, sources: [{ id: "source", title: null, href: "/learn" }] },
      { ...artifact, pathContract: "unversioned" },
      { ...artifact, context: null },
      { ...artifact, schemaVersion: 2 },
    ]) {
      const value = { ...saved, id: randomUUID(), response: { kind: "answer", answer: { ...saved.response.answer, practiceArtifact: malformed } } };
      await expect(runtime!.unsafe("select pac.append_ask_response_record($1::text::jsonb)", [JSON.stringify(value)])).rejects.toThrow();
    }
  });

  it("denies direct runtime table reads/writes while allowing the narrow storage functions", async () => {
    await expect(runtime!.unsafe("select * from pac.ask_response_records")).rejects.toThrow(/permission denied/);
    await expect(runtime!.unsafe("delete from pac.ask_response_records")).rejects.toThrow(/permission denied/);
    const permissions = await admin!.unsafe<{ public_execute: boolean }[]>("select exists(select 1 from pg_proc p, lateral aclexplode(p.proacl) a where p.oid='pac.list_ask_response_records(integer,timestamptz,uuid,timestamptz)'::regprocedure and a.grantee=0 and a.privilege_type='EXECUTE') as public_execute");
    expect(permissions[0].public_execute).toBe(false);
    expect(await store!.list(10, null, new Date().toISOString())).not.toHaveLength(0);
  });
  it("rejects unexpected tracking fields and malformed records at the database boundary", async () => {
    const saved = record();
    for (const value of [
      { ...saved, userId: "unwanted-tracking" },
      { ...saved, programScope: null },
      { ...saved, response: { unknown: "not-a-staff-response" } },
      { ...saved, response: { kind: "answer", answer: { userId: "unwanted-tracking" } } },
    ]) {
      await expect(runtime!.unsafe("select pac.append_ask_response_record($1::text::jsonb)", [JSON.stringify(value)])).rejects.toThrow();
    }
  });
  it("uses stable page cursors and deletes selected records only", async () => {
    const records = [record(), record(), record()];
    await Promise.all(records.map(value => store!.append(value)));
    const page1 = await store!.list(2, null, new Date().toISOString());
    const cursor = { createdAt: page1[1].createdAt, id: page1[1].id };
    const page2 = await store!.list(101, cursor, new Date().toISOString());
    expect(page1.some(first => page2.some(second => first.id === second.id))).toBe(false);
    expect(await store!.delete([records[0].id])).toBe(1);
    expect((await store!.list(101, null, new Date().toISOString())).some(value => value.id === records[0].id)).toBe(false);
    expect((await store!.list(101, null, new Date().toISOString())).some(value => value.id === records[1].id)).toBe(true);
  });
  it("persists 100 concurrent synthetic response records without dropping or truncating any", async () => {
    const batch = Array.from({ length: 100 }, record);
    const startedAt = Date.now();
    await Promise.all(batch.map(value => store!.append(value)));
    const stored = await store!.list(101, null, new Date().toISOString());
    for (const saved of batch) expect(stored.find(value => value.id === saved.id)).toEqual(saved);
    const elapsedMs = Date.now() - startedAt;
    expect(elapsedMs).toBeLessThan(10_000);
    console.info(JSON.stringify({ evidence: "ask_records_postgres_concurrency", responses: batch.length, persisted: batch.filter(saved => stored.some(value => value.id === saved.id)).length, elapsedMs, providerCalls: 0 }));
  }, 15_000);
  it("physically purges configured expired records while retaining records without expiry", async () => {
    const expired = { ...record(), expiresAt: "2020-01-01T00:00:00.000Z" };
    const kept = record();
    await store!.append(expired);
    await store!.append(kept);
    expect(await store!.purgeExpired(new Date().toISOString())).toBe(1);
    const rows = await store!.list(101, null, "2000-01-01T00:00:00.000Z");
    expect(rows.some(value => value.id === expired.id)).toBe(false);
    expect(rows.some(value => value.id === kept.id)).toBe(true);
  });
  it("round-trips exact source evidence and explicitly labeled inference alongside legacy answers", async () => {
    const saved=record();
    if (!("kind" in saved.response) || saved.response.kind!=="answer") throw Error("Expected answer");
    const evidence=evidenceForDoc({kind:"content",id:"asset-program-"+ "a".repeat(24),title:"Meeting participation",href:"/practice/gp-8",authority:"practice_note",type:"guide",status:"approved",reviewDate:"2026-09-08",scope:"agencywide",summary:"Offer a written invitation 🤝 before the meeting.",text:"Offer a written invitation 🤝 before the meeting.",tags:[],intents:[],evidenceRevisions:[{sourceId:"practice.gp-8",revisionId:randomUUID(),payloadHash:"a".repeat(64),scope:"one-dhs"}]});
    saved.response.answer.sources=[{title:"Meeting participation",href:"/practice/gp-8",authorityLabel:"Practice note",authorityDescription:"Program practice.",reviewLabel:"2026-09-08",evidence}];
    const reference={evidenceId:evidence.evidenceId,...evidence.excerpt};
    saved.response.answer.evidenceClaims=[{kind:"source_excerpt",text:evidence.excerpt.quote,references:[reference]},{kind:"inference",text:"A short prompt could make that invitation easier to answer.",references:[reference]}];
    await store!.append(saved);await store!.close();store=new PostgresAskRecordsStore(runtimeUrl);
    expect((await store.list(101,null,new Date().toISOString())).find(row=>row.id===saved.id)).toEqual(saved);
    for(const kind of ["missing-source","wrong-hash","wrong-span","wrong-quote","fake-revision","unlabeled-paraphrase","hidden-field"]){
      const value=structuredClone(saved);value.id=randomUUID();if (!("kind" in value.response) || value.response.kind!=="answer") throw Error("Expected answer");
      const answer=value.response.answer,claim=answer.evidenceClaims![0],source=answer.sources[0];
      if(kind==="missing-source")answer.sources=[];
      if(kind==="wrong-hash")claim.references[0].evidenceId="b".repeat(64);
      if(kind==="wrong-span"){claim.references[0].start++;claim.references[0].end++;}
      if(kind==="wrong-quote"){claim.references[0].quote="An invented statement.";claim.references[0].end=claim.references[0].start+claim.references[0].quote.length;claim.text=claim.references[0].quote;}
      if(kind==="fake-revision")source.evidence!.revisions[0].revisionId="invalid-revision";
      if(kind==="unlabeled-paraphrase")claim.text="Every meeting must use this method.";
      if(kind==="hidden-field")Object.assign(source.evidence!,{secretTracking:"forbidden"});
      await expect(runtime!.unsafe("select pac.append_ask_response_record($1::text::jsonb)",[JSON.stringify(value)])).rejects.toThrow();
    }
  });

});
