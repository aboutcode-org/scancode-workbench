import React, { useEffect } from "react";
import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import { ColDef, GridApi } from "ag-grid-community";

import { frameworkComponents } from "./columnDefs";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// Config for Ag DataTable
const defaultColDef: ColDef = {
  sortable: true,
  resizable: true,
  filter: true,
  wrapText: true,
  autoHeight: true,
  wrapHeaderText: true,
};
const paginationOptions = [25, 50, 100, 200];
const defaultPaginationOption = paginationOptions[0];

interface AgDataTableProps extends AgGridReactProps {
  tableData: unknown[];
  columnDefs: ColDef[];
  gridApi: GridApi | null;
}

const AgDataTable = (props: AgDataTableProps) => {
  const { tableData, columnDefs, gridApi } = props;

  const changePaginationSize = (newValue: string | number) => {
    if (gridApi) {
      gridApi.paginationSetPageSize(Number(newValue));
    }
  };

  useEffect(() => {
    if (gridApi) {
      gridApi.setFilterModel(null);

      // Setting column defs manually to lazily update columns
      gridApi.setColumnDefs(columnDefs);
    }
  }, [columnDefs]);

  return (
    <div
      style={{
        height: "calc(90vh - 50px)",
        width: "100%",
      }}
    >
      <AgGridReact
        rowData={tableData}
        components={frameworkComponents}
        className="ag-theme-alpine ag-grid-customClass"
        ensureDomOrder
        enableCellTextSelection
        pagination={true}
        defaultColDef={defaultColDef}
        paginationPageSize={defaultPaginationOption}
        // Performance options
        rowBuffer={200}
        animateRows={false}
        suppressColumnMoveAnimation
        suppressRowVirtualisation
        suppressColumnVirtualisation
        {...props}
      />

      <div className="pagination-controls">
        Page Size:
        <select
          defaultValue={defaultPaginationOption}
          onChange={(e) => changePaginationSize(e.target.value)}
        >
          {paginationOptions.map((optionValue) => (
            <option value={optionValue} key={optionValue}>
              {optionValue}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AgDataTable;
