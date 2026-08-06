const snakeToCamel = (key: string) =>
  key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());

const camelToSnake = (key: string) =>
  key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

function mapKeys(
  value: unknown,
  mapKey: (key: string) => string,
  mapValue: (value: unknown) => unknown = (item) => item,
): unknown {
  if (Array.isArray(value)) return value.map((item) => mapKeys(item, mapKey, mapValue));
  if (value === null || typeof value !== "object") return mapValue(value);

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      mapKey(key),
      mapKeys(item, mapKey, mapValue),
    ]),
  );
}

export function toCamelCase<T>(value: unknown): T {
  return mapKeys(value, snakeToCamel, toPublicEnum) as T;
}

export function toSnakeCase<T>(value: unknown): T {
  return mapKeys(value, camelToSnake, toWireEnum) as T;
}

const ENUM_VALUES = new Set([
  "abandoned", "active", "applied", "cancel", "cancelled", "card",
  "charge_automatically", "charge_now", "complete", "create_invoice",
  "credit", "customer", "disabled", "duplicate", "enabled", "expired",
  "fraud", "fraudulent", "incomplete", "keep", "list", "no_payment_required",
  "none", "now", "open", "paid", "past_due", "pause", "paused", "payment",
  "payment_failed", "payment_failure", "payment_intent", "pix",
  "pix_display_qr_code", "pix_manual", "processing", "redirect_to_url",
  "requested_by_customer", "requires_action", "requires_confirmation",
  "requires_payment_method", "revoke", "send_invoice", "subscription",
  "subscription_change", "subscription_change_preview", "subscription_item",
  "succeeded", "trialing", "unpaid", "webhook_endpoint", "product",
  "checkout_session",
]);

export function toWireEnum(value: unknown): unknown {
  if (typeof value !== "string") return value;
  const normalized = value.toLowerCase();
  return ENUM_VALUES.has(normalized) ? normalized : value;
}

function toPublicEnum(value: unknown): unknown {
  if (typeof value !== "string") return value;
  return ENUM_VALUES.has(value) ? value.toUpperCase() : value;
}
