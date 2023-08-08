import ReactJson from "@microlink/react-json-view";
import { AgGridReact } from "ag-grid-react";
import React, { useEffect, useState } from "react";

import { ActiveLicense } from "../../pages/Licenses/licenseDefinitions";
import {
  DEFAULT_FILE_REGION_COL_DEF,
  DetectionFileRegionCols,
} from "./FileRegionTableCols";
import {
  DEFAULT_MATCHES_COL_DEF,
  LicenseDetectionMatchCols,
  LicenseClueMatchCols,
  MATCH_COLS,
} from "./MatchesTableCols";
import { MatchedTextProvider } from "./MatchedTextContext";
import { useWorkbenchDB } from "../../contexts/dbContext";
import { ScanOptionKeys } from "../../utils/parsers";
import { ColumnApi } from "ag-grid-community";

import "./licenseEntity.css";
import "../../styles/entityCommonStyles.css";

interface LicenseDetectionEntityProps {
  activeLicense: ActiveLicense | null;
}
const LicenseEntity = (props: LicenseDetectionEntityProps) => {
  const { activeLicense } = props;
  const { scanInfo } = useWorkbenchDB();
  const [matchesTableColumnApi, setMatchesTableColumnApi] =
    useState<ColumnApi | null>(null);

  useEffect(() => {
    if (!scanInfo || !matchesTableColumnApi) return;
    matchesTableColumnApi.setColumnVisible(
      MATCH_COLS.matched_text.colId,
      Boolean(scanInfo.optionsMap.get(ScanOptionKeys.LICENSE_TEXT)) ||
        matches[0]?.matched_text?.length > 0 ||
        false
    );
  }, [scanInfo, matchesTableColumnApi]);

  const license = activeLicense?.license;
  const matches = activeLicense?.license?.matches;
  const file_regions = activeLicense?.license?.file_regions;

  if (!activeLicense) {
    return (
      <div>
        <h5>No License detection / clue selected</h5>
      </div>
    );
  }

  return (
    <div className="license-detecion-entity">
      <h5>
        {license.license_expression}
        <br />
      </h5>
      <div className="license-entity-properties">
        {(activeLicense.type === "detection"
          ? [
              ["License Identifier:", activeLicense.license.identifier || "NA"],
              [
                "Instances:",
                (activeLicense.license.detection_count || 0).toString(),
              ],
              ...(activeLicense.license.detection_log &&
                Array.isArray(activeLicense.license.detection_log) &&
                activeLicense.license.detection_log.length && [
                  [
                    "Detection log ",
                    <>
                      <ul>
                        {activeLicense.license.detection_log.map(
                          (log_item, idx) => (
                            <li key={String(log_item) + idx}>{log_item}</li>
                          )
                        )}
                      </ul>
                    </>,
                  ],
                ]),
            ]
          : [
              [
                "Rule Identifier:",
                activeLicense.license.rule_identifier || "NA",
              ],
              ["Score:", (activeLicense.license.score || 0).toString()],
            ]
        ).map((entry) => (
          <React.Fragment key={entry[0].toString()}>
            <span className="property">{entry[0] || ""}</span>
            <span className="value">{entry[1] || ""}</span>
            <br />
          </React.Fragment>
        ))}
      </div>
      <br />
      <MatchedTextProvider>
        Matches
        <AgGridReact
          rowData={matches}
          columnDefs={
            activeLicense.type === "detection"
              ? LicenseDetectionMatchCols
              : LicenseClueMatchCols
          }
          onGridReady={(params) => setMatchesTableColumnApi(params.columnApi)}
          className="ag-theme-alpine ag-grid-customClass matches-table"
          ensureDomOrder
          enableCellTextSelection
          pagination={false}
          defaultColDef={DEFAULT_MATCHES_COL_DEF}
        />
      </MatchedTextProvider>
      <br />
      File regions
      <AgGridReact
        rowData={file_regions}
        columnDefs={DetectionFileRegionCols}
        onGridReady={(params) => params.api.sizeColumnsToFit()}
        onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
        className="ag-theme-alpine ag-grid-customClass file-regions-table"
        ensureDomOrder
        enableCellTextSelection
        pagination={false}
        defaultColDef={DEFAULT_FILE_REGION_COL_DEF}
      />
      <br />
      Raw license {activeLicense.type}
      <ReactJson
        src={activeLicense.license}
        enableClipboard={false}
        displayDataTypes={false}
        collapsed={0}
      />
    </div>
  );
};

export default LicenseEntity;
