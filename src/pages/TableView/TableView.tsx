import { Op } from "sequelize";
import React, { useEffect, useState } from "react";
import { ColDef, ColumnApi, GridApi, GridReadyEvent } from "ag-grid-community";

import {
  DB_QUERY_WORKER_REQUEST_MESSAGE,
  MESSAGE_KEY,
  TABLEVIEW_WORKER_REQUEST_MESSAGE,
  TABLEVIEW_WORKER_RESPONSE_MESSAGE,
} from "./TableView.worker";
import AgDataTable from "./AgDataTable";
import CoreButton from "../../components/CoreButton/CoreButton";
import CustomFilterComponent from "./CustomFilterComponent";

import { ALL_COLUMNS, ALL_COLUMNS_MAP } from "./columnDefs";
import {
  COLUMN_GROUPS,
  DEFAULT_EMPTY_VALUES,
  SET_FILTERED_COLUMNS,
} from "./columnGroups";

import { calculateCellWidth } from "../../utils/cells";
import { FlatFileAttributes } from "../../services/models/flatFile";
import { useWorkbenchDB } from "../../contexts/dbContext";

import CustomColumnSelector from "./CustomColumnSelector";
import { FormControl } from "react-bootstrap";
import { useWorkbenchState } from "../../contexts/stateContext";

import "./TableView.css";

