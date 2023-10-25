import React from "react";
import { Badge } from "react-bootstrap";
import ReactJson from "@microlink/react-json-view";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import CoreLink from "../CoreLink/CoreLink";
import { DependencyDetails } from "../../pages/Packages/packageDefinitions";

import "../../styles/entityCommonStyles.css";

interface DependencyEntityProps {
  dependency: DependencyDetails;
  goToPackageByUID: (package_uid: string) => void;
  goToFileInTableView: (file_path: string) => void;
}
const DependencyEntity = (props: DependencyEntityProps) => {
  const { goToPackageByUID, goToFileInTableView, dependency } = props;

  if (!dependency) {
    return (
      <div>
        <h5>No dependency data found !!</h5>
      </div>
    );
  }
  return (
    <div className="dependency-entity">
      <h5>{dependency.purl}</h5>
      {dependency.is_runtime && (
        <Badge pill bg="primary">
          Runtime
        </Badge>
      )}
      {dependency.is_optional && (
        <Badge pill bg="warning" text="dark">
          Optional
        </Badge>
      )}
      {dependency.is_resolved && (
        <Badge pill bg="success">
          <FontAwesomeIcon icon={faCheck} /> Resolved
        </Badge>
      )}
      <br />
      <br />
      <div className="entity-properties">
        {[
          [
            "For",
            dependency.for_package_uid ? (
              <CoreLink
                onClick={() => goToPackageByUID(dependency.for_package_uid)}
              >
                {dependency.for_package_uid}
              </CoreLink>
            ) : (
              <>NA</>
            ),
          ],
          ["Scope", dependency.scope || "NA"],
          ["Extracted requirement", dependency.extracted_requirement || "NA"],
          [
            "Data file",
            dependency.datafile_path ? (
              <CoreLink
                onClick={() => goToFileInTableView(dependency.datafile_path)}
              >
                {dependency.datafile_path}
              </CoreLink>
            ) : (
              <>NA</>
            ),
          ],
          ["Data source ID", dependency.datasource_id || "NA"],
        ].map((entry) => (
          <React.Fragment key={entry[0].toString()}>
            <span className="property">{entry[0]}</span>
            {entry.length > 1 && (
              <span className="value">
                : {entry[1] || "None"}
                <br />
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
      <br />
      {dependency.is_resolved && dependency.resolved_package && (
        <div>
          Resolved package:
          <ReactJson
            src={dependency.resolved_package as Record<string, unknown>}
            enableClipboard={false}
            displayDataTypes={false}
            collapsed={0}
          />
        </div>
      )}
      <div className="raw-info-section">
        Raw dependency:
        <ReactJson
          src={dependency || {}}
          enableClipboard={false}
          displayDataTypes={false}
          collapsed={0}
        />
      </div>
    </div>
  );
};

export default DependencyEntity;
