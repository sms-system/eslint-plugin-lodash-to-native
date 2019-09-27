const SELECTOR = 'CallExpression[callee.object.name=_][callee.property.name=map][arguments.length=2]'

const MESSAGES = {
  COMMON: 'Add additional check for argument type',
  ARRAY_ARG: 'Can be replaced with native map method'
}

function arrayTpl (sourceCode, node) {
  const [ collectionText, fnText ] = node.arguments.map((arg) => sourceCode.getText(arg))
  return `${collectionText}.map(${fnText})`
}

function commonTpl (sourceCode, node) {
  const nodeText = sourceCode.getText(node)
  const collectionText = sourceCode.getText(node.arguments[0])
  return `( Array.isArray(${collectionText}) ?  ${arrayTpl(sourceCode, node)} : ${nodeText} )`
}

function wasWrappedPreviously (sourceCode, node) {
  // TODO! // Implement if block detection
  return (
    node.parent.type === 'ConditionalExpression' &&
    node.parent.test.type === 'CallExpression' &&
    node.parent.test.callee.type === 'MemberExpression' &&
    node.parent.test.callee.object.name === 'Array' &&
    node.parent.test.callee.property.name === 'isArray' &&
    sourceCode.getText(node.parent.test.arguments[0]) === sourceCode.getText(node.arguments[0]) &&
    sourceCode.getText(node.parent.consequent) === arrayTpl(sourceCode, node) &&
    sourceCode.getText(node.parent.alternate) === sourceCode.getText(node)
  )
}

module.exports = {
  meta: {
    type: 'suggestion',
    fixable: 'code'
  },

  create (ctx) {
    const sourceCode = ctx.getSourceCode()

    return {
      [SELECTOR]: (node) => {
        const collection = node.arguments[0]

        switch (collection.type) {
          case 'ObjectExpression':
            // Ignore rule if arg of object type
            return

          case 'ArrayExpression':
            return ctx.report({
              node,
              message: MESSAGES.ARRAY_ARG,
              fix: (fixer) => fixer.replaceText(node, arrayTpl(sourceCode, node))
            })

          default:
            // Ignore rule if we applayed it yet
            if (wasWrappedPreviously(sourceCode, node)) { return }

            return ctx.report({
              node,
              message: MESSAGES.COMMON,
              fix: (fixer) => fixer.replaceText(node, commonTpl(sourceCode, node))
            })
        }
      }
    }
  }
}