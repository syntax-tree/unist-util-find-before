/**
 * @import {Test} from 'unist-util-is'
 * @import {Node as UnistNode, Parent as UnistParent} from 'unist'
 */

/**
 * @typedef {(
 *   Fn extends (value: any) => value is infer Thing
 *   ? Thing
 *   : Fallback
 * )} Predicate
 *   Get the value of a type guard `Fn`.
 * @template Fn
 *   Value; typically function that is a type guard (such as `(x): x is Y`).
 * @template Fallback
 *   Value to yield if `Fn` is not a type guard.
 */

/**
 * @typedef {(
 *   Check extends null | undefined // No test.
 *   ? Value
 *   : Value extends {type: Check} // String (type) test.
 *   ? Value
 *   : Value extends Check // Partial test.
 *   ? Value
 *   : Check extends Function // Function test.
 *   ? Predicate<Check, Value> extends Value
 *     ? Predicate<Check, Value>
 *     : never
 *   : never // Some other test?
 * )} MatchesOne
 *   Check whether a node matches a primitive check in the type system.
 * @template Value
 *   Value; typically unist `Node`.
 * @template Check
 *   Value; typically `unist-util-is`-compatible test, but not arrays.
 */

/**
 * @typedef {(
 *   Check extends Array<any>
 *   ? MatchesOne<Value, Check[keyof Check]>
 *   : MatchesOne<Value, Check>
 * )} Matches
 *   Check whether a node matches a check in the type system.
 * @template Value
 *   Value; typically unist `Node`.
 * @template Check
 *   Value; typically `unist-util-is`-compatible test.
 */

/**
 * @typedef {(
 *   Kind extends {children: Array<infer Child>}
 *   ? Child
 *   : never
 * )} Child
 *   Collect nodes that can be parents of `Child`.
 * @template {UnistNode} Kind
 *   All node types.
 */

import {convert} from 'unist-util-is'

/**
 * Find the first node in `parent` before another `node` or before an index,
 * that passes `test`.
 *
 * @param parent
 *   Parent node.
 * @param index
 *   Child node or index.
 * @param [test=undefined]
 *   Test for child to look for (optional).
 * @returns
 *   A child (matching `test`, if given) or `undefined`.
 */
export const findBefore =
  // Note: overloads like this are needed to support optional generics.
  /**
   * @type {(
   *   (<Kind extends UnistParent, Check extends Test>(parent: Kind, index: Child<Kind> | number, test: Check) => Matches<Child<Kind>, Check> | undefined) &
   *   (<Kind extends UnistParent>(parent: Kind, index: Child<Kind> | number, test?: null | undefined) => Child<Kind> | undefined)
   * )}
   */
  (
    /**
     * @param {UnistParent} parent
     *   Parent node.
     * @param {UnistNode | number} index
     *   Child node or index.
     * @param {Test} [test=undefined]
     *   Test for child to look for.
     * @returns {UnistNode | undefined}
     *   A child (matching `test`, if given) or `undefined`.
     */
    function (parent, index, test) {
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
        const child = parent.children[index]

        if (is(child, index, parent)) {
          return child
        }
      }

      return undefined
    }
  )
