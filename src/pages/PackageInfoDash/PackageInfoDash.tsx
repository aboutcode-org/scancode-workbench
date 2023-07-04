import { Op } from "sequelize";
import { Row, Col, Card } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import { formatChartData } from "../../utils/pie";
import { useWorkbenchDB } from "../../contexts/dbContext";
import { NO_VALUE_DETECTED_LABEL } from "../../constants/data";
import PieChart from "../../components/PieChart/PieChart";
import EllipticLoader from "../../components/EllipticLoader";
import { ScanOptionKeys } from "../../utils/parsers";

interface ScanData {
  totalPackages: number | null;
}

const PackageInfoDash = () => {
  const { db, initialized, currentPath, scanInfo } = useWorkbenchDB();
  const [packageTypeData, setPackageTypeData] = useState(null);
  const [packageLangData, setPackageLangData] = useState(null);
  const [packageLicenseData, setPackageLicenseData] = useState(null);
  const [scanData, setScanData] = useState<ScanData>({
    totalPackages: null,
  });

  useEffect(() => {
    if (!initialized || !db || !currentPath) return;

    db.sync
      .then((db) =>
        db.File.findAll({
          where: {
            path: {
              [Op.or]: [
                { [Op.like]: `${currentPath}` }, // Matches a file / directory.
                { [Op.like]: `${currentPath}/%` }, // Matches all its children (if any).
              ],
            },
          },
          attributes: ["id"],
        })
      )
      .then((files) => {
        const fileIDs = files.map((file) => file.getDataValue("id"));

        // Query and prepare chart for package types
        db.sync
          .then((db) => db.PackageData.findAll({ where: { fileId: fileIDs } }))
          .then((packageData) => {
            // Prepare count of packages
            setScanData({ totalPackages: packageData.length });
            return packageData;
          })
          .then((packageData) => {
            // Prepare chart for package types
            const packageTypes = packageData.map(
              (packageEntry) =>
                packageEntry.getDataValue("type") || NO_VALUE_DETECTED_LABEL
            );
            const { chartData: packageTypesChartData } =
              formatChartData(packageTypes);
            setPackageTypeData(packageTypesChartData);

            // Prepare chart for package languages
            const packageLangs = packageData.map(
              (packageEntry) =>
                packageEntry.getDataValue("primary_language") ||
                NO_VALUE_DETECTED_LABEL
            );
            const { chartData: packageLangsChartData } =
              formatChartData(packageLangs);
            setPackageLangData(packageLangsChartData);

            // Prepare chart for package license expression
            const packageLicenseExp = packageData.map(
              (packageEntry) =>
                packageEntry.getDataValue("declared_license_expression") ||
                NO_VALUE_DETECTED_LABEL
            );
            const { chartData: packageLicenseExpChartData } =
              formatChartData(packageLicenseExp);

            setPackageLicenseData(packageLicenseExpChartData);
          });
      });
  }, [db, initialized, currentPath]);

  return (
    <div className="text-center pieInfoDash">
      <h3>Package info - {currentPath || ""}</h3>
      <br />
      <br />
      <Row className="dash-cards">
        <Col sm={4}>
          <Card className="counter-card">
            {scanData.totalPackages === null ? (
              <EllipticLoader wrapperClass="value" />
            ) : (
              <h4 className="value">{scanData.totalPackages}</h4>
            )}
            <h5 className="title">Total Number of packages</h5>
          </Card>
        </Col>
      </Row>
      <br />
      <br />
      <Row className="dash-cards">
        <Col sm={6} md={4}>
          <Card className="chart-card">
            <h5 className="title">Package Types</h5>
            <PieChart
              chartData={packageTypeData}
              notOpted={!scanInfo.optionsMap.get(ScanOptionKeys.PACKAGE)}
              notOptedText="Use --package CLI option for package types"
              notOptedLink="https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#package-option"
            />
          </Card>
        </Col>
        <Col sm={6} md={4}>
          <Card className="chart-card">
            <h5 className="title">Package languages</h5>
            <PieChart
              chartData={packageLangData}
              notOpted={!scanInfo.optionsMap.get(ScanOptionKeys.PACKAGE)}
              notOptedText="Use --package CLI option for package languages"
              notOptedLink="https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#package-option"
            />
          </Card>
        </Col>
        <Col sm={6} md={4}>
          <Card className="chart-card">
            <h5 className="title">Package Licenses</h5>
            <PieChart
              chartData={packageLicenseData}
              notOpted={!scanInfo.optionsMap.get(ScanOptionKeys.PACKAGE)}
              notOptedText="Use --package CLI option for package licenses"
              notOptedLink="https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#package-option"
            />
          </Card>
        </Col>
      </Row>
      <br />
    </div>
  );
};

export default PackageInfoDash;
