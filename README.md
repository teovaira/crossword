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

- `parser-logic`: `parser.js`, parser tests, slot detection tests
- `solver-algorithm`: `solver.js`, solver tests, backtracking behavior
- `integration-testing`: `crosswordSolver.js`, `validation.js`, integration tests, final output

## Commands

No package script is configured yet. Add a `package.json` test script before running the test suite with `npm test`.

## Expected Behavior

`crosswordSolver(puzzle, words)` should print the solved grid when exactly one valid solution exists. It should print `Error` for invalid input, duplicate words, no solution, or multiple solutions.
