/**
 * The Masar-HR Postman collection ships with zero saved response examples
 * (every request's `response` array is empty), so the exact envelope the
 * Laravel backend returns for each endpoint is not contractually documented
 * anywhere. These types encode the two shapes Laravel produces by default
 * and are intentionally permissive so `unwrap()` (see `client.ts`) can adapt
 * to either without throwing. See CHANGELOG.md ("Undocumented response
 * contracts") for the full note.
 */

/** A single Laravel API Resource response: `{ data: T }`. */
export interface ApiResourceEnvelope<T> {
  data: T;
}

/** Laravel's default paginator JSON shape (`->paginate()`). */
export interface LaravelPaginated<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
}

/** Normalized pagination result our hooks/components consume. */
export interface Paginated<T> {
  items: T[];
  page: number;
  perPage: number;
  total: number;
  lastPage: number;
}

/** Generic `{ message: string }` acknowledgement Laravel actions return. */
export interface MessageResponse {
  message: string;
}

export function isLaravelPaginated<T>(value: unknown): value is LaravelPaginated<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    "meta" in value &&
    Array.isArray((value as { data: unknown }).data)
  );
}

export function normalizePaginated<T>(value: LaravelPaginated<T>): Paginated<T> {
  return {
    items: value.data,
    page: value.meta.current_page,
    perPage: value.meta.per_page,
    total: value.meta.total,
    lastPage: value.meta.last_page,
  };
}
