export type ServerResponse = Readonly<{
  _tag: 'success' | 'error'
  message: string
}>
