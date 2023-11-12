import { PackageDetails } from "./packageDefinitions";

export const MISC_DEPS = "others";

// Obtaining a new misc package via function to prevent preserving the same object across renders
export const getMiscPackage = (): PackageDetails => {
  return {
    package_uid: "misc",
    name: "Misc dependencies",
    type: "Other",
    dependencies: [],
    namespace: "",
    version: null,
    qualifiers: {},
    subpath: null,
    primary_language: null,
    description: null,
    release_date: null,
    parties: {},
    keywords: {},
    license_detections: [],
    homepage_url: null,
    download_url: null,
    size: null,
    sha1: null,
    md5: null,
    sha256: null,
    sha512: null,
    bug_tracking_url: null,
    code_view_url: null,
    vcs_url: null,
    copyright: null,
    declared_license_expression: null,
    declared_license_expression_spdx: null,
    other_license_expression: null,
    other_license_expression_spdx: null,
    extracted_license_statement: null,
    notice_text: null,
    source_packages: {},
    extra_data: {},
    repository_homepage_url: null,
    repository_download_url: null,
    api_data_url: null,
    datafile_paths: [],
    datasource_ids: [],
    purl: "Misc Dependencies",
  };
}