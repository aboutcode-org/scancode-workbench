import { Change } from "diff";

export function trimStringWithEllipsis(
  str: string,
  maxLengthInclusive: number
) {
  if (str.length > maxLengthInclusive) {
    return str.trimEnd().slice(0, maxLengthInclusive - 3) + "...";
  }
  return str.trimEnd();
}

/**
 * Removes punctuation & multiple spaces from given string.
 */
export function normalizeString(str: string) {
  return str
    .replace(/[.,/#!$%^&*;:[{}\]=\-_`~()]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function normalizeAndCategorizeDiffs(diffs: Change[]) {
  return diffs.map((diff): DiffInfo => {
    {
      const changeDetected = Boolean(diff.added || diff.removed);
      const normalizedValue = normalizeString(diff.value);

      // No change / Trivial diff
      if (!changeDetected || normalizedValue.length === 0) {
        return {
          value: diff.value,
          count: diff.count,
          belongsTo: diff.added
            ? BelongsText.MODIFIED
            : diff.removed
            ? BelongsText.ORIGINAL
            : BelongsText.BOTH,
        };
      }

      return {
        ...(diff.added
          ? { added: true }
          : diff.removed
          ? { removed: true }
          : {}),
        belongsTo: diff.added
          ? BelongsText.MODIFIED
          : diff.removed
          ? BelongsText.ORIGINAL
          : BelongsText.BOTH,
        value: diff.value,
        count: diff.count,
        trimmedValue: normalizedValue,
      };
    }
  });
}

export enum BelongsText {
  ORIGINAL = "original",
  MODIFIED = "modified",
  BOTH = "both",
}
export interface DiffInfo extends Change {
  belongsTo: BelongsText;
  trimmedValue?: string;
}
export function splitDiffIntoLines(diffs: DiffInfo[]) {
  const lines: DiffInfo[][] = [[]];

  for (const diff of diffs) {
    const splitLines = diff.value.split("\n");

    // Handle \n at the beginning of diff
    let idx = 0;
    while (idx < splitLines.length && splitLines[idx].length === 0) {
      lines.push([]);
      idx++;
    }

    const subLines = splitLines.slice(idx);

    for (const subLine of subLines) {
      // Append to last line only if it is non-empty string
      if (subLine.length > 0) {
        lines[lines.length - 1].push({
          ...diff,
          value: subLine,
        });

        // Create newline for intermittent newlines
        // (ignore last subLine, it is continued in next line)
        if (subLine != subLines[subLines.length - 1]) {
          lines.push([]);
        }
      }
    }
  }

  // Filter out empty lines before returning;
  return lines.filter((diffLine) => diffLine.length > 0);
}
