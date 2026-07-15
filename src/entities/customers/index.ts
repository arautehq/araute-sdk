import type {
  Customer,
  CustomerCreate,
  CustomerListQuery,
  CustomerUpdate,
} from "./model";
import { ArauteHttpClient } from "../../common/http";
import { CrudResource } from "../../common/resource";

export class CustomerResource extends CrudResource<
  Customer,
  CustomerCreate,
  CustomerUpdate,
  CustomerListQuery
> {
  constructor(http: ArauteHttpClient) {
    super(http, "/customers");
  }
}
