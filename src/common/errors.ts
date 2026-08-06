import type { Problem } from "./types";

/** Error thrown when the Araute API returns an RFC 7807 problem response. */
export class ArauteError extends Error {
  readonly status: number;
  readonly type: string;
  readonly code: string;
  readonly detail: string | null | undefined;
  readonly param: string | null | undefined;
  readonly traceId: string | undefined;
  readonly errors: Problem["errors"];
  readonly amountRefundable: number | undefined;

  constructor(problem: Problem) {
    super(problem.title);
    this.name = "ArauteError";
    this.status = problem.status;
    this.type = problem.type;
    this.code = problem.code;
    this.detail = problem.detail;
    this.param = problem.param;
    this.traceId = problem.traceId;
    this.errors = problem.errors;
    this.amountRefundable = problem.amountRefundable;
  }
}

/** Error thrown for unexpected non-problem transport failures. */
export class ArauteTransportError extends Error {
  readonly status: number;
  readonly responseText: string;

  constructor(message: string, status: number, responseText: string) {
    super(message);
    this.name = "ArauteTransportError";
    this.status = status;
    this.responseText = responseText;
  }
}
