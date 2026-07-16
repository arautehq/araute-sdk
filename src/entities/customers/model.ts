import type { Address, ListQuery, Metadata } from "../../common/types";

/** Customer resource returned by the Araute API. */
export type Customer = {
  id: string;
  object: "customer";
  name?: string | null;
  email?: string | null;
  tax_id?: string | null;
  phone?: string | null;
  address?: Address;
  currency?: "BRL" | null;
  balance: number;
  delinquent: boolean;
  metadata?: Metadata;
  livemode: boolean;
  created_at: string;
  updated_at: string;
};

/** Request body for `customers.create(...)`. */
export type CustomerCreate = {
  name?: string;
  email?: string;
  tax_id?: string;
  phone?: string;
  address?: Address;
  metadata?: Metadata;
};

/** Request body for `customers.update(...)`. */
export type CustomerUpdate = {
  name?: string;
  email?: string;
  tax_id?: string;
  phone?: string;
  address?: Address;
  metadata?: Metadata;
};

/** Supported query parameters for `customers.list(...)`. */
export type CustomerListQuery = ListQuery & {
  email?: string;
  tax_id?: string;
};
