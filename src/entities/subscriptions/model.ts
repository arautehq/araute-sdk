import type { ListQuery, Metadata } from "../../common/types";

export type SubscriptionStatus =
  | "incomplete"
  | "active"
  | "trialing"
  | "past_due"
  | "unpaid"
  | "paused"
  | "cancelled";

export type SubscriptionCollectionMethod =
  | "charge_automatically"
  | "send_invoice";

export type SubscriptionPaymentMethodType = "card" | "pix_manual";

export type SubscriptionTrialEndBehavior =
  | "cancel"
  | "pause"
  | "create_invoice";

export type SubscriptionProrationPolicy =
  | "charge_now"
  | "next_cycle"
  | "credit"
  | "none";

export type SubscriptionChangeStatus =
  | "pending"
  | "applied"
  | "payment_failed"
  | "expired"
  | "cancelled";

export type SubscriptionChangeDiff = Record<string, unknown>;

export type CancellationReason =
  | "requested_by_customer"
  | "payment_failure"
  | "fraud"
  | "other";

/** Subscription item attached to a subscription. */
export type SubscriptionItem = {
  id: string;
  object: "subscription_item";
  price: string;
  quantity: number;
  current_period_start: string;
  current_period_end: string;
  metadata?: Metadata;
};

/** Cancellation metadata returned by subscription resources. */
export type CancellationDetails = {
  reason?: CancellationReason;
  feedback?: string;
} | null;

/** Proration line used by change and preview responses. */
export type ProrationLine = {
  description?: string;
  amount?: number;
  proration?: boolean;
};

/** Subscription change resource returned by the Araute API. */
export type SubscriptionChange = {
  id: string;
  object: "subscription_change";
  status: SubscriptionChangeStatus;
  subscription: string;
  proration_policy?: SubscriptionProrationPolicy;
  proration_amount?: number;
  proration_lines?: ProrationLine[];
  diff?: SubscriptionChangeDiff | null;
  invoice?: string | null;
  payment_intent?: string | null;
  effective_at?: string | null;
  applied_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

/** Subscription resource returned by the Araute API. */
export type Subscription = {
  id: string;
  object: "subscription";
  status: SubscriptionStatus;
  customer: string;
  collection_method: SubscriptionCollectionMethod;
  payment_method_type?: SubscriptionPaymentMethodType | null;
  default_payment_method?: string | null;
  items: SubscriptionItem[];
  billing_cycle_anchor?: string | null;
  trial_start?: string | null;
  trial_end?: string | null;
  trial_end_behavior?: SubscriptionTrialEndBehavior | null;
  cancel_at_period_end?: boolean;
  cancel_at?: string | null;
  cancelled_at?: string | null;
  cancellation_details?: CancellationDetails;
  grace_period_days?: number;
  latest_invoice?: string | null;
  pending_change?: SubscriptionChange | null;
  latest_change?: string | null;
  pix_mandate?: string | null;
  metadata?: Metadata;
  livemode: boolean;
  created_at: string;
  updated_at: string;
};

/** Item payload used by `subscriptions.create(...)`. */
export type SubscriptionCreateItem = {
  price: string;
  quantity?: number;
};

/** Request body for `subscriptions.create(...)`. */
export type SubscriptionCreate = {
  customer: string;
  items: SubscriptionCreateItem[];
  payment_method?: string;
  payment_method_type?: "pix_manual";
  collection_method?: SubscriptionCollectionMethod;
  trial_period_days?: number;
  trial_end?: string;
  trial_end_behavior?: SubscriptionTrialEndBehavior;
  billing_cycle_anchor?: "now" | string;
  proration_policy?: SubscriptionProrationPolicy;
  grace_period_days?: number;
  cancel_at_period_end?: boolean;
  metadata?: Metadata;
};

/** Item payload used by subscription change operations. */
export type SubscriptionItemUpdate = {
  id: string;
  price?: string;
  quantity?: number;
};

/** Invoice item appended during subscription changes. */
export type AddInvoiceItem = {
  description: string;
  amount: number;
  quantity?: number;
};

/** Request body for `subscriptions.update(...)`. */
export type SubscriptionUpdate = {
  items?: SubscriptionItemUpdate[];
  add_invoice_items?: AddInvoiceItem[];
  billing_cycle_anchor?: "now" | string;
  payment_method?: string;
  proration_policy?: SubscriptionProrationPolicy;
  proration_date?: string;
  cancel_at_period_end?: boolean;
  metadata?: Metadata;
};

/** Request body for `subscriptions.createChange(...)`. */
export type SubscriptionChangeCreate = {
  items?: SubscriptionItemUpdate[];
  add_invoice_items?: AddInvoiceItem[];
  billing_cycle_anchor?: "now" | string;
  payment_method?: string;
  proration_policy?: SubscriptionProrationPolicy;
  proration_date?: string;
  effective_at?: "now" | string;
  metadata?: Metadata;
};

/** Request body for `subscriptions.previewChange(...)`. */
export type SubscriptionChangePreviewRequest = {
  items?: SubscriptionItemUpdate[];
  add_invoice_items?: AddInvoiceItem[];
  billing_cycle_anchor?: "now" | string;
  payment_method?: string;
  proration_policy?: SubscriptionProrationPolicy;
  proration_date: string;
  cancel_at_period_end?: boolean;
};

/** Preview payload returned by `subscriptions.previewChange(...)`. */
export type SubscriptionChangePreview = {
  object: "subscription_change_preview";
  subscription: string;
  proration_date: string;
  proration_policy?: SubscriptionProrationPolicy;
  proration_amount?: number;
  lines?: ProrationLine[];
  currency: "BRL";
};

/** Request body for `subscriptions.cancel(...)`. */
export type SubscriptionCancel = {
  cancel_at_period_end?: boolean;
  prorate?: boolean;
  cancellation_details?: {
    reason?: CancellationReason;
    feedback?: string;
  };
};

/** Request body for `subscriptions.pause(...)`. */
export type SubscriptionPause = {
  resumes_at?: string;
  entitlement_behavior?: "keep" | "revoke";
};

/** Request body for `subscriptions.resume(...)`. */
export type SubscriptionResume = {
  payment_method?: string;
};

/** Supported query parameters for `subscriptions.list(...)`. */
export type SubscriptionListQuery = ListQuery & {
  customer?: string;
  status?: SubscriptionStatus;
  price?: string;
};

/** Supported query parameters for `subscriptions.listChanges(...)`. */
export type SubscriptionChangeListQuery = ListQuery;
