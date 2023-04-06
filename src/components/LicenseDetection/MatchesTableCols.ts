import { ColDef } from "ag-grid-community";
import { MatchLicenseExpressionRenderer, UrlRenderer } from "../../pages/TableView/CustomCellRenderers";

export const DEFAULT_MATCHES_COL_DEF: ColDef = {
  sortable: true,
  resizable: true,
  filter: true,
  wrapText: true,
  autoHeight: true,
  wrapHeaderText: true,
}

const MINI_FIELD_WIDTH = 90;
export const DetectionMatchesCols: ColDef[] = [
  {
    headerName: 'License expression',
    field: 'license_expression',
    cellRenderer: MatchLicenseExpressionRenderer,
    width: 270,
  },
  {
    headerName: 'SPDX License expression',
    field: 'license_expression_spdx',
    cellRenderer: MatchLicenseExpressionRenderer,
    cellRendererParams: {
      spdxLicense: true,
    },
    width: 270,
  },
  {
    headerName: 'Score',
    field: 'score',
    width: MINI_FIELD_WIDTH,
  },

  // Separate table
  // {
  //   headerName: 'Start line',
  //   wrapHeaderText: true,
  //   field: 'start_line',
  //   width: MINI_FIELD_WIDTH,
  // },
  // {
  //   headerName: 'End line',
  //   wrapHeaderText: true,
  //   field: 'end_line',
  //   width: MINI_FIELD_WIDTH,
  // },
  {
    headerName: 'Matched length',
    wrapHeaderText: true,
    field: 'matched_length',
    width: 110,
  },
  {
    headerName: 'Match Coverage',
    wrapHeaderText: true,
    field: 'match_coverage',
    width: 120,
  },
  {
    headerName: 'Matcher',
    field: 'matcher',
    width: 120
  },
  // {
  //   headerName: 'License Expression',
  //   field: 'license_expression',
  // },

  {
    headerName: 'Rule',
    field: 'rule_url',
    cellRenderer: UrlRenderer,
    cellRendererParams: {
      customTextField: 'rule_identifier'
    },
    width: 270,
  },
  // {
  //   headerName: 'LDB URL',
  //   field: 'licensedb_url',
  //   cellRenderer: UrlListCellRenderer,
  //   cellRendererParams: {
  //     customDisplayTextField: 'license_key',
  //     // , 'licensedb_url', 'scancode_url'),
  //   },
  //   width: 270,
  // },
  // {
  //   headerName: 'SC URL',
  //   field: 'scancode_url',
  //   cellRenderer: UrlListCellRenderer,
  //   cellRendererParams: {
  //     customDisplayTextField: 'license_key',
  //   },
  //   width: 270,
  // },
  // {
  //   headerName: 'SPDX URL',
  //   field: 'spdx_url',
  //   cellRenderer: UrlListCellRenderer,
  //   cellRendererParams: {
  //     customDisplayTextField: 'spdx_license_key',
  //   },
  //   width: 270,
  // },
];
