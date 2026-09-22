import "server-only";

import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const CONTRACT_PREFIX = "$pac-scrypt$v=1$ln=17$r=8$p=1$";
const SCRYPT_COST = 2 ** 17;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;
const SCRYPT_KEY_BYTES = 32;
const SCRYPT_MAX_MEMORY = 192 * 1024 * 1024;
const SALT_BYTES = 16;
const MAX_PASSPHRASE_BYTES = 1_024;
const MIN_PASSPHRASE_CODE_POINTS = 15;
const MAX_PASSPHRASE_CODE_POINTS = 128;
const MAX_CONCURRENT_CREDENTIAL_WORK = 2;
const CREDENTIAL_PATTERN = /^\$pac-scrypt\$v=1\$ln=17\$r=8\$p=1\$([A-Za-z0-9_-]{22})\$([A-Za-z0-9_-]{43})$/;
const DUMMY_SALT = Buffer.from("pac-auth-dummy-v1", "utf8");
const DUMMY_EXPECTED = Buffer.alloc(SCRYPT_KEY_BYTES, 0xa5);
let credentialWorkInFlight = 0;

export class ProgramCredentialCapacityError extends Error {
  constructor() {
    super("Protected sign-in capacity is temporarily full.");
    this.name = "ProgramCredentialCapacityError";
  }
}

/** Keep memory-hard credential work from exhausting every application worker. */
export async function withProgramCredentialWork<T>(work: () => Promise<T>): Promise<T> {
  if (credentialWorkInFlight >= MAX_CONCURRENT_CREDENTIAL_WORK) {
    throw new ProgramCredentialCapacityError();
  }
  credentialWorkInFlight += 1;
  try {
    return await work();
  } finally {
    credentialWorkInFlight -= 1;
  }
}

export type PassphraseRefusal =
  | "too_short"
  | "too_long"
  | "too_many_bytes"
  | "control_character"
  | "obvious_pattern";

export class PassphrasePolicyError extends Error {
  readonly refusal: PassphraseRefusal;

  constructor(refusal: PassphraseRefusal) {
    super("The passphrase does not meet the protected-workspace requirements.");
    this.name = "PassphrasePolicyError";
    this.refusal = refusal;
  }
}

function normalize(value: string): string {
  return value.normalize("NFC");
}

function containsControlCharacter(value: string): boolean {
  return /[\u0000-\u001f\u007f-\u009f]/u.test(value);
}

function isObviousPattern(value: string): boolean {
  const folded = value.toLocaleLowerCase("en-US").replace(/[\s._-]+/gu, "");
  if (/^(.)\1+$/u.test(value)) return true;
  return new Set([
    "passwordpassword",
    "passwordpasswordpassword",
    "changemechangeme",
    "letmeinletmeinletmein",
    "qwertyqwertyqwerty",
  ]).has(folded);
}

export function validateProgramPassphrase(value: string): string {
  const normalized = normalize(value);
  const codePoints = [...normalized].length;
  if (codePoints < MIN_PASSPHRASE_CODE_POINTS) throw new PassphrasePolicyError("too_short");
  if (codePoints > MAX_PASSPHRASE_CODE_POINTS) throw new PassphrasePolicyError("too_long");
  if (Buffer.byteLength(normalized, "utf8") > MAX_PASSPHRASE_BYTES) {
    throw new PassphrasePolicyError("too_many_bytes");
  }
  if (containsControlCharacter(normalized)) throw new PassphrasePolicyError("control_character");
  if (isObviousPattern(normalized)) throw new PassphrasePolicyError("obvious_pattern");
  return normalized;
}

function derive(passphrase: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      passphrase,
      salt,
      SCRYPT_KEY_BYTES,
      {
        N: SCRYPT_COST,
        r: SCRYPT_BLOCK_SIZE,
        p: SCRYPT_PARALLELIZATION,
        maxmem: SCRYPT_MAX_MEMORY,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
  });
}

function decodeCanonicalBase64Url(value: string, bytes: number): Buffer | null {
  try {
    const decoded = Buffer.from(value, "base64url");
    if (decoded.byteLength !== bytes || decoded.toString("base64url") !== value) return null;
    return decoded;
  } catch {
    return null;
  }
}

export async function hashProgramPassphrase(value: string): Promise<string> {
  const passphrase = validateProgramPassphrase(value);
  const salt = randomBytes(SALT_BYTES);
  const derived = await derive(passphrase, salt);
  return `${CONTRACT_PREFIX}${salt.toString("base64url")}$${derived.toString("base64url")}`;
}

/**
 * Verification performs the same memory-hard work for an unknown account or a
 * malformed stored verifier. Callers can therefore return one generic refusal
 * without turning account discovery into a cheap timing oracle.
 */
export async function verifyProgramPassphrase(
  candidate: string,
  storedCredential: string | null | undefined,
): Promise<boolean> {
  const normalized = normalize(candidate);
  const bounded = [...normalized].length <= MAX_PASSPHRASE_CODE_POINTS
    && Buffer.byteLength(normalized, "utf8") <= MAX_PASSPHRASE_BYTES
    && !containsControlCharacter(normalized);
  const match = typeof storedCredential === "string"
    ? CREDENTIAL_PATTERN.exec(storedCredential)
    : null;
  const salt = match ? decodeCanonicalBase64Url(match[1], SALT_BYTES) : null;
  const expected = match ? decodeCanonicalBase64Url(match[2], SCRYPT_KEY_BYTES) : null;
  const useRealCredential = bounded && salt !== null && expected !== null;
  const derived = await derive(useRealCredential ? normalized : "invalid-program-passphrase", salt ?? DUMMY_SALT);
  const comparison = expected ?? DUMMY_EXPECTED;
  const equal = timingSafeEqual(derived, comparison);
  return useRealCredential && equal;
}

export const PROGRAM_PASSPHRASE_POLICY = Object.freeze({
  minimumCodePoints: MIN_PASSPHRASE_CODE_POINTS,
  maximumCodePoints: MAX_PASSPHRASE_CODE_POINTS,
  maximumBytes: MAX_PASSPHRASE_BYTES,
  algorithm: "scrypt" as const,
  cost: SCRYPT_COST,
  blockSize: SCRYPT_BLOCK_SIZE,
  parallelization: SCRYPT_PARALLELIZATION,
  maximumConcurrentWork: MAX_CONCURRENT_CREDENTIAL_WORK,
});
