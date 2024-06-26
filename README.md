# Next Auth V5

## Features
- 👥 User Roles
- 🔑 Credentials 이메일, 비밀번호
- 🌐 OAuth Google, GitHub

## TODO
- 단순 string 이 아닌 email 타입(etc Brand 데이터 타입) 사용하기 
- Date 대신 dayjs 사용하기
- Network First. DB 접속 안될 때 에러 처리하기
- PlayWrite 로 테스트 케이스 작성
- Next 14 App Router 다국어 적용하기
- valibot 에러 메시지에 다국어 적용하기
- WebStorm -> Intellij 사용으로 변경하기
- ~~타입스크립트 키워드 satisfies~~
- tsconfig.json 설명 주석 추가하기
- eslint.config.mjs 설명 주석 추가하기
- Production 배포하기


## Get Started
- [Neon Database 생성 방법](https://youtu.be/1MTyCvS05V4?si=i_ySKrYdUkT6PndY&t=6285)  
- [GitHub, Google Client ID, secret 생성 방법](https://youtu.be/1MTyCvS05V4?si=BIS2j_AhBhJPraFx&t=12144)  
- [이메일 발송 기능을 위해서 resend.com 계정 생성 및 설정 방법](https://youtu.be/1MTyCvS05V4?si=11wSLdQjc_7Mj_3x&t=14919)

.env 파일
```shell
# Neon Postgresql URL
DATABASE_URL=<Neon 데이터 베이스 URL>

# Auth.js 가 토큰 해싱, 이메일 인증 해싱을 하는데 사용한다.
AUTH_SECRET=<npx auth secret 명령으로 생성한 키 입력>

RESEND_API_KEY=

GITHUB_ID=
GITHUB_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

```bash
pnpm install

pnpm run db:generate   # 마이그레이션 파일 생성
pnpm run db:migrate    # 마이그레이션 파일을 기반으로 Neon 데이터베이스 스키마 업데이트

pnpm run dev           # 앱 실행  
```
브라우저에서 localhost:5544 로 접속

## Etc
