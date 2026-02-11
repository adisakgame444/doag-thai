import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <div className='flex flex-1 items-center justify-center px-6 py-16 text-center'>
      <div className='max-w-lg space-y-6 rounded-2xl border border-border/40 bg-card/80 p-8 shadow-xl backdrop-blur'>
        <div className='space-y-2'>
          <p className='text-xs font-medium uppercase tracking-[0.3em] text-primary'>
            404 — Page Not Found
          </p>
          <h1 className='text-3xl font-semibold tracking-tight text-foreground'>
            Looks like this page went up in smoke.
          </h1>
          <p className='text-sm text-muted-foreground'>
            The product or page you’re after doesn’t exist anymore. Browse the storefront to find
            something that fits just right.
          </p>
        </div>

        <div className='flex flex-col items-center justify-center gap-3 sm:flex-row'>
          <Button asChild className='w-full sm:w-auto'>
            <Link href='/'>Back to Home</Link>
          </Button>

          <Button asChild variant='outline' className='w-full sm:w-auto'>
            <Link href='/products'>Browse Products</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
