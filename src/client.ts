import { ArauteHttpClient } from "./common/http";
import type { ArauteConfig } from "./common/types";
import { CheckoutResource } from "./entities/checkouts";
import { CustomerResource } from "./entities/customers";
import { ProductResource } from "./entities/products";
import { PaymentResource } from "./entities/payments";
import { SubscriptionResource } from "./entities/subscriptions";
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
  readonly checkouts: CheckoutResource;

  readonly customers: CustomerResource;

  readonly products: ProductResource;

  readonly payments: PaymentResource;

  readonly subscriptions: SubscriptionResource;

  readonly webhooks: WebhookEndpointResource;
  constructor(config: ArauteConfig) {
    const http = new ArauteHttpClient(config);

    this.checkouts = new CheckoutResource(http);
    this.customers = new CustomerResource(http);
    this.products = new ProductResource(http);
    this.payments = new PaymentResource(http);
    this.subscriptions = new SubscriptionResource(http);
    this.webhooks = new WebhookEndpointResource(http);
  }
}
