# Crossword Solver Coding Tasks

## Goal
All three people must write production code. The work is split so each person owns real implementation files, matching tests, and a clear part of the final solver.

The final program must define `crosswordSolver(puzzle, words)`, solve valid puzzles, print the completed grid, and print exactly `Error` for invalid, impossible, or ambiguous puzzles.

## Current Problem
The repository has the right file names, but the files are placeholders. The project currently fails the audit because `crosswordSolver` is not implemented.

## Shared Rules For Everyone
- Use CommonJS exports with `module.exports`.
- Keep functions small and testable.
- Do not hardcode audit answers.
- Do not print debug output from helper modules.
- Only `crosswordSolver.js` should print final output.
- Every invalid path must become exactly `Error`.
- Each person must add tests for the code they write.

## Shared Data Contracts

### Parsed Grid
Use a matrix of characters:

```js
[
  ['2', '0', '0', '1'],
  ['0', '.', '.', '0'],
  ['1', '0', '0', '0'],
  ['0', '.', '.', '0'],
]
```

### Slot Object
Use this object for every crossword slot:

```js
{
  row: 0,
  col: 0,
  dir: 'H',
  length: 4,
}
```

`dir` must be `H` for horizontal slots or `V` for vertical slots.

### Solver Result
The solver should return one of these:

```js
{ status: 'unique', grid }
{ status: 'none' }
{ status: 'multiple' }
```

## Alex: Input Parser And Slot Detection

### Coding Ownership
- `parser.js`
- `tests/parser.test.js`

### Code To Write
Implement the parser layer. This person is responsible for turning the raw puzzle string into a grid and discovering every place where a word can go.

### Required Functions
Implement and export:

```js
const parsePuzzle = puzzle => {}
const isFillableCell = cell => {}
const findSlots = grid => {}
const countSlotsStartingAt = (grid, row, col) => {}

module.exports = {
  parsePuzzle,
  isFillableCell,
  findSlots,
  countSlotsStartingAt,
}
```

### Function Details

#### `parsePuzzle(puzzle)`
- Accepts a string.
- Splits by newline.
- Rejects empty strings.
- Rejects rows with different lengths.
- Rejects characters other than `.`, `0`, `1`, or `2`.
- Rejects starting numbers higher than `2`.
- Returns a 2D character grid.
- Throws a controlled error or returns `null` for invalid input. Agree with Person 3 before final merge.

#### `isFillableCell(cell)`
- Returns `true` for `0`, `1`, `2`, and letters.
- Returns `false` for `.`.

#### `findSlots(grid)`
- Finds all horizontal and vertical slots.
- A slot must have length at least `2`.
- A horizontal slot starts when:
  - the current cell is fillable
  - the cell to the left is missing or blocked
  - the cell to the right is fillable
- A vertical slot starts when:
  - the current cell is fillable
  - the cell above is missing or blocked
  - the cell below is fillable
- Returns an array of slot objects.

#### `countSlotsStartingAt(grid, row, col)`
- Counts how many slots start from a given cell.
- Used later to verify puzzle numbers.
- Possible valid values are `0`, `1`, or `2`.

### Tests To Write
Add real assertions in `tests/parser.test.js` for:
- valid puzzle parsing
- empty puzzle rejection
- non-string puzzle rejection
- uneven row rejection
- invalid character rejection
- slot detection for the small audit puzzle
- slot detection for horizontal and vertical slots
- correct count for cells marked `1` and `2`

### Acceptance Criteria
- Person 3 can call `parsePuzzle(puzzle)` and receive a grid.
- Person 2 can call `findSlots(grid)` and receive correct slot objects.
- Parser tests pass.

## Efi: Validation And Output Utilities

### Coding Ownership
- `validation.js`
- `utils.js`
- `tests/validation.test.js`

### Code To Write
Implement all validation that decides whether the puzzle and words are allowed before solving. Also implement reusable formatting helpers.

### Required Functions
Implement and export from `validation.js`:

```js
const validateWords = words => {}
const validatePuzzleNumbers = (grid, slots, countSlotsStartingAt) => {}
const validateSlotWordCount = (slots, words) => {}
const validateInputs = ({ grid, slots, words, countSlotsStartingAt }) => {}

module.exports = {
  validateWords,
  validatePuzzleNumbers,
  validateSlotWordCount,
  validateInputs,
}
```

Implement and export from `utils.js`:

```js
const cloneGrid = grid => {}
const normalizeGridForSolving = grid => {}
const gridToString = grid => {}

module.exports = {
  cloneGrid,
  normalizeGridForSolving,
  gridToString,
}
```

### Function Details

#### `validateWords(words)`
- Requires `words` to be an array.
- Requires every word to be a non-empty string.
- Rejects duplicate words.
- Should reject invalid word values before solving starts.

#### `validatePuzzleNumbers(grid, slots, countSlotsStartingAt)`
- For every numbered cell in the grid:
  - `1` means exactly one slot starts there.
  - `2` means exactly two slots start there.
- For every slot start cell:
  - the puzzle must contain a number greater than `0`.
- Rejects mismatch cases such as:
  ```js
  const puzzle = '2001\n0..0\n2000\n0..0'
  ```

#### `validateSlotWordCount(slots, words)`
- Requires the number of slots to equal the number of words.
- Rejects extra words.
- Rejects missing words.

