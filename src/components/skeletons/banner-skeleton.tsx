import { cn } from '@/lib/utils'

interface BannerSkeletonProps {
  className?: string
}

export function BannerSkeleton({ className }: BannerSkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse h-48 w-full rounded-3xl border border-border/60 bg-card/70 shadow-inner md:h-56 lg:h-64',
        className
      )}
    >
      <div className='h-full w-full rounded-3xl bg-gradient-to-r from-muted/60 via-muted/40 to-muted/60' />
    </div>
  )
}
