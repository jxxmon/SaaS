import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 지원 언어 목록
const supportedLanguages = ['ko', 'ja'] as const
type SupportedLanguage = typeof supportedLanguages[number]

// 기본 언어
const defaultLanguage: SupportedLanguage = 'ko'

// 언어 감지 및 리다이렉트 미들웨어
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 정적 파일, API 경로, 이미 설정된 언어 경로는 건너뛰기
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.match(/^\/(ko|ja)(\/|$)/)
  ) {
    return NextResponse.next()
  }

  // 언어 감지 (우선순위: 쿠키 > Accept-Language 헤더 > 기본 언어)
  let language: SupportedLanguage = defaultLanguage
  
  // 쿠키에서 언어 확인
  const cookieLanguage = request.cookies.get('language')?.value
  if (cookieLanguage && supportedLanguages.includes(cookieLanguage as SupportedLanguage)) {
    language = cookieLanguage as SupportedLanguage
  } else {
    // Accept-Language 헤더에서 언어 감지
    const acceptLanguage = request.headers.get('accept-language')
    if (acceptLanguage) {
      // 언어 태그 파싱 (예: 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7')
      const languages = acceptLanguage.split(',').map(lang => {
        const [code] = lang.split(';')
        return code.trim().split('-')[0].toLowerCase()
      })
      
      // 지원 언어 중 첫 번째 매칭 찾기
      for (const lang of languages) {
        if (supportedLanguages.includes(lang as SupportedLanguage)) {
          language = lang as SupportedLanguage
          break
        }
      }
    }
  }

  // 언어 경로로 리다이렉트
  const newUrl = new URL(, request.url)
  
  // 언어 쿠키 설정 (30일 유지)
  const response = NextResponse.redirect(newUrl)
  response.cookies.set('language', language, {
    maxAge: 60 * 60 * 24 * 30, // 30일
    path: '/',
    sameSite: 'lax'
  })
  
  return response
}

// 미들웨어 적용 경로 설정
export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 요청에 미들웨어 적용:
     * - api (API 경로)
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화)
     * - favicon.ico, robots.txt
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)',
  ],
}
