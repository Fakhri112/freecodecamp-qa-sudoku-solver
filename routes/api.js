"use strict";

const {
	inputToArray,
	assignCheck,
	coordinateNumber,
} = require("../lib/function.js");
const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
	let solver = new SudokuSolver();
	let validate = solver.validate();

	app.route("/api/check").post((req, res) => {
		let puzzle = req.body.puzzle;
		let value = req.body.value;
		let coordinate = req.body.coordinate;

		if (
			typeof validate.checkFieldValidate(puzzle, value, coordinate) == "object"
		) {
			return res.json(validate.checkFieldValidate(puzzle, value, coordinate));
		}

		if (typeof validate.coordinateValidate(coordinate) == "object") {
			return res.json(validate.coordinateValidate(coordinate));
		}
		if (typeof validate.valueValidate(value) == "object") {
			return res.json(validate.valueValidate(value));
		}

		if (typeof validate.lengthValidate(puzzle) == "object") {
			return res.json(validate.lengthValidate(puzzle));
		}
		if (typeof validate.puzzleValidate(puzzle) == "object") {
			return res.json(validate.puzzleValidate(puzzle));
		}

		let sudokuArray = inputToArray(puzzle);
		let row = coordinateNumber(coordinate, "row");
		let column = coordinateNumber(coordinate, "column");
		sudokuArray[row][column] = 0;

		const assignCheck = (row, col, grid, k) => {
			let conflict = [];

			if (typeof solver.checkRowPlacement(grid, row, k) == "string") {
				conflict.push(solver.checkRowPlacement(grid, row, k));
			}
			if (typeof solver.checkColPlacement(grid, col, k) == "string") {
				conflict.push(solver.checkColPlacement(grid, col, k));
			}

			if (typeof solver.checkRegionPlacement(grid, row, col, k) == "string") {
				conflict.push(solver.checkRegionPlacement(grid, row, col, k));
			}

			if (conflict.length !== 0) {
				return conflict;
			}
			return true;
		};

		let result = assignCheck(row, column, sudokuArray, value);
		if (result != true) {
			return res.json({ valid: false, conflict: result });
		}
		return res.json({ valid: true });
	});

	app.route("/api/solve").post((req, res) => {
		let puzzle = req.body.puzzle;

		if (typeof validate.solveFieldValidate(puzzle) == "object") {
			return res.json(validate.solveFieldValidate(puzzle));
		}

		if (typeof validate.puzzleValidate(puzzle) == "object") {
			return res.json(validate.puzzleValidate(puzzle));
		}
		if (typeof validate.lengthValidate(puzzle) == "object") {
			return res.json(validate.lengthValidate(puzzle));
		}
		let sudokuArray = inputToArray(puzzle);
		let result = solver.solve(sudokuArray);
		return res.json(result);
	});
};
