import { Op } from "sequelize";
import React, { useEffect, useState } from "react";
import { ColDef, ColumnApi, GridApi, GridReadyEvent } from "ag-grid-community";

import AgDataTable from "./AgDataTable";
import CoreButton from "../../components/CoreButton/CoreButton";
import CustomFilterComponent from "./CustomFilterComponent";

import { ALL_COLUMNS } from "./columnDefs";
import {
  COLUMN_GROUPS,
  PLACEHOLDER_EMPTY_VALUES,
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
  const [tableData, setTableData] = useState<FlatFileAttributes[]>([]);
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

  useEffect(() => {
    if (!initialized || !db || !currentPath) return;

    startProcessing();

    // Update table data whenever new db is loaded or path is changed
    const DataProcessorPromise = db.sync
      .then((db) =>
        db.FlatFile.findAll({
          where: {
            path: {
              [Op.or]: [
                { [Op.like]: `${currentPath}` }, // Matches a file / directory.
                { [Op.like]: `${currentPath}/%` }, // Matches all its children (if any).
              ],
            },
          },
        })
      )
      .then((fileModels) => fileModels.map((fileModel) => fileModel.dataValues))
      .then((files) => {
        setTableData(files);
        let longestPathLength = 20;
        let hasError = false;
        files.forEach((file) => {
          const len = file.path.length;
          if (len > longestPathLength) {
            longestPathLength = len;
          }
          if (!hasError && file.scan_errors?.length > 0) hasError = true;
        });

        const calculatedColumnWidth = calculateCellWidth(longestPathLength);

        // Set scan_errors column width based on the presence of any error
        ALL_COLUMNS.scan_errors.width = hasError ? 270 : 130;

        // Shrink path column, if user has over-extended it earlier (maybe for other scan with large paths)
        if (calculatedColumnWidth < ALL_COLUMNS.path.width)
          ALL_COLUMNS.path.width = calculatedColumnWidth;

        setColumnDefs((prevColDefs) => {
          if (prevColDefs.length > 0) return prevColDefs; // Don't mutate cols, if already set
          return [...COLUMN_GROUPS.DEFAULT];
        });
      });

    // Update set filters whenever new db is loaded or path is changed
    const FilterProcessorPromise = db.sync.then((db) => {
      const filterPromises: Promise<ColDef>[] = [];

      Object.values(ALL_COLUMNS).forEach((columnDef) => {
        const columnKey = columnDef.field || "";

        // Prepare filters only for eligible columns
        if (!SET_FILTERED_COLUMNS.has(columnKey)) return;

        // Aggregator
        const filterPromise = db.FlatFile.aggregate(
          columnKey as keyof FlatFileAttributes,
          "DISTINCT",
          {
            plain: false,
            where: {
              path: {
                [Op.or]: [
                  { [Op.like]: `${currentPath}` }, // Matches a file / directory.
                  { [Op.like]: `${currentPath}/%` }, // Matches all its children (if any).
                ],
              },
            },
          }
        ).then((uniqueValues: { DISTINCT: string }[]) => {
          const parsedUniqueValues = uniqueValues
            .map((val) => val.DISTINCT)
            .sort((a, b) =>
              a === "[[]]" || !a
                ? -1
                : b === "[[]]" || !b
                ? 1
                : a.localeCompare(b)
            );

          if (!parsedUniqueValues[0]) parsedUniqueValues[0] = "";

          if (!PLACEHOLDER_EMPTY_VALUES.has(parsedUniqueValues[0]))
            parsedUniqueValues.unshift("");

          // console.log(
          //   `Unique values aggregated for col - ${columnKey}:`,
          //   // uniqueValues,
          //   // parsedUniqueValues,
          //   parsedUniqueValues.length,
          // );

          columnDef.floatingFilter = true;
          if (!columnDef.filterParams) columnDef.filterParams = {};
          columnDef.filterParams.options = parsedUniqueValues;
          columnDef.floatingFilterComponent = CustomFilterComponent;

          return columnDef;
        });
        filterPromises.push(filterPromise);
      });

      return Promise.all(filterPromises).then(() => {
        // console.log(
        //   "Generated unique set filters:",
        //   columnDefs.map(coldef => coldef.filterParams)
        // );
        setColumnDefs((prevColDefs) => {
          if (prevColDefs.length) return [...prevColDefs];
          return [...COLUMN_GROUPS.DEFAULT];
        });
      });
    });

    Promise.all([DataProcessorPromise, FilterProcessorPromise]).then(
      endProcessing
    );
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

  return (
    <div style={{ height: "100%", minHeight: "90vh" }}>
      <div className="filterButtons">
        <section>
          <CoreButton small onClick={setDefaultColumnGroup}>
            Default columns
          </CoreButton>
          <CoreButton
            small
            onClick={() => setColumnDefs([...COLUMN_GROUPS.ALL])}
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