#### `validateInputs(...)`
- Combines all validation checks into one call for integration.
- Returns `true` for valid data.
- Returns `false` or throws a controlled error for invalid data. Agree with Person 3 before final merge.

#### `cloneGrid(grid)`
- Returns a deep copy of the grid.

#### `normalizeGridForSolving(grid)`
- Converts `0`, `1`, and `2` cells into empty fillable cells.
- Keeps `.` as blocked cells.
- This gives the solver a clean grid to fill with letters.

#### `gridToString(grid)`
- Converts a solved grid back into the exact output format.
- Rows are joined with no spaces.
- Lines are joined with `\n`.

### Tests To Write
Add real assertions in `tests/validation.test.js` for:
- duplicate words
- non-array words
- non-string word values
- empty word values
- puzzle number mismatch
- starting number higher than `2`
- slot count mismatch
- grid formatting with `gridToString`
- clone behavior that does not mutate the original grid

### Acceptance Criteria
- Invalid audit cases are rejected before solving.
- Formatting produces exact expected output strings.
- Validation tests pass.

## Theo: Backtracking Solver And Integration

### Coding Ownership
- `solver.js`
- `crosswordSolver.js`
- `tests/solver.test.js`
- `tests/integration.test.js`
- `package.json`

### Code To Write
Implement the actual solving algorithm and wire the whole project together.

### Required Functions In `solver.js`
Implement and export:

```js
const canPlaceWord = (grid, slot, word) => {}
const placeWord = (grid, slot, word) => {}
const solveCrossword = (grid, slots, words) => {}

module.exports = {
  canPlaceWord,
  placeWord,
  solveCrossword,
}
```

### Function Details

#### `canPlaceWord(grid, slot, word)`
- Checks word length against slot length.
- Allows placement on empty cells.
- Allows placement over the same existing letter.
- Rejects conflicting letters.
- Never mutates the grid.

#### `placeWord(grid, slot, word)`
- Places a word into a cloned grid.
- Does not mutate the input grid.
- Returns the new grid.

#### `solveCrossword(grid, slots, words)`
- Uses recursive backtracking.
- Tracks which words have been used.
- Finds all possible solutions, but stops after two.
- Returns:
  ```js
  { status: 'unique', grid }
  ```
  when exactly one solution exists.
- Returns:
  ```js
  { status: 'none' }
  ```
  when no solution exists.
- Returns:
  ```js
  { status: 'multiple' }
  ```
  when more than one solution exists.
- Should choose the most constrained next slot when possible.

### Required Code In `crosswordSolver.js`
Implement:

```js
const crosswordSolver = (puzzle, words) => {}

module.exports = crosswordSolver
```

The function must:
- call `parsePuzzle`
- call `findSlots`
- call validation
- normalize the grid
- call `solveCrossword`
- print solved grid with `console.log`
- print exactly `Error` for invalid input, no solution, or multiple solutions

### Important Integration Rule
The audit may append this directly to `crosswordSolver.js`:

```js
const puzzle = '2001\n0..0\n1000\n0..0'
const words = ['casa', 'alan', 'ciao', 'anta']

crosswordSolver(puzzle, words)
```

That must work.

### Tests To Write
Add real assertions in `tests/solver.test.js` for:
- `canPlaceWord` with matching empty cells
- `canPlaceWord` with crossing letters
- `canPlaceWord` rejecting conflicts
- `placeWord` not mutating the original grid
- unique solution
- no solution
- multiple solutions

Add real assertions in `tests/integration.test.js` for every audit case:
- simple valid puzzle
- summer puzzle
- food puzzle
- summer puzzle with reversed words
- mismatch between word count and starting cells
- starting number higher than `2`
- duplicate words
- empty puzzle
- wrong puzzle type
- wrong words type
- multiple solutions
- no solution

### Package Setup
`package.json` is already configured. Test script uses Node's built-in runner:

```json
{
  "scripts": {
    "test": "node --test tests/*.test.js"
  }
}
```

Tests must use `node:test` and `node:assert/strict` — not Jest syntax.

### Acceptance Criteria
- `node crosswordSolver.js` does not crash.
- Appended audit calls work.
- `npm test` passes.
- All valid audit cases print exact solved grids.
- All invalid audit cases print exactly `Error`.
- The solver clearly uses backtracking.

## Integration Plan
- All members push directly to `main`. Use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`.
- Agreed error contract: `parsePuzzle` and `validateInputs` return `null` for invalid input. No `throw`.

### Order
1. Alex implements `parser.js` and parser tests.
2. Efi implements `validation.js`, `utils.js`, and validation tests.
3. Theo starts `solver.js` unit tests using simple handmade grids while waiting for parser output.
4. Theo wires everything in `crosswordSolver.js` once parser and validation are ready.
5. Everyone runs `npm test`.
6. Everyone manually runs the audit examples with `node crosswordSolver.js`.
7. Fix output formatting last — the audit expects exact text.

## Definition Of Done
- Every person has written code in their owned implementation files.
- Every person has written tests.
- No placeholder files remain.
- `crosswordSolver` is defined.
- Backtracking is implemented.
- All audit examples pass.
- Invalid cases print only `Error`.
- No hardcoded audit solutions exist.
