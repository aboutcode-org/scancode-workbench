import { Op } from "sequelize";
import { Row, Col, Card } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import { FormattedEntry, formatPieChartData } from "../../utils/pie";
import { useWorkbenchDB } from "../../contexts/dbContext";
import PieChart from "../../components/PieChart/PieChart";
import EllipticLoader from "../../components/EllipticLoader";

interface ScanData {
  totalFiles: number | null;
  totalDirectories: number | null;
}
import { NO_VALUE_DETECTED_LABEL } from "../../constants/data";

import "./FileInfoDash.css";

const FileInfoDash = () => {
  const { db, initialized, currentPath } = useWorkbenchDB();

  const [progLangsData, setProgLangsData] = useState<FormattedEntry[] | null>(
    null
  );
  const [mimeTypesData, setMimeTypesData] = useState<FormattedEntry[] | null>(
    null
  );
  const [fileTypesData, setFileTypesData] = useState<FormattedEntry[] | null>(
    null
  );
  const [scanData, setScanData] = useState<ScanData>({
    totalFiles: null,
    totalDirectories: null,
  });

  useEffect(() => {
    if (!initialized || !db || !currentPath) return;

    db.sync
      .then((db) => db.File.findOne({ where: { path: currentPath } }))
      .then((root) => {
        const filesCount =
          root.getDataValue("type").toString({}) === "directory"
            ? root.getDataValue("files_count") || 0
            : 1;
        const dirsCount =
          root.getDataValue("type").toString({}) === "directory"
            ? root.getDataValue("dirs_count") || 0
            : 0;

        setScanData({
          totalFiles: Number(filesCount),
          totalDirectories: Number(dirsCount),
        });
        return db.sync;
      })
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
          attributes: ["id", "file_type", "mime_type", "programming_language"],
        })
      )
      .then((files) => {
        // Prepare chart for programming languages
        const langs = files.map(
          (file) =>
            file.getDataValue("programming_language") || NO_VALUE_DETECTED_LABEL
        );
        const { chartData: langsChartData } = formatPieChartData(langs);
        setProgLangsData(langsChartData);

        // Prepare chart for file types
        const fileTypes = files.map(
          (file) => file.getDataValue("file_type") || NO_VALUE_DETECTED_LABEL
        );
        const { chartData: fileTypesChartData } = formatPieChartData(fileTypes);
        setFileTypesData(fileTypesChartData);

        // Prepare chart for mime types
        const fileMimeTypes = files.map(
          (file) => file.getDataValue("mime_type") || NO_VALUE_DETECTED_LABEL
        );
        const { chartData: mimeTypesChartData } =
          formatPieChartData(fileMimeTypes);
        setMimeTypesData(mimeTypesChartData);
      });
  }, [db, initialized, currentPath]);

  return (
    <div className="text-center pieInfoDash">
      <h4>File info - {currentPath || ""}</h4>
      <br />
      <br />
      <Row className="dash-cards">
        <Col sm={4}>
          <Card className="counter-card">
            {scanData.totalFiles === null ? (
              <EllipticLoader wrapperClass="value" />
            ) : (
              <h4 className="value">{scanData.totalFiles}</h4>
            )}
            <h5 className="title">Total Number of Files</h5>
          </Card>
        </Col>
        <Col sm={4}>
          <Card className="counter-card">
            {scanData.totalDirectories === null ? (
              <EllipticLoader wrapperClass="value" />
            ) : (
              <h4 className="value">{scanData.totalDirectories}</h4>
            )}
            <h5 className="title">Total Number of Directories</h5>
          </Card>
        </Col>
      </Row>
      <br />
      <br />
      <Row className="dash-cards">
        <Col sm={6} md={4}>
          <Card className="chart-card">
            <h5 className="title">Programming languages</h5>
            <PieChart
              chartData={progLangsData}
              notOptedText="Use --info CLI option for programming languages"
              notOptedLink="https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#info-option"
            />
          </Card>
        </Col>
        <Col sm={6} md={4}>
          <Card className="chart-card">
            <h5 className="title">File types</h5>
            <PieChart
              chartData={fileTypesData}
              notOptedText="Use --info CLI option for file types"
              notOptedLink="https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#info-option"
            />
          </Card>
        </Col>
        <Col sm={6} md={4}>
          <Card className="chart-card">
            <h5 className="title">Mime types</h5>
            <PieChart
              chartData={mimeTypesData}
              notOptedText="Use --info CLI option for mime types"
              notOptedLink="https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#info-option"
            />
          </Card>
        </Col>
      </Row>
      <br />
    </div>
  );
};

export default FileInfoDash;
