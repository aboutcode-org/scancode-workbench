export const CopyrightSamples: {
  jsonFileName: string;
  expectedCopyrights: {
    id: number;
    fileId: number;
    start_line: number;
    end_line: number;
    holders: string;
    authors: string;
    statements: string;
  }[];
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
  },
  {
    jsonFileName: "noCopyrights.json",
    expectedCopyrights: [],
  }
];
