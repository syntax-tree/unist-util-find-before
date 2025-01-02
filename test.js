/**
 * @import {Emphasis, InlineCode} from 'mdast'
 * @import {Node as UnistNode} from 'unist'
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {findBefore} from 'unist-util-find-before'

test('`findBefore`', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('unist-util-find-before')).sort(),
      ['findBefore']
    )
  })

  const tree = fromMarkdown('Some *emphasis*, **importance**, and `code`.')

  assert(tree.type === 'root')
  const paragraph = tree.children[0]
  assert(paragraph.type === 'paragraph')
  const head = paragraph.children[0]
  assert(head.type === 'text')
  const next = paragraph.children[1]
  assert(next.type === 'emphasis')

  /** @type {Emphasis} */
  const emphasis = {type: 'emphasis', children: []}
  /** @type {InlineCode} */
  const inlineCode = {type: 'inlineCode', value: 'a'}

  await t.test('should fail without parent', async function () {
    assert.throws(function () {
      // @ts-expect-error: check that an error is thrown at runtime.
      findBefore()
    }, /Expected parent node/)
  })

  await t.test('should fail without parent node', async function () {
    assert.throws(function () {
      // @ts-expect-error: check that an error is thrown at runtime.
      findBefore(inlineCode)
    }, /Expected parent node/)
  })

  await t.test('should fail without index (#1)', async function () {
    assert.throws(function () {
      // @ts-expect-error: check that an error is thrown at runtime.
      findBefore(emphasis)
    }, /Expected child node or index/)
  })

  await t.test('should fail without index (#2)', async function () {
    assert.throws(function () {
      findBefore(emphasis, -1)
    }, /Expected positive finite number as index/)
  })

  await t.test('should fail without index (#3)', async function () {
    assert.throws(function () {
      findBefore(emphasis, inlineCode)
    }, /Expected child node or index/)
  })

  await t.test('should fail for invalid `test` (#1)', async function () {
    assert.throws(function () {
      // @ts-expect-error: check that an error is thrown at runtime.
      findBefore(emphasis, 1, false)
    }, /Expected function, string, or object as test/)
  })

  await t.test('should fail for invalid `test` (#2)', async function () {
    assert.throws(function () {
      // @ts-expect-error: check that an error is thrown at runtime.
      findBefore(emphasis, 1, true)
    }, /Expected function, string, or object as test/)
  })

  await t.test(
    'should return the preceding node when without `test` (#1)',
    async function () {
      assert.equal(findBefore(paragraph, paragraph.children[1]), head)
    }
  )

  await t.test(
    'should return the preceding node when without `test` (#2)',
    async function () {
      assert.equal(findBefore(paragraph, 1), head)
    }
  )

  await t.test(
    'should return the preceding node when without `test` (#3)',
    async function () {
      assert.equal(findBefore(paragraph, 0), undefined)
    }
  )

  await t.test(
    'should return `node` when given a `node` and existing (#1)',
    async function () {
      assert.equal(findBefore(paragraph, 100, head), head)
    }
  )

  await t.test(
    'should return `node` when given a `node` and existing (#2)',
    async function () {
      assert.equal(findBefore(paragraph, paragraph.children[1], head), head)
    }
  )

  await t.test(
    'should return `node` when given a `node` and existing (#3)',
    async function () {
      assert.equal(findBefore(paragraph, 1, head), head)
    }
  )

  await t.test(
    'should return `node` when given a `node` and existing (#4)',
    async function () {
      assert.equal(findBefore(paragraph, head, head), undefined)
    }
  )

  await t.test(
    'should return `node` when given a `node` and existing (#5)',
    async function () {
      assert.equal(findBefore(paragraph, 0, head), undefined)
    }
  )

  await t.test(
    'should return `node` when given a `node` and existing (#6)',
    async function () {
      assert.equal(findBefore(paragraph, 1, next), undefined)
    }
  )

  await t.test(
    'should return a child when given a `type` and existing (#1)',
    async function () {
      assert.equal(findBefore(paragraph, 100, 'strong'), paragraph.children[3])
    }
  )

  await t.test(
    'should return a child when given a `type` and existing (#2)',
    async function () {
      assert.equal(findBefore(paragraph, 3, 'strong'), undefined)
    }
  )

  await t.test(
    'should return a child when given a `type` and existing (#3)',
    async function () {
      assert.equal(
        findBefore(paragraph, paragraph.children[4], 'strong'),
        paragraph.children[3]
      )
    }
  )

  await t.test(
    'should return a child when given a `type` and existing (#4)',
    async function () {
      assert.equal(
        findBefore(paragraph, paragraph.children[3], 'strong'),
        undefined
      )
    }
  )

  await t.test(
    'should return a child when given a `test` and existing (#1)',
    async function () {
      assert.equal(findBefore(paragraph, 100, check), paragraph.children[3])
    }
  )

  await t.test(
    'should return a child when given a `test` and existing (#2)',
    async function () {
      assert.equal(findBefore(paragraph, 3, check), undefined)
    }
  )

  await t.test(
    'should return a child when given a `test` and existing (#3)',
    async function () {
      assert.equal(
        findBefore(paragraph, paragraph.children[4], check),
        paragraph.children[3]
      )
    }
  )

  await t.test(
    'should return a child when given a `test` and existing (#4)',
    async function () {
      assert.equal(
        findBefore(paragraph, paragraph.children[3], check),
        undefined
      )
    }
  )
})

/**
 * @param {UnistNode} _
 * @param {number | undefined} n
 */
function check(_, n) {
  return n === 3
}
