import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { getProducts } from './actions'
import ProductFiltered from './product-filtered'

interface ProductListProps {
  page: number
  pageSize: number
  status: 'all' | 'active' | 'inactive'
  search: string
}

export default async function ProductList({ page, pageSize, status, search }: ProductListProps) {
  const { items, meta } = await getProducts({ page, pageSize, status, search })

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg sm:text-xl'>Product List</CardTitle>
          <Button asChild>
            <Link href='/admin/product/new'>
              <Plus size={16} />
              <span>Add Product</span>
            </Link>
          </Button>
        </div>
      </CardHeader>

      <ProductFiltered products={items} meta={meta} status={status} search={search} />
    </Card>
  )
}
