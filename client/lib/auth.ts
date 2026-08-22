/** Prefix for Personal Access Tokens. */
export const TOKEN_PREFIX_PAT = "admp_";
/** Prefix for Service/Agent Tokens. */
export const TOKEN_PREFIX_SAT = "adms_";
/** Prefix for Session Tokens. */
export const TOKEN_PREFIX_SESSION = "adme_";

/** Total length of an Admiral opaque token. */
export const TOKEN_LENGTH = 54;

/** Length of the base62-encoded CRC32 checksum suffix. */
const CHECKSUM_LEN = 6;

/** Base62 alphabet for CRC32 checksum encoding. */
const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/** All valid Admiral token prefixes. */
const VALID_PREFIXES = [TOKEN_PREFIX_PAT, TOKEN_PREFIX_SAT, TOKEN_PREFIX_SESSION] as const;

/**
 * Token validation result.
 */
export interface TokenValidation {
  valid: boolean;
  error?: string;
}

/**
 * Validates an auth token and returns a result.
 * Implementations can add custom validation logic beyond the default
 * Admiral opaque token format checks.
 */
export interface TokenValidator {
  validate(token: string): TokenValidation;
}

/**
 * Default token validator for Admiral opaque tokens.
 * Checks prefix, length, and CRC32 checksum.
 */
export const defaultTokenValidator: TokenValidator = {
  validate(token: string): TokenValidation {
    return validateAuthToken(token);
  },
};

/**
 * Validates the format of an Admiral opaque token.
 * Checks prefix, length, and CRC32 checksum without requiring a network call.
 */
export function validateAuthToken(token: string): TokenValidation {
  if (!token) {
    return { valid: false, error: "Auth token is empty" };
  }

  // Strip Bearer prefix if present.
  const actual = token.replace(/^Bearer\s+/i, "");

  if (actual.length !== TOKEN_LENGTH) {
    return {
      valid: false,
      error: `Invalid token format: expected length ${TOKEN_LENGTH}, got ${actual.length}`,
    };
  }

  if (!VALID_PREFIXES.some((p) => actual.startsWith(p))) {
    return { valid: false, error: "Invalid token format: unrecognized token prefix" };
  }

  if (!validateChecksum(actual)) {
    return { valid: false, error: "Invalid token format: checksum mismatch" };
  }

  return { valid: true };
}

/**
 * Verifies the CRC32 checksum suffix of an opaque token.
 */
function validateChecksum(token: string): boolean {
  if (token.length <= CHECKSUM_LEN) {
    return false;
  }
  const body = token.slice(0, -CHECKSUM_LEN);
  const expected = encodeBase62CRC32(body);
  return token.slice(-CHECKSUM_LEN) === expected;
}

/**
 * Computes CRC32 IEEE of a string and encodes it as a fixed-length
 * base62 string (zero-padded to CHECKSUM_LEN characters).
 */
export function encodeBase62CRC32(s: string): string {
  let n = crc32(s) >>> 0; // unsigned 32-bit
  const buf = new Array<string>(CHECKSUM_LEN);
  for (let i = CHECKSUM_LEN - 1; i >= 0; i--) {
    buf[i] = BASE62[n % 62]!;
    n = Math.floor(n / 62);
  }
  return buf.join("");
}

// ---------------------------------------------------------------------------
// CRC32 IEEE implementation (no dependencies)
// ---------------------------------------------------------------------------

/** Pre-computed CRC32 IEEE lookup table. */
const CRC32_TABLE = makeCRC32Table();

function makeCRC32Table(): Uint32Array {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
}

function crc32(s: string): number {
  let crc = 0xffffffff;
  for (let i = 0; i < s.length; i++) {
    crc = (CRC32_TABLE[(crc ^ s.charCodeAt(i)) & 0xff]! ^ (crc >>> 8)) >>> 0;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
