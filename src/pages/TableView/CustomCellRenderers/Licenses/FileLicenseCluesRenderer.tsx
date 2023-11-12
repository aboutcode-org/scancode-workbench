import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { LicenseClueDetails } from "../../../Licenses/licenseDefinitions";
import { generateLicenseClueUrl } from "../../../../utils/navigatorQueries";

interface FileLicenseCluesRendererProps {
  value: LicenseClueDetails[];
}

const FileLicenseCluesRenderer = (props: FileLicenseCluesRendererProps) => {
  const { value } = props;

  const parsedValue: LicenseClueDetails[] = useMemo(() => {
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
      {parsedValue.map((clue, idx) => {
        return (
          <React.Fragment key={clue.license_expression + idx}>
            <Link
              to={generateLicenseClueUrl(
                clue.license_expression,
                clue.filePath,
                clue.fileClueIdx
              )}
            >
              {clue.license_expression}
            </Link>
            <br />
          </React.Fragment>
        );
      })}
    </>
  );
};

export default FileLicenseCluesRenderer;