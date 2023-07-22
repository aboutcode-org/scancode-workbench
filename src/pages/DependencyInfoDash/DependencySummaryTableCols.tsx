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
    headerName: "Dependencies per Package type ",
    field: "packageTypeDetails",
    comparator: (
      valueA: { title: string; total: number },
      valueB: { title: string; total: number }
    ) => valueA.total - valueB.total,
    cellRenderer: (props: { value: { title: string; total: number } }) =>
      `${props.value.title} - ${props.value.total}`,
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
