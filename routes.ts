/**
 * 인증이 필요없는 public 페이지 리스트
 */
export const publicRoutes: string[] = [
  '/',
]

/**
 * 로그인 상태면 Redirect 가 필요한 페이지 리스트
 */
export const authRoutes: string[] = [
  '/auth/login',
  '/auth/register',
]

/**
 * 해당 URL 로 시작하면 인증을 위한 API
 */
export const apiAuthPrefix = '/api/auth'

/**
 * 로그인 상태면 Redirect 할 URL
 */
export const DEFAULT_LOGIN_REDIRECT = '/settings'