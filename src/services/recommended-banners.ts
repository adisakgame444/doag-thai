import db from '@/lib/db'
import { uploadToImageKit } from '@/lib/imagekit'
import { getRecommendedBannerById, revalidateRecommendedBanners } from '@/lib/recommended-banners'

type CreateBannerInput = {
  name?: string | null
  file: File
}

type UpdateBannerInput = {
  id: string
  name?: string | null
  file?: File | null
}

function normalizeName(name?: string | null) {
  const trimmed = name?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : null
}

export async function listRecommendedBanners() {
  return db.recommendedBanner.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function createRecommendedBanner({ name, file }: CreateBannerInput) {
  const { url, fileId, message } = await uploadToImageKit(file, 'recommended-banners')

  if (message || !url || !fileId) {
    throw new Error(message ?? 'ไม่สามารถอัปโหลดรูปภาพได้')
  }

  const created = await db.recommendedBanner.create({
    data: {
      name: normalizeName(name),
      imageUrl: url,
      fileId,
    },
  })

  revalidateRecommendedBanners()
  return created
}

export async function updateRecommendedBanner({ id, name, file }: UpdateBannerInput) {
  const existing = await getRecommendedBannerById(id)

  if (!existing) {
    throw new Error('ไม่พบแบนเนอร์ที่ต้องการแก้ไข')
  }

  let nextImageUrl = existing.imageUrl
  let nextFileId = existing.fileId

  if (file) {
    const { url, fileId, message } = await uploadToImageKit(file, 'recommended-banners')

    if (message || !url || !fileId) {
      throw new Error(message ?? 'ไม่สามารถอัปโหลดรูปภาพได้')
    }

    nextImageUrl = url
    nextFileId = fileId
  }

  const updated = await db.recommendedBanner.update({
    where: { id },
    data: {
      name: normalizeName(name),
      imageUrl: nextImageUrl,
      fileId: nextFileId,
    },
  })

  revalidateRecommendedBanners()
  return updated
}

export async function deleteRecommendedBanner(id: string) {
  await db.recommendedBanner.delete({ where: { id } })
  revalidateRecommendedBanners()
}

export async function updateRecommendedBannerOrder(order: 'newest' | 'oldest') {
  // Placeholder for future ordering logic (e.g., priority field)
  await db.recommendedBanner.findMany({
    orderBy: {
      createdAt: order === 'newest' ? 'desc' : 'asc',
    },
  })

  revalidateRecommendedBanners()
}

