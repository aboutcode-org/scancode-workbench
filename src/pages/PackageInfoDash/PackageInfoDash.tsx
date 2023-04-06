import { Op, WhereOptions } from 'sequelize';
import { Row, Col, Card } from 'react-bootstrap';
import React, { useEffect, useState } from 'react'

import { formatChartData } from '../../utils/pie';
import { useWorkbenchDB } from '../../contexts/workbenchContext';
import PieChart from '../../components/PieChart/PieChart';
import EllipticLoader from '../../components/EllipticLoader';

interface ScanData {
  totalPackages: number | null,
}

import "./PackageInfoDash.css";
import { FileAttributes } from '../../services/models/file';
import { NO_VALUE_DETECTED_LABEL } from '../../constants/data';

const PackageInfoDash = () => {

  const workbenchDB = useWorkbenchDB();
  const [packageTypeData, setPackageTypeData] = useState(null);
  const [packageLangData, setPackageLangData] = useState(null);
  const [packageLicenseData, setPackageLicenseData] = useState(null);
  const [scanData, setScanData] = useState<ScanData>({
    totalPackages: null,
  })
  
  useEffect(() => {
    const { db, initialized, currentPath } = workbenchDB;
    
    if(!initialized || !db || !currentPath)
      return;

    const where: WhereOptions<FileAttributes> = {
      path: {
        [Op.or]: [
          { [Op.like]: `${currentPath}`},      // Matches a file / directory.
          { [Op.like]: `${currentPath}/%`}  // Matches all its children (if any).
        ]
      }
    };

    db.sync.then(db => db.File.findAll({
      where,
      // attributes: ['id'],
    }))
      .then((files) =>{
        const fileIDs = files.map(file => file.getDataValue('id'));
        
        // Query and prepare chart for package types
        db.sync
          .then(db => db.PackageData.findAll({where: { fileId: fileIDs }}))
          .then(packageData => {
            // Prepare count of total packages
            // console.log("All packages", packages.map(pkg => pkg.get({ plain: true })));
            setScanData({ totalPackages: packageData.length });
            return packageData;
          })
          .then(packageData => {
            // Prepare chart for package types
            const packageTypes = packageData.map(
              packageEntry => packageEntry.getDataValue('type') || NO_VALUE_DETECTED_LABEL
            );
            const { chartData: packageTypesChartData } = formatChartData(packageTypes, 'package types');
            // console.log("Result packages types:", packageTypesChartData);
            setPackageTypeData(packageTypesChartData);

            // Prepare chart for package languages
            const packageLangs = packageData.map(
              packageEntry => packageEntry.getDataValue('primary_language') || NO_VALUE_DETECTED_LABEL
            );
            const { chartData: packageLangsChartData } = formatChartData(packageLangs, 'package langs');
            // console.log("Result packages languages:", packageLangsChartData);
            setPackageLangData(packageLangsChartData);

            // Prepare chart for package license expression
            const packageLicenseExp = packageData.map(
              packageEntry => packageEntry.getDataValue('declared_license_expression') || NO_VALUE_DETECTED_LABEL
            );
            const { chartData: packageLicenseExpChartData } = 
              formatChartData(packageLicenseExp, 'package license exp');
            
            // console.log("Result packages license exp:", packageLicenseExpChartData);
            setPackageLicenseData(packageLicenseExpChartData);
          });
      });
  }, [workbenchDB]);

  return (
    <div className='text-center pieInfoDash'>
      <br/>
        <h3>
          Package info - { workbenchDB.currentPath || ""}
        </h3>
      <br/><br/>
      <Row className="dash-cards">
        <Col sm={4} >
          <Card className='info-card'>
            {
              scanData.totalPackages === null ?
                <EllipticLoader wrapperClass='value' />
              :
              <h4 className='value'>
                { scanData.totalPackages }
              </h4>
            }
            <h5 className='title'>
              Total Number of packages
            </h5>
          </Card>
        </Col>
      </Row>
      <br/><br/>
      <Row className="dash-cards">
        <Col sm={6} md={4}>
          <Card className='chart-card'>
            <h5 className='title'>
              Package Types
            </h5>
            <PieChart
              chartData={packageTypeData}
              noDataText='Use --package CLI option for package types'
              noDataLink='https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#package-option'
            />
          </Card>
        </Col>
        <Col sm={6} md={4}>
          <Card className='chart-card'>
            <h5 className='title'>
              Package languages
            </h5>
            <PieChart
              chartData={packageLangData}
              noDataText='Use --package CLI option for package languages'
              noDataLink='https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#package-option'
            />
          </Card>
        </Col>
        <Col sm={6} md={4}>
          <Card className='chart-card'>
            <h5 className='title'>
              Package Licenses
            </h5>
            <PieChart
              chartData={packageLicenseData}
              noDataText='Use --package CLI option for package licenses'
              noDataLink='https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#package-option'
            />
          </Card>
        </Col>
      </Row>
      <br/><br/>
    </div>
  )
}

export default PackageInfoDash