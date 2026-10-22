// J-B02 Grade Calculator
// Codex-assisted implementation, authorized by the updated Day 12 request.
// Skills: ordered conditions, functions, numeric validation.
// Decimal scores are accepted: A >= 90, B >= 80, C >= 70, D >= 60.

function classifyGrade(score) {
  if (typeof score !== "number" || !Number.isFinite(score)) {
    return "Error: Score must be a finite number.";
  }
  if (score < 0 || score > 100) {
    return "Error: Score must be between 0 and 100.";
  }

  // Earlier returns exclude higher bands, so the ranges cannot overlap.
  if (score >= 90) {
    return "A";
  } else if (score >= 80) {
    return "B";
  } else if (score >= 70) {
    return "C";
  } else if (score >= 60) {
    return "D";
  } else {
    return "F";
  }
}

const tests = [
  { score: 100, expected: "A" },
  { score: 90, expected: "A" },
  { score: 89, expected: "B" },
  { score: 80, expected: "B" },
  { score: 79, expected: "C" },
  { score: 70, expected: "C" },
  { score: 69, expected: "D" },
  { score: 60, expected: "D" },
  { score: 59, expected: "F" },
  { score: 0, expected: "F" },
  { score: -1, expected: "Error: Score must be between 0 and 100." },
  { score: 101, expected: "Error: Score must be between 0 and 100." },
  { score: 89.5, expected: "B" },
  { score: 59.99, expected: "F" },
  { score: "90", expected: "Error: Score must be a finite number." },
  { score: null, expected: "Error: Score must be a finite number." },
  { score: undefined, expected: "Error: Score must be a finite number." },
  { score: NaN, expected: "Error: Score must be a finite number." },
  { score: Infinity, expected: "Error: Score must be a finite number." },
];

let passedTests = 0;
for (const test of tests) {
  const actual = classifyGrade(test.score);
  let status = "FAIL";
  if (actual === test.expected) {
    passedTests += 1;
    status = "PASS";
  }
  console.log(status, "| input:", test.score, "| actual:", actual, "| expected:", test.expected);
}
console.log("Grade tests:", passedTests, "/", tests.length);
