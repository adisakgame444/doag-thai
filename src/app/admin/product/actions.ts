'use server'

import { assertAdminUser } from '@/lib/admin-auth'
import { uploadToImageKit } from '@/lib/imagekit'
import { updateTag } from 'next/cache'
import {
  createProduct as createProductRecord,
  getProductById as getProductByIdRecord,
  listProducts,
  updateProduct as updateProductRecord,
  updateProductStatus as updateProductStatusRecord,
  getProductStats,
  ListProductsOptions,
} from '@/services/products'
import {
  normalizePagination,
  ADMIN_DEFAULT_PAGE_SIZE,
  createPaginationMeta,
  PaginationMeta,
} from '@/lib/pagination'
import { ProductWithMainImage } from '@/types/product'


export async function createProduct({
  title,
  type,
  unitLabel,
  lowStock,
  description,
  cod,
  cost,
  stock,
  categoryId,
  mainImageIndex,
  images,
  weights,
}: {
  title: string
  type: "WEIGHT" | "UNIT"
  unitLabel?: string
  lowStock: number
  description: string
  cod: boolean
  cost: number
  stock: number
  categoryId: string
  mainImageIndex: number
  images: File[]
  weights: {
    weight: number
    basePrice: number
    price: number
  }[]
}) {
  await assertAdminUser()

  try {
    const uploadedImages = await Promise.all(
      images.map(async (imageFile) => {
        const { url, fileId, message } = await uploadToImageKit(
          imageFile,
          'weed_store/product'
        )
        if (message || !url || !fileId) {
          throw new Error(message || 'Failed to upload product image')
        }
        return { url, fileId }
      })
    )

    await createProductRecord({
      title,
      type,
      unitLabel,
      lowStock,
      description,
      cod,
      cost,
      stock,
      categoryId,
      mainImageIndex,
      images: uploadedImages,
      weights,
    })

    updateTag('products')

    return { message: 'Product created successfully' }
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'Something went wrong' }
  }
}

export async function updateProduct({
  id,
  title,  
  type,
  unitLabel,
  lowStock,
  description,
  cod,
  cost,
  stock,
  categoryId,
  mainImageIndex,
  images,
  weights,
  deletedImageIds,
}: {
  id: string
  title: string 
  type: "WEIGHT" | "UNIT"
  unitLabel?: string
  lowStock: number
  description: string
  cod: boolean
  cost: number
  stock: number
  categoryId: string
  mainImageIndex: number
  images: File[]
  weights: {
    weight: number
    basePrice: number
    price: number
  }[]
  deletedImageIds: string[]
}) {
  await assertAdminUser()

  try {
    const uploadedImages = await Promise.all(
      images.map(async (imageFile) => {
        const { url, fileId, message } = await uploadToImageKit(
          imageFile,
          'weed_store/product'
        )
        if (message || !url || !fileId) {
          throw new Error(message || 'Failed to upload product image')
        }
        return { url, fileId }
      })
    )

    await updateProductRecord({
      id,
      title,
      type,
      unitLabel,
      lowStock,
      description,
      cod,
      cost,
      stock,
      categoryId,
      mainImageIndex,
      images: uploadedImages,
      weights,
      deletedImageIds,
    })

    updateTag('products')

    return { message: 'Product updated successfully' }
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'Something went wrong' }
  }
}

export type ProductListResult = {
  items: ProductWithMainImage[]
  total: number
  meta: PaginationMeta
}

export async function getProducts(options: ListProductsOptions = {}): Promise<ProductListResult> {
  try {
    return await listProducts(options)
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

export async function updateProductStatus(id: string, status: string) {
  await assertAdminUser()

  try {
    await updateProductStatusRecord(id, status)
    updateTag('products')

    return { message: 'Product status updated successfully' }
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'Something went wrong' }
  }
}

export async function getProductById(id: string) {
  try {
    return await getProductByIdRecord(id)
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'Something went wrong' }
  }
}

export async function getProductsSummary() {
  try {
    return await getProductStats()
  } catch (error) {
    console.error(error)
    return { total: 0, active: 0, inactive: 0 }
  }
}
