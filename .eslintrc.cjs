/* eslint-env node */
module.exports = {
  env: {
    node: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    // "airbnb-base",
    // "airbnb-typescript/base",
    // "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  ignorePatterns: ["test/*", "dist/*"],
  parserOptions: { project: "./tsconfig.json" },
  rules: {
    "@typescript-eslint/no-floating-promises": ["error"],
    "linebreak-style": "off",
    "@typescript-eslint/quotes": "off",
    "@typescript-eslint/comma-dangle": "off",
    "@typescript-eslint/indent": "off",
    "no-console": "off",
    "operator-linebreak": "off",
    "object-curly-newline": "off",
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
    "max-len": "off",
    // "arrow-body-style": 0, // single line in func, Unexpected {} surrounding arrow body; move the returned value immediately after the `=>`
    // "object-shorthand": 0, // { name: name, id: id }
    // "function-paren-newline": 0, // Unexpected newline before ')'
    // "implicit-arrow-linebreak": 0, // in same line (() => xyz)
    // "consistent-return": 0, // function expected no return value, Expected to return a value at the end of async function
    // "Func-names": 0, // Unexpected unnamed function - new Promise(function (resolve, reject) {})
    // "global-require": 0, // put all require in global scope
    // radix: 0, // Missing radix parameter - parseInt(string, radix)
    // "guard-for-in": 0, // The body of a for-in should be wrapped in an if statement to filter unwanted properties from the prototype
    // egegeq: 0, // Expected '===' and instead saw '=='
    // "max-len": 0, // This line has a length of 104. Maximum allowed is 100
    // "operator-assignment": 0, // value = value * 1000; Assignment (-) can be replaced with operator assignment (*=) operator-assignment
    // "spaced-comment": 0, // space after //
    // "import/no-duplicates": 0, // imported multiple times
    // "no-unneeded-ternary": 0, // const value = req.value !== '0' ? true : false;
    // "import/newline-after-import": 0, // Expected 1 empty line after import statement not followed by another import
    // "nonblock-statement-body-position": 0, // same line whole if condition if there is no curly bracket -> if() return
    // "@typescript-eslint/comma-dangle": 0, // Missing trailing comma
    // "@typescript-eslint/lines-between-class-members": 0, // Expected blank line between class members
    // "@typescript-eslint/indent": 0,
    // "@typescript-eslint/quotes": 0, // Strings must use singlequote, Enforce the consistent use of either backticks, double, or single quotes.
    // "@typescript-eslint/naming-convention": 0, // must match one of the following formats: camelCase, PascalCase, UPPER_CASE
    // "@typescript-eslint/return-await": 0, // use await for return promise - return await new Promise()
    // "@typescript-eslint/no-use-before-define": 0, // was used before it was defined
    // "@typescript-eslint/no-shadow": 0, // variable is already declared in outer scope
    // "@typescript-eslint/no-unused-vars": 0,
    // "@typescript-eslint/dot-notation": 0,
    // "@typescript-eslint/no-redeclare": 0,
    // "@typescript-eslint/default-param-last": 0,
    // "@typescript-eslint/no-useless-constructor": 0, // check
  },
};
