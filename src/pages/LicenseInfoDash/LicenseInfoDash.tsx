import { Op } from 'sequelize';
import { Row, Col } from 'react-bootstrap';
import React, { useEffect, useState } from 'react'

import { formatChartData } from '../../utils/pie';
import { useWorkbenchDB } from '../../contexts/workbenchContext';
import PieChart from '../../components/PieChart/PieChart';
import EllipticLoader from '../../components/EllipticLoader';

interface ScanData {
  totalLicenses: number | null,
  totalLicenseFiles: number | null,
  totalSPDXLicenses: number | null,
}

import "./licenseInfoDash.css";

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
    
    if(!initialized || !db || !currentPath)
      return;

    db.sync.then(db => db.File.findAll({
      where: {
        path: {
          [Op.or]: [
            { [Op.like]: `${currentPath}`},      // Matches a file / directory.
            { [Op.like]: `${currentPath}/%`}  // Matches all its children (if any).
          ]
        }
      },
      // attributes: ['id'],
    }))
      .then((files) =>{
        const fileIDs = files.map(file => file.getDataValue('id'));
        // console.log("FileIDs to work on: ", fileIDs);

        // Query and prepare chart for license expression
        db.sync
          .then(db => db.LicenseExpression.findAll({where: { fileId: fileIDs }}))
          .then((expressions) => expressions.map(
            expression => expression.getDataValue('license_expression') || 'No Value Detected'
          ))
          .then((expressions) => {
            // Prepare chart for license expressions
            const { chartData } = formatChartData(expressions, 'expressions');
            // console.log("Result expressions:", chartData);
            setLicenseExpressionData(chartData);
          });

        // Query and prepare chart for license keys
        db.sync
          .then((db) => db.License.findAll({where: { fileId: fileIDs }}))
          .then(licenses => {

            // Prepare aggregate data
            const licenseFileIDs = licenses.map((val) => val.getDataValue('fileId'));
            const spdxKeys = licenses.map((val) => val.getDataValue('spdx_license_key'));
            
            // console.log('All licenses', licenses);
            // console.log("LicensefileIds", licenseFileIDs);

            setScanData(oldScanData => ({
              ...oldScanData,
              totalLicenseFiles: (new Set(licenseFileIDs)).size,
              totalSPDXLicenses: (new Set(spdxKeys)).size,
            }));

            return licenses;
          })
          .then((licenses) => licenses.map(val => val.getDataValue('key') || 'No Value Detected'))
          .then(keys => {
            // Prepare chart for license keys
            const { chartData, untrimmedLength } = formatChartData(keys, 'keys');
            // console.log("License keys:", chartData);
            // console.log("licensekeys untrimmed length: ", untrimmedLength);

            // Prepare aggregate data
            setScanData(oldScanData => ({...oldScanData, totalLicenses: untrimmedLength}));
            setLicenseKeyData(chartData);
          })
          
        // Query and prepare chart for license policy
        db.sync
          .then((db) => db.LicensePolicy.findAll({where: { fileId: fileIDs }}))
          .then((licenses) => licenses.map(val => val.getDataValue('label') || 'No Value Detected'))
          .then(labels => {
            const { chartData } = formatChartData(labels, 'policy');
            // console.log("Result License policy formatted", chartData);
            setLicensePolicyData(chartData);
          })
      });
  }, [workbenchDB]);

  return (
    <div className='text-center'>
      <br/>
        <h3>
          License info - { workbenchDB.currentPath || ""}
        </h3>
      <br/><br/>
      <Row className="dash-cards">
        <Col sm={4}>
          <div className='card info-card'>
            {
              scanData.totalLicenses === null ?
                <EllipticLoader />
              :
              <h4 className='value'>
                { scanData.totalLicenses }
              </h4>
            }
            <h5 className='title'>
              Total licenses
            </h5>
          </div>
        </Col>
        <Col sm={4}>
          <div className='card info-card'>
            {
              scanData.totalLicenseFiles === null ?
                <EllipticLoader />
              :
              <h4 className='value'>
                { scanData.totalLicenseFiles }
              </h4>
            }
            <h5 className='title'>
              Total files with licenses
            </h5>
          </div>
        </Col>
        <Col sm={4} >
          <div className='card info-card'>
            {
              scanData.totalSPDXLicenses === null ?
                <EllipticLoader />
              :
              <h4 className='value'>
                { scanData.totalSPDXLicenses }
              </h4>
            }
            <h5 className='title'>
              Total SPDX licenses
            </h5>
          </div>
        </Col>
      </Row>
      <br/><br/>
      <Row className="dash-cards">
        <Col sm={6} md={4}>
          <div className='card chart-card'>
            <h5 className='title'>
              License expression
            </h5>
            <PieChart chartData={licenseExpressionData} />
          </div>
        </Col>
        <Col sm={6} md={4}>
          <div className='card chart-card'>
            <h5 className='title'>
              License keys
            </h5>
            <PieChart chartData={licenseKeyData} />
          </div>
        </Col>
        <Col sm={6} md={4}>
          <div className='card chart-card'>
            <h5 className='title'>
              License policy
            </h5>
            <PieChart chartData={licensePolicyData} />
          </div>
        </Col>
      </Row>
      <br/><br/>
    </div>
  )
}

export default LicenseInfoDash