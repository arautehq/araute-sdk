import { ArauteHttpClient } from "../../common/http";
import { CrudResource } from "../../common/resource";
import type { Refund, RefundCreate, RefundListQuery } from "./model";

export class RefundResource extends CrudResource<Refund, RefundCreate, never, RefundListQuery> {
  constructor(http: ArauteHttpClient) {
    super(http, "/refunds");
  }
}

export type { Refund, RefundCreate, RefundListQuery, RefundReason, RefundStatus } from "./model";
