# Next Auth V5

## TODO
- 타입스크립트 키워드 satisfies
- tsconfig.json 설명 주석 추가하기
- eslint.config.mjs 설명 주석 추가하기

## Requirements & Setup History

### Node, NPM 설치
- Node 20.12.2  
- NPM 10.7.0

```bash
npm install -g npm@10.7.0
nvm install 20.12.2
nvm use 20.12.2
```

- TypeScript 5
- React 18
- Next.js 14.2.3 요구사항 Node.js 18.17 or later.
- Prisma 5.14.0 요구사항 Node.js v16.13.0 or higher

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
```

## Get Started
.env 파일
```shell
DATABASE_URL=<Neon 데이터 베이스 URL>
```

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

[Next 런타임 환경이 아닌 소스 파일에서도 환경변수 사용 가능하게 만들기](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
[Drizzle 로 생성한 스키마를 Neon 에 적용하기](https://neon.tech/docs/guides/drizzle-migrations)