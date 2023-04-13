import { QUERY_KEYS } from './../../constants/params';
import { ColDef, IFilterOptionDef, ValueFormatterParams } from "ag-grid-community";
import { ROUTES } from "../../constants/routes";

import {
  FileLicenseDetectionsRenderer,
  ListCellRenderer,
  MatchLicenseExpressionRenderer,
  UrlRenderer,
  UrlListCellRenderer,
} from './CustomCellRenderers';


enum CustomComponentKeys {
  UrlRenderer = 'UrlRenderer',
  ListCellRenderer = 'ListCellRenderer',
  UrlListCellRenderer = 'UrlListCellRenderer',
  LicenseExpressionRenderer = "LicenseExpressionRenderer",
  FileLicenseDetectionsRenderer = "FileLicenseDetectionsRenderer",
}

export const frameworkComponents = {
  [CustomComponentKeys.UrlRenderer]: UrlRenderer,
  [CustomComponentKeys.ListCellRenderer] : ListCellRenderer,
  [CustomComponentKeys.UrlListCellRenderer]: UrlListCellRenderer,
  [CustomComponentKeys.LicenseExpressionRenderer]: MatchLicenseExpressionRenderer,
  [CustomComponentKeys.FileLicenseDetectionsRenderer]: FileLicenseDetectionsRenderer,
};

export type ISimpleFilterModelType = 
  'empty' 
  | 'equals' 
  | 'notEqual' 
  | 'lessThan' 
  | 'lessThanOrEqual' 
  | 'greaterThan' 
  | 'greaterThanOrEqual' 
  | 'inRange' 
  | 'contains' 
  | 'notContains' 
  | 'startsWith' 
  | 'endsWith' 
  | 'blank' 
  | 'notBlank';

export interface FilterOptionsMap {
  LIST_FILTERS: (IFilterOptionDef | ISimpleFilterModelType)[],
}
export const FILTER_OPTIONS: FilterOptionsMap = {
  LIST_FILTERS: [
    'contains',
    'notContains',
  ],
}

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
  mime_type: ColDef,
  file_type: ColDef,
  programming_language: ColDef,
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

  detected_license_expression: ColDef,
  detected_license_expression_spdx: ColDef,
  percentage_of_license_text: ColDef,
  license_policy: ColDef,
  license_clues: ColDef,
  license_detections: ColDef,

  email: ColDef,
  url: ColDef,

  package_data_type: ColDef,
  package_data_name: ColDef,
  package_data_version: ColDef,
  package_data_extracted_license_statement: ColDef,
  package_data_declared_license_expression: ColDef,
  package_data_declared_license_expression_spdx: ColDef,
  package_data_primary_language: ColDef,
  for_packages: ColDef,
  // package_data_homepage_url: ColDef,
  // package_data_download_url: ColDef,
  package_data_purl: ColDef,

  scan_error: ColDef,
}

