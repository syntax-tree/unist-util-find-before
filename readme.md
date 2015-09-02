# unist-util-find-before [![Build Status](https://img.shields.io/travis/wooorm/unist-util-find-before.svg)](https://travis-ci.org/wooorm/unist-util-find-before) [![Coverage Status](https://img.shields.io/codecov/c/github/wooorm/unist-util-find-before.svg)](https://codecov.io/github/wooorm/unist-util-find-before?branch=master)

[**Unist**](https://github.com/wooorm/unist) utility to find a node before
another node. Useful when working with [**mdast**](https://github.com/wooorm/mdast)
or [**retext**](https://github.com/wooorm/retext).

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
npm install unist-util-find-before
```

**unist-util-find-before** is also available for [bower](http://bower.io/#install-packages),
[component](https://github.com/componentjs/component), and
[duo](http://duojs.org/#getting-started), and as an AMD, CommonJS, and globals
module, [uncompressed](unist-util-find-before.js) and
[compressed](unist-util-find-before.min.js).

## Usage

```js
var mdast = require('mdast');
var findBefore = require('unist-util-find-before');
var inspect = require('unist-util-inspect');

function log(node) {
    console.log(node && inspect(node));
}

mdast.use(function () {
    return function (ast) {
        var paragraph = ast.children[0];
        var children = paragraph.children;

        log(findBefore(paragraph, 4));
        log(findBefore(paragraph, children[4]));
        log(findBefore(paragraph, children[4], 'emphasis'));
        log(findBefore(paragraph, children[4], children[5]));
        log(findBefore(paragraph, children[4], function (node, n) {
            return n === 1;
        }));
    };
}).process('Some *emphasis*, **strongness**, and `code`.');
```

Yields:

```text
strong[1]
└─ text: 'strongness'
strong[1]
└─ text: 'strongness'
emphasis[1]
└─ text: 'emphasis'
null
emphasis[1]
└─ text: 'emphasis'
```

## API

### findBefore(parent, index|node\[, test\])

Find the first child before `index` (or `node`), that passes `test` (when
given).

**Parameters**:

*   `parent` (`Node`) — Parent to search in;

*   `node` (`Node`)
    — [Node](https://github.com/wooorm/unist#unist-nodes) to search before;

*   `index` (`number`) — Position of child to search before;

*   `test` (`Function`, `string`, or `Node`; optional)
    — See [`is()`](https://github.com/wooorm/unist-util-is#istest-node-index-parent-context).

**Returns**: `node?`, when found. Child node of `parent` which passes `test`.

## License

[MIT](LICENSE) © [Titus Wormer](http://wooorm.com)
