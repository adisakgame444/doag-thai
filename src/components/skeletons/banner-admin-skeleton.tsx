import { TableSectionSkeleton } from './table-section-skeleton'

export function BannerAdminSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='h-8 w-48 animate-pulse rounded bg-muted/50' />
        <div className='h-10 w-36 animate-pulse rounded bg-muted/40' />
      </div>
      <TableSectionSkeleton rows={5} columns={4} />
    </div>
  )
}
