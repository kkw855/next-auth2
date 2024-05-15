import type { FC } from 'react'
import { CheckCircledIcon } from '@radix-ui/react-icons'

type Prop = Readonly<{
  message?: string
}>

const FormError: FC<Prop> = ({ message }) => {
  if (!message) return null

  return (
    <div className='flex items-center gap-2
      p-3 rounded-md text-sm
      text-emerald-500 bg-emerald-500/15'
    >
      <CheckCircledIcon className='h-4 w-4' />
      <p>{message}</p>
    </div>
  )
}

export default FormError