import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  astro: true,
  rules: {
    'no-console': [
      'error',
      { allow: ['log', 'warn', 'error', 'info', 'time', 'timeEnd'] },
    ],
    'style/multiline-ternary': 'off',
    'prefer-promise-reject-errors': 'off',
    'jsdoc/require-returns-description': 'off',
    'ts/method-signature-style': 'off',
    'ts/no-unsafe-function-type': 'off',
    'no-unreachable-loop': 'off',
    'eqeqeq': 'off',
    'no-cond-assign': 'off',
    'no-sequences': 'off',
    'default-case-last': 'off',
  },
})
