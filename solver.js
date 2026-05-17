const canPlaceWord = (grid, slot, word) => {
  if (word.length !== slot.length) return false

  for (let i = 0; i < word.length; i++) {
    const row = slot.dir === 'H' ? slot.row : slot.row + i
    const col = slot.dir === 'H' ? slot.col + i : slot.col
    const cell = grid[row][col]
    if (cell !== '' && cell !== word[i]) return false
  }

  return true
}

const placeWord = (grid, slot, word) => {
  const newGrid = grid.map(row => [...row])
  for (let i = 0; i < word.length; i++) {
    const row = slot.dir === 'H' ? slot.row : slot.row + i
    const col = slot.dir === 'H' ? slot.col + i : slot.col
    newGrid[row][col] = word[i]
  }
  return newGrid
}

const solveCrossword = (grid, slots, words) => {
  let solutionCount = 0
  let uniqueGrid = null

  const backtrack = (grid, slotIndex, usedWords) => {
    if (solutionCount > 1) return
    if (slotIndex === slots.length) {
      solutionCount++
      if (solutionCount === 1) uniqueGrid = grid
      return
    }

    const slot = slots[slotIndex]
    for (const word of words) {
      if (usedWords.has(word)) continue
      if (!canPlaceWord(grid, slot, word)) continue
      usedWords.add(word)
      backtrack(placeWord(grid, slot, word), slotIndex + 1, usedWords)
      usedWords.delete(word)
    }
  }

  backtrack(grid, 0, new Set())

  if (solutionCount === 1) return { status: 'unique', grid: uniqueGrid }
  if (solutionCount === 0) return { status: 'none' }
  return { status: 'multiple' }
}

module.exports = { canPlaceWord, placeWord, solveCrossword }
