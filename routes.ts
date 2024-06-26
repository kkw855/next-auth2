/**
 * 인증이 필요없는 public 페이지 리스트
 */
export const publicRoutes: string[] = ['/', '/auth/new-verification']

/**
 * 로그인 상태면 Default 페이지로 이동
 * 비로그인 상태면 해당 페이지로 이동
 */
export const authRoutes: string[] = [
  '/auth/login',
  '/auth/register',
  '/auth/error',
  '/auth/reset',
  '/auth/new-password',
]

/**
 * 해당 URL 로 시작하면 인증을 위한 API
 */
export const apiAuthPrefix = '/api/auth'

/**
 * 로그인 상태면 Redirect 할 URL
 */
export const DEFAULT_LOGIN_REDIRECT = '/settings'
