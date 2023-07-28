import assert from "assert";

import {
  DiffTextSamples,
  NormalizeTexts,
  TrimTexts,
} from "./text.test.data";
import {
  diffStrings,
  splitDiffIntoLines,
  normalizeDiffString,
  trimStringWithEllipsis,
  BelongsIndicator,
} from "./text";

describe("Text - Trim text", () => {
  it.each(TrimTexts)(
    "Trim text: '$text' => '$trimmed'",
    ({ text, maxLengthInclusive, trimmed }) => {
      expect(trimStringWithEllipsis(text, maxLengthInclusive)).toBe(trimmed);
    }
  );
});

describe("Text - Normalize text", () => {
  it.each(NormalizeTexts)(
    "Normalize text: '$text' => '$normalized'",
    ({ text, normalized }) => {
      expect(normalizeDiffString(text)).toBe(normalized);
    }
  );
});

describe("Text - Diff two strings", () => {
  it.each(DiffTextSamples)(
    "Diff text",
    ({ sourceText, modifiedText, normalizedDiffs }) =>
      assert.deepEqual(diffStrings(sourceText, modifiedText), normalizedDiffs)
  );
});

describe("Text - Group diffs into Lines", () => {
  it.each(DiffTextSamples)(
    "Diff to lines",
    ({
      normalizedDiffs,
      normalizedSourceTextLines,
      normalizedModifiedTextLines,
    }) => {
      assert.deepEqual(splitDiffIntoLines(
        normalizedDiffs.filter(
          (diff) =>
            diff.belongsTo === BelongsIndicator.BOTH ||
            diff.belongsTo === BelongsIndicator.ORIGINAL
        )
      ), normalizedSourceTextLines);

      assert.deepEqual(splitDiffIntoLines(
        normalizedDiffs.filter(
          (diff) =>
            diff.belongsTo === BelongsIndicator.BOTH ||
            diff.belongsTo === BelongsIndicator.MODIFIED
        )
      ), normalizedModifiedTextLines);
    }
  );
});
