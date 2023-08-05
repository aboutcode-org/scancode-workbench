import React from "react";

// Maintained Fork of unmaintained but popular react-json-view
import ReactJson from "@microlink/react-json-view";

import InfoEntry from "./InfoEntry";
import { useWorkbenchDB } from "../../contexts/dbContext";
import { ScanInfo, parseIfValidJson } from "../../utils/parsers";

import "./scanInfo.css";

const ScanInfo = () => {
  const { scanInfo } = useWorkbenchDB();

  return (
    <div className="scan-info">
      <h4>Scan Information</h4>
      <br />
      {scanInfo ? (
        <table border={1} className="overview-table">
          <tbody>
            <InfoEntry name="Tool">{scanInfo.tool_name}</InfoEntry>

            <InfoEntry name="Tool version">{scanInfo.tool_version}</InfoEntry>

            <InfoEntry
              name="Input"
              show={scanInfo.input && scanInfo.input.length > 0}
            >
              <ul>
                {(scanInfo.input || []).map((inputPath: string) => (
                  <li key={inputPath}>{inputPath}</li>
                ))}
              </ul>
            </InfoEntry>

            <InfoEntry
              name="Options"
              show={scanInfo.optionsList && scanInfo.optionsList.length > 0}
            >
              <table className="options-table">
                <tbody>
                  {(scanInfo.optionsList || []).map(([key, value]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      {typeof value !== "boolean" && <td>{String(value)}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </InfoEntry>

            <InfoEntry name="Files count">{scanInfo.files_count}</InfoEntry>

            <InfoEntry name="Output format version">
              {scanInfo.output_format_version}
            </InfoEntry>

            <InfoEntry name="SPDX license list version">
              {scanInfo.spdx_license_list_version}
            </InfoEntry>

            <InfoEntry name="Operating system">
              {scanInfo.operating_system}
            </InfoEntry>

            <InfoEntry name="CPU architecture">
              {scanInfo.cpu_architecture}
            </InfoEntry>

            <InfoEntry name="Platform">{scanInfo.platform}</InfoEntry>

            <InfoEntry name="Platform version">
              {scanInfo.platform_version}
            </InfoEntry>

            <InfoEntry name="Python version">
              {scanInfo.python_version}
            </InfoEntry>

            <InfoEntry name="Scan duration">
              {scanInfo.duration && `${scanInfo.duration} seconds`}
            </InfoEntry>

            <InfoEntry name="Tool notice">{scanInfo.notice}</InfoEntry>

            <InfoEntry
              name="Files with errors"
              show={scanInfo.errors && scanInfo.errors.length > 0}
            >
              <ul>
                {(scanInfo.errors || []).map((error: string) => (
                  <li key={error}>
                    {/* <CoreLink onClick={() => goToFileInTableView(error)}>
                      {error}
                    </CoreLink> */}
                    {error}
                  </li>
                ))}
              </ul>
            </InfoEntry>

            <InfoEntry name=" Raw header">
              <ReactJson
                src={parseIfValidJson(scanInfo.raw_header_content || {})}
                enableClipboard={false}
                displayDataTypes={false}
              />
            </InfoEntry>
          </tbody>
        </table>
      ) : (
        <h5>No header data available in this scan</h5>
      )}
    </div>
  );
};

export default ScanInfo;
