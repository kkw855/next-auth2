// noinspection JSCheckFunctionSignatures

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactRecommended from 'eslint-plugin-react/configs/recommended.js'
import jsxRuntime from 'eslint-plugin-react/configs/jsx-runtime.js'
import reactHooks from 'eslint-plugin-react-hooks'
import next from '@next/eslint-plugin-next'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tseslint.config(
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    ...reactRecommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      ...reactRecommended.languageOptions,
    },
  },
  jsxRuntime,
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: reactHooks.configs.recommended.rules,
  },
  {
    plugins: {
      '@next/next': next,
    },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,
      // TypeError: context.getAncestors is not a function
      '@next/next/no-duplicate-head': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        plugins: {
          '@next/next': {
            rules: next.configs['core-web-vitals'].rules,
            configs: next.configs,
          },
        },
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // React 만 사용할 때 유용. Next.js Server 작업을 고려하지는 않음.
      '@typescript-eslint/no-misused-promises': 'off',

      // 타입스크립트 타입을 정의할 때 type or interface 키워드 중 하나만 사용하게 설정
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },
  eslintConfigPrettier,
  {
    // ESLint 에서 제외할 리스트
    ignores: ['.next', '*.mjs', 'vite.config.ts', 'tailwind.config.ts'],
  },
)
