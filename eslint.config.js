import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  rules: {
    'unused-imports/no-unused-vars': 'off', // off for now
    '@typescript-eslint/no-unused-vars': 'off', // off for now
    'node/prefer-global/process': 'off', // off for now
  },
})
