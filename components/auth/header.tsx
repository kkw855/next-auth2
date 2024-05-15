import type { FC } from 'react'

type Prop = Readonly<{
  label: string
}>

const Header: FC<Prop> = ({ label }) => {
  return (
    <div className='text-center space-y-4'>
      <h1 className='font-poppins text-3xl font-semibold'>
        🔐 Auth
      </h1>
      <p className='text-muted-foreground text-sm'>
        {label}
      </p>
    </div>
  )
}

export default Header