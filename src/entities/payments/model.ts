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

/** Payment methods accepted by the SDK. */
export type PaymentMethodType = "PIX" | "CARD";

/** Normalized next action required to complete a payment. */
export type PaymentNextAction = {
  type: "pix_display_qr_code" | "redirect_to_url";
  pixDisplayQrCode?: {
    data?: string;
    imageUrl?: string;
    expiresAt?: string;
  };
  redirectToUrl?: {
    url?: string;
  };
} | null;

/** Normalized payment failure details. */
export type PaymentError = {
  code?: string;
  declineCode?: string;
  message?: string;
} | null;

/** Payment returned by the Araute Payment Intent API. */
export type Payment = {
  id: string;
  object: "payment_intent";
  status: PaymentStatus;
  amount: number;
  amountReceived?: number;
  currency: "BRL";
  customer?: string | null;
  methods: PaymentMethodType[];
  nextAction?: PaymentNextAction;
  latestCharge?: string | null;
  lastPaymentError?: PaymentError;
  cancellationReason?: string | null;
  checkoutSession?: string | null;
  invoice?: string | null;
  description?: string | null;
  metadata?: Metadata;
  livemode: boolean;
  createdAt: string;
  updatedAt: string;
};

/** Request body for `payments.create(...)`. */
export type PaymentCreate = {
  amount: number;
  currency?: "BRL";
  methods: PaymentMethodType[];
  customer?: string;
  description?: string;
  metadata?: Metadata;
};

/** Request body for `payments.confirm(...)`. */
export type PaymentConfirm = {
  paymentMethod?: string;
  paymentMethodData?: {
    type?: PaymentMethodType;
  };
  returnUrl?: string;
};

/** Request body for `payments.cancel(...)`. */
export type PaymentCancel = {
  cancellationReason?:
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
