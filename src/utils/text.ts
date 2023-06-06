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

export function splitDiffIntoLines(diffs: Change[]) {
  const lines: Change[][] = [[]];

  for (const diff of diffs) {
    const splitLines = diff.value.split("\n");

    // Handle \n at the beginning of diff
    let idx = 0;
    while (idx < splitLines.length && splitLines[idx].length === 0) {
      lines.push([]);
      idx++;
    }

    const subLines = splitLines.slice(idx);

    // console.log("Splitlines", splitLines, ">>", "Sublines", subLines);

    if (subLines.length === 1) {
      // Append to last line, without adding new line
      lines[lines.length - 1].push({
        ...diff,
        value: subLines[0],
      });
      continue;
    }

    for (const subLine of subLines) {
      // Append to last line only if it is non-empty string &
      if (subLine.length > 0) {
        lines[lines.length - 1].push({
          ...diff,
          value: subLine,
        });
        lines.push([]);
      }

      // Add newline for \n at first location in subLine or subLine is non empty string
      // (subLine.length === 0 && subLine == subLines[0]) ||

      // Add a new line for further iterations
      // if (
      //   subLine.length > 0
      // ) {
      // }
    }
  }

  return lines;
}
