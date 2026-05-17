const { parsePuzzle, findSlots, countSlotsStartingAt } = require('./parser.js')
const { validateInputs } = require('./validation.js')
const { normalizeGridForSolving, gridToString } = require('./utils.js')
const { solveCrossword } = require('./solver.js')

const crosswordSolver = (puzzle, words) => {
  if (typeof puzzle !== 'string' || !Array.isArray(words)) {
    console.log('Error')
    return
  }

  const grid = parsePuzzle(puzzle)
  if (!grid) {
    console.log('Error')
    return
  }

  const slots = findSlots(grid)

  if (!validateInputs({ grid, slots, words, countSlotsStartingAt })) {
    console.log('Error')
    return
  }

  const normalizedGrid = normalizeGridForSolving(grid)
  const result = solveCrossword(normalizedGrid, slots, words)

  if (result.status !== 'unique') {
    console.log('Error')
    return
  }

  console.log(gridToString(result.grid))
}

module.exports = crosswordSolver
