import type { ListQuery, Metadata } from "../../common/types";

/** Current enablement state for a webhook endpoint. */
export type WebhookEndpointStatus = "enabled" | "disabled";

/** Webhook endpoint resource returned by the Araute API. */
export type WebhookEndpoint = {
  id: string;
  object: "webhook_endpoint";
  url: string;
  enabled_events: string[];
  status: WebhookEndpointStatus;
  secret?: string;
  description?: string | null;
  metadata?: Metadata;
  livemode: boolean;
  created_at: string;
  updated_at: string;
};

/** Request body for `webhookEndpoint.create(...)`. */
export type WebhookEndpointCreate = {
  url: string;
  enabled_events: string[];
  description?: string;
  metadata?: Metadata;
};

/** Request body for `webhookEndpoint.update(...)`. */
export type WebhookEndpointUpdate = {
  url?: string;
  enabled_events?: string[];
  status?: WebhookEndpointStatus;
  description?: string;
  roll_secret?: boolean;
  metadata?: Metadata;
};

/** Supported query parameters for `webhookEndpoint.list(...)`. */
export type WebhookEndpointListQuery = ListQuery;
