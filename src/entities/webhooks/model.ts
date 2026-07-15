import type { ListQuery, Metadata } from "../../common/types";

export type WebhookEndpointStatus = "enabled" | "disabled";

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

export type WebhookEndpointCreate = {
  url: string;
  enabled_events: string[];
  description?: string;
  metadata?: Metadata;
};

export type WebhookEndpointUpdate = {
  url?: string;
  enabled_events?: string[];
  status?: WebhookEndpointStatus;
  description?: string;
  roll_secret?: boolean;
  metadata?: Metadata;
};

export type WebhookEndpointListQuery = ListQuery;
