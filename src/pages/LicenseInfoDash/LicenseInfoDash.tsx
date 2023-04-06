import { Op } from "sequelize";
import { Tooltip } from "react-tooltip";
import { Row, Col, Card } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import { formatChartData } from "../../utils/pie";
import { useWorkbenchDB } from "../../contexts/workbenchContext";
import PieChart from "../../components/PieChart/PieChart";
import EllipticLoader from "../../components/EllipticLoader";

interface ScanData {
  totalLicenses: number | null;
  totalLicenseFiles: number | null;
  totalSPDXLicenses: number | null;
}

import "./licenseInfoDash.css";
import { NO_VALUE_DETECTED_LABEL } from "../../constants/data";

const LicenseInfoDash = () => {
  const workbenchDB = useWorkbenchDB();

  const [licenseExpressionData, setLicenseExpressionData] = useState(null);
  const [licenseKeyData, setLicenseKeyData] = useState(null);
  const [licensePolicyData, setLicensePolicyData] = useState(null);
  const [scanData, setScanData] = useState<ScanData>({
    totalLicenses: null,
    totalLicenseFiles: null,
    totalSPDXLicenses: null,
  });

  useEffect(() => {
    const { db, initialized, currentPath } = workbenchDB;

    if (!initialized || !db || !currentPath) return;

    db.sync
      .then((db) =>
        db.FlatFile.findAll({
          where: {
            path: {
              [Op.or]: [
                { [Op.like]: `${currentPath}` }, // Matches a file / directory.
                { [Op.like]: `${currentPath}/%` }, // Matches all its children (if any).
              ],
            },
          },
          attributes: ["fileId", "license_detections"],
        })
      )
      .then((flatFiles) => {
        const fileIDs = flatFiles.map((flatFile) =>
          flatFile.getDataValue("fileId")
        );

        const filesWithDetections = flatFiles
          .map((flatFile) =>
            JSON.parse(
              flatFile.getDataValue("license_detections")?.toString({}) || "[]"
            )
          )
          .filter((detections) => detections.length);
        setScanData((oldScanData) => ({
          ...oldScanData,
          totalLicenseFiles: filesWithDetections.length,
        }));

        // Query and prepare chart for license expression
        db.sync
          .then((db) =>
            db.LicenseExpression.findAll({ where: { fileId: fileIDs } })
          )
          .then((license_expressions) => {
            const expressions = license_expressions.map(
              (expression) =>
                expression.getDataValue("license_expression") ||
                NO_VALUE_DETECTED_LABEL
            );
            // Prepare chart for license expressions
            const { chartData } = formatChartData(expressions, "expressions");
            setLicenseExpressionData(chartData);

            const license_keys: string[] = [];
            const license_keys_spdx: string[] = [];
            license_expressions.forEach((expression) => {
              license_keys.push(
                ...JSON.parse(
                  (expression.getDataValue("license_keys") || "[]").toString({})
                )
              );
              license_keys_spdx.push(
                ...JSON.parse(
                  (expression.getDataValue("license_keys_spdx") || "[]").toString({})
                )
              );
            });

            // Prepare chart for license & spdx keys
            setScanData((oldScanData) => ({
              ...oldScanData,
              totalLicenses: new Set(license_keys).size,
              totalSPDXLicenses: new Set(license_keys_spdx).size,
            }));

            const { chartData: licenseKeysChartData } = formatChartData(
              license_keys,
              "license_keys"
            );
            setLicenseKeyData(licenseKeysChartData);
          });

        // Query and prepare chart for license policy
        db.sync
          .then((db) =>
            db.LicensePolicy.findAll({ where: { fileId: fileIDs } })
          )
          .then((policies) =>
            policies.map(
              (val) => val.getDataValue("label") || NO_VALUE_DETECTED_LABEL
            )
          )
          .then((labels) => {
            // @TODO - Set pie chart color based on the received color_code in policies
            const { chartData } = formatChartData(labels, "policy");
            // console.log("Result License policy formatted", chartData);
            setLicensePolicyData(chartData);
          });
      });
  }, [workbenchDB]);

  return (
    <div className="text-center pieInfoDash">
      <br />
      <h3>License info - {workbenchDB.currentPath || ""}</h3>
      <br />
      <br />
      <Row className="dash-cards">
        <Col sm={4}>
          <Card
            className="info-card"
            data-tooltip-id="total-licenses"
            data-tooltip-content="No. of unique license keys across selected files"
          >
            {scanData.totalLicenses === null ? (
              <EllipticLoader wrapperClass="value" />
            ) : (
              <h4 className="value">{scanData.totalLicenses}</h4>
            )}
            <h5 className="title">Total licenses</h5>
          </Card>
          <Tooltip id="total-licenses" place="bottom" variant="info" />
        </Col>
        <Col sm={4}>
          <Card
            className="info-card"
            data-tooltip-id="total-license-files"
            data-tooltip-content="No. of files having at least a license detection"
          >
            {scanData.totalLicenseFiles === null ? (
              <EllipticLoader wrapperClass="value" />
            ) : (
              <h4 className="value">{scanData.totalLicenseFiles}</h4>
            )}
            <h5 className="title">Total files with licenses</h5>
          </Card>
          <Tooltip id="total-license-files" place="bottom" variant="info" />
        </Col>
        <Col sm={4}>
          <Card
            className="info-card"
            data-tooltip-id="total-spdx-licenses"
            data-tooltip-content="No. of unique SPDX license keys across selected files"
          >
            {scanData.totalSPDXLicenses === null ? (
              <EllipticLoader wrapperClass="value" />
            ) : (
              <h4 className="value">{scanData.totalSPDXLicenses}</h4>
            )}
            <h5 className="title">Total SPDX licenses</h5>
          </Card>
          <Tooltip id="total-spdx-licenses" place="bottom" variant="info" />
        </Col>
      </Row>
      <br />
      <br />
      <Row className="dash-cards">
        <Col sm={6} md={4}>
          <Card className="chart-card">
            <h5 className="title">License expression</h5>
            <PieChart
              chartData={licenseExpressionData}
              noDataText="Use --license CLI option for License expressions"
              noDataLink="https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#license-option"
            />
          </Card>
        </Col>
        <Col sm={6} md={4}>
          <Card className="chart-card">
            <h5 className="title">License keys</h5>
            <PieChart
              chartData={licenseKeyData}
              noDataText="Use --license CLI option for License keys"
              noDataLink="https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#license-option"
            />
          </Card>
        </Col>
        <Col sm={6} md={4}>
          <Card className="chart-card">
            <h5 className="title">License policy</h5>
            <PieChart
              chartData={licensePolicyData}
              noDataText="Use --license-policy CLI option for policy data"
              noDataLink="https://scancode-toolkit.readthedocs.io/plugins/licence_policy_plugin.html#using-the-plugin"
            />
          </Card>
        </Col>
      </Row>
      <br />
      <br />
    </div>
  );
};

export default LicenseInfoDash;
