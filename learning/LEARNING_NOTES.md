# Crossword Solver Learning Notes

## What This Project Is About
This project is a JavaScript crossword solver.

The program receives:
- a crossword puzzle as a string
- a list of words

It must place all words into the puzzle. If there is exactly one valid solution, it prints the solved crossword. If the puzzle is invalid, impossible, or has more than one solution, it prints:

```text
Error
```

## Small Example

Input puzzle:

```js
const puzzle = '2001\n0..0\n1000\n0..0'
const words = ['casa', 'alan', 'ciao', 'anta']
```

Expected output:

```text
casa
i..l
anta
o..n
```

The dots `.` are blocked cells. The `0`, `1`, and `2` characters are fillable cells.

## What The Numbers Mean
- `0` means a fillable cell where a letter can go.
- `1` means one word starts from this cell.
- `2` means two words start from this cell.
- `.` means blocked cell.

Example:

```text
2001
0..0
1000
0..0
```

The first cell is `2`, so two words start there:
- one horizontal word
- one vertical word

## Main Problem To Solve
The solver must:
1. Read the puzzle.
2. Convert it into a grid.
3. Find every horizontal and vertical word slot.
4. Check that the input is valid.
5. Try placing words into slots.
6. Use backtracking when a choice does not work.
7. Detect if there is no solution.
8. Detect if there is more than one solution.
9. Print the final result.

## Important JavaScript Topics To Learn

### Variables
Learn the difference between:

```js
const name = 'casa'
let count = 0
```

Use `const` when the variable should not be reassigned. Use `let` when the value changes.

### Strings
You need strings for puzzles and words.

Important methods:

```js
puzzle.split('\n')
word.length
row[index]
```

### Arrays
The grid will be an array of arrays.

Important methods:

```js
array.map(...)
array.filter(...)
array.includes(...)
array.push(...)
array.join('')
```

### Objects
Slots should be represented as objects:

```js
{
  row: 0,
  col: 0,
  dir: 'H',
  length: 4,
}
```

Learn how to read object values:

```js
slot.row
slot.col
slot.dir
slot.length
```

### Functions
This project should be split into small functions.

Example:

```js
const isFillableCell = cell => cell !== '.'
```

Each function should do one clear job.

### Loops
You need loops to walk through the grid.

Examples:

```js
for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[row].length; col++) {
    // check cell
  }
}
```

### Conditions
You need `if` statements to check rules.

Example:

```js
if (cell === '.') {
  return false
}
```

### Modules
This project uses CommonJS modules.

Export functions:

```js
module.exports = {
  parsePuzzle,
  findSlots,
}
```

Import functions:

```js
const { parsePuzzle, findSlots } = require('./parser')
```

## Project-Specific Concepts

### Grid
A grid is a 2D array.

Puzzle string:

```text
2001
0..0
1000
0..0
```

Grid:

```js
[
  ['2', '0', '0', '1'],
  ['0', '.', '.', '0'],
  ['1', '0', '0', '0'],
  ['0', '.', '.', '0'],
]
```

### Slot
A slot is a place where a word can fit.

Horizontal slot:

```js
{
  row: 0,
  col: 0,
  dir: 'H',
  length: 4,
}
```

Vertical slot:

```js
{
  row: 0,
  col: 0,
  dir: 'V',
  length: 4,
}
```

### Word Placement
When placing a word:
- the word length must match the slot length
- letters must not conflict
- matching crossing letters are allowed
- blocked cells must stay as `.`

Example:

```text
casa
i..l
anta
o..n
```

The `a` in `casa` and the `a` in `alan` can cross if they are in the same cell.

### Backtracking
Backtracking means:
1. Try a word in a slot.
2. Continue solving.
3. If it fails, undo that choice.
4. Try another word.

Simple idea:

```js
const solve = state => {
  if (isComplete(state)) {
    return state
  }

  for (const choice of choices) {
    if (isValid(choice)) {
      makeChoice(choice)
      solve(state)
      undoChoice(choice)
    }
  }
}
```

Backtracking is the core algorithm of this project.

## Files In This Project

### `crosswordSolver.js`
The main file.

It should:
- receive `puzzle` and `words`
- call parser functions
- call validation functions
- call the solver
- print solved grid or `Error`

### `parser.js`
Responsible for:
- parsing the puzzle string
- creating the grid
- finding horizontal and vertical slots

### `validation.js`
Responsible for:
- checking input types
- checking duplicate words
- checking number rules
- checking slot and word count

### `solver.js`
Responsible for:
- checking if a word can be placed
- placing words
- solving with backtracking
- detecting no solution or multiple solutions

### `utils.js`
Responsible for small shared helpers:
- clone a grid
- convert grid to string
- normalize numbers into empty cells

### `tests/`
Contains tests for each part of the project.

## Commands To Know

Run the main file:

```bash
node crosswordSolver.js
```

Run tests:

```bash
npm test
```

Check Git status:

```bash
git status
```

Create a branch:

```bash
git checkout -b parser-logic
```

Add files:

```bash
git add .
```

Commit:

```bash
git commit -m "Implement parser"
```

## Testing Topics To Learn

### Node Test Runner
This project can use Node's built-in test runner.

Example:

```js
const test = require('node:test')
const assert = require('node:assert')

test('adds numbers', () => {
  assert.equal(1 + 1, 2)
})
```

### What To Test
Test small functions first.

Good examples:
- `parsePuzzle` rejects bad input
- `findSlots` finds correct slots
- `validateWords` rejects duplicates
- `canPlaceWord` rejects letter conflicts
- `crosswordSolver` prints `Error` for bad input

## Common Mistakes To Avoid
- Printing extra text instead of only the solved grid or `Error`.
- Hardcoding the audit answers.
- Mutating the original grid by accident.
- Forgetting to detect multiple solutions.
- Forgetting duplicate words.
- Forgetting reversed word order should still work.
- Letting raw JavaScript errors crash invalid input cases.
- Writing one giant function instead of small testable functions.

## Team Learning Goals
By the end of this project, everyone should understand:
- how to split a program into modules
- how to export and import functions
- how to use arrays and strings
- how to represent a grid
- how to write basic tests
- how recursion works
- how backtracking works
- how to work with Git branches
- how to debug one small problem at a time

## Suggested Learning Order
1. Learn strings, arrays, and objects.
2. Learn functions and modules.
3. Learn how to represent the puzzle as a grid.
4. Learn how to find slots.
5. Learn validation rules.
6. Learn word placement.
7. Learn recursion.
8. Learn backtracking.
9. Learn tests.
10. Learn final integration and exact output formatting.

## Good Team Habits
- Ask questions early.
- Explain your function before merging it.
- Keep commits small.
- Test one function before moving to the next.
- Read each other's code.
- Do not be afraid to rewrite a small function after learning a better way.
- Keep the final output clean.

## Definition Of Learning Done
The project is not only done when it passes tests. It is done when every team member can explain:
- what their file does
- how data moves through the project
- why invalid inputs return `Error`
- how the solver tries words
- how backtracking finds or rejects solutions
