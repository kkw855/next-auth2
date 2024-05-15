import type { FC } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Prop = Readonly<{
  label: string
  href: string
}>

const BackButton: FC<Prop> = ({
  href,
  label
}) => {
  return (
    <Button
      variant='link'
      className='font-normal'
      size='sm'
      asChild
    >
      <Link href={href}>
        {label}
      </Link>
    </Button>
  )
}

export default BackButton