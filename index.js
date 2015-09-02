/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module unist:util:find-before
 * @fileoverview Utility to find a node before another node.
 */

'use strict';

/* eslint-env commonjs */

/**
 * Test.
 *
 * @typedef {Function} findBefore~test
 * @param {Node} node - Node to test.
 * @param {number} index - Position of `node` in `parent`.
 * @param {Node} parent - Parent of `node`.
 * @return {boolean?} - Whether this iteration passes.
 */

/**
 * Utility to return true for the first node.
 *
 * @type {findBefore~test}
 */
function first() {
    return true;
}

/**
 * Utility to convert a string into a function which checks
 * a given node’s type for said string.
 *
 * @param {string} test - Node type to test.
 * @return {findBefore~test} - Tester.
 */
function typeFactory(test) {
    return function (node) {
        return Boolean(node && node.type === test);
    }
}

/**
 * Utility to convert a node into a function which checks
 * a given node for strict equality.
 *
 * @param {Node} test - Node to test.
 * @return {findBefore~test} - Tester.
 */
function nodeFactory(test) {
    return function (node) {
        return Boolean(node && node === test);
    }
}

/**
 * Find a node before `index` in `parent` which passes
 * `test`.
 *
 * @param {Node} parent - Parent to search in.
 * @param {number|Node} index - (Position of) node to
 *   search before.
 * @param {string|Node|findBefore~test} test - Tester.
 * @return {Node?} - A child node of `parent` which passes
 *   `test`.
 */
function findBefore(parent, index, test) {
    var children;
    var child;

    if (!parent || !parent.type || !parent.children) {
        throw new Error('Expected parent node');
    }

    children = parent.children;

    if (index && index.type) {
        index = children.indexOf(index);
    }

    if (isNaN(index) || index < 0 || index === Infinity) {
        throw new Error('Expected positive finite index or child node');
    }

    /* Performance. */
    if (index > children.length) {
        index = children.length;
    }

    if (typeof test === 'string') {
        test = typeFactory(test);
    } else if (test && test.type) {
        test = nodeFactory(test);
    } else if (test === null || test === undefined) {
        test = first;
    } else if (typeof test !== 'function') {
        throw new Error('Expected function, string, or node as test');
    }

    while (index--) {
        child = children[index];

        if (test(child, index, parent)) {
            return child;
        }
    }

    return null;
}

/*
 * Expose.
 */

module.exports = findBefore;
