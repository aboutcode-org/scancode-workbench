import { LicenseDetectionAttributes } from "./models/licenseDetections";

export interface LicenseExpressionKey {
  key: string;
  licensedb_url: string | null;
  scancode_url: string | null;
}
export interface LicenseExpressionSpdxKey {
  key: string;
  spdx_url: string | null;
}
export interface LicenseMatch {
  score: number;
  start_line: number;
  end_line: number;
  matched_text?: string;
  matched_length: number;
  match_coverage: number;
  matcher: string;
  license_expression: string;
  license_expression_spdx?: string;
  rule_identifier: string;
  rule_relevance: number;
  rule_url: string;

  // Parser-added fields
  path?: string;
  license_expression_keys?: LicenseExpressionKey[];
  license_expression_spdx_keys?: LicenseExpressionSpdxKey[];
}
export type LicenseDetectionMatch = LicenseMatch;
export type LicenseClueMatch = LicenseMatch;

export interface LicenseFileRegion {
  path: string;
  start_line: number;
  end_line: number;
  from_package?: string;
}
export interface LicenseClue {
  score: number;
  start_line: number;
  end_line: number;
  matched_text?: string | null;
  matched_length: number;
  match_coverage: number;
  matcher: string;
  license_expression: string;
  rule_identifier: string;
  rule_relevance: number;
  rule_url: string;

  // Parser-added fields
  fileId?: number;
  filePath?: string;
  fileClueIdx: number;
  matches?: LicenseClueMatch[];
  file_regions?: LicenseFileRegion[];
  license_expression_spdx?: string;
}
export interface TopLevelLicenseDetection {
  identifier: string;
  license_expression: string;
  detection_count: number;
  detection_log?: string[] | null;
  file_regions?: LicenseFileRegion[];
  matches?: LicenseDetectionMatch[];

  // Legacy output version fields
  count?: number;
}
export interface ResourceLicenseDetection {
  license_expression: string;
  matches: LicenseDetectionMatch[];
  identifier: string;
}

export interface LicensePolicy {
  license_key: string;
  label: string;
  color_code: string;
  icon: string;

  // Parser-added fields
  fileId?: number;
}

export interface RawTopLevelTodo {
  detection_id: string;
  review_comments: Record<string, string>;
  detection: LicenseDetectionAttributes;
}

export interface Resource {
  id?: number;
  path: string;
  type: string | null;
  name: string | null;
  extension?: string | null;
  date?: string | null;
  size?: number;
  sha1?: string | null;
  md5?: string | null;
  files_count?: number | null;
  dirs_count?: number | null;
  size_count?: number;
  mime_type?: string | null;
  file_type?: string | null;
  programming_language?: string | null;
  is_binary?: boolean;
  is_text?: boolean;
  is_archive?: boolean;
  is_media?: boolean;
  is_source?: boolean;
  is_script?: boolean;
  package_data?: {
    type: string;
    namespace: string;
    name: string;
    version: string;
    qualifiers: unknown;
    subpath: string;
    primary_language: string | null;
    description: string;
    release_date: null;
    parties: {
      type: string;
      role: string;
      name: string;
      email: string;
      url: string;
    }[];
    keywords: string[];
    homepage_url: string;
    download_url: string;
    size: number;
    sha1: string;
    md5: string;
    sha256: string;
    sha512: string;
    bug_tracking_url: string;
    code_view_url: string;
    vcs_url: string;
    copyright: string;
    holder: string;
    declared_license_expression: string;
    declared_license_expression_spdx: string;
    license_detections?: ResourceLicenseDetection[];
    other_license_expression: string;
    other_license_expression_spdx: string;
    other_license_detections?: ResourceLicenseDetection[];
    extracted_license_statement: string;
    notice_text: string;
    source_packages: string[];
    file_references: unknown[];
    extra_data: unknown;
    dependencies: {
      purl: string;
      extracted_requirement: null;
      scope: string | null;
      is_runtime: boolean;
      is_optional: boolean;
      is_resolved: boolean;
      resolved_package: unknown;
      extra_data: unknown;
    }[];
    repository_homepage_url: string;
    repository_download_url: string;
    api_data_url: string;
    datasource_id: string;
    purl: string;
  }[];
  for_packages?: string[];
  detected_license_expression?: string | null;
  detected_license_expression_spdx?: string | null;
  for_license_detections?: string[];
  license_detections?: ResourceLicenseDetection[];
  license_clues?: LicenseClue[];
  emails?: unknown[];
  urls?: unknown[];
  copyrights?: {
    copyright: string;
    start_line: number;
    end_line: number;
  }[];
  holders?: {
    holder: string;
    start_line: number;
    end_line: number;
  }[];
  authors?: {
    author: string;
    start_line: number;
    end_line: number;
  }[];
  percentage_of_license_text?: number;
  license_policy?: LicensePolicy[];
  scan_errors?: string[];

  // Parser-added fields
  parent?: string;
}
