const inputToArray = (puzzleString) => {
	let grid = [];
	let subGrid = [];
	let segment = 0;
	for (let i = 0; i < puzzleString.length; i++) {
		if (puzzleString.charAt(i) == ".") {
			subGrid.push(0);
		} else {
			subGrid.push(Number.parseInt(puzzleString.charAt(i)));
		}
		if (segment == 8) {
			segment = 0;
			grid.push(subGrid);
			subGrid = [];
		} else {
			segment++;
		}
	}
	return grid;
};

const arrayToNumber = (array) => {
	let solution = "";
	for (let i = 0; i < array.length; i++) {
		for (let j = 0; j < array.length; j++) {
			solution += array[i][j];
		}
	}
	return solution;
};

const coordinateNumber = (string, direction) => {
	let coordinate;
	if (direction == "row") {
		let text_upper = string.toUpperCase();
		coordinate = text_upper.charCodeAt(0) - 65;
		return coordinate;
	}
	if (direction == "column") {
		let getNumber = string.charAt(1);
		coordinate = Number.parseInt(getNumber) - 1;
		return coordinate;
	}
};

module.exports = {
	arrayToNumber,
	inputToArray,
	coordinateNumber,
};
