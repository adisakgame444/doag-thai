'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { MoreVertical, Pencil, RefreshCcw, Trash2 } from 'lucide-react'

import { DashboardSearchInput } from '@/components/admin/dashboard-search-input'
import { DashboardStatusTabs } from '@/components/admin/dashboard-status-tabs'
import { PaginationControls } from '@/components/pagination/pagination-controls'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PaginationMeta } from '@/lib/pagination'
import { CategoryWithProducts } from '@/types/category'

import DeleteCategoryModal from './modal/delete-category-model'
import EditCategoryModal from './modal/edit-category-modal'
import RestoreCategoryModal from './modal/restore-category-modal'

interface CategoryFilteredProps {
  categories: CategoryWithProducts[]
  meta: PaginationMeta
  status: 'all' | 'active' | 'inactive'
  search: string
}

export default function CategoryFiltered({ categories, meta, status, search }: CategoryFilteredProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isEditModal, setIsEditModal] = useState(false)
  const [isDeleteModal, setIsDeleteModal] = useState(false)
  const [isRestoreModal, setIsRestoreModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithProducts | null>(null)

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

  const handleEditClick = (category: CategoryWithProducts) => {
    setSelectedCategory(category)
    setIsEditModal(true)
  }

  const handleDeleteClick = (category: CategoryWithProducts) => {
    setSelectedCategory(category)
    setIsDeleteModal(true)
  }

  const handleRestoreClick = (category: CategoryWithProducts) => {
    setSelectedCategory(category)
    setIsRestoreModal(true)
  }

  const displayedCategories = useMemo(() => categories, [categories])

  return (
    <>
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 px-4 sm:px-6 w-full'>
        <div className='w-full sm:w-auto'>
          <DashboardStatusTabs
            value={status}
            onValueChange={(value) => handleStatusChange(value as 'all' | 'active' | 'inactive')}
            allLabel='All Categories'
          />
        </div>
        <div className='w-full sm:max-w-xs'>
          <DashboardSearchInput
            value={searchInput}
            onChange={setSearchInput}
            placeholder='Search categories...'
          />
        </div>
      </div>
      <CardContent>
        <div className='border rounded-md overflow-hidden'>
          <div className='grid grid-cols-12 bg-muted py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium'>
            <div className='col-span-1 hidden sm:block'>No.</div>
            <div className='col-span-6 sm:col-span-5'>Category name</div>
            <div className='col-span-2 text-center hidden sm:block'>Products</div>
            <div className='col-span-3 sm:col-span-2 text-center'>Status</div>
            <div className='col-span-3 sm:col-span-2 text-right'>Actions</div>
          </div>
        </div>

        <ScrollArea className='h-[350px] sm:h-[420px]'>
          {displayedCategories.length > 0 ? (
            displayedCategories.map((category, index) => (
              <div
                key={category.id}
                className='grid grid-cols-12 py-3 px-2 sm:px-4 border-t items-center hover:bg-primary/5 transition-colors duration-200 text-sm'
              >
                <div className='col-span-1 hidden sm:block'>{startIndex + index + 1}</div>
                <div className='col-span-6 sm:col-span-5 truncate pr-2'>{category.name}</div>
                <div className='col-span-2 text-center hidden sm:block'>{category.Product.length}</div>
                <div className='col-span-3 sm:col-span-2 text-center'>
                  <Badge
                    variant={category.status === 'active' ? 'default' : 'destructive'}
                    className='px-1 sm:px-2'
                  >
                    {category.status}
                  </Badge>
                </div>
                <div className='col-span-3 sm:col-span-2 text-right'>
                  <div className='flex justify-end gap-1 md:hidden'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='size-7'
                      onClick={() => handleEditClick(category)}
                    >
                      <Pencil size={15} />
                    </Button>
                    {category.status === 'active' ? (
                      <Button
                        variant='ghost'
                        size='icon'
                        className='size-7'
                        onClick={() => handleDeleteClick(category)}
                      >
                        <Trash2 size={15} />
                      </Button>
                    ) : (
                      <Button
                        variant='ghost'
                        size='icon'
                        className='size-7'
                        onClick={() => handleRestoreClick(category)}
                      >
                        <RefreshCcw size={15} />
                      </Button>
                    )}
                  </div>

                  <div className='hidden md:block'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon' className='size-8'>
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem onClick={() => handleEditClick(category)}>
                          <Pencil size={15} />
                          <span>Edit</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {category.status === 'active' ? (
                          <DropdownMenuItem onClick={() => handleDeleteClick(category)}>
                            <Trash2 size={15} className='text-destructive' />
                            <span className='text-destructive'>Delete</span>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleRestoreClick(category)}>
                            <Trash2 size={15} className='text-green-600' />
                            <span className='text-green-600'>Restore</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='flex h-40 items-center justify-center text-sm text-muted-foreground'>
              No categories found
            </div>
          )}
        </ScrollArea>
      </CardContent>

      <div className='border-t px-4 py-4'>
        <PaginationControls
          meta={meta}
          pathname={pathname}
          query={paginationQuery}
          className='justify-end'
        />
      </div>

      <EditCategoryModal
        category={selectedCategory}
        open={isEditModal}
        onOpenChange={setIsEditModal}
      />

      <DeleteCategoryModal
        category={selectedCategory}
        open={isDeleteModal}
        onOpenChange={setIsDeleteModal}
      />

      <RestoreCategoryModal
        category={selectedCategory}
        open={isRestoreModal}
        onOpenChange={setIsRestoreModal}
      />
    </>
  )
}
