// Entry point: orchestrates parsing, validation, solving, and output.
// This is the only file that prints to the console.

const { parsePuzzle, findSlots, countSlotsStartingAt } = require('./parser.js')
const { validateInputs } = require('./validation.js')
const { normalizeGridForSolving, gridToString } = require('./utils.js')
const { solveCrossword } = require('./solver.js')

const crosswordSolver = (puzzle, words) => {
  // guard against wrong types before calling any other function
  if (typeof puzzle !== 'string' || !Array.isArray(words)) {
    console.log('Error')
    return
  }

  // parsePuzzle returns null for empty strings, invalid characters, unequal rows, numbers > 2
  const grid = parsePuzzle(puzzle)
  if (!grid) {
    console.log('Error')
    return
  }

  const slots = findSlots(grid)

  // validateInputs checks: no duplicates, word count matches slots,
  // and puzzle numbers agree with actual slot count at each cell.
  // countSlotsStartingAt is passed in so validation.js stays independent from parser.js
  if (!validateInputs({ grid, slots, words, countSlotsStartingAt })) {
    console.log('Error')
    return
  }

  // convert 0/1/2 cells to '' so the solver works with empty strings and letters only
  const normalizedGrid = normalizeGridForSolving(grid)
  const result = solveCrossword(normalizedGrid, slots, words)

  // both 'none' and 'multiple' are failures — only 'unique' is acceptable
  if (result.status !== 'unique') {
    console.log('Error')
    return
  }

  console.log(gridToString(result.grid))
}

module.exports = crosswordSolver
