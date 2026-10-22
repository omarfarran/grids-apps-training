// J-B05 Array Statistics
// Codex-assisted implementation, authorized by the updated Day 12 request.
// Skills: arrays, for...of, accumulators, comparisons, functions.
// Invalid entries reject the entire array. Empty min/max/average are null.

function getArrayStatistics(numbers) {
  if (!Array.isArray(numbers)) {
    return "Error: Input must be an array.";
  }
  if (numbers.length === 0) {
    return { count: 0, sum: 0, minimum: null, maximum: null, average: null };
  }

  let sum = 0;
  // Starting with the first entry also works for all-negative arrays.
  let minimum = numbers[0];
  let maximum = numbers[0];
  for (const number of numbers) {
    if (typeof number !== "number" || !Number.isFinite(number)) {
      return "Error: Every entry must be a finite number.";
    }
    sum += number;
    if (!Number.isFinite(sum)) {
      return "Error: Running sum must be finite.";
    }
    if (number < minimum) {
      minimum = number;
    }
    if (number > maximum) {
      maximum = number;
    }
  }

  return {
    count: numbers.length,
    sum: sum,
    minimum: minimum,
    maximum: maximum,
    average: sum / numbers.length,
  };
}

const tests = [
  { name: "normal array", input: [4, 8, 2, 6], expected: { count: 4, sum: 20, minimum: 2, maximum: 8, average: 5 } },
  { name: "empty array", input: [], expected: { count: 0, sum: 0, minimum: null, maximum: null, average: null } },
  { name: "one value", input: [7], expected: { count: 1, sum: 7, minimum: 7, maximum: 7, average: 7 } },
  { name: "negative values", input: [-8, -2, -5], expected: { count: 3, sum: -15, minimum: -8, maximum: -2, average: -5 } },
  { name: "mixed signs", input: [-4, 0, 10], expected: { count: 3, sum: 6, minimum: -4, maximum: 10, average: 2 } },
  { name: "decimal values", input: [1.5, 2.5, 3.5], expected: { count: 3, sum: 7.5, minimum: 1.5, maximum: 3.5, average: 2.5 } },
  { name: "binary decimal precision", input: [0.1, 0.2], expected: { count: 2, sum: 0.3, minimum: 0.1, maximum: 0.2, average: 0.15 } },
  { name: "zero values", input: [0, 0], expected: { count: 2, sum: 0, minimum: 0, maximum: 0, average: 0 } },
  { name: "numeric string entry", input: [1, "2"], expected: "Error: Every entry must be a finite number." },
  { name: "null entry", input: [1, null], expected: "Error: Every entry must be a finite number." },
  { name: "NaN entry", input: [1, NaN], expected: "Error: Every entry must be a finite number." },
  { name: "infinite entry", input: [1, Infinity], expected: "Error: Every entry must be a finite number." },
  { name: "undefined entry", input: [1, undefined, 3], expected: "Error: Every entry must be a finite number." },
  { name: "not an array", input: "1,2,3", expected: "Error: Input must be an array." },
  { name: "null input", input: null, expected: "Error: Input must be an array." },
  { name: "sum overflow", input: [Number.MAX_VALUE, Number.MAX_VALUE], expected: "Error: Running sum must be finite." },
];

let passedTests = 0;
const testTolerance = 0.000000001;
for (const test of tests) {
  const actual = getArrayStatistics(test.input);
  let matches = actual === test.expected;
  if (typeof actual === "object" && actual !== null && typeof test.expected === "object") {
    let averageMatches = actual.average === test.expected.average;
    if (typeof actual.average === "number" && typeof test.expected.average === "number") {
      averageMatches = Math.abs(actual.average - test.expected.average) <= testTolerance;
    }
    matches = actual.count === test.expected.count
      && Math.abs(actual.sum - test.expected.sum) <= testTolerance
      && actual.minimum === test.expected.minimum
      && actual.maximum === test.expected.maximum
      && averageMatches;
  }
  let status = "FAIL";
  if (matches) {
    passedTests += 1;
    status = "PASS";
  }
  console.log(status, test.name, "| input:", test.input,
    "| actual:", actual, "| expected:", test.expected);
}
console.log("Statistics tests:", passedTests, "/", tests.length);
