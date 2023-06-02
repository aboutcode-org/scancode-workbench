import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { QUERY_KEYS } from "../../../../constants/params";
import { ROUTES } from "../../../../constants/routes";
import { LicenseClueDetails } from "../../../Licenses/licenseDefinitions";

interface FileLicenseCluesRendererProps {
  value: LicenseClueDetails[];
}

function generateUrl(
  clueExpression: string,
  clueFilePath: string,
  fileClueIdx: number
) {
  return `/${ROUTES.LICENSES}?${QUERY_KEYS.LICENSE_CLUE_EXPRESSION}=${clueExpression}&${QUERY_KEYS.LICENSE_CLUE_FILE_PATH}=${clueFilePath}&${QUERY_KEYS.LICENSE_CLUE_FILE_CLUE_IDX}=${fileClueIdx}`;
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
              to={generateUrl(
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