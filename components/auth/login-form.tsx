'use client'

import { type SubmitHandler, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import CardWrapper from '@/components/auth/card-wrapper'
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

import { Login } from '@/schemas'
import FormError from '@/components/form-error'
import FormSuccess from '@/components/form-success'

const LoginForm = () => {
  const form = useForm<Login>({
    resolver: valibotResolver(Login),
    defaultValues: {
      email: '',
      password: '',
    }
  })
  const { control, handleSubmit } = form
  const onSubmit: SubmitHandler<Login> = (values: Login) => {
    console.log(values)
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
                  type='password'
                  placeholder='******'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormError message='' />
          <FormSuccess message='' />
          <Button
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