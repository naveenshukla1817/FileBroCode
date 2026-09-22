import nextVitals from 'eslint-config-next/core-web-vitals'

export default [
  ...nextVitals,
  {
    ignores: ['node_modules/**', '.next/**', 'out/**'],
  },
  {
    rules: {
      // FileBroCode intentionally uses effects for browser-only File/Blob loading and cleanup.
      // This rule is overly restrictive for that lifecycle and would turn valid viewer logic into lint errors.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]
