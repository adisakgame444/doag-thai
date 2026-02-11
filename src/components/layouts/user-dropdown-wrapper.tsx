'use client'

import dynamic from 'next/dynamic'
import { User } from '@/lib/auth'

const UserDropdown = dynamic(
  () => import('@/components/layouts/user-dropdown').then(mod => ({ default: mod.UserDropdown })),
  { ssr: false }
)

interface UserDropdownWrapperProps {
  user: User
}

export function UserDropdownWrapper({ user }: UserDropdownWrapperProps) {
  return <UserDropdown user={user} />
}
