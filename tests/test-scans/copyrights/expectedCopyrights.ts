import { CopyrightFlatFileAttributes } from "../../../src/services/models/flatFile";
import { CopyrightAttributes } from "../../../src/services/models/copyright";

export const CopyrightSamples: {
  jsonFileName: string;
  expectedCopyrights: CopyrightAttributes[];
  expectedFlatFiles: CopyrightFlatFileAttributes[];
}[] = [
  {
    jsonFileName: "simple.json",
    expectedCopyrights: [
      {
        id: 1,
        fileId: 1,
        start_line: 1,
        end_line: 1,
        holders: '["Jason Gunthorpe and others"]',
        authors: '["APT Development Team <deity@lists.debian.org>"]',
        statements: '["copyright 1997, 1998, 1999 Jason Gunthorpe and others"]',
      },
      {
        id: 2,
        fileId: 2,
        start_line: 25,
        end_line: 26,
        holders: '["Google\', type"]',
        authors: "[]",
        statements: '["Copyright 2021 Google\', type"]',
      },
    ],
    expectedFlatFiles: [
      {
        copyright_statements: "[[]]",
        copyright_holders: "[[]]",
        copyright_authors: "[[]]",
        copyright_start_line: "[]",
        copyright_end_line: "[]",
      },
      {
        copyright_statements:
          '[["copyright 1997, 1998, 1999 Jason Gunthorpe and others"]]',
        copyright_holders: '[["Jason Gunthorpe and others"]]',
        copyright_authors:
          '[["APT Development Team <deity@lists.debian.org>"]]',
        copyright_start_line: "[[1]]",
        copyright_end_line: "[[1]]",
      },
      {
        copyright_statements: '[["Copyright 2021 Google\', type"]]',
        copyright_holders: '[["Google\', type"]]',
        copyright_authors: "[[]]",
        copyright_start_line: "[[25]]",
        copyright_end_line: "[[26]]",
      },
    ],
  },
  {
    jsonFileName: "noCopyrights.json",
    expectedCopyrights: [],
    expectedFlatFiles: [
      {
        copyright_statements: "[[]]",
        copyright_holders: "[[]]",
        copyright_authors: "[[]]",
        copyright_start_line: "[]",
        copyright_end_line: "[]",
      },
      {
        copyright_statements: "[[]]",
        copyright_holders: "[[]]",
        copyright_authors: "[[]]",
        copyright_start_line: "[]",
        copyright_end_line: "[]",
      },
      {
        copyright_statements: "[[]]",
        copyright_holders: "[[]]",
        copyright_authors: "[[]]",
        copyright_start_line: "[]",
        copyright_end_line: "[]",
      },
    ],
  },
];
