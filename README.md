# Crossword Solver

JavaScript crossword solver project for parsing a grid, detecting word slots, solving with backtracking, and printing either the unique solved grid or `Error`.

## Project Structure

```text
crossword/
├── crosswordSolver.js
├── parser.js
├── PRD.md
├── README.md
├── solver.js
├── tests/
│   ├── integration.test.js
│   ├── parser.test.js
│   ├── solver.test.js
│   └── validation.test.js
├── utils.js
└── validation.js
```

## Team Ownership

- Alex: `parser.js`, parser tests, slot detection tests
- Efi: `validation.js`, `utils.js`, validation tests, `README.md`, `PRD.md`
- Theo: `crosswordSolver.js`, `solver.js`, solver tests, integration tests, backtracking behavior

## Commands

Run the test suite from the project root with:

```bash
npm test
```

`crosswordSolver.js` exports the solver function. To run the function with
arguments from the terminal without editing the source file, use this command
format:

```bash
node -e "const crosswordSolver = require('./crosswordSolver.js'); const puzzle = '2001\n0..0\n1000\n0..0'; const words = ['casa', 'alan', 'ciao', 'anta']; crosswordSolver(puzzle, words)"
```

## Expected Behavior

`crosswordSolver(puzzle, words)` should print the solved grid when exactly one valid solution exists. It should print `Error` for invalid input, duplicate words, no solution, or multiple solutions.

## Audit Checklist

- `crosswordSolver.js` is present at the project root.
- The exported function is named `crosswordSolver`.
- The function takes two arguments:
  - `puzzle`: a string with rows separated by `\n`
  - `words`: an array of strings
- The function prints the solved crossword when there is exactly one valid solution.
- The function prints `Error` for invalid input, duplicate words, no solution, or multiple solutions.
- The solver uses a backtracking algorithm.
- Tests can be run with `npm test`.

### Function Arguments

```js
const crosswordSolver = require('./crosswordSolver.js')

const puzzle = 'string with rows separated by \\n'
const words = ['word1', 'word2', 'word3']

crosswordSolver(puzzle, words)
```
