import type { Address, ListQuery, Metadata } from "../../common/types";

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

export type CustomerCreate = {
  name?: string;
  email?: string;
  tax_id?: string;
  phone?: string;
  address?: Address;
  metadata?: Metadata;
};

export type CustomerUpdate = {
  name?: string;
  email?: string;
  tax_id?: string;
  phone?: string;
  address?: Address;
  metadata?: Metadata;
};

export type CustomerListQuery = ListQuery & {
  email?: string;
  tax_id?: string;
};
