# @araute/sdk

TypeScript-first SDK for Araute API.

## Install

```bash
bun add @araute/sdk
pnpm add @araute/sdk
npm install @araute/sdk
```

## Use

Keep API key in environment variable:

```ts
import { Araute } from "@araute/sdk";

const araute = new Araute({
  apiKey: process.env.ARAUTE_API_KEY!,
});

const checkout = await araute.checkouts.create({
  amount: 1990,
  methods: ["PIX", "CARD"],
  successUrl: "https://example.com/success",
});
```

Other domains use same thin namespace API:

```ts
const payment = await araute.payments.create({ amount: 1990, methods: ["PIX"] });
const price = await araute.prices.create({ product: "prod_123", unitAmount: 1990 });
const subscription = await araute.subscriptions.create({
  customer: "cus_123",
  items: [{ price: price.id }],
});
const invoice = await araute.invoices.create({ customer: "cus_123" });
const refund = await araute.refunds.create({ charge: "ch_123" });
```

Public fields use camelCase. Public enum values use uppercase. SDK maps `methods` to API field `payment_method_types` and maps `payments` to `/payment_intents`.

Available namespaces: `customers`, `products`, `prices`, `checkouts`, `payments`, `subscriptions`, `invoices`, and `refunds`.

## Errors

API problem responses throw `ArauteError`, with `code`, `status`, `detail`, `traceId`, field `errors`, `amountRefundable`, and `retryAfter`. Transport and unexpected response failures throw `ArauteTransportError`.

Methods return parsed response data. List methods return `{ object, url, data, hasMore, nextCursor }`. Side-effecting calls accept `{ idempotencyKey }`.
