import { LicenseClueAttributes } from "../../services/models/licenseClues";
import { LicenseDetectionAttributes } from "../../services/models/licenseDetections";

export interface LicenseClueDetails extends LicenseClueAttributes {
  identifier: string;
}

export type ActiveLicenseEntity =
  | {
      type: "detection";
      license: LicenseDetectionAttributes;
    }
  | {
      type: "clue";
      license: LicenseClueDetails;
    };

export enum ReviewOptionKeys {
  ALL = "ALL",
  REVIEWED = "REVIEWED",
  UNREVIEWED = "UNREVIEWED",
}
export interface ReviewOption {
  value: string;
  label: string;
}
export const REVIEW_STATUS_OPTIONS: Record<ReviewOptionKeys, ReviewOption> = {
  ALL: { value: "ALL", label: "All" },
  REVIEWED: { value: "REVIEWED", label: "Reviewed" },
  UNREVIEWED: { value: "UNREVIEWED", label: "Unreviewed" },
};
