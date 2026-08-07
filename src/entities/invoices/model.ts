import type { ListQuery, Metadata } from "../../common/types";

export type InvoiceStatus = "DRAFT" | "OPEN" | "PAID" | "VOID" | "UNCOLLECTIBLE";
export type InvoiceCollectionMethod = "CHARGE_AUTOMATICALLY" | "SEND_INVOICE";
export type InvoiceBillingReason = "MANUAL" | "SUBSCRIPTION_CREATE" | "SUBSCRIPTION_CYCLE" | "SUBSCRIPTION_UPDATE";

export type InvoiceItem = {
  id: string;
  object: "INVOICE_ITEM";
  invoice?: string | null;
  customer: string;
  description: string;
  quantity: number;
  unitAmount: number;
  amount: number;
  currency: "BRL";
  proration?: boolean;
  discountable?: boolean;
  metadata?: Metadata;
};

export type CustomerSnapshot = { name?: string; email?: string; taxId?: string } | null;

export type Invoice = {
  id: string;
  object: "INVOICE";
  status: InvoiceStatus;
  customer: string;
  subscription?: string | null;
  number?: string | null;
  currency: "BRL";
  subtotal: number;
  total: number;
  amountPaid: number;
  amountRemaining: number;
  collectionMethod?: InvoiceCollectionMethod;
  billingReason?: InvoiceBillingReason;
  paymentIntent?: string | null;
  hostedInvoiceUrl?: string | null;
  invoicePdf?: string | null;
  dueDate?: string | null;
  periodStart?: string | null;
  periodEnd?: string | null;
  attemptCount?: number;
  nextPaymentAttempt?: string | null;
  lines?: InvoiceItem[];
  customerSnapshot?: CustomerSnapshot;
  metadata?: Metadata;
  livemode: boolean;
  createdAt: string;
  updatedAt: string;
};

export type InvoiceCreate = {
  customer: string;
  subscription?: string;
  collectionMethod?: InvoiceCollectionMethod;
  dueDate?: string;
  metadata?: Metadata;
};
export type InvoiceItemCreate = {
  description: string;
  amount: number;
  quantity?: number;
  unitAmount?: number;
  discountable?: boolean;
  metadata?: Metadata;
};
export type InvoicePay = { paymentMethod?: string };
export type InvoiceListQuery = ListQuery & {
  customer?: string;
  subscription?: string;
  status?: InvoiceStatus;
};
