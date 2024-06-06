import { Resend } from 'resend'
import { Config, Effect } from 'effect'

const key = Effect.runSync(Config.string('RESEND_API_KEY'))

const resend = new Resend(key)

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:5544/auth/new-verification?token=${token}`

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Confirm your email',
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email</p>`
  })
}
