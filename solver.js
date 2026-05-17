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

module.exports = { canPlaceWord, placeWord }
