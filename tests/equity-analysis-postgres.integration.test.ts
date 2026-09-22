import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { localPostgresServerOptions } from "@/tests/helpers/local-postgres";
import { PostgresStore } from "@/lib/intelligence/memory/postgres-store";
import type { EquityAnalysisRecord, FollowUpEventRecord, SurveyWaveEventRecord } from "@/lib/equity-analysis/schema";

const ROOT = path.resolve(import.meta.dirname, "..");

function postgresBinary(name: "initdb" | "pg_ctl"): string | null {
  const executable = process.platform === "win32" ? `${name}.exe` : name;
  const candidates = [
    process.env.PAC_TEST_POSTGRES_BIN ? path.join(process.env.PAC_TEST_POSTGRES_BIN, executable) : "",
    process.platform === "win32" ? path.join(process.env.ProgramFiles ?? "C:\\Program Files", "PostgreSQL", "16", "bin", executable) : "",
    `/usr/lib/postgresql/16/bin/${executable}`,
    `/usr/lib/postgresql/15/bin/${executable}`,
  ].filter(Boolean);
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

const INITDB = postgresBinary("initdb");
const PG_CTL = postgresBinary("pg_ctl");

function run(executable: string, args: string[]): void {
  const result = spawnSync(executable, args, { stdio: "ignore", windowsHide: true, timeout: 60_000 });
  if (result.status !== 0) throw new Error(`${path.basename(executable)} failed with status ${result.status ?? "unknown"}.`);
}

async function unusedPort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") { server.close(); reject(new Error("Could not allocate a local PostgreSQL test port.")); return; }
      server.close((error) => (error ? reject(error) : resolve(address.port)));
    });
  });
}

