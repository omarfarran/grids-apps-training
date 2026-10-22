// J-B07 Cart Total
// Codex-assisted implementation, authorized by the updated Day 12 request.
// Skills: arrays of objects, for...of, validation, arithmetic, functions.
// A malformed item rejects the whole cart; no partial total is returned.
// Quantities are non-negative integers. Prices are not rounded to currency cents.

function calculateCartTotal(cart) {
  if (!Array.isArray(cart)) {
    return "Error: Cart must be an array.";
  }

  let total = 0;
  for (const product of cart) {
    if (typeof product !== "object" || product === null || Array.isArray(product)) {
      return "Error: Every cart item must be an object.";
    }
    if (typeof product.name !== "string" || product.name.trim() === "") {
      return "Error: Every item needs a non-empty name.";
    }
    if (!Number.isFinite(product.price) || product.price < 0) {
      return "Error: Item prices must be finite, non-negative numbers.";
    }
    if (!Number.isInteger(product.quantity) || product.quantity < 0) {
      return "Error: Item quantities must be non-negative integers.";
    }

    const itemTotal = product.price * product.quantity;
    total += itemTotal;
    if (!Number.isFinite(total)) {
      return "Error: Cart total must be finite.";
    }
  }
  return total;
}

const tests = [
  { name: "multi-item cart", cart: [{ name: "Notebook", price: 5, quantity: 2 }, { name: "Pen", price: 1.5, quantity: 4 }], expected: 16 },
  { name: "empty cart", cart: [], expected: 0 },
  { name: "single item", cart: [{ name: "Book", price: 12.5, quantity: 2 }], expected: 25 },
  { name: "zero quantity", cart: [{ name: "Book", price: 12.5, quantity: 0 }], expected: 0 },
  { name: "free item", cart: [{ name: "Sample", price: 0, quantity: 3 }], expected: 0 },
  { name: "decimal precision", cart: [{ name: "Sample A", price: 0.1, quantity: 1 }, { name: "Sample B", price: 0.2, quantity: 1 }], expected: 0.3 },
  { name: "negative price", cart: [{ name: "Book", price: -1, quantity: 1 }], expected: "Error: Item prices must be finite, non-negative numbers." },
  { name: "string price", cart: [{ name: "Book", price: "10", quantity: 1 }], expected: "Error: Item prices must be finite, non-negative numbers." },
  { name: "NaN price", cart: [{ name: "Book", price: NaN, quantity: 1 }], expected: "Error: Item prices must be finite, non-negative numbers." },
  { name: "infinite price", cart: [{ name: "Book", price: Infinity, quantity: 1 }], expected: "Error: Item prices must be finite, non-negative numbers." },
  { name: "negative quantity", cart: [{ name: "Book", price: 10, quantity: -1 }], expected: "Error: Item quantities must be non-negative integers." },
  { name: "fractional quantity", cart: [{ name: "Book", price: 10, quantity: 1.5 }], expected: "Error: Item quantities must be non-negative integers." },
  { name: "string quantity", cart: [{ name: "Book", price: 10, quantity: "2" }], expected: "Error: Item quantities must be non-negative integers." },
  { name: "missing quantity", cart: [{ name: "Book", price: 10 }], expected: "Error: Item quantities must be non-negative integers." },
  { name: "infinite quantity", cart: [{ name: "Book", price: 10, quantity: Infinity }], expected: "Error: Item quantities must be non-negative integers." },
  { name: "blank name", cart: [{ name: "  ", price: 10, quantity: 1 }], expected: "Error: Every item needs a non-empty name." },
  { name: "null item", cart: [null], expected: "Error: Every cart item must be an object." },
  { name: "mixed valid and invalid", cart: [{ name: "Pen", price: 2, quantity: 2 }, { name: "Book", price: -1, quantity: 1 }], expected: "Error: Item prices must be finite, non-negative numbers." },
  { name: "not an array", cart: null, expected: "Error: Cart must be an array." },
  { name: "total overflow", cart: [{ name: "Large", price: Number.MAX_VALUE, quantity: 2 }], expected: "Error: Cart total must be finite." },
];

let passedTests = 0;
const testTolerance = 0.000000001;
for (const test of tests) {
  const actual = calculateCartTotal(test.cart);
  let matches = actual === test.expected;
  if (typeof actual === "number" && typeof test.expected === "number") {
    matches = Math.abs(actual - test.expected) <= testTolerance;
  }
  let status = "FAIL";
  if (matches) {
    passedTests += 1;
    status = "PASS";
  }
  console.log(status, test.name, "| input:", test.cart,
    "| actual:", actual, "| expected:", test.expected);
}
console.log("Cart tests:", passedTests, "/", tests.length);
