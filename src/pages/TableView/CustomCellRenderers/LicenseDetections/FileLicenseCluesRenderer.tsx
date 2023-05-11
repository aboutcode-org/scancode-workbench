import React from "react";
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

  if (!value || value.length === 0) return <></>;

  return (
    <>
      {value.map((clue, idx) => {
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
