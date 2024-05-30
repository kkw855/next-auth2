'use client'

import { type SignInPageErrorParam } from '@auth/core/types'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { login } from '@/actions/login'
import { Login } from '@/schemas'
import CardWrapper from '@/components/auth/card-wrapper'
import FormError from '@/components/form-error'
import FormSuccess from '@/components/form-success'

const LoginForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error') as SignInPageErrorParam === 'OAuthAccountNotLinked'
    ? 'Email already in use with different provider!'
    : ''

  const [ isPending, startTransition ] = useTransition()
  const [ error, setError ] = useState<string | undefined>(undefined)
  const [ success, setSuccess ] = useState<string | undefined>(undefined)

  const form = useForm<Login>({
    resolver: valibotResolver(Login),
    defaultValues: {
      email: '',
      password: '',
    }
  })
  const { control, handleSubmit } = form
  const onSubmit: SubmitHandler<Login> = (values: Login) => {
    setError(undefined)
    setSuccess(undefined)
    // 논블로킹 호출
    // 진행 중인 트랜지션이 여러개 있는 경우 현재 트랜지션을 함께 일괄 처리 한다.
    startTransition(() => {
      // async/await 사용 불가
      // 이 내부에 존재하는 모든 상태 변경이 완료되면 isPending 을 false 로 변환
      // 이 내부에 state 업데이트 중 다른 곳에서 동일한 state 를 set 함수를 호출해서 업데이트하면 여기에 state 업데이트는 중단되고
      // 다른 곳에서 호출한 state 데이터로 업데이트 하고 관련 UI 들을 다시 렌더링 한다.
      login(values)
        .then((res) => {
          // 로그인 실패
          if (res._tag === 'error') { setError(res.message); return }

          // 로그인 성공
          setSuccess(res.message)
          router.push(DEFAULT_LOGIN_REDIRECT)
        })
        .catch(() => {
          // Unknown 에러!!!
          setError('Something went wrong!')
        })
    })
  }

  return (
    <CardWrapper
      headerLabel='Welcome back'
      backButtonLabel="Don't have an account?"
      backButtonHref='/auth/register'
      showSocial
    >
      <Form {...form}>
        <form
          onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
          className='space-y-4'
        >
          <FormField name='email' control={control} render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    type='email'
                    placeholder='john.doe@example.com'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField name='password' control={control} render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete='off'
                  disabled={isPending}
                  type='password'
                  placeholder='******'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormError message={error ?? urlError} />
          <FormSuccess message={success} />
          <Button
            disabled={isPending}
            type='submit'
            className='w-full'
          >
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default LoginForm