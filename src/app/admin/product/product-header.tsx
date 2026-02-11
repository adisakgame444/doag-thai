import { Badge } from '@/components/ui/badge'
import { getProductsSummary } from './actions'

export default async function ProductHeader() {
  const { total, active, inactive } = await getProductsSummary()

  return (
    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b'>
      <div className='flex flex-col gap-1'>
        <h1 className='text-2xl sm:text-3xl font-semibold'>
          Product Management
        </h1>
        <p className='text-sm text-muted-foreground'>
          Manage your product inventory and details
        </p>
      </div>

      <div className='flex flex-wrap gap-2 sm:gap-3'>
        <Badge
          variant='outline'
          className='px-2 sm:px-3 py-1 text-xs sm:text-sm'
        >
          <span className='font-semibold text-green-600'>{active}</span>
          Active
        </Badge>

        <Badge
          variant='outline'
          className='px-2 sm:px-3 py-1 text-xs sm:text-sm'
        >
          <span className='font-semibold text-gray-500'>{inactive}</span>
          Inactive
        </Badge>

        <Badge
          variant='outline'
          className='px-2 sm:px-3 py-1 text-xs sm:text-sm'
        >
          <span className='font-semibold text-blue-600'>{total}</span>
          Total
        </Badge>
      </div>
    </div>
  )
}
