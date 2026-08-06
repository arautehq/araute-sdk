import { expect, test } from "bun:test";
import { readFile } from "node:fs/promises";

test("exported SDK paths remain present in OpenAPI", async () => {
  const openapi = await readFile("/home/albqvxc/www/opensource/araute/openapi.yaml", "utf8");
  const paths = [
    "/prices:", "/checkout_sessions:", "/payment_intents:",
    "/subscriptions:", "/subscription_changes/{id}:", "/invoices:",
    "/refunds:",
  ];
  for (const path of paths) expect(openapi).toContain(`  ${path}`);
});
