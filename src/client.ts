import { ArauteHttpClient } from "./common/http";
import type { ArauteConfig } from "./common/types";
import { CustomerResource } from "./entities/customers";
import { WebhookEndpointResource } from "./entities/webhooks";

export class Araute {
  readonly customer: CustomerResource;
  readonly webhookEndpoint: WebhookEndpointResource;

  constructor(config: ArauteConfig) {
    const http = new ArauteHttpClient(config);

    this.customer = new CustomerResource(http);
    this.webhookEndpoint = new WebhookEndpointResource(http);
  }
}
