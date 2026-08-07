import { expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

function resolveOpenApiPath(): string | null {
  const candidates = [
    process.env.OPENAPI_SPEC_PATH,
    // Monorepo layout: araute/sdks/ts/test -> araute/openapi.yaml
    join(import.meta.dir, "../../../openapi.yaml"),
  ].filter((path): path is string => Boolean(path));

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  return null;
}

test("exported SDK paths remain present in OpenAPI", async () => {
  const openapiPath = resolveOpenApiPath();
  // Standalone SDK checkout (e.g. GitHub Actions) does not include the monorepo spec.
  if (!openapiPath) return;

  const openapi = await readFile(openapiPath, "utf8");
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
