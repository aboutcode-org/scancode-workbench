import { ColDef } from "ag-grid-community";

export const DEFAULT_DEPS_SUMMARY_COL_DEF: ColDef = {
  sortable: true,
  resizable: true,
  filter: true,
  wrapText: true,
  autoHeight: true,
  wrapHeaderText: true,
};

export interface PackageTypeSummaryRow {
  packageTypeDetails: {
    title: string;
    total: number;
  };
  resolved: number;
  runtime: number;
  optional: number;
}

interface DepsSummaryCOlDef extends ColDef {
  field: keyof PackageTypeSummaryRow;
}

export const DependencySummaryTableCols: DepsSummaryCOlDef[] = [
  {
    headerName: "Package type",
    field: "packageTypeDetails",
    comparator: (valueA: { title: string }, valueB: { title: string }) =>
      valueA.title.localeCompare(valueB.title),
    cellRenderer: (props: { value: { title: string } }) => props.value.title,
  },
  {
    headerName: "Total dependencies",
    field: "packageTypeDetails",
    comparator: (valueA: { total: number }, valueB: { total: number }) =>
      valueA.total - valueB.total,
    cellRenderer: (props: { value: { total: number } }) => props.value.total,
  },
  {
    headerName: "Runtime",
    field: "runtime",
  },
  {
    headerName: "Optional",
    field: "optional",
  },
  {
    headerName: "Resolved",
    field: "resolved",
  },
];
