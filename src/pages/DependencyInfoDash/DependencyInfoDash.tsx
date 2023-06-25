import { Op } from "sequelize";
import { Row, Col, Card } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import { formatChartData, limitChartData } from "../../utils/pie";
import { useWorkbenchDB } from "../../contexts/dbContext";
import PieChart from "../../components/PieChart/PieChart";
import EllipticLoader from "../../components/EllipticLoader";
import { LEGEND_LIMIT, NO_VALUE_DETECTED_LABEL } from "../../constants/data";

interface ScanData {
  totalUniqueHolders: number | null;
  totalUniqueNotices: number | null;
  totalUniqueAuthors: number | null;
}

const DependencyInfoDash = () => {
  const workbenchDB = useWorkbenchDB();

  const [packageTypeDependenciesData, setPackageTypeDependenciesData] =
    useState(null);
  const [runtimeDependenciesData, setRuntimeDependenciesData] = useState(null);
  const [resolvedDependenciesData, setResolvedDependenciesData] =
    useState(null);
  const [optionalDependenciesData, setOptionalDependenciesData] =
    useState(null);
  const [scanData, setScanData] = useState<ScanData>({
    totalUniqueHolders: 0,
    totalUniqueAuthors: 0,
    totalUniqueNotices: 0,
  });

  useEffect(() => {
    const { db, initialized, currentPath } = workbenchDB;

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
          ],
        })
      )
      .then((dependencies) => {
        console.log({ dependencies });

        // Prepare chart for runtime dependencies
        const runtimeDependencies = dependencies.map((dependency) =>
          dependency.getDataValue("is_runtime") ? "Runtime" : "Not runtime"
        );
        const { chartData: runtimeDependenciesChartData } =
          formatChartData(runtimeDependencies);
        setRuntimeDependenciesData(runtimeDependenciesChartData);

        // Prepare chart for resolvved dependencies
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
        PackageTypeWiseCount.set(
          packageData.getDataValue("type")?.toString({}) ||
            NO_VALUE_DETECTED_LABEL,
          PackageTypeWiseCount.get(
            packageData.getDataValue("type")?.toString({}) ||
              NO_VALUE_DETECTED_LABEL
          ) ||
            0 +
              (
                JSON.parse(
                  packageData.getDataValue("dependencies")?.toString({}) || "[]"
                ) as unknown[]
              ).length
        );
      });
      setPackageTypeDependenciesData(
        limitChartData(Array.from(PackageTypeWiseCount.entries()), LEGEND_LIMIT)
      );
    });
  }, [workbenchDB]);

  return (
    <div className="text-center pieInfoDash">
      <br />
      <h3>File info - {workbenchDB.currentPath || ""}</h3>
      <br />
      <br />
      <Row className="dash-cards">
        <Col sm={4}>
          <Card className="info-card">
            {scanData.totalUniqueHolders === null ? (
              <EllipticLoader wrapperClass="value" />
            ) : (
              <h4 className="value">{scanData.totalUniqueHolders}</h4>
            )}
            <h5 className="title">Total Unique holders</h5>
          </Card>
        </Col>
        <Col sm={4}>
          <Card className="info-card">
            {scanData.totalUniqueNotices === null ? (
              <EllipticLoader wrapperClass="value" />
            ) : (
              <h4 className="value">{scanData.totalUniqueNotices}</h4>
            )}
            <h5 className="title">Total Unique notices</h5>
          </Card>
        </Col>
        <Col sm={4}>
          <Card className="info-card">
            {scanData.totalUniqueAuthors === null ? (
              <EllipticLoader wrapperClass="value" />
            ) : (
              <h4 className="value">{scanData.totalUniqueAuthors}</h4>
            )}
            <h5 className="title">Total Unique authors</h5>
          </Card>
        </Col>
      </Row>
      <br />
      <br />
      <Row className="dash-cards">
        <Col sm={6} md={3}>
          <Card className="chart-card">
            <h5 className="title">Package types</h5>
            <PieChart
              chartData={packageTypeDependenciesData}
              noDataText="Use --package CLI option for dependencies"
              noDataLink="https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#package-option"
            />
          </Card>
        </Col>
        <Col sm={6} md={3}>
          <Card className="chart-card">
            <h5 className="title">Runtime dependencies</h5>
            <PieChart
              chartData={runtimeDependenciesData}
              noDataText="Use --package CLI option for dependencies"
              noDataLink="https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#package-option"
            />
          </Card>
        </Col>
        <Col sm={6} md={3}>
          <Card className="chart-card">
            <h5 className="title">Resolved dependencies</h5>
            <PieChart
              chartData={resolvedDependenciesData}
              noDataText="Use --package CLI option for dependencies"
              noDataLink="https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#package-option"
            />
          </Card>
        </Col>
        <Col sm={6} md={3}>
          <Card className="chart-card">
            <h5 className="title">Optional Dependencies</h5>
            <PieChart
              chartData={optionalDependenciesData}
              noDataText="Use --package CLI option for dependencies"
              noDataLink="https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#package-option"
            />
          </Card>
        </Col>
      </Row>
      <br />
      <br />
    </div>
  );
};

export default DependencyInfoDash;
