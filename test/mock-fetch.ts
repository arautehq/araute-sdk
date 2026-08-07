/** Install a temporary global fetch mock for the duration of `run`. */
export async function withMockFetch<T>(
  mock: typeof fetch,
  run: () => Promise<T>,
): Promise<T> {
  const previous = globalThis.fetch;
  globalThis.fetch = mock;
  try {
    return await run();
  } finally {
    globalThis.fetch = previous;
  }
}

export type FetchCall = { url: string; init: RequestInit };

/** Mock fetch that records calls and returns a fixed JSON body. */
export function recordingFetch(
  responseBody: unknown,
  status = 200,
  headers: Record<string, string> = { "content-type": "application/json" },
): { calls: FetchCall[]; fetch: typeof fetch } {
  const calls: FetchCall[] = [];
  return {
    calls,
    fetch: async (url, init) => {
      calls.push({ url: String(url), init: init ?? {} });
      return new Response(JSON.stringify(responseBody), { status, headers });
    },
  };
}
