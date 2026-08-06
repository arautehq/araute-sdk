import { ArauteHttpClient } from "../../common/http";
import { CrudResource } from "../../common/resource";
import type { Price, PriceCreate, PriceListQuery } from "./model";

export class PriceResource extends CrudResource<Price, PriceCreate, never, PriceListQuery> {
  constructor(http: ArauteHttpClient) {
    super(http, "/prices");
  }
}

export type {
  Price,
  PriceCreate,
  PriceListQuery,
  PriceInterval,
  PriceRecurring,
} from "./model";
