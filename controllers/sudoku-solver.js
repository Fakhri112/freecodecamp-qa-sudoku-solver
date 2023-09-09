const {
	arrayToNumber,
	inputToArray,
	presolve,
	sudoku_backtrack_algo,
} = require("../lib/function");
class SudokuSolver {
	validate() {
		function lengthValidate(puzzle) {
			if (puzzle.length != 81) {
				return { error: "Expected puzzle to be 81 characters long" };
			}
			return true;
		}
		function puzzleValidate(puzzle) {
			if (!puzzle.match(/^(?=.*[0-9])(?=.*\.)[0-9.]+$/)) {
				return { error: "Invalid characters in puzzle" };
			}
			return true;
		}
		function solveFieldValidate(puzzle) {
			if (!puzzle) {
				return { error: "Required field missing" };
			}
			return true;
		}

		function checkFieldValidate(puzzle, value, coordinate) {
			if (!puzzle || !value || !coordinate) {
				return { error: "Required field(s) missing" };
			}
			true;
		}

		function coordinateValidate(coordinate) {
			if (!coordinate.match(/^[a-i1-9]{2}$/i)) {
				return { error: "Invalid coordinate" };
			}
			return true;
		}
		function valueValidate(value) {
			if (!value.match(/^[1-9]{1}$/)) {
				return { error: "Invalid value" };
			}
			return true;
		}

		return {
			lengthValidate,
			puzzleValidate,
			solveFieldValidate,
			coordinateValidate,
			valueValidate,
			checkFieldValidate,
		};
	}

	checkRowPlacement(puzzleString, row, k) {
		for (let col_check = 0; col_check < 9; col_check++) {
			if (puzzleString[row][col_check] == k) {
				return "row";
			}
		}
		return true;
	}

	checkColPlacement(puzzleString, column, k) {
		for (let row_check = 0; row_check < 9; row_check++) {
			if (puzzleString[row_check][column] == k) {
				return "column";
			}
		}
		return true;
	}

	checkRegionPlacement(puzzleString, row, column, k) {
		function subGrid_Finder(x) {
			if (0 <= x && x < 3) {
				return 0;
			} else if (3 <= x && x < 6) {
				return 3;
			} else if (6 <= x && x < 9) {
				return 6;
			}
		}
		for (
			let subgrid_row = subGrid_Finder(row);
			subgrid_row < subGrid_Finder(row) + 3;
			subgrid_row++
		) {
			for (
				let subgrid_column = subGrid_Finder(column);
				subgrid_column < subGrid_Finder(column) + 3;
				subgrid_column++
			) {
				if (puzzleString[subgrid_row][subgrid_column] == k) {
					return "region";
				}
			}
		}
		return true;
	}

	solve(puzzleString) {
		let sudokuArray = puzzleString;
		const assignCheck = (row, col, grid, k) => {
			let conflict = [];

			if (typeof this.checkRowPlacement(grid, row, k) == "string") {
				conflict.push(this.checkRowPlacement(grid, row, k));
			}
			if (typeof this.checkColPlacement(grid, col, k) == "string") {
				conflict.push(this.checkColPlacement(grid, col, k));
			}

			if (typeof this.checkRegionPlacement(grid, row, col, k) == "string") {
				conflict.push(this.checkRegionPlacement(grid, row, col, k));
			}

			if (conflict.length !== 0) {
				return conflict;
			}
			return true;
		};

		const presolve = (r = 0, c = 0, grid) => {
			let solved_sudoku = grid;
			if (r == 9) {
				return solved_sudoku;
			} else if (c == 9) {
				return sudoku_backtrack_algo(r + 1, 0, solved_sudoku);
			} else if (solved_sudoku[r][c] == 0) {
				return sudoku_backtrack_algo(r, c + 1, solved_sudoku);
			} else {
				let currentNumber = solved_sudoku[r][c];
				solved_sudoku[r][c] = 0;
				if (assignCheck(r, c, solved_sudoku, currentNumber) == true) {
					return sudoku_backtrack_algo(r, c + 1, solved_sudoku);
				}
				return false;
			}
		};

		const sudoku_backtrack_algo = (r = 0, c = 0, grid) => {
			let solved_sudoku = grid;
			if (r == 9) {
				return solved_sudoku;
			} else if (c == 9) {
				return sudoku_backtrack_algo(r + 1, 0, solved_sudoku);
			} else if (solved_sudoku[r][c] != 0) {
				return sudoku_backtrack_algo(r, c + 1, solved_sudoku);
			} else {
				for (let number = 1; number < 10; number++) {
					if (assignCheck(r, c, solved_sudoku, number) == true) {
						solved_sudoku[r][c] = number;
						if (sudoku_backtrack_algo(r, c + 1, solved_sudoku)) {
							return solved_sudoku;
						}
						solved_sudoku[r][c] = 0;
					}
				}
				return false;
			}
		};
		if (!presolve(0, 0, sudokuArray)) {
			return { error: "Puzzle cannot be solved" };
		}
		let solution = arrayToNumber(sudoku_backtrack_algo(0, 0, sudokuArray));
		return { solution: solution };
	}
}

module.exports = SudokuSolver;
