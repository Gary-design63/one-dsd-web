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
import type { ProgramTask, ProgramEvent } from "@/lib/program/work-schema";
const ROOT = path.resolve(import.meta.dirname, "..");
function postgresBinary(name: "initdb" | "pg_ctl"): string | null {
  const executable = process.platform === "win32" ? `${name}.exe` : name;
  const candidates = [
    process.env.PAC_TEST_POSTGRES_BIN
      ? path.join(process.env.PAC_TEST_POSTGRES_BIN, executable)
      : "",
    process.platform === "win32"
      ? path.join(process.env.ProgramFiles ?? "C:\\Program Files", "PostgreSQL", "16", "bin", executable)
      : "",
    `/usr/lib/postgresql/16/bin/${executable}`,
    `/usr/lib/postgresql/15/bin/${executable}`,
  ].filter(Boolean);
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

const INITDB = postgresBinary("initdb");
const PG_CTL = postgresBinary("pg_ctl");

function run(executable: string, args: string[]): void {
  const result = spawnSync(executable, args, {
    stdio: "ignore",
    windowsHide: true,
    timeout: 60_000,
  });
  if (result.status !== 0) {
    throw new Error(`${path.basename(executable)} failed with status ${result.status ?? "unknown"}.`);
  }
}

async function unusedPort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("Could not allocate a local PostgreSQL test port."));
        return;
      }
      server.close((error) => (error ? reject(error) : resolve(address.port)));
    });
  });
}


