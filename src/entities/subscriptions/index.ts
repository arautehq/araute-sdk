import { ArauteHttpClient } from "../../common/http";
import { CrudResource } from "../../common/resource";
import type { ListResponse, RequestOptions } from "../../common/types";
import type {
  Subscription,
  SubscriptionCancel,
  SubscriptionChange,
  SubscriptionChangeCreate,
  SubscriptionChangeListQuery,
  SubscriptionChangePreview,
  SubscriptionChangePreviewRequest,
  SubscriptionCreate,
  SubscriptionListQuery,
  SubscriptionPause,
  SubscriptionResume,
  SubscriptionUpdate,
} from "./model";

type QueryParams = Record<string, string | number | boolean | undefined>;

export class SubscriptionResource extends CrudResource<
  Subscription,
  SubscriptionCreate,
  SubscriptionUpdate,
  SubscriptionListQuery
> {
  constructor(http: ArauteHttpClient) {
    super(http, "/subscriptions");
  }

  override update(
    id: string,
    input: SubscriptionUpdate,
    options?: RequestOptions,
  ) {
    return this.http.patch<Subscription>(`${this.path}/${id}`, input, options);
  }

  createChange(
    id: string,
    input: SubscriptionChangeCreate,
    options?: RequestOptions,
  ) {
    return this.http.post<SubscriptionChange>(
      `${this.path}/${id}/changes`,
      input,
      options,
    );
  }

  getChange(id: string, options?: RequestOptions) {
    return this.http.get<SubscriptionChange>(`/subscription_changes/${id}`, undefined, options);
  }

  listChanges(
    id: string,
    query?: SubscriptionChangeListQuery,
    options?: RequestOptions,
  ) {
    return this.http.get<ListResponse<SubscriptionChange>>(
      `${this.path}/${id}/changes`,
      query as QueryParams | undefined,
      options,
    );
  }

  previewChange(
    id: string,
    input: SubscriptionChangePreviewRequest,
    options?: Omit<RequestOptions, "idempotencyKey">,
  ) {
    return this.http.post<SubscriptionChangePreview>(
      `${this.path}/${id}/preview_change`,
      input,
      options,
    );
  }

  cancel(id: string, input?: SubscriptionCancel, options?: RequestOptions) {
    return this.http.post<Subscription>(
      `${this.path}/${id}/cancel`,
      input,
      options,
    );
  }

  pause(id: string, input?: SubscriptionPause, options?: RequestOptions) {
    return this.http.post<Subscription>(
      `${this.path}/${id}/pause`,
      input,
      options,
    );
  }

  resume(id: string, input?: SubscriptionResume, options?: RequestOptions) {
    return this.http.post<Subscription>(
      `${this.path}/${id}/resume`,
      input,
      options,
    );
  }
}
