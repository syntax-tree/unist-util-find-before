/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 * @typedef {import('unist-util-is').Test} Test
 */

import {convert} from 'unist-util-is'

/**
 * Find the first node in `parent` before another `node` or before an index,
 * that passes `test`.
 *
 * @template {Node} Kind
 *   Node type.
 *
 * @overload
 * @param {Parent} parent
 * @param {Node | number} index
 * @param {import('unist-util-is').Test} test
 * @returns {Kind | undefined}
 *
 * @overload
 * @param {Parent} parent
 * @param {Node | number} index
 * @param {Test} [test]
 * @returns {Node | undefined}
 *
 * @param {Parent} parent
 *   Parent node.
 * @param {Node | number} index
 *   Child of `parent`, or it’s index.
 * @param {Test} [test]
 *   `unist-util-is`-compatible test.
 * @returns {Node | undefined}
 *   Child of `parent` or `undefined`.
 */
export function findBefore(parent, index, test) {
  const is = convert(test)

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

  return undefined
}
