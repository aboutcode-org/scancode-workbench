import { parseIfValidJson } from "./parsers";

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

test("JSON validity", () => {
  JsonValiditySamples.valid.forEach((sample) =>
    expect(parseIfValidJson(sample)).toBeTruthy()
  );
  JsonValiditySamples.invalid.forEach((sample) =>
    expect(parseIfValidJson(sample)).toBeNull()
  );
});
