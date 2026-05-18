// Backtracking solver: checks placement, places words, finds unique solution.

// Checks if a word can legally go into a slot without modifying the grid.
// A placement is valid if every letter either lands on an empty cell
// or matches a letter already there from an intersecting word.
const canPlaceWord = (grid, slot, word) => {
  if (word.length !== slot.length) return false

  for (let i = 0; i < word.length; i++) {
    // row and col shift depending on direction:
    // H → move along the column, row stays fixed
    // V → move along the row, col stays fixed
    const row = slot.dir === 'H' ? slot.row : slot.row + i
    const col = slot.dir === 'H' ? slot.col + i : slot.col
    const cell = grid[row][col]
    // reject only if the cell is already occupied AND conflicts with our letter
    if (cell !== '' && cell !== word[i]) return false
  }

  return true
}

// Places a word into a copy of the grid and returns the new grid.
// Never mutates the original — backtracking depends on previous states being intact.
const placeWord = (grid, slot, word) => {
  // deep copy: map creates a new outer array, spread creates new inner arrays
  const newGrid = grid.map(row => [...row])
  for (let i = 0; i < word.length; i++) {
    const row = slot.dir === 'H' ? slot.row : slot.row + i
    const col = slot.dir === 'H' ? slot.col + i : slot.col
    newGrid[row][col] = word[i]
  }
  return newGrid
}

// Finds all valid complete solutions using recursive backtracking.
// Fills one slot at a time, tries every unused word, and undoes the choice
// if it leads to a dead end — then tries the next word.
// Stops after finding two solutions to avoid unnecessary work.
const solveCrossword = (grid, slots, words) => {
  let solutionCount = 0
  let uniqueGrid = null

  const backtrack = (grid, slotIndex, usedWords) => {
    // no point continuing once we know there are multiple solutions
    if (solutionCount > 1) return

    // base case: all slots filled — this is a complete solution
    if (slotIndex === slots.length) {
      solutionCount++
      // save the grid only for the first solution found
      if (solutionCount === 1) uniqueGrid = grid
      return
    }

    const slot = slots[slotIndex]
    for (const word of words) {
      if (usedWords.has(word)) continue
      if (!canPlaceWord(grid, slot, word)) continue

      // tentatively place the word and go deeper into the next slot
      usedWords.add(word)
      backtrack(placeWord(grid, slot, word), slotIndex + 1, usedWords)
      // undo the choice so the next word in the loop starts from a clean state
      usedWords.delete(word)
    }
  }

  backtrack(grid, 0, new Set())

  if (solutionCount === 1) return { status: 'unique', grid: uniqueGrid }
  if (solutionCount === 0) return { status: 'none' }
  return { status: 'multiple' }
}

module.exports = { canPlaceWord, placeWord, solveCrossword }
