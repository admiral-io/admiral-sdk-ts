import type { Transport, Client as ConnectClient } from "@connectrpc/connect";
import { createClient as createConnectClient } from "@connectrpc/connect";
import { AgentAPI } from "../proto/admiral/api/agent/v1/agent_pb.js";
import { AgentRuntimeAPI } from "../proto/admiral/api/agent/v1/runtime_pb.js";
import { ApplicationAPI } from "../proto/admiral/api/application/v1/application_pb.js";
import { CatalogAPI } from "../proto/admiral/api/catalog/v1/catalog_pb.js";
import { ChangeSetAPI } from "../proto/admiral/api/changeset/v1/changeset_pb.js";
import { CredentialAPI } from "../proto/admiral/api/credential/v1/credential_pb.js";
import { EnvironmentAPI } from "../proto/admiral/api/environment/v1/environment_pb.js";
import { HealthcheckAPI } from "../proto/admiral/api/healthcheck/v1/healthcheck_pb.js";
import { RunAPI } from "../proto/admiral/api/run/v1/run_pb.js";
import { SourceAPI } from "../proto/admiral/api/source/v1/source_pb.js";
import { TenantAPI } from "../proto/admiral/api/tenant/v1/tenant_pb.js";
import { UserAPI } from "../proto/admiral/api/user/v1/user_pb.js";

// Service client types
type AgentClient = ConnectClient<typeof AgentAPI>;
type AgentRuntimeClient = ConnectClient<typeof AgentRuntimeAPI>;
type ApplicationClient = ConnectClient<typeof ApplicationAPI>;
type CatalogClient = ConnectClient<typeof CatalogAPI>;
type ChangeSetClient = ConnectClient<typeof ChangeSetAPI>;
type CredentialClient = ConnectClient<typeof CredentialAPI>;
type EnvironmentClient = ConnectClient<typeof EnvironmentAPI>;
type HealthcheckClient = ConnectClient<typeof HealthcheckAPI>;
type RunClient = ConnectClient<typeof RunAPI>;
type SourceClient = ConnectClient<typeof SourceAPI>;
type TenantClient = ConnectClient<typeof TenantAPI>;
type UserClient = ConnectClient<typeof UserAPI>;

/**
 * Admiral client interface.
 *
 * Service clients are lazily initialized on first access.
 */
export interface Client {
  /** The underlying Connect transport */
  readonly transport: Transport;

  /** Agent service client */
  readonly agent: AgentClient;

  /** AgentRuntime service client */
  readonly agentRuntime: AgentRuntimeClient;

  /** Application service client */
  readonly application: ApplicationClient;

  /** Catalog service client */
  readonly catalog: CatalogClient;

  /** ChangeSet service client */
  readonly changeSet: ChangeSetClient;

  /** Credential service client */
  readonly credential: CredentialClient;

  /** Environment service client */
  readonly environment: EnvironmentClient;

  /** Healthcheck service client */
  readonly healthcheck: HealthcheckClient;

  /** Run service client */
  readonly run: RunClient;

  /** Source service client */
  readonly source: SourceClient;

  /** Tenant service client */
  readonly tenant: TenantClient;

  /** User service client */
  readonly user: UserClient;
}

/**
 * Creates a new Admiral API client.
 *
 * The caller provides a Connect transport, which determines the runtime
 * environment (browser vs Node.js) and handles concerns like auth, timeouts,
 * and custom headers via interceptors.
 *
 * @param transport - A Connect transport created via `@connectrpc/connect-web`
 *   or `@connectrpc/connect-node`.
 * @returns Client instance with lazily initialized service accessors
 *
 * @example Browser
 * ```typescript
 * import { createConnectTransport } from "@connectrpc/connect-web";
 * import { createClient } from "@admiral-io/sdk";
 *
 * const transport = createConnectTransport({ baseUrl: "/api" });
 * const client = createClient(transport);
 *
 * const resp = await client.agent.agentMethod({});
 * ```
 *
 * @example Node.js
 * ```typescript
 * import { createConnectTransport } from "@connectrpc/connect-node";
 * import { createClient } from "@admiral-io/sdk";
 *
 * const transport = createConnectTransport({
 *   baseUrl: "https://api.admiral.io",
 *   httpVersion: "2",
 * });
 * const client = createClient(transport);
 * ```
 */
export function createClient(transport: Transport): Client {
  // Lazily initialized service clients
  let _agent: AgentClient | undefined;
  let _agentRuntime: AgentRuntimeClient | undefined;
  let _application: ApplicationClient | undefined;
  let _catalog: CatalogClient | undefined;
  let _changeSet: ChangeSetClient | undefined;
  let _credential: CredentialClient | undefined;
  let _environment: EnvironmentClient | undefined;
  let _healthcheck: HealthcheckClient | undefined;
  let _run: RunClient | undefined;
  let _source: SourceClient | undefined;
  let _tenant: TenantClient | undefined;
  let _user: UserClient | undefined;

  return {
    transport,

    get agent() {
      if (!_agent) {
        _agent = createConnectClient(AgentAPI, transport);
      }
      return _agent;
    },

    get agentRuntime() {
      if (!_agentRuntime) {
        _agentRuntime = createConnectClient(AgentRuntimeAPI, transport);
      }
      return _agentRuntime;
    },

    get application() {
      if (!_application) {
        _application = createConnectClient(ApplicationAPI, transport);
      }
      return _application;
    },

    get catalog() {
      if (!_catalog) {
        _catalog = createConnectClient(CatalogAPI, transport);
      }
      return _catalog;
    },

    get changeSet() {
      if (!_changeSet) {
        _changeSet = createConnectClient(ChangeSetAPI, transport);
      }
      return _changeSet;
    },

    get credential() {
      if (!_credential) {
        _credential = createConnectClient(CredentialAPI, transport);
      }
      return _credential;
    },

    get environment() {
      if (!_environment) {
        _environment = createConnectClient(EnvironmentAPI, transport);
      }
      return _environment;
    },

    get healthcheck() {
      if (!_healthcheck) {
        _healthcheck = createConnectClient(HealthcheckAPI, transport);
      }
      return _healthcheck;
    },

    get run() {
      if (!_run) {
        _run = createConnectClient(RunAPI, transport);
      }
      return _run;
    },

    get source() {
      if (!_source) {
        _source = createConnectClient(SourceAPI, transport);
      }
      return _source;
    },

    get tenant() {
      if (!_tenant) {
        _tenant = createConnectClient(TenantAPI, transport);
      }
      return _tenant;
    },

    get user() {
      if (!_user) {
        _user = createConnectClient(UserAPI, transport);
      }
      return _user;
    },
  };
}
