import { BelongsIndicator, DiffComponents } from "../src/utils/text";

export const TrimTexts: {
  text: string;
  maxLengthInclusive: number;
  trimmed: string;
}[] = [
  { text: undefined, maxLengthInclusive: 10, trimmed: "" },
  { text: null, maxLengthInclusive: 10, trimmed: "" },
  { text: "", maxLengthInclusive: 10, trimmed: "" },
  { text: "abcd", maxLengthInclusive: 10, trimmed: "abcd" },
  { text: "abcdef", maxLengthInclusive: 6, trimmed: "abcdef" },
  { text: "Statement", maxLengthInclusive: 10, trimmed: "Statement" },
  { text: "Statement", maxLengthInclusive: 9, trimmed: "Statement" },
  { text: "Statement", maxLengthInclusive: 8, trimmed: "State..." },
  { text: "Statement", maxLengthInclusive: 7, trimmed: "Stat..." },
  { text: "Statement", maxLengthInclusive: 6, trimmed: "Sta..." },
  {
    text: "License :: OSI Approved :: BSD License",
    maxLengthInclusive: 20,
    trimmed: "License :: OSI Ap...",
  },
];

export const NormalizeTexts: { text: string; normalized: string }[] = [
  { text: "   ab#*c   d  efg/hi   ", normalized: "abc d efghi" },
  { text: "#/*^-_", normalized: "" },
  { text: ".[txt]", normalized: "txt" },
  { text: "     ", normalized: "" },
  { text: ".", normalized: "" },
  { text: "[Netty]", normalized: "Netty" },
  { text: "abcd wef \n mno   pqr  ", normalized: "abcd wef mno pqr" },
];

export const StringifiedArrayParserSamples: {
  stringifiedArray: string;
  readableString: string;
  trimmedSize?: number;
}[] = [
  {
    stringifiedArray: "[[]]",
    readableString: "",
  },
  {
    stringifiedArray: '[["Google\', type"]]',
    readableString: "Google', type",
  },
  {
    stringifiedArray: '[["nexB Inc."]]',
    readableString: "nexB Inc.",
  },
  {
    stringifiedArray:
      '[["nexB Inc. and others","nexB Inc. and others","SpryMedia Limited","Twitter, Inc","SpryMedia Limited","Masayuki Tanaka","The Chromium Authors","SpryMedia Limited","Michael Bostock","SpryMedia Limited","GitHub Inc.","Electron project","SpryMedia Limited","SpryMedia Limited","Mika Tuupola, Dylan Verheul","jQuery Foundation and other contributors","jQuery Foundation and other contributors"]]',
    trimmedSize: 75,
    readableString:
      "nexB Inc. and others,nexB Inc. and others,SpryMedia Limited,Twitter, Inc...",
  },
  {
    stringifiedArray: '[["nexB Inc. and others","nexB Inc. and others"]]',
    readableString: "nexB Inc. and others,nexB Inc. and others",
  },
];

