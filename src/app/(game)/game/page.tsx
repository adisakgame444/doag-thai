// Fullscreen Game Page - /game route
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/get-session'
import { getSpinQuotaByUserId, getUserSpinConfig } from '@/services/spins'
import { getActiveSpinSlotImages } from '@/services/spin-slot-images'
import SlotGameFullscreen from './slot-game-fullscreen'

export const metadata: Metadata = {
  title: 'Lucky Slot Game',
  description: 'หมุนสปินเพื่อรับรางวัล',
}

export default async function FullscreenGamePage() {
  const session = await getServerSession()
  if (!session?.user) {
    redirect('/sign-in?redirect=/game')
  }

  const quota = await getSpinQuotaByUserId(session.user.id)
  const config = await getUserSpinConfig(session.user.id)
  const slotImages = await getActiveSpinSlotImages()

  return (
    <SlotGameFullscreen
      initialQuota={quota}
      initialConfig={config}
      userId={session.user.id}
      slotImages={slotImages}
    />
  )
}
