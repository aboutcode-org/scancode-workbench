import assert from "assert";
import {
  formatBarchartData,
  getValidatedAttributeValues,
  isValid,
} from "../src/utils/bar";
import { BarDataSamples, RawModelDataSamples } from "./bar.test.data";

const PossibleBarchartValues: { valid: unknown[]; invalid: unknown[] } = {
  valid: [["nexB Inc"], "ABCD", 23, 55.5, true],
  invalid: [null, undefined, []],
};
describe("Bar chart - Check Validity of values", () => {
  it.each(PossibleBarchartValues.valid)("Valid chart values %s", (chartValue) =>
    assert.equal(isValid(chartValue), true)
  );
  it.each(PossibleBarchartValues.invalid)(
    "Invalid chart value - %s",
    (chartValue) => assert.equal(isValid(chartValue), false)
  );
});

describe("Bar chart - Get attribute from Sequelize model", () => {
  it.each(RawModelDataSamples)(
    "Get attribute $attribute",
    ({ attribute, values, validatedAttributeValues }) =>
      assert.deepEqual(
        getValidatedAttributeValues(values, attribute),
        validatedAttributeValues
      )
  );
});

describe("Bar chart - Format bar chart values", () => {
  it.each(BarDataSamples)(
    "Format bar chart data of length: $data.length",
    ({ data, formatted }) => {
      assert.deepStrictEqual(formatBarchartData(data), formatted);
    }
  );
});
