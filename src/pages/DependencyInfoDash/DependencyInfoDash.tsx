import { Op } from "sequelize";
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
