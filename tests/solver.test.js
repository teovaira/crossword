const { test } = require('node:test')
const assert = require('node:assert/strict')
const { canPlaceWord } = require('../solver.js')

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
