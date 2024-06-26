import * as v from 'valibot'

// TODO: 다른 사이트에서 참조해서 더 적절한 메시지로 문구 수정하기, 그리고 메시지에 다국어 적용하기

export const NewPassword = v.object({
  password: v.pipe(
    v.string(),
    v.minLength(6, 'Minimum 6 characters is required'),
  ),
})
export type NewPassword = v.InferOutput<typeof NewPassword>

export const Reset = v.object({
  email: v.pipe(
    v.string(),
    v.minLength(1, 'Email is required'),
    v.email('Invalid Email'),
  ),
})
export type Reset = v.InferOutput<typeof Reset>

export const Login = v.object({
  email: v.pipe(
    v.string(),
    v.minLength(1, 'Email is required'),
    v.email('Invalid Email'),
  ),
  password: v.pipe(v.string(), v.minLength(1, 'Password is required')),
})
export type Login = v.InferOutput<typeof Login>

export const Register = v.object({
  email: v.pipe(
    v.string(),
    v.minLength(1, 'Email is required'),
    v.email('Invalid Email'),
  ),
  password: v.pipe(v.string(), v.minLength(6, 'Minimum 6 characters required')),
  name: v.pipe(v.string(), v.minLength(1, 'Name is required')),
})
export type Register = v.InferOutput<typeof Register>
