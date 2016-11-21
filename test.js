'use strict';

/* eslint-env mocha */

var assert = require('assert');
var mdast = require('mdast');
var findBefore = require('./');

var tree = mdast.parse('Some *emphasis*, **importance**, and `code`.');
var paragraph = tree.children[0];
var children = paragraph.children;

describe('unist-util-find-before', function () {
  it('should fail without parent', function () {
    assert.throws(
      function () {
        findBefore();
      },
      /Expected parent node/
    );
  });

  it('should fail without parent node', function () {
    assert.throws(
      function () {
        findBefore({
          type: 'foo'
        });
      },
      /Expected parent node/
    );
  });

  it('should fail without index', function () {
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
  });

  it('should fail for invalid `test`', function () {
    assert.throws(
      function () {
        findBefore({
          type: 'foo',
          children: [{type: 'bar'}]
        }, 1, false);
      },
      /Expected function, string, or node as test/
    );

    assert.throws(
      function () {
        findBefore({
          type: 'foo',
          children: [{type: 'bar'}]
        }, 1, true);
      },
      /Expected function, string, or node as test/
    );
  });

  it('should return the preceding node when without `test`', function () {
    assert.strictEqual(findBefore(paragraph, children[1]), children[0]);
    assert.strictEqual(findBefore(paragraph, 1), children[0]);
    assert.strictEqual(findBefore(paragraph, 0), null);
  });

  it('should return `node` when given a `node` and existing', function () {
    assert.strictEqual(findBefore(paragraph, 100, children[0]), children[0]);
    assert.strictEqual(findBefore(paragraph, children[1], children[0]), children[0]);
    assert.strictEqual(findBefore(paragraph, 1, children[0]), children[0]);
    assert.strictEqual(findBefore(paragraph, children[0], children[0]), null);
    assert.strictEqual(findBefore(paragraph, 0, children[0]), null);
    assert.strictEqual(findBefore(paragraph, 1, children[1]), null);
  });

  it('should return a child when given a `type` and existing', function () {
    assert.strictEqual(findBefore(paragraph, 100, 'strong'), children[3]);
    assert.strictEqual(findBefore(paragraph, 3, 'strong'), null);
    assert.strictEqual(findBefore(paragraph, children[4], 'strong'), children[3]);
    assert.strictEqual(findBefore(paragraph, children[3], 'strong'), null);
  });

  it('should return a child when given a `test` and existing', function () {
    assert.strictEqual(findBefore(paragraph, 100, test), children[3]);
    assert.strictEqual(findBefore(paragraph, 3, test), null);
    assert.strictEqual(findBefore(paragraph, children[4], test), children[3]);
    assert.strictEqual(findBefore(paragraph, children[3], test), null);

    function test(node, n) {
      return n === 3;
    }
  });
});
