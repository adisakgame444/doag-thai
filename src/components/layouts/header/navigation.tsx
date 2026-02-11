import { getServerSession } from '@/lib/get-session'
import { MobileMenu } from './mobile-menu'
import { DesktopNavigationLinks } from './navigation-links'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { DesktopMenu } from './desktop-menu'
import { getCartItemsByUser } from '@/services/cart'
import { CartHydrator } from '@/components/cart/cart-hydrator'
import { CartButton } from '@/components/cart/cart-button'

export async function Navigation() {
  const session = await getServerSession()
  const user = session?.user
  const userId = user?.id ?? null
  const cartItems = userId ? await getCartItemsByUser(userId) : []
  const initialCartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <nav className='flex items-center gap-3'>
      <CartHydrator userId={userId} items={cartItems} />
      <CartButton
        className='md:hidden'
        userId={userId}
        items={cartItems}
        isAuthenticated={Boolean(user)}
      />
      <MobileMenu user={user} />

      <div className='hidden md:flex md:items-center'>
        <DesktopNavigationLinks />
        {user ? (
          <div className='flex items-center gap-2'>
            <DesktopMenu user={user} initialCartCount={initialCartCount} />
          </div>
        ) : (
          <Button size='sm' asChild>
            <Link href='/sign-in'>เข้าสู่ระบบ</Link>
          </Button>
        )}
      </div>
    </nav>
  )
}
