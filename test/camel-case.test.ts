import { expect, test } from "bun:test";
import { Araute } from "../src/index";
import { withMockFetch } from "./mock-fetch";

test("uses camelCase at the SDK boundary", async () => {
  let requestBody = "";

  await withMockFetch(async (_url, init) => {
    requestBody = String(init?.body);
    return new Response(JSON.stringify({
      id: "cus_123",
      object: "customer",
      tax_id: "123",
      address: { postal_code: "01000-000" },
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
      balance: 0,
      delinquent: false,
      livemode: false,
    }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }, async () => {
    const client = new Araute({ apiKey: "sk_test_123" });

    const customer = await client.customers.create({
      taxId: "123",
      address: { postalCode: "01000-000" },
    });

    expect(JSON.parse(requestBody)).toEqual({
      tax_id: "123",
      address: { postal_code: "01000-000" },
    });
    expect(customer.taxId).toBe("123");
    expect(customer.address?.postalCode).toBe("01000-000");
    expect(customer.createdAt).toBe("2026-01-01T00:00:00Z");
  });
});
