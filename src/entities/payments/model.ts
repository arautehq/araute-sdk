import type { ListQuery, Metadata } from "../../common/types";

/** Payment lifecycle status returned by the Payment Intent API. */
export type PaymentStatus =
  | "REQUIRES_PAYMENT_METHOD"
  | "REQUIRES_CONFIRMATION"
  | "REQUIRES_ACTION"
  | "PROCESSING"
  | "SUCCEEDED"
  | "CANCELLED"
  | "EXPIRED";

/** Payment methods accepted by the SDK. */
export type PaymentMethodType = "PIX" | "CARD";

/** Normalized next action required to complete a payment. */
export type PaymentNextAction = {
  type: "PIX_DISPLAY_QR_CODE" | "REDIRECT_TO_URL";
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
  object: "PAYMENT_INTENT";
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
    | "DUPLICATE"
    | "FRAUDULENT"
    | "REQUESTED_BY_CUSTOMER"
    | "ABANDONED";
};

/** Supported query parameters for `payments.list(...)`. */
export type PaymentListQuery = ListQuery & {
  customer?: string;
  status?: PaymentStatus;
};
