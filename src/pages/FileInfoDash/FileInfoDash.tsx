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
            path: {
              [Op.or]: [
                { [Op.like]: `${currentPath}`},      // Matches a file / directory.
                { [Op.like]: `${currentPath}/%`}  // Matches all its children (if any).
              ]
            }
          },
          attributes: ['id', 'mime_type', 'programming_language'],
        }))
      })
      .then(files => {
        // Prepare chart for file types
        const fileTypes = files.map(file => file.getDataValue('mime_type') || 'No Value Detected');
        const { chartData: fileTypesChartData } = formatChartData(fileTypes, 'file-types');
        setFileTypesData(fileTypesChartData);

        // Prepare chart for programming languages
        const langs = files.map(file => file.getDataValue('programming_language') || 'No Value Detected')
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
            copyright => copyright.getDataValue('holders') || 'No Value Detected'
          ))
          .then(copyrightHolders => {
            setScanData(oldScanData => ({
              ...oldScanData,
              totalUniqueCopyrightHolders: new Set(copyrightHolders).size
            }));
            
            // Prepare chart for copyright holders
            const { chartData: copyrightHoldersChartData } = formatChartData(copyrightHolders, 'policy');
            console.log("Pie chart data", copyrightHoldersChartData);
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
                <EllipticLoader />
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
                <EllipticLoader />
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
                <EllipticLoader />
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
            <PieChart chartData={progLangsData} />
          </Card>
        </Col>
        <Col sm={6} md={4}>
          <Card className='chart-card'>
            <h5 className='title'>
              File types
            </h5>
            <PieChart chartData={fileTypesData} />
          </Card>
        </Col>
        <Col sm={6} md={4}>
          <Card className='chart-card'>
            <h5 className='title'>
              Copyright holders
            </h5>
            <PieChart chartData={copyrightHoldersData} />
          </Card>
        </Col>
      </Row>
      <br/><br/>
    </div>
  )
}

export default FileInfoDash