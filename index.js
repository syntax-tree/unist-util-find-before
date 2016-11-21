'use strict';

var is = require('unist-util-is');

module.exports = findBefore;

/* Find a node before `index` in `parent` which passes
 * `test`. */
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

  while (index--) {
    child = children[index];

    if (is(test, child, index, parent)) {
      return child;
    }
  }

  return null;
}
