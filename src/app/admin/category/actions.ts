'use server'

import { assertAdminUser } from '@/lib/admin-auth'
import { updateTag } from 'next/cache'
import {
  createCategory as createCategoryRecord,
  listCategories,
  updateCategoryName,
  updateCategoryStatus as updateCategoryStatusRecord,
  ListCategoriesOptions,
} from '@/services/categories'
import {
  normalizePagination,
  ADMIN_DEFAULT_PAGE_SIZE,
  createPaginationMeta,
  PaginationMeta,
} from '@/lib/pagination'
import { CategoryWithProducts } from '@/types/category'

export async function createCategory(name: string) {
  await assertAdminUser()

  try {
    await createCategoryRecord(name)
    updateTag('categories')
    return { message: 'Category created successfully' }
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'Something went wrong' }
  }
}

export type CategoryListResult = {
  items: CategoryWithProducts[]
  total: number
  meta: PaginationMeta
}

export async function getCategories(options: ListCategoriesOptions = {}): Promise<CategoryListResult> {
  try {
    return await listCategories(options)
  } catch (error) {
    console.error(error)
    const pagination = normalizePagination(
      { page: options.page, pageSize: options.pageSize },
      { defaultPageSize: ADMIN_DEFAULT_PAGE_SIZE }
    )
    return {
      items: [],
      total: 0,
      meta: createPaginationMeta(0, {
        page: pagination.page,
        pageSize: pagination.pageSize,
      }),
    }
  }
}

export async function updateCategory(id: string, name: string) {
  await assertAdminUser()

  try {
    await updateCategoryName(id, name)
    updateTag('categories')
    return { message: 'Category updated successfully' }
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'Something went wrong' }
  }
}

export async function updateCategoryStatus(id: string, status: string) {
  await assertAdminUser()

  try {
    await updateCategoryStatusRecord(id, status)
    updateTag('categories')
    return { message: 'Category updated successfully' }
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'Something went wrong' }
  }
}

