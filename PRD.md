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
  - `puzzle`: array of strings representing the crossword grid
  - `words`: array of candidate words
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
- malformed puzzle input
- empty word list when slots exist
- duplicate words, for example `['hello', 'hello']`
- word count and slot requirements cannot match
- no valid solution
- more than one valid solution
- numbers in the puzzle do not agree with the number of words starting from that cell

## Non-functional Requirements
- use arrow functions and clear module boundaries
- keep functions small and testable
- structure code for team collaboration and branch-based workflow
- provide unit tests and integration tests
- follow clean JavaScript conventions and maintainable naming

## Architecture
- `crosswordSolver.js`: public entry point, orchestration, and root export for Zone01-style checks
- `parser.js`: input parsing and slot detection
- `solver.js`: backtracking algorithm and placement logic
- `validation.js`: input and solution validation
- `utils.js`: shared helpers and formatting functions
- `tests/`: unit and integration test suites

## Run Requirements
The project cannot be run as a working solver yet because `crosswordSolver.js` and the helper modules are still placeholders.

Before running the solver:
- implement `crosswordSolver.js`
- implement `parser.js`, `solver.js`, `validation.js`, and `utils.js`
- add direct sample input or export the solver function for tests
- add a `package.json` test script before using `npm test`

Once implemented, the solver can be run from the project root with:

```bash
node crosswordSolver.js
```

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
- invalid puzzles return `Error`
- puzzles with multiple valid solutions return `Error`
- all modules are independently testable
- project structure supports clear team ownership and merges

## Team Workflow
- branches:
  - `main`
  - `parser-logic`
  - `solver-algorithm`
  - `integration-testing`
- each member works in own branch, commits small changes, and pushes early
- integration lead merges parser and solver work into `main`
- final validation and tests are run on `integration-testing`

## Team Responsibilities
- Team Lead / Integration:
  - owns `crosswordSolver.js`, `validation.js`, `tests/integration.test.js`
  - coordinates merges and final behavior
- Parser & Grid Logic:
  - owns `parser.js`, parser tests, slot model
  - provides stable slot output for solver
- Solver / Backtracking:
  - owns `solver.js`, solver tests
  - provides unique-solution detection

## Risks
- Intersections may be overwritten incorrectly during backtracking.
- Ambiguous puzzles must stop after finding two solutions to avoid wasted work.
- Puzzle number validation needs to agree with the slot detection rules.
- Integration must print exactly `Error` for all failure paths.
