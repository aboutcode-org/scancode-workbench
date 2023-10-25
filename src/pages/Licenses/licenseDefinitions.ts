import {
  LicenseFileRegion,
  LicenseMatch,
  LicenseDetectionMatch,
} from "../../services/importedJsonTypes";

export interface LicenseDetectionDetails {
  identifier: string;
  license_expression: string;
  detection_count: number;
  detection_log: string[];
  matches: LicenseDetectionMatch[];
  file_regions: LicenseFileRegion[];
}
export interface LicenseClueDetails {
  id: number;
  fileId: number;
  filePath: string;
  fileClueIdx: number;
  score: number | null;
  license_expression: string | null;
  rule_identifier: string | null;
  matches: LicenseMatch[];
  file_regions: LicenseFileRegion[];
}

export type ActiveLicenseEntity =
  | {
      type: "detection";
      license: LicenseDetectionDetails;
    }
  | {
      type: "clue";
      license: LicenseClueDetails;
    };
