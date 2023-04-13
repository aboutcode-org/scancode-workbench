export interface LicenseDetectionDetails {
  identifier: string,
  license_expression: string,
  detection_count: number,
  detection_log: any,
  matches: any[],
  file_regions: any[]
}