import { ColDef, ColumnApi, ColumnState } from "ag-grid-community";
import React, { createContext, useContext, useEffect, useState } from "react";

import { COL_DEF_STATE } from "../constants/keys";
import { ALL_COLUMNS_MAP } from "../pages/TableView/columnDefs";
import { COLUMN_GROUPS } from "../pages/TableView/columnGroups";

interface CachedState {
  columnState: ColumnState[];
}

interface WorkbenchStateContextProperties {
  columnDefs: ColDef[];
  columnState: ColumnState[];
  setColumnDefs: React.Dispatch<React.SetStateAction<ColDef[]>>;
  updateColDefs: (newColDefs: ColDef[]) => void;
  updateColState: (columnApi: ColumnApi, columnOrderChanged: boolean) => void;
}

export const defaultWorkbenchStateContextValue: WorkbenchStateContextProperties =
  {
    columnDefs: [],
    columnState: [],
    updateColState: () => null,
    updateColDefs: () => null,
    setColumnDefs: () => null,
  };

const WorkbenchStateContext = createContext<WorkbenchStateContextProperties>(
  defaultWorkbenchStateContextValue
);

export const WorkbenchStateProvider = (
  props: React.PropsWithChildren<Record<string, unknown>>
) => {
  const [columnDefs, setColumnDefs] = useState<ColDef[]>(COLUMN_GROUPS.DEFAULT);
  const [columnState, setColumnState] = useState<ColumnState[]>([]);

  function getColumnDefsFromState(colState: ColumnState[]): ColDef[] {
    return colState.map((col) => {
      const colDef = ALL_COLUMNS_MAP.get(col.colId);
      colDef.width = col.width || colDef.initialWidth;
      return colDef;
    });
  }

  const updateColDefs = (newColDefs: ColDef[]) => {
    setColumnDefs(newColDefs);
  };

  const updateColState = (
    columnApi: ColumnApi,
    columnOrderChanged: boolean
  ) => {
    const newColumnState = columnApi.getColumnState();

    // console.log("Update state request ---");

    // Need to perform this in all cases, for width to be updated
    const newColumnDefs = getColumnDefsFromState(newColumnState);

    if (columnOrderChanged) {
      // No need to update state, column def is modified above for future reference
      setColumnDefs(newColumnDefs);
    }
    setColumnState(newColumnState);
    saveColumnStatustoLocalStorage(newColumnState);
  };

  function saveColumnStatustoLocalStorage(newColumnState: ColumnState[]) {
    if (!newColumnState || !newColumnState.length) return;
    // console.log("Save columnstatus to localstorage", newColumnState);
    const newCachedState: CachedState = {
      columnState: newColumnState,
    };
    localStorage.setItem(COL_DEF_STATE, JSON.stringify(newCachedState));
  }

  function reviveSavedColState() {
    try {
      const newCachedState: CachedState = JSON.parse(
        localStorage.getItem(COL_DEF_STATE)
      );
      if (newCachedState && Array.isArray(newCachedState?.columnState)) {
        // console.log("Revive saved state:", newCachedState);
        setColumnDefs(getColumnDefsFromState(newCachedState.columnState));
        setColumnState(newCachedState.columnState);
      }
    } catch (err) {
      console.log("No Saved state available");
    }
  }

  useEffect(() => {
    reviveSavedColState();
  }, []);

  return (
    <WorkbenchStateContext.Provider
      value={{
        columnDefs,
        columnState,
        updateColDefs,
        updateColState,
        setColumnDefs,
      }}
    >
      {props.children}
    </WorkbenchStateContext.Provider>
  );
};

export const useWorkbenchState = () => useContext(WorkbenchStateContext);
