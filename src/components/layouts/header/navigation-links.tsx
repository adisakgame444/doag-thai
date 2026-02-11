'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { SheetClose } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { NAVIGATION_ITEMS, isActivePath } from './navigation.config'

export function MobileNavigationLinks() {
  const pathname = usePathname()

  return (
    <div className='flex flex-col gap-2'>
      {NAVIGATION_ITEMS.map((link) => {
        const Icon = link.icon
        const active = isActivePath(pathname, link.href)

        return (
          <SheetClose key={link.href} asChild>
            <Button
              variant={active ? 'default' : 'secondary'}
              size='lg'
              className={cn(
                'group justify-start gap-3 rounded-xl text-base shadow-sm transition',
                active
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-muted/60 text-foreground hover:bg-muted'
              )}
              asChild
            >
              <Link href={link.href} className='flex w-full items-center gap-3'>
                <Icon
                  size={18}
                  className={cn(
                    'transition-colors',
                    active ? 'text-primary-foreground' : 'text-primary'
                  )}
                />
                <span>{link.title}</span>
              </Link>
            </Button>
          </SheetClose>
        )
      })}
    </div>
  )
}

export function DesktopNavigationLinks() {
  const pathname = usePathname()

  return (
    <div className='flex items-center gap-1 rounded-full bg-muted/40 p-1'>
      {NAVIGATION_ITEMS.map((link) => {
        const active = isActivePath(pathname, link.href)

        return (
          <Button
            key={link.href}
            variant={active ? 'default' : 'ghost'}
            size='sm'
            className={cn(
              'rounded-full px-4 font-medium transition',
              active
                ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90'
                : 'text-muted-foreground hover:text-primary'
            )}
            asChild
          >
            <Link href={link.href}>{link.title}</Link>
          </Button>
        )
      })}
    </div>
  )
}
