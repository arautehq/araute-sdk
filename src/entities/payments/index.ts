import { ArauteHttpClient } from "../../common/http";
import { CrudResource } from "../../common/resource";
import type { ListQuery, ListResponse, RequestOptions } from "../../common/types";
import type {
  Payment,
  PaymentCancel,
  PaymentConfirm,
  PaymentCreate,
  PaymentListQuery,
} from "./model";

type QueryParams = Record<string, string | number | boolean | undefined>;

/** Payments facade backed by Araute Payment Intents. */
export class PaymentResource extends CrudResource<
  Payment,
  PaymentCreate,
  never,
  PaymentListQuery
> {
  constructor(http: ArauteHttpClient) {
    super(http, "/payment_intents");
  }

  confirm(id: string, input?: PaymentConfirm, options?: RequestOptions) {
    return this.http.post<Payment>(
      `${this.path}/${id}/confirm`,
      input,
      options,
    );
  }

  cancel(id: string, input?: PaymentCancel, options?: RequestOptions) {
    return this.http.post<Payment>(
      `${this.path}/${id}/cancel`,
      input,
      options,
    );
  }

  override list(query?: PaymentListQuery, options?: RequestOptions) {
    return this.http.get<ListResponse<Payment>>(
      this.path,
      query as QueryParams | undefined,
      options,
    );
  }
}

export type {
  Payment,
  PaymentCancel,
  PaymentConfirm,
  PaymentCreate,
  PaymentError,
  PaymentListQuery,
  PaymentMethodType,
  PaymentNextAction,
  PaymentStatus,
} from "./model";
