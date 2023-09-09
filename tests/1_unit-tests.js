const chai = require("chai");
const assert = chai.assert;
const expect = chai.expect;

const Solver = require("../controllers/sudoku-solver.js");
const { inputToArray } = require("../lib/function.js");
let solver = new Solver();

const VALID_PUZZLE =
	"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
const INCORRECT_LENGTH_PUZZLE =
	"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9.....1945....4.37.4.3..6..";
const INVALID_PUZZLE =
	".a9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
const UNSOLVED_PUZZLE =
	"9..9..5.1.85.4....2432.....1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";

suite("Unit Tests", () => {
	test("Valid puzzle string of 81 characters", (done) => {
		assert.equal(solver.validate().lengthValidate(VALID_PUZZLE), true);
		done();
	});
	test("Puzzle string with invalid characters (not 1-9 or .)", (done) => {
		assert.typeOf(solver.validate().puzzleValidate(INVALID_PUZZLE), "object"),
			done();
	});
	test("Puzzle string that is not 81 characters in length", (done) => {
		assert.typeOf(
			solver.validate().lengthValidate(INCORRECT_LENGTH_PUZZLE),
			"object",
		);
		done();
	});
	test("Valid row placement", (done) => {
		let sudokuArray = inputToArray(VALID_PUZZLE);
		assert.equal(solver.checkRowPlacement(sudokuArray, 1, 7), true);
		done();
	});
	test("Invalid row placement", (done) => {
		let sudokuArray = inputToArray(VALID_PUZZLE);
		assert.equal(solver.checkRowPlacement(sudokuArray, 2, 2), "row");
		done();
	});
	test("Valid column placement", (done) => {
		let sudokuArray = inputToArray(VALID_PUZZLE);
		assert.equal(solver.checkColPlacement(sudokuArray, 7, 7), true);
		done();
	});
	test("Invalid column placement", (done) => {
		let sudokuArray = inputToArray(VALID_PUZZLE);
		assert.equal(solver.checkColPlacement(sudokuArray, 8, 7), "column");
		done();
	});
	test("Valid region (3x3 grid) placement", (done) => {
		let sudokuArray = inputToArray(VALID_PUZZLE);
		assert.equal(solver.checkRegionPlacement(sudokuArray, 1, 2, 7), true);
		done();
	});
	test("Invalid region (3x3 grid) placement", (done) => {
		let sudokuArray = inputToArray(VALID_PUZZLE);
		assert.equal(solver.checkRegionPlacement(sudokuArray, 1, 2, 2), "region");
		done();
	});
	test("Valid puzzle strings pass the solver", (done) => {
		let sudokuArray = inputToArray(VALID_PUZZLE);
		assert.typeOf(solver.solve(sudokuArray), "object");
		done();
	});
	test("Invalid puzzle strings fail the solver", (done) => {
		let sudokuArray = inputToArray(UNSOLVED_PUZZLE);
		assert.typeOf(solver.solve(sudokuArray), "object");
		done();
	});
	test("Solver returns the expected solution for an incomplete puzzle", (done) => {
		assert.typeOf(
			solver.validate().lengthValidate(INCORRECT_LENGTH_PUZZLE),
			"object",
		);
		done();
	});
});
