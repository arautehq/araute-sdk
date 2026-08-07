import { expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

function resolveOpenApiPath(): string {
  const candidates = [
    process.env.OPENAPI_SPEC_PATH,
    // Vendored snapshot checked into this package (used by CI).
    join(import.meta.dir, "../openapi.yaml"),
    // Monorepo layout: araute/sdks/ts/test -> araute/openapi.yaml
    join(import.meta.dir, "../../../openapi.yaml"),
  ].filter((path): path is string => Boolean(path));

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  throw new Error(
    `openapi.yaml not found. Set OPENAPI_SPEC_PATH or place openapi.yaml at the package root. Tried: ${candidates.join(", ")}`,
  );
}

test("exported SDK paths remain present in OpenAPI", async () => {
  const openapi = await readFile(resolveOpenApiPath(), "utf8");
  const paths = [
    "/prices:",
    "/checkout_sessions:",
    "/payment_intents:",
    "/subscriptions:",
    "/subscription_changes/{id}:",
    "/invoices:",
    "/refunds:",
  ];
  for (const path of paths) expect(openapi).toContain(`  ${path}`);
});
