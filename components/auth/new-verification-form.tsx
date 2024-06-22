'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { BeatLoader } from 'react-spinners'

import { newVerification } from '@/actions/new-verification'
import CardWrapper from '@/components/auth/card-wrapper'
import FormError from '@/components/form-error'
import FormSuccess from '@/components/form-success'

const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  // TODO: https://nextjs.org/docs/app/api-reference/functions/use-search-params
  const searchParams = useSearchParams()
  const token: string | null = searchParams.get('token')

  const onSubmit = useCallback(() => {
    if (success ?? error) {
      return
    }

    if (!token) {
      setError('Missing token!')
      return
    }

    newVerification(token)
      .then((res) => {
        const { _tag, message } = res
        _tag === 'success' ? setSuccess(message) : setError(message)
      })
      .catch(() => {
        setError('Something went wrong!')
      })
  }, [token, success, error])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center justify-center">
        {!success && !error && <BeatLoader />}
        {/* TODO: 서버 응답(ServerResponse) success, error 하나의 컴포넌트로 처리 가능? */}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  )
}

export default NewVerificationForm
