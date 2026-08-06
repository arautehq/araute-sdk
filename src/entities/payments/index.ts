import { ArauteHttpClient } from "../../common/http";
import { CrudResource } from "../../common/resource";
import type { ListQuery, ListResponse, RequestOptions } from "../../common/types";
import type {
  Payment,
  PaymentCancel,
  PaymentConfirm,
  PaymentCreate,
  PaymentListQuery,
} from "./model";

type QueryParams = Record<string, string | number | boolean | undefined>;

type PaymentWire = Omit<Payment, "methods"> & {
  paymentMethodTypes: Array<"pix" | "card">;
};

function toWireMethod(method: PaymentCreate["methods"][number]) {
  return method.toLowerCase() as "pix" | "card";
}

function fromWirePayment(payment: PaymentWire): Payment {
  const { paymentMethodTypes, ...rest } = payment;
  return {
    ...rest,
    methods: paymentMethodTypes.map((method) => method.toUpperCase() as Payment["methods"][number]),
  };
}

function toWireCreate(input: PaymentCreate) {
  const { methods, ...rest } = input;
  return { ...rest, paymentMethodTypes: methods.map(toWireMethod) };
}

function toWireConfirm(input?: PaymentConfirm) {
  if (!input?.paymentMethodData?.type) return input;

  return {
    ...input,
    paymentMethodData: {
      ...input.paymentMethodData,
      type: toWireMethod(input.paymentMethodData.type),
    },
  };
}

/** Payments facade backed by Araute Payment Intents. */
export class PaymentResource extends CrudResource<
  Payment,
  PaymentCreate,
  never,
  PaymentListQuery
> {
  constructor(http: ArauteHttpClient) {
    super(http, "/payment_intents");
  }

  override async create(input: PaymentCreate, options?: RequestOptions) {
    return fromWirePayment(await this.http.post<PaymentWire>(this.path, toWireCreate(input), options));
  }

  override async get(id: string, options?: RequestOptions) {
    return fromWirePayment(await this.http.get<PaymentWire>(`${this.path}/${id}`, undefined, options));
  }

  confirm(id: string, input?: PaymentConfirm, options?: RequestOptions) {
    return this.http.post<PaymentWire>(
      `${this.path}/${id}/confirm`,
      toWireConfirm(input),
      options,
    ).then(fromWirePayment);
  }

  cancel(id: string, input?: PaymentCancel, options?: RequestOptions) {
    return this.http.post<PaymentWire>(
      `${this.path}/${id}/cancel`,
      input,
      options,
    ).then(fromWirePayment);
  }

  override list(query?: PaymentListQuery, options?: RequestOptions) {
    return this.http.get<ListResponse<PaymentWire>>(
      this.path,
      query as QueryParams | undefined,
      options,
    ).then((response) => ({
      ...response,
      data: response.data.map(fromWirePayment),
    }));
  }
}

export type {
  Payment,
  PaymentCancel,
  PaymentConfirm,
  PaymentCreate,
  PaymentError,
  PaymentListQuery,
  PaymentMethodType,
  PaymentNextAction,
  PaymentStatus,
} from "./model";
