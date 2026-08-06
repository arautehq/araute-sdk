import type { ListQuery, Metadata } from "../../common/types";

/** Payment lifecycle status returned by the Payment Intent API. */
export type PaymentStatus =
  | "requires_payment_method"
  | "requires_confirmation"
  | "requires_action"
  | "processing"
  | "succeeded"
  | "cancelled"
  | "expired";

/** Payment methods accepted when creating a payment. */
export type PaymentMethodType = "pix" | "card";

/** Normalized next action required to complete a payment. */
export type PaymentNextAction = {
  type: "pix_display_qr_code" | "redirect_to_url";
  pix_display_qr_code?: {
    data?: string;
    image_url?: string;
    expires_at?: string;
  };
  redirect_to_url?: {
    url?: string;
  };
} | null;

/** Normalized payment failure details. */
export type PaymentError = {
  code?: string;
  decline_code?: string;
  message?: string;
} | null;

/** Payment returned by the Araute Payment Intent API. */
export type Payment = {
  id: string;
  object: "payment_intent";
  status: PaymentStatus;
  amount: number;
  amount_received?: number;
  currency: "BRL";
  customer?: string | null;
  payment_method_types: PaymentMethodType[];
  next_action?: PaymentNextAction;
  latest_charge?: string | null;
  last_payment_error?: PaymentError;
  cancellation_reason?: string | null;
  checkout_session?: string | null;
  invoice?: string | null;
  description?: string | null;
  metadata?: Metadata;
  livemode: boolean;
  created_at: string;
  updated_at: string;
};

/** Request body for `payments.create(...)`. */
export type PaymentCreate = {
  amount: number;
  currency?: "BRL";
  payment_method_types: PaymentMethodType[];
  customer?: string;
  description?: string;
  metadata?: Metadata;
};

/** Request body for `payments.confirm(...)`. */
export type PaymentConfirm = {
  payment_method?: string;
  payment_method_data?: {
    type?: PaymentMethodType;
  };
  return_url?: string;
};

/** Request body for `payments.cancel(...)`. */
export type PaymentCancel = {
  cancellation_reason?:
    | "duplicate"
    | "fraudulent"
    | "requested_by_customer"
    | "abandoned";
};

/** Supported query parameters for `payments.list(...)`. */
export type PaymentListQuery = ListQuery & {
  customer?: string;
  status?: PaymentStatus;
};
