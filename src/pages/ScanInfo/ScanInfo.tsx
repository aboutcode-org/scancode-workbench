import React, { useEffect, useState } from 'react'

// Maintained Fork of unmaintained but popular react-json-view
import ReactJson from '@microlink/react-json-view'

import { useWorkbenchDB } from '../../contexts/workbenchContext';

import './scanInfo.css';
import InfoEntry from './InfoEntry';

interface ScanInfo {
  tool_name: string,
  tool_version: string,
  notice: string,
  duration: number,
  options: [string, string][],
  input: string[],
  files_count: number,
  output_format_version: string,
  spdx_license_list_version: string,
  operating_system: string,
  cpu_architecture: string,
  platform: string,
  platform_version: string,
  python_version: string,
  workbench_version: string,
  workbench_notice: string,
  raw_header_content: string,
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
            console.log("Raw scan info:", rawInfo);
            const newParsedScanInfo: ScanInfo = {
              tool_name: rawInfo.getDataValue('tool_name').toString({}) || "",
              tool_version: rawInfo.getDataValue('tool_version').toString({}) || "",
              notice: rawInfo.getDataValue('notice').toString({}) || "",
              duration: Number(rawInfo.getDataValue('duration')),
              options: Object.entries(parseIfValidJson(rawInfo.getDataValue('options')?.toString({})) || []) || [],
              input: parseIfValidJson(rawInfo.getDataValue('input')?.toString({})) || [],
              files_count: Number(rawInfo.getDataValue('files_count')),
              output_format_version: rawInfo.getDataValue('output_format_version')?.toString({}) || "",
              spdx_license_list_version: rawInfo.getDataValue('spdx_license_list_version')?.toString({}) || "",
              operating_system: rawInfo.getDataValue('operating_system')?.toString({}) || "",
              cpu_architecture: rawInfo.getDataValue('cpu_architecture')?.toString({}) || "",
              platform: rawInfo.getDataValue('platform')?.toString({}) || "",
              platform_version: rawInfo.getDataValue('platform_version')?.toString({}) || "",
              python_version: rawInfo.getDataValue('python_version')?.toString({}) || "",
              workbench_version: rawInfo.getDataValue('workbench_version')?.toString({}) || "",
              workbench_notice: rawInfo.getDataValue('workbench_notice')?.toString({}) || "",
              raw_header_content: rawInfo.getDataValue('header_content')?.toString({}) || "",
            };
            console.log("Parsed scan info:", newParsedScanInfo);
            setParsedScanInfo(newParsedScanInfo);
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
        <table border={1} className='overview-table'>
          <tbody>
            <InfoEntry name='Tool'>
              { parsedScanInfo.tool_name }
            </InfoEntry>

            <InfoEntry name='Tool version'>
              { parsedScanInfo.tool_version }
            </InfoEntry>

            <InfoEntry
              name='Input'
              show={parsedScanInfo.input && parsedScanInfo.input.length > 0}
            >
              <ul>
                {
                  (parsedScanInfo.input || []).map((value: string, idx: number) => (
                    <li key={value+idx}>
                      { value }
                    </li>
                  ))
                }
              </ul>
            </InfoEntry>

            <InfoEntry
              name='Options'
              show={parsedScanInfo.options && parsedScanInfo.options.length>0}
            >
              <table className='options-table'>
                <tbody>
                  {
                    parsedScanInfo.options.map(([key, value]) => (
                      <tr key={key}>
                        <td>
                          { key }
                        </td>
                        {
                          typeof value !== 'boolean' &&
                          <td>
                            { String(value) }
                          </td>
                        }
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </InfoEntry>
            
            <InfoEntry name='Files count'>
              { parsedScanInfo.files_count }
            </InfoEntry>
            
            <InfoEntry name='Output format version'>
              { parsedScanInfo.output_format_version }
            </InfoEntry>
            
            <InfoEntry name='SPDX license list version'>
              { parsedScanInfo.spdx_license_list_version }
            </InfoEntry>
            
            <InfoEntry name='Operating system'>
              { parsedScanInfo.operating_system }
            </InfoEntry>
            
            <InfoEntry name='CPU architecture'>
              { parsedScanInfo.cpu_architecture }
            </InfoEntry>
            
            <InfoEntry name='Platform'>
              { parsedScanInfo.platform }
            </InfoEntry>
            
            <InfoEntry name='Platform version'>
              { parsedScanInfo.platform_version }
            </InfoEntry>
            
            <InfoEntry name='Python version'>
              { parsedScanInfo.python_version }
            </InfoEntry>

            <InfoEntry name='Scan duration'>
              { parsedScanInfo.duration } seconds
            </InfoEntry>

            <InfoEntry name='Tool notice'>
              { parsedScanInfo.notice }
            </InfoEntry>

            <InfoEntry name=' Raw header'>
              <ReactJson
                src={parseIfValidJson(parsedScanInfo.raw_header_content || {})}
                enableClipboard={false}
                displayDataTypes={false}
              />
            </InfoEntry>
          </tbody>
        </table>
        : <h5>
          No header data available in this scan
        </h5>
      }
    </div>
  )
}

export default ScanInfo