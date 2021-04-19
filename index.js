import {convert} from 'unist-util-is'

export function findBefore(parent, index, test) {
  var is = convert(test)

  if (!parent || !parent.type || !parent.children) {
    throw new Error('Expected parent node')
  }

  if (typeof index === 'number') {
    if (index < 0 || index === Number.POSITIVE_INFINITY) {
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
