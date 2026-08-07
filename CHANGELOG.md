# Changelog

## Unreleased

- **Breaking:** remove `baseUrl`, `userAgent`, and `fetch` from client config. The SDK always uses `https://api.araute.com/v1`, a fixed user agent, and the runtime global `fetch`.

## 0.1.0 — 2026-08-07

Initial public release of `@araute/sdk`.

- Typed resource clients for customers, products, prices, checkouts, payments, subscriptions, invoices, and refunds
- camelCase at the SDK boundary with snake_case wire conversion
- Keyset pagination, idempotency keys, retries, and abort signals
- `ArauteError` / `ArauteTransportError` for API and transport failures

