import { ColDef } from 'ag-grid-community'
import React from 'react'
import { Col, Form, Modal, Row } from 'react-bootstrap'
import { COLUMN_GROUPS } from './columnGroups';


const columnCompareFn = (col1: ColDef, col2: ColDef) => col1.sortIndex - col2.sortIndex;

interface ColumnSelectorProps {
  show: boolean,
  columnDefs: ColDef[],
  hide: () => void,
  setColumnDefs: React.Dispatch<React.SetStateAction<ColDef[]>>,
}
const CustomColumnSelector = (props: ColumnSelectorProps) => {
  const { show, columnDefs, hide, setColumnDefs } = props;

  function selectAllChanged(checked: boolean){
    console.log("Checked", checked);
    
    if(checked)
      setColumnDefs([...COLUMN_GROUPS.ALL]);
    else
      setColumnDefs([]);
  }

  function onSelectionChanged(column: ColDef, checked: boolean){
    if(checked){
      if(!columnDefs.includes(column)){
        setColumnDefs(prevCols => [...prevCols, column].sort(columnCompareFn));
      }
    } else {
      const indexOfExistingColumn = columnDefs.indexOf(column);
      if(indexOfExistingColumn !== -1)
        setColumnDefs(prevCols => {
          prevCols.splice(indexOfExistingColumn, 1);
          return [...prevCols].sort(columnCompareFn);
        })
    }
  }


  return (
    <Modal
      size='lg'
      centered
      backdrop={true}
      show={show}
      onHide={hide}
    >
      <Modal.Body className='column-selector'>
        <Row>
          <Col>
            <Form.Check
              id='select-all'     // ID necessary for labels in bootstrap
              type='checkbox'
              checked={columnDefs.length === COLUMN_GROUPS.ALL.length}
              onChange={e => selectAllChanged(e.target.checked)}
              label='Select all'
            />
          </Col>
        </Row>
        <br/>
        <Row>
          <Col>
            {
              COLUMN_GROUPS.ALL.slice(0, COLUMN_GROUPS.ALL.length / 2).map(column => (
                <Form.Check 
                  type='checkbox'
                  key={column.field}
                  id={column.field}     // ID necessary for labels in bootstrap
                  label={column.field}
                  checked={columnDefs.includes(column)}
                  onChange={e => onSelectionChanged(column, e.target.checked)}
                />
              ))
            }
          </Col>
          <Col>
            {
              COLUMN_GROUPS.ALL.slice(COLUMN_GROUPS.ALL.length / 2).map(column => (
                <Form.Check 
                  type='checkbox'
                  key={column.field}
                  id={column.field}     // ID necessary for labels in bootstrap
                  label={column.headerName}
                  checked={columnDefs.includes(column)}
                  onChange={e => onSelectionChanged(column, e.target.checked)}
                />
              ))
            }
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  )
}

export default CustomColumnSelector