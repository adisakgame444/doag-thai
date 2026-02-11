'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { ChangeEvent } from 'react'

interface DashboardSearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
}

export function DashboardSearchInput({
  value,
  onChange,
  placeholder,
}: DashboardSearchInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  return (
    <div className='relative w-full'>
      <Search size={16} className='absolute left-2 top-2.5 text-muted-foreground' />
      <Input placeholder={placeholder} className='pl-8' value={value} onChange={handleChange} />
    </div>
  )
}
