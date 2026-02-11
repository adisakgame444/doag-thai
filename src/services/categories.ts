import db from '@/lib/db'
import {
  categorySummary,
  categoryWithProducts,
  CategorySummary,
  CategoryWithProducts,
} from '@/types/category'
import {
  normalizePagination,
  createPaginationMeta,
  ADMIN_DEFAULT_PAGE_SIZE,
  PaginationMeta,
} from '@/lib/pagination'

export interface ListCategoriesOptions {
  page?: number | string | null
  pageSize?: number | string | null
  status?: 'active' | 'inactive' | 'all'
  search?: string | null
}

export async function createCategory(name: string) {
  const existing = await db.category.findFirst({ where: { name } })
  if (existing) {
    throw new Error('Category already exists')
  }

  return db.category.create({ data: { name } })
}

export interface ListCategoriesResult {
  items: CategoryWithProducts[]
  total: number
  meta: PaginationMeta
}

export async function listCategories(options: ListCategoriesOptions = {}): Promise<ListCategoriesResult> {
  const {
    page,
    pageSize = ADMIN_DEFAULT_PAGE_SIZE,
    status = 'all',
    search,
  } = options

  const pagination = normalizePagination(
    { page, pageSize },
    { defaultPageSize: ADMIN_DEFAULT_PAGE_SIZE }
  )

  const where = {
    ...(status !== 'all' ? { status } : {}),
    ...(search
      ? {
          name: {
            contains: search.trim(),
            mode: 'insensitive' as const,
          },
        }
      : {}),
  }

  const [items, total] = await db.$transaction([
    db.category.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: categoryWithProducts.select,
      skip: pagination.skip,
      take: pagination.take,
    }),
    db.category.count({ where }),
  ])

  const meta = createPaginationMeta(total, {
    page: pagination.page,
    pageSize: pagination.pageSize,
  })

  return { items, total, meta }
}

export async function listCategorySummaries(): Promise<CategorySummary[]> {
  return db.category.findMany({
    where: { status: 'active' },
    orderBy: { name: 'asc' },
    select: categorySummary.select,
  })
}

export async function updateCategoryName(id: string, name: string) {
  return db.category.update({
    where: { id },
    data: { name },
  })
}

export async function updateCategoryStatus(id: string, status: string) {
  if (!['active', 'inactive'].includes(status)) {
    throw new Error('Invalid category status')
  }

  return db.category.update({
    where: { id },
    data: { status },
  })
}

export async function getCategoryStats() {
  const [total, active, inactive] = await Promise.all([
    db.category.count(),
    db.category.count({ where: { status: 'active' } }),
    db.category.count({ where: { status: 'inactive' } }),
  ])

  return { total, active, inactive }
}
