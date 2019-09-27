const { RuleTester } = require('eslint')

module.exports = {
  getRuleTester: (options) => new RuleTester({
    parserOptions: {
      ecmaVersion: 6
    },
    ...options
  })
}