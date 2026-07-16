import { ArauteHttpClient } from "../../common/http";
import { CrudResource } from "../../common/resource";
import type { ListQuery, Metadata, RequestOptions } from "../../common/types";

/** Supported checkout session modes. */
export type CheckoutSessionMode = "payment" | "subscription";

/** Lifecycle status for a checkout session. */
export type CheckoutSessionStatus = "open" | "complete" | "expired";

/** Derived payment status exposed by checkout sessions. */
export type CheckoutSessionPaymentStatus =
  | "unpaid"
  | "paid"
  | "no_payment_required";

/** Supported payment method types for checkout session creation. */
export type CheckoutSessionPaymentMethodType = "pix" | "card";

/** Line item payload used by `checkouts.create(...)`. */
export type CheckoutSessionCreateLineItem = {
  price: string;
  quantity: number;
};

/** Checkout session resource returned by the Araute API. */
export type CheckoutSession = {
  id: string;
  object: "checkout_session";
  mode: CheckoutSessionMode;
  status: CheckoutSessionStatus;
  payment_status: CheckoutSessionPaymentStatus;
  url: string;
  amount_total: number;
  currency: "BRL";
  payment_intent?: string | null;
  payment_link?: string | null;
  success_url: string;
  cancel_url?: string | null;
  expires_at?: string | null;
  customer?: string | null;
  metadata?: Metadata;
  livemode: boolean;
  created_at: string;
  updated_at: string;
};

type CheckoutSessionCreateBase = {
  mode?: CheckoutSessionMode;
  payment_method_types?: CheckoutSessionPaymentMethodType[];
  success_url: string;
  cancel_url?: string;
  expires_at?: string;
  customer?: string;
  customer_email?: string;
  customer_name?: string;
  customer_tax_id?: string;
  locale?: string;
  metadata?: Metadata;
};

type CheckoutSessionCreateWithLineItems = CheckoutSessionCreateBase & {
  line_items: CheckoutSessionCreateLineItem[];
  amount?: never;
  currency?: never;
};

type CheckoutSessionCreateWithAmount = CheckoutSessionCreateBase & {
  amount: number;
  currency?: "BRL";
  line_items?: never;
};

type CheckoutSessionCreateWithDeferredMode = CheckoutSessionCreateBase & {
  line_items?: undefined;
  amount?: undefined;
  currency?: undefined;
};

/** Request body for `checkouts.create(...)`. */
export type CheckoutSessionCreate =
  | CheckoutSessionCreateWithLineItems
  | CheckoutSessionCreateWithAmount
  | CheckoutSessionCreateWithDeferredMode;

/** Supported query parameters for `checkouts.list(...)`. */
export type CheckoutSessionListQuery = ListQuery & {
  status?: CheckoutSessionStatus;
  payment_link?: string;
  customer?: string;
};

export class CheckoutResource extends CrudResource<
  CheckoutSession,
  CheckoutSessionCreate,
  never,
  CheckoutSessionListQuery
> {
  constructor(http: ArauteHttpClient) {
    super(http, "/checkout_sessions");
  }

  expire(id: string, options?: RequestOptions) {
    return this.http.post<CheckoutSession>(
      `${this.path}/${id}/expire`,
      {},
      options,
    );
  }
}
