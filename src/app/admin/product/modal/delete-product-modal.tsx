'use client'

import { StatusChangeModal } from '@/components/admin/status-change-modal'
import { ProductWithMainImage } from '@/types/product'
import { toast } from 'sonner'
import { updateProductStatus } from '../actions'

interface DeleteProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: ProductWithMainImage | null
}

export default function DeleteProductModal({
  open,
  onOpenChange,
  product,
}: DeleteProductModalProps) {
  const handleDelete = async () => {
    if (!product?.id) return
    const { message, error } = await updateProductStatus(product.id, 'inactive')
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
      title='Delete Product'
      description='Are you sure want to delete the product?'
      confirmLabel='Delete'
      confirmVariant='destructive'
      onConfirm={handleDelete}
    />
  )
}
