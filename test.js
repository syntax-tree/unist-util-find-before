'use strict'

var test = require('tape')
var remark = require('remark')
var findBefore = require('.')

var tree = remark().parse('Some *emphasis*, **importance**, and `code`.')
var paragraph = tree.children[0]
var children = paragraph.children

test('unist-util-find-before', function (t) {
  t.throws(
    function () {
      findBefore()
    },
    /Expected parent node/,
    'should fail without parent'
  )

  t.throws(
    function () {
      findBefore({
        type: 'foo'
      })
    },
    /Expected parent node/,
    'should fail without parent node'
  )

  t.throws(
    function () {
      findBefore({type: 'foo', children: []})
    },
    /Expected child node or index/,
    'should fail without index (#1)'
  )

  t.throws(
    function () {
      findBefore({type: 'foo', children: []}, -1)
    },
    /Expected positive finite number as index/,
    'should fail without index (#2)'
  )

  t.throws(
    function () {
      findBefore({type: 'foo', children: []}, {type: 'bar'})
    },
    /Expected child node or index/,
    'should fail without index (#3)'
  )

  t.throws(
    function () {
      findBefore({type: 'foo', children: [{type: 'bar'}]}, 1, false)
    },
    /Expected function, string, or object as test/,
    'should fail for invalid `test` (#1)'
  )

  t.throws(
    function () {
      findBefore({type: 'foo', children: [{type: 'bar'}]}, 1, true)
    },
    /Expected function, string, or object as test/,
    'should fail for invalid `test` (#2)'
  )

  t.strictEqual(
    findBefore(paragraph, children[1]),
    children[0],
    'should return the preceding node when without `test` (#1)'
  )
  t.strictEqual(
    findBefore(paragraph, 1),
    children[0],
    'should return the preceding node when without `test` (#2)'
  )
  t.strictEqual(
    findBefore(paragraph, 0),
    null,
    'should return the preceding node when without `test` (#3)'
  )

  t.strictEqual(
    findBefore(paragraph, 100, children[0]),
    children[0],
    'should return `node` when given a `node` and existing (#1)'
  )
  t.strictEqual(
    findBefore(paragraph, children[1], children[0]),
    children[0],
    'should return `node` when given a `node` and existing (#2)'
  )
  t.strictEqual(
    findBefore(paragraph, 1, children[0]),
    children[0],
    'should return `node` when given a `node` and existing (#3)'
  )
  t.strictEqual(
    findBefore(paragraph, children[0], children[0]),
    null,
    'should return `node` when given a `node` and existing (#4)'
  )
  t.strictEqual(
    findBefore(paragraph, 0, children[0]),
    null,
    'should return `node` when given a `node` and existing (#5)'
  )
  t.strictEqual(
    findBefore(paragraph, 1, children[1]),
    null,
    'should return `node` when given a `node` and existing (#6)'
  )

  t.strictEqual(
    findBefore(paragraph, 100, 'strong'),
    children[3],
    'should return a child when given a `type` and existing (#1)'
  )
  t.strictEqual(
    findBefore(paragraph, 3, 'strong'),
    null,
    'should return a child when given a `type` and existing (#2)'
  )
  t.strictEqual(
    findBefore(paragraph, children[4], 'strong'),
    children[3],
    'should return a child when given a `type` and existing (#3)'
  )
  t.strictEqual(
    findBefore(paragraph, children[3], 'strong'),
    null,
    'should return a child when given a `type` and existing (#4)'
  )

  t.strictEqual(
    findBefore(paragraph, 100, test),
    children[3],
    'should return a child when given a `test` and existing (#1)'
  )
  t.strictEqual(
    findBefore(paragraph, 3, test),
    null,
    'should return a child when given a `test` and existing (#2)'
  )
  t.strictEqual(
    findBefore(paragraph, children[4], test),
    children[3],
    'should return a child when given a `test` and existing (#3)'
  )
  t.strictEqual(
    findBefore(paragraph, children[3], test),
    null,
    'should return a child when given a `test` and existing (#4)'
  )

  function test(node, n) {
    return n === 3
  }

  t.end()
})
