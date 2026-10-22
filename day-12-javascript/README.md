# Day 12 - JavaScript Logic Foundations

## Objective

Solve beginner JavaScript logic problems for the Grids Apps Full Stack Web Development Foundation Track. **All eight challenges are complete**, exceeding the six-challenge minimum and including all three required exercises.

These implementations, tests, and explanations were generated with Codex after the user reported training-center approval. This update replaces the earlier manual-only workspace restriction. No independent student attempt or personal authorship is claimed. The student should study the functions and be able to explain their behavior and edge cases.

## Topics

- Variables/types: `const`, `let`, primitive values, and `typeof`.
- Operators: arithmetic, comparison, and logical operators.
- Conditions: `if`/`else`, early returns, and `switch`.
- Loops: `for...of` for calculations/search and indexed `for` loops in checks.
- Functions: reusable calculations and validation.
- Arrays: input collections, accumulators, test cases, and error lists.
- Objects: employee/product/person records and structured results.
- String/number basics: `trim`, `toLowerCase`, `includes`, `Number.isFinite`, `Number.isInteger`, and decimal precision.

## Challenges

| Challenge | Status | Reusable function | Cases passed |
| --- | --- | --- | ---: |
| [J-B01 Calculator](challenges/J-B01-calculator.js) | Complete | `calculate(a, b, operator)` | 15/15 |
| [J-B02 Grade Calculator](challenges/J-B02-grade-calculator.js) | **Complete — Required** | `classifyGrade(score)` | 19/19 |
| [J-B03 Discount Engine](challenges/J-B03-discount-engine.js) | Complete | `calculateDiscount(price, rate)` | 17/17 |
| [J-B04 Salary Summary](challenges/J-B04-salary-summary.js) | Complete | `summarizeSalary(employee)` | 15/15 |
| [J-B05 Array Statistics](challenges/J-B05-array-statistics.js) | **Complete — Required** | `getArrayStatistics(numbers)` | 16/16 |
| [J-B06 Password Rules](challenges/J-B06-password-rules.js) | Complete | `validatePassword(password)` | 12/12 |
| [J-B07 Cart Total](challenges/J-B07-cart-total.js) | **Complete — Required** | `calculateCartTotal(cart)` | 20/20 |
| [J-B08 Search by Name](challenges/J-B08-search-by-name.js) | Complete | `searchByName(records, query)` | 14/14 |

## Running the exercises

Node is sufficient; no npm installation, Vite, packages, test framework, or module imports are needed. Each file is self-contained and runs separately.

From the repository root:

```sh
cd day-12-javascript
node challenges/J-B02-grade-calculator.js
```

Run every exercise individually:

```sh
node challenges/J-B01-calculator.js
node challenges/J-B02-grade-calculator.js
node challenges/J-B03-discount-engine.js
node challenges/J-B04-salary-summary.js
node challenges/J-B05-array-statistics.js
node challenges/J-B06-password-rules.js
node challenges/J-B07-cart-total.js
node challenges/J-B08-search-by-name.js
```

## Behavior and Edge Cases

| Challenge | Documented behavior |
| --- | --- |
| Calculator | Supports `+`, `-`, `*`, `/`. Rejects non-number/non-finite operands, unsupported operators, division by positive or negative zero, and non-finite results. |
| Grade | Accepts finite scores from 0 through 100, including decimals. A is 90–100; B is 80 up to 90; C is 70 up to 80; D is 60 up to 70; F is below 60. The upper limits of B/C/D are exclusive. No rounding or numeric-string conversion. |
| Discount | Price must be finite and non-negative; rate is a finite percentage from 0 through 100. Zero price, zero discount, and full discount are valid. Returns the remaining price. |
| Salary | Requires a non-blank employee name and finite, non-negative `baseSalary`, `bonus`, and `deductions`. Returns name, gross salary, total deductions, and net salary. Rejects missing amounts, excessive deductions, and overflow. |
| Statistics | A `for...of` loop computes count, sum, minimum, maximum, and average. An empty array returns count/sum 0 and minimum/maximum/average `null`. Any invalid entry or non-finite running sum rejects the entire array. |
| Password | Returns `{ valid, errors }`. Requires at least 8 JavaScript string-length units, an ASCII uppercase letter, an ASCII lowercase letter, and an ASCII digit. Errors are returned in length/uppercase/lowercase/number order. A non-string returns one type error. No regex is used. These are exercise rules, not a production security policy. |
| Cart | Adds each product's price multiplied by its quantity in a loop. Requires a non-blank name, finite non-negative price, and non-negative integer quantity. Empty cart, free items, and zero quantity are valid. Any invalid item rejects the entire cart, including when another item is valid; no partial total is returned. |
| Search | Performs a case-insensitive substring search on names, trims the query, and preserves record order. Empty/whitespace queries and no matches return an empty array. Invalid records or query types return an error. Results retain the matching original records; the function does not mutate them. |

Except for password validation, invalid inputs return a descriptive `"Error: ..."` string. Valid outputs are numbers, classification strings, objects, or arrays as shown in the source. Numeric strings are not silently converted. `Number.isFinite` rejects strings, `NaN`, and infinities without coercion.

Calculations use ordinary JavaScript numbers without currency rounding. Some decimal results include a tiny binary rounding difference; relevant tests compare within **0.000000001**. Production currency handling and Unicode-aware password policies are possible later improvements, not added scope here.

## Testing

Every file contains executable console-based normal and edge-case checks. Each check prints `PASS` or `FAIL`, its input, actual result, and expected result, followed by a passed/total summary. Object and array checks inspect the relevant values rather than comparing printed formatting.

All eight files were actually run with **Node v24.21.0 on October 22, 2026**. Results: **128/128 cases passed**, all commands exited 0, and no runtime errors occurred. The verification checked both the printed outcomes and process exit status; exit status alone is not a test assertion.

See [ATTEMPT-LOG.md](ATTEMPT-LOG.md) for implementation approaches, representative expected/actual outputs, edge cases, concepts, possible improvements, and the per-file execution record.

## Quality Review

- [x] At least six challenges complete: all eight implemented.
- [x] J-B02, J-B05, and J-B07 complete.
- [x] Reusable functions, clear conditions, loops, arrays, and objects demonstrated.
- [x] Normal cases, boundaries, invalid values, empty inputs, and relevant overflow/decimal cases tested.
- [x] No runtime errors in the executed cases.
- [x] No classes, async behavior, modules, external APIs, or complex functional programming.
- [x] No DOM, browser events, localStorage, or Day 13 application work.
- [x] No changes to the completed HTML, Bootstrap, or Tailwind projects.
- [x] No commit or push performed.

## Structure

```text
day-12-javascript/
  README.md
  ATTEMPT-LOG.md
  challenges/
    J-B01-calculator.js
    J-B02-grade-calculator.js
    J-B03-discount-engine.js
    J-B04-salary-summary.js
    J-B05-array-statistics.js
    J-B06-password-rules.js
    J-B07-cart-total.js
    J-B08-search-by-name.js
```
