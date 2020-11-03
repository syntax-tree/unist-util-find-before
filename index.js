'use strict'

var convert = require('unist-util-is/convert')

module.exports = findBefore

function findBefore(parent, index, test) {
  var is = convert(test)

  if (!parent || !parent.type || !parent.children) {
    throw new Error('Expected parent node')
  }

  if (typeof index === 'number') {
    if (index < 0 || index === Infinity) {
      throw new Error('Expected positive finite number as index')
    }
  } else {
    index = parent.children.indexOf(index)

    if (index < 0) {
      throw new Error('Expected child node or index')
    }
  }

  // Performance.
  if (index > parent.children.length) {
    index = parent.children.length
  }

  while (index--) {
    if (is(parent.children[index], index, parent)) {
      return parent.children[index]
    }
  }

  return null
}
