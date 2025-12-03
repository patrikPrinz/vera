// .eslintrc.cjs nebo .eslintrc.js
export default tseslint.config(
  {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: './tsconfig.eslint.json',
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', 'tests/**/*.ts'],
    env: {
      jest: true,
      node: true,
    },
  },
);
