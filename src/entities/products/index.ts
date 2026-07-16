import { ArauteHttpClient } from "../../common/http";
import { CrudResource } from "../../common/resource";
import type { Product, ProductCreate, ProductListQuery } from "./model";

export class ProductResource extends CrudResource<
  Product,
  ProductCreate,
  never,
  ProductListQuery
> {
  constructor(http: ArauteHttpClient) {
    super(http, "/products");
  }
}
