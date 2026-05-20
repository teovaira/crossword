// validation.js
// This file checks that the crossword puzzle inputs look correct before solving.
// It does not solve the puzzle. It makes sure the words, slots, and grid numbers match.

const getSlotStartCount = (slots, row, col, countSlotsStartingAt) => {
  // If a helper function is provided, use it to count how many slots start at this cell.
  // That helper may come from the parser or another part of the program.
  if (typeof countSlotsStartingAt === 'function') {
    if (countSlotsStartingAt.length >= 3) {
      return countSlotsStartingAt(slots, row, col)
    }

    return countSlotsStartingAt(row, col)
  }

  // Otherwise count manually by looking through the slot list.
  return slots.filter(slot => slot.row === row && slot.col === col).length
}

const validateWords = words => {
  // The word list must be an array.
  if (!Array.isArray(words)) {
    return false
  }

  // We keep track of words we have already seen so we can detect duplicates.
  const seenWords = new Set()

  for (const word of words) {
    // Each item in the array must be a text string.
    if (typeof word !== 'string') {
      return false
    }

    // A word cannot be empty.
    if (word.length === 0) {
      return false
    }

    // If we have already seen the same word, that is not allowed.
    if (seenWords.has(word)) {
      return false
    }

    seenWords.add(word)
  }

  return true
}

const validatePuzzleNumbers = (grid, slots, countSlotsStartingAt) => {
  // Every slot must start on a numbered cell in the grid.
  // A slot is the place where a word will be placed.
  for (const slot of slots) {
    const startCell = grid[slot.row] && grid[slot.row][slot.col]

    if (Number(startCell) <= 0) {
      return false
    }
  }

  // Now check the grid itself to make sure the numbers are correct.
  for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
    const row = grid[rowIndex]

    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      const cell = row[colIndex]
      const cellNumber = Number(cell)

      // If this cell is blocked, empty, or not a number, skip it.
      if (!Number.isInteger(cellNumber) || cellNumber <= 0) {
        continue
      }

      // Valid puzzle numbers are only 1 or 2.
      if (cellNumber > 2) {
        return false
      }

      const slotStartCount = getSlotStartCount(
        slots,
        rowIndex,
        colIndex,
        countSlotsStartingAt,
      )

      // The number printed in the cell must match how many words start there.
      if (slotStartCount !== cellNumber) {
        return false
      }
    }
  }

  return true
}

const validateSlotWordCount = (slots, words) => {
  // There must be the same number of slots as there are words.
  if (slots.length !== words.length) {
    return false
  }

  return true
}

const validateInputs = ({ grid, slots, words, countSlotsStartingAt }) => {
  // Run all validation checks before the crossword solver starts.
  return (
    validateWords(words) &&
    validateSlotWordCount(slots, words) &&
    validatePuzzleNumbers(grid, slots, countSlotsStartingAt)
  )
}

module.exports = {
  validateWords,
  validatePuzzleNumbers,
  validateSlotWordCount,
  validateInputs,
}
