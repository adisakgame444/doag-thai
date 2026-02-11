import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { getCategories } from './actions'
import CategoryFiltered from './category-filtered'

interface CategoryListProps {
  page: number
  pageSize: number
  status: 'all' | 'active' | 'inactive'
  search: string
}

export default async function CategoryList({ page, pageSize, status, search }: CategoryListProps) {
  const { items, meta } = await getCategories({ page, pageSize, status, search })

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className='text-lg sm:text-xl'>Category List</CardTitle>
        </CardHeader>

        <CategoryFiltered categories={items} meta={meta} status={status} search={search} />
      </Card>
    </div>
  )
}
