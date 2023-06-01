import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { QUERY_KEYS } from "../../../../constants/params";
import { ROUTES } from "../../../../constants/routes";
import { LicenseDetectionDetails } from "../../../Licenses/licenseDefinitions";

interface FileLicenseDetectionsRendererProps {
  value: LicenseDetectionDetails[];
}

const URL_PREFIX = `/${ROUTES.LICENSES}?${QUERY_KEYS.LICENSE_DETECTION}=`;
function generateUrl(detectionIdentifier: string) {
  return URL_PREFIX + detectionIdentifier;
}

const FileLicenseDetectionsRenderer = (
  props: FileLicenseDetectionsRendererProps
) => {
  const { value } = props;

  const parsedValue: LicenseDetectionDetails[] = useMemo(() => {
    if(Array.isArray(value))
      return value;

    try {
      const parsed = JSON.parse(value)
      return parsed
    } catch(err) {
      console.log("Err parsing list cell, showing value as it is:", value);
      return value
    }
  }, [value]);

  if(!parsedValue)
    return <></>;
  
  if(!Array.isArray(parsedValue))
    return value;

  return (
    <>
      {parsedValue.map((detection, idx) => {
        return (
          <React.Fragment key={detection.license_expression + idx}>
            <Link to={generateUrl(detection.identifier)}>
              {detection.license_expression}
            </Link>
            <br />
          </React.Fragment>
        );
      })}
    </>
  );
};

export default FileLicenseDetectionsRenderer;
