import { describe, expect, it } from "vitest";
import {
  hashProgramPassphrase,
  PassphrasePolicyError,
  PROGRAM_PASSPHRASE_POLICY,
  ProgramCredentialCapacityError,
  validateProgramPassphrase,
  verifyProgramPassphrase,
  withProgramCredentialWork,
} from "@/lib/auth/program-credentials";

describe("named protected-workspace credentials", () => {
  it("uses the fixed reviewed memory-hard contract and verifies only the exact passphrase", async () => {
    const passphrase = "A careful river has 27 stones.";
    const credential = await hashProgramPassphrase(passphrase);

    expect(PROGRAM_PASSPHRASE_POLICY).toEqual({
      minimumCodePoints: 15,
      maximumCodePoints: 128,
      maximumBytes: 1024,
      algorithm: "scrypt",
      cost: 2 ** 17,
      blockSize: 8,
      parallelization: 1,
      maximumConcurrentWork: 2,
    });
    expect(credential).toMatch(
      /^\$pac-scrypt\$v=1\$ln=17\$r=8\$p=1\$[A-Za-z0-9_-]{22}\$[A-Za-z0-9_-]{43}$/,
    );
    expect(await verifyProgramPassphrase(passphrase, credential)).toBe(true);
    expect(await verifyProgramPassphrase(`${passphrase}!`, credential)).toBe(false);
  }, 20_000);

  it("reserves application capacity while two memory-hard credential checks are running", async () => {
    let releaseFirst!: () => void;
    let releaseSecond!: () => void;
    const first = withProgramCredentialWork(() => new Promise<void>((resolve) => { releaseFirst = resolve; }));
    const second = withProgramCredentialWork(() => new Promise<void>((resolve) => { releaseSecond = resolve; }));

    await expect(withProgramCredentialWork(async () => undefined))
      .rejects.toBeInstanceOf(ProgramCredentialCapacityError);
    releaseFirst();
    await first;
    await expect(withProgramCredentialWork(async () => "available")).resolves.toBe("available");
    releaseSecond();
    await second;
  });

  it("normalizes Unicode consistently without trimming a person's secret", async () => {
    const decomposed = "Cafe\u0301 doors open at nine";
    const composed = "Caf\u00e9 doors open at nine";
    const credential = await hashProgramPassphrase(decomposed);

    expect(validateProgramPassphrase(decomposed)).toBe(composed);
    expect(await verifyProgramPassphrase(composed, credential)).toBe(true);
    expect(await verifyProgramPassphrase(` ${composed}`, credential)).toBe(false);
  }, 20_000);

  it("rejects unsafe acceptance inputs and treats malformed verifiers as a generic mismatch", async () => {
    const refusals: Array<[string, PassphrasePolicyError["refusal"]]> = [
      ["short phrase", "too_short"],
      ["a".repeat(129), "too_long"],
      ["A thoughtful phrase\nwith a break", "control_character"],
      ["password-password-password", "obvious_pattern"],
    ];
    for (const [value, refusal] of refusals) {
      try {
        validateProgramPassphrase(value);
        throw new Error("Expected passphrase refusal.");
      } catch (error) {
        expect(error).toBeInstanceOf(PassphrasePolicyError);
        expect((error as PassphrasePolicyError).refusal).toBe(refusal);
      }
    }

    expect(await verifyProgramPassphrase("A careful river has 27 stones.", null)).toBe(false);
    expect(await verifyProgramPassphrase("A careful river has 27 stones.", "$pac-scrypt$broken")).toBe(false);
  }, 20_000);
});