export const DiffTextSamples: {
  sourceText: string;
  modifiedText: string;
  normalizedDiffs: DiffComponents[];
  normalizedSourceTextLines: DiffComponents[][];
  normalizedModifiedTextLines: DiffComponents[][];
}[] = [
  {
    sourceText: "creativecommons.org/publicdomain",
    modifiedText: "creativecommons.org/publicdomain",
    normalizedDiffs: [
      {
        diffComponent: null,
        belongsTo: BelongsIndicator.BOTH,
        value: "creativecommons.org/publicdomain",
      },
    ],
    normalizedSourceTextLines: [
      [
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value: "creativecommons.org/publicdomain",
        },
      ],
    ],
    normalizedModifiedTextLines: [
      [
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value: "creativecommons.org/publicdomain",
        },
      ],
    ],
  },
  {
    sourceText: "Contributor License Agreement](#cla",
    modifiedText: "Contributor License Agreement (CLA)",
    normalizedDiffs: [
      {
        diffComponent: null,
        belongsTo: BelongsIndicator.BOTH,
        value: "Contributor License Agreement",
      },
      {
        belongsTo: BelongsIndicator.ORIGINAL,
        value: "]",
      },
      {
        belongsTo: BelongsIndicator.MODIFIED,
        value: " ",
      },
      {
        diffComponent: null,
        belongsTo: BelongsIndicator.BOTH,
        value: "(",
      },
      {
        belongsTo: BelongsIndicator.ORIGINAL,
        value: "#cla",
      },
      {
        belongsTo: BelongsIndicator.MODIFIED,
        value: "CLA)",
      },
    ],
    normalizedSourceTextLines: [
      [
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value: "Contributor License Agreement",
        },
        {
          value: "]",
          belongsTo: BelongsIndicator.ORIGINAL,
        },
        {
          value: "(",
          belongsTo: BelongsIndicator.BOTH,
        },
        {
          belongsTo: BelongsIndicator.ORIGINAL,
          value: "#cla",
        },
      ],
    ],
    normalizedModifiedTextLines: [
      [
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value: "Contributor License Agreement",
        },
        {
          value: " ",
          belongsTo: BelongsIndicator.MODIFIED,
        },
        {
          value: "(",
          belongsTo: BelongsIndicator.BOTH,
        },
        {
          belongsTo: BelongsIndicator.MODIFIED,
          value: "CLA)",
        },
      ],
    ],
  },
  {
    sourceText:
      '# Licensed under the Apache License, Version 2.0 (the "License");\n# you may not use this file except in \ncompliance with the License.\n#',
    modifiedText:
      'Licensed under\n the (Apache License), Version 2.0 (the "License");\n * you may not use - this file except in \n (compliance^) /with the + License.\n * You may obtain a copy of the License at\n',
    normalizedDiffs: [
      {
        diffComponent: "removed",
        belongsTo: BelongsIndicator.ORIGINAL,
        value: "# ",
      },
      {
        diffComponent: null,
        belongsTo: BelongsIndicator.BOTH,
        value: "Licensed under",
      },
      {
        diffComponent: "added",
        belongsTo: BelongsIndicator.MODIFIED,
        value: "\n",
      },
      {
        diffComponent: null,
        belongsTo: BelongsIndicator.BOTH,
        value: " the ",
      },
      {
        diffComponent: "added",
        belongsTo: BelongsIndicator.MODIFIED,
        value: "(",
      },
      {
        diffComponent: null,
        belongsTo: BelongsIndicator.BOTH,
        value: "Apache License",
      },
      {
        diffComponent: "added",
        belongsTo: BelongsIndicator.MODIFIED,
        value: ")",
      },
      {
        diffComponent: null,
        belongsTo: BelongsIndicator.BOTH,
        value: ', Version 2.0 (the "License");\n',
      },
      {
        belongsTo: BelongsIndicator.ORIGINAL,
        value: "#",
      },
      {
        belongsTo: BelongsIndicator.MODIFIED,
        value: " *",
      },
      {
        diffComponent: null,
        belongsTo: BelongsIndicator.BOTH,
        value: " you may not use ",
      },
      {
        diffComponent: "added",
        belongsTo: BelongsIndicator.MODIFIED,
        value: "- ",
      },
      {
        diffComponent: null,
        belongsTo: BelongsIndicator.BOTH,
        value: "this file except in \n",
      },
      {
        diffComponent: "added",
        belongsTo: BelongsIndicator.MODIFIED,
        value: " (",
      },
      {
        diffComponent: null,
        belongsTo: BelongsIndicator.BOTH,
        value: "compliance",
      },
      {
        diffComponent: "added",
        belongsTo: BelongsIndicator.MODIFIED,
        value: "^)",
      },
      {
        diffComponent: null,
        belongsTo: BelongsIndicator.BOTH,
        value: " ",
      },
      {
        diffComponent: "added",
        belongsTo: BelongsIndicator.MODIFIED,
        value: "/",
      },
      {
        diffComponent: null,
        belongsTo: BelongsIndicator.BOTH,
        value: "with the ",
      },
      {
        diffComponent: "added",
        belongsTo: BelongsIndicator.MODIFIED,
        value: "+ ",
      },
      {
        diffComponent: null,
        belongsTo: BelongsIndicator.BOTH,
        value: "License.\n",
      },
      {
        diffComponent: "removed",
        belongsTo: BelongsIndicator.ORIGINAL,
        value: "#",
      },
      {
        diffComponent: "added",
        belongsTo: BelongsIndicator.MODIFIED,
        value: " * You may obtain a copy of the License at\n",
      },
    ],
    normalizedSourceTextLines: [
      [
        {
          value: "# ",
          belongsTo: BelongsIndicator.ORIGINAL,
        },
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value: "Licensed under",
        },
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value: " the ",
        },
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value: "Apache License",
        },
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value: ', Version 2.0 (the "License");',
        },
      ],
      [
        {
          value: "#",
          belongsTo: BelongsIndicator.ORIGINAL,
        },
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value: " you may not use ",
        },
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value: "this file except in ",
        },
      ],
      [
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value: "compliance",
        },
        {
          value: " ",
          belongsTo: BelongsIndicator.BOTH,
        },
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value: "with the ",
        },
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value: "License.",
        },
      ],
      [
        {
          value: "#",
          belongsTo: BelongsIndicator.ORIGINAL,
        },
      ],
    ],
    normalizedModifiedTextLines: [
      [
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value: "Licensed under",
        },
      ],
      [
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value: " the ",
        },
        {
          value: "(",
          belongsTo: BelongsIndicator.MODIFIED,
        },
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value: "Apache License",
        },
        {
          value: ")",
          belongsTo: BelongsIndicator.MODIFIED,
        },
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value: ', Version 2.0 (the "License");',
        },
      ],
      [
        {
          value: " *",
          belongsTo: BelongsIndicator.MODIFIED,
        },
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value: " you may not use ",
        },
        {
          value: "- ",
          belongsTo: BelongsIndicator.MODIFIED,
        },
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value: "this file except in ",
        },
      ],
      [
        {
          value: " (",
          belongsTo: BelongsIndicator.MODIFIED,
        },
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value: "compliance",
        },
        {
          value: "^)",
          belongsTo: BelongsIndicator.MODIFIED,
        },
        {
          value: " ",
          belongsTo: BelongsIndicator.BOTH,
        },
        {
          value: "/",
          belongsTo: BelongsIndicator.MODIFIED,
        },
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value: "with the ",
        },
        {
          diffComponent: "added",
          belongsTo: BelongsIndicator.MODIFIED,
          value: "+ ",
        },
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value: "License.",
        },
      ],
      [
        {
          diffComponent: "added",
          belongsTo: BelongsIndicator.MODIFIED,
          value: " * You may obtain a copy of the License at",
        },
      ],
    ],
  },
];
