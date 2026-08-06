import type { ListQuery, Metadata } from "../../common/types";

export type SubscriptionStatus =
  | "INCOMPLETE" | "ACTIVE" | "TRIALING" | "PAST_DUE" | "UNPAID" | "PAUSED" | "CANCELLED";

export type SubscriptionCollectionMethod =
  | "CHARGE_AUTOMATICALLY" | "SEND_INVOICE";

export type SubscriptionPaymentMethodType = "CARD" | "PIX_MANUAL";

export type SubscriptionTrialEndBehavior =
  | "CANCEL" | "PAUSE" | "CREATE_INVOICE";

export type SubscriptionProrationPolicy =
  | "CHARGE_NOW" | "NEXT_CYCLE" | "CREDIT" | "NONE";

export type SubscriptionChangeStatus =
  | "PENDING" | "APPLIED" | "PAYMENT_FAILED" | "EXPIRED" | "CANCELLED";

export type SubscriptionChangeDiff = Record<string, unknown>;

export type CancellationReason =
  | "REQUESTED_BY_CUSTOMER" | "PAYMENT_FAILURE" | "FRAUD" | "OTHER";

/** Subscription item attached to a subscription. */
export type SubscriptionItem = {
  id: string;
  object: "SUBSCRIPTION_ITEM";
  price: string;
  quantity: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  metadata?: Metadata;
};

/** Cancellation metadata returned by subscription resources. */
export type SubscriptionCancellationDetails = {
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
  object: "SUBSCRIPTION_CHANGE";
  status: SubscriptionChangeStatus;
  subscription: string;
  prorationPolicy?: SubscriptionProrationPolicy;
  prorationAmount?: number;
  prorationLines?: ProrationLine[];
  diff?: SubscriptionChangeDiff | null;
  invoice?: string | null;
  paymentIntent?: string | null;
  effectiveAt?: string | null;
  appliedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

/** Subscription resource returned by the Araute API. */
export type Subscription = {
  id: string;
  object: "SUBSCRIPTION";
  status: SubscriptionStatus;
  customer: string;
  collectionMethod: SubscriptionCollectionMethod;
  paymentMethodType?: SubscriptionPaymentMethodType | null;
  defaultPaymentMethod?: string | null;
  items: SubscriptionItem[];
  billingCycleAnchor?: string | null;
  trialStart?: string | null;
  trialEnd?: string | null;
  trialEndBehavior?: SubscriptionTrialEndBehavior | null;
  cancelAtPeriodEnd?: boolean;
  cancelAt?: string | null;
  cancelledAt?: string | null;
  cancellationDetails?: SubscriptionCancellationDetails;
  gracePeriodDays?: number;
  latestInvoice?: string | null;
  pendingChange?: SubscriptionChange | null;
  latestChange?: string | null;
  pixMandate?: string | null;
  metadata?: Metadata;
  livemode: boolean;
  createdAt: string;
  updatedAt: string;
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
  paymentMethod?: string;
  paymentMethodType?: "PIX_MANUAL";
  collectionMethod?: SubscriptionCollectionMethod;
  trialPeriodDays?: number;
  trialEnd?: string;
  trialEndBehavior?: SubscriptionTrialEndBehavior;
  billingCycleAnchor?: "NOW" | string;
  prorationPolicy?: SubscriptionProrationPolicy;
  gracePeriodDays?: number;
  cancelAtPeriodEnd?: boolean;
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
  addInvoiceItems?: AddInvoiceItem[];
  billingCycleAnchor?: "NOW" | string;
  paymentMethod?: string;
  prorationPolicy?: SubscriptionProrationPolicy;
  prorationDate?: string;
  cancelAtPeriodEnd?: boolean;
  metadata?: Metadata;
};

/** Request body for `subscriptions.createChange(...)`. */
export type SubscriptionChangeCreate = {
  items?: SubscriptionItemUpdate[];
  addInvoiceItems?: AddInvoiceItem[];
  billingCycleAnchor?: "NOW" | string;
  paymentMethod?: string;
  prorationPolicy?: SubscriptionProrationPolicy;
  prorationDate?: string;
  effectiveAt?: "NOW" | string;
  metadata?: Metadata;
};

/** Request body for `subscriptions.previewChange(...)`. */
export type SubscriptionChangePreviewRequest = {
  items?: SubscriptionItemUpdate[];
  addInvoiceItems?: AddInvoiceItem[];
  billingCycleAnchor?: "NOW" | string;
  paymentMethod?: string;
  prorationPolicy?: SubscriptionProrationPolicy;
  prorationDate: string;
  cancelAtPeriodEnd?: boolean;
};

/** Preview payload returned by `subscriptions.previewChange(...)`. */
export type SubscriptionChangePreview = {
  object: "SUBSCRIPTION_CHANGE_PREVIEW";
  subscription: string;
  prorationDate: string;
  prorationPolicy?: SubscriptionProrationPolicy;
  prorationAmount?: number;
  lines?: ProrationLine[];
  currency: "BRL";
};

/** Request body for `subscriptions.cancel(...)`. */
export type SubscriptionCancel = {
  cancelAtPeriodEnd?: boolean;
  prorate?: boolean;
  cancellationDetails?: {
    reason?: CancellationReason;
    feedback?: string;
  };
};

/** Request body for `subscriptions.pause(...)`. */
export type SubscriptionPause = {
  resumesAt?: string;
  entitlementBehavior?: "KEEP" | "REVOKE";
};

/** Request body for `subscriptions.resume(...)`. */
export type SubscriptionResume = {
  paymentMethod?: string;
};

/** Supported query parameters for `subscriptions.list(...)`. */
export type SubscriptionListQuery = ListQuery & {
  customer?: string;
  status?: SubscriptionStatus;
  price?: string;
};

/** Supported query parameters for `subscriptions.listChanges(...)`. */
export type SubscriptionChangeListQuery = ListQuery;
