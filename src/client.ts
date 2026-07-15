import { ArauteHttpClient } from "./common/http";
import type { ArauteConfig } from "./common/types";
import { CustomerResource } from "./entities/customers";
import { WebhookEndpointResource } from "./entities/webhooks";

/**
 * Root Araute SDK client.
 *
 * @example
 * ```ts
 * const araute = new Araute({ apiKey: process.env.ARAUTE_API_KEY! });
 * const customer = await araute.customer.get("cus_123");
 * ```
 */
export class Araute {
  /** Operations for the `/customers` resource. */
  readonly customer: CustomerResource;

  /** Operations for the `/webhook_endpoints` resource. */
  readonly webhookEndpoint: WebhookEndpointResource;

  /**
   * Creates a new Araute SDK client.
   *
   * The provided `apiKey` is sent on every request as
   * `Authorization: Bearer <apiKey>`.
   */
  constructor(config: ArauteConfig) {
    const http = new ArauteHttpClient(config);

    this.customer = new CustomerResource(http);
    this.webhookEndpoint = new WebhookEndpointResource(http);
  }
}