describe("program work: independent fresh PostgreSQL lifecycle", () => {
  let temporaryRoot = "", dataDirectory = "", runtimeDatabaseUrl = "";
  let admin: ReturnType<typeof postgres> | null = null;
  let runtime: ReturnType<typeof postgres> | null = null;
  let store: PostgresStore | null = null;
  beforeAll(async () => {
    temporaryRoot = mkdtempSync(path.join(tmpdir(), "pac-program-work-pg-"));
    dataDirectory = path.join(temporaryRoot, "data");
    const logFile = path.join(temporaryRoot, "postgres.log");
    const port = await unusedPort();
    run(INITDB!, [
      "-D",
      dataDirectory,
      "--username=pac_test",
      "--auth=trust",
      "--encoding=UTF8",
      "--no-locale",
    ]);
    run(PG_CTL!, [
      "-D",
      dataDirectory,
      "-l",
      logFile,
      "-o",
      localPostgresServerOptions(port, temporaryRoot),
      "-w",
      "start",
    ]);

    const adminUrl = `postgresql://pac_test@127.0.0.1:${port}/postgres`;
    runtimeDatabaseUrl = adminUrl.replace("pac_test@", "pac_app_runtime@");
    admin = postgres(adminUrl, { ssl: false, max: 1, prepare: false });
    const migrationNames = readdirSync(path.join(ROOT, "db", "migrations"))
      .filter((name) => /^\d{4}_.+\.sql$/.test(name))
      .sort();
    expect(migrationNames).toContain("0040_pac_program_event_lifecycle.sql");
    expect(migrationNames).toContain("0013_pac_security_housekeeping.sql");
    expect(migrationNames).toContain("0014_pac_consultation_persistence_contract.sql");
    for (const name of migrationNames) {
      try {
        await admin.unsafe(readFileSync(path.join(ROOT, "db", "migrations", name), "utf8"));
      } catch (error) {
        throw new Error(`Fresh migration sequence failed at ${name}.`, { cause: error });
      }
    }
    runtime = postgres(runtimeDatabaseUrl, { ssl: false, max: 1, prepare: false });
    store = new PostgresStore({ databaseUrl: runtimeDatabaseUrl, sslMode: "disable" });
  }, 90_000);

  afterAll(async () => {
    await store?.close().catch(() => undefined);
    await runtime?.end({ timeout: 5 }).catch(() => undefined);
    await admin?.end({ timeout: 5 }).catch(() => undefined);
    if (PG_CTL && dataDirectory && existsSync(dataDirectory)) {
      spawnSync(PG_CTL, ["-D", dataDirectory, "-m", "immediate", "-w", "stop"], {
        stdio: "ignore",
        windowsHide: true,
        timeout: 30_000,
      });
    }
    if (
      temporaryRoot
      && path.dirname(temporaryRoot) === path.resolve(tmpdir())
      && path.basename(temporaryRoot).startsWith("pac-program-work-pg-")
    ) {
      rmSync(temporaryRoot, { recursive: true, force: true });
    }
  }, 45_000);


  let tick = 0;
  const instant = () => new Date(Date.UTC(2026,8,8,12) + tick++ * 100).toISOString();
  async function task(): Promise<ProgramTask> {
    const value: ProgramTask = {recordType:"program_task", id:"task-"+randomUUID().replaceAll("-",""),createdAt:instant(),dueAt:instant(),functionId:"resources",outcomeIds:["staff_capability"],kind:"resource_review",title:"Review published resources",objective:"Inspect published program resource destinations and record what is available.",agentId:"librarian",eligible:true,source:"owner",evidenceMode:"verification"};
    await store!.put("decision", "program_task:"+value.id, value);
    return value;
  }
  function event(t:ProgramTask, phase:ProgramEvent["phase"], attempt=1):ProgramEvent {
    return {recordType:"program_event",id:randomUUID(),taskId:t.id,at:instant(),phase,attempt,actor:["cancelled","retry_requested","reviewed","applied"].includes(phase)?"owner":"agent",note:"Independent local lifecycle verification."};
  }
  function completed(t:ProgramTask):ProgramEvent {
    const body="Checked the current published resource destinations and retained the actual review result.";
    return {...event(t,"completed"),receipt:{title:t.title,body,evidenceLevel:"delivery",method:"program_record_review",references:[{label:"Resources",href:"/learn"}],contentHash:createHash("sha256").update(body).digest("hex")}};
  }
  it("runs the new migration with a real local PostgreSQL installation", () => {
    expect(INITDB).toBeTruthy(); expect(PG_CTL).toBeTruthy(); expect(store).not.toBeNull();
  });
  it("admits exactly one simultaneous claim across two database connections", async () => {
    const t=await task(); const second=new PostgresStore({databaseUrl:runtimeDatabaseUrl,sslMode:"disable"});
    try {
      const results=await Promise.all([store!.appendProgramEvent(t.id,null,event(t,"started")),second.appendProgramEvent(t.id,null,event(t,"started"))]);
      expect(results.filter(r=>r.applied)).toHaveLength(1);
      expect(results.find(r=>!r.applied)).toMatchObject({applied:false,reason:"conflict"});
    } finally { await second.close(); }
  });
  it("keeps cancellation when a late completion arrives with either stale or fresh expectation", async () => {
    const t=await task(); const start=event(t,"started"); const cancel=event(t,"cancelled");
    expect((await store!.appendProgramEvent(t.id,null,start)).applied).toBe(true);
    expect((await store!.appendProgramEvent(t.id,start.id,cancel)).applied).toBe(true);
    expect(await store!.appendProgramEvent(t.id,start.id,completed(t))).toMatchObject({applied:false,reason:"conflict"});
    expect(await store!.appendProgramEvent(t.id,cancel.id,completed(t))).toMatchObject({applied:false,reason:"invalid_transition"});
  });
  it("retains a completed receipt through close/reopen and immutable event replay", async () => {
    const t=await task(); const start=event(t,"started"); const done=completed(t);
    await store!.appendProgramEvent(t.id,null,start); await store!.appendProgramEvent(t.id,start.id,done);
    await store!.close(); store=new PostgresStore({databaseUrl:runtimeDatabaseUrl,sslMode:"disable"});
    expect(await store.get("decision","program_event:"+done.id)).toEqual(done);
    expect(await store.appendProgramEvent(t.id,start.id,done)).toMatchObject({applied:true,event:done});
    expect(await store.appendProgramEvent(t.id,done.id,{...done,note:"Changed payload for same event."})).toMatchObject({applied:false,reason:"conflict"});
    await expect(runtime!.unsafe("update pac.runtime_work_objects set value=jsonb_set(value,'{note}','\"overwrite\"'::jsonb) where object_id=$1",["program_event:"+done.id])).rejects.toThrow();
    await expect(runtime!.unsafe("delete from pac.runtime_work_objects where object_id=$1",["program_task:"+t.id])).rejects.toThrow();
  });
  it("rejects corrupt receipt hashes at the database boundary", async () => {
    const t=await task(); const start=event(t,"started"); await store!.appendProgramEvent(t.id,null,start);
    const done=completed(t); done.receipt!.contentHash="0".repeat(64);
    const rows=await runtime!.unsafe("select * from pac.append_program_event($1,$2,$3::text::jsonb)",[t.id,start.id,JSON.stringify(done)]);
    expect(rows[0]).toMatchObject({applied:false,reason:"invalid_transition"});
  });
  it("prevents a direct runtime insert from completing an unstarted task", async () => {
    const t=await task(); const done=completed(t);
    await expect(runtime!.unsafe("insert into pac.runtime_work_objects(work_kind,object_id,value) values('decision',$1,$2::text::jsonb)",["program_event:"+done.id,JSON.stringify(done)])).rejects.toThrow(/transition/i);
  });
  it("requires matching attempt numbers and an owner retry before restarting completed work", async () => {
    const t=await task(); const start=event(t,"started"); const done=completed(t);
    await store!.appendProgramEvent(t.id,null,start); await store!.appendProgramEvent(t.id,start.id,done);
    expect(await store!.appendProgramEvent(t.id,done.id,event(t,"started",2))).toMatchObject({applied:false,reason:"invalid_transition"});
    const retry=event(t,"retry_requested"); await store!.appendProgramEvent(t.id,done.id,retry);
    expect(await store!.appendProgramEvent(t.id,retry.id,event(t,"started",1))).toMatchObject({applied:false,reason:"invalid_transition"});
    expect(await store!.appendProgramEvent(t.id,retry.id,event(t,"started",2))).toMatchObject({applied:true});
  });
  it("does not grant anonymous execution of the mutation function", async () => {
    const rows=await admin!.unsafe("select exists(select 1 from pg_proc p,lateral aclexplode(p.proacl) a where p.oid='pac.append_program_event(text,text,jsonb)'::regprocedure and a.grantee=0 and a.privilege_type='EXECUTE') as public_execute");
    expect(rows[0].public_execute).toBe(false);
  });
});
