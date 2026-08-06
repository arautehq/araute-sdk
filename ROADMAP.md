# Araute TypeScript SDK Roadmap

Source of truth: `/home/albqvxc/www/opensource/araute/openapi.yaml`.

OpenAPI version: `3.1.0`. API base: `https://api.araute.com/v1`.

## Current state

### Foundation already present

- [x] Bearer authentication and configurable base URL.
- [x] Custom `fetch`, abort signals, extra headers, user-agent.
- [x] Recursive camelCase public API and snake_case HTTP boundary.
- [x] Public enum values normalized to uppercase; API wire values remain lowercase.
- [x] Keyset pagination types: `limit`, `startingAfter`, `endingBefore`.
- [x] RFC 7807 error mapping to `ArauteError`.
- [x] Generic CRUD and deletable-resource abstractions.
- [x] `POST`/`PATCH` idempotency-key support.
- [x] Tests, typecheck, build, and diff validation passing.

### Resource coverage

| OpenAPI tag | SDK status | Current surface |
|---|---|---|
| Customers | Done | create, list, get, update |
| Products | Done | create, list, get |
| Prices | Missing | — |
| PaymentMethods | Missing | — |
| PaymentLinks | Missing | — |
| CheckoutSessions | Partial | create, list, get, expire; inherited `update` must be removed |
| PaymentIntents / Payments | Partial | create, list, get, confirm, cancel; attempts missing; facade named `payments` |
| Charges | Missing | — |
| Subscriptions | Partial | CRUD, changes create/list, preview, cancel, pause, resume; change get missing |
| Invoices | Missing | — |
| InvoiceItems | Missing | — |
| Refunds | Missing | — |
| WebhookEndpoints | Done | create, list, get, update, delete |
| Events | Missing | — |
| TaxDocuments | Missing | — |

## P0 — contract foundation

Do before adding many resources.

- [ ] Make operation typing match OpenAPI exactly. Remove unsupported inherited methods, especially `checkouts.update`.
- [ ] Decide and document public naming: keep `araute.payments` as PaymentIntent facade, or expose `paymentIntents` too.
- [ ] Model all OpenAPI response objects with required fields, nullable fields, timestamps, `object` discriminators, and BRL constraints.
- [ ] Make idempotency requirements explicit in types/docs for every side-effecting `POST`.
- [ ] Preserve `Retry-After`, request status, and `traceId` for `idempotency_key_in_use` and rate-limit errors.
- [ ] Verify `204` and empty-body success behavior for delete/action endpoints.
- [ ] Add shared query typing for resource-specific filters and correct snake_case conversion.
- [ ] Add spec-drift check: compare exported operations and paths against `openapi.yaml`.

## P1 — finish existing resources

### Payments / PaymentIntents

- [ ] Add `payments.listAttempts(id, query?, options?)` for `GET /payment_intents/{id}/attempts`.
- [ ] Add `PaymentAttempt` model and list response.
- [ ] Align `methods` / `payment_method_types` translation with OpenAPI request and response schemas.
- [ ] Test uppercase public enums for payment status, method type, next action, attempt status, and error fields.

### Subscriptions

- [ ] Add `subscriptions.getChange(id, options?)` for `GET /subscription_changes/{id}`.
- [ ] Verify all subscription enums and nested fields against schema.
- [ ] Test action payloads and idempotency for change, cancel, pause, and resume.

### CheckoutSessions

- [ ] Remove unsupported update operation from public type surface.
- [ ] Verify `methods`, status, payment status, line items, expiration, and deferred checkout variants against schema.
- [ ] Test `expire` idempotency and `checkout_session_not_open` errors.

## P2 — catalog and payment setup

### Prices

- [ ] Add `PriceResource`, `araute.prices`.
- [ ] Implement `create`, `list`, `get` for `/prices` and `/prices/{id}`.
- [ ] Add one-time/recurring models, product filter, active filter, currency, amount, interval, and immutable-resource typing.

### PaymentMethods

- [ ] Add `PaymentMethodResource`, `araute.paymentMethods`.
- [ ] Implement `list` and `get` for `/payment_methods` and `/payment_methods/{id}`.
- [ ] Require `customer` in list query; support `type` filter (`CARD`, `PIX`).
- [ ] Ensure sensitive payment data is never modeled or logged.

