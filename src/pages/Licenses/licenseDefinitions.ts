import {
  LicenseFileRegion,
  LicenseMatch,
  LicenseDetectionMatch,
} from "../../services/importedJsonTypes";

export interface LicenseDetectionDetails {
  id: number;
  identifier: string;
  vetted: boolean;
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
  vetted: boolean;
  identifier: string;
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

export interface VetOption {
  value: string;
  label: string;
}
export const VET_OPTIONS: Record<string, VetOption> = {
  ALL: { value: "ALL", label: "All" },
  VETTED: { value: "VETTED", label: "Vetted" },
  UNVETTED: { value: "UNVETTED", label: "Unvetted" },
};
