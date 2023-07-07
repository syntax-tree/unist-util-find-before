import {expectType} from 'tsd'
import type {
  Heading,
  PhrasingContent,
  Root,
  RootContent,
  RowContent,
  TableCell,
  TableRow,
  Text
} from 'mdast'
import {findBefore} from './index.js'

const text: Text = {type: 'text', value: 'alpha'}
const heading: Heading = {type: 'heading', depth: 1, children: [text]}
const root: Root = {type: 'root', children: [heading]}
const cell: TableCell = {type: 'tableCell', children: [text]}
const row: TableRow = {type: 'tableRow', children: [cell]}

// @ts-expect-error: parent needed.
findBefore()

// @ts-expect-error: child or index needed.
findBefore(heading)

findBefore(
  // @ts-expect-error: parent needed.
  text,
  0
)

expectType<PhrasingContent | undefined>(findBefore(heading, text))

expectType<Text | undefined>(findBefore(heading, text, 'text'))

expectType<Text | undefined>(findBefore(heading, 0, 'text'))

expectType<RootContent | undefined>(findBefore(root, 0))

expectType<Text | undefined>(findBefore(root, 0, 'text'))

expectType<RowContent | undefined>(findBefore(row, 0))
