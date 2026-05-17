const { test } = require('node:test')
const assert = require('node:assert/strict')
const { canPlaceWord, placeWord, solveCrossword } = require('../solver.js')

// normalized grid: numbers replaced with '' (empty string)
const emptyGrid = [
  ['', '', '', ''],
  ['.', '.', '', '.'],
  ['', '', '', ''],
  ['.', '.', '', '.'],
]

// grid with 'casa' already placed across row 0
const partialGrid = [
  ['c', 'a', 's', 'a'],
  ['.', '.', 'i', '.'],
  ['', '', '', ''],
  ['.', '.', '', '.'],
]

test('canPlaceWord: fits a word into empty horizontal slot', () => {
  const slot = { row: 0, col: 0, dir: 'H', length: 4 }
  assert.equal(canPlaceWord(emptyGrid, slot, 'casa'), true)
})

test('canPlaceWord: fits a word into empty vertical slot', () => {
  const slot = { row: 0, col: 2, dir: 'V', length: 4 }
  assert.equal(canPlaceWord(emptyGrid, slot, 'ciao'), true)
})

test('canPlaceWord: rejects word with wrong length', () => {
  const slot = { row: 0, col: 0, dir: 'H', length: 4 }
  assert.equal(canPlaceWord(emptyGrid, slot, 'hi'), false)
})

test('canPlaceWord: allows placement when crossing letter matches', () => {
  // partialGrid has 's' at [0][2] and 'i' at [1][2] — 'sian' fits vertically at col 2
  const slot = { row: 0, col: 2, dir: 'V', length: 4 }
  assert.equal(canPlaceWord(partialGrid, slot, 'sian'), true)
})

test('canPlaceWord: rejects placement when crossing letter conflicts', () => {
  const slot = { row: 0, col: 0, dir: 'H', length: 4 }
  assert.equal(canPlaceWord(partialGrid, slot, 'zzzz'), false)
})

test('canPlaceWord: does not mutate the grid', () => {
  const slot = { row: 0, col: 0, dir: 'H', length: 4 }
  canPlaceWord(emptyGrid, slot, 'casa')
  assert.equal(emptyGrid[0][0], '')
})

// --- placeWord ---

test('placeWord: places word horizontally into correct cells', () => {
  const slot = { row: 0, col: 0, dir: 'H', length: 4 }
  const result = placeWord(emptyGrid, slot, 'casa')
  assert.equal(result[0][0], 'c')
  assert.equal(result[0][1], 'a')
  assert.equal(result[0][2], 's')
  assert.equal(result[0][3], 'a')
})

test('placeWord: places word vertically into correct cells', () => {
  const slot = { row: 0, col: 2, dir: 'V', length: 4 }
  const result = placeWord(emptyGrid, slot, 'alan')
  assert.equal(result[0][2], 'a')
  assert.equal(result[1][2], 'l')
  assert.equal(result[2][2], 'a')
  assert.equal(result[3][2], 'n')
})

test('placeWord: does not mutate the original grid', () => {
  const slot = { row: 0, col: 0, dir: 'H', length: 4 }
  placeWord(emptyGrid, slot, 'casa')
  assert.equal(emptyGrid[0][0], '')
})

// --- solveCrossword ---

// minimal 2x2 grid: one H slot and one V slot sharing [0][0]
const tinyGrid = [
  ['', ''],
  ['', '.'],
]
const tinySlots = [
  { row: 0, col: 0, dir: 'H', length: 2 },
  { row: 0, col: 0, dir: 'V', length: 2 },
]

test('solveCrossword: returns unique for a puzzle with one solution', () => {
  // 'ab' H and 'ac' V share 'a' at [0][0] — only one valid arrangement
  const result = solveCrossword(tinyGrid, tinySlots, ['ab', 'ac'])
  assert.equal(result.status, 'unique')
  assert.ok(result.grid)
})

test('solveCrossword: returns none when no solution exists', () => {
  // 'xy' and 'zz' conflict at [0][0] — x !== z
  const result = solveCrossword(tinyGrid, tinySlots, ['xy', 'zz'])
  assert.equal(result.status, 'none')
})

test('solveCrossword: returns multiple for ambiguous puzzle', () => {
  // two separate H slots, no intersections — both words can swap freely
  const ambigGrid = [
    ['', '', '.'],
    ['.', '.', '.'],
    ['', '', '.'],
  ]
  const ambigSlots = [
    { row: 0, col: 0, dir: 'H', length: 2 },
    { row: 2, col: 0, dir: 'H', length: 2 },
  ]
  const result = solveCrossword(ambigGrid, ambigSlots, ['ab', 'ba'])
  assert.equal(result.status, 'multiple')
})

test('solveCrossword: solves the small audit puzzle correctly', () => {
  const auditGrid = [
    ['', '', '', ''],
    ['.', '.', '', '.'],
    ['', '', '', ''],
    ['.', '.', '', '.'],
  ]
  const auditSlots = [
    { row: 0, col: 0, dir: 'H', length: 4 },
    { row: 0, col: 0, dir: 'V', length: 4 },
    { row: 2, col: 0, dir: 'H', length: 4 },
    { row: 0, col: 3, dir: 'V', length: 4 },
  ]
  const result = solveCrossword(auditGrid, auditSlots, ['casa', 'alan', 'ciao', 'anta'])
  assert.equal(result.status, 'unique')
  assert.equal(result.grid[0].join(''), 'casa')
  assert.equal(result.grid[2].join(''), 'anta')
})
