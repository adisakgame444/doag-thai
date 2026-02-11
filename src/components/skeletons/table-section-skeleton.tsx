import { cn } from '@/lib/utils'

interface TableSectionSkeletonProps {
  rows?: number
  columns?: number
  className?: string
}

export function TableSectionSkeleton({
  rows = 5,
  columns = 4,
  className,
}: TableSectionSkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm',
        className,
      )}
    >
      <div className='mb-4 h-6 w-40 rounded bg-muted/60' />
      <div className='space-y-3'>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className='flex items-center gap-3'>
            {Array.from({ length: columns }).map((__, colIndex) => (
              <div key={colIndex} className='h-4 flex-1 rounded bg-muted/50' />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
