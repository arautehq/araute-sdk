import type { ListQuery, Metadata } from "../../common/types";

/** Product resource returned by the Araute API. */
export type Product = {
  id: string;
  object: "product";
  name: string;
  description?: string | null;
  active: boolean;
  tax_code?: string | null;
  metadata?: Metadata;
  livemode: boolean;
  created_at: string;
  updated_at: string;
};

/** Request body for `products.create(...)`. */
export type ProductCreate = {
  name: string;
  description?: string;
  active?: boolean;
  tax_code?: string;
  metadata?: Metadata;
};

/** Supported query parameters for `products.list(...)`. */
export type ProductListQuery = ListQuery & {
  active?: boolean;
};
