import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

import CardWrapper from '@/components/auth/card-wrapper'

const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel='Oops! Something went wrong!'
      backButtonLabel='Back to login'
      backButtonHref='/auth/login'
    >
      <div className='flex w-full justify-center items-center'>
        <ExclamationTriangleIcon className='text-destructive' />
      </div>
    </CardWrapper>
  )
}

export default ErrorCard