const RULES = {
  OFF: 'off',
  WARN: 'warn',
  ERROR: 'error'
}

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'standard',
    'plugin:react/recommended'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'react'
  ],
  rules: {
    indent: [1, 2, { SwitchCase: 1 }],
    'no-undef': RULES.OFF,
    'no-unused-vars': RULES.WARN,
    'react/jsx-boolean-value': RULES.OFF,
    'react/jsx-first-prop-new-line': RULES.OFF,
    'react/prop-types': RULES.OFF,
    'react/react-in-jsx-scope': RULES.OFF
  }
}
