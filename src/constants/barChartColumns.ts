import { ColDef } from "ag-grid-community";
import { ALL_COLUMNS } from "../pages/TableView/columnDefs";

export const LOCATION_COLUMN: ColDef[] = [
  ALL_COLUMNS.path,
];

export const COPYRIGHT_COLUMNS: ColDef[] = [
  ALL_COLUMNS.copyright_statements,
  ALL_COLUMNS.copyright_holders,
  ALL_COLUMNS.copyright_authors,
];

export const LICENSE_COLUMNS: ColDef[] = [
  ALL_COLUMNS.detected_license_expression,
];

export const EMAIL_COLUMNS: ColDef[] = [
  ALL_COLUMNS.email,
];

export const URL_COLUMNS: ColDef[] = [
  ALL_COLUMNS.url
];

export const FILE_COLUMNS: ColDef[] = [
  ALL_COLUMNS.type,
  ALL_COLUMNS.extension,
  ALL_COLUMNS.file_type,
  ALL_COLUMNS.programming_language,
  ALL_COLUMNS.is_binary,
  ALL_COLUMNS.is_text,
  ALL_COLUMNS.is_archive,
  ALL_COLUMNS.is_media,
  ALL_COLUMNS.is_source,
  ALL_COLUMNS.is_script,
  
  // ALL_COLUMNS.scan_error,
];

export const PACKAGE_COLUMNS: ColDef[] = [
  ALL_COLUMNS.package_data_type,
  ALL_COLUMNS.package_data_name,
  ALL_COLUMNS.package_data_primary_language,
  ALL_COLUMNS.package_data_declared_license_expression,
  ALL_COLUMNS.package_data_declared_license_expression_spdx,
];

interface BAR_CHART_GROUP {
  label: string,
  key: string,
  cols: ColDef[],
}

export const BAR_CHART_COLUMN_GROUPS: {[key: string]: BAR_CHART_GROUP} = {
  Copyright: {
    label: "Copyright columns",
    key: 'copyright_columns',
    cols: COPYRIGHT_COLUMNS
  },
  License : {
    label: "License columns",
    key: 'license_columns',
    cols: LICENSE_COLUMNS
  },
  Email: {
    label: "Email columns",
    key: 'email_columns',
    cols: EMAIL_COLUMNS
  },
  Url: {
    label: "URL columns",
    key: 'url_columns',
    cols: URL_COLUMNS
  },
  File: {
    label: "File columns",
    key: 'file_columns',
    cols: FILE_COLUMNS
  },
  Package: {
    label: "Package columns",
    key: 'package_columns',
    cols: PACKAGE_COLUMNS
  },
}