const TableView = () => {
  const { db, initialized, currentPath, startProcessing, endProcessing } =
    useWorkbenchDB();
  const { columnDefs, columnState, setColumnDefs, updateColState } =
    useWorkbenchState();

  // Necessary to keep coldef as empty array by default, to ensure filter set updates
  const [tableData, setTableData] = useState<unknown[]>([]);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [columnApi, setColumnApi] = useState<ColumnApi | null>(null);

  const [searchText, setSearchText] = useState("");
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  // Destructuring column groups to create a new array object (with same cols), ensuring state updates
  const setDefaultColumnGroup = () => setColumnDefs([...COLUMN_GROUPS.DEFAULT]);
  function changeColumnGroup(newGroup: ColDef[]) {
    setColumnDefs([ALL_COLUMNS.path, ...newGroup]);
  }

  function searchTable(e: React.FormEvent<HTMLInputElement>) {
    if (gridApi) {
      gridApi.setQuickFilter((e.target as HTMLInputElement).value);
    }
  }
  function resetAllTableFilters() {
    if (gridApi) {
      gridApi.setFilterModel(null);
      gridApi.setQuickFilter("");
      setSearchText("");
    }
  }

  const worker = React.useMemo(
    () =>
      new Worker(new URL("./TableView.worker.ts", import.meta.url), {
        type: "module",
      }),
    []
  );
  useEffect(() => {
    worker.addEventListener("message", async (event) => {
      const message: TABLEVIEW_WORKER_RESPONSE_MESSAGE = event.data;
      if (message.key === MESSAGE_KEY.DONE && message.result) {
        const { files, longestPathLength, uniqueColumnFilterValues } =
          message.result;
        console.log("Parsing Completed with response", {
          files,
          longestPathLength,
          uniqueColumnFilterValues,
        });

        // Table data
        setTableData(files);

        // Shrink path column, if user has over-extended it earlier (maybe for other scan with large paths)
        // const calculatedColumnWidth = calculateCellWidth(longestPathLength);
        // if (calculatedColumnWidth < ALL_COLUMNS.path.width)
        //   ALL_COLUMNS.path.width = calculatedColumnWidth;

        // // Update filter options in columnDefs
        // uniqueColumnFilterValues.forEach(({ key, values }) => {
        //   const columnDef = ALL_COLUMNS_MAP.get(key);
        //   if (!columnDef) return;

        //   columnDef.floatingFilter = true;
        //   if (!columnDef.filterParams) columnDef.filterParams = {};
        //   columnDef.filterParams.options = values;
        //   columnDef.floatingFilterComponent = CustomFilterComponent;
        // });

        // // Recreate an array of coldefs for react state update
        // setColumnDefs((prevColDefs) => {
        //   if (prevColDefs.length) return [...prevColDefs];
        //   return [...COLUMN_GROUPS.DEFAULT];
        // });

        endProcessing();
      }
    });

    // Clean up the Web Worker when the component is unmounted
    return () => worker.terminate();
  }, [worker]);

  useEffect(() => {
    if (!initialized || !db || !currentPath) return;

    startProcessing();

    // Update table data whenever new db is loaded or path is changed
    // const DataProcessorPromise = db.sync
    //   .then((db) =>
    //     db.FlatFile.findAll({
    //       where: {
    //         path: {
    //           [Op.or]: [
    //             { [Op.like]: `${currentPath}` }, // Matches a file / directory.
    //             { [Op.like]: `${currentPath}/%` }, // Matches all its children (if any).
    //           ],
    //         },
    //       },
    //       // raw: true,   // TOIMPROVE: Maybe we can get better performance with this
    //     })
    //   )
    //   .then((files) => {
    //     console.log("Normal files", files);
    //     setTableData(files);
    //     let longestPathLength = 20;
    //     files.forEach((file) => {
    //       const len = file.getDataValue("path").length;
    //       if (len > longestPathLength) {
    //         longestPathLength = len;
    //       }
    //     });

    //     const calculatedColumnWidth = calculateCellWidth(longestPathLength);

    //     // Shrink path column, if user has over-extended it earlier (maybe for other scan with large paths)
    //     if (calculatedColumnWidth < ALL_COLUMNS.path.width)
    //       ALL_COLUMNS.path.width = calculatedColumnWidth;

    //     setColumnDefs((prevColDefs) => {
    //       if (prevColDefs.length > 0) return prevColDefs; // Don't mutate cols, if already set
    //       return [...COLUMN_GROUPS.DEFAULT];
    //     });
    //   });

    // Update set filters whenever new db is loaded or path is changed
    // const FilterProcessorPromise = db.sync.then((db) => {
    //   const filterPromises: Promise<ColDef>[] = [];

    //   Object.values(ALL_COLUMNS).forEach((columnDef) => {
    //     const columnKey = columnDef.field || "";

    //     // Prepare filters only for eligible columns
    //     if (!SET_FILTERED_COLUMNS.has(columnKey)) return;

    //     // Aggregator
    //     const filterPromise = db.FlatFile.aggregate(
    //       columnKey as keyof FlatFileAttributes,
    //       "DISTINCT",
    //       {
    //         plain: false,
    //         where: {
    //           path: {
    //             [Op.or]: [
    //               { [Op.like]: `${currentPath}` }, // Matches a file / directory.
    //               { [Op.like]: `${currentPath}/%` }, // Matches all its children (if any).
    //             ],
    //           },
    //         },
    //       }
    //     ).then((uniqueValues: { DISTINCT: string }[]) => {
    //       const parsedUniqueValues = uniqueValues.map((val) => val.DISTINCT);
    //       if (!parsedUniqueValues[0]) parsedUniqueValues[0] = "";

    //       if (!DEFAULT_EMPTY_VALUES.has(parsedUniqueValues[0]))
    //         parsedUniqueValues.unshift("");

    //       // console.log(
    //       //   `Unique values aggregated for col - ${columnKey}:`,
    //       //   // uniqueValues,
    //       //   // parsedUniqueValues,
    //       //   parsedUniqueValues.length,
    //       // );

    //       columnDef.floatingFilter = true;
    //       if (!columnDef.filterParams) columnDef.filterParams = {};
    //       columnDef.filterParams.options = parsedUniqueValues;
    //       columnDef.floatingFilterComponent = CustomFilterComponent;

    //       return columnDef;
    //     });
    //     filterPromises.push(filterPromise);
    //   });

    //   return Promise.all(filterPromises).then(() => {
    //     // console.log(
    //     //   "Generated unique set filters:",
    //     //   columnDefs.map(coldef => coldef.filterParams)
    //     // );
    //     setColumnDefs((prevColDefs) => {
    //       if (prevColDefs.length) return [...prevColDefs];
    //       return [...COLUMN_GROUPS.DEFAULT];
    //     });
    //   });
    // });

    // Promise.all([DataProcessorPromise, FilterProcessorPromise]).then(
    //   endProcessing
    // );

    // Worker implementation
    const parserRequestMessage: TABLEVIEW_WORKER_REQUEST_MESSAGE = {
      key: MESSAGE_KEY.PARSE,
      dbStorage: db.config.dbStorage,
      currentPath,
      columnKeys: Object.values(ALL_COLUMNS).map((col) => col.field),
      DEFAULT_EMPTY_VALUES: Array.from(DEFAULT_EMPTY_VALUES),
      SET_FILTERED_COLUMNS: Array.from(SET_FILTERED_COLUMNS),
    };

    worker.postMessage(parserRequestMessage);
  }, [db, currentPath]);

  useEffect(() => {
    if (gridApi) {
      gridApi.refreshHeader();
    }
  }, [columnDefs]);

  function onGridReady(params: GridReadyEvent) {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
    params.columnApi.applyColumnState({ applyOrder: true, state: columnState });
  }

  // console.log("Shown files", tableData, columnDefs);

  return (
    <div style={{ height: "100%", minHeight: "90vh" }}>
      <div className="filterButtons">
        <section>
          <CoreButton small onClick={setDefaultColumnGroup}>
            Default columns
          </CoreButton>
          <CoreButton
            small
            onClick={() => setColumnDefs(COLUMN_GROUPS.ALL)}
          >
            Show all
          </CoreButton>
          <CoreButton
            small
            onClick={() => changeColumnGroup(COLUMN_GROUPS.NONE)}
          >
            Hide all
          </CoreButton>
        </section>
        |
        <section>
          <CoreButton small onClick={resetAllTableFilters}>
            Clear Filters
          </CoreButton>
        </section>
        <div className="globalSearch">
          <FormControl
            type="text"
            placeholder="Search ..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onInput={searchTable}
          />
        </div>
        <br />
        <section>
          <CoreButton
            small
            onClick={() => changeColumnGroup(COLUMN_GROUPS.FILE)}
          >
            File cols
          </CoreButton>
          <CoreButton
            small
            onClick={() => changeColumnGroup(COLUMN_GROUPS.ORIGIN)}
          >
            Origin cols
          </CoreButton>
          <CoreButton
            small
            onClick={() => changeColumnGroup(COLUMN_GROUPS.COPYRIGHT)}
          >
            Copyright cols
          </CoreButton>
          <CoreButton
            small
            onClick={() => changeColumnGroup(COLUMN_GROUPS.LICENSE)}
          >
            License cols
          </CoreButton>
          <CoreButton
            small
            onClick={() => changeColumnGroup(COLUMN_GROUPS.PACKAGE)}
          >
            Package cols
          </CoreButton>
          <CoreButton small onClick={() => setShowColumnSelector(true)}>
            Custom Columns
          </CoreButton>
        </section>
      </div>
      <CustomColumnSelector
        columnDefs={columnDefs}
        show={showColumnSelector}
        hide={() => setShowColumnSelector(false)}
        setColumnDefs={setColumnDefs}
      />
      <AgDataTable
        gridApi={gridApi}
        tableData={tableData}
        columnDefs={columnDefs}
        onGridReady={onGridReady}
        onColumnMoved={(e) => updateColState(e.columnApi, true)}
        onColumnResized={(e) => updateColState(e.columnApi, false)}
        onGridColumnsChanged={(e) => updateColState(e.columnApi, false)}
      />
    </div>
  );
};

export default TableView;
