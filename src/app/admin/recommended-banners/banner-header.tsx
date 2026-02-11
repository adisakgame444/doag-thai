export default function BannerHeader() {
  return (
    <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
      <div>
        <h1 className='text-2xl font-semibold text-foreground md:text-3xl'>แบนเนอร์แนะนำ</h1>
        <p className='text-sm text-muted-foreground'>จัดการรูปภาพโปรโมชันที่แสดงบนหน้าแรก</p>
      </div>
    </div>
  )
}
