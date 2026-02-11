'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface DashboardStatusTabsProps {
  value: string
  onValueChange: (value: string) => void
  allLabel: string
  activeLabel?: string
  inactiveLabel?: string
  className?: string
}

const DEFAULT_ACTIVE_LABEL = 'Active'
const DEFAULT_INACTIVE_LABEL = 'Inactive'

export function DashboardStatusTabs({
  value,
  onValueChange,
  allLabel,
  activeLabel = DEFAULT_ACTIVE_LABEL,
  inactiveLabel = DEFAULT_INACTIVE_LABEL,
  className,
}: DashboardStatusTabsProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className={className}>
      <TabsList className='grid grid-cols-3 mb-4'>
        <TabsTrigger value='all'>{allLabel}</TabsTrigger>
        <TabsTrigger value='active'>{activeLabel}</TabsTrigger>
        <TabsTrigger value='inactive'>{inactiveLabel}</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
