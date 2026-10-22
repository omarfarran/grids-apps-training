// J-B01 Calculator
// Codex-assisted implementation, authorized by the updated Day 12 request.
// Skills: types, arithmetic, switch, validation, reusable functions.
// Invalid input returns an error string; numeric strings are not converted.

function calculate(a, b, operator) {
  if (typeof a !== "number" || typeof b !== "number") {
    return "Error: Inputs must be numbers.";
  }
  // Number.isFinite also rejects NaN and positive/negative Infinity.
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return "Error: Inputs must be finite numbers.";
  }

  let result;
  switch (operator) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "*":
      result = a * b;
      break;
    case "/":
      if (b === 0) {
        return "Error: Cannot divide by zero.";
      }
      result = a / b;
      break;
    default:
      return "Error: Unsupported operator.";
  }

  if (!Number.isFinite(result)) {
    return "Error: Result must be finite.";
  }
  return result;
}

const tests = [
  { name: "addition", a: 8, b: 2, operator: "+", expected: 10 },
  { name: "subtraction", a: 8, b: 12, operator: "-", expected: -4 },
  { name: "multiplication", a: -3, b: 4, operator: "*", expected: -12 },
  { name: "division", a: 9, b: 2, operator: "/", expected: 4.5 },
  { name: "zero operand", a: 0, b: 7, operator: "+", expected: 7 },
  { name: "decimal addition", a: 0.1, b: 0.2, operator: "+", expected: 0.3 },
  { name: "division by zero", a: 5, b: 0, operator: "/", expected: "Error: Cannot divide by zero." },
  { name: "negative zero divisor", a: 5, b: -0, operator: "/", expected: "Error: Cannot divide by zero." },
  { name: "unsupported operator", a: 5, b: 2, operator: "%", expected: "Error: Unsupported operator." },
  { name: "missing operator", a: 5, b: 2, operator: undefined, expected: "Error: Unsupported operator." },
  { name: "numeric string", a: "5", b: 2, operator: "+", expected: "Error: Inputs must be numbers." },
  { name: "null input", a: 5, b: null, operator: "+", expected: "Error: Inputs must be numbers." },
  { name: "NaN input", a: NaN, b: 2, operator: "+", expected: "Error: Inputs must be finite numbers." },
  { name: "infinite input", a: 2, b: Infinity, operator: "+", expected: "Error: Inputs must be finite numbers." },
  { name: "numeric overflow", a: Number.MAX_VALUE, b: 2, operator: "*", expected: "Error: Result must be finite." },
];

let passedTests = 0;
// Decimal arithmetic can have tiny binary rounding differences.
const testTolerance = 0.000000001;
for (const test of tests) {
  const actual = calculate(test.a, test.b, test.operator);
  let matches = actual === test.expected;
  if (typeof actual === "number" && typeof test.expected === "number") {
    matches = Math.abs(actual - test.expected) <= testTolerance;
  }
  let status = "FAIL";
  if (matches) {
    passedTests += 1;
    status = "PASS";
  }
  console.log(status, test.name, "| input:", test.a, test.b, test.operator,
    "| actual:", actual, "| expected:", test.expected);
}
console.log("Calculator tests:", passedTests, "/", tests.length);
