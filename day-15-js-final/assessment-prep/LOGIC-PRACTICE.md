# Logic Practice

Unofficial self-study practice. These questions are separate from the final project and the human assessment. No score is assigned here.

For each question, write a function, describe its input/output, and test normal, empty and boundary cases. Solutions are deliberately omitted.

1. **Conditions:** Write `ticketPrice(age, isStudent)`. Ages below 6 are free; ages 6–17 pay 5; adults pay 10, reduced to 7 for adult students. Reject negative or nonnumeric ages. What happens at each boundary?
2. **Loops:** Write `sumMultiples(limit)` to sum positive integers up to and including `limit` that are divisible by 3 or 5. Count a value divisible by both only once. How should zero or a negative limit behave?
3. **Functions:** Write `normalizeName(name)` to trim surrounding whitespace, collapse repeated internal spaces, and return a useful result for blank input. Explain your chosen handling of nonstring values.
4. **Arrays:** Given prices `[12, 0, 8, 25, 8]`, produce a new array containing values at least 8 with a 10% discount, then calculate the total. Preserve the original array. Decide how to handle invalid entries.
5. **Objects:** Write `profileSummary(profile)` for an object with `name`, `skills`, and optional `city`. Produce a readable summary without failing when city or the skills array is missing.
6. **Find/update:** Given records with unique IDs, write a function that changes one matching record's status while preserving other records and the input array. Define what happens if the ID does not exist.
7. **Filter:** Given product objects with `name`, `category`, `price` and `inStock`, combine a case-insensitive name query, category, and stock requirement. What should a blank query do?
8. **Reduce:** Given task objects with Todo/In progress/Completed status, derive counts for each status and the total. How will you report an unknown status rather than silently count it incorrectly?
9. **Sort:** Sort appointments by a valid `YYYY-MM-DD` date while keeping undated records last. Do not mutate the original array. How will equal dates be ordered?
10. **Debug your own work:** Choose one answer, deliberately add a boundary or type bug, reproduce it, inspect values/types, explain the root cause, make the smallest fix, and retest.
