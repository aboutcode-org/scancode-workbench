import { QUERY_KEYS } from "../constants/params";
import { ROUTES } from "../constants/routes";

const URL_PREFIX = `/${ROUTES.LICENSES}?${QUERY_KEYS.LICENSE_DETECTION}=`;
export function generateLicenseDetectionUrl(detectionIdentifier: string) {
  return URL_PREFIX + detectionIdentifier;
}

export function generateLicenseClueUrl(
  clueExpression: string,
  clueFilePath: string,
  fileClueIdx: number
) {
  return `/${ROUTES.LICENSES}?${QUERY_KEYS.LICENSE_CLUE_EXPRESSION}=${clueExpression}&${QUERY_KEYS.LICENSE_CLUE_FILE_PATH}=${clueFilePath}&${QUERY_KEYS.LICENSE_CLUE_FILE_CLUE_IDX}=${fileClueIdx}`;
}
