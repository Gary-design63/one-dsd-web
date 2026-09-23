import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, extname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const contractPath = resolve(root, "config/environment-contract.json");
const packagePath = resolve(root, "package.json");
const lockPath = resolve(root, "package-lock.json");
const examplePath = resolve(root, ".env.example");
const protectedFeatureActivationPath = resolve(root, "config/protected-feature-activation.json");
const modeIndex = process.argv.indexOf("--mode");
const mode = modeIndex >= 0 ? process.argv[modeIndex + 1] : "clean-clone";

function fail(message) {
  throw new Error(message);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function sourceFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory)) {
    // Vercel writes generated deployment files during the build. Audit source,
    // not platform output or dependencies that carry their own internal settings.
    if ([".git", ".next", ".vercel", "node_modules", "evidence", "venv", ".venv", "site-packages", "communications"].includes(entry)) continue;
    const candidate = resolve(directory, entry);
    if (statSync(candidate).isDirectory()) files.push(...sourceFiles(candidate));
    else if ([".ts", ".tsx", ".mjs", ".js"].includes(extname(candidate))) files.push(candidate);
  }
  return files;
}

const contract = readJson(contractPath);
const protectedFeatureActivation = readJson(protectedFeatureActivationPath);
const packageDocument = readJson(packagePath);
const lock = readJson(lockPath);
const allowed = new Set(contract.settings.map((setting) => setting.name));
const forbiddenClientSettings = new Set(contract.forbidden_client_settings);
const example = readFileSync(examplePath, "utf8");
const exampleNames = new Set(
  example
    .split(/\r?\n/)
    .map((line) => line.match(/^([A-Z][A-Z0-9_]*)=/)?.[1])
    .filter(Boolean),
);

for (const setting of contract.settings.filter((item) => item.example)) {
  if (!exampleNames.has(setting.name)) fail(`.env.example is missing ${setting.name}.`);
}
for (const name of exampleNames) {
  if (!allowed.has(name)) fail(`.env.example contains undocumented setting ${name}.`);
}

