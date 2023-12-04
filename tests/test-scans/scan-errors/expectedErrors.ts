import { ErrorsFlatFileAttributes } from "../../../src/services/models/flatFile";

export const ErrorSamples: {
  jsonFileName: string;
  expectedScanErrors: {
    id: number;
    fileId: number;
    scan_error: string;
  }[];
  expectedFlatFiles: ErrorsFlatFileAttributes[];
}[] = [
  {
    jsonFileName: "withErrors.json",
    expectedScanErrors: [
      {
        id: 1,
        scan_error:
          "ERROR: for scanner: licenses:\nERROR: Processing interrupted: timeout after 1 seconds.",
        fileId: 1,
      },
      {
        id: 2,
        scan_error:
          "ERROR: for scanner: licenses:\nERROR: Processing interrupted: timeout after 1 seconds.",
        fileId: 2,
      },
      {
        id: 3,
        scan_error:
          "ERROR: for scanner: copyrights:\nERROR: Processing interrupted: timeout after 1 seconds.",
        fileId: 2,
      },
      {
        id: 4,
        scan_error:
          "ERROR: for scanner: licenses:\nERROR: Processing interrupted: timeout after 1 seconds.",
        fileId: 3,
      },
    ],
    expectedFlatFiles: [
      {
        fileId: 0,
        scan_errors: [],
      },
      {
        fileId: 1,
        scan_errors: [
          "ERROR: for scanner: licenses:\nERROR: Processing interrupted: timeout after 1 seconds.",
        ],
      },
      {
        fileId: 2,
        scan_errors: [
          "ERROR: for scanner: licenses:\nERROR: Processing interrupted: timeout after 1 seconds.",
          "ERROR: for scanner: copyrights:\nERROR: Processing interrupted: timeout after 1 seconds.",
        ],
      },
      {
        fileId: 3,
        scan_errors: [
          "ERROR: for scanner: licenses:\nERROR: Processing interrupted: timeout after 1 seconds.",
        ],
      },
    ],
  },
];
