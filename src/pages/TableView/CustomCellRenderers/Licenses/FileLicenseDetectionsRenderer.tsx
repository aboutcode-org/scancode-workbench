import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { LicenseDetectionDetails } from "../../../Licenses/licenseDefinitions";
import { generateLicenseDetectionUrl } from "../../../../utils/navigatorQueries";

interface FileLicenseDetectionsRendererProps {
  value: LicenseDetectionDetails[];
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
            <Link to={generateLicenseDetectionUrl(detection.identifier)}>
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