const referenced = new Set();
const clientFiles = [];
for (const file of sourceFiles(root)) {
  const body = readFileSync(file, "utf8");
  if (/^\s*["']use client["'];?(?:\s*(?:\/\/.*|\/\*.*\*\/))?\s*$/m.test(body)) clientFiles.push({ file, body });
  if (/^next\.config\.(?:[cm]?js|ts)$/i.test(basename(file)) && /\benv\s*:/.test(body)) {
    fail(`${file} uses a next.config env mapping. Runtime settings must stay server-side or use an explicitly reviewed NEXT_PUBLIC_ value.`);
  }
  for (const pattern of [
    /process\.env\.([A-Z][A-Z0-9_]*)(?![A-Za-z0-9_])/g,
    /environment\.([A-Z][A-Z0-9_]*)(?![A-Za-z0-9_])/g,
    /env:\s*["']([A-Z][A-Z0-9_]*)["']/g,
  ]) {
    for (const match of body.matchAll(pattern)) referenced.add(match[1]);
  }
}

let clientSecretReferences = 0;
const secretNames = contract.settings
  .filter((setting) => setting.class.includes("secret"))
  .map((setting) => setting.name);
for (const { file, body } of clientFiles) {
  const environmentReads = new Set([
    ...[...body.matchAll(/process\.env\.([A-Z][A-Z0-9_]*)(?![A-Za-z0-9_])/g)].map((match) => match[1]),
    ...[...body.matchAll(/process\.env\[["']([A-Z][A-Z0-9_]*)["']\]/g)].map((match) => match[1]),
  ]);
  for (const name of environmentReads) {
    if (!secretNames.includes(name) && !forbiddenClientSettings.has(name)) continue;
    clientSecretReferences += 1;
    fail(`Client module ${file} reads server-only setting ${name}.`);
  }
  if (/process\.env(?:\.|\[)/.test(body)) {
    fail(`Client module ${file} reads process.env directly; use an explicitly reviewed public value instead.`);
  }
}
for (const name of referenced) {
  if (forbiddenClientSettings.has(name)) {
    fail(`Source code references forbidden client setting ${name}.`);
  }
  if (!allowed.has(name)) {
    fail(`Source code references undocumented environment setting ${name}.`);
  }
}

for (const forbidden of forbiddenClientSettings) {
  if (exampleNames.has(forbidden)) fail(`A secret-like setting is exposed to the client: ${forbidden}.`);
}

for (const setting of contract.settings) {
  const configured = process.env[setting.name]?.trim();
  if (configured && setting.allowed && !setting.allowed.includes(configured)) {
    fail(`${setting.name} must be one of: ${setting.allowed.join(", ")}.`);
  }
}

function enabled(name) {
  return ["1", "true", "on", "yes"].includes((process.env[name] ?? "").trim().toLowerCase());
}

function requireSetting(name, reason) {
  if (!process.env[name]?.trim()) fail(`${name} is required ${reason}.`);
}

function requireStrongSecret(name, reason) {
  requireSetting(name, reason);
  const value = process.env[name].trim();
  const normalized = value.toLowerCase();
  if (Buffer.byteLength(value, "utf8") < 32) fail(`${name} must be at least 32 bytes.`);
  if (/^(?:test|dev|local|example|placeholder|change[-_ ]?me|password|secret)(?:[-_ ]|$)/.test(normalized)) {
    fail(`${name} cannot use a development or placeholder value.`);
  }
  if (new Set(value).size < 8) fail(`${name} does not have enough variation.`);
  return value;
}

function validatePostgresUrl(name) {
  const configured = process.env[name]?.trim();
  if (!configured) return;
  let parsed;
  try {
    parsed = new URL(configured);
  } catch {
    fail(`${name} must be a valid PostgreSQL URL.`);
  }
  if (!new Set(["postgres:", "postgresql:"]).has(parsed.protocol)) {
    fail(`${name} must use the postgres or postgresql protocol.`);
  }
  if (!parsed.hostname || !parsed.username || parsed.pathname.length < 2) {
    fail(`${name} must include a host, user, and database name.`);
  }
}

for (const name of ["PAC_DATABASE_URL", "PAC_RUNTIME_DATABASE_URL", "PAC_IMPORT_BENCHMARK_DATABASE_URL"]) {
  validatePostgresUrl(name);
}

const store = (process.env.PAC_STORE ?? "").trim().toLowerCase();
const contentSource = (process.env.PAC_CONTENT_SOURCE ?? "").trim().toLowerCase();
if (store === "postgres" || contentSource === "postgres") {
  requireSetting("PAC_RUNTIME_DATABASE_URL", "for PostgreSQL runtime or staff publication access");
}
const consultationIntakeRequested = enabled("PAC_CONSULTATION_INTAKE_ENABLED");
const consultationTrackingSecretConfigured = Boolean(process.env.PAC_CONSULTATION_TRACKING_SECRET?.trim());
const selectedConsultationEvidence = process.env.PAC_CONSULTATION_ACTIVATION_EVIDENCE_ID?.trim();
if (
  consultationIntakeRequested
  || Boolean(selectedConsultationEvidence)
  || (mode === "production" && consultationTrackingSecretConfigured)
) {
  const reason = consultationIntakeRequested
    ? "before consultation intake can be enabled"
    : selectedConsultationEvidence
      ? "when consultation activation evidence is selected"
      : "when existing-request tracking is configured in production";
  requireStrongSecret("PAC_CONSULTATION_TRACKING_SECRET", reason);
}
if (consultationIntakeRequested) {
  if (store !== "postgres") fail("Consultation intake requires PAC_STORE=postgres.");
  requireSetting("PAC_RUNTIME_DATABASE_URL", "before consultation intake can be enabled");
  requireStrongSecret("PAC_RATE_LIMIT_SECRET", "before consultation intake can be enabled");
  const policyVersion = process.env.PAC_CONSULTATION_POLICY_VERSION?.trim();
  if (!policyVersion || !/^[A-Za-z0-9][A-Za-z0-9._-]{2,79}$/.test(policyVersion)) {
    fail("Consultation intake requires an approved PAC_CONSULTATION_POLICY_VERSION.");
  }
  const retentionDays = Number(process.env.PAC_CONSULTATION_RETENTION_DAYS);
  if (!Number.isSafeInteger(retentionDays) || retentionDays < 1 || retentionDays > 3650) {
    fail("Consultation intake requires PAC_CONSULTATION_RETENTION_DAYS between 1 and 3650.");
  }
  const consultationEvidence = protectedFeatureActivation?.features?.dsd_consultation;
  const evidenceRequirements = [
    "approved_policy",
    "deletion_process",
    "correction_process",
    "backup_process",
    "restore_process",
    "recovery_process",
    "incident_process",
    "delivery_process",
  ];
  if (
    protectedFeatureActivation?.schema_version !== "1.0.0"
    || consultationEvidence?.approval_state !== "approved"
    || !consultationEvidence?.evidence_id
    || consultationEvidence.evidence_id !== selectedConsultationEvidence
    || consultationEvidence.policy_version !== policyVersion
    || consultationEvidence.retention_days !== retentionDays
    || evidenceRequirements.some((name) => {
      const entry = consultationEvidence?.requirements?.[name];
      return entry?.state !== "verified" || !/^[A-Za-z0-9][A-Za-z0-9:._-]{2,159}$/.test(entry?.evidence_id ?? "");
    })
  ) {
    fail("Consultation intake requires a matching, approved committed activation-evidence bundle; environment settings cannot approve it by themselves.");
  }
  for (const name of [
    "PAC_CONSULTATION_CORRECTION_READY",
    "PAC_CONSULTATION_DELETION_READY",
    "PAC_CONSULTATION_BACKUP_READY",
    "PAC_CONSULTATION_RESTORE_READY",
    "PAC_CONSULTATION_RECOVERY_READY",
    "PAC_CONSULTATION_INCIDENT_READY",
    "PAC_CONSULTATION_DELIVERY_READY",
  ]) {
    if (!enabled(name)) fail(`${name} must be on before consultation intake can be enabled.`);
  }
}
if (enabled("PAC_GENERATIVE_PILOT")) {
  if (!process.env.OPENAI_API_KEY?.trim()) {
    fail("Live generation requires the selected OpenAI server-side provider key.");
  }
}
if (enabled("PAC_RESEARCH_ENABLED") && !enabled("PAC_RESEARCH_KILL_SWITCH")) {
  requireSetting("PERPLEXITY_API_KEY", "before live research can be enabled");
  const cap = Number(process.env.PAC_RESEARCH_MONTHLY_USD_CAP);
  if (!Number.isFinite(cap) || cap <= 0) {
    fail("Live research requires a positive PAC_RESEARCH_MONTHLY_USD_CAP.");
  }
}

const objectStorageSettings = ["PAC_SUPABASE_URL", "PAC_SUPABASE_BUCKET", "PAC_SUPABASE_SECRET_KEY"];
const configuredObjectStorageSettings = objectStorageSettings.filter((name) => process.env[name]?.trim());
if (configuredObjectStorageSettings.length > 0 && configuredObjectStorageSettings.length < objectStorageSettings.length) {
  fail("Private source-object storage must configure URL, bucket, and secret key together.");
}

const localOnlySettings = [
  "PAC_CATALOG_PATH",
  "PAC_IMPORT_BENCHMARK_DATABASE_URL",
  "PAC_TEST_POSTGRES_BIN",
];

function rejectLocalOnlySettings(environment) {
  for (const name of localOnlySettings) {
    if (process.env[name]?.trim()) fail(`${name} is local-only and cannot be configured in ${environment}.`);
  }
  if (enabled("PAC_RESEARCH_FIXTURE") || enabled("PAC_REQUIRE_LOCAL_CORPUS")) {
    fail(`Test fixtures cannot be enabled in ${environment}.`);
  }
}

if (mode === "production") {
  if ((process.env.PAC_DATA_ENV ?? "").trim() !== "production") {
    fail("Production requires PAC_DATA_ENV=production so durable resources cannot be mistaken for preview resources.");
  }
  const ownerSecret = requireStrongSecret("PAC_OWNER_KEY", "for the protected owner workspace in production");
  const rateLimitSecret = requireStrongSecret("PAC_RATE_LIMIT_SECRET", "for deployed request limits in production");
  if (store !== "postgres") fail("Production requires PAC_STORE=postgres for durable protected workflows.");
  if (contentSource !== "postgres") fail("Production requires PAC_CONTENT_SOURCE=postgres; static historical content cannot be the release source.");
  requireSetting("PAC_RUNTIME_DATABASE_URL", "for production runtime access");
  const cronSecret = requireStrongSecret("CRON_SECRET", "for the configured scheduled route in production");
  if (new Set([ownerSecret, rateLimitSecret, cronSecret]).size !== 3) {
    fail("PAC_OWNER_KEY, PAC_RATE_LIMIT_SECRET, and CRON_SECRET must be different secrets.");
  }
  rejectLocalOnlySettings("production");
} else if (mode === "preview") {
  if ((process.env.PAC_DATA_ENV ?? "").trim() !== "preview") {
    fail("Preview requires PAC_DATA_ENV=preview so production data and preview data stay separated.");
  }
  rejectLocalOnlySettings("preview");
  if (process.env.PAC_OWNER_KEY?.trim()) requireStrongSecret("PAC_OWNER_KEY", "when the protected owner workspace is enabled in preview");
  requireStrongSecret("PAC_RATE_LIMIT_SECRET", "for deployed request limits in preview");
  if (process.env.CRON_SECRET?.trim()) requireStrongSecret("CRON_SECRET", "when a scheduled-route credential is configured in preview");
} else if (mode !== "clean-clone") {
  fail("--mode must be clean-clone, preview, or production.");
}


function contributorCanonicalJson(value) {
  if (Array.isArray(value)) return "[" + value.map(contributorCanonicalJson).join(",") + "]";
  if (value !== null && typeof value === "object") return "{" + Object.keys(value).sort().map((key) => JSON.stringify(key) + ":" + contributorCanonicalJson(value[key])).join(",") + "}";
  return JSON.stringify(value);
}
const contributorContract = readJson(resolve(root, "config/contributor-access.json"));
for (const prefix of ["PAC_CONTRIBUTOR_DATABASE", "PAC_PROGRAM_AUTH_DATABASE"]) {
  validatePostgresUrl(prefix + "_URL");
  const url = process.env[prefix + "_URL"];
  if (url) {
    const parsed = new URL(url);
    const local = ["localhost", "127.0.0.1", "::1", "[::1]"].includes(parsed.hostname);
    const transport = process.env[prefix + "_SSL"];
    if ((process.env.PAC_DATA_ENV !== undefined && process.env.PAC_DATA_ENV !== "local") || !local) {
      if (transport !== "verify-full") fail(prefix + "_SSL must be verify-full outside local loopback.");
    }
  }
}
for (const [feature, prefix] of [["protected_identity", "PAC_PROTECTED_IDENTITY"], ["protected_contribution", "PAC_PROTECTED_CONTRIBUTION"]]) {
  if (!enabled(prefix + "_ENABLED")) continue;
  requireSetting("PAC_CONTRIBUTOR_DATABASE_URL", "for named contributor access");
  requireSetting("PAC_PROGRAM_AUTH_DATABASE_URL", "for the separate named sign-in broker");
  if (process.env.PAC_CONTRIBUTOR_DATABASE_URL === process.env.PAC_PROGRAM_AUTH_DATABASE_URL) fail("Named contributor and authentication broker connections must be separate.");
  if (feature === "protected_contribution" && !enabled("PAC_PROTECTED_IDENTITY_ENABLED")) fail("Named contribution requires named identity.");
  const selected = contributorContract.features[feature];
  const hash = createHash("sha256").update(contributorCanonicalJson({schema_version:contributorContract.schema_version,feature,contract:selected})).digest("hex");
  if (process.env[prefix + "_ACTIVATION_EVIDENCE_ID"] !== selected.evidence_id || process.env[prefix + "_ACTIVATION_BUNDLE_SHA256"] !== hash) fail("Named access activation must match its pinned contract. Database activation is checked independently.");
}

const major = Number(process.versions.node.split(".")[0]);
if (major !== 24) fail(`Node 24.x is required; found ${process.versions.node}.`);
if (packageDocument.packageManager !== contract.package_manager) fail("packageManager does not match the environment contract.");
if (packageDocument.engines?.node !== contract.node) fail("The Node engine does not match the environment contract.");
if (lock.packages?.[""]?.engines?.node !== contract.node) fail("The package-lock Node engine is stale.");
const requiredNpm = contract.package_manager.replace(/^npm@/, "");
if (packageDocument.engines?.npm !== requiredNpm) fail("The npm engine does not match the exact package-manager contract.");
if (lock.packages?.[""]?.engines?.npm !== requiredNpm) fail("The package-lock npm engine is stale.");

console.log(JSON.stringify({
  ok: true,
  node: process.versions.node,
  packageManager: packageDocument.packageManager,
  mode,
  documentedSettings: contract.settings.length,
  referencedSettings: referenced.size,
  exampleSettings: exampleNames.size,
  clientModulesChecked: clientFiles.length,
  clientSecretSettings: clientSecretReferences,
}, null, 2));
