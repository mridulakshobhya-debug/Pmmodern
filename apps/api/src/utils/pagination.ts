export interface PaginationParams {
  page: number;
  limit: number;
}

export function parsePagination(page?: string, limit?: string): PaginationParams {
  const parsedPage = Math.max(Number(page ?? 1), 1);
  const parsedLimit = Math.min(Math.max(Number(limit ?? 12), 1), 50);
  return {
    page: Number.isFinite(parsedPage) ? parsedPage : 1,
    limit: Number.isFinite(parsedLimit) ? parsedLimit : 12
  };
}

export function paginate<T>(items: T[], params: PaginationParams) {
  const start = (params.page - 1) * params.limit;
  const sliced = items.slice(start, start + params.limit);
  return {
    items: sliced,
    page: params.page,
    limit: params.limit,
    total: items.length,
    totalPages: Math.ceil(items.length / params.limit)
  };
}
