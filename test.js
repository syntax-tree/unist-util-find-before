/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('mdast').Root} Root
 */

import assert from 'node:assert'
import test from 'tape'
import remark from 'remark'
import {findBefore} from './index.js'

test('unist-util-find-before', (t) => {
  /** @type {Root} */
  // @ts-expect-error: fine.
  const tree = remark().parse('Some *emphasis*, **importance**, and `code`.')

  assert(tree.type === 'root')
  const paragraph = tree.children[0]
  assert(paragraph.type === 'paragraph')
  const head = paragraph.children[0]
  assert(head.type === 'text')
  const next = paragraph.children[1]
  assert(next.type === 'emphasis')

  t.throws(
    () => {
      // @ts-ignore runtime
      findBefore()
    },
    /Expected parent node/,
    'should fail without parent'
  )

  t.throws(
    () => {
      // @ts-ignore runtime
      findBefore({type: 'foo'})
    },
    /Expected parent node/,
    'should fail without parent node'
  )

  t.throws(
    () => {
      // @ts-ignore runtime
      findBefore({type: 'foo', children: []})
    },
    /Expected child node or index/,
    'should fail without index (#1)'
  )

  t.throws(
    () => {
      findBefore({type: 'foo', children: []}, -1)
    },
    /Expected positive finite number as index/,
    'should fail without index (#2)'
  )

  t.throws(
    () => {
      findBefore({type: 'foo', children: []}, {type: 'bar'})
    },
    /Expected child node or index/,
    'should fail without index (#3)'
  )

  t.throws(
    () => {
      // @ts-ignore runtime
      findBefore({type: 'foo', children: [{type: 'bar'}]}, 1, false)
    },
    /Expected function, string, or object as test/,
    'should fail for invalid `test` (#1)'
  )

  t.throws(
    () => {
      // @ts-ignore runtime
      findBefore({type: 'foo', children: [{type: 'bar'}]}, 1, true)
    },
    /Expected function, string, or object as test/,
    'should fail for invalid `test` (#2)'
  )

  t.strictEqual(
    findBefore(paragraph, paragraph.children[1]),
    head,
    'should return the preceding node when without `test` (#1)'
  )
  t.strictEqual(
    findBefore(paragraph, 1),
    head,
    'should return the preceding node when without `test` (#2)'
  )
  t.strictEqual(
    findBefore(paragraph, 0),
    null,
    'should return the preceding node when without `test` (#3)'
  )

  t.strictEqual(
    findBefore(paragraph, 100, head),
    head,
    'should return `node` when given a `node` and existing (#1)'
  )
  t.strictEqual(
    findBefore(paragraph, paragraph.children[1], head),
    head,
    'should return `node` when given a `node` and existing (#2)'
  )
  t.strictEqual(
    findBefore(paragraph, 1, head),
    head,
    'should return `node` when given a `node` and existing (#3)'
  )
  t.strictEqual(
    findBefore(paragraph, head, head),
    null,
    'should return `node` when given a `node` and existing (#4)'
  )
  t.strictEqual(
    findBefore(paragraph, 0, head),
    null,
    'should return `node` when given a `node` and existing (#5)'
  )
  t.strictEqual(
    findBefore(paragraph, 1, next),
    null,
    'should return `node` when given a `node` and existing (#6)'
  )

  t.strictEqual(
    findBefore(paragraph, 100, 'strong'),
    paragraph.children[3],
    'should return a child when given a `type` and existing (#1)'
  )
  t.strictEqual(
    findBefore(paragraph, 3, 'strong'),
    null,
    'should return a child when given a `type` and existing (#2)'
  )
  t.strictEqual(
    findBefore(paragraph, paragraph.children[4], 'strong'),
    paragraph.children[3],
    'should return a child when given a `type` and existing (#3)'
  )
  t.strictEqual(
    findBefore(paragraph, paragraph.children[3], 'strong'),
    null,
    'should return a child when given a `type` and existing (#4)'
  )

  t.strictEqual(
    findBefore(paragraph, 100, test),
    paragraph.children[3],
    'should return a child when given a `test` and existing (#1)'
  )
  t.strictEqual(
    findBefore(paragraph, 3, test),
    null,
    'should return a child when given a `test` and existing (#2)'
  )
  t.strictEqual(
    findBefore(paragraph, paragraph.children[4], test),
    paragraph.children[3],
    'should return a child when given a `test` and existing (#3)'
  )
  t.strictEqual(
    findBefore(paragraph, paragraph.children[3], test),
    null,
    'should return a child when given a `test` and existing (#4)'
  )

  /**
   * @param {Node} _
   * @param {number} n
   */
  function test(_, n) {
    return n === 3
  }

  t.end()
})
