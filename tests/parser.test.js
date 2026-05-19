// tests/parser.test.js
// Unit tests for parsePuzzle, findSlots, and countSlotsStartingAt.

const { test } = require('node:test')
const assert = require('node:assert/strict')
const { parsePuzzle, findSlots, countSlotsStartingAt } = require('../parser.js')

// -----------------------------------------------------------------------
// parsePuzzle
// -----------------------------------------------------------------------

test('parsePuzzle: returns a 2D array for the audit sample puzzle', () => {
  const grid = parsePuzzle('2001\n0..0\n1000\n0..0')
  // The grid must have 4 rows.
  assert.equal(grid.length, 4)
  // Each row must have 4 cells.
  assert.equal(grid[0].length, 4)
  // Spot-check a few known cells.
  assert.equal(grid[0][0], '2')
  assert.equal(grid[0][3], '1')
  assert.equal(grid[1][1], '.')
  assert.equal(grid[2][0], '1')
})

test('parsePuzzle: returns null for an empty string', () => {
  assert.equal(parsePuzzle(''), null)
})

test('parsePuzzle: returns null when rows have different lengths', () => {
  // Row 0 has 4 chars, row 1 has 3 — that is a jagged grid.
  assert.equal(parsePuzzle('2001\n0.0'), null)
})

test('parsePuzzle: returns null for an invalid character', () => {
  // Letters are not legal puzzle characters.
  assert.equal(parsePuzzle('200x\n0..0'), null)
})

test('parsePuzzle: returns null when any cell is the digit 3 or higher', () => {
  // 3 means three words would start at one cell, which is impossible.
  assert.equal(parsePuzzle('3001\n0..0'), null)
})

test('parsePuzzle: accepts a single-row puzzle', () => {
  const grid = parsePuzzle('1000')
  assert.equal(grid.length, 1)
  assert.equal(grid[0].length, 4)
})

test('parsePuzzle: accepts a puzzle made entirely of dots', () => {
  // All-dot grids are valid (though they produce no slots).
  const grid = parsePuzzle('...\n...')
  assert.ok(grid)
  assert.equal(grid[0][0], '.')
})

// -----------------------------------------------------------------------
// findSlots
// -----------------------------------------------------------------------

// Parsed version of the audit sample: '2001\n0..0\n1000\n0..0'
const auditGrid = [
  ['2', '0', '0', '1'],
  ['0', '.', '.', '0'],
  ['1', '0', '0', '0'],
  ['0', '.', '.', '0'],
]

test('findSlots: finds exactly 4 slots in the audit grid', () => {
  const slots = findSlots(auditGrid)
  assert.equal(slots.length, 4)
})

test('findSlots: detects the horizontal slot in row 0', () => {
  const slots = findSlots(auditGrid)
  const h0 = slots.find(s => s.dir === 'H' && s.row === 0)
  assert.ok(h0, 'H slot in row 0 should exist')
  assert.equal(h0.col, 0)
  assert.equal(h0.length, 4)
})

test('findSlots: detects the horizontal slot in row 2', () => {
  const slots = findSlots(auditGrid)
  const h2 = slots.find(s => s.dir === 'H' && s.row === 2)
  assert.ok(h2, 'H slot in row 2 should exist')
  assert.equal(h2.col, 0)
  assert.equal(h2.length, 4)
})

test('findSlots: detects the vertical slot in column 0', () => {
  const slots = findSlots(auditGrid)
  const v0 = slots.find(s => s.dir === 'V' && s.col === 0)
  assert.ok(v0, 'V slot in column 0 should exist')
  assert.equal(v0.row, 0)
  assert.equal(v0.length, 4)
})

test('findSlots: detects the vertical slot in column 3', () => {
  const slots = findSlots(auditGrid)
  const v3 = slots.find(s => s.dir === 'V' && s.col === 3)
  assert.ok(v3, 'V slot in column 3 should exist')
  assert.equal(v3.row, 0)
  assert.equal(v3.length, 4)
})

test('findSlots: returns no slots for an all-dot grid', () => {
  const dotGrid = [
    ['.', '.', '.'],
    ['.', '.', '.'],
  ]
  assert.equal(findSlots(dotGrid).length, 0)
})

test('findSlots: ignores isolated single-cell open runs', () => {
  // Each open cell is surrounded by dots — no run reaches length 2.
  const grid = [
    ['0', '.', '0'],
    ['.', '.', '.'],
    ['0', '.', '0'],
  ]
  assert.equal(findSlots(grid).length, 0)
})

test('findSlots: does not mutate the grid', () => {
  const grid = [['2', '0', '0', '1'], ['0', '.', '.', '0']]
  findSlots(grid)
  assert.equal(grid[0][0], '2')
})

// -----------------------------------------------------------------------
// countSlotsStartingAt
// -----------------------------------------------------------------------

const auditSlots = findSlots(auditGrid)

test('countSlotsStartingAt: returns 2 at (0,0) — one H and one V start there', () => {
  assert.equal(countSlotsStartingAt(auditSlots, 0, 0), 2)
})

test('countSlotsStartingAt: returns 1 at (2,0) — only an H slot starts there', () => {
  assert.equal(countSlotsStartingAt(auditSlots, 2, 0), 1)
})

test('countSlotsStartingAt: returns 1 at (0,3) — only a V slot starts there', () => {
  assert.equal(countSlotsStartingAt(auditSlots, 0, 3), 1)
})

test('countSlotsStartingAt: returns 0 at a non-starting cell', () => {
  // (0,1) is in the middle of a slot but is not where any slot begins.
  assert.equal(countSlotsStartingAt(auditSlots, 0, 1), 0)
})

test('countSlotsStartingAt: returns 0 for an empty slot list', () => {
  assert.equal(countSlotsStartingAt([], 0, 0), 0)
})
