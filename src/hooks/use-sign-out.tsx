import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useSignOut() {
  const router = useRouter()

  const signOut = async () => {
    const { error } = await authClient.signOut()
    if (error) {
      toast.error(error.message || 'Something went wrong')
    } else {
      toast.success('ออกจากระบบสำเร็จ')
      router.push('/sign-in')
    }
  }

  return { signOut }
}
