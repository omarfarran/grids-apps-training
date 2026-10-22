# Day 12 — Implementation and Verification Log

The eight solutions, their console tests, and these explanations were implemented with Codex after the user reported training-center authorization. This log records implementation and execution evidence; it does not claim that the student personally wrote the code or completed an independent first attempt.

## J-B01 Calculator

**Challenge:** J-B01 Calculator.

**Status:** Complete.

**Implementation approach:** Validate two finite numbers, select the arithmetic operation with `switch`, and return the result or a descriptive error string.

**Inputs tested:** All four operators, negative values, zero, decimals, zero divisors, an unsupported/missing operator, string/null operands, NaN, Infinity, and overflow.

**Expected output:** `8 + 2` gives 10; `8 - 12` gives -4; `-3 * 4` gives -12; `9 / 2` gives 4.5. Invalid operations return the corresponding error string.

**Actual output:** All expected results matched: **15/15 cases passed**. Decimal addition matched within the documented tolerance.

**Edge cases:** Positive and negative zero divisors are rejected. Finite operands that produce a non-finite result are also rejected. Numeric strings are not converted.

**Concept practiced:** Reusable functions, strict type checks, arithmetic, `switch`, and early returns.

**Possible improvement:** Add further operations as a separate exercise after explaining the current four.

## J-B02 Grade Calculator — Required

**Challenge:** J-B02 Grade Calculator.

**Status:** Complete.

**Implementation approach:** Reject invalid/out-of-range scores first, then check the grade thresholds from highest to lowest.

**Inputs tested:** 100, 90, 89, 80, 79, 70, 69, 60, 59, 0, -1, 101, 89.5, 59.99, a numeric string, null, undefined, NaN, and Infinity.

**Expected output:** 100/90 give A; 89/80 give B; 79/70 give C; 69/60 give D; 59/0 give F. Scores -1/101 return range errors; 89.5 gives B and 59.99 gives F. Invalid types/non-finite values return input errors.

**Actual output:** **19/19 cases passed**, including every requested boundary.

**Edge cases:** Both 0 and 100 are valid. Decimals are classified without rounding. Ordered branches prevent overlapping grade bands.

**Concept practiced:** Numeric validation, comparisons, logical operators, and ordered `if`/`else` conditions.

**Possible improvement:** Make the grade thresholds configurable in a later exercise; the current fixed ranges are explicit and easy to explain.

## J-B03 Discount Engine

**Challenge:** J-B03 Discount Engine.

**Status:** Complete.

**Implementation approach:** Validate the price and percentage rate, then multiply the price by the remaining fraction.

**Inputs tested:** A normal discount, zero price, zero/full discount, decimal price, fractional percentage, a large finite price, negative values, strings, NaN, Infinity, and rates above 100.

**Expected output:** Price 200 at 15% gives 170; price 80 at 0% gives 80 and at 100% gives 0; price 12.5 at 20% gives 10; invalid price/rate inputs return clear errors.

**Actual output:** **17/17 cases passed**. The decimal precision case matched within the documented tolerance.

**Edge cases:** Inclusive rate boundaries 0 and 100 are supported. Invalid negative/non-finite values and numeric strings are rejected. No currency rounding is applied.

**Concept practiced:** Arithmetic, validation, function parameters, and descriptive local variables.

**Possible improvement:** Introduce a separately specified currency-rounding policy in a later exercise.

## J-B04 Salary Summary

**Challenge:** J-B04 Salary Summary.

**Status:** Complete.

**Implementation approach:** Read validated employee properties, calculate gross salary from base salary and bonus, and return an object containing the name, gross salary, total deductions, and net salary.

**Inputs tested:** A normal employee object, zero amounts, decimal amounts, deductions equal to gross, each negative amount, excessive deductions, missing/string/infinite amounts, blank names, null/array input, and gross overflow.

**Expected output:** Base salary 2500, bonus 250, and deductions 100 give gross salary 2750, total deductions 100, and net salary 2650. Decimal inputs give gross 1100 and net 1049.75. Invalid employee data returns an error string.

**Actual output:** **15/15 cases passed**, including the expected structured summaries.

**Edge cases:** Every amount is required; zero amounts are valid. Deductions may equal but not exceed gross salary. Null and arrays are rejected before accessing employee properties.

**Concept practiced:** Object properties, validation, arithmetic, and returning structured data.

**Possible improvement:** Support multiple deduction categories once the single-amount version is understood.

## J-B05 Array Statistics — Required

**Challenge:** J-B05 Array Statistics.

**Status:** Complete.

**Implementation approach:** Use a `for...of` loop to accumulate the sum and update minimum/maximum. Use the array length for count and calculate the average after the loop. Start minimum/maximum from the first entry.

**Inputs tested:** A normal array, empty array, one value, all-negative values, mixed signs, decimals, binary decimal precision, zeros, invalid string/null/NaN/infinite/undefined entries, non-array/null inputs, and running-sum overflow.

**Expected output:** `[4, 8, 2, 6]` gives count 4, sum 20, minimum 2, maximum 8, average 5. An empty array gives count/sum 0 and minimum/maximum/average null. `[-8, -2, -5]` gives sum -15, minimum -8, maximum -2, average -5. Invalid entries reject the entire array.

**Actual output:** **16/16 cases passed**. Sum/average decimal comparisons used the documented tolerance.

