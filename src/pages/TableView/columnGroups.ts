import { ColDef } from 'ag-grid-community';
import { ALL_COLUMNS } from './columnDefs';

// NOTE --- 
export const DEFAULT_EMPTY_VALUES = new Set<string | null>([
  '', null, '[]', '[[]]'
]);

export const SET_FILTERED_COLUMNS = new Set<string>([
  ALL_COLUMNS.type.field || "",
  ALL_COLUMNS.extension.field || "",
  ALL_COLUMNS.programming_language.field || "",
  ALL_COLUMNS.file_type.field || "",

  ALL_COLUMNS.copyright_holders.field || "",
  ALL_COLUMNS.copyright_authors.field || "",
  // ALL_COLUMNS..field || "",
  // ALL_COLUMNS..field || "",
])

const FILE_COLUMN_GROUP: ColDef[] = [
  ALL_COLUMNS.type,
  ALL_COLUMNS.name,
  ALL_COLUMNS.extension,
  ALL_COLUMNS.size,
  ALL_COLUMNS.programming_language,
  ALL_COLUMNS.mime_type,
  ALL_COLUMNS.file_type,
  ALL_COLUMNS.is_binary,
  ALL_COLUMNS.is_text,
  ALL_COLUMNS.is_archive,
  ALL_COLUMNS.is_media,
  ALL_COLUMNS.is_source,
  ALL_COLUMNS.is_script,
];

const COPYRIGHT_COLUMN_GROUP: ColDef[] = [
  ALL_COLUMNS.copyright_statements,
  ALL_COLUMNS.copyright_holders,
  ALL_COLUMNS.copyright_authors,
  ALL_COLUMNS.copyright_start_line,
  ALL_COLUMNS.copyright_end_line,
];


const LICENSE_COLUMN_GROUP: ColDef[] = [
  ALL_COLUMNS.detected_license_expression,
  ALL_COLUMNS.detected_license_expression_spdx,
  ALL_COLUMNS.percentage_of_license_text,
  ALL_COLUMNS.license_policy,
  ALL_COLUMNS.license_clues,
  ALL_COLUMNS.license_detections,
];

const ORIGIN_COLUMN_GROUP: ColDef[] = [
  ALL_COLUMNS.copyright_statements,
  ALL_COLUMNS.license_policy,
  ALL_COLUMNS.email,
  ALL_COLUMNS.url,
  ALL_COLUMNS.mime_type,
  ALL_COLUMNS.file_type,
  ALL_COLUMNS.programming_language,
];

const PACKAGE_COLUMN_GROUP: ColDef[] = [
  ALL_COLUMNS.package_data_type,
  ALL_COLUMNS.package_data_name,
  ALL_COLUMNS.package_data_version,
  ALL_COLUMNS.package_data_extracted_license_statement,
  ALL_COLUMNS.package_data_declared_license_expression,
  ALL_COLUMNS.package_data_declared_license_expression_spdx,
  ALL_COLUMNS.package_data_primary_language,
  ALL_COLUMNS.for_packages,
  // ALL_COLUMNS.package_data_homepage_url,
  // ALL_COLUMNS.package_data_download_url,
  ALL_COLUMNS.package_data_purl,
];



const DEFAULT_COLUMN_GROUP: ColDef[] = [
  ALL_COLUMNS.path,
  ...FILE_COLUMN_GROUP,
  ALL_COLUMNS.scan_error,
];


export const COLUMN_GROUPS = {
  DEFAULT: DEFAULT_COLUMN_GROUP,

  COPYRIGHT: COPYRIGHT_COLUMN_GROUP,
  FILE: FILE_COLUMN_GROUP,
  LICENSE: LICENSE_COLUMN_GROUP,
  ORIGIN: ORIGIN_COLUMN_GROUP,
  PACKAGE: PACKAGE_COLUMN_GROUP,

  ALL: Object.values(ALL_COLUMNS),

  NONE: [] as ColDef[],
}