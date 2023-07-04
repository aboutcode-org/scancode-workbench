import React from "react";
import { ColDef } from "ag-grid-community";
import {
  DetectionOriginRenderer,
  FileRegionPathRenderer,
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
    cellRenderer: FileRegionPathRenderer,
  },
  // {
  //   headerName: 'Start line',
  //   field: 'start_line',
  //   width: MINI_FIELD_WIDTH,
  // },
  // {
  //   headerName: 'End line',
  //   field: 'end_line',
  //   width: MINI_FIELD_WIDTH,
  // },
  {
    headerName: "Lines",
    field: "start_line",
    cellRenderer: RegionLinesRenderer,
    maxWidth: 85,
  },
  {
    headerName: "Detection origin",
    field: "from_package",
    cellRenderer: DetectionOriginRenderer,
    // tooltipComponent: (props: { value: boolean }) => {
    //   console.log(props);
    //   return (
    //     <div>
    //       {props.value ? "Structured package manifest" : "Plain file"}
    //     </div>
    //   );
    // },
    maxWidth: 95,
    suppressMenu: true,
  },
];
