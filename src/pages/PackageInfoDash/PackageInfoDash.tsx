import { Op, WhereOptions } from "sequelize";
import { Row, Col, Card } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import { FormattedEntry, formatPieChartData } from "../../utils/pie";
import { useWorkbenchDB } from "../../contexts/dbContext";
import { NO_VALUE_DETECTED_LABEL } from "../../constants/data";
import PieChart from "../../components/PieChart/PieChart";
import EllipticLoader from "../../components/EllipticLoader";
import { ScanOptionKeys } from "../../utils/parsers";
import { FileAttributes } from "../../services/models/file";

interface ScanData {
  totalPackages: number | null;
}

const PackageInfoDash = () => {
  const {
    db,
    initialized,
    currentPath,
    scanInfo,
    startProcessing,
    endProcessing,
  } = useWorkbenchDB();
  const [packageTypeData, setPackageTypeData] = useState<
    FormattedEntry[] | null
  >(null);
  const [packageLangData, setPackageLangData] = useState<
    FormattedEntry[] | null
  >(null);
  const [packageLicenseData, setPackageLicenseData] = useState<
    FormattedEntry[] | null
  >(null);
  const [scanData, setScanData] = useState<ScanData>({
    totalPackages: null,
  });

  // Path independent
  useEffect(() => {
    if (!initialized || !db || !currentPath) return;
    db.sync
      .then((db) => db.Packages.count())
      .then((totalPackages) => setScanData({ totalPackages }));
  }, [db, initialized]);

  useEffect(() => {
    if (!initialized || !db || !currentPath) return;

    startProcessing();

    const where: WhereOptions<FileAttributes> = {
      path: {
        [Op.or]: [
          { [Op.like]: `${currentPath}` }, // Matches a file / directory.
          { [Op.like]: `${currentPath}/%` }, // Matches all its children (if any).
        ],
      },
    };

    db.sync
      .then((db) =>
        db.File.findAll({
          where,
          attributes: ["id"],
        })
      )
      // @REMOVE_THIS
      // .then((flatFiles) => new Promise(resolve => setTimeout(()=>resolve(flatFiles), 2000)))
      .then((files) => {
        const fileIDs = files.map((file) => file.getDataValue("id"));

        // Query and prepare chart for package types
        const PackageDataPromise = db.sync
          .then((db) => db.PackageData.findAll({ where: { fileId: fileIDs } }))
          .then((rawPackageData) =>
            rawPackageData.map((rawPackage) => rawPackage.toJSON())
          )
          .then((packageData) => {
            // Prepare chart for package types
            const packageTypes = packageData.map(
              (packageEntry) => packageEntry.type || NO_VALUE_DETECTED_LABEL
            );
            const { chartData: packageTypesChartData } =
              formatPieChartData(packageTypes);
            setPackageTypeData(packageTypesChartData);

            // Prepare chart for package languages
            const packageLangs = packageData.map(
              (packageEntry) =>
                packageEntry.primary_language || NO_VALUE_DETECTED_LABEL
            );
            const { chartData: packageLangsChartData } =
              formatPieChartData(packageLangs);
            setPackageLangData(packageLangsChartData);

            // Prepare chart for package license expression
            const packageLicenseExp = packageData.map(
              (packageEntry) =>
                packageEntry.declared_license_expression ||
                NO_VALUE_DETECTED_LABEL
            );
            const { chartData: packageLicenseExpChartData } =
              formatPieChartData(packageLicenseExp);

            setPackageLicenseData(packageLicenseExpChartData);
          });
        return [PackageDataPromise];
      })
      .then(endProcessing);
  }, [currentPath]);

  return (
    <div className="pieInfoDash">
      <h4 className="text-center">Package info - {currentPath || ""}</h4>
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