describe.skipIf(!INITDB || !PG_CTL)("equity analysis records: fresh PostgreSQL contract", () => {
  let temporaryRoot = "", dataDirectory = "", runtimeDatabaseUrl = "";
  let admin: ReturnType<typeof postgres> | null = null;
  let runtime: ReturnType<typeof postgres> | null = null;
  let store: PostgresStore | null = null;

  beforeAll(async () => {
    temporaryRoot = mkdtempSync(path.join(tmpdir(), "pac-equity-pg-"));
    dataDirectory = path.join(temporaryRoot, "data");
    const port = await unusedPort();
    run(INITDB!, ["-D", dataDirectory, "--username=pac_test", "--auth=trust", "--encoding=UTF8", "--no-locale"]);
    run(PG_CTL!, ["-D", dataDirectory, "-l", path.join(temporaryRoot, "postgres.log"), "-o", localPostgresServerOptions(port, temporaryRoot), "-w", "start"]);
    const adminUrl = `postgresql://pac_test@127.0.0.1:${port}/postgres`;
    runtimeDatabaseUrl = adminUrl.replace("pac_test@", "pac_app_runtime@");
    admin = postgres(adminUrl, { ssl: false, max: 1, prepare: false });
    const migrationNames = readdirSync(path.join(ROOT, "db", "migrations")).filter((name) => /^\d{4}_.+\.sql$/.test(name)).sort();
    expect(migrationNames).toContain("0056_pac_equity_analysis_records.sql");
    for (const name of migrationNames) {
      try { await admin.unsafe(readFileSync(path.join(ROOT, "db", "migrations", name), "utf8")); }
      catch (error) { throw new Error(`Fresh migration sequence failed at ${name}.`, { cause: error }); }
    }
    runtime = postgres(runtimeDatabaseUrl, { ssl: false, max: 1, prepare: false });
    store = new PostgresStore({ databaseUrl: runtimeDatabaseUrl, sslMode: "disable" });
  }, 120_000);

  afterAll(async () => {
    await store?.close().catch(() => undefined);
    await runtime?.end({ timeout: 5 }).catch(() => undefined);
    await admin?.end({ timeout: 5 }).catch(() => undefined);
    if (PG_CTL && dataDirectory && existsSync(dataDirectory)) spawnSync(PG_CTL, ["-D", dataDirectory, "-m", "immediate", "-w", "stop"], { stdio: "ignore", windowsHide: true, timeout: 30_000 });
    if (temporaryRoot && path.dirname(temporaryRoot) === path.resolve(tmpdir()) && path.basename(temporaryRoot).startsWith("pac-equity-pg-")) rmSync(temporaryRoot, { recursive: true, force: true });
  }, 45_000);

  function analysis(kind: "full" | "scan" = "scan"): EquityAnalysisRecord {
    const id = randomUUID();
    const answers: Record<string, string> = {
      action: "Move visit requests online.", affected_groups: "Households with limited English.", data_shows: "Phone requests are most contacts.",
      benefits: "Faster scheduling.", burdens: "Loss of the phone channel.", design_change: "Keep a staffed phone line.",
      impact_owner: "Program manager", impact_date: "2026-12-01", outcome_owner: "Director", outcome_date: "2027-04-01",
      communication: "Communications lead, November, to counties.", rationale: "The phone line must be funded first.",
    };
    if (kind === "full") Object.assign(answers, { heard_from: "County partners in two sessions.", still_missing: "Households without internet.", tribal_consultation: "not_applicable", impact_statement: "Six sentences. Two. Three. Four. Five. Six.", equity_director: "consulted", policy_alignment: "Matches the policy lens.", funded: "yes", staffed: "partial", data_capacity: "yes" });
    return { schemaVersion: 1, recordType: "equity_analysis", id: `equity-analysis-${id}`, createdAt: new Date().toISOString(), programScope: "one-dhs", kind, workTitle: "Move county visit requests online", workType: "service", administration: "Health Care", approvalDate: "2026-10-15", disposition: "revise", answers, consent: true, sourceRoute: "/equity-policy/analysis" };
  }

  it("stores a scan and a full analysis through the restricted role with replay-safe receipts", async () => {
    const scan = analysis("scan");
    const uuid = scan.id.slice("equity-analysis-".length);
    const first = await store!.put("decision", `equity_analysis:${scan.id}`, scan, `equity-analysis:${uuid}`);
    const retry = await store!.put("decision", `equity_analysis:${scan.id}`, { ...scan, workTitle: "changed" }, `equity-analysis:${uuid}`);
    expect(first.applied).toBe(true);
    expect(retry).toMatchObject({ applied: false, value: scan });
    const full = analysis("full");
    expect((await store!.put("decision", `equity_analysis:${full.id}`, full, `equity-analysis:${full.id.slice("equity-analysis-".length)}`)).applied).toBe(true);
    expect(await store!.get("decision", `equity_analysis:${full.id}`)).toEqual(full);
  });

  it("rejects a full analysis missing its steps, unknown answer keys, and person-profile fields at the database", async () => {
    const incompleteFull = { ...analysis("scan"), kind: "full" as const };
    await expect(runtime!.unsafe("insert into pac.runtime_work_objects(work_kind,object_id,value) values('decision',$1,$2::text::jsonb)", [`equity_analysis:${incompleteFull.id}`, JSON.stringify(incompleteFull)])).rejects.toThrow(/Incomplete full equity analysis/);
    const unknownKey = analysis("scan");
    (unknownKey.answers as Record<string, string>).employee_name = "not allowed";
    await expect(runtime!.unsafe("insert into pac.runtime_work_objects(work_kind,object_id,value) values('decision',$1,$2::text::jsonb)", [`equity_analysis:${unknownKey.id}`, JSON.stringify(unknownKey)])).rejects.toThrow();
    const profiled = { ...analysis("scan"), participation_by_employee: {} };
    await expect(runtime!.unsafe("insert into pac.runtime_work_objects(work_kind,object_id,value) values('decision',$1,$2::text::jsonb)", [`equity_analysis:${profiled.id}`, JSON.stringify(profiled)])).rejects.toThrow();
  });

  it("keeps analyses append-only and stores follow-up and survey events", async () => {
    const scan = analysis("scan");
    await store!.put("decision", `equity_analysis:${scan.id}`, scan);
    await expect(runtime!.unsafe("update pac.runtime_work_objects set value=jsonb_set(value,'{workTitle}','\"rewritten\"'::jsonb) where object_id=$1", [`equity_analysis:${scan.id}`])).rejects.toThrow(/append-only/);

    const followUpId = randomUUID();
    const followUp: FollowUpEventRecord = { schemaVersion: 1, recordType: "equity_analysis_followup", id: `equity-followup-${followUpId}`, createdAt: new Date().toISOString(), analysisId: scan.id, followUp: "impact", done: true };
    expect((await store!.put("decision", `equity_followup:${followUp.id}`, followUp, `equity-followup:${followUpId}`)).applied).toBe(true);
    await expect(store!.put("decision", `equity_followup:equity-followup-${randomUUID()}`, { ...followUp, followUp: "someone" })).rejects.toThrow();

    const surveyId = randomUUID();
    const survey: SurveyWaveEventRecord = { schemaVersion: 1, recordType: "equity_survey_wave", id: `equity-survey-${surveyId}`, createdAt: new Date().toISOString(), wave: "2026", action: "set", values: { fielded: "2026-10", respondents: 2500, responseRate: 0.6, belonging: 70, inclusion: 68, engagement: 71 } };
    expect((await store!.put("decision", `equity_survey:${survey.id}`, survey, `equity-survey:${surveyId}`)).applied).toBe(true);
    const badPercent = { ...survey, id: `equity-survey-${randomUUID()}`, values: { ...survey.values!, belonging: 101 } };
    await expect(runtime!.unsafe("insert into pac.runtime_work_objects(work_kind,object_id,value) values('decision',$1,$2::text::jsonb)", [`equity_survey:${badPercent.id}`, JSON.stringify(badPercent)])).rejects.toThrow(/percent/);
    await expect(runtime!.unsafe("delete from pac.runtime_work_objects where object_id=$1", [`equity_analysis:${scan.id}`])).rejects.toThrow();
  });

  it("registers the two request-limit purposes and nothing else new", async () => {
    const subject = createHash("sha256").update("equity-test-subject").digest("hex");
    expect((await store!.consumeRateLimit("staff-equity-analysis", subject, 10, 600)).allowed).toBe(true);
    expect((await store!.consumeRateLimit("staff-equity-register", subject, 60, 600)).allowed).toBe(true);
    await expect(runtime!.unsafe("insert into pac.runtime_rate_limits(scope,subject_hash,request_count,window_started_at,reset_at) values('staff-equity-analysis',$1,1,now(),now()+interval '10 minutes')", [subject])).rejects.toThrow();
  });

  it("does not grant anonymous execution of the contract functions", async () => {
    const rows = await admin!.unsafe("select exists(select 1 from pg_proc p, lateral aclexplode(p.proacl) a where p.oid='pac.assert_equity_analysis_record(text,jsonb)'::regprocedure and a.grantee=0 and a.privilege_type='EXECUTE') as public_execute");
    expect(rows[0].public_execute).toBe(false);
  });
});
