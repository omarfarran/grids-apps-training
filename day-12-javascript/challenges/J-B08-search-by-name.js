// J-B08 Search by Name
// Codex-assisted implementation, authorized by the updated Day 12 request.
// Skills: arrays of objects, for...of, string methods, functions.
// Case-insensitive substring search; blank queries return an empty array.
// Invalid records reject the whole search. Input records are not changed.

function searchByName(records, query) {
  if (!Array.isArray(records)) {
    return "Error: Records must be an array.";
  }
  if (typeof query !== "string") {
    return "Error: Search text must be a string.";
  }

  const searchText = query.trim().toLowerCase();
  const matches = [];
  for (const record of records) {
    if (typeof record !== "object" || record === null || Array.isArray(record)) {
      return "Error: Every record must be an object with a non-empty name.";
    }
    if (typeof record.name !== "string" || record.name.trim() === "") {
      return "Error: Every record must be an object with a non-empty name.";
    }
    const name = record.name.toLowerCase();
    if (searchText !== "" && name.includes(searchText)) {
      matches.push(record);
    }
  }
  return matches;
}

const people = [
  { id: 1, name: "Alice Jordan" },
  { id: 2, name: "Omar Farran" },
  { id: 3, name: "Alicia Chen" },
  { id: 4, name: "Maya Ali" },
];
const tests = [
  { name: "multiple substring matches", records: people, query: "ali", expected: [people[0], people[2], people[3]] },
  { name: "case differences", records: people, query: "OMAR", expected: [people[1]] },
  { name: "trimmed query", records: people, query: "  alice  ", expected: [people[0]] },
  { name: "surname match", records: people, query: "chen", expected: [people[2]] },
  { name: "no matches", records: people, query: "Taylor", expected: [] },
  { name: "empty query", records: people, query: "", expected: [] },
  { name: "whitespace query", records: people, query: "   ", expected: [] },
  { name: "empty records", records: [], query: "Alice", expected: [] },
  { name: "non-string query", records: people, query: 7, expected: "Error: Search text must be a string." },
  { name: "not an array", records: null, query: "Alice", expected: "Error: Records must be an array." },
  { name: "invalid record name", records: [{ name: 7 }], query: "no match", expected: "Error: Every record must be an object with a non-empty name." },
  { name: "blank record name", records: [{ name: "  " }], query: "Alice", expected: "Error: Every record must be an object with a non-empty name." },
  { name: "null record", records: [null], query: "Alice", expected: "Error: Every record must be an object with a non-empty name." },
  { name: "invalid record with blank query", records: [null], query: "", expected: "Error: Every record must be an object with a non-empty name." },
];

let passedTests = 0;
for (const test of tests) {
  const actual = searchByName(test.records, test.query);
  let matches = actual === test.expected;
  if (Array.isArray(actual) && Array.isArray(test.expected)) {
    matches = actual.length === test.expected.length;
    // Results retain the original records in their original order.
    for (let index = 0; index < actual.length; index += 1) {
      if (actual[index] !== test.expected[index]) {
        matches = false;
      }
    }
  }
  let status = "FAIL";
  if (matches) {
    passedTests += 1;
    status = "PASS";
  }
  console.log(status, test.name, "| records:", test.records, "| query:", test.query,
    "| actual:", actual, "| expected:", test.expected);
}
console.log("Search tests:", passedTests, "/", tests.length);
