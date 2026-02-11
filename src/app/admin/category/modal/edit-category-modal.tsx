import Modal from '@/components/modal'
import { CategoryWithProducts } from '@/types/category'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateCategory } from '../actions'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/loading-button'

interface EditCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: CategoryWithProducts | null
}

const categorySchema = z.object({
  name: z.string().min(3, 'Category name must be at least 3 characters'),
})

type CategoryValues = z.infer<typeof categorySchema>

export default function EditCategoryModal({
  open,
  onOpenChange,
  category,
}: EditCategoryModalProps) {
  const form = useForm<CategoryValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '' },
  })

  async function onSubmit({ name }: CategoryValues) {
    if (!category) return
    const { message, error } = await updateCategory(category.id, name)
    if (error) {
      toast.error(error)
    } else {
      toast.success(message)
      onOpenChange(false)
    }
    form.reset()
  }

  const loading = form.formState.isSubmitting

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title='Update Category'
      description='Update your category information'
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton type='submit' className='w-full' loading={loading}>
            Update Category
          </LoadingButton>
        </form>
      </Form>
    </Modal>
  )
}
