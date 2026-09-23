import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { parseEnv } from "node:util";
import { resolve } from "node:path";

// Values go directly to the CLI's stdin, never command arguments or logs.
// No database-owner connection is uploaded. Existing owner/cron keys and
// existing feature switches remain untouched by the ordinary settings step.
const root = resolve(import.meta.dirname, "..");
const cli = "C:/Users/garyb/AppData/Roaming/npm/node_modules/vercel/dist/vc.js";
const local = parseEnv(readFileSync(resolve(root, ".env.local"), "utf8"));
// Vercel functions use Supabase transaction pooling; the local/migration
// connection remains unchanged. All runtime clients disable prepared statements.
const productionRuntimeUrl = new URL(local.PAC_RUNTIME_DATABASE_URL);
if (productionRuntimeUrl.hostname.endsWith(".pooler.supabase.com") && productionRuntimeUrl.port === "5432") {
  productionRuntimeUrl.port = "6543";
}
const recoveryPath = resolve(root, ".data/production-release-secrets.env");
mkdirSync(resolve(root, ".data"), { recursive: true });
const secrets = existsSync(recoveryPath) ? parseEnv(readFileSync(recoveryPath, "utf8")) : {};
secrets.PAC_RATE_LIMIT_SECRET ||= randomBytes(36).toString("base64url");
if (process.argv.includes("--owner-key")) secrets.PAC_OWNER_KEY ||= randomBytes(36).toString("base64url");
if (process.argv.includes("--owner-key")) {
  secrets.CRON_SECRET ||= randomBytes(36).toString("base64url");
  writeFileSync(resolve(root, ".data/consultant-production-access.txt"), `One DHS Consultant Workspace\nhttps://one-dhs-pac.vercel.app/consultant\n\nAccess key: ${secrets.PAC_OWNER_KEY}\n\nKeep this file private. This key is for the live application; local preview access is unchanged.\n`, { mode: 0o600 });
}
writeFileSync(recoveryPath, Object.entries(secrets).map(([key, value]) => `${key}=${value}`).join("\n") + "\n", { mode: 0o600 });
const settings = process.argv.includes("--transaction-pooler") ? {
  PAC_RUNTIME_DATABASE_URL: productionRuntimeUrl.toString(),
} : process.argv.includes("--owner-key") ? { PAC_OWNER_KEY: secrets.PAC_OWNER_KEY, CRON_SECRET: secrets.CRON_SECRET } : process.argv.includes("--unconnected-services-off") ? {
  // The existing deployment had switches without provider or activation evidence.
  // Preserve reading/editing and make no claim that these connections are ready.
  PAC_GENERATIVE_PILOT: "off", PAC_RESEARCH_ENABLED: "off", PAC_CONSULTATION_INTAKE_ENABLED: "off",
} : {
  PAC_DATA_ENV: "production", PAC_STORE: "postgres", PAC_CONTENT_SOURCE: "postgres",
  PAC_RUNTIME_DATABASE_URL: productionRuntimeUrl.toString(),
  PAC_RUNTIME_DATABASE_SSL: "require", PAC_RATE_LIMIT_SECRET: secrets.PAC_RATE_LIMIT_SECRET,
  PAC_SUPABASE_URL: local.PAC_SUPABASE_URL, PAC_SUPABASE_BUCKET: local.PAC_SUPABASE_BUCKET,
  PAC_SUPABASE_SECRET_KEY: local.PAC_SUPABASE_SECRET_KEY,
};
for (const [name, value] of Object.entries(settings)) {
  if (!value || value === "[SENSITIVE]") throw new Error(`A real value is required for ${name}.`);
  await new Promise((accept, reject) => {
    const child = spawn(process.execPath, [cli, "env", "add", name, "production", "--force", "--yes", "--sensitive"], {
      cwd: root, windowsHide: true, stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, NO_UPDATE_NOTIFIER: "1", VERCEL_TELEMETRY_DISABLED: "1" },
    });
    child.stdout.resume(); child.stderr.resume();
    child.on("error", () => reject(new Error(`Could not start configuration for ${name}.`)));
    child.on("exit", code => code === 0 ? accept() : reject(new Error(`Configuration failed for ${name} (exit ${code}).`)));
    child.stdin.end(value);
  });
  console.log(`Configured ${name} for production.`);
}
