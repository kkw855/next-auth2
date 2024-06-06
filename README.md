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
- 두 개 이상의 Production 인스턴스 & nginx

## Requirements & Setup History

### Node, NPM 설치
- Node 20.12.2
- NPM 10.7.0

```bash
npm install -g npm@10.7.0
nvm install 20.12.2
nvm use 20.12.2
```

- TypeScript v5
- React v18
- Next.js v14.2.3 요구사항 Node.js v18.17 or later.
- Prisma v5.14.0 요구사항 Node.js v16.13.0 or higher

### 패키지 설치
```bash
npx shadcn-ui@latest init
npm install react-icons
npm install valibot
npm install effect
npm install @paralleldrive/cuid2
npm install @next/env

npm uninstall react react-dom @types/react @types/react-dom
npm install react@latest react-dom@latest
npm install --save-dev @types/react@latest @types/react-dom@latest
npm install drizzle-orm @neondatabase/serverless
npm install --save-dev drizzle-kit
npm install @auth/drizzle-adapter

npm install bcrypt
npm install --save-dev @types/bcrypt

npm install next-auth@beta
```

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

실행하기
```bash
npm install

npm run db:generate   # 마이그레이션 파일 생성
npm run db:migrate    # 마이그레이션 파일을 기반으로 Neon 데이터베이스 스키마 업데이트

npm run dev           # 앱 실행  
```
브라우저에서 localhost:5544 로 접속

## Keep Dependencies Up-To-Date
npm-check-updates 패키지 사용 
```bash
# npm-check-updates 패키지 설치
npm install -g npm-check-updates      

# old 버전 패키지 확인
ncu

# 모든 패키지를 latest 버전으로 업그레이드. package.json 파일만 수정하므로 이후에 
# 반드시 npm install 명령으로 실제 패키지를 설치해야 함
ncu --upgrade 
```

## Migration from ESLint legacy to ESLint flat
아직 Next.js 에서 새로운 ESLint flat config format 을 지원하지 않아서 수동으로 직접 설정해야 한다.
```bash
npm uninstall eslint typescript eslint-config-next

npm install --save-dev eslint @eslint/js typescript typescript-eslint

npm install --save-dev eslint-plugin-react eslint-plugin-react-hooks @next/eslint-plugin-next
```
[How to use new "flat config" approach in Eslint?](https://github.com/vercel/next.js/discussions/49337)

## Etc
[크롬 확장 프로그램 localhost 에서 실행 못 하게 설정](https://m.blog.naver.com/toruin84/223163171025)

[ESLint: 'className' is missing in props validation(react/prop-types)](https://github.com/jsx-eslint/eslint-plugin-react/issues/3284#issuecomment-2021754931)
[Next 런타임 환경이 아닌 소스 파일에서도 환경변수 사용 가능하게 만들기](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
[Drizzle 로 생성한 스키마를 Neon 에 적용하기](https://neon.tech/docs/guides/drizzle-migrations)
[Auth.js 리다이렉트 사용할 때 Error: NEXT_REDIRECT](https://github.com/nextauthjs/next-auth/discussions/9389#discussioncomment-9477692)