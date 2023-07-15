import { Model, Op } from "sequelize";
import { Row, Col, Card } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import {
  FormattedEntry,
  formatChartData,
  limitChartData,
} from "../../utils/pie";
import { useWorkbenchDB } from "../../contexts/dbContext";
import PieChart from "../../components/PieChart/PieChart";
import EllipticLoader from "../../components/EllipticLoader";
import { LEGEND_LIMIT, NO_VALUE_DETECTED_LABEL } from "../../constants/data";
import { ScanOptionKeys } from "../../utils/parsers";
import { AgGridReact } from "ag-grid-react";
import {
  DEFAULT_DEPS_SUMMARY_COL_DEF,
  DependencySummarySections,
  DependencySummaryTableCols,
} from "./DependencySummaryTableCols";
import { DependenciesAttributes } from "../../services/models/dependencies";

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
  const [scopesData, setScopesData] = useState(null);
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
  const [depsStatusSummaryData, setDepsStatusSummaryData] = useState<
    DependencySummarySections[]
  >([]);

  function summariseDeps(
    dependencies: Model<DependenciesAttributes, DependenciesAttributes>[]
  ) {
    const resolvedlDeps = dependencies.filter((dep) =>
      dep.getDataValue("is_resolved")
    );
    const runtimeDeps = dependencies.filter((dep) =>
      dep.getDataValue("is_runtime")
    );
    const optionalDeps = dependencies.filter((dep) =>
      dep.getDataValue("is_optional")
    );

    const dataSourcesMapping = new Map<
      string,
      Model<DependenciesAttributes, DependenciesAttributes>[]
    >();
    dependencies.forEach((dep) => {
      const dataSourceID = dep.getDataValue("datasource_id").toString({});
      if (!dataSourcesMapping.has(dataSourceID))
        dataSourcesMapping.set(dataSourceID, []);
      dataSourcesMapping.get(dataSourceID).push(dep);
    });
    const dataSourceIdSummary: DependencySummarySections[] = Array.from(
      dataSourcesMapping.entries()
    ).map(([dataSource, dataSourceDeps]) => ({
      category: {
        title: dataSource,
        total: dataSourceDeps.length,
      },
      resolved: dataSourceDeps.filter((dep) => dep.getDataValue("is_resolved"))
        .length,
      runtime: dataSourceDeps.filter((dep) => dep.getDataValue("is_runtime"))
        .length,
      optional: dataSourceDeps.filter((dep) => dep.getDataValue("is_optional"))
        .length,
    }));
    const newStatusSummary: DependencySummarySections[] = [
      {
        category: {
          title: "Resolved",
          total: resolvedlDeps.length,
        },
        resolved: resolvedlDeps.length,
        runtime: resolvedlDeps.filter((dep) => dep.getDataValue("is_runtime"))
          .length,
        optional: resolvedlDeps.filter((dep) => dep.getDataValue("is_optional"))
          .length,
      },
      {
        category: {
          title: "Runtime",
          total: runtimeDeps.length,
        },
        resolved: runtimeDeps.filter((dep) => dep.getDataValue("is_resolved"))
          .length,
        runtime: runtimeDeps.length,
        optional: runtimeDeps.filter((dep) => dep.getDataValue("is_optional"))
          .length,
      },
      {
        category: {
          title: "Optional",
          total: optionalDeps.length,
        },
        resolved: optionalDeps.filter((dep) => dep.getDataValue("is_resolved"))
          .length,
        runtime: optionalDeps.filter((dep) => dep.getDataValue("is_runtime"))
          .length,
        optional: optionalDeps.length,
      },
    ];
    return [ ...newStatusSummary, ...dataSourceIdSummary,];
  }

  useEffect(() => {
    if (!initialized || !db || !currentPath) return;

    // db.sync.then((db) => {});
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

        setDepsStatusSummaryData(summariseDeps(dependencies));

        // Prepare chart for runtime dependencies
        const runtimeDependencies = dependencies.map((dependency) =>
          dependency.getDataValue("is_runtime") ? "Runtime" : "Not runtime"
        );
        const { chartData: runtimeDependenciesChartData } =
          formatChartData(runtimeDependencies);
        setRuntimeDependenciesData(runtimeDependenciesChartData);

        // Prepare chart for resolved dependencies
        const resolvedDependencies = dependencies.map((dependency) =>
          dependency.getDataValue("is_resolved") ? "Resolved" : "Unresolved"
        );
        const { chartData: resolvedDependenciesChartData } =
          formatChartData(resolvedDependencies);
        setResolvedDependenciesData(resolvedDependenciesChartData);

        // Prepare chart for optional dependencies
        const optionalDependencies = dependencies.map((dependency) =>
          dependency.getDataValue("is_optional") ? "Optional" : "Required"
        );
        const { chartData: optionalDependenciesChartData } =
          formatChartData(optionalDependencies);
        setOptionalDependenciesData(optionalDependenciesChartData);

        // Prepare chart for dependencies' data source IDs
        const dataSourceIDs = dependencies.map((dependency) =>
          dependency.getDataValue("datasource_id")
        );
        const { chartData: dataSourceIDsChartData } =
          formatChartData(dataSourceIDs);
        setDataSourceIDsData(dataSourceIDsChartData);

        // Prepare chart for dependencies' data source IDs
        const scopes = dependencies.map((dependency) =>
          dependency.getDataValue("scope")
        );
        const { chartData: scopesChartData } = formatChartData(scopes);
        setScopesData(scopesChartData);
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
        attributes: ["type", "dependencies"],
      });
      const PackageTypeWiseCount = new Map<string, number>();
      packagesData.forEach((packageData) => {
        const deps: unknown[] = JSON.parse(
          packageData.getDataValue("dependencies")?.toString({}) || "[]"
        );
        if (!deps.length) return;
        PackageTypeWiseCount.set(
          packageData.getDataValue("type")?.toString({}) ||
            NO_VALUE_DETECTED_LABEL,
          PackageTypeWiseCount.get(
            packageData.getDataValue("type")?.toString({}) ||
              NO_VALUE_DETECTED_LABEL
          ) || 0 + deps.length
        );
      });
      setPackageTypeDependenciesData(
        limitChartData(Array.from(PackageTypeWiseCount.entries()), LEGEND_LIMIT)
      );
    });
  }, [initialized, db, currentPath]);

  return (
    <div className="text-center pieInfoDash">
      <h4>Dependency info - {currentPath || ""}</h4>
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
      <AgGridReact
        rowData={Object.values(depsStatusSummaryData || {})}
        columnDefs={DependencySummaryTableCols}
        defaultColDef={DEFAULT_DEPS_SUMMARY_COL_DEF}
        pagination
        ensureDomOrder
        enableCellTextSelection
        onGridReady={(params) => params.api.sizeColumnsToFit()}
        onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
        className="ag-theme-alpine ag-grid-customClass deps-status-flag-table"
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
        <Col sm={4}>
          <Card className="chart-card">
            <h5 className="title">Dependency scopes</h5>
            <PieChart
              chartData={scopesData}
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
