import { TableSectionSkeleton } from './table-section-skeleton'

export function OrdersHistorySkeleton() {
  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <div className='h-8 w-60 animate-pulse rounded bg-muted/50' />
        <div className='h-4 w-96 animate-pulse rounded bg-muted/40' />
      </div>
      <div className='space-y-4'>
        {Array.from({ length: 3 }).map((_, index) => (
          <TableSectionSkeleton key={index} rows={4} columns={3} />
        ))}
      </div>
    </div>
  )
}
