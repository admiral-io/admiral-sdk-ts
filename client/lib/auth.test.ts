import { describe, it, expect } from "vitest";
import {
  validateAuthToken,
  defaultTokenValidator,
  encodeBase62CRC32,
  TOKEN_PREFIX_PAT,
  TOKEN_PREFIX_SAT,
  TOKEN_PREFIX_SESSION,
  TOKEN_LENGTH,
} from "./auth.js";

const CHECKSUM_LEN = 6;
const PREFIX_LEN = 5;

/**
 * Creates a valid Admiral opaque token for testing.
 * Uses a deterministic body (all 'A's) with a correctly computed CRC32 checksum.
 */
function createTestToken(prefix: string): string {
  const bodyLen = TOKEN_LENGTH - prefix.length - CHECKSUM_LEN;
  const body = prefix + "A".repeat(bodyLen);
  const checksum = encodeBase62CRC32(body);
  return body + checksum;
}

/** Creates a token with correct prefix and length but invalid checksum. */
function createTestTokenWithBadChecksum(prefix: string): string {
  const bodyLen = TOKEN_LENGTH - prefix.length - CHECKSUM_LEN;
  const body = prefix + "A".repeat(bodyLen);
  return body + "000000";
}

describe("validateAuthToken", () => {
  it("accepts valid PAT", () => {
    const result = validateAuthToken(createTestToken(TOKEN_PREFIX_PAT));
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("accepts valid SAT", () => {
    const result = validateAuthToken(createTestToken(TOKEN_PREFIX_SAT));
    expect(result.valid).toBe(true);
  });

  it("accepts valid session token", () => {
    const result = validateAuthToken(createTestToken(TOKEN_PREFIX_SESSION));
    expect(result.valid).toBe(true);
  });

  it("accepts token with Bearer prefix", () => {
    const token = createTestToken(TOKEN_PREFIX_PAT);
    const result = validateAuthToken(`Bearer ${token}`);
    expect(result.valid).toBe(true);
  });

  it("rejects empty token", () => {
    const result = validateAuthToken("");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("empty");
  });

  it("rejects token with wrong prefix", () => {
    const token = "admx_" + "A".repeat(TOKEN_LENGTH - PREFIX_LEN);
    const result = validateAuthToken(token);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("prefix");
  });

  it("rejects token that is too short", () => {
    const result = validateAuthToken(TOKEN_PREFIX_PAT + "short");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("length");
  });

  it("rejects token that is too long", () => {
    const result = validateAuthToken(createTestToken(TOKEN_PREFIX_PAT) + "extra");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("length");
  });

  it("rejects token with bad checksum", () => {
    const result = validateAuthToken(createTestTokenWithBadChecksum(TOKEN_PREFIX_PAT));
    expect(result.valid).toBe(false);
    expect(result.error).toContain("checksum");
  });
});

describe("defaultTokenValidator", () => {
  it("validates via the TokenValidator interface", () => {
    const token = createTestToken(TOKEN_PREFIX_PAT);
    const result = defaultTokenValidator.validate(token);
    expect(result.valid).toBe(true);
  });

  it("rejects empty token", () => {
    const result = defaultTokenValidator.validate("");
    expect(result.valid).toBe(false);
  });
});

describe("encodeBase62CRC32", () => {
  it("produces a 6-character checksum", () => {
    const checksum = encodeBase62CRC32("test-input");
    expect(checksum).toHaveLength(CHECKSUM_LEN);
  });

  it("is deterministic", () => {
    const a = encodeBase62CRC32("hello");
    const b = encodeBase62CRC32("hello");
    expect(a).toBe(b);
  });

  it("produces different checksums for different inputs", () => {
    const a = encodeBase62CRC32("input-a");
    const b = encodeBase62CRC32("input-b");
    expect(a).not.toBe(b);
  });
});

describe("token constants", () => {
  it("has correct prefix lengths", () => {
    expect(TOKEN_PREFIX_PAT).toHaveLength(PREFIX_LEN);
    expect(TOKEN_PREFIX_SAT).toHaveLength(PREFIX_LEN);
    expect(TOKEN_PREFIX_SESSION).toHaveLength(PREFIX_LEN);
  });

  it("token length is 54", () => {
    expect(TOKEN_LENGTH).toBe(54);
  });
});
