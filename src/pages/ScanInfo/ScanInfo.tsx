import React, { useEffect, useState } from "react";

// Maintained Fork of unmaintained but popular react-json-view
import ReactJson from "@microlink/react-json-view";

import InfoEntry from "./InfoEntry";
import { useWorkbenchDB } from "../../contexts/dbContext";
import { ScanInfo, parseIfValidJson, parseScanInfo } from "../../utils/parsers";

import "./scanInfo.css";

const ScanInfo = () => {
  const workbenchDB = useWorkbenchDB();
  const [parsedScanInfo, setParsedScanInfo] = useState<ScanInfo | null>(null);

  useEffect(() => {
    const { db, initialized, currentPath } = workbenchDB;

    if (!initialized || !db || !currentPath) return;

    db.sync.then(() => {
      db.getScanInfo().then((rawInfo) => {
        console.log("Raw scan info:", rawInfo);
        const newParsedScanInfo = parseScanInfo(rawInfo);
        console.log("Parsed scan info:", newParsedScanInfo);
        setParsedScanInfo(newParsedScanInfo);
      });
    });
  }, [workbenchDB]);

  return (
    <div className="scan-info">
      <h4>Scan Information</h4>
      <br />
      {parsedScanInfo ? (
        <table border={1} className="overview-table">
          <tbody>
            <InfoEntry name="Tool">{parsedScanInfo.tool_name}</InfoEntry>

            <InfoEntry name="Tool version">
              {parsedScanInfo.tool_version}
            </InfoEntry>

            <InfoEntry
              name="Input"
              show={parsedScanInfo.input && parsedScanInfo.input.length > 0}
            >
              <ul>
                {(parsedScanInfo.input || []).map(
                  (value: string, idx: number) => (
                    <li key={value + idx}>{value}</li>
                  )
                )}
              </ul>
            </InfoEntry>

            <InfoEntry
              name="Options"
              show={parsedScanInfo.optionsList && parsedScanInfo.optionsList.length > 0}
            >
              <table className="options-table">
                <tbody>
                  {parsedScanInfo.optionsList.map(([key, value]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      {typeof value !== "boolean" && <td>{String(value)}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </InfoEntry>

            <InfoEntry name="Files count">
              {parsedScanInfo.files_count}
            </InfoEntry>

            <InfoEntry name="Output format version">
              {parsedScanInfo.output_format_version}
            </InfoEntry>

            <InfoEntry name="SPDX license list version">
              {parsedScanInfo.spdx_license_list_version}
            </InfoEntry>

            <InfoEntry name="Operating system">
              {parsedScanInfo.operating_system}
            </InfoEntry>

            <InfoEntry name="CPU architecture">
              {parsedScanInfo.cpu_architecture}
            </InfoEntry>

            <InfoEntry name="Platform">{parsedScanInfo.platform}</InfoEntry>

            <InfoEntry name="Platform version">
              {parsedScanInfo.platform_version}
            </InfoEntry>

            <InfoEntry name="Python version">
              {parsedScanInfo.python_version}
            </InfoEntry>

            <InfoEntry name="Scan duration">
              {parsedScanInfo.duration} seconds
            </InfoEntry>

            <InfoEntry name="Tool notice">{parsedScanInfo.notice}</InfoEntry>

            <InfoEntry name=" Raw header">
              <ReactJson
                src={parseIfValidJson(parsedScanInfo.raw_header_content || {})}
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
