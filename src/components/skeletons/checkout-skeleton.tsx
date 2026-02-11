import { TableSectionSkeleton } from './table-section-skeleton'

export function CheckoutSkeleton() {
  return (
    <div className='grid gap-8 lg:grid-cols-[1.6fr_1fr]'>
      <div className='space-y-4'>
        <div className='h-8 w-52 animate-pulse rounded bg-muted/50' />
        <TableSectionSkeleton rows={3} columns={3} />
      </div>
      <div className='space-y-4 rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm'>
        <div className='h-6 w-40 animate-pulse rounded bg-muted/50' />
        <div className='space-y-3'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className='h-4 w-full animate-pulse rounded bg-muted/40' />
          ))}
        </div>
        <div className='h-10 w-full animate-pulse rounded bg-muted/60' />
      </div>
    </div>
  )
}
