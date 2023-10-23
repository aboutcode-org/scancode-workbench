import {
  LicenseFileRegion,
  LicenseMatch,
  LicenseDetectionMatch,
} from "../../services/importedJsonTypes";

export interface LicenseDetectionDetails {
  id: number;
  identifier: string;
  reviewed: boolean;
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
  reviewed: boolean;
  identifier: string;
  license_expression: string | null;
  rule_identifier: string | null;
  matches: LicenseMatch[];
  file_regions: LicenseFileRegion[];
}

export interface TodoDetails {
  id: number;
  detection_id: string;
  issues: Record<string, string>;
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

export interface ReviewOption {
  value: string;
  label: string;
}
export const REVIEW_STATUS_OPTIONS: Record<string, ReviewOption> = {
  ALL: { value: "ALL", label: "All" },
  REVIEWED: { value: "REVIEWED", label: "Reviewed" },
  UNREVIEWED: { value: "UNREVIEWED", label: "Unreviewed" },
};
