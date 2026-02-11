import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TableSectionSkeleton } from './table-section-skeleton'

interface AdminListCardSkeletonProps {
  title: string
  rows?: number
  columns?: number
}

export function AdminListCardSkeleton({
  title,
  rows = 5,
  columns = 4,
}: AdminListCardSkeletonProps) {
  return (
    <Card className='border-border/60'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-lg font-semibold text-muted-foreground'>
          <span className='h-5 w-5 animate-pulse rounded-full bg-muted/60' />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TableSectionSkeleton rows={rows} columns={columns} className='border-none p-0 shadow-none' />
      </CardContent>
    </Card>
  )
}
