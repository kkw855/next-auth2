import * as z from 'zod'

// TODO: 다른 사이트에서 참조해서 더 적절한 메시지로 문구 수정하기, 그리고 메시지에 다국어 적용하기

export const NewPassword = z.object({
  password: z.string().min(1, {
    message: 'Minimum 6 characters is required',
  }),
})
export type NewPassword = z.infer<typeof NewPassword>

export const Reset = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
})
export type Reset = z.infer<typeof Reset>

export const Login = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string({ message: 'Password is required' }),
})
export type Login = z.infer<typeof Login>

export const Register = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string({ message: 'Password is required' }),
  name: z.string({ message: 'Name is required' }),
})
export type Register = z.infer<typeof Register>
