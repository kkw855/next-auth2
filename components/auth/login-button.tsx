'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'

type LoginButton = {
  children: ReactNode
  mode?: 'modal' | 'redirect'
  asChild?: boolean
}

export const LoginButton = ({ children, mode }: LoginButton) => {
  const router = useRouter()

  const onClick = () => {
    router.push('/auth/login')
  }

  if (mode === 'modal') {
    return <span>TODO: Implement modal</span>
  }

  return (
    <span className="inline-block" onClick={onClick}>
      {children}
    </span>
  )
}