### PaymentLinks

- [ ] Add `PaymentLinkResource`, `araute.paymentLinks`.
- [ ] Implement `create`, `list`, `get`, `update`.
- [ ] Model `active`, line items, after-completion behavior, restrictions, and metadata.
- [ ] Verify PATCH idempotency and `active` state transitions.

## P3 — payment execution and billing

### Charges

- [ ] Add `ChargeResource`, `araute.charges`.
- [ ] Implement `list` and `get` for `/charges` and `/charges/{id}`.
- [ ] Model charge status, failure data, refunds, disputes, receipt fields, and payment-intent relation.

### Invoices

- [ ] Add `InvoiceResource`, `araute.invoices`.
- [ ] Implement `create`, `list`, `get`.
- [ ] Implement `addItem`, `finalize`, `pay`, `void`, `markUncollectible`.
- [ ] Model invoice state machine: `DRAFT`, `OPEN`, `PAID`, `VOID`, `UNCOLLECTIBLE`.
- [ ] Model collection method, billing reason, totals, payment intent, hosted URL, PDF, due date, periods, and lines.
- [ ] Encode action-specific inputs and no-input actions correctly.

### InvoiceItems

- [ ] Add `InvoiceItemResource`, `araute.invoiceItems`.
- [ ] Implement `get` and `delete` for `/invoice_items/{id}`.
- [ ] Model invoice attachment, quantity, unit amount, amount, proration, discountable, and metadata.

### Refunds

- [ ] Add `RefundResource`, `araute.refunds`.
- [ ] Implement `create`, `list`, `get`.
- [ ] Model async status: `PENDING`, `SUCCEEDED`, `FAILED`.
- [ ] Preserve `amountRefundable` from RFC 7807 errors.
- [ ] Test idempotency and refund failure codes.

## P4 — platform operations

### WebhookEndpoints

- [ ] Confirm current implementation against secret behavior: secret only on create/rotation.
- [ ] Add explicit docs for `rollSecret`, event names, HTTPS restriction, and delete semantics.
- [ ] Test enabled/disabled status and secret redaction.

### Events

- [ ] Add `EventResource`, `araute.events`.
- [ ] Implement `list`, `get`, `replay` for `/events`, `/events/{id}`, `/events/{id}/replay`.
- [ ] Model event snapshot data safely as typed generic/unknown payload.
- [ ] Model replay delivery status and optional webhook endpoint.

### TaxDocuments

- [ ] Add `TaxDocumentResource`, `araute.taxDocuments`.
- [ ] Implement `list`, `get`, `retry` for `/tax_documents`, `/tax_documents/{id}`, `/tax_documents/{id}/retry`.
- [ ] Model NFS-e status lifecycle and invoice/charge/customer relations.
- [ ] Test `tax_document_not_retryable` behavior.

## P5 — quality, docs, release

- [ ] Add mocked-fetch tests for every OpenAPI operation.
- [ ] Add request-body snapshots proving camelCase to snake_case conversion.
- [ ] Add response snapshots proving snake_case to camelCase and uppercase enum conversion.
- [ ] Test pagination, filters, null values, `204`, RFC 7807 errors, retry headers, and abort signals.
- [ ] Export every public resource model from `src/index.ts`.
- [ ] Add README examples for auth, payments, prices, checkout, subscriptions, invoices, refunds, and webhooks.
- [ ] Document API-to-SDK name mappings, especially `payments` backed by `/payment_intents`.
- [ ] Add generated contract/types workflow or CI drift detection from `openapi.yaml`.
- [ ] Add package metadata, changelog, versioning policy, and CI for `check`, `test`, and `build`.
- [ ] Publish only after all P0 contract items and P1 resource gaps are complete.

## Recommended delivery order

1. P0 contract foundation.
2. Payment attempts and subscription-change lookup.
3. Prices, PaymentMethods, PaymentLinks.
4. Charges, Invoices, InvoiceItems, Refunds.
5. Events and TaxDocuments.
6. Full contract tests, docs, CI, release.
