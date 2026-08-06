import { describe, expect, test } from "bun:test";
import { Araute } from "../src";

function setup(responseBody: unknown) {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const client = new Araute({
    apiKey: "sk_test_123",
    fetch: async (url, init) => {
      calls.push({ url: String(url), init });
      return new Response(JSON.stringify(responseBody), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    },
  });
  return { calls, client };
}

const invoice = {
  id: "inv_123",
  object: "invoice",
  status: "draft",
  customer: "cus_123",
  currency: "BRL",
  subtotal: 1000,
  total: 1000,
  amount_paid: 0,
  amount_remaining: 1000,
  livemode: false,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

describe("prices", () => {
  test("creates, lists, and gets prices with contract mapping", async () => {
    const { calls, client } = setup({
      id: "price_123",
      object: "price",
      product: "prod_123",
      currency: "BRL",
      unit_amount: 1500,
      active: true,
      recurring: { interval: "month", interval_count: 1 },
      livemode: false,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    });

    const result = await client.prices.create(
      {
        product: "prod_123",
        unitAmount: 1500,
        recurring: { interval: "MONTH", intervalCount: 1 },
      },
      { idempotencyKey: "idem_price" },
    );
    await client.prices.list({ product: "prod_123", type: "RECURRING" });
    await client.prices.get("price_123");

    expect(result.object).toBe("PRICE");
    expect(result.recurring?.interval).toBe("MONTH");
    expect(JSON.parse(String(calls[0]?.init.body))).toEqual({
      product: "prod_123",
      unit_amount: 1500,
      recurring: { interval: "month", interval_count: 1 },
    });
    expect(calls[0]?.url).toBe("https://api.araute.com/v1/prices");
    expect(calls[1]?.url).toBe(
      "https://api.araute.com/v1/prices?product=prod_123&type=recurring",
    );
    expect(calls[2]?.url).toBe("https://api.araute.com/v1/prices/price_123");
    expect(new Headers(calls[0]?.init.headers).get("Idempotency-Key")).toBe("idem_price");
  });
});

describe("checkouts", () => {
  test("maps public methods to payment_method_types", async () => {
    const { calls, client } = setup({
      id: "cs_123",
      object: "checkout_session",
      mode: "payment",
      status: "open",
      payment_status: "unpaid",
      url: "https://checkout.example/cs_123",
      amount_total: 100,
      currency: "BRL",
      success_url: "https://example.com/success",
      livemode: false,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    });

    await client.checkouts.create({
      amount: 100,
      methods: ["PIX", "CARD"],
      successUrl: "https://example.com/success",
    });
    await client.checkouts.expire("cs_123", { idempotencyKey: "idem_expire" });

    expect(JSON.parse(String(calls[0]?.init.body))).toEqual({
      amount: 100,
      payment_method_types: ["pix", "card"],
      success_url: "https://example.com/success",
    });
    expect(calls[1]?.url).toBe("https://api.araute.com/v1/checkout_sessions/cs_123/expire");
    expect(new Headers(calls[1]?.init.headers).get("Idempotency-Key")).toBe("idem_expire");
  });
});

describe("subscriptions", () => {
  test("gets subscription changes from their top-level endpoint", async () => {
    const { calls, client } = setup({
      id: "subch_123",
      object: "subscription_change",
      status: "pending",
      subscription: "sub_123",
    });

    const result = await client.subscriptions.getChange("subch_123");
    expect(result.object).toBe("SUBSCRIPTION_CHANGE");
    expect(calls[0]?.url).toBe("https://api.araute.com/v1/subscription_changes/subch_123");
  });
});

describe("invoices", () => {
  test("covers invoice actions and exact paths", async () => {
    const { calls, client } = setup(invoice);

    await client.invoices.create({ customer: "cus_123" }, { idempotencyKey: "idem_create" });
    await client.invoices.list({ status: "DRAFT" });
    await client.invoices.get("inv_123");
    await client.invoices.addItem("inv_123", { description: "Item", amount: 1000 }, { idempotencyKey: "idem_item" });
    await client.invoices.finalize("inv_123", { idempotencyKey: "idem_finalize" });
    await client.invoices.pay("inv_123", { paymentMethod: "pm_123" }, { idempotencyKey: "idem_pay" });
    await client.invoices.void("inv_123", { idempotencyKey: "idem_void" });
    await client.invoices.markUncollectible("inv_123", { idempotencyKey: "idem_mark" });

    expect(calls.map((call) => [call.init.method, call.url])).toEqual([
      ["POST", "https://api.araute.com/v1/invoices"],
      ["GET", "https://api.araute.com/v1/invoices?status=draft"],
      ["GET", "https://api.araute.com/v1/invoices/inv_123"],
      ["POST", "https://api.araute.com/v1/invoices/inv_123/items"],
      ["POST", "https://api.araute.com/v1/invoices/inv_123/finalize"],
      ["POST", "https://api.araute.com/v1/invoices/inv_123/pay"],
      ["POST", "https://api.araute.com/v1/invoices/inv_123/void"],
      ["POST", "https://api.araute.com/v1/invoices/inv_123/mark_uncollectible"],
    ]);
    expect(JSON.parse(String(calls[5]?.init.body))).toEqual({ payment_method: "pm_123" });
  });
});

describe("refunds", () => {
  test("creates and queries refunds", async () => {
    const { calls, client } = setup({
      id: "re_123",
      object: "refund",
      status: "pending",
      charge: "ch_123",
      payment_intent: "pi_123",
      amount: 100,
      currency: "BRL",
      reason: null,
      failure_reason: null,
      livemode: false,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    });

    const result = await client.refunds.create(
      { charge: "ch_123", reason: "REQUESTED_BY_CUSTOMER" },
      { idempotencyKey: "idem_refund" },
    );
    await client.refunds.list({ paymentIntent: "pi_123" });
    await client.refunds.get("re_123");

    expect(result.status).toBe("PENDING");
    expect(JSON.parse(String(calls[0]?.init.body))).toEqual({
      charge: "ch_123",
      reason: "requested_by_customer",
    });
    expect(calls[1]?.url).toBe("https://api.araute.com/v1/refunds?payment_intent=pi_123");
    expect(calls[2]?.url).toBe("https://api.araute.com/v1/refunds/re_123");
  });
});

test("preserves RFC 7807 fields and Retry-After", async () => {
  const client = new Araute({
    apiKey: "sk_test_123",
    fetch: async () => new Response(JSON.stringify({
      type: "urn:araute:error:refund_amount_exceeds_available",
      title: "Refund amount exceeds available amount",
      status: 422,
      code: "refund_amount_exceeds_available",
      trace_id: "trace_123",
      amount_refundable: 50,
    }), {
      status: 422,
      headers: {
        "content-type": "application/problem+json",
        "retry-after": "3",
      },
    }),
  });

  try {
    await client.refunds.create({ charge: "ch_123", amount: 100 });
    throw new Error("expected ArauteError");
  } catch (error) {
    expect(error).toMatchObject({
      name: "ArauteError",
      status: 422,
      code: "refund_amount_exceeds_available",
      traceId: "trace_123",
      amountRefundable: 50,
      retryAfter: "3",
    });
  }
});

test("handles 204 responses and request options", async () => {
  let receivedSignal: AbortSignal | undefined;
  let receivedHeaders: Headers | undefined;
  const controller = new AbortController();
  const client = new Araute({
    apiKey: "sk_test_123",
    fetch: async (_url, init) => {
      receivedSignal = init.signal;
      receivedHeaders = new Headers(init.headers);
      return new Response(null, { status: 204 });
    },
  });

  const result = await client.invoices.finalize("inv_123", {
    signal: controller.signal,
    headers: { "X-Test": "yes" },
  });

  expect(result).toBeUndefined();
  expect(receivedSignal).toBe(controller.signal);
  expect(receivedHeaders?.get("X-Test")).toBe("yes");
  expect(receivedHeaders?.get("Authorization")).toBe("Bearer sk_test_123");
});

test("covers customer, product, and subscription operation paths", async () => {
  const { calls, client } = setup({
    id: "sub_123",
    object: "subscription",
    status: "active",
    customer: "cus_123",
    items: [],
    livemode: false,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  });

  await client.customers.create({ name: "Ada" });
  await client.customers.list({ limit: 10, startingAfter: "cus_000" });
  await client.customers.get("cus_123");
  await client.customers.update("cus_123", { name: "Ada Lovelace" });
  await client.products.create({ name: "Plan" });
  await client.products.list({ active: true });
  await client.products.get("prod_123");
  await client.subscriptions.create({ customer: "cus_123", items: [{ price: "price_123" }] });
  await client.subscriptions.list({ customer: "cus_123" });
  await client.subscriptions.get("sub_123");
  await client.subscriptions.update("sub_123", { cancelAtPeriodEnd: true });
  await client.subscriptions.createChange("sub_123", { effectiveAt: "NOW" });
  await client.subscriptions.listChanges("sub_123");
  await client.subscriptions.previewChange("sub_123", { prorationDate: "2026-01-01T00:00:00Z" });
  await client.subscriptions.cancel("sub_123");
  await client.subscriptions.pause("sub_123");
  await client.subscriptions.resume("sub_123");

  expect(calls.map((call) => call.url)).toEqual([
    "https://api.araute.com/v1/customers",
    "https://api.araute.com/v1/customers?limit=10&starting_after=cus_000",
    "https://api.araute.com/v1/customers/cus_123",
    "https://api.araute.com/v1/customers/cus_123",
    "https://api.araute.com/v1/products",
    "https://api.araute.com/v1/products?active=true",
    "https://api.araute.com/v1/products/prod_123",
    "https://api.araute.com/v1/subscriptions",
    "https://api.araute.com/v1/subscriptions?customer=cus_123",
    "https://api.araute.com/v1/subscriptions/sub_123",
    "https://api.araute.com/v1/subscriptions/sub_123",
    "https://api.araute.com/v1/subscriptions/sub_123/changes",
    "https://api.araute.com/v1/subscriptions/sub_123/changes",
    "https://api.araute.com/v1/subscriptions/sub_123/preview_change",
    "https://api.araute.com/v1/subscriptions/sub_123/cancel",
    "https://api.araute.com/v1/subscriptions/sub_123/pause",
    "https://api.araute.com/v1/subscriptions/sub_123/resume",
  ]);
});
