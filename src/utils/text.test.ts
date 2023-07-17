import assert from "assert";
import {
  DiffToLineSamples,
  NormalizeTexts,
  TrimTexts,
} from "./test-data/text-data";
import {
  normalizeAndSplitDiffIntoLines,
  normalizeDiffString,
  trimStringWithEllipsis,
} from "./text";

test("Text trimmer", () => {
  TrimTexts.forEach((sample) =>
    expect(trimStringWithEllipsis(sample.text, sample.maxLengthInclusive)).toBe(
      sample.trimmed
    )
  );
});

test("Text Normalizer", () => {
  NormalizeTexts.forEach((sample) =>
    expect(normalizeDiffString(sample.text)).toBe(sample.normalized)
  );
});

// Incomplete
// test("Diff strings", () => {

// })

// Incomplete
// test("Diff to Lines", () => {
//   DiffToLineSamples.forEach((sample) =>
//     assert.deepEqual(normalizeAndSplitDiffIntoLines(sample.diffs), sample.lines)
//   );
// });
