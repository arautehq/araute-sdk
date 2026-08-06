# Araute TypeScript SDK Roadmap

Source of truth: `/home/albqvxc/www/opensource/araute/openapi.yaml`.

API base: `https://api.araute.com/v1`
SDK package: `@araute/sdk`

## Product direction

Build a high-level, TypeScript-first SDK with domain namespaces:

```ts
const araute = new Araute({ apiKey: process.env.ARAUTE_API_KEY! });

await araute.customers.create({ ... });
await araute.payments.create({ ... });
await araute.subscriptions.cancel(id);
```

Rules:

- Public API uses camelCase; HTTP payloads use snake_case.
- Public enum values are uppercase (`PIX`, `CARD`); wire values follow OpenAPI.
- `araute.payments` is the public facade for `/payment_intents`.
- Public payment creation uses `methods`; wire payload uses `payment_method_types`.
- Entities stay thin. Authentication, fetch, errors, conversion, pagination, and idempotency live in shared layers.
- Do not expose `payments.listAttempts()` or a public `PaymentAttempt`; the attempts endpoint remains direct REST only.
- Never invent SDK methods or fields not supported by `openapi.yaml`.

## Current state

### Already implemented

- Shared client with bearer auth, configurable base URL, custom `fetch`, abort signals, headers, and user agent.
- Recursive camelCase/snake_case conversion at the HTTP boundary.
- Uppercase public enum conversion and payment `methods` mapping.
- Keyset pagination types: `limit`, `startingAfter`, `endingBefore`.
- RFC 7807 errors through `ArauteError`; transport failures through `ArauteTransportError`.
- Generic CRUD and deletable-resource helpers.
- Idempotency-key support for `POST` and `PATCH`.
- Namespaces for customers, products, checkouts, payments, and subscriptions.
- Basic payment tests and case-conversion tests.

### Current resource coverage

| Namespace | OpenAPI operations | SDK status |
|---|---|---|
| `customers` | create, list, get, update | Implemented |
| `products` | create, list, get | Implemented |
| `prices` | create, list, get | Missing |
| `paymentMethods` | list, get | Missing |
| `paymentLinks` | create, list, get, update | Missing |
| `checkouts` | create, list, get, expire | Implemented, remove inherited `update` |
| `payments` | create, list, get, confirm, cancel | Implemented, contract hardening needed |
| `subscriptions` | create, list, get, update, changes, preview, cancel, pause, resume | Partial; change get missing |
| `invoices` | create, list, get, add item, finalize, pay, void, mark uncollectible | Missing |
| `refunds` | create, list, get | Missing |

## P0 — contract and architecture foundation

- [ ] Make the public entrypoint and architecture match the skill:
  - `src/index.ts`: exports, constants, and public types.
  - `src/client.ts`: facade and namespace composition.
  - `src/common/`: HTTP, errors, case conversion, pagination, and shared resource helpers.
  - `src/entities/<domain>/index.ts`: thin domain methods.
  - `src/entities/<domain>/model.ts`: explicit public request/response/query types.
- [ ] Compare every existing method with its OpenAPI `operationId`, HTTP method, path, request schema, and response schema.
- [ ] Remove unsupported inherited methods, especially `checkouts.update`.
- [ ] Decide and document whether the payment-intent facade remains only `payments` or also exposes an alias.
- [ ] Model required, nullable, timestamp, ID, currency, amount, `object`, and metadata fields exactly as OpenAPI defines them.
- [ ] Make all side-effecting `POST` operations accept idempotency options where supported.
- [ ] Preserve status, `Retry-After`, `traceId`, and structured fields for RFC 7807 errors.
- [ ] Verify `204` and empty-body responses, especially delete operations.
- [ ] Add typed query models for every list endpoint and correct query snake_case conversion.
- [ ] Add an OpenAPI drift check for exported operations and paths.

## P1 — finish existing namespaces

### Payments

