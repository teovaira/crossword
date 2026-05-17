const { test } = require('node:test')
const assert = require('node:assert/strict')
const { canPlaceWord, placeWord, solveCrossword } = require('../solver.js')

// handmade 4x4 normalized grid (numbers replaced with empty string '')
// 'casa' goes across row 0, 'ciao' goes down col 0
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

// --- canPlaceWord ---

test('canPlaceWord: fits a word into empty horizontal slot', () => {
  const slot = { row: 0, col: 0, dir: 'H', length: 4 }
  assert.equal(canPlaceWord(emptyGrid, slot, 'casa'), true)
})

test('canPlaceWord: fits a word into empty vertical slot', () => {
  const slot = { row: 0, col: 0, dir: 'V', length: 4 }
  assert.equal(canPlaceWord(emptyGrid, slot, 'ciao'), true)
})

test('canPlaceWord: rejects word with wrong length', () => {
  const slot = { row: 0, col: 0, dir: 'H', length: 4 }
  assert.equal(canPlaceWord(emptyGrid, slot, 'hi'), false)
})

test('canPlaceWord: allows placement when crossing letter matches', () => {
  // partialGrid has 'c' at [0][0], placing 'ciao' vertically should be ok
  const slot = { row: 0, col: 0, dir: 'V', length: 4 }
  assert.equal(canPlaceWord(partialGrid, slot, 'ciao'), true)
})

test('canPlaceWord: rejects placement when crossing letter conflicts', () => {
  // partialGrid has 'a' at [0][1], placing 'zzzz' horizontally conflicts
  const slot = { row: 0, col: 0, dir: 'H', length: 4 }
  assert.equal(canPlaceWord(partialGrid, slot, 'zzzz'), false)
})

test('canPlaceWord: does not mutate the grid', () => {
  const slot = { row: 0, col: 0, dir: 'H', length: 4 }
  const before = emptyGrid[0][0]
  canPlaceWord(emptyGrid, slot, 'casa')
  assert.equal(emptyGrid[0][0], before)
})

// --- placeWord ---

test('placeWord: places word horizontally and returns new grid', () => {
  const slot = { row: 0, col: 0, dir: 'H', length: 4 }
  const result = placeWord(emptyGrid, slot, 'casa')
  assert.equal(result[0][0], 'c')
  assert.equal(result[0][1], 'a')
  assert.equal(result[0][2], 's')
  assert.equal(result[0][3], 'a')
})

test('placeWord: places word vertically and returns new grid', () => {
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

// minimal solvable grid: 'ab' horizontal, 'ac' vertical sharing [0][0]
const tinyGrid = [
  ['', ''],
  ['', '.'],
]
const tinySlots = [
  { row: 0, col: 0, dir: 'H', length: 2 },
  { row: 0, col: 0, dir: 'V', length: 2 },
]

test('solveCrossword: returns unique status for a puzzle with one solution', () => {
  const result = solveCrossword(tinyGrid, tinySlots, ['ab', 'ac'])
  assert.equal(result.status, 'unique')
  assert.ok(result.grid)
})

test('solveCrossword: returns none status when no solution exists', () => {
  // 'xy' and 'zz' cannot share a letter at [0][0]
  const result = solveCrossword(tinyGrid, tinySlots, ['xy', 'zz'])
  assert.equal(result.status, 'none')
})

test('solveCrossword: returns multiple status for ambiguous puzzle', () => {
  // both 'ab'/'ac' and 'ac'/'ab' are valid depending on slot assignment
  // use a grid where two horizontal slots of same length have no constraints
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
