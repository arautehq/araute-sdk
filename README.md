# Araute Typescript SDK

Build payment experiences that feel native to your TypeScript app. The Araute SDK gives you a clean, type-safe way to create checkouts, manage customers and subscriptions, process payments, and handle refunds from Bun or Node.js.

Spend less time wiring API details and more time shipping: typed resource clients, camelCase request and response fields, pagination, retries, cancellation, and actionable API errors are included out of the box.

## Install

```bash
npm install @araute/sdk
# or: pnpm add @araute/sdk
# or: bun add @araute/sdk
```

## Start here

Keep your secret key in an environment variable:

```ts
import { Araute } from "@araute/sdk";

const araute = new Araute({
  apiKey: process.env.ARAUTE_API_KEY!,
});

const checkout = await araute.checkouts.create({
  amount: 1990, // amounts are in centavos
  methods: ["PIX", "CARD"],
  successUrl: "https://example.com/checkout/success",
});

console.log(checkout.url);
```

## Resources

All methods return promises. Most resources support `create`, `list`, and `get`; customers, products, and subscriptions also support updates where defined.

```ts
const customer = await araute.customers.create({
  name: "Ada Lovelace",
  email: "ada@example.com",
});

const product = await araute.products.create({ name: "Pro plan" });
const price = await araute.prices.create({
  product: product.id,
  unitAmount: 1990,
  recurring: { interval: "MONTH", intervalCount: 1 },
});

const subscription = await araute.subscriptions.create({
  customer: customer.id,
  items: [{ price: price.id }],
});

const payment = await araute.payments.create({
  amount: 1990,
  methods: ["PIX"],
});
```

## Errors

API problem responses throw `ArauteError`:

```ts
import { ArauteError } from "@araute/sdk";

try {
  await araute.refunds.create({ charge: "ch_123", amount: 500 });
} catch (error) {
  if (error instanceof ArauteError) {
    console.log(error.code, error.status, error.detail, error.traceId);
  }
}
```

`ArauteError` also exposes field-level `errors`, `param`, `amountRefundable`, and `retryAfter` when the API provides them. Unexpected non-problem responses throw `ArauteTransportError`.

## Development

```bash
bun install
bun run check
bun test
bun run build
```
