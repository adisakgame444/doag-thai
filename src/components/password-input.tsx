'use client'

import { Input } from '@/components/ui/input'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState } from 'react'

export function PasswordInput({ ...props }: React.ComponentProps<typeof Input>) {
  const [showPassword, setShowPassword] = useState(false)

  const togglePassword = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className='relative'>
      <Input type={showPassword ? 'text' : 'password'} {...props} />
      <button
        type='button'
        onClick={togglePassword}
        title={showPassword ? 'Hide password' : 'Show password'}
        className='text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transform'
      >
        {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
      </button>
    </div>
  )
}
