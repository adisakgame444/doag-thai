import { cn } from '@/lib/utils'

interface DetailPanelSkeletonProps {
  className?: string
}

export function DetailPanelSkeleton({ className }: DetailPanelSkeletonProps) {
  return (
    <div className={cn('animate-pulse grid gap-6 md:grid-cols-[1.2fr_1fr]', className)}>
      <div className='space-y-4 rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm'>
        <div className='aspect-square w-full rounded-xl bg-muted/60' />
        <div className='grid grid-cols-4 gap-3'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className='h-16 rounded-lg bg-muted/40' />
          ))}
        </div>
      </div>

      <div className='space-y-4 rounded-2xl border border-border/70 bg-card/80 p-6 shadow-sm'>
        <div className='space-y-2'>
          <div className='h-6 w-3/4 rounded bg-muted/60' />
          <div className='h-4 w-1/2 rounded bg-muted/50' />
        </div>
        <div className='space-y-2'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className='h-3 w-full rounded bg-muted/40' />
          ))}
        </div>
        <div className='space-y-3'>
          <div className='h-5 w-24 rounded bg-muted/60' />
          <div className='grid grid-cols-3 gap-3'>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className='h-10 rounded-lg bg-muted/40' />
            ))}
          </div>
        </div>
        <div className='flex gap-3'>
          <div className='h-10 w-32 rounded bg-muted/70' />
          <div className='h-10 w-32 rounded bg-muted/50' />
        </div>
      </div>
    </div>
  )
}
