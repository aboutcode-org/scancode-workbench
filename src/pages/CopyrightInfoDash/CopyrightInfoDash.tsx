import { Op } from "sequelize";
import { Row, Col, Card } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import { FormattedEntry, formatPieChartData } from "../../utils/pie";
import { useWorkbenchDB } from "../../contexts/dbContext";
import PieChart from "../../components/PieChart/PieChart";
import EllipticLoader from "../../components/EllipticLoader";
import { ScanOptionKeys } from "../../utils/parsers";

interface ScanData {
  totalUniqueHolders: number | null;
  totalUniqueNotices: number | null;
  totalUniqueAuthors: number | null;
}

const CopyrightInfoDash = () => {
  const { db, initialized, currentPath, scanInfo } = useWorkbenchDB();

  const [copyrightHoldersData, setCopyrightHoldersData] = useState<
    FormattedEntry[] | null
  >(null);
  const [copyrightNoticesData, setCopyrightNoticesData] = useState<
    FormattedEntry[] | null
  >(null);
  const [copyrightAuthorsData, setCopyrightAuthorsData] = useState<
    FormattedEntry[] | null
  >(null);
  const [scanData, setScanData] = useState<ScanData>({
    totalUniqueHolders: 0,
    totalUniqueAuthors: 0,
    totalUniqueNotices: 0,
  });

  useEffect(() => {
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
      .then((rawCopyrights) =>
        rawCopyrights.map((copyright) => copyright.toJSON())
      )
      .then((copyrights) => {
        // Prepare chart for copyright holders
        const copyrightHolders = copyrights.flatMap(
          (copyright) => copyright.holders || []
        );
        const { chartData: copyrightHoldersChartData } =
          formatPieChartData(copyrightHolders);
        setCopyrightHoldersData(copyrightHoldersChartData);
        const totalUniqueCopyrightHolders = new Set(copyrightHolders).size;

        // Prepare chart for copyright holders
        const copyrightNotices = copyrights.flatMap(
          (copyright) => copyright.statements || []
        );
        const { chartData: copyrightNoticesChartData } =
          formatPieChartData(copyrightNotices);
        setCopyrightNoticesData(copyrightNoticesChartData);
        const totalUniqueCopyrightNotices = new Set(copyrightNotices).size;

        // Prepare chart for copyright authors
        const copyrightAuthors = copyrights.flatMap(
          (copyright) => copyright.authors || []
        );
        const { chartData: copyrightAuthorsChartData } =
          formatPieChartData(copyrightAuthors);
        setCopyrightAuthorsData(copyrightAuthorsChartData);
        const totalUniqueCopyrightAuthors = new Set(copyrightAuthors).size;

        setScanData({
          totalUniqueHolders: totalUniqueCopyrightHolders,
          totalUniqueAuthors: totalUniqueCopyrightAuthors,
          totalUniqueNotices: totalUniqueCopyrightNotices,
        });
        // console.log({
        //   copyrights,
        //   copyrightHolders,
        //   copyrightNotices,
        //   copyrightAuthors,
        //   copyrightHoldersChartData,
        //   copyrightNoticesChartData,
        //   copyrightAuthorsChartData,
        //   totalUniqueCopyrightHolders,
        //   totalUniqueCopyrightNotices,
        //   totalUniqueCopyrightAuthors,
        // });
      });
  }, [db, initialized, currentPath]);

  return (
    <div className="pieInfoDash">
      <h4 className="text-center">Copyright info - {currentPath || ""}</h4>
      <br />
      <br />
      <Row className="dash-cards">
        <Col sm={4}>
          <Card className="counter-card">
            {scanData.totalUniqueHolders === null ? (
              <EllipticLoader wrapperClass="value" />
            ) : (
              <h4 className="value">{scanData.totalUniqueHolders}</h4>
            )}
            <h5 className="title">Unique holders</h5>
          </Card>
        </Col>
        <Col sm={4}>
          <Card className="counter-card">
            {scanData.totalUniqueNotices === null ? (
              <EllipticLoader wrapperClass="value" />
            ) : (
              <h4 className="value">{scanData.totalUniqueNotices}</h4>
            )}
            <h5 className="title">Unique notices</h5>
          </Card>
        </Col>
        <Col sm={4}>
          <Card className="counter-card">
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
            <br />
            <PieChart
              hideLegend
              chartData={copyrightHoldersData}
              notOpted={!scanInfo.optionsMap.get(ScanOptionKeys.COPYRIGHT)}
              notOptedText="Use --copyright CLI option for copyright data"
              notOptedLink="https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#copyright-option"
            />
          </Card>
        </Col>
        <Col sm={6} md={4}>
          <Card className="chart-card">
            <h5 className="title">Copyright Notices</h5>
            <br />
            <PieChart
              hideLegend
              chartData={copyrightNoticesData}
              notOpted={!scanInfo.optionsMap.get(ScanOptionKeys.COPYRIGHT)}
              notOptedText="Use --copyright CLI option for copyright data"
              notOptedLink="https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#copyright-option"
            />
          </Card>
        </Col>
        <Col sm={6} md={4}>
          <Card className="chart-card">
            <h5 className="title">Copyright Authors</h5>
            <PieChart
              hideLegend
              chartData={copyrightAuthorsData}
              notOpted={!scanInfo.optionsMap.get(ScanOptionKeys.COPYRIGHT)}
              notOptedText="Use --copyright CLI option for copyright data"
              notOptedLink="https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#copyright-option"
            />
          </Card>
        </Col>
      </Row>
      <br />
    </div>
  );
};

export default CopyrightInfoDash;
