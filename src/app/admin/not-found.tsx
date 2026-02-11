import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function AdminNotFoundPage() {
  return (
    <div className='flex min-h-[calc(100vh-2rem)] flex-col items-center justify-center rounded-3xl border border-border/60 bg-card/80 p-8 text-center shadow-lg'>
      <div className='space-y-6 max-w-xl'>
        <div className='space-y-2'>
          <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
            404 — Record Not Found
          </p>
          <h1 className='text-3xl font-semibold text-foreground'>
            We can’t find the record you requested.
          </h1>
          <p className='text-sm text-muted-foreground'>
            It may have been removed or never existed. Head back to the dashboard to continue
            managing the shop.
          </p>
        </div>

        <div className='flex flex-col items-center justify-center gap-3 sm:flex-row'>
          <Button asChild className='w-full sm:w-auto'>
            <Link href='/admin'>Back to Dashboard</Link>
          </Button>

          <Button asChild variant='outline' className='w-full sm:w-auto'>
            <Link href='/admin/product'>View Product Catalog</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
