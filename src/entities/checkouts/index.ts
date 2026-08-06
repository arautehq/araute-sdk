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
  paymentStatus: CheckoutSessionPaymentStatus;
  url: string;
  amountTotal: number;
  currency: "BRL";
  paymentIntent?: string | null;
  paymentLink?: string | null;
  successUrl: string;
  cancelUrl?: string | null;
  expiresAt?: string | null;
  customer?: string | null;
  metadata?: Metadata;
  livemode: boolean;
  createdAt: string;
  updatedAt: string;
};

type CheckoutSessionCreateBase = {
  mode?: CheckoutSessionMode;
  methods?: CheckoutSessionPaymentMethodType[];
  successUrl: string;
  cancelUrl?: string;
  expiresAt?: string;
  customer?: string;
  customerEmail?: string;
  customerName?: string;
  customerTaxId?: string;
  locale?: string;
  metadata?: Metadata;
};

type CheckoutSessionCreateWithLineItems = CheckoutSessionCreateBase & {
  lineItems: CheckoutSessionCreateLineItem[];
  amount?: never;
  currency?: never;
};

type CheckoutSessionCreateWithAmount = CheckoutSessionCreateBase & {
  amount: number;
  currency?: "BRL";
  lineItems?: never;
};

type CheckoutSessionCreateWithDeferredMode = CheckoutSessionCreateBase & {
  lineItems?: undefined;
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
  paymentLink?: string;
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
