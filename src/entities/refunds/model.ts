import type { ListQuery, Metadata } from "../../common/types";

export type RefundStatus = "PENDING" | "SUCCEEDED" | "FAILED";
export type RefundReason = "REQUESTED_BY_CUSTOMER" | "DUPLICATE" | "FRAUDULENT" | "OTHER";

export type Refund = {
  id: string;
  object: "REFUND";
  status: RefundStatus;
  charge: string;
  paymentIntent: string;
  amount: number;
  currency: "BRL";
  reason: RefundReason | null;
  failureReason: string | null;
  metadata?: Metadata;
  livemode: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RefundCreate = {
  charge: string;
  amount?: number;
  reason?: RefundReason;
  metadata?: Metadata;
};
export type RefundListQuery = ListQuery & { charge?: string; paymentIntent?: string };
