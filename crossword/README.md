# Crossword Solver

JavaScript crossword solver project for parsing a grid, detecting word slots, solving with backtracking, and printing either the unique solved grid or `Error`.

## Project Structure

```text
crossword/
├── crosswordSolver.js
├── package.json
├── PRD.md
├── README.md
├── src/
│   ├── crosswordSolver.js
│   ├── parser.js
│   ├── solver.js
│   ├── utils.js
│   └── validation.js
└── tests/
    ├── integration.test.js
    ├── parser.test.js
    ├── solver.test.js
    └── validation.test.js
```

## Team Ownership

- `parser-logic`: `src/parser.js`, parser tests, slot detection tests
- `solver-algorithm`: `src/solver.js`, solver tests, backtracking behavior
- `integration-testing`: `src/crosswordSolver.js`, validation, integration tests, final output

## Commands

```bash
npm test
```

## Expected Behavior

`crosswordSolver(puzzle, words)` should print the solved grid when exactly one valid solution exists. It should print `Error` for invalid input, duplicate words, no solution, or multiple solutions.
