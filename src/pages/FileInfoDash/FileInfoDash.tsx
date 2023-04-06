import { Op } from 'sequelize';
import { Row, Col, Card } from 'react-bootstrap';
import React, { useEffect, useState } from 'react'

import { formatChartData } from '../../utils/pie';
import { useWorkbenchDB } from '../../contexts/workbenchContext';
import PieChart from '../../components/PieChart/PieChart';
import EllipticLoader from '../../components/EllipticLoader';

interface ScanData {
  totalFiles: number | null,
  totalDirectories: number | null,
  totalUniqueCopyrightHolders: number | null,
}

import "./FileInfoDash.css";
import { NO_VALUE_DETECTED_LABEL } from '../../constants/data';

const FileInfoDash = () => {

  const workbenchDB = useWorkbenchDB();

  const [progLangsData, setProgLangsData] = useState(null);
  const [fileTypesData, setFileTypesData] = useState(null);
  const [copyrightHoldersData, setCopyrightHoldersData] = useState(null);
  const [scanData, setScanData] = useState<ScanData>({
    totalFiles: null,
    totalDirectories: null,
    totalUniqueCopyrightHolders: null,
  })
  
  useEffect(() => {
    const { db, initialized, currentPath } = workbenchDB;
    
    if(!initialized || !db || !currentPath)
      return;

    db.sync
      .then(db => db.File.findOne({ where: { path: currentPath }}))
      .then(root => {
        const filesCount =
          root.getDataValue('type').toString({}) === 'directory' ? root.getDataValue('files_count') || 0 : 1;
        const dirsCount =
          root.getDataValue('type').toString({}) === 'directory' ? root.getDataValue('dirs_count') || 0 : 0;
        
        setScanData(oldScanData => ({
          ...oldScanData,
          totalFiles: Number(filesCount),
          totalDirectories: Number(dirsCount),
        }));

        return db.sync.then(db => db.File.findAll({
          where: {
            type: {
              [Op.eq]: 'file'
            },
            path: {
              [Op.or]: [
                { [Op.like]: `${currentPath}` },     // Matches self
                { [Op.like]: `${currentPath}/%`}  // Matches all its children (if any).
              ]
            }
          },
          attributes: ['id', 'mime_type', 'programming_language'],
        }))
      })
      .then(files => {
        // Prepare chart for file types
        const fileMimeTypes = files.map(file => file.getDataValue('mime_type') || NO_VALUE_DETECTED_LABEL)
        const { chartData: fileTypesChartData } = formatChartData(fileMimeTypes, 'file-types');
        setFileTypesData(fileTypesChartData);

        // Prepare chart for programming languages
        const langs = files.map(file => file.getDataValue('programming_language') || NO_VALUE_DETECTED_LABEL)
        const { chartData: langsChartData } = formatChartData(langs, 'programming-langs');
        setProgLangsData(langsChartData);

        return files;
      })
      .then((files) =>{
        const fileIDs = files.map(file => file.getDataValue('id'));

        // Query data for copyright holders chart
        db.sync
          .then((db) => db.Copyright.findAll({where: { fileId: fileIDs }}))
          .then(copyrights => copyrights.map(
            copyright => copyright.getDataValue('holders') || NO_VALUE_DETECTED_LABEL
          ))
          .then(copyrightHolders => {
            setScanData(oldScanData => ({
              ...oldScanData,
              totalUniqueCopyrightHolders: new Set(copyrightHolders).size
            }));
            
            // Prepare chart for copyright holders
            const { chartData: copyrightHoldersChartData } = formatChartData(copyrightHolders, 'policy');
            setCopyrightHoldersData(copyrightHoldersChartData);
          });
      });
  }, [workbenchDB]);

  return (
    <div className='text-center pieInfoDash'>
      <br/>
        <h3>
          File info - { workbenchDB.currentPath || ""}
        </h3>
      <br/><br/>
      <Row className="dash-cards">
        <Col sm={4}>
          <Card className='info-card'>
            {
              scanData.totalFiles === null ?
                <EllipticLoader wrapperClass='value' />
              :
              <h4 className='value'>
                { scanData.totalFiles }
              </h4>
            }
            <h5 className='title'>
              Total Number of Files
            </h5>
          </Card>
        </Col>
        <Col sm={4}>
          <Card className='info-card'>
            {
              scanData.totalDirectories === null ?
                <EllipticLoader wrapperClass='value' />
              :
              <h4 className='value'>
                { scanData.totalDirectories }
              </h4>
            }
            <h5 className='title'>
              Total Number of Directories
            </h5>
          </Card>
        </Col>
        <Col sm={6} md={4}>
          <Card className='info-card'>
            {
              scanData.totalUniqueCopyrightHolders === null ?
                <EllipticLoader wrapperClass='value' />
              :
              <h4 className='value'>
                { scanData.totalUniqueCopyrightHolders }
              </h4>
            }
            <h5 className='title'>
              Unique Copyright Holders Detected
            </h5>
          </Card>
        </Col>
      </Row>
      <br/><br/>
      <Row className="dash-cards">
        <Col sm={6} md={4}>
          <Card className='chart-card'>
            <h5 className='title'>
              Programming languages
            </h5>
            <PieChart
              chartData={progLangsData}
              noDataText='Use --info CLI option for programming languages'
              noDataLink='https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#info-option'
            />
          </Card>
        </Col>
        <Col sm={6} md={4}>
          <Card className='chart-card'>
            <h5 className='title'>
              File types
            </h5>
            <PieChart
              chartData={fileTypesData}
              noDataText='Use --info CLI option for file types'
              noDataLink='https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#info-option'
            />
          </Card>
        </Col>
        <Col sm={6} md={4}>
          <Card className='chart-card'>
            <h5 className='title'>
              Copyright holders
            </h5>
            <PieChart
              chartData={copyrightHoldersData}
              noDataText='Use --copyright CLI option for copyright data'
              noDataLink='https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#copyright-option'
            />
          </Card>
        </Col>
      </Row>
      <br/><br/>
    </div>
  )
}

export default FileInfoDash