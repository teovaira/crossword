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
    throw new TypeError('Words must be an array')
  }

  // We keep track of words we have already seen so we can detect duplicates.
  const seenWords = new Set()

  words.forEach(word => {
    // Each item in the array must be a text string.
    if (typeof word !== 'string') {
      throw new TypeError('Every word must be a string')
    }

    // A word cannot be empty.
    if (word.length === 0) {
      throw new Error('Words cannot be empty')
    }

    // If we have already seen the same word, that is not allowed.
    if (seenWords.has(word)) {
      throw new Error('Duplicate words are not allowed')
    }

    seenWords.add(word)
  })

  return true
}

const validatePuzzleNumbers = (grid, slots, countSlotsStartingAt) => {
  // Every slot must start on a numbered cell in the grid.
  // A slot is the place where a word will be placed.
  slots.forEach(slot => {
    const startCell = grid[slot.row] && grid[slot.row][slot.col]

    if (Number(startCell) <= 0) {
      throw new Error('Every slot must start on a numbered cell')
    }
  })

  // Now check the grid itself to make sure the numbers are correct.
  grid.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellNumber = Number(cell)

      // If this cell is blocked, empty, or not a number, skip it.
      if (!Number.isInteger(cellNumber) || cellNumber <= 0) {
        return
      }

      // Valid puzzle numbers are only 1 or 2.
      if (cellNumber > 2) {
        throw new Error('Starting numbers cannot be higher than 2')
      }

      const slotStartCount = getSlotStartCount(
        slots,
        rowIndex,
        colIndex,
        countSlotsStartingAt,
      )

      // The number printed in the cell must match how many words start there.
      if (slotStartCount !== cellNumber) {
        throw new Error('Puzzle number does not match slot starts')
      }
    })
  })

  return true
}

const validateSlotWordCount = (slots, words) => {
  // There must be the same number of slots as there are words.
  if (slots.length !== words.length) {
    throw new Error('Number of slots must match number of words')
  }

  return true
}

const validateInputs = ({ grid, slots, words, countSlotsStartingAt }) => {
  // Run all validation checks before the crossword solver starts.
  validateWords(words)
  validateSlotWordCount(slots, words)
  validatePuzzleNumbers(grid, slots, countSlotsStartingAt)

  return true
}

module.exports = {
  validateWords,
  validatePuzzleNumbers,
  validateSlotWordCount,
  validateInputs,
}
