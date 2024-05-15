import type { FC, ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import Header from '@/components/auth/header'
import Social from '@/components/auth/social'
import BackButton from '@/components/auth/back-button'

type Prop = Readonly<{
  children: ReactNode
  headerLabel: string
  backButtonLabel: string
  backButtonHref: string
  showSocial?: boolean
}>

const CardWrapper: FC<Prop> = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial
}) => {
  return (
    <Card className='w-[400px] shadow-md'>
      <CardHeader>
        <Header
          label={headerLabel}
        />
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter className='justify-center'>
        <BackButton
          label={backButtonLabel}
          href={backButtonHref}
        />
      </CardFooter>
    </Card>
  )
}

export default CardWrapper