import { getServerSession } from './get-session'
import { forbidden, unauthorized } from 'next/navigation'

export async function assertAdminUser() {
  const session = await getServerSession()
  const user = session?.user

  if (!user) unauthorized()
  if (user.role !== 'admin') forbidden()

  return user
}
