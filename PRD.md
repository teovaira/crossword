# Crossword Solver PRD

## Goal
Build a robust crossword solver that reads a crossword puzzle grid and a list of words, finds a unique valid placement for all words, and prints either the completed puzzle or `Error`.

## Scope
- parse puzzle input into a structured grid
- detect all horizontal and vertical word slots
- solve the crossword using backtracking
- verify solution uniqueness
- handle invalid or ambiguous puzzles with an explicit `Error` output

## Functional Requirements
- Input:
  - `puzzle`: a single string with rows separated by `\n`
  - `words`: array of strings (no duplicates allowed)
- Output:
  - solved crossword grid as text
  - or `Error` for invalid/unsolvable/ambiguous cases

### Core features
- parse raw puzzle lines into a matrix
- detect slots with start position, direction, and length
- support both horizontal and vertical slot placement
- check letter intersections during placement
- reject duplicate words in input
- detect no-solution and multiple-solution cases
- enforce puzzle consistency and slot compatibility

### Invalid cases
- `puzzle` is not a string (e.g. a number)
- `words` is not an array (e.g. a number)
- empty puzzle string
- malformed puzzle: rows of unequal length or invalid characters
- any cell contains a number higher than `2`
- duplicate words in the input list
- word count does not match the number of slots
- numbers in the puzzle do not agree with the number of words starting from that cell
- no valid solution exists
- more than one valid solution exists (ambiguous puzzle)

## Non-functional Requirements
- use arrow functions and clear module boundaries
- keep functions small and testable
- provide unit tests and integration tests using Node's built-in test runner
- follow clean JavaScript conventions and maintainable naming
- print `Error` for invalid cases instead of crashing

## Architecture
- `crosswordSolver.js`: public entry point, orchestration, and root export for Zone01-style checks
- `parser.js`: input parsing and slot detection
- `solver.js`: backtracking algorithm and placement logic
- `validation.js`: input validation that returns `true` or `false`
- `utils.js`: shared helpers and formatting functions
- `tests/`: unit and integration test suites

## Run Requirements
The solver is implemented and can be imported from `crosswordSolver.js`.

Run the automated tests from the project root with:

```bash
npm test
```

Run the solver with custom arguments from the project root with this command
format:

```bash
node -e "const crosswordSolver = require('./crosswordSolver.js'); const puzzle = YOUR_PUZZLE_STRING; const words = YOUR_WORDS_ARRAY; crosswordSolver(puzzle, words)"
```

Replace `YOUR_PUZZLE_STRING` with a puzzle string and `YOUR_WORDS_ARRAY` with an
array of words.

`node crosswordSolver.js` exits cleanly by itself because the file exports the
function for the evaluator and tests; it does not include a hard-coded sample
call.

## Data Model

### Grid
The puzzle string is converted into a matrix:

```js
[
  ['2', '0', '0', '1'],
  ['0', '.', '.', '0'],
  ['1', '0', '0', '0'],
  ['0', '.', '.', '0'],
]
```

### Slot
Each detected slot should use this shape:

```js
{
  row: 0,
  col: 0,
  dir: 'H',
  length: 4,
}
```

Use `H` for horizontal slots and `V` for vertical slots.

## Milestones

1. Parser works for valid and invalid raw puzzle input.
2. Slot detection finds horizontal and vertical slots correctly.
3. Word placement checks length, existing letters, and intersections.
4. Backtracking finds a complete solution.
5. Solver counts solutions and rejects ambiguous puzzles.
6. Integration prints solved grid or `Error`.
7. Edge-case tests cover duplicate words, malformed grids, no solution, and multiple solutions.

## Testing Strategy
- `tests/parser.test.js`: parsing and slot detection
- `tests/solver.test.js`: `canPlaceWord`, `placeWord`, backtracking, solution count
- `tests/validation.test.js`: duplicates, malformed puzzles, number consistency
- `tests/integration.test.js`: full `crosswordSolver` behavior and output formatting

## Success Criteria
- unique valid solutions are printed correctly
- invalid puzzles print `Error`
- puzzles with multiple valid solutions print `Error`
- all modules are independently testable
- project structure supports clear team ownership and merges

## Audit Readiness
- `crosswordSolver.js` is present at the project root.
- `crosswordSolver` is exported for tests and evaluator-style checks.
- Invalid inputs, duplicate words, no solution, and multiple solutions print exactly `Error`.
- The solver uses recursive backtracking and stops after detecting more than one solution.
- The automated test suite runs with `npm test`.

## Risks
- Intersections may be overwritten incorrectly during backtracking.
- Ambiguous puzzles must stop after finding two solutions to avoid wasted work.
- Puzzle number validation needs to agree with the slot detection rules.
- Integration must print exactly `Error` for all failure paths.
