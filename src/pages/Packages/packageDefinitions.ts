import { DEPENDENCY_SCOPES } from "../../services/models/dependencies";

export interface DependencyDetails {
  purl: string;
  extracted_requirement: string;
  scope: DEPENDENCY_SCOPES;
  is_runtime: boolean;
  is_optional: boolean;
  is_pinned: boolean;
  resolved_package: unknown;
  dependency_uid: string;
  for_package_uid: string | null;
  datafile_path: string;
  datasource_id: string;
}
export interface PackageDetails {
  package_uid: string;
  name: string;
  type: string;
  dependencies: DependencyDetails[];
  namespace: string | null;
  version: string | null;
  qualifiers: unknown;
  subpath: string | null;
  primary_language: string | null;
  description: string | null;
  release_date: string | null;
  parties: unknown;
  keywords: unknown;
  homepage_url: string | null;
  download_url: string | null;
  size: string | null;
  sha1: string | null;
  md5: string | null;
  sha256: string | null;
  sha512: string | null;
  bug_tracking_url: string | null;
  code_view_url: string | null;
  vcs_url: string | null;
  copyright: string | null;
  declared_license_expression: string | null;
  declared_license_expression_spdx: string | null;
  other_license_expression: string | null;
  other_license_expression_spdx: string | null;
  extracted_license_statement: string | null;
  notice_text: string | null;
  source_packages: unknown;
  extra_data: unknown;
  repository_homepage_url: string | null;
  repository_download_url: string | null;
  api_data_url: string | null;
  datafile_paths: string[];
  datasource_ids: string[];
  purl: string;
  license_detections: {
    license_expression: string;
    identifier: string;
  }[];
}
export interface PackageTypeGroupDetails {
  packages: PackageDetails[];
  type: string;
}
