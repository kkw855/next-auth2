import { NextResponse } from 'next/server'

import { auth } from '@/auth'
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from '@/routes'

// 미들웨어 함수
export default auth((req) => {
  const { nextUrl } = req
  const isLogged = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  console.log('ROUTE:', nextUrl.pathname)
  console.log('IS LOGGED:', isLogged, req.auth)

  // 인증 관련 API 호출은 모두 승인
  if (isApiAuthRoute) return NextResponse.next()

  // 로그 아웃 상태일 때만 로그인, 계정 생성 페이지에 접근 가능
  if (isAuthRoute) {
    return isLogged
      ? Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl)) // 함수에 두 번째 파라미터를 전달해서 상대 경로가 아닌 절대 경로 URL 생성
      : NextResponse.next()
  }

  // 인증이 필요한 페이지에 접근할 때
  if (!isLogged && !isPublicRoute) return Response.redirect(new URL('/auth/login', nextUrl))

  return NextResponse.next()
})

// matcher 에 설정된 URL 과 일치하면 미들웨어 함수를 호출한다.
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}