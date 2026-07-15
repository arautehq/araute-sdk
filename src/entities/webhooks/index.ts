import { ArauteHttpClient } from "../../common/http";
import { DeletableResource } from "../../common/resource";
import type {
  WebhookEndpoint,
  WebhookEndpointCreate,
  WebhookEndpointListQuery,
  WebhookEndpointUpdate,
} from "./model";

/** Webhook endpoint resource operations mapped to `/webhook_endpoints`. */
export class WebhookEndpointResource extends DeletableResource<
  WebhookEndpoint,
  WebhookEndpointCreate,
  WebhookEndpointUpdate,
  WebhookEndpointListQuery
> {
  constructor(http: ArauteHttpClient) {
    super(http, "/webhook_endpoints");
  }
}
