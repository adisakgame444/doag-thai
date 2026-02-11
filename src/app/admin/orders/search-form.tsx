'use client'

import { FormEvent, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { searchOrdersAction } from './actions'

interface OrdersSearchFormProps {
  initialValue?: string
}

export default function OrdersSearchForm({ initialValue = '' }: OrdersSearchFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [keyword, setKeyword] = useState(initialValue)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    startTransition(() => {
      const trimmedKeyword = keyword.trim()
      const currentSearch = searchParams.get('search') ?? ''
      const currentPage = searchParams.get('page')
      const pageSize = searchParams.get('pageSize')

      const isSameSearch = trimmedKeyword === currentSearch

      searchOrdersAction({
        search: trimmedKeyword || null,
        page: isSameSearch ? currentPage : undefined,
        pageSize: pageSize ?? undefined,
      })
        .then((result) => {
          if (result?.redirectUrl) {
            const currentUrl = `${window.location.pathname}${window.location.search}`
            if (result.redirectUrl === currentUrl) {
              router.refresh()
            } else {
              router.push(result.redirectUrl)
            }
          }
        })
        .catch((error) => {
          console.error(error)
        })
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between'
    >
      <div className='space-y-1'>
        <h2 className='text-lg font-semibold text-foreground'>ค้นหาคำสั่งซื้อ</h2>
        <p className='text-sm text-muted-foreground'>พิมพ์เลขคำสั่งซื้อเพื่อค้นหาอย่างรวดเร็ว</p>
      </div>
      <div className='flex w-full max-w-md items-center gap-2'>
        <div className='flex w-full items-center gap-2 rounded-2xl border border-border/60 bg-muted/40 px-3 py-2'>
          <Search className='h-4 w-4 text-muted-foreground' />
          <Input
            name='query'
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder='ระบุเลขคำสั่งซื้อ เช่น ORD123456'
            className='h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0'
          />
        </div>
        <Button type='submit' size='sm' disabled={isPending} aria-busy={isPending}>
          {isPending ? 'กำลังค้นหา...' : 'ค้นหา'}
        </Button>
      </div>
    </form>
  )
}