export const ALL_COLUMNS: COLUMNS_LIST = {
  path: {
    field: "path",
    headerName: "Path",
    width: 400,
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
  programming_language: {
    field: "programming_language",
    headerName: "Programming Language",
    width: 150,
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
    filterParams: {
      filterOptions: FILTER_OPTIONS.LIST_FILTERS
    },
    width: 450,
  },
  copyright_holders: {
    field: 'copyright_holders',
    headerName: 'Copyright Holder',
    width: 320,
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    filterParams: {
      filterOptions: FILTER_OPTIONS.LIST_FILTERS
    },
  },
  copyright_authors: {
    field: 'copyright_authors',
    headerName: 'Copyright Author',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    filterParams: {
      filterOptions: FILTER_OPTIONS.LIST_FILTERS
    },
    width: 320,
  },
  copyright_start_line: {
    field: 'copyright_start_line',
    headerName: 'Copyright Start Line',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    filterParams: {
      filterOptions: FILTER_OPTIONS.LIST_FILTERS
    },
    width: 125,
  },
  copyright_end_line: {
    field: 'copyright_end_line',
    headerName: 'Copyright End Line',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    filterParams: {
      filterOptions: FILTER_OPTIONS.LIST_FILTERS
    },
    width: 125,
  },


  detected_license_expression: {
    field: "detected_license_expression",
    headerName: "Detected License expression",
    width: 320,
  },
  detected_license_expression_spdx: {
    field: "detected_license_expression_spdx",
    headerName: "Detected License expression SPDX",
    width: 320,
  },
  percentage_of_license_text: {
    field: "percentage_of_license_text",
    headerName: "License text %",
    width: 120,
  },
  license_detections: {
    field: 'license_detections',
    cellRenderer: CustomComponentKeys.FileLicenseDetectionsRenderer,
  },
  license_policy: {
    field: 'license_policy',
    headerName: 'License Policy',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    filterParams: {
      filterOptions: FILTER_OPTIONS.LIST_FILTERS
    },
  },
  license_clues: {
    field: "license_clues",
    headerName: "License clues",
    width: 120,
    cellRenderer: CustomComponentKeys.UrlListCellRenderer,
    filterParams: {
      filterOptions: FILTER_OPTIONS.LIST_FILTERS
    },
  },


  email: {
    field: 'email',
    headerName: 'Email',
    cellRenderer: CustomComponentKeys.UrlListCellRenderer,
    filterParams: {
      filterOptions: FILTER_OPTIONS.LIST_FILTERS
    },
    width: 250,
    cellRendererParams: {
      urlPrefix:`mailto:`,
    }
  },
  url: {
    field: 'url',
    headerName: 'URL',
    cellRenderer: CustomComponentKeys.UrlListCellRenderer,
    filterParams: {
      filterOptions: FILTER_OPTIONS.LIST_FILTERS
    },
    width: 250,
  },


  package_data_type: {
    field: 'package_data_type',
    headerName: 'Package Type',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    filterParams: {
      filterOptions: FILTER_OPTIONS.LIST_FILTERS
    },
    width: 125,
  },
  package_data_name: {
    field: 'package_data_name',
    headerName: 'Package Data Name',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    filterParams: {
      filterOptions: FILTER_OPTIONS.LIST_FILTERS
    },
    width: 200,
  },
  package_data_version: {
    field: 'package_data_version',
    headerName: 'Package Data Version',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    filterParams: {
      filterOptions: FILTER_OPTIONS.LIST_FILTERS
    },
    width: 125,
  },
  package_data_extracted_license_statement: {
    field: 'package_data_extracted_license_statement',
    headerName: 'Package Data Extracted License Expression',
    wrapHeaderText: true,
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    filterParams: {
      filterOptions: FILTER_OPTIONS.LIST_FILTERS
    },
    width: 300,
  },
  package_data_declared_license_expression: {
    field: 'package_data_declared_license_expression',
    headerName: 'Package Data Declared License Expression',
    wrapHeaderText: true,
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    filterParams: {
      filterOptions: FILTER_OPTIONS.LIST_FILTERS
    },
    width: 300,
  },
  package_data_declared_license_expression_spdx: {
    field: 'package_data_declared_license_expression_spdx',
    headerName: 'Package Data Declared License Expression SPDX',
    wrapHeaderText: true,
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    filterParams: {
      filterOptions: FILTER_OPTIONS.LIST_FILTERS
    },
    width: 300,
  },
  package_data_primary_language: {
    field: 'package_data_primary_language',
    headerName: 'Package Primary Language',
    cellRenderer: CustomComponentKeys.ListCellRenderer,
    filterParams: {
      filterOptions: FILTER_OPTIONS.LIST_FILTERS
    },
    width: 150,
  },
  for_packages: {
    field: 'for_packages',
    headerName: 'For packages',
    cellRenderer: CustomComponentKeys.UrlListCellRenderer,
    filterParams: {
      filterOptions: FILTER_OPTIONS.LIST_FILTERS
    },
    cellRendererParams: {
      routerLink: true,
      urlPrefix:`/${ROUTES.PACKAGES}?${QUERY_KEYS.PACKAGE}=`,
    },
    width: 320,
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
    filterParams: {
      filterOptions: FILTER_OPTIONS.LIST_FILTERS
    },
    width: 300,
  },
  
  scan_error: {
    field: "scan_error",
    headerName: "Scan Error",
    filterParams: {
      filterOptions: FILTER_OPTIONS.LIST_FILTERS
    },
    width: 130,
  },
};
// Set Sorting order index
Object.values(ALL_COLUMNS).forEach((col, idx) => col.sortIndex = idx);