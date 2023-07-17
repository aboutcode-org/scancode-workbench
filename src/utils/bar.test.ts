import assert from "assert";
import { formatBarchartData, isValid } from "./bar";
import { BarDataSamples } from "./test-data/bar-data";

test("Bar chart values - Validity", () => {
  const possibleValues: { valid: unknown[]; invalid: unknown[] } = {
    valid: [["Copyright (c) nexB Inc. and others"]],
    invalid: [null, undefined, []],
  };
  possibleValues.valid.forEach((value) => expect(isValid(value)).toBe(true));
  possibleValues.invalid.forEach((value) => expect(isValid(value)).toBe(false));
});

test("Bar chart values - Formatting", () => {
  BarDataSamples.forEach((sample) =>
    assert.deepStrictEqual(sample.formatted, formatBarchartData(sample.data))
  );
});
