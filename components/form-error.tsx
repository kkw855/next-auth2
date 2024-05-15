import type { FC } from 'react'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

type Prop = Readonly<{
  message?: string
}>

const FormError: FC<Prop> = ({ message }) => {
  if (!message) return null

  return (
    <div className='flex items-center gap-2
      p-3 rounded-md text-sm
      text-destructive bg-destructive/15'
    >
      <ExclamationTriangleIcon className='h-4 w-4' />
      <p>{message}</p>
    </div>
  )
}

export default FormError