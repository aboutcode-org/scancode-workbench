import { ColDef, ValueFormatterParams } from "ag-grid-community";

import {
  ListCellRenderer,
  UrlListCellRenderer,
  EmailListCellRenderer,
} from './CustomCellComponents';


enum CustomComponentKeys {
  ListCellRenderer = 'ListCellRenderer',
  UrlListCellRenderer = 'UrlListCellRenderer',
  EmailListCellRenderer = 'EmailListCellRenderer',
}

export const frameworkComponents = {
  [CustomComponentKeys.ListCellRenderer] : ListCellRenderer,
  [CustomComponentKeys.UrlListCellRenderer]: UrlListCellRenderer,
  [CustomComponentKeys.EmailListCellRenderer]: EmailListCellRenderer,
};

const BooleanValueFormatter = (cell: ValueFormatterParams) => cell.value ? "Yes" : "No";


interface COLUMNS_LIST {
  // Required to update select options by field string
  [key: string]: ColDef,

  // Rest for IDE intellisense in column groups

  path: ColDef,
  type: ColDef,
  name: ColDef,
  extension: ColDef,
  size: ColDef,
  programming_language: ColDef,
  mime_type: ColDef,
  file_type: ColDef,
  is_binary: ColDef,
  is_text: ColDef,
  is_archive: ColDef,
  is_media: ColDef,
  is_source: ColDef,
  is_script: ColDef,
  
  copyright_statements: ColDef,
  copyright_holders: ColDef,
  copyright_authors: ColDef,
  copyright_start_line: ColDef,
  copyright_end_line: ColDef,

  license_policy: ColDef,
  license_expressions: ColDef,
  license_key: ColDef,
  license_score: ColDef,
  license_short_name: ColDef,
  license_category: ColDef,
  license_owner: ColDef,
  // license_homepage_url: ColDef,
  // license_text_url: ColDef,
  // license_reference_url: ColDef,
  license_spdx_key: ColDef,
  license_start_line: ColDef,
  license_end_line: ColDef,

  email: ColDef,
  url: ColDef,

  package_data_type: ColDef,
  package_data_name: ColDef,
  package_data_version: ColDef,
  package_data_license_expression: ColDef,
  package_data_primary_language: ColDef,
  // package_data_homepage_url: ColDef,
  // package_data_download_url: ColDef,
  package_data_purl: ColDef,

  scan_error: ColDef,
}

export const ALL_COLUMNS: COLUMNS_LIST = {
  path: {
    field: "path",
    headerName: "Path",
    width: 500,
  },
  type: {
    field: "type",
    headerName: "Type",
    width: 120,
  },
  name: {
    field: "name",
    headerName: "Name",
    width: 250,
  },
  extension: {
    field: "extension",
    headerName: "File extension",
    width: 150,
  },
  size: {
    field: "size",
    headerName: "File Size",
    width: 110,
  },
  programming_language: {
    field: "programming_language",
    headerName: "Programming Language",
    width: 150,
  },
  mime_type: {
    field: "mime_type",
    headerName: "Mime Type",
    width: 170,
  },
  file_type: {
    field: "file_type",
    headerName: "File Type",
    width: 200,
  },
  is_binary: {
    field: 'is_binary',
    headerName: 'Binary File',
    valueFormatter: BooleanValueFormatter,
    width: 100,
  },
  is_text: {
    field: 'is_text',
    headerName: 'Text File',
    valueFormatter: BooleanValueFormatter,
    width: 100,
  },
  is_archive: {
    field: 'is_archive',
    headerName: 'Archive File',
    valueFormatter: BooleanValueFormatter,
    width: 100,
  },
  is_media: {
    field: 'is_media',
    headerName: 'Media File',
    valueFormatter: BooleanValueFormatter,
    width: 100,
  },
  is_source: {
    field: 'is_source',
    headerName: 'Source File',
    valueFormatter: BooleanValueFormatter,
    width: 100,
  },
  is_script: {
    field: 'is_script',
    headerName: 'Script File',
    valueFormatter: BooleanValueFormatter,
    width: 100,
  },

  copyright_statements: {
    field: 'copyright_statements',
    headerName: 'Copyright Statements',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    width: 450,
  },
  copyright_holders: {
    field: 'copyright_holders',
    headerName: 'Copyright Holder',
    width: 320,
    cellRenderer: CustomComponentKeys.ListCellRenderer,
  },
  copyright_authors: {
    field: 'copyright_authors',
    headerName: 'Copyright Author',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    width: 320,
  },
  copyright_start_line: {
    field: 'copyright_start_line',
    headerName: 'Copyright Start Line',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    width: 125,
  },
  copyright_end_line: {
    field: 'copyright_end_line',
    headerName: 'Copyright End Line',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    width: 125,
  },


  license_policy: {
    field: 'license_policy',
    headerName: 'License Policy',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
  },
  license_expressions: {
    field: 'license_expressions',
    headerName: 'License Expression',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    width: 320,
  },
  license_key: {
    field: 'license_key',
    headerName: 'License Key',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    width: 320,
  },
  license_score: {
    field: 'license_score',
    headerName: 'License Score',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    width: 150,
  },
  license_short_name: {
    field: 'license_short_name',
    headerName: 'License Short Name',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    width: 240,
  },
  license_category: {
    field: 'license_category',
    headerName: 'License Category',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    width: 225,
  },
  license_owner: {
    field: 'license_owner',
    headerName: 'License Owner',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    width: 290,
  },
  // license_homepage_url: {
  //   field: 'license_homepage_url',
  //   headerName: 'License Homepage URL',
  // },
  // license_text_url: {
  //   field: 'license_text_url',
  //   headerName: 'License Text URL',
  // },
  // license_reference_url: {
  //   field: 'license_reference_url',
  //   headerName: 'License Reference URL',
  // },
  license_spdx_key: {
    field: 'license_spdx_key',
    headerName: 'SPDX License Key',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    width: 200,
  },
  license_start_line: {
    field: 'license_start_line',
    headerName: 'License Start Line',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    width: 125,
  },
  license_end_line: {
    field: 'license_end_line',
    headerName: 'License End Line',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    width: 125,
  },


  email: {
    field: 'email',
    headerName: 'Email',
    cellRenderer: CustomComponentKeys.EmailListCellRenderer,
    width: 250,
  },
  url: {
    field: 'url',
    headerName: 'URL',
    cellRenderer: CustomComponentKeys.UrlListCellRenderer,
    width: 250,
  },


  package_data_type: {
    field: 'package_data_type',
    headerName: 'Package Type',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    width: 125,
  },
  package_data_name: {
    field: 'package_data_name',
    headerName: 'Package Name',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    width: 200,
  },
  package_data_version: {
    field: 'package_data_version',
    headerName: 'Package Version',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    width: 125,
  },
  package_data_license_expression: {
    field: 'package_data_license_expression',
    headerName: 'Package License Expression',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    width: 300,
  },
  package_data_primary_language: {
    field: 'package_data_primary_language',
    headerName: 'Package Primary Language',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    width: 150,
  },
  // package_data_homepage_url: {
  //   field: 'package_data_homepage_url',
  //   headerName: 'Package Homepage URL',
  // },
  // package_data_download_url: {
  //   field: 'package_data_download_url',
  //   headerName: 'Package Download URL',
  // },
  package_data_purl: {
    field: 'package_data_purl',
    headerName: 'Package URL',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    width: 300,
  },
  
  scan_error: {
    field: "scan_error",
    headerName: "Scan Error",
    width: 130,
  },
};
// Set Sorting order index
Object.values(ALL_COLUMNS).forEach((col, idx) => col.sortIndex = idx);