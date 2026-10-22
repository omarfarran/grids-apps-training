// J-B03 Discount Engine
// Codex-assisted implementation, authorized by the updated Day 12 request.
// Skills: validation, arithmetic, functions.
// Rate is a percentage from 0 to 100, inclusive. No currency rounding is applied.

function calculateDiscount(price, rate) {
  if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
    return "Error: Price must be a finite, non-negative number.";
  }
  if (typeof rate !== "number" || !Number.isFinite(rate) || rate < 0 || rate > 100) {
    return "Error: Rate must be a finite number between 0 and 100.";
  }

  const remainingFraction = 1 - rate / 100;
  return price * remainingFraction;
}

const tests = [
  { name: "normal discount", price: 200, rate: 15, expected: 170 },
  { name: "zero price", price: 0, rate: 25, expected: 0 },
  { name: "zero discount", price: 80, rate: 0, expected: 80 },
  { name: "full discount", price: 80, rate: 100, expected: 0 },
  { name: "decimal price", price: 12.5, rate: 20, expected: 10 },
  { name: "fractional rate", price: 80, rate: 12.5, expected: 70 },
  { name: "decimal precision", price: 0.1, rate: 20, expected: 0.08 },
  { name: "large finite price", price: Number.MAX_VALUE, rate: 100, expected: 0 },
  { name: "negative price", price: -1, rate: 20, expected: "Error: Price must be a finite, non-negative number." },
  { name: "string price", price: "100", rate: 20, expected: "Error: Price must be a finite, non-negative number." },
  { name: "NaN price", price: NaN, rate: 20, expected: "Error: Price must be a finite, non-negative number." },
  { name: "infinite price", price: Infinity, rate: 20, expected: "Error: Price must be a finite, non-negative number." },
  { name: "negative rate", price: 100, rate: -5, expected: "Error: Rate must be a finite number between 0 and 100." },
  { name: "rate over 100", price: 100, rate: 101, expected: "Error: Rate must be a finite number between 0 and 100." },
  { name: "string rate", price: 100, rate: "20", expected: "Error: Rate must be a finite number between 0 and 100." },
  { name: "NaN rate", price: 100, rate: NaN, expected: "Error: Rate must be a finite number between 0 and 100." },
  { name: "infinite rate", price: 100, rate: Infinity, expected: "Error: Rate must be a finite number between 0 and 100." },
];

let passedTests = 0;
const testTolerance = 0.000000001;
for (const test of tests) {
  const actual = calculateDiscount(test.price, test.rate);
  let matches = actual === test.expected;
  if (typeof actual === "number" && typeof test.expected === "number") {
    matches = Math.abs(actual - test.expected) <= testTolerance;
  }
  let status = "FAIL";
  if (matches) {
    passedTests += 1;
    status = "PASS";
  }
  console.log(status, test.name, "| input:", test.price, test.rate,
    "| actual:", actual, "| expected:", test.expected);
}
console.log("Discount tests:", passedTests, "/", tests.length);
