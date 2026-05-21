// utils.js
// Helper functions that keep the crossword grid data easy to work with.

// Convert grid cells for solving:
// - keep '.' as blocked cells
// - change any other cell to an empty string to show it is open for letters
const normalizeGridForSolving = grid =>
  grid.map(row => row.map(cell => (cell === '.' ? '.' : '')))

// Turn the grid into a readable text block.
// Each row becomes one line, and rows are joined with a newline.
const gridToString = grid => grid.map(row => row.join('')).join('\n')

module.exports = {
  normalizeGridForSolving,
  gridToString,
}
