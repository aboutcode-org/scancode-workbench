import assert from "assert";

import {
  DiffTextSamples,
  NormalizeTexts,
  StringifiedArrayParserSamples,
  TrimTexts,
} from "./text.test.data";
import {
  diffStrings,
  splitDiffIntoLines,
  normalizeDiffString,
  trimStringWithEllipsis,
  BelongsIndicator,
  parseProbableStringifiedArray,
} from "../src/utils/text";

describe("Create readable string from stringified nested array", () => {
  it.each(StringifiedArrayParserSamples)(
    "Parse stringified array",
    ({ stringifiedArray, readableString, trimmedSize }) => {
      expect(
        parseProbableStringifiedArray(stringifiedArray, trimmedSize || 75)
      ).toBe(readableString);
    }
  );
});

describe("Trim text with ellipsis", () => {
  it.each(TrimTexts)(
    "Trim text: '$text' => '$trimmed'",
    ({ text, maxLengthInclusive, trimmed }) => {
      expect(trimStringWithEllipsis(text, maxLengthInclusive)).toBe(trimmed);
    }
  );
});

describe("Normalize text", () => {
  it.each(NormalizeTexts)(
    "Normalize text: '$text' => '$normalized'",
    ({ text, normalized }) => {
      expect(normalizeDiffString(text)).toBe(normalized);
    }
  );
});

describe("Diff two strings", () => {
  it.each(DiffTextSamples)(
    "Diff text",
    ({ sourceText, modifiedText, normalizedDiffs }) =>
      assert.deepEqual(diffStrings(sourceText, modifiedText), normalizedDiffs)
  );
});

describe("Group diffs into Lines", () => {
  it.each(DiffTextSamples)(
    "Diff to lines",
    ({
      normalizedDiffs,
      normalizedSourceTextLines,
      normalizedModifiedTextLines,
    }) => {
      assert.deepEqual(
        splitDiffIntoLines(
          normalizedDiffs.filter(
            (diff) =>
              diff.belongsTo === BelongsIndicator.BOTH ||
              diff.belongsTo === BelongsIndicator.ORIGINAL
          )
        ),
        normalizedSourceTextLines
      );

      assert.deepEqual(
        splitDiffIntoLines(
          normalizedDiffs.filter(
            (diff) =>
              diff.belongsTo === BelongsIndicator.BOTH ||
              diff.belongsTo === BelongsIndicator.MODIFIED
          )
        ),
        normalizedModifiedTextLines
      );
    }
  );
});