- [ ] Verify create/list/get/confirm/cancel against the PaymentIntent schemas.
- [ ] Verify `methods` ↔ `payment_method_types` for create, confirm, list, and response conversion.
- [ ] Cover every public payment enum: status, method, next action, attempt status, and error values.
- [ ] Keep attempts endpoint intentionally out of the public facade.

### Checkouts

- [ ] Remove `update` from the public type and runtime surface.
- [ ] Verify create variants, line items, amount, mode, methods, status, payment status, expiry, and nullable fields.
- [ ] Test `expire`, idempotency, query filters, and relevant API errors.

### Subscriptions

- [ ] Add `subscriptions.getChange(id)` for `GET /subscription_changes/{id}`.
- [ ] Verify subscription and change enums, nested items, nullable fields, and action payloads.
- [ ] Test create change, preview, cancel, pause, and resume with idempotency behavior.

## P2 — catalog and payment setup

### Prices

- [ ] Add `src/entities/prices/{index,model}.ts` and `araute.prices`.
- [ ] Implement `create`, `list`, and `get` for `/prices` and `/prices/{id}`.
- [ ] Model product, active, currency, amount, one-time, and recurring fields exactly.

### Payment methods

- [ ] Add `src/entities/payment-methods/{index,model}.ts` and `araute.paymentMethods`.
- [ ] Implement `list` and `get` for `/payment_methods` and `/payment_methods/{id}`.
- [ ] Model supported filters and safe, non-sensitive payment method data.

### Payment links

- [ ] Add `src/entities/payment-links/{index,model}.ts` and `araute.paymentLinks`.
- [ ] Implement `create`, `list`, `get`, and `update` for `/payment_links`.
- [ ] Model line items, methods, active state, completion behavior, restrictions, and metadata.

## P3 — payment execution and billing

### Invoices

- [ ] Add `araute.invoices` with `create`, `list`, and `get`.
- [ ] Add `addItem`, `finalize`, `pay`, `void`, and `markUncollectible`.
- [ ] Model invoice state, collection method, billing reason, totals, payment intent, hosted URL, PDF, dates, periods, and lines.
- [ ] Encode action-specific bodies and no-body actions exactly.

### Refunds

- [ ] Add `araute.refunds` with `create`, `list`, and `get`.
- [ ] Model `PENDING`, `SUCCEEDED`, and `FAILED` states.
- [ ] Preserve `amountRefundable` and other structured RFC 7807 fields.
- [ ] Test idempotency and refund failure responses.

## P4 — platform operations

## P5 — tests, docs, and release

### Tests

- [ ] Add mocked-fetch coverage for every exposed OpenAPI operation.
- [ ] Assert exact HTTP method, path, query, body, headers, and return value.
- [ ] Test camelCase ↔ snake_case conversion, uppercase enums, pagination, nullable fields, and `204`.
- [ ] Test bearer auth, idempotency, custom headers, abort signals, RFC 7807 errors, retry headers, and transport errors.
- [ ] Add contract snapshots or generated checks against `openapi.yaml`.

### Documentation

- [ ] Rewrite README in this order: package purpose, Bun/pnpm/npm installation, environment secret, client construction, domain example, versioning, errors, and return behavior.
- [ ] Add valid examples for payments, prices, checkouts, subscriptions, invoices, and refunds.
- [ ] Document public-to-wire mappings, especially `payments` → `/payment_intents` and `methods` → `payment_method_types`.
- [ ] Never include real API secrets in examples.

### Package and release

- [ ] Export every public resource model from `src/index.ts`.
- [ ] Add package metadata, changelog, versioning policy, and CI.
- [ ] CI must run `bun run check`, `bun run test`, `bun run build`, and `git diff --check`.
- [ ] Publish only after P0 is complete and all P1 gaps are closed.

## Delivery order

1. P0 contract and architecture.
2. Finish payments, checkouts, and subscriptions.
3. Prices, payment methods, and payment links.
4. Invoices and refunds.
5. Full contract tests, README, CI, and release.
