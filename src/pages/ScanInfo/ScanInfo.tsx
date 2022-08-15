import React, { useEffect, useState } from 'react'

// Maintained Fork of unmaintained but popular react-json-view
import ReactJson from '@microlink/react-json-view'

import { useWorkbenchDB } from '../../contexts/workbenchContext';

import './scanInfo.css';

interface ScanInfo {
  workbench_version: string,
  workbench_notice: string,
  header_content: string,
  files_count: number,
  output_format_version: string,
  spdx_license_list_version: string,
  operating_system: string,
  cpu_architecture: string,
  platform: string,
  platform_version: string,
  python_version: string,
}

function parseIfValidJson(str: unknown){
  if(typeof str !== 'string')
    return null;
  try {
    const parsedObj = JSON.parse(str);
    // Return only if it is an object & not a primitive value
    if(Object(parsedObj) === parsedObj)
      return parsedObj;
    return null;
  } catch (e) {
    return null;
  }
}

const ScanInfo = () => {
  const workbenchDB = useWorkbenchDB();
  const [parsedScanInfo, setParsedScanInfo] = useState<ScanInfo | null>(null);
  
  useEffect(() => {
    const { db, initialized, currentPath } = workbenchDB;
    
    if(!initialized || !db || !currentPath)
      return;
    
    db.sync
      .then(() => {
        db.getScanInfo()
          .then(rawInfo => {
            // console.log(info);
            setParsedScanInfo({
              workbench_version: rawInfo.getDataValue('workbench_version')?.toString({}) || "",
              workbench_notice: rawInfo.getDataValue('workbench_notice')?.toString({}) || "",
              header_content: rawInfo.getDataValue('header_content')?.toString({}) || "",
              files_count: Number(rawInfo.getDataValue('files_count')),
              output_format_version: rawInfo.getDataValue('output_format_version')?.toString({}) || "",
              spdx_license_list_version: rawInfo.getDataValue('spdx_license_list_version')?.toString({}) || "",
              operating_system: rawInfo.getDataValue('operating_system')?.toString({}) || "",
              cpu_architecture: rawInfo.getDataValue('cpu_architecture')?.toString({}) || "",
              platform: rawInfo.getDataValue('platform')?.toString({}) || "",
              platform_version: rawInfo.getDataValue('platform_version')?.toString({}) || "",
              python_version: rawInfo.getDataValue('python_version')?.toString({}) || "",
            })
          })
      });
  }, [workbenchDB]);
  
  return (
    <div className='scan-info'>
      <h4>
        Scan Information
      </h4>
      <br/>
      {
        parsedScanInfo ?
        <table border={1}>
          <tbody>
            {
              Object.entries(parsedScanInfo).map(([key, value]) => {
                const parsedValue = parseIfValidJson(value);
                
                return (
                  <tr key={key}>
                    <td> { key } </td>
                    <td>
                      {
                        parsedValue ?
                        <ReactJson
                          src={parsedValue}
                          enableClipboard={false}
                          displayDataTypes={false}
                        />
                        : value
                      }
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        : <h5>Import JSON / string first</h5>
      }
    </div>
  )
}

export default ScanInfo