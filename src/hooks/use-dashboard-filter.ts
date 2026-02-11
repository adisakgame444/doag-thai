import { useMemo, useState } from 'react'

type StatusValue = 'all' | 'active' | 'inactive'

interface UseDashboardFilterOptions<T> {
  items: T[]
  getStatus: (item: T) => StatusValue | string
  getSearchValue: (item: T) => string
}

export function useDashboardFilter<T>({
  items,
  getStatus,
  getSearchValue,
}: UseDashboardFilterOptions<T>) {
  const [activeStatus, setActiveStatus] = useState<StatusValue>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const normalizedTerm = searchTerm.trim().toLowerCase()

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const status = getStatus(item)
      if (activeStatus !== 'all' && status !== activeStatus) {
        return false
      }

      if (!normalizedTerm) {
        return true
      }

      const searchValue = getSearchValue(item).toLowerCase()
      return searchValue.includes(normalizedTerm)
    })
  }, [items, getStatus, getSearchValue, activeStatus, normalizedTerm])

  return {
    filteredItems,
    activeStatus,
    setActiveStatus,
    searchTerm,
    setSearchTerm,
  }
}
