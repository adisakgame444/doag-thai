import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: ReactNode
  description?: ReactNode
  trend?: {
    value: string
    positive?: boolean
  }
}

export function StatCard({ title, value, description, trend }: StatCardProps) {
  return (
    <div className='rounded-2xl border border-border/60 bg-card p-4 shadow-sm'>
      <div className='space-y-2'>
        <p className='text-sm font-medium text-muted-foreground'>{title}</p>
        <div className='text-2xl font-semibold text-foreground'>{value}</div>
        {description && <p className='text-sm text-muted-foreground'>{description}</p>}
        {trend && (
          <span
            className={`inline-flex items-center text-xs font-medium ${trend.positive ? 'text-emerald-600' : 'text-destructive'}`}
          >
            {trend.value}
          </span>
        )}
      </div>
    </div>
  )
}
