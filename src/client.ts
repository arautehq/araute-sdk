import { ArauteHttpClient } from "./common/http";
import type { ArauteConfig } from "./common/types";
import { CustomerResource } from "./entities/customers";
import { ProductResource } from "./entities/products";
import { WebhookEndpointResource } from "./entities/webhooks";

/**
 * Root Araute SDK client.
 *
 * @example
 * ```ts
 * const araute = new Araute({ apiKey: process.env.ARAUTE_API_KEY! });
 * const customer = await araute.customers.get("cus_123");
 * const product = await araute.products.get("prod_123");
 * ```
 */
export class Araute {
  readonly customers: CustomerResource;

  readonly products: ProductResource;

  readonly webhooks: WebhookEndpointResource;
  constructor(config: ArauteConfig) {
    const http = new ArauteHttpClient(config);

    this.customers = new CustomerResource(http);
    this.products = new ProductResource(http);
    this.webhooks = new WebhookEndpointResource(http);
  }
}
