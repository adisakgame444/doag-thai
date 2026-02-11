export interface PaginationParams {
  page?: number | string | null;
  pageSize?: number | string | null;
}

export interface NormalizedPagination {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
}

export interface PaginationOptions {
  defaultPage?: number;
  defaultPageSize?: number;
  maxPageSize?: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

function toPositiveInteger(value: number | string | null | undefined) {
  if (value === null || value === undefined) return undefined;
  const number = typeof value === "string" ? Number.parseInt(value, 10) : value;
  if (Number.isNaN(number) || number < 1) {
    return undefined;
  }
  return Math.floor(number);
}

export function normalizePagination(
  params: PaginationParams = {},
  options: PaginationOptions = {}
): NormalizedPagination {
  const {
    defaultPage = DEFAULT_PAGE,
    defaultPageSize = DEFAULT_PAGE_SIZE,
    maxPageSize = MAX_PAGE_SIZE,
  } = options;

  const rawPage = toPositiveInteger(params.page) ?? defaultPage;
  const rawPageSize = toPositiveInteger(params.pageSize) ?? defaultPageSize;

  const pageSize = Math.min(Math.max(1, rawPageSize), maxPageSize);
  const page = Math.max(1, rawPage);

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  return { page, pageSize, skip, take };
}

export function createPaginationMeta(
  totalItems: number,
  { page, pageSize }: { page: number; pageSize: number }
): PaginationMeta {
  const total = Math.max(0, totalItems);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  return {
    page: currentPage,
    pageSize,
    totalItems: total,
    totalPages,
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
  };
}

export const ADMIN_DEFAULT_PAGE_SIZE = 10;
export const PUBLIC_DEFAULT_PAGE_SIZE = 26;
