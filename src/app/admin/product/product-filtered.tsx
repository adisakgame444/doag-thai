'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, MoreVertical, Pencil, RefreshCcw, Trash2 } from 'lucide-react'

import { DashboardSearchInput } from '@/components/admin/dashboard-search-input'
import { DashboardStatusTabs } from '@/components/admin/dashboard-status-tabs'
import { PaginationControls } from '@/components/pagination/pagination-controls'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PaginationMeta } from '@/lib/pagination'
import { cn } from '@/lib/utils'
import { ProductWithMainImage } from '@/types/product'

import DeleteProductModal from './modal/delete-product-modal'
import ProductDetailModal from './modal/product-detail-modal'
import RestoreProductModal from './modal/restore-product-modal'

interface ProductFilteredProps {
  products: ProductWithMainImage[]
  meta: PaginationMeta
  status: 'all' | 'active' | 'inactive'
  search: string
}

export default function ProductFiltered({ products, meta, status, search }: ProductFilteredProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isDeleteModal, setIsDeleteModal] = useState(false)
  const [isRestoreModal, setIsRestoreModal] = useState(false)
  const [isDetailModal, setIsDetailModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductWithMainImage | null>(null)

  const [, startTransition] = useTransition()
  const [searchInput, setSearchInput] = useState(search)

  useEffect(() => {
    setSearchInput(search)
  }, [search])

  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams)

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value.trim().length > 0) {
        params.set(key, value.trim())
      } else {
        params.delete(key)
      }
    })

    if ('search' in updates || 'status' in updates) {
      params.delete('page')
    }

    const queryString = params.toString()

    startTransition(() => {
      router.push(queryString ? `${pathname}?${queryString}` : pathname)
    })
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput === search) return
      updateQuery({ search: searchInput || null })
    }, 400)

    return () => clearTimeout(handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  const handleStatusChange = (value: string) => {
    updateQuery({ status: value === 'all' ? null : value })
  }

  const startIndex = (meta.page - 1) * meta.pageSize

  const paginationQuery = useMemo(() => {
    const params: Record<string, string> = {}
    const rawStatus = searchParams.get('status') ?? status
    const rawSearch = searchParams.get('search') ?? search
    const pageSizeParam = searchParams.get('pageSize')

    if (rawStatus && rawStatus !== 'all') params.status = rawStatus
    if (rawSearch) params.search = rawSearch
    if (pageSizeParam) params.pageSize = pageSizeParam

    return params
  }, [searchParams, status, search])

  const handleDeleteClick = (product: ProductWithMainImage) => {
    setSelectedProduct(product)
    setIsDeleteModal(true)
  }

  const handleRestoreClick = (product: ProductWithMainImage) => {
    setSelectedProduct(product)
    setIsRestoreModal(true)
  }

  const handleDetailClick = (product: ProductWithMainImage) => {
    setSelectedProduct(product)
    setIsDetailModal(true)
  }

  return (
    <>
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 px-4 sm:px-6 w-full'>
        <div className='w-full sm:w-auto'>
          <DashboardStatusTabs
            value={status}
            onValueChange={(value) => handleStatusChange(value as 'all' | 'active' | 'inactive')}
            allLabel='All Products'
          />
        </div>
        <div className='w-full sm:max-w-xs'>
          <DashboardSearchInput
            value={searchInput}
            onChange={setSearchInput}
            placeholder='Search products...'
          />
        </div>
      </div>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.length > 0 ? (
              products.map((product, index) => {
                const mainImageUrl =
                  product.mainImage?.url ??
                  product.ProductImage[0]?.url ??
                  '/images/no-product-image.webp'

                return (
                  <TableRow key={product.id}>
                    <TableCell className='text-sm text-muted-foreground'>
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell>
                      <Image
                        alt={product.title}
                        src={mainImageUrl}
                        width={40}
                        height={40}
                        className='object-cover rounded-md'
                      />
                    </TableCell>
                    <TableCell>
                      <div className='font-medium'>{product.title}</div>
                      <div className='text-xs text-muted-foreground'>{product.sku}</div>
                    </TableCell>
                    <TableCell>
                      <div className='font-medium'>{product.category?.name ?? '-'}</div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={cn('text-sm', {
                          'text-amber-500 font-medium': product.stock <= product.lowStock,
                        })}
                      >
                        {product.stock}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.status === 'active' ? 'default' : 'destructive'}
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='icon' className='size-8'>
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem onClick={() => handleDetailClick(product)}>
                            <Eye size={15} />
                            <span>Details</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link href={`/admin/product/edit/${product.id}`}>
                              <Pencil size={15} />
                              <span>Edit</span>
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {product.status === 'active' ? (
                            <DropdownMenuItem onClick={() => handleDeleteClick(product)}>
                              <Trash2 size={15} className='text-destructive' />
                              <span className='text-destructive'>Deactivate</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleRestoreClick(product)}>
                              <RefreshCcw size={15} className='text-green-600' />
                              <span className='text-green-600'>Restore</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className='h-40 text-center text-muted-foreground'>
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <div className='border-t px-4 py-4'>
        <PaginationControls
          meta={meta}
          pathname={pathname}
          query={paginationQuery}
          className='justify-end'
        />
      </div>

      <DeleteProductModal
        open={isDeleteModal}
        onOpenChange={setIsDeleteModal}
        product={selectedProduct}
      />

      <RestoreProductModal
        open={isRestoreModal}
        onOpenChange={setIsRestoreModal}
        product={selectedProduct}
      />

      <ProductDetailModal
        open={isDetailModal}
        onOpenChange={setIsDetailModal}
        product={selectedProduct}
      />
    </>
  )
}
