import type { ListQuery, Metadata } from "../../common/types";

export type PriceInterval = "DAY" | "WEEK" | "MONTH" | "YEAR";

export type PriceRecurring = {
  interval: PriceInterval;
  intervalCount: number;
} | null;

export type Price = {
  id: string;
  object: "PRICE";
  product: string;
  currency: "BRL";
  unitAmount: number;
  nickname?: string | null;
  active: boolean;
  recurring: PriceRecurring;
  metadata?: Metadata;
  livemode: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PriceCreate = {
  product: string;
  currency?: "BRL";
  unitAmount: number;
  nickname?: string;
  active?: boolean;
  recurring?: {
    interval: PriceInterval;
    intervalCount?: number;
  };
  metadata?: Metadata;
};

export type PriceListQuery = ListQuery & {
  product?: string;
  active?: boolean;
  type?: "ONE_TIME" | "RECURRING";
};
