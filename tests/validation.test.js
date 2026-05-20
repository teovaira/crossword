// validation.test.js
// Tests for the validation module.
// Each test checks that validation functions work correctly.
// A test passes if it gets the expected result, fails if it does not.

const test = require('node:test')
const assert = require('node:assert/strict')

const {
  validateWords,
  validatePuzzleNumbers,
  validateSlotWordCount,
  validateInputs,
} = require('../validation')
const {
  cloneGrid,
  normalizeGridForSolving,
  gridToString,
} = require('../utils')

// Tests for the validateWords function.
// This function checks that the word list is correct.

test('validateWords rejects duplicate words', () => {
  // A word should not appear twice in the list.
  assert.equal(validateWords(['cat', 'dog', 'cat']), false)
})

test('validateWords rejects non-array input', () => {
  // The words must be an array, not a text string.
  assert.equal(validateWords('cat,dog'), false)
})

test('validateWords rejects non-string word values', () => {
  // Every item in the array must be text, not a number.
  assert.equal(validateWords(['cat', 123]), false)
})

test('validateWords rejects empty word values', () => {
  // A word cannot be blank or empty.
  assert.equal(validateWords(['cat', '']), false)
})

// Tests for the validatePuzzleNumbers function.
// This function checks that the grid numbers match the slot layout.

test('validatePuzzleNumbers rejects a puzzle number mismatch', () => {
  // The number in a cell must equal the number of words starting there.
  const grid = [
    ['2', '0', '0', '1'],
    ['0', '.', '.', '0'],
    ['2', '0', '0', '0'],
    ['0', '.', '.', '0'],
  ]
  const slots = [
    { row: 0, col: 0, dir: 'H', length: 4 },
    { row: 0, col: 0, dir: 'V', length: 4 },
    { row: 0, col: 3, dir: 'V', length: 4 },
    { row: 2, col: 0, dir: 'H', length: 4 },
  ]

  assert.equal(validatePuzzleNumbers(grid, slots), false)
})

test('validatePuzzleNumbers rejects starting numbers higher than 2', () => {
  // Valid puzzle numbers are only 1 or 2. A number 3 or higher is not allowed.
  const grid = [['3', '0', '0']]
  const slots = [{ row: 0, col: 0, dir: 'H', length: 3 }]

  assert.equal(validatePuzzleNumbers(grid, slots), false)
})

test('validatePuzzleNumbers rejects slots that start on an unnumbered cell', () => {
  // A word slot must start on a cell with a number (1 or 2).
  const grid = [['0', '0', '0']]
  const slots = [{ row: 0, col: 0, dir: 'H', length: 3 }]

  assert.equal(validatePuzzleNumbers(grid, slots), false)
})

// Tests for the validateSlotWordCount function.
// This function checks that the number of slots matches the number of words.

test('validateSlotWordCount rejects extra words', () => {
  // If there are more words than slots, it is wrong.
  const slots = [{ row: 0, col: 0, dir: 'H', length: 3 }]
  const words = ['cat', 'dog']

  assert.equal(validateSlotWordCount(slots, words), false)
})

test('validateSlotWordCount rejects missing words', () => {
  // If there are fewer words than slots, it is wrong.
  const slots = [
    { row: 0, col: 0, dir: 'H', length: 3 },
    { row: 0, col: 0, dir: 'V', length: 3 },
  ]
  const words = ['cat']

  assert.equal(validateSlotWordCount(slots, words), false)
})

// Tests for the validateInputs function.
// This function runs all validation checks together.

test('validateInputs returns true when all validation checks pass', () => {
  // When the grid, slots, and words are all correct, validation succeeds.
  const grid = [
    ['2', '0', '0'],
    ['0', '.', '.'],
    ['0', '.', '.'],
  ]
  const slots = [
    { row: 0, col: 0, dir: 'H', length: 3 },
    { row: 0, col: 0, dir: 'V', length: 3 },
  ]
  const words = ['cat', 'cow']

  assert.equal(validateInputs({ grid, slots, words }), true)
})

test('validatePuzzleNumbers accepts a slot-count helper from parser logic', () => {
  // If a helper function is provided, validation can use it to count slots.
  const grid = [['2', '0', '0']]
  const slots = [
    { row: 0, col: 0, dir: 'H', length: 3 },
    { row: 0, col: 0, dir: 'V', length: 1 },
  ]
  const countSlotsStartingAt = (allSlots, row, col) =>
    allSlots.filter(slot => slot.row === row && slot.col === col).length

  assert.equal(validatePuzzleNumbers(grid, slots, countSlotsStartingAt), true)
})

// Tests for utility functions.
// These helper functions make working with the grid easier.

test('normalizeGridForSolving converts numbered cells to empty fillable cells', () => {
  // Prepare the grid for solving by turning numbers into empty spaces where letters go.
  // Blocked cells (shown as '.') stay blocked.
  const grid = [
    ['2', '0', '.'],
    ['1', '.', '0'],
  ]

  assert.deepEqual(normalizeGridForSolving(grid), [
    ['', '', '.'],
    ['', '.', ''],
  ])
})

test('gridToString formats rows and lines exactly', () => {
  // Convert a grid into readable text format, joining cells in a row and rows with newlines.
  const grid = [
    ['c', 'a', 't'],
    ['.', '.', 'o'],
    ['d', 'o', 'g'],
  ]

  assert.equal(gridToString(grid), 'cat\n..o\ndog')
})

test('cloneGrid returns a deep copy without mutating the original grid', () => {
  // Make a copy of the grid so changes to the copy do not affect the original.
  const grid = [
    ['0', '0'],
    ['.', '1'],
  ]
  const clonedGrid = cloneGrid(grid)

  clonedGrid[0][0] = 'x'

  assert.deepEqual(grid, [
    ['0', '0'],
    ['.', '1'],
  ])
  assert.notEqual(clonedGrid, grid)
  assert.notEqual(clonedGrid[0], grid[0])
})
