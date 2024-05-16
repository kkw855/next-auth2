import { object, Output, string, email, minLength } from 'valibot'

// TODO: 다른 사이트에서 참조해서 더 적절한 메시지로 문구 수정하기, 그리고 메시지에 다국어 적용하기
export const Login = object({
  email: string([
    minLength(1, 'Email is required'),
    email('Invalid Email')
  ]),
  password: string([minLength(1, 'Password is required')])
})

export type Login = Output<typeof Login>

export const Register = object({
  email: string([
    minLength(1, 'Email is required'),
    email('Invalid Email')
  ]),
  password: string([minLength(6, 'Minimum 6 characters required')]),
  name: string([minLength(1, 'Name is required')])
})

export type Register = Output<typeof Register>