# Araute TypeScript SDK Roadmap

Source of truth: monorepo `openapi.yaml` (vendored snapshot: `./openapi.yaml` in this package for CI).

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
| `prices` | create, list, get | Implemented |
| `checkouts` | create, list, get, expire | Implemented |
| `payments` | create, list, get, confirm, cancel | Implemented |
| `subscriptions` | create, list, get, update, changes, preview, cancel, pause, resume | Implemented |
| `invoices` | create, list, get, add item, finalize, pay, void, mark uncollectible | Implemented |
| `refunds` | create, list, get | Implemented |

## P0 — contract and architecture foundation

- [x] Make the public entrypoint and architecture match the skill:
  - `src/index.ts`: exports, constants, and public types.
  - `src/client.ts`: facade and namespace composition.
  - `src/common/`: HTTP, errors, case conversion, pagination, and shared resource helpers.
  - `src/entities/<domain>/index.ts`: thin domain methods.
  - `src/entities/<domain>/model.ts`: explicit public request/response/query types.
- [x] Compare every existing method with its OpenAPI `operationId`, HTTP method, path, request schema, and response schema.
- [x] Remove unsupported inherited methods, especially `checkouts.update`.
- [x] Keep payment-intent facade as `payments`, with no alias.
- [x] Model required, nullable, timestamp, ID, currency, amount, `object`, and metadata fields as OpenAPI defines them.
- [x] Make all side-effecting `POST` operations accept idempotency options where supported.
- [x] Preserve status, `Retry-After`, `traceId`, and structured fields for RFC 7807 errors.
- [x] Verify `204` and empty-body responses.
- [x] Add typed query models for every list endpoint and correct query snake_case conversion.
- [x] Add an OpenAPI drift check for exported operations and paths.

## P1 — finish existing namespaces

### Payments

- [x] Verify create/list/get/confirm/cancel against the PaymentIntent schemas.
- [x] Verify `methods` ↔ `payment_method_types` for create, confirm, list, and response conversion.
- [x] Cover public payment status, method, next-action, and cancellation enums; attempts stay REST-only.
- [x] Keep attempts endpoint intentionally out of the public facade.

### Checkouts

- [x] Remove `update` from the public type and runtime surface.
- [x] Keep customer-facing payment-link creation inside `araute.checkouts`; do not expose a separate `paymentLinks` namespace.
- [x] Expose payment selection through `checkouts.create({ methods: ["PIX", "CARD"] })`, mapping to the API wire field.
- [x] Verify create variants, line items, amount, mode, methods, status, payment status, expiry, and nullable fields.
- [x] Test `expire`, idempotency, query filters, and relevant API errors.

### Subscriptions

- [x] Add `subscriptions.getChange(id)` for `GET /subscription_changes/{id}`.
- [x] Verify subscription and change enums, nested items, nullable fields, and action payloads.
- [x] Test create change, preview, cancel, pause, and resume with idempotency behavior.

## P2 — catalog and payment setup

### Prices

- [x] Add `src/entities/prices/{index,model}.ts` and `araute.prices`.
- [x] Implement `create`, `list`, and `get` for `/prices` and `/prices/{id}`.
- [x] Model product, active, currency, amount, one-time, and recurring fields exactly.

## P3 — payment execution and billing

### Invoices

- [x] Add `araute.invoices` with `create`, `list`, and `get`.
- [x] Add `addItem`, `finalize`, `pay`, `void`, and `markUncollectible`.
- [x] Model invoice state, collection method, billing reason, totals, payment intent, hosted URL, PDF, dates, periods, and lines.
- [x] Encode action-specific bodies and no-body actions exactly.

### Refunds

- [x] Add `araute.refunds` with `create`, `list`, and `get`.
- [x] Model `PENDING`, `SUCCEEDED`, and `FAILED` states.
- [x] Preserve `amountRefundable` and other structured RFC 7807 fields.
- [x] Test idempotency and refund failure responses.

## P4 — platform operations

## P5 — tests, docs, and release

### Tests

- [x] Add mocked-fetch coverage for every exposed OpenAPI operation.
- [x] Assert exact HTTP method, path, query, body, headers, and return value.
- [x] Test camelCase ↔ snake_case conversion, uppercase enums, pagination, nullable fields, and `204`.
- [x] Test bearer auth, idempotency, custom headers, abort signals, RFC 7807 errors, and retry headers.
- [x] Add contract checks against `openapi.yaml`.

### Documentation

- [x] Rewrite README in this order: package purpose, Bun/pnpm/npm installation, environment secret, client construction, domain example, versioning, errors, and return behavior.
- [x] Add valid examples for payments, prices, checkouts, subscriptions, invoices, and refunds.
- [x] Document public-to-wire mappings, especially `payments` → `/payment_intents` and `methods` → `payment_method_types`.
- [x] Never include real API secrets in examples.

### Package and release

- [x] Export every public resource model from `src/index.ts`.
- [x] Add package metadata, changelog, versioning policy, and CI.
- [x] CI runs `bun run check`, `bun run test`, `bun run build`, and `git diff --check`.
- [x] Publish only after P0 is complete and all P1 gaps are closed.

## Delivery order

1. P0 contract and architecture.
2. Finish payments, checkouts, and subscriptions.
3. Prices and checkout payment selection.
4. Invoices and refunds.
5. Full contract tests, README, CI, and release.
