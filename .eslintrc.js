const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
  ],
  // add your custom rules here
  rules: {
    indent: 'off',
    'no-unused-vars': [
      isProduction ? 'error' : 'warn',
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
      },
    ],
    'comma-dangle': ['warn', 'always-multiline'],
    'no-console': isProduction ? 'error' : 'warn',
    'no-debugger': isProduction ? 'error' : 'warn',
    semi: isProduction ? ['error', 'never'] : ['warn', 'never'],
    'vue/script-indent': ['error', 2, { baseIndent: 1 }],
  },
}
