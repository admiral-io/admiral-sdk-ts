import { describe, it, expect } from "vitest";
import type { Transport } from "@connectrpc/connect";
import { createClient } from "./client.js";

function createMockTransport(): Transport {
  return {
    unary: () => { throw new Error("not implemented"); },
    stream: () => { throw new Error("not implemented"); },
  } as unknown as Transport;
}

describe("createClient", () => {
  it("creates a client with transport", () => {
    const transport = createMockTransport();
    const client = createClient(transport);

    expect(client).toBeDefined();
    expect(client.transport).toBe(transport);
  });

  it("exposes service accessors", () => {
    const transport = createMockTransport();
    const client = createClient(transport);

    // All service accessors should be defined (lazy getters)
    expect(client.user).toBeDefined();
  });
});