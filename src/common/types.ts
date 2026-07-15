/** Free-form key-value metadata attached to Araute resources. */
export type Metadata = Record<string, string>;

/** Postal address fields used by supported resources. */
export type Address = {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: "BR";
} | null;

/** Shared keyset pagination query parameters. */
export type ListQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
};

/** Standard list envelope returned by Araute collection endpoints. */
export type ListResponse<T> = {
  object: "list";
  url: string;
  data: T[];
  has_more: boolean;
  next_cursor: string | null;
};

/** Field-level validation detail returned in RFC 7807 errors. */
export type ProblemFieldError = {
  param: string;
  code: string;
  message: string;
};

/** Araute RFC 7807 error payload shape. */
export type Problem = {
  type: string;
  title: string;
  status: number;
  detail?: string | null | undefined;
  code: string;
  param?: string | null | undefined;
  trace_id?: string | undefined;
  errors?: ProblemFieldError[] | undefined;
  amount_refundable?: number | undefined;
};

/** Deleted resource envelope returned by delete endpoints. */
export type DeletedResource = {
  id: string;
  object: string;
  deleted: true;
};

/** Per-request transport options accepted by SDK methods. */
export type RequestOptions = {
  /** Idempotency key sent on supported `POST` operations. */
  idempotencyKey?: string | undefined;

  /** Abort signal forwarded to `fetch`. */
  signal?: AbortSignal | undefined;

  /** Additional HTTP headers merged into the request. */
  headers?: Record<string, string> | undefined;
};

/** Configuration used to create a new {@link Araute} client. */
export type ArauteConfig = {
  /** Secret API key used for bearer authentication. */
  apiKey: string;

  /** Override for the API base URL. Defaults to `https://api.araute.com/v1`. */
  baseUrl?: string;

  /** Custom fetch implementation, useful for tests and non-default runtimes. */
  fetch?: typeof fetch;

  /** Extra user agent suffix appended to the SDK user agent. */
  userAgent?: string;
};
