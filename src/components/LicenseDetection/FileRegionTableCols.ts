import { ColDef } from "ag-grid-community";

const MINI_FIELD_WIDTH = 90;

export const DEFAULT_FILE_REGION_COL_DEF: ColDef = {
  sortable: true,
  resizable: true,
  filter: true,
  wrapText: true,
  autoHeight: true,
  wrapHeaderText: true,
  flex: 1,
  cellStyle: { "whiteSpace": "normal" },
}

export const DetectionFileRegionCols: ColDef[] = [
  {
    headerName: 'Path',
    field: 'path',
    width: 270,
  },
  {
    headerName: 'Start line',
    field: 'start_line',
    width: MINI_FIELD_WIDTH,
  },
  {
    headerName: 'End line',
    field: 'end_line',
    width: MINI_FIELD_WIDTH,
  },
]