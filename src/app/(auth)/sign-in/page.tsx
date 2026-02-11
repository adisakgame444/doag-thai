import { Metadata } from 'next'
import SignInForm from './sign-in-form'

export const metadata: Metadata = {
  title: 'เข้าสู่ระบบ',
  description:
    'ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!',
}

export default function SignIn() {
  return (
    <main className='px-4 md:px-6'>
      <SignInForm />
    </main>
  )
}
