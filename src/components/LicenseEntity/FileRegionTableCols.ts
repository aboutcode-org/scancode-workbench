import { ColDef } from "ag-grid-community";
import {
  DetectionOriginRenderer,
  FilePathRenderer,
  RegionLinesRenderer,
} from "../../pages/TableView/CustomCellRenderers";

export const DEFAULT_FILE_REGION_COL_DEF: ColDef = {
  sortable: true,
  resizable: true,
  filter: true,
  wrapText: true,
  autoHeight: true,
  wrapHeaderText: true,
  flex: 1,
  cellStyle: { whiteSpace: "normal" },
};

export const DetectionFileRegionCols: ColDef[] = [
  {
    headerName: "Path",
    field: "path",
    minWidth: 300,
    cellRenderer: FilePathRenderer,
  },
  {
    headerName: "Lines",
    cellRenderer: RegionLinesRenderer,
    maxWidth: 85,
  },
  {
    headerName: "Detection origin",
    field: "from_package",
    cellRenderer: DetectionOriginRenderer,
    maxWidth: 100,
    suppressMenu: true,
  },
];
