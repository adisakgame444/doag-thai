import { TableSectionSkeleton } from './table-section-skeleton'

export function CartTableSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='h-8 w-48 animate-pulse rounded bg-muted/50' />
      <TableSectionSkeleton rows={4} columns={4} />
      <div className='flex flex-wrap gap-3'>
        <div className='h-12 w-32 animate-pulse rounded bg-muted/60' />
        <div className='h-12 w-40 animate-pulse rounded bg-muted/40' />
      </div>
    </div>
  )
}
