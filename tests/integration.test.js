const { test } = require('node:test')
const assert = require('node:assert/strict')

// capture console.log output
const captureOutput = fn => {
  const lines = []
  const original = console.log
  console.log = (...args) => lines.push(args.join(' '))
  fn()
  console.log = original
  return lines.join('\n')
}

const crosswordSolver = require('../crosswordSolver.js')

// --- valid puzzles ---

test('integration: solves the small audit puzzle', () => {
  const puzzle = '2001\n0..0\n1000\n0..0'
  const words = ['casa', 'alan', 'ciao', 'anta']
  const output = captureOutput(() => crosswordSolver(puzzle, words))
  assert.equal(output, 'casa\ni..l\nanta\no..n')
})

test('integration: word order does not affect solution', () => {
  const puzzle = '2001\n0..0\n1000\n0..0'
  const words = ['anta', 'ciao', 'alan', 'casa']
  const output = captureOutput(() => crosswordSolver(puzzle, words))
  assert.equal(output, 'casa\ni..l\nanta\no..n')
})

// --- invalid inputs ---

test('integration: puzzle is not a string', () => {
  const output = captureOutput(() => crosswordSolver(123, ['casa']))
  assert.equal(output, 'Error')
})

test('integration: words is not an array', () => {
  const output = captureOutput(() => crosswordSolver('2001\n0..0\n1000\n0..0', 123))
  assert.equal(output, 'Error')
})

test('integration: empty puzzle string', () => {
  const output = captureOutput(() => crosswordSolver('', ['casa', 'alan', 'ciao', 'anta']))
  assert.equal(output, 'Error')
})

test('integration: duplicate words', () => {
  const puzzle = '2001\n0..0\n1000\n0..0'
  const output = captureOutput(() => crosswordSolver(puzzle, ['casa', 'casa', 'ciao', 'anta']))
  assert.equal(output, 'Error')
})

test('integration: number higher than 2 in puzzle', () => {
  const puzzle = '0001\n0..0\n3000\n0..0'
  const output = captureOutput(() => crosswordSolver(puzzle, ['casa', 'alan', 'ciao', 'anta']))
  assert.equal(output, 'Error')
})

test('integration: puzzle numbers do not match slot count', () => {
  const puzzle = '2001\n0..0\n2000\n0..0'
  const output = captureOutput(() => crosswordSolver(puzzle, ['casa', 'alan', 'ciao', 'anta']))
  assert.equal(output, 'Error')
})

test('integration: no solution exists', () => {
  const puzzle = '2001\n0..0\n1000\n0..0'
  const output = captureOutput(() => crosswordSolver(puzzle, ['aaab', 'aaac', 'aaad', 'aaae']))
  assert.equal(output, 'Error')
})

test('integration: multiple solutions exist', () => {
  const puzzle = '2000\n0...\n0...\n0...'
  const output = captureOutput(() => crosswordSolver(puzzle, ['abba', 'assa']))
  assert.equal(output, 'Error')
})
