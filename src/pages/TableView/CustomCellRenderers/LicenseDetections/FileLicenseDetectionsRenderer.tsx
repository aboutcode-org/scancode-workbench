import React from 'react'
import { Link } from 'react-router-dom';
import { QUERY_KEYS } from '../../../../constants/params';
import { ROUTES } from '../../../../constants/routes';
import { LicenseDetectionDetails } from '../../../LicenseDetections/licenseDefinitions';

interface FileLicenseDetectionsRendererProps {
  data: any[],
  value: LicenseDetectionDetails[],
}

const URL_PREFIX = `/${ROUTES.LICENSE_DETECTIONS}?${QUERY_KEYS.LICENSE_DETECTION}=`;

const FileLicenseDetectionsRenderer = (props: FileLicenseDetectionsRendererProps) => {
  const { value } = props;

  
  if(!(value || value.length))
    return <></>;

  return (
    <>
      {
        value.map((detection, idx) => {
          return (
            <React.Fragment key={detection.license_expression+idx}>
              <Link to={URL_PREFIX + detection.identifier}>
                { detection.license_expression }
              </Link>
              <br/>
            </React.Fragment>
          )
        })
      }
    </>
  )
}

export default FileLicenseDetectionsRenderer;