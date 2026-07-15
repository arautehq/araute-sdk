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
  create(input: TCreate, options?: RequestOptions): Promise<TEntity>;
  list(query?: TListQuery, options?: RequestOptions): Promise<ListResponse<TEntity>>;
  get(id: string, options?: RequestOptions): Promise<TEntity>;
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

  create(input: TCreate, options?: RequestOptions) {
    return this.http.post<TEntity>(this.path, input as never, options);
  }

  list(query?: TListQuery, options?: RequestOptions) {
    return this.http.get<ListResponse<TEntity>>(
      this.path,
      query as QueryParams | undefined,
      options,
    );
  }

  get(id: string, options?: RequestOptions) {
    return this.http.get<TEntity>(`${this.path}/${id}`, undefined, options);
  }

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
  delete(id: string, options?: RequestOptions) {
    return this.http.delete<TDeleted>(`${this.path}/${id}`, options);
  }
}
