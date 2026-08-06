import type { ListQuery, Metadata } from "../../common/types";

/** Current enablement state for a webhook endpoint. */
export type WebhookEndpointStatus = "enabled" | "disabled";

/** Webhook endpoint resource returned by the Araute API. */
export type WebhookEndpoint = {
  id: string;
  object: "webhook_endpoint";
  url: string;
  enabledEvents: string[];
  status: WebhookEndpointStatus;
  secret?: string;
  description?: string | null;
  metadata?: Metadata;
  livemode: boolean;
  createdAt: string;
  updatedAt: string;
};

/** Request body for `webhooks.create(...)`. */
export type WebhookEndpointCreate = {
  url: string;
  enabledEvents: string[];
  description?: string;
  metadata?: Metadata;
};

/** Request body for `webhooks.update(...)`. */
export type WebhookEndpointUpdate = {
  url?: string;
  enabledEvents?: string[];
  status?: WebhookEndpointStatus;
  description?: string;
  rollSecret?: boolean;
  metadata?: Metadata;
};

/** Supported query parameters for `webhooks.list(...)`. */
export type WebhookEndpointListQuery = ListQuery;
