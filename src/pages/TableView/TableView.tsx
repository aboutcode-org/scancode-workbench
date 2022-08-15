import { Op } from 'sequelize';
import React, { useEffect, useState } from 'react'
import { ColDef, GridApi } from 'ag-grid-community';

import AgDataTable from './AgDataTable';
import CoreButton from '../../components/CoreButton/CoreButton';
import CustomFilterComponent from './CustomFilterComponent';
import { ALL_COLUMNS } from './columnDefs';
import { COLUMN_GROUPS, DEFAULT_EMPTY_VALUES, SET_FILTERED_COLUMNS } from './columnGroups';

import { useWorkbenchDB } from '../../contexts/workbenchContext';
import { FlatFileAttributes } from '../../services/models/flatFile';

import './TableView.css';
import CustomColumnSelector from './CustomColumnSelector';
import { FormControl } from 'react-bootstrap';

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
        raw: true,
      }))
      .then((files) =>{
        setTableData(files);
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
          { plain: false },
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
            columnDef.filterParams = { options: parsedUniqueValues };
            columnDef.floatingFilterComponent = CustomFilterComponent;

            return columnDef;
          });
        filterPromises.push(filterPromise);
      });

      Promise.all(filterPromises)
        .then((generatedColDefs) => {
          console.log(
            "Completed generation of unique set filters:",
            generatedColDefs.map(coldef => coldef.filterParams.options)
          );
          setColumnDefs(prevColDefs => {
            if(prevColDefs.length)
              return [...prevColDefs];
            return [...COLUMN_GROUPS.DEFAULT];
          });
          // setDefaultColumnGroup();
        });
    });


  }, [db]);

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
        columnDefs={columnDefs}
        tableData={tableData}
      />
    </div>
  )
}

export default TableView