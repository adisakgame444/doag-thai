import { CardGridSkeleton } from './card-grid-skeleton'

export function ProductCatalogSkeleton() {
  return (
    <div className='space-y-6'>
      <CardGridSkeleton />
      <div className='flex justify-center gap-3'>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className='h-9 w-20 animate-pulse rounded-full border border-border/50 bg-muted/50'
          />
        ))}
      </div>
    </div>
  )
}
