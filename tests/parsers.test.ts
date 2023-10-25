import { parseIfValidJson } from "../src/utils/parsers";

export const JsonValiditySamples: {
  valid: unknown[];
  invalid: unknown[];
} = {
  valid: [
    `[]`,
    `{}`,
    `{"key": "value"}`,
    `[{ "key": "value", "key2": true, "key3": 3 }]`,
    `["abc", "xyz", 9]`,
  ],
  invalid: [
    null,
    undefined,
    true,
    5,
    { obj: "is not a valid json string" },
    "",
    "abcd",
    `{"key": "val}`,
    `{"key": "val"`,
  ],
};

describe("Check if JSON is valid", () => {
  it.each(JsonValiditySamples.valid)("Valid sample: %s", (sample) =>
    expect(parseIfValidJson(sample)).toBeTruthy()
  );
  it.each(JsonValiditySamples.invalid)("Invalid sample: %s", (sample) =>
    expect(parseIfValidJson(sample)).toBeNull()
  );
});
