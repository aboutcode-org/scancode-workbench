import React from "react";
import { Link } from "react-router-dom";
import { QUERY_KEYS } from "../../../../constants/params";
import { ROUTES } from "../../../../constants/routes";
import { LicenseDetectionDetails } from "../../../Licenses/licenseDefinitions";

interface FileLicenseDetectionsRendererProps {
  value: LicenseDetectionDetails[];
}

const URL_PREFIX = `/${ROUTES.LICENSES}?${QUERY_KEYS.LICENSE_DETECTION}=`;
function generateUrl(detectionIdentifier: string){
  return URL_PREFIX+detectionIdentifier;
}

const FileLicenseDetectionsRenderer = (
  props: FileLicenseDetectionsRendererProps
) => {
  const { value } = props;

  if (!(value || value.length)) return <></>;

  return (
    <>
      {value.map((detection, idx) => {
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
