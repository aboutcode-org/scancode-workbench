import assert from "assert";
import {
  filterSpdxKeys,
  parseSubExpressions,
  parseTokenKeysFromExpression,
  parseTokensFromExpression,
} from "../src/utils/expressions";
import {
  FilterSpdxKeySamples,
  ParseExpressionTokensAndKeysSamples,
  SubExpressionsSamples,
} from "./expressions.test.data";

export const LICENSE_EXPRESSIONS_CONJUNCTIONS = ["AND", "OR", "WITH"];

describe("Parse sub expressions in a license expression", () => {
  it.each(SubExpressionsSamples)(
    "Parse sub expressions of $license_expression => $subExpressions.length sub expressions",
    ({ license_expression, subExpressions }) =>
      assert.deepEqual(parseSubExpressions(license_expression), subExpressions)
  );
});

describe("Parse tokens in a license expression", () => {
  it.each(ParseExpressionTokensAndKeysSamples)(
    "Parse tokens of $license_expression => $tokens.length tokens",
    ({ license_expression, tokens }) =>
      assert.deepEqual(parseTokensFromExpression(license_expression), tokens)
  );
});

describe("Parse keys in a license expression", () => {
  it.each(ParseExpressionTokensAndKeysSamples)(
    "Parse keys of $license_expression => $keys.length keys",
    ({ license_expression, keys }) =>
      assert.deepEqual(parseTokenKeysFromExpression(license_expression), keys)
  );
});

describe("Filter scancode-prefixed SPDX keys", () => {
  it("Must filter out custom scancode-prefixed SPDX keys", () =>
    assert.deepEqual(
      filterSpdxKeys(FilterSpdxKeySamples.keys),
      FilterSpdxKeySamples.filtered
    ));
});
