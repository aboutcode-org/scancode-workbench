import ReactJson from "@microlink/react-json-view";
import { AgGridReact } from "ag-grid-react";
import React, { useEffect, useState } from "react";

import { ActiveLicenseEntity } from "../../pages/Licenses/licenseDefinitions";
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
  activeLicenseEntity: ActiveLicenseEntity | null;
}
const LicenseEntity = (props: LicenseDetectionEntityProps) => {
  const { activeLicenseEntity } = props;
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

  const license = activeLicenseEntity?.license;
  const matches = activeLicenseEntity?.license?.matches;
  const file_regions = activeLicenseEntity?.license?.file_regions;

  if (!activeLicenseEntity) {
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
        {(activeLicenseEntity.type === "detection"
          ? [
              [
                "License Identifier:",
                activeLicenseEntity.license.identifier || "NA",
              ],
              [
                "Instances:",
                (activeLicenseEntity.license.detection_count || 0).toString(),
              ],
              ...(activeLicenseEntity.license.detection_log &&
                Array.isArray(activeLicenseEntity.license.detection_log) &&
                activeLicenseEntity.license.detection_log.length && [
                  [
                    "Detection log ",
                    <>
                      <ul>
                        {activeLicenseEntity.license.detection_log.map(
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
                activeLicenseEntity.license.rule_identifier || "NA",
              ],
              ["Score:", (activeLicenseEntity.license.score || 0).toString()],
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
            activeLicenseEntity.type === "detection"
              ? LicenseDetectionMatchCols
              : LicenseClueMatchCols
          }
          onGridReady={(params) => setMatchesTableColumnApi(params.columnApi)}
          className="ag-theme-alpine ag-grid-customClass entity-table"
          ensureDomOrder
          enableCellTextSelection
          pagination={false}
          defaultColDef={DEFAULT_MATCHES_COL_DEF}
        />
      </MatchedTextProvider>
      <br />
      <br />
      File regions
      <AgGridReact
        rowData={file_regions}
        columnDefs={DetectionFileRegionCols}
        onGridReady={(params) => params.api.sizeColumnsToFit()}
        onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
        className="ag-theme-alpine ag-grid-customClass entity-table"
        ensureDomOrder
        enableCellTextSelection
        pagination={false}
        defaultColDef={DEFAULT_FILE_REGION_COL_DEF}
      />
      <br />
      <div className="raw-info-section">
        Raw license {activeLicenseEntity.type}
        <ReactJson
          src={activeLicenseEntity.license}
          enableClipboard={false}
          displayDataTypes={false}
          collapsed={0}
        />
      </div>
    </div>
  );
};

export default LicenseEntity;
