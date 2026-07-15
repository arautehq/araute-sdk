import type { ArauteHttpClient } from "./http";
import type {
  DeletedResource,
  ListQuery,
  ListResponse,
  RequestOptions,
} from "./types";

type QueryParams = Record<string, string | number | undefined>;

/**
 * Shared CRUD contract for collection resources.
 * Prefer extending {@link CrudResource} rather than implementing this by hand.
 */
export interface CrudOperations<
  TEntity,
  TCreate,
  TUpdate,
  TListQuery extends ListQuery = ListQuery,
> {
  /** Creates a new resource. Sends a `POST` request to the collection path. */
  create(input: TCreate, options?: RequestOptions): Promise<TEntity>;

  /** Lists resources from the collection path. Sends a `GET` request. */
  list(query?: TListQuery, options?: RequestOptions): Promise<ListResponse<TEntity>>;

  /** Fetches a single resource by id. Sends a `GET` request to `/{id}`. */
  get(id: string, options?: RequestOptions): Promise<TEntity>;

  /** Updates a resource by id. Sends a `PATCH` request to `/{id}`. */
  update(
    id: string,
    input: TUpdate,
    options?: Omit<RequestOptions, "idempotencyKey">,
  ): Promise<TEntity>;
}

/**
 * Base class for resources that expose create / list / get / update
 * against a collection path (e.g. `/customers`).
 */
export abstract class CrudResource<
  TEntity,
  TCreate,
  TUpdate,
  TListQuery extends ListQuery = ListQuery,
> implements CrudOperations<TEntity, TCreate, TUpdate, TListQuery> {
  constructor(
    protected readonly http: ArauteHttpClient,
    protected readonly path: string,
  ) {}

  /** @inheritdoc */
  create(input: TCreate, options?: RequestOptions) {
    return this.http.post<TEntity>(this.path, input as never, options);
  }

  /** @inheritdoc */
  list(query?: TListQuery, options?: RequestOptions) {
    return this.http.get<ListResponse<TEntity>>(
      this.path,
      query as QueryParams | undefined,
      options,
    );
  }

  /** @inheritdoc */
  get(id: string, options?: RequestOptions) {
    return this.http.get<TEntity>(`${this.path}/${id}`, undefined, options);
  }

  /** @inheritdoc */
  update(
    id: string,
    input: TUpdate,
    options?: Omit<RequestOptions, "idempotencyKey">,
  ) {
    return this.http.patch<TEntity>(`${this.path}/${id}`, input as never, options);
  }
}

/**
 * CRUD resource that also supports delete.
 */
export abstract class DeletableResource<
  TEntity,
  TCreate,
  TUpdate,
  TListQuery extends ListQuery = ListQuery,
  TDeleted = DeletedResource,
> extends CrudResource<TEntity, TCreate, TUpdate, TListQuery> {
  /** Deletes a resource by id. Sends a `DELETE` request to `/{id}`. */
  delete(id: string, options?: RequestOptions) {
    return this.http.delete<TDeleted>(`${this.path}/${id}`, options);
  }
}
