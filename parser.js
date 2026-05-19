// parser.js
// Converts the raw puzzle string into a 2D grid, detects every word slot,
// and provides a helper to count how many slots start at any given cell.

// --- parsePuzzle -------------------------------------------------------

// Splits the puzzle string into a 2D array of single characters.
// Returns null for anything that cannot be a valid puzzle.
const parsePuzzle = puzzle => {
  // An empty string has no grid to work with.
  if (puzzle === '') return null

  const rows = puzzle.split('\n')

  // Every row must have at least one cell.
  const width = rows[0].length
  if (width === 0) return null

  for (const row of rows) {
    // Unequal row lengths would give us a jagged grid — not allowed.
    if (row.length !== width) return null

    for (const ch of row) {
      // The only legal characters are '.', '0', '1', and '2'.
      // Any digit higher than 2 means more than one H + one V word could start
      // at the same cell, which the puzzle format does not support.
      if (ch !== '.' && ch !== '0' && ch !== '1' && ch !== '2') return null
    }
  }

  // Turn each row string into an array so cells are addressable as grid[row][col].
  return rows.map(row => row.split(''))
}

// --- findSlots ---------------------------------------------------------

// Scans the grid and collects every word slot.
// A slot is a horizontal or vertical run of 2 or more non-dot cells.
// Shorter runs (single isolated cells) cannot hold a word and are ignored.
const findSlots = grid => {
  const slots = []
  const numRows = grid.length
  const numCols = grid[0].length

  // Horizontal pass: walk each row left-to-right and measure open-cell runs.
  for (let row = 0; row < numRows; row++) {
    let col = 0
    while (col < numCols) {
      // Skip blocked cells — they break any run.
      if (grid[row][col] === '.') {
        col++
        continue
      }

      // Remember where this run begins, then advance until it ends.
      const start = col
      while (col < numCols && grid[row][col] !== '.') {
        col++
      }

      const length = col - start

      // A single open cell is not a word slot.
      if (length >= 2) {
        slots.push({ row, col: start, dir: 'H', length })
      }
    }
  }

  // Vertical pass: same idea but column-by-column, moving top-to-bottom.
  for (let col = 0; col < numCols; col++) {
    let row = 0
    while (row < numRows) {
      if (grid[row][col] === '.') {
        row++
        continue
      }

      const start = row
      while (row < numRows && grid[row][col] !== '.') {
        row++
      }

      const length = row - start

      if (length >= 2) {
        slots.push({ row: start, col, dir: 'V', length })
      }
    }
  }

  return slots
}

// --- countSlotsStartingAt ---------------------------------------------

// Returns how many slots from the list begin exactly at (row, col).
// validation.js calls this to verify that the number printed in each cell
// matches the real count of words that start there.
// The function takes 3 arguments so validation.js can detect its signature
// and forward the slots array correctly.
const countSlotsStartingAt = (slots, row, col) =>
  slots.filter(slot => slot.row === row && slot.col === col).length

module.exports = { parsePuzzle, findSlots, countSlotsStartingAt }
