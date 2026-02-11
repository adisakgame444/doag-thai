import { cn } from '@/lib/utils'

interface CardGridSkeletonProps {
  count?: number
  className?: string
}

export function CardGridSkeleton({ count = 8, className }: CardGridSkeletonProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className='animate-pulse space-y-3 rounded-2xl border border-border/60 bg-card/70 p-3 shadow-sm'
        >
          <div className='h-32 rounded-xl bg-muted/60 sm:h-40 md:h-48' />
          <div className='space-y-2'>
            <div className='h-4 w-3/4 rounded bg-muted/70' />
            <div className='h-3 w-1/2 rounded bg-muted/50' />
          </div>
          <div className='flex items-center justify-between'>
            <span className='h-4 w-16 rounded bg-muted/60' />
            <span className='h-8 w-20 rounded bg-muted/80' />
          </div>
        </div>
      ))}
    </div>
  )
}
