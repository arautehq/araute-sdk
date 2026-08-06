import type { Address, ListQuery, Metadata } from "../../common/types";

/** Customer resource returned by the Araute API. */
export type Customer = {
  id: string;
  object: "CUSTOMER";
  name?: string | null;
  email?: string | null;
  taxId?: string | null;
  phone?: string | null;
  address?: Address;
  currency?: "BRL" | null;
  balance: number;
  delinquent: boolean;
  metadata?: Metadata;
  livemode: boolean;
  createdAt: string;
  updatedAt: string;
};

/** Request body for `customers.create(...)`. */
export type CustomerCreate = {
  name?: string;
  email?: string;
  taxId?: string;
  phone?: string;
  address?: Address;
  metadata?: Metadata;
};

/** Request body for `customers.update(...)`. */
export type CustomerUpdate = {
  name?: string;
  email?: string;
  taxId?: string;
  phone?: string;
  address?: Address;
  metadata?: Metadata;
};

/** Supported query parameters for `customers.list(...)`. */
export type CustomerListQuery = ListQuery & {
  email?: string;
  taxId?: string;
};
