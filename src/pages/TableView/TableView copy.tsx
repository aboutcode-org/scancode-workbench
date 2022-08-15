import { Op } from 'sequelize';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'

import { useWorkbenchDB } from '../../contexts/workbenchContext';

import './TableView.css';
import ReactDataGrid from '@inovua/reactdatagrid-community';

import '@inovua/reactdatagrid-community/index.css'
import { TypeColumns } from '@inovua/reactdatagrid-community/types/TypeColumn';

const TABLE_COLUMNS: TypeColumns = [
  { id: 'path', name: 'path', header: 'Path', minWidth: 50, defaultFlex: 4 },
  { id: 'type', name: 'type', header: 'Type', minWidth: 50, defaultFlex: 2 },
  { id: 'name', name: 'name', header: 'Name', minWidth: 50, defaultFlex: 2 },
  { id: 'extension', name: 'extension', header: 'File extension', minWidth: 50, defaultFlex: 2 },
  { id: 'size', name: 'size', header: 'Size', minWidth: 50, defaultFlex: 2 },
  { id: 'programming_language', name: 'programming_language', header: 'Prog Language', minWidth: 50, defaultFlex: 2 },
  { id: 'mime_type', name: 'mime_type', header: 'Mime Type', minWidth: 50, defaultFlex: 2 },
  { id: 'file_type', name: 'file_type', header: 'File Type', minWidth: 50, defaultFlex: 2 },
  { id: 'scan_error', name: 'scan_error', header: 'Scan Error', minWidth: 50, defaultFlex: 2 },
]

// const allProperties = [
//   'path',
//  'id',
//  'parent',
//  'type',
//  'name',
//  'extension',
//  'date',
//  'size',
//  'sha1',
//  'md5',
//  'files_count',
//  'dirs_count',
//  'mime_type',
//  'file_type',
//  'programming_language',
//  'is_binary',
//  'is_text',
//  'is_archive',
//  'is_media',
//  'is_source',
//  'is_script',
//  'headerId'
// ]


const TableView = () => {

  const workbenchDB = useWorkbenchDB();
  const [filteredTableData, setFilteredTableData] = useState<unknown[]>([]);
  const [tableData, setTableData] = useState<unknown[]>([]);

  useEffect(() => {
    const { db, initialized, currentPath } = workbenchDB;
    
    if(!initialized || !db || !currentPath)
      return;

    console.log("Path to render data in tableview", currentPath);

    db.sync
      .then(db => db.File.findAll({
        where: {
          path: {
            [Op.or]: [
              { [Op.like]: `${currentPath}`},      // Matches a file / directory.
              { [Op.like]: `${currentPath}/%`}  // Matches all its children (if any).
            ]
          }
        },
        // attributes: ['id'],
        raw: true,
      }))
      .then((files) =>{
        console.log("Files", files);
        setTableData(files);
        setFilteredTableData(files);
      });
  }, [workbenchDB]);


  const [gridRef, setGridRef] = useState(null);

  const setColumnsSizesAuto = useCallback(
    (skipHeader: any) => {
      if (gridRef && gridRef.current.setColumnsSizesAuto) {
        gridRef.current.setColumnsSizesAuto({
          skipHeader,
        });
      }
    },
    [gridRef]
  );
  

  function onSearchChange(e: ChangeEvent<HTMLInputElement>){
    const lowerText = e.target.value.toLowerCase();
    const newFilteredData = tableData.filter((p: any) => {
      return TABLE_COLUMNS.reduce((acc, col) => {
        const v = (p[col.id] + '').toLowerCase(); // get string value
        return acc || v.indexOf(lowerText) != -1; // make the search case insensitive
      }, false);
    });
    setFilteredTableData(newFilteredData);
  }

  return (
    <div>
      <div>
        <label>
          Search text:{' '}
          <input
            type="text"
            style={{ padding: 5 }}
            onChange={onSearchChange}
          />{' '}
        </label>
        <button onClick={() => setColumnsSizesAuto(true)}>
          Set column sizes auto
        </button>
      </div>
      <ReactDataGrid
        idProperty="id"
        handle={setGridRef}
        columns={TABLE_COLUMNS}
        dataSource={filteredTableData}
        // setColumnSizeAuto={true}
        pagination={true}
        enableColumnAutosize
        pageSizes={[10, 25, 50, 100]}
        style={{ minHeight: "90vh" }}
      />
    </div>
  )
}

export default TableView