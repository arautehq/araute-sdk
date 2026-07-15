import { ArauteError, ArauteTransportError } from "./errors";
import type { ArauteConfig, Problem, RequestOptions } from "./types";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

const DEFAULT_BASE_URL = "https://api.araute.com/v1";

export class ArauteHttpClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private readonly userAgent: string;

  constructor(config: ArauteConfig) {
    if (!config.apiKey) {
      throw new Error("Araute apiKey is required.");
    }

    if (typeof fetch !== "function" && !config.fetch) {
      throw new Error("Global fetch is unavailable. Provide config.fetch.");
    }

    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.fetchImpl = config.fetch ?? fetch;
    this.userAgent = config.userAgent
      ? `araute-sdk/0.1.0 ${config.userAgent}`
      : "araute-sdk/0.1.0";
  }

  get<T>(path: string, query?: Record<string, string | number | undefined>, options?: RequestOptions) {
    return this.request<T>("GET", path, query, undefined, options);
  }

  post<T>(
    path: string,
    body?: JsonValue | undefined,
    options?: RequestOptions,
  ) {
    return this.request<T>("POST", path, undefined, body, options);
  }

  patch<T>(
    path: string,
    body?: JsonValue | undefined,
    options?: Omit<RequestOptions, "idempotencyKey">,
  ) {
    return this.request<T>("PATCH", path, undefined, body, options);
  }

  delete<T>(path: string, options?: RequestOptions) {
    return this.request<T>("DELETE", path, undefined, undefined, options);
  }

  private async request<T>(
    method: HttpMethod,
    path: string,
    query?: Record<string, string | number | undefined>,
    body?: JsonValue | undefined,
    options?: RequestOptions,
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
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

    if (method === "POST" && options?.idempotencyKey) {
      headers.set("Idempotency-Key", options.idempotencyKey);
    }

    const init: RequestInit = {
      method,
      headers,
    };

    if (body !== undefined) {
      init.body = JSON.stringify(body);
    }

    if (options?.signal) {
      init.signal = options.signal;
    }

    const response = await this.fetchImpl(url, init);

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

      return (await response.json()) as T;
    }

    if (isProblem) {
      const problem = (await response.json()) as Problem;
      throw new ArauteError(problem);
    }

    const text = await response.text();
    throw new ArauteTransportError(
      `Unexpected response for ${method} ${path}.`,
      response.status,
      text,
    );
  }
}
