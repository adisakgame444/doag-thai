import { CardGridSkeleton } from './card-grid-skeleton'

export function HomeFeatureSkeleton() {
  return (
    <section className='container mx-auto space-y-4 px-4 py-4'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='h-10 w-44 animate-pulse rounded-full bg-muted/50' />
        <div className='h-10 w-64 animate-pulse rounded-full bg-muted/40' />
        <div className='h-9 w-32 animate-pulse rounded-full bg-muted/50' />
      </div>
      <div className='h-8 w-full animate-pulse rounded bg-muted/40' />
      <CardGridSkeleton />
    </section>
  )
}
