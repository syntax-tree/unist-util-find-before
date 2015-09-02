/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module unist:util:find-before
 * @fileoverview Test suite for `unit-util-find-before`.
 */

'use strict';

/* eslint-env node, mocha */

/*
 * Dependencies.
 */

var assert = require('assert');
var mdast = require('mdast');
var findBefore = require('./');

/*
 * Methods.
 */

var equal = assert.strictEqual;

/*
 * Fixture.
 */

var ast = mdast.parse('Some *emphasis*, **strongness**, and `code`.');
var paragraph = ast.children[0];
var children = paragraph.children;

/*
 * Tests.
 */

describe('unist-util-find-before', function () {
    it('should fail without parent', function () {
        assert.throws(function () {
            findBefore();
        }, /Expected parent node/);
    });

    it('should fail without parent node', function () {
        assert.throws(function () {
            findBefore({
                'type': 'foo'
            });
        }, /Expected parent node/);
    });

    it('should fail without index', function () {
        assert.throws(function () {
            findBefore({
                'type': 'foo',
                'children': []
            });
        }, /Expected positive finite index or child node/);

        assert.throws(function () {
            findBefore({
                'type': 'foo',
                'children': []
            }, -1);
        }, /Expected positive finite index or child node/);

        assert.throws(function () {
            findBefore({
                'type': 'foo',
                'children': []
            }, {
                'type': 'bar'
            });
        }, /Expected positive finite index or child node/);
    });

    it('should fail for invalid `test`', function () {
        assert.throws(function () {
            findBefore({
                'type': 'foo',
                'children': []
            }, 0, false);
        }, /Expected function, string, or node as test/);

        assert.throws(function () {
            findBefore({
                'type': 'foo',
                'children': []
            }, 0, true);
        }, /Expected function, string, or node as test/);
    });

    it('should return the preceding node when without `test`', function () {
        equal(findBefore(paragraph, children[1]), children[0]);
        equal(findBefore(paragraph, 1), children[0]);
        equal(findBefore(paragraph, 0), null);
    });

    it('should return `node` when given a `node` and existing', function () {
        equal(findBefore(paragraph, 100, children[0]), children[0]);
        equal(findBefore(paragraph, children[1], children[0]), children[0]);
        equal(findBefore(paragraph, 1, children[0]), children[0]);
        equal(findBefore(paragraph, children[0], children[0]), null);
        equal(findBefore(paragraph, 0, children[0]), null);
        equal(findBefore(paragraph, 1, children[1]), null);
    });

    it('should return a child when given a `type` and existing', function () {
        equal(findBefore(paragraph, 100, 'strong'), children[3]);
        equal(findBefore(paragraph, 3, 'strong'), null);
        equal(findBefore(paragraph, children[4], 'strong'), children[3]);
        equal(findBefore(paragraph, children[3], 'strong'), null);
    });

    it('should return a child when given a `test` and existing', function () {
        /** Test */
        function test(node, n) {
            return n === 3;
        }

        equal(findBefore(paragraph, 100, test), children[3]);
        equal(findBefore(paragraph, 3, test), null);
        equal(findBefore(paragraph, children[4], test), children[3]);
        equal(findBefore(paragraph, children[3], test), null);
    });
});
