const jsx = require('babel-plugin-transform-react-jsx')

module.exports = ({ types: t }) => {
  const JSXSpreadChild = (path) => {
    path.replaceWith(
      t.spreadElement(path.node.expression)
    )
  }

  return {
    inherits: jsx,
    visitor: {
      JSXSpreadChild,
    },
  }
}
