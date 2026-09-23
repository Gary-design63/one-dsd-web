import { randomUUID } from "node:crypto";
import { chmod, copyFile, readFile, rename, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

export const PAC_RUNTIME_ROLE = "pac_app_runtime";
export const PAC_RUNTIME_URL_KEY = "PAC_RUNTIME_DATABASE_URL";

export function buildRuntimeDatabaseUrl(ownerDatabaseUrl, password) {
  let parsed;
  try {
    parsed = new URL(ownerDatabaseUrl);
  } catch {
    throw new Error("PAC_DATABASE_URL must be a valid PostgreSQL connection string.");
  }
  if (!["postgres:", "postgresql:"].includes(parsed.protocol)) {
    throw new Error("PAC_DATABASE_URL must use the postgres or postgresql protocol.");
  }
  if (!password || /[\r\n]/.test(password)) {
    throw new Error("The generated runtime password is invalid.");
  }

  const suffixAt = parsed.username.indexOf(".");
  const poolerSuffix = suffixAt >= 0 ? parsed.username.slice(suffixAt) : "";
  parsed.username = PAC_RUNTIME_ROLE + poolerSuffix;
  parsed.password = password;
  return parsed.toString();
}

export function upsertEnvSetting(source, key, value) {
  if (!/^[A-Z][A-Z0-9_]*$/.test(key)) throw new Error("Invalid environment setting name.");
  if (/[\r\n]/.test(value)) throw new Error("Environment setting values cannot contain line breaks.");

  const newline = source.includes("\r\n") ? "\r\n" : "\n";
  const lines = source ? source.split(/\r?\n/) : [];
  const output = [];
  let replaced = false;

  for (const line of lines) {
    if (line.startsWith(key + "=")) {
      if (!replaced) output.push(key + "=" + value);
      replaced = true;
    } else {
      output.push(line);
    }
  }
  if (!replaced) {
    while (output.length && output.at(-1) === "") output.pop();
    output.push(key + "=" + value);
  }
  while (output.length && output.at(-1) === "") output.pop();
  return output.join(newline) + newline;
}

export async function writeRuntimeDatabaseSetting(repositoryRoot, runtimeDatabaseUrl) {
  const root = resolve(repositoryRoot);
  const ignoreFile = resolve(root, ".gitignore");
  const ignore = await readFile(ignoreFile, "utf8");
  if (!/^\.env\*/m.test(ignore) && !/^\.env\.local$/m.test(ignore)) {
    throw new Error("Refusing to write .env.local because it is not ignored by Git.");
  }

  const envFile = resolve(root, ".env.local");
  let existing = "";
  try {
    existing = await readFile(envFile, "utf8");
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  const next = upsertEnvSetting(existing, PAC_RUNTIME_URL_KEY, runtimeDatabaseUrl);
  const temporary = resolve(root, ".env.local.runtime-" + process.pid + "-" + randomUUID() + ".tmp");

  await writeFile(temporary, next, { encoding: "utf8", mode: 0o600, flag: "wx" });
  try {
    try {
      await rename(temporary, envFile);
    } catch (error) {
      if (!["EEXIST", "EPERM"].includes(error?.code)) throw error;
      await copyFile(temporary, envFile);
      await chmod(envFile, 0o600).catch(() => undefined);
      await rm(temporary, { force: true });
    }
  } catch (error) {
    await rm(temporary, { force: true }).catch(() => undefined);
    throw error;
  }

  return ".env.local";
}