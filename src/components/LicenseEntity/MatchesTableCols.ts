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
interface MatchColumns {
  license_expression: ColDef;
  score: ColDef;
  matched_length: ColDef;
  match_coverage: ColDef;
  matcher: ColDef;
  rule_url: ColDef;
  license_expression_spdx: ColDef;
}
const MATCH_COLS: MatchColumns = {
  license_expression: {
    headerName: 'License expression',
    field: 'license_expression',
    cellRenderer: MatchLicenseExpressionRenderer,
    width: 270,
  },
  score: {
    headerName: 'Score',
    field: 'score',
    width: MINI_FIELD_WIDTH,
  },
  matched_length: {
    headerName: 'Matched length',
    wrapHeaderText: true,
    field: 'matched_length',
    width: 110,
  },
  match_coverage: {
    headerName: 'Match Coverage',
    wrapHeaderText: true,
    field: 'match_coverage',
    width: 120,
  },
  matcher: {
    headerName: 'Matcher',
    field: 'matcher',
    width: 120
  },
  rule_url: {
    headerName: 'Rule',
    field: 'rule_url',
    cellRenderer: UrlRenderer,
    cellRendererParams: {
      customTextField: 'rule_identifier'
    },
    width: 250,
  },
  license_expression_spdx: {
    headerName: 'SPDX License expression',
    field: 'license_expression_spdx',
    cellRenderer: MatchLicenseExpressionRenderer,
    cellRendererParams: {
      spdxLicense: true,
    },
    width: 250,
  },
}
export const LicenseDetectionMatchCols: ColDef[] = [
  MATCH_COLS.license_expression,
  MATCH_COLS.score,
  MATCH_COLS.matched_length,
  MATCH_COLS.match_coverage,
  MATCH_COLS.matcher,
  MATCH_COLS.rule_url,
  MATCH_COLS.license_expression_spdx,
];

export const LicenseClueMatchCols: ColDef[] = [
  MATCH_COLS.license_expression,
  MATCH_COLS.score,
  MATCH_COLS.matched_length,
  MATCH_COLS.match_coverage,
  MATCH_COLS.matcher,
  MATCH_COLS.rule_url,
]