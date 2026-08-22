// Client
export { createClient, type Client } from "./client.js";

// Token validation
export {
  type TokenValidation,
  type TokenValidator,
  validateAuthToken,
  defaultTokenValidator,
  encodeBase62CRC32,
  TOKEN_PREFIX_PAT,
  TOKEN_PREFIX_SAT,
  TOKEN_PREFIX_SESSION,
  TOKEN_LENGTH,
} from "./lib/auth.js";
