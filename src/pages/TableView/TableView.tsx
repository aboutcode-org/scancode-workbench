import { Op } from 'sequelize';
import React, { useEffect, useState } from 'react'
import { ColDef, ColumnMovedEvent, GridApi } from 'ag-grid-community';

import AgDataTable from './AgDataTable';
import CoreButton from '../../components/CoreButton/CoreButton';
import CustomFilterComponent from './CustomFilterComponent';

import { ALL_COLUMNS } from './columnDefs';
import { COLUMN_GROUPS, DEFAULT_EMPTY_VALUES, SET_FILTERED_COLUMNS } from './columnGroups';

import { calculateCellWidth } from '../../utils/cells';
import { FlatFileAttributes } from '../../services/models/flatFile';
import { useWorkbenchDB } from '../../contexts/workbenchContext';

import CustomColumnSelector from './CustomColumnSelector';
import { FormControl } from 'react-bootstrap';

import './TableView.css';

const TableView = () => {
  const { db, initialized, currentPath, columnDefs, setColumnDefs } = useWorkbenchDB();
  
  // Necessary to keep coldef as empty array by default, to ensure filter set updates
  const [tableData, setTableData] = useState<unknown[]>([]);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  
  const [searchText, setSearchText] = useState('');
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  // Destructuring column groups to create a new array object (with same cols), ensuring state updates
  const setDefaultColumnGroup = () => setColumnDefs([...COLUMN_GROUPS.DEFAULT]);
  function changeColumnGroup(newGroup: ColDef[]){
    setColumnDefs([
      ALL_COLUMNS.path,
      ...newGroup,
    ])
  }

  function searchTable(e: React.FormEvent<HTMLInputElement>){
    if(gridApi){
      gridApi.setQuickFilter((e.target as HTMLInputElement).value);
    }
  }
  function resetAllTableFilters(){
    if(gridApi){
      gridApi.setFilterModel(null);
      gridApi.setQuickFilter('');
      setSearchText('');
    }
  }

  // Update table data whenever new db is loaded or path is changed
  useEffect(() => {
    if(!initialized || !db || !currentPath)
      return;

    db.sync
      .then(db => db.FlatFile.findAll({
        where: {
          path: {
            [Op.or]: [
              { [Op.like]: `${currentPath}`},      // Matches a file / directory.
              { [Op.like]: `${currentPath}/%`}  // Matches all its children (if any).
            ]
          }
        },
        // raw: true,   // TOIMPROVE: Maybe we can get better performance with this
      }))
      .then(files =>{
        setTableData(files);
        let longestPathLength = 20;
        files.forEach(file => {
          const len = file.getDataValue('path').length;
          if(len > longestPathLength){
            longestPathLength = len;
          }
        });
        const calculatedColumnWidth = calculateCellWidth(longestPathLength)
        ALL_COLUMNS.path.width = calculatedColumnWidth;
        
        setColumnDefs(prevColDefs => {
          if(prevColDefs.length > 0)
            return prevColDefs;   // Don't mutate cols, if already set
          return [...COLUMN_GROUPS.DEFAULT];
        })
      });
  }, [currentPath]);
  
  // Update set filters whenever new db is loaded
  useEffect(() => {
    if(!initialized || !db || !currentPath)
      return;
    
    db.sync
    .then(db => {
      const filterPromises: Promise<ColDef>[] = []

      Object.values(ALL_COLUMNS).forEach(columnDef => {
        const columnKey = columnDef.field || "";

        // Prepare filters only for eligible columns
        if(!SET_FILTERED_COLUMNS.has(columnKey))
          return;

        // Aggregator
        const filterPromise = db.FlatFile.aggregate(
          columnKey as (keyof FlatFileAttributes),
          'DISTINCT',
          {
            plain: false,
            where: {
              path: {
                [Op.or]: [
                  { [Op.like]: `${currentPath}`},      // Matches a file / directory.
                  { [Op.like]: `${currentPath}/%`}  // Matches all its children (if any).
                ]
              }
            },
          },
        )
          .then((uniqueValues: { DISTINCT: string }[]) => {
            const parsedUniqueValues = uniqueValues.map((val) => val.DISTINCT);
            if(!parsedUniqueValues[0])
              parsedUniqueValues[0] = '';
            
            if(!DEFAULT_EMPTY_VALUES.has(parsedUniqueValues[0]))
              parsedUniqueValues.unshift('');
            
            // console.log(
            //   `Unique values aggregated for col - ${columnKey}:`,
            //   // uniqueValues,
            //   // parsedUniqueValues,
            //   parsedUniqueValues.length,
            // );

            columnDef.floatingFilter = true;
            if(!columnDef.filterParams)
              columnDef.filterParams = {};
            columnDef.filterParams.options = parsedUniqueValues;
            columnDef.floatingFilterComponent = CustomFilterComponent;

            return columnDef;
          });
        filterPromises.push(filterPromise);
      });

      Promise.all(filterPromises)
        .then(() => {
          // console.log(
          //   "Generated unique set filters:",
          //   columnDefs.map(coldef => coldef.filterParams)
          // );
          setColumnDefs(prevColDefs => {
            if(prevColDefs.length)
              return [...prevColDefs];
            return [...COLUMN_GROUPS.DEFAULT];
          });
          // setDefaultColumnGroup();
        });
    });
  }, [db, currentPath]);

  useEffect(() => {
    if(gridApi){
      gridApi.refreshHeader();
    }
  }, [columnDefs]);

  return (
    <div style={{ height: "100%", minHeight: "90vh" }}>
      <div className='filterButtons'>
        <section>
          <CoreButton small onClick={setDefaultColumnGroup}>
            Default columns
          </CoreButton>
          <CoreButton small onClick={() => changeColumnGroup(COLUMN_GROUPS.ALL)}>
            Show all
          </CoreButton>
          <CoreButton small onClick={() => changeColumnGroup(COLUMN_GROUPS.NONE)}>
            Hide all
          </CoreButton>
        </section>
        |
        <section>
          <CoreButton small onClick={resetAllTableFilters}>
            Clear Filters
          </CoreButton>
        </section>
          <div className='globalSearch'>
            <FormControl
              type='text'
              placeholder='Search ...'
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onInput={searchTable}
            />
          </div>
        <br/>
        <section>
          <CoreButton small onClick={() => changeColumnGroup(COLUMN_GROUPS.FILE)}>
            File cols
          </CoreButton>
          <CoreButton small onClick={() => changeColumnGroup(COLUMN_GROUPS.ORIGIN)}>
            Origin cols
          </CoreButton>
          <CoreButton small onClick={() => changeColumnGroup(COLUMN_GROUPS.COPYRIGHT)}>
            Copyright cols
          </CoreButton>
          <CoreButton small onClick={() => changeColumnGroup(COLUMN_GROUPS.LICENSE)}>
            License cols
          </CoreButton>
          <CoreButton small onClick={() => changeColumnGroup(COLUMN_GROUPS.PACKAGE)}>
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
        updateGridApi={setGridApi}
        onColumnMoved={(event: ColumnMovedEvent<any>) => {
          // @TODO
          // console.log("Column moved", event);
          
        }}
        columnDefs={columnDefs}
        tableData={tableData}
      />
    </div>
  )
}

export default TableView