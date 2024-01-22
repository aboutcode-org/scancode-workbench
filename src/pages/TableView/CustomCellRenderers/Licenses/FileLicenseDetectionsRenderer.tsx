import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { generateLicenseDetectionNavigationUrl } from "../../../../utils/navigatorQueries";
import { LicenseDetectionAttributes } from "../../../../services/models/licenseDetections";

interface FileLicenseDetectionsRendererProps {
  value: LicenseDetectionAttributes[];
}

const FileLicenseDetectionsRenderer: React.FunctionComponent<
  FileLicenseDetectionsRendererProps
> = (props) => {
  const { value } = props;

  const parsedValue: LicenseDetectionAttributes[] = useMemo(() => {
    if (Array.isArray(value)) return value;

    try {
      const parsed = JSON.parse(value);
      return parsed;
    } catch (err) {
      console.log("Err parsing list cell, showing value as it is:", value);
      return value;
    }
  }, [value]);

  if (!parsedValue) return <></>;

  if (!Array.isArray(parsedValue)) return <>{value}</>;

  return (
    <>
      {parsedValue.map((detection, idx) => {
        return (
          <React.Fragment key={detection.license_expression + idx}>
            <Link
              to={generateLicenseDetectionNavigationUrl(detection.identifier)}
            >
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
