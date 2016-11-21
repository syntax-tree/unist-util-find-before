'use strict';

var assert = require('assert');
var test = require('tape');
var remark = require('remark');
var findBefore = require('./');

var tree = remark().parse('Some *emphasis*, **importance**, and `code`.');
var paragraph = tree.children[0];
var children = paragraph.children;

test('unist-util-find-before', function (t) {
  t.throws(
    function () {
      findBefore();
    },
    /Expected parent node/,
    'should fail without parent'
  );

  t.throws(
    function () {
      findBefore({
        type: 'foo'
      });
    },
    /Expected parent node/,
    'should fail without parent node'
  );

  t.doesNotThrow(
    function () {
      assert.throws(
        function () {
          findBefore({type: 'foo', children: []});
        },
        /Expected positive finite index or child node/
      );

      assert.throws(
        function () {
          findBefore({type: 'foo', children: []}, -1);
        },
        /Expected positive finite index or child node/
      );

      assert.throws(
        function () {
          findBefore({type: 'foo', children: []}, {type: 'bar'});
        },
        /Expected positive finite index or child node/
      );
    },
    'should fail without index'
  );

  t.doesNotThrow(
    function () {
      assert.throws(
        function () {
          findBefore({
            type: 'foo',
            children: [{type: 'bar'}]
          }, 1, false);
        },
        /Expected function, string, or object as test/
      );

      assert.throws(
        function () {
          findBefore({
            type: 'foo',
            children: [{type: 'bar'}]
          }, 1, true);
        },
        /Expected function, string, or object as test/
      );
    },
    'should fail for invalid `test`'
  );

  t.doesNotThrow(
    function () {
      assert.strictEqual(findBefore(paragraph, children[1]), children[0]);
      assert.strictEqual(findBefore(paragraph, 1), children[0]);
      assert.strictEqual(findBefore(paragraph, 0), null);
    },
    'should return the preceding node when without `test`'
  );

  t.doesNotThrow(
    function () {
      assert.strictEqual(findBefore(paragraph, 100, children[0]), children[0]);
      assert.strictEqual(findBefore(paragraph, children[1], children[0]), children[0]);
      assert.strictEqual(findBefore(paragraph, 1, children[0]), children[0]);
      assert.strictEqual(findBefore(paragraph, children[0], children[0]), null);
      assert.strictEqual(findBefore(paragraph, 0, children[0]), null);
      assert.strictEqual(findBefore(paragraph, 1, children[1]), null);
    },
    'should return `node` when given a `node` and existing'
  );

  t.doesNotThrow(
    function () {
      assert.strictEqual(findBefore(paragraph, 100, 'strong'), children[3]);
      assert.strictEqual(findBefore(paragraph, 3, 'strong'), null);
      assert.strictEqual(findBefore(paragraph, children[4], 'strong'), children[3]);
      assert.strictEqual(findBefore(paragraph, children[3], 'strong'), null);
    },
    'should return a child when given a `type` and existing'
  );

  t.doesNotThrow(
    function () {
      assert.strictEqual(findBefore(paragraph, 100, test), children[3]);
      assert.strictEqual(findBefore(paragraph, 3, test), null);
      assert.strictEqual(findBefore(paragraph, children[4], test), children[3]);
      assert.strictEqual(findBefore(paragraph, children[3], test), null);

      function test(node, n) {
        return n === 3;
      }
    },
    'should return a child when given a `test` and existing'
  );

  t.end();
});
