import type { ListQuery, Metadata } from "../../common/types";

/** Product resource returned by the Araute API. */
export type Product = {
  id: string;
  object: "PRODUCT";
  name: string;
  description?: string | null;
  active: boolean;
  taxCode?: string | null;
  metadata?: Metadata;
  livemode: boolean;
  createdAt: string;
  updatedAt: string;
};

/** Request body for `products.create(...)`. */
export type ProductCreate = {
  name: string;
  description?: string;
  active?: boolean;
  taxCode?: string;
  metadata?: Metadata;
};

/** Supported query parameters for `products.list(...)`. */
export type ProductListQuery = ListQuery & {
  active?: boolean;
};
