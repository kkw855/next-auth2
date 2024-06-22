import type { FC } from 'react'

type Prop = Readonly<{
  label: string
}>

const Header: FC<Prop> = ({ label }) => {
  return (
    <div className="space-y-4 text-center">
      <h1 className="font-poppins text-3xl font-semibold">🔐 Auth</h1>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

export default Header
