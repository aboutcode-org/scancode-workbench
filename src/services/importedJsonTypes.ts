import { JSON_Type } from "./models/databaseUtils";

export interface ParsedJsonHeader {
  json_file_name: string;
  tool_name: string;
  tool_version: string;
  notice: string;
  duration: number;
  options: JSON_Type;
  input: JSON_Type;
  files_count: number;
  output_format_version: string;
  spdx_license_list_version: string; // @QUERY - Justify need for this
  operating_system: string;
  cpu_architecture: string;
  platform: string;
  platform_version: string;
  python_version: string;
  workbench_version: string;
  workbench_notice: string;
  header_content: string;
  errors: JSON_Type;
}

export interface LicenseReference {
  key: string;
  language: string;
  short_name: string;
  name: string;
  category: string;
  owner: string;
  homepage_url: string;
  notes: string;
  is_builtin: boolean;
  is_exception: boolean;
  is_unknown: boolean;
  is_generic: boolean;
  spdx_license_key: string;
  other_spdx_license_keys: string[];
  osi_license_key: string | null;
  text_urls: string[];
  osi_url?: string;
  faq_url?: string;
  other_urls: string[];
  key_aliases: string[];
  minimum_coverage: number;
  standard_notice: string | null;
  ignorable_copyrights: string[];
  ignorable_holders: string[];
  ignorable_authors: string[];
  ignorable_urls: string[];
  ignorable_emails: string[];
  text: string;
  scancode_url: string | null;
  licensedb_url: string | null;
  spdx_url: string | null;
}

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
  matched_text: string;
  matched_length: number;
  match_coverage: number;
  matcher: string;
  license_expression: string;
  rule_identifier: string;
  rule_relevance: number;
  rule_url: string;

  // Parser-added fields
  path?: string;
  license_expression_keys?: LicenseExpressionKey[];
}
export interface LicenseDetectionMatch extends LicenseMatch {
  license_expression_spdx?: string;
  license_expression_spdx_keys?: LicenseExpressionSpdxKey[];
}
export type LicenseClueMatch = LicenseMatch;

export interface LicenseFileRegion {
  path: string;
  start_line: number;
  end_line: number;
  from_package?: boolean;
}
export interface LicenseClue {
  score: number;
  start_line: number;
  end_line: number;
  matched_text: string;
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
export interface Todo {
  detection_id: string;
  issues: string;
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
    license_detections?: ResourceLicenseDetection[];
  }[];
  for_packages?: string[];
  detected_license_expression?: string | null;
  detected_license_expression_spdx?: string | null;
  for_license_detections?: string[];
  license_detections?: ResourceLicenseDetection[];
  license_clues?: LicenseClue[];
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
  license_policy?: {
    license_key: string;
    label: string;
    color_code: string;
    icon: string;
    // Parser-added fields
    fileId?: number;
  }[];
  scan_errors?: string[];

  // Parser-added fields
  parent?: string;
}
