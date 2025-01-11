import { ColDef } from "ag-grid-community";
import {
  FilePathRenderer,
  TickRenderer,
} from "../../pages/TableView/CustomCellRenderers";
import { DependencyDetails } from "../../pages/Packages/packageDefinitions";

export const DEFAULT_DEPENDENCIES_COL_DEF: ColDef = {
  sortable: true,
  resizable: true,
  filter: true,
  wrapText: true,
  autoHeight: true,
  wrapHeaderText: true,
  suppressMenu: true,
};

interface DepsColDef extends ColDef {
  field: keyof DependencyDetails;
}

export const DependenciesTableCols: DepsColDef[] = [
  {
    headerName: "Purl",
    field: "purl",
    width: 300,
    suppressMenu: false,
  },
  {
    headerName: "Scope",
    field: "scope",
    width: 160,
  },
  {
    headerName: "Pinned",
    field: "is_pinned",
    cellRenderer: TickRenderer,
    maxWidth: 92,
  },
  {
    headerName: "Runtime",
    field: "is_runtime",
    cellRenderer: TickRenderer,
    maxWidth: 92,
  },
  {
    headerName: "Optional",
    field: "is_optional",
    cellRenderer: TickRenderer,
    maxWidth: 92,
  },
  {
    headerName: "Data source ID",
    field: "datasource_id",
    width: 165,
  },
  {
    headerName: "Data file",
    field: "datafile_path",
    cellRenderer: FilePathRenderer,
    width: 400,
  },
  {
    headerName: "Extracted requirement",
    field: "extracted_requirement",
    width: 130,
  },
];