**Edge cases:** An empty array avoids division by zero. A single value is both minimum and maximum. Starting from the first entry correctly supports all-negative arrays. Invalid entries are not silently skipped.

**Concept practiced:** Loop accumulators, comparisons, arrays, and returning an object. No `reduce`, spread-based minimum, or spread-based maximum is used.

**Possible improvement:** Add additional statistics such as range only after the core calculations can be explained.

## J-B06 Password Rules

**Challenge:** J-B06 Password Rules.

**Status:** Complete.

**Implementation approach:** Check the input type, scan the string with a loop to set uppercase/lowercase/digit flags, then collect every unmet rule in an errors array.

**Inputs tested:** Empty, short, seven-character, missing-uppercase, missing-lowercase, missing-number, exactly-eight-character, valid punctuation, whitespace-only, digits-only, numeric, and null inputs.

**Expected output:** `Abcdefg1` and `GoodDemo9!` return `{ valid: true, errors: [] }`. `Ab1` returns the minimum-length error. Empty input returns four rule errors; invalid types return one type error.

**Actual output:** **12/12 cases passed**. Checks compared both validity and the complete ordered error messages.

**Edge cases:** Empty strings can fail several rules at once. Only ASCII A–Z, a–z, and 0–9 satisfy the respective flags. Length uses JavaScript string length; punctuation is permitted but not required.

**Concept practiced:** Boolean flags, string iteration, logical checks, arrays of messages, and an object result.

**Possible improvement:** Explore Unicode-aware character/length rules later. The current rules are a classroom exercise, not a production password policy.

## J-B07 Cart Total — Required

**Challenge:** J-B07 Cart Total.

**Status:** Complete.

**Implementation approach:** Validate the cart and each product object, then accumulate price multiplied by quantity in a loop. Stop with an error if any item is invalid.

**Inputs tested:** A multi-item cart, empty cart, one item, zero quantity, a free item, decimal precision, negative/string/NaN/infinite prices, negative/fractional/string/missing/infinite quantities, blank names, null items, mixed valid/invalid items, non-array input, and overflow.

**Expected output:** Two notebooks at 5 and four pens at 1.5 give 16. One product at 12.5 with quantity 2 gives 25. Empty carts, free items, and zero quantity give 0. Malformed items return an error instead of a partial total.

**Actual output:** **20/20 cases passed**. Decimal totals matched within the documented tolerance.

**Edge cases:** Quantities must be non-negative integers; zero is valid. Even zero-quantity items must have valid product data. Any invalid product rejects the whole cart. No currency rounding is applied.

**Concept practiced:** Arrays of objects, property validation, loops, and accumulation.

**Possible improvement:** Specify currency rounding or item-level error details in a separate follow-up exercise.

## J-B08 Search by Name

**Challenge:** J-B08 Search by Name.

**Status:** Complete.

**Implementation approach:** Trim and lowercase the query; loop over validated records and collect names containing that text without changing the original records.

**Inputs tested:** Multiple matches, uppercase query, surrounding whitespace, surname substring, no match, empty/whitespace query, empty records, non-string query, non-array input, and malformed/blank/null record names, including an invalid record with a blank query.

**Expected output:** `ali` returns Alice Jordan, Alicia Chen, and Maya Ali in order. `OMAR` returns Omar Farran. Empty/no-match searches return an empty array. Malformed input returns a descriptive error string.

**Actual output:** **14/14 cases passed**. Tests verified the expected original records and their order.

**Edge cases:** A blank query does not match every record. Invalid records still reject a search even when the query is blank or would have no matches. Matching is by substring, not exact name equality.

**Concept practiced:** Arrays of objects, loops, string normalization, `includes`, and collecting matches.

**Possible improvement:** Add an explicitly selected exact-match mode in a later logic exercise.

## Actual Node Execution

Executed on October 22, 2026 with Node v24.21.0. Commands below are relative to `day-12-javascript/`; every implemented file was executed.

| Command | Cases passed | Printed failures | Exit code |
| --- | --- | --- | --- |
| `node challenges/J-B01-calculator.js` | 15/15 | 0 | 0 |
| `node challenges/J-B02-grade-calculator.js` | 19/19 | 0 | 0 |
| `node challenges/J-B03-discount-engine.js` | 17/17 | 0 | 0 |
| `node challenges/J-B04-salary-summary.js` | 15/15 | 0 | 0 |
| `node challenges/J-B05-array-statistics.js` | 16/16 | 0 | 0 |
| `node challenges/J-B06-password-rules.js` | 12/12 | 0 | 0 |
| `node challenges/J-B07-cart-total.js` | 20/20 | 0 | 0 |
| `node challenges/J-B08-search-by-name.js` | 14/14 | 0 | 0 |
| **Total** | **128/128** | **0** | All successful |

No runtime errors occurred in the executed cases. Printed outcomes and passed/total summaries were checked in addition to command exit codes. Numeric test tolerance is 0.000000001 where relevant; it does not alter the function's returned value.

## Scope and Remaining Work

No known Day 12 implementation issue remains in the requested scope. Student understanding has not been assessed by these automated runs; study the functions and explain the listed edge cases. The possible improvements above are optional future work, not missing Day 12 requirements.

No DOM, browser application, events, localStorage, JSON processing, CRUD, modules, network calls, or Day 13 work was added. The completed HTML, Bootstrap, and Tailwind projects are unchanged. No commit or push was performed.
