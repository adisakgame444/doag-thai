import { ThemeToggle } from '@/components/theme-toggle'
import { SidebarTrigger } from '@/components/ui/sidebar'
import Link from 'next/link'
import { UserDropdownWrapper } from '@/components/layouts/user-dropdown-wrapper'
import { getServerSession } from '@/lib/get-session'

export default async function Navbar() {
  const session = await getServerSession()
  const user = session?.user

  if (!user) return null

  return (
    <header className='sticky top-0 z-50 w-full py-1 border-b bg-background'>
      <div className='flex items-center justify-between p-3.5'>
        <div className='flex items-center gap-2'>
          <SidebarTrigger />
          <Link href='/admin'>Dashboard</Link>
        </div>
        <div className='flex items-center gap-2'>
          <ThemeToggle />
          <UserDropdownWrapper user={user} />
        </div>
      </div>
    </header>
  )
}
