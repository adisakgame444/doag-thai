import { StatusChangeModal } from '@/components/admin/status-change-modal'
import { CategoryWithProducts } from '@/types/category'
import { toast } from 'sonner'
import { updateCategoryStatus } from '../actions'

interface EditCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: CategoryWithProducts | null
}

export default function DeleteCategoryModal({
  open,
  onOpenChange,
  category,
}: EditCategoryModalProps) {
  const handleDelete = async () => {
    if (!category?.id) return
    const { message, error } = await updateCategoryStatus(
      category.id,
      'inactive'
    )
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
      title='Delete Category'
      description='Are you sure want to delete the category?'
      confirmLabel='Delete'
      confirmVariant='destructive'
      onConfirm={handleDelete}
    />
  )
}
