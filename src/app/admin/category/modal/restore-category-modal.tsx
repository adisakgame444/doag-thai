import { StatusChangeModal } from '@/components/admin/status-change-modal'
import { CategoryWithProducts } from '@/types/category'
import { toast } from 'sonner'
import { updateCategoryStatus } from '../actions'

interface EditCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: CategoryWithProducts | null
}

export default function RestoreCategoryModal({
  open,
  onOpenChange,
  category,
}: EditCategoryModalProps) {
  const handleRestore = async () => {
    if (!category?.id) return
    const { message, error } = await updateCategoryStatus(category.id, 'active')
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
      title='Restore Category'
      description='Are you sure want to restore the category?'
      confirmLabel='Restore'
      onConfirm={handleRestore}
    />
  )
}
