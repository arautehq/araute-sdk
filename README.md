# @araute/sdk

Create and manage Araute payments from TypeScript, Bun, or Node.js.

The SDK gives you typed resource clients, camelCase request and response fields, and consistent handling for pagination, retries, cancellation, and API errors.

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

Requests always go to `https://api.araute.com/v1` with a fixed SDK user agent.

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

Available namespaces:

- `customers` — create, list, retrieve, and update customers
- `products` — create, list, retrieve, and update products
- `prices` — create, list, and retrieve prices
- `checkouts` — create, list, retrieve, and expire checkout sessions
- `payments` — create, list, retrieve, confirm, and cancel payment intents
- `subscriptions` — create, list, retrieve, update, pause, resume, cancel, and preview or apply changes
- `invoices` — create, list, retrieve, add items, finalize, pay, void, and mark uncollectible
- `refunds` — create, list, and retrieve refunds

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

The package is released under the MIT license.
