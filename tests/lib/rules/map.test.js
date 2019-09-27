const { getRuleTester } = require('../../helper')
const rule = require('../../../lib/rules/map')

const ruleTester = getRuleTester()

ruleTester.run('map', rule, {
  valid: [
    // Argument is of object type
    `_.map({a: 1, b: 2}, fn)`,

    // Allready replaced
    `( Array.isArray(a) ? a.map(function(x) {return x.f()}) : _.map(a, function(x) {return x.f()}) )`
  ],
  invalid: [
    { code: '_.map([  ], fn)',
      errors: [{ message: 'Can be replaced with native map method' }] },

    { code: '_.map(a, fn)',
      errors: [{ message: 'Add additional check for argument type' }] }
  ]
})