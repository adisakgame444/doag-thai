import { Metadata } from 'next'
import SignUpForm from './sign-up-form'

export const metadata: Metadata = {
  title: 'สมัครสมาชิก',
  description:
    'ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!',
}

export default function SignUp() {
  return (
    <main className='px-4 md:px-6'>
      <SignUpForm />
    </main>
  )
}
