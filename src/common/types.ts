export type Metadata = Record<string, string>;

export type Address = {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: "BR";
} | null;

export type ListQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
};

export type ListResponse<T> = {
  object: "list";
  url: string;
  data: T[];
  has_more: boolean;
  next_cursor: string | null;
};

export type ProblemFieldError = {
  param: string;
  code: string;
  message: string;
};

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

export type DeletedResource = {
  id: string;
  object: string;
  deleted: true;
};

export type RequestOptions = {
  idempotencyKey?: string | undefined;
  signal?: AbortSignal | undefined;
  headers?: Record<string, string> | undefined;
};

export type ArauteConfig = {
  apiKey: string;
  baseUrl?: string;
  fetch?: typeof fetch;
  userAgent?: string;
};
