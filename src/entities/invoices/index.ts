import { ArauteHttpClient } from "../../common/http";
import { CrudResource } from "../../common/resource";
import type { ListResponse, RequestOptions } from "../../common/types";
import type { Invoice, InvoiceCreate, InvoiceItem, InvoiceItemCreate, InvoiceListQuery, InvoicePay } from "./model";

export class InvoiceResource extends CrudResource<Invoice, InvoiceCreate, never, InvoiceListQuery> {
  constructor(http: ArauteHttpClient) {
    super(http, "/invoices");
  }

  addItem(id: string, input: InvoiceItemCreate, options?: RequestOptions) {
    return this.http.post<InvoiceItem>(`${this.path}/${id}/items`, input, options);
  }

  finalize(id: string, options?: RequestOptions) {
    return this.http.post<Invoice>(`${this.path}/${id}/finalize`, {}, options);
  }

  pay(id: string, input?: InvoicePay, options?: RequestOptions) {
    return this.http.post<Invoice>(`${this.path}/${id}/pay`, input, options);
  }

  void(id: string, options?: RequestOptions) {
    return this.http.post<Invoice>(`${this.path}/${id}/void`, {}, options);
  }

  markUncollectible(id: string, options?: RequestOptions) {
    return this.http.post<Invoice>(`${this.path}/${id}/mark_uncollectible`, {}, options);
  }
}

export type {
  CustomerSnapshot,
  Invoice,
  InvoiceBillingReason,
  InvoiceCollectionMethod,
  InvoiceCreate,
  InvoiceItem,
  InvoiceItemCreate,
  InvoiceListQuery,
  InvoicePay,
  InvoiceStatus,
} from "./model";
