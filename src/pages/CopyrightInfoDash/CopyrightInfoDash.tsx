import { Op } from "sequelize";
import { Row, Col, Card } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import { formatChartData } from "../../utils/pie";
import { useWorkbenchDB } from "../../contexts/dbContext";
import PieChart from "../../components/PieChart/PieChart";
import EllipticLoader from "../../components/EllipticLoader";

interface ScanData {
  totalUniqueHolders: number | null;
  totalUniqueNotices: number | null;
  totalUniqueAuthors: number | null;
}

const CopyrightInfoDash = () => {
  const workbenchDB = useWorkbenchDB();

  const [copyrightHoldersData, setCopyrightHoldersData] = useState(null);
  const [copyrightNoticesData, setCopyrightNoticesData] = useState(null);
  const [copyrightAuthorsData, setCopyrightAuthorsData] = useState(null);
  const [scanData, setScanData] = useState<ScanData>({
    totalUniqueHolders: 0,
    totalUniqueAuthors: 0,
    totalUniqueNotices: 0,
  });

  useEffect(() => {
    const { db, initialized, currentPath } = workbenchDB;

    if (!initialized || !db || !currentPath) return;

    db.sync
      .then((db) =>
        db.File.findAll({
          where: {
            type: {
              [Op.eq]: "file",
            },
            path: {
              [Op.or]: [
                { [Op.like]: `${currentPath}` }, // Matches self
                { [Op.like]: `${currentPath}/%` }, // Matches all its children (if any).
              ],
            },
          },
          attributes: ["id"],
        })
      )
      .then((files) => files.map((file) => file.getDataValue("id")))
      .then((fileIDs) =>
        db.sync.then((db) =>
          db.Copyright.findAll({
            where: { fileId: fileIDs },
            attributes: ["holders", "authors", "statements"],
          })
        )
      )
      .then((copyrights) => {
        // Prepare chart for copyright holders
        const copyrightHolders = copyrights.flatMap((copyright) =>
          JSON.parse(copyright.getDataValue("holders")?.toString({}) || "[]")
        );
        const { chartData: copyrightHoldersChartData } =
          formatChartData(copyrightHolders);
        setCopyrightHoldersData(copyrightHoldersChartData);
        const totalUniqueCopyrightHolders = new Set(copyrightHolders).size;

        // Prepare chart for copyright holders
        const copyrightNotices = copyrights.flatMap((copyright) =>
          JSON.parse(copyright.getDataValue("statements")?.toString({}) || "[]")
        );
        const { chartData: copyrightNoticesChartData } =
          formatChartData(copyrightNotices);
        setCopyrightNoticesData(copyrightNoticesChartData);
        const totalUniqueCopyrightNotices = new Set(copyrightNotices).size;

        // Prepare chart for copyright authors
        const copyrightAuthors = copyrights.flatMap((copyright) =>
          JSON.parse(copyright.getDataValue("authors")?.toString({}) || "[]")
        );
        const { chartData: copyrightAuthorsChartData } =
          formatChartData(copyrightAuthors);
        setCopyrightAuthorsData(copyrightAuthorsChartData);
        const totalUniqueCopyrightAuthors = new Set(copyrightAuthors).size;

        setScanData({
          totalUniqueHolders: totalUniqueCopyrightHolders,
          totalUniqueAuthors: totalUniqueCopyrightAuthors,
          totalUniqueNotices: totalUniqueCopyrightNotices,
        });
        console.log({
          copyrights,
          copyrightHolders,
          copyrightNotices,
          copyrightAuthors,
          copyrightHoldersChartData,
          copyrightNoticesChartData,
          copyrightAuthorsChartData,
          totalUniqueCopyrightHolders,
          totalUniqueCopyrightNotices,
          totalUniqueCopyrightAuthors,
        });
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
            <h5 className="title">Unique holders</h5>
          </Card>
        </Col>
        <Col sm={4}>
          <Card className="info-card">
            {scanData.totalUniqueNotices === null ? (
              <EllipticLoader wrapperClass="value" />
            ) : (
              <h4 className="value">{scanData.totalUniqueNotices}</h4>
            )}
            <h5 className="title">Unique notices</h5>
          </Card>
        </Col>
        <Col sm={4}>
          <Card className="info-card">
            {scanData.totalUniqueAuthors === null ? (
              <EllipticLoader wrapperClass="value" />
            ) : (
              <h4 className="value">{scanData.totalUniqueAuthors}</h4>
            )}
            <h5 className="title">Unique authors</h5>
          </Card>
        </Col>
      </Row>
      <br />
      <br />
      <Row className="dash-cards">
        <Col sm={6} md={4}>
          <Card className="chart-card">
            <h5 className="title">Copyright Holders</h5>
            <PieChart
              hideLegend
              chartData={copyrightHoldersData}
              noDataText="Use --copyright CLI option for copyright data"
              noDataLink="https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#copyright-option"
            />
          </Card>
        </Col>
        <Col sm={6} md={4}>
          <Card className="chart-card">
            <h5 className="title">Copyright Notices</h5>
            <PieChart
              hideLegend
              chartData={copyrightNoticesData}
              noDataText="Use --copyright CLI option for copyright data"
              noDataLink="https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#copyright-option"
            />
          </Card>
        </Col>
        <Col sm={6} md={4}>
          <Card className="chart-card">
            <h5 className="title">Copyright Authors</h5>
            <PieChart
              hideLegend
              chartData={copyrightAuthorsData}
              noDataText="Use --copyright CLI option for copyright data"
              noDataLink="https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#copyright-option"
            />
          </Card>
        </Col>
      </Row>
      <br />
      <br />
    </div>
  );
};

export default CopyrightInfoDash;
