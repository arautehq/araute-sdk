import { describe, expect, test } from "bun:test";
import { Araute } from "../src/index";
import { recordingFetch, withMockFetch } from "./mock-fetch";

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

describe("payments", () => {
  test("creates a payment intent with idempotency", async () => {
    const { calls, fetch } = recordingFetch(payment);

    await withMockFetch(fetch, async () => {
      const client = new Araute({ apiKey: "sk_test_123" });

      const result = await client.payments.create(
        { amount: 100, methods: ["PIX"] },
        { idempotencyKey: "idem_123" },
      );

      expect(result.methods).toEqual(["PIX"]);
      expect(result.status).toBe("REQUIRES_CONFIRMATION");
      expect(result.object).toBe("PAYMENT_INTENT");

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
  });

  test("lists payments with filters", async () => {
    const { calls, fetch } = recordingFetch({
      object: "list",
      data: [payment],
      has_more: false,
    });

    await withMockFetch(fetch, async () => {
      const client = new Araute({ apiKey: "sk_test_123" });
      await client.payments.list({ customer: "cus_123", status: "succeeded" });

      expect(calls[0]?.url).toBe(
        "https://api.araute.com/v1/payment_intents?customer=cus_123&status=succeeded",
      );
    });
  });

  test("confirms and cancels a payment", async () => {
    const { calls, fetch } = recordingFetch(payment);

    await withMockFetch(fetch, async () => {
      const client = new Araute({ apiKey: "sk_test_123" });

      await client.payments.confirm("pi_123", {
        paymentMethodData: { type: "PIX" },
      });
      await client.payments.cancel("pi_123", {
        cancellationReason: "ABANDONED",
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
});
