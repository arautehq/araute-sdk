import { ArauteError, ArauteTransportError } from "./errors";
import { toCamelCase, toSnakeCase, toWireEnum } from "./case";
import type { ArauteConfig, Problem, RequestOptions } from "./types";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

const DEFAULT_BASE_URL = "https://api.araute.com/v1";

export class ArauteHttpClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly userAgent: string;

  constructor(config: ArauteConfig) {
    if (!config.apiKey) {
      throw new Error("Araute apiKey is required.");
    }

    if (typeof globalThis.fetch !== "function") {
      throw new Error("Global fetch is unavailable.");
    }

    this.apiKey = config.apiKey;
    this.baseUrl = DEFAULT_BASE_URL;
    this.userAgent = "araute-sdk/0.1.0";
  }

  get<T>(
    path: string,
    query?: Record<string, string | number | boolean | undefined>,
    options?: RequestOptions,
  ) {
    return this.request<T>("GET", path, query, undefined, options);
  }

  post<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ) {
    return this.request<T>("POST", path, undefined, body, options);
  }

  patch<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ) {
    return this.request<T>("PATCH", path, undefined, body, options);
  }

  delete<T>(path: string, options?: RequestOptions) {
    return this.request<T>("DELETE", path, undefined, undefined, options);
  }

  private async request<T>(
    method: HttpMethod,
    path: string,
    query?: Record<string, string | number | boolean | undefined>,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
          url.searchParams.set(camelToSnakeQueryKey(key), String(toWireEnum(value)));
        }
      }
    }

    const headers = new Headers(options?.headers);
    headers.set("Authorization", `Bearer ${this.apiKey}`);
    headers.set("Accept", "application/json, application/problem+json");
    headers.set("User-Agent", this.userAgent);

    if (body !== undefined) {
      headers.set("Content-Type", "application/json");
    }

    if ((method === "POST" || method === "PATCH") && options?.idempotencyKey) {
      headers.set("Idempotency-Key", options.idempotencyKey);
    }

    const init: RequestInit = {
      method,
      headers,
    };

    if (body !== undefined) {
      init.body = JSON.stringify(toSnakeCase(body));
    }

    if (options?.signal) {
      init.signal = options.signal;
    }

    const response = await globalThis.fetch(url, init);

    if (response.status === 204) {
      return undefined as T;
    }

    const contentType = response.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");
    const isProblem = contentType.includes("application/problem+json");

    if (response.ok) {
      if (!isJson) {
        const text = await response.text();
        throw new ArauteTransportError(
          `Expected JSON response for ${method} ${path}.`,
          response.status,
          text,
        );
      }

      return toCamelCase<T>(await response.json());
    }

    if (isProblem) {
      const problem = toCamelCase<Problem>(await response.json());
      throw new ArauteError(problem, response.headers.get("Retry-After"));
    }

    const text = await response.text();
    throw new ArauteTransportError(
      `Unexpected response for ${method} ${path}.`,
      response.status,
      text,
    );
  }
}

function camelToSnakeQueryKey(key: string) {
  return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
