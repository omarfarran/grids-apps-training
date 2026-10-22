// J-B04 Salary Summary
// Codex-assisted implementation, authorized by the updated Day 12 request.
// Skills: object properties, validation, arithmetic, functions.
// All amounts must be supplied; deductions cannot exceed gross salary.

function summarizeSalary(employee) {
  if (typeof employee !== "object" || employee === null || Array.isArray(employee)) {
    return "Error: Employee must be an object.";
  }
  if (typeof employee.name !== "string" || employee.name.trim() === "") {
    return "Error: Employee name must be a non-empty string.";
  }

  const baseSalary = employee.baseSalary;
  const bonus = employee.bonus;
  const deductions = employee.deductions;
  if (!Number.isFinite(baseSalary) || !Number.isFinite(bonus) || !Number.isFinite(deductions)) {
    return "Error: Salary amounts must be finite numbers.";
  }
  if (baseSalary < 0 || bonus < 0 || deductions < 0) {
    return "Error: Salary amounts cannot be negative.";
  }

  const grossSalary = baseSalary + bonus;
  if (!Number.isFinite(grossSalary)) {
    return "Error: Gross salary must be finite.";
  }
  if (deductions > grossSalary) {
    return "Error: Deductions cannot exceed gross salary.";
  }
  return {
    name: employee.name.trim(),
    grossSalary: grossSalary,
    totalDeductions: deductions,
    netSalary: grossSalary - deductions,
  };
}

const employee = { name: "Omar", baseSalary: 2500, bonus: 250, deductions: 100 };
const tests = [
  { name: "normal employee", employee: employee, expected: { name: "Omar", grossSalary: 2750, totalDeductions: 100, netSalary: 2650 } },
  { name: "all zero amounts", employee: { name: "Alex", baseSalary: 0, bonus: 0, deductions: 0 }, expected: { name: "Alex", grossSalary: 0, totalDeductions: 0, netSalary: 0 } },
  { name: "decimal amounts", employee: { name: "Eva", baseSalary: 1000.5, bonus: 99.5, deductions: 50.25 }, expected: { name: "Eva", grossSalary: 1100, totalDeductions: 50.25, netSalary: 1049.75 } },
  { name: "deductions equal gross", employee: { name: "Sam", baseSalary: 100, bonus: 0, deductions: 100 }, expected: { name: "Sam", grossSalary: 100, totalDeductions: 100, netSalary: 0 } },
  { name: "negative base", employee: { name: "Alex", baseSalary: -1, bonus: 0, deductions: 0 }, expected: "Error: Salary amounts cannot be negative." },
  { name: "negative bonus", employee: { name: "Alex", baseSalary: 100, bonus: -1, deductions: 0 }, expected: "Error: Salary amounts cannot be negative." },
  { name: "negative deductions", employee: { name: "Alex", baseSalary: 100, bonus: 0, deductions: -1 }, expected: "Error: Salary amounts cannot be negative." },
  { name: "excess deductions", employee: { name: "Alex", baseSalary: 100, bonus: 0, deductions: 101 }, expected: "Error: Deductions cannot exceed gross salary." },
  { name: "missing amount", employee: { name: "Alex", baseSalary: 100, deductions: 0 }, expected: "Error: Salary amounts must be finite numbers." },
  { name: "string amount", employee: { name: "Alex", baseSalary: "100", bonus: 0, deductions: 0 }, expected: "Error: Salary amounts must be finite numbers." },
  { name: "infinite amount", employee: { name: "Alex", baseSalary: 100, bonus: Infinity, deductions: 0 }, expected: "Error: Salary amounts must be finite numbers." },
  { name: "blank name", employee: { name: "  ", baseSalary: 100, bonus: 0, deductions: 0 }, expected: "Error: Employee name must be a non-empty string." },
  { name: "null employee", employee: null, expected: "Error: Employee must be an object." },
  { name: "array employee", employee: [], expected: "Error: Employee must be an object." },
  { name: "gross overflow", employee: { name: "Alex", baseSalary: Number.MAX_VALUE, bonus: Number.MAX_VALUE, deductions: 0 }, expected: "Error: Gross salary must be finite." },
];

let passedTests = 0;
for (const test of tests) {
  const actual = summarizeSalary(test.employee);
  let matches = actual === test.expected;
  if (typeof actual === "object" && actual !== null && typeof test.expected === "object") {
    matches = actual.name === test.expected.name
      && actual.grossSalary === test.expected.grossSalary
      && actual.totalDeductions === test.expected.totalDeductions
      && actual.netSalary === test.expected.netSalary;
  }
  let status = "FAIL";
  if (matches) {
    passedTests += 1;
    status = "PASS";
  }
  console.log(status, test.name, "| input:", test.employee,
    "| actual:", actual, "| expected:", test.expected);
}
console.log("Salary tests:", passedTests, "/", tests.length);
