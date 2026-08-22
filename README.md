# admiral-sdk-ts

TypeScript client library for the Admiral API.

Built on [ConnectRPC](https://connectrpc.com) — works in both browsers and Node.js.

## Installation

```bash
npm install github:admiral-io/admiral-sdk-ts
```

Pin to a release — npm resolves the range against this repo's tags:

```bash
npm install github:admiral-io/admiral-sdk-ts#semver:^1.0.0
```

This package is installed from source rather than a registry, so `git` must be
available and the TypeScript build runs during install.

You also need a Connect transport for your runtime:

```bash
# Browser
npm install @connectrpc/connect-web

# Node.js
npm install @connectrpc/connect-node
```

## Quick Start

```typescript
import { createClient } from "@admiral-io/sdk";
```

### Browser

```typescript
import { createConnectTransport } from "@connectrpc/connect-web";

const transport = createConnectTransport({
  baseUrl: "/api",
});

const client = createClient(transport);
// await client.agent.methodName({ ... });
// await client.agentRuntime.methodName({ ... });
// await client.application.methodName({ ... });
// await client.catalog.methodName({ ... });
// await client.changeSet.methodName({ ... });
// await client.credential.methodName({ ... });
// await client.environment.methodName({ ... });
// await client.healthcheck.methodName({ ... });
// await client.run.methodName({ ... });
// await client.source.methodName({ ... });
// await client.tenant.methodName({ ... });
// await client.user.methodName({ ... });
```

### Node.js

```typescript
import { createConnectTransport } from "@connectrpc/connect-node";

const transport = createConnectTransport({
  baseUrl: "https://api.admiral.io",
  httpVersion: "2",
});

const client = createClient(transport);
```

## Available Services

| Service | Property | Description |
|---------|----------|-------------|
| AgentAPI | `client.agent` | Agent service |
| AgentRuntimeAPI | `client.agentRuntime` | AgentRuntime service |
| ApplicationAPI | `client.application` | Application service |
| CatalogAPI | `client.catalog` | Catalog service |
| ChangeSetAPI | `client.changeSet` | ChangeSet service |
| CredentialAPI | `client.credential` | Credential service |
| EnvironmentAPI | `client.environment` | Environment service |
| HealthcheckAPI | `client.healthcheck` | Healthcheck service |
| RunAPI | `client.run` | Run service |
| SourceAPI | `client.source` | Source service |
| TenantAPI | `client.tenant` | Tenant service |
| UserAPI | `client.user` | User service |

## Example

```typescript
import { createConnectTransport } from "@connectrpc/connect-node";
import { createClient } from "@admiral-io/sdk";

async function main() {
  const transport = createConnectTransport({
    baseUrl: "https://api.admiral.io",
    httpVersion: "2",
  });

  const client = createClient(transport);

  try {
    const response = await client.agent.listMethod({});
    console.log(response);
  } catch (err) {
    console.error("Request failed:", err);
  }
}

main();
```

## Interceptors

Auth, logging, timeouts, and other cross-cutting concerns are configured on the
transport via [Connect interceptors](https://connectrpc.com/docs/web/interceptors/):

```typescript
import type { Interceptor } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { createClient } from "@admiral-io/sdk";

const authInterceptor: Interceptor = (next) => async (req) => {
  req.header.set("Authorization", `Bearer ${getToken()}`);
  return next(req);
};

const transport = createConnectTransport({
  baseUrl: "/api",
  interceptors: [authInterceptor],
});

const client = createClient(transport);
```

## Token Validation

Validate Admiral opaque token format (prefix, length, CRC32 checksum) without
a network call:

```typescript
import { validateAuthToken } from "@admiral-io/sdk";

const result = validateAuthToken(token);
if (!result.valid) {
  console.error(result.error);
}
```

A custom `TokenValidator` can be provided for alternative validation strategies:

```typescript
import type { TokenValidator } from "@admiral-io/sdk";

const myValidator: TokenValidator = {
  validate(token: string) {
    // Custom validation logic
    return { valid: token.length > 0 };
  },
};
```

## Requirements

- Node.js >= 22 (for Node.js usage)
- ESM only (no CommonJS support)

## License

Apache-2.0 License - see [LICENSE](LICENSE.txt) for details.