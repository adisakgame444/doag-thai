'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createCategory } from './actions'
import { toast } from 'sonner'
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

const categorySchema = z.object({
  name: z.string().min(3, 'Category name must be at least 3 characters'),
})

type CategoryValues = z.infer<typeof categorySchema>

export default function CategoryForm() {
  const form = useForm<CategoryValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '' },
  })

  async function onSubmit({ name }: CategoryValues) {
    const { message, error } = await createCategory(name)
    if (error) {
      toast.error(error)
    } else {
      toast.success(message)
    }
    form.reset()
  }

  const loading = form.formState.isSubmitting

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
          <Plus size={18} />
          <span>Add new category</span>
        </CardTitle>
        <CardDescription className='text-xs sm:text-sm'>
          Create a new category for your products
        </CardDescription>
      </CardHeader>

      <CardContent>
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
              Add Category
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
