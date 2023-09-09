const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

const VALID_PUZZLE =
	"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
const INCORRECT_LENGTH_PUZZLE =
	"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9.....1945....4.37.4.3..6..";
const INVALID_PUZZLE =
	".a9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
const UNSOLVED_PUZZLE =
	"9..9..5.1.85.4....2432.....1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";

suite("Functional Tests", () => {
	test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function (done) {
		chai
			.request(server)
			.post("/api/solve")
			.send({
				puzzle: VALID_PUZZLE,
			})
			.end(function (err, res) {
				assert.include(res.text, "solution");
				done();
			});
	});
	test("Solve a puzzle with missing puzzle string: POST request to /api/solve", function (done) {
		chai
			.request(server)
			.post("/api/solve")
			.send({
				puzzle: undefined,
			})
			.end(function (err, res) {
				assert.include(res.text, "Required field missing");
				done();
			});
	});
	test("Solve a puzzle with invalid characters: POST request to /api/solve", function (done) {
		chai
			.request(server)
			.post("/api/solve")
			.send({
				puzzle: INVALID_PUZZLE,
			})
			.end(function (err, res) {
				assert.include(res.text, "Invalid characters in puzzle");
				done();
			});
	});
	test("Solve a puzzle with incorrect length: POST request to /api/solve", function (done) {
		chai
			.request(server)
			.post("/api/solve")
			.send({
				puzzle: INCORRECT_LENGTH_PUZZLE,
			})
			.end(function (err, res) {
				assert.include(res.text, "Expected puzzle to be 81 characters long");
				done();
			});
	});
	test("Solve a puzzle that cannot be solved: POST request to /api/solve", function (done) {
		chai
			.request(server)
			.post("/api/solve")
			.send({
				puzzle: UNSOLVED_PUZZLE,
			})
			.end(function (err, res) {
				assert.include(res.text, "Puzzle cannot be solved");
				done();
			});
	});
	test("Check a puzzle placement with all fields: POST request to /api/check", function (done) {
		chai
			.request(server)
			.post("/api/check")
			.send({
				puzzle: VALID_PUZZLE,
				coordinate: "A1",
				value: "7",
			})
			.end(function (err, res) {
				assert.include(res.text, true);
				done();
			});
	});
	test("Check a puzzle placement with single placement conflict: POST request to /api/check", function (done) {
		chai
			.request(server)
			.post("/api/check")
			.send({
				puzzle: VALID_PUZZLE,
				coordinate: "A7",
				value: "5",
			})
			.end(function (err, res) {
				let lengthConflict = JSON.parse(res.text).conflict.length;
				assert.isAbove(lengthConflict, 0);
				done();
			});
	});
	test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function (done) {
		chai
			.request(server)
			.post("/api/check")
			.send({
				puzzle: VALID_PUZZLE,
				coordinate: "A1",
				value: "1",
			})
			.end(function (err, res) {
				let lengthConflict = JSON.parse(res.text).conflict.length;
				assert.isAbove(lengthConflict, 1);
				done();
			});
	});
	test("Check a puzzle placement with all placement conflicts: POST request to /api/check", function (done) {
		chai
			.request(server)
			.post("/api/check")
			.send({
				puzzle: VALID_PUZZLE,
				coordinate: "D3",
				value: "9",
			})
			.end(function (err, res) {
				let lengthConflict = JSON.parse(res.text).conflict.length;
				assert.isAbove(lengthConflict, 2);
				done();
			});
	});
	test("Check a puzzle placement with missing required fields: POST request to /api/check", function (done) {
		chai
			.request(server)
			.post("/api/check")
			.send({
				puzzle: undefined,
				coordinate: "D3",
				value: "9",
			})
			.end(function (err, res) {
				assert.include(res.text, "Required field(s) missing");
				done();
			});
	});
	test("Check a puzzle placement with invalid characters: POST request to /api/check", function (done) {
		chai
			.request(server)
			.post("/api/check")
			.send({
				puzzle: INVALID_PUZZLE,
				coordinate: "D3",
				value: "9",
			})
			.end(function (err, res) {
				assert.include(res.text, "Invalid characters in puzzle");
				done();
			});
	});
	test("Check a puzzle placement with incorrect length: POST request to /api/check", function (done) {
		chai
			.request(server)
			.post("/api/check")
			.send({
				puzzle: INCORRECT_LENGTH_PUZZLE,
				coordinate: "D3",
				value: "9",
			})
			.end(function (err, res) {
				assert.include(res.text, "Expected puzzle to be 81 characters long");
				done();
			});
	});
	test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", function (done) {
		chai
			.request(server)
			.post("/api/check")
			.send({
				puzzle: VALID_PUZZLE,
				coordinate: "D3A",
				value: "9",
			})
			.end(function (err, res) {
				assert.include(res.text, "Invalid coordinate");
				done();
			});
	});
	test("Check a puzzle placement with invalid placement value: POST request to /api/check", function (done) {
		chai
			.request(server)
			.post("/api/check")
			.send({
				puzzle: VALID_PUZZLE,
				coordinate: "D3",
				value: "99",
			})
			.end(function (err, res) {
				assert.include(res.text, "Invalid value");
				done();
			});
	});
});
