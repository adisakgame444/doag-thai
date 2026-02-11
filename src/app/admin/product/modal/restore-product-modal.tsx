'use client'

import { StatusChangeModal } from '@/components/admin/status-change-modal'
import { ProductWithMainImage } from '@/types/product'
import { toast } from 'sonner'
import { updateProductStatus } from '../actions'

interface RestoreProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: ProductWithMainImage | null
}

export default function RestoreProductModal({
  open,
  onOpenChange,
  product,
}: RestoreProductModalProps) {
  const handleRestore = async () => {
    if (!product?.id) return
    const { message, error } = await updateProductStatus(product.id, 'active')
    if (error) {
      toast.error(error)
      return
    }
    toast.success(message)
    onOpenChange(false)
  }

  return (
    <StatusChangeModal
      open={open}
      onOpenChange={onOpenChange}
      title='Restore Product'
      description='Are you sure want to restore the product?'
      confirmLabel='Restore'
      onConfirm={handleRestore}
    />
  )
}
