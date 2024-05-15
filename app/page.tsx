'use client'

import { Button } from '@/components/ui/button'
import { LoginButton } from '@/components/auth/login-button'

export default function Home() {
  return (
    <main className='
    h-full
    flex flex-col items-center justify-center
    bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800'>
      <div className='text-center text-white space-y-4'>
        <h1 className='text-6xl font-semibold drop-shadow-md font-poppins'>
          🔐 Auth
        </h1>
        <p className='text-lg'>
          A simple authentication service
        </p>
        <div>
          <LoginButton>
            <Button variant='secondary' size='lg'>
              Sign in
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  )
}
