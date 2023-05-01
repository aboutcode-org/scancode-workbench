export interface LicenseDetectionMatch {
  score: number;
  start_line: number;
  end_line: number;
  matched_length: number;
  match_coverage: number;
  matcher: string;
  license_expression: string;
  rule_identifier: string;
  rule_relevance: number;
  rule_url: string;

  // Parser-added fields
  path?: string;
  license_expression_spdx?: string;
  license_expression_keys?: {
    key: string;
    licensedb_url: string | null;
    scancode_url: string | null;
  }[];
  license_expression_spdx_keys?: {
    key: string;
    spdx_url: string | null;
  }[];
}
export type LicenseClue = LicenseDetectionMatch

export interface TopLevelLicenseDetection {
  identifier: string;
  license_expression: string;
  detection_count: number;
  detection_log?: string[] | null;
  file_regions?: unknown[];
  matches?: LicenseDetectionMatch[];

  // Legacy output version fields
  count?: number;
}

export interface ResourceLicenseDetection {
  license_expression: string;
  matches: LicenseDetectionMatch[];
  identifier: string;
}

export interface Resource {
  id?: number;
  path: string;
  type: string | null;
  name: string | null;
  extension: string | null;
  date: string | null;
  size: number;
  sha1: string | null;
  md5: string | null;
  files_count: number | null;
  dirs_count: number | null;
  size_count?: number;
  mime_type: string | null;
  file_type: string | null;
  programming_language: string | null;
  is_binary: boolean;
  is_text: boolean;
  is_archive: boolean;
  is_media: boolean;
  is_source: boolean;
  is_script: boolean;
  package_data: {
    license_detections?: ResourceLicenseDetection[];
  }[];
  for_packages: string[];
  detected_license_expression: string | null;
  detected_license_expression_spdx: string | null;
  for_license_detections?: string[];
  license_detections?: ResourceLicenseDetection[];
  license_clues:  LicenseClue[];
  copyrights: {
    copyright: string;
    start_line: number;
    end_line: number;
  }[];
  holders: {
    holder: string;
    start_line: number;
    end_line: number;
  }[];
  authors: {
    author: string;
    start_line: number;
    end_line: number;
  }[];
  percentage_of_license_text?: number;
  license_policy?: {
    license_key: string;
    label: string;
    color_code: string;
    icon: string;
    // Parser-added fields
    fileId?: number;
  }[];
  scan_errors: [];

  // Parser-added fields
  parent?: string;
  headerId?: number;
}
