import { ColDef } from "ag-grid-community";
import {
  MatchLicenseExpressionRenderer,
  UrlRenderer,
} from "../../pages/TableView/CustomCellRenderers";
import MatchedTextRenderer from "../../pages/TableView/CustomCellRenderers/Licenses/MatchedTextRenderer";

export const DEFAULT_MATCHES_COL_DEF: ColDef = {
  sortable: true,
  resizable: true,
  filter: true,
  wrapText: true,
  autoHeight: true,
  wrapHeaderText: true,
};

const MINI_FIELD_WIDTH = 90;
interface MatchColumns {
  license_expression: ColDef;
  score: ColDef;
  matched_length: ColDef;
  match_coverage: ColDef;
  matcher: ColDef;
  matched_text: ColDef;
  rule_url: ColDef;
  license_expression_spdx: ColDef;
}
export const MATCH_COLS: MatchColumns = {
  license_expression: {
    colId: "license_expression",
    field: "license_expression",
    headerName: "License expression",
    cellRenderer: MatchLicenseExpressionRenderer,
    width: 270,
  },
  score: {
    colId: "score",
    field: "score",
    headerName: "Score",
    width: MINI_FIELD_WIDTH,
  },
  matched_length: {
    colId: "matched_length",
    field: "matched_length",
    headerName: "Matched length",
    wrapHeaderText: true,
    width: 108,
  },
  match_coverage: {
    colId: "match_coverage",
    field: "match_coverage",
    headerName: "Match Coverage",
    wrapHeaderText: true,
    width: 115,
  },
  matcher: {
    colId: "matcher",
    field: "matcher",
    headerName: "Matcher",
    width: 125,
  },
  matched_text: {
    colId: "matched_text",
    field: "matched_text",
    headerName: "Matched Text",
    cellRenderer: MatchedTextRenderer,
    width: 300,
  },
  rule_url: {
    colId: "rule_url",
    field: "rule_url",
    headerName: "Rule",
    cellRenderer: UrlRenderer,
    cellRendererParams: {
      customTextField: "rule_identifier",
    },
    width: 250,
  },
  license_expression_spdx: {
    colId: "license_expression_spdx",
    field: "license_expression_spdx",
    headerName: "SPDX License expression",
    cellRenderer: MatchLicenseExpressionRenderer,
    cellRendererParams: {
      spdxLicense: true,
    },
    width: 250,
  },
};
export const LicenseDetectionMatchCols: ColDef[] = [
  MATCH_COLS.license_expression,
  MATCH_COLS.score,
  MATCH_COLS.matched_text,
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
  MATCH_COLS.matched_text,
  MATCH_COLS.rule_url,
];
