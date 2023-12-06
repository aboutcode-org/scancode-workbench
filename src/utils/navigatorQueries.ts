import { QUERY_KEYS } from "../constants/params";
import { ROUTES } from "../constants/routes";

const licenseDetectionNavigationUrlPrefix = `/${ROUTES.LICENSES}?${QUERY_KEYS.LICENSE_DETECTION}=`;
export function generateLicenseDetectionNavigationUrl(
  licenseDetectionIdentifier: string
) {
  return licenseDetectionNavigationUrlPrefix + licenseDetectionIdentifier;
}

export function generateLicenseClueNavigationUrl(
  clueExpression: string,
  clueFilePath: string,
  fileClueIdx: number
) {
  return `/${ROUTES.LICENSES}?${QUERY_KEYS.LICENSE_CLUE_EXPRESSION}=${clueExpression}&${QUERY_KEYS.LICENSE_CLUE_FILE_PATH}=${clueFilePath}&${QUERY_KEYS.LICENSE_CLUE_FILE_CLUE_IDX}=${fileClueIdx}`;
}

export const packageNavigationUrlPrefix = `/${ROUTES.PACKAGES}?${QUERY_KEYS.PACKAGE}=`;

export function generatePackageNavigationUrl(packageIdentifier: string) {
  return packageNavigationUrlPrefix + packageIdentifier;
}
