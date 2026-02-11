'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { PaginationMeta } from '@/lib/pagination'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type SerializableValue = string | number | boolean | null | undefined

interface PaginationControlsProps {
  meta: PaginationMeta
  pathname: string
  query?: Record<string, SerializableValue | SerializableValue[]>
  className?: string
}

function getDisplayedPages(current: number, total: number) {
  const pages = new Set<number>()
  pages.add(current)

  if (current - 1 >= 1) pages.add(current - 1)
  if (current + 1 <= total) pages.add(current + 1)

  pages.add(1)
  pages.add(total)

  return Array.from(pages).sort((a, b) => a - b)
}

function buildSearchParams(
  baseQuery: PaginationControlsProps['query'] = {},
  page: number
) {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(baseQuery)) {
    if (Array.isArray(value)) {
      value.forEach((entry) => {
        if (entry !== undefined && entry !== null && `${entry}`.length > 0) {
          params.append(key, `${entry}`)
        }
      })
    } else if (value !== undefined && value !== null && `${value}`.length > 0) {
      params.set(key, `${value}`)
    }
  }

  if (page > 1) {
    params.set('page', `${page}`)
  } else {
    params.delete('page')
  }

  return params.toString()
}

function buildHref(pathname: string, query: PaginationControlsProps['query'], page: number) {
  const search = buildSearchParams(query, page)
  return search ? `${pathname}?${search}` : pathname
}

export function PaginationControls({ meta, pathname, query, className }: PaginationControlsProps) {
  const { page, totalPages, hasPreviousPage, hasNextPage, totalItems, pageSize } = meta

  if (totalPages <= 1) {
    return null
  }

  // ใช้ useMemo เพื่อป้องกันการคำนวณซ้ำๆ
  const pages = useMemo(() => getDisplayedPages(page, totalPages), [page, totalPages])

  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between', className)}>
      <p className='text-xs text-muted-foreground sm:text-sm'>
        Showing page {page} of {totalPages} ({totalItems.toLocaleString()} items, {pageSize} per page)
      </p>

      <div className='flex items-center gap-1 sm:gap-2'>
        {hasPreviousPage ? (
          <Button asChild variant='outline' size='sm' aria-label='Previous page'>
            <Link href={buildHref(pathname, query, page - 1)}>
              <ChevronLeft className='size-4' />
            </Link>
          </Button>
        ) : (
          <Button variant='outline' size='sm' disabled aria-label='Previous page'>
            <ChevronLeft className='size-4' />
          </Button>
        )}

        {pages.map((pageNumber, index) => {
          const isCurrent = pageNumber === page
          const isEllipsis =
            index > 0 &&
            pageNumber !== pages[index - 1] + 1

          return (
            <div key={pageNumber} className='flex items-center'>
              {isEllipsis && <span className='mx-1 text-xs text-muted-foreground'>…</span>}
              <Button
                asChild
                size='sm'
                variant={isCurrent ? 'default' : 'outline'}
                aria-current={isCurrent ? 'page' : undefined}
              >
                <Link href={buildHref(pathname, query, pageNumber)}>{pageNumber}</Link>
              </Button>
            </div>
          )
        })}

        {hasNextPage ? (
          <Button asChild variant='outline' size='sm' aria-label='Next page'>
            <Link href={buildHref(pathname, query, page + 1)}>
              <ChevronRight className='size-4' />
            </Link>
          </Button>
        ) : (
          <Button variant='outline' size='sm' disabled aria-label='Next page'>
            <ChevronRight className='size-4' />
          </Button>
        )}
      </div>
    </div>
  )
}
