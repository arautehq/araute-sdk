# Araute Typescript SDK

[![npm version](https://img.shields.io/npm/v/%40araute%2Fsdk?logo=npm)](https://www.npmjs.com/package/@araute/sdk)

Create and manage Araute payments from TypeScript, Bun, or Node.js.

The SDK gives you typed resource clients, camelCase request and response fields, and consistent handling for pagination, retries, cancellation, and API errors.

## Install

```bash
# Install the SDK using your preferred package manager.
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
# Install project dependencies.
bun install

# Run static checks.
bun run check

# Run the test suite.
bun test

# Build the SDK.
bun run build
```
