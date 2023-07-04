import React from "react";
import ReactJson from "@microlink/react-json-view";

import { useWorkbenchDB } from "../../contexts/dbContext";
import {
  DependencyDetails,
  PackageDetails,
} from "../../pages/Packages/packageDefinitions";
import CoreLink from "../CoreLink/CoreLink";

import "../../styles/entityCommonStyles.css";
import "./packageEntity.css";

interface PackageEntityProps {
  package: PackageDetails;
  goToDependency: (dependency: DependencyDetails) => void;
}
const PackageEntity = (props: PackageEntityProps) => {
  const { goToDependency, package: activePackage } = props;
  const { goToFileInTableView } = useWorkbenchDB();

  if (!activePackage) {
    return (
      <div>
        <h5>No package data found !!</h5>
      </div>
    );
  }

  return (
    <div className="package-entity">
      <h5>{activePackage.purl}</h5>
      <div className="entity-properties">
        {[
          [
            <>
              {activePackage.package_uid}
              <br />
            </>,
          ],
          ["Type:", activePackage.type || null],
          ["Namespace:", activePackage.namespace || null],
          ["Name:", activePackage.name || null],
          ["Version:", activePackage.version || null],
          ["Subpath:", activePackage.subpath || null],
          ["Primary Language:", activePackage.primary_language || null],
          [
            "Extracted license statement: ",
            activePackage.extracted_license_statement || null,
          ],
          [
            "Declared license expression",
            activePackage.declared_license_expression || null,
          ],
          [
            "Declared license expression SPDX",
            activePackage.declared_license_expression_spdx || null,
          ],
          [
            "Other license expression",
            activePackage.other_license_expression || null,
          ],
          [
            "Other license expression SPDX",
            activePackage.other_license_expression_spdx || null,
          ],
        ].map((entry) => (
          <React.Fragment key={entry[0].toString()}>
            <span className="property">{entry[0]}</span>
            {entry.length > 1 && (
              <span className="value">: {entry[1] || "None"}<br /></span>
            
            )}
          </React.Fragment>
        ))}
        <span className="property">Homepage URL:</span>
        <span className="value">
          {activePackage.homepage_url ? (
            <CoreLink
              className="value"
              href={activePackage.homepage_url}
              external
            >
              {activePackage.homepage_url}
            </CoreLink>
          ) : (
            "None"
          )}
        </span>
        <br />
      </div>
      <br />
      <b>
        {activePackage.datafile_paths.length === 0
          ? "No data files !"
          : `Data file paths:`}
      </b>
      <br />
      <div className="deps-list">
        {activePackage.datafile_paths.map((datafile_path) => (
          <CoreLink
            className="deps-link"
            key={datafile_path}
            onClick={() => goToFileInTableView(datafile_path)}
          >
            <React.Fragment key={datafile_path}>{datafile_path}</React.Fragment>
          </CoreLink>
        ))}
      </div>
      <br />
      <b>
        {activePackage.dependencies.length === 0
          ? "No Dependencies !"
          : activePackage.dependencies.length === 1
          ? "1 Dependency:"
          : `${activePackage.dependencies.length} Dependencies:`}
      </b>
      <br />
      <div className="deps-list">
        {activePackage.dependencies.map((dependency) => (
          <CoreLink
            className="deps-link"
            key={dependency.dependency_uid}
            onClick={() => goToDependency(dependency)}
          >
            {dependency.purl}
          </CoreLink>
        ))}
      </div>
      <br />
      Raw package:
      <ReactJson
        src={activePackage}
        enableClipboard={false}
        displayDataTypes={false}
        collapsed={0}
      />
    </div>
  );
};

export default PackageEntity;
