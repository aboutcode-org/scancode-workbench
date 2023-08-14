import { Model, Op } from "sequelize";
import { Row, Col, Card } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import {
  FormattedEntry,
  formatPieChartData,
  limitPieChartData,
} from "../../utils/pie";
import { useWorkbenchDB } from "../../contexts/dbContext";
import PieChart from "../../components/PieChart/PieChart";
import EllipticLoader from "../../components/EllipticLoader";
import { LEGEND_LIMIT } from "../../constants/data";
import { ScanOptionKeys } from "../../utils/parsers";
import { AgGridReact } from "ag-grid-react";
import {
  DEFAULT_DEPS_SUMMARY_COL_DEF,
  PackageTypeSummaryRow,
  DependencySummaryTableCols,
} from "./DependencySummaryTableCols";
import { DependencyDetails } from "../Packages/packageDefinitions";
import { PackageDataAttributes } from "../../services/models/packageData";

import "./dependencyInfoDash.css";

interface ScanData {
  totalDependencies: number | null;
}

const DependencyInfoDash = () => {
  const { db, initialized, currentPath, scanInfo } = useWorkbenchDB();

  const [packageTypeDependenciesData, setPackageTypeDependenciesData] =
    useState<FormattedEntry[] | null>(null);
  const [dataSourceIDsData, setDataSourceIDsData] = useState<
    FormattedEntry[] | null
  >(null);
  const [runtimeDependenciesData, setRuntimeDependenciesData] = useState<
    FormattedEntry[] | null
  >(null);
  const [resolvedDependenciesData, setResolvedDependenciesData] = useState<
    FormattedEntry[] | null
  >(null);
  const [optionalDependenciesData, setOptionalDependenciesData] = useState<
    FormattedEntry[] | null
  >(null);
  const [scanData, setScanData] = useState<ScanData>({
    totalDependencies: null,
  });
  const [packageTypeSummaryData, setPackageTypeSummaryData] = useState<
    PackageTypeSummaryRow[]
  >([]);

  function summarisePackageDataDeps(
    packagesData: Model<PackageDataAttributes, PackageDataAttributes>[]
  ) {
    const packageTypeToSummaryMapping = new Map<
      string,
      PackageTypeSummaryRow
    >();
    packagesData.forEach((packageData) => {
      // Package data having PURL as null are invalid & will have no dependency
      // Hence, don't consider such package data (will be fixed in further toolkit version)
      if (!packageData.getDataValue("purl")) return;

      const packageDataType = packageData.getDataValue("type");
      const deps: DependencyDetails[] = JSON.parse(
        packageData.getDataValue("dependencies") || "[]"
      );

      if (!packageTypeToSummaryMapping.has(packageDataType)) {
        packageTypeToSummaryMapping.set(packageDataType, {
          packageTypeDetails: {
            title: packageDataType,
            total: 0,
          },
          resolved: 0,
          runtime: 0,
          optional: 0,
        });
      }
      const packageTypeSummary =
        packageTypeToSummaryMapping.get(packageDataType);

      packageTypeSummary.packageTypeDetails.total += deps.length;
      packageTypeSummary.resolved += deps.reduce((counter, curr) => {
        return counter + (curr.is_resolved ? 1 : 0);
      }, 0);
      packageTypeSummary.runtime += deps.reduce((counter, curr) => {
        return counter + (curr.is_runtime ? 1 : 0);
      }, 0);
      packageTypeSummary.optional += deps.reduce((counter, curr) => {
        return counter + (curr.is_optional ? 1 : 0);
      }, 0);
    });

    return Array.from(packageTypeToSummaryMapping.values()).sort(
      (packageTypeSummary1, packageTypeSummary2) =>
        packageTypeSummary2.packageTypeDetails.total -
        packageTypeSummary1.packageTypeDetails.total
    );
  }

  useEffect(() => {
    if (!initialized || !db || !currentPath) return;

    db.sync
      .then((db) =>
        db.Dependencies.findAll({
          where: {
            datafile_path: {
              [Op.or]: [
                { [Op.like]: `${currentPath}` }, // Matches self
                { [Op.like]: `${currentPath}/%` }, // Matches all its children (if any).
              ],
            },
          },
          include: [
            {
              model: db.Packages,
              as: "package",
            },
          ],
          attributes: [
            "id",
            "for_package_uid",
            "is_runtime",
            "is_resolved",
            "is_optional",
            "datasource_id",
            "scope",
          ],
        })
      )
      .then((dependencies) => {
        setScanData({ totalDependencies: dependencies.length });

        // Prepare chart for runtime dependencies
        const runtimeDependencies = dependencies.map((dependency) =>
          dependency.getDataValue("is_runtime") ? "Runtime" : "Not runtime"
        );
        const { chartData: runtimeDependenciesChartData } =
          formatPieChartData(runtimeDependencies);
        setRuntimeDependenciesData(runtimeDependenciesChartData);

        // Prepare chart for resolved dependencies
        const resolvedDependencies = dependencies.map((dependency) =>
          dependency.getDataValue("is_resolved") ? "Resolved" : "Unresolved"
        );
        const { chartData: resolvedDependenciesChartData } =
          formatPieChartData(resolvedDependencies);
        setResolvedDependenciesData(resolvedDependenciesChartData);

        // Prepare chart for optional dependencies
        const optionalDependencies = dependencies.map((dependency) =>
          dependency.getDataValue("is_optional") ? "Optional" : "Required"
        );
        const { chartData: optionalDependenciesChartData } =
          formatPieChartData(optionalDependencies);
        setOptionalDependenciesData(optionalDependenciesChartData);

        // Prepare chart for dependencies' data source IDs
        const dataSourceIDs = dependencies.map((dependency) =>
          dependency.getDataValue("datasource_id")
        );
        const { chartData: dataSourceIDsChartData } =
          formatPieChartData(dataSourceIDs);
        setDataSourceIDsData(dataSourceIDsChartData);
      });

    db.sync.then(async (db) => {
      const fileIDs = await db.File.findAll({
        where: {
          path: {
            [Op.or]: [
              { [Op.like]: `${currentPath}` }, // Matches a file / directory.
              { [Op.like]: `${currentPath}/%` }, // Matches all its children (if any).
            ],
          },
        },
        attributes: ["id"],
      }).then((files) => files.map((file) => file.getDataValue("id")));

      const packagesData = await db.PackageData.findAll({
        where: { fileId: fileIDs },
        attributes: ["type", "dependencies", "purl"],
      });

      const depsSummaryData = summarisePackageDataDeps(packagesData);
      setPackageTypeDependenciesData(
        limitPieChartData(
          depsSummaryData.map(({ packageTypeDetails: { title, total } }) => [
            title,
            total,
          ]),
          LEGEND_LIMIT
        )
      );
      setPackageTypeSummaryData(depsSummaryData);
    });
  }, [initialized, db, currentPath]);

  return (
    <div className="pieInfoDash">
      <h4 className="text-center">Dependency info - {currentPath || ""}</h4>
      <br />
      <Row className="dash-cards">
        <Col sm={4}>
          <Card className="counter-card">
            {scanData.totalDependencies === null ? (
              <EllipticLoader wrapperClass="value" />
            ) : (
              <h4 className="value">{scanData.totalDependencies}</h4>
            )}
            <h5 className="title">Total Dependencies</h5>
          </Card>
        </Col>
      </Row>
      <br />
      Dependency Scope summary by Package Type
      <AgGridReact
        rowData={Object.values(packageTypeSummaryData || {})}
        columnDefs={DependencySummaryTableCols}
        defaultColDef={DEFAULT_DEPS_SUMMARY_COL_DEF}
        ensureDomOrder
        enableCellTextSelection
        onGridReady={(params) => params.api.sizeColumnsToFit()}
        onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
        className="ag-theme-alpine ag-grid-customClass scope-summary-table"
      />
      <br />
      <Row className="dash-cards">
        <Col sm={4}>
          <Card className="chart-card">
            <h5 className="title">Dependencies for each Package type</h5>
            <PieChart
              chartData={packageTypeDependenciesData}
              notOpted={!scanInfo.optionsMap.get(ScanOptionKeys.PACKAGE)}
              notOptedText="Use --package CLI option for dependencies"
              notOptedLink="https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#package-option"
            />
          </Card>
        </Col>
        <Col sm={4}>
          <Card className="chart-card">
            <h5 className="title">Data Source IDs</h5>
            <PieChart
              chartData={dataSourceIDsData}
              notOpted={!scanInfo.optionsMap.get(ScanOptionKeys.PACKAGE)}
              notOptedText="Use --package CLI option for dependencies"
              notOptedLink="https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#package-option"
            />
          </Card>
        </Col>
      </Row>
      <br />
      <Row className="dash-cards">
        <Col sm={4}>
          <Card className="chart-card">
            <h5 className="title">Runtime dependencies</h5>
            <PieChart
              chartData={runtimeDependenciesData}
              notOpted={!scanInfo.optionsMap.get(ScanOptionKeys.PACKAGE)}
              notOptedText="Use --package CLI option for dependencies"
              notOptedLink="https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#package-option"
            />
          </Card>
        </Col>
        <Col sm={4}>
          <Card className="chart-card">
            <h5 className="title">Resolved dependencies</h5>
            <PieChart
              chartData={resolvedDependenciesData}
              notOpted={!scanInfo.optionsMap.get(ScanOptionKeys.PACKAGE)}
              notOptedText="Use --package CLI option for dependencies"
              notOptedLink="https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#package-option"
            />
          </Card>
        </Col>
        <Col sm={4}>
          <Card className="chart-card">
            <h5 className="title">Optional Dependencies</h5>
            <PieChart
              chartData={optionalDependenciesData}
              notOpted={!scanInfo.optionsMap.get(ScanOptionKeys.PACKAGE)}
              notOptedText="Use --package CLI option for dependencies"
              notOptedLink="https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#package-option"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DependencyInfoDash;
