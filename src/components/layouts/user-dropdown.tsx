'use client'

import { User } from '@/lib/auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { LogOutIcon, UserIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSignOut } from '@/hooks/use-sign-out'

interface UserDropdownProps {
  user: User
}

export function UserDropdown({ user }: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          {user.image ? (
            <Image
              alt={user.name}
              src={user.image}
              width={16}
              height={16}
              className='rounded-full object-cover'
            />
          ) : (
            <UserIcon />
          )}
          <span className='max-w-[12rem] truncate'>{user.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='/profile'>
            <UserIcon size={16} />
            <span>โปรไฟล์</span>
          </Link>
        </DropdownMenuItem>
        <SignOutItem />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function SignOutItem() {
  const { signOut } = useSignOut()

  return (
    <DropdownMenuItem onClick={signOut}>
      <LogOutIcon size={16} />
      <span>ออกจากระบบ</span>
    </DropdownMenuItem>
  )
}
