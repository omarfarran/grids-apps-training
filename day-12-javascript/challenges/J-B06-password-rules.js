// J-B06 Password Rules
// Codex-assisted implementation, authorized by the updated Day 12 request.
// Skills: strings, loops, boolean flags, arrays, objects, functions.
// Practice rules: 8+ characters, ASCII uppercase, lowercase, and digit.
// This is a learning exercise, not a production password security policy.

function validatePassword(password) {
  if (typeof password !== "string") {
    return { valid: false, errors: ["Password must be a string."] };
  }

  const minimumLength = 8;
  const errors = [];
  let hasUppercase = false;
  let hasLowercase = false;
  let hasNumber = false;
  for (const character of password) {
    if (character >= "A" && character <= "Z") {
      hasUppercase = true;
    }
    if (character >= "a" && character <= "z") {
      hasLowercase = true;
    }
    if (character >= "0" && character <= "9") {
      hasNumber = true;
    }
  }

  if (password.length < minimumLength) {
    errors.push("Use at least 8 characters.");
  }
  if (!hasUppercase) {
    errors.push("Include an uppercase letter (A-Z).");
  }
  if (!hasLowercase) {
    errors.push("Include a lowercase letter (a-z).");
  }
  if (!hasNumber) {
    errors.push("Include a number (0-9).");
  }
  return { valid: errors.length === 0, errors: errors };
}

const tests = [
  { name: "empty", input: "", expected: { valid: false, errors: ["Use at least 8 characters.", "Include an uppercase letter (A-Z).", "Include a lowercase letter (a-z).", "Include a number (0-9)."] } },
  { name: "too short", input: "Ab1", expected: { valid: false, errors: ["Use at least 8 characters."] } },
  { name: "seven characters", input: "Abcdef1", expected: { valid: false, errors: ["Use at least 8 characters."] } },
  { name: "missing uppercase", input: "password1", expected: { valid: false, errors: ["Include an uppercase letter (A-Z)."] } },
  { name: "missing lowercase", input: "PASSWORD1", expected: { valid: false, errors: ["Include a lowercase letter (a-z)."] } },
  { name: "missing number", input: "Password", expected: { valid: false, errors: ["Include a number (0-9)."] } },
  { name: "exactly eight", input: "Abcdefg1", expected: { valid: true, errors: [] } },
  { name: "valid with punctuation", input: "GoodDemo9!", expected: { valid: true, errors: [] } },
  { name: "whitespace only", input: "        ", expected: { valid: false, errors: ["Include an uppercase letter (A-Z).", "Include a lowercase letter (a-z).", "Include a number (0-9)."] } },
  { name: "digits only", input: "12345678", expected: { valid: false, errors: ["Include an uppercase letter (A-Z).", "Include a lowercase letter (a-z)."] } },
  { name: "number input", input: 12345678, expected: { valid: false, errors: ["Password must be a string."] } },
  { name: "null input", input: null, expected: { valid: false, errors: ["Password must be a string."] } },
];

let passedTests = 0;
for (const test of tests) {
  const actual = validatePassword(test.input);
  let matches = actual.valid === test.expected.valid
    && actual.errors.length === test.expected.errors.length;
  for (let index = 0; index < actual.errors.length; index += 1) {
    if (actual.errors[index] !== test.expected.errors[index]) {
      matches = false;
    }
  }
  let status = "FAIL";
  if (matches) {
    passedTests += 1;
    status = "PASS";
  }
  // All passwords printed here are invented test data.
  console.log(status, test.name, "| input:", test.input,
    "| actual:", actual, "| expected:", test.expected);
}
console.log("Password tests:", passedTests, "/", tests.length);
