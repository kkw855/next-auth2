# Next Auth V5

## TODO
- 타입스크립트 키워드 satisfies
- tsconfig.json 설명 주석 추가하기
- eslint.config.mjs 설명 주석 추가하기

## Getting Started

### Node, NPM 설치
- Node 20.12.2  
- NPM 10.7.0

```bash
npm install -g npm@10.7.0
nvm install 20.12.2
nvm use 20.12.2
```

- Next.js 14.2.3 요구사항 Node.js 18.17 or later.  
- React 18
- TypeScript 5

### 패키지 설치
```bash
npx shadcn-ui@latest init
```

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