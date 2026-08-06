import { describe, expect, test } from "bun:test";
import { Araute } from "../src/index";

const payment = {
  object: "payment_intent",
  id: "pi_123",
  status: "requires_confirmation",
  amount: 100,
  currency: "BRL",
  payment_method_types: ["pix"],
  livemode: false,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

function clientWithCalls(responseBody: unknown = payment) {
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

describe("payments", () => {
  test("creates a payment intent with idempotency", async () => {
    const { calls, client } = clientWithCalls();

    await client.payments.create(
      { amount: 100, methods: ["PIX"] },
      { idempotencyKey: "idem_123" },
    );

    expect(calls[0]?.url).toBe(
      "https://api.araute.com/v1/payment_intents",
    );
    expect(calls[0]?.init.method).toBe("POST");
    expect(
      new Headers(calls[0]?.init.headers).get("Idempotency-Key"),
    ).toBe("idem_123");
    expect(JSON.parse(String(calls[0]?.init.body))).toEqual({
      amount: 100,
      payment_method_types: ["pix"],
    });
  });

  test("lists payments with filters", async () => {
    const { calls, client } = clientWithCalls({
      object: "list",
      data: [payment],
      has_more: false,
    });

    await client.payments.list({ customer: "cus_123", status: "succeeded" });

    expect(calls[0]?.url).toBe(
      "https://api.araute.com/v1/payment_intents?customer=cus_123&status=succeeded",
    );
  });

  test("confirms and cancels a payment", async () => {
    const { calls, client } = clientWithCalls();

    await client.payments.confirm("pi_123", {
      paymentMethodData: { type: "PIX" },
    });
    await client.payments.cancel("pi_123", {
      cancellationReason: "abandoned",
    });

    expect(calls.map((call) => [call.init.method, call.url])).toEqual([
      ["POST", "https://api.araute.com/v1/payment_intents/pi_123/confirm"],
      ["POST", "https://api.araute.com/v1/payment_intents/pi_123/cancel"],
    ]);

    expect(JSON.parse(String(calls[0]?.init.body))).toEqual({
      payment_method_data: { type: "pix" },
    });
  });
});
